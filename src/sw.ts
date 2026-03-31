declare const self: ServiceWorkerGlobalScope

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Service Worker will handle caching via Workbox
})

export {}
