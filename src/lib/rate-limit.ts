import "server-only";

// Límite de peticiones en memoria. Es por instancia (en serverless puede reiniciarse),
// así que frena abuso casual pero no reemplaza una protección de red.

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Devuelve true si la petición excede el límite. */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}
