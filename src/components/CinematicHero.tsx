"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamic import with SSR disabled to prevent Three.js from blocking FCP / TTI
const HeroLogo3D = dynamic(() => import("./HeroLogo3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[500px] flex items-center justify-center">
      <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 animate-pulse flex items-center justify-center">
        <span className="text-[#F29A2E] text-xs font-mono uppercase tracking-widest font-bold">Cargando 3D</span>
      </div>
    </div>
  ),
});

export default function CinematicHero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#071426] pt-24 pb-16 lg:py-0">
      {/* Fondo Deportivo de Lujo con Luces Volumétricas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[500px] bg-[#F29A2E]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#0F284B]/40 rounded-full blur-[100px]" />
        <div className="w-full h-full bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Contenido Brutalista y 3D */}
      <div className="relative z-20 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Lado Izquierdo: Texto */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
          }}
          className="text-center lg:text-left flex flex-col justify-center lg:w-1/2 pt-20 lg:pt-0"
        >
          <motion.h1
            className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[9rem] font-heading font-bold text-white uppercase leading-[0.85] tracking-tighter overflow-hidden flex flex-wrap"
          >
            {["NO", "FORMAMOS"].map((word, i) => (
              <motion.span key={i} variants={{ hidden: { y: "100%" }, visible: { y: "0%" } }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mr-[0.25em]">
                {word}
              </motion.span>
            ))}
            <div className="w-full h-0 lg:hidden"></div>
            <motion.span 
              variants={{ hidden: { y: "100%" }, visible: { y: "0%" } }} 
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
              className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mr-[0.25em]"
            >
              JUGADORES.
            </motion.span>
          </motion.h1>
          
          <motion.h2
            className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[9rem] font-heading font-bold text-[#F29A2E] uppercase leading-[0.85] tracking-tighter mt-4 overflow-hidden flex flex-wrap"
          >
            {["FORMAMOS"].map((word, i) => (
              <motion.span key={i} variants={{ hidden: { y: "100%" }, visible: { y: "0%" } }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mr-[0.25em]">
                {word}
              </motion.span>
            ))}
            <div className="w-full h-0 lg:hidden"></div>
            <motion.span 
              variants={{ hidden: { y: "100%" }, visible: { y: "0%" } }} 
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
              className="text-glow mr-[0.25em]"
            >
              CAMPEONES.
            </motion.span>
          </motion.h2>
        </motion.div>

        {/* Lado Derecho: Modelo 3D Digital Twin Cargado Dinámicamente */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mt-10 lg:mt-0 relative z-30 min-h-[350px]">
          <HeroLogo3D />
        </div>
        
      </div>
    </section>
  );
}
