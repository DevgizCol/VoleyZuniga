// Escenario 3D de la tienda: cámara, luces de estudio y giro con el dedo o el mouse.
// Solo se carga en el navegador (three.js no se usa en el servidor).
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type Stage = {
  /** Reemplaza el producto en escena (libera el anterior). */
  setModel(model: THREE.Object3D): void;
  /** Escala objetivo del producto (para mostrar las tallas), con transición suave. */
  setScale(scale: number): void;
  /** Gira el producto hasta mostrar el frente (0) o la espalda (Math.PI). */
  faceTo(angle: number): void;
  /** Gira el producto un ángulo relativo (botones y flechas del teclado). */
  turn(delta: number): void;
  setAutoRotate(on: boolean): void;
  /** Vuelve a la vista inicial de la cámara. */
  reset(): void;
  readonly renderer: THREE.WebGLRenderer;
  dispose(): void;
};

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const mesh = o as THREE.Mesh;
    mesh.geometry?.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const m of mats) {
      for (const value of Object.values(m)) if (value instanceof THREE.Texture) value.dispose();
      m.dispose();
    }
  });
}

// Sombra suave bajo el producto: un degradado radial, mucho más barato que sombras reales.
function contactShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(0.6, "rgba(0,0,0,0.18)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.95;
  mesh.scale.set(1, 0.55, 1);
  return mesh;
}

export function createStage(container: HTMLElement, { autoRotate = true }: { autoRotate?: boolean } = {}): Stage {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.55;

  // Luz principal cálida, relleno frío y contraluz naranja del club.
  const key = new THREE.DirectionalLight(0xfff4e6, 2.2);
  key.position.set(2.5, 3, 3.5);
  const fill = new THREE.DirectionalLight(0xb9d2ff, 0.7);
  fill.position.set(-3, 1, 2);
  const rim = new THREE.DirectionalLight(0xf29a2e, 2.4);
  rim.position.set(-2.5, 2, -3);
  scene.add(key, fill, rim, new THREE.HemisphereLight(0xdfe9ff, 0x0b1e38, 0.5));
  scene.add(contactShadow());

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  const home = new THREE.Vector3(0, 0.15, 4.2);
  camera.position.copy(home);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.4;
  controls.maxDistance = 6;
  controls.minPolarAngle = Math.PI * 0.22;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.target.set(0, 0, 0);

  // El producto gira dentro de "pivot"; la cámara orbita con los controles.
  const pivot = new THREE.Group();
  scene.add(pivot);
  let model: THREE.Object3D | null = null;
  let targetAngle: number | null = null;
  let targetScale = 1;
  let spinning = autoRotate && !reduceMotion;
  let userActive = false;
  let idleTimer = 0;

  controls.addEventListener("start", () => {
    userActive = true;
    targetAngle = null;
    window.clearTimeout(idleTimer);
  });
  controls.addEventListener("end", () => {
    // Después de soltar, el giro automático vuelve a los pocos segundos.
    idleTimer = window.setTimeout(() => (userActive = false), 2500);
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camera.aspect = w / h;
    // En pantallas angostas se aleja la cámara para que el producto quepa completo.
    camera.position.setLength(home.length() * Math.max(1, 0.9 / camera.aspect));
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Solo se dibuja mientras el visor está en pantalla y la pestaña está visible.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(container);

  const clock = new THREE.Clock();
  let frame = 0;
  const loop = () => {
    frame = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (targetAngle !== null) {
      const diff = Math.atan2(Math.sin(targetAngle - pivot.rotation.y), Math.cos(targetAngle - pivot.rotation.y));
      if (Math.abs(diff) < 0.002 || reduceMotion) {
        pivot.rotation.y = targetAngle;
        targetAngle = null;
      } else pivot.rotation.y += diff * Math.min(1, dt * 7);
    } else if (spinning && !userActive) {
      pivot.rotation.y += dt * 0.45;
    }
    const s = pivot.scale.x + (targetScale - pivot.scale.x) * (reduceMotion ? 1 : Math.min(1, dt * 8));
    pivot.scale.setScalar(s);
    controls.update();
    renderer.render(scene, camera);
  };
  loop();

  return {
    renderer,
    setModel(next) {
      if (model) {
        pivot.remove(model);
        disposeObject(model);
      }
      model = next;
      pivot.add(next);
    },
    setScale(scale) {
      targetScale = scale;
    },
    faceTo(angle) {
      // Toma el camino más corto desde el ángulo actual, sin dar vueltas completas.
      const turns = Math.round((pivot.rotation.y - angle) / (Math.PI * 2));
      targetAngle = angle + turns * Math.PI * 2;
    },
    turn(delta) {
      targetAngle = (targetAngle ?? pivot.rotation.y) + delta;
    },
    setAutoRotate(on) {
      spinning = on && !reduceMotion;
    },
    reset() {
      camera.position.copy(home);
      controls.target.set(0, 0, 0);
      resize();
      this.faceTo(0);
    },
    dispose() {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      if (model) disposeObject(model);
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
