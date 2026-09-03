"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Award, Shield, Sparkles, ChevronRight, User } from "lucide-react";

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
}

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

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
      image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "7",
      name: "Prof. Alberto Zúñiga",
      dorsal: "DT",
      position: "Director Técnico",
      category: "Staff",
      height: "1.85 m",
      specialty: "Estrategia Táctica & Formación de Élite",
      rating: 98,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "8",
      name: "Lic. Felipe Durango",
      dorsal: "PF",
      position: "Preparador Físico",
      category: "Staff",
      height: "1.80 m",
      specialty: "Pliometría, Salto & Prevención de Lesiones",
      rating: 95,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const categoriesFilter = [
    { id: "todos", label: "Plantel Completo" },
    { id: "Sub-18", label: "Juvenil Sub-18" },
    { id: "Sub-16", label: "Menores Sub-16" },
    { id: "Sub-14", label: "Infantil Sub-14" },
    { id: "Sub-12", label: "Semillero Sub-12" },
    { id: "Staff", label: "Cuerpo Técnico" }
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
            Conoce a las deportistas y al cuerpo técnico que defienden los colores del Club Voley Zúñiga en las canchas de Antioquia y Colombia.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F284B] to-[#071426] border border-white/10 hover:border-[#F29A2E] transition-all duration-500 shadow-2xl flex flex-col justify-between"
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

                {/* Category Pill on Image */}
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
                    <p className="text-xs text-gray-300 font-sans leading-relaxed">
                      {athlete.specialty}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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

