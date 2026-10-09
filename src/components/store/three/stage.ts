import * as THREE from "three";
import { SIDE_ANGLE, type JerseySide } from "@/data/store3d";
import { createJerseyModel } from "./models";
import { createJerseyTexture, createShadowTexture, redrawJerseyTexture, type JerseyPrint } from "./textures";

// Escena del visor: cámara, luces, sombra y el giro con el mouse o el dedo.
// No usa controles externos: arrastrar en horizontal gira la camiseta y al soltar sigue con algo de inercia.

export type Stage = {
  setPrint: (print: JerseyPrint) => void;
  showSide: (side: JerseySide) => void;
  rotateBy: (radians: number) => void;
  dispose: () => void;
};

type Options = {
  print: JerseyPrint;
  side: JerseySide;
  reducedMotion: boolean;
  onSideChange: (side: JerseySide) => void;
};

const TAU = Math.PI * 2;

export function createStage(canvas: HTMLCanvasElement, opts: Options): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.05, 4.6);
  camera.lookAt(0, -0.02, 0);

  scene.add(new THREE.HemisphereLight("#dbe7ff", "#1a2233", 1.1));
  const key = new THREE.DirectionalLight("#ffffff", 2.4);
  key.position.set(2.5, 3, 4);
  const rim = new THREE.DirectionalLight("#F29A2E", 1.6);
  rim.position.set(-3, 1.5, -3);
  const fill = new THREE.DirectionalLight("#9fb6ff", 0.8);
  fill.position.set(-3, -1, 3);
  scene.add(key, rim, fill);

  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  const frontMap = createJerseyTexture("front", opts.print, anisotropy);
  const backMap = createJerseyTexture("back", opts.print, anisotropy);
  const model = createJerseyModel(frontMap, backMap);
  scene.add(model.group);

  const shadowMap = createShadowTexture();
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 0.5),
    new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.98;
  scene.add(shadow);

  // Estado del giro
  let angle = SIDE_ANGLE[opts.side];
  let target = angle;
  let velocity = 0;
  let tilt = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let idleSince = performance.now();
  let visibleSide: JerseySide = opts.side;

  const facing = (a: number): JerseySide => (Math.cos(a) >= 0 ? "front" : "back");

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // Solo anima mientras se ve en pantalla.
  let onScreen = true;
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) loop();
  });
  io.observe(canvas);

  let frame = 0;
  let last = performance.now();
  const loop = () => {
    cancelAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    frame = requestAnimationFrame(loop);
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!dragging) {
      if (Math.abs(velocity) > 0.0005) {
        target += velocity;
        velocity *= Math.pow(0.04, dt);
      } else velocity = 0;
      tilt += (0 - tilt) * Math.min(1, dt * 4);
    }
    const ease = opts.reducedMotion ? 1 : Math.min(1, dt * 7);
    angle += (target - angle) * ease;

    // Balanceo suave cuando nadie la toca.
    const idle = !dragging && !opts.reducedMotion && now - idleSince > 2500;
    const sway = idle ? Math.sin((now - idleSince) / 1400) * 0.18 : 0;
    model.group.rotation.y = angle + sway;
    model.group.rotation.x = tilt;
    model.group.position.y = opts.reducedMotion ? 0 : Math.sin(now / 1600) * 0.015;

    const side = facing(angle);
    if (side !== visibleSide) {
      visibleSide = side;
      opts.onSideChange(side);
    }
    renderer.render(scene, camera);
  };
  const onVisibility = () => {
    last = performance.now();
    loop();
  };
  document.addEventListener("visibilitychange", onVisibility);
  loop();

  // Arrastre
  const onDown = (e: PointerEvent) => {
    dragging = true;
    velocity = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    angle = model.group.rotation.y;
    target = angle;
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    const delta = (dx / Math.max(1, canvas.clientWidth)) * TAU * 0.9;
    target += delta;
    angle = target;
    velocity = delta;
    tilt = Math.max(-0.35, Math.min(0.35, tilt + (dy / Math.max(1, canvas.clientHeight)) * 1.5));
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    idleSince = performance.now();
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  return {
    setPrint: (print) => {
      redrawJerseyTexture(frontMap, "front", print);
      redrawJerseyTexture(backMap, "back", print);
    },
    showSide: (side) => {
      // Gira por el camino más corto hasta el lado pedido.
      velocity = 0;
      const base = SIDE_ANGLE[side];
      const turns = Math.round((target - base) / TAU);
      target = base + turns * TAU;
      if (Math.abs(target - angle) < 0.01 && facing(angle) !== side) target += Math.PI;
      idleSince = performance.now();
    },
    rotateBy: (radians) => {
      velocity = 0;
      target += radians;
      idleSince = performance.now();
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      model.dispose();
      frontMap.dispose();
      backMap.dispose();
      shadowMap.dispose();
      shadow.geometry.dispose();
      shadow.material.dispose();
      renderer.dispose();
    },
  };
}
