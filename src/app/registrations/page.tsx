"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserCheck, Calendar, Trophy, ChevronRight, Sparkles, QrCode, Shield, Check, MessageCircle, HelpCircle } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

export default function RegistrationsPage() {
  const [formData, setFormData] = useState({
    name: "Tu Nombre Aquí",
    age: "14",
    category: "Sub-16 Menores",
    level: "Competitivo",
    phone: "",
    sede: "Polideportivo 3 Canchas"
  });

  // 2-Click Assistant State
  const [quizAge, setQuizAge] = useState<number>(13);
  const [quizGoal, setQuizGoal] = useState<"iniciacion" | "competencia">("competencia");

  const getRecommendedCategory = () => {
    if (quizAge <= 11) return { cat: "Semillero Sub-12", schedule: "Mar y Jue: 4:00 PM - 5:30 PM", sede: "Polideportivo 3 Canchas" };
    if (quizAge <= 14) return { cat: "Infantil Sub-14", schedule: "Lun, Mié y Vie: 4:30 PM - 6:30 PM", sede: "Polideportivo 3 Canchas" };
    if (quizAge <= 16) return { cat: "Menores Sub-16", schedule: "Lun a Jue: 6:00 PM - 8:00 PM", sede: "Polideportivo 3 Canchas / Yesid Santos" };
    return { cat: "Juvenil / Mayores Sub-18+", schedule: "Lun a Vie: 6:30 PM - 8:30 PM", sede: "Coliseo Yesid Santos" };
  };

  const recommendation = getRecommendedCategory();

  const handleApplyRecommendation = () => {
    setFormData({
      ...formData,
      age: quizAge.toString(),
      category: recommendation.cat,
      level: quizGoal === "iniciacion" ? "Iniciación Formativa" : "Alta Competencia",
      sede: recommendation.sede
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `🏐 *SOLICITUD DE INSCRIPCIÓN - CLUB VOLEY ZÚÑIGA*\n\n` +
      `👤 *Atleta:* ${formData.name}\n` +
      `🎂 *Edad:* ${formData.age} años\n` +
      `🏅 *Categoría Carnet:* ${formData.category}\n` +
      `⚡ *Nivel:* ${formData.level}\n` +
      `📍 *Sede de Preferencia:* ${formData.sede}\n` +
      `📱 *Contacto WhatsApp:* ${formData.phone}\n\n` +
      `_He generado mi Carnet Digital VIP desde voleyzuniga.com y deseo confirmar disponibilidad de cupo._`;

    window.open(`https://wa.me/573128459210?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6 animate-pulse">
            <Sparkles size={14} />
            <span>Temporada Oficial 2026 • Cupos Limitados</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Pase Oficial de <span className="text-[#F29A2E]">Admisión</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-sans leading-relaxed">
            Ingresa los datos del deportista para previsualizar en tiempo real el Carnet Oficial del Club y reservar tu cupo con prioridad para pruebas técnicas.
          </p>
        </div>

        {/* 1. Asistente Inteligente de Categoría (2 Clics) */}
        <div className="mb-20 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0B1E38] to-[#071426] border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F29A2E] uppercase tracking-wider mb-2">
                <HelpCircle size={14} />
                <span>Asistente para Padres & Atletas</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white">
                ¿No estás seguro de tu categoría? Encuéntrala en 2 clics
              </h3>
            </div>
            <button
              onClick={handleApplyRecommendation}
              className="px-6 py-3 bg-white/10 hover:bg-[#F29A2E] hover:text-[#071426] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 shrink-0"
            >
              Aplicar esta categoría al Carnet
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Paso 1: Edad */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <label className="block text-xs uppercase font-bold text-gray-400 mb-3">1. Edad del deportista: <span className="text-[#F29A2E] text-base font-heading font-bold ml-1">{quizAge} años</span></label>
              <input 
                type="range" 
                min="8" 
                max="22" 
                value={quizAge}
                onChange={(e) => setQuizAge(parseInt(e.target.value))}
                className="w-full accent-[#F29A2E] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-2">
                <span>8 años (Iniciación)</span>
                <span>22+ años (Mayores)</span>
              </div>
            </div>

            {/* Paso 2: Objetivo */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <label className="block text-xs uppercase font-bold text-gray-400 mb-3">2. Nivel de Experiencia:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuizGoal("iniciacion")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    quizGoal === "iniciacion"
                      ? "bg-[#F29A2E] text-[#071426]"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Iniciación / Formativo
                </button>
                <button
                  type="button"
                  onClick={() => setQuizGoal("competencia")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    quizGoal === "competencia"
                      ? "bg-[#F29A2E] text-[#071426]"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  Alta Competencia
                </button>
              </div>
            </div>

            {/* Resultado */}
            <div className="p-5 rounded-2xl bg-[#F29A2E]/10 border border-[#F29A2E]/30">
              <span className="text-[10px] uppercase tracking-widest text-[#F29A2E] font-bold block mb-1">Categoría Recomendada:</span>
              <h4 className="text-xl font-heading font-bold text-white uppercase mb-1">
                {recommendation.cat}
              </h4>
              <p className="text-xs text-gray-300 font-sans">
                {recommendation.schedule} • {recommendation.sede}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Carnet VIP Simulator & Formulario */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Formulario (Col 5) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#0B1E38] to-[#071426] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-heading font-bold uppercase mb-6 flex items-center gap-3 text-white">
              <span>Personaliza tu Ficha de Admisión</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nombre y Apellido del Deportista</label>
                <input 
                  type="text" 
                  required
                  value={formData.name === "Tu Nombre Aquí" ? "" : formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value || "Tu Nombre Aquí"})}
                  placeholder="Ej. Valentina Morales"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] focus:ring-1 focus:ring-[#F29A2E] outline-none transition-all font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Edad</label>
                  <input 
                    type="number" 
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="14"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] focus:ring-1 focus:ring-[#F29A2E] outline-none transition-all font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Categoría</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0B1E38] border border-white/10 text-white focus:border-[#F29A2E] outline-none transition-all font-sans text-sm"
                  >
                    <option value="Semillero Sub-12">Semillero Sub-12 (8-11 años)</option>
                    <option value="Infantil Sub-14">Infantil Sub-14 (12-13 años)</option>
                    <option value="Menores Sub-16">Menores Sub-16 (14-15 años)</option>
                    <option value="Juvenil Sub-18">Juvenil Sub-18 (16-17 años)</option>
                    <option value="Mayores Élite">Mayores Élite (18+ años)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nivel</label>
                  <select 
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0B1E38] border border-white/10 text-white focus:border-[#F29A2E] outline-none transition-all font-sans text-sm"
                  >
                    <option value="Iniciación Formativa">Iniciación Formativa</option>
                    <option value="Intermedio en Desarrollo">Intermedio en Desarrollo</option>
                    <option value="Alta Competencia">Alta Competencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sede Preferida</label>
                  <select 
                    value={formData.sede}
                    onChange={(e) => setFormData({...formData, sede: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0B1E38] border border-white/10 text-white focus:border-[#F29A2E] outline-none transition-all font-sans text-sm"
                  >
                    <option value="Polideportivo 3 Canchas">Polideportivo 3 Canchas</option>
                    <option value="Coliseo Yesid Santos">Coliseo Yesid Santos</option>
                    <option value="Canchas Buenos Aires">Canchas Buenos Aires</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">WhatsApp del Acudiente / Atleta</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Ej. 312 845 9210"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] focus:ring-1 focus:ring-[#F29A2E] outline-none transition-all font-sans text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] hover:from-[#FF8008] hover:to-[#F29A2E] text-[#071426] rounded-xl font-bold uppercase tracking-wider text-sm shadow-[0_0_25px_rgba(242,154,46,0.4)] active:scale-95 transition-all"
              >
                <MessageCircle size={18} />
                <span>Reservar Cupo con este Carnet por WhatsApp</span>
              </button>
              <p className="text-center text-[11px] text-gray-400 font-sans">
                Sin costo de inscripción inicial por verificación web. Respuesta en menos de 2 horas.
              </p>
            </form>
          </div>

          {/* Simulador Carnet VIP Apple Wallet Style (Col 6) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <div className="text-xs uppercase tracking-widest text-[#F29A2E] font-bold font-mono text-center mb-4">
                ✨ Previsualización en Vivo de tu Carnet Oficial
              </div>

              {/* Tarjeta VIP Metalizada */}
              <div className="relative aspect-[1.586/1] w-full rounded-3xl p-8 bg-gradient-to-tr from-[#0F284B] via-[#08172D] to-[#040C18] border border-[#F29A2E]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between group">
                
                {/* Holographic Gloss Glow Effect */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#F29A2E]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

                {/* Top Card Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 border border-white/20">
                      <Image src="/logo.svg" alt="Logo Zúñiga" width={40} height={40} />
                    </div>
                    <div>
                      <span className="font-heading font-bold text-lg text-white block leading-none">VOLEY ZÚÑIGA</span>
                      <span className="text-[9px] font-mono text-[#F29A2E] uppercase tracking-[0.2em]">Pase Oficial 2026</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 text-[#F29A2E] font-mono text-[10px] font-bold uppercase tracking-wider">
                    VIP ATHLETE
                  </div>
                </div>

                {/* Card Center: Name & ID */}
                <div className="relative z-10 my-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                    Deportista Registrado
                  </span>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-wide text-white truncate drop-shadow-md">
                    {formData.name || "Tu Nombre Aquí"}
                  </h2>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-300 mt-2">
                    <span>CAT: <strong className="text-[#F29A2E]">{formData.category}</strong></span>
                    <span>•</span>
                    <span>EDAD: <strong className="text-white">{formData.age} Años</strong></span>
                  </div>
                </div>

                {/* Bottom Card Footer with Mock QR */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Sede Asignada</span>
                    <span className="text-gray-200 text-xs truncate max-w-[200px] block font-sans font-bold">
                      {formData.sede}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white text-[#071426] shadow-md">
                    <QrCode size={28} />
                    <div className="text-[8px] font-mono uppercase font-bold leading-tight">
                      <span>VZ-2026</span><br />
                      <span className="text-[#F29A2E]">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 font-sans mt-4">
                El carnet físico oficial con fotografía se entrega tras la primera semana de entrenamientos.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Desglose Transparente de Membresías */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-4">
              Membresías & Planes Formativos
            </h2>
            <p className="text-gray-400 font-sans text-sm md:text-base">
              Transparencia total. Sin cláusulas ocultas ni cobros sorpresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Plan 1: Iniciación */}
            <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 block mb-2">Semillero 8-12 Años</span>
                <h3 className="text-2xl font-heading font-bold uppercase text-white mb-4">Plan Formativo</h3>
                <div className="text-3xl font-heading font-bold text-white mb-6">
                  $110.000 <span className="text-xs font-sans text-gray-400 font-normal">/ mes</span>
                </div>
                <ul className="space-y-3 text-xs text-gray-300 font-sans mb-8">
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> 2 sesiones semanales en cancha</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Balones y material pedagógico</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Seguro de accidentes deportivos</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Festivales internos de voleibol</li>
                </ul>
              </div>
              <a
                href="https://wa.me/573128459210?text=Hola,%20me%20interesa%20el%20Plan%20Formativo%20Semillero"
                className="w-full py-3 text-center bg-white/10 hover:bg-white text-white hover:text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Consultar Horarios
              </a>
            </div>

            {/* Plan 2: Competitivo (Destacado) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0F284B] to-[#071426] border-2 border-[#F29A2E] shadow-[0_0_30px_rgba(242,154,46,0.2)] flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#F29A2E] text-[#071426] font-bold text-[10px] uppercase tracking-widest">
                Más Elegido
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F29A2E] block mb-2">Sub-14 / Sub-16 / Sub-18</span>
                <h3 className="text-2xl font-heading font-bold uppercase text-white mb-4">Plan Competencia</h3>
                <div className="text-3xl font-heading font-bold text-[#F29A2E] mb-6">
                  $140.000 <span className="text-xs font-sans text-gray-400 font-normal">/ mes</span>
                </div>
                <ul className="space-y-3 text-xs text-gray-300 font-sans mb-8">
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> 3 a 4 sesiones semanales</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Preparación física y pliometría</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Participación en Liga Departamental</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Videoanálisis técnico personalizado</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Camiseta de entrenamiento incluida</li>
                </ul>
              </div>
              <a
                href="https://wa.me/573128459210?text=Hola,%20deseo%20inscribirme%20al%20Plan%20Competencia%20de%20Liga"
                className="w-full py-3 text-center bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md font-sans"
              >
                Inscribirme a Competencia
              </a>
            </div>

            {/* Plan 3: Personalizado */}
            <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 block mb-2">Todas las edades</span>
                <h3 className="text-2xl font-heading font-bold uppercase text-white mb-4">Plan Élite Personalizado</h3>
                <div className="text-3xl font-heading font-bold text-white mb-6">
                  Consultar <span className="text-xs font-sans text-gray-400 font-normal">/ sesión</span>
                </div>
                <ul className="space-y-3 text-xs text-gray-300 font-sans mb-8">
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Entrenamientos 1 a 1 con el DT</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Corrección específica de batida y salto</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Enfoque en armadores o atacantes punta</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[#F29A2E]" /> Preparación para pruebas en el exterior</li>
                </ul>
              </div>
              <a
                href="https://wa.me/573128459210?text=Hola,%20quisiera%20cotizar%20un%20Plan%20Élite%20Personalizado%201%20a%201"
                className="w-full py-3 text-center bg-white/10 hover:bg-white text-white hover:text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Agendar Sesión Privada
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

