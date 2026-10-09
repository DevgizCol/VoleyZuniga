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
| Fixture | El club | Partidos en `/games`, el calendario suscribible y el panel. |
| Tabla | El club | Posiciones en `/standings`. |
| Noticias | El club | Noticias en `/news` (imagen: enlace de Drive o `https://`). |
| Cancha | El club | Estado distinto de "Normal" muestra un aviso naranja en toda la web. |
| Horarios | El club | Entrenamientos de la semana: portada, Contacto, formulario de inscripción. |
| Productos | El club | Catálogo de la tienda. |
| Ajustes | El club | Teléfono, correo, Instagram, mensaje de WhatsApp, aviso de portada, inscripciones abiertas. |
| Historial | El panel | Registro de cada cambio hecho desde `/admin` y por quién. |

Las filas con **Activo = NO** no se muestran. Los cambios se ven en la web en 2 a 5 minutos.

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
Opcionales: `ADMIN_USERS` (más usuarios, `Nombre:clave; Nombre2:clave2`), `SHEET_URL` (botón "Abrir la hoja"
del panel) y `NEXT_PUBLIC_SITE_URL` (dominio propio).

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
npm run build
```

Next.js 16 (App Router), React 19, Tailwind CSS 4. Cada PR pasa por lint, tipos y compilación en
GitHub Actions (`.github/workflows/ci.yml`).

Estructura útil:

- `src/config/site.ts`: teléfono, correo, Instagram y menú.
- `src/data/`: categorías, horarios, sedes, productos de la tienda.
- `src/lib/`: lectura de la hoja (partidos, noticias, canchas), sesión del panel y pase.
