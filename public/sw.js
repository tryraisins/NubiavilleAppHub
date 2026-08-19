const CACHE_NAME = "nubiaville-app-hub-static-v2";
const APP_SHELL = ["/", "/offline.html", "/icon.svg", "/manifest.webmanifest", "/nubiaville-logo.png"];

async function putInCache(request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, fallback) {
  try {
    return await putInCache(request, await fetch(request));
  } catch {
    return (await caches.match(request)) || (await caches.match(fallback)) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request).then((response) => putInCache(request, response));
  if (cached) {
    void network.catch(() => undefined);
    return cached;
  }
  try {
    return await network;
  } catch {
    return Response.error();
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("nubiaville-app-hub-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, "/offline.html"));
    return;
  }

  if (APP_SHELL.includes(url.pathname) || url.pathname.startsWith("/_next/static/")) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
