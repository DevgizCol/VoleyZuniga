/* eslint-disable @next/next/no-img-element -- las fotos vienen de Drive u otra URL de la hoja */
import clsx from "clsx";

// Foto con el color del club: cualquier foto de celular queda en azul noche y naranja, pareja con el resto
// de la web. Con `hover` recupera su color real al pasar el mouse (o al pasar sobre la tarjeta que la contiene).
export default function BrandPhoto({
  src,
  alt,
  className,
  hover = false,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  hover?: boolean;
  eager?: boolean;
}) {
  return (
    <div className={clsx("duotone", hover && "duotone-hover", className)}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}
