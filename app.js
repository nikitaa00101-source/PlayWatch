/* ===========================================================
   PlayWatch — לוגיקת ליבה משותפת לכל הדפים
   אחסון מקומי (localStorage) — הדגמה בצד לקוח בלבד, ללא שרת.
   =========================================================== */

const LS_KEYS = {
  USERS: "gh_users",
  SESSION: "gh_session",
  WISHLIST: "gh_wishlist_", // + username
  CHECKLIST: "gh_checklist_", // + username
  NOTIF_PERMISSION_ASKED: "gh_notif_asked"
};

/* ---------------- Storage helpers ---------------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------- Auth ---------------- */
function getUsers() {
  return readJSON(LS_KEYS.USERS, {});
}
function saveUsers(users) {
  writeJSON(LS_KEYS.USERS, users);
}
function getCurrentUser() {
  return localStorage.getItem(LS_KEYS.SESSION);
}
function setCurrentUser(username) {
  localStorage.setItem(LS_KEYS.SESSION, username);
}
function logout() {
  localStorage.removeItem(LS_KEYS.SESSION);
  location.reload();
}
function registerUser(username, email, password) {
  const users = getUsers();
  const key = username.trim().toLowerCase();
  if (!key || !password) return { ok: false, error: "נא למלא את כל השדות" };
  if (users[key]) return { ok: false, error: "שם המשתמש כבר תפוס" };
  users[key] = { username: username.trim(), email: email.trim(), password };
  saveUsers(users);
  setCurrentUser(key);
  return { ok: true };
}
function loginUser(username, password) {
  const users = getUsers();
  const key = username.trim().toLowerCase();
  const user = users[key];
  if (!user || user.password !== password) {
    return { ok: false, error: "שם משתמש או סיסמה שגויים" };
  }
  setCurrentUser(key);
  return { ok: true };
}
function getUserDisplayName() {
  const key = getCurrentUser();
  if (!key) return null;
  const users = getUsers();
  return users[key] ? users[key].username : key;
}

/* ---------------- Wishlist / Checklist (per user) ---------------- */
function requireUserKey() {
  const key = getCurrentUser();
  return key; // null if not logged in
}
function getWishlist() {
  const key = requireUserKey();
  if (!key) return [];
  return readJSON(LS_KEYS.WISHLIST + key, []);
}
function saveWishlist(list) {
  const key = requireUserKey();
  if (!key) return;
  writeJSON(LS_KEYS.WISHLIST + key, list);
}
function isInWishlist(gameId) {
  return getWishlist().includes(gameId);
}
function toggleWishlist(gameId) {
  if (!getCurrentUser()) {
    openAuthModal();
    return null;
  }
  let list = getWishlist();
  let added;
  if (list.includes(gameId)) {
    list = list.filter((id) => id !== gameId);
    added = false;
  } else {
    list.push(gameId);
    added = true;
  }
  saveWishlist(list);
  refreshBadges();
  return added;
}

/* ---------------- Checklists (multiple, per world) ----------------
   [{id, name, world: "games"|"watch", items: {gameId: done}}] */
function migrateChecklists(key) {
  const mk = "gh_cl_" + key;
  const existing = localStorage.getItem(mk);
  if (existing) return JSON.parse(existing);
  const out = [];
  const split = (name, ids, doneMap) => {
    const g = { games: {}, watch: {} };
    ids.forEach((id) => {
      const w = worldOf(findGame(id)) ;
      g[w][id] = !!(doneMap && doneMap[id]);
    });
    const both = Object.keys(g.games).length && Object.keys(g.watch).length;
    if (Object.keys(g.games).length) out.push({ id: "c" + out.length + Date.now(), name: both ? name + " (משחקים)" : name, world: "games", items: g.games });
    if (Object.keys(g.watch).length) out.push({ id: "c" + out.length + Date.now(), name: both ? name + " (סרטים וסדרות)" : name, world: "watch", items: g.watch });
  };
  const old = readJSON(LS_KEYS.CHECKLIST + key, {});
  if (Object.keys(old).length) split("המעקב שלי", Object.keys(old), old);
  readJSON("gh_lists_" + key, []).forEach((l) => split(l.name, l.games, null));
  writeJSON(mk, out);
  return out;
}
function getChecklists() {
  const key = requireUserKey();
  return key ? migrateChecklists(key) : [];
}
function saveChecklists(arr) {
  const key = requireUserKey();
  if (key) writeJSON("gh_cl_" + key, arr);
}
function createChecklist(name, world) {
  name = (name || "").trim();
  if (!name) return null;
  const all = getChecklists();
  const c = { id: "c" + Date.now(), name, world: world === "watch" ? "watch" : "games", items: {}, order: [] };
  all.push(c);
  saveChecklists(all);
  return c;
}
function deleteChecklist(id) {
  saveChecklists(getChecklists().filter((c) => c.id !== id));
}
function addToChecklistById(clId, gameId) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  const g = findGame(gameId);
  if (!c || !g || worldOf(g) !== c.world) return false;
  if (!(gameId in c.items)) {
    c.items[gameId] = false;
    c.order = clOrder(c).filter((x) => x !== gameId).concat(gameId);
  }
  saveChecklists(all);
  return true;
}
/* סדר הפריטים בצ'קליסט (מערך מפורש — לא תלוי בסדר מפתחות האובייקט) */
function clOrder(c) {
  const keys = Object.keys(c.items);
  const ord = (c.order || []).filter((id) => id in c.items);
  keys.forEach((k) => { if (!ord.includes(k)) ord.push(k); });
  return ord;
}
/* מוסיף כמה פריטים לפי הסדר שניתן (לא מזיז פריטים שכבר קיימים). מחזיר כמה נוספו */
function addManyToChecklist(clId, ids, origin) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c) return 0;
  let n = 0;
  const ord = clOrder(c);
  ids.forEach((id) => {
    const g = findGame(id);
    if (!g || worldOf(g) !== c.world || id in c.items) return;
    c.items[id] = false;
    ord.push(id);
    n++;
  });
  c.order = ord;
  if (origin) c.origin = origin;
  saveChecklists(all);
  return n;
}
function moveItem(clId, gameId, delta) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c) return;
  const ord = clOrder(c);
  const i = ord.indexOf(gameId), j = i + delta;
  if (i < 0 || j < 0 || j >= ord.length) return;
  [ord[i], ord[j]] = [ord[j], ord[i]];
  c.order = ord;
  saveChecklists(all);
}
function setChecklistOrder(clId, ids) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c) return;
  const rest = clOrder(c).filter((id) => !ids.includes(id));
  c.order = ids.filter((id) => id in c.items).concat(rest);
  delete c.prevOrder;
  saveChecklists(all);
}
function shuffleChecklist(clId) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c) return;
  const ord = clOrder(c);
  c.prevOrder = ord.slice();
  for (let i = ord.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ord[i], ord[j]] = [ord[j], ord[i]];
  }
  c.order = ord;
  saveChecklists(all);
}
function undoShuffle(clId) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c || !c.prevOrder) return;
  c.order = c.prevOrder.filter((id) => id in c.items);
  delete c.prevOrder;
  saveChecklists(all);
}
function resetToOrigin(clId) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c || !c.origin) return;
  const rest = clOrder(c).filter((id) => !c.origin.includes(id));
  c.prevOrder = clOrder(c);
  c.order = c.origin.filter((id) => id in c.items).concat(rest);
  saveChecklists(all);
}
function removeFromChecklistById(clId, gameId) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (c) {
    delete c.items[gameId];
    c.order = (c.order || []).filter((x) => x !== gameId);
  }
  saveChecklists(all);
}
function toggleDone(clId, gameId) {
  const all = getChecklists();
  const c = all.find((x) => x.id === clId);
  if (!c || !(gameId in c.items)) return false;
  c.items[gameId] = !c.items[gameId];
  saveChecklists(all);
  return c.items[gameId];
}

function removeFromWishlist(gameId) {
  let list = getWishlist().filter((id) => id !== gameId);
  saveWishlist(list);
  refreshBadges();
}

/* ---------------- Utilities ---------------- */
function worldOf(g) {
  return g && (g.kind === "movie" || g.kind === "series") ? "watch" : "games";
}
function kindLabel(g) {
  return g.kind === "series" ? "📺 סדרה" : g.kind === "movie" ? "🎬 סרט" : "🎮 משחק";
}
function findGame(id) {
  return GAMES.find((g) => g.id === id);
}
function formatPrice(p) {
  return p === null || p === undefined ? null : `₪${p}`;
}
function cheapestPrice(game) {
  const valid = game.prices.filter((p) => p.price !== null);
  if (!valid.length) return null;
  return valid.reduce((min, p) => (p.price < min.price ? p : min), valid[0]);
}
function todayDate() {
  return new Date();
}
function daysUntil(dateStr) {
  const today = todayDate();
  const target = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}
function formatDateHe(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(IS_EN ? "en-US" : "he-IL", { day: "numeric", month: "long", year: "numeric" });
}
function relativeCountdownLabel(dateStr) {
  const days = daysUntil(dateStr);
  if (days < 0) return "יצא כבר";
  if (days === 0) return "יוצא היום!";
  if (days === 1) return "יוצא מחר!";
  return `בעוד ${days} ימים`;
}

/* ---------------- Toast ---------------- */
function showToast(message, icon) {
  let toast = document.getElementById("gh-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "gh-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>${icon || "✅"}</span><span>${tr(message)}</span>`;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------- Navbar rendering ---------------- */
function renderNavbar(activePage) {
  const mount = document.getElementById("navbar-mount");
  if (!mount) return;
  const user = getCurrentUser();
  const displayName = getUserDisplayName();
  const wishlistCount = user ? getWishlist().length : 0;
  const upcomingNotifs = user ? getUpcomingWishlistNotifications() : [];

  const navItem = (href, label, key) =>
    `<a class="nav-link ${activePage === key ? "active" : ""}" href="${href}">${label}</a>`;

  mount.innerHTML = `
    <nav class="navbar">
      <div class="navbar-inner">
        <div class="brand">
          <a class="brand-mark" href="index.html" title="Home" style="text-decoration:none;">🎮</a>
          <span class="brand-word"><a class="bw-play" href="games.html" title="Games">Play</a><a class="bw-watch" href="watch.html" title="Movies &amp; Series">Watch</a></span>
        </div>
        <div class="nav-links">
          ${navItem("index.html", "🏠 בית", "home")}
          ${navItem("games.html", "🎮 משחקים", "games")}
          ${navItem("watch.html", "🍿 סרטים וסדרות", "watch")}
          ${navItem("wishlist.html", "רשימת המשאלות", "wishlist")}
          ${navItem("checklist.html", "הצ'קליסט שלי", "checklist")}
          ${navItem("franchises.html", "📦 מוכנים", "franchises")}
        </div>
        <div class="nav-right">
          <button class="btn btn-primary btn-sm" id="install-btn" style="display:none;" onclick="installApp()">📲 התקנה</button>
          <button class="btn btn-ghost btn-sm" onclick="setLang('${IS_EN ? "he" : "en"}')" title="Language">${IS_EN ? "עברית ₪" : "EN $ €"}</button>
          ${user ? `
            <div class="dropdown" id="notif-dropdown">
              <button class="icon-btn" id="notif-btn" title="התראות">
                🔔
                ${upcomingNotifs.length ? `<span class="badge-dot">${upcomingNotifs.length}</span>` : ""}
              </button>
              <div class="dropdown-panel" id="notif-panel">
                <div class="dropdown-header">התראות יציאה קרובות</div>
                ${
                  upcomingNotifs.length
                    ? upcomingNotifs
                        .map(
                          (g) => `
                    <a class="notif-item" href="game.html?id=${g.id}">
                      <div class="notif-icon" style="background:linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})">${g.icon}</div>
                      <div class="notif-text">
                        <div class="notif-title">${g.title}</div>
                        <div class="notif-sub">${relativeCountdownLabel(g.releaseDate)} · ${formatDateHe(g.releaseDate)}</div>
                      </div>
                    </a>`
                        )
                        .join("")
                    : `<div class="empty-note">אין יציאות קרובות מרשימת המשאלות שלך כרגע</div>`
                }
                <div style="padding:10px;border-top:1px solid var(--border);margin-top:6px;">
                  <button class="btn btn-outline btn-sm btn-block" id="enable-notif-btn">🔔 הפעלת התראות דפדפן</button>
                </div>
              </div>
            </div>
            <div class="dropdown" id="user-dropdown">
              <button class="icon-btn" id="user-btn" title="${displayName}">👤</button>
              <div class="dropdown-panel" id="user-panel" style="width:220px;">
                <div class="dropdown-header">שלום, ${displayName}</div>
                <a class="nav-link" href="wishlist.html" style="display:block;">רשימת המשאלות (${wishlistCount})</a>
                <a class="nav-link" href="checklist.html" style="display:block;">הצ'קליסט שלי</a>
                <div style="padding:10px;">
                  <button class="btn btn-danger btn-sm btn-block" onclick="logout()">התנתקות</button>
                </div>
              </div>
            </div>
          ` : `
            <button class="btn btn-ghost btn-sm" onclick="openAuthModal('login')">התחברות</button>
            <button class="btn btn-primary btn-sm" onclick="openAuthModal('register')">הרשמה</button>
          `}
        </div>
      </div>
    </nav>
    <nav class="bottom-nav">
      <a href="index.html" class="${activePage === "home" ? "active" : ""}"><span>🏠</span>בית</a>
      <a href="games.html" class="${activePage === "games" ? "active" : ""}"><span>🎮</span>משחקים</a>
      <a href="watch.html" class="${activePage === "watch" ? "active" : ""}"><span>🍿</span>צפייה</a>
      <a href="checklist.html" class="${activePage === "checklist" ? "active" : ""}"><span>✅</span>צ'קליסט</a>
      <a href="franchises.html" class="${activePage === "franchises" ? "active" : ""}"><span>📦</span>מוכנים</a>
    </nav>
  `;

  if (user) {
    const notifBtn = document.getElementById("notif-btn");
    const notifPanel = document.getElementById("notif-panel");
    const userBtn = document.getElementById("user-btn");
    const userPanel = document.getElementById("user-panel");

    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle("open");
      userPanel.classList.remove("open");
    });
    const enableNotifBtn = document.getElementById("enable-notif-btn");
    if (enableNotifBtn) {
      enableNotifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        requestBrowserNotifications();
      });
    }
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userPanel.classList.toggle("open");
      notifPanel.classList.remove("open");
    });
    document.addEventListener("click", () => {
      notifPanel.classList.remove("open");
      userPanel.classList.remove("open");
    });
  }
}

function refreshBadges() {
  const active = document.querySelector(".nav-link.active");
  const key = active ? active.getAttribute("href").replace(".html", "") : null;
  renderNavbar(key === "index" ? "home" : key);
}

/* ---------------- Upcoming release notifications ---------------- */
/* ---------------- Custom lists ---------------- */
function getLists() {
  const key = requireUserKey();
  return key ? readJSON("gh_lists_" + key, []) : [];
}
function saveLists(lists) {
  const key = requireUserKey();
  if (key) writeJSON("gh_lists_" + key, lists);
}
function createList(name) {
  name = (name || "").trim();
  if (!name) return null;
  const lists = getLists();
  const list = { id: "l" + Date.now(), name, games: [] };
  lists.push(list);
  saveLists(lists);
  return list;
}
function deleteList(listId) {
  saveLists(getLists().filter((l) => l.id !== listId));
}
function toggleGameInList(listId, gameId) {
  const lists = getLists();
  const l = lists.find((x) => x.id === listId);
  if (!l) return false;
  const i = l.games.indexOf(gameId);
  if (i >= 0) l.games.splice(i, 1);
  else l.games.push(gameId);
  saveLists(lists);
  return i < 0;
}

/* ---------------- Per-game reminders ----------------
   value = days before release (0 = on release day), or absent = no reminder */
function getReminders() {
  const key = requireUserKey();
  return key ? readJSON("gh_reminders_" + key, {}) : {};
}
function setReminder(gameId, daysBefore) {
  const key = requireUserKey();
  if (!key) return;
  const r = getReminders();
  if (daysBefore === null || daysBefore === "") delete r[gameId];
  else r[gameId] = Number(daysBefore);
  writeJSON("gh_reminders_" + key, r);
  localStorage.removeItem(`gh_notified_${key}_${gameId}`);
  refreshBadges();
}

function getUpcomingWishlistNotifications() {
  const ids = Array.from(new Set([...getWishlist(), ...Object.keys(getReminders())]));
  return ids
    .map((id) => findGame(id))
    .filter((g) => g && g.status === "upcoming" && daysUntil(g.releaseDate) >= 0)
    .sort((a, b) => daysUntil(a.releaseDate) - daysUntil(b.releaseDate));
}

function maybeFireBrowserNotifications() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const reminders = getReminders();
  const soon = getUpcomingWishlistNotifications().filter((g) => {
    const lead = g.id in reminders ? reminders[g.id] : 7;
    return daysUntil(g.releaseDate) <= lead;
  });
  soon.forEach((g) => {
    const firedKey = `gh_notified_${getCurrentUser()}_${g.id}`;
    if (localStorage.getItem(firedKey)) return;
    new Notification(IS_EN ? `${g.title} is coming soon!` : `${g.title} יוצא בקרוב!`, {
      body: `${tr(relativeCountdownLabel(g.releaseDate))} · ${formatDateHe(g.releaseDate)}`,
      icon: undefined
    });
    localStorage.setItem(firedKey, "1");
  });
}

function requestBrowserNotifications() {
  if (!("Notification" in window)) {
    showToast("הדפדפן שלך לא תומך בהתראות", "⚠️");
    return;
  }
  Notification.requestPermission().then((perm) => {
    if (perm === "granted") {
      showToast("התראות דפדפן הופעלו בהצלחה", "🔔");
      maybeFireBrowserNotifications();
    } else {
      showToast("ההתראות נדחו", "🚫");
    }
  });
}

/* ---------------- Auth Modal (injected once per page) ---------------- */
function ensureAuthModalMounted() {
  if (document.getElementById("auth-modal-overlay")) return;
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="modal-overlay" id="auth-modal-overlay">
      <div class="modal-box">
        <span class="modal-close" id="auth-modal-close">✕</span>
        <div id="auth-modal-body"></div>
      </div>
    </div>
  `;
  document.body.appendChild(div.firstElementChild);
  document.getElementById("auth-modal-close").addEventListener("click", closeAuthModal);
  document.getElementById("auth-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "auth-modal-overlay") closeAuthModal();
  });
}

function openAuthModal(mode) {
  ensureAuthModalMounted();
  renderAuthModal(mode || "login");
  document.getElementById("auth-modal-overlay").classList.add("open");
}
function closeAuthModal() {
  const el = document.getElementById("auth-modal-overlay");
  if (el) el.classList.remove("open");
}

function renderAuthModal(mode) {
  const body = document.getElementById("auth-modal-body");
  if (mode === "register") {
    body.innerHTML = `
      <h2>יצירת חשבון</h2>
      <p class="modal-sub">הצטרפו כדי לנהל רשימות משאלות וצ'קליסטים</p>
      <div class="field-group">
        <label>שם משתמש</label>
        <input type="text" id="reg-username" placeholder="הכינוי שלך" />
      </div>
      <div class="field-group">
        <label>אימייל</label>
        <input type="email" id="reg-email" placeholder="you@example.com" />
      </div>
      <div class="field-group">
        <label>סיסמה</label>
        <input type="password" id="reg-password" placeholder="לפחות 4 תווים" />
      </div>
      <div class="form-error" id="auth-error"></div>
      <button class="btn btn-primary btn-block" id="reg-submit">הרשמה</button>
      <div class="modal-switch">כבר יש לך חשבון? <a id="switch-to-login">התחברות</a></div>
    `;
    document.getElementById("switch-to-login").addEventListener("click", () => renderAuthModal("login"));
    document.getElementById("reg-submit").addEventListener("click", () => {
      const username = document.getElementById("reg-username").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const res = registerUser(username, email, password);
      showAuthResult(res);
    });
  } else {
    body.innerHTML = `
      <h2>התחברות</h2>
      <p class="modal-sub">ברוכים השבים ל-PlayWatch</p>
      <div class="field-group">
        <label>שם משתמש</label>
        <input type="text" id="login-username" placeholder="שם המשתמש שלך" />
      </div>
      <div class="field-group">
        <label>סיסמה</label>
        <input type="password" id="login-password" placeholder="הסיסמה שלך" />
      </div>
      <div class="form-error" id="auth-error"></div>
      <button class="btn btn-primary btn-block" id="login-submit">התחברות</button>
      <div class="modal-switch">אין לך חשבון עדיין? <a id="switch-to-register">הרשמה</a></div>
    `;
    document.getElementById("switch-to-register").addEventListener("click", () => renderAuthModal("register"));
    document.getElementById("login-submit").addEventListener("click", () => {
      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;
      const res = loginUser(username, password);
      showAuthResult(res);
    });
  }
}

function showAuthResult(res) {
  const err = document.getElementById("auth-error");
  if (res.ok) {
    closeAuthModal();
    showToast(`ברוך הבא, ${getUserDisplayName()}!`, "👋");
    setTimeout(() => location.reload(), 400);
  } else {
    err.textContent = res.error;
    err.classList.add("show");
  }
}

/* ---------------- Init on every page ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  ensureAuthModalMounted();
  if (getCurrentUser()) {
    setTimeout(maybeFireBrowserNotifications, 1200);
  }
});


/* ===========================================================
   RAWG — קטלוג אמיתי (משחקים, תאריכי יציאה, תמונות)
   =========================================================== */
const RAWG_BASE = "https://api.rawg.io/api";
const RAWG_CACHE_KEY = "gh_rawg_cache_" + LANG;
const GRADIENTS = [["#1e3a8a", "#3b82f6"], ["#312e81", "#6366f1"], ["#0f766e", "#22d3ee"], ["#7c2d12", "#f97316"], ["#4c1d95", "#a855f7"], ["#14532d", "#22c55e"]];

function mapRawgGame(g) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = g.tba || !g.released || g.released > today;
  return {
    id: "r" + g.id,
    real: true,
    title: g.name,
    genres: (g.genres || []).map((x) => (IS_EN ? x.name : RAWG_GENRE_HE[x.name] || x.name)),
    platforms: (g.parent_platforms || []).map((p) => p.platform.name),
    developer: "",
    publisher: "",
    rating: g.metacritic ? Math.round(g.metacritic) / 10 : g.rating ? Math.round(g.rating * 20) / 10 : null,
    releaseDate: g.released || "2099-12-31",
    status: upcoming ? "upcoming" : "released",
    icon: "🎮",
    image: g.background_image || null,
    gradient: GRADIENTS[g.id % GRADIENTS.length],
    description: "",
    tags: [],
    prices: []
  };
}

function rawgCache() {
  return readJSON(RAWG_CACHE_KEY, {});
}
function addRealGames(list) {
  const cache = rawgCache();
  list.forEach((g) => {
    cache[g.id] = Object.assign({}, cache[g.id] || {}, g);
    const i = GAMES.findIndex((x) => x.id === g.id);
    if (i >= 0) GAMES[i] = cache[g.id];
    else GAMES.push(cache[g.id]);
  });
  try {
    writeJSON(RAWG_CACHE_KEY, cache);
  } catch (e) {
    /* storage full — keep in memory only */
  }
}
function hydrateRawgCache() {
  Object.values(rawgCache()).forEach((g) => {
    if (!GAMES.some((x) => x.id === g.id)) GAMES.push(g);
  });
}
/* מפתחות API לא נמצאים בקוד האתר.
   - באתר מפורסם: הבקשות עוברות ל-/api (פונקציית שרת שמחזיקה את המפתחות).
   - בפיתוח מקומי בלבד: קובץ config.local.js (לא מועלה לשרת) מגדיר window.PW_KEYS = { rawg, tmdb }. */
const PW_KEYS = window.PW_KEYS || {};
async function rawgFetch(path, params) {
  const q = new URLSearchParams(params || {});
  let url;
  if (PW_KEYS.rawg) { q.set("key", PW_KEYS.rawg); url = `${RAWG_BASE}${path}?${q}`; }
  else url = `/api/rawg${path}?${q}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("RAWG " + r.status);
  return r.json();
}
async function loadRealCatalog() {
  const d = new Date();
  const from = d.toISOString().slice(0, 10);
  d.setFullYear(d.getFullYear() + 1);
  const to = d.toISOString().slice(0, 10);
  const [popular, soon] = await Promise.all([
    rawgFetch("/games", { ordering: "-added", page_size: 40 }),
    rawgFetch("/games", { dates: `${from},${to}`, ordering: "-added", page_size: 40 })
  ]);
  addRealGames([...popular.results, ...soon.results].map(mapRawgGame));
}
async function searchRealGames(term) {
  const res = await rawgFetch("/games", { search: term, page_size: 20, search_precise: true });
  addRealGames(res.results.map(mapRawgGame));
}
/* משלים תיאור ומפתח מלא לעמוד המשחק */
async function ensureRawgGame(id) {
  const rid = id.slice(1);
  let g = findGame(id);
  if (g && g.detailed) return g;
  const d = await rawgFetch("/games/" + rid);
  const base = mapRawgGame(d);
  base.description = (d.description_raw || "").slice(0, 900);
  base.developer = (d.developers || []).map((x) => x.name).join(", ");
  base.publisher = (d.publishers || []).map((x) => x.name).join(", ");
  base.tags = (d.tags || []).slice(0, 8).map((t) => t.name);
  base.website = d.website || "";
  base.stores = (d.stores || []).map((s) => ({ name: s.store.name, url: s.url }));
  base.detailed = true;
  addRealGames([base]);
  return findGame(id);
}
hydrateRawgCache();

/* ===========================================================
   TMDB — סרטים וסדרות (כותרות בעברית, פוסטרים, איפה לצפות)
   =========================================================== */
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/";
const TMDB_CACHE_KEY = "gh_tmdb_cache_" + LANG;
const TMDB_GENRES_EN = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics" };
const TMDB_GENRES_HE = { 28: "אקשן", 12: "הרפתקאות", 16: "אנימציה", 35: "קומדיה", 80: "פשע", 99: "תיעודי", 18: "דרמה", 10751: "משפחה", 14: "פנטזיה", 36: "היסטוריה", 27: "אימה", 10402: "מוזיקה", 9648: "מסתורין", 10749: "רומנטי", 878: "מדע בדיוני", 10770: "סרט טלוויזיה", 53: "מתח", 10752: "מלחמה", 37: "מערבון", 10759: "אקשן והרפתקאות", 10762: "ילדים", 10763: "חדשות", 10764: "ריאליטי", 10765: "מדע בדיוני ופנטזיה", 10766: "אופרת סבון", 10767: "אורח", 10768: "מלחמה ופוליטיקה" };

function mapTmdbItem(it, forcedType) {
  const type = forcedType || it.media_type; // "movie" | "tv"
  const isTv = type === "tv";
  const date = (isTv ? it.first_air_date : it.release_date) || "";
  const today = new Date().toISOString().slice(0, 10);
  const genres = it.genres ? it.genres.map((x) => x.name) : (it.genre_ids || []).map((i) => (IS_EN ? TMDB_GENRES_EN : TMDB_GENRES_HE)[i]).filter(Boolean);
  return {
    id: (isTv ? "t" : "m") + it.id,
    real: true,
    kind: isTv ? "series" : "movie",
    title: (isTv ? it.name : it.title) || "",
    orig: (isTv ? it.original_name : it.original_title) || "",
    genres,
    platforms: [],
    developer: "",
    publisher: "",
    rating: it.vote_average ? Math.round(it.vote_average * 10) / 10 : null,
    releaseDate: date || "2099-12-31",
    status: !date || date > today ? "upcoming" : "released",
    icon: isTv ? "📺" : "🎬",
    image: it.poster_path ? TMDB_IMG + "w500" + it.poster_path : null,
    gradient: GRADIENTS[it.id % GRADIENTS.length],
    description: it.overview || "",
    tags: [],
    prices: []
  };
}
function addTmdbItems(list) {
  const cache = readJSON(TMDB_CACHE_KEY, {});
  list.forEach((g) => {
    cache[g.id] = Object.assign({}, cache[g.id] || {}, g);
    const i = GAMES.findIndex((x) => x.id === g.id);
    if (i >= 0) GAMES[i] = cache[g.id];
    else GAMES.push(cache[g.id]);
  });
  try {
    writeJSON(TMDB_CACHE_KEY, cache);
  } catch (e) {}
}
function hydrateTmdbCache() {
  Object.values(readJSON(TMDB_CACHE_KEY, {})).forEach((g) => {
    if (!GAMES.some((x) => x.id === g.id)) GAMES.push(g);
  });
}
async function tmdbFetch(path, params) {
  const q = new URLSearchParams(Object.assign({ language: IS_EN ? "en-US" : "he-IL" }, params || {}));
  let url;
  if (PW_KEYS.tmdb) { q.set("api_key", PW_KEYS.tmdb); url = `${TMDB_BASE}${path}?${q}`; }
  else url = `/api/tmdb${path}?${q}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("TMDB " + r.status);
  return r.json();
}
async function loadTmdbCatalog() {
  const today = new Date().toISOString().slice(0, 10);
  const [trend, upM, upT, popT] = await Promise.all([
    tmdbFetch("/trending/all/week"),
    tmdbFetch("/discover/movie", { "primary_release_date.gte": today, sort_by: "popularity.desc", region: IS_EN ? "US" : "IL" }),
    tmdbFetch("/discover/tv", { "first_air_date.gte": today, sort_by: "popularity.desc" }),
    tmdbFetch("/tv/popular")
  ]);
  const items = [
    ...trend.results.filter((x) => x.media_type === "movie" || x.media_type === "tv").map((x) => mapTmdbItem(x)),
    ...upM.results.map((x) => mapTmdbItem(x, "movie")),
    ...upT.results.map((x) => mapTmdbItem(x, "tv")),
    ...popT.results.map((x) => mapTmdbItem(x, "tv"))
  ];
  addTmdbItems(items);
}
async function searchTmdb(term) {
  const res = await tmdbFetch("/search/multi", { query: term });
  addTmdbItems(res.results.filter((x) => x.media_type === "movie" || x.media_type === "tv").map((x) => mapTmdbItem(x)));
}
/* פרטים מלאים + איפה לצפות בישראל */
async function ensureTmdbItem(id) {
  const g0 = findGame(id);
  if (g0 && g0.detailed) return g0;
  const type = id[0] === "t" ? "tv" : "movie";
  const d = await tmdbFetch(`/${type}/${id.slice(1)}`, { append_to_response: "watch/providers" });
  const base = mapTmdbItem(d, type);
  const il = ((d["watch/providers"] || {}).results || {})[IS_EN ? "US" : "IL"] || {};
  const names = (arr) => (arr || []).map((p) => p.provider_name);
  base.watch = { link: il.link || "", stream: names(il.flatrate), rent: names(il.rent), buy: names(il.buy) };
  base.detailed = true;
  addTmdbItems([base]);
  return findGame(id);
}
hydrateTmdbCache();

/* תמונות למשחקי ההדגמה המקוריים — נשלפות מ-RAWG לפי שם ונשמרות במטמון */
const MOCK_IMG_KEY = "gh_mock_images";
function applyMockImages() {
  const c = readJSON(MOCK_IMG_KEY, {});
  GAMES.forEach((g) => {
    if (!g.real && c[g.id]) g.image = c[g.id];
  });
}
async function enrichMockImages() {
  const c = readJSON(MOCK_IMG_KEY, {});
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const todo = GAMES.filter((g) => !g.real && !g.image && !(g.id in c));
  for (const g of todo) {
    try {
      const res = await rawgFetch("/games", { search: g.title, page_size: 3, search_precise: true });
      const hit = res.results.find((r) => r.background_image && (norm(r.name).includes(norm(g.title)) || norm(g.title).includes(norm(r.name))));
      c[g.id] = hit ? hit.background_image : "";
    } catch (e) {
      return;
    }
    writeJSON(MOCK_IMG_KEY, c);
    g.image = c[g.id] || g.image;
  }
  applyMockImages();
}
applyMockImages();


/* ===========================================================
   דירוג PlayWatch — דירוג קהילתי מקומי (1–5 כוכבים)
   נקודת פתיחה: הדירוג הקיים (0–10) חלקי 2, כאילו הוא PRIOR_WEIGHT הצבעות.
   כל הצבעה של משתמש מזיזה את הממוצע. (הצבעות נשמרות בדפדפן — אין שרת.)
   =========================================================== */
const VOTES_KEY = "gh_votes";
const PRIOR_WEIGHT = 5;
const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function getVotes() { return readJSON(VOTES_KEY, {}); }
function getMyVote(id) {
  const u = getCurrentUser();
  return u ? (getVotes()[id] || {})[u] || 0 : 0;
}
function rateItem(id, stars) {
  const u = getCurrentUser();
  if (!u) { openAuthModal(); return false; }
  const v = getVotes();
  v[id] = v[id] || {};
  v[id][u] = stars;
  writeJSON(VOTES_KEY, v);
  return true;
}
/* {avg: 0–5 | null, count: מספר מצביעים אמיתיים} */
function siteRating(g) {
  const votes = Object.values(getVotes()[g.id] || {});
  const n = votes.length;
  const sum = votes.reduce((a, b) => a + b, 0);
  const prior = g.rating ? g.rating / 2 : null;
  if (prior === null) return { avg: n ? sum / n : null, count: n };
  return { avg: (prior * PRIOR_WEIGHT + sum) / (PRIOR_WEIGHT + n), count: n };
}
function starSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
}
/* כוכבים להצגה (עם שבר) */
function starsHTML(avg, size) {
  size = size || 18;
  const five = starSVG(size).repeat(5);
  const pct = avg ? Math.max(0, Math.min(100, (avg / 5) * 100)) : 0;
  return `<span class="pw-stars" dir="ltr"><span class="pw-base">${five}</span><span class="pw-fill" style="width:${pct}%">${five}</span></span>`;
}
/* כוכבים ללחיצה */
function rateStarsHTML(id, size) {
  const mine = getMyVote(id);
  return `<span class="pw-rate" dir="ltr">${[1, 2, 3, 4, 5]
    .map((i) => `<button type="button" class="pw-star ${i <= mine ? "on" : ""}" data-star="${i}" title="${i}">${starSVG(size || 26)}</button>`)
    .join("")}</span>`;
}
function ensureStarDefs() {
  if (document.getElementById("pw-defs")) return;
  const d = document.createElement("div");
  d.id = "pw-defs";
  d.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
  d.innerHTML = '<svg width="0" height="0"><defs><linearGradient id="pwStarGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0.5" stop-color="#3b82f6"/><stop offset="0.5" stop-color="#a855f7"/></linearGradient></defs></svg>';
  document.body.appendChild(d);
}
document.addEventListener("DOMContentLoaded", ensureStarDefs);
function siteRatingLineHTML(g) {
  const r = siteRating(g);
  return r.avg
    ? `${starsHTML(r.avg, 18)} <b>${r.avg.toFixed(1)}</b> <span style="color:var(--text-faint);font-size:13px;">(${r.count} דירוגים)</span>`
    : `<span style="color:var(--text-faint);">אין דירוגים עדיין</span>`;
}


/* ===========================================================
   PWA — התקנה כאפליקציה + service worker
   =========================================================== */
let deferredInstall = null;
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstall = e;
  const b = document.getElementById("install-btn");
  if (b) b.style.display = "";
});
window.addEventListener("appinstalled", () => {
  deferredInstall = null;
  const b = document.getElementById("install-btn");
  if (b) b.style.display = "none";
});
async function installApp() {
  if (deferredInstall) {
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
  } else if (isIOS()) {
    alert(tr("באייפון: לחצו על כפתור השיתוף (ריבוע עם חץ) ואז 'הוסף למסך הבית'."));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const b = document.getElementById("install-btn");
  if (b && !isStandalone() && isIOS()) b.style.display = "";
});
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
