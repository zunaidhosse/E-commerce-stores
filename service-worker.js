self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installed');
  self.skipWaiting(); // ইচ্ছা করলে বাদ দিতে পারো
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // Optional: Future offline caching etc.
});
