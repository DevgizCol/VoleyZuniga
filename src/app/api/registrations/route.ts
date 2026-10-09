import { NextResponse } from "next/server";
import { appendToSheet, sheetsConfigured } from "@/lib/sheets";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { CATEGORIES, HORARIOS, NIVELES, SEDES } from "@/data/registration";
import { isOneOf } from "@/data/contact";

const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;

// Fecha de hoy en hora de Bogotá (AAAA-MM-DD), no en UTC, para que coincida con el día local.
const bogotaDate = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (isRateLimited(`registration:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Has enviado varias solicitudes seguidas. Intenta de nuevo en un rato." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Campo trampa anti-bots.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 100);
  const phone = text(body.phone, 20);
  const age = Number(body.age);

  if (name.length < 2) return bad("Escribe el nombre del deportista.");
  if (!Number.isInteger(age) || age < 5 || age > 60) return bad("Revisa la edad del deportista.");
  if (!isOneOf(CATEGORIES, body.category)) return bad("Elige una categoría válida.");
  if (typeof body.level !== "string" || !(NIVELES as readonly string[]).includes(body.level)) return bad("Elige un nivel válido.");
  if (!isOneOf(SEDES, body.sede)) return bad("Elige una sede válida.");
  if (!isOneOf(HORARIOS, body.horario)) return bad("Elige un horario válido.");
  if (!PHONE_RE.test(phone)) return bad("Revisa el número de WhatsApp.");
  if (body.consent !== true) {
    return bad("Debes aceptar el tratamiento de datos personales para continuar.");
  }

  if (!sheetsConfigured()) {
    return NextResponse.json({ ok: false, error: "Registro no disponible." }, { status: 503 });
  }

  const saved = await appendToSheet("Inscripciones", {
    Nombre: name,
    Edad: String(age),
    Categoría: body.category as string,
    Nivel: body.level as string,
    Sede: body.sede as string,
    Horario: body.horario as string,
    WhatsApp: phone,
    Consentimiento: `Sí (${bogotaDate()})`,
  });

  if (!saved) return NextResponse.json({ ok: false, error: "No se pudo guardar." }, { status: 502 });
  return NextResponse.json({ ok: true });
}

function bad(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
