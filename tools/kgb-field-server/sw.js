const CACHE = 'kgb-field-server-shell-v103';
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
const DB_NAME = 'kgb-field-server-v2';
const STORE = 'files';
const VIRTUAL = '/__game__/';

const TEST_MODE_SHIM = `<script data-kgb-field-server-shim>
(() => {
  if (!('serviceWorker' in navigator)) return;
  const container = navigator.serviceWorker;
  const getExisting = container.getRegistration.bind(container);
  const fake = {
    scope: location.origin + location.pathname,
    active: container.controller || null,
    installing: null,
    waiting: null,
    update: async () => fake,
    unregister: async () => false,
    addEventListener() {},
    removeEventListener() {}
  };
  const testRegister = async () => (await getExisting()) || fake;
  try {
    Object.defineProperty(container, 'register', {
      configurable: true,
      value: testRegister
    });
  } catch (_) {
    try { container.register = testRegister; } catch (_) {}
  }
})();
</script>`;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'path' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFile(path) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(path);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}

function cleanPath(value) {
  return value.split('?')[0].split('#')[0].replace(/^\/+/, '').replace(/\\/g, '/');
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const marker = url.pathname.indexOf(VIRTUAL);
  if (url.origin === location.origin && marker !== -1) {
    event.respondWith((async () => {
      let path = cleanPath(decodeURIComponent(url.pathname.slice(marker + VIRTUAL.length)));
      if (!path || path.endsWith('/')) path += 'index.html';
      const record = await getFile(path);
      if (!record) return new Response(`File not found: ${path}`, { status: 404, headers: { 'Content-Type': 'text/plain' } });
      let body = record.bytes;
      let contentType = record.type || 'application/octet-stream';
      if (contentType.startsWith('text/html')) {
        let html = new TextDecoder().decode(record.bytes);
        if (/<head(?:\s[^>]*)?>/i.test(html)) {
          html = html.replace(/<head(\s[^>]*)?>/i, match => match + TEST_MODE_SHIM);
        } else {
          html = TEST_MODE_SHIM + html;
        }
        body = html;
        contentType = 'text/html; charset=utf-8';
      }
      return new Response(body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-store'
        }
      });
    })());
    return;
  }
  if (event.request.method === 'GET') {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html'))));
  }
});
