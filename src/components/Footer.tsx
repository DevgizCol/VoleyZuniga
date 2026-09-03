import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#071426] text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/logo.svg" alt="Logo" width={60} height={60} />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-2xl leading-none tracking-wide text-white">VOLEY ZÚÑIGA</span>
                <span className="font-sans text-[10px] uppercase text-[#F29A2E] font-bold tracking-[0.2em]">Club Deportivo</span>
              </div>
            </Link>
            <p className="text-gray-400 font-sans text-sm leading-relaxed">
              Formación integral de deportistas, valores de convivencia y alta competencia.
              No formamos jugadores, formamos campeones.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F29A2E] hover:text-[#071426] transition-colors font-bold">
                FB
              </a>
              <a href="https://www.instagram.com/voleyzuniga_oficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F29A2E] hover:text-[#071426] transition-colors font-bold">
                IG
              </a>
              {/* TikTok Icon replacement */}
              <a href="https://www.tiktok.com/@voleyzuniga" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F29A2E] hover:text-[#071426] transition-colors font-bold">
                TT
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-heading font-bold text-xl uppercase tracking-wider mb-6 text-white/90">Navegación</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm text-gray-400">
              <li><Link href="/" className="hover:text-[#F29A2E] transition-colors">Inicio</Link></li>
              <li><Link href="/team" className="hover:text-[#F29A2E] transition-colors">Equipos y Atletas</Link></li>
              <li><Link href="/games" className="hover:text-[#F29A2E] transition-colors">Partidos y Resultados</Link></li>
              <li><Link href="/store" className="hover:text-[#F29A2E] transition-colors">Tienda Oficial</Link></li>
            </ul>
          </div>

          {/* El Club */}
          <div>
            <h4 className="font-heading font-bold text-xl uppercase tracking-wider mb-6 text-white/90">El Club</h4>
            <ul className="flex flex-col gap-3 font-sans text-sm text-gray-400">
              <li><Link href="/club" className="hover:text-[#F29A2E] transition-colors">Historia y Visión</Link></li>
              <li><Link href="/club/methodology" className="hover:text-[#F29A2E] transition-colors">Metodología de Entrenamiento</Link></li>
              <li><Link href="/registrations" className="hover:text-[#F29A2E] transition-colors">Inscripciones Abiertas</Link></li>
              <li><Link href="/news" className="hover:text-[#F29A2E] transition-colors">Noticias y Actualidad</Link></li>
            </ul>
          </div>

          {/* Sedes y Contacto */}
          <div>
            <h4 className="font-heading font-bold text-xl uppercase tracking-wider mb-6 text-white/90">Contacto</h4>
            <ul className="flex flex-col gap-4 font-sans text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#F29A2E] shrink-0 mt-0.5" />
                <span>Coliseo Yesid Santos (Atanasio Girardot) <br />Canchas Buenos Aires</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#F29A2E] shrink-0" />
                <span>+57 312 845 9210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#F29A2E] shrink-0" />
                <span>contacto@voleyzuniga.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-gray-500">
          <p>© 2026 Club Voley Zúñiga Medellín. Todos los derechos reservados.</p>
          <p>Plataforma deportiva by <span className="text-gray-300 font-bold">DevGiz</span></p>
        </div>
      </div>
    </footer>
  );
}
