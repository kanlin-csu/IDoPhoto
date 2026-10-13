const CACHE_NAME = 'idophoto-cache-v1.1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './cat.jpg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './og-image.png'
];

// 安裝 Service Worker 並快取核心資源
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 快取本地核心資產
      await cache.addAll(STATIC_ASSETS);
      // 嘗試快取 Tailwind CDN (若在線)
      try {
        await cache.add('https://cdn.tailwindcss.com');
      } catch (e) {
        console.warn('Tailwind CDN cache skipped during install:', e);
      }
    })
  );
});

// 啟動並清理舊版快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 攔截網路請求：網路優先 (確保隨時獲得最新版)，離線時無縫回退至本機快取
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        // 如果網路請求成功，複製一份放入快取
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        // 離線時從快取回應
        return caches.match(req).then((cachedRes) => {
          if (cachedRes) return cachedRes;
          // 若請求頁面且離線，回退到主頁
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
