import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  DEVICE_COOKIE,
  OTP_COOKIE,
  OTP_TTL_SECONDS,
  checkAdminPassword,
  createOtpToken,
  createSessionToken,
  deviceTrusted,
  emailOf,
  sameOrigin,
  sessionCookieOptions,
} from "@/lib/auth";
import { sendLoginCode } from "@/lib/sheets";
import { clientIp, resetShared, sharedLimited } from "@/lib/rate-limit";

// Límite de intentos por IP, compartido entre instancias si Upstash está configurado. Frena fuerza bruta.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Paso 1: contraseña. En un celular reconocido entra directo; si no, se envía un código al correo del usuario.
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, error: "Solicitud inválida" }, { status: 403 });
  const key = `login:${clientIp(request)}`;
  // El intento se cuenta en memoria antes del primer await: ráfagas paralelas no pueden saltarse el tope.
  if (await sharedLimited(key, MAX_ATTEMPTS, WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida" }, { status: 400 });
  }

  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return NextResponse.json({ ok: false, error: "Servicio no disponible." }, { status: 503 });
  }

  const user = checkAdminPassword(password);
  if (!user) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
  }

  const store = await cookies();
  if (deviceTrusted(store.get(DEVICE_COOKIE)?.value, user)) {
    await resetShared(key);
    const token = createSessionToken(user);
    if (!token) return NextResponse.json({ ok: false, error: "No se pudo crear la sesión." }, { status: 500 });
    const res = NextResponse.json({ ok: true, name: user.name });
    res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
    return res;
  }

  const email = emailOf(user.name);
  if (!email) {
    return NextResponse.json({ ok: false, error: "Tu usuario no tiene correo para recibir el código. Pide que lo agreguen." }, { status: 503 });
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const otp = createOtpToken(user, code);
  if (!otp || !(await sendLoginCode(email, user.name, code))) {
    return NextResponse.json({ ok: false, error: "No se pudo enviar el código. Intenta de nuevo." }, { status: 502 });
  }
  const res = NextResponse.json({ ok: true, step: "code", email: maskEmail(email) });
  res.cookies.set(OTP_COOKIE, otp, { ...sessionCookieOptions, maxAge: OTP_TTL_SECONDS });
  return res;
}

// "clubvoleyzuniga@gmail.com" → "cl•••@gmail.com": confirma a dónde llegó sin exponer el correo completo.
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}•••@${domain}`;
}
