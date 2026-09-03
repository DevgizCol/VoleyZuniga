import React from "react";
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
      </div>
    </div>
  );
}

