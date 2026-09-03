import React from "react";
import { Trophy, Calendar as CalendarIcon, MapPin } from "lucide-react";

export default function GamesPage() {
  const games = [
    { id: 1, team1: "Voley Zúñiga", team2: "Club Envigado", date: "Sáb, 12 Sep - 10:00 AM", location: "Coliseo Yesid Santos", category: "Sub-18 Femenino", status: "Próximo" },
    { id: 2, team1: "Voley Zúñiga", team2: "Bello Voley", date: "Dom, 13 Sep - 02:00 PM", location: "Canchas Buenos Aires", category: "Mayores Masculino", status: "Próximo" },
    { id: 3, team1: "Sabaneta VC", team2: "Voley Zúñiga", date: "Sáb, 05 Sep - 04:00 PM", location: "Coliseo Sabaneta", category: "Sub-16 Femenino", status: "Finalizado", score: "1 - 3" },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F7F8FA] min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-heading font-bold uppercase mb-4">Partidos y Resultados</h1>
        <p className="text-[#64748B] text-xl font-sans max-w-2xl mb-12">
          Sigue el calendario competitivo de todas nuestras categorías.
        </p>

        <div className="flex flex-col gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
              
              <div className="flex flex-col gap-2 md:w-1/4">
                <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-bold uppercase ${game.status === 'Próximo' ? 'bg-[#F29A2E]/20 text-[#D96F1A]' : 'bg-gray-100 text-gray-500'}`}>
                  {game.status}
                </span>
                <span className="text-sm font-sans font-bold text-[#64748B] uppercase">{game.category}</span>
              </div>

              <div className="flex flex-1 items-center justify-center gap-4 w-full">
                <div className="text-right flex-1">
                  <h3 className="font-heading font-bold text-2xl uppercase">{game.team1}</h3>
                </div>
                
                <div className="px-6 py-3 bg-[#071426] text-white rounded-lg font-bold text-xl min-w[100px] text-center shadow-inner">
                  {game.score ? game.score : 'VS'}
                </div>
                
                <div className="text-left flex-1">
                  <h3 className="font-heading font-bold text-2xl uppercase">{game.team2}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:w-1/4 md:items-end text-sm text-[#64748B] font-medium font-sans">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-[#F29A2E]" /> {game.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#F29A2E]" /> {game.location}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
