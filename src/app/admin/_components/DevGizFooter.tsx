import Image from "next/image";

// Firma del estudio que construye y mantiene el panel.
export default function DevGizFooter() {
  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="max-w-[1600px] px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-[#8FA3BF]">
        <p>
          Panel del Club Voley Zúñiga · {new Date().getFullYear()}
        </p>
        <a
          href="https://devgiz.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 rounded-lg -mx-2 px-2 py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
        >
          <span>Diseñado y desarrollado por</span>
          <Image
            src="/devgiz-logo.svg"
            alt="DevGiz Engineering"
            width={400}
            height={100}
            unoptimized
            className="h-8 w-auto opacity-80 transition-opacity duration-200 group-hover:opacity-100"
          />
          <span className="sr-only">(abre en una pestaña nueva)</span>
        </a>
      </div>
    </footer>
  );
}
