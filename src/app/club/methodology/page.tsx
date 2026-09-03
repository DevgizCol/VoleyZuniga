import React from "react";
import { Dumbbell, ShieldCheck, Activity, Brain } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="pt-28 pb-20 bg-[#F7F8FA] min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-heading font-bold uppercase mb-4 text-[#071426] text-center">
          Metodología y <span className="text-[#F29A2E]">Normas</span>
        </h1>
        <p className="text-xl text-[#64748B] mb-16 text-center max-w-3xl mx-auto">
          Nuestro enfoque se basa en el desarrollo integral del deportista. No solo formamos excelentes jugadores de voleibol, sino también grandes seres humanos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Metodología */}
          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-heading font-bold uppercase mb-8 border-b-2 border-[#F29A2E] inline-block pb-2">Sistema de Entrenamiento</h2>
            
            <ul className="space-y-8">
              <li className="flex gap-4">
                <div className="mt-1 w-12 h-12 bg-[#071426]/5 rounded-xl flex items-center justify-center text-[#F29A2E] flex-shrink-0">
                  <Dumbbell size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-[#071426]">Preparación Física Integral</h4>
                  <p className="text-[#64748B]">Rutinas específicas para potenciar salto, velocidad, fuerza y prevención de lesiones, adaptadas a cada categoría.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 w-12 h-12 bg-[#071426]/5 rounded-xl flex items-center justify-center text-[#F29A2E] flex-shrink-0">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-[#071426]">Técnica y Táctica Avanzada</h4>
                  <p className="text-[#64748B]">Desarrollo de fundamentos técnicos, lectura de juego y estrategias colectivas basadas en voleibol moderno.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 w-12 h-12 bg-[#071426]/5 rounded-xl flex items-center justify-center text-[#F29A2E] flex-shrink-0">
                  <Brain size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-[#071426]">Fortalecimiento Mental</h4>
                  <p className="text-[#64748B]">Trabajo en manejo de presión, concentración, liderazgo y resiliencia ante situaciones adversas en la cancha.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Normas y Convivencia */}
          <div className="bg-[#071426] p-10 rounded-3xl shadow-xl text-white">
            <h2 className="text-3xl font-heading font-bold uppercase mb-8 border-b-2 border-[#F29A2E] inline-block pb-2">Manual de Convivencia</h2>
            
            <div className="space-y-6 text-white/80">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[#F29A2E] mt-1 flex-shrink-0" />
                <p><strong>Puntualidad:</strong> La llegada a los entrenamientos y partidos debe ser con al menos 15 minutos de anticipación.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[#F29A2E] mt-1 flex-shrink-0" />
                <p><strong>Uniformidad:</strong> Es obligatorio el uso de la indumentaria oficial del club en todos los eventos y prácticas.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[#F29A2E] mt-1 flex-shrink-0" />
                <p><strong>Respeto:</strong> Trato cordial y respetuoso hacia compañeros, cuerpo técnico, rivales y árbitros.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[#F29A2E] mt-1 flex-shrink-0" />
                <p><strong>Compromiso Académico:</strong> Exigimos a nuestras categorías formativas mantener un buen rendimiento escolar como requisito para competir.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[#F29A2E] mt-1 flex-shrink-0" />
                <p><strong>Cuidado de Material:</strong> Responsabilidad compartida en el armado, desarmado y cuidado de la red, balones y escenario deportivo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
