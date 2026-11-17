// =====================================================================
// Navegación paso a paso "tipo Waze" hacia un beneficio (simulada)
// Usa WORLD, ME, STREETS_V, pinByKey, worldSVG (map.js), BENEFITS/openSheet/confetti/toast
// (benefits.js), go/haptic/EASE/reduceMotion (app.js) y closeMapFull (private.js).
// =====================================================================

const wz = document.getElementById('wz');
const wzMap = document.getElementById('wzMap');
const M_PER_PX = 1000 / WORLD.pxPerKm;                       // 4 metros por unidad del mapa
const SPEED = { car: 22, walk: 4.8, bike: 14 };              // km/h promedio urbano
const TURN_ICON = {
  straight: '<svg viewBox="0 0 24 24"><path d="M12 21V5M6 10l6-6 6 6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg viewBox="0 0 24 24"><path d="M6 21v-7a5 5 0 0 1 5-5h8M15 5l4 4-4 4" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  left: '<svg viewBox="0 0 24 24"><path d="M18 21v-7a5 5 0 0 0-5-5H5M9 5 5 9l4 4" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrive: '<svg viewBox="0 0 24 24"><path d="M12 22s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 15.9 12 22 12 22Z" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="12" cy="10.5" r="2.6" fill="#fff"/></svg>',
};

// Mapa propio de la navegación (mundo + ruta + auto + destino)
wzMap.innerHTML = `<div class="map-world wz-world">${worldSVG()}
  <svg class="wz-route" viewBox="0 0 ${WORLD.w} ${WORLD.h}" width="${WORLD.w}" height="${WORLD.h}" aria-hidden="true">
    <path id="wzRouteCasing" d="" pathLength="1"/><path id="wzRouteLine" d="" pathLength="1"/><path id="wzRouteDone" d="" pathLength="1"/>
  </svg>
  <span class="wz-origin" aria-hidden="true"></span>
  <span class="wz-destpin" id="wzDestPin" aria-hidden="true"><b></b></span>
  <span class="wz-car" id="wzCar" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#fff"/><circle cx="20" cy="20" r="14" fill="#084AFE"/><path d="M20 9 28 29l-8-4-8 4Z" fill="#fff"/></svg></span>
</div>`;
const wWorld = wzMap.querySelector('.wz-world');
const $w = id => document.getElementById(id);
let route = null, mode = 'car', runRaf = 0, cam = { x: 0, y: 0, z: 1 }, following = true, wzOpener = null;

function buildRoute(p) {
  const S = { x: ME.x, y: ME.y }, D = { x: p.wx, y: p.wy };
  let pts;
  if (Math.abs(D.y - S.y) < 22) pts = [S, { x: D.x, y: S.y }, D];
  else {
    const v = STREETS_V.reduce((a, b) => (Math.abs(b.x - D.x) < Math.abs(a.x - D.x) ? b : a));
    pts = [S, { x: v.x, y: S.y }, { x: v.x, y: D.y }, D];
  }
  pts = pts.filter((q, i) => i === 0 || Math.hypot(q.x - pts[i - 1].x, q.y - pts[i - 1].y) > 1);
  const segs = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], len = Math.hypot(b.x - a.x, b.y - a.y);
    const horiz = Math.abs(b.y - a.y) < 1;
    const street = horiz ? (Math.abs(a.y - ME.y) < 1 ? 'Av. Providencia' : 'la calle del local') : (STREETS_V.find(s => Math.abs(s.x - a.x) < 1)?.n || 'la calle del local');
    segs.push({ a, b, len, street, dx: (b.x - a.x) / len, dy: (b.y - a.y) / len });
  }
  let acc = 0; segs.forEach(s => { s.start = acc; acc += s.len; });
  // Maniobra al final de cada tramo (pantalla con y hacia abajo: cruz > 0 = derecha)
  segs.forEach((s, i) => {
    const n = segs[i + 1];
    if (!n) { s.man = { type: 'arrive', text: `Llegas a ${p.place}` }; return; }
    const cross = s.dx * n.dy - s.dy * n.dx;
    const side = cross > 0 ? 'derecha' : 'izquierda';
    s.man = i + 1 === segs.length - 1 && n.len < 40
      ? { type: cross > 0 ? 'right' : 'left', text: `Tu destino está a la ${side}` }
      : { type: cross > 0 ? 'right' : 'left', text: `Gira a la ${side} en ${n.street}` };
  });
  const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q.x} ${q.y}`).join(' ');
  return { p, pts, segs, total: acc, d };
}

const fmtM = px => { const m = px * M_PER_PX; return m >= 1000 ? `${(m / 1000).toFixed(1).replace('.', ',')} km` : `${Math.max(10, Math.round(m / 10) * 10)} m`; };
const minsFor = (px, md) => Math.max(1, Math.round((px * M_PER_PX / 1000) / SPEED[md] * 60));
function clock(addMin) { const t = 18 * 60 + 37 + addMin; return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; }

// ---------- Cámara ----------
function camApply(glide) {
  wWorld.classList.toggle('glide', !!glide);
  wWorld.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`;
  wWorld.style.setProperty('--iz', (1 / cam.z).toFixed(3));
}
function fitRoute(glide = true) {
  const r = wzMap.getBoundingClientRect();
  const top = 150, bottom = wz.querySelector('.wz-panel').getBoundingClientRect().height + 30;
  const xs = route.pts.map(q => q.x), ys = route.pts.map(q => q.y);
  const bx = Math.min(...xs), by = Math.min(...ys), bw = Math.max(60, Math.max(...xs) - bx), bh = Math.max(60, Math.max(...ys) - by);
  cam.z = Math.max(0.55, Math.min(1.6, (r.width - 90) / bw, (r.height - top - bottom - 40) / bh));
  cam.x = r.width / 2 - (bx + bw / 2) * cam.z;
  cam.y = top + (r.height - top - bottom) / 2 - (by + bh / 2) * cam.z;
  camApply(glide);
}
function follow(pos) {
  const r = wzMap.getBoundingClientRect();
  cam.z = 1.45;
  cam.x = r.width / 2 - pos.x * cam.z;
  cam.y = r.height * 0.56 - pos.y * cam.z;
  camApply(false);
}

// ---------- UI ----------
function setState(s) {
  wz.dataset.state = s;
  // Los controles flotantes (velocidad, centrar, calle) se ubican sobre el panel inferior
  requestAnimationFrame(() => wz.style.setProperty('--panel-h', `${wz.querySelector('.wz-panel').offsetHeight}px`));
}
function paintPreview() {
  const { p, total } = route;
  $w('wzLogo').textContent = p.name[0]; $w('wzLogo').style.setProperty('--c', p.color);
  $w('wzDest').textContent = p.place; $w('wzAddr').textContent = p.addr; $w('wzPct').innerHTML = `${p.pct}<small>DCTO</small>`;
  wz.querySelectorAll('[data-eta]').forEach(el => { el.textContent = `${minsFor(total, el.dataset.eta)} min`; });
  const m = minsFor(total, mode);
  $w('wzEta').textContent = `${m} min`;
  $w('wzMeta').textContent = `${fmtM(total)} · Llegada ${clock(m)}`;
  const first = route.segs[0];
  setInstr(first, first.len);
}
function setInstr(seg, remainPx) {
  $w('wzTurn').innerHTML = TURN_ICON[seg.man.type];
  $w('wzStepDist').textContent = seg.man.type === 'arrive' && remainPx < 8 ? 'Ahora' : fmtM(remainPx);
  $w('wzStepTxt').textContent = seg.man.text;
  const i = route.segs.indexOf(seg), nxt = route.segs[i + 1];
  const nextEl = $w('wzNext');
  if (nxt && nxt.man) { nextEl.hidden = false; $w('wzNextTxt').innerHTML = `${TURN_ICON[nxt.man.type]}${nxt.man.text}`; }
  else nextEl.hidden = true;
  $w('wzStreet').textContent = seg.street === 'la calle del local' ? route.p.addr : seg.street;
}

function drawRoute() {
  ['wzRouteCasing', 'wzRouteLine', 'wzRouteDone'].forEach(id => $w(id).setAttribute('d', route.d));
  $w('wzRouteDone').style.strokeDasharray = '0 1';
  const line = $w('wzRouteLine'), casing = $w('wzRouteCasing');
  [line, casing].forEach(l => { l.style.animation = 'none'; void l.getBoundingClientRect(); l.style.animation = ''; });
  const { p } = route, dp = $w('wzDestPin');
  dp.style.left = `${p.wx}px`; dp.style.top = `${p.wy}px`; dp.style.setProperty('--c', p.color);
  dp.querySelector('b').textContent = p.name[0];
  dp.classList.remove('bounce');
  wWorld.querySelector('.wz-origin').style.cssText = `left:${ME.x}px;top:${ME.y}px`;
  placeCar(route.pts[0], route.segs[0]);
}
function placeCar(pos, seg) {
  const car = $w('wzCar');
  car.style.left = `${pos.x}px`; car.style.top = `${pos.y}px`;
  car.style.setProperty('--rot', `${Math.atan2(seg.dy, seg.dx) * 180 / Math.PI + 90}deg`);
}

// ---------- Abrir / cerrar (transición inmersiva desde el mapa) ----------
// La navegación nace del mapa pequeño: arranca recortada a su tamaño, con el mismo encuadre
// y zoom, y se expande a pantalla completa mientras la cámara vuela a encuadrar la ruta.
let origin = null;              // { clip, cam } del mapa desde donde se abrió
function sourceFrom(opener) {
  const mapEl = opener && (opener.closest('.map') || (opener.closest('#mapFull') && document.querySelector('#mapFull .mf-map')));
  if (!mapEl) return null;
  const world = mapEl.querySelector('.map-world');
  const m = world && /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([\d.]+)\)/.exec(world.style.transform);
  const r = mapEl.getBoundingClientRect(), f = wz.getBoundingClientRect();
  if (!m || !r.width || r.bottom < 0 || r.top > innerHeight) return null;
  return {
    clip: `inset(${Math.max(0, r.top - f.top)}px ${Math.max(0, f.right - r.right)}px ${Math.max(0, f.bottom - r.bottom)}px ${Math.max(0, r.left - f.left)}px round 18px)`,
    cam: { x: r.left - f.left + +m[1], y: r.top - f.top + +m[2], z: +m[3] },
  };
}
// Espera una animación, pero nunca más de lo que dura (si la app queda en segundo plano)
const done = (a, ms) => Promise.race([a.finished.catch(() => {}), new Promise(res => setTimeout(() => { try { a.finish(); } catch (_) {} res(); }, ms + 120))]);
const CHROME = () => [wz.querySelector('.wz-top'), wz.querySelector('.wz-panel'), $w('wzRecenter')];

function openRoute(key, opener) {
  const p = pinByKey(key);
  if (!p) return;
  cancelAnimationFrame(runRaf);
  route = buildRoute(p); wzOpener = opener || null; following = true;
  setState('preview');
  wz.classList.add('open'); wz.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  haptic(10);
  drawRoute(); paintPreview();
  origin = reduceMotion ? null : sourceFrom(opener);
  if (origin) {
    // 1) mismo encuadre que el mapa pequeño
    Object.assign(cam, origin.cam); camApply(false);
    wz.classList.add('immersive');
    // 2) el recorte crece hasta la pantalla completa
    wz.animate([{ clipPath: origin.clip }, { clipPath: 'inset(0 0 0 0 round 0px)' }], { duration: 640, easing: EASE });
    // 3) la cámara vuela a encuadrar la ruta mientras se dibuja la línea
    setTimeout(() => fitRoute(true), 90);
    const [top, panel, rc] = CHROME();
    top.animate([{ transform: 'translateY(-110%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 560, delay: 260, easing: EASE, fill: 'backwards' });
    panel.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 600, delay: 220, easing: EASE, fill: 'backwards' });
    rc.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 400, delay: 520, easing: EASE, fill: 'backwards' });
    setTimeout(() => wz.classList.remove('immersive'), 900);
  } else {
    requestAnimationFrame(() => fitRoute(false));
    if (!reduceMotion) wz.animate([{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: EASE });
  }
  $w('wzLive').textContent = `Ruta hacia ${p.place}: ${$w('wzMeta').textContent}`;
  setTimeout(() => $w('wzGo').focus({ preventScroll: true }), 80);
}
async function closeRoute(restoreFocus = true, toMap = true) {
  if (!wz.classList.contains('open')) return;
  cancelAnimationFrame(runRaf);
  const back = toMap && !reduceMotion && wzOpener && document.contains(wzOpener) ? sourceFrom(wzOpener) : null;
  if (back) {
    // Se recoge de vuelta dentro del mapa desde donde se abrió
    const [top, panel, rc] = CHROME();
    top.animate([{ transform: 'none' }, { transform: 'translateY(-110%)', opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
    panel.animate([{ transform: 'none' }, { transform: 'translateY(105%)' }], { duration: 320, easing: 'ease-in', fill: 'forwards' });
    rc.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    Object.assign(cam, back.cam); camApply(true);
    await done(wz.animate([{ clipPath: 'inset(0 0 0 0 round 0px)' }, { clipPath: back.clip }], { duration: 520, delay: 120, easing: EASE }), 640);
    CHROME().forEach(el => el.getAnimations().forEach(a => a.cancel()));
  } else if (!reduceMotion) {
    await done(wz.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(1.03)' }], { duration: 260, easing: 'ease-in' }), 260);
  }
  wz.classList.remove('open'); wz.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('mapFull').classList.contains('open')) document.body.classList.remove('lock');
  if (restoreFocus && wzOpener && document.contains(wzOpener)) wzOpener.focus({ preventScroll: true });
}

// ---------- Simulación del recorrido ----------
function startRoute() {
  setState('driving');
  haptic([10, 40, 10]);
  $w('wzLive').textContent = `Ruta iniciada · ${$w('wzEta').textContent}`;   // solo para lector de pantalla
  const { segs, total } = route;
  const T = reduceMotion ? 1500 : Math.max(5200, Math.min(11000, total * 16));
  const mins = minsFor(total, mode);
  const t0 = performance.now();
  let lastSeg = null;
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const tick = now => {
    const t = Math.min(1, (now - t0) / T), s = total * ease(t);
    const seg = segs.find(g => s <= g.start + g.len + 0.001) || segs[segs.length - 1];
    const local = Math.min(seg.len, s - seg.start);
    const pos = { x: seg.a.x + seg.dx * local, y: seg.a.y + seg.dy * local };
    placeCar(pos, seg);
    if (following) follow(pos);
    const remain = total - s;
    setInstr(seg, seg.len - local);
    if (seg !== lastSeg) { if (lastSeg) haptic(8); lastSeg = seg; $w('wzLive').textContent = `${seg.man.text}`; }
    const left = Math.max(0, Math.ceil(mins * (remain / total)));
    $w('wzLiveEta').textContent = left ? `${left} min` : 'Llegando';
    $w('wzLiveMeta').textContent = `${fmtM(remain)} · ${clock(mins)}`;
    $w('wzProg').style.width = `${t * 100}%`;
    $w('wzRouteDone').style.strokeDasharray = `${s / total} 1`;
    const base = SPEED[mode], speed = t > 0.03 && t < 0.97 ? Math.round(base * (1.1 + 0.35 * Math.sin(now / 700))) : Math.round(base * 0.3 * (t < 0.5 ? t / 0.03 : (1 - t) / 0.03));
    $w('wzSpeed').textContent = Math.max(0, speed);
    if (t < 1) runRaf = requestAnimationFrame(tick);
    else arrive();
  };
  runRaf = requestAnimationFrame(tick);
}
function arrive() {
  const { p } = route;
  setState('arrived');
  $w('wzSpeed').textContent = '0';
  $w('wzArrName').textContent = p.place;
  const b = BENEFITS[p.id];
  $w('wzArrSub').textContent = b && b.mode ? `${b.mode} · ${p.pct} de descuento` : 'Presenta tu RUT para obtener tu descuento.';
  $w('wzDestPin').classList.add('bounce');
  haptic([14, 60, 24]);
  fitRoute(true);
  confetti($w('wzDetail'));
  $w('wzLive').textContent = `Llegaste a ${p.place}`;
  setTimeout(() => $w('wzTake').focus({ preventScroll: true }), 120);
}

// Salida hacia el detalle del beneficio (y, opcionalmente, directo al "Cómo canjear")
async function exitToDetail(take) {
  const id = route.p.id;
  await closeRoute(false, false);
  if (typeof closeMapFull === 'function') await closeMapFull();
  if (current === 'detalle') { renderDetail(id); window.scrollTo(0, 0); }
  else go('detalle', { id });
  if (take) setTimeout(() => openSheet(), 700);
}

// ---------- Eventos ----------
document.addEventListener('click', e => {
  const r = e.target.closest('[data-route]');
  if (r && !e.defaultPrevented) { e.preventDefault(); e.stopPropagation(); openRoute(r.dataset.route, r); }
});
wz.querySelector('.wz-modes').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  mode = b.dataset.mode; haptic(6);
  wz.querySelectorAll('.wz-modes button').forEach(o => { o.classList.toggle('on', o === b); o.setAttribute('aria-checked', o === b); });
  paintPreview();
});
$w('wzGo').addEventListener('click', startRoute);
$w('wzCancel').addEventListener('click', () => closeRoute());
$w('wzEnd').addEventListener('click', () => { cancelAnimationFrame(runRaf); toast('Navegación terminada', 'i'); closeRoute(); });
$w('wzClose').addEventListener('click', () => closeRoute());
$w('wzDetail').addEventListener('click', () => exitToDetail(false));
$w('wzTake').addEventListener('click', () => exitToDetail(true));
$w('wzRecenter').addEventListener('click', () => {
  haptic(6); following = true;
  if (wz.dataset.state !== 'driving') fitRoute(true);
});
// Arrastrar el mapa durante la navegación deja de seguir al auto (como en Waze)
(function panNav() {
  let d = null;
  wzMap.addEventListener('pointerdown', e => { d = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y }; try { wzMap.setPointerCapture(e.pointerId); } catch (_) {} });
  wzMap.addEventListener('pointermove', e => {
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) < 4) return;
    following = false; cam.x = d.cx + dx; cam.y = d.cy + dy; camApply(false);
  });
  wzMap.addEventListener('pointerup', () => { d = null; });
  wzMap.addEventListener('pointercancel', () => { d = null; });
})();
document.addEventListener('keydown', e => {
  if (!wz.classList.contains('open')) return;
  if (e.key === 'Escape') { e.stopPropagation(); closeRoute(); }
}, true);
window.addEventListener('resize', () => { if (wz.classList.contains('open') && wz.dataset.state !== 'driving') fitRoute(false); });
