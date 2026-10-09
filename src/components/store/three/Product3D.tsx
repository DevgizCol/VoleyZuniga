"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import type { Colorway, ProductKind } from "@/data/store3d";
import { buildModel, updateJerseyText } from "./models";
import { createStage, webglAvailable, type Stage } from "./stage";
import { loadAssets, type JerseyText } from "./textures";

export type Product3DProps = {
  kind: ProductKind;
  colorway: Colorway;
  /** Escala por talla (1 = talla media). */
  scale?: number;
  /** Solo camiseta: nombre y número en vivo. */
  jersey?: JerseyText;
  /** Qué lado mostrar; al cambiar, el producto gira hasta quedar de frente o de espalda. */
  view?: "front" | "back";
  autoRotate?: boolean;
  /** Se llama si el navegador no puede mostrar 3D, para usar la imagen normal. */
  onUnsupported?: () => void;
  /** Se llama cuando el primer modelo ya está en pantalla. */
  onReady?: () => void;
  /** Para los botones de girar del visor. */
  stageRef?: React.RefObject<Stage | null>;
  className?: string;
  label: string;
};

// Visor 3D de un producto. Se importa con next/dynamic para que three.js solo se descargue en la tienda.
export default function Product3D({ kind, colorway, scale = 1, jersey, view = "front", autoRotate = true, onUnsupported, onReady, stageRef, className, label }: Product3DProps) {
  const box = useRef<HTMLDivElement>(null);
  const stage = useRef<Stage | null>(null);
  const model = useRef<THREE.Object3D | null>(null);
  const [ready, setReady] = useState(false);
  const jerseyRef = useRef(jersey);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    jerseyRef.current = jersey;
    onReadyRef.current = onReady;
  });

  // Escenario: se crea una vez por visor.
  useEffect(() => {
    if (!box.current) return;
    if (!webglAvailable()) {
      onUnsupported?.();
      return;
    }
    let s: Stage;
    try {
      s = createStage(box.current, { autoRotate });
    } catch {
      onUnsupported?.();
      return;
    }
    stage.current = s;
    if (stageRef) stageRef.current = s;
    return () => {
      s.dispose();
      stage.current = null;
      if (stageRef) stageRef.current = null;
      model.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- el escenario no se recrea al cambiar opciones
  }, []);

  // Modelo: se reconstruye al cambiar de producto o de color.
  useEffect(() => {
    let cancelled = false;
    loadAssets().then(() => {
      const s = stage.current;
      if (cancelled || !s) return;
      const m = buildModel(kind, colorway, s.renderer, jerseyRef.current);
      s.setModel(m);
      model.current = m;
      setReady(true);
      onReadyRef.current?.();
    });
    return () => {
      cancelled = true;
    };
  }, [kind, colorway]);

  // Nombre y número: solo se repintan las texturas.
  const jerseyName = jersey?.name ?? "";
  const jerseyNumber = jersey?.number ?? "";
  useEffect(() => {
    if (kind === "jersey" && model.current) updateJerseyText(model.current, colorway, { name: jerseyName, number: jerseyNumber });
  }, [kind, colorway, jerseyName, jerseyNumber, ready]);

  useEffect(() => stage.current?.setScale(scale), [scale, ready]);
  useEffect(() => stage.current?.faceTo(view === "back" ? Math.PI : 0), [view, ready]);
  useEffect(() => stage.current?.setAutoRotate(autoRotate), [autoRotate, ready]);

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      className={className}
      style={{ cursor: "grab", opacity: ready ? 1 : 0, transition: "opacity .5s ease" }}
    />
  );
}
