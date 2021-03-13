// Uncomment the lines below to set up the cache files
//
const CACHE_NAME = 'my-site-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
   '/public/js/index.js',
   '/public/js/idb.js'

];



self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});
//

// Activate the service worker and remove old data from the cache
// YOUR CODE HERE
//

self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.skipWaiting();
});



// Intercept fetch requests

self.addEventListener('fetch', function(evt) {
    if (evt.request.url.includes('/api/')) {
        evt.respondWith(
          caches
            .open(DATA_CACHE_NAME)
            .then(cache => {
              return fetch(evt.request)
                .then(response => {
                  // If the response was good, clone it and store it in the cache.
                  if (response.status === 200) {
                    cache.put(evt.request.url, response.clone());
                  }
    
                  return response;
                })
                .catch(err => {
                  // Network request failed, try to get it from the cache.
                  return cache.match(evt.request);
                });
            })
            .catch(err => console.log(err))
        );
    
        return;
      }

      evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return caches.match(evt.request).then(function(response) {
            if (response) {
              return response || fetch(evt.request);

            }
          });
        })
      );
});