// Horario semanal estructurado. Coincide con HORARIOS y CATEGORIES de registration.ts.
// day: 0 = domingo … 6 = sábado. Horas en formato 24 h, hora de Bogotá.

export type Session = {
  day: number;
  start: string;
  end: string;
  group: string;
  sede: string;
};

const POLI = "Polideportivo 3 Canchas";
const COLISEO = "Coliseo Yesid Santos";

export const SESSIONS: Session[] = [
  ...[2, 4].flatMap((day) => [
    { day, start: "16:00", end: "17:30", group: "Semillero Sub-12", sede: POLI },
    { day, start: "17:30", end: "19:00", group: "Infantil Sub-14", sede: POLI },
    { day, start: "19:00", end: "20:30", group: "Menores Sub-16 y Juvenil Sub-18", sede: POLI },
  ]),
  { day: 5, start: "18:00", end: "20:30", group: "Mayores Élite", sede: COLISEO },
  { day: 6, start: "08:00", end: "12:00", group: "Sábado intensivo", sede: POLI },
];

export const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (h === 12 && m === 0) return "12:00 M";
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const TRAINING_DAYS = Array.from(new Set(SESSIONS.map((s) => s.day))).sort();
