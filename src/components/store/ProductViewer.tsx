"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import JerseyArt from "@/components/store/JerseyArt";
import type { JerseySide, JerseyVariant } from "@/data/store3d";

// Visor de la camiseta: en 3D cuando el navegador tiene WebGL, y la camiseta en SVG mientras carga
// o si el 3D no está disponible. three.js va en un paquete aparte que solo se descarga aquí.

type Props = {
  name: string;
  number: string;
  variant: JerseyVariant;
  side: JerseySide;
  onSideChange: (side: JerseySide) => void;
};

let webgl: boolean | null = null;
function hasWebGL() {
  if (webgl === null) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}
const noop = () => () => {};

function Flat({ name, number, variant, side }: Omit<Props, "onSideChange">) {
  return <JerseyArt key={`${variant}-${side}`} name={name} number={number} variant={variant} side={side} className="relative w-full h-auto animate-fade-in" />;
}

const Product3D = dynamic(() => import("./three/Product3D"), { ssr: false });

export default function ProductViewer(props: Props) {
  const supported = useSyncExternalStore(noop, hasWebGL, () => false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  if (!supported || failed) return <Flat {...props} />;
  return (
    <div className="relative w-full aspect-square">
      {!ready && <Flat {...props} />}
      <Product3D {...props} onReady={() => setReady(true)} onError={() => setFailed(true)} className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} />
      {ready && <p className="absolute bottom-0 inset-x-0 text-center text-xs text-[#8FA3BF] pointer-events-none">Arrástrala para girarla</p>}
    </div>
  );
}
