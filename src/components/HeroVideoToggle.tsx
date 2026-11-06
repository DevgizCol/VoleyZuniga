"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";

type Conn = { saveData?: boolean; effectiveType?: string };

// Controla el video de portada (id="hero-video"): no lo reproduce (ni lo descarga) con "reducir movimiento",
// ahorro de datos o red lenta, y ofrece pausar/reproducir (WCAG 2.2.2).
export default function HeroVideoToggle() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = document.getElementById("hero-video") as HTMLVideoElement | null;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    const lowData = Boolean(conn?.saveData) || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!lowData && !reduceMotion) video.play().catch(() => {});
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const video = document.getElementById("hero-video") as HTMLVideoElement | null;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="absolute bottom-5 right-4 sm:right-6 z-20 h-11 px-4 inline-flex items-center gap-2 rounded-full bg-[#071426]/70 backdrop-blur border border-white/20 text-sm font-semibold text-white hover:bg-[#071426]/90"
    >
      {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
      {playing ? "Pausar video" : "Reproducir video"}
    </button>
  );
}
