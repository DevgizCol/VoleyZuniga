/* eslint-disable @next/next/no-img-element -- las fotos vienen de Drive u otra URL de la hoja */
import clsx from "clsx";
import { driveSrcSet } from "@/lib/sheet-values";

/** `sizes` para fotos en tarjetas de 1, 2 o 3 columnas. */
export const CARD_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

// Foto con el color del club: cualquier foto de celular queda en azul noche y naranja, pareja con el resto
// de la web. Con `hover` recupera su color real al pasar el mouse (o al pasar sobre la tarjeta que la contiene).
export default function BrandPhoto({
  src,
  alt,
  className,
  hover = false,
  eager = false,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  hover?: boolean;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <div className={clsx("duotone", hover && "duotone-hover", className)}>
      <img src={src} srcSet={driveSrcSet(src)} sizes={sizes} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}
