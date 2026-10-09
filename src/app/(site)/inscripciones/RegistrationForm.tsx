"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, MessageCircle, Loader2, Clock, MapPin, Download, Share2 } from "lucide-react";
import { downloadPass, makeCode, passQrText, qrMatrix, sharePass, type PassData } from "@/lib/pass";
import { CATEGORIES, NIVELES, SEDES, categoryForAge } from "@/data/registration";
import { useContact } from "@/components/ContactProvider";
import { ChoiceCard, Field, Honeypot, inputCls } from "@/components/forms/fields";

const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/;
const STEPS = ["Deportista", "Categoría", "Contacto"] as const;
const LEVEL_HELP: Record<string, string> = {
  "Iniciación Formativa": "Nunca ha entrenado o está empezando",
  "Intermedio en Desarrollo": "Ya juega y quiere mejorar técnica",
  "Alta Competencia": "Compite o quiere competir en liga",
};

type Status = "idle" | "sending" | "saved" | "offline";

type Props = {
  horarios: { value: string; label: string }[];
  perCategory: Record<string, { horario: string; sede: string }>;
};

export default function RegistrationForm({ horarios, perCategory }: Props) {
  const { contact, wa } = useContact();
  // Horario y sede sugeridos para una categoría (vienen de la pestaña Horarios de la hoja).
  const sched = (categoryValue: string) => {
    const c = CATEGORIES.find((x) => x.value === categoryValue) ?? CATEGORIES[0];
    return perCategory[c.value] ?? { horario: c.horario as string, sede: c.sede as string };
  };
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(12);
  const [category, setCategory] = useState(categoryForAge(12).value);
  const [level, setLevel] = useState<string>(NIVELES[0]);
  const [sede, setSede] = useState<string>(() => sched(categoryForAge(12).value).sede);
  const [horario, setHorario] = useState<string>(() => sched(categoryForAge(12).value).horario);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [passBusy, setPassBusy] = useState<"download" | "share" | null>(null);
  const [canShare, setCanShare] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const goTo = (n: number) => {
    setStep(n);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Lleva la vista al resultado (la pantalla de confirmación reemplaza al formulario).
  const showResult = () =>
    requestAnimationFrame(() => document.getElementById("inscripcion")?.scrollIntoView({ behavior: "smooth", block: "start" }));

  const cat = useMemo(() => CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0], [category]);

  // Al cambiar la edad se sugiere la categoría, la sede y el horario que le corresponden.
  const changeAge = (next: number) => {
    const a = Math.max(5, Math.min(60, Math.round(next) || 5));
    setAge(a);
    const c = categoryForAge(a);
    setCategory(c.value);
    setSede(sched(c.value).sede);
    setHorario(sched(c.value).horario);
  };
  const changeCategory = (value: string) => {
    const c = CATEGORIES.find((x) => x.value === value);
    setCategory(value);
    if (c) {
      setSede(sched(c.value).sede);
      setHorario(sched(c.value).horario);
    }
  };

  const errors = {
    name: name.trim().length < 2 ? "Escribe el nombre del deportista." : null,
    phone: !PHONE_RE.test(phone.trim()) ? "Escribe un número de WhatsApp válido, por ejemplo 312 845 9210." : null,
    consent: !consent ? "Necesitamos tu autorización para guardar estos datos." : null,
  };
  const stepValid = [!errors.name, true, !errors.phone && !errors.consent][step];

  const next = () => {
    setTouched(true);
    if (!stepValid) return;
    setTouched(false);
    goTo(Math.min(step + 1, STEPS.length - 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    setTouched(true);
    if (!stepValid) return;
    setServerError(null);
    setStatus("sending");
    const passCode = code || makeCode(category);
    setCode(passCode);
    // Solo los celulares que pueden compartir imágenes muestran el botón de compartir.
    try {
      setCanShare(Boolean(navigator.canShare?.({ files: [new File([""], "x.png", { type: "image/png" })] })));
    } catch {
      setCanShare(false);
    }
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, category, level, sede, horario, phone, consent, code: passCode, website: honeypot }),
      });
      if (res.ok) {
        setStatus("saved");
        return showResult();
      }
      if (res.status === 400 || res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setServerError(data.error || "Revisa los datos del formulario.");
        return setStatus("idle");
      }
      setStatus("offline");
      showResult();
    } catch {
      setStatus("offline");
      showResult();
    }
  };

  const waMessage =
    `Hola, acabo de inscribir a ${name.trim()} en la web del Club Voley Zúñiga (código ${code}).\n` +
    `Edad: ${age} años · ${category} · ${level}\n` +
    `Sede: ${sede}\nHorario: ${horario}\n` +
    `¿Cuándo puede asistir a la clase de prueba?`;

  const passData: PassData = { name, age, category, level, sede, horario, code, contact };

  if (status === "saved" || status === "offline") {
    return (
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426] p-8 sm:p-10" role="status">
          <span className="w-14 h-14 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
            <Check size={28} />
          </span>
          <h2 className="mt-6 font-heading font-black uppercase text-5xl leading-none">
            {status === "saved" ? "¡Inscripción recibida!" : "Falta un paso"}
          </h2>
          <p className="mt-4 text-lg text-[#C9D5E6] max-w-xl">
            {status === "saved"
              ? `Ya tenemos los datos de ${name.trim()}. Escríbenos por WhatsApp para agendar la clase de prueba; respondemos en horario de oficina.`
              : "No pudimos guardar la solicitud en línea. Envíala por WhatsApp y la registramos nosotros."}
          </p>
          <a
            href={wa(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 h-14 px-7 inline-flex items-center gap-2 rounded-md bg-[#25D366] text-[#071426] font-bold text-lg hover:brightness-110"
          >
            <MessageCircle size={20} /> Agendar por WhatsApp
          </a>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="font-heading font-extrabold text-2xl">Tu pase de clase de prueba</p>
            <p className="text-[#B7C4D8] mt-1">Descárgalo o compártelo en tus historias. En la cancha, el QR abre el chat del club con tus datos.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={async () => {
                  setPassBusy("download");
                  try { await downloadPass(passData); } finally { setPassBusy(null); }
                }}
                disabled={passBusy !== null}
                className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] disabled:opacity-60 text-[#071426] font-bold"
              >
                {passBusy === "download" ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} Descargar pase
              </button>
              {canShare && (
                <button
                  type="button"
                  onClick={async () => {
                    setPassBusy("share");
                    try {
                      if (!(await sharePass(passData))) await downloadPass(passData);
                    } catch {
                      /* el usuario canceló el menú de compartir */
                    } finally {
                      setPassBusy(null);
                    }
                  }}
                  disabled={passBusy !== null}
                  className="h-12 px-5 inline-flex items-center gap-2 rounded-md border border-white/25 hover:border-white disabled:opacity-60 font-semibold"
                >
                  {passBusy === "share" ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />} Compartir
                </button>
              )}
            </div>
          </div>
          <p className="mt-6 text-sm text-[#8FA3BF]">
            ¿Te equivocaste en algo?{" "}
            <button type="button" onClick={() => { setStatus("idle"); setStep(0); }} className="underline underline-offset-2 hover:text-white">
              Corregir datos
            </button>
          </p>
        </div>
        <div className="lg:col-span-5">
          <Pass name={name} age={age} category={category} level={level} sede={sede} horario={horario} confirmed code={code} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      <form ref={formRef} onSubmit={submit} noValidate className="scroll-mt-32 lg:col-span-7 relative rounded-2xl border border-white/10 bg-[#0B1E38]/70 p-6 sm:p-10">
        <Honeypot value={honeypot} onChange={setHoneypot} />

        {/* Progreso: tres zonas, como la cancha dividida por las líneas de ataque */}
        <ol className="grid grid-cols-3 gap-2 mb-10" aria-label="Pasos">
          {STEPS.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined}>
              <div className={clsx("h-1.5 rounded-full transition-colors", i <= step ? "bg-[#F29A2E]" : "bg-white/15")} />
              <p className={clsx("mt-2 text-sm font-semibold", i === step ? "text-white" : "text-[#8FA3BF]")}>
                {i + 1}. {s}
              </p>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <fieldset className="space-y-7">
            <legend className="font-heading font-black uppercase text-4xl leading-none mb-2">¿Quién va a entrenar?</legend>
            <Field label="Nombre completo del deportista" htmlFor="name" error={touched ? errors.name : null}>
              <input
                id="name"
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={100}
                placeholder="Ej. Sara Gómez"
                aria-invalid={touched && Boolean(errors.name)}
                aria-describedby={touched && errors.name ? "name-error" : undefined}
              />
            </Field>
            <Field label="Edad" htmlFor="age" hint="Con la edad te sugerimos la categoría y el horario.">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => changeAge(age - 1)} aria-label="Restar un año" className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-lg border border-white/15 hover:border-[#F29A2E] flex items-center justify-center">
                  <Minus size={20} />
                </button>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={5}
                  max={60}
                  value={age}
                  onChange={(e) => changeAge(Number(e.target.value))}
                  className={clsx(inputCls, "w-28 text-center font-heading font-black text-3xl")}
                />
                <button type="button" onClick={() => changeAge(age + 1)} aria-label="Sumar un año" className="w-13 h-13 min-w-[52px] min-h-[52px] rounded-lg border border-white/15 hover:border-[#F29A2E] flex items-center justify-center">
                  <Plus size={20} />
                </button>
                <span className="text-[#B7C4D8]">años</span>
              </div>
            </Field>
            <div className="rounded-lg border border-[#F29A2E]/30 bg-[#F29A2E]/[0.07] p-4 flex gap-3 items-start">
              <Check size={20} className="text-[#F29A2E] shrink-0 mt-0.5" />
              <p className="text-[#C9D5E6]">
                Le corresponde <strong className="text-white">{categoryForAge(age).value}</strong>: {sched(categoryForAge(age).value).horario}, en {sched(categoryForAge(age).value).sede}.
              </p>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-8">
            <legend className="font-heading font-black uppercase text-4xl leading-none mb-2">Categoría y horario</legend>
            <div role="radiogroup" aria-label="Categoría" className="grid sm:grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <ChoiceCard key={c.value} name="category" value={c.value} checked={category === c.value} onChange={changeCategory} title={c.value} detail={c.label.replace(c.value, "").replace(/[()]/g, "").trim()} />
              ))}
            </div>
            <div>
              <p className="font-semibold mb-3">Nivel actual</p>
              <div role="radiogroup" aria-label="Nivel" className="grid gap-3">
                {NIVELES.map((n) => (
                  <ChoiceCard key={n} name="level" value={n} checked={level === n} onChange={setLevel} title={n} detail={LEVEL_HELP[n]} />
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Sede" htmlFor="sede">
                <select id="sede" value={sede} onChange={(e) => setSede(e.target.value)} className={clsx(inputCls, "appearance-none bg-[#0B1E38]")}>
                  {(SEDES.some((x) => x.value === sede) ? [...SEDES] : [{ value: sede, label: sede }, ...SEDES]).map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Horario" htmlFor="horario" hint={horario === sched(cat.value).horario ? "Es el horario de su categoría." : "Distinto al de su categoría: lo confirmamos contigo."}>
                <select id="horario" value={horario} onChange={(e) => setHorario(e.target.value)} className={clsx(inputCls, "appearance-none bg-[#0B1E38]")}>
                  {(horarios.some((h) => h.value === horario) ? horarios : [{ value: horario, label: horario }, ...horarios]).map((h) => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-7">
            <legend className="font-heading font-black uppercase text-4xl leading-none mb-2">¿Cómo te contactamos?</legend>
            <Field label="WhatsApp del deportista o acudiente" htmlFor="phone" error={touched ? errors.phone : null} hint="Solo lo usamos para coordinar la clase de prueba.">
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="312 845 9210"
                maxLength={20}
                aria-invalid={touched && Boolean(errors.phone)}
                aria-describedby={touched && errors.phone ? "phone-error" : "phone-hint"}
              />
            </Field>
            <div>
              <label className="flex gap-3 items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#F29A2E] shrink-0"
                  aria-invalid={touched && Boolean(errors.consent)}
                />
                <span className="text-[#C9D5E6]">
                  Autorizo al Club Voley Zúñiga a tratar estos datos para gestionar la inscripción, según la{" "}
                  <Link href="/privacidad" target="_blank" className="text-[#F29A2E] underline underline-offset-2">
                    política de datos
                  </Link>{" "}
                  (Ley 1581 de 2012). Si el deportista es menor de edad, la autorización la da su acudiente.
                </span>
              </label>
              {touched && errors.consent ? <p className="mt-2 text-sm text-[#FF9C90]">{errors.consent}</p> : null}
            </div>
            {serverError ? (
              <p role="alert" className="rounded-lg border border-[#FF7A6B]/40 bg-[#FF7A6B]/10 p-4 text-[#FFC2BA]">
                {serverError}
              </p>
            ) : null}
          </fieldset>
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="h-13 min-h-[52px] px-5 inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-white font-semibold">
              <ArrowLeft size={18} /> Atrás
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="h-14 px-7 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] disabled:opacity-60 text-[#071426] font-bold text-lg transition-colors"
          >
            {status === "sending" ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Enviando…
              </>
            ) : step < STEPS.length - 1 ? (
              <>
                Continuar <ArrowRight size={20} />
              </>
            ) : (
              <>
                Enviar inscripción <Check size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      <aside className="lg:col-span-5 lg:sticky lg:top-32" aria-label="Resumen de la inscripción">
        <Pass name={name} age={age} category={category} level={level} sede={sede} horario={horario} />
      </aside>
    </div>
  );
}

// Resumen en vivo con forma de pase deportivo.
function Pass({
  name,
  age,
  category,
  level,
  sede,
  horario,
  confirmed = false,
  code = "",
}: {
  name: string;
  age: number;
  category: string;
  level: string;
  sede: string;
  horario: string;
  confirmed?: boolean;
  code?: string;
}) {
  const { contact } = useContact();
  const matrix = confirmed && code ? qrMatrix(passQrText({ name, age, category, level, sede, horario, code, contact })) : null;
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#F3F6FB] text-[#0F2347] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
      <div className="relative bg-[#0F2347] text-white px-6 py-5 overflow-hidden">
        <svg viewBox="0 0 360 200" className="absolute -right-10 -top-6 w-64 text-[#F29A2E]/30" aria-hidden="true">
          <rect x="10" y="10" width="340" height="180" fill="none" stroke="currentColor" strokeWidth="3" />
          <line x1="180" y1="10" x2="180" y2="190" stroke="currentColor" strokeWidth="4" />
          <line x1="120" y1="10" x2="120" y2="190" stroke="currentColor" strokeWidth="2" />
          <line x1="240" y1="10" x2="240" y2="190" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p className="relative text-sm text-[#F29A2E] font-semibold">{confirmed ? "Inscripción enviada" : "Tu inscripción"}</p>
        <p className="relative font-heading font-black uppercase text-3xl leading-tight mt-1 break-words min-h-[2.5rem]">
          {name.trim() || <span className="text-white/30">Nombre del deportista</span>}
        </p>
      </div>
      <div className="px-6 py-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <p className="text-xs text-[#5B6B85]">Edad</p>
          <p className="font-heading font-black text-3xl leading-none">{age}</p>
        </div>
        <div>
          <p className="text-xs text-[#5B6B85]">Categoría</p>
          <p className="font-heading font-extrabold text-2xl leading-none">{category}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-[#5B6B85]">Nivel</p>
          <p className="font-semibold">{level}</p>
        </div>
      </div>
      {/* Perforación del pase */}
      <div className="relative h-6" aria-hidden="true">
        <div className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-[#0F2347]/20" />
        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#071426]" />
        <div className="absolute -right-3 top-0 w-6 h-6 rounded-full bg-[#071426]" />
      </div>
      <div className="px-6 pt-3 pb-6 space-y-2 text-sm">
        <p className="flex gap-2"><Clock size={16} className="text-[#C46F0A] shrink-0 mt-0.5" /> {horario}</p>
        <p className="flex gap-2"><MapPin size={16} className="text-[#C46F0A] shrink-0 mt-0.5" /> {sede}</p>
        {matrix ? (
          <div className="pt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-[#5B6B85]">Código</p>
              <p className="font-heading font-black text-3xl tracking-wide">{code}</p>
            </div>
            <svg viewBox={`0 0 ${matrix.length + 2} ${matrix.length + 2}`} className="w-28 h-28 bg-white rounded-md shrink-0" role="img" aria-label="Código QR para escribir al club por WhatsApp" shapeRendering="crispEdges">
              {matrix.flatMap((row, y) => row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x + 1} y={y + 1} width="1" height="1" fill="#0F2347" /> : null)))}
            </svg>
          </div>
        ) : null}
      </div>
      <div className="bg-[#F29A2E] text-[#071426] text-center py-3 font-heading font-black uppercase text-xl">Clase de prueba sin costo</div>
    </div>
  );
}
