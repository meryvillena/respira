// Copia sin internet de Respira. Versión 15585438db: cambia sola en cada publicación.
const CACHE = 'respira-15585438db';
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "fonts/fonts.css", "fonts/CormorantGaramond-italic.woff2", "fonts/CormorantGaramond-normal.woff2", "fonts/Manrope-normal.woff2", "icons/apple-touch-icon.png", "icons/favicon-64.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    // La página: primero la versión nueva de internet (sin caché del navegador); si no hay conexión o tarda más de 3 s, la guardada
    e.respondWith(caches.open(CACHE).then(async (c) => {
      const guardado = await c.match('index.html');
      const red = fetch(r.url, { cache: 'no-store' }).then((res) => { if (res.ok) c.put('index.html', res.clone()); return res; });
      const espera = new Promise((ok) => setTimeout(() => ok(null), 3000));
      try { return (await Promise.race([red, espera])) || guardado || await red; } catch (err) { return guardado || Response.error(); }
    }));
    return;
  }
  // Fuentes e iconos: los guardados (no cambian); si falta alguno, se descarga y se guarda
  e.respondWith(caches.open(CACHE).then(async (c) => {
    const guardado = await c.match(r, { ignoreSearch: true });
    return guardado || fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; });
  }));
});
