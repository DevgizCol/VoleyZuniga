import "server-only";
import { readSheet } from "./sheets";

// Pestaña "Cancha": Sede | Estado | Mensaje | Actualizado.
// Estado "Normal" no muestra nada; cualquier otro (Lluvia, Cancelado, Cambio de sede…) muestra el aviso.

export type CourtNotice = { sede: string; estado: string; mensaje: string; tipo: "rain" | "cancel" | "info" };

export async function getCourtNotices(): Promise<CourtNotice[]> {
  const rows = (await readSheet("Cancha", 120)) ?? [];
  return rows
    .map((r) => ({
      sede: (r["Sede"] || "").trim(),
      estado: (r["Estado"] || "").trim(),
      mensaje: (r["Mensaje"] || "").trim(),
    }))
    .filter((r) => r.estado && !/^normal$/i.test(r.estado))
    .map((r) => ({
      ...r,
      tipo: /lluvia/i.test(r.estado) ? "rain" : /cancel|suspend/i.test(r.estado) ? "cancel" : "info",
    }));
}
