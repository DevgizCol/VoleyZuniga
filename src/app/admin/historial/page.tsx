import type { Metadata } from "next";
import { adminRead } from "@/lib/sheets";
import { PageHeader, NotConnected, Card, Empty, Badge } from "../_components/ui";

export const metadata: Metadata = { title: "Historial" };
export const dynamic = "force-dynamic";

const tone = (a: string) => (a.startsWith("Borr") ? "danger" : a.startsWith("Cre") ? "success" : "info") as "danger" | "success" | "info";

export default async function HistoryAdmin({ searchParams }: { searchParams: Promise<{ quien?: string; pestana?: string }> }) {
  const { quien, pestana } = await searchParams;
  const data = await adminRead("Historial");
  const all = (data?.rows ?? []).slice().reverse();
  const users = Array.from(new Set(all.map((r) => r.Usuario).filter(Boolean)));
  const sheets = Array.from(new Set(all.map((r) => r["Pestaña"]).filter(Boolean)));
  const rows = all.filter((r) => (!quien || r.Usuario === quien) && (!pestana || r["Pestaña"] === pestana)).slice(0, 200);
  const link = (q: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries({ quien, pestana, ...q }).filter(([, v]) => v) as [string, string][]);
    const s = p.toString();
    return s ? `/admin/historial?${s}` : "/admin/historial";
  };
  const chip = (active: boolean) => `shrink-0 h-9 px-3 inline-flex items-center rounded-full text-sm font-semibold border ${active ? "bg-[#F29A2E] border-[#F29A2E] text-[#071426]" : "border-white/15 text-[#C9D5E6] hover:border-white/40"}`;

  return (
    <>
      <PageHeader title="Historial" description="Cada cambio hecho desde el panel, con fecha y quién lo hizo. Útil para saber qué pasó y corregir errores." />
      {!data ? (
        <NotConnected />
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            <a href={link({ quien: undefined })} className={chip(!quien)}>Todas las personas</a>
            {users.map((u) => (
              <a key={u} href={link({ quien: u })} className={chip(quien === u)}>{u}</a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <a href={link({ pestana: undefined })} className={chip(!pestana)}>Todo</a>
            {sheets.map((s) => (
              <a key={s} href={link({ pestana: s })} className={chip(pestana === s)}>{s}</a>
            ))}
          </div>
          {rows.length === 0 ? (
            <Empty title="Sin cambios registrados">Cuando alguien edite algo desde el panel, aparecerá aquí.</Empty>
          ) : (
            <Card className="divide-y divide-white/10">
              {rows.map((r, i) => (
                <div key={r._row ?? i} className="p-4 grid sm:grid-cols-[150px_1fr] gap-1 sm:gap-4">
                  <p className="text-sm text-[#8FA3BF] tabular-nums">{r.Fecha}</p>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong>{r.Usuario}</strong>
                      <Badge tone={tone(r["Acción"] || "")}>{r["Acción"]}</Badge>
                      <span className="text-sm text-[#C9D5E6]">{r["Pestaña"]}</span>
                    </div>
                    <p className="text-sm text-[#B7C4D8] mt-1 break-words">{r.Detalle}</p>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </>
  );
}
