/**
 * Club Voley Zúñiga — backend gratuito sobre Google Sheets.
 *
 * Despliegue: Extensiones > Apps Script > pegar este archivo > Implementar >
 * Nueva implementación > Aplicación web
 *   - Ejecutar como: Yo
 *   - Quién tiene acceso: Cualquier usuario
 *
 * Propiedades del script (Configuración del proyecto > Propiedades de la secuencia de comandos):
 *   SHARED_SECRET : cadena larga y aleatoria. La MISMA va en Vercel como SHEETS_SECRET.
 *   NOTIFY_EMAIL  : correo que recibe el aviso de cada inscripción/mensaje (opcional).
 */

var WRITABLE = {
  Inscripciones: ["Nombre", "Edad", "Categoría", "Nivel", "Sede", "Horario", "WhatsApp", "Consentimiento"],
  Contacto: ["Nombre", "Contacto", "Asunto", "Mensaje"]
};
var READABLE = ["Fixture", "Tabla", "Noticias", "Cancha"];
var MAX_LEN = 2000;

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
    var row = [Utilities.formatDate(new Date(), "America/Bogota", "yyyy-MM-dd HH:mm:ss")];
    fields.forEach(function (f) { row.push(clean_(data[f])); });
    row.push("Nuevo"); // Estado

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
      if (!sh) return json_({ ok: false, error: "sheet_missing" });
      sh.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    var notify = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
    if (notify) {
      var lines = fields.map(function (f, i) { return f + ": " + row[i + 1]; }).join("\n");
      MailApp.sendEmail(notify, "[Voley Zúñiga] Nuevo registro en " + name, lines);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server_error" });
  }
}

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
