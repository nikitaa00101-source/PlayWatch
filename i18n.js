/* ===========================================================
   i18n — עברית (שקלים) / English (USD + EUR)
   בחירת שפה: ?lang=en | ?lang=he, או הכפתור בסרגל העליון. נשמר ב-localStorage.
   =========================================================== */
const LANG = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "he") {
    try { localStorage.setItem("gh_lang", q); } catch (e) {}
    return q;
  }
  try { return localStorage.getItem("gh_lang") === "en" ? "en" : "he"; } catch (e) { return "he"; }
})();
const IS_EN = LANG === "en";
document.documentElement.lang = LANG;
document.documentElement.dir = IS_EN ? "ltr" : "rtl";
if (IS_EN) document.documentElement.classList.add("lang-en");

function setLang(l) {
  try { localStorage.setItem("gh_lang", l); } catch (e) {}
  const u = new URL(location.href);
  u.searchParams.delete("lang");
  location.href = u.toString();
}

const EN = {
  /* דירוג PlayWatch */
  "דירוג PlayWatch": "PlayWatch rating", "הדירוג שלך:": "Your rating:", "לחצו על כוכב כדי לדרג": "Click a star to rate", "התחברו כדי לדרג": "Log in to rate",
  "אין דירוגים עדיין": "No ratings yet", "הדירוג נשמר": "Rating saved", "מיון: דירוג PlayWatch": "Sort: PlayWatch rating",
  /* צ'קליסטים */
  "הצ'קליסטים שלי ✅": "My checklists ✅", "צרו צ'קליסטים בנפרד למשחקים ולסרטים וסדרות, הוסיפו אליהם פריטים וסמנו את מה שכבר סיימתם": "Create separate checklists for games and for movies & series, add items and tick what you've finished",
  "שם צ'קליסט חדש, למשל: לחופשה": "New checklist name, e.g. Vacation", "➕ יצירת צ'קליסט": "➕ Create checklist", "🍿 סרטים וסדרות": "🍿 Movies & Series",
  "אין עדיין צ'קליסטים": "No checklists yet", "צרו את הצ'קליסט הראשון שלכם": "Create your first checklist", "מחיקת צ'קליסט": "Delete checklist",
  "הצ'קליסט ריק": "The checklist is empty", "נא להזין שם לצ'קליסט": "Please enter a checklist name", "למחוק את הצ'קליסט?": "Delete this checklist?",
  "שם הצ'קליסט החדש:": "New checklist name:", "✅ הצ'קליסטים שלי:": "✅ My checklists:", "אין צ'קליסטים עדיין": "No checklists yet", "➕ צ'קליסט חדש": "➕ New checklist", "סמן כהושלם": "Mark as done",
  /* פרנצ'ייזים וסידור */
  "📦 צ'קליסטים מוכנים (לפי סדר יציאה)": "📦 Ready-made checklists (release order)", "הצ'קליסטים שלי": "My checklists",
  "משחקים": "Games", "פריטים": "items", "להוסיף לצ'קליסט קיים...": "Add to an existing checklist...",
  "🎲 סידור אקראי": "🎲 Shuffle order", "↩ שחזור הסדר הקודם": "↩ Restore previous order", "↺ איפוס לסדר המקורי": "↺ Reset to original order",
  "⚠️ אזהרה: סידור אקראי": "⚠️ Warning: random order", "הסדר הנוכחי של הצ'קליסט יעורבב לגמרי. אפשר לשחזר את הסדר הקודם מיד אחר כך, כל עוד לא ערכתם שוב.": "The checklist's current order will be fully shuffled. You can restore the previous order right after, as long as you haven't edited again.",
  "כן, לערבב": "Yes, shuffle", "ביטול": "Cancel", "הזזה למעלה": "Move up", "הזזה למטה": "Move down",
  "הסדר עורבב — אפשר לשחזר": "Order shuffled — you can restore it", "הסדר הקודם שוחזר": "Previous order restored",
  "לאפס לסדר המקורי? הסדר שערכתם יוחלף.": "Reset to the original order? Your custom order will be replaced.",
  "טוען את הפריטים... זה יכול לקחת כמה שניות": "Loading items... this can take a few seconds",
  "לא הצלחנו לטעון את הפרנצ'ייז (בדקו חיבור)": "Couldn't load the franchise (check your connection)",
  /* עמוד צ'קליסטים מוכנים */
  "📦 מוכנים": "📦 Ready-made", "PlayWatch — צ'קליסטים מוכנים": "PlayWatch — ready-made checklists", "צ'קליסטים מוכנים 📦": "Ready-made checklists 📦",
  "פרנצ'ייזים מוכנים לפי סדר יציאה. פתחו כדי לראות את כל הפריטים, ואז הוסיפו לצ'קליסט חדש או קיים.": "Ready-made franchises in release order. Open one to see all items, then add it to a new or existing checklist.",
  "👁 צפייה בצ'קליסט ←": "👁 View checklist →", "→ חזרה לכל הצ'קליסטים המוכנים": "← Back to all ready-made checklists", "טוען את הפריטים...": "Loading items...",
  "➕ פתיחת צ'קליסט חדש מהפרנצ'ייז": "➕ Open a new checklist from this franchise", "לא הצלחנו לטעון את הפריטים (בדקו חיבור)": "Couldn't load the items (check your connection)",
  "📦 צ'קליסטים מוכנים: MCU, Star Wars, Assassin's Creed ועוד — צפייה והוספה ←": "📦 Ready-made checklists: MCU, Star Wars, Assassin's Creed and more — preview & add →",
  "(כולל לוגואי הסטודיו)": "(incl. studio logos)", "נתונים מ-": "data from ",
  "גררו כדי לשנות סדר": "Drag to reorder", "אין צ'קליסט מתאים — צרו חדש": "No matching checklist — create one", "התחברו כדי להוסיף": "Log in to add",
  "צ'קליסט מוכן": "Ready-made checklist",
  "📲 התקנה": "📲 Install", "בית": "Home", "צפייה": "Watch", "צ'קליסט": "Checklist", "מוכנים": "Ready-made",
  "באייפון: לחצו על כפתור השיתוף (ריבוע עם חץ) ואז 'הוסף למסך הבית'.": "On iPhone: tap the Share button (square with arrow), then 'Add to Home Screen'.",
  /* עולמות */
  "🏠 בית": "🏠 Home", "🍿 סרטים וסדרות": "🍿 Movies & Series", "סרטים וסדרות": "Movies & Series",
  "PlayWatch — משחקים": "PlayWatch — Games", "PlayWatch — סרטים וסדרות": "PlayWatch — Movies & Series",
  "PlayWatch — משחקים, סרטים וסדרות במקום אחד": "PlayWatch — games, movies & series in one place",
  "כמה עולמות.": "Several worlds.", "מקום אחד.": "One place.",
  "משחקים וגם סרטים וסדרות: מה יוצא, מה שווה, איפה לשחק או לצפות — עם רשימות ותזכורות משותפות לכולם.": "Games and also movies & series: what's out, what's worth it, where to play or watch — with shared lists and reminders for everything.",
  "משחקים": "Games", "קטלוג משחקים לכל הפלטפורמות, השוואת מחירים בין חנויות ותאריכי יציאה.": "A catalog of games for every platform, store price comparison and release dates.",
  "לעולם המשחקים ←": "Enter the games world →", "מה בטרנד ומה מגיע בקרוב, ובאילו שירותי סטרימינג אפשר לצפות בישראל.": "What's trending, what's coming soon and which streaming services have it.",
  "לעולם הצפייה ←": "Enter the watch world →",
  "🎮 פופולרי במשחקים": "🎮 Popular in games", "עוד משחקים ←": "More games →", "🍿 פופולרי בסרטים וסדרות": "🍿 Popular in movies & series",
  "עוד סרטים וסדרות ←": "More movies & series →", "📅 יוצא בקרוב בכל העולמות": "📅 Coming soon across all worlds", "טוען...": "Loading...",
  "עולם המשחקים.": "The games world.", "כל מה שמשחקים.": "Everything you play.",
  "קטלוג משחקים, השוואת מחירים בין חנויות, רשימות משאלות והתראות ליציאות — כדי שתמיד תדעו במה לשחק הבא.": "A game catalog, store price comparison, wishlists and release alerts, so you always know what to play next.",
  "עולם הצפייה.": "The watch world.", "מה יוצא, מה בטרנד, ואיפה אפשר לראות את זה — בסטרימינג, להשכרה או לקנייה.": "What's out, what's trending and where to watch it: streaming, rent or buy.",
  "חפשו סרט או סדרה לפי שם...": "Search a movie or series...", "משחקים בקטלוג": "Games in catalog", "סרטים וסדרות בקטלוג": "Movies & series in catalog",
  "פלטפורמות": "Platforms", "ז'אנרים": "Genres", "🎮 משחק": "🎮 Game", "🎬 סרט": "🎬 Movie", "📺 סדרה": "📺 Series",
  "הפריט לא נמצא": "Item not found", "ייתכן שהקישור שגוי או שהפריט הוסר מהקטלוג": "The link may be wrong or the item was removed from the catalog",
  "סומן כלא הושלם": "Marked as not completed", "ממתינים": "Pending",
  "פריטים ברשימה": "items on the list", "תקבלו התראה כשפריטים עתידיים יוצאים": "You'll be notified when upcoming titles release",
  "אין פריטים כאן עדיין": "Nothing here yet", "עברו למשחקים או לסרטים וסדרות והוסיפו מה שמעניין אתכם": "Head to games or movies & series and add what interests you",
  "עקבו אחרי משחקים, סרטים וסדרות שאתם מתכננים לשחק או לצפות בהם, וסמנו את מה שכבר סיימתם": "Track games, movies and series you plan to play or watch, and tick what you've finished",
  "אין פריטים בקטגוריה הזו": "Nothing in this category", "הוסיפו פריטים מהקטלוג כדי להתחיל לעקוב": "Add titles from the catalog to start tracking",
  "צרו רשימות בשם שבחרתם (משחקים, סרטים וסדרות יחד או בנפרד), והוסיפו אליהן מעמוד הפריט או מכאן": "Create named lists (games, movies and series together or apart) and add titles from the item page or from here",
  "➕ הוספת פריט...": "➕ Add item...",
  /* ניווט */
  "רשימת המשאלות": "Wishlist", "הצ'קליסט שלי": "My checklist", "הרשימות שלי": "My lists",
  "התראות": "Notifications", "התראות יציאה קרובות": "Upcoming release alerts",
  "אין יציאות קרובות מרשימת המשאלות שלך כרגע": "No upcoming releases from your wishlist right now",
  "🔔 הפעלת התראות דפדפן": "🔔 Enable browser notifications", "התנתקות": "Log out", "התחברות": "Log in", "הרשמה": "Sign up",
  "התחברות / הרשמה": "Log in / Sign up",
  /* מודלים */
  "יצירת חשבון": "Create account", "הצטרפו כדי לנהל רשימות משאלות וצ'קליסטים": "Join to manage wishlists and checklists",
  "שם משתמש": "Username", "הכינוי שלך": "Your nickname", "אימייל": "Email", "סיסמה": "Password", "לפחות 4 תווים": "At least 4 characters",
  "כבר יש לך חשבון?": "Already have an account?", "אין לך חשבון עדיין?": "Don't have an account yet?",
  "ברוכים השבים ל-PlayWatch": "Welcome back to PlayWatch", "שם המשתמש שלך": "Your username", "הסיסמה שלך": "Your password",
  "נא למלא את כל השדות": "Please fill in all fields", "שם המשתמש כבר תפוס": "Username already taken", "שם משתמש או סיסמה שגויים": "Wrong username or password",
  /* הודעות */
  "הדפדפן שלך לא תומך בהתראות": "Your browser doesn't support notifications", "התראות דפדפן הופעלו בהצלחה": "Browser notifications enabled",
  "ההתראות נדחו": "Notifications were declined", "נוסף לרשימת המשאלות": "Added to wishlist", "הוסר מרשימת המשאלות": "Removed from wishlist",
  "נוסף לרשימה": "Added to list", "הוסר מהרשימה": "Removed from list", "התזכורת בוטלה": "Reminder cancelled", "התזכורת נשמרה": "Reminder saved",
  "נוסף לצ'קליסט שלך": "Added to your checklist", "סומן כהושלם 🎉": "Marked as completed 🎉", "סומן כטרם שוחק": "Marked as not played", "הוסר מהצ'קליסט": "Removed from checklist",
  "לא הצלחנו לטעון משחקים חיים — מוצגים נתוני הדגמה": "Couldn't load live games — showing demo data",
  "לא הצלחנו לטעון סרטים וסדרות": "Couldn't load movies and series", "נא להזין שם לרשימה": "Please enter a list name",
  "שם הרשימה החדשה:": "New list name:", "למחוק את הרשימה?": "Delete this list?",
  /* קטלוג */
  "כל עולם הגיימינג.": "The whole gaming world.", "במקום אחד.": "In one place.",
  "קטלוג משחקים, השוואת מחירים בין חנויות, רשימות משאלות והתראות ליציאת משחקים — כדי שתמיד תדעו במה לשחק הבא.": "A game catalog, store price comparison, wishlists and release alerts, so you always know what to play next.",
  "חפשו משחק לפי שם...": "Search by title...", "🔍 חיפוש": "🔍 Search",
  "משחקים בקטלוג": "Titles in catalog", "יציאות קרובות": "Upcoming releases", "חנויות להשוואה": "Stores compared",
  "הכל": "All", "כל הפלטפורמות": "All platforms", 
  "🎮 משחקים": "🎮 Games", "🎬 סרטים": "🎬 Movies", "📺 סדרות": "📺 Series",
  "כל הסטטוסים": "All statuses", "יצאו לאור": "Released", "בקרוב": "Coming soon", "יצא לאור": "Released",
  "מיון: דירוג (גבוה לנמוך)": "Sort: rating (high to low)", "מיון: תאריך יציאה": "Sort: release date", "מיון: א-ב": "Sort: A–Z",
  "הוספה לרשימת המשאלות": "Add to wishlist", "טרם דורג": "Not rated yet", "סדרה": "Series", "סרט": "Movie",
  "איפה לצפות ←": "Where to watch →", "מחירים": "Prices", "להשוואה ←": "compare →",
  "לא נמצאו תוצאות": "No results found", "נסו לשנות את הסינון או את מונח החיפוש": "Try changing the filters or search term",
  "PlayWatch — קטלוג המשחקים שלך": "PlayWatch — your game catalog", "PlayWatch — פרטי משחק": "PlayWatch — details",
  "PlayWatch — רשימת המשאלות": "PlayWatch — wishlist", "PlayWatch — הצ'קליסט שלי": "PlayWatch — my checklist", "PlayWatch — הרשימות שלי": "PlayWatch — my lists",
  /* פרטים */
  "טרם פורסם": "TBA", "סדרות דומות": "Similar series", "סרטים דומים": "Similar movies", "משחקים דומים": "Similar games",
  "📡 בסטרימינג (מנוי)": "📡 Streaming (subscription)", "🎟️ להשכרה": "🎟️ Rent", "🛒 לקנייה": "🛒 Buy",
  "📍 איפה לצפות בישראל": "📍 Where to watch in the US", "אין מידע על זמינות בישראל כרגע": "No availability info right now",
  "לכל האפשרויות ב-JustWatch ←": "All options on JustWatch →", "נתוני הצפייה מסופקים על ידי JustWatch דרך TMDB.": "Watch data provided by JustWatch via TMDB.",
  "🔔 תזכורת יציאה:": "🔔 Release reminder:", "ללא": "None", "ביום היציאה": "On release day", "יום לפני": "1 day before", "שבוע לפני": "1 week before", "חודש לפני": "1 month before",
  "📚 הרשימות שלי:": "📚 My lists:", "אין רשימות עדיין": "No lists yet", "➕ רשימה חדשה": "➕ New list",
  "לא נמצאו מחירים עדכניים למשחק זה (ייתכן שהוא לא נמכר בחנויות PC).": "No current prices found for this game (it may not be sold on PC stores).",
  "חנות": "Store", "המשחק לא נמצא": "Game not found", "ייתכן שהקישור שגוי או שהמשחק הוסר מהקטלוג": "The link may be wrong or the item was removed from the catalog",
  "חזרה לקטלוג": "Back to catalog", "★ ברשימת המשאלות": "★ In wishlist", "☆ הוספה לרשימת המשאלות": "☆ Add to wishlist",
  "✅ הושלם": "✅ Completed", "🕓 ברשימת המעקב": "🕓 On checklist", "➕ הוספה לצ'קליסט": "➕ Add to checklist",
  "📖 תיאור": "📖 Description", "אין תיאור זמין.": "No description available.", "💰 השוואת מחירים": "💰 Price comparison",
  "טוען מחירים עדכניים...": "Loading current prices...", "המשחק עדיין לא יצא — מחירים יופיעו אחרי היציאה.": "Not released yet — prices will appear after launch.",
  "המחיר הזול ביותר": "Lowest price",
  /* צ'קליסט / משאלות / רשימות */
  "יש להתחבר כדי לצפות בצ'קליסט": "Log in to view your checklist", "הצ'קליסט שלך נשמר עבור המשתמש המחובר בלבד": "Your checklist is saved for the logged-in user only",
  "הצ'קליסט שלי ✅": "My checklist ✅", "עקבו אחרי המשחקים שאתם מתכננים לשחק וסמנו את מה שכבר סיימתם": "Track what you plan to play and tick what you've finished",
  "אין משחקים בקטגוריה הזו": "Nothing in this category", "הצ'קליסט ריק": "Your checklist is empty", "נסו לעבור לקטגוריה אחרת": "Try another category",
  "הוסיפו משחקים מהקטלוג כדי להתחיל לעקוב": "Add titles from the catalog to start tracking", "אל הקטלוג": "To the catalog", "הסרה": "Remove",
  "יש להתחבר כדי לצפות ברשימת המשאלות": "Log in to view your wishlist", "הרשימה שלך נשמרת עבור המשתמש המחובר בלבד": "Your list is saved for the logged-in user only",
  "רשימת המשאלות שלי ⭐": "My wishlist ⭐", "תקבלו התראה כשמשחקים עתידיים יוצאים": "You'll be notified when upcoming titles release",
  "אין משחקים כאן עדיין": "Nothing here yet", "עברו לקטלוג והוסיפו משחקים שאתם רוצים לשחק": "Go to the catalog and add titles you want",
  "יש להתחבר כדי לנהל רשימות": "Log in to manage lists", "הרשימות שלי 📚": "My lists 📚",
  "צרו רשימות משחקים בשם שבחרתם, והוסיפו אליהן משחקים מעמוד המשחק או מכאן": "Create named lists and add titles from the game page or from here",
  "שם רשימה חדשה, למשל: לחופשה": "New list name, e.g. Vacation", "➕ יצירת רשימה": "➕ Create list",
  "אין עדיין רשימות": "No lists yet", "צרו את הרשימה הראשונה שלכם": "Create your first list", "➕ הוספת משחק...": "➕ Add title...",
  "מחיקת רשימה": "Delete list", "הרשימה ריקה": "The list is empty", "לשחק": "To play", "הושלמו": "Completed",
  "ביום היציאה ": "On release day",
  /* תחתית */
  "PlayWatch · פרויקט הדגמה · נתוני משחקים מ-": "PlayWatch · demo project · game data from ", "PlayWatch · נתונים מ-": "PlayWatch · data from ",
  "נתוני משחקים מ-": "game data from ", "פרויקט הדגמה": "demo project", "מחירים מ-CheapShark": "prices from CheapShark",
  /* ז'אנרים ותגיות של משחקי ההדגמה */
  "אקשן": "Action", "הרפתקאות": "Adventure", "אסטרטגיה": "Strategy", "פאזלים": "Puzzle", "מדע בדיוני": "Sci-Fi", "קרבות": "Fighting", "מרוצים": "Racing",
  "אימה": "Horror", "עלילתי": "Story-driven", "שיתופי פעולה": "Co-op", "סימולציה": "Simulation", "ספורט": "Sports", "פנטזיה": "Fantasy",
  "עולם פתוח": "Open world", "פנטזיה אפלה": "Dark fantasy", "מיתולוגיה נורדית": "Norse mythology", "בלעדי PlayStation": "PlayStation exclusive",
  "מבוסס תורות": "Turn-based", "מיתולוגיה יוונית": "Greek mythology", "גישה מוקדמת": "Early access", "סייברפאנק": "Cyberpunk", "הרחבה": "Expansion",
  "בלעדי Nintendo": "Nintendo exclusive", "יצירתיות": "Creativity", "גיבורי על": "Superheroes", "חלל": "Space", "בנייה": "Building", "עונתי": "Seasonal",
  "תחרותי": "Competitive", "מקוון": "Online", "מולטיפלייר": "Multiplayer", "ארקייד": "Arcade", "רימייק": "Remake", "קסם": "Magic", "משפחתי": "Family",
  "אווירתי": "Atmospheric", "סאטירה": "Satire", "אנימה": "Anime", "היסטוריה": "History", "חקלאות": "Farming", "פיקסל ארט": "Pixel art", "רגוע": "Relaxing", "עדכון שנתי": "Annual release"
};

/* ז'אנרים מ-RAWG לעברית */
const RAWG_GENRE_HE = { Action: "אקשן", Adventure: "הרפתקאות", Strategy: "אסטרטגיה", Puzzle: "פאזלים", Racing: "מרוצים", Sports: "ספורט", Fighting: "קרבות", Simulation: "סימולציה", Shooter: "Shooter", Casual: "קליל", Arcade: "ארקייד", Platformer: "פלטפורמר", Family: "משפחתי", "Massively Multiplayer": "מולטיפלייר המוני", Educational: "חינוכי", Card: "קלפים", "Board Games": "משחקי קופסה" };

const DESC_EN = {
  "elden-ring": "A vast, dark open-world action RPG from the makers of Dark Souls. Explore the Lands Between, fight brutal bosses and build your character your way.",
  "gow-ragnarok": "Kratos and Atreus continue their journey across the Nine Realms as Ragnarök approaches. Cinematic story, spectacular combat and a moving father–son bond.",
  "baldurs-gate-3": "A deep turn-based RPG set in the Dungeons & Dragons universe. Meaningful choices, surprising companions and a sprawling story.",
  "hades-2": "A fast, polished action roguelike with stunning art, great music and an addictive loop. Play as Melinoë, Princess of the Underworld.",
  "cyberpunk-2077-pl": "A story expansion for Cyberpunk 2077 with a tense political-espionage plot in a new Night City district, alongside V and a new player — Solomon Reed.",
  "zelda-totk": "Link explores the skies of Hyrule and the depths below in a remarkably creative open game with new building and puzzle-solving systems.",
  "spiderman-2": "Peter Parker and Miles Morales team up against Venom and Kraven in a vibrant open New York with fast, spectacular traversal.",
  "starfield": "A massive space RPG with hundreds of planets to explore, ship building, outposts and a rich trade system, from the makers of Skyrim and Fallout.",
  "diablo-4": "Return to the dark world of Sanctuary with endless demon slaying, deep build crafting and ongoing seasonal content.",
  "street-fighter-6": "The legendary fighting series returns with a deep combat system, an open-world World Tour mode and an iconic roster.",
  "forza-horizon-5": "An open-world racer set in Mexico with changing seasons, hundreds of cars and an amazing driving feel.",
  "re4-remake": "A polished remake of one of the most important action-horror games ever, with modern graphics and improved gameplay.",
  "ff16": "A new chapter in the Final Fantasy series with a dark world, dynamic action combat and breathtaking summon battles.",
  "hogwarts-legacy": "Live the wizarding life at Hogwarts in the 1800s — learn spells, explore the castle and shape your own wizard's story.",
  "alan-wake-2": "Breathtaking psychological horror with striking visuals and a surreal plot that stays with you long after the credits.",
  "helldivers-2": "Chaotic, funny co-op to defend galactic democracy from aliens and robots, with heavy weapons and team strategy.",
  "persona-5-royal": "A highly stylish Japanese RPG blending everyday school life with raiding hidden dimensions as the Phantom Thieves.",
  "civilization-6": "Build an empire to stand the test of time — from the Stone Age to the Space Age — with deep, decisive turn-based strategy.",
  "stardew-valley": "Rebuild an abandoned farm, tend crops and animals, befriend the villagers and live a peaceful, addictive life.",
  "ea-fc-24": "The world's most popular football game with real leagues, career mode and Ultimate Team."
};

const PATTERNS = [
  [/^📦 (.*) · פתיחת הצ'קליסט ←$/, (m) => `📦 ${m[1]} · open checklist →`],
  [/^(\d+) פריטים לפי סדר יציאה(?: · (\d+) לא נמצאו)?$/, (m) => `${m[1]} items in release order${m[2] ? ` · ${m[2]} not found` : ""}`],
  [/^(\d+) (?:משחקים|פריטים) · (.*)$/, (m) => `${m[1]} items · ${tr(m[2])}`],
  [/^(\d+) משחקים$/, (m) => `${m[1]} games`], [/^(\d+) פריטים$/, (m) => `${m[1]} items`],
  [/^נוספו (\d+) פריטים לפי הסדר(?: · (\d+) לא נמצאו)?$/, (m) => `Added ${m[1]} items in order${m[2] ? ` · ${m[2]} not found` : ""}`],
  [/^\((\d+) מתוך (\d+) הושלמו\)$/, (m) => `(${m[1]} of ${m[2]} done)`],
  [/^🎮 משחקים \((\d+)\)$/, (m) => `🎮 Games (${m[1]})`], [/^🍿 סרטים וסדרות \((\d+)\)$/, (m) => `🍿 Movies & Series (${m[1]})`],
  [/^\((\d+) דירוגים\)$/, (m) => `(${m[1]} ratings)`],
  [/^בעוד (\d+) ימים$/, (m) => `in ${m[1]} days`],
  [/^יצא כבר$/, () => "Already out"], [/^יוצא היום!$/, () => "Out today!"], [/^יוצא מחר!$/, () => "Out tomorrow!"],
  [/^(\d+) תוצאות$/, (m) => `${m[1]} results`],
  [/^הכל \((\d+)\)$/, (m) => `All (${m[1]})`], [/^ממתינים \((\d+)\)$/, (m) => `Pending (${m[1]})`], [/^הושלמו \((\d+)\)$/, (m) => `Completed (${m[1]})`],
  [/^בקרוב \((\d+)\)$/, (m) => `Upcoming (${m[1]})`], [/^יצאו לאור \((\d+)\)$/, (m) => `Released (${m[1]})`],
  [/^(\d+) מתוך (\d+) הושלמו$/, (m) => `${m[1]} of ${m[2]} completed`],
  [/^(\d+) פריטים ברשימה$/, (m) => `${m[1]} items on the list`],
  [/^שלום, (.*)$/, (m) => `Hello, ${m[1]}`], [/^ברוך הבא, (.*)!$/, (m) => `Welcome, ${m[1]}!`],
  [/^רשימת המשאלות \((\d+)\)$/, (m) => `Wishlist (${m[1]})`],
  [/^יציאה: (.*?) \((.*)\)$/, (m) => `Releases: ${m[1]} (${tr(m[2])})`],
  [/^יצא ב-(.*)$/, (m) => `Released ${m[1]}`], [/^יוצא (.*)$/, (m) => `Releases ${m[1]}`],
  [/^🔔 (\d+) ימים לפני$/, (m) => `🔔 ${m[1]} days before`], [/^🔔 ביום היציאה$/, () => "🔔 On release day"],
  [/^(.*) יוצא בקרוב!$/, (m) => `${m[1]} is coming soon!`],
  [/^⭐ (.*)$/, null]
].filter((p) => p[1]);

const HEB = /[֐-׿]/;
function tr(s) {
  if (!IS_EN || !s || !HEB.test(s)) return s;
  const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
  const core = s.trim();
  if (EN[core]) return lead + EN[core] + trail;
  for (const [re, fn] of PATTERNS) {
    const m = core.match(re);
    if (m) return lead + fn(m) + trail;
  }
  if (core.includes(" · ")) return lead + core.split(" · ").map(tr).join(" · ") + trail;
  /* נפילה: החלפת מפתחות כתת-מחרוזות, הארוכים קודם */
  let out = core;
  Object.keys(EN).sort((a, b) => b.length - a.length).forEach((k) => {
    if (HEB.test(k) && out.includes(k)) out = out.split(k).join(EN[k]);
  });
  return lead + out + trail;
}
const t = tr;

function setText(n) {
  const v = tr(n.nodeValue);
  if (v !== n.nodeValue) n.nodeValue = v; /* בלי השמה זהה — אחרת הצופה נכנס ללולאה אינסופית */
}
function trNode(root) {
  if (!IS_EN) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach((n) => {
    if (n.parentNode && /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName)) return;
    if (HEB.test(n.nodeValue)) setText(n);
  });
  if (root.querySelectorAll) {
    root.querySelectorAll("[placeholder],[title]").forEach((el) => {
      ["placeholder", "title"].forEach((a) => {
        const v = el.getAttribute(a);
        if (v && HEB.test(v) && tr(v) !== v) el.setAttribute(a, tr(v));
      });
    });
  }
}
if (IS_EN) {
  document.addEventListener("DOMContentLoaded", () => {
    document.title = tr(document.title);
    trNode(document.body);
    new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) trNode(n);
          else if (n.nodeType === 3 && HEB.test(n.nodeValue)) setText(n);
        });
        if (m.type === "characterData" && HEB.test(m.target.nodeValue)) setText(m.target);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  });
}

/* תרגום נתוני ההדגמה (ז'אנרים, תגיות, תיאורים) */
if (typeof GAMES !== "undefined") {
  GAMES.forEach((g) => {
    if (IS_EN) {
      g.genres = g.genres.map(tr);
      g.tags = (g.tags || []).map(tr);
      if (DESC_EN[g.id]) g.description = DESC_EN[g.id];
    }
  });
}

/* ---------- מטבעות ---------- */
const RATES_KEY = "gh_rates";
const FALLBACK_RATES = { ILS: 3.7, EUR: 0.9 };
async function getRates() {
  const c = readJSONSafe(RATES_KEY);
  if (c && Date.now() - c.t < 12 * 3600 * 1000) return c.r;
  try {
    const r = await fetch("https://api.frankfurter.app/latest?from=USD&to=ILS,EUR").then((x) => x.json());
    if (r && r.rates && r.rates.ILS) {
      localStorage.setItem(RATES_KEY, JSON.stringify({ t: Date.now(), r: r.rates }));
      return r.rates;
    }
  } catch (e) {}
  return (c && c.r) || FALLBACK_RATES;
}
function readJSONSafe(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
/* מחיר בדולרים -> טקסט לפי שפה: עברית ₪, אנגלית $ + € */
function moneyHTML(usd, rates) {
  const n = Number(usd);
  if (!IS_EN) return `₪${Math.round(n * rates.ILS)}`;
  return `$${n.toFixed(2)} <small>· €${(n * rates.EUR).toFixed(2)}</small>`;
}
