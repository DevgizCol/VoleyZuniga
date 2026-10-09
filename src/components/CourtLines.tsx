// Cancha de voleibol vista desde arriba (18 m x 9 m). Es decorativa: las líneas se dibujan una vez.
export default function CourtLines({ className = "" }: { className?: string }) {
  const line = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, pathLength: 1 };
  return (
    <svg viewBox="0 0 360 200" aria-hidden="true" focusable="false" className={className}>
      <rect x="10" y="10" width="340" height="180" strokeWidth="2.5" {...line} className="court-draw" />
      <line x1="180" y1="2" x2="180" y2="198" strokeWidth="3.5" {...line} className="court-draw" />
      <line x1="120" y1="10" x2="120" y2="190" strokeWidth="2" {...line} className="court-draw" />
      <line x1="240" y1="10" x2="240" y2="190" strokeWidth="2" {...line} className="court-draw" />
    </svg>
  );
}
