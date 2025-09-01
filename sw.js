
const CACHE_NAME = 'bca-genius-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html'
];

// Install event: cache the application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache first, then fall back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If the resource is in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the resource is not in the cache, fetch it from the network
        return fetch(event.request).then((networkResponse) => {
          // A response is a stream and can only be consumed once.
          // We need to clone it to pass one to the browser and one to the cache.
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              // Cache the new resource for future use
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        }).catch(error => {
            console.error('Fetching failed:', error);
            // You could return a custom offline page here if you had one.
            throw error;
        });
      })
  );
});
