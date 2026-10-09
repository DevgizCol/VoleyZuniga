import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkAdminPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

// Límite de intentos en memoria (best-effort; por instancia). Frena fuerza bruta básica.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
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
    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    current.count += 1;
    attempts.set(key, current);
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
  }

  attempts.delete(key);
  const token = createSessionToken(user);
  if (!token) return NextResponse.json({ ok: false, error: "No se pudo crear la sesión." }, { status: 500 });
  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions);
  return res;
}
