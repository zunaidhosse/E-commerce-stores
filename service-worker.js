self.addEventListener('install', (event) => {
  console.log('✅ Service Worker: Installed');
  self.skipWaiting(); // এটি নতুন সার্ভিস ওয়ার্কারকে দ্রুত সক্রিয় করে
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // ভবিষ্যতের জন্য ক্যাশিং লজিক এখানে যুক্ত করা যেতে পারে,
  // যা অ্যাপটিকে অফলাইনেও কাজ করতে সাহায্য করবে।
});
