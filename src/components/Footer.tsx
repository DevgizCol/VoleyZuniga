import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Camera } from "lucide-react";
import { NAV_LINKS, SITE } from "@/config/site";
import { telLink } from "@/config/contact";
import { getSettings } from "@/lib/content";
import { SEDES } from "@/data/registration";

export default async function Footer() {
  const { contact } = await getSettings();
  return (
    <footer className="w-full bg-[#050E1C] text-white pt-14 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pb-10">
      <div className="court-rule mb-12" />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-14">
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 w-fit" aria-label={`${SITE.name}, inicio`}>
              <Image src="/logo-trim.png" alt="" width={800} height={473} className="h-14 w-auto" />
              <span className="font-heading font-extrabold text-3xl leading-none">Voley Zúñiga</span>
            </Link>
            <p className="text-[#B7C4D8] text-sm leading-relaxed max-w-sm">
              Escuela y club de voleibol en {SITE.city}. Formamos deportistas, y cuando se puede, campeones.
            </p>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 w-fit text-sm font-semibold text-white hover:text-[#F29A2E] transition-colors"
            >
              <Camera size={18} className="text-[#F29A2E]" /> Instagram {contact.instagramHandle}
            </a>
          </div>

          <nav aria-label="Pie de página" className="md:col-span-3">
            <h2 className="font-heading font-bold text-xl mb-4 text-white">Navegar</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-[#B7C4D8]">
              <li><Link href="/inscripciones" className="hover:text-[#F29A2E] transition-colors">Inscribirme</Link></li>
              {NAV_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-[#F29A2E] transition-colors">{l.name}</Link></li>
              ))}
              <li><Link href="/galeria" className="hover:text-[#F29A2E] transition-colors">Galería</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="font-heading font-bold text-xl mb-4 text-white">Dónde entrenamos</h2>
            <ul className="flex flex-col gap-3.5 text-sm text-[#B7C4D8]">
              {SEDES.map((s) => (
                <li key={s.value} className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#F29A2E] shrink-0 mt-0.5" />
                  <span>{s.label}</span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#F29A2E] shrink-0" />
                <a href={telLink(contact)} className="hover:text-white">{contact.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#F29A2E] shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white break-all">{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-[#8FA3BF]">
          <p>
            © 2026 {SITE.name}.{" "}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-[#F29A2E]">
              Política de datos
            </Link>
            {" · "}
            <Link href="/admin" className="underline underline-offset-2 hover:text-[#F29A2E]">
              Acceso entrenadores
            </Link>
          </p>
          <p>
            Sitio web por{" "}
            <a href="https://devgiz.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:text-[#F29A2E]">
              DevGiz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
