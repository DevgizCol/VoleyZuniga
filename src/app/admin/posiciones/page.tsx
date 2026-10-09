import type { Metadata } from "next";
import { adminRead } from "@/lib/sheets";
import { CATEGORIES } from "@/data/registration";
import { PageHeader, NotConnected, Card, Empty, Badge } from "../_components/ui";
import EditorButton from "../_components/EditorButton";
import { DeleteButton } from "../_components/RowActions";
import { STANDING_FIELDS } from "../_components/fields";
import ApplyResult from "./ApplyResult";

export const metadata: Metadata = { title: "Posiciones" };
export const dynamic = "force-dynamic";

const CLUB = /z[uú][ñn]iga/i;

export default async function StandingsAdmin() {
  const data = await adminRead("Tabla");
  const rows = data?.rows ?? [];
  const known = CATEGORIES.map((c) => c.value);
  const categories = Array.from(new Set([...rows.map((r) => r["Categoría"]).filter(Boolean)])).sort(
    (a, b) => (known.indexOf(a) + 1 || 99) - (known.indexOf(b) + 1 || 99)
  );
  const teams = Array.from(new Set(rows.map((r) => r.Equipo).filter(Boolean)));
  const n = (v: string) => Number(v || 0) || 0;

  return (
    <>
      <PageHeader title="Posiciones" description="La tabla se ordena sola por puntos. Usa “Sumar un resultado” después de cada partido y no tendrás que hacer cuentas.">
        <ApplyResult categories={categories.length ? categories : known} teams={teams} />
        <EditorButton sheet="Tabla" fields={STANDING_FIELDS} title="Agregar equipo" mode="create" label="Agregar equipo" variant="secondary" defaults={{ PJ: "0", PG: "0", PP: "0", Puntos: "0" }} />
      </PageHeader>
      {!data ? (
        <NotConnected />
      ) : categories.length === 0 ? (
        <Empty title="La tabla está vacía">Agrega los equipos de cada categoría o suma el primer resultado.</Empty>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const list = rows
              .filter((r) => r["Categoría"] === cat)
              .sort((a, b) => n(b.Puntos) - n(a.Puntos) || n(b.PG) - n(a.PG) || n(a.PP) - n(b.PP));
            return (
              <Card key={cat} className="overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="font-heading font-black uppercase text-2xl">{cat}</h2>
                  <EditorButton sheet="Tabla" fields={STANDING_FIELDS} title={`Agregar equipo · ${cat}`} mode="create" label="Equipo" defaults={{ Categoría: cat, PJ: "0", PG: "0", PP: "0", Puntos: "0" }} variant="ghost" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead className="text-xs text-[#8FA3BF]">
                      <tr>
                        <th className="py-2.5 pl-5 w-10">#</th>
                        <th className="py-2.5">Equipo</th>
                        <th className="py-2.5 text-center w-12">PJ</th>
                        <th className="py-2.5 text-center w-12">PG</th>
                        <th className="py-2.5 text-center w-12">PP</th>
                        <th className="py-2.5 text-center w-14">Pts</th>
                        <th className="py-2.5 pr-3 w-32 text-right">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((r, i) => (
                        <tr key={r._row} className={`border-t border-white/10 ${CLUB.test(r.Equipo) ? "bg-[#F29A2E]/[0.08]" : ""}`}>
                          <td className="py-3 pl-5 font-heading font-black text-xl text-[#8FA3BF]">{i + 1}</td>
                          <td className="py-3 font-semibold">
                            {r.Equipo} {(r.Activo || "").toUpperCase() === "NO" ? <Badge tone="muted">Oculto</Badge> : null}
                          </td>
                          <td className="py-3 text-center tabular-nums">{r.PJ}</td>
                          <td className="py-3 text-center tabular-nums">{r.PG}</td>
                          <td className="py-3 text-center tabular-nums">{r.PP}</td>
                          <td className="py-3 text-center font-heading font-black text-2xl tabular-nums">{r.Puntos}</td>
                          <td className="py-3 pr-3">
                            <div className="flex justify-end">
                              <EditorButton sheet="Tabla" fields={STANDING_FIELDS} title={`Editar · ${r.Equipo}`} mode="edit" row={r} />
                              <DeleteButton sheet="Tabla" row={r} label={`${r.Equipo} (${cat})`} compact />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
