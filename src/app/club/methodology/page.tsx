import React from "react";
import Link from "next/link";
import { Dumbbell, ShieldCheck, Activity, Brain, CheckCircle2, Flame, ArrowRight, Zap, Target } from "lucide-react";

export default function MethodologyPage() {
  const pillars = [
    {
      icon: <Dumbbell size={28} className="text-[#F29A2E]" />,
      number: "01",
      title: "Preparación Física & Pliometría",
      subtitle: "Salto Vertical, Velocidad de Reacción & Prevención",
      desc: "Diseñamos planes de acondicionamiento físico adaptados a la madurez ósea y muscular de cada categoría. Fortalecemos tobillos, rodillas y manguito rotador para maximizar la suspensión y evitar lesiones por sobrecarga.",
      metrics: ["+12cm promedio en salto vertical", "Fuerza de core y potencia de tren inferior", "Rutinas de estiramiento miofascial"]
    },
    {
      icon: <Activity size={28} className="text-[#F29A2E]" />,
      number: "02",
      title: "Técnica Depurada & Sistemas Tácticos",
      subtitle: "Batida, Armado, Cobertura & Lectura de Bloqueo",
      desc: "Enseñamos los fundamentos del voleibol moderno internacional. Dominio de sistemas tácticos (5-1 y 4-2), precisión milimétrica en el pase de antebrazo y variantes de ataque por las bandas y zona zaguera.",
      metrics: ["Corrección visual de mecánica de golpeo", "Entrenamiento de saque flotante y potencia", "Transiciones rápidas defensa-ataque"]
    },
    {
      icon: <Brain size={28} className="text-[#F29A2E]" />,
      number: "03",
      title: "Fortaleza Mental & Toma de Decisiones",
      subtitle: "Manejo de la Presión & Enfoque en Puntos Críticos",
      desc: "Un partido de voleibol se gana en la mente. Preparamos a los deportistas para mantener la calma en los momentos decisivos del set, superar errores no forzados al instante y comunicarse asertivamente bajo tensión.",
      metrics: ["Rutinas de respiración y reseteo mental", "Liderazgo y lenguaje corporal positivo", "Cero tolerancia a la frustración destructiva"]
    },
    {
      icon: <ShieldCheck size={28} className="text-[#F29A2E]" />,
      number: "04",
      title: "Código de Honor & Compromiso Escolar",
      subtitle: "Disciplina, Convivencia & Formación de Carácter",
      desc: "Nuestros atletas son estudiantes primero. Exigimos puntualidad estricta (15 minutos antes en cancha), pulcritud en el uniforme oficial, respeto absoluto por árbitros y rivales, y un boletín académico sobresaliente.",
      metrics: ["Asistencia y puntualidad rigurosa", "Monitoreo del rendimiento académico escolar", "Sentido de pertenencia y cuidado de la sede"]
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
            <Zap size={14} />
            <span>Ciencia Deportiva & Pedagogía</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight mb-6 text-white">
            Nuestra <span className="text-[#F29A2E]">Metodología</span> de Alto Rendimiento
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-sans leading-relaxed">
            Un sistema integral probado durante más de una década en Antioquia, donde la técnica de élite y los valores humanos se fusionan en cada sesión de entrenamiento.
          </p>
        </div>

        {/* 4 Pilares Infografía Interactiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {pillars.map((p, idx) => (
            <div 
              key={idx}
              className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0B1E38] to-[#071426] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-300 shadow-2xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {p.icon}
                  </div>
                  <span className="font-heading font-bold text-4xl text-white/15 group-hover:text-[#F29A2E] transition-colors">
                    {p.number}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-2 group-hover:text-[#F29A2E] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-[#F29A2E] mb-4">
                  {p.subtitle}
                </p>
                <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-6">
                  {p.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2.5">
                {p.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-2.5 text-xs text-gray-400 font-sans">
                    <CheckCircle2 size={15} className="text-[#F29A2E] shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tabla Comparativa de Carga Deportiva y Horas Semanales */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-3">
              Carga Deportiva & Horas Semanales
            </h2>
            <p className="text-gray-400 font-sans text-sm md:text-base">
              Estructura de entrenamiento diseñada para optimizar el rendimiento sin provocar saturación escolar.
            </p>
          </div>

          <div className="rounded-3xl bg-[#0B1E38] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-sm">
                <thead>
                  <tr className="bg-[#071426] text-gray-400 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider">
                    <th className="py-5 px-6">Categoría</th>
                    <th className="py-5 px-6">Rango de Edad</th>
                    <th className="py-5 px-6 text-center text-[#F29A2E] font-bold">Horas / Sem</th>
                    <th className="py-5 px-6">Enfoque Físico</th>
                    <th className="py-5 px-6">Enfoque Táctico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 font-heading font-bold text-lg text-white">Semillero Mini-Voley</td>
                    <td className="py-5 px-6 text-gray-300 font-mono text-xs">7 a 10 Años</td>
                    <td className="py-5 px-6 text-center font-heading font-bold text-xl text-[#F29A2E]">4h</td>
                    <td className="py-5 px-6 text-gray-400 text-xs">Psicomotricidad & Juegos de Reacción</td>
                    <td className="py-5 px-6 text-gray-400 text-xs">Contacto con balón (dedos/antebrazos)</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 font-heading font-bold text-lg text-white">Menores Formativo</td>
                    <td className="py-5 px-6 text-gray-300 font-mono text-xs">11 a 14 Años</td>
                    <td className="py-5 px-6 text-center font-heading font-bold text-xl text-[#F29A2E]">6h</td>
                    <td className="py-5 px-6 text-gray-400 text-xs">Pliometría base & Fortalecimiento Core</td>
                    <td className="py-5 px-6 text-gray-400 text-xs">Sistema 4-2, batida y bloqueo simple</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 font-heading font-bold text-lg text-white">Juvenil Competencia</td>
                    <td className="py-5 px-6 text-gray-300 font-mono text-xs">15 a 18 Años</td>
                    <td className="py-5 px-6 text-center font-heading font-bold text-xl text-[#F29A2E]">8h a 10h</td>
                    <td className="py-5 px-6 text-gray-400 text-xs">Potencia, salto vertical máximo & prevención</td>
                    <td className="py-5 px-6 text-gray-400 text-xs">Sistema 5-1 de Liga, lectura de bloqueo</td>
                  </tr>
                  <tr className="bg-[#F29A2E]/5 border-l-4 border-[#F29A2E]">
                    <td className="py-5 px-6 font-heading font-bold text-lg text-[#F29A2E]">Selección Élite Liga</td>
                    <td className="py-5 px-6 text-gray-300 font-mono text-xs">Sub-18 / Mayores</td>
                    <td className="py-5 px-6 text-center font-heading font-bold text-2xl text-[#F29A2E]">12h</td>
                    <td className="py-5 px-6 text-gray-300 text-xs">Acondicionamiento de alto rendimiento</td>
                    <td className="py-5 px-6 text-gray-300 text-xs">Videoanálisis, scouting rival y partidos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Manual de Convivencia y Compromiso */}
        <div className="p-10 md:p-14 rounded-3xl bg-[#0B1E38] border border-white/10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-2">
              <span className="text-[#F29A2E] font-mono text-xs uppercase font-bold tracking-widest block mb-2">
                Documento Oficial Institucional
              </span>
              <h3 className="text-3xl md:text-4xl font-heading font-bold uppercase mb-4 text-white">
                Manual de Convivencia & Código de Honor
              </h3>
              <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-6">
                Todos nuestros atletas y padres de familia firman y acatan nuestro decálogo de convivencia: cero tolerancia al bullying, respeto irrestricto por los jueces y cuerpo técnico, y compromiso con la excelencia académica en sus colegios.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <a
                  href="/logo.svg"
                  download="Manual_de_Convivencia_Club_Voley_Zuniga_2026.pdf"
                  className="px-6 py-3.5 bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Target size={16} />
                  <span>Descargar Manual de Convivencia (PDF)</span>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <h4 className="text-white font-bold text-sm mb-1">1. Puntualidad de 15 Minutos</h4>
                <p className="text-xs text-gray-400">Llegar con anticipación para calentar previene el 80% de lesiones articulares.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <h4 className="text-white font-bold text-sm mb-1">2. Uniformidad Rigurosa</h4>
                <p className="text-xs text-gray-400">Camiseta de entrenamiento oficial y rodilleras obligatorias en todas las sesiones.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <h4 className="text-white font-bold text-sm mb-1">3. Prioridad Académica</h4>
                <p className="text-xs text-gray-400">El deporte complementa los estudios; buen promedio escolar para competir.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <h4 className="text-white font-bold text-sm mb-1">4. Cultura de Escenario</h4>
                <p className="text-xs text-gray-400">Armado y desarmado de redes y recolección de balones en equipo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

