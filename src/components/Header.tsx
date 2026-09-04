"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, Phone, MessageCircle, ChevronRight, Shield } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import CourtStatusBanner from "./CourtStatusBanner";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevenir scroll en el body cuando el menú móvil está abierto (evita glitch en iOS Safari)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "El Club", href: "/club/history" },
    { name: "Equipos", href: "/team" },
    { name: "Partidos", href: "/games" },
    { name: "Clasificación", href: "/standings" },
    { name: "Noticias", href: "/news" },
    { name: "Tienda", href: "/store" },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#071426]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "bg-gradient-to-b from-[#071426]/95 via-[#071426]/75 to-transparent"
        )}
      >
        {/* Banner de Estado de Canchas & Clima Integrado */}
        <CourtStatusBanner />

        <div className={clsx(
          "container mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300",
          isScrolled ? "py-2.5 sm:py-3" : "py-3.5 sm:py-5"
        )}>
          {/* Logo Responsive */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group select-none touch-manipulation">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0">
              <Image
                src="/logo.svg"
                alt="Club Voley Zúñiga Logo"
                width={44}
                height={44}
                priority
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg sm:text-2xl leading-none text-white tracking-wide">
                VOLEY ZÚÑIGA
              </span>
              <span className="font-sans text-[9px] sm:text-[10px] uppercase text-[#F29A2E] font-bold tracking-[0.2em] mt-0.5">
                Club Deportivo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-sans font-medium text-xs xl:text-sm text-gray-300 hover:text-white uppercase tracking-wider transition-colors relative py-1 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#F29A2E] after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/registrations"
              className="ml-2 px-5 py-2.5 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold uppercase text-xs rounded-full transition-all hover:shadow-[0_0_20px_rgba(242,154,46,0.5)] hover:scale-105 active:scale-95"
            >
              Inscripciones
            </Link>
          </nav>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito"
              className="relative w-11 h-11 flex items-center justify-center text-white hover:text-[#F29A2E] active:scale-90 transition-all rounded-xl hover:bg-white/5 touch-manipulation"
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F29A2E] text-[#071426] text-[10px] font-mono font-bold flex items-center justify-center rounded-full shadow-md">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button (Touch target 44x44px) */}
            <button
              className="lg:hidden w-11 h-11 flex items-center justify-center text-white hover:text-[#F29A2E] active:scale-90 transition-all rounded-xl hover:bg-white/5 touch-manipulation"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Safe Area & Ultra-Smooth Glassmorphism) */}
      <div
        className={clsx(
          "fixed inset-0 z-[60] bg-[#071426]/98 backdrop-blur-3xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col justify-between overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top, 16px))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 24px))",
        }}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-white/10">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <Image src="/logo.svg" alt="Logo" width={38} height={38} className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-white leading-none">VOLEY ZÚÑIGA</span>
              <span className="font-sans text-[9px] uppercase text-[#F29A2E] font-bold tracking-widest mt-0.5">Club Medellín</span>
            </div>
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:text-[#F29A2E] active:scale-90 transition-all touch-manipulation"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex flex-col px-6 py-4 gap-2 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3.5 px-3 rounded-2xl hover:bg-white/5 active:bg-white/10 text-white hover:text-[#F29A2E] transition-all font-heading text-2xl font-bold uppercase tracking-wide group touch-manipulation"
            >
              <span>{link.name}</span>
              <ChevronRight size={18} className="text-gray-500 group-hover:text-[#F29A2E] transition-colors" />
            </Link>
          ))}
          
          <Link
            href="/club/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-3.5 px-3 rounded-2xl hover:bg-white/5 active:bg-white/10 text-white hover:text-[#F29A2E] transition-all font-heading text-2xl font-bold uppercase tracking-wide group touch-manipulation"
          >
            <span>Contacto</span>
            <ChevronRight size={18} className="text-gray-500 group-hover:text-[#F29A2E] transition-colors" />
          </Link>
        </nav>

        {/* Drawer Bottom Actions: VIP Pass & Quick Connect */}
        <div className="px-6 pt-4 border-t border-white/10 space-y-3">
          <Link
            href="/registrations"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-4 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] text-center font-heading font-bold uppercase text-lg rounded-2xl shadow-xl shadow-[#F29A2E]/20 flex items-center justify-center gap-2 active:scale-95 transition-transform touch-manipulation"
          >
            <span>Generar Pase VIP de Prueba</span>
          </Link>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="https://wa.me/573128459210?text=Hola,%20quisiera%20información%20sobre%20inscripciones%20y%20horarios%20en%20el%20Club%20Voley%20Zúñiga"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>

            <a
              href="tel:+573128459210"
              className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all touch-manipulation"
            >
              <Phone size={16} className="text-[#F29A2E]" />
              <span>Llamar</span>
            </a>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors py-1"
            >
              <Shield size={12} />
              <span>Acceso Entrenadores (Admin)</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
