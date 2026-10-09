import "server-only";
import { readSheet } from "./sheets";
import { imageUrl, normDate } from "./sheet-values";

// Contenido del club que se maneja desde la hoja. Si una pestaña no existe o está vacía,
// la sección correspondiente simplemente no se muestra.
//   Galería:      Fecha | Título | Imagen (URL) | Activo
//   Entrenadores: Nombre | Cargo | Categorías | Foto (URL) | Perfil | Activo
//   Testimonios:  Nombre | Relación | Testimonio | Activo

export type Photo = { date: string; title: string; image: string };
export type Coach = { name: string; role: string; categories: string; photo: string; bio: string };
export type Testimonial = { name: string; relation: string; text: string };

const t = (v: string | undefined) => (v || "").trim();

export async function getGallery(): Promise<Photo[]> {
  const rows = (await readSheet("Galería")) ?? [];
  return rows
    .map((r) => ({ date: normDate(r["Fecha"]), title: t(r["Título"]), image: imageUrl(r["Imagen (URL)"], 1200) }))
    .filter((p) => p.image)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getCoaches(): Promise<Coach[]> {
  const rows = (await readSheet("Entrenadores")) ?? [];
  return rows
    .map((r) => ({
      name: t(r["Nombre"]),
      role: t(r["Cargo"]),
      categories: t(r["Categorías"]),
      photo: imageUrl(r["Foto (URL)"], 800),
      bio: t(r["Perfil"]),
    }))
    .filter((c) => c.name);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = (await readSheet("Testimonios")) ?? [];
  return rows
    .map((r) => ({ name: t(r["Nombre"]), relation: t(r["Relación"]), text: t(r["Testimonio"]) }))
    .filter((x) => x.name && x.text);
}
