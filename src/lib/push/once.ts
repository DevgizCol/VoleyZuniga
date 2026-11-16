import "server-only";
import { createHash } from "node:crypto";
import { sharedLimited } from "@/lib/rate-limit";

/** Idempotencia solo de comunicados; conserva intacto el flujo de autenticación existente. */
export async function consumePushOnce(key: string, ttlMs: number): Promise<boolean> {
  const digest = createHash("sha256").update(key).digest("base64url");
  return !(await sharedLimited(`push:once:${digest}`, 1, ttlMs));
}
