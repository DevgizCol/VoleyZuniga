"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  // Segundo paso (celular no reconocido): código enviado al correo del usuario.
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(sentTo ? "/api/admin/verify" : "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sentTo ? { code } : { password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.step === "code") {
        setPassword("");
        setSentTo(data.email);
        return;
      }
      if (res.ok && data.ok) {
        setPassword("");
        setCode("");
        router.refresh();
        return;
      }
      setError(data.error || (sentTo ? "Código incorrecto." : "Contraseña incorrecta."));
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
          {sentTo ? (
            <p className="mt-6 text-[#C9D5E6]">
              Primera vez en este celular: enviamos un código de 6 números a <strong className="text-white">{sentTo}</strong>. Vence en 10 minutos.
            </p>
          ) : null}
          <label htmlFor="pw" className="block font-semibold mt-6 mb-2">{sentTo ? "Código del correo" : "Contraseña"}</label>
          <input
            key={sentTo ? "code" : "pw"}
            id="pw"
            type={sentTo ? "text" : "password"}
            inputMode={sentTo ? "numeric" : undefined}
            autoComplete={sentTo ? "one-time-code" : "current-password"}
            maxLength={sentTo ? 6 : undefined}
            autoFocus={Boolean(sentTo)}
            value={sentTo ? code : password}
            onChange={(e) => (sentTo ? setCode(e.target.value.replace(/\D/g, "")) : setPassword(e.target.value))}
            className="w-full h-12 rounded-lg bg-white/[0.05] border border-[#6B7F9C] px-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F29A2E] focus:border-[#F29A2E]"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "pw-error" : undefined}
          />
          {error ? <p id="pw-error" role="alert" className="mt-2 text-sm text-[#FF9C90]">{error}</p> : null}
          <button type="submit" disabled={busy || (sentTo ? code.length !== 6 : !password)} className="mt-6 w-full h-12 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] disabled:opacity-60 text-[#071426] font-bold inline-flex items-center justify-center gap-2">
            {busy ? <Loader2 size={18} className="animate-spin" /> : null} {sentTo ? "Verificar" : "Entrar"}
          </button>
          {sentTo ? (
            <button type="button" onClick={() => { setSentTo(null); setCode(""); setError(null); }} className="mt-3 w-full h-12 rounded-md text-[#B7C4D8] hover:text-white underline underline-offset-2">
              No me llegó: volver a la contraseña
            </button>
          ) : null}
        </form>
        <Link href="/" className="mt-6 h-12 w-full inline-flex items-center justify-center gap-2 rounded-md border border-white/20 hover:border-white text-white font-semibold">
          <ArrowLeft size={18} /> Volver a la página principal
        </Link>
      </div>
    </section>
  );
}
