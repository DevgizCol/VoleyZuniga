# Club Voley Zúñiga — sitio web

Sitio del Club Voley Zúñiga (Medellín): inscripciones con pase descargable, partidos, posiciones,
noticias, tienda y panel para el cuerpo técnico. Funciona sin costo: Vercel (plan gratuito) +
una Hoja de cálculo de Google como base de datos.

## Cómo administra el club el contenido

Todo se maneja desde la hoja de Google del club (pestaña **Leeme** con instrucciones):

| Pestaña | Quién la llena | Qué hace en la web |
| --- | --- | --- |
| Inscripciones | La web | Cada inscripción, con su código de pase. Cambia **Estado** a Contactado / Matriculado. |
| Contacto | La web | Mensajes del formulario de contacto. |
| Fixture | El club | Partidos en `/partidos`, el calendario suscribible y el panel. Columna opcional **Escudo rival (URL)** para mostrar el escudo del rival. |
| Tabla | El club | Posiciones en `/posiciones`. |
| Noticias | El club | Noticias en `/noticias` (imagen: enlace de Drive o `https://`). |
| Cancha | El club | Estado distinto de "Normal" muestra un aviso naranja en toda la web. |
| Galería | El club | Fotos en `/galeria` y las 6 más recientes en el inicio. Columnas: Fecha, Título, Imagen (URL), Activo. |
| Entrenadores | El club | Cuerpo técnico en `/el-club`. Columnas: Nombre, Cargo, Categorías, Foto (URL), Perfil, Activo. |
| Testimonios | El club | "Lo que dicen las familias" en el inicio. Columnas: Nombre, Relación, Testimonio, Activo. |
| Plantel | El club | Láminas de jugadores en `/equipos`, por categoría. Columnas: Nombre, Número, Posición, Categoría (igual que en la web, p. ej. "Juvenil Sub-18"), Foto (URL), Activo. |
| Horarios | El club | Entrenamientos de la semana: portada, Contacto, formulario de inscripción. |
| Productos | El club | Catálogo de la tienda. |
| Ajustes | El club | Teléfono, correo, Instagram, mensaje de WhatsApp, aviso de portada, inscripciones abiertas, foto o video de la portada (`portada_foto`, `portada_video`) y foto de "El club" (`foto_club`). |
| Historial | El panel | Registro de cada cambio hecho desde `/admin` y por quién. |

Las filas con **Activo = NO** no se muestran. Los cambios se ven en la web en 2 a 5 minutos.
Si una pestaña no existe o está vacía, su sección simplemente no aparece. Las imágenes pueden ser
enlaces de Google Drive compartidos como "Cualquier persona con el enlace".

> Las fotos se muestran con el color del club (azul y naranja) y recuperan su color al pasar el mouse, así que
> sirven fotos tomadas con celular. El video de portada debe ser un MP4 corto (6 a 8 s, menos de 4 MB, sin sonido).

> Las pestañas Galería, Entrenadores, Testimonios y Plantel son nuevas: después de pegar la versión actual de
> `Code.gs`, publica una **Nueva versión** de la implementación (paso 4 abajo) para que la web pueda leerlas.

### Panel `/admin`

Todo lo anterior se edita también desde el panel, sin abrir la hoja: partidos (con carga rápida de
resultados y suma automática a la tabla), posiciones, noticias, estado de canchas, horarios, tienda,
ajustes, inscripciones (estado y notas) y mensajes. Cada cambio se guarda en la hoja, se ve en la web
al instante (caché por etiquetas con `updateTag`) y queda en el Historial con el nombre de quien lo hizo.

Técnica: Server Actions de Next.js 16, validación con zod en el servidor, interfaz optimista
(`useOptimistic`), control de conflictos (si la fila cambió en la hoja, no se sobrescribe) y lista blanca
de pestañas y columnas en el Apps Script.

## Variables de entorno (Vercel → Settings → Environment Variables)

Ver `.env.example`. Obligatorias: `ADMIN_PASSWORD`, `SESSION_SECRET`, `SHEETS_WEBAPP_URL`, `SHEETS_SECRET`.
Recomendada: `SHEETS_READ_SECRET` (clave solo de lectura, igual a `READ_SECRET` del Apps Script).
Opcionales: `ADMIN_USERS` (más usuarios, `Nombre:clave; Nombre2:clave2`), `SHEET_URL` (botón "Abrir la hoja"
del panel), `NEXT_PUBLIC_SITE_URL` (dominio propio) y `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (eventos de conversión).

## Analítica

- **Vercel Web Analytics y Speed Insights**: ya están en el código; se activan en el proyecto de Vercel
  (pestañas Analytics y Speed Insights). Visitas, páginas y velocidad real, sin cookies.
- **Origen de cada inscripción**: la web recuerda de dónde llegó la familia (parámetros `utm_` del enlace o el
  sitio que la trajo) y lo guarda en la columna **Origen** de Inscripciones y Contacto. El resumen de los
  lunes cuenta las inscripciones por canal. Etiqueta los enlaces que publiques, por ejemplo:
  `?utm_source=instagram&utm_medium=bio`, `?utm_source=afiche&utm_medium=qr&utm_campaign=colegio-x`,
  `?utm_source=whatsapp&utm_medium=estado`.
- **Eventos (opcional, Umami)**: con `NEXT_PUBLIC_UMAMI_WEBSITE_ID` se cuentan `clic_whatsapp`,
  `clic_inscribirme`, `calendario`, `clic_llamar`, `inscripcion_paso`, `inscripcion_enviada` y
  `mensaje_enviado`.

## Apps Script (backend de la hoja)

El código está en `docs/google-sheets/Code.gs`.

1. En la hoja: Extensiones → Apps Script → pega el archivo y guarda.
2. Propiedades del script: `SHARED_SECRET` (igual a `SHEETS_SECRET` en Vercel), `READ_SECRET` (igual a
   `SHEETS_READ_SECRET`, recomendada) y `NOTIFY_EMAIL`.
3. Primera vez: Implementar → Nueva implementación → Aplicación web (Ejecutar como: Yo; Acceso: Cualquier usuario).
4. Al cambiar el código: Implementar → Administrar implementaciones → lápiz → **Nueva versión**. La URL no cambia.
5. Automatizaciones (opcional): ejecuta una vez `instalarAutomatizaciones` y acepta los permisos. Programa el
   resumen de los lunes, el aviso diario de inscripciones sin responder (más de 24 h) y una copia de
   seguridad semanal de la hoja en Drive (se conservan las últimas 8).

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm test        # pruebas (Vitest)
npm run build
```

Next.js 16 (App Router), React 19, Tailwind CSS 4. Cada PR pasa por lint, tipos, pruebas y compilación en
GitHub Actions (`.github/workflows/ci.yml`).

Estructura útil:

- `src/config/site.ts`: teléfono, correo, Instagram y menú.
- `src/data/`: categorías, horarios, sedes, productos de la tienda.
- `src/lib/`: lectura de la hoja (partidos, noticias, canchas, galería…), sesión del panel y pase.
- `tests/`: pruebas de las validaciones, la sesión, el límite de peticiones y la lectura de la hoja.

Las rutas están en español (`/inscripciones`, `/partidos`, `/posiciones`, `/equipos`, `/noticias`,
`/tienda`, `/el-club`, `/metodologia`, `/contacto`, `/galeria`). Las antiguas en inglés redirigen
permanentemente (ver `next.config.ts`).
