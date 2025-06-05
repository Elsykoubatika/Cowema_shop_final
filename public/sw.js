
// Service Worker for PWA functionality and performance optimization
const CACHE_NAME = 'cowema-pwa-v2';
const STATIC_CACHE = 'cowema-static-v2';
const DYNAMIC_CACHE = 'cowema-dynamic-v2';

// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/0daddb14-3ac6-48f1-9faf-c798721f09f3.png',
  '/products',
  '/checkout',
  '/account'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('PWA Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('PWA Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('PWA Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('PWA Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('PWA Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('PWA Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('PWA Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
            .then((fetchResponse) => {
              // Cache successful navigation responses
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                  cache.put(request, responseClone);
                });
              }
              return fetchResponse;
            })
            .catch(() => {
              // Return cached homepage for offline navigation
              return caches.match('/');
            });
        })
    );
    return;
  }

  // Handle other requests (images, API calls, etc.)
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((fetchResponse) => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Cache successful responses
            const responseToCache = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(() => {
            // Return offline fallback for images
            if (request.destination === 'image') {
              return caches.match('/lovable-uploads/0daddb14-3ac6-48f1-9faf-c798721f09f3.png');
            }
          });
      })
  );
});

// Background sync for offline orders (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-orders') {
    console.log('PWA Background sync for orders');
    // This could be used to sync offline orders when back online
  }
});

// Push notifications support (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/lovable-uploads/0daddb14-3ac6-48f1-9faf-c798721f09f3.png',
      badge: '/lovable-uploads/0daddb14-3ac6-48f1-9faf-c798721f09f3.png',
      data: data.url
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
