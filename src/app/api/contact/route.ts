import { NextResponse } from "next/server";
import { appendToSheet, sheetsConfigured } from "@/lib/sheets";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { CONTACT_TOPICS, isOneOf } from "@/data/contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (isRateLimited(`contact:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Has enviado varios mensajes seguidos. Intenta de nuevo en un rato." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Campo trampa: los bots lo llenan, las personas no lo ven. Se responde "ok" sin guardar.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 100);
  const email = text(body.email, 150);
  const phone = text(body.phone, 20);
  const message = text(body.message, 1500);
  const topic = body.topic;

  if (name.length < 2) return bad("Escribe tu nombre completo.");
  if (!EMAIL_RE.test(email)) return bad("Revisa el correo electrónico.");
  if (!PHONE_RE.test(phone)) return bad("Revisa el número de teléfono o WhatsApp.");
  if (!isOneOf(CONTACT_TOPICS, topic)) return bad("Elige un motivo de contacto.");
  if (message.length < 5) return bad("Escribe tu mensaje.");

  if (!sheetsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "El formulario aún no está disponible. Escríbenos por WhatsApp." },
      { status: 503 }
    );
  }

  const saved = await appendToSheet("Contacto", {
    Nombre: name,
    Contacto: `${phone} · ${email}`,
    Asunto: topic,
    Mensaje: message,
  });

  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "No pudimos guardar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}

function bad(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
