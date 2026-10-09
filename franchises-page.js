/* ===========================================================
   צ'קליסטים מוכנים — franchises.html
   ללא פרמטר: גלריית פרנצ'ייזים. ?f=<id>: תצוגה מקדימה של הפרנצ'ייז + הוספה.
   =========================================================== */
let frBusy = false;

function existingSelectHTML(f, all, attr) {
  const mine = all.filter((c) => c.world === f.world);
  return `<select class="filter-select" ${attr}>
    <option value="">${mine.length ? "להוסיף לצ'קליסט קיים..." : getCurrentUser() ? "אין צ'קליסט מתאים — צרו חדש" : "התחברו כדי להוסיף"}</option>
    ${mine.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select>`;
}
async function addToExisting(f, targetId) {
  if (!getCurrentUser()) return openAuthModal();
  if (frBusy || !targetId) return;
  frBusy = true;
  showToast("טוען את הפריטים... זה יכול לקחת כמה שניות", "⏳");
  try {
    const { found, missing } = await resolveFranchise(f);
    const n = addManyToChecklist(targetId, found, found);
    showToast(`נוספו ${n} פריטים לפי הסדר${missing ? ` · ${missing} לא נמצאו` : ""}`, "📦");
  } finally {
    frBusy = false;
  }
}
function frName(f) { return IS_EN ? f.nameEn : f.name; }
function frDesc(f) { return IS_EN ? f.descEn : f.desc; }

async function renderFranchiseGallery() {
  const main = document.getElementById("fr-main");
  const mineAll = getCurrentUser() ? getChecklists() : [];
  const card = (f) => `
    <div class="fr-card ${f.world}">
      <a href="franchises.html?f=${f.id}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:10px;">
        <div class="fr-top"><span data-emblem="${f.id}">${emblemHTML(readJSON(FR_LOGO_CACHE, {})[f.id])}</span>
          <div><div class="fr-name">${frName(f)}</div><div class="fr-desc">${frDesc(f)}</div></div></div>
        <div class="fr-count">${f.entries.length} ${f.world === "games" ? "משחקים" : "פריטים"} · ${f.world === "games" ? "🎮 משחקים" : "🍿 סרטים וסדרות"}</div>
      </a>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a class="btn btn-primary btn-sm" href="franchises.html?f=${f.id}">👁 צפייה בצ'קליסט ←</a>
        ${existingSelectHTML(f, mineAll, `data-fr-add="${f.id}"`)}
      </div>
    </div>`;
  main.innerHTML = `
    <div class="page-header">
      <h1>צ'קליסטים מוכנים 📦</h1>
      <p>פרנצ'ייזים מוכנים לפי סדר יציאה. פתחו כדי לראות את כל הפריטים, ואז הוסיפו לצ'קליסט חדש או קיים.</p>
    </div>
    <h2 class="section-title">🍿 סרטים וסדרות</h2>
    <div class="fr-grid">${FRANCHISES.filter((f) => f.world === "watch").map(card).join("")}</div>
    <h2 class="section-title" style="margin-top:34px;">🎮 משחקים</h2>
    <div class="fr-grid">${FRANCHISES.filter((f) => f.world === "games").map(card).join("")}</div>`;
  main.querySelectorAll("[data-fr-add]").forEach((sel) =>
    sel.addEventListener("change", async () => {
      const f = FRANCHISES.find((x) => x.id === sel.getAttribute("data-fr-add"));
      const v = sel.value;
      await addToExisting(f, v);
      sel.value = "";
    })
  );
  for (const f of FRANCHISES) {
    franchiseEmblem(f).then((e) => {
      const slot = main.querySelector(`[data-emblem="${f.id}"]`);
      if (slot && e) slot.innerHTML = emblemHTML(e);
    });
  }
}

async function renderFranchisePreview(id) {
  const main = document.getElementById("fr-main");
  const f = FRANCHISES.find((x) => x.id === id);
  if (!f) return renderFranchiseGallery();
  document.body.dataset.world = f.world;
  main.innerHTML = `
    <a href="franchises.html" class="btn btn-ghost btn-sm" style="margin:20px 0;display:inline-block;">→ חזרה לכל הצ'קליסטים המוכנים</a>
    <div class="fr-head">
      <span id="fr-emblem">${emblemHTML(readJSON(FR_LOGO_CACHE, {})[f.id])}</span>
      <div><h1 style="margin-bottom:6px;">${frName(f)}</h1><p style="color:var(--text-dim);">${frDesc(f)}</p></div>
    </div>
    <div id="fr-actions"></div>
    <div id="fr-items"><div class="empty-note">טוען את הפריטים...</div></div>`;
  franchiseEmblem(f).then((e) => { const s = document.getElementById("fr-emblem"); if (s && e) s.innerHTML = emblemHTML(e); });

  const { found, missing } = await resolveFranchise(f);
  const items = found.map(findGame).filter(Boolean);
  const mine = getCurrentUser() ? getChecklists() : [];
  document.getElementById("fr-actions").innerHTML = `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:6px 0 20px;">
      <button class="btn btn-primary" id="fr-new">➕ פתיחת צ'קליסט חדש מהפרנצ'ייז</button>
      ${existingSelectHTML(f, mine, 'id="fr-existing" ')}
      <span style="color:var(--text-faint);align-self:center;font-size:13px;">${items.length} פריטים לפי סדר יציאה${missing ? ` · ${missing} לא נמצאו` : ""}</span>
    </div>`;
  document.getElementById("fr-items").innerHTML = items.length
    ? items.map((g, i) => `
      <div class="list-item">
        <div class="order-num">${i + 1}</div>
        <a href="game.html?id=${g.id}" style="text-decoration:none;color:inherit;display:flex;gap:18px;align-items:center;flex:1;min-width:0;">
          <div class="list-cover" style="background:${g.image ? `url('${g.image}') center/cover` : `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`}">${g.image ? "" : g.icon}</div>
          <div class="list-body">
            <div class="list-title">${g.title}</div>
            <div class="list-sub">${[kindLabel(g), (g.releaseDate || "").slice(0, 4)].filter(Boolean).join(" · ")}</div>
          </div>
        </a>
      </div>`).join("")
    : '<div class="empty-note">לא הצלחנו לטעון את הפריטים (בדקו חיבור)</div>';

  const add = (targetId) => {
    if (!getCurrentUser()) return openAuthModal();
    let tid = targetId;
    if (!tid) tid = createChecklist(frName(f), f.world).id;
    const n = addManyToChecklist(tid, found, found);
    showToast(`נוספו ${n} פריטים לפי הסדר`, "📦");
    setTimeout(() => (location.href = "checklist.html"), 700);
  };
  document.getElementById("fr-new").addEventListener("click", () => add(null));
  const ex = document.getElementById("fr-existing");
  if (ex) ex.addEventListener("change", () => ex.value && add(ex.value));
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("franchises");
  const id = new URLSearchParams(location.search).get("f");
  id ? renderFranchisePreview(id) : renderFranchiseGallery();
});
