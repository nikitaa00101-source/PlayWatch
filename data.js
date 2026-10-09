/* ===========================================================
   PlayWatch — קטלוג משחקים (נתוני דמו)
   כל המחירים והתאריכים למשחקים "בקרוב" הם פיקטיביים לצורך הדגמה.
   =========================================================== */

const GAMES = [
  {
    id: "elden-ring",
    title: "Elden Ring",
    genres: ["RPG", "אקשן"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    rating: 9.6,
    releaseDate: "2022-02-25",
    status: "released",
    icon: "⚔️",
    gradient: ["#1b1035", "#4b1d6b"],
    description: "משחק תפקידים פעולה בעולם פתוח עצום ואפל, מבית יוצריו של Dark Souls. חקרו את ה-Lands Between, לחמו בבוסים אכזריים ובנו את הדמות שלכם בדרככם.",
    tags: ["Souls-like", "עולם פתוח", "פנטזיה אפלה"],
    prices: [
      { store: "Steam", price: 149 },
      { store: "PlayStation Store", price: 179 },
      { store: "Xbox Store", price: 169 },
      { store: "Epic Games Store", price: 159 }
    ]
  },
  {
    id: "gow-ragnarok",
    title: "God of War Ragnarök",
    genres: ["אקשן", "הרפתקאות"],
    platforms: ["PS5"],
    developer: "Santa Monica Studio",
    publisher: "Sony",
    rating: 9.4,
    releaseDate: "2022-11-09",
    status: "released",
    icon: "🪓",
    gradient: ["#0d1f2d", "#123a52"],
    description: "קרייטוס ואטראוס ממשיכים במסע ברחבי תשעת העולמות לקראת ראגנרוק המתקרב. עלילה קולנועית, קרבות מרהיבים וחיבור אב-בן מרגש.",
    tags: ["עלילתי", "מיתולוגיה נורדית", "בלעדי PlayStation"],
    prices: [
      { store: "PlayStation Store", price: 249 },
      { store: "Steam", price: 219 }
    ]
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    genres: ["RPG", "אסטרטגיה"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "Larian Studios",
    publisher: "Larian Studios",
    rating: 9.7,
    releaseDate: "2023-08-03",
    status: "released",
    icon: "🎲",
    gradient: ["#241505", "#5a3b12"],
    description: "משחק תפקידים מבוסס תורות עם עומק אדיר, מבוסס על עולם Dungeons & Dragons. בחירות משמעותיות, שיתופי פעולה מפתיעים וסיפור ענפי.",
    tags: ["מבוסס תורות", "D&D", "שיתופי פעולה"],
    prices: [
      { store: "Steam", price: 189 },
      { store: "PlayStation Store", price: 209 },
      { store: "Xbox Store", price: 209 },
      { store: "GOG", price: 179 }
    ]
  },
  {
    id: "hades-2",
    title: "Hades II",
    genres: ["Indie", "אקשן"],
    platforms: ["PC"],
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    rating: 9.0,
    releaseDate: "2024-05-06",
    status: "released",
    icon: "🔥",
    gradient: ["#2a0e12", "#6e1626"],
    description: "רוגלייק אקשן מהיר ומלוטש עם עיצוב אמנותי מהמם, מוזיקה מדהימה ולולאת משחק ממכרת. גילום את מלינוא, נסיכת האוב.",
    tags: ["Roguelike", "מיתולוגיה יוונית", "גישה מוקדמת"],
    prices: [
      { store: "Steam", price: 79 },
      { store: "Epic Games Store", price: 79 }
    ]
  },
  {
    id: "cyberpunk-2077-pl",
    title: "Cyberpunk 2077: Phantom Liberty",
    genres: ["RPG", "אקשן"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    rating: 9.2,
    releaseDate: "2023-09-26",
    status: "released",
    icon: "🌆",
    gradient: ["#1a0033", "#ff2e6320"],
    description: "הרחבה עלילתית לקוברפאנק 2077 המוסיפה סיפור ריגול פוליטי מותח בלב דיסטריקט חדש בנייט סיטי, לצד V ושחקן חדש - סולומון ריד.",
    tags: ["עולם פתוח", "סייברפאנק", "הרחבה"],
    prices: [
      { store: "Steam", price: 119 },
      { store: "PlayStation Store", price: 129 },
      { store: "Xbox Store", price: 129 },
      { store: "GOG", price: 115 }
    ]
  },
  {
    id: "zelda-totk",
    title: "The Legend of Zelda: Tears of the Kingdom",
    genres: ["הרפתקאות", "פאזלים"],
    platforms: ["Switch"],
    developer: "Nintendo",
    publisher: "Nintendo",
    rating: 9.5,
    releaseDate: "2023-05-12",
    status: "released",
    icon: "🗡️",
    gradient: ["#0a2a1a", "#1f5c3a"],
    description: "לינק חוקר את שמי הידרול ואת עומק הממלכה במשחק פתוח ויצירתי במיוחד, עם מערכות בנייה ופתרון חידות חדשניות.",
    tags: ["עולם פתוח", "בלעדי Nintendo", "יצירתיות"],
    prices: [
      { store: "Nintendo eShop", price: 279 }
    ]
  },
  {
    id: "spiderman-2",
    title: "Marvel's Spider-Man 2",
    genres: ["אקשן", "הרפתקאות"],
    platforms: ["PS5"],
    developer: "Insomniac Games",
    publisher: "Sony",
    rating: 9.1,
    releaseDate: "2023-10-20",
    status: "released",
    icon: "🕸️",
    gradient: ["#26040c", "#7a1030"],
    description: "פיטר פארקר ומיילס מוראלס משתפים פעולה נגד וונום וכריפט קילר בניו יורק פתוחה וססגונית עם תנועה מהירה ומרהיבה.",
    tags: ["גיבורי על", "עולם פתוח", "בלעדי PlayStation"],
    prices: [
      { store: "PlayStation Store", price: 279 }
    ]
  },
  {
    id: "starfield",
    title: "Starfield",
    genres: ["RPG", "מדע בדיוני"],
    platforms: ["PC", "Xbox"],
    developer: "Bethesda Game Studios",
    publisher: "Bethesda",
    rating: 8.2,
    releaseDate: "2023-09-06",
    status: "released",
    icon: "🚀",
    gradient: ["#050a1a", "#152a5c"],
    description: "משחק תפקידים חלל עצום עם מאות כוכבי לכת לחקירה, בניית ספינות, פוסטים ומערכת סחר ענפה מבית יוצרי Skyrim ו-Fallout.",
    tags: ["חלל", "עולם פתוח", "בנייה"],
    prices: [
      { store: "Steam", price: 199 },
      { store: "Xbox Store", price: 219 }
    ]
  },
  {
    id: "diablo-4",
    title: "Diablo IV",
    genres: ["RPG", "אקשן"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "Blizzard Entertainment",
    publisher: "Blizzard Entertainment",
    rating: 8.6,
    releaseDate: "2023-06-06",
    status: "released",
    icon: "😈",
    gradient: ["#170505", "#5c0f0f"],
    description: "חזרה לעולם האפל של סנקטוארי עם דחיסת דמונים אינסופית, בילד קרפטינג עמוק ותוכן עונתי מתמשך.",
    tags: ["Hack & Slash", "עונתי", "שיתופי פעולה"],
    prices: [
      { store: "Battle.net", price: 279 },
      { store: "PlayStation Store", price: 289 },
      { store: "Xbox Store", price: 289 }
    ]
  },
  {
    id: "street-fighter-6",
    title: "Street Fighter 6",
    genres: ["קרבות"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "Capcom",
    publisher: "Capcom",
    rating: 8.9,
    releaseDate: "2023-06-02",
    status: "released",
    icon: "🥊",
    gradient: ["#1a0a05", "#5c2a0a"],
    description: "משחק הקרבות האגדי חוזר עם מערכת קרב עמוקה, מצב עולם פתוח (World Tour) ורשימת לוחמים איקונית.",
    tags: ["תחרותי", "מקוון", "eSports"],
    prices: [
      { store: "Steam", price: 219 },
      { store: "PlayStation Store", price: 229 },
      { store: "Xbox Store", price: 229 }
    ]
  },
  {
    id: "forza-horizon-5",
    title: "Forza Horizon 5",
    genres: ["מרוצים"],
    platforms: ["PC", "Xbox"],
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    rating: 9.0,
    releaseDate: "2021-11-09",
    status: "released",
    icon: "🏎️",
    gradient: ["#1a1005", "#5c3d0a"],
    description: "משחק מרוצים בעולם פתוח במקסיקו עם עונות משתנות, מאות רכבים ותחושת נהיגה מדהימה.",
    tags: ["עולם פתוח", "מולטיפלייר", "ארקייד"],
    prices: [
      { store: "Steam", price: 159 },
      { store: "Xbox Store", price: 169 }
    ]
  },
  {
    id: "re4-remake",
    title: "Resident Evil 4",
    genres: ["אימה", "אקשן"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "Capcom",
    publisher: "Capcom",
    rating: 9.3,
    releaseDate: "2023-03-24",
    status: "released",
    icon: "🧟",
    gradient: ["#0a1505", "#2a4d0f"],
    description: "רימייק מלוטש לאחד ממשחקי האימה-אקשן החשובים בתולדות המדיום, עם גרפיקה מודרנית וגיימפליי משופר.",
    tags: ["Survival Horror", "רימייק"],
    prices: [
      { store: "Steam", price: 179 },
      { store: "PlayStation Store", price: 199 },
      { store: "Xbox Store", price: 199 }
    ]
  },
  {
    id: "ff16",
    title: "Final Fantasy XVI",
    genres: ["RPG"],
    platforms: ["PS5"],
    developer: "Square Enix",
    publisher: "Square Enix",
    rating: 8.7,
    releaseDate: "2023-06-22",
    status: "released",
    icon: "🔮",
    gradient: ["#180520", "#4d1160"],
    description: "פרק חדש בסדרת פיינל פנטזי עם עולם אפל, קרבות אקשן דינמיים וקרבות אייקונים עוצרי נשימה.",
    tags: ["פנטזיה", "עלילתי", "בלעדי PlayStation"],
    prices: [
      { store: "PlayStation Store", price: 229 }
    ]
  },
  {
    id: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    genres: ["RPG", "הרפתקאות"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    developer: "Avalanche Software",
    publisher: "WB Games",
    rating: 8.5,
    releaseDate: "2023-02-10",
    status: "released",
    icon: "🪄",
    gradient: ["#1a1005", "#5c4a0a"],
    description: "חוו את חיי הקוסמים בהוגוורטס במאה ה-19 - למדו כישופים, חקרו את הטירה ועיצבו את סיפור הקוסם שלכם.",
    tags: ["עולם פתוח", "קסם", "משפחתי"],
    prices: [
      { store: "Steam", price: 169 },
      { store: "PlayStation Store", price: 199 },
      { store: "Xbox Store", price: 199 },
      { store: "Nintendo eShop", price: 219 }
    ]
  },
  {
    id: "alan-wake-2",
    title: "Alan Wake II",
    genres: ["אימה", "עלילתי"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "Remedy Entertainment",
    publisher: "Epic Games Publishing",
    rating: 9.0,
    releaseDate: "2023-10-27",
    status: "released",
    icon: "🔦",
    gradient: ["#050510", "#1a1a3d"],
    description: "אימה פסיכולוגית עוצרת נשימה עם עיצוב חזותי יוצא דופן ועלילה סוריאליסטית שנשארת איתכם הרבה אחרי הסיום.",
    tags: ["Survival Horror", "עלילתי", "אווירתי"],
    prices: [
      { store: "Epic Games Store", price: 189 },
      { store: "PlayStation Store", price: 209 },
      { store: "Xbox Store", price: 209 }
    ]
  },
  {
    id: "helldivers-2",
    title: "Helldivers 2",
    genres: ["Shooter", "שיתופי פעולה"],
    platforms: ["PC", "PS5"],
    developer: "Arrowhead Game Studios",
    publisher: "Sony",
    rating: 8.8,
    releaseDate: "2024-02-08",
    status: "released",
    icon: "🪖",
    gradient: ["#1a1005", "#5c3d0a"],
    description: "שיתוף פעולה כאוטי ומצחיק להגנה על הדמוקרטיה הגלקטית מפני חייזרים ורובוטים, עם נשק כבד ואסטרטגיה קבוצתית.",
    tags: ["Co-op", "Shooter", "סאטירה"],
    prices: [
      { store: "Steam", price: 139 },
      { store: "PlayStation Store", price: 139 }
    ]
  },
  {
    id: "persona-5-royal",
    title: "Persona 5 Royal",
    genres: ["RPG"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    developer: "Atlus",
    publisher: "Sega",
    rating: 9.4,
    releaseDate: "2022-10-21",
    status: "released",
    icon: "🎭",
    gradient: ["#1a0505", "#5c0a0a"],
    description: "משחק תפקידים יפני סגנוני במיוחד, המשלב חיי בית ספר יומיומיים עם פלישה לממדים עלומים כגנבי פנטום.",
    tags: ["JRPG", "אנימה", "עלילתי"],
    prices: [
      { store: "Steam", price: 189 },
      { store: "PlayStation Store", price: 209 },
      { store: "Nintendo eShop", price: 209 }
    ]
  },
  {
    id: "civilization-6",
    title: "Sid Meier's Civilization VI",
    genres: ["אסטרטגיה"],
    platforms: ["PC", "Switch"],
    developer: "Firaxis Games",
    publisher: "2K Games",
    rating: 8.9,
    releaseDate: "2016-10-21",
    status: "released",
    icon: "🏛️",
    gradient: ["#0a1a15", "#0f4d3d"],
    description: "בנו אימפריה שתעמוד במבחן הזמן - מאבן הצור ועד עידן החלל, בתורות אסטרטגיים עמוקים ומכריעים.",
    tags: ["4X", "מבוסס תורות", "היסטוריה"],
    prices: [
      { store: "Steam", price: 89 },
      { store: "Nintendo eShop", price: 99 }
    ]
  },
  {
    id: "stardew-valley",
    title: "Stardew Valley",
    genres: ["Indie", "סימולציה"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    rating: 9.5,
    releaseDate: "2016-02-26",
    status: "released",
    icon: "🌾",
    gradient: ["#0a1a05", "#2a5c0a"],
    description: "בנו מחדש חווה נטושה, טפלו ביבול ובבעלי חיים, בנו קשרים עם תושבי הכפר וחיו חיים שלווים ומכורים.",
    tags: ["חקלאות", "פיקסל ארט", "רגוע"],
    prices: [
      { store: "Steam", price: 39 },
      { store: "PlayStation Store", price: 45 },
      { store: "Nintendo eShop", price: 45 }
    ]
  },
  {
    id: "ea-fc-24",
    title: "EA Sports FC 24",
    genres: ["ספורט"],
    platforms: ["PC", "PS5", "Xbox"],
    developer: "EA Vancouver",
    publisher: "EA Sports",
    rating: 7.8,
    releaseDate: "2023-09-29",
    status: "released",
    icon: "⚽",
    gradient: ["#0a1a05", "#1f5c0f"],
    description: "משחק הכדורגל הפופולרי בעולם עם ליגות אמיתיות, מצב קריירה ואלטימט טים.",
    tags: ["ספורט", "מולטיפלייר", "עדכון שנתי"],
    prices: [
      { store: "Steam", price: 249 },
      { store: "PlayStation Store", price: 279 },
      { store: "Xbox Store", price: 279 }
    ]
  }
];

/* רשימת חנויות ידועה לצורך תגיות/אייקונים */
const STORE_ICONS = {
  "Steam": "🟦",
  "PlayStation Store": "🎮",
  "Xbox Store": "🟩",
  "Epic Games Store": "⬛",
  "GOG": "🟪",
  "Nintendo eShop": "🟥",
  "Battle.net": "⬜"
};


/* מחירי ההדגמה הוסרו — מחירים אמיתיים נשלפים מ-CheapShark בעמוד המשחק */
GAMES.forEach((g) => { g.prices = []; });
