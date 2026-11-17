// ---------- Perfiles de demostración (María / Javiera / Tomás / Pedro) y "Tus trámites" personalizable ----------

const USERS = {
  maria: { rut: '12.345.678-9', afil: 'Afiliada Activa', short: 'MV', lic: true,
    credit: { amt: '4.500.000', q: { 24: '$218.400/m', 36: '$156.900/m', 48: '$126.500/m' } } },
  javiera: { rut: '16.543.210-8', afil: 'Afiliada Activa', short: 'JM', lic: true, loan: true,
    credit: { amt: '3.000.000', q: { 24: '$145.600/m', 36: '$104.600/m', 48: '$84.300/m' } } },
  tomas: { rut: '19.876.543-2', afil: 'Afiliado Activo', short: 'TH', lic: false, none: true,
    credit: { amt: '2.500.000', q: { 24: '$121.300/m', 36: '$87.200/m', 48: '$70.300/m' } } },
  pedro: { rut: '15.987.654-3', afil: 'Afiliado Activo', short: 'PR', lic: false, loan: true,
    credit: { amt: '6.000.000', q: { 24: '$291.200/m', 36: '$209.200/m', 48: '$168.700/m' } } },
};
// Orden y visibilidad por defecto de los trámites de cada perfil
const TQ_DEFAULT = {
  maria: { order: ['mislic', 'ahorro', 'certs', 'credito', 'parati', 'turismo', 'devol', 'sucursales'], hidden: [] },
  javiera: { order: ['mislic', 'credito', 'certs', 'parati', 'ahorro', 'turismo', 'devol', 'sucursales'], hidden: [] },
  tomas: { order: ['parati', 'credito', 'certs', 'turismo', 'ahorro', 'sucursales', 'devol', 'mislic'], hidden: ['mislic', 'devol'] },
  pedro: { order: ['credito', 'parati', 'certs', 'ahorro', 'turismo', 'sucursales', 'devol', 'mislic'], hidden: ['mislic'] },
};
const tqStore = {
  get(u) { try { return JSON.parse(localStorage.getItem('cla-tramites-' + u)) || null; } catch (_) { return null; } },
  set(u, v) { try { localStorage.setItem('cla-tramites-' + u, JSON.stringify(v)); } catch (_) {} },
};

// ----- Aplicar un perfil a todas las pantallas -----
function applyUser() {
  const U = USERS[demoUser];
  $$('[data-rut]').forEach(el => { el.textContent = U.rut; });
  $$('[data-afil]').forEach(el => { el.textContent = U.afil; });
  // Inicio privado: primero lo que el afiliado tiene activo (licencia y/o crédito)
  $('#pvLic').hidden = !U.lic;
  $('#pvLoan').hidden = !U.loan;
  $('#pvActive').hidden = !!U.none;
  $('#pvWelcome').hidden = !U.none || welcomeSeen.has(demoUser);
  paintActive();
  // El crédito vive en el banner del carrusel; la tarjeta con plazos se abre al tocarlo
  $('#pvCredit').hidden = true;
  $('#pvCredSlide').hidden = !!U.loan;
  $('#pvcAmt').textContent = U.credit.amt;
  $$('[data-q]').forEach(el => { el.textContent = U.credit.q[el.dataset.q]; });
  // Menú: resumen de productos del perfil
  const lic = $('#accPriv [data-pcat="0"]'), cred = $('#accPriv [data-pcat="1"]');
  if (lic) {
    $('small', lic).textContent = U.lic ? '1 licencia con documentos pendientes' : U.none ? 'Sin licencias registradas' : 'Sin licencias en curso';
    const chip = $('.tr-chip', lic); if (chip) chip.hidden = !U.lic;
  }
  if (cred) $('small', cred).textContent = U.loan ? 'Crédito vigente · 4 de 12 cuotas pagadas' : `Crédito preaprobado por $${U.credit.amt}`;
  if (typeof PRIV_CATS !== 'undefined') {
    PRIV_CATS[0].sub = U.lic ? '1 licencia con documentos pendientes' : U.none ? 'Sin licencias registradas' : 'Sin licencias en curso';
    PRIV_CATS[1].sub = U.loan ? 'Crédito vigente · 4 de 12 cuotas pagadas' : `Crédito preaprobado por $${U.credit.amt}`;
  }
  $$('.dp-sw').forEach(b => b.setAttribute('aria-checked', String(b.dataset.user === demoUser)));
  paintProfile(); syncEmojis?.();
  if (typeof showAccount === 'function') showAccount();
  paintTramites();
  if (typeof renderMyLics === 'function') renderMyLics();
}

function switchUser(u) {
  if (u === demoUser || !PROFILES[u]) return;
  demoUser = u;
  try { localStorage.setItem('cla-demo-user', u); } catch (_) {}
  Object.keys(profile).forEach(k => delete profile[k]);
  Object.assign(profile, PROFILES[u]);
  try { Object.assign(profile, JSON.parse(localStorage.getItem(profKey(u)) || '{}')); } catch (_) {}
  closeDrawer();
  const home = screenEl('privado');
  home.classList.add('user-switch');
  setTimeout(() => {
    applyUser();
    if (current !== 'privado') go('privado');
    window.scrollTo(0, 0);
    toast(`Ahora ves el perfil de ${profile.nombre} ${profile.apellido}`, '👤');
  }, reduceMotion ? 0 : 260);
  setTimeout(() => home.classList.remove('user-switch'), reduceMotion ? 0 : 700);
  haptic?.([10, 40, 14]);
}
// Tarjetas activas: con licencia y crédito a la vez se forma un carrusel
function paintActive() {
  const track = $('#pvActiveTrack'), dots = $('#pvActiveDots');
  const n = [...$$('.ph-card', track)].filter(c => !c.hidden).length;
  $('#pvActive').classList.toggle('multi', n > 1);
  dots.innerHTML = n > 1 ? Array.from({ length: n }, (_, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}" aria-label="Ver tarjeta ${i + 1} de ${n}"></button>`).join('') : '';
  track.scrollLeft = 0;
}
$('#pvActiveTrack').addEventListener('scroll', e => {
  const t = e.currentTarget, max = t.scrollWidth - t.clientWidth;
  const n = $$('#pvActiveDots button').length, i = max > 0 ? Math.round(t.scrollLeft / max * (n - 1)) : 0;
  $$('#pvActiveDots button').forEach((d, k) => d.classList.toggle('on', k === i));
}, { passive: true });
$('#pvActiveDots').addEventListener('click', e => {
  const b = e.target.closest('[data-i]'); if (!b) return;
  const t = $('#pvActiveTrack'), cards = [...$$('.ph-card', t)].filter(c => !c.hidden).sort((a, b) => a.offsetLeft - b.offsetLeft);
  t.scrollTo({ left: cards[+b.dataset.i].offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' }); haptic(4);
});
// Bienvenida (perfil nuevo): invita al recorrido y desaparece al terminarlo
const welcomeSeen = new Set();
function dismissWelcome() {
  const w = $('#pvWelcome'); if (w.hidden || !USERS[demoUser].none) return;
  welcomeSeen.add(demoUser);
  if (reduceMotion) { w.hidden = true; return; }
  w.style.height = w.offsetHeight + 'px'; w.offsetHeight;
  w.classList.add('out');
  setTimeout(() => { w.hidden = true; w.classList.remove('out'); w.style.height = ''; }, 420);
}
$('#pwStart').addEventListener('click', () => { haptic(8); startTour(); });
$('#pwLater').addEventListener('click', () => { haptic(6); dismissWelcome(); });
document.addEventListener('tour:end', () => setTimeout(dismissWelcome, 350));
// Cada ingreso vuelve a mostrar la bienvenida al perfil nuevo
document.addEventListener('screen:enter', e => {
  if (e.detail.name === 'privado' && e.detail.prev === 'password') { welcomeSeen.clear(); $('#pvWelcome').hidden = !USERS[demoUser].none; }
});
document.addEventListener('click', e => { const b = e.target.closest('.dp-sw'); if (b) switchUser(b.dataset.user); });

// La tarjeta del crédito vigente responde también a Enter / Espacio
$('#pvLoan').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#pvLoan').click(); } });

// ----- Tus trámites: ordenar, guardar y mostrar -----
const tqGrid = $('#tqGrid');
const TILES = Object.fromEntries($$('.pq', tqGrid).map(a => [a.dataset.tid, a]));
const tqLabel = id => { const c = TILES[id].cloneNode(true); c.querySelectorAll('br').forEach(b => b.replaceWith(' ')); return c.textContent.replace(/\s+/g, ' ').trim(); };
let tq = null;
function tqState() { return structuredClone(TQ_DEFAULT[demoUser]); }   // versión acotada: orden fijo
function paintTramites() {
  tq = tqState();
  tq.order.forEach(id => { const t = TILES[id]; if (!t) return; t.hidden = tq.hidden.includes(id); tqGrid.appendChild(t); });
}
const tqSheet = $('#tqSheet'), tqBd = $('#tqBd');
function row(id, i, visible) {
  const ico = $('.pq-ico', TILES[id]).innerHTML;
  return `<li class="tq-row" data-id="${id}">
    ${visible ? '' : ''}<span class="tq-ico" aria-hidden="true">${ico}</span><b>${tqLabel(id)}</b>
    ${visible ? `<button type="button" class="tq-grip" data-grip aria-label="Reordenar ${tqLabel(id)}: mantén presionado y arrastra, o usa las flechas del teclado"><svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true"><g fill="currentColor"><circle cx="4" cy="4" r="1.7"/><circle cx="10" cy="4" r="1.7"/><circle cx="4" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="4" cy="16" r="1.7"/><circle cx="10" cy="16" r="1.7"/></g></svg></button>` : ''}
    <button type="button" class="tq-tg ${visible ? 'hide' : 'show'}" data-tg aria-label="${visible ? 'Guardar' : 'Mostrar'} ${tqLabel(id)}">${visible ? 'Guardar' : 'Mostrar'}</button>
  </li>`;
}
function paintSheet() {
  const vis = tq.order.filter(id => !tq.hidden.includes(id)), hid = tq.order.filter(id => tq.hidden.includes(id));
  $('#tqVis').innerHTML = vis.map((id, i) => row(id, i, true)).join('');
  $('#tqHid').innerHTML = hid.length ? hid.map((id, i) => row(id, i, false)).join('') : '<li class="tq-empty">No tienes trámites guardados.</li>';
}
function saveTq() { tqStore.set(demoUser, tq); paintTramites(); }
$('#tqEdit').addEventListener('click', () => {
  tq = tqState(); paintSheet();
  tqSheet.classList.add('open'); tqBd.classList.add('open'); tqSheet.setAttribute('aria-hidden', 'false');
  haptic(6); setTimeout(() => $('#tqDone').focus({ preventScroll: true }), 80);
});
function closeTq() { tqSheet.classList.remove('open'); tqBd.classList.remove('open'); tqSheet.setAttribute('aria-hidden', 'true'); $('#tqEdit').focus({ preventScroll: true }); }
tqSheet.addEventListener('click', e => {
  const r = e.target.closest('.tq-row'); if (!r) return;
  const id = r.dataset.id;
  if (e.target.closest('[data-tg]')) {
    const vis = tq.order.filter(x => !tq.hidden.includes(x));
    if (!tq.hidden.includes(id) && vis.length <= 2) { toast('Deja al menos 2 trámites en tu inicio', 'i'); return; }
    tq.hidden = tq.hidden.includes(id) ? tq.hidden.filter(x => x !== id) : [...tq.hidden, id];
    haptic(6); saveTq(); paintSheet();
  }
});
// ----- Arrastrar y soltar para ordenar -----
function moveTo(id, to) {
  const vis = tq.order.filter(x => !tq.hidden.includes(x));
  const from = vis.indexOf(id); if (from < 0 || to === from) return false;
  vis.splice(from, 1); vis.splice(to, 0, id);
  tq.order = [...vis, ...tq.order.filter(x => tq.hidden.includes(x))];
  saveTq(); paintSheet(); return true;
}
let tqDrag = null;
$('#tqVis').addEventListener('pointerdown', e => {
  const grip = e.target.closest('[data-grip]'); if (!grip) return;
  e.preventDefault();
  const rowEl = grip.closest('.tq-row'), rows = $$('#tqVis .tq-row');
  const rects = rows.map(r => r.getBoundingClientRect());
  const i = rows.indexOf(rowEl);
  tqDrag = { id: rowEl.dataset.id, rowEl, rows, rects, i, to: i, y0: e.clientY, h: rects[i].height + 8 };
  grip.setPointerCapture(e.pointerId);
  rowEl.classList.add('dragging');
  $('#tqVis').classList.add('sorting');
  haptic(10);
});
$('#tqVis').addEventListener('pointermove', e => {
  if (!tqDrag) return;
  const dy = e.clientY - tqDrag.y0;
  tqDrag.rowEl.style.transform = `translateY(${dy}px) scale(1.02)`;
  const mid = tqDrag.rects[tqDrag.i].top + tqDrag.rects[tqDrag.i].height / 2 + dy;
  let to = tqDrag.rects.findIndex(r => mid < r.top + r.height / 2);
  if (to < 0) to = tqDrag.rects.length - 1;
  if (to !== tqDrag.to) { tqDrag.to = to; haptic(4); }
  tqDrag.rows.forEach((r, k) => {
    if (k === tqDrag.i) return;
    const shift = tqDrag.i < to && k > tqDrag.i && k <= to ? -tqDrag.h : tqDrag.i > to && k < tqDrag.i && k >= to ? tqDrag.h : 0;
    r.style.transform = shift ? `translateY(${shift}px)` : '';
  });
});
function endDrag() {
  if (!tqDrag) return;
  const { id, to, rows } = tqDrag; tqDrag = null;
  rows.forEach(r => { r.style.transform = ''; r.classList.remove('dragging'); });
  $('#tqVis').classList.remove('sorting');
  if (moveTo(id, to)) haptic([8, 30, 8]);
  $(`#tqVis [data-id="${id}"] [data-grip]`)?.focus({ preventScroll: true });
}
$('#tqVis').addEventListener('pointerup', endDrag);
$('#tqVis').addEventListener('pointercancel', endDrag);
$('#tqVis').addEventListener('keydown', e => {
  const grip = e.target.closest('[data-grip]'); if (!grip) return;
  const d = { ArrowUp: -1, ArrowDown: 1 }[e.key]; if (!d) return;
  e.preventDefault();
  const id = grip.closest('.tq-row').dataset.id;
  const vis = tq.order.filter(x => !tq.hidden.includes(x));
  const to = vis.indexOf(id) + d; if (to < 0 || to >= vis.length) return;
  if (moveTo(id, to)) { haptic(4); $(`#tqVis [data-id="${id}"] [data-grip]`)?.focus(); toast(`${tqLabel(id)} quedó en la posición ${to + 1}`, '↕'); }
});
$('#tqReset').addEventListener('click', () => { tq = structuredClone(TQ_DEFAULT[demoUser]); haptic(6); saveTq(); paintSheet(); toast('Restablecimos tu espacio', '✓'); });
$('#tqDone').addEventListener('click', closeTq);
tqBd.addEventListener('click', closeTq);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && tqSheet.classList.contains('open')) closeTq(); });

applyUser();

// Barra inferior del privado: Turismo lleva a las experiencias y centros vacacionales
document.getElementById('navTur')?.addEventListener('click', () => {
  haptic(8);
  const trip = document.querySelector('[data-screen="privado"] .pv-trip');
  if (current !== 'privado') { go('privado'); setTimeout(() => trip?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }), 500); }
  else trip?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  setTimeout(() => toast('Centros vacacionales con tarifas exclusivas para afiliados', '🏔️'), 450);
});

// Banner del crédito: muestra el crédito preaprobado (o el vigente) al tocarlo
function openCredit() {
  haptic(8);
  const U = USERS[demoUser];
  const target = U.loan ? $('#pvLoan') : $('#pvCredit');
  if (!U.loan) target.hidden = false;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  if (!reduceMotion) target.animate([{ boxShadow: '0 0 0 0 rgba(8,74,254,.35)' }, { boxShadow: '0 0 0 8px rgba(8,74,254,0)' }], { duration: 900, delay: 350 });
}
$('#pvCredSlide').addEventListener('click', openCredit);
$('#pvCredSlide').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCredit(); } });
