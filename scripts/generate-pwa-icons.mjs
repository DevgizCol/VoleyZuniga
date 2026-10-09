// Genera los íconos del sitio a partir de los SVG de la marca. Uso: node scripts/generate-pwa-icons.mjs
//   src/app/icon.svg                     → ícono principal (pestaña del navegador, nítido a cualquier tamaño)
//   src/assets/brand/icon-small.svg      → versión simplificada para 16–48 px (favicon.ico)
//   src/assets/brand/icon-maskable.svg   → Android (deja margen para el recorte circular)
//   src/assets/brand/icon-apple.svg      → iPhone (iOS redondea las esquinas)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p));
const png = (svg, size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

const main = read("src/app/icon.svg");
const small = read("src/assets/brand/icon-small.svg");
const maskable = read("src/assets/brand/icon-maskable.svg");
const apple = read("src/assets/brand/icon-apple.svg");

const out = {
  "public/icon-192.png": await png(main, 192),
  "public/icon-512.png": await png(main, 512),
  "public/icon-maskable-512.png": await png(maskable, 512),
  "public/apple-touch-icon.png": await png(apple, 180),
  "src/app/apple-icon.png": await png(apple, 180),
};

// favicon.ico con imágenes PNG de 16, 32 y 48 px.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(small, s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
out["src/app/favicon.ico"] = Buffer.concat([header, ...images]);

for (const [file, data] of Object.entries(out)) {
  fs.writeFileSync(path.join(root, file), data);
  console.log("✓", file);
}
