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
    
    if(event.request.url.includes('/api/')) {
        event.respondWith(
            cache.open(DATA_CACHE_NAME)
            .then(cache => {

                return fetch(event.request)

                .then(response => {

                    if(response.status !== 200 || response.type !== 'basic') {
                        return response
                    }else {
                        cache.put(event.request.url, response.clone())
                    }
                })
                .catch(err => {
                    console.log(err)
                    console.log("Data will be stored offline until site is reconnected to the internet")
                    return cache.match(event.request)
                })
            })
            .catch(err => console.log(err))
        )
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response){
                    
                    return response
                }

                return fetch(event.request)
            })
    )
})