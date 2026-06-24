const CACHE_NAME = 'tanktots-learn-v0-2-prod-refresh-2';
const CORE_ASSETS = [
  './', './index.html', './styles.css', './game.js', './manifest.json',
  './assets/logos/tanktots_learn_logo.png', './assets/logos/tanktots_learn_logo_small.png',
  './assets/pwa/icon_192.png', './assets/pwa/icon_512.png', './assets/pwa/icon_512_maskable.png',
  './assets/ui/btn_back.png', './assets/ui/btn_deck_select.png', './assets/ui/btn_mute.png',
  './assets/ui/btn_next.png', './assets/ui/btn_play.png', './assets/ui/btn_random.png', './assets/ui/btn_sound.png',
  './assets/ui/cadet_helper_01.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isOnlineFirst(request) {
  const url = new URL(request.url);
  if (request.mode === 'navigate') return true;
  if (url.pathname.endsWith('/index.html')) return true;
  if (url.pathname.endsWith('/decks/index.json')) return true;
  if (/\/decks\/[^/]+\/deck\.json$/.test(url.pathname)) return true;
  if (url.pathname.endsWith('.html')) return true;
  return false;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') return cache.match('./index.html');
    throw err;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh && fresh.ok) cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(isOnlineFirst(request) ? networkFirst(request) : cacheFirst(request));
});
