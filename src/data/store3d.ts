// Colores y medidas del visor 3D de la tienda. Los colores son los mismos de la camiseta en SVG (JerseyArt).

export type JerseyVariant = "home" | "libero";
export type JerseySide = "front" | "back";

export type JerseyColors = { body: string; accent: string; ink: string };

export const JERSEY_COLORS: Record<JerseyVariant, JerseyColors> = {
  home: { body: "#0F2347", accent: "#F29A2E", ink: "#F3F6FB" },
  libero: { body: "#F29A2E", accent: "#0F2347", ink: "#0F2347" },
};

// La silueta se dibuja en un lienzo de 400×400 (el mismo viewBox del SVG) y en 3D ocupa 2×2 unidades.
export const ART_SIZE = 400;
// Mitad del ancho del torso en unidades 3D (el torso va de x=115 a x=285 en el lienzo).
export const TORSO_HALF_WIDTH = 85 / (ART_SIZE / 2);
// Qué tanto sobresale el pecho y la espalda: le da volumen a la camiseta.
export const TORSO_DEPTH = 0.2;

// Ángulos de giro (en radianes) en los que se ve cada lado.
export const SIDE_ANGLE: Record<JerseySide, number> = { front: 0, back: Math.PI };
