"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Trophy, Calendar, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#071426] text-white flex items-center justify-center px-6 py-28 relative overflow-hidden">
      
      {/* Fondo y Cancha Vectorial con Luces Nocturnas */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F29A2E] to-transparent" />
        <div className="absolute top-1/4 bottom-1/4 left-1/2 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F29A2E]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0E2952]/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        
        {/* Marcador Deportivo Estilo Coliseo */}
        <div className="inline-flex items-center gap-6 px-8 py-4 rounded-3xl bg-[#040C18] border-2 border-[#F29A2E]/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] mb-10">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">CÓDIGO ERROR</span>
            <span className="text-6xl md:text-7xl font-heading font-bold text-[#F29A2E] tracking-wider drop-shadow-[0_0_20px_rgba(242,154,46,0.6)]">
              404
            </span>
          </div>
          <div className="h-16 w-[1px] bg-white/15" />
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">ESTADO JUEGO</span>
            <span className="text-6xl md:text-7xl font-heading font-bold text-white/40 tracking-wider">
              OUT
            </span>
          </div>
        </div>

        {/* Silueta de Malla y Balón Fuera (SVG Estilizado) */}
        <div className="w-48 h-20 mx-auto mb-6 relative flex items-center justify-center">
          {/* Malla Vectorial */}
          <div className="w-full h-12 border-y-2 border-white/30 grid grid-cols-8 divide-x divide-white/20 bg-white/[0.02] rounded-sm">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-full" />
            ))}
          </div>
          {/* Balón Cayendo Fuera de Cancha */}
          <div className="absolute -right-4 -bottom-3 w-8 h-8 rounded-full bg-[#F29A2E] border-2 border-white shadow-[0_0_15px_rgba(242,154,46,0.8)] flex items-center justify-center text-[9px] font-bold text-[#071426] font-mono animate-bounce">
            🏐
          </div>
        </div>

        {/* Título y Mensaje */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <span>¡Balón Fuera de Cancha!</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight text-white mb-4">
          La Jugada no se Encuentra en la <span className="text-[#F29A2E]">Cancha</span>
        </h1>

        <p className="text-gray-300 font-sans text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
          La página que intentas consultar fue movida, no existe o salió fuera de las líneas reglamentarias del Coliseo.
        </p>

        {/* Botones de Navegación */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(242,154,46,0.35)] hover:shadow-[0_0_35px_rgba(242,154,46,0.5)] active:scale-95 transition-all"
          >
            <Home size={16} />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/games"
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#071426] font-bold text-xs uppercase tracking-wider border border-white/20 transition-all"
          >
            <Trophy size={16} />
            <span>Ver Partidos y Calendario</span>
          </Link>

          <Link
            href="/registrations"
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
          >
            <span>Inscripciones Abiertas</span>
          </Link>
        </div>

        <div className="mt-14 text-xs font-mono text-gray-500">
          CLUB DEPORTIVO VOLEY ZÚÑIGA • MEDELLÍN, COLOMBIA
        </div>

      </div>
    </div>
  );
}
