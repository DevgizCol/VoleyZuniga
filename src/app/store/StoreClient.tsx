"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Check, Plus, ShoppingCart, MessageCircle, RotateCcw } from "lucide-react";
import { useCart } from "@/context/CartContext";
import JerseyArt from "@/components/store/JerseyArt";
import { PRODUCTS, SIZES, cop, type Product } from "@/data/products";
import { whatsappUrl } from "@/config/site";

export default function StoreClient() {
  const { addToCart, setIsCartOpen } = useCart();
  const [variant, setVariant] = useState<"home" | "libero">("home");
  const [side, setSide] = useState<"back" | "front">("back");
  const [size, setSize] = useState<string>("M");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("10");
  const [added, setAdded] = useState<string | null>(null);

  const jersey = PRODUCTS.find((p) => p.customizable === variant)!;
  const cleanName = name.trim().toUpperCase();

  const flash = (id: string) => {
    setAdded(id);
    setTimeout(() => setAdded((a) => (a === id ? null : a)), 1800);
  };

  const addJersey = () => {
    const id = `${jersey.id}-${size}-${number}-${cleanName.replace(/\s+/g, "_") || "SIN_NOMBRE"}`;
    addToCart({
      id,
      name: `${jersey.name} · Talla ${size} · #${number || "10"}${cleanName ? ` ${cleanName}` : ""}`,
      price: jersey.price,
      image: jersey.image,
      quantity: 1,
    });
    flash("jersey");
  };

  const addProduct = (p: Product) => {
    if (p.customizable) {
      setVariant(p.customizable);
      document.getElementById("personalizar")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
    flash(p.id);
  };

  const directMessage =
    `Hola, quiero pedir la ${jersey.name.toLowerCase()}: talla ${size}, número ${number || "10"}` +
    `${cleanName ? `, nombre ${cleanName}` : ", sin nombre"}. Precio ${cop(jersey.price)}. ¿Cómo hago el pago?`;

  return (
    <>
      {/* Personalizador */}
      <section id="personalizar" className="scroll-mt-28 bg-[#071426] text-white pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#0F2347] via-[#0B1E38] to-[#071426] p-6 sm:p-10 lg:p-14 overflow-hidden relative">
            <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-[#F29A2E]/10 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <div className="relative aspect-square max-w-[460px] mx-auto">
                <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(242,154,46,0.22),transparent_65%)]" aria-hidden="true" />
                <JerseyArt key={`${variant}-${side}`} name={cleanName} number={number} variant={variant} side={side} className="relative w-full h-auto animate-fade-in" />
              </div>
              <div className="mt-2 flex justify-center gap-2">
                <button type="button" onClick={() => setSide((s) => (s === "back" ? "front" : "back"))} className="h-10 px-4 inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white text-sm font-semibold">
                  <RotateCcw size={16} /> Ver {side === "back" ? "frente" : "espalda"}
                </button>
              </div>
            </div>

            <div className="relative">
              <p className="text-[#F29A2E] font-semibold">Personalízala</p>
              <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-[0.9] mt-2">Tu nombre en la espalda</h2>
              <p className="mt-4 text-[#C9D5E6] text-lg">{jersey.description}</p>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="font-semibold mb-2">Modelo</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["home", "libero"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVariant(v)}
                        aria-pressed={variant === v}
                        className={clsx("h-12 rounded-lg border font-semibold flex items-center justify-center gap-2", variant === v ? "border-[#F29A2E] bg-[#F29A2E]/10" : "border-white/15 hover:border-white/35")}
                      >
                        <span className={clsx("w-4 h-4 rounded-full border border-white/40", v === "home" ? "bg-[#0F2347]" : "bg-[#F29A2E]")} />
                        {v === "home" ? "Titular" : "Líbero"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_7rem] gap-3">
                  <label className="block">
                    <span className="block font-semibold mb-2">Nombre</span>
                    <input value={name} onChange={(e) => setName(e.target.value.slice(0, 12))} placeholder="Opcional" maxLength={12} className="w-full h-12 rounded-lg bg-white/[0.05] border border-white/15 px-4 uppercase placeholder:normal-case placeholder:text-[#8FA3BF] focus:outline-none focus:border-[#F29A2E]" />
                  </label>
                  <label className="block">
                    <span className="block font-semibold mb-2">Número</span>
                    <input value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))} inputMode="numeric" className="w-full h-12 rounded-lg bg-white/[0.05] border border-white/15 px-4 text-center font-heading font-black text-2xl focus:outline-none focus:border-[#F29A2E]" />
                  </label>
                </div>

                <div>
                  <p className="font-semibold mb-2">Talla</p>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Talla">
                    {SIZES.map((s) => (
                      <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={clsx("h-11 min-w-12 px-3 rounded-lg border font-semibold", size === s ? "bg-white text-[#071426] border-white" : "border-white/15 hover:border-white/40")}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="font-heading font-black text-4xl tabular-nums">{cop(jersey.price)}</p>
                <div className="flex flex-1 flex-wrap gap-3 sm:justify-end">
                  <button type="button" onClick={addJersey} className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
                    {added === "jersey" ? <><Check size={18} /> Agregada</> : <><ShoppingCart size={18} /> Agregar al carrito</>}
                  </button>
                  <a href={whatsappUrl(directMessage)} target="_blank" rel="noopener noreferrer" className="h-12 px-5 inline-flex items-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold">
                    <MessageCircle size={18} className="text-[#25D366]" /> Pedir ya
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="bg-[#EEF2F7] text-[#0F2347] py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none">Catálogo</h2>
            <button type="button" onClick={() => setIsCartOpen(true)} className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#0F2347] text-white font-semibold w-fit">
              <ShoppingCart size={18} /> Ver carrito
            </button>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <li key={p.id} className="group rounded-2xl bg-white overflow-hidden shadow-[0_1px_0_rgba(15,35,71,0.06),0_24px_48px_-28px_rgba(15,35,71,0.45)] flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0B1E38]">
                  <Image src={p.image} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" unoptimized className="object-contain transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 h-7 px-3 inline-flex items-center rounded-full bg-white/90 text-xs font-semibold">{p.category}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-extrabold text-2xl leading-tight">{p.name}</h3>
                  <p className="text-[#44546F] mt-1.5 text-sm flex-1">{p.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="font-heading font-black text-3xl tabular-nums">{cop(p.price)}</p>
                    <button type="button" onClick={() => addProduct(p)} className="h-11 px-4 inline-flex items-center gap-1.5 rounded-md bg-[#0F2347] hover:bg-[#071426] text-white font-semibold">
                      {added === p.id ? <><Check size={18} /> Listo</> : p.customizable ? "Personalizar" : <><Plus size={18} /> Agregar</>}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
