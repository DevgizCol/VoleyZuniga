import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export default function NewsPage() {
  const news = [
    { id: 1, title: "Zúñiga se corona campeón departamental Sub-18", date: "24 Ago 2026", image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop", excerpt: "Nuestro equipo femenino sub-18 logró una victoria histórica en la final departamental..." },
    { id: 2, title: "Nuevos horarios de entrenamiento 2026-2", date: "15 Ago 2026", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", excerpt: "Conoce los nuevos horarios para todas las categorías en el Coliseo Yesid Santos." },
    { id: 3, title: "Convocatoria Selección Antioquia", date: "02 Ago 2026", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop", excerpt: "Tres de nuestros deportistas han sido llamados a representar al departamento." },
  ];

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-heading font-bold uppercase mb-4">Noticias y Actualidad</h1>
        <p className="text-[#64748B] text-xl font-sans max-w-2xl mb-12">
          Mantente al tanto de los logros, eventos y novedades de la familia Voley Zúñiga.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="group cursor-pointer">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90 text-sm font-sans font-medium">
                  <Calendar size={16} /> {item.date}
                </div>
              </div>
              <h3 className="font-heading font-bold text-2xl uppercase mb-3 group-hover:text-[#F29A2E] transition-colors">{item.title}</h3>
              <p className="text-[#64748B] font-sans mb-4 line-clamp-2">{item.excerpt}</p>
              <span className="inline-flex items-center gap-2 font-bold uppercase text-sm text-[#0F2347] group-hover:text-[#F29A2E] transition-colors">
                Leer Más <ArrowRight size={16} />
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
