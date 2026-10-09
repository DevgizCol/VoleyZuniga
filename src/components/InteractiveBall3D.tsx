"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Three.js solo se descarga cuando la sección está cerca de la pantalla, y la escena se
// desmonta al salir. Así nunca hay dos contextos WebGL a la vez (el del logo del inicio y este),
// que es lo que provocaba el aviso "Context Lost".
const BallCanvas = dynamic(() => import("./BallCanvas"), { ssr: false });

export default function InteractiveBall3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[80vh] bg-[#F7F8FA] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">{visible && <BallCanvas />}</div>

      <div className="relative z-10 pointer-events-none text-center">
        <h3 className="text-4xl md:text-6xl font-heading font-bold text-[#0F2347] uppercase drop-shadow-md">
          Tecnología de Punta
        </h3>
        <p className="text-xl md:text-2xl text-[#64748B] mt-4 font-sans max-w-2xl mx-auto drop-shadow-sm">
          Interactivo, Dinámico, Campeón.
        </p>
      </div>
    </section>
  );
}
