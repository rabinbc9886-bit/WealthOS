// फाइललाई क्यास (cache) गर्ने नाम
const CACHE_NAME = 'wealthos-cache-v1';
const ASSETS = [
  './index.html',
  './styles.css',
  './wealthOSlogo.png',
  './manifest.json'
];

// इन्स्टल गर्दा फाइलहरू क्यास गर्ने
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// अफलाइन हुँदा क्यासबाट फाइलहरू पठाउने
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});