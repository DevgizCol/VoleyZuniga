"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "El Club", href: "/club/history" },
    { name: "Equipos", href: "/team" },
    { name: "Partidos", href: "/games" },
    { name: "Clasificación", href: "/standings" },
    { name: "Tienda", href: "/store" },
  ];

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-[#071426]/90 backdrop-blur-md border-white/10 py-3 shadow-lg"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="Club Voley Zúñiga Logo"
              width={50}
              height={50}
              priority
              className="object-contain transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="font-heading font-bold text-2xl leading-none text-white tracking-wide">VOLEY ZÚÑIGA</span>
              <span className="font-sans text-[10px] uppercase text-[#F29A2E] font-bold tracking-[0.2em]">Club Deportivo</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-sans font-medium text-sm text-gray-300 hover:text-white uppercase tracking-wider transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#F29A2E] after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/registrations"
              className="ml-4 px-6 py-2.5 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold uppercase text-sm rounded-full transition-all hover:shadow-[0_0_20px_rgba(242,154,46,0.4)] hover:scale-105"
            >
              Inscripciones
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:text-[#F29A2E] transition-colors"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#F29A2E] text-[#071426] text-[10px] font-bold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <button className="hidden md:flex p-2 text-white hover:text-[#F29A2E] transition-colors">
              <User size={24} />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-white hover:text-[#F29A2E] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={clsx(
          "fixed inset-0 z-[60] bg-[#071426] transform transition-transform duration-500 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="font-heading font-bold text-xl text-white">VOLEY ZÚÑIGA</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-white hover:text-[#F29A2E]"
          >
            <X size={28} />
          </button>
        </div>
        <nav className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-heading text-3xl font-bold text-white hover:text-[#F29A2E] transition-colors uppercase"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/registrations"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 px-6 py-4 bg-[#F29A2E] text-[#071426] text-center font-bold uppercase text-xl rounded-xl"
          >
            Inscripciones Abiertas
          </Link>
        </nav>
      </div>
    </>
  );
}
