/* ===========================================================
   רשימת המשאלות — wishlist.html
   =========================================================== */

let wishlistFilter = "all"; // all | released | upcoming

function renderWishlistPage() {
  const main = document.getElementById("wishlist-main");

  if (!getCurrentUser()) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🔒</div>
        <h3>יש להתחבר כדי לצפות ברשימת המשאלות</h3>
        <p>הרשימה שלך נשמרת עבור המשתמש המחובר בלבד</p>
        <button class="btn btn-primary" onclick="openAuthModal('login')">התחברות / הרשמה</button>
      </div>`;
    return;
  }

  const ids = getWishlist();
  let games = ids.map(findGame).filter(Boolean);

  if (wishlistFilter !== "all") {
    games = games.filter((g) => g.status === wishlistFilter);
  }

  // Sort: upcoming first (soonest release), then released alphabetically
  games.sort((a, b) => {
    if (a.status === "upcoming" && b.status === "upcoming") {
      return daysUntil(a.releaseDate) - daysUntil(b.releaseDate);
    }
    if (a.status === "upcoming") return -1;
    if (b.status === "upcoming") return 1;
    return a.title.localeCompare(b.title, "he");
  });

  const allCount = ids.length;
  const upcomingCount = ids.map(findGame).filter((g) => g && g.status === "upcoming").length;
  const releasedCount = allCount - upcomingCount;

  main.innerHTML = `
    <div class="page-header">
      <h1>רשימת המשאלות שלי ⭐</h1>
      <p>${allCount} פריטים ברשימה · תקבלו התראה כשפריטים עתידיים יוצאים</p>
    </div>

    <div class="tabs">
      <div class="tab-btn ${wishlistFilter === "all" ? "active" : ""}" data-f="all">הכל (${allCount})</div>
      <div class="tab-btn ${wishlistFilter === "upcoming" ? "active" : ""}" data-f="upcoming">בקרוב (${upcomingCount})</div>
      <div class="tab-btn ${wishlistFilter === "released" ? "active" : ""}" data-f="released">יצאו לאור (${releasedCount})</div>
    </div>

    ${
      !games.length
        ? `<div class="empty-state">
            <div class="emoji">📭</div>
            <h3>אין פריטים כאן עדיין</h3>
            <p>עברו למשחקים או לסרטים וסדרות והוסיפו מה שמעניין אתכם</p>
            <a class="btn btn-primary" href="index.html">אל הקטלוג</a>
          </div>`
        : games.map(wishlistItemHTML).join("")
    }
  `;

  main.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      wishlistFilter = btn.getAttribute("data-f");
      renderWishlistPage();
    });
  });

  main.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove");
      removeFromWishlist(id);
      showToast("הוסר מרשימת המשאלות", "🗑️");
      renderWishlistPage();
    });
  });
}

function wishlistItemHTML(g) {
  const cheapest = cheapestPrice(g);
  const countdown =
    g.status === "upcoming"
      ? `<span class="countdown-badge ${daysUntil(g.releaseDate) <= 7 ? "soon" : ""}">${relativeCountdownLabel(g.releaseDate)}</span>`
      : "";

  return `
    <div class="list-item">
      <a href="game.html?id=${g.id}" style="text-decoration:none;color:inherit;display:flex;gap:18px;align-items:center;flex:1;min-width:0;">
        <div class="list-cover" style="background:${g.image ? `url('${g.image}') center/cover` : `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`}">${g.image ? "" : g.icon}</div>
        <div class="list-body">
          <div class="list-title">${g.title}</div>
          <div class="list-sub">
            ${[kindLabel(g), g.developer, g.status === "upcoming" ? formatDateHe(g.releaseDate) : g.platforms.join(", ")].filter(Boolean).join(" · ")}
          </div>
        </div>
      </a>
      ${countdown}
      <button class="btn btn-danger btn-sm" data-remove="${g.id}">הסרה</button>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("wishlist");
  renderWishlistPage();
});
