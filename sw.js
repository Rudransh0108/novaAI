const CACHE_NAME = 'ruddi-demo-v1';
const ASSETS = [
  '/index.html',
  '/manifest.json'
  /* If you add icon files like icon192.png and icon512.png, include them here */
];

// Install - cache basic assets
self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        // ignore failures - optional asset might be missing
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(k => {
        if(k !== CACHE_NAME) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

// Fetch - try cache first, fallback to network
self.addEventListener('fetch', ev => {
  const req = ev.request;
  if(req.method !== 'GET') return;
  ev.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(resp => {
        // optional: add to cache
        // skip caching opaque cross-origin responses to be safe
        if(resp && resp.status === 200 && resp.type === 'basic'){
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return resp;
      }).catch(()=> {
        // if offline and request is navigation, return a simple fallback HTML
        if(req.mode === 'navigate') {
          return new Response('<!doctype html><title>Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"><body style="background:#000;color:#fff;font-family:Arial,Helvetica,sans-serif;padding:20px"><h1>Offline - ruddi demo</h1><p>This is an offline fallback for the harmless demo page.</p></body>', {headers: {'Content-Type':'text/html'}});
        }
      });
    })
  );
});
