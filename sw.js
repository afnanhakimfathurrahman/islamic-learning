const CACHE_NAME = 'islamic-learning-v40';
// Ringkasan jadwal hafalan dari js/hafalan.js (bukan aset; jangan dihapus saat CACHE_NAME naik)
const HAFALAN_META_CACHE = 'hafalan-meta';
const HAFALAN_META_URL = new URL('hafalan-state.json', self.registration.scope).href;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // Halaman per bagian (SEO), dibuat oleh scripts/build-pages.mjs dari js/data/routes.js
  './syarat-sah-sholat/',
  './tata-cara-wudhu/',
  './doa-setelah-wudhu/',
  './tata-cara-sholat/',
  './bacaan-sholat/',
  './ragam-bacaan-sholat/',
  './pembatal-sholat/',
  './kuis-sholat/',
  './manifest.json',
  './css/app.css',
  './js/bookmarks.js',
  './js/data/info.js',
  './js/data/pembatal.js',
  './js/data/quiz.js',
  './js/data/ragam.js',
  './js/data/ragam-words.js',
  './js/data/dalil-words.js',
  './js/words.js',
  './js/hafalan.js',
  './js/data/routes.js',
  './js/data/sholat.js',
  './js/data/syarat.js',
  './js/data/wudhu.js',
  './js/main.js',
  './js/nav.js',
  './js/pwa.js',
  './js/quiz.js',
  './js/search.js',
  './js/state.js',
  './js/theme.js',
  './js/ui.js',
  './js/views/content.js',
  './js/views/info.js',
  './js/views/ragam.js',
  './wudhu.jpg',
  './sholat.jpg',
  './icon-192.png',
  './icon-512.png',
  './SPECIFICATION.md',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Event - Pre-cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell and assets...');
      // Cache satu per satu agar kegagalan satu aset (mis. CDN) tidak membatalkan instalasi SW
      return Promise.all(ASSETS_TO_CACHE.map((url) => cache.add(url).catch(() => {})));
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== HAFALAN_META_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version and fetch update in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {/* Offline fallback handling if needed */});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

// Pengingat hafalan harian (Periodic Background Sync; hanya Chrome/Edge dengan aplikasi terpasang)
function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function remindHafalan() {
  const cache = await caches.open(HAFALAN_META_CACHE);
  const res = await cache.match(HAFALAN_META_URL);
  if (!res) return;
  const meta = await res.json();
  const today = localDate();
  if (!meta.remind || meta.notified === today) return;
  // due kosong = bacaan baru yang belum pernah dilatih
  const due = (meta.dues || []).filter((d) => !d || d <= today).length;
  if (!due) return;
  await self.registration.showNotification('Waktunya murajaah', {
    body: `${due} bacaan perlu diulang hari ini.`,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'hafalan-reminder'
  });
  meta.notified = today;
  await cache.put(HAFALAN_META_URL, new Response(JSON.stringify(meta), { headers: { 'content-type': 'application/json' } }));
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'hafalan-reminder') event.waitUntil(remindHafalan());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const url = new URL('./#hafalan', self.registration.scope).href;
      const open = list.find((c) => c.url.startsWith(self.registration.scope));
      if (open) return open.navigate(url).then((c) => (c || open).focus());
      return self.clients.openWindow(url);
    })
  );
});
