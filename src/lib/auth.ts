import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Sesión del panel /admin: cookie httpOnly firmada con HMAC, con el nombre de quien entró.
//
// Usuarios (variables de entorno en Vercel):
//   ADMIN_PASSWORD  contraseña del usuario "Administrador" (obligatoria)
//   ADMIN_USERS     usuarios adicionales, separados por ";":  Profe Carlos:clave-larga-1; Equipo técnico:clave-larga-2
//   SESSION_SECRET  secreto para firmar la sesión (mínimo 32 caracteres)

export const ADMIN_COOKIE = "vz_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas

export type AdminUser = { name: string };

function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

function users(): { name: string; password: string }[] {
  const list: { name: string; password: string }[] = [];
  const main = process.env.ADMIN_PASSWORD;
  if (main && main.length >= 12) list.push({ name: "Administrador", password: main });
  for (const entry of (process.env.ADMIN_USERS || "").split(/[;\n]/)) {
    const i = entry.indexOf(":");
    if (i <= 0) continue;
    const name = entry.slice(0, i).trim().slice(0, 40);
    const password = entry.slice(i + 1).trim();
    // Contraseñas cortas se ignoran para no abrir el panel por descuido.
    if (name && password.length >= 8) list.push({ name, password });
  }
  return list;
}

/** Devuelve el usuario cuya contraseña coincide (comparación en tiempo constante), o null. */
export function checkAdminPassword(input: string): AdminUser | null {
  const secret = getSecret();
  if (!secret || !input) return null; // falla cerrado si no está configurado
  const probe = sign(input, secret);
  let found: AdminUser | null = null;
  for (const u of users()) {
    // Se recorren todos para no revelar por tiempo cuál coincidió.
    if (safeEqual(probe, sign(u.password, secret)) && !found) found = { name: u.name };
  }
  return found;
}

// La firma depende también de la clave del usuario: cambiarla en Vercel invalida sus sesiones.
function keyFor(name: string, secret: string): string | null {
  const u = users().find((x) => x.name === name);
  return u ? `${secret}\0${u.password}` : null;
}

export function createSessionToken(user: AdminUser): string | null {
  const secret = getSecret();
  const key = secret && keyFor(user.name, secret);
  if (!key) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `admin.${Buffer.from(user.name).toString("base64url")}.${exp}`;
  return `${payload}.${sign(payload, key)}`;
}

export function verifySessionToken(token: string | undefined): AdminUser | null {
  const secret = getSecret();
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "admin") return null;
  const [role, nameB64, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const name = Buffer.from(nameB64, "base64url").toString("utf8");
  // Si el usuario fue retirado o cambió su clave, no hay llave y la sesión deja de valer.
  const key = keyFor(name, secret);
  if (!key || !safeEqual(sig, sign(`${role}.${nameB64}.${expStr}`, key))) return null;
  return { name };
}

export async function getAdmin(): Promise<AdminUser | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdmin()) !== null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

/** Rechaza peticiones POST de otro origen (los route handlers no tienen la comprobación de Origin de las Server Actions). */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // shortcut: clientes sin Origin (curl) pasan; el navegador siempre lo envía en POST
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
