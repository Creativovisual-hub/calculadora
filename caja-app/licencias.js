// ---------- Licencias médicas: consulta pública → ingreso → Mis licencias · Ingresar licencia · Certificados ----------

// ================= Sitio público: Licencias Médicas =================
const lpRut = $('#lpRut'), lpForm = $('#lpForm');
lpRut.addEventListener('input', () => { lpRut.value = formatRut(lpRut.value); $('#lpErr').textContent = ''; lpRut.classList.remove('bad'); });
lpForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validRut(lpRut.value)) {
    $('#lpErr').textContent = 'Revisa tu RUT: debe tener el formato 12.345.678-9.';
    lpRut.classList.add('bad'); lpRut.focus(); haptic([8, 40, 8]);
    return;
  }
  const btn = $('#lpGo');
  btn.classList.add('loading'); btn.setAttribute('aria-busy', 'true'); haptic(8);
  setTimeout(() => {
    btn.classList.remove('loading'); btn.removeAttribute('aria-busy');
    const res = $('#lpResult');
    res.hidden = false;
    res.animate?.([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: reduceMotion ? 1 : 380, easing: 'cubic-bezier(.32,.72,0,1)' });
    res.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    haptic(10);
  }, reduceMotion ? 150 : 900);
});

// Pestañas: Qué es · Requisitos · Tipos · Plazos · Pago · En papel (con flechas del teclado)
const lpTabs = $$('.lp-tabs [role=tab]');
function selectTab(t, focus) {
  lpTabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; });
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
  if (focus) t.focus();
  haptic(4);
}
lpTabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', e => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (d) { e.preventDefault(); selectTab(lpTabs[(i + d + lpTabs.length) % lpTabs.length], true); }
  });
});
$('.lp-hero-link').addEventListener('click', e => { e.preventDefault(); $('#lpInfoT').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); });

// Después de ingresar (RUT + Face ID) se entra directo a donde venías
let afterLoginGo = null;
function loginThen(to, msg) {
  afterLoginGo = to;
  haptic(8);
  go('rut');
  setTimeout(() => {
    const r = $('#rut'); if (r && lpRut.value) { r.value = lpRut.value; r.dispatchEvent(new Event('input')); }
    toast(msg, 'i');
  }, 380);
}
$('#lpLogin').addEventListener('click', () => loginThen('mislic', 'Ingresa y te llevamos a tus licencias'));
document.addEventListener('screen:enter', e => {
  if (e.detail.name !== 'privado' || !afterLoginGo) return;
  const to = afterLoginGo; afterLoginGo = null;
  setTimeout(() => go(to), reduceMotion ? 50 : 350);
});

// ================= Mis licencias: búsqueda, filtros y paginador =================
const LIC_TYPES = ['Enfermedad común', 'Enfermedad común', 'Accidente común', 'Medicina preventiva', 'Enfermedad común', 'Enfermedad grave de hijo'];
const MY_LICS = [
  { id: '849201-K', type: 'Enfermedad común', from: '2026-07-10', days: 21, state: 'pend' },
  { id: '771203-3', type: 'Enfermedad común', from: '2026-03-03', days: 7, state: 'paid', note: 'Pagada el 28-03-2026 en tu cuenta' },
];
// Historial de 24 meses (datos de demostración)
(() => {
  const states = ['paid', 'paid', 'closed', 'paid', 'rej', 'paid', 'paid', 'closed', 'paid', 'paid', 'paid', 'rej', 'paid', 'paid'];
  let d = new Date(2026, 1, 12);
  states.forEach((st, i) => {
    d = new Date(d.getTime() - (24 + (i * 11) % 30) * 86400000);
    const days = st === 'closed' ? 3 : [5, 7, 4, 10, 14, 6, 8][i % 7];
    const id = `${(702118 - i * 3917).toString().slice(0, 6)}-${'K0123456789'[i % 11]}`;
    const pay = new Date(d.getTime() + (days + 18) * 86400000);
    const fd = x => x.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    MY_LICS.push({ id, type: LIC_TYPES[i % LIC_TYPES.length], from: d.toISOString().slice(0, 10), days, state: st,
      note: st === 'paid' ? `Pagada el ${fd(pay)} en tu cuenta` : st === 'rej' ? 'La COMPIN rechazó el reposo · puedes apelar' : 'Sin pago: licencia de 3 días o menos' });
  });
})();
const ML_STATE = { pend: ['Documentación pendiente', 'pend'], emp: ['Con tu empleador', 'emp'], pay: ['En pago', 'pay'], paid: ['Pagada', 'paid'], rej: ['Rechazada', 'rej'], closed: ['Cerrada', 'closed'] };
const PER_PAGE = 10;
const mlF = { q: '', from: '', to: '', st: 'all', page: 1 };
const toCL = iso => iso.split('-').reverse().join('-');
const endOf = l => { const d = new Date(l.from + 'T12:00'); d.setDate(d.getDate() + l.days - 1); return d.toISOString().slice(0, 10); };
function currentLics() {
  // Pedro no tiene licencias en curso: solo su historial ya cerrado
  if (typeof demoUser !== 'undefined' && demoUser === 'tomas') return [];
  if (typeof demoUser !== 'undefined' && demoUser === 'pedro') return MY_LICS.filter(x => x.state === 'paid' || x.state === 'closed').slice(4, 8);
  const sent = typeof lm !== 'undefined' && lm.sent;
  // Solo las 4 más recientes: la pendiente, dos pagadas y una rechazada
  const mine = [MY_LICS[0], MY_LICS[1], MY_LICS.find(x => x.state === 'closed'), MY_LICS.find(x => x.state === 'rej')];
  return mine.map(l => (l.state === 'pend' && sent ? { ...l, state: 'pay', note: 'Documentos validados · fecha probable de pago 31-07-2026' } : l));
}
function renderMyLics() {
  const all = currentLics();
  const needs = all.filter(l => l.state === 'pend').length;
  const lead = $('#mlLead');
  lead.classList.toggle('ok', !needs);
  lead.innerHTML = !all.length ? '<b>Aún no tienes licencias registradas</b><span>Cuando ingreses una, podrás seguir cada etapa aquí.</span>' : needs ? `<b>Tienes ${needs} licencia que necesita tu atención</b><span>Sube los documentos pendientes para que podamos pagarte.</span><button type="button" data-go="licencia">Subir documentos</button>` : '<b>Todas tus licencias están al día</b><span>Te avisaremos cada avance.</span>';
  const q = mlF.q.replace(/[^0-9kK]/g, '').toUpperCase();
  const list = all.filter(l => (!q || l.id.replace(/[^0-9K]/g, '').includes(q)) && (mlF.st === 'all' || l.state === mlF.st)
    && (!mlF.from || l.from >= mlF.from) && (!mlF.to || l.from <= mlF.to));
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  mlF.page = Math.min(mlF.page, pages);
  const start = (mlF.page - 1) * PER_PAGE, slice = list.slice(start, start + PER_PAGE);
  $('#mlCount').textContent = list.length ? `Mostrando ${start + 1}–${start + slice.length} de ${list.length} licencias` : '';
  $('#mlList').innerHTML = slice.length ? slice.map(l => {
    const [label, cls] = ML_STATE[l.state];
    const open = l.state === 'pend' || l.state === 'pay';
    return `<li><button type="button" ${open ? 'data-go="licencia"' : `data-toast="${l.note || label}"`} class="ml-item ${cls}" aria-label="Licencia ${l.id}, ${label}">
      <span class="ml-ico" aria-hidden="true"><svg width="22" height="20" viewBox="0 0 26 24" fill="none"><path d="M13 22s-11-6.4-11-13.3A5.7 5.7 0 0 1 13 5.6a5.7 5.7 0 0 1 11 3.1C24 15.6 13 22 13 22Z" stroke="#084AFE" stroke-width="1.8"/><circle cx="13" cy="11.5" r="5" fill="#06C2FA"/><path d="M13 9.2v4.6M10.7 11.5h4.6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg></span>
      <span class="ml-txt"><span class="ml-state ${cls}">${label}</span><b>N° ${l.id}</b><small>${l.type} · ${l.days} días</small><small>${toCL(l.from)} al ${toCL(endOf(l))}</small>
        ${l.state === 'pend' ? '<em class="ml-cta">Subir documentos ›</em>' : l.note ? `<em class="ml-note">${l.note}</em>` : ''}</span>
    </button></li>`;
  }).join('') : `<li class="ml-empty">${all.length ? 'No encontramos licencias con estos filtros.' : 'No hay licencias para mostrar.'}</li>`;
  // Paginador
  const pager = $('#mlPager');
  pager.hidden = pages < 2;
  pager.innerHTML = pages < 2 ? '' : `<button type="button" data-p="${mlF.page - 1}" ${mlF.page === 1 ? 'disabled' : ''} aria-label="Página anterior">‹</button>`
    + Array.from({ length: pages }, (_, i) => `<button type="button" data-p="${i + 1}" ${i + 1 === mlF.page ? 'aria-current="page" class="on"' : ''} aria-label="Página ${i + 1}">${i + 1}</button>`).join('')
    + `<button type="button" data-p="${mlF.page + 1}" ${mlF.page === pages ? 'disabled' : ''} aria-label="Página siguiente">›</button>`;
  const n = (mlF.st !== 'all') + !!mlF.from + !!mlF.to;
  const c = $('#mlFilterCount'); c.hidden = !n; c.textContent = n;
  $('#mlFilterBtn').classList.toggle('on', !!n);
}
$('#mlQ').addEventListener('input', e => { mlF.q = e.target.value; mlF.page = 1; renderMyLics(); });
$('#mlFilterBtn').addEventListener('click', () => {
  const p = $('#mlFilters'), open = p.hidden;
  p.hidden = !open; $('#mlFilterBtn').setAttribute('aria-expanded', String(open)); haptic(6);
});
$('#mlFrom').addEventListener('change', e => { mlF.from = e.target.value; mlF.page = 1; renderMyLics(); });
$('#mlTo').addEventListener('change', e => { mlF.to = e.target.value; mlF.page = 1; renderMyLics(); });
$('#mlStates').addEventListener('click', e => {
  const b = e.target.closest('[data-v]'); if (!b) return;
  mlF.st = b.dataset.v; mlF.page = 1; haptic(4);
  $$('#mlStates [data-v]').forEach(x => x.setAttribute('aria-checked', String(x === b)));
  renderMyLics();
});
$('#mlClear').addEventListener('click', () => {
  Object.assign(mlF, { from: '', to: '', st: 'all', page: 1 }); $('#mlFrom').value = ''; $('#mlTo').value = '';
  $$('#mlStates [data-v]').forEach(x => x.setAttribute('aria-checked', String(x.dataset.v === 'all'))); haptic(6); renderMyLics();
});
$('#mlPager').addEventListener('click', e => {
  const b = e.target.closest('[data-p]'); if (!b || b.disabled) return;
  mlF.page = +b.dataset.p; haptic(4); renderMyLics();
  $('#mlCount').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});
renderMyLics();
document.addEventListener('screen:before', e => { if (e.detail.name === 'mislic') renderMyLics(); });
document.addEventListener('screen:enter', e => { if (e.detail.name === 'mislic') renderMyLics(); });

// Desde el detalle de la licencia, "Volver" siempre lleva a Mis licencias
document.addEventListener('screen:enter', e => {
  if (e.detail.name !== 'licencia' || e.detail.back) return;
  if (stack[stack.length - 2] !== 'mislic') stack.splice(stack.length - 1, 0, 'mislic');
});

// ================= Ingresar licencia (papel): asistente en 4 pasos =================
const il = { step: 1, kind: null, photo: null };
function ilPaint() {
  $$('.il-pane').forEach(p => { p.hidden = +p.dataset.il !== il.step; });
  $('#ilDone').hidden = true; $('#ilActions').hidden = false; $('#ilStep').hidden = false;
  $('#ilStep').textContent = `PASO ${il.step} DE 4`;
  $('#ilBar').style.width = `${il.step * 25}%`;
  $('#ilBack').hidden = il.step === 1;
  const ok = il.step === 1 ? il.kind === 'papel' : il.step === 2 ? !!il.photo : il.step === 3 ? true : $('#ilOath').checked;
  $('#ilNext').disabled = !ok;
  $('#ilNext').textContent = il.step === 4 ? 'Enviar licencia' : 'Continuar';
  $('#ilActions').hidden = il.step === 1 && il.kind === 'elec';
}
$$('.il-opt').forEach(b => b.addEventListener('click', () => {
  il.kind = b.dataset.kind; haptic(6);
  $$('.il-opt').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  $('#ilElec').hidden = il.kind !== 'elec';
  ilPaint();
  if (il.kind === 'papel') setTimeout(() => { il.step = 2; ilPaint(); window.scrollTo(0, 0); }, reduceMotion ? 0 : 260);
}));
$('#ilPhoto').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  il.photo = f;
  const img = $('#ilPreview'); img.src = URL.createObjectURL(f); img.hidden = false;
  $('#ilFrame').classList.add('has');
  haptic(10); toast('Foto lista. Revisa que se lea bien', '✓');
  ilPaint();
});
function ilValidate() {
  const num = $('#ilNum').value.trim(), date = $('#ilDate').value, days = +$('#ilDays').value, type = $('#ilType').value;
  const err = num.replace(/\D/g, '').length < 6 ? 'Revisa el N° de licencia.' : !date ? 'Indica la fecha de inicio del reposo.' : !(days > 0 && days < 366) ? 'Indica los días de reposo.' : !type ? 'Elige el tipo de licencia.' : '';
  $('#ilErr').textContent = err;
  if (err) haptic([8, 40, 8]);
  return !err;
}
$('#ilNum').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9-]/g, ''); });
$('#ilDays').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
$('#ilOath').addEventListener('change', () => { haptic(6); ilPaint(); });
$('#ilBack').addEventListener('click', () => { if (il.step > 1) { il.step--; haptic(6); ilPaint(); window.scrollTo(0, 0); } });
$('#ilNext').addEventListener('click', () => {
  if ($('#ilNext').disabled) return;
  if (il.step === 3 && !ilValidate()) return;
  if (il.step === 3) {
    $('#ilSum').innerHTML = `<img src="${$('#ilPreview').src}" alt="Tu licencia">
      <dl><div><dt>N° de licencia</dt><dd>${$('#ilNum').value}</dd></div><div><dt>Inicio</dt><dd>${toCL($('#ilDate').value)}</dd></div>
      <div><dt>Días</dt><dd>${$('#ilDays').value}</dd></div><div><dt>Tipo</dt><dd>${$('#ilType').value}</dd></div><div><dt>Empleador</dt><dd>${$('#ilEmp').value.split(' · ')[0]}</dd></div></dl>`;
  }
  if (il.step < 4) { il.step++; haptic(8); ilPaint(); window.scrollTo(0, 0); return; }
  // Enviar
  const btn = $('#ilNext'); btn.disabled = true; btn.textContent = 'Enviando…'; haptic(8);
  setTimeout(() => {
    const id = $('#ilNum').value.trim();
    MY_LICS.unshift({ id, type: $('#ilType').value.split(' · ')[1], from: $('#ilDate').value, days: +$('#ilDays').value, state: 'emp', note: 'Esperando que tu empleador complete la zona C' });
    $$('.il-pane').forEach(p => { p.hidden = true; });
    $('#ilActions').hidden = true; $('#ilStep').hidden = true; $('#ilBar').style.width = '100%';
    $('#ilDoneTxt').textContent = `Tu licencia N° ${id} quedó ingresada. ${$('#ilEmp').value.split(' · ')[0]} recibirá un correo para completar su parte. Tú preocúpate de descansar.`;
    $('#ilDone').hidden = false;
    haptic([12, 50, 18]);
    window.scrollTo(0, 0);
  }, reduceMotion ? 200 : 1300);
});
function toMyLics() { if (stack[stack.length - 2] === 'mislic') back(); else go('mislic'); }
$('#ilSeeList').addEventListener('click', toMyLics);
$('#ilElecList').addEventListener('click', toMyLics);
function ilReset() {
  Object.assign(il, { step: 1, kind: null, photo: null });
  $$('.il-opt').forEach(x => x.setAttribute('aria-pressed', 'false'));
  $('#ilElec').hidden = true; $('#ilPreview').hidden = true; $('#ilFrame').classList.remove('has'); $('#ilTips').classList.remove('ok');
  ['ilNum', 'ilDate', 'ilDays'].forEach(k => { $('#' + k).value = ''; }); $('#ilType').value = ''; $('#ilOath').checked = false; $('#ilErr').textContent = '';
  ilPaint();
}
document.addEventListener('screen:before', e => { if (e.detail.name === 'inglic' && !e.detail.back) ilReset(); });
ilPaint();

// ================= Certificados =================
const CERTS = {
  afil: { t: 'Certificado de afiliación', d: 'Acredita que eres afiliada a Caja Los Andes, con tu empleador y fecha de afiliación.', period: false,
    body: ['Certificamos que María Valdés, RUT 12.345.678-9,', 'es afiliada a Caja Los Andes desde el 01-03-2018,', 'a través de su empleador Constructora Andes SpA.'] },
  lic: { t: 'Certificado de licencias pagadas', d: 'Detalle de las licencias médicas pagadas en el período que elijas.', period: true,
    body: ['Licencias médicas pagadas a María Valdés, RUT 12.345.678-9.', 'N° 771203-3 · 7 días · pagada el 28-03-2026.', 'Total pagado en el período según registros de Caja Los Andes.'] },
  deuda: { t: 'Certificado de deuda de crédito', d: 'Saldo de tu crédito social, cuotas pagadas y pendientes.', period: false,
    body: ['Crédito social N° 5522-104 a nombre de María Valdés.', 'Cuotas pagadas: 12 de 48 · Saldo a la fecha según registros.', 'Documento válido para trámites financieros.'] },
  asig: { t: 'Certificado de asignación familiar', d: 'Tus cargas familiares reconocidas y el monto mensual.', period: true,
    body: ['Asignación familiar de María Valdés, RUT 12.345.678-9.', 'Cargas reconocidas: 2 (hijos).', 'Tramo y monto vigentes según resolución.'] },
  ahorro: { t: 'Certificado de cuenta de ahorro', d: 'Saldo y movimientos de tu cuenta de ahorro.', period: true,
    body: ['Cuenta de ahorro de María Valdés, RUT 12.345.678-9.', 'Saldo y movimientos del período seleccionado.', 'Emitido por Caja Los Andes.'] },
  renta: { t: 'Certificado de pagos para impuestos', d: 'Resumen anual de pagos para tu declaración de renta.', period: true,
    body: ['Resumen anual de pagos a María Valdés, RUT 12.345.678-9,', 'para su declaración anual de impuestos.', 'Montos informados según registros de Caja Los Andes.'] },
};
const certSheet = $('#certSheet'), certBd = $('#certBd');
let certKey = null, certOpener = null, certUrl = null;
const recent = [];
function certCode() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 8; i++) s += A[Math.floor(Math.random() * A.length)]; return `CLA-${s.slice(0, 4)}-${s.slice(4)}`; }
// PDF simple y válido (texto con Helvetica), para descargar de verdad
function makePdf(title, lines, code) {
  const esc = s => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const today = new Date().toLocaleDateString('es-CL');
  const rows = [['F2', 20, title], ['F1', 11, `Emitido el ${today} · Caja Los Andes`], ['F1', 11, ''], ...lines.map(l => ['F1', 12, l]), ['F1', 11, ''], ['F2', 11, `Código de verificación: ${code}`], ['F1', 9, 'Verifica este documento en cajalosandes.cl con el código indicado. Documento de demostración.']];
  let y = 770, content = '0.03 0.29 1 rg 0 800 612 42 re f 1 1 1 rg BT /F2 16 Tf 40 815 Td (Caja Los Andes) Tj ET 0.07 0.07 0.32 rg ';
  rows.forEach(([f, s, t]) => { content += `BT /${f} ${s} Tf 40 ${y} Td (${esc(t)}) Tj ET `; y -= s + 12; });
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];
  let pdf = '%PDF-1.4\n', offs = [];
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(pdf.length); for (let i = 0; i < pdf.length; i++) { const c = pdf.charCodeAt(i); bytes[i] = c < 256 ? c : 63; }
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
}
function openCert(k, opener) {
  const c = CERTS[k]; certKey = k; certOpener = opener;
  $('#csT').textContent = c.t.replace('Certificado de ', '').replace(/^./, m => m.toUpperCase());
  $('#csIco').innerHTML = $(`[data-cert="${k}"] .ct-ico`).innerHTML;
  $('#csDesc').textContent = c.d;
  $('#csPeriodWrap').hidden = !c.period;
  $('#csForm').hidden = false; $('#csResult').hidden = true;
  $('#csGen').disabled = false; $('#csGen').textContent = 'Generar certificado';
  certSheet.classList.add('open'); certBd.classList.add('open'); certSheet.setAttribute('aria-hidden', 'false');
  haptic(8); setTimeout(() => $('#csGen').focus({ preventScroll: true }), 80);
}
function closeCert() { certSheet.classList.remove('open'); certBd.classList.remove('open'); certSheet.setAttribute('aria-hidden', 'true'); certOpener?.focus?.({ preventScroll: true }); }
$('#csGen').addEventListener('click', () => {
  const c = CERTS[certKey], code = certCode(), period = c.period ? ` ${$('#csPeriod').value}` : '';
  const btn = $('#csGen'); btn.disabled = true; btn.textContent = 'Generando…'; haptic(8);
  setTimeout(() => {
    if (certUrl) URL.revokeObjectURL(certUrl);
    const who = `${profile.nombre} ${profile.apellido}`, rutNow = (typeof USERS !== 'undefined' && USERS[demoUser]?.rut) || '12.345.678-9';
    const body = c.body.map(s => { let t = s.replace('María Valdés', who).replace('12.345.678-9', rutNow); if (demoUser === 'pedro') t = t.replace('es afiliada', 'es afiliado').replace('01-03-2018', '15-08-2016'); return t; });
    certUrl = makePdf(c.t + period, body, code);
    $('#csDocT').textContent = c.t + period;
    $('#csDocDate').textContent = new Date().toLocaleDateString('es-CL');
    $('#csCode').textContent = code;
    const file = `${c.t.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[̀-ͯ]/g, '')}${period.trim() ? '-' + period.trim() : ''}.pdf`;
    const dl = $('#csDl'); dl.href = certUrl; dl.download = file;
    $('#csReady').textContent = $('#csMail').checked ? 'Tu certificado está listo y también lo enviamos a tu correo.' : 'Tu certificado está listo.';
    $('#csForm').hidden = true; $('#csResult').hidden = false;
    $('#csResult').classList.remove('play'); void $('#csResult').offsetWidth; $('#csResult').classList.add('play');
    haptic([10, 40, 16]);
    recent.unshift({ t: c.t + period, code, url: certUrl, file, when: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) });
    paintRecent();
  }, reduceMotion ? 200 : 1100);
});
$('#csDl').addEventListener('click', () => toast('Descargando certificado', '↓'));
$('#csShare').addEventListener('click', async () => {
  const code = $('#csCode').textContent;
  try {
    const blob = await fetch(certUrl).then(r => r.blob());
    const file = new File([blob], $('#csDl').download, { type: 'application/pdf' });
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: $('#csDocT').textContent }); return; }
  } catch (_) {}
  try { await navigator.clipboard.writeText(code); } catch (_) {}
  toast(`Código ${code} copiado`, '✓');
});
$('#csDone').addEventListener('click', closeCert);
$('#csClose').addEventListener('click', closeCert);
certBd.addEventListener('click', closeCert);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && certSheet.classList.contains('open')) closeCert(); });
document.addEventListener('click', e => { const b = e.target.closest('[data-cert]'); if (b) openCert(b.dataset.cert, b); });
function paintRecent() {
  $('#ctRecent').innerHTML = recent.length ? recent.slice(0, 5).map(r => `<li><span class="pf-li-ico" aria-hidden="true">📄</span><div><b>${r.t}</b><small>Hoy ${r.when} · ${r.code}</small></div><a class="lm-doc-act" href="${r.url}" download="${r.file}" aria-label="Descargar ${r.t}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5v9M4.5 7 8 10.5 11.5 7M2 14.5h12"/></svg></a></li>`).join('')
    : '<li class="ct-empty">Aún no generas certificados. Elige uno arriba y queda listo en segundos.</li>';
}
paintRecent();

// ================= Inicio público: "Te acompañamos en cada etapa" → Beneficios de esa etapa =================
document.addEventListener('click', e => {
  const c = e.target.closest('[data-etapa]'); if (!c) return;
  e.preventDefault(); haptic(8);
  const cat = c.dataset.etapa;
  go('beneficios');
  setTimeout(() => { const chip = $(`#bnCats [data-cat="${cat}"]`); if (chip && !chip.classList.contains('on')) chip.click(); }, 480);
});

// ================= Menú privado: mismo diseño que el público, con la información de la afiliada =================
const PRIV_CATS = [
  { name: 'Licencias Médicas', sub: '1 licencia con documentos pendientes', chip: ['1 pendiente', 'yellow'], icon: 'heart',
    items: [
      { t: 'Mis licencias', s: 'Historial y estado de cada licencia', go: 'mislic', hot: true },
      { t: 'Certificados', s: 'Licencias pagadas y más, en PDF', go: 'certs' },
    ] },
  { name: 'Créditos', sub: 'Crédito preaprobado por $4.500.000', chip: ['Simulador', 'green'], icon: 'coin',
    items: [
      { t: 'Simular mi crédito', s: 'Tasa preferencial 0,98% mensual', toast: 'Abriendo simulador de crédito' },
      { t: 'Mi crédito vigente', s: 'Cuota 12 de 48 · $126.500 al mes', toast: 'Tu próxima cuota vence el 05-10-2026' },
      { t: 'Certificado de deuda', s: 'Saldo y cuotas pagadas', go: 'certs' },
    ] },
  { name: 'Seguros', sub: '1 seguro activo', icon: 'shield',
    items: [
      { t: 'Seguro de vida', s: 'Activo · cubre a tus 2 cargas', toast: 'Tu seguro de vida está vigente' },
      { t: 'Cotizar seguro de salud', s: 'Complementa tu plan FONASA', toast: 'Abriendo cotizador de seguros' },
    ] },
  { name: 'Beneficios y Convenios', sub: 'Elegidos según tus gustos', chip: ['TOP', 'top'], icon: 'gift',
    items: [
      { t: 'Beneficios para ti', s: 'Tu mejor match y recomendados', go: 'parati', hot: true },
      { t: 'Tus beneficios de hoy', s: 'Cine, farmacia, vuelos y más', go: 'privado' },
      { t: 'Catálogo completo', s: 'Más de 500 convenios', go: 'beneficios' },
    ] },
  { name: 'Ahorro e Inversión', sub: 'Saldo $1.250.000', icon: 'piggy',
    items: [
      { t: 'Mi cuenta de ahorro', s: 'Saldo disponible $1.250.000', toast: 'Tu cuenta de ahorro: $1.250.000 disponibles' },
      { t: 'Ahorro para la vivienda', s: 'Meta: pie de tu casa', toast: 'Pronto podrás ver tu meta de ahorro' },
      { t: 'Certificado de ahorro', s: 'Saldo y movimientos', go: 'certs' },
    ] },
  { name: 'Turismo y Recreación', sub: 'Tarifas exclusivas para afiliados', icon: 'sun',
    items: [
      { t: 'Centros vacacionales', s: 'Cabañas desde $32.900 la noche', toast: 'Pronto podrás ver la disponibilidad de los centros vacacionales' },
      { t: 'Mis reservas', s: 'No tienes reservas activas', toast: 'Aún no tienes reservas' },
    ] },
  { name: 'Asignación familiar', sub: '2 cargas reconocidas', icon: 'user',
    items: [
      { t: 'Mis cargas', s: '2 hijos reconocidos', toast: 'Tienes 2 cargas familiares reconocidas' },
      { t: 'Certificado de asignación familiar', s: 'Tramo y monto vigentes', go: 'certs' },
    ] },
];
(() => {
  const drP = $('#drawerPriv'), accP = $('#accPriv');
  accP.innerHTML = PRIV_CATS.map((c, i) => `
  <div class="cat">
    <button class="cat-head" data-pcat="${i}" aria-haspopup="true" aria-controls="drL2p">
      <svg class="cat-ico" aria-hidden="true" viewBox="0 0 26 26" fill="none">${ICONS[c.icon]}</svg>
      <span class="cat-txt"><strong>${c.name}</strong><small>${c.sub}</small></span>
      ${c.chip ? `<span class="tr-chip ${c.chip[1]}">${c.chip[0]}</span>` : ''}
      ${CHEV_R}
    </button>
  </div>`).join('');
  const l2p = document.createElement('section');
  l2p.className = 'dr-l2'; l2p.id = 'drL2p'; l2p.setAttribute('aria-hidden', 'true'); l2p.inert = true;
  l2p.innerHTML = `<div class="l2-top">
      <button class="l2-back" type="button"><svg width="9" height="15" viewBox="0 0 9 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.5 1.5 1.5 7.5l6 6"/></svg>Tus productos</button>
      <button class="close" data-drawer="close" aria-label="Cerrar menú"><svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true" stroke="#2a2e4a" stroke-width="1.8" stroke-linecap="round"><path d="M2 2l10 10M12 2 2 12"/></svg></button>
    </div>
    <div class="l2-head"><svg class="cat-ico" aria-hidden="true" viewBox="0 0 26 26" fill="none"></svg><div><h3 id="l2pTitle"></h3><small id="l2pSub"></small></div></div>
    <nav class="l2-list" aria-labelledby="l2pTitle"></nav>`;
  drP.appendChild(l2p);
  let opener = null;
  const open = (i, btn) => {
    const c = PRIV_CATS[i]; opener = btn;
    $('.cat-ico', l2p).innerHTML = ICONS[c.icon];
    $('#l2pTitle').textContent = c.name; $('#l2pSub').textContent = c.sub;
    $('.l2-list', l2p).innerHTML = c.items.map(it => `<a href="#" class="l2-item l2-rich${it.hot ? ' hot' : ''}" ${it.go ? `data-go="${it.go}"` : `data-toast="${it.toast}"`}><span><b>${it.t}</b><small>${it.s}</small></span>${CHEV_R}</a>`).join('');
    drP.classList.add('l2-open'); l2p.setAttribute('aria-hidden', 'false'); l2p.inert = false; l2p.style.top = drP.scrollTop + 'px'; l2p.style.height = drP.clientHeight + 'px';
    haptic(6); setTimeout(() => $('.l2-back', l2p).focus({ preventScroll: true }), 320);
  };
  const close = (focus = true) => {
    if (!drP.classList.contains('l2-open')) return;
    drP.classList.remove('l2-open'); drP.classList.add('l2-closing'); setTimeout(() => drP.classList.remove('l2-closing'), 600); l2p.setAttribute('aria-hidden', 'true'); l2p.inert = true;
    if (focus && opener) setTimeout(() => opener.focus({ preventScroll: true }), 320);
  };
  accP.addEventListener('click', e => { const b = e.target.closest('[data-pcat]'); if (b) open(+b.dataset.pcat, b); });
  $('.l2-back', l2p).addEventListener('click', () => close());
  // Al cerrar el menú vuelve al primer nivel; Escape primero retrocede
  new MutationObserver(() => { if (!drP.classList.contains('open')) setTimeout(() => close(false), 400); }).observe(drP, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drP.classList.contains('l2-open')) { e.stopImmediatePropagation(); close(); } }, true);
})();

// ================= Inicio público: ¿Eres afiliado a Caja Los Andes? =================
(() => {
  const inp = $('#afRut'), res = $('#afRes'), btn = $('#afGo');
  inp.addEventListener('input', () => { inp.value = formatRut(inp.value); $('#afErr').textContent = ''; inp.classList.remove('bad'); });
  $('#afForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validRut(inp.value)) { $('#afErr').textContent = 'Revisa tu RUT: debe tener el formato 12.345.678-9.'; inp.classList.add('bad'); inp.focus(); haptic([8, 40, 8]); return; }
    btn.classList.add('loading'); btn.setAttribute('aria-busy', 'true'); haptic(8);
    res.hidden = true;
    setTimeout(() => {
      btn.classList.remove('loading'); btn.removeAttribute('aria-busy');
      // Demo: los RUT cuyo cuerpo termina en 0 aparecen sin afiliación
      const body = inp.value.replace(/[^0-9kK]/g, '').slice(0, -1);
      const yes = !body.endsWith('0');
      res.className = `afc-res ${yes ? 'yes' : 'no'}`;
      res.innerHTML = yes
        ? `<b>¡Sí, estás afiliado a Caja Los Andes! 🎉</b><p>Tienes acceso a más de 500 beneficios, créditos con tasa preferencial y el pago de tus licencias médicas.</p>
           <div class="afc-acts"><button type="button" class="btn-blue" id="afLogin">Ingresar a mi cuenta</button><button type="button" class="btn-outline" data-go="beneficios">Ver beneficios</button></div>`
        : `<b>No encontramos una afiliación con este RUT</b><p>Si trabajas con contrato, pregúntale a tu empleador si tu empresa está con Caja Los Andes. También puedes afiliarte si eres pensionado.</p>
           <div class="afc-acts"><button type="button" class="btn-outline" data-toast="Un ejecutivo te contactará para contarte cómo afiliarte">Quiero afiliarme</button></div>`;
      res.hidden = false;
      res.animate?.([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: reduceMotion ? 1 : 360, easing: 'cubic-bezier(.32,.72,0,1)' });
      haptic(yes ? [10, 40, 16] : 8);
      $('#afLogin')?.addEventListener('click', () => {
        go('rut');
        setTimeout(() => { const r = $('#rut'); if (r) { r.value = inp.value; r.dispatchEvent(new Event('input')); } }, 380);
      });
    }, reduceMotion ? 150 : 900);
  });
})();

// La consulta de afiliación se limpia al salir del inicio público
document.addEventListener('screen:before', e => {
  if (e.detail.name === 'home') return;
  const r = $('#afRut'); if (!r) return;
  r.value = ''; r.classList.remove('bad');
  $('#afErr').textContent = '';
  const res = $('#afRes'); res.hidden = true; res.innerHTML = '';
});
