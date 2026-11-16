// Horario semanal estructurado (respaldo si la pestaña Horarios está vacía). Coincide con CATEGORIES de registration.ts.
// day: 0 = domingo … 6 = sábado. Horas en formato 24 h, hora de Bogotá.

export type Session = {
  day: number;
  start: string;
  end: string;
  group: string;
  sede: string;
};

const POLI = "Polideportivo 3 Canchas";
const QUINTA = "Placa Quinta Linda";
const ECHAVARRIA = "Coliseo Alejandro Echavarría";
const VERACRUZ = "Coliseo Poblado de Veracruz";
const VERGEL = "Coliseo El Vergel";

// Horario real del club (los festivos no se entrena). La pestaña Horarios de la hoja tiene prioridad.
export const SESSIONS: Session[] = [
  { day: 1, start: "16:30", end: "18:00", group: "Infantil", sede: QUINTA },
  { day: 1, start: "19:00", end: "20:30", group: "Libre", sede: POLI },
  { day: 2, start: "16:30", end: "18:00", group: "Infantil", sede: ECHAVARRIA },
  { day: 2, start: "18:00", end: "19:10", group: "Benjamín", sede: QUINTA },
  { day: 2, start: "18:00", end: "19:10", group: "Mini", sede: QUINTA },
  { day: 3, start: "18:00", end: "19:30", group: "Benjamín", sede: VERACRUZ },
  { day: 3, start: "19:00", end: "20:30", group: "Libre", sede: POLI },
  { day: 4, start: "16:30", end: "18:00", group: "Infantil", sede: ECHAVARRIA },
  { day: 4, start: "18:00", end: "19:30", group: "Benjamín", sede: VERACRUZ },
  { day: 4, start: "18:00", end: "19:10", group: "Mini", sede: QUINTA },
  { day: 5, start: "18:00", end: "19:30", group: "Benjamín", sede: VERGEL },
  { day: 5, start: "18:00", end: "19:10", group: "Mini", sede: VERGEL },
  { day: 5, start: "19:00", end: "20:00", group: "Infantil", sede: VERGEL },
  { day: 5, start: "19:00", end: "20:30", group: "Libre", sede: POLI },
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
