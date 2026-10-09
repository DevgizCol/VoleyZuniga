import clsx from "clsx";

// Piezas visuales del panel.

export const btn = {
  primary: "h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#F29A2E] hover:bg-[#FFB14A] disabled:opacity-60 text-[#071426] font-bold transition-colors",
  secondary: "h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 hover:border-white/50 hover:bg-white/5 disabled:opacity-60 font-semibold transition-colors",
  ghost: "h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg text-[#C9D5E6] hover:bg-white/10 hover:text-white disabled:opacity-60 text-sm font-semibold transition-colors",
  danger: "h-11 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#E5484D] hover:bg-[#F2555A] disabled:opacity-60 text-white font-bold transition-colors",
  whatsapp: "h-10 px-3 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-[#071426] font-bold hover:brightness-110",
};

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">{title}</h1>
        {description ? <p className="mt-2 text-[#B7C4D8] max-w-2xl">{description}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("rounded-2xl border border-white/10 bg-[#0B1E38]", className)}>{children}</div>;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "accent" | "success" | "info" | "danger" | "muted"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-white/10 text-[#E6EDF7]",
    accent: "bg-[#F29A2E] text-[#071426]",
    success: "bg-[#25D366]/20 text-[#7AF0A8]",
    info: "bg-[#3B82F6]/20 text-[#A9C8FF]",
    danger: "bg-[#E5484D]/20 text-[#FFA7AA]",
    muted: "bg-white/5 text-[#8FA3BF]",
  };
  return <span className={clsx("h-6 px-2.5 inline-flex items-center rounded-full text-xs font-bold whitespace-nowrap", tones[tone])}>{children}</span>;
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
      <p className="font-heading font-black uppercase text-2xl">{title}</p>
      {children ? <div className="mt-2 text-[#B7C4D8]">{children}</div> : null}
    </div>
  );
}

export function NotConnected() {
  return (
    <Empty title="Sin conexión con la hoja">
      Publica la versión nueva del Apps Script (Implementar → Administrar implementaciones → lápiz → Nueva versión) y revisa que
      SHEETS_WEBAPP_URL y SHEETS_SECRET estén en Vercel.
    </Empty>
  );
}

export const statusTone = (estado: string): "accent" | "info" | "success" | "muted" | "neutral" | "danger" => {
  const e = (estado || "").toLowerCase();
  if (e === "nuevo") return "accent";
  if (e.startsWith("contact") || e.startsWith("respond")) return "info";
  if (e.startsWith("matric")) return "success";
  if (e.startsWith("descart") || e.startsWith("archiv")) return "muted";
  return "neutral";
};
