/* ===========================================================
   עמוד פרטי משחק — game.html
   =========================================================== */

function getGameIdFromURL() {
  const params = new URLSearchParams(location.search);
  return params.get("id");
}

function priceRowsHTML(game) {
  const withPrices = game.prices.filter((p) => p.price !== null);
  const withoutPrices = game.prices.filter((p) => p.price === null);
  const cheapest = cheapestPrice(game);
  const sorted = [...withPrices].sort((a, b) => a.price - b.price);

  const rows = sorted
    .map((p) => {
      const isBest = cheapest && p.store === cheapest.store && p.price === cheapest.price;
      const icon = STORE_ICONS[p.store.replace(/\s*\(.*\)/, "")] || "🛒";
      return `
        <div class="price-row ${isBest ? "best" : ""}">
          <div class="store-name"><span class="store-icon-badge">${icon}</span>${p.store}</div>
          <div class="price-value ${isBest ? "best-price" : ""}">${formatPrice(p.price)}</div>
        </div>`;
    })
    .join("");

  const tbdRows = withoutPrices
    .map(
      (p) => `
        <div class="price-row">
          <div class="store-name"><span class="store-icon-badge">🛒</span>${p.store}</div>
          <div class="price-tbd">טרם פורסם</div>
        </div>`
    )
    .join("");

  return rows + tbdRows;
}

function similarGamesHTML(game) {
  const similar = GAMES.filter(
    (g) => g.id !== game.id && (g.kind || "game") === (game.kind || "game") && g.genres.some((genre) => game.genres.includes(genre))
  ).slice(0, 4);

  if (!similar.length) return "";

  return `
    <h2 class="section-title">🎯 ${game.kind === "series" ? "סדרות דומות" : game.kind === "movie" ? "סרטים דומים" : "משחקים דומים"}</h2>
    <div class="similar-grid">
      ${similar
        .map(
          (g) => `
        <a href="game.html?id=${g.id}" class="game-card" style="text-decoration:none;color:inherit;">
          <div class="game-cover" style="background:${g.image ? `url('${g.image}') center/cover` : `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`};height:110px;font-size:34px;">
            ${g.image ? "" : g.icon}
          </div>
          <div class="game-info" style="padding:12px 14px;">
            <div class="game-title" style="font-size:14.5px;">${g.title}</div>
          </div>
        </a>`
        )
        .join("")}
    </div>
  `;
}

function watchHTML(g) {
  const w = g.watch || {};
  const row = (label, arr) =>
    arr && arr.length
      ? `<div class="price-row"><div class="store-name">${label}</div><div>${arr.map((n) => `<span class="tag">${n}</span>`).join(" ")}</div></div>`
      : "";
  const rows = row("📡 בסטרימינג (מנוי)", w.stream) + row("🎟️ להשכרה", w.rent) + row("🛒 לקנייה", w.buy);
  return `<h2 class="section-title">📍 איפה לצפות בישראל</h2>
    <div class="price-table">${rows || '<div class="empty-note">אין מידע על זמינות בישראל כרגע</div>'}</div>
    ${w.link ? `<p><a href="${w.link}" target="_blank" rel="noopener" style="color:var(--blue-light,#60a5fa);">לכל האפשרויות ב-JustWatch ←</a></p>` : ""}
    <p style="color:var(--text-faint);font-size:12px;">נתוני הצפייה מסופקים על ידי JustWatch דרך TMDB.</p>`;
}

function userToolsHTML(game) {
  if (!getCurrentUser()) return "";
  const cls = getChecklists().filter((c) => c.world === worldOf(game));
  const rem = getReminders();
  const cur = game.id in rem ? String(rem[game.id]) : "";
  const reminder =
    game.status === "upcoming"
      ? `<label style="display:block;margin-top:14px;color:var(--text-dim);font-size:14px;">🔔 תזכורת יציאה:
          <select id="reminder-select" class="filter-select" style="margin-inline-start:8px;">
            <option value="" ${cur === "" ? "selected" : ""}>ללא</option>
            <option value="0" ${cur === "0" ? "selected" : ""}>ביום היציאה</option>
            <option value="1" ${cur === "1" ? "selected" : ""}>יום לפני</option>
            <option value="7" ${cur === "7" ? "selected" : ""}>שבוע לפני</option>
            <option value="30" ${cur === "30" ? "selected" : ""}>חודש לפני</option>
          </select></label>`
      : "";
  const boxes = cls
    .map(
      (c) => `<label style="margin-inline-end:14px;font-size:14px;display:inline-block;"><input type="checkbox" data-cl="${c.id}" ${game.id in c.items ? "checked" : ""}/> ${c.name}${game.id in c.items ? ` <button type="button" class="btn btn-ghost btn-sm" data-done="${c.id}">${c.items[game.id] ? "✅ הושלם" : "סמן כהושלם"}</button>` : ""}</label>`
    )
    .join("");
  return `
    <div style="margin-top:14px;color:var(--text-dim);font-size:14px;">✅ הצ'קליסטים שלי: ${boxes || "אין צ'קליסטים עדיין "}
      <button class="btn btn-ghost btn-sm" id="new-cl-inline">➕ צ'קליסט חדש</button></div>
    ${reminder}`;
}

/* מחירים חיים מ-CheapShark (חינמי, ללא מפתח). אם הבקשה נכשלת — נשארים הנתונים המדומים. */
async function loadLivePrices(game) {
  const box = document.getElementById("live-prices");
  if (!box || game.status !== "released") return;
  const noPrices = () => { box.innerHTML = '<p style="color:var(--text-faint);">לא נמצאו מחירים עדכניים למשחק זה (ייתכן שהוא לא נמכר בחנויות PC).</p>'; };
  try {
    const [stores, found] = await Promise.all([
      fetch("https://www.cheapshark.com/api/1.0/stores").then((r) => r.json()),
      fetch("https://www.cheapshark.com/api/1.0/games?limit=1&title=" + encodeURIComponent(game.title)).then((r) => r.json())
    ]);
    if (!found.length) return noPrices();
    const info = await fetch("https://www.cheapshark.com/api/1.0/games?id=" + found[0].gameID).then((r) => r.json());
    const names = Object.fromEntries(stores.map((s) => [s.storeID, s.storeName]));
    const deals = (info.deals || []).sort((a, b) => a.price - b.price);
    if (!deals.length) return noPrices();
    const rates = await getRates();
    box.innerHTML = `
      <h3 class="section-title" style="font-size:17px;">${IS_EN ? "🌐 Live prices now (USD · EUR)" : "🌐 מחירים אמיתיים עכשיו (שקלים)"}</h3>
      <div class="price-table">${deals
        .map(
          (d, i) => `<div class="price-row ${i === 0 ? "best" : ""}">
            <div class="store-name">${names[d.storeID] || "חנות"}</div>
            <div class="price-value ${i === 0 ? "best-price" : ""}">${moneyHTML(d.price, rates)}${Number(d.savings) > 0 ? ` <small>(−${Math.round(d.savings)}%)</small>` : ""}</div>
          </div>`
        )
        .join("")}</div>
      <p style="color:var(--text-faint);font-size:12px;">${IS_EN ? "Source: CheapShark (PC store prices in USD, EUR converted at the current rate)." : "מקור: CheapShark (מחירי חנויות PC; מומרים משער הדולר הנוכחי, בקירוב)."}</p>`;
  } catch (e) {
    noPrices();
  }
}

async function renderGamePage() {
  const id = getGameIdFromURL();
  let game = findGame(id);
  const main = document.getElementById("detail-main");
  if (/^[rmt]\d+$/.test(id || "") && (!game || !game.detailed)) {
    try {
      game = await (id[0] === "r" ? ensureRawgGame(id) : ensureTmdbItem(id));
    } catch (e) {
      /* offline — use cached/basic data if exists */
    }
  }

  if (!game) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="emoji">❓</div>
        <h3>הפריט לא נמצא</h3>
        <p>ייתכן שהקישור שגוי או שהפריט הוסר מהקטלוג</p>
        <a class="btn btn-primary" href="index.html">חזרה לקטלוג</a>
      </div>`;
    return;
  }

  document.title = `${game.title} — PlayWatch`;
  document.body.dataset.world = worldOf(game);

  const inWishlist = getCurrentUser() && isInWishlist(game.id);

  main.innerHTML = `
    <div class="detail-hero" style="background:linear-gradient(135deg, ${game.gradient[0]}55, ${game.gradient[1]}55);">
      <div class="detail-cover" style="background:${game.image ? `url('${game.image}') center/cover` : `linear-gradient(135deg, ${game.gradient[0]}, ${game.gradient[1]})`}">${game.image ? "" : game.icon}</div>
      <div class="detail-info">
        <h1>${game.title}</h1>
        <div class="detail-sub">
          ${[game.developer, game.platforms.join(" · ")].filter(Boolean).join(" · ")}${game.developer || game.platforms.length ? " · " : ""}
          ${game.status === "upcoming" ? `יציאה: ${formatDateHe(game.releaseDate)} (${relativeCountdownLabel(game.releaseDate)})` : `יצא ב-${formatDateHe(game.releaseDate)}`}
        </div>
        <div class="game-meta">
          <span class="tag" style="background:var(--blue);color:#fff;">${kindLabel(game)}</span>
          ${franchiseChipsHTML(game, true)}
          ${game.genres.map((t) => `<span class="tag">${t}</span>`).join("")}
          ${game.rating ? `<span class="tag">⭐ ${game.rating}/10</span>` : `<span class="tag">טרם דורג</span>`}
        </div>
        <div class="detail-actions">
          <button class="btn ${inWishlist ? "btn-outline" : "btn-primary"}" id="wishlist-btn">
            ${inWishlist ? "★ ברשימת המשאלות" : "☆ הוספה לרשימת המשאלות"}
          </button>
        </div>
        <div class="pw-box">
          <div class="pw-row"><b>דירוג PlayWatch</b> <span id="pw-site">${siteRatingLineHTML(game)}</span></div>
          <div class="pw-row"><span>הדירוג שלך:</span> ${rateStarsHTML(game.id, 26)} <small id="pw-hint" style="color:var(--text-faint);">${getCurrentUser() ? "לחצו על כוכב כדי לדרג" : "התחברו כדי לדרג"}</small></div>
        </div>
        ${userToolsHTML(game)}
      </div>
    </div>

    <h2 class="section-title">📖 תיאור</h2>
    <p class="detail-desc">${game.description || "אין תיאור זמין."}</p>

    ${game.kind && game.kind !== "game" ? watchHTML(game) : `<h2 class="section-title">💰 השוואת מחירים</h2>
    <div id="live-prices">${game.status === "released" ? '<p style="color:var(--text-faint);">טוען מחירים עדכניים...</p>' : '<p style="color:var(--text-faint);">המשחק עדיין לא יצא — מחירים יופיעו אחרי היציאה.</p>'}</div>`}

    ${similarGamesHTML(game)}
  `;

  document.getElementById("wishlist-btn").addEventListener("click", () => {
    const added = toggleWishlist(game.id);
    if (added === null) return;
    showToast(added ? "נוסף לרשימת המשאלות" : "הוסר מרשימת המשאלות", added ? "⭐" : "🗑️");
    renderGamePage();
  });

  document.querySelectorAll(".pw-star").forEach((b) =>
    b.addEventListener("click", () => {
      if (rateItem(game.id, Number(b.getAttribute("data-star")))) {
        showToast("הדירוג נשמר", "⭐");
        renderGamePage();
      }
    })
  );
  document.querySelectorAll("[data-cl]").forEach((cb) =>
    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-cl");
      if (cb.checked) addToChecklistById(id, game.id);
      else removeFromChecklistById(id, game.id);
      showToast(cb.checked ? "נוסף לצ'קליסט שלך" : "הוסר מהצ'קליסט", "📋");
      renderGamePage();
    })
  );
  document.querySelectorAll("[data-done]").forEach((b) =>
    b.addEventListener("click", () => {
      const on = toggleDone(b.getAttribute("data-done"), game.id);
      showToast(on ? "סומן כהושלם 🎉" : "סומן כלא הושלם", "✅");
      renderGamePage();
    })
  );
  const newCl = document.getElementById("new-cl-inline");
  if (newCl)
    newCl.addEventListener("click", () => {
      const c = createChecklist(prompt(tr("שם הצ'קליסט החדש:")), worldOf(game));
      if (c) {
        addToChecklistById(c.id, game.id);
        renderGamePage();
      }
    });
  const remSel = document.getElementById("reminder-select");
  if (remSel)
    remSel.addEventListener("change", () => {
      setReminder(game.id, remSel.value);
      showToast(remSel.value === "" ? "התזכורת בוטלה" : "התזכורת נשמרה", "🔔");
      if (remSel.value !== "" && "Notification" in window && Notification.permission === "default") {
        requestBrowserNotifications();
      }
    });
  if (!game.kind || game.kind === "game") loadLivePrices(game);
  if (!game.real && !game.image) enrichMockImages().then(() => { if (game.image) renderGamePage(); });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(null);
  renderGamePage();
});
