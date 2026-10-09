/* ===========================================================
   צ'קליסטים מוכנים — פרנצ'ייזים לפי סדר יציאה (כרונולוגי)
   כל רשומה: [סוג, שם לחיפוש, שנה]  סוג: m=סרט, t=סדרה, g=משחק
   הפריטים נפתרים מול TMDB / RAWG בעת ההוספה; פריט שלא נמצא מדלגים עליו.
   =========================================================== */
const FRANCHISES = [
  { id: "mcu", world: "watch", company: 420, emoji: "🦸", name: "MCU", nameEn: "MCU", desc: "היקום הקולנועי של מארוול — סרטים וסדרות לפי סדר יציאה", descEn: "The Marvel Cinematic Universe — films & series in release order",
    entries: [["m","Iron Man",2008],["m","The Incredible Hulk",2008],["m","Iron Man 2",2010],["m","Thor",2011],["m","Captain America: The First Avenger",2011],["m","The Avengers",2012],["m","Iron Man 3",2013],["m","Thor: The Dark World",2013],["m","Captain America: The Winter Soldier",2014],["m","Guardians of the Galaxy",2014],["m","Avengers: Age of Ultron",2015],["m","Ant-Man",2015],["m","Captain America: Civil War",2016],["m","Doctor Strange",2016],["m","Guardians of the Galaxy Vol. 2",2017],["m","Spider-Man: Homecoming",2017],["m","Thor: Ragnarok",2017],["m","Black Panther",2018],["m","Avengers: Infinity War",2018],["m","Ant-Man and the Wasp",2018],["m","Captain Marvel",2019],["m","Avengers: Endgame",2019],["m","Spider-Man: Far From Home",2019],["t","WandaVision",2021],["t","The Falcon and the Winter Soldier",2021],["t","Loki",2021],["m","Black Widow",2021],["m","Shang-Chi and the Legend of the Ten Rings",2021],["m","Eternals",2021],["m","Spider-Man: No Way Home",2021],["m","Doctor Strange in the Multiverse of Madness",2022],["t","Moon Knight",2022],["t","Ms. Marvel",2022],["m","Thor: Love and Thunder",2022],["t","She-Hulk: Attorney at Law",2022],["m","Black Panther: Wakanda Forever",2022],["m","Ant-Man and the Wasp: Quantumania",2023],["m","Guardians of the Galaxy Vol. 3",2023],["t","Secret Invasion",2023],["m","The Marvels",2023],["t","Echo",2024],["m","Deadpool & Wolverine",2024],["t","Agatha All Along",2024],["m","Captain America: Brave New World",2025],["m","Thunderbolts*",2025],["m","The Fantastic Four: First Steps",2025]] },
  { id: "dceu", world: "watch", company: 9993, emoji: "🦇", name: "DCEU", nameEn: "DCEU", desc: "יקום DC המורחב (2013–2023) לפי סדר יציאה", descEn: "The DC Extended Universe (2013–2023) in release order",
    entries: [["m","Man of Steel",2013],["m","Batman v Superman: Dawn of Justice",2016],["m","Suicide Squad",2016],["m","Wonder Woman",2017],["m","Justice League",2017],["m","Aquaman",2018],["m","Shazam!",2019],["m","Birds of Prey (and the Fantabulous Emancipation of One Harley Quinn)",2020],["m","Wonder Woman 1984",2020],["m","Zack Snyder's Justice League",2021],["m","The Suicide Squad",2021],["t","Peacemaker",2022],["m","Black Adam",2022],["m","Shazam! Fury of the Gods",2023],["m","The Flash",2023],["m","Blue Beetle",2023],["m","Aquaman and the Lost Kingdom",2023]] },
  { id: "dcu", world: "watch", company: 128064, emoji: "🦸‍♂️", name: "DCU (היקום החדש)", nameEn: "DCU (new universe)", desc: "יקום DC החדש של ג'יימס גאן — לפי סדר יציאה", descEn: "James Gunn's new DC Universe — in release order",
    entries: [["t","Peacemaker",2022],["t","Creature Commandos",2024],["m","Superman",2025],["t","Lanterns",2026],["m","Supergirl",2026],["m","Clayface",2026]] },
  { id: "starwars", world: "watch", company: 1, emoji: "🌌", name: "Star Wars", nameEn: "Star Wars", desc: "סאגת מלחמת הכוכבים — סרטים וסדרות לפי סדר יציאה", descEn: "The Star Wars saga — films & series in release order",
    entries: [["m","Star Wars",1977],["m","The Empire Strikes Back",1980],["m","Return of the Jedi",1983],["m","Star Wars: Episode I - The Phantom Menace",1999],["m","Star Wars: Episode II - Attack of the Clones",2002],["m","Star Wars: Episode III - Revenge of the Sith",2005],["m","Star Wars: The Force Awakens",2015],["m","Rogue One: A Star Wars Story",2016],["m","Star Wars: The Last Jedi",2017],["m","Solo: A Star Wars Story",2018],["t","The Mandalorian",2019],["m","Star Wars: The Rise of Skywalker",2019],["t","Obi-Wan Kenobi",2022],["t","Andor",2022],["t","Ahsoka",2023]] },
  { id: "potter", world: "watch", company: 174, emoji: "⚡", name: "העולם של הארי פוטר", nameEn: "Wizarding World", desc: "הארי פוטר ובעלי החיים המופלאים — לפי סדר יציאה", descEn: "Harry Potter & Fantastic Beasts — in release order",
    entries: [["m","Harry Potter and the Philosopher's Stone",2001],["m","Harry Potter and the Chamber of Secrets",2002],["m","Harry Potter and the Prisoner of Azkaban",2004],["m","Harry Potter and the Goblet of Fire",2005],["m","Harry Potter and the Order of the Phoenix",2007],["m","Harry Potter and the Half-Blood Prince",2009],["m","Harry Potter and the Deathly Hallows: Part 1",2010],["m","Harry Potter and the Deathly Hallows: Part 2",2011],["m","Fantastic Beasts and Where to Find Them",2016],["m","Fantastic Beasts: The Crimes of Grindelwald",2018],["m","Fantastic Beasts: The Secrets of Dumbledore",2022]] },
  { id: "lotr", world: "watch", company: 12, emoji: "💍", name: "שר הטבעות וההוביט", nameEn: "Middle-earth", desc: "הטרילוגיות של פיטר ג'קסון והסדרה — לפי סדר יציאה", descEn: "Peter Jackson's trilogies and the series — in release order",
    entries: [["m","The Lord of the Rings: The Fellowship of the Ring",2001],["m","The Lord of the Rings: The Two Towers",2002],["m","The Lord of the Rings: The Return of the King",2003],["m","The Hobbit: An Unexpected Journey",2012],["m","The Hobbit: The Desolation of Smaug",2013],["m","The Hobbit: The Battle of the Five Armies",2014],["t","The Lord of the Rings: The Rings of Power",2022]] },
  { id: "ac", world: "games", emoji: "🗡️", name: "Assassin's Creed", nameEn: "Assassin's Creed", desc: "משחקי הסדרה הראשיים לפי סדר יציאה", descEn: "The main series games in release order",
    entries: [["g","Assassin's Creed",2007],["g","Assassin's Creed II",2009],["g","Assassin's Creed Brotherhood",2010],["g","Assassin's Creed Revelations",2011],["g","Assassin's Creed III",2012],["g","Assassin's Creed IV Black Flag",2013],["g","Assassin's Creed Rogue",2014],["g","Assassin's Creed Unity",2014],["g","Assassin's Creed Syndicate",2015],["g","Assassin's Creed Origins",2017],["g","Assassin's Creed Odyssey",2018],["g","Assassin's Creed Valhalla",2020],["g","Assassin's Creed Mirage",2023],["g","Assassin's Creed Shadows",2025]] },
  { id: "gow", world: "games", emoji: "🪓", name: "God of War", nameEn: "God of War", desc: "כל משחקי קרייטוס לפי סדר יציאה", descEn: "All Kratos games in release order",
    entries: [["g","God of War",2005],["g","God of War II",2007],["g","God of War III",2010],["g","God of War: Ascension",2013],["g","God of War",2018],["g","God of War Ragnarök",2022]] },
  { id: "re", world: "games", emoji: "🧟", name: "Resident Evil", nameEn: "Resident Evil", desc: "משחקי הסדרה הראשיים לפי סדר יציאה מקורי", descEn: "The main games in original release order",
    entries: [["g","Resident Evil",1996],["g","Resident Evil 2",1998],["g","Resident Evil 3: Nemesis",1999],["g","Resident Evil Code: Veronica",2000],["g","Resident Evil 4",2005],["g","Resident Evil 5",2009],["g","Resident Evil 6",2012],["g","Resident Evil 7: Biohazard",2017],["g","Resident Evil Village",2021]] },
  { id: "witcher", world: "games", emoji: "🐺", name: "The Witcher", nameEn: "The Witcher", desc: "שלושת משחקי ההוכר לפי סדר יציאה", descEn: "The three Witcher games in release order",
    entries: [["g","The Witcher",2007],["g","The Witcher 2: Assassins of Kings",2011],["g","The Witcher 3: Wild Hunt",2015]] }
];

const FR_CACHE = "gh_fr_res_" + LANG; // "type|query|year" -> game id (או "" אם לא נמצא)

async function resolveEntry(e) {
  const [type, q, year] = e;
  const key = `${type}|${q}|${year}`;
  const cache = readJSON(FR_CACHE, {});
  if (key in cache && (cache[key] === "" ? false : findGame(cache[key]))) return cache[key];
  let id = "";
  try {
    if (type === "g") {
      const res = await rawgFetch("/games", { search: q, page_size: 10, search_precise: true });
      const hit = res.results.find((r) => (r.released || "").startsWith(String(year))) || res.results[0];
      if (hit) { const m = mapRawgGame(hit); addRealGames([m]); id = m.id; }
    } else {
      const kind = type === "t" ? "tv" : "movie";
      const yp = type === "t" ? "first_air_date_year" : "primary_release_year";
      let res = await tmdbFetch("/search/" + kind, { query: q, [yp]: year });
      if (!res.results.length) res = await tmdbFetch("/search/" + kind, { query: q });
      if (res.results[0]) { const m = mapTmdbItem(res.results[0], kind); addTmdbItems([m]); id = m.id; }
    }
  } catch (err) { return null; }
  cache[key] = id;
  writeJSON(FR_CACHE, cache);
  return id;
}
async function resolveFranchise(fr) {
  const ids = [];
  for (let i = 0; i < fr.entries.length; i += 6) {
    const batch = await Promise.all(fr.entries.slice(i, i + 6).map(resolveEntry));
    ids.push(...batch);
  }
  const seen = new Set();
  const found = ids.filter((x) => x && !seen.has(x) && seen.add(x));
  return { found, missing: fr.entries.length - found.length };
}

/* לוגו רשמי: לוגו חברת ההפקה/הסטודיו האחראית על הפרנצ'ייז, כפי שמסופק ע"י TMDB (קרדיט: TMDB).
   למשחקים אין מקור לוגואים בחינם — שם מוצגת תמונת הכריכה של המשחק הראשון בסדרה. */
const FR_LOGO_CACHE = "gh_fr_logo";
async function franchiseEmblem(fr) {
  const c = readJSON(FR_LOGO_CACHE, {});
  if (c[fr.id]) return c[fr.id];
  let out = null;
  try {
    if (fr.company) {
      const d = await tmdbFetch("/company/" + fr.company);
      if (d.logo_path) out = { type: "logo", src: TMDB_IMG + "w300" + d.logo_path };
    }
    if (!out) {
      const id = await resolveEntry(fr.entries[0]);
      const g = id && findGame(id);
      if (g && g.image) out = { type: "cover", src: g.image };
    }
  } catch (e) {}
  if (out) { c[fr.id] = out; writeJSON(FR_LOGO_CACHE, c); }
  return out;
}
function emblemHTML(e) {
  if (!e) return '<span class="fr-emblem empty"></span>';
  return `<span class="fr-emblem ${e.type}"><img src="${e.src}" alt="" loading="lazy" /></span>`;
}

/* ---------- שיוך פריט לפרנצ'ייז ---------- */
const frNorm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
function franchisesOf(g) {
  if (!g || g.status === undefined) return [];
  const cache = readJSON(FR_CACHE, {});
  const year = parseInt((g.releaseDate || "").slice(0, 4), 10);
  const world = worldOf(g);
  const names = [frNorm(g.orig), frNorm(g.title)].filter(Boolean);
  return FRANCHISES.filter((fr) => {
    if (fr.world !== world) return false;
    return fr.entries.some((e) => {
      if (cache[`${e[0]}|${e[1]}|${e[2]}`] === g.id) return true;
      return names.includes(frNorm(e[1])) && Math.abs(year - e[2]) <= 1;
    });
  });
}
function franchiseChipsHTML(g, big) {
  return franchisesOf(g)
    .map((fr) => `<a class="tag fr-chip" href="franchises.html?f=${fr.id}" title="צ'קליסט מוכן" onclick="event.stopPropagation();">📦 ${IS_EN ? fr.nameEn : fr.name}${big ? " · פתיחת הצ'קליסט ←" : ""}</a>`)
    .join("");
}
