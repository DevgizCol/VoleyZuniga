# Plan de respuesta a incidentes

Qué hacer si algo se filtra o se ve raro. Primero **contener**, después **revisar**, al final **avisar**.
La web guarda datos de menores (nombre, edad, WhatsApp del acudiente): actuar el mismo día.

## Dónde vive cada secreto

| Secreto | Dónde | Qué protege | Al cambiarlo |
|---|---|---|---|
| `ADMIN_PASSWORD` / `ADMIN_USERS` | Vercel → Settings → Environment Variables | Entrar al panel `/admin` (contraseña + código por correo en celulares nuevos) | Cierra las sesiones de ese usuario y olvida sus celulares reconocidos. Mínimo 12 caracteres (`ADMIN_USERS`: 8). |
| `SESSION_SECRET` | Vercel | Firma de las sesiones del panel | Cierra **todas** las sesiones. 32+ caracteres aleatorios. |
| `SHEETS_SECRET` (Vercel) = `SHARED_SECRET` (Apps Script → Propiedades del script) | Ambos lados, **mismo valor** | Leer y escribir la hoja | Cambiar en los dos lados a la vez; si no coinciden, la web deja de leer y guardar. 24+ caracteres. |
| `SHEETS_WEBAPP_URL` | Vercel | Dirección del Apps Script | Solo cambia si se crea una implementación nueva. |
| `NOTIFY_EMAIL` | Apps Script → Propiedades | A dónde llegan los avisos y el resumen semanal | Si esa bandeja se comprometió, cambiarla a otra. |
| Acceso a la hoja de Google | Compartir de Google Sheets | Todos los datos | Quitar a quien no deba estar. |

Generar valores aleatorios: `openssl rand -base64 32`. Tras cambiar variables en Vercel: **Redeploy** para que tomen efecto.

## Escenarios

### Se filtró la contraseña del panel o una cookie de sesión
1. Cambiar `ADMIN_PASSWORD` (o la clave del usuario en `ADMIN_USERS`) en Vercel → Redeploy.
2. Si no se sabe qué usuario fue: cambiar `SESSION_SECRET` → Redeploy (cierra todas las sesiones y olvida todos los celulares).
3. Si se filtró el correo de un usuario: cambiar su correo y su contraseña en `ADMIN_USERS`.
4. Revisar la pestaña **Historial** de la hoja: cambios hechos desde el panel y por quién.

### Se filtró el secreto de la hoja (`SHEETS_SECRET` / `SHARED_SECRET`)
1. Generar uno nuevo y ponerlo **a la vez** en Apps Script (Propiedades del script) y en Vercel → Redeploy.
2. Revisar en la hoja filas extrañas en Inscripciones/Contacto y cambios en el resto de pestañas.

### Alguien tuvo acceso a la hoja de Google o a la bandeja de `NOTIFY_EMAIL`
1. Quitar el acceso (Compartir) o cambiar la contraseña de esa cuenta de Google con verificación en dos pasos.
2. Revisar el historial de versiones de la hoja (Archivo → Historial de versiones).

### Llegan inscripciones o mensajes falsos en masa (spam)
1. La web ya limita envíos por IP y en total (40 por hora). Si sigue: activar la protección contra bots del firewall de Vercel.
2. Borrar las filas falsas desde la hoja (el panel no borra inscripciones a propósito).

### Una dependencia publica una falla de seguridad
1. Dependabot abre el PR solo; el CI corre `npm audit --omit=dev`. Revisar y fusionar el PR de seguridad.
2. Si es crítica y no hay PR: actualizar la dependencia a la versión parcheada y desplegar.

## Avisar (Ley 1581 de 2012)

Si se expusieron datos personales de las familias:
- El responsable de datos del club informa a la **Superintendencia de Industria y Comercio (SIC)** en los plazos que fija la ley y avisa a las familias afectadas.
- Anotar qué pasó, qué datos, desde cuándo y qué se hizo (fecha y hora de cada paso).

> No es asesoría legal: el club debe confirmar plazos y obligaciones con alguien competente.
