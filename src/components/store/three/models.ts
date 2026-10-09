// Modelos 3D de los productos, generados por código (sin archivos 3D que descargar).
// Las prendas se "inflan" a partir de su silueta: el centro queda abultado y los bordes se juntan,
// como una prenda con volumen. La silueta debe ser simétrica (la espalda reutiliza la misma).
import * as THREE from "three";
import type { Colorway, ProductKind } from "@/data/store3d";
import {
  HOODIE_OUTLINE,
  JERSEY_OUTLINE,
  ballCanvas,
  canvas2d,
  capCanvas,
  dimpleCanvas,
  hoodieCanvas,
  jerseyCanvas,
  kneepadCanvas,
  knitNormalCanvas,
  padCanvas,
  toTexture,
  type JerseyText,
} from "./textures";

const GRID = 160; // resolución de la malla de las prendas
const HEIGHT = 1.9; // alto de las prendas en la escena

/** Distancia (en celdas) de cada punto de la silueta a su borde; 0 fuera de ella. */
function distanceField(outline: string, n: number) {
  const { c, ctx } = canvas2d(n);
  ctx.fill(new Path2D(outline));
  const alpha = ctx.getImageData(0, 0, n, n).data;
  const d = new Float32Array(n * n);
  for (let i = 0; i < n * n; i++) d[i] = alpha[i * 4 + 3] > 127 ? 1e6 : 0;
  const D = Math.SQRT2;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= n || y >= n ? 0 : d[y * n + x]);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + D, at(x + 1, y - 1) + D);
    }
  for (let y = n - 1; y >= 0; y--)
    for (let x = n - 1; x >= 0; x--) {
      const i = y * n + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + D, at(x - 1, y + 1) + D);
    }
  c.width = 0;
  return d;
}

/** Superficie abultada de una cara de la prenda. */
function inflatedSurface(field: Float32Array, n: number, depth: number, radius: number) {
  const size = HEIGHT;
  const geo = new THREE.PlaneGeometry(size, size, n - 1, n - 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const t = Math.min(field[i] / radius, 1);
    // Perfil circular (redondeado en el borde) y una ondulación leve, como tela.
    const bulge = Math.sqrt(1 - (1 - t) * (1 - t));
    const wrinkle = Math.sin(pos.getY(i) * 22 + pos.getX(i) * 6) * 0.004 * t;
    pos.setZ(i, field[i] ? depth * bulge + wrinkle : 0);
  }
  geo.computeVertexNormals();
  return geo;
}

function fabric(map: THREE.Texture, knit: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    map,
    normalMap: knit,
    normalScale: new THREE.Vector2(0.35, 0.35),
    alphaTest: 0.5,
    side: THREE.DoubleSide,
    roughness: 0.78,
    sheen: 0.7,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color("#ffffff"),
  });
}

function knitTexture() {
  const t = new THREE.CanvasTexture(knitNormalCanvas());
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(9, 9);
  return t;
}

export type GarmentModel = THREE.Group & { userData: { front: THREE.MeshPhysicalMaterial; back: THREE.MeshPhysicalMaterial } };

function garment(outline: string, front: HTMLCanvasElement, back: HTMLCanvasElement, renderer: THREE.WebGLRenderer, depth = 0.16) {
  const field = distanceField(outline, GRID);
  const radius = GRID * 0.14;
  const knit = knitTexture();
  const frontMat = fabric(toTexture(front, renderer), knit);
  const backMat = fabric(toTexture(back, renderer), knit);
  const frontMesh = new THREE.Mesh(inflatedSurface(field, GRID, depth, radius), frontMat);
  const backMesh = new THREE.Mesh(inflatedSurface(field, GRID, depth * 0.85, radius), backMat);
  backMesh.rotation.y = Math.PI;
  const group = new THREE.Group() as GarmentModel;
  group.add(frontMesh, backMesh);
  group.userData = { front: frontMat, back: backMat };
  return group;
}

/** Repinta nombre y número de la camiseta sin reconstruir la malla. */
export function updateJerseyText(model: THREE.Object3D, cw: Colorway, jersey: JerseyText) {
  const { front, back } = (model as GarmentModel).userData;
  if (!front || !back) return;
  for (const [mat, side] of [[front, "front"], [back, "back"]] as const) {
    const tex = mat.map as THREE.CanvasTexture;
    const fresh = jerseyCanvas(cw, side, jersey);
    const ctx = (tex.image as HTMLCanvasElement).getContext("2d")!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, fresh.width, fresh.height);
    ctx.drawImage(fresh, 0, 0);
    tex.needsUpdate = true;
  }
}

function ball(cw: Colorway, renderer: THREE.WebGLRenderer) {
  const map = toTexture(ballCanvas(cw), renderer);
  const bump = new THREE.CanvasTexture(dimpleCanvas());
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(24, 12);
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 96, 64),
    new THREE.MeshPhysicalMaterial({ map, bumpMap: bump, bumpScale: 0.6, roughness: 0.5, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
  );
  mesh.rotation.z = 0.35;
  mesh.position.y = -0.15;
  const group = new THREE.Group();
  group.add(mesh);
  return group;
}

function cap(cw: Colorway, renderer: THREE.WebGLRenderer) {
  const group = new THREE.Group();
  const crownMat = new THREE.MeshPhysicalMaterial({ map: toTexture(capCanvas(cw), renderer), roughness: 0.8, sheen: 0.5, side: THREE.DoubleSide });
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2), crownMat);
  crown.scale.set(1, 0.82, 1.08);
  group.add(crown);

  // Visera: forma de "D" con una curva suave, en el color de detalle.
  const shape = new THREE.Shape();
  shape.moveTo(-0.6, 0);
  shape.bezierCurveTo(-0.55, 0.62, 0.55, 0.62, 0.6, 0);
  shape.bezierCurveTo(0.3, 0.12, -0.3, 0.12, -0.6, 0);
  const brimGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.012, bevelSegments: 3, curveSegments: 48 });
  brimGeo.rotateX(Math.PI / 2);
  const p = brimGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) - 0.22 * p.getX(i) * p.getX(i) - 0.08 * p.getZ(i));
  brimGeo.computeVertexNormals();
  const brim = new THREE.Mesh(brimGeo, new THREE.MeshPhysicalMaterial({ color: cw.detail, roughness: 0.7, sheen: 0.4 }));
  brim.position.set(0, 0.01, 0.5);
  group.add(brim);

  const button = new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), new THREE.MeshStandardMaterial({ color: cw.accent, roughness: 0.6 }));
  button.position.y = 0.5;
  group.add(button);
  group.position.y = -0.25;
  group.rotation.x = 0.12;
  return group;
}

function kneepads(cw: Colorway, renderer: THREE.WebGLRenderer) {
  const group = new THREE.Group();
  // Perfil de manga: un poco más ancha en el centro, abierta arriba y abajo.
  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const y = -0.55 + (i / 24) * 1.1;
    profile.push(new THREE.Vector2(0.27 + 0.035 * Math.cos((y / 0.55) * (Math.PI / 2)), y));
  }
  const sleeveMat = new THREE.MeshPhysicalMaterial({ map: toTexture(kneepadCanvas(cw), renderer), roughness: 0.8, sheen: 0.6, side: THREE.DoubleSide });
  const padMat = new THREE.MeshPhysicalMaterial({ map: toTexture(padCanvas(cw), renderer), roughness: 0.6, sheen: 0.3 });
  for (const x of [-0.36, 0.36]) {
    const sleeve = new THREE.Mesh(new THREE.LatheGeometry(profile, 72, Math.PI), sleeveMat);
    const pad = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), padMat);
    pad.scale.set(0.2, 0.27, 0.11);
    pad.position.set(0, 0, 0.28);
    const one = new THREE.Group();
    one.add(sleeve, pad);
    one.position.x = x;
    one.rotation.y = x < 0 ? 0.25 : -0.25;
    group.add(one);
  }
  group.scale.setScalar(1.15);
  return group;
}

export function buildModel(kind: ProductKind, cw: Colorway, renderer: THREE.WebGLRenderer, jersey: JerseyText = { name: "", number: "10" }) {
  switch (kind) {
    case "jersey":
      return garment(JERSEY_OUTLINE, jerseyCanvas(cw, "front", jersey), jerseyCanvas(cw, "back", jersey), renderer);
    case "hoodie":
      return garment(HOODIE_OUTLINE, hoodieCanvas(cw, "front"), hoodieCanvas(cw, "back"), renderer, 0.2);
    case "ball":
      return ball(cw, renderer);
    case "cap":
      return cap(cw, renderer);
    case "kneepads":
      return kneepads(cw, renderer);
  }
}
