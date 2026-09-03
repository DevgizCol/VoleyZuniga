"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Award, Medal, ChevronRight, Activity, Calendar } from "lucide-react";

export default function StandingsPage() {
  const [category, setCategory] = useState<"sub18" | "sub16" | "sub14">("sub18");

  const standingsData = {
    sub18: [
      { rank: 1, team: "Club Voley Zúñiga", p: 10, w: 9, l: 1, sf: 28, sc: 7, diff: "+21", pts: 27, isClub: true },
      { rank: 2, team: "Envigado Voley Club", p: 10, w: 8, l: 2, sf: 25, sc: 11, diff: "+14", pts: 24, isClub: false },
      { rank: 3, team: "Lions Voley Medellín", p: 10, w: 7, l: 3, sf: 23, sc: 14, diff: "+9", pts: 20, isClub: false },
      { rank: 4, team: "Inder Medellín", p: 10, w: 5, l: 5, sf: 18, sc: 17, diff: "+1", pts: 15, isClub: false },
      { rank: 5, team: "Sabaneta VC", p: 10, w: 3, l: 7, sf: 12, sc: 24, diff: "-12", pts: 9, isClub: false },
      { rank: 6, team: "Bello Voley Club", p: 10, w: 1, l: 9, sf: 6, sc: 28, diff: "-22", pts: 3, isClub: false },
    ],
    sub16: [
      { rank: 1, team: "Club Voley Zúñiga", p: 8, w: 8, l: 0, sf: 24, sc: 3, diff: "+21", pts: 24, isClub: true },
      { rank: 2, team: "Colegio San José", p: 8, w: 6, l: 2, sf: 19, sc: 9, diff: "+10", pts: 18, isClub: false },
      { rank: 3, team: "Envigado VC", p: 8, w: 5, l: 3, sf: 17, sc: 12, diff: "+5", pts: 15, isClub: false },
      { rank: 4, team: "Lions Voley", p: 8, w: 3, l: 5, sf: 11, sc: 17, diff: "-6", pts: 9, isClub: false },
      { rank: 5, team: "Inder Medellín", p: 8, w: 1, l: 7, sf: 5, sc: 22, diff: "-17", pts: 3, isClub: false },
    ],
    sub14: [
      { rank: 1, team: "Club Voley Zúñiga", p: 6, w: 5, l: 1, sf: 16, sc: 4, diff: "+12", pts: 16, isClub: true },
      { rank: 2, team: "Bello Voley", p: 6, w: 5, l: 1, sf: 15, sc: 6, diff: "+9", pts: 15, isClub: false },
      { rank: 3, team: "Sabaneta VC", p: 6, w: 3, l: 3, sf: 10, sc: 11, diff: "-1", pts: 9, isClub: false },
      { rank: 4, team: "Itagüí VC", p: 6, w: 1, l: 5, sf: 4, sc: 16, diff: "-12", pts: 3, isClub: false },
    ]
  };

  const currentRows = standingsData[category];

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
              <Trophy size={14} />
              <span>Tabla Oficial • Temporada 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white">
              Clasificación y <span className="text-[#F29A2E]">Podios</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg font-sans mt-2">
              Liga Departamental de Voleibol de Antioquia.
            </p>
          </div>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-[#F29A2E] hover:text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/10 shrink-0"
          >
            <Calendar size={16} />
            <span>Ver Calendario de Partidos</span>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setCategory("sub18")}
            className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              category === "sub18" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Juvenil Sub-18
          </button>
          <button
            onClick={() => setCategory("sub16")}
            className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              category === "sub16" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Menores Sub-16
          </button>
          <button
            onClick={() => setCategory("sub14")}
            className={`py-2 px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              category === "sub14" ? "bg-[#F29A2E] text-[#071426]" : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Infantil Sub-14
          </button>
        </div>

        {/* Standings Table Container */}
        <div className="rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-[#071426] text-gray-400 border-b border-white/10 text-[11px] uppercase tracking-wider font-mono">
                  <th className="py-5 px-6">Pos</th>
                  <th className="py-5 px-6">Equipo</th>
                  <th className="py-5 px-4 text-center">PJ</th>
                  <th className="py-5 px-4 text-center">PG</th>
                  <th className="py-5 px-4 text-center">PP</th>
                  <th className="py-5 px-4 text-center">SF</th>
                  <th className="py-5 px-4 text-center">SC</th>
                  <th className="py-5 px-4 text-center">DIF</th>
                  <th className="py-5 px-6 text-center text-[#F29A2E] font-bold">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentRows.map((row) => {
                  let badge = null;
                  if (row.rank === 1) {
                    badge = <span className="w-7 h-7 rounded-xl bg-[#FFD700] text-[#071426] flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(255,215,0,0.5)]">1</span>;
                  } else if (row.rank === 2) {
                    badge = <span className="w-7 h-7 rounded-xl bg-[#C0C0C0] text-[#071426] flex items-center justify-center font-bold text-xs">2</span>;
                  } else if (row.rank === 3) {
                    badge = <span className="w-7 h-7 rounded-xl bg-[#CD7F32] text-[#071426] flex items-center justify-center font-bold text-xs">3</span>;
                  } else {
                    badge = <span className="w-7 h-7 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center text-xs">{row.rank}</span>;
                  }

                  return (
                    <tr 
                      key={row.rank}
                      className={`transition-colors ${
                        row.isClub 
                          ? "bg-[#F29A2E]/10 border-l-4 border-[#F29A2E]" 
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <td className="py-5 px-6">
                        {badge}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <span className={`font-heading font-bold text-lg uppercase tracking-wide ${row.isClub ? "text-[#F29A2E]" : "text-white"}`}>
                            {row.team}
                          </span>
                          {row.isClub && (
                            <span className="px-2 py-0.5 rounded-md bg-[#F29A2E] text-[#071426] font-bold text-[9px] uppercase tracking-widest font-mono">
                              Nuestro Club
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4 text-center font-mono text-gray-300">{row.p}</td>
                      <td className="py-5 px-4 text-center font-mono text-green-400 font-bold">{row.w}</td>
                      <td className="py-5 px-4 text-center font-mono text-red-400">{row.l}</td>
                      <td className="py-5 px-4 text-center font-mono text-gray-300">{row.sf}</td>
                      <td className="py-5 px-4 text-center font-mono text-gray-300">{row.sc}</td>
                      <td className="py-5 px-4 text-center font-mono text-gray-400">{row.diff}</td>
                      <td className="py-5 px-6 text-center">
                        <span className="font-heading font-bold text-2xl text-[#F29A2E]">
                          {row.pts}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FFD700]"></span> Clasificación a Finales</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C0C0C0]"></span> Podio Departamental</span>
          </div>
          <p className="font-sans">PJ: Partidos Jugados • PG: Ganados • PP: Perdidos • SF: Sets a Favor • SC: Sets en Contra</p>
        </div>

      </div>
    </div>
  );
}

