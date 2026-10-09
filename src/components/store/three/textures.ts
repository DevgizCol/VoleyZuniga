import * as THREE from "three";
import { JERSEY_PATH } from "@/components/store/JerseyArt";
import { ART_SIZE, JERSEY_COLORS, type JerseySide, type JerseyVariant } from "@/data/store3d";

// Texturas de la camiseta dibujadas en un <canvas>: el mismo diseño del SVG, con nombre y número en vivo.
// Fuera de la silueta el lienzo queda transparente, y el material lo recorta con alphaTest.

const RESOLUTION = 1024;
const SCALE = RESOLUTION / ART_SIZE;

export type JerseyPrint = { variant: JerseyVariant; name: string; number: string };

function displayFont() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
  return family || "'Arial Narrow', Arial, sans-serif";
}

export function drawJersey(canvas: HTMLCanvasElement, side: JerseySide, print: JerseyPrint) {
  const { body, accent, ink } = JERSEY_COLORS[print.variant];
  const font = displayFont();
  const silhouette = new Path2D(JERSEY_PATH);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

  ctx.save();
  ctx.clip(silhouette);
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, ART_SIZE, ART_SIZE);

  // Estela del logo cruzando la camiseta. En la espalda va reflejada para que siga la misma diagonal al dar la vuelta.
  ctx.save();
  if (side === "back") {
    ctx.translate(ART_SIZE, 0);
    ctx.scale(-1, 1);
  }
  ctx.lineCap = "butt";
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 26;
  ctx.stroke(new Path2D("M60 300 C 160 250, 260 230, 360 150"));
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 10;
  ctx.stroke(new Path2D("M60 335 C 170 290, 270 270, 360 200"));
  ctx.restore();

  // Mangas un poco más oscuras, como en el diseño plano.
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fill(new Path2D("M55 85 L85 140 L115 122 L120 40 Z M345 85 L315 140 L285 122 L280 40 Z"));
  ctx.restore();

  // Cuello
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.stroke(new Path2D(side === "front" ? "M165 22 Q200 44 235 22" : "M165 22 Q200 30 235 22"));

  const num = (print.number || "10").slice(0, 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";

  if (side === "back") {
    ctx.fillStyle = ink;
    ctx.font = `900 30px ${font}`;
    ctx.letterSpacing = "3px";
    ctx.fillText((print.name || "TU NOMBRE").toUpperCase().slice(0, 12), 200, 118);
    ctx.letterSpacing = "0px";
    ctx.font = `900 150px ${font}`;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 6;
    ctx.strokeText(num, 200, 258);
    ctx.fillText(num, 200, 258);
  } else {
    // Escudo
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(245, 95, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = body;
    ctx.lineWidth = 3;
    ctx.stroke(new Path2D("M231 92 q14 -14 28 0 M231 100 q14 10 28 0"));

    ctx.fillStyle = ink;
    ctx.font = `900 44px ${font}`;
    ctx.letterSpacing = "2px";
    ctx.fillText("ZÚÑIGA", 200, 200);
    ctx.letterSpacing = "0px";
    ctx.font = `900 56px ${font}`;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.strokeText(num, 200, 250);
    ctx.fillText(num, 200, 250);
  }
}

export function createJerseyTexture(side: JerseySide, print: JerseyPrint, maxAnisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = RESOLUTION;
  canvas.height = RESOLUTION;
  drawJersey(canvas, side, print);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, maxAnisotropy);
  return texture;
}

export function redrawJerseyTexture(texture: THREE.CanvasTexture, side: JerseySide, print: JerseyPrint) {
  drawJersey(texture.image as HTMLCanvasElement, side, print);
  texture.needsUpdate = true;
}

// Sombra suave bajo la camiseta.
export function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}
