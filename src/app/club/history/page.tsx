import React from "react";
import Image from "next/image";
import { Trophy, Users, Target, Heart } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="pt-28 pb-20 bg-white min-h-screen text-[#0F2347]">
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-heading font-bold uppercase mb-6 text-[#071426]">
              Nuestra <span className="text-[#F29A2E]">Historia</span>
            </h1>
            <p className="text-xl text-[#64748B] mb-6 leading-relaxed">
              El Club Deportivo Voley Zúñiga nació de la pasión por el voleibol y el deseo de construir un espacio de formación integral en Medellín.
            </p>
            <p className="text-[#64748B] leading-relaxed">
              A lo largo de los años, hemos crecido de ser un pequeño grupo de entusiastas a convertirnos en una institución referente en la región, participando en ligas locales, departamentales y nacionales, siempre llevando en alto nuestros valores de respeto, disciplina y amor por el deporte.
            </p>
          </div>
          <div className="md:w-1/2 relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Using a placeholder or an external image for now */}
            <div className="absolute inset-0 bg-[#071426]/20 z-10 mix-blend-multiply"></div>
            <Image 
              src="https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop" 
              alt="Historia del Club" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Valores Section */}
      <div className="bg-[#071426] py-20 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold uppercase text-center mb-16">Nuestros Pilares</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#F29A2E] transition-colors">
              <Trophy size={40} className="text-[#F29A2E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 uppercase">Excelencia</h3>
              <p className="text-white/70">Buscamos el máximo rendimiento deportivo, técnico y táctico en cada entrenamiento y competición.</p>
            </div>
            
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#F29A2E] transition-colors">
              <Users size={40} className="text-[#F29A2E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 uppercase">Compañerismo</h3>
              <p className="text-white/70">Fomentamos el trabajo en equipo, la solidaridad y el apoyo mutuo dentro y fuera de la cancha.</p>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#F29A2E] transition-colors">
              <Target size={40} className="text-[#F29A2E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 uppercase">Disciplina</h3>
              <p className="text-white/70">El compromiso, la puntualidad y el esfuerzo constante son innegociables en nuestro club.</p>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#F29A2E] transition-colors">
              <Heart size={40} className="text-[#F29A2E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 uppercase">Pasión</h3>
              <p className="text-white/70">Amamos el voleibol y transmitimos esa energía y entusiasmo a las nuevas generaciones.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof / Estadísticas */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-heading font-bold text-[#F29A2E] mb-2">+500</div>
              <div className="text-[#071426] font-bold uppercase tracking-wider text-sm">Deportistas Formados</div>
            </div>
            <div>
              <div className="text-5xl font-heading font-bold text-[#F29A2E] mb-2">+15</div>
              <div className="text-[#071426] font-bold uppercase tracking-wider text-sm">Títulos Obtenidos</div>
            </div>
            <div>
              <div className="text-5xl font-heading font-bold text-[#F29A2E] mb-2">10</div>
              <div className="text-[#071426] font-bold uppercase tracking-wider text-sm">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-5xl font-heading font-bold text-[#F29A2E] mb-2">4</div>
              <div className="text-[#071426] font-bold uppercase tracking-wider text-sm">Sedes de Entrenamiento</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
