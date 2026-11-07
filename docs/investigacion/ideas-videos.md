# Ideas de 34 videos, clasificadas para VoleyZuniga

**Qué se analizó:** 34 videos con voz (YouTube + 2 reels de Instagram de referencia), transcritos en local con Whisper:
rendimiento 6 · mercadeo 6 · diseño 6 · seguridad 5 · buenas prácticas 4 · accesibilidad 3 · SEO 2 · referencia 2.

**Método:** extracción de ideas concretas por Gemini (≈180, sin relleno ni autopromoción) → deduplicación y contraste con el código y las 5 auditorías (`docs/agentes/tablero.md`) → verificación por otra familia de modelos.

**Estados:** *Ya lo tenemos* (está en el código) · *Tablero #n* (ya planificado) · *Aplica* (idea nueva útil) · *No aplica* (con la razón).

## Rendimiento

| Idea                                                                                                                                  | Fuente                                            | Estado                                       | Por qué                                                                                          | Costo |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----- |
| Imágenes WebP/AVIF, `srcset`/`sizes`, `width`/`height` o `aspect-ratio`                                                    | Ultimate guide to web performance · 31 mejoras   | Tablero #7                                   | Las fotos de Drive se piden a 1600 px y con `<img>` sin dimensiones                             | bajo  |
| Pocas fuentes y solo los grosores usados, autoalojadas                                                                                | Ultimate guide · 31 mejoras                      | Tablero #8                                   | Ya autoalojadas; 8 grosores → 4                                                                  | bajo  |
| Prioridad para la imagen principal (`priority` / `fetchPriority="high"`)                                                          | Ultimate guide                                    | **Aplica**                             | La foto/póster de la portada no tiene prioridad: es el LCP en celular                            | bajo  |
| Skeletons / Suspense mientras cargan datos                                                                                            | 31 mejoras · Next.js navigation                  | Tablero #11, #16b                            | No hay ningún `loading.tsx`                                                                    | bajo  |
| Timeouts a APIs externas                                                                                                              | 31 mejoras                                        | Tablero #11                                  | Existe (15 s); bajar a 4–5 s en lecturas                                                         | bajo  |
| Medir antes de optimizar; Lighthouse/Unlighthouse en CI                                                                               | Ultimate guide · API 10x · React best practices | Tablero #14 + **Aplica** (CI)          | Medir cada PR en móvil evita regresiones                                                         | medio |
| Usuarios reales (RUM) y prueba en celular/red lenta                                                                                   | 31 mejoras                                        | Ya lo tenemos (Speed Insights) / Tablero #14 | Falta la prueba en red lenta                                                                      | bajo  |
| React Compiler                                                                                                                        | 5 React best practices                            | **Aplica** (probar)                    | Next 16 lo soporta; quita memoización manual. Probar en rama y medir                             | medio |
| Quitar dependencias sin uso                                                                                                           | 31 mejoras                                        | **Aplica**                             | Revisar con `knip`/`depcheck`                                                                 | bajo  |
| CDN, Brotli/Gzip, caché de estáticos, render en servidor, división por ruta, terceros diferidos                                    | Ultimate guide · 31 mejoras · Vue tips          | Ya lo tenemos                                | Vercel + Next lo hacen; solo faltan cabeceras de caché de algunos íconos públicos (auditoría) | bajo  |
| Debounce en búsquedas                                                                                                                | 31 mejoras                                        | Ya lo tenemos                                | `useDeferredValue` en Inscripciones                                                             | —    |
| Pedir solo las columnas necesarias                                                                                                    | 31 mejoras                                        | Ya lo tenemos                                | `cols=Fecha` en la portada (PR #25)                                                             | —    |
| Paginación / virtualizar listas                                                                                                      | 31 mejoras · Vue tips · API 10x                 | No aplica (aún)                             | Listas de decenas de filas; revisar si pasan de ~300                                              | —    |
| Web Workers / Partytown                                                                                                               | Time to Interactive in Next.js · Ultimate guide  | No aplica                                    | No hay cálculo pesado ni scripts de terceros pesados                                             | —    |
| SQL (N+1, índices, pool, columnas), Redis, colas, balanceo, servidor junto a la BD, RDS Proxy, serializadores JSON, logs asíncronos | 31 mejoras · API 10x                             | No aplica                                    | No hay base de datos SQL: Google Sheets + serverless                                              | —    |
| OpenTelemetry                                                                                                                         | 31 mejoras                                        | No aplica                                    | Excesivo para el tamaño; los logs de Vercel bastan                                               | —    |

## Seguridad y legal

| Idea                                                                                       | Fuente                                                   | Estado                                  | Por qué                                                                                                                   | Costo |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----- |
| Actualizar Next/React apenas salgan parches                                                | Next.js 9.1 exploit · Critical vulnerabilities          | Ya lo tenemos (PR #24)                  | Next 16.4.5                                                                                                                | —    |
| Avisos automáticos de dependencias (Dependabot/Renovate) + `npm audit --omit=dev` en CI | Ciberseguridad vibe coding · Critical vulnerabilities   | **Aplica**                        | No existe; así llegó Next 16.4.0 con RCE sin que nadie lo notara                                                         | bajo  |
| No confiar la autorización al middleware                                                  | Next.js 9.1 exploit                                      | Ya lo tenemos                           | No hay middleware; cada lectura del panel exige `getAdmin()`                                                             | —    |
| Autorización en servidor, secretos en variables de entorno, sin datos personales en logs  | Ciberseguridad vibe coding                               | Ya lo tenemos                           | Auditoría de seguridad lo confirmó                                                                                       | —    |
| Límite de peticiones                                                                      | Ciberseguridad vibe coding                               | Ya lo tenemos / Tablero #13             | Por instancia; falta compartido (Upstash/WAF)                                                                              | medio |
| Firewall / detección de intrusos                                                          | Critical vulnerabilities                                 | Tablero #13                             | Vercel WAF                                                                                                                 | medio |
| Acceso al panel con código por correo o segundo factor                                    | Critical vulnerabilities · Qennect                      | **Aplica** (valorar)              | Hoy es contraseña compartida; un código por correo con Apps Script es gratis                                             | medio |
| Plan de respuesta a incidentes                                                             | Critical vulnerabilities                                 | **Aplica**                        | Una página: qué rotar (`SHARED_SECRET`, `SESSION_SECRET`, `ADMIN_PASSWORD`) y a quién avisar si se filtra la hoja | bajo  |
| Auditorías periódicas                                                                    | Critical vulnerabilities                                 | **Aplica** (proceso)              | Repetir el análisis de 3 frentes cada trimestre o tras cambios grandes                                                    | bajo  |
| Revisar el código hecho con IA; confirmación humana antes de acciones destructivas       | Hidden risk of vibe coding · Ciberseguridad vibe coding | Ya lo tenemos                           | Skill `voleyzuniga-ciclo-cambio` (gates + visto bueno)                                                                   | —    |
| Política de privacidad accesible, casilla de consentimiento                               | cami.elabogado                                           | Ya lo tenemos                           | `/privacidad` y casilla obligatoria                                                                                      | —    |
| Registrar fecha, mecanismo y versión del consentimiento                                   | cami.elabogado                                           | Tablero (Handoff Ley 1581)              | Hoy solo "Sí (fecha)"; falta versión y quién acepta                                                                     | bajo  |
| Minimizar datos pedidos                                                                    | cami.elabogado                                           | **Aplica**                        | Revisar si "nivel" y "horario" deben ser obligatorios para un principiante                                                 | bajo  |
| Términos de la tienda y derecho de retracto (Estatuto del Consumidor, Ley 1480)           | cami.elabogado                                           | **Aplica** si se vende por la web | Hoy la venta cierra por WhatsApp; si hay pago en línea, es obligatorio                                                    | medio |
| Licencias de fotos, fuentes e íconos                                                      | cami.elabogado                                           | **Aplica** (proceso)              | Verificar derechos de las fotos subidas a la hoja                                                                          | bajo  |
| CORS con lista blanca, SQL parametrizado                                                   | Ciberseguridad vibe coding                               | No aplica                               | No hay API pública entre orígenes ni SQL                                                                                 | —    |

## Diseño y UX

| Idea                                                                                                  | Fuente                                                             | Estado                        | Por qué                                                                                           | Costo |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------------------------------------------- | ----- |
| Una acción principal con relleno; secundarias sin relleno; nada de botón fantasma para lo principal | 7 consejos de diseño · 7 minutes web design                      | Tablero #9 + **Aplica** | Revisar portada, confirmación de inscripción y barra móvil con esta regla                       | bajo  |
| Portada que cause buena primera impresión                                                            | Psychology of premium websites                                     | Ya lo tenemos (PR #21)        | Rediseño reciente                                                                                 | —    |
| Microinteracciones y animaciones al hacer scroll, contadores animados                                 | Psychology of premium websites · Claude Code páginas increíbles | **Aplica**              | Con skills de Emil Kowalski y respetando `prefers-reduced-motion` (p. ej. contador de inscritos) | bajo  |
| Tokens de diseño (sistema compartido de colores y componentes)                                       | Curso de Figma · No bullsh*t guide                                | **Aplica**              | `#F29A2E` aparece 261 veces y `#071426` 141: definirlos en el tema de Tailwind                 | medio |
| Fondos con tono de la paleta en vez de grises; menos bordes; sombras sutiles                          | 7 consejos de diseño                                              | **Aplica** (pulido)     | Pasada con taste-skill                                                                             | bajo  |
| Jerarquía clara: un objetivo por sección                                                            | Psychology of premium · 7 minutes                                 | **Aplica** (revisar)    | Pasada de diseño por página                                                                      | bajo  |
| Simplificar el flujo de inscripción                                                                  | Marketing strategies for sports club                               | Tablero #5, #9                | Accesibilidad del formulario y confirmación con una acción                                       | medio |
| Paleta 60/30/10                                                                                       | 7 minutes web design                                               | Ya lo tenemos                 | Azul noche dominante, azul club, naranja acento                                                    | —    |
| Cursor personalizado, botones con formas exclusivas                                                   | Claude Code páginas increíbles                                   | No aplica                     | En celular no hay cursor; afecta usabilidad                                                        | —    |
| Wireframes y prototipos en Figma antes de programar                                                   | Curso de Figma · UX/UI desde cero                                 | No aplica (ahora)             | El sitio ya existe; se itera en código con revisión en local                                     | —    |

## Mercadeo y SEO local

| Idea                                                                                   | Fuente                               | Estado                                | Por qué                                                                    | Costo |
| -------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------- | ----- |
| Ficha de Google Business: categoría correcta, fotos reales, horarios exactos          | SEO local 2026 · Google Maps 2026   | **Aplica** (club)               | No existe; la búsqueda local no muestra clubes privados                    | bajo  |
| Reseñas recientes y continuas                                                         | SEO local 2026                       | **Aplica**                      | QR de reseña en el pase de inscripción                                    | bajo  |
| Menciones en medios y blogs locales                                                    | SEO local 2026                       | **Aplica** (club)               | Colegios, juntas de acción comunal, prensa de barrio                       | medio |
| Precios transparentes                                                                  | Marketing strategies for sports club | **Aplica** (decisión del club) | Hoy el precio solo se da por WhatsApp                                       | bajo  |
| Boletín mensual por correo                                                            | Marketing strategies for sports club | **Aplica**                      | Solo con consentimiento específico para comunicaciones (Ley 1581)          | medio |
| Sincronizar noticias y partidos con redes y mapas                                      | Dynamic advertising (SpiderAds)      | **Aplica** (valorar)            | El calendario `.ics` ya existe; publicar noticias en redes desde el panel | medio |
| Avisos recurrentes automatizados                                                       | Crecer en redes (fútbol)            | Ya lo tenemos                         | "Mensaje al grupo" del panel y resumen semanal                              | —    |
| Analítica de conversión y SEO técnico                                               | —                                   | Tablero #3, #4                        | Auditoría SEO                                                              | medio |
| Alianzas con figuras locales, paquetes para empresas, canal de YouTube, anuncios pagos | Marketing strategies for sports club | Fuera de la web                       | Decisiones comerciales del club                                             | —    |

## Accesibilidad

| Idea                                                 | Fuente                                   | Estado                       | Por qué                                     | Costo |
| ---------------------------------------------------- | ---------------------------------------- | ---------------------------- | -------------------------------------------- | ----- |
| Foco visible en todo                                 | HeX developer                            | Tablero #5                   | `focus:outline-none` en campos             | bajo  |
| Pausa para el video automático de la portada        | HeX developer                            | Tablero #6                   | Sin botón de pausa                          | bajo  |
| `aria-label` en botones de solo ícono; landmarks  | HeX developer · Headings and landmarks  | Ya lo tenemos                | Confirmado en la auditoría                  | —    |
| Encabezados en orden (h1→h2→h3)                    | Headings and landmarks                   | **Aplica** (verificar) | La auditoría no revisó página por página | bajo  |
| Prueba automática de accesibilidad (axe/WAVE) en CI | HeX developer · Accessibility audit FAQ | **Aplica**             | Playwright + axe en cada PR                  | medio |
| Accesibilidad desde el diseño, no como parche       | HeX developer                            | **Aplica** (proceso)   | Añadirlo como gate en la skill de ciclo     | bajo  |

## Buenas prácticas (React / IA)

| Idea                                                                                      | Fuente                                  | Estado               | Por qué                                                                | Costo |
| ----------------------------------------------------------------------------------------- | --------------------------------------- | -------------------- | ----------------------------------------------------------------------- | ----- |
| Error Boundaries con pantalla amable                                                      | React best practices 2025               | **Aplica**     | No existe ningún `error.tsx` ni `global-error.tsx`                 | bajo  |
| Estado inmutable, `key` estable, dependencias completas, valores derivados en el render | 7 React lessons · React best practices | Ya lo tenemos (lint) | `eslint-config-next` lo vigila; sin hallazgos en auditorías          | —    |
| TypeScript en props, componentes pequeños, carpetas por funcionalidad                    | React best practices 2025               | Ya lo tenemos        | Estructura actual                                                       | —    |
| React Query / SWR para pedir datos                                                        | 7 React lessons                         | No aplica            | Server Components y Server Actions ya resuelven la carga y la mutación | —    |

## Top 10 nuevas para el tablero

1. **Dependabot + `npm audit --omit=dev` en CI**: seguridad, costo bajo.
2. **`error.tsx` / `global-error.tsx` con mensaje y reintento**: buenas prácticas, costo bajo.
3. **Prioridad a la imagen principal de la portada (LCP)**: rendimiento, costo bajo.
4. **Ficha de Google Business + QR de reseñas en el pase**: SEO y mercadeo, costo bajo, tarea del club.
5. **Prueba de accesibilidad automática (axe) en CI**: accesibilidad, costo medio.
6. **Lighthouse en CI para móvil**: rendimiento, costo medio.
7. **Tokens de color en el tema de Tailwind**: diseño, costo medio.
8. **Plan de respuesta a incidentes**: seguridad, costo bajo.
9. **Microinteracciones con las skills de Emil Kowalski** (con `reduced-motion`): diseño, costo bajo.
10. **Precio o rango visible en la web**: mercadeo, costo bajo, decisión del club.

## Estado al 2026-11-06 (rama `feat/pendientes-final`)

| Idea | Resultado |
|---|---|
| Top 1–3, 8 | Hechos antes (PR #29, #47) |
| 4. Google Business + reseñas | Enlace de reseñas en Ajustes → pie de página y "Pedir reseña" en la ficha del pase **después** de la clase gratis (pedirla antes no tiene sentido). Guía para crear la ficha: `docs/mercadeo/google-business.md` (tarea del club) |
| 5. axe en CI | Hecho: 13 rutas, WCAG 2.2 AA + títulos en orden, en celular |
| 6. Lighthouse en CI | Hecho: 3 páginas en celular. Medido: rendimiento 90–97, accesibilidad 97–100, SEO 100 |
| 7. Tokens de color | Hecho: 562 usos pasan a los tokens del tema, sin cambio visual |
| 9. Microinteracciones | Respuesta al tocar botones (150 ms). Los contadores ya animaban con CSS |
| 10. Precio | `$60.000` de mensualidad por defecto (editable en Ajustes) |
| Encabezados h1→h2→h3 | Verificado en las 13 rutas (prueba automática) |
| Quitar dependencias sin uso | `knip`: ninguna sin uso |
| React Compiler | **No se activa**: solo 7 memoizaciones manuales y TBT en celular de 38–82 ms; sumaría una dependencia y compilaciones más lentas sin ganancia visible |
| Accesibilidad como gate | `npm run test:a11y` en el ciclo de cambio |
| Código por correo para el panel | Hecho: usuarios con correo, contraseña + código, celular reconocido 180 días |
| Minimizar datos (nivel, horario) | Se mantienen: vienen preseleccionados (no cuestan esfuerzo) y se necesitan para agendar la clase |

## Desconfiar

- **"Una sola familia tipográfica"** (No bullsh*t guide): no es una regla. Dos familias bien combinadas (títulos + texto) funcionan; lo que pesa es la cantidad de grosores.
- **"Barrel exports con `index`"** (React best practices 2025): pueden empeorar el tamaño del paquete y la compilación; no usarlos en Next.
- **"Registrar un nombre comercial con palabras clave para Google Business"** (Google Maps 2026): Google penaliza nombres con palabras clave que no son el nombre real; usar el nombre legal del club.
- **"`React.memo` / `useCallback` en todo"** (React best practices 2025): medir primero; con React Compiler sobran.
- **"Comprimir con Brotli y servir por CDN"** (31 mejoras): en Vercel ya viene activado; no requiere trabajo.
- **"Partytown para scripts de terceros"** (Time to Interactive): sigue siendo experimental en Next; aquí no hay terceros pesados.
- **Consejos de bases de datos SQL** (31 mejoras, API 10x): ciertos en general, irrelevantes con Google Sheets.
