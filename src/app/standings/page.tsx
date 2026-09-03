import React from "react";
import { Trophy } from "lucide-react";

export default function StandingsPage() {
  const standings = [
    { rank: 1, team: "Voley Zúñiga (Sub-18)", p: 10, w: 9, l: 1, pts: 27 },
    { rank: 2, team: "Lions Voley", p: 10, w: 7, l: 3, pts: 21 },
    { rank: 3, team: "Envigado VC", p: 10, w: 6, l: 4, pts: 18 },
    { rank: 4, team: "Inder Medellín", p: 10, w: 5, l: 5, pts: 15 },
    { rank: 5, team: "Antioquia Élite", p: 10, w: 2, l: 8, pts: 6 },
    { rank: 6, team: "Volley Life", p: 10, w: 1, l: 9, pts: 3 },
  ];

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <Trophy size={48} className="text-[#F29A2E]" />
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase text-[#071426]">
              Clasificación
            </h1>
            <p className="text-[#64748B] text-lg mt-2">
              Liga Departamental de Voleibol - Categoría Sub-18 Femenina
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#071426] text-white">
                  <th className="p-6 font-bold uppercase tracking-wider">Pos</th>
                  <th className="p-6 font-bold uppercase tracking-wider">Equipo</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-center">PJ</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-center">G</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-center">P</th>
                  <th className="p-6 font-bold uppercase tracking-wider text-center text-[#F29A2E]">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {standings.map((row, index) => (
                  <tr 
                    key={row.rank} 
                    className={`hover:bg-gray-50 transition-colors ${index === 0 ? "bg-amber-50/50" : ""}`}
                  >
                    <td className="p-6 font-bold text-lg">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-[#F29A2E] text-white' : 'bg-gray-100 text-[#071426]'}`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="p-6 font-bold text-xl text-[#071426]">
                      {row.team}
                    </td>
                    <td className="p-6 text-center text-lg text-gray-600">{row.p}</td>
                    <td className="p-6 text-center text-lg text-green-600 font-bold">{row.w}</td>
                    <td className="p-6 text-center text-lg text-red-600">{row.l}</td>
                    <td className="p-6 text-center text-2xl font-bold text-[#F29A2E]">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
