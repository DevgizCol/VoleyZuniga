// Balón de voleibol original (azul del logo y blanco), dibujado en SVG.
export default function Volleyball({ className = "", id = "vb" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="-110 -110 220 220" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <circle r="100" />
        </clipPath>
        <radialGradient id={`${id}-shade`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#020814" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <circle r="100" fill="#F3F6FB" />
        {/* Paneles azules */}
        <path d="M-100 -20 C -55 -70, 30 -95, 100 -70 L 100 -110 L -100 -110 Z" fill="#213049" />
        <path d="M-100 40 C -40 -10, 40 -25, 110 -5 L 110 30 C 40 15, -40 35, -100 85 Z" fill="#213049" />
        <path d="M-30 110 C -20 60, 10 20, 60 -10 L 80 5 C 35 35, 15 70, 15 110 Z" fill="#213049" />
        {/* Costuras */}
        <g fill="none" stroke="#C9D3E2" strokeWidth="3" strokeLinecap="round">
          <path d="M-100 -20 C -55 -70, 30 -95, 100 -70" />
          <path d="M-100 40 C -40 -10, 40 -25, 110 -5" />
          <path d="M-100 85 C -40 35, 40 15, 110 30" />
          <path d="M-30 110 C -20 60, 10 20, 60 -10" />
        </g>
        <circle r="100" fill={`url(#${id}-shade)`} />
      </g>
      <circle r="100" fill="none" stroke="#0B1E38" strokeOpacity="0.35" strokeWidth="2" />
      {/* Luz naranja de la estela sobre el borde */}
      <path d="M-70 -71 A 100 100 0 0 0 -60 80" fill="none" stroke="#F29A2E" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
