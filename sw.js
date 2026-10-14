const CACHE = "tide-v1";
const SHELL = [
  "./",
  "./css/style.css",
  "./js/script.js",
  "./icons/icon.svg",
  "./icons/menu-burger.svg",
  "./icons/cross.svg",
  "./icons/cross-circle.svg",
  "./icons/expand.svg",
  "./icons/compress.svg",
  "./icons/info.svg",
  "./icons/moon.svg",
  "./icons/sun.svg",
  "./icons/github.svg",
  "./icons/buy-me-a-coffee.svg",
  "./manifest.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Serve the cached copy immediately and refresh it in the background, so
// shipped updates reach users on their next visit instead of never.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || refresh;
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const { hostname } = new URL(e.request.url);

  if (hostname === "api.cybai.re") {
    e.respondWith(networkFirst(e.request));
  } else if (hostname.startsWith("fonts.") || hostname === self.location.hostname) {
    e.respondWith(staleWhileRevalidate(e.request));
  }
});
