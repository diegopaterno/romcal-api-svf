/*const express = require('express');
const { Romcal } = require('romcal');

const app = express();
const PORT = process.env.PORT || 3000;

const romcal = new Romcal({
  locale: 'es',
  calendar: 'general-roman',
});

async function getDay(date) {
  return await romcal.getOneLiturgicalDay(date);
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/today', async (_req, res) => {
  try {
    const now = new Date();
    const day = await getDay(now);
    res.json({ date: now.toISOString().slice(0,10), celebrations: day });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/:year/:month/:day', async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const d = new Date(Number(year), Number(month)-1, Number(day));
    if (isNaN(d.getTime())) return res.status(400).json({ error: 'Fecha inválida' });
    const ld = await getDay(d);
    res.json({ date: d.toISOString().slice(0,10), celebrations: ld });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/', (_req, res) => {
  res.type('text').send('Romcal API (ES)\n  GET /today\n  GET /YYYY/MM/DD');
});

app.listen(PORT, () => console.log(`✅ Romcal API en puerto ${PORT}`));*/

/*const express = require('express');
const { Romcal } = require('romcal');

const app = express();
const PORT = process.env.PORT || 3000;

// Config base (podés cambiar locale/calendar si querés)
const romcal = new Romcal({
  locale: 'es',              // español
  calendar: 'general-roman', // calendario general romano
});

// --- Helpers de fecha ---
const ymd = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

// Normaliza cualquier campo de fecha que devuelva romcal a 'YYYY-MM-DD'
const getItemYmd = (item) => {
  // Algunos builds devuelven 'date' como string, otros como Date, o 'isoDate'
  if (item?.date) {
    try { return ymd(item.date); } catch (_) {}
    if (typeof item.date === 'string') return item.date.slice(0,10);
  }
  if (item?.isoDate) return String(item.isoDate).slice(0,10);
  if (item?.moment?.iso) return String(item.moment.iso).slice(0,10);
  return '';
};

// Obtiene las celebraciones del día: genera el calendario anual y filtra por la fecha exacta
async function getCelebrationsForDate(dateObj) {
  const year = dateObj.getFullYear();
  const wanted = ymd(dateObj);
  const calendar = await romcal.generateCalendar({ year }); // array de días/celebraciones

  // Filtramos los que correspondan a la misma fecha
  let hits = calendar.filter((item) => getItemYmd(item) === wanted);

  // Algunas configuraciones devuelven varias celebraciones el mismo día (memorial opcional, etc.)
  // Si por algún motivo no encontró nada exacto, intentamos una comparación más laxa.
  if (!hits.length) {
    hits = calendar.filter((item) => {
      const s = getItemYmd(item);
      return s && s.startsWith(wanted);
    });
  }

  // Estructuramos salida amigable
  return hits.map((c) => ({
    // romcal cambia clave 'name'/'title' según build: cubrimos ambos
    name: c.name || c.title || 'Celebración',
    key: c.key || c.id || undefined,
    rank: c.rank || c.rankName || undefined,
    liturgicalColor: c.liturgicalColor || c.colour || undefined,
    season: c.season || undefined,
    date: getItemYmd(c) || wanted,
    // Mantener el objeto completo por si querés depurar en el futuro
    raw: c,
  }));
}

// --- CORS mínimo ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// --- Rutas ---
app.get('/today', async (_req, res) => {
  try {
    const now = new Date();
    const celebrations = await getCelebrationsForDate(now);
    res.json({ date: ymd(now), celebrations });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/tomorrow', async (_req, res) => {
  try {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const celebrations = await getCelebrationsForDate(d);
    res.json({ date: ymd(d), celebrations });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/:year/:month/:day', async (req, res) => {
  const { year, month, day } = req.params;
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  if (isNaN(d.getTime())) return res.status(400).json({ error: 'Fecha inválida' });
  try {
    const celebrations = await getCelebrationsForDate(d);
    res.json({ date: ymd(d), celebrations });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

// Para inspeccionar el calendario completo del año (útil para depurar)
app.get('/debug/:year', async (req, res) => {
  const year = Number(req.params.year);
  if (!year || isNaN(year)) return res.status(400).json({ error: 'Año inválido' });
  try {
    const calendar = await romcal.generateCalendar({ year });
    res.json(calendar);
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/', (_req, res) => {
  res.type('text').send(
    'Romcal API (ES)\n' +
    '  GET /today\n' +
    '  GET /tomorrow\n' +
    '  GET /YYYY/MM/DD\n' +
    '  GET /debug/YYYY\n'
  );
});

app.listen(PORT, () => console.log(`✅ Romcal API en puerto ${PORT}`));
*/
/*const express = require('express');
const { Romcal } = require('romcal');

const app = express();
const PORT = process.env.PORT || 3000;

// Config base
const romcal = new Romcal({
  locale: 'es',              // español
  calendar: 'general-roman', // calendario general romano
});

// Helpers de fecha
const toYMD = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

// Normaliza cualquier campo de fecha que devuelva romcal a 'YYYY-MM-DD'
const itemYmd = (item) => {
  // romcal v3 puede devolver distintos campos según build:
  if (item?.date) {
    try { return toYMD(item.date); } catch (_) {}
    if (typeof item.date === 'string') return item.date.slice(0,10);
  }
  if (item?.isoDate) return String(item.isoDate).slice(0,10);
  if (item?.moment?.iso) return String(item.moment.iso).slice(0,10);
  return '';
};

// Intenta por helper; si falla, genera por rango y filtra
async function getCelebrationsForDate(dateObj) {
  const wanted = toYMD(dateObj);

  // 1) Intento directo (si tu romcal lo soporta)
  try {
    if (typeof romcal.getOneLiturgicalDay === 'function') {
      const day = await romcal.getOneLiturgicalDay(dateObj);
      // Normalizamos la salida a un array de celebraciones
      const arr = Array.isArray(day) ? day : (day ? [day] : []);
      if (arr.length) {
        return arr.map(c => ({
          name: c.name || c.title || 'Celebración',
          key: c.key || c.id || undefined,
          rank: c.rank || c.rankName || undefined,
          liturgicalColor: c.liturgicalColor || c.colour || undefined,
          season: c.season || undefined,
          date: itemYmd(c) || wanted,
          raw: c,
        }));
      }
    }
  } catch (e) {
    // seguimos al fallback por rango
    // console.warn('getOneLiturgicalDay falló:', e?.message || e);
  }

  // 2) Fallback robusto: generar por rango del año civil [YYYY-01-01 → YYYY-12-31]
  const year = dateObj.getUTCFullYear(); // UTC para evitar desbordes por TZ
  const from = new Date(Date.UTC(year, 0, 1));
  const to   = new Date(Date.UTC(year, 11, 31));

  // Algunas builds aceptan objetos Date en { from, to }, otras requieren strings ISO:
  let calendar;
  try {
    calendar = await romcal.generateCalendar({ from, to });
  } catch (_) {
    // si tu build requiere strings:
    calendar = await romcal.generateCalendar({
      from: from.toISOString().slice(0,10),
      to:   to.toISOString().slice(0,10),
    });
  }

  // Filtramos por la fecha exacta (en UTC, para evitar TZ)
  let hits = calendar.filter((c) => itemYmd(c) === wanted);
  if (!hits.length) {
    // comparador laxo por si la build trae campos con hora
    hits = calendar.filter((c) => itemYmd(c).startsWith(wanted));
  }

  return hits.map(c => ({
    name: c.name || c.title || 'Celebración',
    key: c.key || c.id || undefined,
    rank: c.rank || c.rankName || undefined,
    liturgicalColor: c.liturgicalColor || c.colour || undefined,
    season: c.season || undefined,
    date: itemYmd(c) || wanted,
    raw: c,
  }));
}

// CORS mínimo
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Rutas
app.get('/today', async (_req, res) => {
  try {
    const now = new Date();
    const celebrations = await getCelebrationsForDate(now);
    res.json({ date: toYMD(now), celebrations });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/tomorrow', async (_req, res) => {
  try {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const celebrations = await getCelebrationsForDate(d);
    res.json({ date: toYMD(d), celebrations });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/:year/:month/:day', async (req, res) => {
  try {
    const { year, month, day } = req.params;
    const y = Number(year), m = Number(month), d = Number(day);
    const date = new Date(Date.UTC(y, m - 1, d)); // UTC para evitar TZ
    if (isNaN(date.getTime())) return res.status(400).json({ error: 'Fecha inválida' });
    const celebrations = await getCelebrationsForDate(date);
    res.json({ date: toYMD(date), celebrations });
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

// Debug anual (opcional)
app.get('/debug/:year', async (req, res) => {
  const y = Number(req.params.year);
  if (!y || isNaN(y)) return res.status(400).json({ error: 'Año inválido' });
  try {
    const from = new Date(Date.UTC(y, 0, 1));
    const to   = new Date(Date.UTC(y, 11, 31));
    let cal;
    try {
      cal = await romcal.generateCalendar({ from, to });
    } catch (_) {
      cal = await romcal.generateCalendar({
        from: from.toISOString().slice(0,10),
        to:   to.toISOString().slice(0,10),
      });
    }
    res.json(cal);
  } catch (e) {
    res.status(500).json({ error: 'romcal error', detail: String(e) });
  }
});

app.get('/', (_req, res) => {
  res.type('text').send(
    'Romcal API (ES)\n' +
    '  GET /today\n' +
    '  GET /tomorrow\n' +
    '  GET /YYYY/MM/DD\n' +
    '  GET /debug/YYYY\n'
  );
});

app.listen(PORT, () => console.log(`✅ Romcal API en puerto ${PORT}`));*/
/*
import express from "express";
import cors from "cors";

// ===== Config =====
const app = express();
app.use(cors());
app.use(express.json());

// Valores por defecto (podés cambiarlos)
const DEFAULT_COUNTRY = "argentina";
const DEFAULT_LOCALE = "es";

// Utilidad para validar año YYYY
function parseYear(y) {
  if (!y) return null;
  const n = Number(y);
  return Number.isInteger(n) && String(n).length === 4 ? n : null;
}

// Construye la URL al backend público de Romcal API v2
function romcalUrl({ calendar, locale, year, month, day }) {
  const base = "https://romcal-api.vercel.app/api/v2";
  // Rutas soportadas por la API pública:
  // /calendars
  // /calendars/:calendar
  // /calendars/:calendar/:year
  // /calendars/:calendar/:year/:month/:day
  // /calendars/:calendar/:locale/:year
  // /calendars/:calendar/:locale/:year/:month/:day

  const parts = ["calendars", calendar];

  if (locale) parts.push(locale);
  if (year) parts.push(String(year));
  if (month) parts.push(String(month).padStart(2, "0"));
  if (day) parts.push(String(day).padStart(2, "0"));

  return `${base}/${parts.join("/")}`;
}

// Pequeño fetch con manejo de errores
async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Romcal API ${r.status}: ${txt}`);
  }
  return r.json();
}

// ---------- Endpoints ----------

// Salud
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "romcal-api-svf", date: new Date().toISOString().slice(0, 10) });
});

// Lista de calendarios disponibles (general, argentina, spain, usa, etc.)
app.get("/calendars", async (_req, res) => {
  try {
    const url = "https://romcal-api.vercel.app/api/v2/calendars";
    const data = await fetchJson(url);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "romcal error", detail: String(err.message || err) });
  }
});

// Calendario de un año (por país/“calendar”) — default: argentina/es
// GET /calendar/:year?country=argentina&locale=es
app.get("/calendar/:year", async (req, res) => {
  try {
    const year = parseYear(req.params.year);
    if (!year) return res.status(400).json({ error: "bad_request", detail: "El año debe tener formato YYYY (p.ej., 2025)" });

    const calendar = (req.query.country || DEFAULT_COUNTRY).toString().toLowerCase();
    const locale = (req.query.locale || DEFAULT_LOCALE).toString().toLowerCase();

    const url = romcalUrl({ calendar, locale, year });
    const data = await fetchJson(url);
    res.json({ calendar, locale, year, data });
  } catch (err) {
    res.status(502).json({ error: "romcal error", detail: String(err.message || err) });
  }
});

// Celebraciones de un día concreto
// GET /day/:year/:month/:day?country=argentina&locale=es
app.get("/day/:year/:month/:day", async (req, res) => {
  try {
    const year = parseYear(req.params.year);
    const month = Number(req.params.month);
    const day = Number(req.params.day);

    if (!year) return res.status(400).json({ error: "bad_request", detail: "El año debe ser YYYY" });
    if (!(month >= 1 && month <= 12)) return res.status(400).json({ error: "bad_request", detail: "Mes inválido (1-12)" });
    if (!(day >= 1 && day <= 31)) return res.status(400).json({ error: "bad_request", detail: "Día inválido (1-31)" });

    const calendar = (req.query.country || DEFAULT_COUNTRY).toString().toLowerCase();
    const locale = (req.query.locale || DEFAULT_LOCALE).toString().toLowerCase();

    const url = romcalUrl({ calendar, locale, year, month, day });
    const data = await fetchJson(url);
    res.json({ calendar, locale, date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, data });
  } catch (err) {
    res.status(502).json({ error: "romcal error", detail: String(err.message || err) });
  }
});

// Celebraciones de “hoy” (según el servidor) — conveniente para tu front
// GET /today?country=argentina&locale=es
app.get("/today", async (req, res) => {
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();

    const calendar = (req.query.country || DEFAULT_COUNTRY).toString().toLowerCase();
    const locale = (req.query.locale || DEFAULT_LOCALE).toString().toLowerCase();

    const url = romcalUrl({ calendar, locale, year: y, month: m, day: d });
    const data = await fetchJson(url);

    res.json({ calendar, locale, date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, data });
  } catch (err) {
    res.status(502).json({ error: "romcal error", detail: String(err.message || err) });
  }
});

// ---------- Start ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`romcal-api-svf escuchando en http://localhost:${PORT}`);
});*/
import express from "express";
import cors from "cors";
import { Romcal } from "romcal";

// Plugins de calendarios (los paquetes exportan nombres distintos según país).
// Para robustez, detectamos el primer export usable.
import * as ARG_PKG from "@romcal/calendar.argentina";
import * as GRC_PKG from "@romcal/calendar.general-roman";

// Helper para tomar el export correcto del paquete (@romcal/...)
// Intenta: named export típico, default, o el primer valor exportado.
function pickCalendar(pkg, fallbackNameList = []) {
  for (const name of fallbackNameList) {
    if (pkg?.[name]) return pkg[name];
  }
  if (pkg?.default) return pkg.default;
  const first = Object.values(pkg).find((v) => typeof v === "object" || typeof v === "function");
  if (!first) throw new Error("No se pudo resolver el calendario del paquete");
  return first;
}

// Nombres comunes (pueden variar según versión del plugin)
const ArgentinaCalendar = pickCalendar(ARG_PKG, ["Argentina_Es", "Argentina_EsAr", "Argentina"]);
const GeneralRomanCalendar = pickCalendar(GRC_PKG, ["GeneralRoman_En", "GeneralRoman", "Grc"]);

const DEFAULT_CALENDAR = "argentina";
const DEFAULT_LOCALE = "es";

const CALENDAR_MAP = {
  // agrega más si los instalás (spain, usa, etc.)
  argentina: ArgentinaCalendar,
  general: GeneralRomanCalendar,
};

const app = express();
app.use(cors());
app.use(express.json());

// Utilidades
function parseYear(y) {
  const n = Number(y);
  return Number.isInteger(n) && String(n).length === 4 ? n : null;
}
function resolveCalendar(name) {
  const key = String(name || DEFAULT_CALENDAR).toLowerCase();
  return CALENDAR_MAP[key] || GeneralRomanCalendar;
}

/**
 * Genera Romcal con el calendario y opciones.
 * Nota: en romcal v3 la "locale" viene del plugin de calendario (incluye sus traducciones).
 * Aun así, si instalaste varios plugins/idiomas, podrías alternarlos con resolveCalendar().
 */
function makeRomcal(calendarObj) {
  return new Romcal({
    localizedCalendar: calendarObj,
    // otras opciones útiles:
    // scope: 'gregorian' | 'liturgical',
    // epiphanyOnSunday: true/false,
    // corpusChristiOnSunday: true/false,
    // ascensionOnSunday: true/false,
  });
}

// Salud
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "romcal-api-svf (local)", date: new Date().toISOString().slice(0, 10) });
});

// Listado simple de calendarios instalados
app.get("/calendars", (_req, res) => {
  res.json(Object.keys(CALENDAR_MAP));
});

// Año completo (por defecto: argentina)
app.get("/calendar/:year", async (req, res) => {
  try {
    const year = parseYear(req.params.year);
    if (!year) return res.status(400).json({ error: "El año debe ser YYYY" });

    const calendarName = (req.query.country || DEFAULT_CALENDAR);
    const calendarObj = resolveCalendar(calendarName);

    const romcal = makeRomcal(calendarObj);
    const data = await romcal.generateCalendar(year); // objeto { "2025-01-01": [ ... ], ... }

    res.json({ calendar: String(calendarName).toLowerCase(), year, data });
  } catch (e) {
    res.status(500).json({ error: "romcal_error", detail: String(e?.message || e) });
  }
});

// Un día específico
app.get("/day/:year/:month/:day", async (req, res) => {
  try {
    const year = parseYear(req.params.year);
    const month = Number(req.params.month);
    const day = Number(req.params.day);
    if (!year) return res.status(400).json({ error: "El año debe ser YYYY" });
    if (!(month >= 1 && month <= 12)) return res.status(400).json({ error: "Mes inválido (1-12)" });
    if (!(day >= 1 && day <= 31)) return res.status(400).json({ error: "Día inválido (1-31)" });

    const calendarName = (req.query.country || DEFAULT_CALENDAR);
    const calendarObj = resolveCalendar(calendarName);
    const romcal = makeRomcal(calendarObj);

    // romcal v3 no trae "getByDate", así que generamos el año y filtramos la fecha
    const all = await romcal.generateCalendar(year);
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const celebrations = all[iso] || [];

    res.json({ calendar: String(calendarName).toLowerCase(), date: iso, celebrations });
  } catch (e) {
    res.status(500).json({ error: "romcal_error", detail: String(e?.message || e) });
  }
});

// Hoy
app.get("/today", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const calendarName = (req.query.country || DEFAULT_CALENDAR);
    const calendarObj = resolveCalendar(calendarName);
    const romcal = makeRomcal(calendarObj);

    const all = await romcal.generateCalendar(year);
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const celebrations = all[iso] || [];

    res.json({ calendar: String(calendarName).toLowerCase(), date: iso, celebrations });
  } catch (e) {
    res.status(500).json({ error: "romcal_error", detail: String(e?.message || e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`romcal local escuchando en http://localhost:${PORT}`);
});