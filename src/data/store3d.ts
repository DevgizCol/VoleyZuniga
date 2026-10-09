// Opciones del probador 3D de la tienda: qué modelo usa cada producto, sus colores y tallas.
// Los colores de aquí son los de muestra. Si la pestaña Productos tiene una columna "Colores"
// (p. ej. "Azul:#0F2347, Negro:#16181D"), esos reemplazan a estos.
import { SIZES, type Product } from "./products";

export type ProductKind = "jersey" | "ball" | "kneepads" | "hoodie" | "cap";

/** base: color principal; accent: detalles; ink: textos y escudo; detail: zonas secundarias. */
export type Colorway = { name: string; base: string; accent: string; ink: string; detail: string };

const NAVY = "#0F2347";
const ORANGE = "#F29A2E";
const WHITE = "#F3F6FB";

export const COLORWAYS: Record<ProductKind, Colorway[]> = {
  jersey: [{ name: "Titular", base: NAVY, accent: ORANGE, ink: WHITE, detail: "#0B1A33" }],
  ball: [{ name: "Azul y amarillo", base: "#F4CF1D", accent: "#1F4FA3", ink: WHITE, detail: "#0F2E66" }],
  kneepads: [
    { name: "Negro", base: "#16181D", accent: ORANGE, ink: WHITE, detail: "#2B3039" },
    { name: "Blanco", base: "#ECEFF4", accent: NAVY, ink: NAVY, detail: "#CDD4DE" },
    { name: "Azul", base: NAVY, accent: ORANGE, ink: WHITE, detail: "#1E3F73" },
  ],
  hoodie: [
    { name: "Azul marino", base: NAVY, accent: ORANGE, ink: WHITE, detail: "#0A1830" },
    { name: "Negro", base: "#15171C", accent: ORANGE, ink: WHITE, detail: "#0C0D10" },
    { name: "Gris", base: "#5D6675", accent: ORANGE, ink: WHITE, detail: "#4A525F" },
  ],
  cap: [
    { name: "Azul", base: "#1E3F73", accent: ORANGE, ink: WHITE, detail: "#071426" },
    { name: "Blanca", base: "#EEF1F5", accent: ORANGE, ink: NAVY, detail: NAVY },
    { name: "Negra", base: "#16181D", accent: ORANGE, ink: WHITE, detail: "#0C0D10" },
  ],
};

/** Colores de la camiseta según el modelo (titular o líbero). */
export const JERSEY_COLORWAYS: Record<"home" | "libero", Colorway> = {
  home: COLORWAYS.jersey[0],
  libero: { name: "Líbero", base: ORANGE, accent: NAVY, ink: NAVY, detail: "#D9821F" },
};

export const KIND_SIZES: Record<ProductKind, readonly string[]> = {
  jersey: SIZES,
  hoodie: SIZES,
  kneepads: ["S", "M", "L", "XL"],
  cap: ["Única"],
  ball: ["Talla 5"],
};

/** Escala del modelo para cada talla, para que se note la diferencia al cambiarla. */
export function sizeScale(kind: ProductKind, size: string): number {
  const list = KIND_SIZES[kind];
  if (list.length < 2) return 1;
  const i = Math.max(0, list.indexOf(size));
  const mid = (list.length - 1) / 2;
  return 1 + (i - mid) * 0.04;
}

/** Qué modelo 3D corresponde a un producto, por su tipo o su nombre. */
export function productKind(p: Pick<Product, "name" | "category" | "customizable">): ProductKind | null {
  if (p.customizable) return "jersey";
  const text = `${p.name} ${p.category}`.toLowerCase();
  if (/bal[oó]n|\bball/.test(text)) return "ball";
  if (/rodiller/.test(text)) return "kneepads";
  if (/sudadera|chaqueta|buzo|hoodie|rompevientos/.test(text)) return "hoodie";
  if (/gorra|cachucha|\bcap\b/.test(text)) return "cap";
  if (/camiseta|jersey|uniforme/.test(text)) return "jersey";
  return null;
}

const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * (1 + amount))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};

/** Convierte "Azul:#0F2347, Negro:#16181D" en colores completos (acento y texto se deducen). */
export function parseColors(raw: string): Colorway[] {
  return (raw || "")
    .split(/[,;\n]/)
    .map((part) => part.trim().match(/^(.+?)\s*:\s*(#[0-9a-f]{6})$/i))
    .filter((m): m is RegExpMatchArray => m !== null)
    .slice(0, 6)
    .map(([, name, hex]) => {
      const light = luminance(hex) > 0.55;
      const orangey = /^#(f|e)[0-9a-f][89a-f]/i.test(hex) && !light;
      return {
        name: name.slice(0, 24),
        base: hex.toUpperCase(),
        accent: orangey ? NAVY : ORANGE,
        ink: light || orangey ? NAVY : WHITE,
        detail: shade(hex, light ? -0.12 : -0.3),
      };
    });
}

export function colorwaysFor(p: Product, kind: ProductKind): Colorway[] {
  return p.colors?.length ? p.colors : COLORWAYS[kind];
}
