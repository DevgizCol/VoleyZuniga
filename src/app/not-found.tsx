import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import HeroCourt from "@/components/HeroCourt";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden floodlights grain text-white min-h-[100svh] flex items-center pt-28 pb-16">
      <HeroCourt className="absolute -z-10 w-[120%] sm:w-[80%] lg:w-[55%] right-[-10%] bottom-0 opacity-30" />
      <div className="container mx-auto px-4 sm:px-6">
        <p className="font-heading font-black text-[#F29A2E] text-8xl sm:text-9xl leading-none tabular-nums">404</p>
        <h1 className="mt-4 font-heading font-black uppercase text-5xl sm:text-7xl leading-[0.9] max-w-2xl">Balón fuera</h1>
        <p className="mt-5 text-lg sm:text-xl text-[#C9D5E6] max-w-lg">La página que buscas no existe o cambió de dirección. Volvamos al juego.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/" className="h-14 px-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg">
            <ArrowLeft size={20} /> Ir al inicio
          </Link>
          <Link href="/games" className="h-14 px-7 inline-flex items-center justify-center rounded-md border border-white/25 hover:border-white font-semibold text-lg">
            Ver partidos
          </Link>
        </div>
      </div>
    </section>
  );
}
