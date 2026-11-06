import { NextResponse } from "next/server";
import { ADMIN_COOKIE, sameOrigin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
