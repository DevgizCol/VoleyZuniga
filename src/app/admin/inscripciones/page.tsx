import type { Metadata } from "next";
import { Download } from "lucide-react";
import { adminRead } from "@/lib/sheets";
import { PageHeader, NotConnected, btn } from "../_components/ui";
import RegistrationsTable from "./RegistrationsTable";

export const metadata: Metadata = { title: "Inscripciones" };
export const dynamic = "force-dynamic";

export default async function RegistrationsAdmin() {
  const data = await adminRead("Inscripciones");
  return (
    <>
      <PageHeader title="Inscripciones" description="Escríbele a cada familia y actualiza el estado: Nuevo → Contactado → Matriculado.">
        <a href="/admin/inscripciones/export" className={btn.secondary}>
          <Download size={16} /> Exportar a Excel
        </a>
      </PageHeader>
      {data ? <RegistrationsTable rows={data.rows.slice().reverse()} /> : <NotConnected />}
    </>
  );
}
