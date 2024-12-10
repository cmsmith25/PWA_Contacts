const CACHE_NAME = "contact-keeper-v1";


const ASSETS_TO_CACHE = [

"/",
"/index.html",
"/pages/about.html",
"/pages/contactus.html",
"/css/materialize.min.css",
"/js/materialize.min.js",
"/js/ui.js",
"/img/icons/contacts.png",
];


self.addEventListener("install", (event) => {
    console.log("Service worker: Installing...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service worker: caching files");
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});


self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activating...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Deleting old Cache");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


//Fetch event
self.addEventListener("fetch", (event) => {
    console.log("Service Worker: Fetching...", event.request.url);
    event.respondWith(
        (async function () {
            if(event.request.method !== "GET") {
                return fetch(event.request);
            }
        
            const cachedResponse = await caches.match(event.request);

            if(cachedResponse) {
                return cachedResponse;
            }
    
            try {
                const networkResponse = await fetch(event.request);
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            }   catch (error) {
                console.error("Fetch failed, returning offline page:", error);
            }
        })()
    );
});

  