import type { Colorway } from "./store3d";

// Catálogo de la tienda. Los precios están en pesos colombianos; confírmalos con el club antes de publicar cambios.

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  customizable?: "home" | "libero";
  /** Colores del probador 3D (columna "Colores" de la hoja). Sin ella se usan los de muestra. */
  colors?: Colorway[];
};

export const PRODUCTS: Product[] = [
  { id: "jersey-2026", name: "Camiseta oficial de juego 2026", category: "Indumentaria", price: 95000, image: "/store/jersey.svg", description: "Tela liviana que seca rápido, con escudo termosellado. Personalízala con nombre y número.", customizable: "home" },
  { id: "libero-jersey-2026", name: "Camiseta de líbero", category: "Indumentaria", price: 95000, image: "/store/libero.svg", description: "Color de contraste reglamentario para líberos. También se personaliza.", customizable: "libero" },
  { id: "mikasa-v200w", name: "Balón Mikasa V200W", category: "Equipamiento", price: 340000, image: "/store/ball.svg", description: "Balón reglamentario de competencia internacional." },
  { id: "rodilleras-pro", name: "Rodilleras Asics Gel Pro", category: "Protección", price: 135000, image: "/store/kneepads.svg", description: "Acolchado de doble densidad para defensas y caídas." },
  { id: "sudadera-travel", name: "Sudadera de viaje y presentación", category: "Indumentaria", price: 165000, image: "/store/hoodie.svg", description: "Chaqueta rompevientos con pantalón jogger, para torneos y viajes." },
  { id: "gorra-trucker", name: "Gorra Voley Zúñiga", category: "Accesorios", price: 55000, image: "/store/cap.svg", description: "Bordado frontal, visera plana y malla transpirable." },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const cop = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
