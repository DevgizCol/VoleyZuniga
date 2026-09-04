"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Share2, MessageCircle, Sparkles, Check, Bookmark, X, Mail, Send, Heart, BookOpen } from "lucide-react";

interface Article {
  id: number;
  title: string;
  category: "Crónicas de Partidos" | "Convocatorias Selección" | "Nutrición & Rendimiento" | "Vida en el Club";
  date: string;
  readTime: string;
  image: string;
  gallery?: string[];
  excerpt: string;
  fullBody: string;
  author: string;
}

export default function NewsPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // New comment draft in modal
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<{ name: string; text: string; time: string }[]>([
    { name: "Carlos Restrepo (Padre Sub-18)", text: "¡Qué partidazo vivieron las chicas en el Coliseo! Muy merecido el título después de tantos meses de entreno.", time: "Hace 2 horas" },
    { name: "Luisa F. Gómez", text: "Excelente nivel de bloqueo y concentración. Felicitaciones al cuerpo técnico.", time: "Hace 5 horas" }
  ]);

  const allArticles: Article[] = [
    {
      id: 1,
      title: "Club Voley Zúñiga se Corona Campeón Departamental Sub-18 en el Yesid Santos",
      category: "Crónicas de Partidos",
      date: "02 Septiembre 2026",
      readTime: "4 min de lectura",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop"
      ],
      excerpt: "En un emocionante desempate a 5 sets frente a Envigado VC, nuestras atletas demostraron temple y disciplina táctica para levantar el trofeo más codiciado del voleibol juvenil antioqueño.",
      fullBody: "Con gradas repletas de familiares y aficionados, el Coliseo Yesid Santos fue testigo de una de las finales más disputadas de la Liga Departamental. Tras perder el primer set 22-25, el equipo dirigido por el DT Alberto Zúñiga ajustó el bloqueo central con Manuela Restrepo y explotó la paralela con Valentina Morales. En el tie-break decisivo (15-11), tres saques flotantes consecutivos sellaron la victoria dorada para nuestro club.",
      author: "Comité de Prensa Zúñiga"
    },
    {
      id: 2,
      title: "Tres Atletas de Zúñiga Convocadas a la Preselección Antioquia 2026",
      category: "Convocatorias Selección",
      date: "28 Agosto 2026",
      readTime: "2 min de lectura",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
      excerpt: "Mariana Restrepo, Valeria Gómez y Sofía Arango iniciarán concentración oficial en el Coliseo Mayor con miras al Campeonato Nacional Interligas.",
      fullBody: "La Liga Antioqueña de Voleibol oficializó la lista de 18 preseleccionadas departamentales rumbo al Nacional Interligas en Cali. Nos enorgullece anunciar que tres de nuestras formadas en el semillero vestirán los colores del departamento: Mariana Restrepo (Opuesta), Valeria Gómez (Líbero) y Sofía Arango (Armadora).",
      author: "Coordinación Deportiva"
    },
    {
      id: 3,
      title: "Apertura de Nuevos Horarios en el Polideportivo 3 Canchas",
      category: "Vida en el Club",
      date: "15 Agosto 2026",
      readTime: "2 min de lectura",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop",
      excerpt: "Para responder a la alta demanda de matrículas, habilitamos grupos vespertinos de iniciación para niñas y niños de 8 a 13 años con entrenadores avalados.",
      fullBody: "El Club Voley Zúñiga continúa expandiendo su impacto en la comuna 9 y Belén. A partir de septiembre, abrimos 40 nuevos cupos formativos en horarios de 4:00 PM a 6:00 PM los martes y jueves, dotados de material Mikasa oficial y entrenadores con licencia FIVB Nivel 1.",
      author: "Administración Sede"
    },
    {
      id: 4,
      title: "Claves de la Pliometría en el Voleibol Moderno: Cómo Aumentar tu Salto",
      category: "Nutrición & Rendimiento",
      date: "05 Agosto 2026",
      readTime: "4 min de lectura",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
      excerpt: "El preparador físico del club explica los ejercicios biomecánicos que permitieron a nuestro equipo promediar un incremento de 12 cm de suspensión esta temporada.",
      fullBody: "El salto vertical en voleibol no depende únicamente de la fuerza bruta de las piernas, sino de la velocidad del ciclo de estiramiento-acortamiento (CEA). En este artículo, el PF Felipe Durango desglosa cómo los saltos de caja (Depth Jumps) combinados con una ingesta balanceada de creatina y descanso activo optimizan la reactividad en la red.",
      author: "Felipe Durango (Preparador Físico)"
    }
  ];

  const categories = ["Todas", "Crónicas de Partidos", "Convocatorias Selección", "Nutrición & Rendimiento", "Vida en el Club"];

  const filteredArticles = selectedCategory === "Todas"
    ? allArticles
    : allArticles.filter(a => a.category === selectedCategory);

  const featuredArticle = allArticles[0];

  const handleShareWhatsApp = (title: string) => {
    const text = `📰 *${title}*\n\nLee la crónica completa en el portal oficial de Voley Zúñiga:\nhttps://voleyzuniga.com/news`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyLink = (id: number) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`https://voleyzuniga.com/news`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 3000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      { name: "Padre / Aficionado Invitado", text: newComment.trim(), time: "Ahora mismo" },
      ...comments
    ]);
    setNewComment("");
  };

  return (
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
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

        {/* 1. Filtros por Temas */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#F29A2E] text-[#071426] shadow-md"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2. Featured Article (Revista Editorial) */}
        {selectedCategory === "Todas" && (
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

                  <p className="text-gray-300 font-sans text-sm md:text-base leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </p>

                  <button
                    onClick={() => setReadingArticle(featuredArticle)}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#F29A2E] hover:underline mb-6 cursor-pointer"
                  >
                    <BookOpen size={15} />
                    <span>Leer Crónica Completa & Galería</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Botones de Compartir */}
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleShareWhatsApp(featuredArticle.title)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#071426] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>Compartir en WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(featuredArticle.id)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                  >
                    {copiedId === featuredArticle.id ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                    <span>{copiedId === featuredArticle.id ? "¡Copiado!" : "Copiar Enlace"}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. Grid de Artículos */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-8">
            {selectedCategory === "Todas" ? "Más Novedades del Club" : `Noticias de: ${selectedCategory}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((item) => (
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

                    <h4 
                      onClick={() => setReadingArticle(item)}
                      className="font-heading font-bold text-xl uppercase text-white mb-3 group-hover:text-[#F29A2E] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>

                    <button
                      onClick={() => setReadingArticle(item)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#F29A2E] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <button
                    onClick={() => handleShareWhatsApp(item.title)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#25D366] hover:underline cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>Compartir</span>
                  </button>
                  <button
                    onClick={() => handleCopyLink(item.id)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    title="Copiar enlace"
                  >
                    {copiedId === item.id ? <Check size={16} className="text-green-400" /> : <Share2 size={16} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 4. Caja de Suscripción a Novedades (Boletín Oficial) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0F284B] via-[#0B1E38] to-[#071426] border border-[#F29A2E]/30 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/30 text-[#F29A2E] text-[10px] uppercase font-mono font-bold mb-4">
              <Mail size={12} />
              <span>Boletín Oficial de Padres & Aficionados</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-2">
              Recibe las Convocatorias y Fixture en tu Correo
            </h3>
            <p className="text-xs md:text-sm text-gray-300 font-sans mb-6">
              Sin spam. Te enviaremos únicamente la programación semanal de partidos, resultados de liga y noticias de matrículas.
            </p>

            {newsletterSubscribed ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-sans">
                <Check size={18} />
                <span>¡Gracias por unirte a la familia Zúñiga! Tu correo ha sido suscrito con éxito.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-sm font-sans"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Suscribirme Gratis
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 5. MODAL DE LECTURA COMPLETA DE ARTÍCULO & COMENTARIOS */}
        {readingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-[#0B1E38] border-2 border-[#F29A2E]/50 p-6 md:p-10 shadow-2xl overflow-y-auto">
              
              <button
                onClick={() => setReadingArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#071426] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/20 text-[#F29A2E] text-[10px] font-mono uppercase font-bold mb-3">
                {readingArticle.category}
              </div>

              <h2 className="text-2xl md:text-4xl font-heading font-bold uppercase text-white mb-4 leading-tight">
                {readingArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-6 border-b border-white/10 pb-4">
                <span>Por: <strong className="text-white">{readingArticle.author}</strong></span>
                <span>•</span>
                <span>{readingArticle.date}</span>
                <span>•</span>
                <span>{readingArticle.readTime}</span>
              </div>

              {/* Imagen Principal */}
              <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden mb-6">
                <Image src={readingArticle.image} alt={readingArticle.title} fill className="object-cover" />
              </div>

              {/* Cuerpo del Artículo */}
              <div className="space-y-4 text-gray-200 font-sans text-sm md:text-base leading-relaxed mb-8">
                <p className="font-bold text-white text-base md:text-lg">
                  {readingArticle.excerpt}
                </p>
                <p>
                  {readingArticle.fullBody}
                </p>
              </div>

              {/* Galería Adicional */}
              {readingArticle.gallery && readingArticle.gallery.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-mono uppercase text-[#F29A2E] font-bold mb-3">Fotografías del Encuentro</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {readingArticle.gallery.map((img, idx) => (
                      <div key={idx} className="relative h-40 rounded-xl overflow-hidden">
                        <Image src={img} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Comentarios */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-base font-heading font-bold uppercase text-white mb-4">
                  Comentarios de la Comunidad ({comments.length})
                </h4>

                <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Deja un mensaje de apoyo al equipo..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs outline-none focus:border-[#F29A2E]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#F29A2E] text-[#071426] font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Publicar
                  </button>
                </form>

                <div className="space-y-3">
                  {comments.map((c, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                      <div className="flex items-center justify-between text-gray-400 font-mono text-[10px] mb-1">
                        <strong className="text-white">{c.name}</strong>
                        <span>{c.time}</span>
                      </div>
                      <p className="text-gray-300 font-sans">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
