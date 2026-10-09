// Camiseta del club dibujada en SVG. Muestra nombre y número en vivo.
export const JERSEY_PATH =
  "M120 40 L165 22 Q200 44 235 22 L280 40 L345 85 L315 140 L285 122 L285 360 Q200 372 115 360 L115 122 L85 140 L55 85 Z";

export default function JerseyArt({
  name = "",
  number = "",
  variant = "home",
  side = "back",
  className = "",
}: {
  name?: string;
  number?: string;
  variant?: "home" | "libero";
  side?: "front" | "back";
  className?: string;
}) {
  const body = variant === "home" ? "#0F2347" : "#F29A2E";
  const accent = variant === "home" ? "#F29A2E" : "#0F2347";
  const ink = variant === "home" ? "#F3F6FB" : "#0F2347";
  const clipId = `jersey-${variant}-${side}`;
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`Camiseta ${variant === "home" ? "titular" : "de líbero"}, vista ${side === "back" ? "trasera" : "frontal"}`}>
      <defs>
        <clipPath id={clipId}>
          <path d={JERSEY_PATH} />
        </clipPath>
        <linearGradient id={`${clipId}-shade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="378" rx="120" ry="10" fill="#000" opacity="0.25" />
      <path d={JERSEY_PATH} fill={body} />
      <g clipPath={`url(#${clipId})`}>
        {/* Estela del logo cruzando la camiseta */}
        <path d="M60 300 C 160 250, 260 230, 360 150" stroke={accent} strokeWidth="26" fill="none" opacity="0.9" />
        <path d="M60 335 C 170 290, 270 270, 360 200" stroke={accent} strokeWidth="10" fill="none" opacity="0.55" />
        <rect x="0" y="0" width="400" height="400" fill={`url(#${clipId}-shade)`} />
        <path d="M55 85 L85 140 L115 122 L120 40 Z M345 85 L315 140 L285 122 L280 40 Z" fill="#000" opacity="0.18" />
      </g>
      <path d="M165 22 Q200 44 235 22" stroke={accent} strokeWidth="8" fill="none" strokeLinecap="round" />
      {side === "back" ? (
        <>
          <text x="200" y="118" textAnchor="middle" fontFamily="var(--font-display), Arial Narrow, sans-serif" fontWeight="900" fontSize="30" letterSpacing="3" fill={ink}>
            {(name || "TU NOMBRE").toUpperCase().slice(0, 12)}
          </text>
          <text x="200" y="258" textAnchor="middle" fontFamily="var(--font-display), Arial Narrow, sans-serif" fontWeight="900" fontSize="150" fill={ink} stroke={accent} strokeWidth="3">
            {(number || "10").slice(0, 2)}
          </text>
        </>
      ) : (
        <>
          <circle cx="245" cy="95" r="18" fill={ink} opacity="0.95" />
          <path d="M231 92 q14 -14 28 0 M231 100 q14 10 28 0" stroke={body} strokeWidth="3" fill="none" />
          <text x="200" y="200" textAnchor="middle" fontFamily="var(--font-display), Arial Narrow, sans-serif" fontWeight="900" fontSize="44" letterSpacing="2" fill={ink}>
            ZÚÑIGA
          </text>
          <text x="200" y="250" textAnchor="middle" fontFamily="var(--font-display), Arial Narrow, sans-serif" fontWeight="900" fontSize="56" fill={ink} stroke={accent} strokeWidth="2">
            {(number || "10").slice(0, 2)}
          </text>
        </>
      )}
    </svg>
  );
}
