// ---------- Simulación de WhatsApp: ayuda con la licencia ----------
// La ejecutiva responde según el estado real de la licencia en la app (documentos, cuenta, declaración).
(() => {
  const root = document.getElementById('waChat');
  const log = document.getElementById('waLog'), quick = document.getElementById('waQuick');
  const input = document.getElementById('waInput'), form = document.getElementById('waForm');
  const firstName = () => (typeof profile !== 'undefined' && profile.nombre) || 'María';
  const now = () => new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  let opener = null, started = false, busy = false, run = 0;   // run: cada apertura es una conversación nueva

  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  function bubble(html, who, extra = '') {
    const b = document.createElement('div');
    b.className = `wa-msg wa-${who}`;
    b.innerHTML = `<div class="wa-b">${html}${extra}<span class="wa-meta">${now()}${who === 'me' ? ' <svg width="16" height="10" viewBox="0 0 16 10" aria-label="Leído"><path d="m1 5 3 3 6-6.5M6.5 8l.9.9L14 1.5" fill="none" stroke="#53BDEB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}</span></div>`;
    log.appendChild(b);
    log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
    return b;
  }
  function typing(ms) {
    return new Promise(res => {
      const t = document.createElement('div');
      t.className = 'wa-msg wa-them wa-typing'; t.setAttribute('aria-label', 'Camila está escribiendo');
      t.innerHTML = '<div class="wa-b"><i></i><i></i><i></i></div>';
      log.appendChild(t); log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
      document.getElementById('waStatus').textContent = 'escribiendo…';
      setTimeout(() => { t.remove(); document.getElementById('waStatus').textContent = 'en línea'; res(); }, reduceMotion ? 150 : ms);
    });
  }
  async function say(msgs) {
    const my = run;
    busy = true; paintQuick();
    for (const m of msgs) { if (my !== run) return; await typing(m.wait || 900 + Math.min(1400, m.html.length * 12)); if (my !== run) return; bubble(m.html, 'them', m.extra || ''); haptic?.(6); }
    busy = false; paintQuick();
  }

  // ----- Estado real de la licencia -----
  function state() {
    const ok = typeof lm !== 'undefined' ? lm.ok : new Map();
    const missing = typeof UP_RULES !== 'undefined' ? Object.keys(UP_RULES).filter(k => !ok.has(k)).map(k => UP_RULES[k].label) : [];
    return {
      sent: typeof lm !== 'undefined' && lm.sent,
      missing,
      account: typeof licAccount !== 'undefined' && !!licAccount,
      oath: !!document.getElementById('lmOath')?.checked,
    };
  }
  const list = arr => `<ul class="wa-list">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;

  const INTENTS = {
    estado() {
      const s = state();
      if (s.sent) return [{ html: `Revisé tu licencia <b>N° 849201-K</b> 🙌` }, { html: 'Ya recibimos y validamos todos tus documentos. Tu licencia está <b>en etapa de pago</b> y la fecha probable es el <b>31-07-2026</b>. No tienes que hacer nada más 💙' }];
      return [
        { html: `Revisé tu licencia <b>N° 849201-K</b> (21 días, desde el 10-07-2026) 🔎` },
        { html: `Está en la etapa <b>Revisión de documentos</b>. La COMPIN ya la recibió, pero ${s.missing.length ? `nos faltan <b>${s.missing.length} documento${s.missing.length > 1 ? 's' : ''}</b>` : 'nos falta completar algunos datos'} para poder pagarte.` },
      ];
    },
    faltan() {
      const s = state();
      if (s.sent) return [{ html: '¡No te falta nada! Ya enviaste todo y tu licencia está en pago ✅' }];
      const items = [...s.missing];
      if (!s.account) items.push('Elegir la <b>cuenta bancaria</b> donde quieres recibir el pago');
      if (!s.oath) items.push('Marcar la <b>declaración jurada</b>');
      if (!items.length) return [{ html: 'Tienes todo listo 🎉 Solo toca <b>“Enviar documentos”</b> al final de la pantalla de tu licencia.' }];
      return [{ html: `Te falta esto${items.length > 3 ? ' (tranquila, es rápido)' : ''}:` + list(items) }, { html: 'Las liquidaciones deben ser las <b>3 últimas antes del inicio de tu reposo</b>, y el certificado de la AFP con el RUT de tu empleador legible 😉' }];
    },
    subir() {
      return [
        { html: 'Es muy fácil, lo haces desde la app en 2 minutos 📱' + list(['Ve a <b>Mis licencias</b> y entra a la N° 849201-K.', 'En cada documento toca <b>Subir</b>: puedes <b>tomar una foto</b> o subir un PDF (máx. 10 MB).', 'Elige tu <b>cuenta bancaria</b> y marca la declaración.', 'Toca <b>Enviar documentos</b> y listo ✅']) },
        { html: 'Tip: toma la foto con buena luz y que se lean todos los datos 📸', extra: '<button type="button" class="wa-card-btn" data-wa-go>Subir documentos ahora</button>' },
      ];
    },
    pago() {
      const s = state();
      return [{ html: s.sent ? 'Tu pago está programado para el <b>31-07-2026</b> 💸 Te lo depositamos en tu cuenta y te avisamos por la app.' : 'Apenas envíes lo que falta, la fecha probable de pago es el <b>31-07-2026</b>. Pagamos hasta <b>2 días hábiles</b> después de que la COMPIN autoriza, por transferencia a tu cuenta 💸' }];
    },
    gracias() { return [{ html: `¡De nada, ${firstName()}! Cualquier cosa me escribes por aquí. Que te mejores pronto 💙` }]; },
    otro() { return [{ html: 'Te ayudo con eso 😊 Puedo contarte el <b>estado de tu licencia</b>, <b>qué documentos te faltan</b>, <b>cómo subirlos</b> o <b>cuándo te pagamos</b>.' }]; },
  };
  const QUICK = [
    ['estado', '¿En qué estado está mi licencia?'],
    ['faltan', '¿Qué documentos me faltan?'],
    ['subir', '¿Cómo los subo?'],
    ['pago', '¿Cuándo me pagan?'],
    ['gracias', 'Gracias 🙏'],
  ];
  const asked = new Set();
  function paintQuick() {
    const opts = QUICK.filter(([k]) => !asked.has(k) || k === 'gracias');
    quick.innerHTML = busy ? '' : opts.map(([k, t]) => `<button type="button" data-intent="${k}">${t}</button>`).join('');
  }
  function detect(t) {
    t = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (/gracia|genial|ok\b|perfect/.test(t)) return 'gracias';
    if (/falta|document|requisit|necesit/.test(t)) return 'faltan';
    if (/subo|subir|como|foto|cargar/.test(t)) return 'subir';
    if (/pag|plata|cuando|deposit|fecha/.test(t)) return 'pago';
    if (/estado|licencia|como va|va mi/.test(t)) return 'estado';
    return 'otro';
  }
  function ask(intent, text) {
    if (busy) return;
    bubble(esc(text), 'me'); asked.add(intent); haptic?.(8);
    say(INTENTS[intent]());
  }
  quick.addEventListener('click', e => { const b = e.target.closest('[data-intent]'); if (b) ask(b.dataset.intent, b.textContent); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const t = input.value.trim(); if (!t) return;
    input.value = ''; syncSend();
    ask(detect(t), t);
  });
  const syncSend = () => root.classList.toggle('has-text', !!input.value.trim());
  input.addEventListener('input', syncSend);
  log.addEventListener('click', e => {
    if (!e.target.closest('[data-wa-go]')) return;
    close();
    setTimeout(() => {
      if (current !== 'licencia') go('licencia');
      setTimeout(() => document.getElementById('lmDocs')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 500);
    }, 350);
  });

  function open(btn) {
    opener = btn;
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add('open'));
    root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    screenEl(current).inert = true;
    if (!started) {
      started = true;
      bubble('Hola 👋 necesito ayuda con mi licencia médica', 'me');
      say([{ html: `¡Hola ${firstName()}! Soy <b>Camila</b>, ejecutiva de Caja Los Andes 💙`, wait: 1000 }, { html: '¿En qué te puedo ayudar con tu licencia?', wait: 800 }]);
    }
    setTimeout(() => quick.querySelector('button')?.focus({ preventScroll: true }), 500);
  }
  function close() {
    root.classList.remove('open'); root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    screenEl(current).inert = false;
    setTimeout(() => { root.hidden = true; reset(); }, reduceMotion ? 0 : 380);
    opener?.focus?.({ preventScroll: true });
  }
  // Al cerrar, la conversación vuelve a cero (para mostrarla las veces que sea necesario)
  function reset() {
    run++; started = false; busy = false; asked.clear();
    [...log.querySelectorAll('.wa-msg')].forEach(m => m.remove());
    input.value = ''; syncSend();
    document.getElementById('waStatus').textContent = 'en línea';
    paintQuick();
  }
  document.getElementById('waBack').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('open')) close(); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-wa-open]'); if (b) { e.preventDefault(); haptic?.(8); open(b); } });
  paintQuick();
})();
