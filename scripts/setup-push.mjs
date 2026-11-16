import { readFile, writeFile, chmod } from "node:fs/promises";
import * as webpush from "web-push";

// No imprimir claves ni reemplazar un par existente: rotarlo desconecta a los dispositivos suscritos.
let env = "";
try { env = await readFile(".env.local", "utf8"); }
catch (e) { if (e.code !== "ENOENT") throw e; }
const present = name => new RegExp(`^${name}\\s*=\\s*["']?[^\\s"'#]+`, "m").test(env);
const hasPublic = present("VAPID_PUBLIC_KEY"), hasPrivate = present("VAPID_PRIVATE_KEY");
if (hasPublic !== hasPrivate) {
  console.error("Hay una sola clave VAPID en .env.local. Completa el par existente antes de continuar; no se modificó el archivo.");
  process.exitCode = 1;
} else {
  const set = (name, value) => {
    const pattern = new RegExp(`^${name}\\s*=.*$`, "m");
    env = pattern.test(env) ? env.replace(pattern, `${name}=${value}`) : `${env.trimEnd()}\n${name}=${value}\n`;
  };
  if (!hasPublic) {
    const keys = webpush.generateVAPIDKeys();
    set("VAPID_PUBLIC_KEY", keys.publicKey); set("VAPID_PRIVATE_KEY", keys.privateKey);
  }
  if (!present("VAPID_SUBJECT")) set("VAPID_SUBJECT", "mailto:clubvoleyzuniga@gmail.com");
  await writeFile(".env.local", env, { mode: 0o600 });
  await chmod(".env.local", 0o600);
  console.log(hasPublic ? "Se conservó el par VAPID existente." : "Par VAPID creado y guardado en .env.local (sin mostrar claves).");
  console.log("Reinicia npm run dev. Abre /admin/notificaciones, activa avisos y envía una prueba a tu dispositivo.");
}
