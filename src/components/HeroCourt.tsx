import Volleyball from "./Volleyball";

// Cancha de 9 x 18 m proyectada en perspectiva (coordenadas calculadas, viewBox 1200 x 800).
const FREE = "M-275 1025L1475 1025L775 325L425 325Z";
const LINES = "M250 733.3L950 733.3 M483.3 344.4L716.7 344.4 M250 733.3L483.3 344.4 M950 733.3L716.7 344.4";
const ATTACK = "M390 500L810 500 M450 400L750 400";
const CENTER = "M425 441.7L775 441.7";
const POSTS = "M397.8 441.7L397.8 347.2 M802.2 441.7L802.2 347.2";
const NET_TAPE = "M397.8 347.2L802.2 347.2";
const NET_MESH =
  "M405.6 347.2V386.1 M425 347.2V386.1 M444.4 347.2V386.1 M463.9 347.2V386.1 M483.3 347.2V386.1 M502.8 347.2V386.1 M522.2 347.2V386.1 M541.7 347.2V386.1 M561.1 347.2V386.1 M580.6 347.2V386.1 M600 347.2V386.1 M619.4 347.2V386.1 M638.9 347.2V386.1 M658.3 347.2V386.1 M677.8 347.2V386.1 M697.2 347.2V386.1 M716.7 347.2V386.1 M736.1 347.2V386.1 M755.6 347.2V386.1 M775 347.2V386.1 M794.4 347.2V386.1 M397.8 356.9H802.2 M397.8 366.6H802.2 M397.8 376.3H802.2 M397.8 386.1H802.2";

export default function HeroCourt({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 800" className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0F2347" stopOpacity="0" />
            <stop offset="1" stopColor="#0F2347" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="fade-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F29A2E" stopOpacity="0.35" />
            <stop offset="1" stopColor="#F29A2E" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F29A2E" stopOpacity="0" />
            <stop offset="0.7" stopColor="#F29A2E" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFB14A" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="shadow">
            <stop offset="0" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Piso y zona libre */}
        <path d={FREE} fill="url(#floor)" />
        <path d={FREE} fill="none" stroke="#8FA3BF" strokeOpacity="0.18" strokeWidth="1.5" />

        {/* Líneas de juego */}
        <g fill="none" stroke="url(#fade-far)" strokeLinecap="round" filter="url(#glow)">
          <path d={LINES} strokeWidth="5" pathLength={1} className="court-draw" />
          <path d={ATTACK} strokeWidth="3.5" pathLength={1} className="court-draw" />
          <path d={CENTER} strokeWidth="4" pathLength={1} className="court-draw" />
        </g>

        {/* Red */}
        <g className="net-rise">
          <path d={NET_MESH} stroke="#C9D5E6" strokeOpacity="0.35" strokeWidth="1" fill="none" />
          <path d={NET_TAPE} stroke="#F3F6FB" strokeWidth="4" />
          <path d={POSTS} stroke="#C9D5E6" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Sombra del balón en la cancha */}
        <ellipse cx="760" cy="600" rx="70" ry="16" fill="url(#shadow)" className="shadow-pulse" />

        {/* Estela del balón, como la del logo */}
        <g className="trail-in" fill="none" strokeLinecap="round" stroke="url(#trail)">
          <path d="M210 120 C 420 40, 600 60, 700 205" strokeWidth="26" opacity="0.95" />
          <path d="M260 190 C 450 120, 610 140, 690 245" strokeWidth="16" opacity="0.7" />
          <path d="M330 255 C 480 205, 620 215, 690 280" strokeWidth="9" opacity="0.5" />
        </g>
      </svg>

      {/* Balón flotando sobre la cancha */}
      <div className="absolute left-[56%] top-[14%] w-[22%] ball-in">
        <Volleyball className="w-full h-auto ball-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" id="hero-ball" />
      </div>
    </div>
  );
}
