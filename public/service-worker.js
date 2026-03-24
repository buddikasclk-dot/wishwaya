
const CACHE_NAME = 'wishwaya-v2.2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Don't cache API calls
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Special handling for Gemini API if not using the proxy yet
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    console.log('SW: Intercepting Gemini request, redirecting to proxy');
    const url = new URL(event.request.url);
    const proxyUrl = `${self.location.origin}/api-proxy${url.pathname}${url.search}`;

    event.respondWith((async () => {
      const init = {
        method: event.request.method,
        headers: new Headers(event.request.headers),
      };

      if (event.request.method === 'POST') {
        // Forward the raw JSON body to the proxy so Express can parse it correctly
        const bodyText = await event.request.clone().text();
        init.headers.set('Content-Type', 'application/json');
        // @ts-ignore
        init.body = bodyText;
      }

      return fetch(proxyUrl, init);
    })());
    return;
  }

  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});

// Push Notification Logic
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: '/logo-192.png',
        badge: '/logo-192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
          url: data.url || '/'
        },
        actions: [
          {action: 'explore', title: 'විවෘත කරන්න (Open)'}
        ]
      };
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {
      console.error('Push event error:', e);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then( windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
