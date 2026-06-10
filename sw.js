const CACHE = 'ai-mastery-memory-os-pro-v2-3';
const ASSETS = [
  './',
  './index.html',
  './src/styles.css',
  './src/app.js',
  './data/content.js',
  './data/memory-ai-expert-pack.js',
  './data/no-memory-review-format.js',
  './data/prompt-lab-ui-upgrade.js',
  './data/dual-coding-aids.js',
  './data/cards.json',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
