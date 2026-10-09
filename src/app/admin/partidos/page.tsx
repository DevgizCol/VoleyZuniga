import type { Metadata } from "next";
import { adminRead } from "@/lib/sheets";
import { PageHeader, NotConnected } from "../_components/ui";
import EditorButton from "../_components/EditorButton";
import { FIXTURE_FIELDS } from "../_components/fields";
import MatchesBoard from "./MatchesBoard";

export const metadata: Metadata = { title: "Partidos" };
export const dynamic = "force-dynamic";

export default async function MatchesAdmin({ searchParams }: { searchParams: Promise<{ vista?: string }> }) {
  const { vista } = await searchParams;
  const data = await adminRead("Fixture");
  return (
    <>
      <PageHeader title="Partidos" description="Programa partidos, cambia fechas y carga resultados. Aparecen en la web, en el calendario de las familias y en Google.">
        <EditorButton sheet="Fixture" fields={FIXTURE_FIELDS} title="Nuevo partido" mode="create" label="Nuevo partido" defaults={{ Estado: "Programado", Local: "Club Voley Zúñiga" }} />
      </PageHeader>
      {data ? <MatchesBoard rows={data.rows} initialView={vista === "resultados" ? "pendientes" : "proximos"} /> : <NotConnected />}
    </>
  );
}
