/* ===========================================================
   קטלוג המשחקים — index.html
   =========================================================== */

const WORLD = document.body.dataset.world || "games";
const inWorld = () => GAMES.filter((g) => worldOf(g) === WORLD);

const state = {
  search: "",
  kind: "all",
  genre: "all",
  platform: "all",
  status: "all",
  sort: "rating-desc"
};

function allGenres() {
  const set = new Set();
  inWorld().forEach((g) => g.genres.forEach((genre) => set.add(genre)));
  return Array.from(set).sort();
}
function allPlatforms() {
  const set = new Set();
  inWorld().forEach((g) => g.platforms.forEach((p) => set.add(p)));
  return Array.from(set).sort();
}

function renderFilterChips() {
  const genreWrap = document.getElementById("genre-chips");
  const platformSelect = document.getElementById("platform-select");

  genreWrap.innerHTML =
    `<button class="chip ${state.genre === "all" ? "active" : ""}" data-genre="all">הכל</button>` +
    allGenres()
      .map((g) => `<button class="chip ${state.genre === g ? "active" : ""}" data-genre="${g}">${g}</button>`)
      .join("");

  genreWrap.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.genre = chip.getAttribute("data-genre");
      renderFilterChips();
      renderGrid();
    });
  });

  if (platformSelect) platformSelect.innerHTML =
    `<option value="all">כל הפלטפורמות</option>` +
    allPlatforms()
      .map((p) => `<option value="${p}" ${state.platform === p ? "selected" : ""}>${p}</option>`)
      .join("");
}

function applyFiltersAndSort() {
  let list = inWorld().filter((g) => {
    const matchesSearch =
      !state.search || g.title.toLowerCase().includes(state.search.toLowerCase());
    const matchesGenre = state.genre === "all" || g.genres.includes(state.genre);
    const matchesPlatform = state.platform === "all" || g.platforms.includes(state.platform);
    const matchesKind = state.kind === "all" || (g.kind || "game") === state.kind;
    const matchesStatus = state.status === "all" || g.status === state.status;
    return matchesSearch && matchesGenre && matchesPlatform && matchesStatus && matchesKind;
  });

  switch (state.sort) {
    case "rating-desc":
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "site-desc":
      list.sort((a, b) => (siteRating(b).avg || 0) - (siteRating(a).avg || 0));
      break;
    case "price-asc":
      list.sort((a, b) => {
        const pa = cheapestPrice(a);
        const pb = cheapestPrice(b);
        return (pa ? pa.price : Infinity) - (pb ? pb.price : Infinity);
      });
      break;
    case "price-desc":
      list.sort((a, b) => {
        const pa = cheapestPrice(a);
        const pb = cheapestPrice(b);
        return (pb ? pb.price : -Infinity) - (pa ? pa.price : -Infinity);
      });
      break;
    case "release-desc":
      list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      break;
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title, "he"));
      break;
  }
  return list;
}

function gameCardHTML(g) {
  const cheapest = cheapestPrice(g);
  const inWishlist = getCurrentUser() && isInWishlist(g.id);
  const statusBadge =
    g.status === "upcoming"
      ? `<span class="badge badge-upcoming">בקרוב · ${relativeCountdownLabel(g.releaseDate)}</span>`
      : `<span class="badge badge-released">יצא לאור</span>`;

  return `
    <div class="game-card">
      <div class="game-cover" style="background:${g.image ? `linear-gradient(rgba(10,14,23,.15), rgba(10,14,23,.45)), url('${g.image}') center/cover` : `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`}">
        <a href="game.html?id=${g.id}" style="position:absolute;inset:0;"></a>
        ${statusBadge}
        <button class="quick-btn ${inWishlist ? "active" : ""}" data-wish="${g.id}" title="הוספה לרשימת המשאלות">${inWishlist ? "★" : "☆"}</button>
        <span style="pointer-events:none;">${g.image ? "" : g.icon}</span>
      </div>
      <div class="game-info">
        <a href="game.html?id=${g.id}" style="text-decoration:none;color:inherit;">
          <div class="game-title">${g.title}</div>
        </a>
        <div class="game-meta">
          ${franchiseChipsHTML(g, false)}
          ${g.genres.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="game-foot">
          <div class="rating">${g.rating ? `⭐ ${g.rating}` : `<span style="color:var(--text-faint);font-weight:600;">טרם דורג</span>`}
            ${(() => { const r = siteRating(g); return r.avg ? `<span class="pw-mini" title="דירוג PlayWatch">${starSVG(14)}${r.avg.toFixed(1)}</span>` : ""; })()}</div>
          <div class="price-from" style="text-align:left;">
            ${
              worldOf(g) === "watch"
                ? `<span class="lbl">${g.kind === "series" ? "סדרה" : "סרט"}</span>איפה לצפות ←`
                : `<span class="lbl">מחירים</span>להשוואה ←`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStats() {
  const w = inWorld();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("stat-total", w.length);
  set("stat-upcoming", w.filter((g) => g.status === "upcoming").length);
  if (WORLD === "games") {
    set("stat-l1", "משחקים בקטלוג");
    set("stat-extra", allPlatforms().length);
    set("stat-l3", "פלטפורמות");
  } else {
    set("stat-l1", "סרטים וסדרות בקטלוג");
    set("stat-extra", allGenres().length);
    set("stat-l3", "ז'אנרים");
  }
}

function renderGrid() {
  renderStats();
  const grid = document.getElementById("games-grid");
  const list = applyFiltersAndSort();
  document.getElementById("results-count").textContent = `${list.length} תוצאות`;

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="emoji">🔍</div>
        <h3>לא נמצאו תוצאות</h3>
        <p>נסו לשנות את הסינון או את מונח החיפוש</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(gameCardHTML).join("");

  grid.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-wish");
      const added = toggleWishlist(id);
      if (added === null) return;
      btn.classList.toggle("active", added);
      btn.innerHTML = added ? "★" : "☆";
      showToast(added ? "נוסף לרשימת המשאלות" : "הוסר מרשימת המשאלות", added ? "⭐" : "🗑️");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar(WORLD);
  renderFilterChips();
  renderGrid();

  const refresh = () => {
    renderFilterChips();
    renderGrid();
  };
  if (WORLD === "games") {
    enrichMockImages().then(refresh).catch(() => {});
    loadRealCatalog().then(refresh).catch(() => showToast("לא הצלחנו לטעון משחקים חיים — מוצגים נתוני הדגמה", "⚠️"));
  } else {
    loadTmdbCatalog().then(refresh).catch(() => showToast("לא הצלחנו לטעון סרטים וסדרות", "⚠️"));
  }
  const kindSel = document.getElementById("kind-select");
  if (kindSel)
    kindSel.addEventListener("change", (e) => {
      state.kind = e.target.value;
      renderGrid();
    });

  let searchTimer;
  document.getElementById("search-input").addEventListener("input", (e) => {
    state.search = e.target.value;
    renderGrid();
    clearTimeout(searchTimer);
    if (state.search.trim().length >= 3) {
      searchTimer = setTimeout(() => {
        const t = state.search.trim();
        (WORLD === "games" ? searchRealGames(t) : searchTmdb(t)).catch(() => {}).then(renderGrid);
      }, 400);
    }
  });
  const platSel = document.getElementById("platform-select");
  if (platSel)
    platSel.addEventListener("change", (e) => {
      state.platform = e.target.value;
      renderGrid();
    });
  document.getElementById("status-select").addEventListener("change", (e) => {
    state.status = e.target.value;
    renderGrid();
  });
  document.getElementById("sort-select").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });
});
