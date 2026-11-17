// ---------- Navegación entre pantallas ----------
// Pantallas "raíz" (splash, onboarding, login, home) se reemplazan con fundido.
// Pantallas del flujo (beneficios, detalle) se apilan con transición push/pop estilo iOS,
// con swipe desde el borde izquierdo para volver.
const app = document.getElementById('app');
const screens = [...document.querySelectorAll('.screen')];
// Menú lateral activo: el público (#drawer) o el privado (#drawerPriv) según la pantalla
const DRAWERS = { pub: document.getElementById('drawer'), priv: document.getElementById('drawerPriv') };
let drawer = DRAWERS.pub;
const PUSH = new Set(['beneficios', 'detalle', 'perfil', 'licencia', 'parati', 'licpub', 'mislic', 'certs', 'inglic', 'certs', 'inglic']);
const EASE = 'cubic-bezier(.32,.72,0,1)';   // curva de UINavigationController
const DUR = 520;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stack = [];
const scrollMem = {};
let current = null;
let busy = false;

const screenEl = name => screens.find(s => s.dataset.screen === name);
const emit = (type, name, extra) => document.dispatchEvent(new CustomEvent(type, { detail: { name, ...extra } }));
const haptic = (ms = 8) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (_) {} };

function anim(el, frames, opts = {}) {
  if (reduceMotion) return Promise.resolve();
  const o = { duration: DUR, easing: EASE, ...opts };
  const a = el.animate(frames, o);
  // Respaldo: si la app queda en segundo plano el navegador pausa las animaciones;
  // terminamos igual para que la navegación nunca quede bloqueada.
  const limit = new Promise(res => setTimeout(() => { try { a.finish(); } catch (_) {} res(); }, (o.duration || 0) + (o.delay || 0) + 150));
  return Promise.race([a.finished.catch(() => {}), limit]);
}
// Fija una pantalla en su posición visual actual para animarla sin afectar el scroll
function pin(el, y, z) {
  const r = app.getBoundingClientRect();
  Object.assign(el.style, { position: 'fixed', top: `${-y}px`, left: `${r.left}px`, width: `${r.width}px`, zIndex: z, transformOrigin: `50% ${y + innerHeight / 2}px` });
  // Las barras sticky se compensan para que no "salten" durante el fundido
  el.style.setProperty('--pin-y', `${y}px`); el.classList.add('pinned');
}
function unpin(el) {
  ['position', 'top', 'left', 'width', 'zIndex', 'transform', 'filter', 'opacity', 'transformOrigin'].forEach(p => { el.style[p] = ''; });
  el.classList.remove('on-top', 'pinned');
  el.style.removeProperty('--pin-y');
}
function activate(el) { el.style.animation = 'none'; el.classList.add('is-active'); }

// Versión "solo homes": la app muestra únicamente los 3 home (Caja, noma, tapp)
const HOMES_ONLY = true;
function go(name, opts = {}) {
  closeDrawer();
  if (HOMES_ONLY && name !== 'home') return;
  if (name === current || busy) return;
  if (PUSH.has(name) && current && !opts.replace) return push(name, opts);
  const prev = current;
  stack.length = 0; stack.push(name); current = name;
  emit('screen:before', name, opts);
  screens.forEach(s => { unpin(s); s.style.animation = ''; s.classList.toggle('is-active', s.dataset.screen === name); });
  window.scrollTo(0, 0);
  if (name === 'rut') setTimeout(() => document.getElementById('rut').focus(), 350);
  if (name === 'password') setTimeout(() => document.getElementById('pw').focus(), 350);
  emit('screen:enter', name, { prev });
}

async function push(name, opts = {}) {
  busy = true;
  const from = screenEl(current), to = screenEl(name);
  scrollMem[current] = scrollY;
  emit('screen:before', name, opts);
  pin(from, scrollY, 1);
  activate(to);
  Object.assign(to.style, { position: 'relative', zIndex: 2, transformOrigin: '50% ' + innerHeight / 2 + 'px' });
  window.scrollTo(0, 0);
  stack.push(name); current = name;
  haptic();
  await dissolve(from, to, false);
  from.classList.remove('is-active'); unpin(from); unpin(to);
  busy = false;
  emit('screen:enter', name, opts);
}

async function back() {
  if (busy || stack.length < 2) return;
  busy = true;
  const from = screenEl(current), prevName = stack[stack.length - 2], to = screenEl(prevName);
  pin(from, scrollY, 3);
  activate(to);
  window.scrollTo(0, scrollMem[prevName] || 0);
  to.style.transformOrigin = '50% ' + (scrollY + innerHeight / 2) + 'px';
  stack.pop(); current = prevName;
  await dissolve(from, to, true);
  from.classList.remove('is-active'); unpin(from);
  busy = false;
  emit('screen:enter', prevName, { back: true });
}

// Fundido suave centrado entre pantallas del flujo: la entrante aparece desde el centro
// (escala .96 → 1) mientras la saliente se desvanece; al volver, se invierte.
const DISSOLVE = { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)' };
function dissolve(from, to, isBack) {
  const inFrom = isBack ? 1.03 : 0.96, outTo = isBack ? 0.96 : 1.03;
  return Promise.all([
    anim(to, [{ opacity: 0, transform: `scale(${inFrom})` }, { opacity: 1, transform: 'scale(1)' }], DISSOLVE),
    anim(from, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: `scale(${outTo})` }], DISSOLVE),
  ]);
}

// Swipe desde el borde izquierdo para volver (gesto interactivo de iOS)
let edge = null;
document.addEventListener('touchstart', e => {
  if (busy || stack.length < 2 || !PUSH.has(current) || document.body.classList.contains('sheet-open')) return;
  const t = e.touches[0];
  if (t.clientX - app.getBoundingClientRect().left > 28) return;
  edge = { x: t.clientX, y: t.clientY, t: performance.now(), started: false, dx: 0 };
}, { passive: true });
document.addEventListener('touchmove', e => {
  if (!edge) return;
  const t = e.touches[0], dx = Math.max(0, t.clientX - edge.x), dy = t.clientY - edge.y;
  if (!edge.started) {
    if (Math.abs(dy) > 10 && Math.abs(dy) > dx) { edge = null; return; }
    if (dx < 6) return;
    const prevName = stack[stack.length - 2];
    edge.from = screenEl(current); edge.to = screenEl(prevName); edge.prev = prevName;
    edge.w = app.getBoundingClientRect().width;
    pin(edge.to, scrollMem[prevName] || 0, 1); activate(edge.to);
    Object.assign(edge.from.style, { position: 'relative', zIndex: 2 }); edge.from.classList.add('on-top');
    edge.started = true;
  }
  e.preventDefault();
  edge.dx = dx;
  const p = Math.min(1, dx / edge.w);
  edge.from.style.transform = `translateX(${dx}px)`;
  edge.to.style.transform = `translateX(${-28 * (1 - p)}%)`;
  edge.to.style.filter = `brightness(${0.8 + 0.2 * p})`;
}, { passive: false });
document.addEventListener('touchend', async () => {
  if (!edge) return;
  const g = edge; edge = null;
  if (!g.started) return;
  busy = true;
  const v = g.dx / (performance.now() - g.t);
  const done = g.dx > g.w * 0.35 || v > 0.5;
  const opts = { duration: 320 };
  if (done) {
    await Promise.all([
      anim(g.from, [{ transform: g.from.style.transform }, { transform: 'translateX(100%)' }], opts),
      anim(g.to, [{ transform: g.to.style.transform, filter: g.to.style.filter }, { transform: 'translateX(0)', filter: 'brightness(1)' }], opts),
    ]);
    g.from.classList.remove('is-active'); unpin(g.from); unpin(g.to);
    window.scrollTo(0, scrollMem[g.prev] || 0);
    stack.pop(); current = g.prev;
    emit('screen:enter', g.prev, { back: true });
  } else {
    await Promise.all([
      anim(g.from, [{ transform: g.from.style.transform }, { transform: 'translateX(0)' }], opts),
      anim(g.to, [{ transform: g.to.style.transform }, { transform: 'translateX(-28%)' }], opts),
    ]);
    g.to.classList.remove('is-active'); unpin(g.to); unpin(g.from);
  }
  busy = false;
});

document.addEventListener('click', e => {
  if (e.defaultPrevented) return;
  const target = e.target.closest('[data-go]');
  if (target) { e.preventDefault(); go(target.dataset.go); return; }
  if (e.target.closest('[data-back]')) { e.preventDefault(); back(); return; }
  const d = e.target.closest('[data-drawer]');
  if (d) d.dataset.drawer === 'open' ? openDrawer(d) : closeDrawer();
});

// Color de la barra de estado del teléfono según la pantalla (iOS 15+ lo usa en modo app)
const BAR_COLOR = { splash: '#ffffff', onboarding: '#3d86d8', rut: '#ffffff', password: '#ffffff', licencia: '#F5F7FB', home: '#0e1a86', privado: '#0e1a86', beneficios: '#F5F7FB', parati: '#F5F7FB', licpub: '#F5F7FB', mislic: '#F5F7FB', certs: '#F5F7FB', inglic: '#F5F7FB', detalle: '#F5F7FB', perfil: '#F5F7FB' };
const themeMeta = document.querySelector('meta[name=theme-color]');
// Pantallas y overlays claros: en la app instalada muestran la franja azul detrás de la hora
// Pantallas del sitio público: son las que siguen el modo oscuro
const PUBLIC_SCREENS = new Set(['onboarding', 'rut', 'password', 'home', 'beneficios', 'detalle', 'licpub']);
const PRIVATE_SCREENS = new Set(['privado', 'parati', 'perfil', 'licencia', 'mislic', 'certs', 'inglic']);
document.addEventListener('screen:before', e => {
  const n = e.detail.name, root = document.documentElement;
  if (PRIVATE_SCREENS.has(n)) root.classList.add('in-private');
  else if (n === 'home' || n === 'onboarding' || n === 'splash' || n === 'rut') root.classList.remove('in-private');
});
const LIGHT_SCREENS = new Set(['rut', 'password', 'beneficios', 'parati', 'licpub', 'mislic', 'detalle', 'perfil', 'licencia']);
function updateBar() {
  const overlay = ['drawer', 'drawerPriv', 'mapFull', 'wz', 'waChat'].some(id => document.getElementById(id)?.classList.contains('open'));
  // Menú público en modo oscuro: la barra superior también va oscura
  const darkMenu = (document.documentElement.classList.contains('theme-dark') && document.getElementById('drawer')?.classList.contains('open'))
    || (document.getElementById('mapFull')?.classList.contains('open') && document.getElementById('mapFull').classList.contains('is-dark'));
  const root = document.documentElement;
  const darkPublic = root.classList.contains('theme-dark') && !root.classList.contains('in-private') && PUBLIC_SCREENS.has(current) && !overlay;
  const light = !darkMenu && !darkPublic && !document.getElementById('waChat')?.classList.contains('open') && (overlay || LIGHT_SCREENS.has(current));
  document.documentElement.dataset.bar = light ? 'light' : 'dark';
  // iOS tiñe la zona de la hora con el fondo de la página: usamos el color superior de cada pantalla
  const waOpen = document.getElementById('waChat')?.classList.contains('open');
  const top = waOpen ? '#075E54' : darkMenu ? '#0B0F2A' : darkPublic && current !== 'home' ? '#0B0F2A' : overlay ? '#ffffff' : ((current === 'home' && window.brandBar) || BAR_COLOR[current] || '#ffffff');
  if (matchMedia('(hover: none) and (pointer: coarse)').matches) {
    document.documentElement.style.background = top;
    document.body.style.background = top;
  }
  if (themeMeta) themeMeta.content = top;
}
document.addEventListener('screen:enter', updateBar);
document.addEventListener('DOMContentLoaded', () => {
  const mo = new MutationObserver(updateBar);
  ['drawer', 'drawerPriv', 'mapFull', 'wz', 'waChat'].forEach(id => { const el = document.getElementById(id); if (el) mo.observe(el, { attributes: true, attributeFilter: ['class'] }); });
  updateBar();
});

// Splash → onboarding (o directo a una pantalla con #home, #rut, #password, #onboarding, #beneficios, #detalle)
// Se ejecuta al terminar de cargar todos los scripts (benefits.js escucha los eventos de pantalla)
document.addEventListener('DOMContentLoaded', () => {
go('home');
});

// Splash: la animación oficial del logo va primero; casi al final entran los elementos del fondo
// (formas, trazos y montaña) y, cuando el logo terminó, se abre la cortina hacia el onboarding
function splashIntro() {
  const v = $('#splashVideo'), sp = screenEl('splash');
  const LEAD = 1.1; // segundos antes del final del logo en que entran los elementos
  let done = false, artIn = false, artReady = false, logoDone = false;
  const next = () => {
    if (done) return; done = true;
    sp.classList.add('sp-art-in', 'sp-end');
    setTimeout(() => { if (sp.classList.contains('is-active')) go('onboarding'); }, reduceMotion ? 100 : 1250);
  };
  const tryNext = () => { if (artReady && logoDone) next(); };
  const showArt = () => {
    if (artIn) return; artIn = true;
    sp.classList.add('sp-art-in');
    setTimeout(() => { artReady = true; tryNext(); }, 950);
  };
  const endLogo = () => { logoDone = true; showArt(); tryNext(); };
  if (reduceMotion || !v) { if (v) v.poster = 'assets/splash-end.jpg'; sp.classList.add('sp-art-in'); setTimeout(next, 1200); return; }
  v.addEventListener('timeupdate', () => { if (v.duration && v.currentTime >= v.duration - LEAD) showArt(); });
  v.addEventListener('ended', endLogo);
  v.addEventListener('error', () => setTimeout(endLogo, 800));
  sp.addEventListener('click', next);
  // Si el teléfono bloquea la reproducción, muestra el logo final y sigue con los elementos
  v.pause();
  setTimeout(() => {
    v.currentTime = 0;
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.poster = 'assets/splash-end.jpg'; setTimeout(endLogo, 1200); });
  }, 100);
  setTimeout(endLogo, 10000);
}

// ---------- Swipe genérico ----------
function onSwipe(el, cb) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) cb(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

// ---------- Carrusel con puntos (hero y onboarding) ----------
function dotCarousel(track, dotsWrap, interval) {
  const dots = [...dotsWrap.querySelectorAll('button')];
  let idx = 0, timer;
  function show(i) {
    idx = (i + dots.length) % dots.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle('on', n === idx));
    restart();
  }
  function restart() {
    clearInterval(timer);
    if (interval) timer = setInterval(() => show(idx + 1), interval);
  }
  dots.forEach((d, n) => d.addEventListener('click', () => show(n)));
  onSwipe(track, dir => show(idx + dir));
  restart();
}
dotCarousel(document.getElementById('slides'), document.getElementById('dots'), 5000);
dotCarousel(document.getElementById('obSlides'), document.getElementById('obDots'), 4000);
// La foto del onboarding se desliza junto al mensaje activo y también se puede pasar con el dedo
(() => {
  const imgs = [...document.querySelectorAll('.ob-photo .ob-img')], dots = [...document.querySelectorAll('#obDots button')];
  const cur = () => dots.findIndex(b => b.classList.contains('on'));
  const sync = () => { const i = cur(); imgs.forEach((im, n) => { im.classList.toggle('on', n === i); im.style.translate = `${(n - i) * 100}% 0`; }); };
  new MutationObserver(sync).observe(document.getElementById('obDots'), { subtree: true, attributes: true, attributeFilter: ['class'] });
  onSwipe(document.querySelector('.ob-photo'), dir => dots[(cur() + dir + dots.length) % dots.length].click());
  sync();
})();

// ---------- Accesos directos: carrusel horizontal (touch + arrastre con mouse) ----------
const accRow = document.getElementById('accRow');
let drag = null;
accRow.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') return;
  drag = { x: e.clientX, left: accRow.scrollLeft, moved: false };
});
window.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 4 && !drag.moved) { drag.moved = true; accRow.classList.add('dragging'); }
  accRow.scrollLeft = drag.left - dx;
});
window.addEventListener('pointerup', () => {
  if (!drag) return;
  accRow.classList.remove('dragging');
  // Evita que el arrastre dispare el click en la tarjeta
  if (drag.moved) accRow.addEventListener('click', ev => ev.preventDefault(), { capture: true, once: true });
  drag = null;
});
accRow.addEventListener('wheel', e => {
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { accRow.scrollLeft += e.deltaY; e.preventDefault(); }
}, { passive: false });

// ---------- Navbar ----------
const navBtns = [...document.querySelectorAll('#nav button')];
// Solo "Inicio" queda activo: los demás abren su destino (pantalla, mapa o ayuda)
navBtns.forEach(b => b.addEventListener('click', () => { if (!b.dataset.go && b.id !== 'navSuc' && b.id !== 'navSuc2' && !b.dataset.toast) navBtns.forEach(o => o.classList.toggle('on', o === b)); }));

// ---------- Login: RUT ----------
const rut = document.getElementById('rut');
const rutForm = document.getElementById('rutForm');

function cleanRut(v) { return v.replace(/[^0-9kK]/g, '').toUpperCase(); }
function formatRut(v) {
  const c = cleanRut(v);
  if (c.length < 2) return c;
  const body = c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${c.slice(-1)}`;
}
function validRut(v) {
  const c = cleanRut(v);
  if (c.length < 8) return false;
  const body = c.slice(0, -1), dv = c.slice(-1);
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) { sum += +body[i] * mul; mul = mul === 7 ? 2 : mul + 1; }
  const res = 11 - (sum % 11);
  return dv === (res === 11 ? '0' : res === 10 ? 'K' : String(res));
}
rut.addEventListener('input', () => {
  rut.value = formatRut(rut.value);
  rutForm.classList.remove('has-error');
});
rutForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validRut(rut.value)) { rutForm.classList.add('has-error'); rut.focus(); return; }
  go('password');
});

// ---------- Login: contraseña ----------
const pw = document.getElementById('pw');
const pwSubmit = document.getElementById('pwSubmit');
// Solo Face ID habilitado: el botón principal y el ícono lanzan la verificación inmersiva (private.js)
document.getElementById('pwForm').addEventListener('submit', e => { e.preventDefault(); startFaceId(); });
document.getElementById('faceBtn').addEventListener('click', () => startFaceId());

// ---------- Menú lateral ----------
// Overlay según Figma: "Open overlay" arriba a la derecha, fondo #000 al 50 %, Move in, 600 ms.
// No se cierra al tocar fuera (igual que en el prototipo); se cierra con la X o con Escape.
const backdrop = document.getElementById('drawerBackdrop');
let menuBtn = null, homeScreen = null;   // botón que abrió el menú y pantalla de fondo
let lastFocus = null;
const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

function openDrawer(opener) {
  if (HOMES_ONLY) return;
  if (DRAWERS.pub.classList.contains('open') || DRAWERS.priv.classList.contains('open')) return;
  // En el Home privado se abre el menú privado; en el resto, el público
  drawer = current === 'privado' ? DRAWERS.priv : DRAWERS.pub;
  homeScreen = screenEl(current);
  menuBtn = opener || homeScreen.querySelector('[data-drawer=open]');
  lastFocus = document.activeElement;
  drawer.classList.add('open'); backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  homeScreen.inert = true;
  document.body.classList.add('lock');
  setTimeout(() => drawer.querySelector('[data-drawer=close]').focus(), 60);
}
function closeDrawer() {
  if (!drawer.classList.contains('open')) return;
  if (typeof closeL2 === 'function') setTimeout(() => closeL2(false), 400);
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  homeScreen.inert = false;
  document.body.classList.remove('lock');
  const back = lastFocus && lastFocus !== document.body && !drawer.contains(lastFocus) ? lastFocus : menuBtn;
  back.focus();
}
document.addEventListener('keydown', e => {
  if (!drawer.classList.contains('open')) return;
  if (e.key === 'Escape') { if (drawer.classList.contains('l2-open')) { closeL2(); return; } closeDrawer(); return; }
  if (e.key !== 'Tab') return;
  // Mantiene el foco dentro del menú mientras está abierto
  const items = [...drawer.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

const CATS = [
  { name: 'Licencias Médicas', sub: 'Gestión, pagos y plazos', chip: ['Trámite', 'blue'], icon: 'heart',
    items: ['Consulta de Estado', 'Requisitos y Documentos', 'Etapas y Plazos', 'Cálculo y Fechas de Pago', 'Apelación y Rechazos'] },
  { name: 'Créditos', sub: 'Social, educación y salud', chip: ['Simulador', 'green'], icon: 'coin',
    items: ['Simula tu Crédito', 'Crédito Social', 'Crédito Educación', 'Refinanciamiento', 'Certificados de Deuda'] },
  { name: 'Seguros', sub: 'Protección familiar y vehicular', icon: 'shield',
    items: ['Seguro de Vida', 'Seguro de Salud', 'Seguro Automotriz', 'Seguro Hogar'] },
  { name: 'Beneficios y Convenios', sub: 'Salud, farmacias y descuentos', chip: ['TOP', 'top'], icon: 'gift',
    items: ['Bonos por Nacimiento', 'Bono de Matrimonio', 'Convenios Farmacias', 'Cupones de Descuento'] },
  { name: 'Ahorro e Inversión', sub: 'Metas, APV y Vivienda', icon: 'piggy',
    items: ['Mi Cuenta de Ahorro', 'Ahorro para la Vivienda', 'APV', 'Depósitos y Retiros'] },
  { name: 'Turismo y Recreación', sub: 'Centros vacacionales', icon: 'sun',
    items: ['Centros Vacacionales', 'Paquetes Turísticos', 'Mis Reservas'] },
  { name: 'Pensionados', sub: 'Beneficios y pagos', icon: 'user',
    items: ['Pago de Pensión', 'Beneficios Pensionados', 'Talleres y Actividades'] },
];
const ICONS = {
  heart: '<path d="M13 23s-10-6-10-13a5.5 5.5 0 0 1 10-3 5.5 5.5 0 0 1 10 3c0 7-10 13-10 13Z" stroke="#084AFE" stroke-width="1.6"/><circle cx="13" cy="12.5" r="4.6" fill="#06C2FA"/><path d="M13 10.3v4.4M10.8 12.5h4.4" stroke="#1a2fa8" stroke-width="1.4" stroke-linecap="round"/>',
  coin: '<circle cx="13" cy="13" r="11" stroke="#084AFE" stroke-width="1.6"/><circle cx="13" cy="13" r="8" fill="#06C2FA"/><text x="13" y="17" text-anchor="middle" font-size="11" font-weight="700" fill="#1a2fa8" font-family="Rawson Pro">$</text>',
  gift: '<rect x="5" y="12" width="16" height="10" rx="1" fill="#06C2FA" stroke="#084AFE" stroke-width="1.5"/><rect x="3" y="8" width="20" height="4.5" rx="1" fill="#fff" stroke="#084AFE" stroke-width="1.5"/><path d="M13 8v14M13 8c-2-4-6-5-6-2 0 1.6 3 2 6 2Zm0 0c2-4 6-5 6-2 0 1.600-3 2-6 2Z" stroke="#084AFE" stroke-width="1.5"/>',
  sun: '<circle cx="13" cy="11" r="5" fill="#06C2FA" stroke="#084AFE" stroke-width="1.5"/><path d="M3 21c3-3 6-3 10 0s7 3 10 0" stroke="#084AFE" stroke-width="1.6" stroke-linecap="round"/><path d="M13 2v2M5 5l1.4 1.4M21 5l-1.4 1.4" stroke="#084AFE" stroke-width="1.5" stroke-linecap="round"/>',
  plus: '<rect x="3" y="3" width="20" height="20" rx="6" stroke="#084AFE" stroke-width="1.6"/><path d="M13 8v10M8 13h10" stroke="#06C2FA" stroke-width="2.6" stroke-linecap="round"/>',
  piggy: '<path d="M5 13.5c0-3.9 3.6-6.5 8-6.5 1.2 0 2.3.2 3.3.5l2.2-1.7v3.1c1.1.9 1.9 2 2.2 3.1H22v3.6h-1.5c-.6 1.2-1.5 2.2-2.7 2.9V22h-2.6v-1.6c-.7.1-1.4.2-2.2.2s-1.5-.1-2.2-.2V22H8.2v-2.8C6.3 17.9 5 15.9 5 13.5Z" fill="#06C2FA" stroke="#084AFE" stroke-width="1.5" stroke-linejoin="round"/><circle cx="17.2" cy="12" r="1" fill="#131252"/><path d="M11 9.6h3.6" stroke="#084AFE" stroke-width="1.5" stroke-linecap="round"/><circle cx="12.8" cy="3.4" r="2.2" fill="#FBB917" stroke="#084AFE" stroke-width="1.2"/>',
  shield: '<path d="M13 2 4 5.5v6.8c0 5.4 3.8 9.7 9 11.7 5.2-2 9-6.3 9-11.7V5.5L13 2Z" stroke="#084AFE" stroke-width="1.6" stroke-linejoin="round"/><circle cx="13" cy="12.5" r="5" fill="#06C2FA"/><path d="m10.8 12.6 1.6 1.6 3-3.2" stroke="#1a2fa8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  user: '<circle cx="13" cy="9" r="5" fill="#06C2FA" stroke="#084AFE" stroke-width="1.5"/><path d="M3.5 23c.8-5 4.600-8 9.500-8s8.7 3 9.5 8" stroke="#084AFE" stroke-width="1.6" stroke-linecap="round"/>',
};

const acc = document.getElementById('accordion');
// Nivel 1: lista de categorías (sin desplegables). Nivel 2: panel dentro del mismo menú.
const CHEV_R = '<svg class="cat-chev" aria-hidden="true" width="8" height="13" viewBox="0 0 8 13" fill="none" stroke="#6b7089" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m1.5 1.5 5 5-5 5"/></svg>';
acc.innerHTML = CATS.map((c, i) => `
  <div class="cat">
    <button class="cat-head" data-cat-i="${i}" aria-haspopup="true" aria-controls="drL2">
      <svg class="cat-ico" aria-hidden="true" viewBox="0 0 26 26" fill="none">${ICONS[c.icon]}</svg>
      <span class="cat-txt"><strong>${c.name}</strong><small>${c.sub}</small></span>
      ${c.chip ? `<span class="tr-chip ${c.chip[1]}">${c.chip[0]}</span>` : ''}
      ${CHEV_R}
    </button>
  </div>`).join('');

const pubDrawer = document.getElementById('drawer');
const l2 = document.createElement('section');
l2.className = 'dr-l2'; l2.id = 'drL2'; l2.setAttribute('aria-hidden', 'true'); l2.inert = true;
l2.innerHTML = `<div class="l2-top">
    <button class="l2-back" type="button"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 1.5 1.5 7.5l6 6"/></svg>Categorías</button>
    <button class="close" data-drawer="close" aria-label="Cerrar menú"><svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" stroke="#2a2e4a" stroke-width="1.8" stroke-linecap="round"><path d="M2 2l10 10M12 2 2 12"/></svg></button>
  </div>
  <div class="l2-head"><svg class="cat-ico" aria-hidden="true" viewBox="0 0 26 26" fill="none"></svg><div><h3 id="l2Title"></h3><small id="l2Sub"></small></div></div>
  <nav class="l2-list" aria-labelledby="l2Title"></nav>`;
pubDrawer.appendChild(l2);
let l2Opener = null;
function openL2(i, opener) {
  const c = CATS[i];
  l2Opener = opener;
  l2.querySelector('.cat-ico').innerHTML = ICONS[c.icon];
  l2.querySelector('#l2Title').textContent = c.name;
  l2.querySelector('#l2Sub').textContent = c.sub;
  l2.querySelector('.l2-list').innerHTML = c.items.map(it => `<a href="#" class="l2-item" ${i === 0 ? 'data-go="licpub"' : `data-toast="Abriendo ${it}"`}>${it}${CHEV_R}</a>`).join('');
  pubDrawer.classList.add('l2-open');
  l2.setAttribute('aria-hidden', 'false'); l2.inert = false;
  l2.style.top = pubDrawer.scrollTop + 'px'; l2.style.height = pubDrawer.clientHeight + 'px';
  if (typeof haptic === 'function') haptic(6);
  setTimeout(() => l2.querySelector('.l2-back').focus({ preventScroll: true }), 320);
}
function closeL2(focus = true) {
  if (!pubDrawer.classList.contains('l2-open')) return;
  pubDrawer.classList.remove('l2-open'); pubDrawer.classList.add('l2-closing'); setTimeout(() => pubDrawer.classList.remove('l2-closing'), 600);
  l2.setAttribute('aria-hidden', 'true'); l2.inert = true;
  if (focus && l2Opener) setTimeout(() => l2Opener.focus({ preventScroll: true }), 320);
}
acc.addEventListener('click', e => {
  const head = e.target.closest('.cat-head');
  if (head) openL2(+head.dataset.catI, head);
});
l2.querySelector('.l2-back').addEventListener('click', () => closeL2());

// ---------- Sin zoom de página (comportamiento de app) ----------
// iOS ignora a veces user-scalable=no: bloqueamos el pellizco (el doble toque lo evita touch-action en CSS).
['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
document.addEventListener('wheel', e => { if (e.ctrlKey && !e.target.closest('.map')) e.preventDefault(); }, { passive: false });
