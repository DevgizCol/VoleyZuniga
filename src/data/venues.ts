// Escenarios de entrenamiento del club (Medellín). Direcciones confirmadas por el club o el INDER;
// los mapas buscan por nombre y dirección (sin coordenadas fijas).
export const VENUES = [
  {
    id: "polideportivo-3-canchas",
    name: "Polideportivo 3 Canchas",
    role: "Categoría Libre",
    address: "Carrera 15 # 46-70, Bombona II (Buenos Aires), Medellín",
    schedule: "Lunes, miércoles y viernes de 7:00 PM a 8:30 PM",
    description: "Escenario de la categoría Libre (18 años en adelante).",
  },
  {
    id: "placa-quinta-linda",
    name: "Placa Quinta Linda",
    role: "Infantil, Benjamín y Mini",
    address: "Calle 36C con Carrera 15AA, barrio Quinta Linda (Buenos Aires), Medellín",
    schedule: "Lunes 4:30 PM a 6:00 PM · Martes y jueves 6:00 PM a 7:10 PM",
    description: "Placa polideportiva Quinta Linda, en la comuna 9 (Buenos Aires).",
  },
  {
    id: "coliseo-alejandro-echavarria",
    name: "Coliseo Alejandro Echavarría",
    role: "Categoría Infantil",
    address: "Parque Deportivo Alejandro Echavarría, Calle 50 # 14C-43 (Buenos Aires), Medellín",
    schedule: "Martes y jueves de 4:30 PM a 6:00 PM",
    description: "Cancha cubierta del parque deportivo Alejandro Echavarría, comuna 9 (Buenos Aires).",
  },
  {
    id: "coliseo-poblado-veracruz",
    name: "Coliseo Poblado de Veracruz",
    role: "Categoría Benjamín",
    address: "Carrera 6AB # 47A-99, vía Santa Elena (Buenos Aires), Medellín",
    schedule: "Miércoles y jueves de 6:00 PM a 7:30 PM",
    description: "Escenario de la categoría Benjamín a mitad de semana.",
  },
  {
    id: "placa-el-vergel",
    name: "Placa El Vergel",
    role: "Benjamín, Mini e Infantil",
    address: "Calle 45, Bombona II (Buenos Aires), Medellín",
    schedule: "Viernes de 6:00 PM a 8:00 PM",
    description: "Placa polideportiva El Vergel: los viernes entrenan aquí Benjamín, Mini e Infantil.",
  },
] as const;

export type Venue = (typeof VENUES)[number];

const query = (v: Venue) => encodeURIComponent(`${v.name}, ${v.address}`);
export const mapsLink = (v: Venue) => `https://www.google.com/maps/search/?api=1&query=${query(v)}`;
export const wazeLink = (v: Venue) => `https://waze.com/ul?q=${query(v)}&navigate=yes`;
export const mapEmbed = (v: Venue) => `https://www.google.com/maps?q=${query(v)}&z=15&output=embed`;
