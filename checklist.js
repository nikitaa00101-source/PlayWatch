/* ===========================================================
   הצ'קליסטים שלי — checklist.html
   כמה צ'קליסטים בשם חופשי; כל אחד שייך לעולם אחד: משחקים, או סרטים וסדרות.
   =========================================================== */

let clWorld = "all"; // all | games | watch
let shuffleAsk = null; // id של צ'קליסט שמחכה לאישור סידור אקראי

function worldName(w) {
  return w === "watch" ? "🍿 סרטים וסדרות" : "🎮 משחקים";
}

function renderChecklistPage() {
  const main = document.getElementById("checklist-main");

  if (!getCurrentUser()) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🔒</div>
        <h3>יש להתחבר כדי לצפות בצ'קליסט</h3>
        <p>הצ'קליסט שלך נשמר עבור המשתמש המחובר בלבד</p>
        <button class="btn btn-primary" onclick="openAuthModal('login')">התחברות / הרשמה</button>
      </div>`;
    return;
  }

  const all = getChecklists();
  const lists = all.filter((c) => clWorld === "all" || c.world === clWorld);
  const count = (w) => all.filter((c) => w === "all" || c.world === w).length;

  main.innerHTML = `
    <div class="page-header">
      <h1>הצ'קליסטים שלי ✅</h1>
      <p>צרו צ'קליסטים בנפרד למשחקים ולסרטים וסדרות, הוסיפו אליהם פריטים וסמנו את מה שכבר סיימתם</p>
    </div>

    <div style="display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;">
      <input id="new-cl-name" class="search-input" style="max-width:300px;" placeholder="שם צ'קליסט חדש, למשל: לחופשה" />
      <select id="new-cl-world" class="select-field">
        <option value="games">🎮 משחקים</option>
        <option value="watch">🍿 סרטים וסדרות</option>
      </select>
      <button class="btn btn-primary" id="create-cl-btn">➕ יצירת צ'קליסט</button>
    </div>

    <div class="tabs">
      <div class="tab-btn ${clWorld === "all" ? "active" : ""}" data-w="all">הכל (${count("all")})</div>
      <div class="tab-btn ${clWorld === "games" ? "active" : ""}" data-w="games">🎮 משחקים (${count("games")})</div>
      <div class="tab-btn ${clWorld === "watch" ? "active" : ""}" data-w="watch">🍿 סרטים וסדרות (${count("watch")})</div>
    </div>

    <a class="fr-banner" href="franchises.html">📦 צ'קליסטים מוכנים: MCU, Star Wars, Assassin's Creed ועוד — צפייה והוספה ←</a>

    ${
      lists.length
        ? lists.map(checklistHTML).join("")
        : `<div class="empty-state"><div class="emoji">📝</div><h3>אין עדיין צ'קליסטים</h3><p>צרו את הצ'קליסט הראשון שלכם</p></div>`
    }
  `;

  const create = () => {
    const input = document.getElementById("new-cl-name");
    const w = document.getElementById("new-cl-world").value;
    if (!createChecklist(input.value, w)) return showToast("נא להזין שם לצ'קליסט", "⚠️");
    clWorld = w;
    renderChecklistPage();
  };
  document.getElementById("create-cl-btn").addEventListener("click", create);
  document.getElementById("new-cl-name").addEventListener("keydown", (e) => {
    if (e.key === "Enter") create();
  });
  main.querySelectorAll(".tab-btn").forEach((b) =>
    b.addEventListener("click", () => {
      clWorld = b.getAttribute("data-w");
      renderChecklistPage();
    })
  );
  main.querySelectorAll("[data-del-cl]").forEach((b) =>
    b.addEventListener("click", () => {
      if (confirm(tr("למחוק את הצ'קליסט?"))) {
        deleteChecklist(b.getAttribute("data-del-cl"));
        renderChecklistPage();
      }
    })
  );
  main.querySelectorAll("[data-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const [cid, gid] = b.getAttribute("data-toggle").split("|");
      toggleDone(cid, gid);
      renderChecklistPage();
    })
  );
  main.querySelectorAll("[data-rm]").forEach((b) =>
    b.addEventListener("click", () => {
      const [cid, gid] = b.getAttribute("data-rm").split("|");
      removeFromChecklistById(cid, gid);
      showToast("הוסר מהצ'קליסט", "🗑️");
      renderChecklistPage();
    })
  );
  initDrag(main);
  main.querySelectorAll("[data-shuffle-ask]").forEach((b) =>
    b.addEventListener("click", () => { shuffleAsk = b.getAttribute("data-shuffle-ask"); renderChecklistPage(); })
  );
  main.querySelectorAll("[data-shuffle-cancel]").forEach((b) =>
    b.addEventListener("click", () => { shuffleAsk = null; renderChecklistPage(); })
  );
  main.querySelectorAll("[data-shuffle-go]").forEach((b) =>
    b.addEventListener("click", () => {
      shuffleChecklist(b.getAttribute("data-shuffle-go"));
      shuffleAsk = null;
      showToast("הסדר עורבב — אפשר לשחזר", "🎲");
      renderChecklistPage();
    })
  );
  main.querySelectorAll("[data-undo]").forEach((b) =>
    b.addEventListener("click", () => { undoShuffle(b.getAttribute("data-undo")); showToast("הסדר הקודם שוחזר", "↩️"); renderChecklistPage(); })
  );
  main.querySelectorAll("[data-reset]").forEach((b) =>
    b.addEventListener("click", () => {
      if (confirm(tr("לאפס לסדר המקורי? הסדר שערכתם יוחלף."))) { resetToOrigin(b.getAttribute("data-reset")); renderChecklistPage(); }
    })
  );
  main.querySelectorAll("[data-add]").forEach((sel) =>
    sel.addEventListener("change", () => {
      if (!sel.value) return;
      addToChecklistById(sel.getAttribute("data-add"), sel.value);
      renderChecklistPage();
    })
  );
}

function checklistHTML(c) {
  const games = clOrder(c).map(findGame).filter(Boolean);
  const done = games.filter((g) => c.items[g.id]).length;
  const pct = games.length ? Math.round((done / games.length) * 100) : 0;
  const options = GAMES.filter((g) => worldOf(g) === c.world && !(g.id in c.items))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((g) => `<option value="${g.id}">${g.title}</option>`)
    .join("");
  return `
    <div class="price-table" style="margin-bottom:22px;padding:18px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;flex-wrap:wrap;">
        <h2 class="section-title" style="margin:0;">${c.name} <span class="tag" style="font-size:11px;">${worldName(c.world)}</span>
          <span style="color:var(--text-faint);font-size:14px;">(${done} מתוך ${games.length} הושלמו)</span></h2>
        <div style="display:flex;gap:8px;">
          <select data-add="${c.id}" class="filter-select"><option value="">➕ הוספת פריט...</option>${options}</select>
          <button class="btn btn-danger btn-sm" data-del-cl="${c.id}">מחיקת צ'קליסט</button>
        </div>
      </div>
      ${games.length > 1 ? orderControlsHTML(c) : ""}
      ${games.length ? `<div class="progress-bar-track" style="margin-bottom:12px;"><div class="progress-bar-fill" style="width:${pct}%"></div></div>` : ""}
      ${
        games.length
          ? `<div class="cl-items" data-cl="${c.id}">` + games
              .map((g, idx) => {
                const d = c.items[g.id];
                return `
        <div class="list-item ${d ? "completed" : ""}" data-gid="${g.id}">
          ${games.length > 1 ? `<span class="drag-handle" title="גררו כדי לשנות סדר">⠿</span>` : ""}
          <div class="order-num">${idx + 1}</div>
          <div class="checkbox-circle ${d ? "checked" : ""}" data-toggle="${c.id}|${g.id}">${d ? "✓" : ""}</div>
          <a href="game.html?id=${g.id}" style="text-decoration:none;color:inherit;display:flex;gap:18px;align-items:center;flex:1;min-width:0;">
            <div class="list-cover" style="background:${g.image ? `url('${g.image}') center/cover` : `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`}">${g.image ? "" : g.icon}</div>
            <div class="list-body">
              <div class="list-title">${g.title}</div>
              <div class="list-sub">${[kindLabel(g), g.developer, g.genres.join(", ")].filter(Boolean).join(" · ")}</div>
            </div>
          </a>
          <button class="btn btn-danger btn-sm" data-rm="${c.id}|${g.id}">הסרה</button>
        </div>`;
              })
              .join("") + `</div>`
          : `<div class="empty-note">הצ'קליסט ריק</div>`
      }
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("checklist");
  renderChecklistPage();
});

function orderControlsHTML(c) {
  if (shuffleAsk === c.id) {
    return `<div class="warn-box">
      <b>⚠️ אזהרה: סידור אקראי</b>
      <div>הסדר הנוכחי של הצ'קליסט יעורבב לגמרי. אפשר לשחזר את הסדר הקודם מיד אחר כך, כל עוד לא ערכתם שוב.</div>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn btn-danger btn-sm" data-shuffle-go="${c.id}">כן, לערבב</button>
        <button class="btn btn-ghost btn-sm" data-shuffle-cancel="1">ביטול</button>
      </div>
    </div>`;
  }
  return `<div class="order-controls">
    <button class="btn btn-ghost btn-sm" data-shuffle-ask="${c.id}">🎲 סידור אקראי</button>
    ${c.prevOrder ? `<button class="btn btn-ghost btn-sm" data-undo="${c.id}">↩ שחזור הסדר הקודם</button>` : ""}
    ${c.origin ? `<button class="btn btn-ghost btn-sm" data-reset="${c.id}">↺ איפוס לסדר המקורי</button>` : ""}
  </div>`;
}

/* גרירה לשינוי סדר (עכבר ומגע): אוחזים בידית ⠿ וגוררים.
   המאזינים על document — כי הזזת השורה ב-DOM מנתקת "לכידת" מצביע מהידית. */
function initDrag(main) {
  main.querySelectorAll(".drag-handle").forEach((h) => {
    h.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button > 0) return;
      e.preventDefault();
      const row = h.closest(".list-item");
      const box = row.parentNode;
      row.classList.add("dragging");
      document.body.style.userSelect = "none";
      const move = (ev) => {
        const others = [...box.querySelectorAll(".list-item")].filter((r) => r !== row);
        let before = null;
        for (const r of others) {
          const b = r.getBoundingClientRect();
          if (ev.clientY < b.top + b.height / 2) { before = r; break; }
        }
        if (before !== row.nextSibling) box.insertBefore(row, before);
        if (ev.clientY < 80) window.scrollBy(0, -14);
        else if (ev.clientY > window.innerHeight - 80) window.scrollBy(0, 14);
      };
      const up = () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
        document.removeEventListener("pointercancel", up);
        document.body.style.userSelect = "";
        row.classList.remove("dragging");
        setChecklistOrder(box.getAttribute("data-cl"), [...box.querySelectorAll(".list-item")].map((r) => r.getAttribute("data-gid")));
        renderChecklistPage();
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
    });
  });
}
