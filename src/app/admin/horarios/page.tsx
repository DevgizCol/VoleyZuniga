import type { Metadata } from "next";
import { adminRead } from "@/lib/sheets";
import { PageHeader, NotConnected, Card, Empty, Badge } from "../_components/ui";
import EditorButton from "../_components/EditorButton";
import { DeleteButton } from "../_components/RowActions";
import { SCHEDULE_FIELDS } from "../_components/fields";
import { hhmm } from "../_components/format";
import { formatTime } from "@/data/schedule";

export const metadata: Metadata = { title: "Horarios" };
export const dynamic = "force-dynamic";

const ORDER = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const t = (v: string) => (hhmm(v) ? formatTime(hhmm(v)) : v || "—");

export default async function SchedulesAdmin() {
  const data = await adminRead("Horarios");
  const rows = (data?.rows ?? []).slice().sort((a, b) => ORDER.indexOf(a["Día"]) - ORDER.indexOf(b["Día"]) || hhmm(a.Inicio).localeCompare(hhmm(b.Inicio)));
  const days = ORDER.filter((d) => rows.some((r) => r["Día"] === d));

  return (
    <>
      <PageHeader title="Horarios" description="Los entrenamientos de la semana. Cambian la portada, Sedes y contacto, el formulario de inscripción y el aviso de “próximo entrenamiento”.">
        <EditorButton sheet="Horarios" fields={SCHEDULE_FIELDS} title="Nuevo horario" mode="create" label="Nuevo horario" defaults={{ Día: "Martes", Sede: "Polideportivo 3 Canchas" }} />
      </PageHeader>
      {!data ? (
        <NotConnected />
      ) : rows.length === 0 ? (
        <Empty title="Sin horarios">Mientras no haya filas, la web muestra los horarios de respaldo. Crea el primero.</Empty>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {days.map((day) => (
            <Card key={day} className="overflow-hidden">
              <div className="px-5 py-3 bg-[#0F2347] border-b border-white/10 flex items-baseline justify-between">
                <h2 className="font-heading font-black uppercase text-2xl">{day}</h2>
                <span className="text-xs text-[#8FA3BF]">{rows.filter((r) => r["Día"] === day).length} sesiones</span>
              </div>
              <ul className="divide-y divide-white/10">
                {rows
                  .filter((r) => r["Día"] === day)
                  .map((r) => {
                    const hidden = (r.Activo || "").toUpperCase() === "NO";
                    return (
                      <li key={r._row} className={`p-4 ${hidden ? "opacity-60" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-heading font-extrabold text-xl leading-none tabular-nums">
                              {t(r.Inicio)} <span className="text-[#8FA3BF] text-base">– {t(r.Fin)}</span>
                            </p>
                            <p className="font-semibold mt-1">{r.Grupo}</p>
                            <p className="text-sm text-[#8FA3BF]">{r.Sede}</p>
                          </div>
                          {hidden ? <Badge tone="muted">Oculto</Badge> : null}
                        </div>
                        <div className="mt-2 -ml-2 flex flex-wrap gap-1">
                          <EditorButton sheet="Horarios" fields={SCHEDULE_FIELDS} title="Editar horario" mode="edit" row={r} />
                          <EditorButton sheet="Horarios" fields={SCHEDULE_FIELDS} title="Duplicar horario" mode="duplicate" row={r} />
                          <DeleteButton sheet="Horarios" row={r} label={`${r["Día"]} ${t(r.Inicio)} · ${r.Grupo}`} compact />
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
