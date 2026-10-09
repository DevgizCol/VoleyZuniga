import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, Camera } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "./ContactForm";
import { telLink, waLink } from "@/config/contact";
import { getSessions, getSettings, trainingDays } from "@/lib/content";
import { VENUES, mapEmbed, mapsLink, wazeLink } from "@/data/venues";
import { DAY_NAMES, formatTime } from "@/data/schedule";

export const metadata: Metadata = {
  title: "Sedes y contacto",
  alternates: { canonical: "/contacto" },
  description: "Sedes, horarios y canales de contacto del Club Voley Zúñiga en Medellín.",
};

export const revalidate = 300;

export default async function ContactPage() {
  const [SESSIONS, { contact }] = await Promise.all([getSessions(), getSettings()]);
  const TRAINING_DAYS = trainingDays(SESSIONS);
  return (
    <>
      <PageHero
        kicker="Sedes, horarios y contacto"
        title="Ven a la cancha"
        intro="La forma más rápida de hablar con nosotros es WhatsApp. Si prefieres, deja un mensaje y te respondemos."
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={waLink(contact)} target="_blank" rel="noopener noreferrer" className="h-14 px-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] text-[#071426] font-bold text-lg hover:brightness-110">
            <MessageCircle size={20} /> Escribir por WhatsApp
          </a>
          <a href={telLink(contact)} className="h-14 px-7 inline-flex items-center justify-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold text-lg">
            <Phone size={20} className="text-[#F29A2E]" /> {contact.phoneDisplay}
          </a>
        </div>
      </PageHero>

      {/* Sedes */}
      <section className="bg-[#071426] text-white pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 space-y-6">
          {VENUES.map((v, i) => (
            <article key={v.id} className="grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1E38]">
              <div className={`p-7 sm:p-10 flex flex-col ${i % 2 ? "lg:order-2" : ""}`}>
                <p className="text-sm font-semibold text-[#F29A2E]">{v.role}</p>
                <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none mt-2">{v.name}</h2>
                <p className="mt-4 text-[#C9D5E6]">{v.description}</p>
                <ul className="mt-6 space-y-3 text-[#C9D5E6]">
                  <li className="flex gap-3"><MapPin size={20} className="text-[#F29A2E] shrink-0 mt-0.5" />{v.address}</li>
                  <li className="flex gap-3"><Clock size={20} className="text-[#F29A2E] shrink-0 mt-0.5" />{v.schedule}</li>
                </ul>
                <div className="mt-auto pt-8 flex flex-wrap gap-3">
                  <a href={mapsLink(v)} target="_blank" rel="noopener noreferrer" className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
                    <Navigation size={18} /> Google Maps
                  </a>
                  <a href={wazeLink(v)} target="_blank" rel="noopener noreferrer" className="h-12 px-5 inline-flex items-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold">
                    Waze
                  </a>
                </div>
              </div>
              <div className="relative min-h-[280px] lg:min-h-[380px] bg-[#0F2347]">
                <iframe
                  title={`Mapa de ${v.name}`}
                  src={mapEmbed(v)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0 grayscale-[0.6] contrast-[1.05] invert-[0.92] hue-rotate-180"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Horario compacto */}
      <section className="bg-[#EEF2F7] text-[#0F2347] py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none mb-10">Horarios</h2>
          <div className="overflow-x-auto rounded-xl bg-white shadow-[0_20px_40px_-24px_rgba(15,35,71,0.35)]">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-[#0F2347] text-white">
                <tr>
                  <th scope="col" className="py-3 px-5 font-heading font-black uppercase text-lg">Día</th>
                  <th scope="col" className="py-3 px-5 font-heading font-black uppercase text-lg">Hora</th>
                  <th scope="col" className="py-3 px-5 font-heading font-black uppercase text-lg">Grupo</th>
                  <th scope="col" className="py-3 px-5 font-heading font-black uppercase text-lg">Sede</th>
                </tr>
              </thead>
              <tbody>
                {TRAINING_DAYS.flatMap((day) =>
                  SESSIONS.filter((s) => s.day === day).map((s, i) => (
                    <tr key={`${day}-${s.start}`} className={`border-t border-[#0F2347]/10 ${i === 0 ? "border-t-[#0F2347]/25" : ""}`}>
                      <td className="py-3.5 px-5 font-semibold">{i === 0 ? DAY_NAMES[day] : ""}</td>
                      <td className="py-3.5 px-5 tabular-nums whitespace-nowrap">{formatTime(s.start)} – {formatTime(s.end)}</td>
                      <td className="py-3.5 px-5">{s.group}</td>
                      <td className="py-3.5 px-5 text-[#44546F]">{s.sede}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Formulario + canales */}
      <section className="bg-[#071426] text-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none">Escríbenos</h2>
            <p className="mt-4 text-[#C9D5E6] text-lg">Para torneos, patrocinios, PQRS o cualquier duda. Respondemos en horario de oficina.</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-[#F29A2E]">
                  <span className="w-11 h-11 rounded-full bg-white/[0.06] flex items-center justify-center"><Mail size={20} className="text-[#F29A2E]" /></span>
                  <span className="break-all">{contact.email}</span>
                </a>
              </li>
              <li>
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#F29A2E]">
                  <span className="w-11 h-11 rounded-full bg-white/[0.06] flex items-center justify-center"><Camera size={20} className="text-[#F29A2E]" /></span>
                  {contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
