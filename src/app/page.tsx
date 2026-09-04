"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CinematicHero from "@/components/CinematicHero";
import InteractiveBall3D from "@/components/InteractiveBall3D";
import FloatingActionBar from "@/components/FloatingActionBar";
import {
  Users, Trophy, MapPin, HeartHandshake, ArrowRight, Zap, Award,
  Sparkles, ShieldCheck, Camera, ChevronDown, Heart, MessageCircle, Play
} from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const socialPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
      title: "Celebración del Título Departamental Sub-18 🏆🥇",
      tag: "Liga Antioquia",
      likes: "1.4k",
      comments: "128",
      type: "reel"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
      title: "Entrenamiento de salto pliométrico y bloqueo 🔥",
      tag: "Preparación Física",
      likes: "942",
      comments: "64",
      type: "video"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop",
      title: "Semillero Infantil en acción: Pasión desde pequeños 🏐",
      tag: "Semillero",
      likes: "2.1k",
      comments: "185",
      type: "foto"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop",
      title: "El punto de campeonato en 5 sets. ¡Garra Zúñiga! ⚡",
      tag: "Match Point",
      likes: "3.2k",
      comments: "310",
      type: "reel"
    }
  ];

  const faqs = [
    {
      q: "¿A partir de qué edad pueden ingresar los niños y jóvenes al club?",
      a: "Recibimos deportistas desde los 7 años en nuestra categoría Semillero / Mini-Voley, con pedagogía lúdico-formativa adaptada a su desarrollo motriz. Para jóvenes de 12 a 18 años contamos con equipos formativos y de alta competencia de Liga."
    },
    {
      q: "¿Cómo es el proceso de la clase de prueba sin costo?",
      a: "¡Es muy sencillo! Generas tu Carnet VIP Digital desde nuestra web, seleccionas la sede más cercana (Polideportivo 3 Canchas o Coliseo Yesid Santos) y asistes a tu primer entrenamiento de valoración técnica con nuestros entrenadores certificados sin ningún compromiso."
    },
    {
      q: "¿Cuáles son las sedes y horarios de entrenamiento?",
      a: "Nuestra sede principal es el Polideportivo 3 Canchas (Buenos Aires) con entrenamientos martes y jueves de 4:00 PM a 6:00 PM y sábados de 8:00 AM a 12:00 M. Los entrenamientos de alta competencia de la categoría Sub-18 se realizan en el Coliseo Yesid Santos."
    },
    {
      q: "¿Qué indumentaria deportiva se necesita para el primer día?",
      a: "Para la primera clase de prueba solo requieres ropa deportiva cómoda (licra o pantaloneta), camiseta deportiva, tenis con buen agarre para cancha y termo de hidratación. Una vez formalizada la matrícula, recibirás la indumentaria oficial del club."
    },
    {
      q: "¿El club participa en torneos oficiales y departamentales?",
      a: "Sí. Club Voley Zúñiga participa activamente en la Liga Departamental de Voleibol de Antioquia, torneos municipales del Inder Medellín y festivales interclubes nacionales, garantizando fogueo competitivo real a nuestras atletas."
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#071426] text-white">
      {/* 1. Cinematic Hero with 3D Logo */}
      <CinematicHero />

      {/* Floating Action Pill for Mobile Devices */}
      <FloatingActionBar />

      {/* 2. Animated Metrics Counter Section */}
      <section className="w-full py-16 bg-gradient-to-b from-[#071426] via-[#0A192F] to-[#071426] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,154,46,0.06),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <StatCard
              icon={<Users size={28} className="text-[#F29A2E]" />}
              number="+450"
              label="Atletas Formados"
              desc="Desde semillero hasta juvenil"
            />
            <StatCard
              icon={<Trophy size={28} className="text-[#F29A2E]" />}
              number="12"
              label="Títulos & Podios"
              desc="En torneos departamentales"
            />
            <StatCard
              icon={<MapPin size={28} className="text-[#F29A2E]" />}
              number="3"
              label="Sedes en Medellín"
              desc="Polideportivo & Coliseos"
            />
            <StatCard
              icon={<HeartHandshake size={28} className="text-[#F29A2E]" />}
              number="100%"
              label="Valores & Disciplina"
              desc="Compromiso humano integral"
            />
          </div>
        </div>
      </section>

      {/* 3. Bento Grid: Metodología & Filosofía Premium */}
      <section className="w-full py-24 bg-[#071426] relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-4">
                <Sparkles size={14} />
                <span>Metodología de Élite</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold uppercase tracking-tight text-white">
                El Estándar <span className="text-[#F29A2E]">Zúñiga</span>
              </h2>
            </div>
            <p className="text-gray-400 text-base md:text-lg max-w-xl font-sans leading-relaxed">
              No creemos en atajos. Nuestro programa combina ciencia deportiva, disciplina táctica y formación de carácter para forjar atletas que destacan dentro y fuera del coliseo.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Bento 1: Biomecánica & Salto Vertical */}
            <div className="md:col-span-2 group relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0B1E38] to-[#071426] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#F29A2E]/10 rounded-full blur-3xl group-hover:bg-[#F29A2E]/20 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[260px]">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F29A2E] mb-6">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-3">
                    Biomecánica & Salto de Alta Competencia
                  </h3>
                  <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed max-w-xl mb-6">
                    Optimizamos la batida, la suspensión y el golpeo mediante corrección de postura en video y acondicionamiento pliométrico progresivo para prevenir lesiones.
                  </p>
                  <Link href="/club/methodology" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F29A2E] hover:text-white transition-colors">
                    <span>Conocer nuestra metodología</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento 2: Semillero Temprano */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#0B1E38] to-[#071426] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-500 shadow-2xl">
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[260px]">
                <div className="w-12 h-12 rounded-2xl bg-[#F29A2E]/10 border border-[#F29A2E]/20 flex items-center justify-center text-[#F29A2E] mb-6">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-heading font-bold uppercase text-white mb-3">
                    Semillero de Iniciación
                  </h3>
                  <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6">
                    Desde los 7 años. Desarrollamos la coordinación óculo-manual y el amor por el voleibol con pedagogía deportiva positiva.
                  </p>
                  <Link href="/registrations" className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-[#F29A2E] transition-colors flex items-center gap-2">
                    <span>Ver categorías formativas</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento 3: Torneos & Fogueo */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#0B1E38] to-[#071426] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-500 shadow-2xl">
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[260px]">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F29A2E] mb-6">
                  <Trophy size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-heading font-bold uppercase text-white mb-3">
                    Fogueo Departamental
                  </h3>
                  <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6">
                    Nuestros equipos compiten periódicamente en la Liga Antioqueña y festivales nacionales para forjar carácter competitivo real.
                  </p>
                  <Link href="/games" className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-[#F29A2E] transition-colors flex items-center gap-2">
                    <span>Ver fixture y partidos</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento 4: Filosofía de Vida */}
            <div className="md:col-span-2 group relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0B1E38] to-[#071426] border border-white/10 hover:border-[#F29A2E]/40 transition-all duration-500 overflow-hidden shadow-2xl">
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[260px]">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F29A2E] mb-6">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-xs text-white/80 uppercase tracking-widest font-mono mb-2">
                    Lema Institucional
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold uppercase text-white mb-3">
                    No formamos jugadores, formamos campeones
                  </h3>
                  <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed max-w-xl mb-6">
                    Inculcamos puntualidad, resiliencia ante la derrota, humildad en el triunfo y respeto por los compañeros, rivales y jueces.
                  </p>
                  <Link href="/club/history" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F29A2E] hover:text-white transition-colors">
                    <span>Conocer nuestra historia</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Muro Social en Vivo (Instagram & TikTok Feed) */}
      <section className="w-full py-20 bg-gradient-to-b from-[#071426] via-[#091B33] to-[#071426] border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E1306C]/15 border border-[#E1306C]/30 text-[#E1306C] text-xs uppercase tracking-widest font-bold mb-3">
                <Camera size={14} />
                <span>Comunidad en Redes</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight text-white">
                Viviendo la Pasión <span className="text-[#F29A2E]">En Vivo</span>
              </h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-[#F29A2E] hover:text-[#071426] text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/10"
            >
              <Camera size={16} />
              <span>Seguir @voley_zuniga</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialPosts.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-3xl overflow-hidden bg-[#0B1E38] border border-white/10 hover:border-[#F29A2E]/50 transition-all duration-300 shadow-xl"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/30 to-transparent" />

                  {/* Badge Tipo */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-xs border border-white/20">
                    {post.type === "reel" ? <Play size={12} fill="white" /> : <Sparkles size={12} />}
                  </div>

                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[#F29A2E] text-[#071426] text-[10px] font-mono font-bold uppercase">
                    {post.tag}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm font-sans font-medium text-gray-200 line-clamp-2 mb-4 group-hover:text-[#F29A2E] transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Heart size={14} className="text-red-400" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={14} className="text-gray-400" /> {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive 3D Ball Section */}
      <InteractiveBall3D />

      {/* 6. FAQ (Preguntas Frecuentes con Acordeón) */}
      <section className="w-full py-24 bg-[#071426] border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-4">
              <span>Resolvemos tus Dudas</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight text-white mb-4">
              Preguntas <span className="text-[#F29A2E]">Frecuentes</span>
            </h2>
            <p className="text-gray-400 font-sans text-base md:text-lg">
              Todo lo que los acudientes y nuevos atletas necesitan saber para iniciar.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                      ? "bg-[#0B1E38] border-[#F29A2E]/40 shadow-xl"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-heading font-bold text-lg md:text-xl uppercase text-white tracking-wide">
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "bg-[#F29A2E] text-[#071426] rotate-180" : "bg-white/5 text-gray-400"
                      }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-gray-300 font-sans text-sm md:text-base leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Nocturnal Stadium Call-To-Action */}
      <section className="w-full py-28 bg-gradient-to-b from-[#071426] via-[#0A1A33] to-[#050D1A] relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(242,154,46,0.18),transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] font-bold text-xs uppercase tracking-widest mb-6">
            <span>Temporada 2026</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Tu Lugar en la Cancha <span className="text-[#F29A2E]">Te Espera</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed mb-10">
            Ya sea que desees iniciar desde cero o perfeccionar tu remate para torneos nacionales, en el Club Voley Zúñiga encontrarás el equipo para alcanzar tu máximo potencial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/registrations"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F29A2E] to-[#FF8008] text-[#071426] font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(242,154,46,0.4)] transition-all active:scale-95"
            >
              Iniciar Pre-inscripción
            </Link>
            <Link
              href="/club/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-xl border border-white/15 transition-all"
            >
              Conocer Sedes y Horarios
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ icon, number, label, desc }: { icon: React.ReactNode, number: string, label: string, desc: string }) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#F29A2E]/30 transition-all duration-300 flex flex-col justify-between group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-1 tracking-tight">
          {number}
        </h3>
        <p className="text-xs font-bold uppercase tracking-wider text-[#F29A2E] mb-1">
          {label}
        </p>
        <p className="text-xs text-gray-400 font-sans">
          {desc}
        </p>
      </div>
    </div>
  );
}

