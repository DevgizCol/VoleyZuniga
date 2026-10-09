"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setPassword("");
        router.refresh();
        return;
      }
      setError(data.error || "Contraseña incorrecta.");
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden floodlights grain text-white min-h-[100svh] flex items-center pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-md">
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[#0B1E38]/80 backdrop-blur p-8">
          <span className="w-12 h-12 rounded-xl bg-[#F29A2E]/15 border border-[#F29A2E]/30 flex items-center justify-center text-[#F29A2E]">
            <Lock size={22} />
          </span>
          <h1 className="mt-5 font-heading font-black uppercase text-4xl leading-none">Panel del club</h1>
          <p className="mt-2 text-[#B7C4D8]">Solo para el cuerpo técnico y la secretaría.</p>
          <label htmlFor="pw" className="block font-semibold mt-6 mb-2">Contraseña</label>
          <input
            id="pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-lg bg-white/[0.05] border border-white/15 px-4 focus:outline-none focus:border-[#F29A2E]"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "pw-error" : undefined}
          />
          {error ? <p id="pw-error" role="alert" className="mt-2 text-sm text-[#FF9C90]">{error}</p> : null}
          <button type="submit" disabled={busy || !password} className="mt-6 w-full h-12 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] disabled:opacity-60 text-[#071426] font-bold inline-flex items-center justify-center gap-2">
            {busy ? <Loader2 size={18} className="animate-spin" /> : null} Entrar
          </button>
        </form>
      </div>
    </section>
  );
}
