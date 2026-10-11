// Copia sin internet de Respira. Versión bff1fb246a: cambia sola en cada publicación.
const CACHE = 'respira-bff1fb246a';
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "fonts/fonts.css", "fonts/CormorantGaramond-italic.woff2", "fonts/CormorantGaramond-normal.woff2", "fonts/Manrope-normal.woff2", "icons/apple-touch-icon.png", "icons/favicon-64.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const clave = r.mode === 'navigate' ? 'index.html' : r;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const guardado = await c.match(clave, { ignoreSearch: true });
    const red = fetch(r).then((res) => { if (res.ok) c.put(clave, res.clone()); return res; }).catch(() => guardado);
    return guardado || red;
  }));
});
