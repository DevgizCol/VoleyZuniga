"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import HeroLogo3D from "./HeroLogo3D";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Efecto parallax y fade del overlay al hacer scroll
      gsap.to(videoOverlayRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        backgroundColor: "rgba(247, 248, 250, 1)", // Transición a Titanium White
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] w-full flex items-center justify-center overflow-hidden bg-[#071426]"
    >
      {/* Placeholder para Video 4K Cinematic / Imagen Optimizada */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      </div>

      {/* Overlay que cambia con GSAP */}
      <div
        ref={videoOverlayRef}
        className="absolute inset-0 z-10 bg-gradient-to-b from-[#071426]/60 via-[#071426]/80 to-[#F7F8FA]"
      ></div>

      {/* Contenido Brutalista y 3D */}
      <div className="relative z-20 container mx-auto px-6 h-screen flex flex-col lg:flex-row items-center justify-between">
        
        {/* Lado Izquierdo: Texto */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
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

        {/* Lado Derecho: Modelo 3D Digital Twin */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mt-10 lg:mt-0 relative z-30">
          <HeroLogo3D />
        </div>
        
      </div>
    </section>
  );
}
