"use client";

import React, { useState } from "react";
import { UserCheck, Calendar, Trophy, ChevronRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

export default function RegistrationsPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    experience: "principiante",
    phone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola, quiero inscribirme en el Club Voley Zúñiga. Mis datos:\nNombre: ${formData.name}\nEdad: ${formData.age}\nExperiencia: ${formData.experience}\nTeléfono: ${formData.phone}`;
    window.open(`https://wa.me/573128459210?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-28 pb-20 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm uppercase tracking-wider mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Últimos cupos disponibles
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold uppercase mb-6 text-white">
            Únete al <span className="text-[#F29A2E]">Club</span>
          </h1>
          <p className="text-xl text-white/70">
            Inscripciones abiertas para todas las categorías. Sé parte de la familia Voley Zúñiga y lleva tu nivel al máximo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Formulario */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-[#071426]">
            <h2 className="text-3xl font-heading font-bold uppercase mb-8">Formulario de Pre-inscripción</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F29A2E] focus:ring-2 focus:ring-[#F29A2E]/20 outline-none transition-all"
                  placeholder="Ej. María Pérez"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Edad</label>
                  <input 
                    type="number" 
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F29A2E] focus:ring-2 focus:ring-[#F29A2E]/20 outline-none transition-all"
                    placeholder="Ej. 15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Experiencia</label>
                  <select 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F29A2E] focus:ring-2 focus:ring-[#F29A2E]/20 outline-none transition-all bg-white"
                  >
                    <option value="principiante">Principiante (0 años)</option>
                    <option value="intermedio">Intermedio (1-3 años)</option>
                    <option value="avanzado">Avanzado (+3 años)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Teléfono / WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F29A2E] focus:ring-2 focus:ring-[#F29A2E]/20 outline-none transition-all"
                  placeholder="Ej. 300 123 4567"
                />
              </div>

              <MagneticButton 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-[#F29A2E] hover:bg-[#071426] text-[#071426] hover:text-white transition-colors rounded-xl font-bold uppercase text-lg group"
              >
                Enviar Solicitud <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </form>
          </div>

          {/* Información */}
          <div className="space-y-12">
            <div>
              <div className="w-16 h-16 bg-[#F29A2E]/10 rounded-2xl flex items-center justify-center text-[#F29A2E] mb-6">
                <UserCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4">¿Por qué unirte?</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Contamos con entrenadores certificados, instalaciones de primer nivel y un ambiente que fomenta tanto la competitividad como los valores personales.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-[#F29A2E]/10 rounded-2xl flex items-center justify-center text-[#F29A2E] mb-6">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4">Horarios Flexibles</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Ofrecemos grupos matutinos y vespertinos para que puedas combinar tus estudios o trabajo con el entrenamiento de alto rendimiento.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-[#F29A2E]/10 rounded-2xl flex items-center justify-center text-[#F29A2E] mb-6">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4">Proyección Competitiva</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Nuestros equipos participan en los torneos más importantes de la liga departamental, ofreciendo vitrina para el desarrollo deportivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
