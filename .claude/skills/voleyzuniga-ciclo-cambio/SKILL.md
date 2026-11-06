---
name: voleyzuniga-ciclo-cambio
description: Ciclo obligatorio para cualquier cambio de código en VoleyZuniga (rama → cambio mínimo → pruebas → verificación de otra familia → mostrar en local → visto bueno → PR). Usar antes de tocar src/, docs/google-sheets/Code.gs, package.json o .github/.
---

# Ciclo de cambio VoleyZuniga

Objetivo: entregar cambios pequeños, verificados y vistos por el usuario. No cubre: publicar en Vercel ni fusionar a `main` (eso lo decide el usuario).

## Pasos (detenerse si un gate falla)

1. **Rama** desde la base correcta: `git switch -c <tipo>/<tema>` (`fix/`, `feat/`, `docs/`). Identidad del repo: Albert Gaviria <albertg2109@gmail.com>.
2. **Leer antes de escribir**: Next.js 16 difiere de lo conocido; consultar `node_modules/next/dist/docs/` si el cambio toca APIs de Next. Buscar todos los llamadores de lo que se modifica.
3. **Cambio mínimo** (Ponytail): reutilizar lo existente; lógica nueva no trivial lleva su prueba en `tests/*.test.ts`.
4. **Gate técnico** (todos deben pasar):
   ```bash
   npx tsc --noEmit && npm run lint && npm test && npm run build
   ```
5. **Gate de otra familia**: `gemini_verificar` (nivel `experto`) con el diff y criterios explícitos. Rechazo → corregir y repetir.
6. **Mostrar en local**: `npm run dev -- -p 3000` en segundo plano; dar al usuario las URLs exactas y qué mirar. Esperar su visto bueno.
7. **Cerrar** el servidor (y el navegador de prueba) tras el visto bueno; comprobar que no quedan procesos `next`.
8. **Commit + PR** con `~/.local/bin/gh pr create`; cuerpo: qué corrige, verificación, pendientes, pasos manuales (p. ej. "publicar nueva versión del Apps Script", variables de entorno en Vercel).
9. **Tablero**: actualizar `docs/agentes/tablero.md` (Gate y Handoff).

## Avisos fijos

- Cambios a `docs/google-sheets/Code.gs` requieren que el club publique una **Nueva versión** de la implementación; decirlo en el PR.
- Datos de menores (Inscripciones): nunca leerlos completos si basta una columna; nunca en logs.
- Nunca subir a Vercel ni fusionar sin orden explícita.
- Worktrees de prueba: crearlos dentro del mismo disco que el repo (Turbopack no resuelve `node_modules` enlazado desde `/tmp`).

## Mejora continua

Al cerrar cada ciclo: si un gate falló por algo que esta skill no previno, añadir aquí una línea concreta (no reglas "por si acaso"). Ponytail critica la línea antes de añadirla.
