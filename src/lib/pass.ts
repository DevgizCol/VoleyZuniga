"use client";

import QRCode from "qrcode";
import { SITE, whatsappUrl } from "@/config/site";

// Pase de clase de prueba: código de inscripción, QR y la imagen descargable (formato historia 1080 x 1920).

export type PassData = {
  name: string;
  age: number;
  category: string;
  level: string;
  sede: string;
  horario: string;
  code: string;
};

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // sin 0/O ni 1/I para que se lea bien

export function makeCode(category: string) {
  const short = category.match(/Sub-(\d+)/)?.[1] ?? "MY";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `VZ${short}-${rand}`;
}

// Lo que abre el QR: un chat de WhatsApp con el club que identifica al deportista.
export function passQrText(d: PassData) {
  return whatsappUrl(`Hola, soy ${d.name.trim()} (código ${d.code}). Vengo a mi clase de prueba de ${d.category}.`);
}

export function qrMatrix(text: string) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const rows: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x++) row.push(Boolean(qr.modules.get(x, y)));
    rows.push(row);
  }
  return rows;
}

// ---------- Dibujo ----------

const NAVY = "#0F2347";
const NIGHT = "#071426";
const ORANGE = "#F29A2E";
const PAPER = "#F3F6FB";
const MUTED = "#5B6B85";

// Geometría de la cancha en perspectiva (misma que la portada).
const COURT = "M250 733.3L950 733.3 M483.3 344.4L716.7 344.4 M250 733.3L483.3 344.4 M950 733.3L716.7 344.4 M390 500L810 500 M450 400L750 400 M425 441.7L775 441.7";
const NET = "M397.8 347.2L802.2 347.2 M397.8 441.7L397.8 347.2 M802.2 441.7L802.2 347.2";
const BALL_PANELS = [
  "M-100 -20 C -55 -70, 30 -95, 100 -70 L 100 -110 L -100 -110 Z",
  "M-100 40 C -40 -10, 40 -25, 110 -5 L 110 30 C 40 15, -40 35, -100 85 Z",
  "M-30 110 C -20 60, 10 20, 60 -10 L 80 5 C 35 35, 15 70, 15 110 Z",
];
const BALL_SEAMS = [
  "M-100 -20 C -55 -70, 30 -95, 100 -70",
  "M-100 40 C -40 -10, 40 -25, 110 -5",
  "M-100 85 C -40 35, 40 15, 110 30",
  "M-30 110 C -20 60, 10 20, 60 -10",
];

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Ajusta el tamaño de letra para que el texto quepa en el ancho dado (máximo dos líneas).
function fitLines(ctx: CanvasRenderingContext2D, text: string, family: string, weight: number, maxW: number, maxSize: number, minSize: number) {
  const words = text.split(/\s+/).filter(Boolean);
  for (let size = maxSize; size >= minSize; size -= 4) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width <= maxW) line = test;
      else {
        if (line) lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    if (lines.length <= 2 && lines.every((l) => ctx.measureText(l).width <= maxW)) return { size, lines };
  }
  ctx.font = `${weight} ${minSize}px ${family}`;
  return { size: minSize, lines: [text.slice(0, 22)] };
}

function drawBall(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(r / 100, r / 100);
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = PAPER;
  ctx.fillRect(-110, -110, 220, 220);
  ctx.fillStyle = "#213049";
  BALL_PANELS.forEach((d) => ctx.fill(new Path2D(d)));
  ctx.strokeStyle = "#C9D3E2";
  ctx.lineWidth = 3;
  BALL_SEAMS.forEach((d) => ctx.stroke(new Path2D(d)));
  const g = ctx.createRadialGradient(-30, -40, 10, 0, 0, 120);
  g.addColorStop(0, "rgba(255,255,255,0.5)");
  g.addColorStop(0.5, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(2,8,20,0.55)");
  ctx.fillStyle = g;
  ctx.fillRect(-110, -110, 220, 220);
  ctx.restore();
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, 100, Math.PI * 0.72, Math.PI * 1.25);
  ctx.stroke();
  ctx.restore();
}

export async function renderPass(d: PassData): Promise<HTMLCanvasElement> {
  await document.fonts.ready;
  const display = fontVar("--font-display", "'Arial Narrow', Arial, sans-serif");
  const body = fontVar("--font-figtree", "Arial, sans-serif");
  await Promise.all([document.fonts.load(`900 120px ${display}`), document.fonts.load(`600 40px ${body}`)]).catch(() => {});

  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fondo: azul de noche con luces de coliseo
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, NIGHT);
  bg.addColorStop(0.55, "#0A1B33");
  bg.addColorStop(1, NIGHT);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const light = ctx.createRadialGradient(W * 0.8, -100, 50, W * 0.8, -100, 1100);
  light.addColorStop(0, "rgba(255,214,160,0.28)");
  light.addColorStop(1, "rgba(255,214,160,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);

  // Cancha en perspectiva al fondo
  ctx.save();
  ctx.translate(-120, 1180);
  ctx.scale(1.1, 1.1);
  ctx.strokeStyle = "rgba(242,154,46,0.55)";
  ctx.lineWidth = 5;
  ctx.shadowColor = "rgba(242,154,46,0.8)";
  ctx.shadowBlur = 18;
  ctx.stroke(new Path2D(COURT));
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(201,213,230,0.55)";
  ctx.lineWidth = 4;
  ctx.stroke(new Path2D(NET));
  ctx.restore();

  // Logo y encabezado
  try {
    const logo = await loadImage("/logo-trim.png");
    const lw = 300;
    ctx.drawImage(logo, (W - lw) / 2, 90, lw, (lw * logo.height) / logo.width);
  } catch {
    /* sin logo, el resto del pase sigue igual */
  }
  ctx.textAlign = "center";
  ctx.fillStyle = ORANGE;
  ctx.font = `700 34px ${body}`;
  ctx.fillText("Club de voleibol · Medellín", W / 2, 330);

  // Tarjeta
  const cx = 90;
  const cy = 390;
  const cw = W - 180;
  const ch = 1300;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 80;
  ctx.shadowOffsetY = 40;
  roundRect(ctx, cx, cy, cw, ch, 44);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, cx, cy, cw, ch, 44);
  ctx.clip();

  // Cabecera azul de la tarjeta con líneas de cancha
  const headH = 360;
  ctx.fillStyle = NAVY;
  ctx.fillRect(cx, cy, cw, headH);
  ctx.strokeStyle = "rgba(242,154,46,0.28)";
  ctx.lineWidth = 4;
  ctx.strokeRect(cx + cw - 420, cy + 40, 520, 280);
  ctx.beginPath();
  ctx.moveTo(cx + cw - 160, cy + 20);
  ctx.lineTo(cx + cw - 160, cy + 340);
  ctx.moveTo(cx + cw - 247, cy + 40);
  ctx.lineTo(cx + cw - 247, cy + 320);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = ORANGE;
  ctx.font = `700 34px ${body}`;
  ctx.fillText("Pase de clase de prueba", cx + 60, cy + 90);
  ctx.fillStyle = "#FFFFFF";
  const fit = fitLines(ctx, d.name.trim().toUpperCase() || "DEPORTISTA", display, 900, cw - 120, 132, 64);
  ctx.font = `900 ${fit.size}px ${display}`;
  fit.lines.forEach((l, i) => ctx.fillText(l, cx + 60, cy + 120 + fit.size * 0.95 * (i + 1)));

  // Datos
  const label = (t: string, x: number, y: number) => {
    ctx.fillStyle = MUTED;
    ctx.font = `600 30px ${body}`;
    ctx.fillText(t, x, y);
  };
  const value = (t: string, x: number, y: number, size: number) => {
    ctx.fillStyle = NAVY;
    ctx.font = `900 ${size}px ${display}`;
    ctx.fillText(t, x, y);
  };
  const by = cy + headH + 80;
  label("Edad", cx + 60, by);
  value(`${d.age} años`, cx + 60, by + 76, 76);
  label("Categoría", cx + 380, by);
  // La categoría se achica hasta caber en su columna.
  let catSize = 76;
  ctx.font = `900 ${catSize}px ${display}`;
  while (catSize > 40 && ctx.measureText(d.category.toUpperCase()).width > cw - 380 - 50) {
    catSize -= 4;
    ctx.font = `900 ${catSize}px ${display}`;
  }
  value(d.category.toUpperCase(), cx + 380, by + 76, catSize);
  label("Nivel", cx + 60, by + 160);
  ctx.fillStyle = NAVY;
  ctx.font = `700 42px ${body}`;
  ctx.fillText(d.level, cx + 60, by + 214);

  // Perforación
  const py = by + 280;
  ctx.setLineDash([18, 14]);
  ctx.strokeStyle = "rgba(15,35,71,0.25)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx + 50, py);
  ctx.lineTo(cx + cw - 50, py);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  ctx.fillStyle = "#0A1B33";
  [cx, cx + cw].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, py, 30, 0, Math.PI * 2);
    ctx.fill();
  });

  // Parte inferior: horario, sede, código y QR
  const qy = py + 60;
  const qrSize = 300;
  const qrX = cx + cw - 60 - qrSize;
  const matrix = qrMatrix(passQrText(d));
  const cell = qrSize / (matrix.length + 2);
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, qrX - 10, qy - 10, qrSize + 20, qrSize + 20, 20);
  ctx.fill();
  ctx.fillStyle = NAVY;
  matrix.forEach((row, y) => row.forEach((on, x) => on && ctx.fillRect(qrX + (x + 1) * cell, qy + (y + 1) * cell, Math.ceil(cell), Math.ceil(cell))));
  ctx.fillStyle = MUTED;
  ctx.font = `600 24px ${body}`;
  ctx.textAlign = "center";
  ctx.fillText("Escanéalo en la cancha", qrX + qrSize / 2, qy + qrSize + 50);
  ctx.textAlign = "left";

  const textW = qrX - cx - 100;
  const wrap = (t: string, x: number, y: number, size: number, weight = 600) => {
    ctx.font = `${weight} ${size}px ${body}`;
    const words = t.split(" ");
    let line = "";
    let yy = y;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > textW && line) {
        ctx.fillText(line, x, yy);
        line = w;
        yy += size * 1.25;
      } else line = test;
    }
    ctx.fillText(line, x, yy);
    return yy;
  };
  label("Horario", cx + 60, qy + 20);
  ctx.fillStyle = NAVY;
  let yy = wrap(d.horario, cx + 60, qy + 66, 36, 700);
  label("Sede", cx + 60, yy + 70);
  ctx.fillStyle = NAVY;
  yy = wrap(d.sede, cx + 60, yy + 116, 36, 700);
  label("Código", cx + 60, yy + 70);
  value(d.code, cx + 60, yy + 140, 64);

  // Franja inferior naranja
  ctx.save();
  roundRect(ctx, cx, cy, cw, ch, 44);
  ctx.clip();
  ctx.fillStyle = ORANGE;
  ctx.fillRect(cx, cy + ch - 110, cw, 110);
  ctx.fillStyle = NIGHT;
  ctx.font = `900 50px ${display}`;
  ctx.textAlign = "center";
  ctx.fillText("CLASE DE PRUEBA SIN COSTO", W / 2, cy + ch - 40);
  ctx.restore();

  // Balón con estela sobre la esquina de la tarjeta
  ctx.save();
  ctx.lineCap = "round";
  const trail = ctx.createLinearGradient(660, 300, 900, 420);
  trail.addColorStop(0, "rgba(242,154,46,0)");
  trail.addColorStop(1, "rgba(255,177,74,1)");
  ctx.strokeStyle = trail;
  [[30, 0], [18, 46], [10, 86]].forEach(([w, off]) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(660, 300 + off * 0.8);
    ctx.bezierCurveTo(760, 280 + off * 0.8, 840, 300 + off * 0.6, 880, 390 + off * 0.3);
    ctx.stroke();
  });
  ctx.restore();
  drawBall(ctx, 900, 400, 110);

  // Pie
  ctx.textAlign = "center";
  ctx.fillStyle = "#C9D5E6";
  ctx.font = `600 32px ${body}`;
  ctx.fillText(`Presenta este pase en tu primera clase · ${SITE.instagram.handle}`, W / 2, 1790);
  ctx.fillStyle = "#8FA3BF";
  ctx.font = `500 26px ${body}`;
  const today = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  ctx.fillText(`Emitido el ${today}`, W / 2, 1840);

  return canvas;
}

const fileName = (d: PassData) => `Pase-VoleyZuniga-${d.name.trim().replace(/\s+/g, "_") || "deportista"}.png`;

export async function passBlob(d: PassData) {
  const canvas = await renderPass(d);
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("png"))), "image/png"));
}

export async function downloadPass(d: PassData) {
  const blob = await passBlob(d);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName(d);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// Compartir la imagen (historias de Instagram o WhatsApp) cuando el celular lo permite.
export async function sharePass(d: PassData): Promise<boolean> {
  const blob = await passBlob(d);
  const file = new File([blob], fileName(d), { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "Mi pase de clase de prueba", text: `Voy a mi clase de prueba en ${SITE.name} 🏐` });
    return true;
  }
  return false;
}
