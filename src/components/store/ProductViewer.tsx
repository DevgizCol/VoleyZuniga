"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import clsx from "clsx";
import { Check, Pause, Play, RotateCcw, RotateCw, ShoppingCart, X, Move3d } from "lucide-react";
import { cop, type Product } from "@/data/products";
import { KIND_SIZES, colorwaysFor, sizeScale, type ProductKind } from "@/data/store3d";
import type { Stage } from "./three/stage";

const Product3D = dynamic(() => import("./three/Product3D"), { ssr: false });

export type ViewerSelection = { color: string; size: string };

// Probador 3D de un producto: girarlo, elegir color y talla, y agregarlo al carrito.
export default function ProductViewer({
  product,
  kind,
  onClose,
  onAdd,
}: {
  product: Product;
  kind: ProductKind;
  onClose: () => void;
  onAdd: (selection: ViewerSelection) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const colorways = colorwaysFor(product, kind);
  const sizes = KIND_SIZES[kind];
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState(sizes[Math.floor((sizes.length - 1) / 2)]);
  const [view, setView] = useState<"front" | "back">("front");
  const [spin, setSpin] = useState(true);
  const [unsupported, setUnsupported] = useState(false);
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);
  const colorway = colorways[Math.min(colorIndex, colorways.length - 1)];
  const hasBack = kind === "jersey" || kind === "hoodie";

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const add = () => {
    onAdd({ color: colorways.length > 1 ? colorway.name : "", size: sizes.length > 1 ? size : "" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") stageRef.current?.turn(-Math.PI / 6);
    else if (e.key === "ArrowRight") stageRef.current?.turn(Math.PI / 6);
    else return;
    e.preventDefault();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="viewer-title"
      className="m-auto w-full h-dvh max-h-dvh sm:h-auto sm:max-h-[92dvh] max-w-5xl sm:rounded-3xl bg-[#071426] text-white p-0 border border-white/10 backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-fade-in overflow-hidden"
    >
      <div className="grid lg:grid-cols-[1.25fr_1fr] h-full sm:max-h-[92dvh]">
        {/* Visor */}
        <div className="relative min-h-[46dvh] lg:min-h-[560px] bg-[radial-gradient(ellipse_at_50%_40%,#1B3765_0%,#0B1E38_55%,#071426_100%)]">
          {unsupported ? (
            <div className="absolute inset-0">
              <Image src={product.image} alt="" fill unoptimized className="object-contain p-10" />
            </div>
          ) : (
            <>
              {!ready ? <Image src={product.image} alt="" fill unoptimized className="object-contain p-16 opacity-25 blur-sm animate-pulse" aria-hidden="true" /> : null}
              <div className="absolute inset-0" tabIndex={0} onKeyDown={onKey} aria-label="Visor 3D: usa las flechas para girar">
                <Product3D
                  kind={kind}
                  colorway={colorway}
                  scale={sizeScale(kind, size)}
                  view={view}
                  autoRotate={spin}
                  stageRef={stageRef}
                  onUnsupported={() => setUnsupported(true)}
                  onReady={() => setReady(true)}
                  label={`${product.name} en 3D, color ${colorway.name}${sizes.length > 1 ? `, talla ${size}` : ""}`}
                  className="absolute inset-0"
                />
              </div>
              <p className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/35 backdrop-blur px-3 py-1.5 text-xs text-[#DCE4EF]">
                <Move3d size={14} className="text-[#F29A2E]" /> Arrastra para girar · pellizca para acercar
              </p>
              {sizes.length > 1 ? (
                <span className="pointer-events-none absolute top-4 right-4 h-8 px-3 inline-flex items-center rounded-full bg-[#F29A2E] text-[#071426] text-sm font-bold">Talla {size}</span>
              ) : null}
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4">
                <ViewerButton label="Girar a la izquierda" onClick={() => stageRef.current?.turn(-Math.PI / 4)}>
                  <RotateCcw size={18} />
                </ViewerButton>
                {hasBack ? (
                  <button
                    type="button"
                    onClick={() => setView((v) => (v === "front" ? "back" : "front"))}
                    className="h-11 px-4 rounded-full bg-black/40 backdrop-blur border border-white/15 hover:border-white/40 text-sm font-semibold"
                  >
                    Ver {view === "front" ? "espalda" : "frente"}
                  </button>
                ) : null}
                <ViewerButton label={spin ? "Pausar el giro" : "Girar solo"} onClick={() => setSpin((s) => !s)}>
                  {spin ? <Pause size={18} /> : <Play size={18} />}
                </ViewerButton>
                <ViewerButton label="Girar a la derecha" onClick={() => stageRef.current?.turn(Math.PI / 4)}>
                  <RotateCw size={18} />
                </ViewerButton>
              </div>
            </>
          )}
        </div>

        {/* Opciones */}
        <div className="flex flex-col overflow-y-auto">
          <header className="flex items-start justify-between gap-3 p-5 sm:p-7 pb-0">
            <div>
              <p className="text-[#F29A2E] font-semibold text-sm">{product.category} · Vista 3D</p>
              <h2 id="viewer-title" className="font-heading font-black uppercase text-3xl sm:text-4xl leading-[0.95] mt-1">{product.name}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Cerrar" className="shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F29A2E] hover:text-[#071426]">
              <X size={20} />
            </button>
          </header>
          <div className="p-5 sm:p-7 space-y-6 flex-1">
            {product.description ? <p className="text-[#C9D5E6]">{product.description}</p> : null}

            <fieldset>
              <legend className="font-semibold mb-2">
                Color: <span className="text-[#C9D5E6] font-normal">{colorway.name}</span>
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
                {colorways.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={i === colorIndex}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => setColorIndex(i)}
                    className={clsx("w-11 h-11 rounded-full border-2 p-1 transition-colors", i === colorIndex ? "border-[#F29A2E]" : "border-white/15 hover:border-white/40")}
                  >
                    <span className="block w-full h-full rounded-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${c.base} 0 60%, ${c.accent} 60% 100%)` }} />
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-semibold mb-2">Talla</legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Talla">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => setSize(s)}
                    className={clsx("h-11 min-w-12 px-3 rounded-lg border font-semibold", size === s ? "bg-white text-[#071426] border-white" : "border-white/15 hover:border-white/40")}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizes.length > 1 ? <p className="mt-2 text-sm text-[#8FA3BF]">El modelo cambia de tamaño con la talla. Si dudas, te ayudamos a elegirla por WhatsApp.</p> : null}
            </fieldset>
          </div>
          <footer className="p-5 sm:p-7 border-t border-white/10 flex items-center justify-between gap-4">
            <p className="font-heading font-black text-4xl tabular-nums">{cop(product.price)}</p>
            <button type="button" onClick={add} className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
              {added ? <><Check size={18} /> Agregado</> : <><ShoppingCart size={18} /> Agregar</>}
            </button>
          </footer>
        </div>
      </div>
    </dialog>
  );
}

function ViewerButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="w-11 h-11 rounded-full bg-black/40 backdrop-blur border border-white/15 hover:border-white/40 flex items-center justify-center">
      {children}
    </button>
  );
}
