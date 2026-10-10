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
 *   SHARED_SECRET : cadena larga y aleatoria. La MISMA va en Vercel como SHEETS_SECRET. Abre todo:
 *                   datos privados (inscripciones de menores), ediciones del panel y formularios.
 *   READ_SECRET   : (recomendada) otra cadena larga y distinta. La MISMA va en Vercel como SHEETS_READ_SECRET.
 *                   Solo sirve para leer las pestañas públicas (partidos, noticias, horarios…), así que si
 *                   alguna vez se filtra no expone datos personales.
 *   NOTIFY_EMAIL  : correo(s) que reciben el aviso de cada inscripción/mensaje (opcional).
 *
 * Panel de administración (/admin): crea, edita y borra filas de Fixture, Tabla, Noticias, Cancha y Horarios,
 * y cambia el Estado de Inscripciones y Contacto. Cada cambio queda en la pestaña "Historial".
 *
 * Automatizaciones (opcional): ejecuta UNA vez la función instalarAutomatizaciones() desde el editor
 * (botón Ejecutar) y acepta los permisos que pida Google. Quedan programados:
 *   - Cada lunes a las 7 a. m.: resumen de la semana a NOTIFY_EMAIL (con inscripciones por canal).
 *   - Cada día a las 8 a. m.: aviso de inscripciones sin responder por más de 24 horas (solo si hay).
 *   - Cada domingo a las 3 a. m.: copia de seguridad de la hoja en la carpeta de Drive
 *     "Copias de seguridad Voley Zúñiga" (se guardan las últimas 8).
 *   SITE_URL      : dirección pública de la web, sin "/" final (p. ej. https://tudominio.com). Se usa para
 *                   mostrar el logo en el correo (opcional; sin ella el correo sale sin logo).
 */

var WRITABLE = {
  Inscripciones: ["Nombre", "Edad", "Categoría", "Nivel", "Sede", "Horario", "WhatsApp", "Consentimiento"],
  Contacto: ["Nombre", "Contacto", "Asunto", "Mensaje"]
};
// Columnas que van después de "Estado" (se agregaron más tarde; así las filas viejas no se desordenan).
var AFTER_STATE = {
  Inscripciones: ["Código"],
  Contacto: []
};
// Columnas que se escriben por su nombre (si la pestaña no la tiene, se crea al final).
// "Origen" = de dónde llegó la familia (Instagram, afiche, Google…), lo calcula la web.
var BY_HEADER = {
  Inscripciones: ["Origen"],
  Contacto: ["Origen"]
};
var READABLE = ["Fixture", "Tabla", "Noticias", "Cancha", "Horarios", "Productos", "Ajustes", "Galería", "Entrenadores", "Testimonios", "Plantel"];
// Solo para el panel de administración (la web las pide desde el servidor con la clave secreta).
var PRIVATE_READABLE = ["Inscripciones", "Contacto", "Historial"];
var PRIVATE_MAX_ROWS = 300;

// Lo que el panel de administración puede cambiar. true = cualquier columna; lista = solo esas columnas.
var ADMIN_EDITABLE = {
  Fixture: { create: true, update: true, remove: true },
  Tabla: { create: true, update: true, remove: true },
  Noticias: { create: true, update: true, remove: true },
  Cancha: { create: true, update: true, remove: true },
  Horarios: { create: true, update: true, remove: true },
  Productos: { create: true, update: true, remove: true },
  Ajustes: { create: true, update: ["Valor"], remove: false },
  Inscripciones: { create: false, update: ["Estado", "Notas"], remove: false },
  Contacto: { create: false, update: ["Estado", "Notas"], remove: false }
};
var HISTORY_SHEET = "Historial";
var HISTORY_HEADERS = ["Fecha", "Usuario", "Acción", "Pestaña", "Detalle"];
var MAX_LEN = 2000;
var ADMIN_MAX_LEN = 10000; // el cuerpo de una noticia puede ser largo
var TZ = "America/Bogota";

// Etiquetas que se muestran en el correo (la hoja conserva los nombres de columna).
var LABELS = {
  Inscripciones: { Nombre: "Deportista", Edad: "Edad", Categoría: "Categoría", Nivel: "Nivel", Sede: "Sede", Horario: "Horario", WhatsApp: "WhatsApp", Consentimiento: "Consentimiento", Código: "Código del pase", Origen: "Llegó desde" },
  Contacto: { Nombre: "Nombre", Contacto: "Contacto", Asunto: "Asunto", Mensaje: "Mensaje", Origen: "Llegó desde" }
};

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// scope "read": lectura de pestañas públicas (vale READ_SECRET o SHARED_SECRET).
// Cualquier otra cosa (datos privados, panel, formularios) exige SHARED_SECRET.
function secretOk_(provided, scope) {
  var props = PropertiesService.getScriptProperties();
  var main = props.getProperty("SHARED_SECRET");
  if (!!main && main.length >= 24 && provided === main) return true;
  if (scope !== "read") return false;
  var read = props.getProperty("READ_SECRET");
  return !!read && read.length >= 24 && provided === read;
}

// Evita inyección de fórmulas (=, +, -, @) al abrir la hoja.
function clean_(value, max) {
  var s = String(value == null ? "" : value).trim().slice(0, max || MAX_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!secretOk_(body.secret, "write")) return json_({ ok: false, error: "unauthorized" });
    // Lecturas privadas por POST: así la clave principal nunca viaja en la dirección.
    if (body.action === "admin.read") return json_(readSheet_(body.sheet, body.all === true || body.all === "1"));
    if (body.action && String(body.action).indexOf("admin.") === 0) return json_(adminAction_(body));

    var name = body.sheet;
    if (!WRITABLE.hasOwnProperty(name)) return json_({ ok: false, error: "sheet_not_allowed" });

    var data = body.data || {};
    var fields = WRITABLE[name];
    var stamp = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm:ss");
    var row = [stamp];
    var after = AFTER_STATE[name] || [];
    fields.forEach(function (f) { row.push(clean_(data[f])); });
    row.push("Nuevo"); // Estado
    after.forEach(function (f) { row.push(clean_(data[f])); });

    var values = {};
    var extra = BY_HEADER[name] || [];
    fields.concat(after, extra).forEach(function (f) { values[f] = unquote_(clean_(data[f])); });

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
      writeByHeader_(sh, rowNumber, BY_HEADER[name] || [], data);
      sheetUrl = ss.getUrl() + "#gid=" + sh.getSheetId() + "&range=A" + rowNumber;
    } finally {
      lock.releaseLock();
    }

    // El aviso por correo nunca debe impedir que la fila quede guardada.
    try {
      notify_(name, fields.concat(after, extra), values, stamp, sheetUrl);
    } catch (mailErr) {
      console.error("No se pudo enviar el aviso: " + mailErr);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server_error" });
  }
}

// Escribe columnas por su nombre en la fila; si la columna no existe, la agrega al final.
function writeByHeader_(sh, rowNumber, names, data) {
  if (!names.length) return;
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0];
  names.forEach(function (f) {
    var v = clean_(data[f], 200);
    if (!v) return;
    var col = headers.indexOf(f) + 1;
    if (!col) {
      col = headers.length + 1;
      sh.getRange(1, col).setValue(f);
      headers.push(f);
    }
    sh.getRange(rowNumber, col).setNumberFormat("@").setValue(v);
  });
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

function notify_(sheetName, fields, values, stamp, sheetUrl) {
  var to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!to) return;

  var labels = LABELS[sheetName];
  // Sin código u origen (inscripciones antiguas) no se muestra esa fila.
  fields = fields.filter(function (f) { return (f !== "Código" && f !== "Origen") || values[f]; });

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
        (values["Código"] ? " (código " + values["Código"] + ")" : "") +
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

// ---------- Panel de administración: crear, editar y borrar ----------

// Escribe los valores como texto plano para que Sheets no convierta fechas, horas ni números.
function writeRow_(sh, rowNum, headers, values) {
  var range = sh.getRange(rowNum, 1, 1, headers.length);
  range.setNumberFormat("@");
  range.setValues([values]);
}

function historySheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(HISTORY_SHEET);
  if (!sh) {
    sh = ss.insertSheet(HISTORY_SHEET);
    sh.appendRow(HISTORY_HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function log_(actor, action, sheet, detail) {
  try {
    historySheet_().appendRow([Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm:ss"), clean_(actor), action, sheet, clean_(String(detail).slice(0, 500))]);
  } catch (err) {
    console.error("Historial: " + err);
  }
}

function describe_(obj) {
  return Object.keys(obj || {}).filter(function (k) { return k !== "_row" && obj[k] !== ""; }).slice(0, 6).map(function (k) { return k + ": " + obj[k]; }).join(" · ");
}

function adminAction_(body) {
  var action = String(body.action).replace("admin.", "");
  var name = body.sheet;
  var perms = ADMIN_EDITABLE[name];
  var actor = String(body.actor || "Panel").replace(/[\r\n]+/g, " ").slice(0, 60);
  if (!perms) return { ok: false, error: "sheet_not_allowed" };
  if (["create", "update", "remove"].indexOf(action) === -1) return { ok: false, error: "bad_action" };
  if (!perms[action]) return { ok: false, error: "action_not_allowed" };

  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    if (!sh) return { ok: false, error: "sheet_missing" };
    var lastCol = sh.getLastColumn();
    var headers = sh.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
    var data = body.data || {};

    if (action === "create") {
      var row = headers.map(function (h) { return data.hasOwnProperty(h) ? clean_(data[h], ADMIN_MAX_LEN) : ""; });
      var newRow = sh.getLastRow() + 1;
      writeRow_(sh, newRow, headers, row);
      log_(actor, "Creó", name, describe_(data));
      return { ok: true, row: newRow };
    }

    var rowNum = Number(body.row);
    if (!(rowNum >= 2 && rowNum <= sh.getLastRow() && Math.floor(rowNum) === rowNum)) return { ok: false, error: "bad_row" };
    var current = sh.getRange(rowNum, 1, 1, headers.length).getDisplayValues()[0];

    // Control de conflictos: la fila debe seguir igual a como la vio quien la edita.
    var expected = body.expected || {};
    for (var key in expected) {
      if (key === "_row" || !expected.hasOwnProperty(key)) continue;
      var idx = headers.indexOf(key);
      if (idx !== -1 && String(current[idx]) !== String(expected[key])) return { ok: false, error: "conflict" };
    }

    if (action === "remove") {
      sh.deleteRow(rowNum);
      var before = {};
      headers.forEach(function (h, i) { before[h] = current[i]; });
      log_(actor, "Borró", name, describe_(before));
      return { ok: true };
    }

    // update
    var allowed = perms.update === true ? headers : perms.update;
    var next = current.slice();
    var changes = [];
    Object.keys(data).forEach(function (k) {
      var i = headers.indexOf(k);
      if (i === -1 || allowed.indexOf(k) === -1) return;
      var v = clean_(data[k], ADMIN_MAX_LEN);
      if (String(next[i]) !== String(v)) {
        changes.push(k + ": " + (current[i] || "—") + " → " + (v || "—"));
        next[i] = v;
      }
    });
    if (!changes.length) return { ok: true, unchanged: true };
    writeRow_(sh, rowNum, headers, next);
    log_(actor, "Editó", name, changes.join(" · "));
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// ---------- Lectura para la web ----------

function doGet(e) {
  try {
    var p = e.parameter || {};
    var isPrivate = PRIVATE_READABLE.indexOf(p.sheet) !== -1;
    // El panel (all=1) y las pestañas privadas exigen la clave principal.
    if (!secretOk_(p.secret, isPrivate || p.all === "1" ? "admin" : "read")) return json_({ ok: false, error: "unauthorized" });
    return json_(readSheet_(p.sheet, p.all === "1"));
  } catch (err) {
    return json_({ ok: false, error: "server_error" });
  }
}

// all = el panel pide todas las filas (también las inactivas) con su número de fila.
function readSheet_(name, all) {
  var isPrivate = PRIVATE_READABLE.indexOf(name) !== -1;
  if (READABLE.indexOf(name) === -1 && !isPrivate) return { ok: false, error: "sheet_not_allowed" };

  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) return { ok: false, error: "sheet_missing" };

  var values = sh.getDataRange().getDisplayValues();
  var headers = values.shift();
  var activoIdx = headers.indexOf("Activo");
  var rows = values
    .map(function (r, i) {
      var o = {};
      headers.forEach(function (h, j) { o[h] = r[j]; });
      if (all) o._row = String(i + 2);
      return { o: o, r: r };
    })
    .filter(function (x) { return x.r.join("") !== "" && (all || activoIdx === -1 || String(x.r[activoIdx]).toUpperCase() !== "NO"); })
    .map(function (x) { return x.o; });
  // Para el panel: solo las filas más recientes.
  if (isPrivate) rows = rows.slice(-PRIVATE_MAX_ROWS);
  return all ? { ok: true, headers: headers, rows: rows } : { ok: true, rows: rows };
}

// ---------- Resumen semanal ----------

// Ejecútala UNA vez desde el editor: programa el resumen semanal, el aviso diario y la copia de seguridad.
function instalarAutomatizaciones() {
  var handlers = ["resumenSemanal", "recordatorioPendientes", "copiaDeSeguridad"];
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (handlers.indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("resumenSemanal").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).inTimezone(TZ).create();
  ScriptApp.newTrigger("recordatorioPendientes").timeBased().everyDays(1).atHour(8).inTimezone(TZ).create();
  ScriptApp.newTrigger("copiaDeSeguridad").timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(3).inTimezone(TZ).create();
  copiaDeSeguridad(); // primera copia ahora mismo
  resumenSemanal(); // y un resumen de prueba
}

// Versión anterior: solo el resumen de los lunes. Se mantiene por si ya estaba instalada.
function instalarResumenSemanal() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "resumenSemanal") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("resumenSemanal").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).inTimezone(TZ).create();
  resumenSemanal(); // envía uno de prueba ahora mismo
}

function rowsOf_(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) return [];
  var values = sh.getDataRange().getDisplayValues();
  var headers = values.shift();
  return values.filter(function (r) { return r.join("") !== ""; }).map(function (r) {
    var o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
}

function resumenSemanal() {
  var to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!to) return;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var now = new Date();
  var since = Utilities.formatDate(new Date(now.getTime() - 7 * 86400000), TZ, "yyyy-MM-dd");
  var today = Utilities.formatDate(now, TZ, "yyyy-MM-dd");
  var in7 = Utilities.formatDate(new Date(now.getTime() + 7 * 86400000), TZ, "yyyy-MM-dd");

  var regs = rowsOf_("Inscripciones").filter(function (r) { return String(r["Fecha"]).slice(0, 10) >= since; });
  var pending = rowsOf_("Inscripciones").filter(function (r) { return String(r["Estado"]).toLowerCase() === "nuevo"; });
  // Canal = primera parte de la columna Origen ("instagram / bio · entrada: /" → "instagram").
  var channels = {};
  regs.forEach(function (r) {
    var c = String(r["Origen"] || "").split(/[\/·]/)[0].trim() || "sin dato";
    channels[c] = (channels[c] || 0) + 1;
  });
  var channelList = Object.keys(channels).sort(function (a, b) { return channels[b] - channels[a]; });
  var msgs = rowsOf_("Contacto").filter(function (r) { return String(r["Fecha"]).slice(0, 10) >= since; });
  var matches = rowsOf_("Fixture").filter(function (r) {
    var d = String(r["Fecha"]);
    return String(r["Activo"]).toUpperCase() !== "NO" && d >= today && d <= in7;
  });

  var li = function (items, fn) {
    return items.length ? "<ul style=\"padding-left:18px;margin:8px 0;\">" + items.map(function (x) { return "<li style=\"margin:4px 0;\">" + fn(x) + "</li>"; }).join("") + "</ul>" : "<p style=\"color:#64748B;margin:8px 0;\">Nada esta semana.</p>";
  };
  var block = function (title, count, body) {
    return '<tr><td style="padding:16px 24px;border-bottom:1px solid #E5E9F0;"><div style="font-size:13px;color:#64748B;text-transform:uppercase;letter-spacing:.06em;">' + esc_(title) + '</div><div style="font-size:28px;font-weight:bold;color:#0B1E38;">' + count + "</div>" + body + "</td></tr>";
  };

  var html =
    '<div style="background:#F4F6FA;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">' +
    '<tr><td style="background:#0F284B;padding:20px 24px;border-bottom:4px solid #F29A2E;"><div style="color:#F29A2E;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:bold;">Club Voley Zúñiga</div>' +
    '<div style="color:#FFFFFF;font-size:22px;font-weight:bold;margin-top:4px;">Resumen de la semana</div></td></tr>' +
    block("Inscripciones nuevas (7 días)", regs.length, li(regs, function (r) { return esc_(r["Nombre"]) + " · " + esc_(r["Categoría"]) + " · " + esc_(r["WhatsApp"]); })) +
    block("¿Por dónde llegaron? (7 días)", channelList.length, li(channelList, function (c) { return esc_(c) + ": " + channels[c]; })) +
    block("Inscripciones sin atender", pending.length, pending.length ? '<p style="color:#64748B;margin:8px 0;">Cambia el Estado a "Contactado" cuando les escribas.</p>' : "") +
    block("Mensajes de contacto (7 días)", msgs.length, li(msgs, function (r) { return esc_(r["Nombre"]) + " · " + esc_(r["Asunto"]); })) +
    block("Partidos de los próximos 7 días", matches.length, li(matches, function (r) { return esc_(r["Fecha"]) + " " + esc_(r["Hora"]) + " · " + esc_(r["Local"]) + " vs " + esc_(r["Visitante"]) + " (" + esc_(r["Categoría"]) + ")"; })) +
    '<tr><td style="padding:20px 24px;">' + button_(ss.getUrl(), "Abrir la hoja del club", "#F29A2E", "#0B1E38") + "</td></tr>" +
    "</table></div>";

  var plain = "Resumen semanal\nInscripciones nuevas: " + regs.length + "\nPor canal: " + channelList.map(function (c) { return c + " " + channels[c]; }).join(", ") + "\nSin atender: " + pending.length + "\nMensajes: " + msgs.length + "\nPartidos próximos: " + matches.length + "\n" + ss.getUrl();
  MailApp.sendEmail(to, "[Voley Zúñiga] Resumen de la semana: " + regs.length + " inscripciones nuevas", plain, { htmlBody: html, name: "Club Voley Zúñiga (sitio web)" });
}

// ---------- Aviso diario de inscripciones sin responder ----------

// Inscripciones en estado "Nuevo" con más de 24 horas. Si no hay ninguna, no envía nada.
function recordatorioPendientes() {
  var to = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL");
  if (!to) return;
  var limit = Utilities.formatDate(new Date(Date.now() - 24 * 3600000), TZ, "yyyy-MM-dd HH:mm:ss");
  var late = rowsOf_("Inscripciones").filter(function (r) {
    return String(r["Estado"]).toLowerCase() === "nuevo" && String(r["Fecha"]) <= limit;
  });
  if (!late.length) return;

  var items = late.slice(0, 25).map(function (r) {
    var wa = whatsappNumber_(r["WhatsApp"]);
    var greeting = "Hola, te escribimos del Club Voley Zúñiga sobre la inscripción de " + r["Nombre"] +
      (r["Código"] ? " (código " + r["Código"] + ")" : "") + ". ¿Cuándo podemos agendar la clase de prueba?";
    return '<tr><td style="padding:12px 0;border-bottom:1px solid #E5E9F0;">' +
      '<div style="font-size:16px;font-weight:bold;color:#0B1E38;">' + esc_(r["Nombre"]) + "</div>" +
      '<div style="font-size:13px;color:#64748B;margin:2px 0 8px;">' + esc_(r["Categoría"]) + " · inscrito el " + esc_(String(r["Fecha"]).slice(0, 16)) + "</div>" +
      (wa ? button_("https://wa.me/" + wa + "?text=" + encodeURIComponent(greeting), "Escribir por WhatsApp", "#25D366", "#0B1E38") : esc_(r["WhatsApp"])) +
      "</td></tr>";
  }).join("");

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var html =
    '<div style="background:#F4F6FA;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;">' +
    '<tr><td style="background:#0F284B;padding:20px 24px;border-bottom:4px solid #F29A2E;"><div style="color:#F29A2E;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:bold;">Club Voley Zúñiga</div>' +
    '<div style="color:#FFFFFF;font-size:22px;font-weight:bold;margin-top:4px;">' + late.length + (late.length === 1 ? " familia espera" : " familias esperan") + " respuesta</div></td></tr>" +
    '<tr><td style="padding:16px 24px 0 24px;font-size:14px;color:#64748B;">Se inscribieron hace más de 24 horas y siguen en estado "Nuevo". Responder rápido es lo que más convierte una inscripción en un jugador. Cuando les escribas, cambia el Estado a "Contactado".</td></tr>' +
    '<tr><td style="padding:8px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + items + "</table></td></tr>" +
    '<tr><td style="padding:16px 24px 24px;">' + button_(ss.getUrl(), "Abrir la hoja del club", "#F29A2E", "#0B1E38") + "</td></tr>" +
    "</table></div>";
  var plain = late.length + " inscripciones sin responder (más de 24 h):\n" +
    late.map(function (r) { return "- " + r["Nombre"] + " · " + r["Categoría"] + " · " + r["WhatsApp"]; }).join("\n") + "\n" + ss.getUrl();
  MailApp.sendEmail(to, "[Voley Zúñiga] " + late.length + " inscripciones sin responder", plain, { htmlBody: html, name: "Club Voley Zúñiga (sitio web)" });
}

// ---------- Copia de seguridad semanal ----------

var BACKUP_FOLDER = "Copias de seguridad Voley Zúñiga";
var BACKUP_KEEP = 8;

// Copia la hoja completa en una carpeta de Drive y borra las copias más viejas (se conservan 8).
function copiaDeSeguridad() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var folders = DriveApp.getFoldersByName(BACKUP_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(BACKUP_FOLDER);
  var stamp = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
  DriveApp.getFileById(ss.getId()).makeCopy(ss.getName() + " · copia " + stamp, folder);

  var copies = [];
  var files = folder.getFiles();
  while (files.hasNext()) copies.push(files.next());
  copies.sort(function (a, b) { return b.getDateCreated().getTime() - a.getDateCreated().getTime(); });
  copies.slice(BACKUP_KEEP).forEach(function (f) { f.setTrashed(true); });
}
