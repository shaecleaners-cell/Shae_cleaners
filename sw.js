/* =========================================================
   SHAE CLEANERS
   SERVICE WORKER
========================================================= */

const CACHE_NAME =
  "shae-cleaners-v1";


const FILES_TO_CACHE = [

  "/",

  "/index.html",

  "/cart.html",

  "/checkout.html",

  "/invoice.html",

  "/css/style.css",

  "/css/cart.css",

  "/css/Invoice.css",

  "/js/app.js",

  "/js/cart.js",

  "/js/Invoice.js",

  "/manifest.json"

];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      ).then(
        cache => {

          return cache.addAll(
            FILES_TO_CACHE
          );

        }
      )

    );


    self.skipWaiting();

  }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches.keys().then(
        cacheNames => {

          return Promise.all(

            cacheNames
              .filter(
                name =>
                  name !== CACHE_NAME
              )
              .map(
                name =>
                  caches.delete(name)
              )

          );

        }
      )

    );


    self.clients.claim();

  }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches.match(
        event.request
      ).then(
        cachedResponse => {

          return (
            cachedResponse ||
            fetch(
              event.request
            )
          );

        }
      )

    );

  }
);