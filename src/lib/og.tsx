/* eslint-disable @next/next/no-img-element -- next/og dibuja la imagen con <img>, no con next/image */
import "server-only";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Tarjeta para compartir en WhatsApp y redes con los colores del club. La usan las imágenes de
// partidos y de cada noticia; la de la portada (src/app/opengraph-image.tsx) tiene su propio dibujo.

export const OG_SIZE = { width: 1200, height: 630 };

type Team = { name: string; isClub: boolean };

export async function brandCard({
  kicker,
  title,
  subtitle,
  photo,
  match,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  photo?: string;
  match?: { home: Team; away: Team; center: string; centerSmall?: string };
}) {
  const [logo, display, body] = await Promise.all([
    readFile(join(process.cwd(), "public/logo-trim.png")),
    readFile(join(process.cwd(), "src/assets/fonts/big-shoulders-display-latin-900-normal.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/figtree-latin-600-normal.woff")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  photo = photo ? await loadPhoto(photo) : undefined;
  const titleSize = title.length > 60 ? 64 : title.length > 36 ? 78 : 92;

  const badge = (t: Team) =>
    t.isClub ? (
      <div style={{ width: 150, height: 150, borderRadius: 999, background: "#F3F6FB", border: "6px solid #F29A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={logoSrc} width={120} height={71} alt="" />
      </div>
    ) : (
      <div style={{ width: 150, height: 150, borderRadius: 999, background: "#0F2347", border: "3px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Big Shoulders", fontSize: 64, color: "#C9D5E6" }}>
        {initials(t.name)}
      </div>
    );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "linear-gradient(135deg, #071426 0%, #0F2347 100%)", color: "white", fontFamily: "Figtree" }}>
        {photo ? (
          <>
            {/* El generador de imágenes no mezcla colores: la foto va con un degradado azul encima */}
            <img src={photo} width={1200} height={630} alt="" style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, background: "linear-gradient(90deg, #071426 0%, rgba(7,20,38,0.9) 50%, rgba(15,35,71,0.35) 100%)" }} />
          </>
        ) : match ? null : (
          <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
            <rect width="1200" height="630" fill="#0B1E38" />
            <g fill="none" stroke="#F29A2E" strokeOpacity="0.28" strokeWidth="4">
              <rect x="640" y="60" width="640" height="320" />
              <path d="M960 40 V400 M853 60 V380 M1067 60 V380" />
            </g>
          </svg>
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 10, background: "#F29A2E" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 80px", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={logoSrc} width={120} height={71} alt="" />
            <span style={{ fontSize: 30, color: "#F29A2E" }}>{kicker}</span>
          </div>
          {match ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 330 }}>
                {badge(match.home)}
                <span style={{ fontFamily: "Big Shoulders", fontSize: 40, textAlign: "center" }}>{match.home.name.toUpperCase()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: "Big Shoulders", fontSize: 150, lineHeight: 1, color: "white" }}>{match.center}</span>
                {match.centerSmall ? <span style={{ fontSize: 30, color: "#F29A2E" }}>{match.centerSmall}</span> : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 330 }}>
                {badge(match.away)}
                <span style={{ fontFamily: "Big Shoulders", fontSize: 40, textAlign: "center" }}>{match.away.name.toUpperCase()}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", fontFamily: "Big Shoulders", fontSize: titleSize, lineHeight: 0.92, maxWidth: 900 }}>{title.toUpperCase()}</div>
          )}
          <div style={{ display: "flex", fontSize: 28, color: "#C9D5E6" }}>{match ? title : subtitle ?? ""}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Big Shoulders", data: display, weight: 900, style: "normal" },
        { name: "Figtree", data: body, weight: 600, style: "normal" },
      ],
    }
  );
}

// La foto se descarga antes de dibujar: si no carga o no es JPG/PNG, la tarjeta sale sin foto en vez de fallar.
async function loadPhoto(src: string): Promise<string | undefined> {
  try {
    if (src.startsWith("/")) {
      const file = join(process.cwd(), "public", src.split("?")[0]!);
      if (!file.startsWith(join(process.cwd(), "public"))) return undefined;
      const type = /\.png$/i.test(file) ? "image/png" : /\.jpe?g$/i.test(file) ? "image/jpeg" : "";
      return type ? `data:${type};base64,${(await readFile(file)).toString("base64")}` : undefined;
    }
    const res = await fetch(src, { headers: { Accept: "image/jpeg,image/png" }, signal: AbortSignal.timeout(6000) });
    const type = res.headers.get("content-type")?.split(";")[0] ?? "";
    if (!res.ok || !["image/jpeg", "image/png"].includes(type)) return undefined;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return undefined;
  }
}

function initials(name: string) {
  return (
    name
      .replace(/\b(club|voley|vóley|voleibol|de|del|la|el|los|las)\b/gi, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((w) => w[0]!.toUpperCase())
      .join("") || name.slice(0, 2).toUpperCase()
  );
}
