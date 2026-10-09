import * as THREE from "three";
import { JERSEY_PATH } from "@/components/store/JerseyArt";
import { ART_SIZE, TORSO_DEPTH, TORSO_HALF_WIDTH } from "@/data/store3d";

// Modelo 3D de la camiseta sin archivos externos: dos mallas (frente y espalda) que se "inflan"
// según la distancia al borde de la silueta. Así el pecho queda redondeado, las mangas toman
// volumen propio y los bordes de ambas caras se juntan, como una prenda real.

const SEGMENTS = 128;
const FIELD = 400; // resolución del campo de distancias

// Distancia (en píxeles del lienzo de 400) desde cada punto interior hasta el borde de la silueta.
function silhouetteDistanceField() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = FIELD;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.scale(FIELD / ART_SIZE, FIELD / ART_SIZE);
  ctx.fill(new Path2D(JERSEY_PATH));
  const alpha = ctx.getImageData(0, 0, FIELD, FIELD).data;

  // Transformada de distancia en dos pasadas (chamfer 3-4).
  const INF = 1e9;
  const d = new Float32Array(FIELD * FIELD);
  for (let i = 0; i < d.length; i++) d[i] = alpha[i * 4 + 3] > 127 ? INF : 0;
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= FIELD || y >= FIELD ? 0 : d[y * FIELD + x]);
  for (let y = 0; y < FIELD; y++)
    for (let x = 0; x < FIELD; x++) {
      const i = y * FIELD + x;
      if (d[i] === 0) continue;
      d[i] = Math.min(d[i], at(x - 1, y) + 3, at(x, y - 1) + 3, at(x - 1, y - 1) + 4, at(x + 1, y - 1) + 4);
    }
  for (let y = FIELD - 1; y >= 0; y--)
    for (let x = FIELD - 1; x >= 0; x--) {
      const i = y * FIELD + x;
      if (d[i] === 0) continue;
      d[i] = Math.min(d[i], at(x + 1, y) + 3, at(x, y + 1) + 3, at(x + 1, y + 1) + 4, at(x - 1, y + 1) + 4);
    }
  const toArtPx = ART_SIZE / FIELD / 3;
  return (u: number, v: number) => {
    // u, v en [0, 1] con v=1 arriba (coordenadas de textura). Interpolación bilineal para bordes suaves.
    const fx = u * (FIELD - 1);
    const fy = (1 - v) * (FIELD - 1);
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
    return (top * (1 - ty) + bottom * ty) * toArtPx;
  };
}

function inflatedPanel(distance: (u: number, v: number) => number) {
  const geometry = new THREE.PlaneGeometry(2, 2, SEGMENTS, SEGMENTS);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const torsoPx = TORSO_HALF_WIDTH * (ART_SIZE / 2);
  for (let i = 0; i < pos.count; i++) {
    const dist = distance(uv.getX(i), uv.getY(i));
    // Sube desde el borde y se aplana hacia el centro del pecho.
    const t = Math.min(1, dist / torsoPx);
    pos.setZ(i, TORSO_DEPTH * (1 - Math.pow(1 - t, 3)));
  }
  geometry.computeVertexNormals();
  return geometry;
}

export type JerseyModel = {
  group: THREE.Group;
  front: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  back: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
  dispose: () => void;
};

export function createJerseyModel(frontMap: THREE.Texture, backMap: THREE.Texture): JerseyModel {
  const distance = silhouetteDistanceField();
  const frontGeometry = inflatedPanel(distance);
  // La espalda es la misma malla girada media vuelta: al rotar la camiseta se lee al derecho.
  const backGeometry = inflatedPanel(distance).rotateY(Math.PI);

  const material = (map: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({
      map,
      alphaTest: 0.5,
      roughness: 0.78,
      metalness: 0,
      sheen: 0.25,
      sheenRoughness: 0.8,
      sheenColor: new THREE.Color("#ffffff"),
    });

  const front = new THREE.Mesh(frontGeometry, material(frontMap));
  const back = new THREE.Mesh(backGeometry, material(backMap));
  const group = new THREE.Group();
  group.add(front, back);

  return {
    group,
    front,
    back,
    dispose: () => {
      frontGeometry.dispose();
      backGeometry.dispose();
      front.material.dispose();
      back.material.dispose();
    },
  };
}
