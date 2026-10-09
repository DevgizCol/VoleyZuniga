// Convierte un enlace de Google Drive ("Cualquier persona con el enlace") en una imagen directa.
// Acepta también rutas locales (/store/...) y enlaces https directos.
export function imageUrl(raw: string): string {
  const url = (raw || "").trim();
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}=w1600`;
  if (url.startsWith("/")) return url;
  return /^https:\/\//.test(url) ? url : "";
}
