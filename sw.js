const CACHE_NAME = 'bichinhos-v1';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/constants.js',
    './js/pet.js',
    './js/audio.js',
    './js/storage.js',
    './js/ui.js',
    './js/minigame.js',
    './js/game.js',
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800&display=swap'
];

// Install event - caching assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate event - cleaning old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event - serving from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
