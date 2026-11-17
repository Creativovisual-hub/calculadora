// =====================================================================
// Sesión privada: Face ID simulado, Home privado, Mi Perfil y mapa ampliado
// Depende de go(), back(), haptic(), EASE, reduceMotion (app.js),
// y de toast(), mountMap(), PINS, BENEFITS, $, $$ (benefits.js)
// =====================================================================

// ---------- Perfil (se guarda en este navegador) ----------
// Banderas dibujadas (se ven igual en cualquier teléfono). Cada persona elige la suya.
const star = (x, y, r, c = '#fff') => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .4 : r; d += (i ? 'L' : 'M') + (x + Math.cos(a) * rr).toFixed(2) + ' ' + (y + Math.sin(a) * rr).toFixed(2); } return `<path d="${d}Z" fill="${c}"/>`; };
const flagSvg = body => `<svg viewBox="0 0 30 20" aria-hidden="true">${body}</svg>`;
const FLAGS = [
  { id: 'cl', label: 'Chile', svg: flagSvg(`<rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#D52B1E"/><rect width="10" height="10" fill="#0039A6"/>${star(5, 5.2, 2.6)}`) },
  { id: 've', label: 'Venezuela', svg: flagSvg(`<rect width="30" height="6.7" fill="#FFCC00"/><rect y="6.6" width="30" height="6.8" fill="#00247D"/><rect y="13.3" width="30" height="6.7" fill="#CF142B"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = Math.PI * (1.15 + i * .1); return star(15 + Math.cos(a) * 4.6, 12.4 + Math.sin(a) * 4.6, .8); }).join('')}`) },
  { id: 'pe', label: 'Perú', svg: flagSvg('<rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#D91023"/><rect x="20" width="10" height="20" fill="#D91023"/>') },
  { id: 'co', label: 'Colombia', svg: flagSvg('<rect width="30" height="10" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/>') },
  { id: 'ar', label: 'Argentina', svg: flagSvg('<rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.66" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#F6B40E"/>') },
  { id: 'bo', label: 'Bolivia', svg: flagSvg('<rect width="30" height="6.7" fill="#D52B1E"/><rect y="6.6" width="30" height="6.8" fill="#F9E300"/><rect y="13.3" width="30" height="6.7" fill="#007934"/>') },
  { id: 'ht', label: 'Haití', svg: flagSvg('<rect width="30" height="10" fill="#00209F"/><rect y="10" width="30" height="10" fill="#D21034"/><rect x="11" y="6.5" width="8" height="7" fill="#fff"/>') },
  { id: 'ec', label: 'Ecuador', svg: flagSvg('<rect width="30" height="10" fill="#FFD100"/><rect y="10" width="30" height="5" fill="#0072CE"/><rect y="15" width="30" height="5" fill="#EF3340"/><circle cx="15" cy="10" r="2" fill="#6b4a2a"/>') },
];
const flagOf = () => FLAGS.find(f => f.id === profile.flag) || FLAGS[0];
const AVATARS = [
  { id: 'iniciales', label: 'Mis iniciales' },
  { id: 'montana', label: 'Montaña', emoji: '🏔️' },
  { id: 'bandera', label: 'Mi bandera', flag: true },
  { id: 'empanada', label: 'Empanada', emoji: '🥟' },
  { id: 'condor', label: 'Cóndor', emoji: '🦅' },
  { id: 'sol', label: 'Sol', emoji: '☀️' },
  { id: 'araucaria', label: 'Árbol nativo', emoji: '🌲' },
  { id: 'arbol', label: 'Árbol', emoji: '🌳' },
];
// Perfiles de demostración: María (con licencia) y Pedro (con crédito preaprobado)
const PROFILES = {
  maria: { nombre: 'María', apellido: 'Valdés', correo: 'maria.valdes@correo.cl', telefono: '+56 9 8765 4321', comuna: 'Providencia', avatar: 'montana', flag: 'cl' },
  pedro: { nombre: 'Pedro', apellido: 'Rodríguez', correo: 'pedro.rodriguez@correo.cl', telefono: '+56 9 7654 3210', comuna: 'Maipú', avatar: 'condor', flag: 'cl' },
  javiera: { nombre: 'Javiera', apellido: 'Muñoz', correo: 'javiera.munoz@correo.cl', telefono: '+56 9 6543 2109', comuna: 'Ñuñoa', avatar: 'sol', flag: 'cl' },
  tomas: { nombre: 'Tomás', apellido: 'Herrera', correo: 'tomas.herrera@correo.cl', telefono: '+56 9 5432 1098', comuna: 'La Florida', avatar: 'iniciales', flag: 'cl' },
};
let demoUser = 'maria';
try { demoUser = PROFILES[localStorage.getItem('cla-demo-user')] ? localStorage.getItem('cla-demo-user') : 'maria'; } catch (_) {}
const profKey = u => (u === 'maria' ? 'cla-perfil' : 'cla-perfil-' + u);
const DEFAULT_PROFILE = PROFILES[demoUser];
let profile = { ...DEFAULT_PROFILE };
try { Object.assign(profile, JSON.parse(localStorage.getItem(profKey(demoUser)) || '{}')); } catch (_) {}
if (profile.avatar === 'vino') profile.avatar = 'sol';
function saveProfile() { try { localStorage.setItem(profKey(demoUser), JSON.stringify(profile)); } catch (_) {} }

function initials() { return ((profile.nombre[0] || '') + (profile.apellido[0] || '')).toUpperCase() || 'CL'; }
function avatarHTML(id = profile.avatar) {
  const a = AVATARS.find(x => x.id === id) || AVATARS[0];
  if (a.flag) return `<span class="av-flag">${flagOf().svg}</span>`;
  if (a.emoji) return `<span class="av-emoji">${a.emoji}</span>`;
  return initials();
}
function paintProfile() {
  $$('[data-first-name]').forEach(el => { el.textContent = profile.nombre || 'María'; });
  $$('[data-full-name]').forEach(el => { el.textContent = `${profile.nombre} ${profile.apellido}`.trim(); });
  $$('[data-avatar]').forEach(el => {
    el.innerHTML = avatarHTML();
    el.classList.toggle('is-emoji', profile.avatar !== 'iniciales');
  });
  $$('.hello').forEach(el => { el.textContent = `¡Hola ${profile.nombre || 'María'}!`; });
}
paintProfile();

// Selector de avatar
const emojiWrap = $('#pfEmojis');
emojiWrap.innerHTML = AVATARS.map(a => `<button type="button" class="pf-emo" role="radio" data-av="${a.id}" aria-label="${a.label}" aria-checked="false">
  <span class="pf-emo-in">${a.flag ? `<span class="av-flag" data-myflag>${flagOf().svg}</span>` : a.emoji ? a.emoji : `<b data-initials>${initials()}</b>`}</span><small>${a.label.replace('Mis iniciales', 'Iniciales').replace('Mi bandera', 'Bandera')}</small></button>`).join('');
// Elegir bandera (aparece al tocar "Bandera")
const flagWrap = $('#pfFlags');
flagWrap.innerHTML = `<p class="pf-flags-t" id="pfFlagsT">Elige tu bandera</p><div class="pf-flags-row" role="radiogroup" aria-labelledby="pfFlagsT">${FLAGS.map(f => `<button type="button" class="pf-flag" role="radio" data-flag="${f.id}" aria-checked="false" aria-label="${f.label}"><span class="av-flag">${f.svg}</span><small>${f.label}</small></button>`).join('')}</div>`;
flagWrap.addEventListener('click', e => {
  const b = e.target.closest('[data-flag]'); if (!b) return;
  profile.flag = b.dataset.flag; profile.avatar = 'bandera'; saveProfile();
  syncEmojis(); paintProfile(); haptic(8);
});
function syncEmojis() {
  $$('.pf-emo', emojiWrap).forEach(b => {
    const on = b.dataset.av === profile.avatar;
    b.classList.toggle('on', on); b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1;
  });
  $$('[data-initials]', emojiWrap).forEach(el => { el.textContent = initials(); });
  $$('[data-myflag]', emojiWrap).forEach(el => { el.innerHTML = flagOf().svg; });
  flagWrap.hidden = profile.avatar !== 'bandera';
  $$('.pf-flag', flagWrap).forEach(b => b.setAttribute('aria-checked', String(b.dataset.flag === profile.flag)));
}
syncEmojis();
emojiWrap.addEventListener('click', e => {
  const b = e.target.closest('.pf-emo');
  if (!b) return;
  profile.avatar = b.dataset.av; saveProfile();
  syncEmojis(); paintProfile(); haptic(8);
  const av = $('.pf-avatar');
  av.classList.remove('bump'); void av.offsetWidth; av.classList.add('bump');
});
emojiWrap.addEventListener('keydown', e => {
  const btns = $$('.pf-emo', emojiWrap), i = btns.indexOf(document.activeElement);
  if (i < 0) return;
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (step) { e.preventDefault(); const n = btns[(i + step + btns.length) % btns.length]; n.focus(); n.click(); }
});

// Formulario de datos personales
const pfForm = $('#pfForm');
function fillForm() { ['nombre', 'apellido', 'correo', 'telefono', 'comuna'].forEach(k => { pfForm.elements[k].value = profile[k] || ''; }); $('#pfError').textContent = ''; }
function lockForm(locked) {
  pfForm.classList.toggle('locked', locked);
  $$('input', pfForm).forEach(i => { i.readOnly = locked; i.tabIndex = locked ? -1 : 0; });
  $('#pfUnlock').hidden = !locked;
  $('#pfEditActs').hidden = locked;
  $('#pfLockNote').hidden = !locked;
}
$('#pfUnlock').addEventListener('click', () => {
  haptic(8);
  verifyFaceId('Confirma que eres tú para editar tus datos', () => {
    lockForm(false);
    toast('Identidad verificada. Ya puedes editar', '✓');
    setTimeout(() => pfForm.elements.nombre.focus(), 120);
  });
});
$('#pfCancel').addEventListener('click', () => { fillForm(); lockForm(true); haptic(6); });
pfForm.addEventListener('submit', e => {
  e.preventDefault();
  const f = pfForm.elements, err = $('#pfError');
  $$('.pf-field', pfForm).forEach(l => l.classList.remove('invalid'));
  const bad = [];
  if (!f.nombre.value.trim()) bad.push(f.nombre);
  if (!f.apellido.value.trim()) bad.push(f.apellido);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.correo.value.trim())) bad.push(f.correo);
  if (bad.length) {
    bad.forEach(i => i.closest('.pf-field').classList.add('invalid'));
    err.textContent = bad.includes(f.correo) && bad.length === 1 ? 'Revisa tu correo electrónico.' : 'Completa los campos marcados.';
    bad[0].focus(); haptic([8, 40, 8]);
    return;
  }
  ['nombre', 'apellido', 'correo', 'telefono', 'comuna'].forEach(k => { profile[k] = f[k].value.trim(); });
  saveProfile(); paintProfile(); syncEmojis(); lockForm(true);
  err.textContent = '';
  haptic(12);
  toast('Perfil actualizado', '✓');
});
document.addEventListener('screen:before', e => { if (e.detail.name === 'perfil') { fillForm(); syncEmojis(); lockForm(true); } });

// ---------- Face ID inmersivo (sin cámara) ----------
// Imita el panel de Face ID de iOS: la pantalla se desenfoca, aparece el glifo,
// "escanea", se transforma en un check y entra al Home privado.
const hud = $('#fidHud');
let fidBusy = false;
function startFaceId() { verifyFaceId('Verificando con Face ID', () => go('privado'), 'password'); }
function verifyFaceId(live, done, screenName = current) {
  if (fidBusy) return;
  fidBusy = true;
  const t = reduceMotion ? 0.35 : 1;
  const scr = screenEl(screenName);
  hud.dataset.state = 'scan';
  hud.classList.add('open'); hud.setAttribute('aria-hidden', 'false');
  scr.classList.add('fid-behind');
  $('#fhLabel').textContent = 'Face ID';
  $('#fhLive').textContent = live;
  haptic(8);
  setTimeout(() => {
    hud.dataset.state = 'ok';
    $('#fhLive').textContent = 'Identidad verificada';
    haptic([12, 40, 18]);
  }, 1500 * t);
  setTimeout(() => {
    hud.classList.remove('open'); hud.setAttribute('aria-hidden', 'true');
    scr.classList.remove('fid-behind');
    hud.dataset.state = 'idle';
    fidBusy = false;
    done();
  }, 2300 * t);
}
// Al llegar a la pantalla de contraseña se ofrece Face ID automáticamente (como en iOS)
document.addEventListener('screen:enter', e => {
  if (e.detail.name === 'password' && !e.detail.back) setTimeout(() => { if (current === 'password') startFaceId(); }, 650);
});

// ---------- Home privado ----------
$('#phBell').addEventListener('click', () => { haptic(); toast('Tienes 3 notificaciones nuevas', '🔔'); });
// Banner destacado (carrusel con puntos)
dotCarousel($('#pvTrack'), $('#pvDots'), 5000);
// La tarjeta de licencia es un enlace: también responde a Enter / Espacio
$('#pvLic').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go('mislic'); } });

// Crédito preaprobado: elegir plazo y solicitar
const plans = $$('.pvc-plans button');
plans.forEach(b => b.addEventListener('click', () => {
  haptic(6);
  plans.forEach(o => { o.classList.toggle('on', o === b); o.setAttribute('aria-checked', o === b); });
}));
$('#pvcCta').addEventListener('click', e => {
  const b = e.currentTarget;
  if (b.classList.contains('loading') || b.classList.contains('paid')) return;
  const plan = $('.pvc-plans button.on');
  haptic(8);
  b.classList.add('loading'); b.setAttribute('aria-busy', 'true');
  setTimeout(() => {
    b.classList.remove('loading'); b.classList.add('paid'); b.removeAttribute('aria-busy');
    haptic([12, 60, 18]);
    toast(`¡Listo! $4.500.000 en ${plan.dataset.plan} cuotas llegarán a tu cuenta`, '✓');
  }, reduceMotion ? 200 : 1400);
});

// ---------- Interna licencia ----------
// Tono: la persona está con licencia (enferma). Textos calmos, sin celebraciones.

// Almacenamiento local de cuentas y documentos (demo: solo en este teléfono)
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} },
};
const DEFAULT_ACCOUNTS = [{ id: 'sb1', bank: 'Scotiabank', type: 'Cuenta de ahorro', number: '987654321' }];
let accounts = store.get('cla-cuentas-v2', DEFAULT_ACCOUNTS);
let licAccount = accounts[0]?.id ?? null;               // parte con la cuenta principal ya seleccionada; se puede cambiar
const mask = n => `•••• ${String(n).slice(-4)}`;

// ----- Cuenta bancaria -----
const bankCard = $('#lmBankCard');
let draftAcc = null;                                   // cuenta marcada, aún sin confirmar
function renderAccounts() {
  // En la licencia se muestra una sola cuenta: la elegida o la principal
  const shown = accounts.filter(a => a.id === (draftAcc ?? licAccount));
  $('#lmAccs').innerHTML = (shown.length ? shown : accounts.slice(0, 1)).map(a => `<button type="button" class="lm-acc" role="radio" aria-checked="${(draftAcc ?? licAccount) === a.id}" data-acc="${a.id}">
    <span class="lm-acc-radio" aria-hidden="true"></span>
    <span class="lm-acc-txt"><b>${a.bank}</b><small>${a.type} · N° ${mask(a.number)}</small></span>
  </button>`).join('');
  $('#pfAccList').innerHTML = accounts.map(a => `<li><span class="pf-li-ico" aria-hidden="true">🏦</span><div><b>${a.bank}</b><small>${a.type} · N° ${mask(a.number)}</small></div>${licAccount === a.id ? '<span class="pf-li-chip">Para tu licencia</span>' : ''}</li>`).join('');
}
function showAccount() {
  const a = accounts.find(x => x.id === licAccount);
  if (!a) { bankCard.dataset.state = 'choose'; return; }
  $('#lmBankShowName').innerHTML = bankMark(a.bank) + a.bank;
  $('#lmBankShowType').textContent = a.type;
  $('#lmBankShowNum').textContent = `N° ${a.number}`;
  // Titular: el afiliado del perfil activo
  const rut = typeof USERS !== 'undefined' && USERS[demoUser] ? USERS[demoUser].rut : '12.345.678-9';
  $('#lmBankOwner').textContent = `Titular: ${profile.nombre} ${profile.apellido} · RUT ${rut}`;
  bankCard.dataset.state = 'saved';
}
function pickAccount(id, msg = 'Cuenta seleccionada para recibir el pago') {
  draftAcc = null;
  licAccount = id; store.set('cla-lic-cuenta', id);     // se guarda al confirmar
  renderAccounts(); showAccount(); syncConfirm(); lmSync();
  haptic(10);
  toast(msg, '✓');
}
function syncConfirm() {
  const sel = draftAcc ?? licAccount;
  $('#lmBankOk').disabled = !sel;
  $('#lmBankBack').hidden = !licAccount;
}
// Marcar una cuenta no la guarda: se confirma con el botón
$('#lmAccs').addEventListener('click', e => {
  const b = e.target.closest('[data-acc]'); if (!b) return;
  draftAcc = b.dataset.acc; haptic(6);
  $$('.lm-acc', $('#lmAccs')).forEach(x => x.setAttribute('aria-checked', String(x === b)));
  syncConfirm();
});
$('#lmBankOk').addEventListener('click', () => { const id = draftAcc ?? licAccount; if (id) pickAccount(id); });
$('#lmBankBack').addEventListener('click', () => { haptic(6); draftAcc = null; renderAccounts(); showAccount(); });
// Cambiar: abre de inmediato el formulario para registrar una sola cuenta nueva
$('#lmBankChange').addEventListener('click', () => {
  haptic(6); draftAcc = null; bankCard.dataset.state = 'adding';
  $('#lmBankErr').textContent = '';
  setTimeout(() => $('#lmBankNameBtn')?.focus(), 60);
});
$('#lmAddAcc').addEventListener('click', () => {
  haptic(6); bankCard.dataset.state = 'adding';
  $('#lmBankErr').textContent = '';
  setTimeout(() => $('#lmBankNameBtn')?.focus(), 60);
});
$('#lmBankCancel').addEventListener('click', () => { bankCard.dataset.state = licAccount ? 'saved' : 'choose'; });
$('#lmBankNum').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
$('#lmBankForm').addEventListener('submit', e => {
  e.preventDefault();
  const bank = $('#lmBankName').value, type = $('#lmBankType').value, number = $('#lmBankNum').value.trim();
  const err = !bank ? 'Elige tu banco.' : !type ? 'Elige el tipo de cuenta.' : number.length < 6 ? 'Revisa el número de cuenta: debe tener al menos 6 dígitos.' : '';
  $('#lmBankErr').textContent = err;
  if (err) { haptic([8, 40, 8]); return; }
  const id = 'acc' + Date.now();
  accounts = [{ id, bank, type, number }];                  // una sola cuenta: la nueva reemplaza a la anterior
  store.set('cla-cuentas-v2', accounts);                    // también queda en tu perfil
  e.target.reset();
  pickAccount(id, 'Cuenta actualizada. Te pagaremos en esta cuenta');
});

// ----- Selectores con el estilo de la app: hoja inferior con opciones -----
const pk = document.createElement('div');
pk.className = 'pk-wrap';
pk.innerHTML = '<div class="pk-bd" data-pk-close></div><div class="pk-sheet" role="dialog" aria-modal="true" aria-labelledby="pkT"><i class="pk-grab" aria-hidden="true"></i><h3 id="pkT"></h3><ul class="pk-list" role="listbox" aria-labelledby="pkT"></ul></div>';
app.appendChild(pk);
let pkSel = null;
// Logo de cada banco (íconos oficiales de sus sitios, en assets/bancos)
const BANK_LOGO = {
  'Tapp': 'tapp', 'BancoEstado': 'bancoestado', 'Banco de Chile': 'bancochile', 'Santander': 'santander', 'BCI': 'bci',
  'Scotiabank': 'scotiabank', 'Itaú': 'itau', 'Banco Falabella': 'falabella', 'Banco Ripley': 'ripley',
  'Coopeuch': 'coopeuch', 'Mercado Pago': 'mercadopago', 'Tenpo': 'tenpo',
};
const bankMark = name => BANK_LOGO[name] ? `<img class="pk-mark" src="assets/bancos/${BANK_LOGO[name]}.png" alt="" width="28" height="28">` : '';
function pkLabel(sel) { const o = sel.selectedOptions[0]; return sel.value ? o.textContent : (o ? o.textContent : 'Selecciona'); }
function pkPaint(sel) {
  const b = sel.nextElementSibling, s = b.querySelector('span');
  s.innerHTML = (sel.id === 'lmBankName' ? bankMark(sel.value) : '') + pkLabel(sel);
  b.classList.toggle('empty', !sel.value);
}
function pkOpen(sel) {
  pkSel = sel; haptic(6);
  $('#pkT').textContent = sel.closest('label').querySelector('span').textContent;
  $('.pk-list', pk).innerHTML = [...sel.options].filter(o => o.value).map(o => `<li><button type="button" role="option" aria-selected="${o.value === sel.value}" data-v="${o.value}"><span>${sel.id === 'lmBankName' ? bankMark(o.value) : ''}${o.textContent}</span><i aria-hidden="true"></i></button></li>`).join('');
  pk.classList.add('open'); document.body.classList.add('sheet-open');
  setTimeout(() => $('.pk-list [aria-selected="true"]', pk)?.scrollIntoView({ block: 'nearest' }), 80);
}
function pkClose() {
  pk.classList.remove('open'); document.body.classList.remove('sheet-open');
  const b = pkSel && pkSel.nextElementSibling; pkSel = null; b?.focus({ preventScroll: true });
}
pk.addEventListener('click', e => {
  if (e.target.closest('[data-pk-close]')) { pkClose(); return; }
  const o = e.target.closest('[data-v]'); if (!o || !pkSel) return;
  pkSel.value = o.dataset.v; pkSel.dispatchEvent(new Event('change', { bubbles: true })); pkPaint(pkSel);
  haptic(8); setTimeout(pkClose, 120);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && pk.classList.contains('open')) pkClose(); });
$$('#lmBankForm select').forEach(sel => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'pk-btn'; b.id = sel.id + 'Btn';
  b.setAttribute('aria-haspopup', 'dialog');
  b.innerHTML = '<span></span><svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  sel.after(b); sel.classList.add('pk-native'); sel.tabIndex = -1;
  sel.closest('label').setAttribute('for', b.id);
  b.addEventListener('click', e => { e.preventDefault(); pkOpen(sel); });
  pkPaint(sel);
});
$('#lmBankForm').addEventListener('reset', () => setTimeout(() => $$('#lmBankForm select').forEach(pkPaint)));

// ----- Documentos (6 obligatorios) -----
// Liquidaciones: revisión de 30 s cada una (el afiliado solo ve la cuenta regresiva)
// AFP: el primer intento no se puede leer y se vuelve a subir · Contrato e informe: al instante
const UP_RULES = {
  'liq-feb': { wait: 30, label: 'Liquidación febrero 2025' },
  'liq-mar': { wait: 30, label: 'Liquidación marzo 2025' },
  'liq-abr': { wait: 30, label: 'Liquidación abril 2025' },
  contrato: { wait: 0, label: 'Contrato de trabajo' },
  afp: { wait: 3, fail: 1, label: 'Certificado de cotizaciones AFP', msg: 'No se alcanza a leer el RUT del empleador. Cuando puedas, descarga otra vez el certificado desde tu AFP y súbelo aquí.' },
  informe: { wait: 0, label: 'Informe médico complementario' },
};
const TOTAL = Object.keys(UP_RULES).length;
const lm = { ok: new Map(), tries: {}, timers: {}, sent: false };
const fmtSize = b => b >= 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;

function lmSync() {
  const pend = TOTAL - lm.ok.size;
  $('#lmPend').textContent = pend ? `${pend} pendiente${pend > 1 ? 's' : ''}` : 'Completo';
  $('#lmPend').classList.toggle('done', !pend);
  $('#lmOk').textContent = `${lm.ok.size} de ${TOTAL} listos`;
  $('.lm-ok').classList.toggle('all', lm.ok.size >= TOTAL);   // gris hasta completar los 6, verde al final
  $('#lmSend').disabled = lm.sent || !!pend || !$('#lmOath').checked || !licAccount;
}

// Procesa el archivo elegido (desde la cámara o desde el teléfono) para un documento
function handleUpload(id, file) {
  if (!file) return;
  const unit = document.querySelector(`.lm-up[data-up="${id}"]`), rule = UP_RULES[id];
  if (file.size > 10 * 1024 * 1024) { toast(`"${file.name}" pesa más de 10 MB. Prueba con una foto o un PDF más liviano`, 'i'); return; }
  const size = fmtSize(file.size);
  clearInterval(lm.timers[id]);
  lm.ok.delete(id); lmSync();
  lm.tries[id] = (lm.tries[id] || 0) + 1;
  haptic(8);
  const msgEl = $('.lm-up-msg', unit);
  const accept = () => {
    lm.ok.set(id, { label: rule.label, file: file.name, size, bytes: file.size, type: file.type, url: URL.createObjectURL(file) });
    const done = $('.lm-done-file', unit);
    if (done) done.textContent = `Cargado · ${size}`;
    if (msgEl) msgEl.textContent = `${file.name} · ${size}`;
    unit.dataset.state = 'ok';
    haptic(10);
    lmSync(); autoFold();
  };
  if (!rule.wait) { accept(); return; }
  unit.dataset.state = 'checking';
  const fileEl = $('.lm-file', unit); if (fileEl) fileEl.textContent = file.name;
  let left = rule.wait;
  const paint = () => {
    unit.style.setProperty('--p', String(100 - (left / rule.wait) * 100));
    $$('.lm-secs', unit).forEach(el => { el.textContent = left; });
    $$('.lm-secs-txt', unit).forEach(el => { el.textContent = `${left} s`; });
    if (msgEl) msgEl.textContent = `Revisando · ${left} s`;
  };
  paint();
  lm.timers[id] = setInterval(() => {
    left -= 1; paint();
    if (left > 0) return;
    clearInterval(lm.timers[id]);
    if (lm.tries[id] <= (rule.fail || 0)) {
      const em = $('.lm-err-msg', unit); if (em) em.textContent = rule.msg;
      if (msgEl) msgEl.textContent = 'No se pudo leer, vuelve a subirla';
      unit.dataset.state = 'error';
      haptic([20, 50, 20]);
    } else accept();
  }, 1000);
}
$$('[data-up-input]').forEach(inp => inp.addEventListener('change', () => { handleUpload(inp.dataset.upInput, inp.files[0]); inp.value = ''; }));

// ----- Elegir cómo subir: Tomar foto o Subir archivo -----
const pick = $('#pick'), pickBd = $('#pickBd'), camIn = $('#camIn');
let pickTarget = null, pickOpener = null, bypassPick = false;
function openPick(id, opener) {
  pickTarget = id; pickOpener = opener;
  $('#pickT').textContent = `Subir ${UP_RULES[id].label.charAt(0).toLowerCase() + UP_RULES[id].label.slice(1)}`;
  $('#pickSub').textContent = 'Elige cómo quieres agregarlo. Sirve PDF o una foto donde se lea bien.';
  pick.classList.add('open'); pickBd.classList.add('open'); pick.setAttribute('aria-hidden', 'false');
  haptic(6);
  setTimeout(() => $('#pickCam').focus({ preventScroll: true }), 60);
}
function closePick(restore = true) {
  pick.classList.remove('open'); pickBd.classList.remove('open'); pick.setAttribute('aria-hidden', 'true');
  if (restore && pickOpener) pickOpener.focus?.({ preventScroll: true });
}
// Cualquier botón de subir (Subir, zona punteada, Volver a subir) abre primero las opciones
document.addEventListener('click', e => {
  if (bypassPick) return;
  const trig = e.target.closest('label[for^="lmIn-"], [data-up-input]');
  if (!trig) return;
  e.preventDefault(); e.stopPropagation();
  const id = trig.dataset.upInput || trig.getAttribute('for').slice(5);
  if (UP_RULES[id]) openPick(id, trig.closest('label') || trig);
}, true);
$('#pickFile').addEventListener('click', () => {
  const inp = document.getElementById('lmIn-' + pickTarget);
  closePick(false);
  bypassPick = true; inp.click(); bypassPick = false;
});
$('#pickCam').addEventListener('click', () => {
  closePick(false);
  bypassPick = true; camIn.click(); bypassPick = false;
});
camIn.addEventListener('change', () => { handleUpload(pickTarget, camIn.files[0]); camIn.value = ''; });
$('#pickCancel').addEventListener('click', () => closePick());
pickBd.addEventListener('click', () => closePick());
document.addEventListener('keydown', e => { if (e.key === 'Escape' && pick.classList.contains('open')) closePick(); });

// ----- Tarjetas de documentos plegables -----
$$('#lmDocs .lm-doc').forEach((card, i) => {
  const full = card.querySelector('.lm-doc-full') || card;
  const h3 = full.querySelector('h3'), top = full.querySelector('.lm-doc-top');
  const body = document.createElement('div');
  body.className = 'lm-doc-body'; body.id = 'lmBody' + i;
  [...full.children].filter(el => el !== top && el !== h3).forEach(el => body.appendChild(el));
  full.appendChild(body);
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'lm-fold';
  btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-controls', body.id);
  btn.setAttribute('aria-label', `Mostrar u ocultar ${h3.textContent}`);
  btn.innerHTML = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1.5 5 5 5-5"/></svg>';
  top.appendChild(btn);
  const toggle = () => { const f = !card.classList.contains('folded'); setFold(card, f); haptic(4); };
  btn.addEventListener('click', toggle);
  h3.addEventListener('click', toggle);
});
function setFold(card, folded) {
  card.classList.toggle('folded', folded);
  card.querySelectorAll('.lm-fold').forEach(b => b.setAttribute('aria-expanded', String(!folded)));
}
// Liquidaciones completas: mismo formato compacto que los demás documentos recibidos, con desplegable
(() => {
  const g = $('.lm-group'), body = $('.lm-doc-body', g);
  const row = document.createElement('div');
  row.className = 'lm-done lm-group-done';
  row.innerHTML = `<span class="lm-got-ico" aria-hidden="true"><svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m1.5 5.5 3.5 3.5 7.5-7.5"/></svg></span>
    <div><b>Tus últimas 3 liquidaciones</b><small class="lm-done-file lm-group-file"></small></div>
    <span class="lm-got-chip">Cargado</span>
    <button type="button" class="lm-fold" aria-expanded="true" aria-controls="${body.id}" aria-label="Ver u ocultar las liquidaciones"><svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1.5 5 5 5-5"/></svg></button>`;
  g.insertBefore(row, g.firstChild);
  row.addEventListener('click', () => { setFold(g, !g.classList.contains('folded')); haptic(4); });
})();
// Las liquidaciones se pliegan solas cuando las 3 quedan listas
function autoFold() {
  const g = $('.lm-group');
  const all = $$('.lm-slot', g).every(sl => sl.dataset.state === 'ok');
  g.classList.toggle('complete', all);
  if (all) {
    const bytes = ['liq-feb', 'liq-mar', 'liq-abr'].reduce((s, k) => s + (lm.ok.get(k)?.bytes || 0), 0);
    $('.lm-group-file', g).textContent = `3 archivos · ${fmtSize(bytes)}`;
  }
  if (all && !g.dataset.autofolded) { g.dataset.autofolded = '1'; setFold(g, true); }
  if (!all) g.dataset.autofolded = '';
}
$('#lmOath').addEventListener('change', () => { haptic(6); lmSync(); });

// ----- Documentos de esta licencia (quedan asociados al trámite, no a la persona) -----
function renderSentDocs(docs, date) {
  sentDocs = docs;
  $('#lmSentList').innerHTML = docs.map((d, i) => `<li><span class="pf-li-ico" aria-hidden="true">📄</span><div><b>${d.label}</b><small><em class="lm-sent-ok">✓ Enviado</em> · ${d.size}</small></div><span class="lm-doc-acts"><button type="button" class="lm-doc-act" data-view="${i}" aria-label="Ver ${d.label}"><svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 7s3-5.5 8-5.5S17 7 17 7s-3 5.5-8 5.5S1 7 1 7Z"/><circle cx="9" cy="7" r="2.4"/></svg></button><a class="lm-doc-act" href="${d.url}" download="${d.file}" aria-label="Descargar ${d.label}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5v9M4.5 7 8 10.5 11.5 7M2 14.5h12"/></svg></a></span></li>`).join('');
  $('#lmSentMeta').textContent = `Documentos de esta licencia · ${docs.length} enviados el ${date}`;
}

// Visor de documentos enviados
let sentDocs = [];
const docv = $('#docv'), docvBd = $('#docvBd');
function openDoc(i) { showDoc(sentDocs[i]); }
function showDoc(d) {
  if (!d) return;
  $('#docvT').textContent = d.label;
  $('#docvMeta').textContent = `${d.file} · ${d.size}`;
  const isImg = (d.type || '').startsWith('image/');
  $('#docvView').innerHTML = isImg ? `<img src="${d.url}" alt="${d.label}">` : `<iframe src="${d.url}" title="${d.label}"></iframe>`;
  const dl = $('#docvDl'); dl.href = d.url; dl.download = d.file;
  docv.classList.add('open'); docvBd.classList.add('open'); docv.setAttribute('aria-hidden', 'false');
  haptic(6);
}
function closeDoc() { docv.classList.remove('open'); docvBd.classList.remove('open'); docv.setAttribute('aria-hidden', 'true'); }
$('#lmSentList').addEventListener('click', e => {
  const b = e.target.closest('[data-view]');
  if (b) openDoc(+b.dataset.view);
  else if (e.target.closest('a[download]')) toast('Descargando documento', '↓');
});
$('#docvClose').addEventListener('click', closeDoc);
docvBd.addEventListener('click', closeDoc);
$('#docvDl').addEventListener('click', () => toast('Descargando documento', '↓'));

// ----- Documentos subidos: previsualizar o borrar antes de enviar -----
const ICO_EYE = '<svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 7s3-5.5 8-5.5S17 7 17 7s-3 5.5-8 5.5S1 7 1 7Z"/><circle cx="9" cy="7" r="2.4"/></svg>';
const ICO_DEL = '<svg width="15" height="16" viewBox="0 0 22 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5h18M8 5.5V3.2c0-.9.7-1.7 1.7-1.7h2.6c1 0 1.7.8 1.7 1.7v2.3M4.5 5.5l1 14.8c.1 1.2 1 2.2 2.2 2.2h6.6c1.2 0 2.1-1 2.2-2.2l1-14.8"/></svg>';
$$('#lmDocs .lm-up').forEach(unit => {
  const id = unit.dataset.up, acts = document.createElement('span');
  acts.className = 'lm-file-acts';
  acts.innerHTML = `<button type="button" class="lm-doc-act" data-prev="${id}" aria-label="Ver ${UP_RULES[id].label}">${ICO_EYE}</button><button type="button" class="lm-doc-act del" data-del="${id}" aria-label="Borrar ${UP_RULES[id].label}">${ICO_DEL}</button>`;
  const msg = $('.lm-up-msg', unit); if (msg) msg.dataset.idle = msg.textContent;
  const host = $('.lm-done', unit);
  if (host) { $('.lm-got-chip', host)?.remove(); host.appendChild(acts); }
  else unit.insertBefore(acts, $('.lm-slot-btn', unit));
});
let delTarget = null;
const delSheet = $('#delSheet'), delBd = $('#delBd');
function closeDel() { delSheet.classList.remove('open'); delBd.classList.remove('open'); delSheet.setAttribute('aria-hidden', 'true'); }
$('#lmDocs').addEventListener('click', e => {
  const p = e.target.closest('[data-prev]'), d = e.target.closest('[data-del]');
  if (p) { e.stopPropagation(); showDoc(lm.ok.get(p.dataset.prev)); return; }
  if (d) {
    e.stopPropagation();
    delTarget = d.dataset.del;
    $('#delT').textContent = `¿Borrar ${UP_RULES[delTarget].label.charAt(0).toLowerCase() + UP_RULES[delTarget].label.slice(1)}?`;
    delSheet.classList.add('open'); delBd.classList.add('open'); delSheet.setAttribute('aria-hidden', 'false');
    haptic(8); setTimeout(() => $('#delNo').focus({ preventScroll: true }), 80);
  }
});
$('#delNo').addEventListener('click', closeDel);
delBd.addEventListener('click', closeDel);
$('#delOk').addEventListener('click', () => {
  const id = delTarget, unit = $(`#lmDocs [data-up="${id}"]`);
  const f = lm.ok.get(id); if (f?.url) URL.revokeObjectURL(f.url);
  lm.ok.delete(id);
  unit.dataset.state = 'pending';
  const msg = $('.lm-up-msg', unit); if (msg) msg.textContent = msg.dataset.idle;
  const g = unit.closest('.lm-group'); if (g) setFold(g, false);
  closeDel(); lmSync(); autoFold();
  haptic([8, 30, 8]); toast('Documento borrado. Puedes subirlo de nuevo', 'i');
});

// ----- Enviar -----
$('#lmSend').addEventListener('click', e => {
  const b = e.currentTarget;
  if (b.disabled) return;
  haptic(8);
  b.classList.add('loading'); b.setAttribute('aria-busy', 'true');
  setTimeout(() => {
    b.classList.remove('loading'); b.classList.add('paid'); b.removeAttribute('aria-busy');
    lm.sent = true; lmSync();
    // Se guardan en "Mis documentos" y la lista deja paso a un resumen
    const date = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
    const saved = [...lm.ok.values()];
    renderSentDocs(saved, date);
    $('#lmDocs').hidden = true;
    $('.lm-oath').hidden = true;
    $('#lmSent').hidden = false;
    // El trámite avanza
    const steps = $$('#lmSteps li');
    steps[2].className = 'done'; steps[2].removeAttribute('aria-current'); $('i', steps[2]).textContent = ''; $('small', steps[2]).textContent = `Documentos validados · ${date}`;
    steps[3].className = 'now'; steps[3].setAttribute('aria-current', 'step'); $('small', steps[3]).textContent = 'En proceso · fecha probable 31-07-2026';
    $('#lmAlert').classList.add('ok');
    $('#lmAlert').innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#084AFE"/><path d="m4.5 8.2 2.3 2.3 4.7-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><div><b>Ya falta poco para tu pago.</b><p>Tus documentos están validados y tu licencia pasó a pago. Tú preocúpate de descansar; te avisaremos apenas el dinero esté en tu cuenta.</p></div>';
    $('#lmState').textContent = 'PAGO EN PROCESO';
    $('#pvLicChip').textContent = 'EN PAGO'; $('#pvLicChip').classList.add('rev');
    // En el inicio privado la licencia también avanza a "Pago"
    const hs = $$('#pvLic .stepper li');
    hs[2].className = 'done'; hs[2].removeAttribute('aria-current');
    hs[3].className = 'now'; hs[3].setAttribute('aria-current', 'step');
    $('#pvLicNote').classList.add('ok');
    $('#pvLicNote').innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#084AFE"/><path d="m4.5 8.2 2.3 2.3 4.7-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Ya falta poco para tu pago</span>';
    $('#pvLic .stepper').setAttribute('aria-label', 'Estado de la licencia: en pago'); $('#pvLic .stepper').classList.add('paying');
    $('#pvLic').setAttribute('aria-label', 'Licencia médica en etapa de pago. Ver mis licencias');
    $('#pvLicLink').innerHTML = 'Ver detalle <svg width="12" height="10" aria-hidden="true"><use href="#arrow-r"/></svg>';
    $('.lm-actions').classList.add('sent');
    $('#lmLater').textContent = 'Volver a mis licencias';
    toast('Documentos validados. Tu licencia pasó a pago', '✓');
    $('#lmSent').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }, reduceMotion ? 200 : 1500);
});
$('#lmLater').addEventListener('click', () => {
  haptic(6);
  if (lm.sent) { back(); return; }
  toast('Guardamos tu avance. Retómalo cuando te sientas mejor', 'i');
  setTimeout(back, 400);
});

renderAccounts(); showAccount(); lmSync();
document.addEventListener('screen:before', e => { if (e.detail.name === 'perfil') renderAccounts(); });


// Sombra de la barra superior fija al hacer scroll (Home invitado y privado)
window.addEventListener('scroll', () => {
  $$('.screen.is-active .ph-header, .screen.is-active .header').forEach(h => h.classList.toggle('scrolled', scrollY > 8));
}, { passive: true });

// ---------- Mapa a pantalla completa ----------
const mapFull = $('#mapFull');
const mfRoot = $('.mf-near', mapFull);
const fullMap = mountMap(mfRoot, { full: true });
// Lista "Locales en esta zona": se actualiza mientras te mueves por el mapa
function renderList(visible) {
  const list = $('#mfList');
  const items = (visible && visible.length ? visible : PINS.filter(p => p.range <= fullMap.range)).slice().sort((a, b) => a.km - b.km);
  list.innerHTML = items.map(p => `<li><div class="mf-item">
    <button class="mf-pick" data-pick="${p.key}" aria-label="Ver ${p.place} en el mapa">
      <span class="mc-logo" style="--c:${p.color}">${p.name[0]}</span>
      <span class="mf-txt"><strong>${p.place}</strong><small>${p.addr} • A ${p.dist}</small></span>
      <span class="mc-off">${p.pct}<small>DCTO</small></span>
    </button>
    <button class="mf-route" data-route="${p.key}" aria-label="Cómo llegar a ${p.place}"><svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M13 1 1 6.2l5.1 1.7L7.8 13Z" fill="currentColor"/></svg></button>
  </div></li>`).join('') || '<li class="mf-empty">Mueve el mapa para descubrir beneficios en otras zonas.</li>';
}
mfRoot.addEventListener('map:moved', e => {
  renderList(e.detail.visible);
  $('#mfTitle .near-zone').textContent = e.detail.zone;
});
$('#mfList').addEventListener('click', e => {
  const b = e.target.closest('[data-pick]');
  if (!b) return;
  haptic(6);
  fullMap.select(b.dataset.pick, true, true);
  $('.mf-map').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
});
function filterList() { renderList(null); }

let mapOrigin = null, mapOpener = null, mapScreen = null;
function openMapFull(fromMap, opener) {
  if (typeof HOMES_ONLY !== 'undefined' && HOMES_ONLY) return;
  mapOpener = opener;
  const r = fromMap.getBoundingClientRect(), app = $('#app').getBoundingClientRect();
  mapOrigin = { top: r.top, left: r.left - app.left, right: app.right - r.right, bottom: innerHeight - r.bottom };
  mapFull.classList.toggle('is-dark', PUBLIC_SCREENS.has(current) && document.documentElement.classList.contains('theme-dark') && !document.documentElement.classList.contains('in-private'));
  mapFull.classList.add('open'); mapFull.setAttribute('aria-hidden', 'false');
  mapFull.scrollTop = 0;
  document.body.classList.add('lock');
  mapScreen = screenEl(current); mapScreen.inert = true;
  // El mapa ya es visible: centrar en tu ubicación, dejar caer los pines y llenar la lista
  fullMap.sync(); fullMap.centerOn(ME.x, ME.y, false); fullMap.drop(); filterList();
  haptic(8);
  if (!reduceMotion) {
    // Se expande desde el mapa pequeño hasta ocupar la pantalla
    mapFull.animate([
      { clipPath: `inset(${mapOrigin.top}px ${mapOrigin.right}px ${mapOrigin.bottom}px ${mapOrigin.left}px round 18px)` },
      { clipPath: 'inset(0 0 0 0 round 0px)' },
    ], { duration: 520, easing: EASE });
    $$('.mf-top, .seg, .mf-list-title, .mf-list', mapFull).forEach((el, i) =>
      el.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 180 + i * 50, easing: EASE, fill: 'backwards' }));
  }
  setTimeout(() => $('#mfClose').focus({ preventScroll: true }), 60);
}
async function closeMapFull() {
  if (!mapFull.classList.contains('open')) return;
  if (!reduceMotion && mapOrigin) {
    await mapFull.animate([
      { clipPath: 'inset(0 0 0 0 round 0px)' },
      { clipPath: `inset(${mapOrigin.top}px ${mapOrigin.right}px ${mapOrigin.bottom}px ${mapOrigin.left}px round 18px)` },
    ], { duration: 420, easing: EASE }).finished.catch(() => {});
  }
  mapFull.classList.remove('open'); mapFull.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  if (mapScreen) mapScreen.inert = false;
  if (mapOpener && document.contains(mapOpener) && mapOpener.offsetParent) mapOpener.focus({ preventScroll: true });
}
document.addEventListener('click', e => {
  const exp = e.target.closest('.map-expand');
  if (exp) { e.preventDefault(); e.stopPropagation(); openMapFull(exp.closest('.map'), exp); return; }
  // "Ir" dentro del mapa completo: cierra el mapa y abre el detalle
  if (e.target.closest('#mapFull [data-open]')) closeMapFull();
}, true);
document.addEventListener('map:open', e => openMapFull(e.target, e.target));
$('#mfClose').addEventListener('click', closeMapFull);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mapFull.classList.contains('open')) closeMapFull(); });

// Barra del inicio público: "Sucursales" por ahora no abre nada
