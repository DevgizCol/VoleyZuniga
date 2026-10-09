import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Imagen que aparece al compartir el enlace del sitio en WhatsApp, Facebook o X.
export const alt = "Club Voley Zúñiga · No formamos jugadores, formamos campeones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [logo, display, body] = await Promise.all([
    readFile(join(process.cwd(), "public/logo-trim.png")),
    readFile(join(process.cwd(), "src/assets/fonts/big-shoulders-display-latin-900-normal.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/figtree-latin-600-normal.woff")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #071426 0%, #0F2347 100%)",
          color: "white",
          fontFamily: "Figtree",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <g transform="translate(560 120) scale(0.75)" fill="none" stroke="#F29A2E" strokeWidth="6" strokeLinecap="round">
            <path d="M250 733L950 733 M483 344L717 344 M250 733L483 344 M950 733L717 344" />
            <path d="M390 500L810 500 M450 400L750 400 M425 442L775 442" strokeWidth="4" />
            <path d="M398 347L802 347 M398 442L398 347 M802 442L802 347" stroke="#C9D5E6" strokeWidth="5" />
          </g>
          <g fill="none" strokeLinecap="round" stroke="#F29A2E">
            <path d="M700 140 C 860 90, 960 110, 1010 200" strokeWidth="22" opacity="0.9" />
            <path d="M740 190 C 880 150, 960 170, 1000 240" strokeWidth="12" opacity="0.6" />
          </g>
          <defs>
            <clipPath id="ball">
              <circle cx="1040" cy="230" r="70" />
            </clipPath>
          </defs>
          <circle cx="1040" cy="230" r="70" fill="#F3F6FB" />
          <g clipPath="url(#ball)">
            <path d="M965 215 C 1000 175, 1060 160, 1115 182" stroke="#213049" strokeWidth="26" fill="none" />
            <path d="M965 275 C 1015 240, 1070 232, 1115 248" stroke="#213049" strokeWidth="18" fill="none" />
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 80px", width: 760, position: "relative" }}>
          <img src={logoSrc} width={180} height={106} alt="" style={{ objectFit: "contain" }} />
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontFamily: "Big Shoulders", fontSize: 86, fontWeight: 900, lineHeight: 0.9 }}>
            <span>NO FORMAMOS JUGADORES,</span>
            <span style={{ color: "#F29A2E" }}>FORMAMOS CAMPEONES.</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#C9D5E6" }}>Voleibol en Medellín desde los 7 años · Clase de prueba sin costo</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Big Shoulders", data: display, weight: 900, style: "normal" },
        { name: "Figtree", data: body, weight: 600, style: "normal" },
      ],
    }
  );
}
