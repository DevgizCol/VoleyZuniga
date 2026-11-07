import "server-only";

// Límite de peticiones en memoria. Es por instancia (en serverless puede reiniciarse),
// así que frena abuso casual pero no reemplaza una protección de red.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export function clientIp(request: Request): string {
  // En Vercel x-vercel-forwarded-for lo fija la plataforma (no falsificable); x-forwarded-for sí lo controla el cliente.
  const h = request.headers;
  return h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",").pop()?.trim() || "unknown";
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

// ---------- Límite compartido entre instancias (Upstash Redis, plan gratis) ----------
// Variables: UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN, o KV_REST_API_URL y KV_REST_API_TOKEN
// (las que crea la integración de Upstash en Vercel con el prefijo "KV"). Sin ellas, solo cuenta el límite en memoria.

function upstash(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url?.startsWith("https://") && token ? { url, token } : null;
}

async function redis(commands: (string | number)[][]): Promise<{ result?: unknown }[] | null> {
  const cfg = upstash();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    return res.ok ? ((await res.json()) as { result?: unknown }[]) : null;
  } catch {
    return null; // si Upstash falla, sigue valiendo el límite en memoria
  }
}

/**
 * Cuenta la petición en memoria (al instante, antes de cualquier await: las ráfagas no se cuelan)
 * y en Upstash (compartido entre instancias). Bloquea si cualquiera de los dos supera el máximo.
 */
export async function sharedLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  const local = isRateLimited(key, max, windowMs);
  const out = await redis([["INCR", `rl:${key}`], ["PEXPIRE", `rl:${key}`, windowMs, "NX"]]);
  const remote = Number(out?.[0]?.result);
  return local || (Number.isFinite(remote) && remote > max);
}

export async function resetShared(key: string): Promise<void> {
  resetLimit(key);
  await redis([["DEL", `rl:${key}`]]);
}
