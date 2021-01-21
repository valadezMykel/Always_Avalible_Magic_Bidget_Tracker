const FILES_TO_CACHE = [
    '/',
    '/index.js',
    '/styles.css'
]
const CACHE_NAME = 'static-cache'
const DATA_CACHE_NAME = 'data-cache'

self.addEventListener('install', (event) => {
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    )

    self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response){
                    console.log("returned from cache")
                    return response
                }

                return fetch(event.request)
            })
    )
})