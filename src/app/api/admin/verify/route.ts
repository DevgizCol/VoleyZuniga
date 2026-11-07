import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  DEVICE_COOKIE,
  DEVICE_TTL_SECONDS,
  OTP_COOKIE,
  createDeviceToken,
  createSessionToken,
  sameOrigin,
  sessionCookieOptions,
  verifyOtp,
} from "@/lib/auth";
import { clientIp, resetShared, sharedLimited } from "@/lib/rate-limit";

// Paso 2: el código del correo. Al acertar, abre la sesión y deja el celular reconocido.
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false, error: "Solicitud inválida" }, { status: 403 });
  const key = `verify:${clientIp(request)}`;
  // 5 intentos por 15 min sobre 1.000.000 de códigos posibles que vencen en 10 min.
  if (await sharedLimited(key, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos. Vuelve a escribir tu contraseña en unos minutos." }, { status: 429 });
  }
  let code = "";
  try {
    const body = await request.json();
    code = typeof body?.code === "string" ? body.code.replace(/\s/g, "").slice(0, 6) : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida" }, { status: 400 });
  }
  const store = await cookies();
  const user = verifyOtp(store.get(OTP_COOKIE)?.value, code);
  if (!user) return NextResponse.json({ ok: false, error: "Código incorrecto o vencido." }, { status: 401 });

  await resetShared(key);
  const session = createSessionToken(user);
  const device = createDeviceToken(user);
  if (!session || !device) return NextResponse.json({ ok: false, error: "No se pudo crear la sesión." }, { status: 500 });
  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(ADMIN_COOKIE, session, sessionCookieOptions);
  res.cookies.set(DEVICE_COOKIE, device, { ...sessionCookieOptions, maxAge: DEVICE_TTL_SECONDS });
  res.cookies.set(OTP_COOKIE, "", { path: "/", maxAge: 0 }); // un código sirve una sola vez
  return res;
}
