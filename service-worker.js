const CACHE_NAME = 'mantra-japa-v1';

// ⚠️ ONLY cache files that 100% exist
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/state.js',
  './js/counter.js',
  './js/ui.js',
  './js/timer.js',
  './js/utils.js',
  './js/stats.js',
  './js/mantra.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        CORE_ASSETS.map(asset =>
          fetch(asset)
            .then(response => {
              if (response.ok) {
                return cache.put(asset, response);
              }
            })
            .catch(() => {
              // Ignore missing assets silently
            })
        )
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});
