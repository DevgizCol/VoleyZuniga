"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Calendar as CalendarIcon, MapPin, Clock, Shield, ChevronRight, Activity, Flame } from "lucide-react";

export default function GamesPage() {
  const [filter, setFilter] = useState<"todos" | "proximos" | "finalizados">("todos");

  const matches = [
    {
      id: 1,
      team1: "Club Voley Zúñiga",
      team1Code: "CVZ",
      team2: "Envigado Voley Club",
      team2Code: "EVC",
      tournament: "Liga Departamental de Antioquia • Semifinal",
      category: "Juvenil Sub-18 Femenina",
      date: "Sábado, 19 Septiembre 2026",
      time: "10:30 AM",
      venue: "Coliseo Yesid Santos (Cancha Central)",
      status: "proximo",
      featured: true,
      countdown: "Faltan 4 días"
    },
    {
      id: 2,
      team1: "Club Voley Zúñiga",
      team1Code: "CVZ",
      team2: "Bello Voley",
      team2Code: "BVO",
      tournament: "Torneo Interclubes Medellín",
      category: "Menores Sub-16",
      date: "Domingo, 20 Septiembre 2026",
      time: "02:00 PM",
      venue: "Polideportivo 3 Canchas (Sede Buenos Aires)",
      status: "proximo",
      featured: false,
      countdown: "Faltan 5 días"
    },
    {
      id: 3,
      team1: "Club Voley Zúñiga",
      team1Code: "CVZ",
      score1: 3,
      team2: "Sabaneta Voley Club",
      team2Code: "SVC",
      score2: 1,
      sets: ["25-22", "21-25", "25-18", "25-20"],
      tournament: "Liga Departamental • Fecha 8",
      category: "Juvenil Sub-18 Femenina",
      date: "Sábado, 05 Septiembre 2026",
      time: "04:00 PM",
      venue: "Coliseo Yesid Santos",
      status: "finalizado",
      featured: false
    },
    {
      id: 4,
      team1: "Inder Medellín",
      team1Code: "IND",
      score1: 0,
      team2: "Club Voley Zúñiga",
      team2Code: "CVZ",
      score2: 3,
      sets: ["18-25", "19-25", "22-25"],
      tournament: "Torneo Primavera Sub-14",
      category: "Infantil Sub-14",
      date: "Domingo, 30 Agosto 2026",
      time: "11:00 AM",
      venue: "Canchas Buenos Aires",
      status: "finalizado",
      featured: false
    }
  ];

  const filteredMatches = filter === "todos"
    ? matches
    : matches.filter(m => m.status === filter);

  const featuredMatch = matches.find(m => m.featured);

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
              <Activity size={14} />
              <span>Match Center Oficial</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white">
              Partidos y <span className="text-[#F29A2E]">Resultados</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg font-sans mt-2">
              Sigue el fixture competitivo de todas nuestras categorías en la Liga Departamental.
            </p>
          </div>
          <Link
            href="/standings"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-[#F29A2E] hover:text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 shrink-0"
          >
            <Trophy size={16} />
            <span>Ver Tabla de Posiciones</span>
          </Link>
        </div>

        {/* 1. Featured Match Card (Champions League Style) */}
        {featuredMatch && (
          <div className="mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0F284B] via-[#071426] to-[#040C18] border border-[#F29A2E]/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F29A2E]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div>
                <span className="text-[#F29A2E] font-mono text-xs uppercase tracking-widest font-bold block mb-1">
                  {featuredMatch.tournament}
                </span>
                <h3 className="text-lg font-heading font-bold text-white uppercase">
                  {featuredMatch.category}
                </h3>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase animate-pulse">
                {featuredMatch.countdown}
              </span>
            </div>

            {/* Teams Faceoff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-6">
              
              {/* Home */}
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <span className="text-5xl md:text-6xl font-heading font-bold text-[#F29A2E] mb-1">
                  {featuredMatch.team1Code}
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white">
                  {featuredMatch.team1}
                </h2>
                <span className="text-xs text-gray-400 font-sans">Local • Líder Invictas</span>
              </div>

              {/* VS Badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#071426] border-2 border-[#F29A2E] flex items-center justify-center font-heading font-bold text-2xl text-white shadow-xl">
                  VS
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs font-mono text-[#F29A2E] font-bold">{featuredMatch.time}</div>
                  <div className="text-[11px] text-gray-400 font-sans">{featuredMatch.date}</div>
                </div>
              </div>

              {/* Away */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-5xl md:text-6xl font-heading font-bold text-white/40 mb-1">
                  {featuredMatch.team2Code}
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white">
                  {featuredMatch.team2}
                </h2>
                <span className="text-xs text-gray-400 font-sans">Visitante • 2do Puesto</span>
              </div>
            </div>

            {/* Footer details */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#F29A2E]" />
                <span>{featuredMatch.venue}</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Coliseo+Yesid+Santos+Medellin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F29A2E] hover:underline font-bold uppercase tracking-wider text-[11px] flex items-center gap-1"
              >
                <span>Cómo llegar al Coliseo</span>
                <ChevronRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter("todos")}
            className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              filter === "todos" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("proximos")}
            className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              filter === "proximos" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Próximos Encuentros
          </button>
          <button
            onClick={() => setFilter("finalizados")}
            className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              filter === "finalizados" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Resultados Anteriores
          </button>
        </div>

        {/* Match List */}
        <div className="space-y-4">
          {filteredMatches.map((m) => (
            <div
              key={m.id}
              className="p-6 md:p-8 rounded-3xl bg-[#0B1E38] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="md:w-1/4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                    m.status === "proximo" ? "bg-[#F29A2E]/10 text-[#F29A2E] border border-[#F29A2E]/30" : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}>
                    {m.status === "proximo" ? "Por Jugar" : "Finalizado"}
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-400 block">{m.category}</span>
                <span className="text-[11px] text-gray-500 block truncate">{m.tournament}</span>
              </div>

              {/* Marcador Central */}
              <div className="flex items-center justify-center gap-6 flex-1 w-full">
                <div className="text-right flex-1">
                  <h4 className="font-heading font-bold text-lg md:text-xl uppercase text-white truncate">{m.team1}</h4>
                </div>

                <div className="px-6 py-2.5 rounded-2xl bg-[#071426] border border-white/15 text-center min-w-[110px]">
                  {m.status === "finalizado" ? (
                    <div>
                      <span className="font-heading font-bold text-2xl text-[#F29A2E]">
                        {m.score1} - {m.score2}
                      </span>
                      {m.sets && (
                        <div className="text-[9px] font-mono text-gray-400 mt-1">
                          {m.sets.join(" | ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="font-heading font-bold text-xl text-gray-400">
                      VS
                    </span>
                  )}
                </div>

                <div className="text-left flex-1">
                  <h4 className="font-heading font-bold text-lg md:text-xl uppercase text-white truncate">{m.team2}</h4>
                </div>
              </div>

              <div className="md:w-1/4 flex flex-col md:items-end text-xs font-sans text-gray-400 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon size={14} className="text-[#F29A2E]" />
                  <span>{m.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#F29A2E]" />
                  <span className="truncate max-w-[200px]">{m.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

