// Pictogramas de línea con el lenguaje de la cancha. Decorativos.
const base = {
  viewBox: "0 0 120 80",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PictoTechnique({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M8 72H112" strokeOpacity="0.4" />
      <path d="M60 72V40" />
      <path d="M14 66C30 20 70 8 100 30" strokeDasharray="2 7" />
      <circle cx="100" cy="30" r="7" fill="currentColor" stroke="none" />
      <path d="M20 66l-6 0M20 66l0-6" />
    </svg>
  );
}

export function PictoGrowth({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M8 72H112" strokeOpacity="0.4" />
      <path d="M22 72V58M44 72V48M66 72V36M88 72V22" strokeWidth="9" />
      <circle cx="100" cy="12" r="6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PictoScore({ className = "" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <rect x="10" y="12" width="100" height="56" rx="6" strokeOpacity="0.5" />
      <path d="M60 18V62" strokeOpacity="0.4" />
      <path d="M26 30h14l-14 22h14" />
      <path d="M90 30h-12v10h8a6 6 0 0 1 0 12h-10" />
    </svg>
  );
}
