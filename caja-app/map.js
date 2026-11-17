// =====================================================================
// Mapa de beneficios navegable (arrastrar, inercia, zoom) + datos de calles
// Se carga antes de benefits.js. Usa haptic/EASE/reduceMotion de app.js y,
// en tiempo de ejecución, $, $$, segmented() y toast() de benefits.js.
// =====================================================================

const WORLD = { w: 1000, h: 800, pxPerKm: 250 };
const ME = { x: 390, y: 420 };                     // ubicación del afiliado (Av. Providencia)

// Calles del "mundo" (sirven para dibujar y para calcular rutas tipo Waze)
const STREETS_H = [
  { y: 150, n: 'Av. Santa María', main: false }, { y: 240, n: 'Av. Costanera', main: false },
  { y: 330, n: 'Av. Andrés Bello', main: true }, { y: 420, n: 'Av. Providencia', main: true },
  { y: 520, n: 'Av. Eliodoro Yáñez', main: false }, { y: 640, n: 'Av. Irarrázaval', main: true },
  { y: 740, n: 'Av. Grecia', main: false },
];
const STREETS_V = [
  { x: 70, n: 'Av. Vicuña Mackenna', main: true }, { x: 190, n: 'Av. Seminario', main: false },
  { x: 300, n: 'Av. Salvador', main: false }, { x: 430, n: 'Av. Pedro de Valdivia', main: true },
  { x: 560, n: 'Av. Los Leones', main: true }, { x: 690, n: 'Av. Suecia', main: false },
  { x: 820, n: 'Av. Tobalaba', main: true }, { x: 950, n: 'Av. El Bosque', main: false },
];

const PIN_COLORS = { cruzverde: '#15803D', copec: '#B3121B', aramco: '#00796B', smartfit: '#1A1A1A', salcobrand: '#0B8457', hoyts: '#B25E00', chequeo: '#C62F34', cabanas: '#084AFE', jetsmart: '#1C6CF0' };
const PINS = [
  { key: 'sb-prov', id: 'salcobrand', name: 'Salcobrand', place: 'Salcobrand Providencia', addr: 'Av. Pedro de Valdivia 142', wx: 446, wy: 400, off: '-45%', pct: '45%' },
  { key: 'hoyts-cost', id: 'hoyts', name: 'Cinemark', place: 'Cinemark Costanera Center', addr: 'Av. Andrés Bello 2425', wx: 545, wy: 312, pct: '$3.600' },
  { key: 'sb-leones', id: 'salcobrand', name: 'Salcobrand', place: 'Salcobrand Los Leones', addr: 'Av. Los Leones 1180', wx: 578, wy: 505, off: '-45%', pct: '45%' },
  { key: 'med-prov', id: 'chequeo', name: 'RedSalud', place: 'RedSalud Providencia', addr: 'Centro médico y dental', wx: 706, wy: 250, off: '-60%', pct: '60%' },
  { key: 'sb-nunoa', id: 'salcobrand', name: 'Salcobrand', place: 'Salcobrand Ñuñoa', addr: 'Av. Irarrázaval 3310', wx: 520, wy: 660, off: '-45%', pct: '45%' },
  { key: 'tur-lc', id: 'cabanas', name: 'Turismo CLA', place: 'Sucursal Caja Los Andes', addr: 'Reserva de centros turísticos', wx: 838, wy: 626, pct: 'Cabañas' },
  { key: 'med-lc', id: 'chequeo', name: 'RedSalud', place: 'RedSalud Las Condes', addr: 'Centro médico y dental', wx: 934, wy: 404, off: '-60%', pct: '60%' },
  { key: 'hoyts-pa', id: 'hoyts', name: 'Cinemark', place: 'Cinemark Alto Las Condes', addr: 'Av. Kennedy 9001', wx: 962, wy: 150, pct: '$3.600' },
  { key: 'cv-prov', id: 'cruzverde', name: 'Cruz Verde', place: 'Cruz Verde Providencia', addr: 'Farmacia en convenio', wx: 300, wy: 470, off: '-45%', pct: '45%' },
  { key: 'copec-prov', id: 'copec', name: 'Copec', place: 'Copec Av. Providencia', addr: 'Estación de servicio', wx: 610, wy: 390, off: '$15', pct: '$15/lt' },
  { key: 'aramco-nun', id: 'aramco', name: 'Aramco', place: 'Aramco Irarrázaval', addr: 'Estación de servicio', wx: 700, wy: 700, off: '$100', pct: '$100/lt' },
  { key: 'sf-prov', id: 'smartfit', name: 'Smart Fit', place: 'Smart Fit Providencia', addr: 'Gimnasio en convenio', wx: 250, wy: 300, off: '$0', pct: 'Matrícula $0' },
];
PINS.forEach(p => {
  p.color = PIN_COLORS[p.id];
  p.km = Math.hypot(p.wx - ME.x, p.wy - ME.y) / WORLD.pxPerKm;
  p.dist = p.km < 1 ? `${Math.round(p.km * 1000 / 10) * 10}m` : `${p.km.toFixed(1).replace('.', ',')} km`;
  p.range = p.km <= 1 ? 1 : p.km <= 3 ? 3 : 99;
});
const pinByKey = k => PINS.find(p => p.key === k);

function zoneAt(x, y) {
  if (y > 580) return 'Ñuñoa';
  if (x < 320) return 'Santiago Centro';
  if (x > 640) return 'Las Condes';
  return 'Providencia';
}

// Dibujo del mundo (SVG) — se reutiliza en todos los mapas y en la navegación
function worldSVG() {
  const road = (d, w, extra = '') => `<path class="w-road" d="${d}" stroke="#fff" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
  const h = STREETS_H.map(s => road(`M-20 ${s.y}H${WORLD.w + 20}`, s.main ? 18 : 9)).join('');
  const v = STREETS_V.map(s => road(`M${s.x} -20V${WORLD.h + 20}`, s.main ? 18 : 9)).join('');
  const minor = [...Array(10)].map((_, i) => road(`M-20 ${105 + i * 75}H${WORLD.w + 20}`, 3.5, 'opacity=".8"')).join('')
    + [...Array(13)].map((_, i) => road(`M${20 + i * 80} -20V${WORLD.h + 20}`, 3.5, 'opacity=".8"')).join('');
  const lblH = STREETS_H.filter(s => s.main).map(s => `<text x="${s.y === 420 ? 150 : 600}" y="${s.y + 4}" class="st-lbl">${s.n.toUpperCase()}</text>`).join('');
  const lblV = STREETS_V.filter(s => s.main).map(s => `<text transform="translate(${s.x + 4} ${s.x === 430 ? 600 : 230}) rotate(90)" class="st-lbl">${s.n.toUpperCase()}</text>`).join('');
  return `<svg class="world-art" viewBox="0 0 ${WORLD.w} ${WORLD.h}" width="${WORLD.w}" height="${WORLD.h}" aria-hidden="true">
    <rect class="w-land" width="${WORLD.w}" height="${WORLD.h}" fill="#EDF1F7"/>
    <path d="M80 60 C160 10 300 20 360 90 C410 150 330 210 250 205 C160 200 60 140 80 60Z" class="w-park" fill="#DDEFE3"/>
    <text x="150" y="115" class="zn-lbl">Cerro San Cristóbal</text>
    <rect x="600" y="455" width="170" height="130" rx="18" class="w-park" fill="#DDEFE3"/><text x="615" y="530" class="zn-lbl">Parque Inés de Suárez</text>
    <rect x="200" y="545" width="150" height="80" rx="16" class="w-park" fill="#DDEFE3"/>
    ${minor}
    <path d="M-20 300 C 120 262, 260 318, 420 282 S 720 248, 1020 268" class="w-river" stroke="#BFDDF5" stroke-width="30" fill="none" stroke-linecap="round"/>
    <text x="760" y="262" class="rv-lbl">Río Mapocho</text>
    ${h}${v}${lblH}${lblV}
    <path d="M430 -20 C 470 250, 520 520, 470 820" class="w-canal" stroke="#9FD0F2" stroke-width="4" fill="none" opacity=".55" stroke-dasharray="2 10" stroke-linecap="round"/>
  </svg>`;
}

// ---------- Componente de mapa ----------
// root: elemento que contiene .map, .seg, .seg-ind, .map-card y (opcional) .near-change
function mountMap(root, opts = {}) {
  const mapEl = $('.map', root), card = $('.map-card', root);
  // Construye la capa "mundo" (reemplaza el dibujo estático anterior)
  $$('.map-art, .me, .pins', mapEl).forEach(n => n.remove());
  const world = document.createElement('div');
  world.className = 'map-world';
  world.innerHTML = `${worldSVG()}
    <span class="me" style="left:${ME.x}px;top:${ME.y}px" aria-label="Tu ubicación"><i></i></span>
    <div class="pins">${PINS.map(p => `<button class="pin" data-pin="${p.key}" data-range="${p.range}" style="left:${p.wx}px;top:${p.wy}px;--c:${p.color}" aria-label="${p.place} a ${p.dist}">
      <i></i><span>${p.name} ${p.dist}</span>${p.off ? `<b>${p.off}</b>` : ''}</button>`).join('')}</div>`;
  mapEl.prepend(world);
  const pinsWrap = $('.pins', world);
  const full = !!opts.full;
  let range = 1, selected = 'sb-prov';
  const view = { x: 0, y: 0, z: full ? 1 : 0.72 };

  // ----- Cámara -----
  function size() { const r = mapEl.getBoundingClientRect(); return { w: r.width, h: r.height }; }
  function clamp() {
    const { w, h } = size();
    const minX = Math.min(0, w - WORLD.w * view.z), minY = Math.min(0, h - WORLD.h * view.z);
    view.x = Math.max(minX, Math.min(0, view.x));
    view.y = Math.max(minY, Math.min(0, view.y));
  }
  function apply() {
    clamp();
    world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.z})`;
    world.style.setProperty('--iz', (1 / view.z).toFixed(3));
  }
  function centerOn(x, y, animate) {
    const { w, h } = size();
    if (!w) return;
    const bottomPad = card ? 60 : 0;     // deja espacio para la tarjeta inferior
    view.x = w / 2 - x * view.z; view.y = (h - bottomPad) / 2 - y * view.z;
    if (animate && !reduceMotion) {
      world.classList.add('glide'); apply();
      setTimeout(() => world.classList.remove('glide'), 520);
    } else apply();
  }
  function centerWorld() { const { w, h } = size(); return { x: (w / 2 - view.x) / view.z, y: (h / 2 - view.y) / view.z }; }
  function visiblePins() {
    const { w, h } = size();
    return PINS.filter(p => {
      const sx = p.wx * view.z + view.x, sy = p.wy * view.z + view.y;
      return sx > 0 && sx < w && sy > 0 && sy < h;          // al explorar se consideran todos los locales a la vista
    });
  }

  // ----- Tarjeta y selección -----
  function setCard(p, animate = true) {
    if (!card) return;
    const html = `<button class="mc-body" data-open="${p.id}" aria-label="Ver detalle de ${p.place}">
        <span class="mc-logo" style="--c:${p.color}">${p.name[0]}</span>
        <span class="mc-txt"><strong>${p.name}</strong><small>${p.addr} • A ${p.dist}</small></span>
        <span class="mc-off">${p.pct}<small>DCTO</small></span>
      </button>
      <button class="mc-go" data-route="${p.key}" aria-label="Cómo llegar a ${p.place}"><svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M13 1 1 6.2l5.1 1.7L7.8 13Z" fill="#fff"/></svg>Ir</button>`;
    card.innerHTML = html;                       // el contenido cambia de inmediato; solo la entrada se anima
    if (animate && !reduceMotion) card.animate([{ opacity: 0, transform: 'translateY(8px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: EASE });
  }
  function select(key, animate = true, pan = false) {
    if (key === selected && animate && !pan) return;
    selected = key;
    $$('.pin', pinsWrap).forEach(b => b.classList.toggle('sel', b.dataset.pin === key));
    const p = pinByKey(key);
    setCard(p, animate);
    if (pan) centerOn(p.wx, p.wy, true);
    root.dispatchEvent(new CustomEvent('map:select', { detail: p }));
  }
  function drop() {
    let i = 0;
    $$('.pin', pinsWrap).forEach(b => {
      const show = +b.dataset.range <= range;
      b.classList.toggle('off', !show);
      b.classList.remove('drop');
      if (show) { void b.offsetWidth; b.style.animationDelay = `${i++ * 70}ms`; b.classList.add('drop'); }
    });
  }
  // Después de moverte por el mapa: título de la zona y beneficio más cercano al centro
  function settle() {
    const c = centerWorld();
    const zone = zoneAt(c.x, c.y);
    $$('.near-zone', root).forEach(el => { el.textContent = zone; });
    const vis = visiblePins();
    if (vis.length) {
      const near = vis.reduce((a, b) => (Math.hypot(a.wx - c.x, a.wy - c.y) < Math.hypot(b.wx - c.x, b.wy - c.y) ? a : b));
      select(near.key, true);
    }
    root.dispatchEvent(new CustomEvent('map:moved', { detail: { zone, visible: vis } }));
  }

  // ----- Arrastre con inercia -----
  let drag = null, raf = 0;
  mapEl.style.touchAction = full ? 'none' : 'pan-y';
  mapEl.addEventListener('pointerdown', e => {
    if (e.target.closest('.map-card, .map-expand, .map-tools')) return;
    cancelAnimationFrame(raf);
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, vx: 0, vy: 0, t: performance.now(), moved: false, ox: view.x, oy: view.y };
  });
  mapEl.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 5) return;
      drag.moved = true; mapEl.classList.add('panning');
      try { mapEl.setPointerCapture(e.pointerId); } catch (_) {}
    }
    const now = performance.now(), dt = Math.max(1, now - drag.t);
    drag.vx = (e.clientX - (drag.lx ?? drag.x)) / dt; drag.vy = (e.clientY - (drag.ly ?? drag.y)) / dt;
    drag.lx = e.clientX; drag.ly = e.clientY; drag.t = now;
    view.x = drag.ox + dx;
    view.y = drag.oy + (e.pointerType === 'touch' && !full ? 0 : dy);   // en el mapa chico el toque vertical hace scroll de la página
    apply();
  });
  const endDrag = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const g = drag; drag = null;
    mapEl.classList.remove('panning');
    if (!g.moved) return;
    // Evita que el arrastre dispare el clic de un pin
    mapEl.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
    let vx = g.vx * 16, vy = (g.ly !== undefined && !(e && e.pointerType === 'touch' && !full)) ? g.vy * 16 : 0;
    if (reduceMotion) { settle(); return; }
    const step = () => {
      vx *= 0.92; vy *= 0.92;
      view.x += vx; view.y += vy; apply();
      if (Math.abs(vx) + Math.abs(vy) > 0.4) raf = requestAnimationFrame(step); else settle();
    };
    raf = requestAnimationFrame(step);
  };
  mapEl.addEventListener('pointerup', endDrag);
  // Mapa chico: tocar el mapa (fuera de un pin o la tarjeta) abre el mapa de beneficios completo
  if (!full) mapEl.addEventListener('click', e => {
    if (e.target.closest('.pin, .map-card, button, a')) return;
    mapEl.dispatchEvent(new CustomEvent('map:open', { bubbles: true }));
  });
  mapEl.addEventListener('pointercancel', () => { if (drag) { drag = null; mapEl.classList.remove('panning'); } });

  // ----- Zoom (rueda, doble toque y botones del mapa completo) -----
  function zoomTo(z, cx, cy) {
    const { w, h } = size();
    cx ??= w / 2; cy ??= h / 2;
    const nz = Math.max(full ? 0.6 : 0.5, Math.min(1.8, z));
    const wx = (cx - view.x) / view.z, wy = (cy - view.y) / view.z;
    view.z = nz; view.x = cx - wx * nz; view.y = cy - wy * nz;
    world.classList.add('glide'); apply();
    setTimeout(() => world.classList.remove('glide'), 420);
  }
  mapEl.addEventListener('wheel', e => {
    if (!full && !e.ctrlKey) return;              // en el mapa chico la rueda hace scroll de la página
    e.preventDefault();
    const r = mapEl.getBoundingClientRect();
    zoomTo(view.z * (e.deltaY < 0 ? 1.15 : 0.87), e.clientX - r.left, e.clientY - r.top);
    clearTimeout(mapEl._st); mapEl._st = setTimeout(settle, 450);
  }, { passive: false });
  mapEl.addEventListener('dblclick', e => {
    if (e.target.closest('.pin, .map-card, button')) return;
    const r = mapEl.getBoundingClientRect();
    zoomTo(view.z * 1.4, e.clientX - r.left, e.clientY - r.top); setTimeout(settle, 450);
  });
  if (full) {
    const tools = document.createElement('div');
    tools.className = 'map-tools';
    tools.innerHTML = `<button data-z="in" aria-label="Acercar">+</button><button data-z="out" aria-label="Alejar">−</button>
      <button data-z="me" aria-label="Centrar en mi ubicación"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#084AFE" stroke-width="1.8" aria-hidden="true"><circle cx="8" cy="8" r="3.2"/><path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15" stroke-linecap="round"/></svg></button>`;
    mapEl.appendChild(tools);
    tools.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      haptic(6);
      if (b.dataset.z === 'in') zoomTo(view.z * 1.3);
      else if (b.dataset.z === 'out') zoomTo(view.z / 1.3);
      else centerOn(ME.x, ME.y, true);
      setTimeout(settle, 460);
    });
  }

  pinsWrap.addEventListener('click', e => {
    const b = e.target.closest('.pin');
    if (b) { haptic(6); select(b.dataset.pin, true, true); }
  });
  const change = $('.near-change', root);
  if (change) change.addEventListener('click', () => { haptic(); centerOn(ME.x, ME.y, true); setTimeout(settle, 520); toast('Volviste a tu ubicación', '📍'); });
  const sync = segmented($('.seg', root), $('.seg-ind', root), b => {
    range = +b.dataset.range; drop();
    if (range >= 3 && view.z > 0.65 && !full) zoomTo(0.55);
    if (pinByKey(selected).range > range) select('sb-prov', true, true);
    setTimeout(settle, 450);
  });
  select('sb-prov', false);
  let first = true;
  function refresh() {
    sync();
    if (first && size().w) { centerOn(ME.x, ME.y, false); first = false; }
    else apply();
  }
  window.addEventListener('resize', () => apply());
  return { sync: refresh, drop, select, centerOn, get range() { return range; }, root };
}
