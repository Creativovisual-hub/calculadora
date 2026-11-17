// ---------- Vitrina de beneficios del privado: código / QR para el comercio ----------
// Flujo: tocar la tarjeta → rascar (o "Revelar ahora") → QR + código con cuenta regresiva.

const COUPONS = {
  hoyts: { ini: "C", brand: 'Cinemark', off: '$3.600', sub: 'entradas 2D lun a mié', img: 'assets/fotos/cine.jpg', tint: '#E5484D', mode: 'qr', pre: 'CMK',
    where: 'Muéstralo en boletería o tótem, o ingrésalo en cinemark.cl. Sirve para 4 entradas.' },
  salcobrand: { brand: 'Salcobrand', off: '45%', sub: 'en genéricos', img: 'assets/fotos/farmacia.jpg', tint: '#F08A24', mode: 'qr', pre: 'SB',
    where: 'Muéstralo en caja junto a tu cédula antes de pagar. Máx. 5 unidades por boleta.' },
  jetsmart: { brand: 'JetSMART', off: '25%', sub: 'en vuelos nacionales', img: 'assets/fotos/vuelo.jpg', tint: '#1B3FE0', mode: 'code', pre: 'JS',
    where: 'Cópialo e ingrésalo al pagar en jetsmart.com. Reserva con 14 días de anticipación.' },
  resto: { brand: 'Becas de Inglés', off: '$10.000', sub: 'programa de 3 meses', img: 'assets/fotos/reunion.jpg', tint: '#0B8457', mode: 'code', pre: 'ING',
    where: 'Ingrésalo al postular a la beca. Copago único por los tres meses.' },
};
Object.assign(COUPONS, {
  copec: { brand: 'Copec', off: '$15', sub: 'dcto por litro', img: 'assets/fotos/copec.svg', tint: '#B3121B', mode: 'code', pre: 'CPC',
    where: 'Ingrésalo en "Cupones Full" de la app Copec y paga tu carga con la app. Dura 3 días.' },
  smartfit: { brand: 'Smart Fit', off: '$0', sub: 'matrícula Plan Black', img: 'assets/fotos/smartfit.svg', tint: '#1A1A1A', mode: 'code', pre: 'SFT',
    where: 'Úsalo al contratar el Plan Black y actívalo en tu sede dentro de 48 horas.' },
});
const VALID_SECS = 10 * 60;
const cpnState = {};                 // id → { code, until }
let cpnId = null, cpnTick = null, cpnOpener = null;

// Código legible, sin letras que se confundan (0/O, 1/I)
function makeCode(pre) {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)];
  return `${pre}-${s.slice(0, 3)}-${s.slice(3)}`;
}

// QR ilustrativo (patrón determinístico a partir del código; demo)
function qrSvg(code) {
  const N = 25; let seed = 0; for (const c of code) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const finder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  let cells = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (finder(x, y) || (x >= 8 && x <= 16 && y >= 8 && y <= 16 && x >= 10 && x <= 14 && y >= 10 && y <= 14)) continue;
    if (rnd() < 0.48) cells += `<rect x="${x}" y="${y}" width="1" height="1" style="--d:${((x + y) * 14)}ms"/>`;
  }
  const eye = (x, y) => `<rect x="${x + .5}" y="${y + .5}" width="6" height="6" rx="1.4" fill="none" stroke="#131252" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".7"/>`;
  return `<svg viewBox="-1 -1 ${N + 2} ${N + 2}" shape-rendering="crispEdges" fill="#131252" role="img" aria-label="Código QR del beneficio">
    <g class="qr-cells">${cells}</g><g class="qr-eyes" shape-rendering="auto">${eye(0, 0)}${eye(N - 7, 0)}${eye(0, N - 7)}</g>
    <g shape-rendering="auto"><rect x="9.2" y="9.6" width="6.6" height="5.8" rx="1.4" fill="#fff"/><use class="logo-color" href="#logo-a" x="9.7" y="10.3" width="5.6" height="4.2"/></g></svg>`;
}

// ----- Tarjetas de la vitrina -----
const cvRow = $('#cvRow');
const fmtLeft = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
function cvCard(id) {
  const c = COUPONS[id];
  return `<article class="cv press" data-cpn="${id}" role="button" tabindex="0" aria-label="${c.brand}: ${c.off} ${c.sub}. Ver detalle">
    <div class="cv-media"><img src="${c.img}" alt="" loading="lazy"><strong class="cv-off">${c.off}</strong><span class="cv-brand">${c.brand}</span></div>
    <div class="cv-body">
      <small class="cv-sub">${c.off} ${c.sub}</small>
      <span class="cv-go"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="1.5" y="1.5" width="5" height="5" rx="1"/><rect x="9.5" y="1.5" width="5" height="5" rx="1"/><rect x="1.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 9.5h2v2M14.5 9.5v5h-5"/></svg><span class="cv-go-t">${c.mode === 'qr' ? 'Obtener QR' : 'Obtener código'}</span></span>
    </div>
  </article>`;
}
if (cvRow) cvRow.innerHTML = Object.keys(COUPONS).map(cvCard).join('');

// Carrusel: puntos que siguen el deslizamiento
const cvDots = $('#cvDots');
cvDots.innerHTML = Object.keys(COUPONS).map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
cvRow.addEventListener('scroll', () => {
  const cards = $$('.cv', cvRow), w = cards[1].offsetLeft - cards[0].offsetLeft;
  const i = Math.min(cards.length - 1, Math.round(cvRow.scrollLeft / w));
  $$('i', cvDots).forEach((d, n) => d.classList.toggle('on', n === i));
}, { passive: true });
function paintCards() {
  $$('.cv', cvRow).forEach(card => { $('.cv-go-t', card).textContent = CPN[card.dataset.cpn]?.type === 'code' ? 'Obtener código' : 'Ver beneficio'; });
}

// ----- Hoja del cupón: mismo formato del sitio oficial -----
// Tipos: "code" (código especial: copiar, guardar, enviar por correo) · "rut" (solo tu RUT o cédula) · "online" (en el sitio del comercio)
const CPN = {
  hoyts: { type: 'code', off: 'Desde $3.600', sub: 'Entradas 2D: lunes a miércoles $3.600 · jueves a domingo $4.400 (máx. 4 entradas por RUT)', how: 'Presenta este código en boletería o en el tótem, o ingrésalo al comprar en cinemark.cl.', uso: 'Presencial y online', web: 'https://www.cinemark.cl', vig: 'Hasta el 30-09-2026' },
  cinepolisconf: { type: 'code', off: '20% dcto.', sub: 'En combo de confitería', how: 'Para obtener el beneficio sólo debes presentar este código en caja cuando compres en boleterías de Cinépolis.', uso: 'Presencial', web: 'https://cinepolischile.cl/', vig: 'Hasta el 31-12-2026' },
  cinemarkconf: { type: 'code', off: '20% dcto.', sub: 'En combo de confitería', how: 'Presenta este código en la confitería de Cinemark al comprar tu combo.', uso: 'Presencial', web: 'https://www.cinemark.cl', vig: 'Hasta el 31-12-2026' },
  jetsmart: { type: 'code', off: 'Hasta 25% dcto.', sub: 'En vuelos nacionales y hasta 15% en internacionales', how: 'Ingresa este código al pagar en jetsmart.com. Reserva con al menos 14 días de anticipación; no aplica en temporada alta.', uso: 'Online', web: 'https://jetsmart.com/cl/es/', vig: 'Viajes hasta el 21-12-2026' },
  copec: { type: 'code', off: '$15 dcto. por litro', sub: 'En combustible pagando con la app Copec', how: 'Ingresa este código en la sección "Cupones Full" de la app Copec. Tienes 3 días para usarlo.', uso: 'App Copec', web: 'https://ww2.copec.cl', vig: 'Hasta el 30-09-2026' },
  smartfit: { type: 'code', off: 'Matrícula $0', sub: 'Plan Black a $29.900 al mes por 12 meses', how: 'Usa este código al contratar el Plan Black y actívalo en tu sede dentro de 48 horas.', uso: 'Presencial y online', web: 'https://www.smartfit.cl', vig: 'Hasta el 28-12-2026' },
  transvip: { type: 'code', off: '15% dcto.', sub: 'En reservas de traslados, tope $3.000 por viaje', how: 'Ingresa este código al reservar en transvip.cl o en la app.', uso: 'Online', web: 'https://www.transvip.cl', vig: 'Hasta el 31-12-2026' },
  salcobrand: { type: 'rut', off: 'Hasta 45% dcto', sub: 'En medicamentos y artículos de cuidado personal', how: 'Para obtener el beneficio sólo debes ser afiliado Caja Los Andes y presentar tu RUT en caja al momento de la compra, o iniciar sesión o registrarte en salcobrand.cl.', uso: 'Presencial y online', web: 'https://salcobrand.cl/beneficios-caja-los-andes', vig: 'Hasta el 31-12-2026' },
  cruzverde: { type: 'rut', off: '45% dcto.', sub: 'En medicamentos genéricos y 12% en medicamentos de marca', how: 'Para obtener el beneficio sólo debes identificarte como afiliado Caja Los Andes presentando tu cédula de identidad en la farmacia.', uso: 'Presencial', web: 'https://www.cruzverde.cl', vig: 'Hasta el 31-12-2026' },
  chequeo: { type: 'rut', off: 'Hasta 60% dcto.', sub: 'En atención dental general y 15% en exámenes', how: 'Agenda en agenda.redsalud.cl y presenta tu cédula al atenderte. El descuento se aplica al pagar.', uso: 'Presencial', web: 'https://agenda.redsalud.cl', vig: 'Hasta el 31-12-2026' },
  aramco: { type: 'rut', off: '$100 dcto. por litro', sub: 'En combustible los días viernes', how: 'Indica tu RUT de afiliado Caja Los Andes al momento de cargar combustible.', uso: 'Presencial', web: '', vig: 'Desde el 11-09-2026' },
  mediclic: { type: 'online', off: 'Desde copago $0', sub: 'Telemedicina', how: 'En menos de 5 minutos atención en medicina general.', uso: 'Online', web: 'https://www.mediclic.cl', vig: 'Hasta el 31-12-2026' },
  carozzi: { type: 'online', off: 'Desde 20% dcto.', sub: 'En productos publicados en mercadocarozzi.cl', how: 'Crea tu cuenta en mercadocarozzi.cl y elige "Caja Los Andes" como grupo de beneficio: el descuento aparece solo.', uso: 'Online', web: 'https://www.mercadocarozzi.cl', vig: 'Hasta el 31-12-2026' },
  cabanas: { type: 'online', off: 'Temporada baja', sub: 'Centros turísticos de Caja Los Andes', how: 'Reserva con tu RUT eligiendo el centro y la fecha. Válido del 15 de marzo al 19 de diciembre en nuevas reservas.', uso: 'Online', web: 'https://www.cajalosandes.cl/turismo', vig: 'Hasta el 19-12-2026' },
  resto: { type: 'online', off: 'Copago $10.000', sub: 'Programa de inglés para adultos de 3 meses', how: 'Postula con tu RUT. Si quedas seleccionado pagas un copago único por los tres meses.', uso: 'Online', web: 'https://www.cajalosandes.cl', vig: 'Cupos limitados' },
  edv: { type: 'online', off: '2.000 cupos gratis', sub: 'Escuela de Verano Universidad de Chile', how: 'Postula entre el 17 y el 30 de noviembre en edv.uchile.cl con el RUT de tu hijo o hija.', uso: 'Online', web: 'https://www.edv.uchile.cl', vig: 'Postulación 17 al 30-11' },
};
const cpnSaved = new Set();
const cpn = $('#cpn'), cpnBd = $('#cpnBd'), ticket = $('#cpnTicket'), scratch = $('#cpnScratch');
const numCode = () => '9002819' + String(Math.floor(10000 + Math.random() * 89999));
function cpnView(mail) { $('#cpnMainView').hidden = !!mail; $('#cpnMailView').hidden = !mail; }
function paintSave() {
  const on = cpnSaved.has(cpnId), b = $('#cpnSave');
  b.classList.toggle('on', on); $('span', b).textContent = on ? 'Guardado' : 'Guardar cupón';
}
function openCoupon(id, opener) {
  const k = CPN[id], bb = BENEFITS[id]; if (!k || !bb) return;
  cpnId = id; cpnOpener = opener;
  if (!cpnState[id]) cpnState[id] = { code: numCode(), revealed: false };
  $('#cpnBrand').textContent = bb.brand;
  $('#cpnT').textContent = k.off;
  $('#cpnLogo').textContent = bb.brand.charAt(0);
  $('#cpnLogo').style.background = (COUPONS[id] && COUPONS[id].tint) || '#084AFE';
  $('#cpnWhere').textContent = k.how;
  $('#cpnCode').textContent = cpnState[id].code;
  $('span', $('#cpnCopy')).textContent = 'Copiar código'; $('#cpnCopy').classList.remove('on');
  paintSave(); cpnView(false);
  cpn.classList.add('open'); cpnBd.classList.add('open'); cpn.setAttribute('aria-hidden', 'false');
  haptic(8);
  if (cpnState[id].revealed) showRevealed(false); else armScratch();
  setTimeout(() => $('#cpnClose').focus({ preventScroll: true }), 80);
}
function closeCoupon() {
  cpn.classList.remove('open'); cpnBd.classList.remove('open'); cpn.setAttribute('aria-hidden', 'true');
  cpnOpener?.focus?.({ preventScroll: true });
}
// Raspa y gana: la tapa con la "A" de Caja Los Andes esconde el código
let scratched = 0, scratching = false, ctx = null;
const LOGO = new Image(); LOGO.src = 'assets/icons/isotipo-a.svg';
function armScratch() {
  ticket.classList.remove('revealed', 'touched');
  $('#cpnPre').hidden = false; $('#cpnActs').hidden = true;
  scratched = 0;
  requestAnimationFrame(() => {
    const r = ticket.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    scratch.width = Math.max(1, r.width * dpr); scratch.height = Math.max(1, r.height * dpr);
    ctx = scratch.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, '#F4F7FF'); g.addColorStop(1, '#DCE7FF');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    const paintMark = () => {
      if (!ctx || ticket.classList.contains('revealed')) return;
      ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.globalAlpha = .07;
      for (let y = -10; y < r.height; y += 46) for (let x = (y / 46) % 2 ? -20 : 8; x < r.width; x += 56) ctx.drawImage(LOGO, x, y, 40, 39);
      ctx.restore();
    };
    LOGO.complete ? paintMark() : LOGO.addEventListener('load', paintMark, { once: true });
    scratch.style.opacity = 1;
  });
}
function scratchAt(e) {
  if (!ctx) return;
  const r = scratch.getBoundingClientRect();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 26, 0, 7); ctx.fill();
  scratched++;
  if (scratched % 6 === 0) haptic(4);
  if (scratched > 34) reveal();
}
scratch.addEventListener('pointerdown', e => { if (ticket.classList.contains('revealed')) return; scratching = true; scratch.setPointerCapture(e.pointerId); ticket.classList.add('touched'); scratchAt(e); });
scratch.addEventListener('pointermove', e => { if (scratching) scratchAt(e); });
['pointerup', 'pointercancel'].forEach(t => scratch.addEventListener(t, () => { scratching = false; }));
function reveal() {
  if (ticket.classList.contains('revealed')) return;
  scratching = false;
  cpnState[cpnId].revealed = true;
  scratch.style.opacity = 0;
  haptic([10, 40, 16]);
  showRevealed(true);
  confetti($('#cpnCode'));
}
function showRevealed(fresh) {
  ticket.classList.add('revealed');
  ticket.classList.toggle('fresh', fresh);
  scratch.style.opacity = 0;
  $('#cpnPre').hidden = true; $('#cpnActs').hidden = false;
}
$('#cpnMain').addEventListener('click', reveal);
$('#cpnCopy').addEventListener('click', async () => {
  const code = cpnState[cpnId].code;
  try { await navigator.clipboard.writeText(code); } catch (_) {}
  haptic(8); $('#cpnCopy').classList.add('on'); $('span', $('#cpnCopy')).textContent = 'Copiado';
  toast(`Código ${code} copiado`, '✓');
});
$('#cpnSave').addEventListener('click', () => {
  if (cpnSaved.has(cpnId)) cpnSaved.delete(cpnId); else { cpnSaved.add(cpnId); toast('Cupón guardado en tus beneficios', '✓'); }
  haptic(8); paintSave();
});
$('#cpnMail').addEventListener('click', () => {
  haptic(6); cpnView(true);
  $('#cpnMailErr').textContent = '';
  $('#cpnMailIn').value = typeof profile !== 'undefined' ? profile.correo || '' : '';
  setTimeout(() => $('#cpnMailIn').focus(), 60);
});
$('#cpnMailBack').addEventListener('click', () => { haptic(6); cpnView(false); });
$('#cpnMailView').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#cpnMailIn').value.trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { $('#cpnMailErr').textContent = 'Revisa tu correo, por ejemplo nombre@mail.com'; haptic([8, 40, 8]); return; }
  const go = $('#cpnMailGo'); go.disabled = true; go.textContent = 'Enviando…';
  setTimeout(() => { go.disabled = false; go.textContent = 'Enviar'; cpnView(false); toast(`Te enviamos el cupón a ${v}`, '✉️'); }, reduceMotion ? 100 : 900);
});
$('#cpnClose').addEventListener('click', closeCoupon);
cpnBd.addEventListener('click', closeCoupon);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && cpn.classList.contains('open')) closeCoupon(); });

document.addEventListener('click', e => {
  const card = e.target.closest('[data-cpn]');
  if (card) { e.preventDefault(); haptic(8); go('detalle', { id: card.dataset.cpn }); }
});
document.addEventListener('keydown', e => {
  const card = e.target.closest && e.target.closest('[data-cpn]');
  if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go('detalle', { id: card.dataset.cpn }); }
});
paintCards();

// ----- Desde el público: pedir ingreso y caer directo a destapar el QR -----
let session = false, pendingCpn = null, afterLoginCpn = null;
const gate = $('#gate'), gateBd = $('#gateBd');
function openGate(id) {
  const c = COUPONS[id] || BENEFITS[id];
  $('#gateT').textContent = 'Ingresa para obtener tu código';
  $('#gateSub').textContent = `Tu código de ${(BENEFITS[id] || c).brand} es personal. Ingresa con tu RUT y te llevamos directo a él.`;
  gate.classList.add('open'); gateBd.classList.add('open'); gate.setAttribute('aria-hidden', 'false');
  haptic(8);
  setTimeout(() => $('#gateGo').focus({ preventScroll: true }), 80);
}
function closeGate() { gate.classList.remove('open'); gateBd.classList.remove('open'); gate.setAttribute('aria-hidden', 'true'); }
$('#gateGo').addEventListener('click', () => { closeGate(); go('rut'); setTimeout(() => toast('Ingresa y te llevamos directo a tu código', 'i'), 450); });
$('#gateNo').addEventListener('click', () => { pendingCpn = null; closeGate(); });
gateBd.addEventListener('click', () => { pendingCpn = null; closeGate(); });

document.addEventListener('screen:enter', e => {
  const n = e.detail.name;
  if (n === 'onboarding' || n === 'home') session = false;
  if (n !== 'privado') return;
  session = true;
  if (!pendingCpn) return;
  const id = pendingCpn; pendingCpn = null;
  // Vuelve al detalle del beneficio: si cierra el cupón puede seguir informándose
  afterLoginCpn = id;
  setTimeout(() => go('detalle', { id }), reduceMotion ? 50 : 350);
});
document.addEventListener('screen:enter', e => {
  if (e.detail.name !== 'detalle' || !afterLoginCpn) return;
  const id = afterLoginCpn; afterLoginCpn = null;
  setTimeout(() => openCoupon(id, $('#bdCta')), reduceMotion ? 100 : 450);
});
// El botón del detalle se adapta a cada beneficio: código (raspe) o RUT/online (hoja de instrucciones de siempre)
document.addEventListener('screen:before', e => {
  if (e.detail.name !== 'detalle') return;
  const k = CPN[currentId], bb = BENEFITS[currentId], cta = $('#bdCta'), t = $('#bdCta .cta-idle');
  if (!t || !k) return;
  cta.classList.toggle('soldout', !!bb.soldout);
  cta.setAttribute('aria-disabled', String(!!bb.soldout));
  t.lastChild.textContent = bb.soldout ? 'Agotado este mes' : k.type === 'code' ? 'Obtener mi código' : 'Obtener beneficio';
  $('#shPdf').hidden = k.type !== 'rut';
});
document.addEventListener('click', e => {
  const cta = e.target.closest('#bdCta');
  const k = CPN[currentId];
  if (!cta || !k) return;
  if (BENEFITS[currentId].soldout) { e.preventDefault(); e.stopPropagation(); haptic([8, 40, 8]); toast('Los cupones de este mes se agotaron. Vuelve el 1 de octubre', 'i'); return; }
  if (k.type !== 'code') return;                          // abre la hoja "Cómo canjear"
  e.preventDefault(); e.stopPropagation();
  if (!session) { pendingCpn = currentId; openGate(currentId); return; }
  openCoupon(currentId, cta);
}, true);
// Comprobante en PDF para los que se usan solo con RUT (por si falla la conexión en el local)
$('#shPdf').addEventListener('click', () => {
  const k = CPN[currentId], bb = BENEFITS[currentId]; if (!k) return;
  const who = session && typeof profile !== 'undefined' ? `${profile.nombre} ${profile.apellido}` : 'Afiliado Caja Los Andes';
  const rut = session && typeof USERS !== 'undefined' && USERS[demoUser] ? USERS[demoUser].rut : '';
  const wrap = (s, n = 88) => s.match(new RegExp(`.{1,${n}}(\\s|$)`, 'g')).map(x => x.trim());
  const lines = [`Beneficio: ${bb.title}`, `Descuento: ${k.off} ${k.sub}`.slice(0, 95), `Afiliado: ${who}${rut ? ' · RUT ' + rut : ''}`, '', 'Cómo usarlo:', ...wrap(k.how), '', `Uso: ${k.uso}`, `Vigencia: ${k.vig}`];
  const url = makePdf('Comprobante de beneficio', lines, 'BEN-' + numCode().slice(-8));
  const a = document.createElement('a'); a.href = url; a.download = `comprobante-${currentId}.pdf`; document.body.appendChild(a); a.click(); a.remove();
  haptic(8); toast('Comprobante descargado. Muéstralo junto a tu RUT', '⤓');
});
