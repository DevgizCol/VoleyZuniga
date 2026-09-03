import React from "react";
import CinematicHero from "@/components/CinematicHero";
import InteractiveBall3D from "@/components/InteractiveBall3D";
import { Users, Trophy, Target, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Cinematic Dark Navy Hero */}
      <CinematicHero />

      {/* Titanium White Content Section */}
      <section className="w-full bg-[#F7F8FA] py-24 text-[#0F2347]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase mb-6">
              El Club de la Excelencia
            </h2>
            <p className="text-xl text-[#64748B] max-w-3xl mx-auto font-sans leading-relaxed">
              No es solo voleibol. Es disciplina, pasión y una mentalidad implacable. 
              Únete al equipo que está redefiniendo el estándar deportivo en Medellín.
            </p>
          </div>

          {/* Estadísticas Animadas (Brutalist style) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard icon={<Users size={32} />} number="+500" label="Deportistas" />
            <StatCard icon={<Star size={32} />} number="+17" label="Años" />
            <StatCard icon={<Trophy size={32} />} number="+85" label="Torneos" />
            <StatCard icon={<Target size={32} />} number="+25" label="Títulos" />
          </div>
        </div>
      </section>

      {/* 3D Interactive Section */}
      <InteractiveBall3D />

      {/* Footer Minimalista */}
      <footer className="w-full bg-[#0F2347] text-white py-12 text-center">
        <h2 className="font-heading text-3xl uppercase tracking-wider mb-4">Voley Zúñiga</h2>
        <p className="text-[#9AA4B2] text-sm">© 2026 Club Voley Zúñiga. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

function StatCard({ icon, number, label }: { icon: React.ReactNode, number: string, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-[#0F2347]/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
      <div className="text-[#F29A2E] mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-5xl font-heading font-bold text-[#0F2347] mb-2">{number}</h3>
      <p className="text-sm font-sans font-medium text-[#64748B] uppercase tracking-wider">{label}</p>
    </div>
  );
}
