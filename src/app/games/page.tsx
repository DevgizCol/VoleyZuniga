"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Calendar as CalendarIcon, MapPin, Clock, Shield, ChevronRight, Activity, Flame, Star, Award, X, Sparkles, BarChart2 } from "lucide-react";

interface MatchReport {
  mvpName: string;
  mvpRole: string;
  mvpNumber: number;
  aces: number;
  blocks: number;
  attacks: number;
  efficiency: string;
  highlightText: string;
}

interface Match {
  id: number;
  team1: string;
  team1Code: string;
  team2: string;
  team2Code: string;
  score1?: number;
  score2?: number;
  sets?: string[];
  tournament: string;
  tournamentType: "liga" | "nacional" | "interclubes";
  category: "Sub-18" | "Sub-16" | "Sub-14";
  categoryLabel: string;
  date: string;
  time: string;
  venue: string;
  status: "proximo" | "finalizado";
  featured?: boolean;
  countdown?: string;
  report?: MatchReport;
}

export default function GamesPage() {
  const [statusFilter, setStatusFilter] = useState<"todos" | "proximos" | "finalizados">("todos");
  const [categoryFilter, setCategoryFilter] = useState<"todas" | "Sub-18" | "Sub-16" | "Sub-14">("todas");
  const [tournamentFilter, setTournamentFilter] = useState<"todos" | "liga" | "interclubes" | "nacional">("todos");

  const [selectedReportMatch, setSelectedReportMatch] = useState<Match | null>(null);

  const matches: Match[] = [
    {
      id: 1,
      team1: "Club Voley Zúñiga",
      team1Code: "CVZ",
      team2: "Envigado Voley Club",
      team2Code: "EVC",
      tournament: "Liga Departamental de Antioquia • Semifinal",
      tournamentType: "liga",
      category: "Sub-18",
      categoryLabel: "Juvenil Sub-18 Femenina",
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
      tournamentType: "interclubes",
      category: "Sub-16",
      categoryLabel: "Menores Sub-16",
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
      tournament: "Liga Departamental de Antioquia • Fecha 8",
      tournamentType: "liga",
      category: "Sub-18",
      categoryLabel: "Juvenil Sub-18 Femenina",
      date: "Sábado, 05 Septiembre 2026",
      time: "04:00 PM",
      venue: "Coliseo Yesid Santos",
      status: "finalizado",
      featured: false,
      report: {
        mvpName: "Valentina Morales",
        mvpRole: "Atacante Punta (#7)",
        mvpNumber: 7,
        aces: 5,
        blocks: 8,
        attacks: 21,
        efficiency: "84%",
        highlightText: "Dominio absoluto en el 3er y 4to set. Ejecutó una racha letal de saques flotantes y 21 remates contundentes por la paralela."
      }
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
      tournament: "Torneo Primavera Interclubes",
      tournamentType: "interclubes",
      category: "Sub-14",
      categoryLabel: "Infantil Sub-14",
      date: "Domingo, 30 Agosto 2026",
      time: "11:00 AM",
      venue: "Canchas Buenos Aires",
      status: "finalizado",
      featured: false,
      report: {
        mvpName: "Sofía Arismendy",
        mvpRole: "Armadora Titular (#1)",
        mvpNumber: 1,
        aces: 4,
        blocks: 3,
        attacks: 12,
        efficiency: "92%",
        highlightText: "Distribución impecable del balón de juego. Consiguió 34 asistencias limpias de remate y selló la victoria con dos fintas al cajón."
      }
    },
    {
      id: 5,
      team1: "Club Voley Zúñiga",
      team1Code: "CVZ",
      score1: 3,
      team2: "Itagüí Golden",
      team2Code: "ITG",
      score2: 2,
      sets: ["25-23", "19-25", "25-20", "22-25", "15-11"],
      tournament: "Liga Departamental de Antioquia • Fecha 7",
      tournamentType: "liga",
      category: "Sub-16",
      categoryLabel: "Menores Sub-16",
      date: "Sábado, 22 Agosto 2026",
      time: "02:30 PM",
      venue: "Polideportivo 3 Canchas",
      status: "finalizado",
      featured: false,
      report: {
        mvpName: "Manuela Restrepo",
        mvpRole: "Central (#12)",
        mvpNumber: 12,
        aces: 3,
        blocks: 11,
        attacks: 16,
        efficiency: "79%",
        highlightText: "Muralla defensiva en el tie-break decisivo (15-11). Registró 11 bloqueos punto que neutralizaron por completo el ataque rival."
      }
    }
  ];

  // Filters logic
  const filteredMatches = matches.filter(m => {
    if (statusFilter === "proximos" && m.status !== "proximo") return false;
    if (statusFilter === "finalizados" && m.status !== "finalizado") return false;
    if (categoryFilter !== "todas" && m.category !== categoryFilter) return false;
    if (tournamentFilter !== "todos" && m.tournamentType !== tournamentFilter) return false;
    return true;
  });

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
              Sigue el fixture competitivo de todas nuestras categorías en la Liga Departamental y Torneos Nacionales.
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
          <div className="mb-14 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#0F284B] via-[#071426] to-[#040C18] border border-[#F29A2E]/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F29A2E]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div>
                <span className="text-[#F29A2E] font-mono text-xs uppercase tracking-widest font-bold block mb-1">
                  {featuredMatch.tournament}
                </span>
                <h3 className="text-lg font-heading font-bold text-white uppercase">
                  {featuredMatch.categoryLabel}
                </h3>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase animate-pulse">
                {featuredMatch.countdown}
              </span>
            </div>

            {/* Teams Faceoff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center py-6">
              <div className="flex flex-col items-center md:items-end text-center md:text-right">
                <span className="text-5xl md:text-6xl font-heading font-bold text-[#F29A2E] mb-1">
                  {featuredMatch.team1Code}
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white">
                  {featuredMatch.team1}
                </h2>
                <span className="text-xs text-gray-400 font-sans">Local • Líder Invictas</span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#071426] border-2 border-[#F29A2E] flex items-center justify-center font-heading font-bold text-2xl text-white shadow-xl">
                  VS
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs font-mono text-[#F29A2E] font-bold">{featuredMatch.time}</div>
                  <div className="text-[11px] text-gray-400 font-sans">{featuredMatch.date}</div>
                </div>
              </div>

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

        {/* 2. Filtros Avanzados: Estado, Categoría y Torneo */}
        <div className="bg-[#0B1E38] p-6 rounded-3xl border border-white/10 mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Estado */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase mr-1">Estado:</span>
              <button
                onClick={() => setStatusFilter("todos")}
                className={`py-1.5 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${statusFilter === "todos" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter("proximos")}
                className={`py-1.5 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${statusFilter === "proximos" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                Próximos
              </button>
              <button
                onClick={() => setStatusFilter("finalizados")}
                className={`py-1.5 px-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${statusFilter === "finalizados" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                Finalizados
              </button>
            </div>

            {/* Categorías */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase mr-1">Categoría:</span>
              {(["todas", "Sub-18", "Sub-16", "Sub-14"] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`py-1.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${categoryFilter === cat ? "bg-white text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                >
                  {cat === "todas" ? "Todas" : cat}
                </button>
              ))}
            </div>

            {/* Torneo */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400 uppercase mr-1">Torneo:</span>
              <select
                value={tournamentFilter}
                onChange={(e) => setTournamentFilter(e.target.value as any)}
                className="py-1.5 px-3 rounded-xl bg-[#071426] border border-white/15 text-xs text-white outline-none focus:border-[#F29A2E]"
              >
                <option value="todos">Todos los Torneos</option>
                <option value="liga">Liga Departamental de Antioquia</option>
                <option value="interclubes">Torneos Interclubes</option>
              </select>
            </div>

          </div>
        </div>

        {/* 3. Match List con opción a Match Report */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16 bg-[#0B1E38] rounded-3xl border border-white/10">
              <Activity className="mx-auto text-gray-500 mb-3" size={32} />
              <h4 className="text-lg font-heading font-bold uppercase text-white">No hay partidos con estos filtros</h4>
              <p className="text-sm text-gray-400 font-sans mt-1">Prueba seleccionando otra categoría o torneo.</p>
            </div>
          ) : (
            filteredMatches.map((m) => (
              <div
                key={m.id}
                className="p-6 md:p-8 rounded-3xl bg-[#0B1E38] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="md:w-1/4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${m.status === "proximo" ? "bg-[#F29A2E]/10 text-[#F29A2E] border border-[#F29A2E]/30" : "bg-green-500/10 text-green-400 border border-green-500/20"
                      }`}>
                      {m.status === "proximo" ? "Por Jugar" : "Finalizado"}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-300 text-[10px] font-mono">
                      {m.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-gray-300 block font-bold">{m.categoryLabel}</span>
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

                {/* Actions & Report Button */}
                <div className="md:w-1/4 flex flex-col md:items-end text-xs font-sans text-gray-400 gap-2">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon size={14} className="text-[#F29A2E]" />
                    <span>{m.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#F29A2E]" />
                    <span className="truncate max-w-[200px]">{m.venue}</span>
                  </div>

                  {m.status === "finalizado" && m.report && (
                    <button
                      onClick={() => setSelectedReportMatch(m)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F29A2E]/15 hover:bg-[#F29A2E] text-[#F29A2E] hover:text-[#071426] text-[11px] font-bold uppercase tracking-wider transition-all border border-[#F29A2E]/30"
                    >
                      <BarChart2 size={13} />
                      <span>Ficha Match Report</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. MODAL DETALLADO MATCH REPORT (MVP & Stats) */}
        {selectedReportMatch && selectedReportMatch.report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0F284B] to-[#071426] border-2 border-[#F29A2E]/60 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden">

              <button
                onClick={() => setSelectedReportMatch(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#071426] transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 text-[#F29A2E] text-[10px] uppercase tracking-widest font-mono font-bold mb-2">
                  <Award size={12} />
                  <span>Reporte Técnico Oficial del Encuentro</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white">
                  {selectedReportMatch.team1} vs {selectedReportMatch.team2}
                </h3>
                <p className="text-xs text-gray-300 font-sans mt-1">
                  {selectedReportMatch.tournament} • {selectedReportMatch.categoryLabel} • {selectedReportMatch.date}
                </p>
              </div>

              {/* Marcador en grande */}
              <div className="p-4 rounded-2xl bg-[#071426] border border-white/10 flex items-center justify-between mb-6 text-center">
                <div className="flex-1">
                  <span className="font-heading font-bold text-lg uppercase text-white">{selectedReportMatch.team1}</span>
                </div>
                <div className="px-6 py-2 rounded-xl bg-white/5 border border-[#F29A2E]/40">
                  <span className="font-heading font-bold text-3xl text-[#F29A2E]">
                    {selectedReportMatch.score1} - {selectedReportMatch.score2}
                  </span>
                  <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                    Sets: {selectedReportMatch.sets?.join(" | ")}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-heading font-bold text-lg uppercase text-white">{selectedReportMatch.team2}</span>
                </div>
              </div>

              {/* Jugadora MVP Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#F29A2E]/15 to-transparent border border-[#F29A2E]/40 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#F29A2E] text-[#071426] flex items-center justify-center font-heading font-bold text-2xl shadow-lg shrink-0">
                    MVP
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#F29A2E] font-bold block">
                      Mejor Jugadora del Encuentro (MVP)
                    </span>
                    <h4 className="text-xl font-heading font-bold uppercase text-white">
                      {selectedReportMatch.report.mvpName}
                    </h4>
                    <span className="text-xs text-gray-300 font-sans">
                      {selectedReportMatch.report.mvpRole}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-sans mt-4 italic border-t border-white/10 pt-3">
                  "{selectedReportMatch.report.highlightText}"
                </p>
              </div>

              {/* Estadísticas de Rendimiento */}
              <div className="grid grid-cols-4 gap-3 text-center mb-6">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Aces Saque</span>
                  <span className="text-2xl font-heading font-bold text-[#F29A2E]">{selectedReportMatch.report.aces}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Bloqueos</span>
                  <span className="text-2xl font-heading font-bold text-white">{selectedReportMatch.report.blocks}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Ataques Puntos</span>
                  <span className="text-2xl font-heading font-bold text-white">{selectedReportMatch.report.attacks}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Efectividad</span>
                  <span className="text-2xl font-heading font-bold text-[#F29A2E]">{selectedReportMatch.report.efficiency}</span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setSelectedReportMatch(null)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white text-white hover:text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Cerrar Reporte
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
