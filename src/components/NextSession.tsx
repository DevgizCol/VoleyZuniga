"use client";

import { useSyncExternalStore } from "react";
import { DAY_NAMES, formatTime, type Session } from "@/data/schedule";

// Hora actual en Bogotá como { day, minutes }.
function bogotaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

function nextSession(SESSIONS: Session[]): { s: Session; live: boolean; inDays: number } | null {
  const now = bogotaNow();
  for (let offset = 0; offset < 8; offset++) {
    const day = (now.day + offset) % 7;
    const today = SESSIONS.filter((s) => s.day === day).sort((a, b) => toMin(a.start) - toMin(b.start));
    for (const s of today) {
      if (offset === 0 && toMin(s.end) <= now.minutes) continue;
      return { s, live: offset === 0 && toMin(s.start) <= now.minutes, inDays: offset };
    }
  }
  return null;
}

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

export default function NextSession({ sessions }: { sessions: Session[] }) {
  // Se calcula solo en el navegador (minuto a minuto) para no fijar la hora del servidor.
  const key = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 60_000), () => 0);
  if (key === 0) return <div className="h-[132px]" />;
  const next = nextSession(sessions);
  if (!next) return null;
  const { s, live, inDays } = next;
  const when = live ? "En la cancha ahora" : inDays === 0 ? "Hoy" : inDays === 1 ? "Mañana" : DAY_NAMES[s.day];

  return (
    <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-white/15 bg-[#071426]/70 backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
      <div className="w-1.5 bg-[#F29A2E]" />
      <div className="p-5 flex-1">
        <p className="flex items-center gap-2 text-sm text-[#B7C4D8]">
          {live ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#25D366]" />
            </span>
          ) : null}
          Próximo entrenamiento
        </p>
        <p className="font-heading font-extrabold text-3xl text-white mt-1">
          {when} · {formatTime(s.start)}
        </p>
        <p className="text-[#C9D5E6] text-sm mt-1">
          {s.group} — {s.sede}
        </p>
      </div>
    </div>
  );
}
