// Service worker: guarda la app en el teléfono para que abra rápido y funcione sin conexión
const CACHE = 'cla-demo-v110';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'styles.css', 'private2.css', 'screens.css', 'benefits.css', 'private.css', 'extras.css', 'system.css',
  'app.js', 'map.js', 'benefits.js', 'private.js', 'waze.js', 'cupon.js', 'cupon.css', 'parati.js', 'parati.css', 'theme.js', 'theme.css', 'public.css', 'licencias.js', 'wa.js', 'perfiles.js', 'tramites.css', 'brands.js', 'brands.css',
  'assets/logo-oficial.svg', 'assets/splash-start.jpg', 'assets/splash-end.jpg', 'assets/onboarding-familia.png', 'assets/fonasa-afiliada.png',
  'apple-touch-icon.png', 'assets/icons/apple-touch-icon.png', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'assets/fonts/RawsonPro-Regular.woff2', 'assets/fonts/RawsonPro-Medium.woff2', 'assets/fonts/RawsonPro-SemiBold.woff2',
  'assets/fonts/RawsonPro-Bold.woff2', 'assets/fonts/RawsonPro-ExtraBold.woff2', 'assets/fonts/RawsonPro-Black.woff2',
  'assets/fotos/farmacia.jpg', 'assets/fotos/vuelo.jpg', 'assets/fotos/cine.jpg', 'assets/fotos/cabana.jpg',
  'assets/fotos/estudiantes.jpg', 'assets/fotos/reunion.jpg', 'assets/fotos/chef.jpg', 'assets/fotos/chequeo.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Red primero (para ver siempre la última versión) y caché como respaldo sin conexión
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin || e.request.url.endsWith('.mp4')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
