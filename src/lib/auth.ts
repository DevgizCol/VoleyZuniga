import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Sesión del panel /admin: cookie httpOnly firmada con HMAC, con el nombre de quien entró.
// Entrar pide contraseña + código por correo; el código solo se pide la primera vez en cada celular
// (queda "reconocido" con una cookie firmada de 180 días).
//
// Usuarios (variables de entorno en Vercel):
//   ADMIN_USERS     separados por ";":  Zúñiga:director@correo.com:clave-larga-1; Contabilidad:conta@correo.com:clave-larga-2
//   ADMIN_PASSWORD  (opcional) clave del usuario "Administrador"; su correo va en ADMIN_EMAIL
//   SESSION_SECRET  secreto para firmar la sesión (mínimo 32 caracteres)

export const ADMIN_COOKIE = "vz_admin_session";
export const DEVICE_COOKIE = "vz_admin_device";
export const OTP_COOKIE = "vz_admin_otp";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas
export const DEVICE_TTL_SECONDS = 60 * 60 * 24 * 180; // 180 días
export const OTP_TTL_SECONDS = 60 * 10; // 10 minutos

export type AdminUser = { name: string };
type UserEntry = { name: string; email: string; password: string };
const EMAIL_RE = /^[^\s@:;]+@[^\s@:;]+\.[^\s@:;]{2,}$/;

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

function users(): UserEntry[] {
  const list: UserEntry[] = [];
  const main = process.env.ADMIN_PASSWORD;
  if (main && main.length >= 12) list.push({ name: "Administrador", email: (process.env.ADMIN_EMAIL || "").trim(), password: main });
  for (const entry of (process.env.ADMIN_USERS || "").split(/[;\n]/)) {
    const i = entry.indexOf(":");
    if (i <= 0) continue;
    const name = entry.slice(0, i).trim().slice(0, 40);
    let rest = entry.slice(i + 1);
    // "Nombre:correo:clave"; el formato viejo "Nombre:clave" sigue leyéndose, pero sin correo no puede entrar.
    const j = rest.indexOf(":");
    const email = j > 0 && EMAIL_RE.test(rest.slice(0, j).trim()) ? rest.slice(0, j).trim() : "";
    if (email) rest = rest.slice(j + 1);
    const password = rest.trim();
    // Contraseñas cortas se ignoran para no abrir el panel por descuido.
    if (name && password.length >= 8) list.push({ name, email, password });
  }
  return list;
}

/** Correo donde recibe el código cada usuario ("" si no tiene). */
export function emailOf(name: string): string {
  const email = users().find((u) => u.name === name)?.email || "";
  return EMAIL_RE.test(email) ? email : "";
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

// Token "tipo.nombre.vence.firma". `extra` entra en la llave de la firma (el código, en el token del código).
type Kind = "admin" | "device" | "otp";

function issue(kind: Kind, user: AdminUser, ttl: number, extra = ""): string | null {
  const secret = getSecret();
  const key = secret && keyFor(user.name, secret);
  if (!key) return null;
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const payload = `${kind}.${Buffer.from(user.name).toString("base64url")}.${exp}`;
  return `${payload}.${sign(payload, `${key}\0${kind}\0${extra}`)}`;
}

function check(kind: Kind, token: string | undefined, extra = ""): AdminUser | null {
  const secret = getSecret();
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== kind) return null;
  const [, nameB64, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
  const name = Buffer.from(nameB64, "base64url").toString("utf8");
  // Si el usuario fue retirado o cambió su clave, no hay llave y el token deja de valer.
  const key = keyFor(name, secret);
  if (!key || !safeEqual(sig, sign(`${kind}.${nameB64}.${expStr}`, `${key}\0${kind}\0${extra}`))) return null;
  return { name };
}

export const createSessionToken = (user: AdminUser) => issue("admin", user, SESSION_TTL_SECONDS);
export const verifySessionToken = (token: string | undefined) => check("admin", token);
/** Celular reconocido: solo vale para el mismo usuario que entra con su contraseña. */
export const createDeviceToken = (user: AdminUser) => issue("device", user, DEVICE_TTL_SECONDS);
export const deviceTrusted = (token: string | undefined, user: AdminUser) => check("device", token)?.name === user.name;
/** Token del código por correo: la firma depende del código, así que el código no se guarda en ningún lado. */
export const createOtpToken = (user: AdminUser, code: string) => issue("otp", user, OTP_TTL_SECONDS, code);
export const verifyOtp = (token: string | undefined, code: string) => (/^\d{6}$/.test(code) ? check("otp", token, code) : null);

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
