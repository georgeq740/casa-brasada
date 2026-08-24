const CACHE = "casa-brasada-v12";
const ASSETS = [
  "./",
  "./index.html",
  "./experiencia.html",
  "./empresas.html",
  "./eventos.html",
  "./cotizar.html",
  "./contacto.html",
  "./css/styles.css",
  "./js/config.js",
  "./js/forms.js",
  "./js/layout.js",
  "./js/cotizador.js",
  "./js/empresas.js",
  "./assets/icons/favicon.svg",
  "./assets/icons/logo.png",
  "./assets/icons/icon-192.png",
  "./assets/photos/hero-asado.jpg",
  "./assets/social/og-image.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        const accept = event.request.headers.get("accept") || "";
        const isDocument =
          event.request.mode === "navigate" || accept.includes("text/html");
        if (isDocument) return caches.match("./index.html");
        return Response.error();
      })
  );
});
