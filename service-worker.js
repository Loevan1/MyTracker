const CACHE_NAME = "mytracker-v32";
const FILES_TO_CACHE = [
  "/Site---MyTracker/",
  "/Site---MyTracker/index.html"
];

self.addEventListener("install", (event) => {
    self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => clients.claim()) 
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Dans sw.js
self.addEventListener("message", (event) => {
  if (event.data.type === "PROGRAMMER_RAPPEL") {
    const { delai, titre, body } = event.data;
    setTimeout(() => {
      self.registration.showNotification(titre, { body, icon: "/icone.png" });
    }, delai);
  }
});