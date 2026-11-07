import type { AdminRow } from "@/lib/sheets";

/** Columna de la pestaña Inscripciones donde queda "fecha hora · entrenador" al usar la clase gratis. */
export const FREE_CLASS_COL = "Clase gratis";

/** Busca la inscripción por el código del pase (sin importar mayúsculas ni espacios). */
export function findByCode(rows: AdminRow[], code: string): AdminRow | undefined {
  const wanted = code.trim().toUpperCase();
  if (!wanted) return undefined;
  return rows.find((r) => (r["Código"] || "").trim().toUpperCase() === wanted);
}

export type FunnelRow = { origen: string; inscritos: number; asistieron: number; matriculados: number };

/** Embudo de conversión: inscritos → usaron la clase gratis → matriculados, en total y por canal de llegada. */
export function funnel(rows: Record<string, string>[]): { total: FunnelRow; porOrigen: FunnelRow[] } {
  const total: FunnelRow = { origen: "Total", inscritos: 0, asistieron: 0, matriculados: 0 };
  const by = new Map<string, FunnelRow>();
  for (const r of rows) {
    const origen = (r.Origen || "").trim().toLowerCase() || "sin dato";
    const f = by.get(origen) ?? { origen, inscritos: 0, asistieron: 0, matriculados: 0 };
    by.set(origen, f);
    for (const x of [f, total]) {
      x.inscritos++;
      if ((r[FREE_CLASS_COL] || "").trim()) x.asistieron++;
      if (r.Estado === "Matriculado") x.matriculados++;
    }
  }
  return { total, porOrigen: [...by.values()].sort((a, b) => b.inscritos - a.inscritos) };
}
