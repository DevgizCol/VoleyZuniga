import type { AdminRow } from "@/lib/sheets";

/** Columna de la pestaña Inscripciones donde queda "fecha hora · entrenador" al usar la clase gratis. */
export const FREE_CLASS_COL = "Clase gratis";

/** Busca la inscripción por el código del pase (sin importar mayúsculas ni espacios). */
export function findByCode(rows: AdminRow[], code: string): AdminRow | undefined {
  const wanted = code.trim().toUpperCase();
  if (!wanted) return undefined;
  return rows.find((r) => (r["Código"] || "").trim().toUpperCase() === wanted);
}
