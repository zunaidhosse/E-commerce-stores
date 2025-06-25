// ক্যাশের নাম নির্ধারণ করুন, এটি ভার্সন ট্র্যাক করতে সাহায্য করে
const CACHE_NAME = 'pwa-ecommerce-v2'; // ক্যাশের নাম আপডেট করা হয়েছে
// যে ফাইলগুলো ক্যাশে করতে হবে তার তালিকা
const urlsToCache = [
  '/E-commerce-stores/',             // আপনার PWA-এর বেস পাথ
  '/E-commerce-stores/index.html',
  '/E-commerce-stores/manifest.json',
  '/E-commerce-stores/service-worker.js',
  '/E-commerce-stores/icon-192.png',
  '/E-commerce-stores/icon-512.png',
  // আপনার যদি কোনো এক্সটার্নাল CSS বা JavaScript ফাইল থাকে (যেমন style.css, script.js),
  // তাহলে তাদের পাথ এখানে যোগ করুন, নিশ্চিত করুন পাথটি '/E-commerce-stores/' দিয়ে শুরু হয়।
  // যেহেতু আপনার CSS এবং প্রধান JS বর্তমানে index.html এর ভিতরে এম্বেড করা আছে,
  // index.html ক্যাশ করলেই সেগুলো লোড হবে।
];

self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installed');
  // ইনস্টলেশন সম্পূর্ণ না হওয়া পর্যন্ত অপেক্ষা করুন
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // সমস্ত প্রয়োজনীয় ফাইল ক্যাশে যোগ করুন
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache some URLs:', error);
        });
      })
      .then(() => self.skipWaiting()) // ইনস্টল করার পরপরই নতুন সার্ভিস ওয়ার্কারকে সক্রিয় করুন
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
  // পুরোনো ক্যাশে পরিষ্কার করুন
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // প্রতিটি নেটওয়ার্ক রিকোয়েস্ট ইন্টারসেপ্ট করুন
  event.respondWith(
    caches.match(event.request).then(response => {
      // যদি ক্যাশেতে রিকোয়েস্ট করা ফাইলটি থাকে, তাহলে ক্যাশে থেকে ফেরত দিন
      if (response) {
        return response;
      }
      // যদি ক্যাশেতে না থাকে, তাহলে নেটওয়ার্ক থেকে আনুন
      return fetch(event.request).catch(() => {
        // নেটওয়ার্ক রিকোয়েস্ট ব্যর্থ হলে বা অফলাইন থাকলে কী হবে (ঐচ্ছিক)
        console.warn('Network request failed and no cache found for:', event.request.url);
        // আপনি এখানে একটি অফলাইন পেজ রিটার্ন করতে পারেন যদি আপনার কাছে থাকে
        // if (event.request.mode === 'navigate') {
        //   return caches.match('/E-commerce-stores/offline.html'); // একটি 'offline.html' ফাইল তৈরি করতে হবে
        // }
      });
    })
  );
});
