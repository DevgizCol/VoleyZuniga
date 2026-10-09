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
| Fixture | El club | Partidos en `/partidos`, el calendario suscribible y el panel. |
| Tabla | El club | Posiciones en `/posiciones`. |
| Noticias | El club | Noticias en `/noticias` (imagen: enlace de Drive o `https://`). |
| Cancha | El club | Estado distinto de "Normal" muestra un aviso naranja en toda la web. |
| Galería | El club | Fotos en `/galeria` y las 6 más recientes en el inicio. Columnas: Fecha, Título, Imagen (URL), Activo. |
| Entrenadores | El club | Cuerpo técnico en `/el-club`. Columnas: Nombre, Cargo, Categorías, Foto (URL), Perfil, Activo. |
| Testimonios | El club | "Lo que dicen las familias" en el inicio. Columnas: Nombre, Relación, Testimonio, Activo. |

Las filas con **Activo = NO** no se muestran. Los cambios se ven en la web en 2 a 5 minutos.
Si una pestaña no existe o está vacía, su sección simplemente no aparece. Las imágenes pueden ser
enlaces de Google Drive compartidos como "Cualquier persona con el enlace".

> Las pestañas Galería, Entrenadores y Testimonios son nuevas: después de pegar la versión actual de
> `Code.gs`, publica una **Nueva versión** de la implementación (paso 4 abajo) para que la web pueda leerlas.

El panel `/admin` muestra las inscripciones sin atender (con botón para escribir por WhatsApp),
los mensajes, el próximo partido, el estado de las canchas y un generador de mensajes para el grupo.

## Variables de entorno (Vercel → Settings → Environment Variables)

Ver `.env.example`. Obligatorias: `ADMIN_PASSWORD`, `SESSION_SECRET`, `SHEETS_WEBAPP_URL`, `SHEETS_SECRET`.
Opcionales: `SHEET_URL` (botón "Abrir la hoja" del panel) y `NEXT_PUBLIC_SITE_URL` (dominio propio).

## Apps Script (backend de la hoja)

El código está en `docs/google-sheets/Code.gs`.

1. En la hoja: Extensiones → Apps Script → pega el archivo y guarda.
2. Propiedades del script: `SHARED_SECRET` (igual a `SHEETS_SECRET` en Vercel) y `NOTIFY_EMAIL`.
3. Primera vez: Implementar → Nueva implementación → Aplicación web (Ejecutar como: Yo; Acceso: Cualquier usuario).
4. Al cambiar el código: Implementar → Administrar implementaciones → lápiz → **Nueva versión**. La URL no cambia.
5. Resumen semanal por correo (opcional): ejecuta una vez `instalarResumenSemanal`.

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
