# Tablero de agentes — VoleyZuniga

Estado compartido entre sesiones y agentes. Cada ciclo actualiza **Run**, **Gate** y **Handoff**.
Reglas del ciclo: `.claude/skills/voleyzuniga-ciclo-cambio/SKILL.md`. Investigación: `.claude/skills/voleyzuniga-investigacion/SKILL.md`.

## Plan

- **Propósito:** mejorar VoleyZuniga en seguridad, rendimiento, accesibilidad, diseño, SEO/mercadeo y operación.
- **Dueño de decisiones:** Albert Gaviria (visto bueno en local, merge y publicación en Vercel).
- **Sistemas externos con riesgo:** Vercel (producción), Google Sheets + Apps Script (datos de menores), GitHub.
- **Criterio de aceptación general:** gates técnicos verdes + verificación de otra familia + visto bueno en local.

## Roles (agentes existentes, no se crean nuevos)

| Área | Agente / herramienta |
|---|---|
| Coordinación | Claude (orquestador) + `lab-ia:lab-arquitecto` |
| Seguridad | `ecc:security-reviewer` ×3 frentes; `claude-security` si se activan workflows |
| Rendimiento | `ecc:performance-optimizer`; Lighthouse (pendiente) |
| Accesibilidad y diseño | `ecc:a11y-architect`; skills taste-skill, impeccable, Emil Kowalski |
| SEO y mercadeo | `ecc:seo-specialist`, `ecc:marketing-agent` |
| QA | `ecc:e2e-runner` (Playwright, un navegador a la vez), `gemini_verificar` |
| Investigación | `voleyzuniga-investigacion` + Gemini |

## Queue (prioridad de arriba a abajo)

| # | Tarea | Área | Estado | Rama / PR |
|---|---|---|---|---|
| 1 | Next 16.4.5 + sesión en `adminRead`/`adminMutate` | Seguridad | Listo, falta merge | PR #24 |
| 2 | Paquete seguridad profunda (login, sesión, IP, export, .ics, Apps Script `cols`, zod, CI, Docker, privacidad) | Seguridad | Esperando visto bueno en local | `fix/seguridad-profunda` |
| 3 | Analítica de conversión (inscripción enviada, clic WhatsApp, pase descargado) | Mercadeo | Pendiente | — |
| 4 | SEO local: titles/descriptions con "escuela de voleibol en Medellín", OG por página, JSON-LD completo, `NEXT_PUBLIC_SITE_URL` | SEO | Pendiente | — |
| 5 | Formularios accesibles (`aria-describedby`, foco al primer error, foco visible, bordes 3:1) | Accesibilidad | Pendiente | — |
| 6 | Video de portada: pausa, `prefers-reduced-motion`, sin video en móvil con datos | Accesibilidad/Rendimiento | Pendiente | — |
| 7 | Fotos de Drive por tamaño de uso (`=w640`/`=w1200`) y `<Image>`/`aspect-ratio` | Rendimiento | Pendiente | — |
| 8 | Fuentes: de 8 a 4 grosores | Rendimiento | Pendiente | — |
| 9 | Fotos en color en móvil (`hover: none`) y confirmación de inscripción con una acción principal | Diseño | Pendiente | — |
| 10 | Menú móvil: foco, Escape, devolver foco | Accesibilidad | Pendiente | — |
| 11 | Timeout de lectura 4–5 s, `loading.tsx`, no cachear respaldo vacío si la hoja falla | Rendimiento | Pendiente (verificar bug) | — |
| 12 | `/partidos` y `/posiciones` dinámicas por `searchParams` | Rendimiento | Pendiente | — |
| 13 | Rate limit compartido (Upstash/Vercel WAF) | Seguridad | Pendiente (decidir costo) | — |
| 14 | Lighthouse real en móvil | QA | Pendiente | — |
| 15 | Clasificar transcripciones de videos y cruzar con esta cola | Investigación | En curso | — |

## Run

- Transcripción de videos de YouTube (12 búsquedas, 7 áreas) + reels de referencia: en curso.

## Gate (último ciclo)

- `fix/seguridad-profunda`: tsc ✔ · lint ✔ · vitest 38/38 ✔ · build ✔ · Gemini 9/9 ✔ · local: login desde otro origen → 403 ✔.

## Handoff — decisiones humanas pendientes

- Fusionar PR #24 (luego el de seguridad profunda).
- Si `ADMIN_PASSWORD` tiene menos de 12 caracteres, cambiarla en Vercel **antes** de publicar el paquete de seguridad.
- Publicar **Nueva versión** del Apps Script tras fusionar el paquete de seguridad.
- Club: plazo de borrado de datos, responsable de datos personales y accesos a la hoja y al correo de avisos, registro del acudiente en el consentimiento (Ley 1581).
- Activar workflows (`"enableWorkflows": true`) si se quiere `claude-security`.
