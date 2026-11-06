"use client"; // Los límites de error deben ser componentes cliente

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";

// Pantalla amable si una página falla (p. ej. la hoja de Google no responde); mismo estilo que el 404.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate overflow-hidden floodlights grain text-white min-h-[100svh] flex items-center pt-28 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="font-heading font-black uppercase text-5xl sm:text-7xl leading-[0.9] max-w-2xl">Tiempo técnico</h1>
        <p className="mt-5 text-lg sm:text-xl text-[#C9D5E6] max-w-lg">
          Algo falló al cargar esta página. Suele ser momentáneo: inténtalo de nuevo en unos segundos.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="h-14 px-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg"
          >
            <RotateCw size={20} aria-hidden /> Reintentar
          </button>
          <Link href="/" className="h-14 px-7 inline-flex items-center justify-center rounded-md border border-white/25 hover:border-white font-semibold text-lg">
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
