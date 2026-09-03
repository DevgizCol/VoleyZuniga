import React from "react";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 bg-[#F7F8FA] min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-heading font-bold uppercase mb-4 text-[#071426]">
          Contacto y Sedes
        </h1>
        <p className="text-[#64748B] text-xl font-sans max-w-2xl mb-12">
          Entrena con nosotros. Conoce nuestras sedes, horarios y canales de atención directa en Medellín.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow">
              <h2 className="text-3xl font-heading font-bold uppercase text-[#071426] mb-6">Ponte en Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#071426]/5 rounded-xl flex items-center justify-center text-[#F29A2E] flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Llámanos o escríbenos (WhatsApp)</h4>
                    <p className="text-[#64748B]">+57 312 845 9210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#071426]/5 rounded-xl flex items-center justify-center text-[#F29A2E] flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Correo Electrónico</h4>
                    <p className="text-[#64748B]">contacto@voleyzuniga.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#071426]/5 rounded-xl flex items-center justify-center text-[#F29A2E] flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Sedes Principales</h4>
                    <p className="text-[#64748B]">- Coliseo Yesid Santos (Atanasio Girardot)<br />- Canchas Buenos Aires / Alejandro Echavarría</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-bold mb-4 uppercase">Redes Sociales</h4>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/voleyzuniga_oficial" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#071426] flex items-center justify-center text-white hover:bg-[#F29A2E] transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="https://www.facebook.com/clubvoleyzuniga" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#071426] flex items-center justify-center text-white hover:bg-[#F29A2E] transition-colors">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario / CTA */}
          <div className="bg-[#071426] p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center">
            <h2 className="text-4xl font-heading font-bold uppercase mb-4">¿Listo para unirte?</h2>
            <p className="text-white/80 text-lg mb-8">
              Déjanos un mensaje a través de WhatsApp y nuestro equipo de coordinación deportiva te responderá con toda la información sobre mensualidades, horarios y disponibilidad por categoría.
            </p>
            <a 
              href="https://wa.me/573128459210?text=Hola,%20quisiera%20más%20información%20para%20unirme%20al%20Club%20Voley%20Zúñiga"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F29A2E] text-[#071426] py-4 px-8 rounded-xl font-bold uppercase text-lg text-center hover:bg-white transition-colors"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
