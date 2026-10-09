"use client";

import { useEffect, useRef } from "react";
import type { JerseySide, JerseyVariant } from "@/data/store3d";
import { createStage, type Stage } from "./stage";

// Lienzo WebGL con la camiseta en 3D. Se carga solo en el navegador (ver ProductViewer).

export default function Product3D({
  name,
  number,
  variant,
  side,
  onSideChange,
  onReady,
  onError,
  className = "",
}: {
  name: string;
  number: string;
  variant: JerseyVariant;
  side: JerseySide;
  onSideChange: (side: JerseySide) => void;
  onReady: () => void;
  onError: () => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  // Lado que la escena ya está mostrando: evita que un giro hecho con el dedo "rebote" al avisarle al padre.
  const shownSide = useRef(side);
  const latest = useRef({ name, number, variant, onSideChange, onReady, onError });

  useEffect(() => {
    latest.current = { name, number, variant, onSideChange, onReady, onError };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let stage: Stage;
    try {
      const { name, number, variant } = latest.current;
      stage = createStage(canvas, {
        print: { name, number, variant },
        side: shownSide.current,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        onSideChange: (s) => {
          shownSide.current = s;
          latest.current.onSideChange(s);
        },
      });
    } catch {
      latest.current.onError();
      return;
    }
    stageRef.current = stage;
    latest.current.onReady();
    const onLost = (e: Event) => {
      e.preventDefault();
      latest.current.onError();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    // Redibuja cuando la fuente del club termine de cargar, para que el nombre no salga en Arial.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) stage.setPrint({ name: latest.current.name, number: latest.current.number, variant: latest.current.variant });
    });
    return () => {
      alive = false;
      canvas.removeEventListener("webglcontextlost", onLost);
      stage.dispose();
      stageRef.current = null;
    };
  }, []);

  useEffect(() => {
    stageRef.current?.setPrint({ name, number, variant });
  }, [name, number, variant]);

  useEffect(() => {
    if (side === shownSide.current) return;
    shownSide.current = side;
    stageRef.current?.showSide(side);
  }, [side]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      stageRef.current?.rotateBy(e.key === "ArrowLeft" ? -Math.PI / 4 : Math.PI / 4);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      role="img"
      aria-label={`Camiseta ${variant === "home" ? "titular" : "de líbero"} en 3D, vista ${side === "back" ? "trasera" : "frontal"}. Arrastra o usa las flechas para girarla.`}
      onKeyDown={onKeyDown}
      className={`${className} touch-pan-y cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F29A2E] rounded-3xl`}
    />
  );
}
