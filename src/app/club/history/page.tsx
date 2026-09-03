import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Award, Target, Flame, ChevronRight, Sparkles, Compass } from "lucide-react";

export default function HistoryPage() {
  const stages = [
    {
      step: "01",
      title: "Semillero de Iniciación",
      age: "8 a 11 Años",
      focus: "Psicomotricidad, Control Óculo-Manual & Disciplina Básica",
      desc: "El primer contacto con el balón. Priorizamos la diversión técnica, la postura corporal, el compañerismo y el amor incondicional por la disciplina deportiva.",
      badge: "Formación Temprana"
    },
    {
      step: "02",
      title: "Desarrollo Táctico & Fuerza",
      age: "12 a 14 Años",
      focus: "Biomecánica de Salto, Batida de Remate & Lectura de Bloqueo",
      desc: "Introducción a los sistemas de juego 5-1 y 4-2. Entrenamiento pliométrico seguro para aumentar la suspensión vertical y perfeccionar la precisión en el saque.",
      badge: "Especialización"
    },
    {
      step: "03",
      title: "Alta Competencia Departamental",
      age: "15 a 18 Años",
      focus: "Liga Antioqueña de Voleibol & Festivales Nacionales",
      desc: "Nuestros equipos compiten al más alto nivel competitivo en los coliseos de Medellín y el país. Enfoque en resiliencia mental, toma de decisiones bajo presión y liderazgo en cancha.",
      badge: "Competencia Élite"
    },
    {
      step: "04",
      title: "Proyección & Becas Deportivas",
      age: "Mayores / Egresados",
      focus: "Becas Universitarias & Selección Departamental",
      desc: "Acompañamos a nuestros atletas destacados para postularse a becas deportivas universitarias en Colombia y el exterior, manteniendo viva la red de egresados de la familia Zúñiga.",
      badge: "Futuro & Éxito"
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#071426] min-h-screen text-white">
      {/* 1. Header Hero */}
      <div className="container mx-auto px-6 mb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
            <Compass size={14} />
            <span>Nuestra Trayectoria & Filosofía</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Una Década Forjando <span className="text-[#F29A2E]">Campeones</span> en Medellín
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-sans leading-relaxed">
            El Club Deportivo Voley Zúñiga nació con una convicción inquebrantable: el voleibol es la herramienta más poderosa para forjar jóvenes disciplinados, competitivos y con valores a prueba de fuego.
          </p>
        </div>
      </div>

      {/* 2. Path to Glory (Timeline Inmersivo) */}
      <section className="py-16 bg-[#0B1E38]/50 border-y border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#F29A2E] text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles size={14} />
              <span>Metodología Progresiva</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-4">
              Path to Glory: El Camino del Atleta
            </h2>
            <p className="text-gray-400 font-sans text-base">
              Así es como acompañamos el crecimiento atlético y humano de cada deportista desde que pisa la cancha por primera vez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {stages.map((stage, idx) => (
              <div 
                key={idx}
                className="relative p-8 rounded-3xl bg-[#071426] border border-white/10 hover:border-[#F29A2E]/50 transition-all duration-300 group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-heading font-bold text-white/20 group-hover:text-[#F29A2E] transition-colors">
                      {stage.step}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[11px] font-bold tracking-wider uppercase text-gray-300">
                      {stage.age}
                    </span>
                  </div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-[#F29A2E]/10 text-[#F29A2E] text-[10px] font-bold uppercase tracking-wider mb-3">
                    {stage.badge}
                  </div>
                  <h3 className="text-2xl font-heading font-bold uppercase text-white mb-3 group-hover:text-[#F29A2E] transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-4">
                    {stage.focus}
                  </p>
                  <p className="text-gray-400 font-sans text-sm leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Valores Inquebrantables */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
            Nuestros Cuatro Pilares Éticos
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-sans">
            La técnica se entrena con repetición; el carácter se forja con valores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PillarCard 
            icon={<Trophy size={32} className="text-[#F29A2E]" />}
            title="Excelencia"
            desc="Exigimos el 100% de compromiso tanto en una práctica de lunes como en la final de un campeonato."
          />
          <PillarCard 
            icon={<Target size={32} className="text-[#F29A2E]" />}
            title="Disciplina"
            desc="Puntualidad rigurosa, respeto al uniforme y constancia. El talento sin disciplina no llega a la meta."
          />
          <PillarCard 
            icon={<Award size={32} className="text-[#F29A2E]" />}
            title="Humildad"
            desc="Celebramos la victoria con respeto hacia el rival y asumimos la derrota como el maestro más valioso."
          />
          <PillarCard 
            icon={<Flame size={32} className="text-[#F29A2E]" />}
            title="Identidad Zúñiga"
            desc="Pasión innegociable por la camiseta. En cada bloqueo y cada remate se deja el corazón en la cancha."
          />
        </div>

        {/* CTA a Inscripciones */}
        <div className="mt-20 p-10 md:p-12 rounded-3xl bg-gradient-to-r from-[#0B1E38] to-[#071426] border border-[#F29A2E]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-2">
              ¿Quieres ser parte de esta historia?
            </h3>
            <p className="text-gray-300 font-sans text-sm md:text-base max-w-xl">
              Abiertas inscripciones para niños, niñas y jóvenes desde los 8 años en nuestras sedes de Medellín.
            </p>
          </div>
          <Link
            href="/registrations"
            className="px-8 py-4 bg-[#F29A2E] text-[#071426] hover:bg-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shrink-0"
          >
            Inscribirse al Club
          </Link>
        </div>
      </section>
    </div>
  );
}

function PillarCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-300 flex flex-col justify-between group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-heading font-bold uppercase text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-400 font-sans text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

