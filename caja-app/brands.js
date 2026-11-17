// =====================================================================
// Home público multimarca: Caja Los Andes · andes noma (turismo) · andes tapp (pagos)
// Mismo header y navbar; el cuerpo del home cambia de contenido y de colores de marca.
// Cambio de marca: botón "Marcas" de la barra inferior (selector con las tres marcas).
// Depende de go(), haptic(), dotCarousel(), toast() y reduceMotion (app.js / benefits.js)
// =====================================================================

const BRANDS = ['caja', 'noma', 'tapp'];
const BRAND_INFO = {
  caja: { logo: '#logo', name: 'Caja Los Andes', label: 'Caja Los Andes' },
  noma: { logo: '#logo-noma', name: 'andes noma', label: 'andes noma · Turismo' },
  tapp: { logo: '#logo-tapp', name: 'andes tapp', label: 'andes tapp · Pagos' },
};
const homeEl = document.querySelector('[data-screen="home"]');
// En el home los avisos salen debajo del header para no tapar el logo
const _toast = toast;
toast = (...args) => { document.getElementById('toast').classList.toggle('toast-low', homeEl.classList.contains('is-active')); _toast(...args); };
const chevSm = '<svg width="6" height="10" aria-hidden="true"><use href="#chev-r"/></svg>';
const arrowSm = '<svg><use href="#arrow-r"/></svg>';

// ---------- andes noma: hoteles y centros vacacionales ----------
const NOMA_SLIDES = [
  { badge: 'HOTELES Y CABAÑAS', stamp: ['25%', 'DCTO'], h: 'Centros', em: 'Vacacionales', p: 'Cabañas y hoteles de norte a sur con tarifa preferencial para afiliados.', cta: 'Reservar estadía', go: 'nmBook', img: 'assets/fotos/cabana.jpg', alt: 'Cabaña entre los árboles' },
  { badge: 'PATAGONIA', h: 'Torres', em: 'del Paine', p: 'Camping y refugio en Río Serrano, frente al macizo.', cta: 'Ver disponibilidad', go: 'nmBook', img: 'assets/fotos/andes.jpg', alt: 'Torres del Paine', cls: 'n2' },
  { badge: 'GASTRONOMÍA', stamp: ['30%', 'DCTO'], h: 'Semana', em: 'Gourmet', p: 'Cena de autor incluida en tu estadía de fin de semana.', cta: 'Ver hoteles', go: 'nmHotels', img: 'assets/fotos/chef.jpg', alt: 'Chef cocinando', cls: 'n3' },
];
// Hoteles y centros vacacionales (tarifa afiliado por noche, para 2 personas)
const HOTELS = [
  { id: 'huallilemu', name: 'Huallilemu Sur', place: 'El Quisco · Litoral central', img: 'assets/fotos/cabana.jpg', rating: 4.7, price: 48900, before: 65200, room: 'Cabaña para 4 personas', tag: 'Frente al mar' },
  { id: 'huayca', name: 'La Huayca', place: 'Iquique · Norte grande', img: 'assets/fotos/familia.jpg', rating: 4.5, price: 42500, before: 56700, room: 'Cabaña familiar', tag: 'Piscina temperada' },
  { id: 'serrano', name: 'Río Serrano', place: 'Torres del Paine · Patagonia', img: 'assets/fotos/andes.jpg', rating: 4.9, price: 69900, before: 93200, room: 'Refugio doble', tag: 'Vista al macizo' },
  { id: 'gourmet', name: 'Hotel Los Andes Pucón', place: 'Pucón · Lagos y volcanes', img: 'assets/fotos/chef.jpg', rating: 4.6, price: 58400, before: 77900, room: 'Habitación doble superior', tag: 'Desayuno y cena' },
];

const NM_STORIES = [
  { t: 'Litoral', s: 'Huallilemu Sur · El Quisco', img: 'assets/fotos/familia.jpg', hotel: 'huallilemu', txt: 'Atardeceres frente al mar a 1 hora y media de Santiago.' },
  { t: 'Patagonia', s: 'Río Serrano · Torres del Paine', img: 'assets/fotos/andes.jpg', hotel: 'serrano', txt: 'Despierta frente al macizo más famoso de Chile.' },
  { t: 'Bosque', s: 'Cabañas entre coigües', img: 'assets/fotos/cabana.jpg', hotel: 'huallilemu', txt: 'Desconexión total, sin señal y con chimenea.' },
  { t: 'Gourmet', s: 'Hotel Los Andes Pucón', img: 'assets/fotos/chef.jpg', hotel: 'gourmet', txt: 'Cena de autor incluida en tu fin de semana.' },
  { t: 'Vuela', s: 'Paquetes con pasaje', img: 'assets/fotos/vuelo.jpg', hotel: 'huayca', txt: 'Vuelo + estadía en La Huayca, Iquique.' },
];
const hotelById = id => HOTELS.find(h => h.id === id);
const clp = n => '$' + Math.round(n).toLocaleString('es-CL');
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtDay = s => fromIso(s).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
const nightsOf = (a, b) => Math.round((fromIso(b) - fromIso(a)) / 864e5);

// Reservas del afiliado (demo): se guardan en el teléfono
const RES_KEY = 'cla-noma-res';
let reservas = [
  { code: 'NM-48213', hotel: 'huallilemu', in: '2026-12-11', out: '2026-12-14', guests: 2, status: 'Confirmada' },
  { code: 'NM-30977', hotel: 'huayca', in: '2026-07-03', out: '2026-07-06', guests: 4, status: 'Finalizada' },
];
try { const s = JSON.parse(localStorage.getItem(RES_KEY) || 'null'); if (Array.isArray(s) && s.length) reservas = s; } catch (_) {}
const saveRes = () => { try { localStorage.setItem(RES_KEY, JSON.stringify(reservas)); } catch (_) {} };

function nomaHero() {
  return `<div class="carousel bb-car" data-brand-part="noma">
      <div class="slides" id="nomaSlides">${NOMA_SLIDES.map(s => `
        <article class="slide nm-slide ${s.cls || ''}">
          <span class="badge"><i></i>${s.badge}</span>
          ${s.stamp ? `<div class="stamp">${s.stamp[0]}<span>${s.stamp[1]}</span></div>` : ''}
          <h1>${s.h}<br><em>${s.em}</em></h1>
          <p>${s.p}</p>
          <a class="cta" href="#${s.go}" data-nm-jump="${s.go}">${s.cta} ${arrowSm}</a>
          <div class="photo"><img src="${s.img}" alt="${s.alt}"></div>
        </article>`).join('')}
      </div>
      <div class="dots" id="nomaDots">${NOMA_SLIDES.map((_, i) => `<button${i ? '' : ' class="on"'} aria-label="Slide ${i + 1}"></button>`).join('')}</div>
    </div>`;
}
function nomaBody() {
  return `<div class="bb" data-brand-part="noma">
    <section class="nm-stories" aria-label="Destinos para explorar">
      <h2 class="h2 nm-h nm-pad">Explora Chile</h2>
      <div class="nm-st-row">${NM_STORIES.map((s, i) => `
        <button type="button" class="nm-story" data-story="${i}"><span class="nm-st-ring"><img src="${s.img}" alt=""></span><b>${s.t}</b></button>`).join('')}
      </div>
    </section>
    <section class="section nm-pass-wrap" id="nmPassWrap" aria-label="Tu próxima estadía"></section>
    <section class="section nm-book" id="nmBook" aria-labelledby="nmBookT">
      <form class="nm-search" id="nmSearch" novalidate>
        <h2 id="nmBookT">Reserva tu estadía</h2>
        <label class="nm-field nm-dest"><span>Destino</span>
          <select id="nmDest"><option value="all">Todos los centros</option>${HOTELS.map(h => `<option value="${h.id}">${h.name} · ${h.place.split(' · ')[0]}</option>`).join('')}</select>
        </label>
        <div class="nm-dates">
          <label class="nm-field"><span>Llegada</span><input type="date" id="nmIn" required></label>
          <label class="nm-field"><span>Salida</span><input type="date" id="nmOut" required></label>
        </div>
        <div class="nm-guests">
          <span>Huéspedes</span>
          <div class="nm-step"><button type="button" data-g="-1" aria-label="Quitar huésped">−</button><b id="nmG" aria-live="polite">2</b><button type="button" data-g="1" aria-label="Agregar huésped">+</button></div>
        </div>
        <small class="nm-err" id="nmErr" role="alert"></small>
        <button class="nm-go" type="submit">Buscar disponibilidad</button>
      </form>
      <div class="nm-results" id="nmResults" hidden aria-live="polite"></div>
    </section>

    <section class="section nm-res" id="nmRes" aria-labelledby="nmResT">
      <div class="tf-head"><h2 class="h2 nm-h" id="nmResT">Mis reservas</h2><span class="nm-count" id="nmResCount"></span></div>
      <div class="nm-tabs" role="tablist">
        <button type="button" role="tab" class="on" aria-selected="true" data-rt="next">Próximas</button>
        <button type="button" role="tab" aria-selected="false" data-rt="past">Anteriores</button>
      </div>
      <div class="nm-res-list" id="nmResList"></div>
    </section>

    <section class="section nm-360" aria-labelledby="nm360T">
      <button type="button" class="nm-360-card" data-pano="serrano">
        <span class="nm-360-img" style="background-image:url(assets/fotos/andes.jpg)"></span>
        <span class="nm-360-badge"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 12h18M12 3l-4 4M12 3l4 4M12 21l-4-4M12 21l4-4"/></svg>Inmersivo</span>
        <span class="nm-360-txt"><small>EXPERIENCIA INMERSIVA</small><strong id="nm360T">Recorre el hotel antes de ir</strong><em>Visita guiada por Río Serrano, Torres del Paine</em></span>
      </button>
    </section>
    <section class="section nm-hot" id="nmHotels" aria-labelledby="nmHotT">
      <div class="tf-head"><h2 class="h2 nm-h" id="nmHotT">Hoteles y centros vacacionales</h2></div>
      <div class="nm-hot-row" role="list">${HOTELS.map(h => `
        <article class="nm-hotel" role="listitem">
          <div class="nm-hotel-img"><img src="${h.img}" alt="${h.name}" loading="lazy"><span class="nm-tag">${h.tag}</span><span class="nm-rate">★ ${h.rating.toFixed(1)}</span><button type="button" class="nm-360b" data-pano="${h.id}" aria-label="Recorrer ${h.name}">Recorrer</button></div>
          <div class="nm-hotel-b">
            <strong>${h.name}</strong><small>${h.place}</small>
            <div class="nm-price"><s>${clp(h.before)}</s><b>${clp(h.price)}</b><span>/ noche</span></div>
            <button type="button" class="nm-pick" data-pick-hotel="${h.id}">Ver fechas</button>
          </div>
        </article>`).join('')}
      </div>
    </section>
  </div>`;
}

// ---------- Lógica de reservas ----------
function nomaInit() {
  const $n = id => document.getElementById(id);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  // Por defecto: el próximo viernes, 2 noches
  const fri = new Date(today); fri.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));
  const sun = new Date(fri); sun.setDate(fri.getDate() + 2);
  $n('nmIn').value = iso(fri); $n('nmOut').value = iso(sun);
  $n('nmIn').min = iso(today); $n('nmOut').min = iso(new Date(today.getTime() + 864e5));
  let guests = 2;
  $n('nmSearch').addEventListener('click', e => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    guests = Math.max(1, Math.min(6, guests + +b.dataset.g)); $n('nmG').textContent = guests; haptic(4);
  });
  $n('nmIn').addEventListener('change', () => {
    const next = new Date(fromIso($n('nmIn').value).getTime() + 864e5);
    $n('nmOut').min = iso(next);
    if (!$n('nmOut').value || $n('nmOut').value <= $n('nmIn').value) $n('nmOut').value = iso(next);
  });
  $n('nmSearch').addEventListener('submit', e => {
    e.preventDefault();
    const a = $n('nmIn').value, b = $n('nmOut').value, err = $n('nmErr');
    err.textContent = '';
    if (!a || !b) { err.textContent = 'Elige la fecha de llegada y de salida.'; return; }
    if (fromIso(a) < today) { err.textContent = 'La llegada no puede ser antes de hoy.'; return; }
    if (b <= a) { err.textContent = 'La salida tiene que ser después de la llegada.'; return; }
    const n = nightsOf(a, b), dest = $n('nmDest').value;
    const list = HOTELS.filter(h => dest === 'all' || h.id === dest);
    const box = $n('nmResults');
    box.innerHTML = `<p class="nm-res-sum"><b>${list.length} ${list.length > 1 ? 'opciones disponibles' : 'opción disponible'}</b> · ${fmtDay(a)} → ${fmtDay(b)} · ${n} noche${n > 1 ? 's' : ''} · ${guests} huésped${guests > 1 ? 'es' : ''}</p>` +
      list.map(h => `<div class="nm-opt">
        <img src="${h.img}" alt="">
        <div><strong>${h.name}</strong><small>${h.room}</small><span>${clp(h.price)} × ${n} noche${n > 1 ? 's' : ''}</span></div>
        <div class="nm-opt-r"><b>${clp(h.price * n)}</b><button type="button" data-book="${h.id}">Reservar</button></div>
      </div>`).join('');
    box.hidden = false; box.dataset.in = a; box.dataset.out = b; box.dataset.g = guests;
    haptic(8);
    box.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  });
  $n('nmResults').addEventListener('click', e => {
    const b = e.target.closest('[data-book]'); if (!b) return;
    const box = $n('nmResults');
    const r = { code: 'NM-' + Math.floor(10000 + Math.random() * 89999), hotel: b.dataset.book, in: box.dataset.in, out: box.dataset.out, guests: +box.dataset.g, status: 'Confirmada', fresh: true };
    reservas.unshift(r); saveRes();
    box.hidden = true; resTab = 'next'; paintRes();
    haptic([10, 40, 16]);
    toast(`Reserva ${r.code} confirmada en ${hotelById(r.hotel).name}`, '✓');
    $n('nmRes').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
  // Reservas: pestañas, detalle desplegable y acciones
  let resTab = 'next';
  const isPast = r => r.status === 'Finalizada' || r.status === 'Cancelada' || fromIso(r.out) < today;
  let paintRes = function () {
    homeEl.querySelectorAll('.nm-tabs button').forEach(t => { const on = t.dataset.rt === resTab; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
    const next = reservas.filter(r => !isPast(r));
    $n('nmResCount').textContent = next.length ? `${next.length} próxima${next.length > 1 ? 's' : ''}` : '';
    const list = reservas.filter(r => (resTab === 'past') === isPast(r));
    $n('nmResList').innerHTML = list.length ? list.map(r => {
      const h = hotelById(r.hotel), n = nightsOf(r.in, r.out);
      const st = isPast(r) && r.status === 'Confirmada' ? 'Finalizada' : r.status;
      return `<details class="nm-rcard${r.fresh ? ' fresh' : ''}" data-code="${r.code}">
        <summary>
          <img src="${h.img}" alt="">
          <div><span class="nm-st st-${st.toLowerCase()}">${st}</span><strong>${h.name}</strong><small>${fmtDay(r.in)} → ${fmtDay(r.out)} · ${n} noche${n > 1 ? 's' : ''}</small></div>
          <svg class="nm-chev" width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1.5 5 5 5-5"/></svg>
        </summary>
        <dl class="nm-rdet">
          <div><dt>Código</dt><dd>${r.code}</dd></div>
          <div><dt>Huéspedes</dt><dd>${r.guests}</dd></div>
          <div><dt>Check-in</dt><dd>${fmtDay(r.in)} · 15:00</dd></div>
          <div><dt>Check-out</dt><dd>${fmtDay(r.out)} · 11:00</dd></div>
          <div><dt>Alojamiento</dt><dd>${h.room}</dd></div>
          <div><dt>Total</dt><dd>${clp(h.price * n)}</dd></div>
        </dl>
        ${st === 'Confirmada' ? `<div class="nm-racts"><button type="button" data-toast="Abriendo ruta a ${h.name}">Cómo llegar</button><button type="button" class="nm-cancel" data-cancel="${r.code}">Cancelar reserva</button></div>` : ''}
      </details>`;
    }).join('') : `<p class="nm-empty">${resTab === 'next' ? 'No tienes reservas próximas. Busca disponibilidad arriba.' : 'Aún no tienes estadías anteriores.'}</p>`;
    reservas.forEach(r => { delete r.fresh; });
  };
  homeEl.querySelector('.nm-tabs').addEventListener('click', e => {
    const t = e.target.closest('[data-rt]'); if (!t || t.dataset.rt === resTab) return;
    resTab = t.dataset.rt; haptic(4); paintRes();
  });
  $n('nmResList').addEventListener('click', e => {
    const c = e.target.closest('[data-cancel]'); if (!c) return;
    const r = reservas.find(x => x.code === c.dataset.cancel);
    if (!c.classList.contains('confirm')) { c.classList.add('confirm'); c.textContent = '¿Confirmas cancelar?'; haptic(6); return; }
    r.status = 'Cancelada'; saveRes(); paintRes(); haptic(10);
    toast(`Reserva ${r.code} cancelada`, 'i');
  });
  // Elegir un hotel desde la lista: lo deja seleccionado en el buscador
  homeEl.addEventListener('click', e => {
    const p = e.target.closest('[data-pick-hotel]');
    if (p) { $n('nmDest').value = p.dataset.pickHotel; haptic(6); $n('nmBook').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); setTimeout(() => $n('nmIn').focus({ preventScroll: true }), 400); return; }
    const j = e.target.closest('[data-nm-jump]');
    if (j) { e.preventDefault(); $n(j.dataset.nmJump).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
  });
  // ----- Pase de "Tu próxima estadía" con cuenta regresiva -----
  let passTimer;
  function paintPass() {
    const next = reservas.filter(r => !isPast(r) && r.status === 'Confirmada').sort((x, y) => x.in.localeCompare(y.in))[0];
    const wrap = $n('nmPassWrap');
    clearInterval(passTimer);
    if (!next) { wrap.innerHTML = ''; return; }
    const h = hotelById(next.hotel), n = nightsOf(next.in, next.out);
    wrap.innerHTML = `<article class="nm-pass">
      <div class="nm-pass-top">
        <img src="${h.img}" alt="">
        <div class="nm-pass-cap"><small>TU PRÓXIMA ESTADÍA</small><strong>${h.name}</strong><span>${h.place}</span></div>
      </div>
      <div class="nm-pass-cut" aria-hidden="true"></div>
      <div class="nm-pass-body">
        <div class="nm-pass-dates"><div><small>Llegada</small><b>${fmtDay(next.in)}</b><em>15:00</em></div><span class="nm-pass-arrow" aria-hidden="true">${n}N<i></i></span><div><small>Salida</small><b>${fmtDay(next.out)}</b><em>11:00</em></div></div>
        <div class="nm-count-down" aria-live="off"><div><b data-cd="d">0</b><small>días</small></div><div><b data-cd="h">0</b><small>horas</small></div><div><b data-cd="m">0</b><small>min</small></div><div><b data-cd="s">0</b><small>seg</small></div></div>
        <div class="nm-pass-foot"><span>Código <b>${next.code}</b></span><span class="nm-pass-qr" aria-hidden="true"></span></div>
      </div>
    </article>`;
    const target = fromIso(next.in); target.setHours(15, 0, 0, 0);
    const tick = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      wrap.querySelectorAll('[data-cd]').forEach(el => { el.textContent = String(v[el.dataset.cd]).padStart(2, '0'); });
    };
    tick(); passTimer = setInterval(tick, 1000);
  }
  const _paintRes = paintRes;
  paintRes = () => { _paintRes(); paintPass(); };

  // ----- Historias de destinos a pantalla completa -----
  const sv = document.createElement('div');
  sv.className = 'nm-sv'; sv.hidden = true; sv.setAttribute('role', 'dialog'); sv.setAttribute('aria-modal', 'true'); sv.setAttribute('aria-label', 'Destinos');
  sv.innerHTML = `<div class="nm-sv-bars">${NM_STORIES.map(() => '<i><b></b></i>').join('')}</div>
    <button type="button" class="nm-sv-x" aria-label="Cerrar">✕</button>
    <img class="nm-sv-img" alt="">
    <div class="nm-sv-cap"><small></small><h3></h3><p></p><button type="button" class="nm-sv-go">Ver fechas en este hotel</button></div>
    <button type="button" class="nm-sv-prev" aria-label="Anterior"></button><button type="button" class="nm-sv-next" aria-label="Siguiente"></button>`;
  document.body.appendChild(sv);
  let si = 0, sTimer, opener = null;
  const STORY_MS = 5000;
  function showStory(i) {
    if (i < 0) i = 0;
    if (i >= NM_STORIES.length) { closeStories(); return; }
    si = i; const s = NM_STORIES[i];
    sv.querySelector('.nm-sv-img').src = s.img;
    sv.querySelector('.nm-sv-cap small').textContent = s.s;
    sv.querySelector('.nm-sv-cap h3').textContent = s.t;
    sv.querySelector('.nm-sv-cap p').textContent = s.txt;
    sv.querySelectorAll('.nm-sv-bars i').forEach((bar, n) => { bar.className = n < i ? 'done' : n === i ? 'run' : ''; });
    const img = sv.querySelector('.nm-sv-img'); img.classList.remove('kb'); void img.offsetWidth; img.classList.add('kb');
    clearTimeout(sTimer); sTimer = setTimeout(() => showStory(si + 1), STORY_MS);
  }
  function openStories(i, el) { opener = el; sv.hidden = false; document.body.classList.add('lock'); requestAnimationFrame(() => sv.classList.add('open')); haptic(8); showStory(i); }
  function closeStories() { clearTimeout(sTimer); sv.classList.remove('open'); document.body.classList.remove('lock'); setTimeout(() => { sv.hidden = true; }, 250); opener?.focus({ preventScroll: true }); }
  homeEl.addEventListener('click', e => { const s = e.target.closest('[data-story]'); if (s) openStories(+s.dataset.story, s); });
  sv.querySelector('.nm-sv-x').addEventListener('click', closeStories);
  sv.querySelector('.nm-sv-next').addEventListener('click', () => showStory(si + 1));
  sv.querySelector('.nm-sv-prev').addEventListener('click', () => showStory(si - 1));
  sv.querySelector('.nm-sv-go').addEventListener('click', () => {
    const h = NM_STORIES[si].hotel; closeStories(); $n('nmDest').value = h;
    setTimeout(() => $n('nmBook').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 260);
  });
  document.addEventListener('keydown', e => { if (sv.hidden) return; if (e.key === 'Escape') closeStories(); if (e.key === 'ArrowRight') showStory(si + 1); if (e.key === 'ArrowLeft') showStory(si - 1); });
  paintRes();
}

// ---------- andes tapp: cuenta y pagos ----------
const TAPP_ICONS = {
  recargar: '<path d="M12 2 3.5 7v10L12 22l8.5-5V7Z" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" stroke-width="1.8"/>',
  pagar: '<path d="M14 2H6.5A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V8Z" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke-width="1.8" stroke-linecap="round"/>',
  bip: '<rect x="4" y="3" width="16" height="15" rx="3" stroke-width="1.8"/><path d="M4 11h16M8 21v-3M16 21v-3" stroke-width="1.8" stroke-linecap="round"/><circle cx="8" cy="14.5" r="1" fill="currentColor"/><circle cx="16" cy="14.5" r="1" fill="currentColor"/>',
  tag: '<path d="M2.5 12.2V3.5a1 1 0 0 1 1-1h8.7l9.3 9.3-9.7 9.7Z" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="1.6" stroke-width="1.6"/>',
};
const TAPP_QUICK = [['recargar', 'Recargar'], ['pagar', 'Pagar'], ['bip', 'bip!QR'], ['tag', 'Beneficios']];
// Gastos del mes por categoría (gráfico de "Salud financiera")
const TAPP_SPEND = [['Vivienda', 32, '#131252'], ['Transporte', 18, '#084AFE'], ['Alimentos', 26, '#06C2FA'], ['Entretención', 14, '#C6DA4A'], ['Otros', 10, '#C9D2E6']];

function donut() {
  const r = 34, C = 2 * Math.PI * r;
  let acc = 0;
  const arcs = TAPP_SPEND.map(([, v, c]) => {
    const len = C * v / 100, seg = `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${c}" stroke-width="14" stroke-dasharray="${len - 1.2} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 50 50)"/>`;
    acc += len; return seg;
  }).join('');
  return `<svg class="tp-donut" viewBox="0 0 100 100" role="img" aria-label="Gastos de noviembre: $765.360">${arcs}
    <text x="50" y="49" text-anchor="middle" class="tp-dn-v">$765.360</text><text x="50" y="60" text-anchor="middle" class="tp-dn-l">Gastos</text></svg>`;
}
function tappHero() {
  return `<div class="tp-card3d" data-brand-part="tapp">
    <div class="tp-tilt" id="tpTilt">
      <div class="tp-flip" id="tpFlip">
      <article class="tp-acct tp-front" aria-label="Mi cuenta Tapp">
      <!-- Gráfica de la tarjeta física andes tapp: isotipo "A" lima (Figma 3415:6971) y líneas finas -->
      <svg class="tp-art" viewBox="0 0 340 228" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="tpGa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CDD54D"/><stop offset="1" stop-color="#DBDD8A"/></linearGradient>
          <linearGradient id="tpGb" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4DC69"/><stop offset="1" stop-color="#E3E4AB"/></linearGradient>
        </defs>
        <g fill="none" stroke="rgba(255,255,255,.26)" stroke-width="1">
          <circle cx="330" cy="-30" r="120"/><circle cx="360" cy="250" r="150"/><path d="M120 -10 C 170 60, 250 80, 350 70"/>
        </g>
        <g transform="translate(130 4) scale(7.6)" style="--logo-a:url(#tpGa);--logo-a2:url(#tpGb)"><use href="#lA"/><use href="#lA2"/></g>
      </svg>
      <div class="tp-acct-top">
        <div><strong>Mi cuenta Tapp</strong></div>
      </div>
      <div class="tp-chip" aria-hidden="true"><i></i><svg viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"><path d="M5 4.5a5 5 0 0 1 0 7M8 3a7.5 7.5 0 0 1 0 10M11 1.5a10 10 0 0 1 0 13"/></svg></div>
      <small class="tp-lbl">Saldo disponible</small>
      <div class="tp-bal">$ ••••••</div>
      <div class="tp-acct-foot">
        <span class="tp-mc" aria-label="Mastercard"><i></i><i></i></span>
      </div>
      <span class="tp-glare" aria-hidden="true"></span>
      <span class="tp-hint" aria-hidden="true">Toca la tarjeta</span>
    </article>
      <article class="tp-acct tp-back" aria-label="Reverso de la tarjeta">
      <span class="tp-stripe" aria-hidden="true"></span>
      <div class="tp-num">•••• •••• •••• 4821</div>
      <div class="tp-back-row"><div><small>Titular</small><b>Afiliado Caja Los Andes</b></div><div><small>Vence</small><b>12/30</b></div><div><small>CVV</small><b>•••</b></div></div>
      <svg class="tp-back-logo" viewBox="0 0 120 39" aria-hidden="true"><use href="#logo-tapp"/></svg>
      <span class="tp-mc tp-mc-back" aria-hidden="true"><i></i><i></i></span>
      <span class="tp-glare" aria-hidden="true"></span>
    </article>
      </div>
    </div>
  </div>`;
}
function tappBody() {
  return `<div class="bb" data-brand-part="tapp">
    <section class="tp-quick" aria-label="Accesos rápidos">${TAPP_QUICK.map(([ico, t]) => `
      <a href="#" class="tp-q" ${ico === 'tag' ? 'data-go="beneficios"' : `data-toast="${t} con andes tapp"`}>
        <span class="tp-q-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">${TAPP_ICONS[ico]}</svg></span>${t}
      </a>`).join('')}
    </section>
    <section class="tp-promos" aria-label="Novedades">
      <a href="#" class="tp-pre" data-toast="Revisando tu crédito pre aprobado">
        <span class="tp-pre-img"><img src="assets/fotos/banner-credito.jpg" alt=""></span>
        <span>Conoce aquí si tienes un <b>crédito pre aprobado</b> Caja Los Andes</span>
      </a>
      <div class="tp-promo-row" id="tpPromoRow">
        <article class="tp-invite">
          <div><h3>¡Invita a tus amigos a Tapp!</h3><a href="#" class="tp-btn-navy" data-toast="Link de invitación copiado">Invitar ahora</a></div>
          <span class="tp-ill" aria-hidden="true"><i class="s1">✦</i><i class="s2">✦</i><i class="p1"></i><i class="p2"></i></span>
        </article>
        <article class="tp-invite tp-invite-2">
          <div><h3>Paga tu pasaje con bip!QR</h3><a href="#" class="tp-btn-navy" data-toast="Activa bip!QR desde tu cuenta">Activar ahora</a></div>
          <span class="tp-ill tp-ill-bus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#131252">${TAPP_ICONS.bip}</svg></span>
        </article>
      </div>
      <div class="tp-dots" id="tpDots"><i class="on"></i><i></i></div>
    </section>
    <section class="section tp-sec">
      <h2 class="h2">Destacados</h2>
      <a href="#" class="tp-feat" data-toast="Revisando tu crédito pre aprobado">
        <span class="tp-feat-img"><img src="assets/fotos/banner-credito.jpg" alt=""></span>
        <span class="tp-feat-txt"><small>Tienes un</small><strong>Crédito pre aprobado</strong><b>Revísalo aquí</b></span>
      </a>
      <article class="tp-fin">
        <div>
          <h3>Salud financiera noviembre</h3>
          <p>Conoce todos los movimientos de tu cuenta y gastos por categoría.</p>
          <a href="#" class="tp-btn-out" data-go="rut">Ver más ${chevSm}</a>
        </div>
        ${donut()}
      </article>
    </section>
  </div>`;
}

// ---------- Montaje ----------
(function mountBrands() {
  if (!homeEl) return;
  const heroWrap = homeEl.querySelector('.hero-wrap'), cajaCar = heroWrap.querySelector('.carousel');
  cajaCar.dataset.brandPart = 'caja';
  ['.tf', '.af-check', '.news', '.desc'].forEach(sel => { const el = homeEl.querySelector(':scope > ' + sel); if (el) el.dataset.brandPart = 'caja'; });
  cajaCar.insertAdjacentHTML('afterend', nomaHero() + tappHero());
  homeEl.querySelector('#nav').insertAdjacentHTML('beforebegin', nomaBody() + tappBody());
  dotCarousel(document.getElementById('nomaSlides'), document.getElementById('nomaDots'), 5000);
  nomaInit();
  // Promos de Tapp: puntos que siguen el deslizamiento
  const row = document.getElementById('tpPromoRow'), dots = [...document.querySelectorAll('#tpDots i')];
  row.addEventListener('scroll', () => {
    const i = Math.round(row.scrollLeft / (row.scrollWidth - row.clientWidth || 1));
    dots.forEach((d, n) => d.classList.toggle('on', n === i));
  }, { passive: true });
  let saved = 'caja';
  try { saved = localStorage.getItem('cla-brand') || 'caja'; } catch (_) {}
  setBrand(BRANDS.includes(saved) ? saved : 'caja', false);
})();

function setBrand(b, announce = true) {
  homeEl.dataset.brand = b;
  document.documentElement.dataset.brand = b;
  const info = BRAND_INFO[b];
  const logo = homeEl.querySelector('.header .logo');
  logo.querySelector('use').setAttribute('href', info.logo);
  logo.setAttribute('aria-label', info.name);
  try { localStorage.setItem('cla-brand', b); } catch (_) {}
  // Color de la franja de la hora en el teléfono según la marca
  window.brandBar = { caja: null, noma: '#1A200D', tapp: '#0B0D3A' }[b];
  if (typeof updateBar === 'function') updateBar();
  if (!announce) return;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  if (!reduceMotion) homeEl.querySelectorAll(`[data-brand-part="${b}"]`).forEach((el, i) =>
    el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: i * 70, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'backwards' }));
  haptic([12, 50, 18]);
  toast(`Ahora ves ${info.label}`, '✦');
}

// ---------- Selector de marca en la barra inferior: una sola app, tres marcas ----------
const BRAND_DESC = { caja: 'Caja de compensación', noma: 'Turismo, hoteles y reservas', tapp: 'Cuenta, pagos y transferencias' };
(function brandSwitcher() {
  const nav = homeEl.querySelector('#nav');
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'nav-brand'; btn.id = 'navBrand';
  btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'brandPop');
  btn.innerHTML = '<span class="nb-a"><svg class="logo-color" viewBox="2 5 38 26" aria-hidden="true"><use href="#logo-a"/></svg></span><span class="nb-t">Marcas</span>';
  nav.appendChild(btn);
  const pop = document.createElement('div');
  pop.className = 'brand-pop'; pop.id = 'brandPop'; pop.setAttribute('role', 'menu'); pop.setAttribute('aria-label', 'Elegir marca'); pop.hidden = true;
  pop.innerHTML = `<small class="bp-t">Elige tu experiencia</small>` + BRANDS.map(b => `
    <button type="button" role="menuitemradio" class="bp-opt" data-brand-pick="${b}" aria-checked="false">
      <svg class="logo-color bp-logo" viewBox="0 0 120 39" aria-hidden="true"><use href="${BRAND_INFO[b].logo}"/></svg>
      <span class="bp-d">${BRAND_DESC[b]}</span>
      <span class="bp-ck" aria-hidden="true"><svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m1.5 5 3 3 6-6.5"/></svg></span>
    </button>`).join('');
  homeEl.appendChild(pop);
  const bd = document.createElement('div'); bd.className = 'brand-pop-bd'; bd.hidden = true; homeEl.appendChild(bd);
  const paint = () => {
    const cur = homeEl.dataset.brand;
    btn.setAttribute('aria-label', `Cambiar de marca. Ahora: ${BRAND_INFO[cur].name}`);
    pop.querySelectorAll('.bp-opt').forEach(o => o.setAttribute('aria-checked', String(o.dataset.brandPick === cur)));
  };
  const open = () => {
    paint(); pop.hidden = false; bd.hidden = false;
    requestAnimationFrame(() => { pop.classList.add('open'); bd.classList.add('open'); });
    btn.setAttribute('aria-expanded', 'true'); haptic(6);
    setTimeout(() => pop.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true }), 60);
  };
  const close = (focus = true) => {
    if (pop.hidden) return;
    pop.classList.remove('open'); bd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { pop.hidden = true; bd.hidden = true; }, reduceMotion ? 0 : 260);
    if (focus) btn.focus({ preventScroll: true });
  };
  btn.addEventListener('click', e => { e.stopPropagation(); pop.hidden ? open() : close(); });
  bd.addEventListener('click', () => close(false));
  pop.addEventListener('click', e => {
    const o = e.target.closest('[data-brand-pick]'); if (!o) return;
    const b = o.dataset.brandPick;
    close();
    if (b !== homeEl.dataset.brand) setTimeout(() => setBrand(b), reduceMotion ? 0 : 180);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) close(); });
  document.addEventListener('screen:before', () => close(false));
  paint();
})();

// ---------- andes tapp: tarjeta 3D (se inclina con el dedo o el teléfono, brilla y se voltea al tocarla) ----------
(function tappCard() {
  const tilt = document.getElementById('tpTilt'), flip = document.getElementById('tpFlip');
  if (!tilt) return;
  let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0, active = false;
  const set = (x, y) => { tx = x; ty = y; if (!raf) raf = requestAnimationFrame(loop); };
  function loop() {
    rx += (tx - rx) * .14; ry += (ty - ry) * .14;
    tilt.style.setProperty('--rx', `${rx.toFixed(2)}deg`); tilt.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    tilt.style.setProperty('--gx', `${50 + ry * 3}%`); tilt.style.setProperty('--gy', `${50 - rx * 3}%`);
    raf = Math.abs(tx - rx) + Math.abs(ty - ry) > .05 ? requestAnimationFrame(loop) : 0;
  }
  const fromPoint = e => { const r = tilt.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; set(-py * 18, px * 22); };
  tilt.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || active) fromPoint(e); });
  tilt.addEventListener('pointerdown', e => { active = true; tilt.classList.add('pressing'); fromPoint(e); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => tilt.addEventListener(t, () => { active = false; tilt.classList.remove('pressing'); set(0, 0); }));
  // Con el teléfono (Android sin permiso; en iOS pide permiso al primer toque)
  let gyro = false;
  const onOri = e => { if (homeEl.dataset.brand !== 'tapp' || active || e.beta == null) return; gyro = true; set(Math.max(-14, Math.min(14, (e.beta - 45) * .5)), Math.max(-16, Math.min(16, e.gamma * .6))); };
  const DOE = window.DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission !== 'function') addEventListener('deviceorientation', onOri);
  // Tocar la tarjeta (fuera del botón) la da vuelta
  tilt.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    if (DOE && typeof DOE.requestPermission === 'function' && !gyro) DOE.requestPermission().then(s => { if (s === 'granted') addEventListener('deviceorientation', onOri); }).catch(() => {});
    flip.classList.toggle('flipped'); haptic(10);
    tilt.querySelectorAll('.tp-hint').forEach(h => h.remove());
  });
  // Entrada con volteo al llegar a la marca
  const _setBrand = setBrand;
  setBrand = (b, announce = true) => {
    _setBrand(b, announce);
    if (b !== 'tapp' || reduceMotion) return;
    flip.classList.remove('flipped');
    tilt.animate([{ transform: 'perspective(1000px) rotateX(38deg) rotateY(-18deg) translateY(40px) scale(.92)', opacity: 0 }, { transform: 'perspective(1000px) rotateX(-4deg) rotateY(3deg)', opacity: 1, offset: .7 }, { transform: 'none', opacity: 1 }], { duration: 950, easing: 'cubic-bezier(.2,.8,.2,1)' });
  };
})();

// ---------- andes noma: recorrido inmersivo (foto amplia + puntos de interés + visita guiada) ----------
const NM_SPOTS = {
  huallilemu: [[.5, .58, 'Cabaña para 4', 'Dos dormitorios, cocina equipada y chimenea.'], [.18, .72, 'Terraza con parrilla', 'Quincho techado frente al bosque.'], [.82, .45, 'Sendero al mar', 'A 5 minutos caminando de la playa.']],
  huayca: [[.3, .55, 'Piscina temperada', 'Abierta todo el año, con zona para niños.'], [.7, .62, 'Quincho familiar', 'Para 12 personas, con vista al mar.']],
  serrano: [[.42, .3, 'Torres del Paine', 'Vista directa al macizo desde el refugio.'], [.15, .78, 'Refugio doble', 'Calefacción, baño privado y desayuno.'], [.8, .62, 'Mirador Río Serrano', 'Ideal al amanecer, a 300 m.']],
  gourmet: [[.55, .45, 'Cocina de autor', 'Menú de temporada con productos del sur.'], [.2, .65, 'Comedor panorámico', 'Cena incluida en tu estadía de fin de semana.']],
};
(function nomaTour() {
  const pv = document.createElement('div');
  pv.className = 'nm-pano'; pv.hidden = true; pv.setAttribute('role', 'dialog'); pv.setAttribute('aria-modal', 'true'); pv.setAttribute('aria-label', 'Recorrido inmersivo');
  pv.innerHTML = `<div class="nm-pano-view"><div class="nm-pano-world"><img class="nm-pano-img" alt=""><div class="nm-spots"></div></div></div>
    <div class="nm-dust" aria-hidden="true">${'<i></i>'.repeat(14)}</div>
    <div class="nm-pano-top"><div><small>RECORRIDO INMERSIVO</small><strong></strong></div><button type="button" class="nm-sv-x nm-pano-x" aria-label="Cerrar">✕</button></div>
    <div class="nm-spot-card" aria-live="polite" hidden><b></b><p></p></div>
    <div class="nm-pano-bar"><button type="button" class="nm-tour-btn" aria-pressed="true">❚❚ Visita guiada</button><span class="nm-pano-dots"></span></div>
    <p class="nm-pano-hint">Desliza o mueve tu teléfono para recorrer</p>
    <button type="button" class="nm-sv-go nm-pano-go">Reservar en este hotel</button>`;
  document.body.appendChild(pv);
  const view = pv.querySelector('.nm-pano-view'), world = pv.querySelector('.nm-pano-world'), img = pv.querySelector('.nm-pano-img');
  const card = pv.querySelector('.nm-spot-card'), tourBtn = pv.querySelector('.nm-tour-btn');
  let W = 0, H = 0, VW = 0, x = 0, tx = 0, v = 0, raf = 0, drag = null, hotelId = null, opener = null, spots = [], si = -1, tourT = 0, touring = true, lastG = null, t0 = 0;
  const minX = () => Math.min(0, VW - W);
  const clamp = n => Math.max(minX(), Math.min(0, n));
  function layout() {
    VW = view.clientWidth; const VH = view.clientHeight;
    const r = img.naturalWidth / img.naturalHeight;
    H = VH * 1.08; W = Math.max(H * r, VW * 1.9); H = W / r;           // siempre más ancha que la pantalla para poder recorrerla
    Object.assign(world.style, { width: `${W}px`, height: `${H}px`, top: `${(VH - H) / 2}px` });
  }
  function focusSpot(i) {
    if (!spots.length) return;
    si = (i + spots.length) % spots.length; const s = spots[si];
    tx = clamp(VW / 2 - s[0] * W);
    pv.querySelectorAll('.nm-spot').forEach((el, n) => el.classList.toggle('on', n === si));
    pv.querySelectorAll('.nm-pano-dots i').forEach((el, n) => el.classList.toggle('on', n === si));
    card.hidden = false; card.querySelector('b').textContent = s[2]; card.querySelector('p').textContent = s[3];
    card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
  }
  function loop(t) {
    if (!drag) { if (touring) x += (tx - x) * .035; else { x += v; v *= .93; } x = clamp(x); }
    const k = (t - t0) / 1000, breathe = 1.04 + Math.sin(k * .5) * .02;           // respiración suave: sensación de profundidad
    world.style.transform = `translate3d(${x}px,0,0) scale(${breathe})`;
    pv.style.setProperty('--px', `${(x / (minX() || -1)) * 100}`);
    if (touring && !drag && t - tourT > 4200) { tourT = t; focusSpot(si + 1); }
    raf = requestAnimationFrame(loop);
  }
  const stopTour = () => { touring = false; tourBtn.setAttribute('aria-pressed', 'false'); tourBtn.textContent = '▶ Visita guiada'; pv.classList.add('touched'); };
  async function open(id, el) {
    const h = hotelById(id); if (!h) return;
    hotelId = id; opener = el; spots = NM_SPOTS[id] || [];
    pv.querySelector('.nm-pano-top strong').textContent = `${h.name} · ${h.place.split(' · ')[0]}`;
    pv.querySelector('.nm-spots').innerHTML = spots.map((s, n) => `<button type="button" class="nm-spot" data-spot="${n}" style="left:${s[0] * 100}%;top:${s[1] * 100}%" aria-label="${s[2]}"><i></i></button>`).join('');
    pv.querySelector('.nm-pano-dots').innerHTML = spots.map(() => '<i></i>').join('');
    card.hidden = true; pv.classList.remove('touched');
    touring = true; tourBtn.setAttribute('aria-pressed', 'true'); tourBtn.textContent = '❚❚ Visita guiada';
    pv.hidden = false; document.body.classList.add('lock'); requestAnimationFrame(() => pv.classList.add('open'));
    img.src = h.img; await img.decode().catch(() => {});
    layout(); x = tx = clamp(VW / 2 - W * .5); si = -1; t0 = tourT = performance.now() - 3000;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    haptic(8);
  }
  function close() { cancelAnimationFrame(raf); pv.classList.remove('open'); document.body.classList.remove('lock'); setTimeout(() => { pv.hidden = true; }, 250); opener?.focus?.({ preventScroll: true }); }
  view.addEventListener('pointerdown', e => { if (e.target.closest('.nm-spot')) return; drag = { x: e.clientX, x0: x, lx: e.clientX, t: performance.now() }; stopTour(); view.setPointerCapture(e.pointerId); });
  view.addEventListener('pointermove', e => { if (!drag) return; const now = performance.now(); v = (e.clientX - drag.lx) / Math.max(1, now - drag.t) * 16; drag.lx = e.clientX; drag.t = now; x = clamp(drag.x0 + (e.clientX - drag.x)); });
  ['pointerup', 'pointercancel'].forEach(t => view.addEventListener(t, () => { drag = null; }));
  addEventListener('deviceorientation', e => { if (pv.hidden || e.gamma == null) return; if (lastG != null && Math.abs(e.gamma - lastG) > .4) { if (touring) stopTour(); v += (e.gamma - lastG) * -1.6; } lastG = e.gamma; });
  pv.addEventListener('click', e => { const s = e.target.closest('[data-spot]'); if (s) { stopTour(); focusSpot(+s.dataset.spot); haptic(6); } });
  tourBtn.addEventListener('click', () => {
    touring = !touring; tourBtn.setAttribute('aria-pressed', String(touring));
    tourBtn.textContent = touring ? '❚❚ Visita guiada' : '▶ Visita guiada';
    if (touring) { tourT = performance.now(); focusSpot(si + 1); }
  });
  addEventListener('resize', () => { if (!pv.hidden) { layout(); x = tx = clamp(x); } });
  homeEl.addEventListener('click', e => {
    const b = e.target.closest('[data-pano]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const DOE = window.DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === 'function') DOE.requestPermission().catch(() => {});
    open(b.dataset.pano, b);
  });
  pv.querySelector('.nm-pano-x').addEventListener('click', close);
  pv.querySelector('.nm-pano-go').addEventListener('click', () => {
    close(); document.getElementById('nmDest').value = hotelId;
    setTimeout(() => document.getElementById('nmBook').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 260);
  });
  document.addEventListener('keydown', e => { if (pv.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') { stopTour(); focusSpot(si + 1); } if (e.key === 'ArrowLeft') { stopTour(); focusSpot(si - 1); } });
})();

// ---------- Barra inferior propia de cada producto (el botón "Marcas" se mantiene en las tres) ----------
(function brandNavs() {
  const nav = homeEl.querySelector('#nav'), marcas = document.getElementById('navBrand');
  const I = {
    home: '<svg viewBox="0 0 16 15"><path d="M8 .6 0 7.4h2.3V15h4.2v-4.6h3V15h4.2V7.4H16L8 .6Z" fill="currentColor"/></svg>',
    pin: '<svg viewBox="0 0 14 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 15s-5.5-4.6-5.5-8.6a5.5 5.5 0 0 1 11 0C12.5 10.4 7 15 7 15Z"/><circle cx="7" cy="6.4" r="2"/></svg>',
    cabin: '<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M1.5 7.5 9 1.5l7.5 6"/><path d="M3.5 6v8.5h11V6"/><path d="M7.5 14.5V10h3v4.5"/></svg>',
    help: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6.8"/><path d="M6.2 6.2a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.5"/><circle cx="8" cy="11.6" r=".6" fill="currentColor"/></svg>',
    transfer: '<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5h13M12 2l3 3-3 3M16 11H3M6 8l-3 3 3 3"/></svg>',
    card: '<svg viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="16" height="12" rx="2.5"/><path d="M1 5h16M4 10h4" stroke-linecap="round"/></svg>',
    cal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1.5" y="2.5" width="13" height="12" rx="2.5"/><path d="M1.5 6.5h13M5 1v3M11 1v3"/><path d="m5.5 10.5 1.7 1.6 3.3-3.3" stroke-linejoin="round"/></svg>',
    piggy: '<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M2.5 8.5c0-3 2.8-5 6.3-5 1 0 1.9.1 2.7.4L13.3 2.5v2.4c.9.7 1.5 1.6 1.8 2.6h1.4v2.8h-1.2c-.5 1-1.2 1.7-2.1 2.3V15h-2v-1.3c-.6.1-1.2.2-1.8.2s-1.2-.1-1.8-.2V15h-2v-2.3C3.6 11.7 2.5 10.2 2.5 8.5Z"/><circle cx="12.3" cy="7.5" r=".8" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 14 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="7" width="11" height="8" rx="2"/><path d="M4 7V4.8a3 3 0 0 1 6 0V7" stroke-linecap="round"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>',
  };
  const NAVS = {
    noma: [['home', 'Inicio', 'top'], ['pin', 'Destinos', 'stories'], ['cabin', 'Centros', 'hotels'], ['cal', 'Reservas', 'reservas']],
    tapp: [['home', 'Inicio', 'top'], ['transfer', 'Transferir', 'transfer'], ['card', 'Tarjetas', 'cards'], ['piggy', 'Ahorros', 'savings']],
  };
  Object.entries(NAVS).forEach(([b, items]) => items.forEach(([ico, label, act], i) => {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.dataset.navBrand = b; btn.dataset.navAct = act; btn.setAttribute('aria-label', label === 'Ahorros' ? 'Mis ahorros' : label);
    if (!i) btn.classList.add('on');
    btn.innerHTML = `${I[ico]}<span>${label}</span>`;
    nav.insertBefore(btn, marcas);
  }));
  const go2 = sel => { const el = document.querySelector(sel); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 150, behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const ACTS = {
    top: () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }),
    stories: () => go2('.nm-stories'),
    hotels: () => go2('#nmHotels'),
    help: () => toast('Asistente andes noma: ¿te ayudo con tu reserva?', 'i'),
    transfer: () => toast('Ingresa a tu cuenta Tapp para transferir', 'i'),
    cards: () => { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); setTimeout(() => document.getElementById('tpFlip')?.classList.toggle('flipped'), reduceMotion ? 0 : 450); },
    reservas: () => go2('#nmRes'),
    savings: () => go2('.tp-fin'),
  };
  nav.addEventListener('click', e => {
    const b = e.target.closest('[data-nav-act]'); if (!b) return;
    haptic(6); ACTS[b.dataset.navAct]?.();
  });
  // Al cambiar de producto, los botones de la barra entran escalonados
  new MutationObserver(() => {
    if (reduceMotion) return;
    [...nav.children].filter(b => b.offsetParent !== null).forEach((b, i) =>
      b.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: i * 50, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'backwards' }));
  }).observe(homeEl, { attributes: true, attributeFilter: ['data-brand'] });
})();
