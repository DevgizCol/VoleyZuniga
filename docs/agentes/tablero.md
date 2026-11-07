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
| 1 | Next 16.4.5 + sesión en `adminRead`/`adminMutate` | Seguridad | Hecho | PR #24 |
| 2 | Paquete seguridad profunda (login, sesión, IP, export, .ics, Apps Script `cols`, zod, CI, Docker, privacidad) | Seguridad | Hecho | PR #25 |
| 3 | Analítica de conversión (inscripción enviada, clic WhatsApp, pase descargado) | Mercadeo | Hecho: columna Origen (Hobby sin eventos) | PR #44 |
| 4 | SEO local: titles/descriptions con "escuela de voleibol en Medellín", OG por página, JSON-LD completo, `NEXT_PUBLIC_SITE_URL` | SEO | En PR | PR #45 |
| 5 | Formularios accesibles (`aria-describedby`, foco al primer error, foco visible, bordes 3:1) | Accesibilidad | Hecho | PR #38 |
| 6 | Video de portada: botón pausar/reproducir, respeta reducir movimiento, no se descarga con ahorro de datos o 2G/3G | Accesibilidad/Rendimiento | Hecho | PR #43 |
| 7 | Fotos de Drive por tamaño de uso: `srcSet` 480–1600 + `sizes` por lugar | Rendimiento | Hecho | PR #42 |
| 8 | Fuentes: quitado Big Shoulders 600 (1 uso); Figtree 500 se conserva (menú) | Rendimiento | Hecho | PR #42 |
| 9 | Fotos en color en móvil (`hover: none`) y confirmación de inscripción con una acción principal | Diseño | Fotos en color en móvil: en PR; confirmación con una acción: pendiente | PR #46 |
| 10 | Menú móvil: foco, Escape, devolver foco | Accesibilidad | En PR | PR #46 |
| 11 | Timeout de lectura 4–5 s, `loading.tsx`, no cachear respaldo vacío si la hoja falla | Rendimiento | Pendiente (verificar bug) | — |
| 12 | `/partidos` y `/posiciones` dinámicas por `searchParams` | Rendimiento | Pendiente | — |
| 13 | Rate limit compartido (Upstash/Vercel WAF) | Seguridad | Pendiente (decidir costo) | — |
| 14 | Lighthouse real en móvil | QA | Pendiente | — |
| 15 | Clasificar transcripciones de videos y cruzar con esta cola | Investigación | Hecho (`docs/investigacion/ideas-videos.md`) | PR #28 |
| 16 | **Mejorar el panel `/admin`** (pedido del usuario). Auditoría en celular hecha (ver abajo); mejoras por ciclo | Panel | Auditado; 16a–16d y 16f hechos | PR #27, #40, #41 |
| 16a | Posiciones desborda a lo ancho en celular (565 px en 390): el `sr-only` absoluto de la última columna escapaba del `overflow-x-auto` | Panel | Hecho | PR #27 |
| 16b | Lentitud: cada sección 2,7–4,5 s y Ajustes 13 s; sin `loading.tsx` en `/admin` (pantalla congelada al navegar) | Panel | Hecho | PR #40 |
| 16c | Navegación móvil: 12 secciones en una fila que se corta sin indicar que hay más; barra inferior descartada (Ponytail): se desplaza a la sección activa + desvanecido que indica más | Panel | Hecho | PR #40 |
| 16d | Filtros que abren vacíos: Inscripciones abre en "Nuevo" (vacío) y Partidos en "Próximos" (vacío) aunque hay 1 resultado por cargar; abrir en la pestaña con trabajo pendiente | Panel | Hecho | PR #27 |
| 16e | Pendientes de revisar con datos: flujo de cargar resultado, editar inscripción, publicar noticia (requiere guardar: pedir permiso) | Panel | Pendiente | — |
| 16f | Módulos en escritorio: barra Guardar tapaba el último campo, Noticias en 3 columnas, etiquetas vacías, "Personalizable" con cualquier texto, "1 sesiones" | Panel | Hecho | PR #41 |
| 17 | Dependabot + `npm audit --omit=dev` en CI | Seguridad | Hecho | PR #29 |
| 18 | `error.tsx` / `global-error.tsx` con reintento | Buenas prácticas | Hecho | PR #29 |
| 19 | Prioridad a la imagen principal de la portada (LCP) | Rendimiento | Hecho | PR #29 |
| 20 | Google Business + QR de reseñas en el pase | SEO/Mercadeo | Pendiente (club) | — |
| 21 | Prueba de accesibilidad automática (axe) en CI | Accesibilidad | Pendiente | — |
| 22 | Lighthouse en CI para móvil | Rendimiento | Pendiente | — |
| 23 | Tokens de color en el tema de Tailwind (`#F29A2E` ×261) | Diseño | Pendiente | — |
| 24 | Plan de respuesta a incidentes | Seguridad | Hecho: `docs/seguridad/plan-incidentes.md` | este PR |
| 25 | Microinteracciones (Emil Kowalski, con `reduced-motion`) | Diseño | Pendiente | — |
| 26 | Precio o rango visible en la web | Mercadeo | Pendiente (decisión del club) | — |
| 27 | Mantener despierto Apps Script (activador de tiempo cada ~5 min) para evitar arranques en frío de 10+ s | Rendimiento | Idea (gasta cuota diaria de Apps Script) | — |

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
