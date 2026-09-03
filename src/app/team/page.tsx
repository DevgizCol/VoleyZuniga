import React from "react";
import Image from "next/image";

export default function TeamPage() {
  const categories = [
    { name: "Sub-14 Femenino", level: "Iniciación y Formación", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop" },
    { name: "Sub-16 Femenino", level: "Desarrollo Competitivo", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop" },
    { name: "Sub-18 Femenino", level: "Alto Rendimiento", image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop" },
    { name: "Mayores Femenino", level: "Élite Departamental", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-heading font-bold uppercase mb-4">Nuestros Equipos</h1>
        <p className="text-[#64748B] text-xl font-sans max-w-2xl mb-12">
          Conoce las categorías que defienden los colores del Club Voley Zúñiga en los torneos más importantes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative h-80 rounded-3xl overflow-hidden group">
              <Image 
                src={cat.image} 
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-8 left-8">
                <p className="text-[#F29A2E] font-sans font-bold uppercase tracking-widest text-sm mb-2">{cat.level}</p>
                <h3 className="font-heading font-bold text-4xl text-white uppercase">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
