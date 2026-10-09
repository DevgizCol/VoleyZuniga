import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Home } from "lucide-react";
import { Toaster } from "sonner";
import { getAdmin } from "@/lib/auth";
import AdminLogin from "./AdminLogin";
import AdminNav from "./_components/AdminNav";
import { LogoutButton } from "./AdminTools";

export const metadata: Metadata = {
  title: { default: "Panel del club", template: "%s · Panel Voley Zúñiga" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#071426" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdmin();
  if (!user) return <AdminLogin />;

  const sheetUrl = process.env.SHEET_URL;
  return (
    <div className="min-h-dvh bg-[#071426] text-white lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:flex flex-col sticky top-0 h-dvh border-r border-white/10 bg-[#050E1C] p-4">
        <Link href="/admin" className="flex items-center gap-3 px-2 py-3 mb-4">
          <Image src="/logo-trim.png" alt="" width={800} height={473} priority className="h-9 w-auto" />
          <span className="font-heading font-black uppercase text-xl leading-none">Panel</span>
        </Link>
        <AdminNav variant="side" />
        <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
          <p className="px-2 text-sm text-[#8FA3BF]">
            Sesión de <strong className="text-white">{user.name}</strong>
          </p>
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 text-sm font-semibold hover:bg-white/5">
              <ExternalLink size={14} /> Ver web
            </Link>
            <LogoutButton compact />
          </div>
          {sheetUrl ? (
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="block px-2 text-xs text-[#8FA3BF] hover:text-white underline underline-offset-2">
              Abrir la hoja de Google
            </a>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-[#050E1C]/95 backdrop-blur border-b border-white/10" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="flex items-center justify-between gap-3 px-4 h-14">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/logo-trim.png" alt="" width={800} height={473} className="h-8 w-auto" />
              <span className="font-heading font-black uppercase text-lg">Panel</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8FA3BF] max-w-[90px] truncate">{user.name}</span>
              <Link href="/" aria-label="Ver la web" className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-white/15 hover:bg-white/5">
                <Home size={16} />
              </Link>
              <LogoutButton compact />
            </div>
          </div>
          <AdminNav variant="top" />
        </header>
        <main id="contenido" className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-6xl">
          {children}
        </main>
      </div>
      <Toaster theme="dark" position="top-center" richColors closeButton />
    </div>
  );
}
