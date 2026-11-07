import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ScanLine } from "lucide-react";
import { PageHeader, Card, btn } from "../_components/ui";

export const metadata: Metadata = { title: "Clase gratis" };
export const dynamic = "force-dynamic";

// Plan B si el QR no escanea (pantalla rota o pase viejo con el QR de WhatsApp): escribir el código.
export default async function FreeClassLookup({ searchParams }: { searchParams: Promise<{ codigo?: string }> }) {
  const { codigo } = await searchParams;
  const code = (codigo || "").trim().toUpperCase().slice(0, 20);
  if (code) redirect(`/admin/pase/${encodeURIComponent(code)}`);

  return (
    <>
      <PageHeader
        title="Clase gratis"
        description="Escanea el QR del pase con la cámara del celular y se abre la ficha. Si no escanea, escribe el código del pase."
      />
      <Card className="p-5 max-w-xl">
        <form method="get" className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="codigo" className="sr-only">Código del pase</label>
          <input
            id="codigo"
            name="codigo"
            required
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="Ej. VZ14-4FGR"
            className="flex-1 h-12 rounded-lg bg-white/[0.05] border border-[#6B7F9C] px-4 uppercase tracking-wide focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent"
          />
          <button type="submit" className={btn.primary}>
            <ScanLine size={18} /> Buscar
          </button>
        </form>
      </Card>
    </>
  );
}
