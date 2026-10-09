// Sedes de entrenamiento y competencia.
export const VENUES = [
  {
    id: "polideportivo-3-canchas",
    name: "Polideportivo 3 Canchas",
    role: "Sede principal de entrenamiento",
    address: "Sector Buenos Aires / Alejandro Echavarría, Medellín",
    lat: 6.231821,
    lng: -75.541992,
    schedule: "Martes y jueves de 4:00 PM a 8:30 PM · Sábados de 8:00 AM a 12:00 M",
    description: "Tres canchas reglamentarias, iluminación nocturna y graderías para las familias.",
  },
  {
    id: "yesid-santos",
    name: "Coliseo Yesid Santos",
    role: "Mayores Élite y partidos de liga",
    address: "Unidad Deportiva Atanasio Girardot, Medellín",
    lat: 6.2575,
    lng: -75.5905,
    schedule: "Viernes de 6:00 PM a 8:30 PM · Fines de semana según programación de la liga",
    description: "Escenario de los partidos oficiales de la liga y de las finales de categoría.",
  },
] as const;

export type Venue = (typeof VENUES)[number];

export const mapsLink = (v: Venue) => `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`;
export const wazeLink = (v: Venue) => `https://waze.com/ul?ll=${v.lat},${v.lng}&navigate=yes`;
export const mapEmbed = (v: Venue) => `https://www.google.com/maps?q=${v.lat},${v.lng}&z=15&output=embed`;
