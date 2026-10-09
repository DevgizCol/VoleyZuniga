"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAdmin } from "@/lib/auth";
import { adminMutate, adminRead, sheetTag, type Row } from "@/lib/sheets";
import { SCHEMAS, SETTING_RULES, STATUS_OPTIONS, type EditableSheet, type StatusSheet } from "@/lib/admin/schemas";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  // Cambia en cada respuesta para que la interfaz pueda reaccionar aunque el mensaje se repita.
  at?: number;
};

const ERRORS: Record<string, string> = {
  conflict: "Alguien cambió esta fila mientras la editabas. Recarga la página para ver la versión actual.",
  bad_row: "La fila ya no existe. Recarga la página.",
  not_configured: "Falta configurar la conexión con la hoja (SHEETS_WEBAPP_URL y SHEETS_SECRET).",
  unauthorized: "La clave entre la web y la hoja no coincide (SHEETS_SECRET).",
  sheet_not_allowed: "Publica la versión nueva del Apps Script para poder editar desde el panel.",
  bad_action: "Publica la versión nueva del Apps Script para poder editar desde el panel.",
  action_not_allowed: "Esa acción no está permitida en esta pestaña.",
  sheet_missing: "No se encontró la pestaña en la hoja. Revisa que no le hayan cambiado el nombre.",
  network: "No hubo respuesta de Google. Revisa tu conexión e inténtalo de nuevo.",
};
const errorText = (code: string) => ERRORS[code] ?? `No se pudo guardar (${code}).`;

// Páginas públicas que dependen de cada pestaña.
const AFFECTED: Record<string, { path: string; type?: "layout" | "page" }[]> = {
  Fixture: [{ path: "/games" }, { path: "/calendario.ics" }, { path: "/admin", type: "layout" }],
  Tabla: [{ path: "/standings" }],
  Noticias: [{ path: "/news", type: "layout" }, { path: "/sitemap.xml" }],
  Cancha: [{ path: "/", type: "layout" }],
  Horarios: [{ path: "/" }, { path: "/club/contact" }, { path: "/registrations" }, { path: "/team" }],
  Productos: [{ path: "/store" }],
  Ajustes: [{ path: "/", type: "layout" }],
  Inscripciones: [{ path: "/admin", type: "layout" }],
  Contacto: [{ path: "/admin", type: "layout" }],
};

function refresh(sheet: string) {
  updateTag(sheetTag(sheet));
  for (const p of AFFECTED[sheet] ?? []) revalidatePath(p.path, p.type);
  revalidatePath("/admin", "layout");
}

function parseExpected(raw: FormDataEntryValue | null): Row | undefined {
  if (typeof raw !== "string" || !raw) return undefined;
  try {
    const obj = JSON.parse(raw);
    return obj && typeof obj === "object" ? (obj as Row) : undefined;
  } catch {
    return undefined;
  }
}

const done = (message: string): ActionState => ({ ok: true, message, at: Date.now() });
const fail = (message: string, fieldErrors?: Record<string, string>): ActionState => ({ ok: false, message, fieldErrors, at: Date.now() });

function bogotaNow() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Bogota", dateStyle: "short", timeStyle: "short" }).format(new Date());
}

/** Crea o edita una fila de Fixture, Tabla, Noticias, Cancha u Horarios. */
export async function saveRow(_prev: ActionState, form: FormData): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");

  const sheet = String(form.get("_sheet")) as EditableSheet;
  const schema = SCHEMAS[sheet];
  if (!schema) return fail("Pestaña no válida.");

  const raw: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (!k.startsWith("_") && !k.startsWith("$ACTION") && typeof v === "string") raw[k] = v;
  if (!("Activo" in raw) && form.get("_hasActivo")) raw.Activo = "NO"; // casilla desmarcada

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      fieldErrors[key] ??= issue.message;
    }
    return fail("Revisa los campos marcados.", fieldErrors);
  }
  const data: Row = { ...(parsed.data as Row) };
  if (sheet === "Cancha") data.Actualizado = bogotaNow();

  const rowRaw = form.get("_row");
  const row = rowRaw ? Number(rowRaw) : undefined;
  const result = await adminMutate({
    action: row ? "update" : "create",
    sheet,
    actor: user.name,
    row,
    expected: row ? parseExpected(form.get("_expected")) : undefined,
    data,
  });
  if (!result.ok) return fail(errorText(result.error));
  refresh(sheet);
  return done(row ? "Cambios guardados. La web ya está actualizada." : "Creado. Ya aparece en la web.");
}

/** Borra una fila. */
export async function deleteRow(sheet: EditableSheet, row: number, expected: Row): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  if (!SCHEMAS[sheet] || !Number.isInteger(row) || row < 2) return fail("Fila no válida.");
  const result = await adminMutate({ action: "remove", sheet, actor: user.name, row, expected });
  if (!result.ok) return fail(errorText(result.error));
  refresh(sheet);
  return done("Eliminado.");
}

/** Cambia el Estado de una inscripción o de un mensaje. */
export async function setStatus(sheet: StatusSheet, row: number, expected: Row, status: string): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  const options = STATUS_OPTIONS[sheet] as readonly string[] | undefined;
  if (!options || !options.includes(status) || !Number.isInteger(row) || row < 2) return fail("Estado no válido.");
  const result = await adminMutate({ action: "update", sheet, actor: user.name, row, expected, data: { Estado: status } });
  if (!result.ok) return fail(errorText(result.error));
  refresh(sheet);
  return done(`Marcado como ${status}.`);
}

/** Atajo: marca o quita la lluvia (u otro aviso) en una sede con un toque. */
export async function quickCourt(row: number | null, expected: Row | null, sede: string, estado: string, mensaje: string): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  const parsed = SCHEMAS.Cancha.safeParse({ Sede: sede, Estado: estado, Mensaje: mensaje });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Datos no válidos.");
  const data: Row = { ...parsed.data, Actualizado: bogotaNow() };
  const result = row
    ? await adminMutate({ action: "update", sheet: "Cancha", actor: user.name, row, expected: expected ?? undefined, data })
    : await adminMutate({ action: "create", sheet: "Cancha", actor: user.name, data });
  if (!result.ok) return fail(errorText(result.error));
  refresh("Cancha");
  return done(estado === "Normal" ? `${sede}: aviso quitado.` : `${sede}: aviso publicado.`);
}

/**
 * Suma un partido a la tabla de posiciones con el sistema de puntos FIVB:
 * 3-0 o 3-1 → 3 puntos al ganador y 0 al perdedor; 3-2 → 2 al ganador y 1 al perdedor.
 * Si un equipo no existe en esa categoría, se crea.
 */
export async function applyResult(category: string, teamA: string, teamB: string, setsA: number, setsB: number): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  const cat = category.trim().slice(0, 60);
  const a = teamA.trim().slice(0, 80);
  const b = teamB.trim().slice(0, 80);
  if (!cat || !a || !b) return fail("Completa la categoría y los dos equipos.");
  if (a.toLowerCase() === b.toLowerCase()) return fail("Los equipos deben ser distintos.");
  const valid = (x: number, y: number) => Number.isInteger(x) && Number.isInteger(y) && Math.max(x, y) === 3 && Math.min(x, y) >= 0 && Math.min(x, y) <= 2;
  if (!valid(setsA, setsB)) return fail("El marcador debe ser 3-0, 3-1 o 3-2 (o al revés).");

  const table = await adminRead("Tabla");
  if (!table) return fail(errorText("not_configured"));

  const aWins = setsA > setsB;
  const tight = Math.min(setsA, setsB) === 2;
  const pts = (won: boolean) => (won ? (tight ? 2 : 3) : tight ? 1 : 0);
  const n = (v: string | undefined) => Number(v || 0) || 0;

  for (const [team, won] of [
    [a, aWins],
    [b, !aWins],
  ] as const) {
    const current = table.rows.find((r) => r["Categoría"].trim().toLowerCase() === cat.toLowerCase() && r.Equipo.trim().toLowerCase() === team.toLowerCase());
    const data: Row = current
      ? {
          PJ: String(n(current.PJ) + 1),
          PG: String(n(current.PG) + (won ? 1 : 0)),
          PP: String(n(current.PP) + (won ? 0 : 1)),
          Puntos: String(n(current.Puntos) + pts(won)),
        }
      : { Categoría: cat, Equipo: team, PJ: "1", PG: won ? "1" : "0", PP: won ? "0" : "1", Puntos: String(pts(won)), Activo: "" };
    const expected = current ? Object.fromEntries(Object.entries(current).filter(([k]) => k !== "_row")) : undefined;
    const res = current
      ? await adminMutate({ action: "update", sheet: "Tabla", actor: user.name, row: Number(current._row), expected, data })
      : await adminMutate({ action: "create", sheet: "Tabla", actor: user.name, data });
    if (!res.ok) return fail(errorText(res.error));
  }
  refresh("Tabla");
  return done(`Tabla actualizada: ${aWins ? a : b} gana ${Math.max(setsA, setsB)}-${Math.min(setsA, setsB)}.`);
}

/** Cambia el valor de un ajuste de la web (teléfono, Instagram, aviso de portada…). */
export async function saveSetting(row: number, expected: Row, key: string, value: string): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  const rule = SETTING_RULES[key];
  if (!rule) return fail("Ese ajuste no se puede editar desde el panel.");
  const parsed = rule.schema.safeParse(value);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Valor no válido.");
  if (!Number.isInteger(row) || row < 2) return fail("Fila no válida.");
  const result = await adminMutate({ action: "update", sheet: "Ajustes", actor: user.name, row, expected, data: { Valor: parsed.data } });
  if (!result.ok) return fail(errorText(result.error));
  refresh("Ajustes");
  return done(`${rule.label}: guardado. La web ya lo muestra.`);
}

/** Crea un ajuste que todavía no existe en la hoja. */
export async function createSetting(key: string, value: string): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  const rule = SETTING_RULES[key];
  if (!rule) return fail("Ajuste no válido.");
  const parsed = rule.schema.safeParse(value);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Valor no válido.");
  const result = await adminMutate({ action: "create", sheet: "Ajustes", actor: user.name, data: { Clave: key, Valor: parsed.data } });
  if (!result.ok) return fail(errorText(result.error));
  refresh("Ajustes");
  return done(`${rule.label}: guardado.`);
}

/** Nota interna en una inscripción o un mensaje (no se muestra en la web). */
export async function saveNote(sheet: StatusSheet, row: number, expected: Row, note: string): Promise<ActionState> {
  const user = await getAdmin();
  if (!user) return fail("Tu sesión expiró. Vuelve a entrar.");
  if (!STATUS_OPTIONS[sheet] || !Number.isInteger(row) || row < 2) return fail("Fila no válida.");
  const clean = note.trim().slice(0, 1000);
  const result = await adminMutate({ action: "update", sheet, actor: user.name, row, expected, data: { Notas: clean } });
  if (!result.ok) return fail(errorText(result.error));
  refresh(sheet);
  return done("Nota guardada.");
}
