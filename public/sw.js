/*
 * Kill-Switch-Service-Worker.
 *
 * Die alte PokéDrop-PWA hat unter /Pokedrop/sw.js einen Service Worker
 * registriert, der die alte Seite aggressiv cache-first zwischenspeichert.
 * Diese Datei ersetzt ihn an derselben Adresse: Sie löscht alle alten Caches,
 * meldet sich selbst ab und lädt offene Tabs neu – damit die neue App sichtbar
 * wird. Danach registriert die neue App bewusst KEINEN Service Worker mehr.
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) {
          client.navigate(client.url);
        }
      } catch (e) {
        // still + leise weiter
      }
    })(),
  );
});
