var CACHE = "chinifa-v0f5362a8-94edc678";
var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/chinifa-app.bundle.css?v=94edc678",
  "./js/vendor/hanzi-writer.min.js",
  "./js/chinifa-app.bundle.js?v=0f5362a8",
  "./icons/icon-108.png",
  "./icons/icon-192.png",
  "./art/splash_dragon_mascot.png",
  "./art/bg_station1.jpg",
  "./art/bg_station2.jpg",
  "./art/bg_station3.jpg",
  "./art/bg_station4.jpg",
  "./art/bg_station5.jpg",
  "./art/icon_flame_3d.webp",
  "./art/star3d.webp"
];

self.addEventListener("install", function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.all(
        SHELL.map(function(url) {
          return cache.add(url).catch(function() {});
        })
      );
    })
  );
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) {
          return caches.delete(k);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  // Do not intercept external or API calls
  if (url.origin !== location.origin || url.pathname.indexOf("/api/") === 0) {
    return;
  }

  // Network-first for HTML/navigation so new deployments & bundle versions load immediately
  var isHtml = req.mode === "navigate" || url.pathname === "/app" || url.pathname === "/app/" || url.pathname.endsWith(".html");
  if (isHtml) {
    e.respondWith(
      fetch(req).then(function(res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(req, copy);
          });
        }
        return res;
      }).catch(function() {
        return caches.match(req).then(function(cached) {
          return cached || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // Cache-first for versioned static assets
  e.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) return cached;
      return fetch(req).then(function(res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(req, copy);
          });
        }
        return res;
      });
    })
  );
});
