"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Award, Shield, Sparkles, ChevronRight, User, X, CheckCircle2, HeartHandshake, Stethoscope } from "lucide-react";

interface Athlete {
  id: string;
  name: string;
  dorsal: string;
  position: "Líbero" | "Armadora" | "Central" | "Opuesta" | "Punta Receptora" | "Director Técnico" | "Preparador Físico";
  category: "Sub-12" | "Sub-14" | "Sub-16" | "Sub-18" | "Staff";
  height: string;
  spikeReach?: string;
  specialty: string;
  image: string;
  rating: number;
  yearsInClub?: string;
  hand?: "Diestra" | "Zurda";
  tournaments?: string[];
  quote?: string;
}

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [activeModalAthlete, setActiveModalAthlete] = useState<Athlete | null>(null);

  const athletes: Athlete[] = [
    {
      id: "1",
      name: "Mariana Restrepo",
      dorsal: "07",
      position: "Punta Receptora",
      category: "Sub-18",
      height: "1.79 m",
      spikeReach: "2.88 m",
      specialty: "Ataque por 4 & Saque Potencia",
      rating: 92,
      yearsInClub: "4 temporadas",
      hand: "Diestra",
      tournaments: ["Campeona Departamental 2026", "Preselección Antioquia", "Torneo Interclubes Cali"],
      quote: "El balón no toca el piso mientras quede una gota de energía.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "2",
      name: "Valeria Gómez",
      dorsal: "10",
      position: "Armadora",
      category: "Sub-18",
      height: "1.74 m",
      spikeReach: "2.75 m",
      specialty: "Distribución Rápida & Fintas",
      rating: 94,
      yearsInClub: "5 temporadas (Capitana)",
      hand: "Diestra",
      tournaments: ["Mejor Armadora Liga 2025", "Oro Departamental 2026", "Festival Nacional"],
      quote: "El armador es el cerebro; cada colocación debe ser una caricia al atacante.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "3",
      name: "Camila Zúñiga",
      dorsal: "03",
      position: "Líbero",
      category: "Sub-16",
      height: "1.66 m",
      spikeReach: "2.55 m",
      specialty: "Defensa Zaguera & Reacción Refleja",
      rating: 91,
      yearsInClub: "3 temporadas",
      hand: "Diestra",
      tournaments: ["Mejor Receptora Sub-16", "Oro Torneo Primavera 2025"],
      quote: "Mi trabajo es hacer que el remate más difícil parezca un pase sencillo.",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "4",
      name: "Sofía Arango",
      dorsal: "12",
      position: "Central",
      category: "Sub-16",
      height: "1.83 m",
      spikeReach: "2.95 m",
      specialty: "Bloqueo Cerrado & Ataque Rápido por 3",
      rating: 93,
      yearsInClub: "3 temporadas",
      hand: "Diestra",
      tournaments: ["Líder en Bloqueos Liga 2026", "Preselección Antioquia"],
      quote: "La red es mi muro; nadie pasa sin pagar el peaje.",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "5",
      name: "Isabella Cardona",
      dorsal: "09",
      position: "Opuesta",
      category: "Sub-14",
      height: "1.76 m",
      spikeReach: "2.80 m",
      specialty: "Ataque Zaguero & Bloqueo por 2",
      rating: 88,
      yearsInClub: "2 temporadas",
      hand: "Zurda",
      tournaments: ["Campeona Copa Medellín 2024", "Revelación Infantil"],
      quote: "Ser zurda me da un ángulo diferente para sorprender a la defensa.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "6",
      name: "Luciana Morales",
      dorsal: "05",
      position: "Punta Receptora",
      category: "Sub-12",
      height: "1.60 m",
      spikeReach: "2.45 m",
      specialty: "Pase de Antebrazo & Saque Flotante",
      rating: 86,
      yearsInClub: "1 temporada (Semillero)",
      hand: "Diestra",
      tournaments: ["Festival Valle de Aburrá 2025"],
      quote: "Cada día entreno con la ilusión de llegar al equipo de Liga.",
      image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const staffMembers = [
    {
      name: "Prof. Alberto Zúñiga",
      role: "Director Técnico & Fundador",
      license: "Licencia FIVB Nivel II • Fedevolei",
      exp: "14 años de trayectoria en Antioquia",
      desc: "Especialista en desarrollo táctico 5-1 y formador de más de 30 deportistas becadas a nivel nacional e internacional.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Lic. Felipe Durango",
      role: "Preparador Físico & Biomecánica",
      license: "Magíster en Fisiología del Ejercicio",
      exp: "Ex-Preparador Selección Antioquia",
      desc: "Lidera las evaluaciones pliométricas, control de cargas y protocolos preventivos de lesiones articulares.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
    },
    {
      name: "Dra. Camila Morales",
      role: "Fisioterapeuta & Readaptación Deportiva",
      license: "Esp. Fisioterapia Deportiva",
      exp: "8 años acompañando atletas de alta competencia",
      desc: "Supervisa la recuperación miofascial, vendajes funcionales y el bienestar osteomuscular del plantel.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const categoriesFilter = [
    { id: "todos", label: "Plantel Completo" },
    { id: "Sub-18", label: "Juvenil Sub-18" },
    { id: "Sub-16", label: "Menores Sub-16" },
    { id: "Sub-14", label: "Infantil Sub-14" },
    { id: "Sub-12", label: "Semillero Sub-12" }
  ];

  const filteredAthletes = selectedCategory === "todos"
    ? athletes
    : athletes.filter(a => a.category === selectedCategory);

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
            <Shield size={14} />
            <span>Roster Oficial 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Equipos y <span className="text-[#F29A2E]">Atletas</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-sans leading-relaxed">
            Haz clic sobre la tarjeta de cualquier deportista para consultar su ficha técnica, historial competitivo y estadísticas.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-16 border-b border-white/10 pb-6">
          {categoriesFilter.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                selectedCategory === c.id
                  ? "bg-[#F29A2E] text-[#071426] shadow-[0_0_20px_rgba(242,154,46,0.3)] scale-105"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Trading Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              onClick={() => setActiveModalAthlete(athlete)}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F284B] to-[#071426] border border-white/10 hover:border-[#F29A2E] transition-all duration-500 shadow-2xl flex flex-col justify-between cursor-pointer active:scale-98"
            >
              {/* Card Header & Photo */}
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={athlete.image}
                  alt={athlete.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-transparent to-transparent opacity-90"></div>

                {/* Dorsal Badge */}
                <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-[#071426]/90 backdrop-blur-md border border-white/20 flex items-center justify-center font-heading font-bold text-xl text-[#F29A2E] shadow-lg">
                  {athlete.dorsal}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 font-mono text-xs font-bold text-white shadow-lg">
                  <Sparkles size={12} className="text-[#F29A2E]" />
                  <span>{athlete.rating} OVR</span>
                </div>

                {/* Category Pill */}
                <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-[#F29A2E]/20 backdrop-blur-md border border-[#F29A2E]/30 text-[#F29A2E] text-[10px] uppercase font-bold tracking-wider">
                  {athlete.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#F29A2E] mb-1">
                    {athlete.position}
                  </p>
                  <h3 className="text-xl font-heading font-bold uppercase text-white mb-4 group-hover:text-[#F29A2E] transition-colors">
                    {athlete.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/10 text-xs font-mono text-gray-300 mb-4">
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-sans">Estatura</span>
                      <span className="font-bold text-white">{athlete.height}</span>
                    </div>
                    {athlete.spikeReach && (
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-sans">Alcance Salto</span>
                        <span className="font-bold text-[#F29A2E]">{athlete.spikeReach}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-sans mb-1">Especialidad</span>
                    <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-2">
                      {athlete.specialty}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#F29A2E]">
                  <span>Ver Ficha Técnica</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección Oficial del Cuerpo Técnico & Médico */}
        <div className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/10 text-[#F29A2E] text-xs font-mono uppercase tracking-widest mb-3">
              <Stethoscope size={14} />
              <span>Staff Profesional</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-4">
              Cuerpo Técnico & <span className="text-[#F29A2E]">Médico</span>
            </h2>
            <p className="text-gray-400 font-sans text-sm md:text-base">
              Profesionales con certificación internacional dedicados al desarrollo integral de cada atleta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staffMembers.map((staff, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={staff.image}
                      alt={staff.name}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E38] via-transparent to-transparent" />
                  </div>
                  <span className="text-[#F29A2E] font-mono text-xs font-bold uppercase tracking-wider block mb-1">
                    {staff.role}
                  </span>
                  <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2">
                    {staff.name}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300 mb-4">
                    {staff.license}
                  </div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed mb-4">
                    {staff.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-gray-400">
                  {staff.exp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Emergente de Ficha Técnica (Player Bio Modal) */}
        {activeModalAthlete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl rounded-3xl bg-[#0B1E38] border border-[#F29A2E]/50 shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden">
              <button
                onClick={() => setActiveModalAthlete(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12">
                {/* Foto Izquierda */}
                <div className="sm:col-span-5 relative h-64 sm:h-auto min-h-[300px]">
                  <Image
                    src={activeModalAthlete.image}
                    alt={activeModalAthlete.name}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E38] via-transparent to-transparent sm:hidden" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-[#071426] border border-[#F29A2E] flex items-center justify-center font-heading font-bold text-2xl text-[#F29A2E] shadow-xl">
                    {activeModalAthlete.dorsal}
                  </div>
                </div>

                {/* Datos Derecha */}
                <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F29A2E]/20 text-[#F29A2E] font-mono text-[10px] font-bold uppercase">
                        {activeModalAthlete.category}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        {activeModalAthlete.yearsInClub || "3 temporadas"}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-heading font-bold uppercase text-white mb-1">
                      {activeModalAthlete.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#F29A2E] mb-4">
                      {activeModalAthlete.position}
                    </p>

                    {/* Ficha métricas */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#071426] border border-white/10 text-center font-mono text-xs mb-4">
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-sans">Estatura</span>
                        <span className="font-bold text-white">{activeModalAthlete.height}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-sans">Mano</span>
                        <span className="font-bold text-white">{activeModalAthlete.hand || "Diestra"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-sans">Alcance</span>
                        <span className="font-bold text-[#F29A2E]">{activeModalAthlete.spikeReach || "2.80 m"}</span>
                      </div>
                    </div>

                    {/* Torneos */}
                    {activeModalAthlete.tournaments && (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1 font-sans">
                          Palmarés & Trayectoria:
                        </span>
                        <ul className="space-y-1">
                          {activeModalAthlete.tournaments.map((t, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-gray-300 font-sans">
                              <CheckCircle2 size={13} className="text-[#F29A2E] shrink-0" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cita */}
                    {activeModalAthlete.quote && (
                      <blockquote className="p-3 rounded-xl bg-white/[0.02] border-l-2 border-[#F29A2E] text-[11px] text-gray-300 italic font-sans">
                        "{activeModalAthlete.quote}"
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => setActiveModalAthlete(null)}
                      className="px-5 py-2 rounded-xl bg-[#F29A2E] text-[#071426] font-bold text-xs uppercase tracking-wider"
                    >
                      Cerrar Ficha
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-24 p-10 md:p-12 rounded-3xl bg-gradient-to-r from-[#0B1E38] to-[#071426] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <h3 className="text-3xl font-heading font-bold uppercase text-white mb-2">
              ¿Quieres vestir la camiseta oficial?
            </h3>
            <p className="text-gray-300 font-sans text-sm md:text-base max-w-xl">
              Realizamos visorías técnicas mensuales para deportistas con y sin experiencia en Medellín.
            </p>
          </div>
          <Link
            href="/registrations"
            className="px-8 py-4 bg-[#F29A2E] text-[#071426] hover:bg-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shrink-0"
          >
            Postularme al Equipo
          </Link>
        </div>

      </div>
    </div>
  );
}


