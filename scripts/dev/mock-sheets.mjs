// Simulador local del Apps Script (docs/google-sheets/Code.gs) para ver el panel en desarrollo sin tocar la hoja real.
// Uso: node scripts/dev/mock-sheets.mjs   y en .env.local:
//   SHEETS_WEBAPP_URL=http://localhost:3999/exec  SHEETS_SECRET=desarrollo-local-0000000000
//   ADMIN_PASSWORD=<12+ caracteres>  SESSION_SECRET=<32+ caracteres>
// Datos ficticios en memoria: se pierden al cerrar.
import { createServer } from "node:http";

const SECRET = process.env.SHEETS_SECRET || "desarrollo-local-0000000000";
// MOCK_DELAY_MS=3000 imita el arranque en frío de Apps Script (para ver los estados de carga).
const DELAY = Number(process.env.MOCK_DELAY_MS) || 0;
const t = (headers, rows) => ({ headers, rows: rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""]))) });
const sheets = {
  Tabla: t(["Categoría", "Equipo", "PJ", "PG", "PP", "Puntos", "Activo"], [
    ["Juvenil Sub-18", "Club Voley Zúñiga", "3", "2", "1", "6", ""],
    ["Juvenil Sub-18", "Club Rival Laureles", "3", "3", "0", "9", ""],
    ["Juvenil Sub-18", "Escuela Bello Oriente", "3", "0", "3", "0", ""],
    ["Menores Sub-16", "Club Voley Zúñiga", "2", "1", "1", "3", ""],
  ]),
  Fixture: t(["Fecha", "Hora", "Categoría", "Local", "Visitante", "Sede", "Estado", "Resultado"], [
    ["2026-11-01", "09:00", "Juvenil Sub-18", "Club Voley Zúñiga", "Club Rival Laureles", "Coliseo", "", ""],
    ["2026-10-25", "16:30", "Menores Sub-16", "Escuela Bello Oriente", "Club Voley Zúñiga", "Polideportivo", "", "1-3"],
    ["2026-11-15", "10:00", "Juvenil Sub-18", "Club Voley Zúñiga", "Escuela Bello Oriente", "Coliseo", "Programado", ""],
  ]),
  Inscripciones: t(["Fecha", "Nombre", "Edad", "Categoría", "Nivel", "Sede", "Horario", "WhatsApp", "Consentimiento", "Código", "Estado", "Notas"], [
    ["2026-11-02", "Ana Prueba", "12", "Infantil Sub-14", "Principiante", "Buenos Aires", "Lun y Mié 4 pm", "3000000001", "Sí (2026-11-02)", "VZ-0001", "Contactado", ""],
    ["2026-11-05", "Luis Ficticio", "15", "Menores Sub-16", "Intermedio", "Laureles", "Mar y Jue 5 pm", "3000000002", "Sí (2026-11-05)", "VZ-0002", "Matriculado", "Paga en efectivo"],
  ]),
  Contacto: t(["Fecha", "Nombre", "Contacto", "Asunto", "Mensaje", "Estado", "Notas"], [
    ["2026-11-04", "Marta Ejemplo", "marta@example.com", "Información de Sedes y Horarios", "¿Hay cupo para mi hija de 10 años los sábados?", "", ""],
  ]),
  Historial: t(["Fecha", "Usuario", "Acción", "Pestaña", "Detalle"], [
    ["2026-11-05 18:20", "Administrador", "update", "Inscripciones", "Fila 3: Estado → Matriculado"],
    ["2026-11-04 09:10", "Administrador", "create", "Noticias", "Campeones del torneo relámpago"],
  ]),
  Noticias: t(["Título", "Fecha", "Categoría", "Resumen", "Cuerpo", "Imagen (URL)", "Activo"], [
    ["Campeones del torneo relámpago", "2026-11-03", "Juvenil Sub-18", "El equipo ganó invicto la final en el Coliseo.", "Texto largo de prueba para la noticia.", "", ""],
    ["Abiertas las inscripciones 2027", "2026-10-28", "", "Cupos para todas las categorías desde los 7 años.", "Texto de prueba.", "", ""],
  ]),
  Cancha: t(["Sede", "Estado", "Mensaje"], [["Buenos Aires", "Normal", ""], ["Laureles", "Cerrada", "Mantenimiento del piso hasta el viernes"]]),
  Horarios: t(["Día", "Grupo", "Inicio", "Fin", "Sede", "Activo"], [
    ["Lunes", "Infantil Sub-14", "16:00", "17:30", "Buenos Aires", ""],
    ["Martes", "Menores Sub-16", "17:00", "18:30", "Laureles", ""],
    ["Miércoles", "Juvenil Sub-18", "18:00", "20:00", "Buenos Aires", ""],
    ["Sábado", "Escuela (7 a 11 años)", "08:00", "10:00", "Laureles", ""],
  ]),
  Productos: t(["Nombre", "Categoría", "Precio", "Descripción", "Imagen", "Personalizable", "Activo"], [
    ["Camiseta oficial 2026", "Uniformes", "85000", "Camiseta de juego azul con detalles naranja.", "", "Titular", ""],
    ["Balón de entrenamiento", "Accesorios", "120000", "Balón talla 5.", "", "", ""],
  ]),
  Ajustes: t(["Clave", "Valor"], [
    ["telefono", "300 000 0000"], ["correo", "club@example.com"], ["instagram", "voleyzuniga"],
    ["inscripciones_abiertas", "SI"], ["aviso_portada", ""],
  ]),
};

const json = (res, body) => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
const sheet = (name) => (sheets[name] ??= { headers: [], rows: [] });

createServer(async (req, res) => {
  if (DELAY) await new Promise((r) => setTimeout(r, DELAY));
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET") {
    const p = Object.fromEntries(url.searchParams);
    if (p.secret !== SECRET) return json(res, { ok: false, error: "unauthorized" });
    const s = sheet(p.sheet);
    const keep = p.cols ? p.cols.split(",") : s.headers;
    const headers = s.headers.filter((h) => keep.includes(h));
    const rows = s.rows.map((r, i) => ({ ...Object.fromEntries(headers.map((h) => [h, r[h]])), ...(p.all === "1" ? { _row: String(i + 2) } : {}) }));
    return json(res, p.all === "1" ? { ok: true, headers, rows } : { ok: true, rows });
  }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  const body = JSON.parse(raw || "{}");
  if (body.secret !== SECRET) return json(res, { ok: false, error: "unauthorized" });
  const s = sheet(body.sheet);
  const action = String(body.action || "").replace("admin.", "");
  const idx = Number(body.row) - 2;
  if (action === "create" || !body.action) { s.rows.push({ ...(body.data ?? body.row ?? {}) }); return json(res, { ok: true, row: s.rows.length + 1 }); }
  if (!s.rows[idx]) return json(res, { ok: false, error: "row_missing" });
  if (action === "update") Object.assign(s.rows[idx], body.data);
  if (action === "remove") s.rows.splice(idx, 1);
  return json(res, { ok: true, row: Number(body.row) });
}).listen(3999, () => console.log("Hoja simulada en http://localhost:3999/exec"));
