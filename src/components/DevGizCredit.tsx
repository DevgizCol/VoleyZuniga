import Image from "next/image";

// Firma del estudio que construye la web; igual en el sitio público y en el panel.
export default function DevGizCredit() {
  return (
    <a
      href="https://devgiz.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 rounded-lg -mx-2 px-2 py-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
    >
      <span lang="en">Designed and developed by</span>
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
  );
}
