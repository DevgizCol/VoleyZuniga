import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Vercel Edge Geo-Location Headers
  const country = request.headers.get("x-vercel-ip-country") || "CO";
  const city = request.headers.get("x-vercel-ip-city") || "Medellin";
  const region = request.headers.get("x-vercel-ip-country-region") || "ANT";

  // Inyectar contexto geográfico en las cabeceras de respuesta para hidratación
  response.headers.set("x-user-country", country);
  response.headers.set("x-user-city", decodeURIComponent(city));
  response.headers.set("x-user-region", region);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.svg, icon.svg
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|icon.svg).*)",
  ],
};
