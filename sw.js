// The service worker:
// - caches the static resources that the app needs to function
// - intercepts server requests and responds with cached responses instead of going to the network
// - deletes old caches on activation

// The name of the cache
const CACHE_NAME = `mxg-0.16`;

// The static resources that the app needs to function.
const APP_STATIC_RESOURCES = [
    "./",
    "favicon.ico",
    "src/icons/circle.ico",
    "src/icons/circle.svg",
    "src/icons/tire.svg",
    "src/icons/wheel.svg",
    "src/index.html",
    "src/css/style.css",
    "src/ts/app.js",
    "src/images/UoL_Logo.png",
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                }),
            );
            await clients.claim();
        })(),
    );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
    // As a single page app, direct app to always go to cached home page.
    if (event.request.mode === "navigate") {
        event.respondWith(caches.match("/"));
        return;
    }

    // For all other requests, go to the cache first, and then the network.
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request.url);
            if (cachedResponse) {
                // Return the cached response if it's available.
                return cachedResponse;
            }
            // If resource isn't in the cache, return a 404.
            return new Response(null, { status: 404 });
        })(),
    );
});

/**
if ("serviceWorker" in navigator) {
    //navigator.serviceWorker.register(new URL('/sw.js', import.meta.url))
    navigator.serviceWorker.register("/sw.js")
        .then(
            (registration) => {
                console.log("Service worker registration successful:", registration);
            },
            (error) => {
                console.error(`Service worker registration failed: ${error}`);
            },
        );
} else {
    console.error("Service workers are not supported.");
}
*/