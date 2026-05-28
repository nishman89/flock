'use strict';
const CACHE = 'flock-v1';
const ASSETS = [
  'login.html','signup.html','onboarding.html',
  'home.html','event.html','my-events.html','profile.html',
  'css/styles.css','js/state.js','js/data.js','manifest.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
