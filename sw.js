/* PokéDrop Service Worker
   App-Dateien cache-first (schneller Start, offline nutzbar),
   Datendateien immer aus dem Netz (Verfügbarkeit muss frisch sein). */

const VERSION = 'pokedrop-v3';
const SCHALE = [
  './',
  './index.html',
  './assets/styles.css',
  './assets/app.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SCHALE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // Daten: Netz zuerst, Cache nur als Notfall
  if (url.pathname.includes('/data/')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const kopie = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, kopie));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // App-Schale: Cache zuerst
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then((treffer) => treffer || fetch(e.request)));
  }
});

// Push vom Server (siehe README, Abschnitt Benachrichtigungen)
self.addEventListener('push', (e) => {
  let d = { titel: 'Auf Lager', text: 'Ein gemerktes Produkt ist verfügbar.', url: './' };
  try { d = { ...d, ...e.data.json() }; } catch {}
  e.waitUntil(self.registration.showNotification(d.titel, {
    body: d.text,
    icon: './assets/icon-180.png',
    badge: './assets/icon-180.png',
    tag: d.tag || 'pokedrop',
    data: { url: d.url }
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || './'));
});
