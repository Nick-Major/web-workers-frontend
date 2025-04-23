import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {CacheFirst, NetworkFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';

// Автоматическое кеширование вебпак-сборки
precacheAndRoute(self.__WB_MANIFEST);

// Предварительное кеширование
const precacheImages = [
  'http://localhost:3000/images/1.jpg',
  'http://localhost:3000/images/2.jpg',
  'http://localhost:3000/images/3.jpg',
  'http://localhost:3000/images/fallback.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('animal-images').then((cache) => {
      return cache.addAll(precacheImages);
    })
  );
});

// 1. Кеширование изображений
registerRoute(
  ({url}) => url.origin === 'http://localhost:3000' && url.pathname.startsWith('/images/'),
  new CacheFirst({
    cacheName: 'animal-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

// Приоритет кэша в dev-режиме
const strategy = process.env.NODE_ENV === 'development' 
  ? new CacheFirst({ cacheName: 'dev-delayed-cache' })
  : new NetworkFirst({ cacheName: 'prod-cache' });

registerRoute(
  ({url}) => url.pathname.startsWith('/news'),
  strategy
);

// Добавьте кеширование CSS
registerRoute(
  ({request}) => request.destination === 'style',
  new CacheFirst({
    cacheName: 'styles-cache'
  })
);

