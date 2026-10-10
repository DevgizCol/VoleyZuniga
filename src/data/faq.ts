// Preguntas frecuentes de la portada. También alimentan los datos para buscadores y /llms.txt.
// `priceFrom` es la clave "precio_desde" de Ajustes; si está vacía no se menciona un valor.
export const faqList = (priceFrom: string) => [
  {
    q: "¿Desde qué edad pueden entrar?",
    a: "Desde los 7 años, en Semillero Sub-12. Luego siguen Infantil Sub-14, Menores Sub-16, Juvenil Sub-18 y Mayores Élite, para 18 años en adelante.",
  },
  {
    q: "¿Necesito experiencia para empezar?",
    a: "No. En todas las categorías recibimos personas que nunca han jugado. En la clase de prueba los entrenadores valoran el nivel y te ubican en el grupo adecuado.",
  },
  {
    q: "¿Cómo funciona la clase de prueba?",
    a: "Llenas el formulario de inscripción y te escribimos por WhatsApp para acordar el día. En la clase conoces a los entrenadores y ellos valoran el nivel del deportista, sin compromiso.",
  },
  {
    q: "¿Dónde y cuándo se entrena?",
    a: "En el Polideportivo 3 Canchas (Buenos Aires) y en el Coliseo Yesid Santos (Atanasio Girardot). El horario de cada categoría está en la semana de entrenamientos, más arriba.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: priceFrom
      ? `La clase de prueba no tiene costo. La mensualidad está desde ${priceFrom}; el valor exacto de tu categoría y las formas de pago te los enviamos por WhatsApp cuando confirmamos tu clase.`
      : "La clase de prueba no tiene costo. El valor de la mensualidad y las formas de pago te los enviamos por WhatsApp cuando confirmamos tu clase, para que decidas con toda la información.",
  },
  {
    q: "¿Qué debo llevar el primer día?",
    a: "Ropa deportiva cómoda, tenis con buen agarre para cancha y un termo con agua. La indumentaria oficial se entrega al formalizar la matrícula.",
  },
  {
    q: "¿El club participa en torneos?",
    a: "Sí: Liga de Voleibol de Antioquia, torneos municipales y festivales interclubes. Los partidos programados están en la página de Partidos.",
  },
];
