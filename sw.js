/* Service worker: deja la app disponible aunque no haya internet */
const CACHE = 'finanzas-v18';
const ASSETS = ['./', './index.html', './styles.css?v=18', './app.js?v=18',
                './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return; // la API (POST) siempre va a la red
  e.respondWith(
    fetch(e.request).then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status); // un 404 en pleno deploy no debe romper la app
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() =>
      // usa la copia guardada; ignoreSearch permite servir la versión anterior del archivo (?v=6 sirve para ?v=18)
      caches.match(e.request).then(hit => hit || caches.match(e.request, { ignoreSearch: true }))
    )
  );
});
