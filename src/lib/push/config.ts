import "server-only";
import { createECDH, timingSafeEqual } from "node:crypto";

export function pushConfig() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  const subject = process.env.VAPID_SUBJECT || "";
  try {
    if (!/^(mailto:[^\s@]+@[^\s@]+\.[^\s@]+|https:\/\/[^\s]+)$/.test(subject)) return null;
    const ec = createECDH("prime256v1");
    ec.setPrivateKey(Buffer.from(privateKey, "base64url"));
    const pub = Buffer.from(publicKey, "base64url");
    if (pub.length !== 65 || !timingSafeEqual(ec.getPublicKey(), pub)) return null;
    return { publicKey, privateKey, subject };
  } catch { return null; }
}

export function localPushStore() {
  // Nunca depender del disco efímero de Vercel, ni de archivos de desarrollo en producción.
  return process.env.NODE_ENV === "development" && !process.env.VERCEL;
}
