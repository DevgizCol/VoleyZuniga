"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Reset scroll smoothly to top on page navigation
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  return (
    <>
      {/* Barra de progreso / destello dorado sutil de alta gama en la parte superior */}
      <motion.div
        key="nav-bar-flare"
        initial={{ scaleX: 0, opacity: 0.9 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F29A2E] via-[#FFB14A] to-white z-[9999] pointer-events-none shadow-[0_0_10px_rgba(242,154,46,0.8)]"
      />

      {/* Contenedor de transición cinematográfica sutil con desenfoque suave */}
      <motion.div
        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.38,
          ease: [0.16, 1, 0.3, 1], // Curva cúbica ultra fluida
        }}
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </>
  );
}

