import "server-only";

// Límite de peticiones en memoria. Es por instancia (en serverless puede reiniciarse),
// así que frena abuso casual pero no reemplaza una protección de red.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// Borra las ventanas vencidas para que el mapa no crezca sin límite.
function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, b] of buckets) if (b.resetAt <= now) buckets.delete(key);
}

function current(key: string, windowMs: number, now: number): Bucket {
  const entry = buckets.get(key);
  if (entry && entry.resetAt > now) return entry;
  sweep(now);
  const fresh = { count: 0, resetAt: now + windowMs };
  buckets.set(key, fresh);
  return fresh;
}

/** Cuenta la petición y devuelve true si excede el límite. */
export function isRateLimited(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  const entry = current(key, windowMs, now);
  entry.count += 1;
  return entry.count > max;
}

/** True si ya se agotaron los intentos, sin contar uno nuevo (p. ej. antes de revisar una contraseña). */
export function isBlocked(key: string, max: number, now = Date.now()): boolean {
  const entry = buckets.get(key);
  return Boolean(entry && entry.resetAt > now && entry.count >= max);
}

/** Cuenta un intento fallido. */
export function recordFailure(key: string, windowMs: number, now = Date.now()): void {
  current(key, windowMs, now).count += 1;
}

export function resetLimit(key: string): void {
  buckets.delete(key);
}
