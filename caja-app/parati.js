// ---------- "Para ti": beneficios del privado según los gustos del afiliado ----------
// Onboarding de gustos → recomendados (el mejor match arriba) → detalle del beneficio → código/QR

Object.assign(BENEFITS, {
  resto: {
    brand: 'Becas de Inglés', cat: 'educacion', img: 'assets/fotos/reunion.jpg', badge: 'COPAGO $10.000',
    catLabel: 'EDUCACIÓN ADULTOS', headline: 'Inglés por $10.000', desc: 'Programa de inglés para adultos de tres meses con un copago único de $10.000.',
    channel: 'Postula online', price: 'Copago único $10.000', link: 'Postular',
    kicker: 'BECA PARA AFILIADOS', title: 'Becas de Inglés para Adultos', place: 'Programa online de 3 meses',
    mode: 'Postulación con tu RUT', until: 'Cupos limitados',
    discounts: [['Programa de 3 meses', '$10.000'], ['Pago', 'COPAGO ÚNICO']],
    note: ['Cupos limitados', 'Postula con tu RUT desde la app. Te avisaremos por correo si quedaste seleccionado.'],
    near: 'Clases 100% online',
    sheet: { chip: 'Educación', ico: '🗣️', title: 'Cómo postular', sub: 'Becas de Inglés • Caja Los Andes', instrTitle: 'INSTRUCCIÓN DE POSTULACIÓN',
      instr: 'Completa tu postulación con tu RUT. Si quedas seleccionado pagas un copago único de $10.000 por los tres meses.', alt: 'Postular ahora' },
  },
  edv: {
    brand: 'Escuela de Verano', cat: 'educacion', img: 'assets/fotos/estudiantes.jpg', badge: 'GRATIS',
    catLabel: 'EDUCACIÓN', headline: '2.000 cupos gratis', desc: 'Cursos de verano en la Universidad de Chile para las cargas de afiliados, de Educación Básica y Media.',
    channel: 'Postula online', price: 'Postula del 17 al 30 Nov', link: 'Postular',
    kicker: 'BENEFICIO GRATUITO', title: 'Escuela de Verano EdV', place: 'Universidad de Chile · cursos presenciales',
    mode: 'Postulación en edv.uchile.cl', until: 'Postula del 17 al 30 Nov',
    discounts: [['Cursos de verano', 'GRATIS'], ['Cupos para cargas', '2.000']],
    note: ['Cupos limitados', 'Exclusivo para cargas acreditadas de afiliados. Postula entre el 17 y el 30 de noviembre en edv.uchile.cl.'],
    near: 'Campus Juan Gómez Millas, Ñuñoa',
    sheet: { chip: 'Educación', ico: '🎓', title: 'Cómo postular', sub: 'Escuela de Verano • Universidad de Chile', instrTitle: 'INSTRUCCIÓN DE POSTULACIÓN',
      instr: 'Entra a edv.uchile.cl entre el 17 y el 30 de noviembre, elige los cursos y postula con el RUT de tu hijo o hija.', alt: 'Ir a edv.uchile.cl' },
  },
});

BENEFITS.chequeo.img = 'assets/fotos/chequeo.jpg';
BENEFITS.chequeo.short = 'Dental 60% dcto';

// Vitrina pública: la educación también aparece en Experiencias
$('#expList').insertAdjacentHTML('beforeend', ['edv', 'resto'].map(expCard).join(''));

// ----- Intro "Para ti": 3 preguntas cortas → beneficios personalizados -----
// Cada respuesta suma puntos a los beneficios; el que más suma es "Tu mejor match".
const QUIZ = [
  { id: 'tiempo', multi: true, q: '¿Cómo te gusta disfrutar tu tiempo libre?', hint: 'Elige todas las que quieras.',
    opts: [
      { v: 'idiomas', emo: '🗣️', t: 'Aprender idiomas', why: 'quieres aprender idiomas', pts: { resto: 3 } },
      { v: 'cine', emo: '🍿', t: 'Cine y panoramas', why: 'te gustan los panoramas', pts: { hoyts: 3 } },
      { v: 'viajar', emo: '✈️', t: 'Viajar y conocer', why: 'te gusta viajar', pts: { jetsmart: 3, transvip: 2 } },
      { v: 'aire', emo: '🏔️', t: 'Naturaleza y aire libre', why: 'disfrutas el aire libre', pts: { cabanas: 3, jetsmart: 1 } },
      { v: 'descanso', emo: '🧘', t: 'Descansar y cuidarme', why: 'quieres cuidarte', pts: { chequeo: 2, salcobrand: 1, smartfit: 1 } },
      { v: 'deporte', emo: '🏋️', t: 'Hacer deporte', why: 'te gusta hacer deporte', pts: { smartfit: 3 } },
    ] },
  { id: 'interes', multi: true, q: '¿Qué te interesa más en este momento?', hint: 'Así priorizamos lo que te sirve hoy.',
    opts: [
      { v: 'farmacia', emo: '💊', t: 'Ahorrar en farmacia', why: 'quieres ahorrar en farmacia', pts: { salcobrand: 3, cruzverde: 3 } },
      { v: 'auto', emo: '🚗', t: 'Ahorrar en bencina', why: 'quieres ahorrar en combustible', pts: { copec: 3, aramco: 3 } },
      { v: 'salud', emo: '🩺', t: 'Cuidar mi salud', why: 'te importa tu salud', pts: { chequeo: 3 } },
      { v: 'estudiar', emo: '🎓', t: 'Aprender o estudiar', why: 'te interesa aprender', pts: { resto: 3, edv: 1 } },
      { v: 'diario', emo: '🛍️', t: 'Descuentos del día a día', why: 'buscas descuentos del día a día', pts: { carozzi: 3, salcobrand: 1, copec: 1 } },
    ] },
  { id: 'hijos', multi: false, q: '¿Tienes hijos?', hint: 'Para mostrarte beneficios para toda tu familia.',
    opts: [
      { v: 'peques', emo: '👶', t: 'Sí, pequeños', why: 'tienes hijos pequeños', pts: { hoyts: 1, salcobrand: 1 } },
      { v: 'escolar', emo: '🎒', t: 'Sí, en edad escolar', why: 'tienes hijos en el colegio', pts: { edv: 4, hoyts: 1 } },
      { v: 'grandes', emo: '🧑', t: 'Sí, ya grandes', why: 'tus hijos ya son grandes', pts: { jetsmart: 1, cabanas: 1 } },
      { v: 'no', emo: '🙂', t: 'No tengo', why: 'tienes más tiempo para ti', pts: { resto: 1, jetsmart: 1 } },
    ] },
];
const PT_IDS = ['hoyts', 'cinepolisconf', 'cinemarkconf', 'mediclic', 'salcobrand', 'chequeo', 'jetsmart', 'resto', 'edv', 'cabanas', 'cruzverde', 'smartfit', 'carozzi', 'copec', 'aramco', 'transvip'];
const ptStore = {
  get() { try { return JSON.parse(localStorage.getItem('cla-gustos-v2')) || null; } catch (_) { return null; } },
  set(v) { try { localStorage.setItem('cla-gustos-v2', JSON.stringify(v)); } catch (_) {} },
};
let answers = ptStore.get() || {};
let qi = 0;

function paintQuiz() {
  const Q = QUIZ[qi], sel = answers[Q.id] || (Q.multi ? [] : null);
  $('#pqStep').textContent = `PREGUNTA ${qi + 1} DE ${QUIZ.length}`;
  $('#pqBar').style.width = `${((qi + 1) / QUIZ.length) * 100}%`;
  $('#pqQ').textContent = Q.q;
  $('#pqHint').textContent = Q.hint;
  const opts = $('#pqOpts');
  opts.setAttribute('role', Q.multi ? 'group' : 'radiogroup');
  opts.setAttribute('aria-labelledby', 'pqQ');
  opts.innerHTML = Q.opts.map(o => {
    const on = Q.multi ? sel.includes(o.v) : sel === o.v;
    return `<button type="button" class="pq-opt" data-v="${o.v}" ${Q.multi ? `aria-pressed="${on}"` : `role="radio" aria-checked="${on}"`}><span class="pq-emo" aria-hidden="true">${o.emo}</span><span class="pq-t">${o.t}</span><span class="pq-ck" aria-hidden="true"></span></button>`;
  }).join('');
  const done = Q.multi ? sel.length > 0 : !!sel;
  $('#pqNext').disabled = !done;
  $('#pqNext').textContent = qi === QUIZ.length - 1 ? 'Ver mis beneficios' : 'Siguiente';
  $('#pqBack').hidden = qi === 0;
}
$('#pqOpts').addEventListener('click', e => {
  const b = e.target.closest('.pq-opt'); if (!b) return;
  const Q = QUIZ[qi];
  if (Q.multi) {
    const cur = new Set(answers[Q.id] || []);
    cur.has(b.dataset.v) ? cur.delete(b.dataset.v) : cur.add(b.dataset.v);
    answers[Q.id] = [...cur];
  } else answers[Q.id] = b.dataset.v;
  haptic(6);
  paintQuiz();
  $(`#pqOpts [data-v="${b.dataset.v}"]`).classList.add('pop');
  // Pregunta de una sola respuesta: avanza sola tras elegir
  if (!Q.multi) setTimeout(() => $('#pqNext').click(), reduceMotion ? 0 : 280);
});
$('#pqNext').addEventListener('click', () => {
  if ($('#pqNext').disabled) return;
  haptic(8);
  if (qi < QUIZ.length - 1) { qi++; paintQuiz(); $('#pqQ').focus?.(); window.scrollTo(0, 0); }
  else showFeed();
});
$('#pqBack').addEventListener('click', () => { if (qi > 0) { qi--; haptic(6); paintQuiz(); } });

function scoreAll() {
  const score = Object.fromEntries(PT_IDS.map(id => [id, 0])), why = {};
  QUIZ.forEach(Q => {
    const sel = Q.multi ? (answers[Q.id] || []) : (answers[Q.id] ? [answers[Q.id]] : []);
    sel.forEach(v => {
      const o = Q.opts.find(x => x.v === v); if (!o) return;
      Object.entries(o.pts).forEach(([id, n]) => {
        score[id] += n;
        if (!why[id] || n > why[id].n) why[id] = { n, t: o.why };
      });
    });
  });
  const order = [...PT_IDS].sort((a, b) => score[b] - score[a]);
  return { order, score, why };
}
function showFeed(save = true) {
  if (save) ptStore.set(answers);
  $('#ptOnb').hidden = true; $('#ptFeed').hidden = false;
  renderFeed();
  window.scrollTo(0, 0);
}
$('#ptSkip').addEventListener('click', () => { answers = {}; showFeed(); });
$('#ptEdit')?.addEventListener('click', () => {
  haptic(6); qi = 0; $('#ptFeed').hidden = true; $('#ptOnb').hidden = false; paintQuiz(); window.scrollTo(0, 0);
});

// ----- Resultado: la misma vitrina de Beneficios del sitio público, ordenada según tus gustos -----
const PT_CATS = {
  salud: ['Salud', '<svg width="14" height="13" viewBox="0 0 14 13"><path d="M7 12.5S.5 8.6.5 4.3A3.6 3.6 0 0 1 7 2.1a3.6 3.6 0 0 1 6.5 2.2c0 4.3-6.5 8.2-6.5 8.2Z" fill="#E5484D"/></svg>'],
  entretencion: ['Entretención', '<svg width="15" height="13" viewBox="0 0 16 14" fill="none" stroke="#8b3fe0" stroke-width="1.5"><path d="M1 4a2 2 0 0 0 0 4v4h14V8a2 2 0 0 1 0-4V1H1Z" stroke-linejoin="round"/><path d="M10 1v11" stroke-dasharray="1.5 1.5"/></svg>'],
  comida: ['Comida', '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" stroke="#E07A00" stroke-width="1.5" stroke-linecap="round"><path d="M3 1v5a2 2 0 0 0 2 2v6M5 1v4M1 1v5a2 2 0 0 0 2 2M11 14V1c-1.7 1-3 3-3 6h3"/></svg>'],
  viajes: ['Viajes', '<svg width="15" height="15" viewBox="0 0 16 16"><path d="M15 1 1 6.5l5 1.8L8 14l2.4-4.2L15 1Z" fill="#06C2FA"/></svg>'],
  educacion: ['Educación', '<svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="#084AFE" stroke-width="1.5" stroke-linejoin="round"><path d="M8 1 1 4.5 8 8l7-3.5Z"/><path d="M4 6v4c2 1.8 6 1.8 8 0V6"/></svg>'],
  hogar: ['Hogar', '<svg width="15" height="14" viewBox="0 0 16 15" fill="none" stroke="#E07A00" stroke-width="1.5" stroke-linejoin="round"><path d="M1.5 7 8 1.5 14.5 7M3.5 5.5V13.5h9V5.5"/></svg>'],
  deporte: ['Deporte', '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#131252" stroke-width="1.6" stroke-linecap="round"><path d="M1 6h14M3.5 3v6M5.5 1.5v9M10.5 1.5v9M12.5 3v6"/></svg>'],
  turismo: ['Turismo', '<svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="#084AFE" stroke-width="1.5" stroke-linecap="round"><path d="M8 13V6M8 6C6 2.5 2.5 2.5 1 4M8 6c2-3.5 5.5-3.5 7-2M3 13h10"/></svg>'],
};
const STAR = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="m6 .6 1.6 3.4 3.8.4-2.8 2.6.8 3.7L6 8.8l-3.4 1.9.8-3.7L.6 4.4l3.8-.4Z" fill="currentColor"/></svg>';
let ptCat = 'all', ptMode = 'all', ptQuery = '', syncPtCats = () => {}, ptMap = null;
// Ya ingresaste: en vez del requisito, cómo se usa (en el local u online)
const whyTag = (w, id) => `<span class="pt-why muted">${MODE[id] === 'online' ? '💻 Online' : '📍 En el local'}</span>`;
function cardsInto(el, ids, why, kind) {
  el.innerHTML = ids.map(id => {
    const bb = BENEFITS[id];
    if (kind === 'exp' && !bb.price) Object.assign(bb, { price: bb.channel || 'Para afiliados', link: 'Ver detalle' });
    return kind === 'exp' ? expCard(id) : usedCard(id);
  }).join('');
  // Ya ingresaste: en vez del requisito mostramos por qué te lo recomendamos
  $$('[data-open]', el).forEach(c => { const t = $('.req-tag', c); if (t) t.outerHTML = whyTag(why[c.dataset.open], c.dataset.open); });
}
function paintPtCats(score) {
  // Tus categorías primero: ordenadas por cuánto te interesan
  const catScore = {};
  PT_IDS.forEach(id => { const c = BENEFITS[id].cat; catScore[c] = (catScore[c] || 0) + (score[id] || 0); });
  const cats = Object.keys(catScore).filter(c => PT_CATS[c]).sort((x, y) => catScore[y] - catScore[x]);
  const wrap = $('#ptCats');
  wrap.innerHTML = '<span class="cats-ind" aria-hidden="true"></span>'
    + `<button class="cat-chip on" role="tab" aria-selected="true" data-cat="all"><i class="cc-ico">${STAR}</i>Destacados</button>`
    + cats.map(c => `<button class="cat-chip" role="tab" aria-selected="false" data-cat="${c}"><i class="cc-ico">${PT_CATS[c][1]}</i>${PT_CATS[c][0]}</button>`).join('');
  ptCat = 'all';
  syncPtCats = segmented(wrap, $('.cats-ind', wrap), btn => { ptCat = btn.dataset.cat; ptFilter(); paintApplied('pt'); });
  wrap.scrollLeft = 0;
}
function ptFilter() {
  let visible = 0;
  $$('#ptReco .used, #ptOther .exp').forEach(c => {
    const ok = (ptCat === 'all' || c.dataset.cat === ptCat) && (ptMode === 'all' || c.dataset.mode === ptMode) && (!ptQuery || c.dataset.text.includes(ptQuery));
    if (ok) visible++;
    if (ok && c.hidden) { c.hidden = false; c.animate([{ opacity: 0, transform: 'translateY(12px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: reduceMotion ? 1 : 380, easing: EASE, delay: visible * 50 }); }
    else if (!ok) c.hidden = true;
  });
  $('#ptRecoT').closest('.sec-head').hidden = $('#ptReco').hidden = !$$('#ptReco .used').some(c => !c.hidden);
  $('#ptOtherT').closest('.sec-head').hidden = $('#ptOther').hidden = !$$('#ptOther .exp').some(c => !c.hidden);
  $('#ptEmpty').hidden = visible > 0;
  $('#ptEmpty span').textContent = ptQuery || (PT_CATS[ptCat] ? PT_CATS[ptCat][0] : '');
}
let ptqTimer;
$('#ptSearch').addEventListener('input', e => {
  clearTimeout(ptqTimer);
  ptqTimer = setTimeout(() => { ptQuery = e.target.value.trim().toLowerCase(); ptFilter(); }, 180);
});
function renderFeed() {
  const { order, score, why } = scoreAll();
  const any = Object.values(score).some(n => n > 0);
  // (sin saludo de gustos en esta versión)
  // Carrusel: los que calzan con tus gustos (el mejor primero). Lista: el resto
  const reco = any ? order.filter(id => score[id] > 0) : order.slice(0, 4);
  const other = order.filter(id => !reco.includes(id));
  $('#ptRecoT').textContent = 'Beneficios más usados';
  $('#ptRecoSub').textContent = 'Aprovechados por más de 45.000 afiliados';
  cardsInto($('#ptReco'), reco, any ? why : {}, 'used');
  cardsInto($('#ptOther'), other, any ? why : {}, 'exp');
  $('#ptOtherT').textContent = 'Experiencias y más beneficios';
  paintPtCats(score);
  ptQuery = ''; ptMode = 'all'; $('#ptSearch').value = '';
  paintApplied('pt');
  ptFilter();
  $('#ptReco').scrollLeft = 0;
  if (!ptMap) ptMap = mountMap($('#ptNear'));
  requestAnimationFrame(() => { syncPtCats(); ptMap.sync(); ptMap.drop(); });
}
document.addEventListener('screen:enter', e => { if (e.detail.name === 'parati' && ptMap && !$('#ptFeed').hidden) { syncPtCats(); ptMap.sync(); } });
addEventListener('resize', () => { if (current === 'parati' && !$('#ptFeed').hidden) syncPtCats(); });
document.addEventListener('click', e => {
  const c = e.target.closest('[data-pt]'); if (!c) return;
  e.preventDefault(); haptic(8); go('detalle', { id: c.dataset.pt });
});
document.addEventListener('keydown', e => {
  const c = e.target.closest && e.target.closest('[data-pt]');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go('detalle', { id: c.dataset.pt }); }
});
document.addEventListener('screen:before', e => {
  if (e.detail.name !== 'parati' || e.detail.back) return;
  // Versión acotada: sin preguntas de gustos, la misma vitrina para todos
  answers = {}; $('#ptOnb').hidden = true; $('#ptFeed').hidden = false; renderFeed();
});

// ---------- Recorrido guiado del inicio privado ----------
const TOUR = [
  { el: '.ph-hello', t: 'Este es tu inicio', p: 'Aquí ves tu estado de afiliación. Toca tu foto para editar tu perfil y tu avatar.' },
  { el: '#pvActive', t: 'Lo más importante para ti', p: 'Tus licencias y créditos en curso, siempre arriba. Si tienes más de uno, desliza para verlos.' },
  { el: '.ph-quick', t: 'Accesos rápidos', p: 'Simula un crédito, revisa devoluciones, encuentra sucursales o descarga certificados.' },
  { el: '#cvRow', t: 'Tus beneficios de hoy', p: 'Toca uno para ver el detalle y obtener tu código o QR para mostrar en el local.' },
  { el: '.ph-nav [data-go="parati"]', t: 'Tus beneficios', p: 'Descuentos y convenios para afiliados, con filtros para encontrar rápido lo que buscas.' },
  { el: '[data-screen="privado"] .menu-btn', t: 'Todo lo demás, en el menú', p: 'Créditos, ahorro, seguros, ayuda y cerrar sesión.' },
];
const tourEl = $('#tour'), spot = $('#tourSpot'), tip = $('#tourTip');
let tStep = 0, tourOn = false;
$('#tourDots').innerHTML = TOUR.map(() => '<i></i>').join('');
function place() {
  const s = TOUR[tStep], el = $(s.el); if (!el) return;
  const r = el.getBoundingClientRect(), pad = 8;
  const round = s.el.includes('menu-btn') || s.el.includes('ph-nav') ? 22 : 20;
  Object.assign(spot.style, { top: `${r.top - pad}px`, left: `${r.left - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px`, borderRadius: `${round}px` });
  const ar = app.getBoundingClientRect();
  const below = r.bottom + 14 + tip.offsetHeight < innerHeight - 12;
  tip.style.left = `${ar.left + 16}px`; tip.style.width = `${Math.min(ar.width, 430) - 32}px`;
  tip.style.top = below ? `${r.bottom + pad + 12}px` : `${Math.max(12, r.top - pad - 12 - tip.offsetHeight)}px`;
  tip.dataset.side = below ? 'below' : 'above';
  const cx = r.left + r.width / 2 - (ar.left + 16);
  tip.style.setProperty('--ax', `${Math.max(24, Math.min(cx, Math.min(ar.width, 430) - 56))}px`);
}
function showStep(i) {
  tStep = i;
  const s = TOUR[i], el = $(s.el);
  if (!el || el.closest('[hidden]')) { i < TOUR.length - 1 ? showStep(i + 1) : endTour(); return; }
  const vis = TOUR.filter(t => { const x = $(t.el); return x && !x.closest('[hidden]'); });
  $('#tourCount').textContent = `${vis.indexOf(s) + 1} de ${vis.length}`;
  $('#tourT').textContent = s.t; $('#tourP').textContent = s.p;
  $('#tourNext').textContent = i === TOUR.length - 1 ? '¡Listo!' : 'Siguiente';
  $('#tourDots').innerHTML = vis.map(t => `<i class="${t === s ? 'on' : ''}"></i>`).join('');
  tip.classList.remove('in');
  // Llevar el elemento a la vista (bajo el encabezado fijo)
  const fixed = getComputedStyle(el.closest('.ph-nav') || el).position === 'fixed' || el.closest('.ph-header, .ph-nav');
  if (!fixed) {
    const head = $('[data-screen="privado"] .ph-header').getBoundingClientRect().height;
    const r = el.getBoundingClientRect();
    const y = scrollY + r.top - head - 90;
    window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  setTimeout(() => { place(); tip.classList.add('in'); $('#tourNext').focus({ preventScroll: true }); }, fixed ? 60 : 420);
  haptic(6);
}
function startTour() {
  if (current !== 'privado' || tourOn) return;
  tourOn = true;
  closeDrawer?.();
  tourEl.classList.add('open'); tourEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  showStep(0);
}
function endTour() {
  tourOn = false;
  tourEl.classList.remove('open'); tourEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  try { localStorage.setItem('cla-tour', '1'); } catch (_) {}
  document.dispatchEvent(new CustomEvent('tour:end'));
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}
$('#tourNext').addEventListener('click', () => { tStep < TOUR.length - 1 ? showStep(tStep + 1) : (endTour(), toast('¡Listo! Ya conoces tu inicio', '✓')); });
$('#tourSkip').addEventListener('click', endTour);
document.addEventListener('keydown', e => { if (tourOn && e.key === 'Escape') endTour(); });
addEventListener('resize', () => { if (tourOn) place(); });
$('#dpTour').addEventListener('click', e => { e.preventDefault(); closeDrawer(); setTimeout(startTour, 450); });
// Al ingresar al sitio privado (no interrumpe si viene a destapar un QR)
document.addEventListener('screen:enter', e => {
  // Cada vez que ingresas (después de Face ID) se muestra el recorrido
  if (e.detail.name !== 'privado' || e.detail.prev !== 'password') return;
  // El perfil nuevo decide desde su tarjeta de bienvenida
  if (USERS[demoUser]?.none) return;
  setTimeout(() => { if (current === 'privado' && !afterLoginCpn && !pendingCpn) startTour(); }, 1100);
});

// Filtros de "Para ti": la misma hoja de la vitrina pública (sin requisito: ya ingresaste)
FS.pt = {
  rows: '#ptReco .used, #ptOther .exp', btn: '#ptFilterBtn', count: '#ptFilterCount', applied: '#ptApplied', noReq: true,
  get: () => ({ req: 'all', mode: ptMode, cat: ptCat }),
  apply(f) {
    ptMode = f.mode;
    if (f.cat !== ptCat) { const chip = $(`#ptCats [data-cat="${f.cat}"]`); if (chip) chip.click(); else ptCat = f.cat; }
    ptFilter();
  },
};
$('#ptFilterBtn').addEventListener('click', () => openFilters('pt'));
$('#ptApplied').addEventListener('click', appliedClick('pt'));
