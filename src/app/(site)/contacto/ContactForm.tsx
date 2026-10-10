"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Loader2, Send } from "lucide-react";
import { CONTACT_TOPICS } from "@/data/contact";
import { ChoiceCard, Field, Honeypot, inputCls } from "@/components/forms/fields";
import { storedOrigin } from "@/lib/origin";
import { track } from "@/lib/track";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: CONTACT_TOPICS[0].value as string, message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const errors = {
    name: form.name.trim().length < 2 ? "Escribe tu nombre." : null,
    email: !EMAIL_RE.test(form.email.trim()) ? "Revisa el correo, por ejemplo nombre@gmail.com." : null,
    phone: !PHONE_RE.test(form.phone.trim()) ? "Escribe un teléfono o WhatsApp válido." : null,
    message: form.message.trim().length < 5 ? "Cuéntanos en qué te ayudamos." : null,
  };
  const valid = Object.values(errors).every((e) => !e);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, origin: storedOrigin(), website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        track("mensaje_enviado", { motivo: form.topic });
        return setStatus("sent");
      }
      setServerError(data.error || "No pudimos enviar el mensaje. Escríbenos por WhatsApp.");
    } catch {
      setServerError("Sin conexión. Revisa tu internet o escríbenos por WhatsApp.");
    }
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-white/10 bg-[#0B1E38]/70 p-8 sm:p-10">
        <span className="w-14 h-14 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
          <Check size={28} />
        </span>
        <h3 className="mt-6 font-heading font-black uppercase text-4xl leading-none">Mensaje enviado</h3>
        <p className="mt-3 text-[#C9D5E6] text-lg">Gracias, {form.name.trim().split(" ")[0]}. Te respondemos al correo o al WhatsApp que nos dejaste.</p>
        <button type="button" onClick={() => { setForm((f) => ({ ...f, message: "" })); setTouched(false); setStatus("idle"); }} className="mt-6 underline underline-offset-2 text-[#B7C4D8] hover:text-white">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const err = (k: keyof typeof errors) => (touched ? errors[k] : null);

  return (
    <form onSubmit={submit} noValidate className="relative rounded-2xl border border-white/10 bg-[#0B1E38]/70 p-6 sm:p-10 space-y-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div role="radiogroup" aria-label="Motivo" className="grid sm:grid-cols-2 gap-3">
        {CONTACT_TOPICS.map((t) => (
          <ChoiceCard key={t.value} name="topic" value={t.value} checked={form.topic === t.value} onChange={(v) => setForm((f) => ({ ...f, topic: v }))} title={t.label} />
        ))}
      </div>
      <Field label="Nombre" htmlFor="c-name" error={err("name")}>
        <input id="c-name" className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" maxLength={100} aria-invalid={Boolean(err("name"))} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Correo" htmlFor="c-email" error={err("email")}>
          <input id="c-email" type="email" inputMode="email" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" maxLength={150} aria-invalid={Boolean(err("email"))} />
        </Field>
        <Field label="Teléfono o WhatsApp" htmlFor="c-phone" error={err("phone")}>
          <input id="c-phone" type="tel" inputMode="tel" className={inputCls} value={form.phone} onChange={set("phone")} autoComplete="tel" maxLength={20} aria-invalid={Boolean(err("phone"))} />
        </Field>
      </div>
      <Field label="Mensaje" htmlFor="c-message" error={err("message")}>
        <textarea id="c-message" rows={5} className={clsx(inputCls, "py-3 h-auto resize-y")} value={form.message} onChange={set("message")} maxLength={1500} aria-invalid={Boolean(err("message"))} />
      </Field>
      {serverError ? (
        <p role="alert" className="rounded-lg border border-[#FF7A6B]/40 bg-[#FF7A6B]/10 p-4 text-[#FFC2BA]">{serverError}</p>
      ) : null}
      <button type="submit" disabled={status === "sending"} className="h-14 px-7 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] disabled:opacity-60 text-[#071426] font-bold text-lg transition-colors">
        {status === "sending" ? <><Loader2 size={20} className="animate-spin" /> Enviando…</> : <><Send size={20} /> Enviar mensaje</>}
      </button>
    </form>
  );
}
