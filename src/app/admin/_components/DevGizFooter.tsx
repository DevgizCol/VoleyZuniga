import DevGizCredit from "@/components/DevGizCredit";

// Firma del estudio que construye y mantiene el panel.
export default function DevGizFooter() {
  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="max-w-[1600px] px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-[#8FA3BF]">
        <p>
          Panel del Club Voley Zúñiga · {new Date().getFullYear()}
        </p>
        <DevGizCredit />
      </div>
    </footer>
  );
}
