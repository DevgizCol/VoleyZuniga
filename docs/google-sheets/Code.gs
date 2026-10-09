/**
 * Club Voley Zúñiga — backend gratuito sobre Google Sheets.
 *
 * Despliegue: Extensiones > Apps Script > pegar este archivo > Implementar >
 * Nueva implementación > Aplicación web
 *   - Ejecutar como: Yo
 *   - Quién tiene acceso: Cualquier usuario
 *
 * Si ya estaba desplegado y cambias este código: Implementar > Administrar implementaciones >
 * lápiz > Versión: Nueva versión > Implementar (la URL no cambia).
 *
 * Propiedades del script (Configuración del proyecto > Propiedades de la secuencia de comandos):
 *   SHARED_SECRET : cadena larga y aleatoria. La MISMA va en Vercel como SHEETS_SECRET.
 *   NOTIFY_EMAIL  : correo(s) que reciben el aviso de cada inscripción/mensaje (opcional).
 *   SITE_URL      : dirección pública de la web, sin "/" final (p. ej. https://tudominio.com). Se usa para
 *                   mostrar el logo en el correo (opcional; sin ella el correo sale sin logo).
 */

var WRITABLE = {
  Inscripciones: ["Nombre", "Edad", "Categoría", "Nivel", "Sede", "Horario", "WhatsApp", "Consentimiento"],
  Contacto: ["Nombre", "Contacto", "Asunto", "Mensaje"]
};
var READABLE = ["Fixture", "Tabla", "Noticias", "Cancha"];
var MAX_LEN = 2000;
var TZ = "America/Bogota";

// Etiquetas que se muestran en el correo (la hoja conserva los nombres de columna).
var LABELS = {
  Inscripciones: { Nombre: "Deportista", Edad: "Edad", Categoría: "Categoría", Nivel: "Nivel", Sede: "Sede", Horario: "Horario", WhatsApp: "WhatsApp", Consentimiento: "Consentimiento" },
  Contacto: { Nombre: "Nombre", Contacto: "Contacto", Asunto: "Asunto", Mensaje: "Mensaje" }
};

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function secretOk_(provided) {
  var expected = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
  return !!expected && expected.length >= 24 && provided === expected;
}

// Evita inyección de fórmulas (=, +, -, @) al abrir la hoja.
function clean_(value) {
  var s = String(value == null ? "" : value).trim().slice(0, MAX_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!secretOk_(body.secret)) return json_({ ok: false, error: "unauthorized" });

    var name = body.sheet;
    if (!WRITABLE.hasOwnProperty(name)) return json_({ ok: false, error: "sheet_not_allowed" });

    var data = body.data || {};
    var fields = WRITABLE[name];
    var stamp = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm:ss");
    var row = [stamp];
    fields.forEach(function (f) { row.push(clean_(data[f])); });
    row.push("Nuevo"); // Estado

    var rowNumber;
    var sheetUrl;
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sh = ss.getSheetByName(name);
      if (!sh) return json_({ ok: false, error: "sheet_missing" });
      sh.appendRow(row);
      rowNumber = sh.getLastRow();
      sheetUrl = ss.getUrl() + "#gid=" + sh.getSheetId() + "&range=A" + rowNumber;
    } finally {
      lock.releaseLock();
    }

    // El aviso por correo nunca debe impedir que la fila quede guardada.
    try {
      notify_(name, fields, row, stamp, sheetUrl);
    } catch (mailErr) {
      console.error("No se pudo enviar el aviso: " + mailErr);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server_error" });
  }
}

// ---------- Aviso por correo ----------

function esc_(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Quita el apóstrofo que clean_() antepone a valores que empiezan con = + - @
function unquote_(s) {
  return String(s || "").replace(/^'/, "");
}

// Número colombiano de 10 dígitos que empieza por 3, o ya con indicativo 57.
function whatsappNumber_(raw) {
  var d = String(raw || "").replace(/\D/g, "");
  if (d.length === 10 && d.charAt(0) === "3") return "57" + d;
  if (d.length === 12 && d.slice(0, 2) === "57") return d;
  return "";
}

function firstEmail_(text) {
  var m = String(text || "").match(/[^\s@·]+@[^\s@·]+\.[^\s@·]{2,}/);
  return m ? m[0] : "";
}

function button_(href, label, bg, color) {
  return '<a href="' + esc_(href) + '" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;' +
    "background:" + bg + ";color:" + color + ';font-weight:bold;font-size:14px;text-decoration:none;border-radius:8px;">' +
    esc_(label) + "</a>";
}

function notify_(sheetName, fields, row, stamp, sheetUrl) {
  var to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!to) return;

  var labels = LABELS[sheetName];
  var values = {};
  fields.forEach(function (f, i) { values[f] = unquote_(row[i + 1]); });

  var isRegistration = sheetName === "Inscripciones";
  var title, subject, headline, subline;
  var buttons = "";
  var replyTo = "";

  if (isRegistration) {
    title = "Nueva inscripción";
    headline = values["Nombre"];
    subline = values["Edad"] + " años · " + values["Categoría"] + " · " + values["Nivel"];
    subject = "[Voley Zúñiga] Nueva inscripción: " + values["Nombre"] + " · " + values["Categoría"];
    var wa = whatsappNumber_(values["WhatsApp"]);
    if (wa) {
      var greeting = "Hola, te escribimos del Club Voley Zúñiga sobre la inscripción de " + values["Nombre"] +
        ". ¿Cuándo podemos agendar la clase de prueba?";
      buttons += button_("https://wa.me/" + wa + "?text=" + encodeURIComponent(greeting), "Responder por WhatsApp", "#25D366", "#0B1E38");
    }
  } else {
    title = "Nuevo mensaje de contacto";
    headline = values["Nombre"];
    subline = values["Asunto"];
    subject = "[Voley Zúñiga] Mensaje de " + values["Nombre"] + " · " + values["Asunto"];
    var email = firstEmail_(values["Contacto"]);
    if (email) {
      replyTo = email;
      buttons += button_("mailto:" + email + "?subject=" + encodeURIComponent("Re: " + values["Asunto"]), "Responder por correo", "#F29A2E", "#0B1E38");
    }
    var phone = whatsappNumber_(String(values["Contacto"]).split("·")[0]);
    if (phone) {
      buttons += button_("https://wa.me/" + phone, "Escribir por WhatsApp", "#25D366", "#0B1E38");
    }
  }
  buttons += button_(sheetUrl, "Ver en la hoja", "#E5E9F0", "#0B1E38");

  // Cuerpo en texto plano (clientes sin HTML) y en HTML.
  var plain = title + " (" + stamp + ")\n\n" + fields.map(function (f) { return labels[f] + ": " + values[f]; }).join("\n") +
    "\n\nVer en la hoja: " + sheetUrl;

  // El nombre ya va en el título del correo, no se repite en la tabla.
  var rows = fields.filter(function (f) { return f !== "Nombre"; }).map(function (f) {
    var v = esc_(values[f]).replace(/\n/g, "<br>");
    return '<tr><td style="padding:10px 0;border-bottom:1px solid #E5E9F0;width:34%;vertical-align:top;font-size:12px;' +
      'letter-spacing:.06em;text-transform:uppercase;color:#64748B;">' + esc_(labels[f]) + "</td>" +
      '<td style="padding:10px 0;border-bottom:1px solid #E5E9F0;vertical-align:top;font-size:15px;color:#0B1E38;">' + v + "</td></tr>";
  }).join("");

  var siteUrl = String(PropertiesService.getScriptProperties().getProperty("SITE_URL") || "").replace(/\/+$/, "");
  var logoRow = /^https:\/\//.test(siteUrl)
    ? '<tr><td align="center" style="background:#FFFFFF;padding:16px 24px 8px 24px;">' +
      '<img src="' + esc_(siteUrl) + '/email-logo.png" width="180" alt="Club Voley Zúñiga" style="display:block;border:0;height:auto;max-width:180px;"></td></tr>'
    : "";

  var html =
    '<div style="background:#F4F6FA;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">' + logoRow +
    '<tr><td style="background:#0F284B;padding:20px 24px;border-bottom:4px solid #F29A2E;">' +
    '<div style="color:#F29A2E;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:bold;">Club Voley Zúñiga</div>' +
    '<div style="color:#FFFFFF;font-size:22px;font-weight:bold;margin-top:4px;">' + esc_(title) + "</div></td></tr>" +
    '<tr><td style="padding:24px 24px 8px 24px;">' +
    '<div style="font-size:20px;font-weight:bold;color:#0B1E38;">' + esc_(headline) + "</div>" +
    '<div style="font-size:14px;color:#64748B;margin-top:4px;">' + esc_(subline) + "</div></td></tr>" +
    '<tr><td style="padding:8px 24px 0 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + rows + "</table></td></tr>" +
    '<tr><td style="padding:20px 24px 8px 24px;">' + buttons + "</td></tr>" +
    '<tr><td style="padding:12px 24px 24px 24px;font-size:12px;color:#94A3B8;line-height:1.5;">' +
    "Recibido el " + esc_(stamp) + " (hora de Bogotá). Este aviso se genera automáticamente desde el sitio web " +
    "y contiene datos personales: no lo reenvíes a personas ajenas al club.</td></tr>" +
    "</table></div>";

  var options = { htmlBody: html, name: "Club Voley Zúñiga (sitio web)" };
  if (replyTo) options.replyTo = replyTo;
  // El asunto es texto plano: se quitan saltos de línea por si el nombre los trae.
  MailApp.sendEmail(to, subject.replace(/[\r\n]+/g, " "), plain, options);
}

// ---------- Lectura para la web ----------

function doGet(e) {
  try {
    var p = e.parameter || {};
    if (!secretOk_(p.secret)) return json_({ ok: false, error: "unauthorized" });
    if (READABLE.indexOf(p.sheet) === -1) return json_({ ok: false, error: "sheet_not_allowed" });

    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(p.sheet);
    if (!sh) return json_({ ok: false, error: "sheet_missing" });

    var values = sh.getDataRange().getDisplayValues();
    var headers = values.shift();
    var activoIdx = headers.indexOf("Activo");
    var rows = values
      .filter(function (r) { return r.join("") !== "" && (activoIdx === -1 || String(r[activoIdx]).toUpperCase() !== "NO"); })
      .map(function (r) {
        var o = {};
        headers.forEach(function (h, i) { o[h] = r[i]; });
        return o;
      });
    return json_({ ok: true, rows: rows });
  } catch (err) {
    return json_({ ok: false, error: "server_error" });
  }
}
