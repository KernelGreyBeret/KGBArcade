const CACHE_NAME = 'kgb-hyperhop-v0-2-4-cartridge';
const ASSETS = [
  './',
  './index.html',
  './config.js',
  './game.js',
  './manifest.json',
  './reset-cache.html',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  '../../shared/styles/kgb-game-shell.css',
  '../../engine/v0.2/kgb-utils.js',
  '../../engine/v0.2/kgb-assets.js',
  '../../engine/v0.2/kgb-input.js',
  '../../engine/v0.2/kgb-audio.js',
  '../../engine/v0.2/kgb-renderer2d.js',
  '../../engine/v0.2/kgb-scenes.js',
  '../../engine/v0.2/kgb-save.js',
  '../../engine/v0.2/kgb-ui.js',
  '../../engine/v0.2/kgb-pwa.js',
  '../../engine/v0.2/kgb-core.js',
  '../../engine/v0.2/kgb-arcade-kit.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME && key.startsWith('kgb-')).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  const url = new URL(request.url);
  const wantsFresh = request.mode === 'navigate' || /\.(?:html|js|css|json)$/i.test(url.pathname);
  if (wantsFresh) {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => null);
      return response;
    }).catch(() => caches.match(request)));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => null);
    return response;
  })));
});
