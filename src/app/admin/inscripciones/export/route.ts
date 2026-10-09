import { getAdmin } from "@/lib/auth";
import { adminRead } from "@/lib/sheets";

export const dynamic = "force-dynamic";

// Descarga las inscripciones como CSV (se abre en Excel o Google Sheets). Solo con sesión del panel.
export async function GET() {
  if (!(await getAdmin())) return new Response("No autorizado", { status: 401 });
  const data = await adminRead("Inscripciones");
  if (!data) return new Response("Sin conexión con la hoja", { status: 503 });

  const headers = data.headers.length ? data.headers : Object.keys(data.rows[0] ?? {}).filter((k) => k !== "_row");
  // Evita que Excel interprete celdas como fórmulas y escapa comillas.
  const cell = (v: string) => {
    const s = (v ?? "").replace(/^'/, "");
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const lines = [headers.map(cell).join(";"), ...data.rows.map((r) => headers.map((h) => cell(r[h] ?? "")).join(";"))];
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscripciones-voley-zuniga-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
