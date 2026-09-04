"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink, Navigation, Compass, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const venues = [
    {
      id: "polideportivo-3-canchas",
      name: "Polideportivo 3 Canchas",
      badge: "Sede Principal de Entrenamiento",
      address: "Sector Buenos Aires / Alejandro Echavarría, Medellín",
      lat: "6.231821",
      lng: "-75.541992",
      schedule: "Lunes a Viernes: 4:00 PM - 8:30 PM | Sábados: 8:00 AM - 1:00 PM",
      desc: "Escenario deportivo dotado con 3 canchas reglamentarias simultáneas, iluminación nocturna LED y graderías para padres de familia.",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=6.231821,-75.541992",
      wazeUrl: "https://waze.com/ul?ll=6.231821,-75.541992&navigate=yes",
      featured: true
    },
    {
      id: "yesid-santos",
      name: "Coliseo Yesid Santos",
      badge: "Sede de Competencia Departamental",
      address: "Unidad Deportiva Atanasio Girardot, Medellín",
      lat: "6.2575",
      lng: "-75.5905",
      schedule: "Fines de semana según programación oficial de Liga",
      desc: "El templo del voleibol antioqueño. Escenario principal de los partidos oficiales de Liga y finales de categoría.",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Coliseo+Yesid+Santos+Medellin",
      wazeUrl: "https://waze.com/ul?q=Coliseo%20Yesid%20Santos%20Medellin&navigate=yes",
      featured: false
    }
  ];

  return (
    <div className="pt-28 pb-20 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F29A2E]/10 border border-[#F29A2E]/20 text-[#F29A2E] text-xs uppercase tracking-widest font-bold mb-6">
            <Compass size={14} />
            <span>Sedes Oficiales & Canales de Atención</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tight text-white mb-6">
            Contacto y <span className="text-[#F29A2E]">Sedes</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-sans leading-relaxed">
            Entrena en las mejores canchas de Medellín. Conoce las coordenadas de nuestras sedes principales y comunícate directamente con nuestro equipo de coordinación deportiva.
          </p>
        </div>

        {/* Sedes Destacadas con Geolocalización */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase mb-8 flex items-center gap-3">
            <MapPin className="text-[#F29A2E]" />
            <span>Nuestros Escenarios de Entrenamiento</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {venues.map((v) => (
              <div 
                key={v.id}
                className={`p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0B1E38] to-[#071426] border transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                  v.featured ? "border-[#F29A2E]/50 ring-1 ring-[#F29A2E]/20" : "border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#F29A2E]/10 text-[#F29A2E] text-xs font-mono uppercase tracking-wider font-bold">
                      {v.badge}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      GPS: {v.lat}, {v.lng}
                    </span>
                  </div>

                  <h3 className="text-3xl font-heading font-bold uppercase text-white mb-3">
                    {v.name}
                  </h3>
                  <p className="text-gray-300 font-sans text-sm mb-6 leading-relaxed">
                    {v.desc}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/10 text-sm text-gray-300 font-sans mb-8">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#F29A2E] shrink-0 mt-0.5" />
                      <span>{v.address}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-[#F29A2E] shrink-0 mt-0.5" />
                      <span>{v.schedule}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Navegación Rápida */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <a
                    href={v.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-colors"
                  >
                    <Navigation size={14} className="text-[#F29A2E]" />
                    <span>Google Maps</span>
                  </a>
                  <a
                    href={v.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-[#00D6FF]/10 hover:bg-[#00D6FF]/20 text-[#00D6FF] font-bold text-xs uppercase tracking-wider rounded-xl border border-[#00D6FF]/20 transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>Abrir Waze</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canales Directos & Card de WhatsApp */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* WhatsApp Card */}
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#0C2417] to-[#071426] border border-[#25D366]/30 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] mb-6">
                <MessageCircle size={26} />
              </div>
              <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2">
                Atención por WhatsApp
              </h3>
              <p className="text-gray-300 font-sans text-sm mb-6 leading-relaxed">
                Coordinación de entrenamientos, cupos disponibles y dudas de padres de familia.
              </p>
              <div className="text-xl font-heading font-bold text-[#25D366] mb-2">
                +57 312 845 9210
              </div>
              <p className="text-xs text-gray-400 font-sans">Lunes a Sábado: 8:00 AM - 7:00 PM</p>
            </div>
            <a
              href="https://wa.me/573128459210?text=Hola,%20quisiera%20información%20sobre%20inscripciones%20y%20sedes%20en%20el%20Club%20Voley%20Zúñiga"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
            >
              <span>Escribir al WhatsApp</span>
            </a>
          </div>

          {/* Correo Electrónico */}
          <div className="p-8 md:p-10 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F29A2E] mb-6">
                <Mail size={26} />
              </div>
              <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2">
                Correo Corporativo
              </h3>
              <p className="text-gray-300 font-sans text-sm mb-6 leading-relaxed">
                Para propuestas institucionales, patrocinios, convenios intercolegiados y prensa.
              </p>
              <div className="text-base font-mono font-bold text-white mb-2">
                contacto@voleyzuniga.com
              </div>
            </div>
            <a
              href="mailto:contacto@voleyzuniga.com"
              className="mt-8 flex items-center justify-center gap-2 py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-colors"
            >
              <span>Enviar Correo</span>
            </a>
          </div>

          {/* Redes Oficiales */}
          <div className="p-8 md:p-10 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F29A2E]/10 border border-[#F29A2E]/20 flex items-center justify-center text-[#F29A2E] mb-6">
                <Compass size={26} />
              </div>
              <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2">
                Comunidad Oficial
              </h3>
              <p className="text-gray-300 font-sans text-sm mb-6 leading-relaxed">
                Sigue el día a día de nuestros atletas, transmisiones en vivo y fotos de los torneos.
              </p>
              <div className="space-y-3 font-sans text-sm">
                <div className="flex items-center justify-between text-gray-300">
                  <span>Instagram Oficial:</span>
                  <span className="font-bold text-[#F29A2E]">@voleyzuniga_oficial</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>Facebook:</span>
                  <span className="font-bold text-[#F29A2E]">clubvoleyzuniga</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span>TikTok:</span>
                  <span className="font-bold text-[#F29A2E]">@voleyzuniga</span>
                </div>
              </div>
            </div>
            <a
              href="https://www.instagram.com/voleyzuniga_oficial"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-colors"
            >
              <span>Ver Instagram</span>
            </a>
          </div>
        </div>
        {/* Tabla Detallada de Horarios por Sede */}
        <div className="mt-20 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F29A2E]/10 text-[#F29A2E] text-xs font-mono uppercase tracking-widest mb-3">
              <Clock size={14} />
              <span>Programación Oficial 2026</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase text-white mb-3">
              Horarios de Entrenamiento por Sede
            </h2>
            <p className="text-gray-400 font-sans text-sm md:text-base">
              Consulta los días y franjas horarias asignadas para cada categoría formativa y de competencia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sede 1 */}
            <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <MapPin className="text-[#F29A2E]" size={24} />
                <div>
                  <h3 className="font-heading font-bold text-xl uppercase text-white">Polideportivo 3 Canchas</h3>
                  <p className="text-xs text-gray-400 font-mono">Buenos Aires • Sede Principal</p>
                </div>
              </div>
              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Semillero Mini-Voley (7 a 11 Años)</span>
                    <span className="text-gray-400">Martes y Jueves</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F29A2E]/10 text-[#F29A2E] font-mono font-bold">4:00 PM - 5:30 PM</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Menores Sub-14 Formativo</span>
                    <span className="text-gray-400">Martes y Jueves</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F29A2E]/10 text-[#F29A2E] font-mono font-bold">5:30 PM - 7:00 PM</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Juvenil Sub-16 y Sub-18</span>
                    <span className="text-gray-400">Martes y Jueves</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F29A2E]/10 text-[#F29A2E] font-mono font-bold">7:00 PM - 8:30 PM</span>
                </div>
                <div className="p-4 rounded-xl bg-[#F29A2E]/5 border border-[#F29A2E]/20 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Fogueo General & Pliometría</span>
                    <span className="text-gray-300">Sábados (Todas las Categorías)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F29A2E] text-[#071426] font-mono font-bold">8:00 AM - 12:00 M</span>
                </div>
              </div>
            </div>

            {/* Sede 2 */}
            <div className="p-8 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <MapPin className="text-[#F29A2E]" size={24} />
                <div>
                  <h3 className="font-heading font-bold text-xl uppercase text-white">Coliseo Yesid Santos</h3>
                  <p className="text-xs text-gray-400 font-mono">Atanasio Girardot • Sede Competencia</p>
                </div>
              </div>
              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Selección Élite Liga Sub-18</span>
                    <span className="text-gray-400">Viernes (Cancha Central)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F29A2E]/10 text-[#F29A2E] font-mono font-bold">6:00 PM - 8:30 PM</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Partidos Oficiales Liga Antioquia</span>
                    <span className="text-gray-400">Sábados (Jornada Mañana / Tarde)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono font-bold">Según Fixture</span>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">Finales y Torneos Interclubes</span>
                    <span className="text-gray-400">Domingos y Festivos</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-mono font-bold">Según Fixture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario Directo de PQRS y Dudas Institucionales */}
        <ContactFormSection />

      </div>
    </div>
  );
}

function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", topic: "Inscripciones", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mt-20 p-8 md:p-12 rounded-3xl bg-[#0B1E38] border border-white/10 shadow-2xl">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#F29A2E] font-mono text-xs uppercase font-bold tracking-widest block mb-2">
            Canal de Atención Institucional
          </span>
          <h2 className="text-2xl md:text-4xl font-heading font-bold uppercase text-white mb-3">
            Formulario de Contacto & PQRS
          </h2>
          <p className="text-gray-400 font-sans text-xs md:text-sm">
            Déjanos tu mensaje y la coordinación deportiva te responderá en menos de 24 horas.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-center">
            <h4 className="font-heading font-bold text-2xl uppercase text-[#25D366] mb-2">¡Mensaje Enviado con Éxito!</h4>
            <p className="text-sm text-gray-300 font-sans">
              Gracias por escribirnos. Nuestro equipo se pondrá en contacto al teléfono o correo suministrado.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre o el del atleta"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 300 000 0000"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">Motivo de Contacto</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#071426] border border-white/10 text-white focus:border-[#F29A2E] outline-none text-xs"
                >
                  <option value="Inscripciones">Inscripciones y Clases de Prueba</option>
                  <option value="Sedes">Información de Sedes y Horarios</option>
                  <option value="Torneos">Invitación a Torneos y Fogueos</option>
                  <option value="PQRS">Peticiones, Quejas o Reclamos (PQRS)</option>
                  <option value="Patrocinios">Patrocinios y Convenios</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">Mensaje o Solicitud *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Escribe aquí tu consulta con el mayor detalle posible..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 focus:border-[#F29A2E] outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
            >
              Enviar Solicitud
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

