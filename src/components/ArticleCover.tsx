import Volleyball from "./Volleyball";
import BrandPhoto from "./BrandPhoto";

// Imagen de la noticia (URL pública de la hoja) o, si no hay, una portada ilustrada.
export default function ArticleCover({ image, title, category, large = false, id }: { image: string; title: string; category: string; large?: boolean; id: string }) {
  if (image) {
    return <BrandPhoto src={image} alt="" hover className="absolute inset-0" />;
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0F2347] via-[#0B1E38] to-[#071426] overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 360 200" className="absolute inset-0 w-full h-full text-[#F29A2E]/25" preserveAspectRatio="xMidYMid slice">
        <rect x="10" y="10" width="340" height="180" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="180" y1="0" x2="180" y2="200" stroke="currentColor" strokeWidth="3" />
        <line x1="120" y1="10" x2="120" y2="190" stroke="currentColor" />
        <line x1="240" y1="10" x2="240" y2="190" stroke="currentColor" />
      </svg>
      <Volleyball className={`absolute ${large ? "w-56 -right-10 -bottom-10" : "w-32 -right-6 -bottom-6"} opacity-80`} id={`cover-${id}`} />
      <p className={`absolute left-5 bottom-4 right-24 font-heading font-black uppercase text-white/15 leading-none ${large ? "text-6xl" : "text-4xl"}`}>{category || title}</p>
    </div>
  );
}
