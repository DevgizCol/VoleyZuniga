import type { Row } from "@/lib/sheets";
import type { ClubNotice } from "./validation";

// Hojas públicas que avisan al guardar: los campos que cuentan como cambio real y el aviso que generan.
// Inscripciones y Contacto son privadas y nunca avisan.
const RULES: Record<string, { fields: string[]; notice: (r: Row, prev?: Row) => ClubNotice }> = {
  Fixture: {
    fields: ["Fecha", "Hora", "Categoría", "Local", "Visitante", "Sede", "Estado", "Resultado", "Activo"],
    notice: (r, prev) => ({ title: prev ? "Partido actualizado · Zúñiga" : "Nuevo partido · Zúñiga", body: `${r.Local} vs ${r.Visitante} · ${r["Categoría"]} · ${r.Fecha} ${r.Hora || ""} · ${r.Sede || "Sede por confirmar"}${r.Resultado ? ` · ${r.Resultado}` : ` · ${r.Estado}`}`, url: "/partidos" }),
  },
  Noticias: {
    fields: ["Título", "Resumen", "Cuerpo", "Fecha", "Activo"],
    notice: (r) => ({ title: r["Título"] || "Novedades del club", body: r.Resumen || "Hay una nueva publicación del Club Voley Zúñiga. Toca para leerla.", url: "/noticias" }),
  },
  Cancha: {
    fields: ["Sede", "Estado", "Mensaje"],
    notice: (r) => r.Estado === "Normal"
      ? { title: `Cancha ${r.Sede} · Zúñiga`, body: "Todo normal: el entrenamiento sigue según el horario.", url: "/" }
      : { title: `${r.Estado} · ${r.Sede}`, body: r.Mensaje || `Hay un aviso para la sede ${r.Sede}. Toca para ver los detalles.`, url: "/" },
  },
  Tabla: {
    fields: ["Categoría", "Equipo", "PJ", "PG", "PP", "Puntos", "Activo"],
    notice: (r) => ({ title: "Posiciones actualizadas · Zúñiga", body: `${r["Categoría"]} · ${r.Equipo}: ${r.Puntos} pts (${r.PG} ganados de ${r.PJ}).`, url: "/posiciones" }),
  },
  Horarios: {
    fields: ["Día", "Inicio", "Fin", "Grupo", "Sede", "Activo"],
    notice: (r, prev) => ({ title: prev ? "Horario actualizado · Zúñiga" : "Nuevo horario · Zúñiga", body: `${r.Grupo} · ${r["Día"]} ${r.Inicio}–${r.Fin} · ${r.Sede}`, url: "/inscripciones" }),
  },
  Productos: {
    fields: ["Nombre", "Precio", "Descripción", "Activo"],
    notice: (r, prev) => ({ title: prev ? "Tienda actualizada · Zúñiga" : "Nuevo en la tienda · Zúñiga", body: `${r.Nombre}${r.Precio ? ` · $${Number(r.Precio).toLocaleString("es-CO")}` : ""}${r["Descripción"] ? ` · ${r["Descripción"]}` : ""}`, url: "/tienda" }),
  },
};

const fit = (n: ClubNotice): ClubNotice => ({ ...n, title: n.title.slice(0, 100), body: n.body.slice(0, 240) });

export function noticeForRow(sheet: string, row: Row, previous?: Row): ClubNotice | null {
  const rule = RULES[sheet];
  if (!rule || String(row.Activo).toUpperCase() === "NO") return null;
  if (previous && rule.fields.every(k => (row[k] || "") === (previous[k] || ""))) return null;
  return fit(rule.notice(row, previous));
}

// Aviso cuando se retira algo publicado (borrar un borrador no avisa).
export function removalNotice(sheet: string, row: Row): ClubNotice | null {
  const n = noticeForRow(sheet, row);
  if (!n) return null;
  if (sheet === "Fixture") return fit({ ...n, title: "Partido retirado de agenda", body: `${row.Local} vs ${row.Visitante} · ${row.Fecha}. Consulta la agenda actualizada.` });
  return fit({ ...n, title: "Actualización del club · Zúñiga", body: `Se retiró: ${n.body}` });
}

// Ajustes públicos de la web (contacto, redes, aviso de portada, inscripciones, precios…).
export function settingNotice(label: string, key: string, value: string): ClubNotice {
  if (key === "inscripciones_abiertas") return value === "SI"
    ? { title: "¡Inscripciones abiertas! · Zúñiga", body: "Ya puedes inscribirte en el Club Voley Zúñiga. Toca para ver horarios y cupos.", url: "/inscripciones" }
    : { title: "Inscripciones cerradas · Zúñiga", body: "Por ahora las inscripciones están cerradas. Te avisaremos cuando abran.", url: "/" };
  if (key === "aviso_inicio" && value) return fit({ title: "Aviso del club · Zúñiga", body: value, url: "/" });
  return fit({ title: "Información del club actualizada", body: `Se actualizó: ${label}. Toca para ver la web.`, url: "/" });
}
