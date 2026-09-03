"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Share2, MessageCircle, Sparkles, Check, Bookmark } from "lucide-react";

export default function NewsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const featuredArticle = {
    id: 1,
    title: "Club Voley Zúñiga se Corona Campeón Departamental Sub-18 en el Yesid Santos",
    category: "Liga Antioqueña",
    date: "02 Septiembre 2026",
    readTime: "3 min de lectura",
    image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=1200&auto=format&fit=crop",
    excerpt: "En un emocionante desempate a 5 sets frente a Envigado VC, nuestras atletas demostraron temple y disciplina táctica para levantar el trofeo más codiciado del voleibol juvenil antioqueño.",
    author: "Comité de Prensa Zúñiga"
  };

  const articles = [
    {
      id: 2,
      title: "Tres Atletas de Zúñiga Convocadas a la Preselección Antioquia 2026",
      category: "Selección & Élite",
      date: "28 Agosto 2026",
      readTime: "2 min",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
      excerpt: "Mariana Restrepo, Valeria Gómez y Sofía Arango iniciarán concentración oficial en el Coliseo Mayor con miras al Campeonato Nacional Interligas."
    },
    {
      id: 3,
      title: "Apertura de Nuevos Horarios en el Polideportivo 3 Canchas",
      category: "Institucional",
      date: "15 Agosto 2026",
      readTime: "2 min",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop",
      excerpt: "Para responder a la alta demanda de matrículas, habilitamos grupos vespertinos de iniciación para niñas y niños de 8 a 13 años con entrenadores avalados."
    },
    {
      id: 4,
      title: "Claves de la Pliometría en el Voleibol Moderno: Cómo Aumentar tu Salto",
      category: "Ciencia Deportiva",
      date: "05 Agosto 2026",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
      excerpt: "El preparador físico del club explica los ejercicios biomecánicos que permitieron a nuestro equipo promediar un incremento de 12 cm de suspensión esta temporada."
    }
  ];

  const handleShareWhatsApp = (title: string) => {
    const text = `📰 *${title}*\n\nLee la noticia completa en la web oficial del Club Voley Zúñiga:\nhttps://voleyzuniga.com/news`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = (id: number) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`https://voleyzuniga.com/news`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
            <Sparkles size={14} />
            <span>Prensa & Cobertura Deportiva</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Noticias y <span className="text-[#F29A2E]">Actualidad</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-sans leading-relaxed">
            Crónicas de partidos, convocatorias departamentales y eventos de la comunidad Voley Zúñiga.
          </p>
        </div>

        {/* 1. Featured Article (Revista Editorial) */}
        <div className="mb-20 rounded-3xl overflow-hidden bg-gradient-to-t from-[#040C18] via-[#0B1E38] to-[#071426] border border-white/10 shadow-2xl relative group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Foto Editorial (Col 7) */}
            <div className="lg:col-span-7 relative h-80 lg:h-[480px] w-full overflow-hidden">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040C18] via-[#040C18]/40 to-transparent lg:hidden" />
              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-[#F29A2E] text-[#071426] font-mono text-xs font-bold uppercase tracking-wider shadow-lg">
                {featuredArticle.category}
              </div>
            </div>

            {/* Texto y Contenido (Col 5) */}
            <div className="lg:col-span-5 p-8 lg:pr-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#F29A2E]" />
                    {featuredArticle.date}
                  </span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold uppercase text-white mb-4 leading-tight group-hover:text-[#F29A2E] transition-colors">
                  {featuredArticle.title}
                </h2>

                <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-8">
                  {featuredArticle.excerpt}
                </p>
              </div>

              {/* Botones de Compartir */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => handleShareWhatsApp(featuredArticle.title)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#071426] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  <MessageCircle size={16} />
                  <span>Compartir en WhatsApp</span>
                </button>
                <button
                  onClick={() => handleCopyLink(featuredArticle.id)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors"
                >
                  {copiedId === featuredArticle.id ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                  <span>{copiedId === featuredArticle.id ? "¡Copiado!" : "Copiar Enlace"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Grid de Noticias Secundarias */}
        <div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-8">
            Más Novedades del Club
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((item) => (
              <article 
                key={item.id} 
                className="rounded-3xl bg-[#0B1E38] border border-white/10 overflow-hidden shadow-xl hover:border-[#F29A2E]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#071426]/80 backdrop-blur-md border border-white/10 text-[#F29A2E] font-mono text-[10px] font-bold uppercase">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 mb-3">
                      <Calendar size={13} className="text-[#F29A2E]" />
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h4 className="font-heading font-bold text-xl uppercase text-white mb-3 group-hover:text-[#F29A2E] transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <button
                    onClick={() => handleShareWhatsApp(item.title)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#25D366] hover:underline"
                  >
                    <MessageCircle size={14} />
                    <span>Compartir</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(item.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copiar enlace"
                  >
                    {copiedId === item.id ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

