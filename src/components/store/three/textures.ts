// Texturas de los productos dibujadas en un canvas: colores, escudo, nombre y número.
// Todo se dibuja en un recuadro de 400×400 (el mismo de las siluetas) y se escala a la resolución final.
import * as THREE from "three";
import type { Colorway } from "@/data/store3d";

export const BOX = 400;
const RES = 1024;

let displayFont = "'Arial Narrow', Arial, sans-serif";
let logo: HTMLImageElement | null = null;

/** Carga la tipografía del sitio y el escudo antes de dibujar (una sola vez). */
export async function loadAssets() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
  if (family) {
    displayFont = `${family}, 'Arial Narrow', Arial, sans-serif`;
    await document.fonts.load(`900 100px ${family}`).catch(() => {});
  }
  if (!logo) {
    const img = new Image();
    img.src = "/logo-trim.png";
    logo = await img.decode().then(() => img, () => null);
  }
}

export function canvas2d(size = RES) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.scale(size / BOX, size / BOX);
  return { c, ctx };
}

export function toTexture(c: HTMLCanvasElement, renderer?: THREE.WebGLRenderer) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (renderer) t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

const font = (size: number) => `900 ${size}px ${displayFont}`;

function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, fill: string, stroke?: string, spacing = 0) {
  ctx.save();
  ctx.font = font(size);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
  if (stroke) {
    ctx.lineJoin = "round";
    ctx.lineWidth = size * 0.06;
    ctx.strokeStyle = stroke;
    ctx.strokeText(value, x, y);
  }
  ctx.fillStyle = fill;
  ctx.fillText(value, x, y);
  ctx.restore();
}

/** Estela del logo cruzando la prenda, como en la camiseta oficial. */
function swoosh(ctx: CanvasRenderingContext2D, color: string, y = 300) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.92;
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.moveTo(40, y);
  ctx.bezierCurveTo(160, y - 50, 260, y - 70, 380, y - 150);
  ctx.stroke();
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(40, y + 36);
  ctx.bezierCurveTo(170, y - 10, 270, y - 30, 380, y - 100);
  ctx.stroke();
  ctx.restore();
}

function crest(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  if (!logo) return;
  const h = (w * logo.naturalHeight) / logo.naturalWidth;
  ctx.drawImage(logo, x - w / 2, y - h / 2, w, h);
}

/** Sombras suaves en los costados y bajo las mangas para dar volumen. */
function fabricShading(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, BOX, 0);
  g.addColorStop(0, "rgba(0,0,0,0.28)");
  g.addColorStop(0.28, "rgba(0,0,0,0)");
  g.addColorStop(0.72, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, BOX, BOX);
}

/** Dibuja una prenda: recorta con la silueta y pinta encima el contenido. */
function garment(outline: string, cw: Colorway, paint: (ctx: CanvasRenderingContext2D) => void) {
  const { c, ctx } = canvas2d();
  const path = new Path2D(outline);
  ctx.save();
  ctx.clip(path);
  ctx.fillStyle = cw.base;
  ctx.fillRect(0, 0, BOX, BOX);
  paint(ctx);
  fabricShading(ctx);
  ctx.restore();
  return c;
}

// ---------- Camiseta ----------

export const JERSEY_OUTLINE =
  "M120 40 L165 22 Q200 44 235 22 L280 40 L345 85 L315 140 L285 122 L285 360 Q200 372 115 360 L115 122 L85 140 L55 85 Z";

export type JerseyText = { name: string; number: string };

export function jerseyCanvas(cw: Colorway, side: "front" | "back", { name, number }: JerseyText) {
  const num = (number || "10").slice(0, 2);
  return garment(JERSEY_OUTLINE, cw, (ctx) => {
    swoosh(ctx, cw.accent);
    // Mangas un poco más oscuras y ribete de color.
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fill(new Path2D("M55 85 L85 140 L115 122 L120 40 Z M345 85 L315 140 L285 122 L280 40 Z"));
    ctx.strokeStyle = cw.accent;
    ctx.lineWidth = 6;
    ctx.stroke(new Path2D("M60 92 L88 134 M340 92 L312 134"));
    // Cuello
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(165, 24);
    ctx.quadraticCurveTo(200, side === "front" ? 58 : 40, 235, 24);
    ctx.stroke();
    if (side === "back") {
      text(ctx, (name || "TU NOMBRE").toUpperCase().slice(0, 12), 200, 112, 30, cw.ink, undefined, 3);
      text(ctx, num, 200, 262, 150, cw.ink, cw.accent);
    } else {
      crest(ctx, 150, 98, 58);
      text(ctx, "ZÚÑIGA", 200, 200, 44, cw.ink, undefined, 2);
      text(ctx, num, 255, 102, 34, cw.ink, cw.accent);
    }
  });
}

// ---------- Sudadera (chaqueta con capota) ----------

export const HOODIE_OUTLINE =
  "M150 72 Q146 14 200 12 Q254 14 250 72 L280 74 Q318 84 330 118 L362 300 Q364 314 350 318 L322 322 Q308 320 306 306 L284 160 L284 362 Q200 372 116 362 L116 160 L94 306 Q92 320 78 322 L50 318 Q36 314 38 300 L70 118 Q82 84 120 74 Z";

export function hoodieCanvas(cw: Colorway, side: "front" | "back") {
  return garment(HOODIE_OUTLINE, cw, (ctx) => {
    // Capota: interior oscuro en el frente, costura central atrás.
    ctx.fillStyle = cw.detail;
    if (side === "front") {
      ctx.beginPath();
      ctx.ellipse(200, 58, 34, 40, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Puños y bajo de la chaqueta en el color de detalle, con franja de acento en las mangas.
    ctx.fillRect(0, 290, BOX, 40);
    ctx.fillRect(110, 344, 180, 30);
    ctx.strokeStyle = cw.accent;
    ctx.lineWidth = 7;
    ctx.stroke(new Path2D("M74 112 L44 296 M326 112 L356 296"));
    if (side === "front") {
      // Cremallera, bolsillos y escudo en el pecho.
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(200, 96);
      ctx.lineTo(200, 362);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(196, 96, 8, 16);
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 3;
      ctx.stroke(new Path2D("M130 270 Q150 250 176 262 M270 270 Q250 250 224 262"));
      crest(ctx, 248, 140, 54);
      swoosh(ctx, cw.accent, 330);
    } else {
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(200, 14);
      ctx.lineTo(200, 74);
      ctx.stroke();
      crest(ctx, 200, 170, 150);
      text(ctx, "VOLEY ZÚÑIGA", 200, 262, 34, cw.ink, undefined, 3);
    }
  });
}

// ---------- Balón (proyección equirectangular) ----------

export function ballCanvas(cw: Colorway) {
  const W = 2048;
  const H = 1024;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = cw.base;
  ctx.fillRect(0, 0, W, H);
  // Paneles ondulados que dan la vuelta al balón, como los de competencia.
  const band = (y0: number, amp: number, phase: number, thick: number, color: string) => {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const y = y0 + amp * Math.sin((x / W) * Math.PI * 4 + phase);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    for (let x = W; x >= 0; x -= 8) ctx.lineTo(x, y0 + thick + amp * Math.sin((x / W) * Math.PI * 4 + phase + 0.5));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 5;
    ctx.stroke();
  };
  band(160, 70, 0, 150, cw.accent);
  band(470, 90, 1.6, 140, cw.accent);
  band(770, 70, 3.1, 120, cw.accent);
  // Costuras finas
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 3;
  for (const y0 of [380, 690]) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const y = y0 + 60 * Math.sin((x / W) * Math.PI * 4 + y0);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // Marca del club en dos caras
  ctx.save();
  ctx.font = `900 64px ${displayFont}`;
  ctx.textAlign = "center";
  ctx.fillStyle = cw.detail;
  ctx.fillText("VOLEY ZÚÑIGA", W * 0.25, 600);
  ctx.fillText("VOLEY ZÚÑIGA", W * 0.75, 600);
  ctx.restore();
  return c;
}

/** Relieve de microfibra del balón (textura en escala de grises para bumpMap). */
export function dimpleCanvas() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 8) {
    for (let x = (y / 8) % 2 ? 4 : 0; x < 256; x += 8) {
      ctx.fillStyle = "#5a5a5a";
      ctx.beginPath();
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  return c;
}

// ---------- Gorra (casco: arriba = botón, abajo = borde) ----------

export function capCanvas(cw: Colorway) {
  const W = 2048;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = cw.base;
  ctx.fillRect(0, 0, W, H);
  // Seis paneles con costuras.
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 6;
  for (let i = 0; i < 6; i++) {
    const x = ((i + 0.25) / 6) * W + W / 12;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  // Franja trasera en malla (oscura) y ribete inferior.
  ctx.fillStyle = cw.detail;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(W * 0.62, H * 0.2, W * 0.26, H * 0.8);
  ctx.globalAlpha = 1;
  ctx.fillRect(0, H - 26, W, 26);
  // Frente (u = 0.25): estela y "VZ".
  const fx = W * 0.25;
  ctx.strokeStyle = cw.accent;
  ctx.lineWidth = 26;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(fx - 200, 420);
  ctx.bezierCurveTo(fx - 80, 380, fx + 40, 340, fx + 200, 220);
  ctx.stroke();
  ctx.font = `900 190px ${displayFont}`;
  ctx.textAlign = "center";
  ctx.fillStyle = cw.ink;
  ctx.fillText("VZ", fx, 380);
  return c;
}

// ---------- Rodilleras (alrededor de la pierna: u = vuelta, v = alto) ----------

export function kneepadCanvas(cw: Colorway) {
  const W = 1024;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = cw.base;
  ctx.fillRect(0, 0, W, H);
  // Tejido acanalado
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  for (let x = 0; x < W; x += 10) ctx.fillRect(x, 0, 4, H);
  // Franjas de acento arriba y abajo
  ctx.fillStyle = cw.accent;
  ctx.fillRect(0, 36, W, 22);
  ctx.fillRect(0, H - 58, W, 22);
  // Marca en el costado
  ctx.save();
  ctx.translate(W * 0.15, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = `900 54px ${displayFont}`;
  ctx.textAlign = "center";
  ctx.fillStyle = cw.ink;
  ctx.fillText("ZÚÑIGA", 0, 18);
  ctx.restore();
  return c;
}

/** Textura del cojín de la rodillera: panal en relieve con el color de detalle. */
export function padCanvas(cw: Colorway) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = cw.detail;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 4;
  const r = 26;
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 12; col++) {
      const x = col * r * 1.75 + (row % 2 ? r * 0.87 : 0);
      const y = row * r * 1.5;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k + Math.PI / 6;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        if (k) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.font = `900 120px ${displayFont}`;
  ctx.textAlign = "center";
  ctx.fillStyle = cw.accent;
  ctx.fillText("VZ", 256, 300);
  return c;
}

/** Tejido fino para dar textura de tela a las prendas (mapa de normales que se repite). */
export function knitNormalCanvas() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(128, 128);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      // Acanalado vertical con un poco de ruido: inclina la normal en X.
      const nx = Math.sin((x / 128) * Math.PI * 32) * 0.35 + (Math.random() - 0.5) * 0.12;
      const ny = (Math.random() - 0.5) * 0.12;
      const i = (y * 128 + x) * 4;
      img.data[i] = Math.round((nx * 0.5 + 0.5) * 255);
      img.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
