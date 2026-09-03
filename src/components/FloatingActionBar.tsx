"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles, Trophy } from "lucide-react";

export default function FloatingActionBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-5 inset-x-4 z-50 animate-fade-in-up">
      <div className="bg-[#071426]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2">
        <Link
          href="/registrations"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <Sparkles size={16} />
          <span>Inscríbete Hoy</span>
        </Link>
        <a
          href="https://wa.me/573128459210?text=Hola,%20quisiera%20información%20sobre%20inscripciones%20y%20horarios%20en%20el%20Club%20Voley%20Zúñiga"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 active:scale-95 transition-all"
        >
          <MessageCircle size={16} className="text-[#25D366]" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
