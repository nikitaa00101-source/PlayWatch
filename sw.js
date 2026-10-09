/* PlayWatch service worker — מאפשר התקנה ופתיחה מהירה/לא מקוונת של האתר עצמו.
   נתוני API (RAWG/TMDB/CheapShark) תמיד מהרשת. */
const CACHE = "playwatch-v2";
const SHELL = ["./", "checklist.html", "franchises.html", "game.html", "games.html", "index.html", "watch.html", "wishlist.html", "app.js", "catalog.js", "checklist.js", "data.js", "detail.js", "franchises-page.js", "franchises.js", "home.js", "i18n.js", "wishlist.js", "style.css", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api") || url.pathname.startsWith("/.netlify")) return; /* API ותמונות חיצוניות — ישירות מהרשת */
  /* stale-while-revalidate לקבצי האתר */
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => cached || caches.match("index.html"));
      return cached || net;
    })
  );
});
