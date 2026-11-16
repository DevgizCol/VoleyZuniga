# Web Push del club

Cambio aislado sobre `main` para publicar únicamente notificaciones. Conserva la portada, planteles, administración y reglas existentes; integra solo los controles y enlaces necesarios para Web Push.

## Activación de producción, en este orden

1. En Apps Script, añade `ADMIN_SECRET`: aleatorio, 24+ caracteres y distinto de `SHARED_SECRET`. Esta clave es exclusiva del registro de suscripciones push. Las operaciones anteriores conservan su autenticación con `SHARED_SECRET`.
2. Publica `docs/google-sheets/Code.gs` de esta rama como **nueva versión de la implementación existente**, conservando su URL. El cambio es aditivo: añade operaciones `push.*` y crea `PushSuscripciones` al primer acceso. Esa pestaña no se expone mediante lecturas públicas ni administrativas generales. No cambies `SHARED_SECRET`, `NOTIFY_EMAIL` ni otras propiedades.
3. Configura en Vercel, destino Production:

   | Variable | Valor |
   | --- | --- |
   | `VAPID_PUBLIC_KEY` | Clave pública persistente |
   | `VAPID_PRIVATE_KEY` | Clave privada del mismo par; nunca `NEXT_PUBLIC_` |
   | `VAPID_SUBJECT` | Contacto `mailto:clubvoleyzuniga@gmail.com` |
   | `SHEETS_ADMIN_SECRET` | El nuevo `ADMIN_SECRET`, distinto de `SHEETS_SECRET` |

   Las claves locales se pueden preparar con `npm run notifications:setup`. El comando conserva el par existente y nunca lo imprime. Copiar valores por los ajustes protegidos del hosting, nunca a commits, descripciones de PR o mensajes públicos.
4. Tras los checks, fusiona esta rama y verifica el despliegue de producción. No basta con desplegar código si faltan las variables o la versión del backend.
5. Abre `/admin/notificaciones`: claves configuradas y registro accesible. En `/notificaciones`, un navegador compatible debe activar voluntariamente los avisos y conceder el permiso. El alta verifica que el proveedor acepta un aviso de conexión antes de ocupar cupo.
6. Envía primero la prueba a tu dispositivo. Después puedes enviar el comunicado de prueba a los dispositivos suscritos. El mensaje debe indicar que es una prueba, sin anunciar un partido o cambio de sede inexistente.

## Personas conectadas y alcance real

No existe un registro de presencia de usuarios en línea en esta versión. El contador es de **dispositivos suscritos**, no personas activas. Una pestaña abierta antes del despliegue no incorpora código nuevo hasta recargarse. Las personas conectadas deben abrir o recargar la web y activar los avisos; no se pueden suscribir ni recibir Web Push sin su permiso.

El envío general alcanza a los dispositivos suscritos, estén o no viendo la página. No hay filtro «solo conectados». El panel informa aceptación por el proveedor, fallos y suscripciones caducadas; no acredita visualización en pantalla. La entrega depende de conexión, navegador y ajustes del sistema. No hay cron de recordatorios automáticos antes del partido.

## Comportamiento

- Noticias publicadas, nuevas fechas, cambios de agenda y resultados: avisos al guardar con «Notificar» marcado. Los borradores y guardados sin cambios relevantes no envían.
- Retirada de partidos: opción de avisar en su confirmación de borrado.
- Comunicado manual: título, mensaje y enlace a Inicio, Noticias o Partidos, con confirmación. No crea un artículo.
- Baja voluntaria desde `/notificaciones`. No requiere nombre, correo ni teléfono.
- Hasta 200 dispositivos. Registro privado persistente en Sheets, claves P-256 verificadas y destinos HTTPS limitados a servicios push conocidos. Producción no utiliza archivos locales como respaldo.
- En desarrollo se usa `.local-data`, ignorado por Git. No trasladar suscripciones ficticias a producción.
- El historial registra el resultado del comunicado mediante la operación nueva `push.audit`, sin cambiar el resto de la auditoría del panel.

## Navegadores

HTTPS es obligatorio excepto en `localhost`. Una dirección de LAN por HTTP no sirve para activar push en el celular. En iPhone/iPad, usar iOS/iPadOS 16.4+ y abrir la web añadida a la pantalla de inicio. En Brave, revisar el ajuste de servicios de Google para mensajes push; la interfaz traduce el fallo de registro y no afirma que se haya completado la suscripción.

Referencias: [PushManager.subscribe](https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe), [Brave: ajustes de privacidad](https://support.brave.app/hc/en-us/articles/360017989132-How-do-I-change-my-Privacy-Settings), [WebKit: Web Push en iOS/iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/).

## Verificación y reversión

Pruebas `tests/push*.test.ts`: validación, API, publicación, registro, permisos Apps Script, purga, receptor, clic e idempotencia. Ejecutar lint, tipos, pruebas y build antes de producción. Los checks del PR se ejecutan en GitHub para no iniciar procesos pesados con la RAM local por debajo de 3 GiB.

La implementación de origen se comprobó con transporte interceptado y permisos simulados por limitaciones del Chromium de pruebas. Eso no demuestra una entrega FCM/APNs real. La prueba con dispositivos reales debe realizarse después de la activación del backend y el despliegue.

Si falla la activación, conservar las suscripciones y las claves; no rotarlas como primer intento de solución. Para retirar la versión, revertir el commit de esta funcionalidad o restaurar el despliegue anterior en Vercel. El bloque nuevo `push.*` de Apps Script es aditivo y no altera el comportamiento de las rutas anteriores.
