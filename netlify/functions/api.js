/* Proxy ל-RAWG ו-TMDB: המפתחות נשמרים כמשתני סביבה בשרת ואינם נחשפים לדפדפן.
   נתיב: /api/rawg/<path> או /api/tmdb/<path>  (ראו netlify.toml) */
const TARGETS = {
  rawg: { base: "https://api.rawg.io/api", keyParam: "key", env: "RAWG_KEY", allow: /^\/games(\/\d+)?$/ },
  tmdb: { base: "https://api.themoviedb.org/3", keyParam: "api_key", env: "TMDB_KEY",
          allow: /^\/(trending\/all\/week|discover\/(movie|tv)|tv\/popular|search\/(multi|movie|tv)|(movie|tv)\/\d+|company\/\d+)$/ }
};

exports.handler = async (event) => {
  const m = (event.path || "").match(/\/api\/(rawg|tmdb)(\/.*)$/);
  if (!m) return { statusCode: 404, body: "not found" };
  const t = TARGETS[m[1]];
  const path = m[2];
  const key = process.env[t.env];
  if (!key) return { statusCode: 500, body: "missing " + t.env };
  if (!t.allow.test(path)) return { statusCode: 403, body: "path not allowed" };
  const q = new URLSearchParams(event.queryStringParameters || {});
  q.delete(t.keyParam);
  q.set(t.keyParam, key);
  try {
    const r = await fetch(`${t.base}${path}?${q}`);
    const body = await r.text();
    return {
      statusCode: r.status,
      headers: { "content-type": "application/json", "cache-control": "public, max-age=600" },
      body
    };
  } catch (e) {
    return { statusCode: 502, body: "upstream error" };
  }
};
