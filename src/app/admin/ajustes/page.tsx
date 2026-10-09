import type { Metadata } from "next";
import { adminRead } from "@/lib/sheets";
import { getAdmin } from "@/lib/auth";
import { SETTING_RULES } from "@/lib/admin/schemas";
import { PageHeader, NotConnected, Card } from "../_components/ui";
import SettingField from "./SettingField";

export const metadata: Metadata = { title: "Ajustes" };
export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  const [data, user] = await Promise.all([adminRead("Ajustes"), getAdmin()]);
  const byKey = new Map((data?.rows ?? []).map((r) => [(r.Clave || "").trim().toLowerCase(), r]));

  return (
    <>
      <PageHeader title="Ajustes" description="Datos de contacto y opciones generales de la web. Cada cambio se guarda por separado y se ve al instante." />
      {!data ? (
        <NotConnected />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {Object.entries(SETTING_RULES).map(([key, rule]) => {
            const r = byKey.get(key);
            const values = r ? Object.fromEntries(Object.entries(r).filter(([k]) => k !== "_row")) : undefined;
            return (
              <SettingField
                key={key}
                settingKey={key}
                label={rule.label}
                help={rule.help}
                type={rule.type}
                value={r?.Valor ?? (key === "inscripciones_abiertas" ? "SI" : "")}
                row={r ? { _row: r._row, values: values! } : undefined}
              />
            );
          })}
        </div>
      )}

      <Card className="p-6 mt-8">
        <h2 className="font-heading font-black uppercase text-2xl">Usuarios del panel</h2>
        <p className="mt-2 text-[#C9D5E6]">
          Entraste como <strong className="text-white">{user?.name}</strong>. Cada persona puede tener su propia contraseña, y el Historial registra quién
          hizo cada cambio.
        </p>
        <ol className="mt-4 space-y-2 text-[#B7C4D8] list-decimal pl-5">
          <li>En Vercel abre el proyecto → Settings → Environment Variables.</li>
          <li>
            Crea o edita <code className="text-[#FFD9A8]">ADMIN_USERS</code> con el formato <code className="text-[#FFD9A8]">Nombre:contraseña</code>, separados por punto y
            coma. Ejemplo: <code className="text-[#FFD9A8]">Profe Carlos:una-clave-larga; Equipo técnico:otra-clave-larga</code>
          </li>
          <li>Guarda y pulsa Redeploy. Para quitarle el acceso a alguien, borra su parte y vuelve a desplegar: su sesión se cierra sola.</li>
        </ol>
        <p className="mt-3 text-sm text-[#8FA3BF]">Las contraseñas deben tener al menos 8 caracteres. ADMIN_PASSWORD sigue funcionando como usuario “Administrador”.</p>
      </Card>
    </>
  );
}
