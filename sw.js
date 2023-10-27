const CACHE_VERSION = "v1";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_VERSION);
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(["/", "/index.html", "/index.css", "/index.js"]));
});
