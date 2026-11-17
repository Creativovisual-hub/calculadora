// =====================================================================
// Flujo de Beneficios: catálogo → detalle → bottom sheet "Cómo canjear"
// Depende de go(), back(), haptic(), EASE, DUR y reduceMotion definidos en app.js
// =====================================================================

const IMG = {
  farmacia: 'assets/fotos/farmacia.jpg',
  vuelo: 'assets/fotos/vuelo.jpg',
  cine: 'assets/fotos/cine.jpg',
  cabana: 'assets/fotos/cabana.jpg',
};

const BENEFITS = {
  salcobrand: {
    brand: 'Salcobrand', cat: 'salud', img: IMG.farmacia, badge: 'HASTA 45% DCTO',
    catLabel: 'SALUD & FARMACIA', headline: 'Hasta 45% dcto.', desc: 'En medicamentos genéricos, 12% en medicamentos de marca y 10% en vitaminas Life y Helty.',
    channel: 'Con tu cédula',
    kicker: 'CONVENIO PRESENCIAL & ONLINE', title: 'Farmacias Salcobrand', place: 'Todas las farmacias Salcobrand del país y salcobrand.cl',
    mode: 'Presentando tu cédula', until: 'Hasta 31 Dic 2026',
    discounts: [['Medicamentos genéricos', '45% DCTO'], ['Medicamentos de marca', '12% DCTO'], ['Vitaminas Life y Helty', '10% DCTO'], ['Club Bebé y Club Mamá', '20% DCTO']],
    note: ['Solo con tu cédula', 'Indica en caja que eres afiliado a Caja Los Andes y presenta tu cédula. Máximo 5 unidades por boleta; no incluye oncológicos, vacunas ni productos veterinarios.'],
    near: 'Av. Pedro de Valdivia 142 (250m)',
    sheet: { chip: 'Convenio Farmacias', ico: '💊', title: 'Cómo usar tu descuento', sub: 'Farmacias Salcobrand • Cobertura nacional', instrTitle: 'INSTRUCCIÓN EN CAJA',
      instr: 'Presenta tu cédula de identidad e indica que eres afiliado a Caja Los Andes. En salcobrand.cl ingresa con tu cuenta. No se acumula con otras promociones.',
      alt: 'Ver farmacias Salcobrand cercanas' },
  },
  jetsmart: {
    brand: 'JetSMART', cat: 'turismo', img: IMG.vuelo, badge: 'HASTA 25% DCTO',
    catLabel: 'VIAJES & VUELOS', headline: 'Hasta 25% dcto.', desc: 'En vuelos nacionales y hasta 15% en internacionales, reservando con 14 días de anticipación.',
    channel: 'Código de descuento',
    kicker: 'CONVENIO ONLINE', title: 'Vuelos JetSMART', place: 'Compra en jetsmart.com',
    mode: 'Código en jetsmart.com', until: 'Viajes hasta el 21 Dic 2026',
    discounts: [['Vuelos nacionales', 'HASTA 25%'], ['Vuelos internacionales', 'HASTA 15%']],
    note: ['Reserva con anticipación', 'Compra con al menos 14 días de anticipación. No aplica en temporada alta ni se acumula con otras promociones.'],
    near: 'Compra 100% online',
    sheet: { chip: 'Convenio Aerolínea', ico: '✈️', title: 'Cómo usar tu código', sub: 'JetSMART • Compra online', instrTitle: 'INSTRUCCIÓN AL PAGAR',
      instr: 'Ingresa tu código de descuento en el paso de pago de jetsmart.com. Reserva con al menos 14 días de anticipación.',
      alt: 'Ir a jetsmart.com' },
  },
  hoyts: {
    brand: 'Cinemark', cat: 'entretencion', img: IMG.cine, badge: 'DESDE $3.600',
    catLabel: 'ENTRETENCIÓN', headline: 'Cine desde $3.600', desc: 'Entradas 2D de lunes a miércoles en todas las salas Cinemark del país.',
    channel: 'Código para 4 entradas',
    kicker: 'CONVENIO PRESENCIAL & ONLINE', title: 'Cinemark', place: 'Todas las salas Cinemark y cinemark.cl',
    mode: 'Código en boletería o web', until: 'Hasta 30 Sep 2026',
    discounts: [['Lunes a miércoles', '$3.600'], ['Jueves a domingo', '$4.400'], ['Máximo por RUT', '4 ENTRADAS']],
    note: ['Salas del centro, norte y sur', 'Vive tu próximo panorama con precios especiales. No incluye IMAX, preestrenos ni eventos especiales.'],
    near: 'Cinemark Costanera Center (600m)',
    sheet: { chip: 'Convenio Cines', ico: '🍿', title: 'Cómo usar tu código', sub: 'Cinemark • Cobertura nacional', instrTitle: 'INSTRUCCIÓN EN BOLETERÍA',
      instr: 'Muestra tu código en boletería o tótem de autoatención, o ingrésalo al comprar en cinemark.cl. Válido de lunes a miércoles.',
      alt: 'Ver cines Cinemark cercanos' },
  },
  cabanas: {
    brand: 'Centros Turísticos', cat: 'turismo', img: IMG.cabana, badge: 'TEMPORADA BAJA',
    catLabel: 'TURISMO CAJA LOS ANDES', headline: 'Centros Turísticos', desc: '14 centros turísticos de norte a sur: cabañas en Huallilemu Sur (El Quisco), La Huayca (Iquique) y más.',
    price: 'Temporada baja hasta 19 Dic', link: 'Reservar',
    kicker: 'TURISMO CAJA LOS ANDES', title: 'Centros Turísticos', place: 'Huallilemu Sur, La Huayca, Río Serrano y más',
    mode: 'Reserva online con tu RUT', until: 'Temporada baja: 15 Mar al 19 Dic 2026',
    discounts: [['Huallilemu Sur, El Quisco', 'CABAÑAS'], ['La Huayca, Iquique', '23 CABAÑAS'], ['Río Serrano, Torres del Paine', 'CAMPING']],
    note: ['Tarifas de temporada baja', 'Válidas del 15 de marzo al 19 de diciembre de 2026 en nuevas reservas. No incluye feriados, fines de semana largos ni vacaciones de invierno.'],
    near: 'Centro más cercano: Huallilemu Sur, El Quisco',
    sheet: { chip: 'Turismo Caja Los Andes', ico: '🏕️', title: 'Cómo reservar', sub: 'Centros Turísticos • Caja Los Andes', instrTitle: 'INSTRUCCIÓN DE RESERVA',
      instr: 'Elige el centro y la fecha, confirma con tu RUT y recibe tu reserva por correo. No se permiten mascotas, salvo perros de asistencia.',
      alt: 'Ver disponibilidad' },
  },
  chequeo: {
    brand: 'RedSalud', cat: 'salud', tile: true, badge: 'HASTA 60% DCTO',
    catLabel: 'CONVENIO SALUD', headline: 'RedSalud', desc: '60% dcto en atención dental general, 15% en exámenes y telemedicina desde copago $0.',
    price: 'Médico y dental', link: 'Agenda tu hora', img: IMG.farmacia,
    kicker: 'CONVENIO SALUD', title: 'Clínicas y centros RedSalud', place: 'Centros médicos y dentales RedSalud',
    mode: 'Presentando tu cédula', until: 'Hasta 31 Dic 2026',
    discounts: [['Atención dental general', '60% DCTO'], ['Exámenes de laboratorio e imágenes', '15% DCTO'], ['Telemedicina medicina general', 'DESDE $0'], ['Pack diagnóstico dental', '$21.990']],
    note: ['Solo con tu cédula', 'Agenda en agenda.redsalud.cl y presenta tu cédula al atenderte. El descuento se aplica automáticamente al pagar.'],
    near: 'RedSalud Providencia (1,2 km)',
    sheet: { chip: 'Convenio Salud', ico: '🩺', title: 'Cómo usar tu beneficio', sub: 'RedSalud • Centros médicos y dentales', instrTitle: 'INSTRUCCIÓN DE AGENDA',
      instr: 'Agenda tu hora en agenda.redsalud.cl y presenta tu cédula de identidad al atenderte. La telemedicina funciona todos los días de 7:00 a 24:00.',
      alt: 'Ver centros RedSalud cercanos' },
  },
  cruzverde: {
    brand: 'Cruz Verde', cat: 'salud', img: 'assets/fotos/cruzverde.svg', badge: '45% DCTO',
    catLabel: 'SALUD & FARMACIA', headline: '45% dcto. en genéricos', desc: 'Y 12% en medicamentos de marca en farmacias Cruz Verde de todo Chile.',
    channel: 'Con tu cédula',
    kicker: 'CONVENIO PRESENCIAL', title: 'Farmacias Cruz Verde', place: 'Farmacias Cruz Verde de todo Chile',
    mode: 'Presentando tu cédula', until: 'Hasta 31 Dic 2026',
    discounts: [['Medicamentos genéricos', '45% DCTO'], ['Servicios de enfermería', '50% DCTO'], ['Productos Gea', '20% DCTO'], ['Medicamentos de marca', '12% DCTO']],
    note: ['Solo con tu cédula', 'Identifícate como afiliado a Caja Los Andes con tu cédula en la farmacia. Solo compras presenciales; no se acumula con otras promociones.'],
    near: 'Cruz Verde Providencia (400m)',
    sheet: { chip: 'Convenio Farmacias', ico: '💊', title: 'Cómo usar tu descuento', sub: 'Farmacias Cruz Verde • Cobertura nacional', instrTitle: 'INSTRUCCIÓN EN CAJA',
      instr: 'Presenta tu cédula de identidad e indica que eres afiliado a Caja Los Andes antes de pagar.', alt: 'Ver farmacias cercanas' },
  },
  copec: {
    brand: 'Copec', cat: 'hogar', img: 'assets/fotos/copec.svg', badge: '$15 DCTO / LT',
    catLabel: 'COMBUSTIBLE', headline: '$15 dcto. por litro', desc: 'En combustible pagando con la app Copec. Tu cupón dura 3 días.',
    channel: 'Código en app Copec',
    kicker: 'CONVENIO DEL MES', title: 'Copec', place: 'Estaciones Copec de todo Chile',
    mode: 'Código en la app Copec', until: 'Hasta 30 Sep 2026',
    discounts: [['Combustible pagando con app Copec', '$15 / LT']],
    note: ['Cupón de 3 días', 'Ingresa tu código en la sección "Cupones Full" de la app Copec y paga con ella dentro de los 3 días siguientes.'],
    near: 'Copec Av. Providencia (700m)',
    sheet: { chip: 'Convenio Combustible', ico: '⛽', title: 'Cómo usar tu código', sub: 'Copec • App Copec', instrTitle: 'INSTRUCCIÓN EN LA APP',
      instr: 'Abre la app Copec, entra a Cupones Full, ingresa tu código y paga tu carga con la app.', alt: 'Copiar código' },
  },
  aramco: {
    brand: 'Aramco', cat: 'hogar', img: 'assets/fotos/aramco.svg', badge: '$100 DCTO / LT',
    catLabel: 'COMBUSTIBLE', headline: '$100 dcto. por litro', desc: 'Los viernes, identificándote con tu RUT de afiliado en estaciones Aramco.',
    channel: 'Con tu RUT',
    kicker: 'NUEVO CONVENIO', title: 'Aramco', place: 'Estaciones de servicio Aramco',
    mode: 'Con tu RUT, los viernes', until: 'Desde el 11 Sep 2026',
    discounts: [['Combustible los viernes', '$100 / LT']],
    note: ['Solo los viernes', 'Indica tu RUT de afiliado a Caja Los Andes al momento de cargar combustible.'],
    near: 'Aramco Av. Irarrázaval (1,5 km)',
    sheet: { chip: 'Convenio Combustible', ico: '⛽', title: 'Cómo usar tu descuento', sub: 'Aramco • Estaciones de servicio', instrTitle: 'INSTRUCCIÓN AL CARGAR',
      instr: 'Los viernes, dile al bombero que eres afiliado a Caja Los Andes y entrégale tu RUT antes de cargar.', alt: 'Ver estaciones cercanas' },
  },
  smartfit: {
    brand: 'Smart Fit', cat: 'deporte', img: 'assets/fotos/smartfit.svg', badge: 'MATRÍCULA $0',
    catLabel: 'DEPORTE & VIDA SANA', headline: 'Plan Black a $29.900', desc: 'Matrícula $0 y $29.900 al mes por 12 meses, con 5 invitados al mes.',
    channel: 'Código de descuento',
    kicker: 'CONVENIO PRESENCIAL & ONLINE', title: 'Smart Fit Plan Black', place: '99 gimnasios en Chile y más de 1.000 en Latinoamérica',
    mode: 'Código al contratar', until: 'Hasta 28 Dic 2026',
    discounts: [['Matrícula', '$0'], ['Mensualidad por 12 meses', '$29.900'], ['Anualidad 2026 (desde el 2º mes)', '$26.800'], ['Invitados al mes', '5']],
    note: ['Actívalo en 48 horas', 'Usa tu código al contratar el Plan Black y actívalo en tu sede dentro de 48 horas. Desde los 14 años; hasta 4 cupones por afiliado.'],
    near: 'Smart Fit Providencia (900m)',
    sheet: { chip: 'Convenio Deporte', ico: '🏋️', title: 'Cómo usar tu código', sub: 'Smart Fit • Plan Black', instrTitle: 'INSTRUCCIÓN AL CONTRATAR',
      instr: 'Contrata el Plan Black en smartfit.cl con tu código y actívalo en la sede que elijas dentro de 48 horas.', alt: 'Copiar código' },
  },
  carozzi: {
    brand: 'Mercado Carozzi', cat: 'hogar', img: 'assets/fotos/chef.jpg', badge: 'DESDE 20% DCTO',
    catLabel: 'SUPERMERCADO', headline: 'Desde 20% dcto.', desc: 'Todos los días en mercadocarozzi.cl: Carozzi, Costa, Ambrosoli y más marcas.',
    channel: 'Compra online',
    kicker: 'CONVENIO ONLINE', title: 'Mercado Carozzi', place: 'mercadocarozzi.cl',
    mode: 'Compra online', until: 'Hasta 31 Dic 2026',
    discounts: [['Productos a precio normal', 'DESDE 20%'], ['Despacho RM sobre $25.000', 'GRATIS']],
    note: ['Se aplica solo', 'Crea tu cuenta en mercadocarozzi.cl, elige "Caja Los Andes" como grupo de beneficio y el descuento aparece en los productos.'],
    near: 'Compra 100% online',
    sheet: { chip: 'Convenio Supermercado', ico: '🛒', title: 'Cómo activar tu descuento', sub: 'Mercado Carozzi • Compra online', instrTitle: 'INSTRUCCIÓN EN LA WEB',
      instr: 'Regístrate en mercadocarozzi.cl y elige Caja Los Andes como grupo de beneficio. No aplica a productos en oferta ni packs.', alt: 'Ir a mercadocarozzi.cl' },
  },
  transvip: {
    brand: 'Transvip', cat: 'turismo', img: 'assets/fotos/transvip.svg', badge: '15% DCTO', soldout: true,
    catLabel: 'TRASLADOS', headline: '15% dcto. en traslados', desc: 'Reservando en la app o en transvip.cl, con tope de $3.000 por viaje.',
    channel: 'Cupón en app o web',
    kicker: 'CONVENIO ONLINE', title: 'Transvip', place: 'Traslados en transvip.cl y app',
    mode: 'Cupón en app o web', until: 'Hasta 31 Dic 2026',
    discounts: [['Reservas en app o web', '15% DCTO'], ['Descuento máximo por viaje', '$3.000']],
    note: ['Ida y vuelta por separado', 'No aplica a reservas de ida y vuelta en una sola compra: resérvalas por separado. Cupos mensuales limitados.'],
    near: 'Reserva 100% online',
    sheet: { chip: 'Convenio Traslados', ico: '🚐', title: 'Cómo usar tu cupón', sub: 'Transvip • App y web', instrTitle: 'INSTRUCCIÓN AL RESERVAR',
      instr: 'Reserva en transvip.cl o en la app e ingresa tu cupón de afiliado antes de pagar.', alt: 'Copiar cupón' },
  },
  cinepolisconf: {
    brand: 'Cinépolis', cat: 'entretencion', img: 'assets/fotos/cinepolis.svg', badge: '20% DCTO',
    catLabel: 'ENTRETENCIÓN', headline: '20% dcto. en confitería', desc: 'Complementa tu panorama con 20% en combos seleccionados de la confitería de Cinépolis.',
    channel: 'Código en boletería', price: 'Combos de confitería', link: 'Ver detalle',
    kicker: 'CONVENIO PRESENCIAL', title: 'Confitería Cinépolis', place: 'Boleterías de Cinépolis en todo Chile',
    mode: 'Código en caja', until: 'Hasta 31 Dic 2026',
    discounts: [['Combos de confitería seleccionados', '20% DCTO']],
    note: ['Presenta tu código', 'Muestra tu código en caja cuando compres en las boleterías de Cinépolis.'],
    near: 'Cinépolis Parque Arauco',
    sheet: { chip: 'Convenio Cines', ico: '🍿', title: 'Cómo usar tu código', sub: 'Cinépolis', instrTitle: 'INSTRUCCIÓN EN CAJA', instr: 'Presenta tu código en caja al comprar tu combo.', alt: 'Ver cines' },
  },
  cinemarkconf: {
    brand: 'Cinemark', cat: 'entretencion', img: 'assets/fotos/cinemark-conf.svg', badge: '20% DCTO', soldout: true,
    catLabel: 'ENTRETENCIÓN', headline: '20% dcto. en confitería', desc: 'Complementa tu panorama con 20% en combos seleccionados comprando en la confitería de Cinemark.',
    channel: 'Código en confitería', price: 'Combos de confitería', link: 'Ver detalle',
    kicker: 'CONVENIO PRESENCIAL', title: 'Confitería Cinemark', place: 'Confiterías Cinemark en todo Chile',
    mode: 'Código en confitería', until: 'Hasta 31 Dic 2026',
    discounts: [['Combos de confitería seleccionados', '20% DCTO']],
    note: ['Cupos del mes agotados', 'Los códigos de este mes se agotaron. Vuelve a estar disponible el 1 de octubre.'],
    near: 'Cinemark Costanera Center',
    sheet: { chip: 'Convenio Cines', ico: '🍿', title: 'Cómo usar tu código', sub: 'Cinemark', instrTitle: 'INSTRUCCIÓN EN CONFITERÍA', instr: 'Presenta tu código en la confitería al comprar tu combo.', alt: 'Ver cines' },
  },
  mediclic: {
    brand: 'Mediclic', cat: 'salud', img: 'assets/fotos/mediclic.svg', badge: 'COPAGO $0',
    catLabel: 'TELEMEDICINA', headline: 'Desde copago $0', desc: 'Telemedicina: en menos de 5 minutos atención en medicina general.',
    channel: 'Online', price: 'Desde copago $0', link: 'Atenderme',
    kicker: 'CONVENIO ONLINE', title: 'Telemedicina Mediclic', place: 'Atención 100% online',
    mode: 'Online', until: 'Hasta 31 Dic 2026',
    discounts: [['Medicina general por telemedicina', 'DESDE $0']],
    note: ['Atención en minutos', 'En menos de 5 minutos te atiende un médico general por videollamada.'],
    near: 'Atención 100% online',
    sheet: { chip: 'Telemedicina', ico: '🩺', title: 'Cómo atenderte', sub: 'Mediclic', instrTitle: 'INSTRUCCIÓN', instr: 'Ingresa al sitio de Mediclic y agenda tu atención con tu RUT.', alt: 'Ir a Mediclic' },
  },
};

// Qué necesita el afiliado para usarlo: solo mostrar la cédula en el local, o ingresar con RUT y clave
const REQ = { salcobrand: 'cedula', hoyts: 'login', chequeo: 'cedula', jetsmart: 'login', cabanas: 'login', resto: 'login', edv: 'login', cinepolisconf: 'login', cinemarkconf: 'login', mediclic: 'login', cruzverde: 'cedula', copec: 'login', aramco: 'cedula', smartfit: 'login', carozzi: 'login', transvip: 'login' };
const REQ_TXT = {
  cedula: '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="1" y="1" width="14" height="10" rx="2"/><circle cx="5.2" cy="5.3" r="1.6"/><path d="M3 9c.4-1.2 1.2-1.8 2.2-1.8S7 7.8 7.4 9M9.5 4.5h3.5M9.5 7h2.5" stroke-linecap="round"/></svg>Solo tu cédula',
  login: '<svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="1" y="6" width="10" height="7" rx="2"/><path d="M3.3 6V4.2a2.7 2.7 0 0 1 5.4 0V6"/></svg>RUT y clave',
};
let activeReq = 'all', activeMode = 'all';
// Dónde se usa: en el local o en línea
const MODE = { salcobrand: 'local', hoyts: 'local', chequeo: 'local', jetsmart: 'online', cabanas: 'online', resto: 'online', edv: 'online', cinepolisconf: 'local', cinemarkconf: 'local', mediclic: 'online', cruzverde: 'local', copec: 'local', aramco: 'local', smartfit: 'local', carozzi: 'online', transvip: 'online' };
const USED = ['salcobrand', 'cruzverde', 'hoyts', 'cinepolisconf', 'cinemarkconf', 'smartfit', 'carozzi'];
const CONV = ['copec', 'aramco', 'jetsmart', 'transvip'];   // convenios del mes
const EXPERIENCES = ['cabanas', 'chequeo', 'mediclic'];
// Los locales del mapa (PINS) viven en map.js

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const chev = '<svg width="6" height="10" aria-hidden="true"><use href="#chev-r"/></svg>';

// ---------- Toast ----------
const toastEl = $('#toast');
let toastTimer;
function toast(msg, icon = '✓') {
  toastEl.innerHTML = `<span class="t-ico" aria-hidden="true">${icon}</span>${msg}`;
  toastEl.classList.remove('show'); void toastEl.offsetWidth; toastEl.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-toast]');
  if (t) { e.preventDefault(); haptic(); toast(t.dataset.toast, 'i'); }
});

// ---------- Render catálogo ----------
function usedCard(id) {
  const b = BENEFITS[id];
  return `<article class="used press${b.soldout ? ' soldout' : ''}" data-open="${id}" data-cat="${b.cat}" data-req="${REQ[id]}" data-mode="${MODE[id]}" data-text="${(b.brand + ' ' + b.desc + ' ' + b.catLabel).toLowerCase()}" tabindex="0" role="link" aria-label="${b.brand}: ${b.headline}">
    <div class="used-media">
      <img src="${b.img}" alt="" loading="lazy" data-shared>
      <span class="used-badge">${b.soldout ? 'AGOTADO' : b.badge}</span>
      <span class="brand-pill"><i></i>${b.brand}</span>
    </div>
    <div class="used-body">
      <span class="used-cat c-${b.cat}">${b.catLabel}</span>
      <h3>${b.headline}</h3>
      <p>${b.desc}</p>
    </div>
    <div class="used-foot"><span class="req-tag req-${REQ[id]}">${REQ_TXT[REQ[id]]}</span><b>Conocer más <svg width="12" height="10" aria-hidden="true"><use href="#arrow-r"/></svg></b></div>
  </article>`;
}
function expCard(id) {
  const b = BENEFITS[id];
  const media = b.tile
    ? `<div class="exp-tile"><svg width="30" height="34" viewBox="0 0 30 34" fill="none" aria-hidden="true"><path d="M15 2 3 6.5v9C3 23.3 8.1 29.1 15 32c6.9-2.9 12-8.7 12-16.5v-9L15 2Z" stroke="#06C2FA" stroke-width="2.4" stroke-linejoin="round"/><path d="m10 16.5 3.5 3.5 6.5-7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${b.badge}</span></div>`
    : `<div class="exp-media"><img src="${b.img}" alt="" loading="lazy" data-shared><span>${b.badge.replace('HASTA', 'Hasta').replace('DCTO', 'DCTO')}</span></div>`;
  return `<article class="exp press${b.soldout ? ' soldout' : ''}" data-open="${id}" data-cat="${b.cat}" data-req="${REQ[id]}" data-mode="${MODE[id]}" data-text="${(b.brand + ' ' + b.desc + ' ' + b.catLabel + ' cabaña').toLowerCase()}" tabindex="0" role="link" aria-label="${b.headline}">
    ${media}
    <div class="exp-body">
      <span class="used-cat c-${b.cat}">${b.catLabel}</span>
      <h3>${b.headline}</h3>
      <p>${b.desc}</p>
      <span class="req-tag req-${REQ[id]}">${REQ_TXT[REQ[id]]}</span>
      <div class="exp-foot"><b>${b.price}</b><span>${b.link}<svg width="12" height="10" aria-hidden="true"><use href="#arrow-r"/></svg></span></div>
    </div>
  </article>`;
}
$('#usedRow').innerHTML = USED.map(usedCard).join('');
$('#convRow').innerHTML = CONV.map(usedCard).join('');
$('#expList').innerHTML = EXPERIENCES.map(expCard).join('');

// Abrir detalle desde una tarjeta (fundido suave centrado)
function openBenefit(id) {
  haptic(10);
  go('detalle', { id });
}
document.addEventListener('click', e => {
  const card = e.target.closest('[data-open]');
  if (card && !e.defaultPrevented) { e.preventDefault(); openBenefit(card.dataset.open, card); }
});
document.addEventListener('keydown', e => {
  const card = e.target.closest && e.target.closest('[data-open]');
  if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openBenefit(card.dataset.open, card); }
});

// ---------- Indicador deslizante (chips de categoría y selector de distancia) ----------
function moveIndicator(wrap, ind, btn, instant) {
  const w = wrap.getBoundingClientRect(), r = btn.getBoundingClientRect();
  if (!r.width) return;
  if (instant) ind.style.transition = 'none';
  ind.style.width = `${r.width}px`;
  ind.style.transform = `translateX(${r.left - w.left + wrap.scrollLeft}px)`;
  if (instant) { void ind.offsetWidth; ind.style.transition = ''; }
}
function segmented(wrap, ind, onChange) {
  const btns = $$('button', wrap);
  btns.forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('on')) return;
    haptic(6);
    btns.forEach(o => { o.classList.toggle('on', o === b); o.setAttribute('aria-selected', o === b); });
    moveIndicator(wrap, ind, b);
    b.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    onChange(b);
  }));
  return () => moveIndicator(wrap, ind, $('button.on', wrap), true);
}

// Categorías: filtra "Más usados" y "Experiencias" con salida/entrada escalonada
let activeCat = 'all', query = '';
function applyFilters() {
  const cards = $$('#usedRow .used, #convRow .used, #expList .exp');
  let visible = 0;
  cards.forEach(c => {
    const ok = (activeCat === 'all' || c.dataset.cat === activeCat) && (activeReq === 'all' || c.dataset.req === activeReq) && (activeMode === 'all' || c.dataset.mode === activeMode) && (!query || c.dataset.text.includes(query));
    if (ok) visible++;
    if (ok && c.hidden) {
      c.hidden = false;
      c.animate([{ opacity: 0, transform: 'translateY(12px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: reduceMotion ? 1 : 380, easing: EASE, delay: visible * 50 });
    } else if (!ok && !c.hidden) {
      c.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(.96)' }], { duration: reduceMotion ? 1 : 160, easing: 'ease-in' });
      setTimeout(() => { c.hidden = true; }, reduceMotion ? 0 : 160);
    }
  });
  const empty = $('#bnEmpty');
  empty.hidden = visible > 0;
  // Cada sección se oculta si el filtro la deja vacía
  setTimeout(() => [['#usedRow', '.used'], ['#convRow', '.used'], ['#expList', '.exp']].forEach(([row, sel]) => {
    const on = $$(row + ' ' + sel).some(c => !c.hidden);
    const head = $(row).previousElementSibling; if (head && head.classList.contains('sec-head')) head.hidden = !on;
  }), reduceMotion ? 0 : 170);
  $('span', empty).textContent = query;
}
const syncCats = segmented($('#bnCats'), $('.cats-ind'), b => { activeCat = b.dataset.cat; applyFilters(); paintApplied(); });

// ---------- Filtros: ícono junto al buscador → hoja con opciones → filtros aplicados visibles ----------
const F_LABEL = {
  req: { cedula: '🪪 Solo tu cédula', login: '🔒 RUT y clave' },
  mode: { local: '📍 En el local', online: '💻 Online' },
  cat: { salud: '❤️ Salud', entretencion: '🍿 Entretención', turismo: '🏕️ Turismo', hogar: '🏠 Hogar', deporte: '🏋️ Deporte', educacion: '🎓 Educación' },
};
const fsheet = $('#fsheet'), fsBd = $('#fsheetBd');
let draft = {};
// La misma hoja de filtros sirve a la vitrina pública ("bn") y a "Para ti" del privado ("pt")
const FS = {
  bn: {
    rows: '#usedRow .used, #convRow .used, #expList .exp', btn: '#bnFilterBtn', count: '#bnFilterCount', applied: '#bnApplied',
    get: () => ({ req: activeReq, mode: activeMode, cat: activeCat }),
    apply(f) {
      activeReq = f.req; activeMode = f.mode;
      if (f.cat !== activeCat) setCat(f.cat);
      if (!$(`#bnCats [data-cat="${f.cat}"]`)) activeCat = f.cat;
      applyFilters();
    },
  },
};
let fsScope = 'bn';
const curFilters = (s = fsScope) => FS[s].get();
function countFor(f) {
  return $$(FS[fsScope].rows).filter(c => (f.cat === 'all' || c.dataset.cat === f.cat) && (f.req === 'all' || c.dataset.req === f.req) && (f.mode === 'all' || c.dataset.mode === f.mode)).length;
}
function paintSheet() {
  $$('.fs-opts', fsheet).forEach(g => $$('button', g).forEach(x => x.setAttribute('aria-checked', String(x.dataset.v === draft[g.dataset.f]))));
  const n = countFor(draft);
  $('#fsApply').textContent = n ? `Ver ${n} beneficio${n > 1 ? 's' : ''}` : 'Sin resultados con estos filtros';
  $('#fsApply').disabled = !n;
}
function openFilters(scope = 'bn') {
  fsScope = scope;
  fsheet.classList.toggle('no-req', !!FS[scope].noReq);          // en el privado ya ingresaste: no se filtra por requisito
  draft = curFilters(); paintSheet();
  fsheet.classList.add('open'); fsBd.classList.add('open'); fsheet.setAttribute('aria-hidden', 'false');
  haptic(6); setTimeout(() => $('#fsT').focus?.(), 60);
}
function closeFilters() { fsheet.classList.remove('open'); fsBd.classList.remove('open'); fsheet.setAttribute('aria-hidden', 'true'); $(FS[fsScope].btn).focus({ preventScroll: true }); }
function setCat(v) {
  const chip = $(`#bnCats [data-cat="${v}"]`);
  if (chip) chip.click(); else { activeCat = v; }
}
function applyDraft(f, s = fsScope) { FS[s].apply(f); paintApplied(s); }
function paintApplied(s = 'bn') {
  const S = FS[s];
  const on = Object.entries(S.get()).filter(([, v]) => v !== 'all');
  const row = $(S.applied);
  row.hidden = !on.length;
  row.innerHTML = on.map(([k, v]) => `<button type="button" class="af" data-k="${k}" aria-label="Quitar filtro ${(F_LABEL[k][v] || v).replace(/^\S+ /, '')}">${F_LABEL[k][v] || v}<span aria-hidden="true">×</span></button>`).join('')
    + (on.length > 1 ? '<button type="button" class="af-clear" data-k="all">Limpiar todo</button>' : '');
  const cnt = $(S.count); cnt.hidden = !on.length; cnt.textContent = on.length;
  $(S.btn).setAttribute('aria-label', on.length ? `Filtrar beneficios, ${on.length} activo${on.length > 1 ? 's' : ''}` : 'Filtrar beneficios');
  $(S.btn).classList.toggle('on', !!on.length);
}
$('#bnFilterBtn').addEventListener('click', () => openFilters('bn'));
fsBd.addEventListener('click', closeFilters);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && fsheet.classList.contains('open')) closeFilters(); });
fsheet.addEventListener('click', e => {
  const opt = e.target.closest('.fs-opts button'); if (!opt) return;
  draft[opt.parentElement.dataset.f] = opt.dataset.v; haptic(4); paintSheet();
});
$('#fsClear').addEventListener('click', () => { draft = { req: 'all', mode: 'all', cat: 'all' }; haptic(6); paintSheet(); });
$('#fsApply').addEventListener('click', () => { applyDraft(draft); closeFilters(); });
// Quitar filtros desde los chips aplicados (vitrina pública y "Para ti")
function appliedClick(s) {
  return e => {
    const x = e.target.closest('[data-k]'); if (!x) return;
    const f = curFilters(s);
    if (x.dataset.k === 'all') { f.req = f.mode = f.cat = 'all'; } else f[x.dataset.k] = 'all';
    haptic(6); applyDraft(f, s);
  };
}
$('#bnApplied').addEventListener('click', appliedClick('bn'));

// Búsqueda con debounce
let qTimer;
$('#bnSearch').addEventListener('input', e => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => { query = e.target.value.trim().toLowerCase(); applyFilters(); }, 180);
});
$$('.pop').forEach(p => p.addEventListener('click', () => {
  haptic(6);
  const input = $('#bnSearch');
  input.value = p.textContent.trim();
  query = p.dataset.q; applyFilters();
  $('#usedRow').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
}));
$('.mic').addEventListener('click', () => { haptic(); toast('Escuchando… di el nombre del comercio', '🎙'); });


// ---------- Mapa "Cerca de ti": el componente mountMap() vive en map.js ----------
// (home-new: el mapa sale del inicio; se abre desde "Sucursales" en la barra inferior)
const bnNear = $('[data-screen=beneficios] .near');
const bnMap = mountMap(bnNear);
const syncSeg = bnMap.sync, dropPins = bnMap.drop;

// Carrusel "Más usados": arrastre con mouse (en touch es scroll nativo con snap)
(function dragScroll(row) {
  let d = null;
  row.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') d = { x: e.clientX, l: row.scrollLeft, moved: false }; });
  window.addEventListener('pointermove', e => {
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) { d.moved = true; row.classList.add('dragging'); }
    row.scrollLeft = d.l - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!d) return;
    if (d.moved) row.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); }, { capture: true, once: true });
    row.classList.remove('dragging'); d = null;
  });
})($('#usedRow'));

// Barra superior: sombra y desenfoque al hacer scroll (como la navigation bar de iOS)
window.addEventListener('scroll', () => {
  $$('.screen.is-active .bn-top').forEach(t => t.classList.toggle('scrolled', scrollY > 6));
}, { passive: true });

// ---------- Detalle ----------
let currentId = 'salcobrand';
function renderDetail(id) {
  const b = BENEFITS[id] || BENEFITS.salcobrand;
  currentId = BENEFITS[id] ? id : 'salcobrand';
  $('#bdBrand').textContent = b.brand;
  const fav = $('#bdFav');
  const isFav = favs.has(currentId);
  fav.classList.toggle('on', isFav); fav.setAttribute('aria-pressed', isFav);
  $('#bdBody').innerHTML = `
    <div class="bd-hero bd-in">
      <img src="${b.img}" alt="${b.title}" data-shared-target>
      <span class="brand-pill lg"><i></i>${b.brand}</span>
      <span class="used-badge lg">${b.badge}</span>
      <div class="bd-cap">
        <span class="bd-kicker">${b.kicker}</span>
        <h2>${b.title}</h2>
        <p><svg width="10" height="13" viewBox="0 0 10 13" aria-hidden="true"><path d="M5 12.5S.5 8.4.5 5a4.5 4.5 0 0 1 9 0c0 3.4-4.5 7.5-4.5 7.5Z" fill="#06C2FA"/><circle cx="5" cy="5" r="1.7" fill="#131252"/></svg>${b.place}</p>
      </div>
    </div>
    <div class="bd-card bd-in">
      <div class="bd-meta">
        <div><small>MODALIDAD DE CANJE</small><strong class="ok"><i></i>${b.mode}</strong></div>
        <div class="r"><small>VIGENCIA</small><strong class="blue">${b.until}</strong></div>
      </div>
      <h3 class="bd-h">DESCUENTOS INCLUIDOS</h3>
      <ul class="bd-list">${b.discounts.map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('')}</ul>
      <div class="bd-note">
        <span class="bd-note-ico" aria-hidden="true"><svg width="10" height="12" viewBox="0 0 10 12"><rect x="1" y="1" width="8" height="10" rx="1.5" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M3 4h4M3 6.5h4" stroke="#fff" stroke-width="1.2"/></svg></span>
        <div><strong>${b.note[0]}</strong><p>${b.note[1]}</p></div>
      </div>
      <p class="bd-near">Local más cercano: <b>${b.near}</b></p>
    </div>
    <button class="bd-cta bd-in" id="bdCta">
      <span class="cta-idle"><svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="#fff" stroke-width="1.7" aria-hidden="true"><rect x="1.5" y="3" width="13" height="14" rx="2.5"/><rect x="5" y="1" width="6" height="4" rx="1.2" fill="#084AFE"/></svg>Obtener beneficio</span>
      <span class="cta-done"><svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="ck" d="m2 7 4.5 4.5L16 2"/></svg>Beneficio listo para usar</span>
    </button>
    <button class="bd-back bd-in" data-back>← Volver al catálogo de beneficios</button>`;
}

// Favorito con "pop" y destello
const favs = new Set();
$('#bdFav').addEventListener('click', e => {
  const btn = e.currentTarget;
  const on = !favs.has(currentId);
  on ? favs.add(currentId) : favs.delete(currentId);
  btn.classList.toggle('on', on); btn.setAttribute('aria-pressed', on);
  btn.classList.remove('pop'); void btn.offsetWidth; if (on) btn.classList.add('pop');
  haptic(on ? 14 : 6);
  toast(on ? 'Guardado en favoritos' : 'Quitado de favoritos', on ? '♥' : '♡');
});

// Entradas escalonadas al llegar a cada pantalla
document.addEventListener('screen:before', e => {
  const { name, id } = e.detail;
  if (name === 'detalle') {
    renderDetail(id || currentId);
    const scr = document.querySelector('[data-screen=detalle]');
    scr.classList.remove('entering'); void scr.offsetWidth; scr.classList.add('entering');
  }
  if (name === 'beneficios' && !e.detail.back) {
    const scr = document.querySelector('[data-screen=beneficios]');
    scr.classList.remove('entering'); void scr.offsetWidth; scr.classList.add('entering');
    requestAnimationFrame(() => { syncCats(); syncSeg(); dropPins(); });
  }
});
document.addEventListener('screen:enter', e => {
  if (e.detail.name === 'beneficios') { syncCats(); syncSeg(); }
});
window.addEventListener('resize', () => { syncCats(); syncSeg(); });

// ---------- Bottom sheet ----------
const sheet = $('#sheet'), sheetBd = $('#sheetBackdrop');
let sheetLastFocus = null;
function openSheet() {
  const s = BENEFITS[currentId].sheet;
  $('#shChip').textContent = s.chip; $('#shIco').textContent = s.ico;
  $('#shTitle').textContent = s.title; $('#shSub').textContent = s.sub;
  $('#shInstrTitle').textContent = s.instrTitle; $('#shInstr').textContent = s.instr;
  $('#shAltTxt').textContent = s.alt;
  sheetLastFocus = document.activeElement;
  const scr = document.querySelector('[data-screen=detalle]');
  scr.style.transformOrigin = `50% ${scrollY + innerHeight / 2}px`;
  document.body.classList.add('sheet-open', 'lock');
  sheet.style.transform = '';
  sheet.classList.add('open'); sheetBd.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  scr.inert = true;
  haptic(10);
  setTimeout(() => $('#shOk').focus({ preventScroll: true }), 80);
}
function closeSheet(done) {
  if (!sheet.classList.contains('open')) return;
  sheet.style.transform = '';
  sheet.classList.remove('open', 'dragging'); sheetBd.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('sheet-open', 'lock');
  document.querySelector('[data-screen=detalle]').inert = false;
  sheetBd.style.opacity = '';
  if (done) setTimeout(markDone, reduceMotion ? 0 : 380);
  else if (sheetLastFocus) sheetLastFocus.focus({ preventScroll: true });
}
function markDone() {
  const cta = $('#bdCta');
  if (!cta) return;
  cta.classList.add('done');
  cta.setAttribute('aria-label', 'Beneficio listo para usar');
  haptic([12, 60, 18]);
  confetti(cta);
  toast('¡Listo! Presenta tu RUT al pagar', '🎉');
  cta.focus({ preventScroll: true });
}
document.addEventListener('click', e => {
  if (e.target.closest('#bdCta')) { e.preventDefault(); openSheet(); }
});
$('#shClose').addEventListener('click', () => closeSheet(false));
sheetBd.addEventListener('click', () => closeSheet(false));
$('#shOk').addEventListener('click', () => closeSheet(true));
$('#shAlt').addEventListener('click', () => {
  const alt = BENEFITS[currentId].sheet.alt;
  if (alt.startsWith('Copiar')) {
    const code = alt.split(' ').pop();
    navigator.clipboard && navigator.clipboard.writeText(code).catch(() => {});
    toast(`Código ${code} copiado`, '⧉');
  } else toast('Abriendo mapa de locales cercanos', '📍');
  haptic();
});
document.addEventListener('keydown', e => {
  if (!sheet.classList.contains('open')) return;
  if (e.key === 'Escape') closeSheet(false);
  if (e.key === 'Tab') {
    const f = $$('button', sheet);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
});

// Arrastrar hacia abajo para cerrar (con velocidad, como UISheetPresentationController)
(function sheetDrag() {
  let d = null;
  const start = e => {
    if (!sheet.classList.contains('open')) return;
    if (e.target.closest('button') && !e.target.closest('#sheetGrab')) return;
    d = { y: e.clientY, t: performance.now(), dy: 0 };
    sheet.classList.add('dragging');
    sheet.setPointerCapture && sheet.setPointerCapture(e.pointerId);
  };
  sheet.addEventListener('pointerdown', start);
  sheet.addEventListener('pointermove', e => {
    if (!d) return;
    let dy = e.clientY - d.y;
    if (dy < 0) dy = -Math.pow(-dy, 0.7);          // resistencia elástica hacia arriba
    d.dy = dy;
    sheet.style.transform = `translateY(${dy}px)`;
    sheetBd.style.opacity = String(Math.max(0, 1 - Math.max(0, dy) / 400));
  });
  const end = () => {
    if (!d) return;
    const v = d.dy / (performance.now() - d.t);
    sheet.classList.remove('dragging');
    if (d.dy > 120 || v > 0.6) closeSheet(false);
    else { sheet.style.transform = ''; sheetBd.style.opacity = ''; }
    d = null;
  };
  sheet.addEventListener('pointerup', end);
  sheet.addEventListener('pointercancel', end);
})();

// Confeti breve al activar el beneficio
function confetti(anchor) {
  if (reduceMotion) return;
  const r = anchor.getBoundingClientRect();
  const colors = ['#084AFE', '#06C2FA', '#FBB917', '#0B8457', '#131252'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('i');
    p.className = 'confetti';
    p.style.background = colors[i % colors.length];
    p.style.left = `${r.left + r.width / 2}px`; p.style.top = `${r.top + r.height / 2}px`;
    document.body.appendChild(p);
    const a = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 110;
    p.animate([
      { transform: 'translate(-50%,-50%) rotate(0)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * dist}px), calc(-50% + ${Math.sin(a) * dist - 40}px)) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.7 },
      { transform: `translate(calc(-50% + ${Math.cos(a) * dist * 1.1}px), calc(-50% + ${Math.sin(a) * dist + 60}px)) rotate(${Math.random() * 720}deg)`, opacity: 0 },
    ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.3,1)' }).finished.then(() => p.remove());
  }
}
