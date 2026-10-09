import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkAdminPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { clientIp, isBlocked, recordFailure, resetLimit } from "@/lib/rate-limit";

// Límite de intentos fallidos por IP (best-effort; por instancia). Frena fuerza bruta básica.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const key = `login:${clientIp(request)}`;
  if (isBlocked(key, MAX_ATTEMPTS)) {
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

  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32 || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "El servidor no está configurado (SESSION_SECRET / ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  const user = checkAdminPassword(password);
  if (!user) {
    recordFailure(key, WINDOW_MS);
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
  }

  resetLimit(key);
  const token = createSessionToken(user);
  if (!token) return NextResponse.json({ ok: false, error: "No se pudo crear la sesión." }, { status: 500 });
  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
  return res;
}
