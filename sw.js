'use strict';
const CACHE = 'flock-alt-v16';
const ASSETS = [
  'index.html','login.html','signup.html','onboarding.html',
  'home.html','flocks.html','roosts.html','event.html','my-flocks.html','my-roosts.html','profile.html',
  'checkout-info.html','checkout-overview.html','checkout-complete.html','about.html',
  'css/styles.css',
  'js/data.js','js/state.js','js/desktop-sidebar.js',
  'js/pages/login.js','js/pages/signup.js','js/pages/onboarding.js',
  'js/pages/home.js','js/pages/roosts.js','js/pages/flocks.js','js/pages/my-flocks.js','js/pages/event.js','js/pages/my-roosts.js',
  'js/pages/profile.js',
  'js/pages/checkout-info.js','js/pages/checkout-overview.js','js/pages/checkout-complete.js','js/pages/about.js',
  'manifest.json'
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
