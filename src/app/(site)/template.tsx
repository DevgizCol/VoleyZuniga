import { ViewTransition } from "react";

// Cada página nueva entra con un desvanecido corto hacia arriba; el encabezado y la barra móvil quedan quietos.
// La plantilla se vuelve a montar en cada navegación, por eso aquí sí se disparan la entrada y la salida.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
