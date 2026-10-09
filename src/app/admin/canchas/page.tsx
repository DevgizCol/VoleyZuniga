import type { Metadata } from "next";
import { adminRead } from "@/lib/sheets";
import { VENUES } from "@/data/venues";
import { PageHeader, NotConnected } from "../_components/ui";
import CourtControl from "./CourtControl";

export const metadata: Metadata = { title: "Canchas" };
export const dynamic = "force-dynamic";

export default async function CourtsAdmin() {
  const data = await adminRead("Cancha");
  const rows = data?.rows ?? [];
  const sedes = Array.from(new Set([...VENUES.map((v) => v.name), ...rows.map((r) => r.Sede).filter(Boolean)]));
  return (
    <>
      <PageHeader title="Estado de canchas" description="Si llueve o se cancela, publícalo aquí: aparece una franja naranja arriba de toda la web en segundos." />
      {!data ? (
        <NotConnected />
      ) : (
        <div className="space-y-4">
          {sedes.map((s) => (
            <CourtControl key={s} sede={s} row={rows.find((r) => r.Sede === s) ?? null} />
          ))}
        </div>
      )}
    </>
  );
}
