import type { Row } from "@/lib/sheets";
import type { ClubNotice } from "./validation";

export function noticeForRow(sheet: string, row: Row, previous?: Row): ClubNotice | null {
  if (String(row.Activo).toUpperCase() === "NO") return null;
  const fields = sheet === "Fixture" ? ["Fecha", "Hora", "Categoría", "Local", "Visitante", "Sede", "Estado", "Resultado", "Activo"]
    : sheet === "Noticias" ? ["Título", "Resumen", "Cuerpo", "Fecha", "Activo"] : [];
  if (!fields.length || (previous && fields.every(k => (row[k] || "") === (previous[k] || "")))) return null;
  if (sheet === "Noticias") return { title: (row["Título"] || "Novedades del club").slice(0, 100), body: (row.Resumen || "Hay una nueva publicación del Club Voley Zúñiga. Toca para leerla.").slice(0, 240), url: "/noticias" };
  return { title: previous ? "Partido actualizado · Zúñiga" : "Nuevo partido · Zúñiga", body: `${row.Local} vs ${row.Visitante} · ${row["Categoría"]} · ${row.Fecha} ${row.Hora || ""} · ${row.Sede || "Sede por confirmar"}${row.Resultado ? ` · ${row.Resultado}` : ` · ${row.Estado}`}`.slice(0, 240), url: "/partidos" };
}
