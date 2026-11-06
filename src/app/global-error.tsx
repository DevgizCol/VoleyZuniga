"use client"; // Los límites de error deben ser componentes cliente

import { useEffect } from "react";

// Solo aparece si falla el layout raíz: no tiene estilos globales ni fuentes, por eso lleva estilos en línea.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es-CO">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#071426", color: "#fff", fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <title>Club Voley Zúñiga</title>
        <main style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Tiempo técnico</h1>
          <p style={{ color: "#C9D5E6", fontSize: 18 }}>Algo falló al cargar la web. Inténtalo de nuevo en unos segundos.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ height: 52, padding: "0 24px", border: 0, borderRadius: 6, background: "#F29A2E", color: "#071426", fontWeight: 700, fontSize: 18, cursor: "pointer" }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
