// Uncomment the lines below to set up the cache files
//
const CACHE_NAME = 'BudgetTracker';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js'
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
    self.clients.claim()
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
        fetch(evt.request).catch(function() {
          return caches.match(evt.request).then(function(response) {
              if (response) {
              return response;
              } else if (evt.request.headers.get('accept').includes('text/html')) {
                  return caches.match('/');

            }
          });
        })
      );
});