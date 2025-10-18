import express from "express";
import cors from "cors";
import { Romcal } from "romcal";

// Plugins de calendarios (los paquetes exportan nombres distintos según país).
// Para robustez, detectamos el primer export usable.
import * as ARG_PKG from "@romcal/calendar.argentina";
import * as GRC_PKG from "@romcal/calendar.general-roman";

/* =========================
   1) DICCIONARIO EN ESPAÑOL
   ========================= */
const ES_NAME_MAP = {
  ignatius_of_antioch_bishop: "San Ignacio de Antioquía, obispo y mártir",
  mary_mother_of_god: "Santa María, Madre de Dios",
  baptism_of_the_lord: "Bautismo del Señor",
  zepherin_namuncura: "Beato Ceferino Namuncurá",
  our_lady_of_guadalupe: "Nuestra Señora de Guadalupe",
  lucy_of_syracuse_virgin: "Santa Lucía, virgen y mártir",
  anthony_of_egypt_abbot: "San Antonio Abad",
  andrew_kim_tae_gon_priest_paul_chong_ha_sang_and_companions_martyrs: "San Andrés Kim Tae-gon, presbítero, San Pablo Chong Ha-sang y compañeros, mártires",
  sharbel_makhluf_priest: "San Charbel Makhluf, presbítero",
  margaret_mary_alacoque_virgin: "Santa Margarita María de Alacoque, virgen",
  john_leonardi_priest: "San Juan Leonardi, presbítero",
  luke_evangelist: "San Lucas, evangelista",
  charles_lwanga_and_companions_martyrs: "San Carlos Lwanga y compañeros, mártires",
  raymond_of_penyafort_priest: "San Raimundo de Peñafort, presbítero",
  basil_the_great_and_gregory_nazianzen_bishops: "San Basilio Magno y San Gregorio Nacianceno, obispos y doctores de la Iglesia",
  most_holy_name_of_jesus: "Santísimo Nombre de Jesús",
  fabian_i_pope: "San Fabián, papa y mártir",
  sebastian_of_milan_martyr: "San Sebastián, mártir",
  agnes_of_rome_virgin: "Santa Inés, virgen y mártir",
  vincent_of_saragossa_deacon: "San Vicente, diácono y mártir",
  hilary_of_poitiers_bishop: "San Hilario de Poitiers, obispo y doctor de la Iglesia",
  anthony_of_egypt_abbot: "San Antonio Abad",
  martha_mary_and_lazarus: "Santa Marta, María y Lázaro",
  transfiguration_of_the_lord: "Transfiguración del Señor",
  assumption_of_mary: "Asunción de la Santísima Virgen María",
  all_saints: "Todos los Santos",
  christ_the_king: "Cristo Rey del Universo",
  immaculate_conception_of_mary: "Inmaculada Concepción de la Santísima Virgen María",
  mary_mother_of_god: "Santa María, Madre de Dios",
  baptism_of_the_lord: "Bautismo del Señor",
  zepherin_namuncura: "Beato Ceferino Namuncurá",
  our_lady_of_guadalupe: "Nuestra Señora de Guadalupe",
  lucy_of_syracuse_virgin: "Santa Lucía, virgen y mártir",
  anthony_of_egypt_abbot: "San Antonio Abad",
  andrew_kim_tae_gon_priest_paul_chong_ha_sang_and_companions_martyrs: "San Andrés Kim Tae-gon, presbítero, San Pablo Chong Ha-sang y compañeros, mártires",
  sharbel_makhluf_priest: "San Charbel Makhluf, presbítero",
  margaret_mary_alacoque_virgin: "Santa Margarita María de Alacoque, virgen",
  john_leonardi_priest: "San Juan Leonardi, presbítero",
  luke_evangelist: "San Lucas, evangelista",
  charles_lwanga_and_companions_martyrs: "San Carlos Lwanga y compañeros, mártires",
  raymond_of_penyafort_priest: "San Raimundo de Peñafort, presbítero",
  basil_the_great_and_gregory_nazianzen_bishops: "San Basilio Magno y San Gregorio Nacianceno, obispos y doctores de la Iglesia",
  most_holy_name_of_jesus: "Santísimo Nombre de Jesús",
  fabian_i_pope: "San Fabián, papa y mártir",
  sebastian_of_milan_martyr: "San Sebastián, mártir",
  agnes_of_rome_virgin: "Santa Inés, virgen y mártir",
  vincent_of_saragossa_deacon: "San Vicente, diácono y mártir",
  hilary_of_poitiers_bishop: "San Hilario de Poitiers, obispo y doctor de la Iglesia",
  anthony_of_egypt_abbot: "San Antonio Abad",
  martha_mary_and_lazarus: "Santa Marta, María y Lázaro",
  transfiguration_of_the_lord: "Transfiguración del Señor",
  assumption_of_mary: "Asunción de la Santísima Virgen María",
  all_saints: "Todos los Santos",
  christ_the_king: "Cristo Rey del Universo",
  immaculate_conception_of_mary: "Inmaculada Concepción de la Santísima Virgen María",
  agatha_of_sicily_virgin: "Santa Águeda, virgen y mártir",
  agnes_of_rome_virgin: "Santa Inés, virgen y mártir",
  albert_the_great_bishop: "Albert Great obispo",
  all_saints: "All Saints",
  aloysius_gonzaga_religious: "Aloysius Gonzaga Religious",
  alphonsus_mary_liguori_bishop: "Alphonsus María Liguori obispo",
  andrew_dung_lac_priest_and_companions_martyrs: "Andrew Dung Lac presbítero And compañeros mártires",
  andrew_kim_tae_gon_priest_paul_chong_ha_sang_and_companions_martyrs: "San Andrés Kim Tae-gon, presbítero, San Pablo Chong Ha-sang y compañeros, mártires",
  angela_merici_virgin: "Santa Angela Merici virgen, virgen",
  annunciation_of_the_lord: "Anunciación del Señor",
  ansgar_of_hamburg_bishop: "Ansgar de Hamburg obispo",
  anthony_mary_claret_bishop: "Anthony María Claret obispo",
  anthony_of_egypt_abbot: "San Antonio Abad",
  anthony_of_padua_priest: "Anthony de Padua presbítero",
  anthony_zaccaria_priest: "Anthony Zaccaria presbítero",
  ascension_of_the_lord: "Ascensión del Señor",
  ash_wednesday: "Ash Wednesday",
  assumption_of_the_blessed_virgin_mary: "Assumption de Blessed virgen María",
  athanasius_of_alexandria_bishop: "San Atanasio, obispo y doctor de la Iglesia",
  augustine_of_canterbury_bishop: "Augustine de Canterbury obispo",
  augustine_of_hippo_bishop: "San Agustín, obispo y doctor de la Iglesia",
  augustine_zhao_rong_priest_and_companions_martyrs: "Augustine Zhao Rong presbítero And compañeros mártires",
  baptism_of_the_lord: "Bautismo del Señor",
  barnabas_apostle: "Barnabas Apostle",
  basil_the_great_and_gregory_nazianzen_bishops: "San Basilio Magno y San Gregorio Nacianceno, obispos y doctores de la Iglesia",
  benedict_of_jesus_valdivielso_saez_religious: "Benedict de Jesús Valdivielso Saez Religious",
  benedict_of_nursia_abbot: "Benedict de Nursia Abbot",
  bernard_of_clairvaux_abbot: "Bernard de Clairvaux Abbot",
  bernardine_of_siena_priest: "Bernardine de Siena presbítero",
  blaise_of_sebaste_bishop: "Blaise de Sebaste obispo",
  bonaventure_of_bagnoregio_bishop: "Bonaventure de Bagnoregio obispo",
  boniface_of_mainz_bishop: "Boniface de Mainz obispo",
  bridget_of_sweden_religious: "Bridget de Sweden Religious",
  bruno_of_cologne_priest: "Bruno de Cologne presbítero",
  cajetan_of_thiene_priest: "Cajetan de Thiene presbítero",
  callistus_i_pope: "Callistus I papa",
  camillus_de_lellis_priest: "Camillus De Lellis presbítero",
  casimir_of_poland: "Casimir de Poland",
  catherine_of_alexandria_virgin: "Santa Catherine de Alexandria virgen, virgen",
  catherine_of_siena_virgin: "Santa Catalina de Siena, virgen y doctora",
  cecilia_of_rome_virgin: "Santa Cecilia de Rome virgen, virgen",
  chair_of_saint_peter_the_apostle: "Chair de San Peter Apostle",
  charles_borromeo_bishop: "Charles Borromeo obispo",
  charles_lwanga_and_companions_martyrs: "San Carlos Lwanga y compañeros, mártires",
  christopher_magallanes_priest_and_companions_martyrs: "Christopher Magallanes presbítero And compañeros mártires",
  clare_of_assisi_virgin: "Santa Clara de Asís, virgen",
  commemoration_of_all_the_faithful_departed: "Commemoration de All Faithful Departed",
  conversion_of_saint_paul_the_apostle: "Conversion de San Paul Apostle",
  cornelius_i_pope_and_cyprian_of_carthage_bishop_martyrs: "Cornelius I papa And Cyprian de Carthage obispo mártires",
  cosmas_of_cilicia_and_damian_of_cilicia_martyrs: "Cosmas de Cilicia And Damian de Cilicia mártires",
  cyril_constantine_the_philosopher_monk_and_methodius_michael_of_thessaloniki_bishop: "Cyril Constantine Philosopher Monk And Methodius Michael de Thessaloniki obispo",
  cyril_of_jerusalem_bishop: "Cyril de Jerusalem obispo",
  damasus_i_pope: "Damasus I papa",
  dedication_of_the_basilica_of_saint_mary_major: "Dedication de Basilica de San María Major",
  denis_of_paris_bishop_and_companions_martyrs: "Denis de Paris obispo And compañeros mártires",
  divine_mercy_sunday: "Divine Mercy Sunday",
  dominic_de_guzman_priest: "Dominic De Guzman presbítero",
  easter_sunday: "Easter Sunday",
  elizabeth_of_hungary_religious: "Elizabeth de Hungary Religious",
  elizabeth_of_portugal: "Elizabeth de Portugal",
  epiphany_of_the_lord: "Epifanía del Señor",
  eusebius_of_vercelli_bishop: "Eusebius de Vercelli obispo",
  exaltation_of_the_holy_cross: "Exaltation de Santo Cross",
  fabian_i_pope: "San Fabián, papa y mártir",
  first_martyrs_of_the_holy_roman_church: "First mártires de Santo Roman Church",
  francis_de_sales_bishop: "Francis De Sales obispo",
  francis_of_assisi: "San Francisco de Asís",
  francis_of_paola_hermit: "Francis de Paola Hermit",
  francis_solanus_priest: "Francis Solanus presbítero",
  francis_xavier_priest: "Francis Xavier presbítero",
  friday_of_the_passion_of_the_lord: "Friday de Passion de Señor",
  gregory_i_the_great_pope: "Gregory I Great papa",
  gregory_of_narek_abbot: "Gregory de Narek Abbot",
  hedwig_of_silesia_religious: "Hedwig de Silesia Religious",
  hilary_of_poitiers_bishop: "San Hilario de Poitiers, obispo y doctor de la Iglesia",
  hildegard_of_bingen_abbess: "Hildegard de Bingen Abbess",
  holy_family_of_jesus_mary_and_joseph: "Sagrada Familia de Jesús, María y José",
  holy_guardian_angels: "Santo Guardian Angels",
  holy_saturday: "Sábado Santo",
  ignatius_of_antioch_bishop: "Ignatius de Antioch obispo",
  ignatius_of_loyola_priest: "Ignatius de Loyola presbítero",
  immaculate_conception_of_the_blessed_virgin_mary: "Inmaculada Concepción de Blessed virgen María",
  immaculate_heart_of_mary: "Inmaculado Corazón de María",
  irenaeus_of_lyon_bishop: "Irenaeus de Lyon obispo",
  isidore_of_seville_bishop: "Isidore de Seville obispo",
  isidore_the_farmer: "Isidore Farmer",
  james_apostle: "Santiago, apóstol",
  jane_frances_de_chantal_religious: "Jane Frances De Chantal Religious",
  januarius_i_of_benevento_bishop: "Januarius I de Benevento obispo",
  jerome_emiliani: "Jerome Emiliani",
  jerome_of_stridon_priest: "Jerome de Stridon presbítero",
  joachim_and_anne_parents_of_mary: "Joachim And Anne Parents de María",
  john_apostle: "John Apostle",
  john_baptist_de_la_salle_priest: "John Baptist De La Salle presbítero",
  john_bosco_priest: "John Bosco presbítero",
  john_chrysostom_bishop: "San Juan Crisóstomo, obispo y doctor de la Iglesia",
  john_damascene_priest: "John Damascene presbítero",
  john_eudes_priest: "John Eudes presbítero",
  john_leonardi_priest: "San Juan Leonardi, presbítero",
  john_mary_vianney_priest: "John María Vianney presbítero",
  john_of_avila_priest: "John de Avila presbítero",
  john_of_capistrano_priest: "John de Capistrano presbítero",
  john_of_god_duarte_cidade_religious: "John de God Duarte Cidade Religious",
  john_of_kanty_priest: "John de Kanty presbítero",
  john_paul_ii_pope: "San Juan Pablo II, papa",
  john_xxiii_pope: "San Juan XXIII, papa",
  josaphat_kuntsevych_bishop: "Josaphat Kuntsevych obispo",
  joseph_of_calasanz_priest: "Joseph de Calasanz presbítero",
  joseph_spouse_of_mary: "Joseph Spouse de María",
  joseph_the_worker: "Joseph Worker",
  josephine_bakhita_virgin: "Santa Josefina Bakhita, virgen",
  juan_diego_cuauhtlatoatzin: "Juan Diego Cuauhtlatoatzin",
  laura_vicuna_virgin: "Santa Laura Vicuna virgen, virgen",
  lawrence_of_brindisi_priest: "Lawrence de Brindisi presbítero",
  leo_i_the_great_pope: "Leo I Great papa",
  louis_grignion_de_montfort_priest: "Louis Grignion De Montfort presbítero",
  louis_ix_of_france: "Louis Ix de France",
  lucy_of_syracuse_virgin: "Santa Lucía, virgen y mártir",
  luigi_orione_priest: "Luigi Orione presbítero",
  luke_evangelist: "San Lucas, evangelista",
  marcellinus_of_rome_and_peter_the_exorcist_martyrs: "Marcellinus de Rome And Peter Exorcist mártires",
  margaret_mary_alacoque_virgin: "Santa Margarita María de Alacoque, virgen",
  martha_of_bethany_mary_of_bethany_and_lazarus_of_bethany: "Martha de Bethany María de Bethany And Lazarus de Bethany",
  martin_de_porres_religious: "Martin De Porres Religious",
  martin_of_tours_bishop: "San Martín de Tours, obispo",
  mary_magdalene: "María Magdalene",
  mary_mother_of_god: "Santa María, Madre de Dios",
  mary_mother_of_the_church: "María Mother de Church",
  matthias_apostle: "Matthias Apostle",
  maximilian_mary_raymund_kolbe_priest: "Maximilian María Raymund Kolbe presbítero",
  michael_gabriel_and_raphael_archangels: "Michael Gabriel And Raphael Archangels",
  monica_of_hippo: "Monica de Hippo",
  most_holy_body_and_blood_of_christ: "Santísimo Santo Body And Blood de Christ",
  most_holy_name_of_jesus: "Santísimo Nombre de Jesús",
  most_holy_name_of_mary: "Santísimo Santo Nombre de María",
  most_holy_trinity: "Santísimo Santo Trinity",
  most_sacred_heart_of_jesus: "Santísimo Sagrado Corazón de Jesús",
  nativity_of_john_the_baptist: "Nativity de John Baptist",
  nativity_of_the_blessed_virgin_mary: "Nativity de Blessed virgen María",
  nativity_of_the_lord: "Natividad del Señor (Navidad)",
  nereus_of_terracina_and_achilleus_of_terracina_martyrs: "Nereus de Terracina And Achilleus de Terracina mártires",
  nicholas_of_myra_bishop: "San Nicolás, obispo",
  norbert_of_xanten_bishop: "Norbert de Xanten obispo",
  our_lady_of_fatima: "Our Lady de Fatima",
  our_lady_of_guadalupe_patroness_of_the_americas: "Our Lady de Guadalupe Patroness de Americas",
  our_lady_of_itati: "Our Lady de Itati",
  our_lady_of_loreto: "Our Lady de Loreto",
  our_lady_of_lourdes: "Our Lady de Lourdes",
  our_lady_of_lujan_patroness_of_argentina: "Nuestra Señora de Luján, patrona de la Argentina",
  our_lady_of_mercy: "Our Lady de Mercy",
  our_lady_of_mount_carmel: "Our Lady de Mount Carmel",
  our_lady_of_sorrows: "Our Lady de Sorrows",
  our_lady_of_the_rosary: "Nuestra Señora del Rosario",
  our_lord_jesus_christ_king_of_the_universe: "Our Señor Jesús Christ Rey de Universe",
  palm_sunday_of_the_passion_of_the_lord: "Domingo de Ramos en la Pasión del Señor",
  pancras_of_rome_martyr: "Pancras de Rome mártir",
  passion_of_saint_john_the_baptist: "Passion de San John Baptist",
  patrick_of_ireland_bishop: "San Patricio, obispo",
  paul_miki_and_companions_martyrs: "Paul Miki And compañeros mártires",
  pentecost_sunday: "Domingo de Pentecostés",
  perpetua_of_carthage_and_felicity_of_carthage_martyrs: "Perpetua de Carthage And Felicity de Carthage mártires",
  peter_and_paul_apostles: "San Pedro y San Pablo, apóstoles",
  peter_chanel_priest: "Peter Chanel presbítero",
  peter_chrysologus_bishop: "Peter Chrysologus obispo",
  peter_claver_priest: "Peter Claver presbítero",
  peter_damian_bishop: "Peter Damian obispo",
  peter_julian_eymard_priest: "Peter Julian Eymard presbítero",
  philip_and_james_apostles: "Santos Felipe y Santiago, apóstoles",
  philip_neri_priest: "Philip Neri presbítero",
  pius_francesco_forgione_priest: "Pius Francesco Forgione presbítero",
  pius_v_pope: "Pius V papa",
  pius_x_pope: "San Pío X, papa",
  pontian_i_pope_and_hippolytus_of_rome_priest: "Pontian I papa And Hippolytus de Rome presbítero",
  presentation_of_the_blessed_virgin_mary: "Presentation de Blessed virgen María",
  presentation_of_the_lord: "Presentación del Señor",
  queenship_of_the_blessed_virgin_mary: "Reina de Blessed virgen María",
  raymond_of_penyafort_priest: "San Raimundo de Peñafort, presbítero",
  rita_of_cascia_religious: "Rita de Cascia Religious",
  robert_bellarmine_bishop: "Robert Bellarmine obispo",
  roch_gonzalez_alphonsus_rodriguez_and_john_del_castillo_priests: "Roch Gonzalez Alphonsus Rodriguez And John Del Castillo Priests",
  roch_of_montpellier: "Roch de Montpellier",
  rose_of_lima_virgin: "Santa Rose de Lima virgen, virgen",
  scholastica_of_nursia_virgin: "Santa Scholastica de Nursia virgen, virgen",
  sebastian_of_milan_martyr: "San Sebastián, mártir",
  seven_holy_founders_of_the_servite_order: "Seven Santo Founders de Servite Order",
  sharbel_makhluf_priest: "Sharbel Makhluf presbítero",
  simon_and_jude_apostles: "Santos Simón y Judas, apóstoles",
  sixtus_ii_pope_and_companions_martyrs: "Sixtus Ii papa And compañeros mártires",
  stanislaus_of_szczepanow_bishop: "Stanislaus de Szczepanow obispo",
  stephen_i_of_hungary: "Stephen I de Hungary",
  stephen_the_first_martyr: "Stephen First mártir",
  sunday_of_the_word_of_god: "Sunday de Word de God",
  sylvester_i_pope: "Sylvester I papa",
  teresa_benedicta_of_the_cross_stein_virgin: "Santa Teresa Benedicta de Cross Stein virgen, virgen",
  teresa_of_calcutta_virgin: "Santa Teresa de Calcutta virgen, virgen",
  teresa_of_jesus_of_avila_virgin: "Santa Teresa de Jesús de Avila virgen, virgen",
  therese_of_the_child_jesus_and_the_holy_face_of_lisieux_virgin: "Santa Therese de Child Jesús And Santo Face de Lisieux virgen, virgen",
  thomas_apostle: "Santo Tomás, apóstol",
  thomas_aquinas_priest: "Thomas Aquinas presbítero",
  thomas_becket_bishop: "Thomas Becket obispo",
  thursday_of_the_lords_supper: "Thursday de Lords Supper",
  transfiguration_of_the_lord: "Transfiguración del Señor",
  vincent_de_paul_priest: "Vincent De Paul presbítero",
  vincent_ferrer_priest: "Vincent Ferrer presbítero",
  vincent_of_saragossa_deacon: "San Vicente, diácono y mártir",
  visitation_of_mary: "Visitación de la Santísima Virgen María",
  zepherin_namuncura: "Beato Ceferino Namuncurá"
};

// Fallback “humanizador” por si aparece un id que no está en el mapa.
function humanizeIdEs(id) {
  if (!id) return "Celebración";
  return id
    .replace(/_/g, " ")
    .replace(/\b[a-z]/g, (m) => m.toUpperCase())
    .replace(/\bOf\b/g, "de")
    .replace(/\bAnd\b/g, "y")
    .replace(/\bBishop\b/g, "obispo")
    .replace(/\bMartyr\b/g, "mártir");
}

// Dada una celebración de Romcal, calcula displayName en ES.
function toDisplayNameEs(item) {
  if (item?.name && typeof item.name === "string") return item.name;
  if (item?.id && ES_NAME_MAP[item.id]) return ES_NAME_MAP[item.id];

  if (Array.isArray(item?.i18nDef)) {
    const key = item.i18nDef.find(
      (v) => typeof v === "string" && v.startsWith("names:")
    );
    if (key) {
      const id = key.split(":")[1];
      if (ES_NAME_MAP[id]) return ES_NAME_MAP[id];
      return humanizeIdEs(id);
    }
  }

  if (item?.id) return humanizeIdEs(item.id);
  return "Celebración";
}

/* =========================
   2) RESOLVER CALENDARIOS
   ========================= */
function pickCalendar(pkg, fallbackNameList = []) {
  for (const name of fallbackNameList) {
    if (pkg?.[name]) return pkg[name];
  }
  if (pkg?.default) return pkg.default;
  const first = Object.values(pkg).find(
    (v) => typeof v === "object" || typeof v === "function"
  );
  if (!first) throw new Error("No se pudo resolver el calendario del paquete");
  return first;
}

const ArgentinaCalendar = pickCalendar(ARG_PKG, [
  "Argentina_Es",
  "Argentina_EsAr",
  "Argentina",
]);
const GeneralRomanCalendar = pickCalendar(GRC_PKG, [
  "GeneralRoman_En",
  "GeneralRoman",
  "Grc",
]);

const DEFAULT_CALENDAR = "argentina";
// NOTA: no toco nada más (mantengo tu makeRomcal tal cual)

/* =========================
   3) APP EXPRESS
   ========================= */
const CALENDAR_MAP = {
  argentina: ArgentinaCalendar,
  general: GeneralRomanCalendar,
};

const app = express();
app.use(cors());
app.use(express.json());

// Utils
function parseYear(y) {
  const n = Number(y);
  return Number.isInteger(n) && String(n).length === 4 ? n : null;
}
function resolveCalendar(name) {
  const key = String(name || DEFAULT_CALENDAR).toLowerCase();
  return CALENDAR_MAP[key] || GeneralRomanCalendar;
}

function makeRomcal(calendarObj) {
  return new Romcal({
    localizedCalendar: calendarObj,
    // (no cambio más nada)
  });
}

// Salud
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "romcal-api-svf (local)",
    date: new Date().toISOString().slice(0, 10),
  });
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

    const calendarName = req.query.country || DEFAULT_CALENDAR;
    const calendarObj = resolveCalendar(calendarName);

    const romcal = makeRomcal(calendarObj);
    const data = await romcal.generateCalendar(year); // { "YYYY-MM-DD": [ ... ] }

    // ⬇️ SIN CAMBIAR ESTRUCTURA, si querés puedes enriquecer aquí también:
    // for (const [k, arr] of Object.entries(data)) {
    //   if (Array.isArray(arr)) {
    //     data[k] = arr.map((c) => ({ ...c, displayName: toDisplayNameEs(c) }));
    //   }
    // }

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
    if (!(month >= 1 && month <= 12))
      return res.status(400).json({ error: "Mes inválido (1-12)" });
    if (!(day >= 1 && day <= 31))
      return res.status(400).json({ error: "Día inválido (1-31)" });

    const calendarName = req.query.country || DEFAULT_CALENDAR;
    const calendarObj = resolveCalendar(calendarName);
    const romcal = makeRomcal(calendarObj);

    const all = await romcal.generateCalendar(year);
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const celebrations = (all[iso] || []).map((c) => ({
      ...c,
      displayName: toDisplayNameEs(c), // 👈 solo agrego la traducción
    }));

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

    const calendarName = req.query.country || DEFAULT_CALENDAR;
    const calendarObj = resolveCalendar(calendarName);
    const romcal = makeRomcal(calendarObj);

    const all = await romcal.generateCalendar(year);
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const celebrations = (all[iso] || []).map((c) => ({
      ...c,
      displayName: toDisplayNameEs(c), // 👈 solo agrego la traducción
    }));

    res.json({ calendar: String(calendarName).toLowerCase(), date: iso, celebrations });
  } catch (e) {
    res.status(500).json({ error: "romcal_error", detail: String(e?.message || e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`romcal local escuchando en http://localhost:${PORT}`);
});