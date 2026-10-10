"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, MessageCircle, Phone, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import CourtStatusBanner from "./CourtStatusBanner";
import { NAV_LINKS, NAV_MENU, SITE } from "@/config/site";
import { useContact } from "./ContactProvider";
import type { CourtNotice } from "@/lib/court";

export default function Header({ notices = [] }: { notices?: CourtNotice[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const { wa, tel } = useContact();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del fondo mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Submenú "Competencia": se abre con clic o al pasar el mouse y se cierra con Escape o al salir.
  const [groupOpen, setGroupOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!groupOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!groupRef.current?.contains(e.target as Node)) setGroupOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setGroupOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [groupOpen]);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#F29A2E] focus:text-[#071426] focus:px-4 focus:py-2 focus:font-bold"
      >
        Saltar al contenido
      </a>

      <header
        style={{ viewTransitionName: "site-header" }}
        className={clsx(
          "fixed top-0 inset-x-0 z-50 bg-[#071426]/85 backdrop-blur-md transition-shadow",
          isScrolled ? "shadow-[0_1px_0_rgba(143,163,191,0.2)]" : ""
        )}
      >
        <CourtStatusBanner notices={notices} />

        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label={`${SITE.name}, inicio`}>
            <Image src="/logo-trim.png" alt="" width={800} height={473} priority className="h-10 w-auto" />
            <span className="font-heading font-extrabold text-2xl leading-none text-white tracking-wide">
              Voley Zúñiga
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden lg:flex items-center gap-1">
            {NAV_MENU.map((item) => {
              const itemCls = (active: boolean) =>
                clsx(
                  "px-3 py-2 text-sm font-medium transition-colors border-b-2",
                  active ? "text-white border-[#F29A2E]" : "text-[#B7C4D8] border-transparent hover:text-white"
                );
              if (!("children" in item)) {
                return (
                  <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={itemCls(isActive(item.href))}>
                    {item.name}
                  </Link>
                );
              }
              const active = item.children.some((c) => isActive(c.href));
              return (
                <div key={item.name} ref={groupRef} className="relative" onMouseEnter={() => setGroupOpen(true)} onMouseLeave={() => setGroupOpen(false)}>
                  <button
                    type="button"
                    aria-expanded={groupOpen}
                    aria-controls="nav-competencia"
                    onClick={() => setGroupOpen((o) => !o)}
                    className={clsx(itemCls(active), "inline-flex items-center gap-1")}
                  >
                    {item.name}
                    <ChevronDown size={14} className={clsx("transition-transform", groupOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  <ul
                    id="nav-competencia"
                    hidden={!groupOpen}
                    className="absolute left-0 top-full pt-2 min-w-44"
                  >
                    <li className="rounded-lg border border-white/10 bg-[#0B1E38] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] py-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          aria-current={isActive(c.href) ? "page" : undefined}
                          onClick={() => setGroupOpen(false)}
                          className={clsx(
                            "block px-4 py-2 text-sm font-medium transition-colors",
                            isActive(c.href) ? "text-[#F29A2E]" : "text-[#C9D5E6] hover:text-white hover:bg-white/5"
                          )}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </li>
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/inscripciones"
              className="hidden lg:inline-flex ml-2 px-5 h-10 items-center bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-sm rounded-md transition-colors"
            >
              Clase gratis
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={itemCount > 0 ? `Abrir carrito, ${itemCount} productos` : "Abrir carrito"}
              className="relative w-11 h-11 flex items-center justify-center text-white hover:text-[#F29A2E] transition-colors"
            >
              <ShoppingCart size={21} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#F29A2E] text-[#071426] text-[10px] font-bold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden w-11 h-11 flex items-center justify-center text-white hover:text-[#F29A2E] transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
        <div className="court-rule" />
      </header>

      {/* Menú móvil */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!menuOpen}
        className={clsx(
          "fixed inset-0 z-[60] bg-[#071426] lg:hidden flex flex-col overflow-y-auto transition-transform duration-300 ease-out",
          menuOpen ? "translate-x-0" : "translate-x-full invisible"
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="px-4 h-16 flex items-center justify-between">
          <span className="font-heading font-extrabold text-2xl text-white">Voley Zúñiga</span>
          {/* El acceso al panel queda en el pie de página, lejos de lo que busca un visitante. */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="w-11 h-11 flex items-center justify-center text-white hover:text-[#F29A2E]"
          >
            <X size={26} />
          </button>
        </div>
        <div className="court-rule" />

        <nav aria-label="Menú móvil" className="flex-1 px-4 py-2 flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={clsx(
                "py-3 border-b border-white/10 font-heading font-bold text-[1.7rem] leading-tight",
                isActive(link.href) ? "text-[#F29A2E]" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-6 space-y-3">
          <Link
            href="/inscripciones"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center h-14 bg-[#F29A2E] text-[#071426] font-bold text-lg rounded-md"
          >
            Reservar clase gratis
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={wa()}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 flex items-center justify-center gap-2 border border-[#25D366]/50 text-[#25D366] font-semibold rounded-md"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href={tel} className="h-12 flex items-center justify-center gap-2 border border-white/20 text-white font-semibold rounded-md">
              <Phone size={18} className="text-[#F29A2E]" /> Llamar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
