/* דף הבית — שני עולמות + שורות מומלצים */
function miniCard(g) {
  const bg = g.image ? `url('${g.image}')` : `linear-gradient(135deg, ${g.gradient[0]}, ${g.gradient[1]})`;
  const sub = g.status === "upcoming" ? formatDateHe(g.releaseDate) : g.rating ? `⭐ ${g.rating}` : "";
  return `<a class="mini-card" href="game.html?id=${g.id}">
    <div class="mc-img" style="background-image:${bg}">${g.image ? "" : g.icon}</div>
    <div class="mc-t">${g.title}</div>
    <div class="mc-s">${kindLabel(g)}${sub ? " · " + sub : ""}</div>
  </a>`;
}
function renderHome() {
  const real = GAMES.filter((g) => g.image);
  const games = real.filter((g) => worldOf(g) === "games" && g.status === "released").sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12);
  const watch = real.filter((g) => worldOf(g) === "watch" && g.status === "released").sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 12);
  const soon = real.filter((g) => g.status === "upcoming" && g.releaseDate < "2099").sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)).slice(0, 14);
  const put = (id, list) => {
    document.getElementById(id).innerHTML = list.length ? list.map(miniCard).join("") : '<div class="empty-note">טוען...</div>';
  };
  put("row-games", games);
  put("row-watch", watch);
  put("row-soon", soon);
}
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar("home");
  renderHome();
  Promise.allSettled([loadRealCatalog(), loadTmdbCatalog(), enrichMockImages()]).then(renderHome);
});
