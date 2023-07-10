'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "c2a202b81c9aee4f65cb662cb941426d",
"assets/AssetManifest.json": "c8b012adc521fccc477b2f107ab238e0",
"assets/assets/animasyon/airballon.json": "321337603c8c141512e34b6de0a04d0c",
"assets/assets/animasyon/blme.json": "6155c6a237c7e12e3e865a8a5edaff40",
"assets/assets/animasyon/carpma/butterfly.json": "80d4b0f498e5d78e332f5f8b87605ed2",
"assets/assets/animasyon/carpma/cat-happy.json": "8d662d92aa5cb42dab61a9ecb175f439",
"assets/assets/animasyon/carpma/cute-work.json": "ef2c9b86b2735ecb8cb93437e08a7160",
"assets/assets/animasyon/carpma/dogs-eye.json": "680f21163ed8c6a002abb71721f8871a",
"assets/assets/animasyon/carpma/dogs.json": "80fc21bb509fb04f9d70228248d141ac",
"assets/assets/animasyon/carpma/elephant.json": "e52332052640460013ed6ca9a6393a76",
"assets/assets/animasyon/carpma/elephantdance.json": "31d0a5d93877f71f0503edb80bd43f60",
"assets/assets/animasyon/carpma/kutucat.json": "e3b747494588bee58ceee427fee0f4be",
"assets/assets/animasyon/carpma/kutudog.json": "932d3c60e541bddccf7b37d24358fed2",
"assets/assets/animasyon/carpma/parrot.json": "e67064c83157f0e830b596e8381ace05",
"assets/assets/animasyon/carpma/penguin.json": "13ecdc513901638a953a568385ae7e04",
"assets/assets/animasyon/carpma.json": "8d5e251af6111c2e2fdc4155178c3c0b",
"assets/assets/animasyon/cikarma.json": "5466ac1a30e6e7ed3a7518d6c2be7212",
"assets/assets/animasyon/esittir.json": "e07b35bd9cfdad3561e5fe51075a4195",
"assets/assets/animasyon/kedi.json": "ded2fc1015caad40ea549eab776413f5",
"assets/assets/animasyon/toplama.json": "7654f2c9b6a990810b262cada2859ec8",
"assets/assets/animasyon/ucanbalon.json": "73ff80fadc99c00cf2097d8c52e0f243",
"assets/assets/images/basarili.png": "5ba376e4ae6ec521ad533c9769179b60",
"assets/assets/images/calis.png": "ff6ba8bfb6ea19b9b1895ff8bed1cac7",
"assets/assets/images/google-icon-logo.png": "93d19c6aa8b4ac7e9fa86b98c4bd8dee",
"assets/assets/images/posterler-gulen-yuz.jpg": "b0d1265f1088959925e55f747c9ecff6",
"assets/assets/images/yeterli.png": "8c538455bbe09e04585cdffde3a3080f",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "49a04c57e3c8380250317811cbf2af87",
"assets/NOTICES": "de84c6900aad4bba96020910a2aa8c67",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "eab13d5cb552e9801bd8789faad31877",
"/": "eab13d5cb552e9801bd8789faad31877",
"main.dart.js": "5d9a6fc955ba778a0c297be771479675",
"manifest.json": "825d7716f9b5ccff341bfefbce146472",
"version.json": "6825a3d59cb410dbd6cd650c44bf4c09"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
