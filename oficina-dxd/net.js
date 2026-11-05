/* Oficina DXD · login + conexión en vivo fuera de claude.ai.
 *
 * La oficina se escribió para el runtime de los artifacts de claude.ai
 * (window.claude.use('room' | 'db' | 'user')). Este archivo implementa esa
 * misma interfaz sobre Supabase para que funcione en Netlify:
 *   - Login con usuario y clave (tabla public.dxd_users, validado en la base de datos).
 *   - room -> Supabase Realtime (presence + broadcast) en un canal cuyo nombre
 *             secreto solo se entrega a quien inicia sesión.
 *   - db   -> chat y rankings a través de funciones dxd_* que exigen sesión válida.
 * Las tablas no se pueden leer directo con la clave pública.
 */
(function () {
  'use strict';
  var SUPABASE_URL = 'https://wmgdqegwwtxydsrubjka.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_Lc_U7a9MxoyE_XyemPOjDA_zK4o9T-e';
  var LS_KEY = 'dxd-session-v1';
  var SHARED_USERS = ['dxd'];

  function err(code, message) { var e = new Error(message || code); e.code = code; return e; }
  function later(fn) { setTimeout(fn, 0); }
  function lsGet() { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; } }
  function lsSet(v) { try { if (v) localStorage.setItem(LS_KEY, JSON.stringify(v)); else localStorage.removeItem(LS_KEY); } catch (e) {} }

  // La oficina queda oculta (fondo oscuro) hasta que la sesión esté validada.
  document.documentElement.classList.add('dxd-locked');
  var lockCss = document.createElement('style');
  lockCss.textContent = 'html.dxd-locked,html.dxd-locked body{background:#06070d!important}' +
    'html.dxd-locked body>*:not(#dxdLogin){visibility:hidden!important}';
  document.head.appendChild(lockCss);
  function unlock() { document.documentElement.classList.remove('dxd-locked'); }

  var hasSb = !!(window.supabase && typeof window.supabase.createClient === 'function');
  var sb = hasSb ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 40 } }
  }) : null;

  var session = null; // { token, user, room }
  function rpc(fn, args) {
    if (!sb) return Promise.reject(err('unavailable', 'Sin conexión'));
    return sb.rpc(fn, args).then(function (r) {
      if (r.error) {
        if (r.error.code === '28000' || /no_session/.test(r.error.message || '')) { onSessionLost(); throw err('not_permitted', 'Sesión vencida'); }
        if (r.error.code === '23514' || r.error.code === '22001') throw err('invalid_argument', r.error.message);
        throw err('unavailable', r.error.message);
      }
      return r.data;
    });
  }
  function onSessionLost() { lsSet(null); location.reload(); }

  /* ======================= Login ======================= */
  // Escena pixel: fachada de la Oficina DXD al atardecer, con la cordillera,
  // el letrero DXD, la puerta con el felpudo "BIENVENIDOS" y Dexi recibiendo.
  var css = '' +
    '#dxdLogin{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:flex-end;padding:16px 7vw;' +
    'background:#0b0f2a;font-family:Manrope,system-ui,sans-serif;color:#f1f2ff;overflow:hidden}' +
    '#dxdLogin canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges}' +
    '#dxdLogin form{position:relative;width:100%;max-width:360px;background:rgba(13,16,32,.94);border:1px solid #262b4c;border-radius:20px;padding:24px 22px 22px;' +
    'display:flex;flex-direction:column;gap:14px;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 4px rgba(61,76,255,.18)}' +
    '#dxdLogin .rec{display:flex;align-items:center;gap:12px}' +
    '#dxdLogin .rec img{width:46px;height:38px;image-rendering:pixelated;background:#171b33;border-radius:12px;padding:4px}' +
    '#dxdLogin .rec small{display:block;font-family:Silkscreen,monospace;font-size:10px;letter-spacing:.12em;color:#8d93ba}' +
    '#dxdLogin h1{margin:2px 0 0;font-family:Syncopate,"Arial Black",sans-serif;font-size:19px;letter-spacing:.06em;' +
    'background:linear-gradient(135deg,#dcdaff 0%,#8a92ff 42%,#3141f0 100%);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '#dxdLogin .say{position:relative;margin:0;background:#f1f2ff;color:#14162a;border-radius:12px;padding:10px 12px;font-size:13px;font-weight:600;line-height:1.4}' +
    '#dxdLogin .say:before{content:"";position:absolute;top:-6px;left:22px;border:6px solid transparent;border-top:0;border-bottom-color:#f1f2ff}' +
    '#dxdLogin label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:700;color:#c6c7ff}' +
    '#dxdLogin input{font:inherit;font-size:16px;color:#f1f2ff;background:#171b33;border:1px solid #262b4c;border-radius:12px;padding:12px 14px}' +
    '#dxdLogin input:focus{outline:2px solid #c6c7ff;outline-offset:1px}' +
    '#dxdLogin button{font:inherit;font-weight:800;font-size:15px;border:0;border-radius:12px;padding:13px;margin-top:2px;cursor:pointer;color:#fff;' +
    'background:linear-gradient(135deg,#8a92ff 0%,#3d4cff 60%,#2f3ff0 100%)}' +
    '#dxdLogin button[disabled]{opacity:.6;cursor:wait}' +
    '#dxdLogin .err{min-height:18px;color:#ff6b7a;font-size:13px;font-weight:600}' +
    '@media (max-width:760px){#dxdLogin{justify-content:center;align-items:flex-end;padding:16px 16px calc(20px + env(safe-area-inset-bottom,0px))}}';

  function drawScene(cv) {
    var vw = cv.clientWidth || innerWidth, vh = cv.clientHeight || innerHeight;
    var H = 180, W = Math.max(150, Math.round(H * vw / vh));
    cv.width = W; cv.height = H;
    var g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
    var narrow = vw < 760, bx = Math.round(narrow ? W / 2 : W * 0.34); // centro del edificio
    function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
    // cielo y estrellas
    var sky = g.createLinearGradient(0, 0, 0, 120);
    sky.addColorStop(0, '#070a1f'); sky.addColorStop(.55, '#1b2170'); sky.addColorStop(1, '#5a4fc2');
    g.fillStyle = sky; g.fillRect(0, 0, W, 120);
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var i = 0; i < W / 3; i++) R(rnd() * W, rnd() * 70, 1, 1, rnd() < .3 ? '#ffffff' : '#9aa2ff');
    g.fillStyle = '#f1f2ff'; g.beginPath(); g.arc(Math.round(W * .84), 20, 6, 0, 7); g.fill(); // luna creciente
    g.fillStyle = '#0a0e28'; g.beginPath(); g.arc(Math.round(W * .84) + 3, 18, 5, 0, 7); g.fill();
    // cordillera
    g.fillStyle = '#2a2f6e'; g.beginPath(); g.moveTo(0, 112);
    for (var x = 0; x <= W; x += 6) g.lineTo(x, 84 + Math.abs(Math.sin(x * .045)) * 20 + Math.sin(x * .13) * 4); g.lineTo(W, 120); g.lineTo(0, 120); g.fill();
    g.fillStyle = '#e8e9ff';
    for (var x2 = 0; x2 <= W; x2 += 6) { var y = 84 + Math.abs(Math.sin(x2 * .045)) * 20 + Math.sin(x2 * .13) * 4; if (y < 92) R(x2 - 2, y, 5, 3, '#e8e9ff'); }
    R(0, 108, W, 14, '#1c2050');
    // edificio
    var bw = 132, top = 38, x0 = bx - bw / 2;
    R(x0 - 4, top - 4, bw + 8, 6, '#262b4c'); R(x0, top, bw, 120 - top + 26, '#171b33');
    R(x0, top, 3, 120 - top + 26, '#262b4c'); R(x0 + bw - 3, top, 3, 120 - top + 26, '#0d1020');
    // letrero DXD
    R(bx - 34, top - 22, 68, 18, '#06070d'); R(bx - 34, top - 22, 68, 1, '#3d4cff'); R(bx - 34, top - 5, 68, 1, '#3d4cff');
    var sc = window.__dxdScene;
    if (sc && sc.drawMark) { sc.drawMark(g, bx - 30, top - 20, 14); }
    g.fillStyle = '#f1f2ff'; g.font = '700 10px Silkscreen, monospace'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText('DXD', bx - 8, top - 12.5);
    // ventanas (algunas encendidas, con pantallas)
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
      var wx = x0 + 10 + c * 19, wy = top + 8 + r * 17; if (r === 3 && (c === 2 || c === 3)) continue;
      var on = rnd() < .62; R(wx, wy, 14, 11, '#0b0d1c'); R(wx + 1, wy + 1, 12, 9, on ? '#ffd98a' : '#232850');
      if (on && rnd() < .5) { R(wx + 3, wy + 5, 6, 4, '#3d4cff'); R(wx + 5, wy + 9, 2, 1, '#14162a'); }
      if (on && rnd() < .3) R(wx + 9, wy + 4, 2, 5, '#3ddc97');
    }
    // puerta
    var dy = top + 8 + 3 * 17, dh = 120 + 26 - dy - 4;
    R(bx - 15, dy - 2, 30, dh + 2, '#0b0d1c'); R(bx - 13, dy, 12, dh, '#ffe6a8'); R(bx + 1, dy, 12, dh, '#ffe6a8');
    R(bx - 13, dy, 12, 2, '#fff4d6'); R(bx - 3, dy + dh / 2, 1, 4, '#8a6a2a'); R(bx + 2, dy + dh / 2, 1, 4, '#8a6a2a');
    // vereda, felpudo y jardín
    var gy = 146; R(0, gy - 2, W, 4, '#3a3d4f'); R(0, gy + 2, W, H - gy, '#3f8f4a');
    for (var s2 = 0; s2 < W; s2 += 16) R(s2, gy + 2, 8, H - gy, '#46994f');
    R(bx - 16, gy - 2, 32, H - gy + 2, '#cfc6b0'); for (var p = gy; p < H; p += 6) R(bx - 16, p, 32, 1, '#b9ae95');
    R(bx - 18, gy - 4, 36, 6, '#14162a'); for (var m = 0; m < 5; m++) R(bx - 15 + m * 7, gy - 2, 4, 2, m % 2 ? '#8a92ff' : '#3d4cff'); // felpudo
    // maceteros junto a la puerta
    [bx - 24, bx + 20].forEach(function (px) { R(px, gy - 9, 6, 6, '#c2603b'); R(px - 1, gy - 15, 8, 7, '#2f8a4a'); R(px + 1, gy - 17, 4, 3, '#3fb05f'); });
    // árboles y bancas
    function tree(tx) { R(tx - 1, gy - 2, 4, 14, '#6b4a2a'); g.fillStyle = '#2f8a4a'; g.beginPath(); g.arc(tx + 1, gy - 8, 10, 0, 7); g.fill();
      g.fillStyle = '#3fb05f'; g.beginPath(); g.arc(tx - 2, gy - 11, 6, 0, 7); g.fill(); }
    function bench(bx2) { R(bx2, gy + 10, 22, 3, '#8a5a32'); R(bx2, gy + 6, 22, 2, '#8a5a32'); R(bx2 + 2, gy + 13, 2, 4, '#3a2a1a'); R(bx2 + 18, gy + 13, 2, 4, '#3a2a1a'); }
    for (var t = x0 - 26; t > -12; t -= 46) tree(t);
    for (var t2 = x0 + bw + 26; t2 < W + 12; t2 += 46) tree(t2);
    bench(x0 - 30); bench(x0 + bw + 8);
    // Dexi en la puerta
    if (sc && sc.drawChar) { try { sc.drawChar(g, bx + 30, gy + 8, sc.DEXI_LOOK, 'down', 0, false, 1); } catch (e) {} }
  }

  function showLogin() {
    return new Promise(function (resolve) {
      function mount() {
        var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
        var box = document.createElement('div'); box.id = 'dxdLogin';
        var sc = window.__dxdScene, head = '';
        try { if (sc && sc.headURL) head = sc.headURL(sc.DEXI_LOOK); } catch (e) {}
        box.innerHTML = '<canvas aria-hidden="true"></canvas><form autocomplete="on" novalidate>' +
          '<div class="rec">' + (head ? '<img alt="" src="' + head + '">' : '') + '<div><small>RECEPCIÓN</small><h1>OFICINA DXD</h1></div></div>' +
          '<p class="say">¡Hola! Soy Dexi. Muéstrame tu acceso y te abro la puerta de la oficina.</p>' +
          '<label>Usuario<input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>' +
          '<label>Clave<input name="password" type="password" autocomplete="current-password" required></label>' +
          '<div class="err" role="alert"></div>' +
          '<button type="submit">Entrar a la oficina</button></form>';
        document.body.appendChild(box);
        var cv = box.querySelector('canvas'), redraw = function () { drawScene(cv); };
        redraw(); addEventListener('resize', redraw);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
        var f = box.querySelector('form'), u = f.username, p = f.password, b = f.querySelector('button'), e = f.querySelector('.err');
        setTimeout(function () { u.focus(); }, 50);
        f.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (!u.value.trim() || !p.value) { e.textContent = 'Escribe tu usuario y tu clave.'; return; }
          b.disabled = true; b.textContent = 'Abriendo la puerta…'; e.textContent = '';
          rpc('dxd_login', { p_user: u.value, p_pass: p.value }).then(function (s) {
            if (!s || !s.token) { e.textContent = 'Usuario o clave incorrectos.'; p.value = ''; p.focus(); return; }
            lsSet(s); removeEventListener('resize', redraw); box.remove(); resolve(s);
          }, function () { e.textContent = 'No se pudo conectar. Revisa tu internet e intenta de nuevo.'; })
            .then(function () { b.disabled = false; b.textContent = 'Entrar a la oficina'; });
        });
      }
      if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
    });
  }

  function prefillName(user) {
    var nice = user.charAt(0).toUpperCase() + user.slice(1);
    var tries = 0;
    (function fill() {
      var el = document.getElementById('nameIn');
      if (!el) { if (++tries < 40) setTimeout(fill, 100); return; }
      if (!el.value) { el.value = nice; el.dispatchEvent(new Event('input', { bubbles: true })); }
    })();
  }

  var ready = (function () {
    var saved = lsGet();
    var check = saved && saved.token
      ? rpc('dxd_me', { p_token: saved.token }).then(function (m) { return m ? { token: saved.token, user: m.user, room: m.room } : null; }, function () { return null; })
      : Promise.resolve(null);
    return check.then(function (s) { return s || showLogin(); }).then(function (s) {
      session = s; lsSet(s); unlock();
      if (SHARED_USERS.indexOf(String(s.user).toLowerCase()) < 0) prefillName(s.user); // usuario compartido: cada uno pone su nombre
      return s;
    });
  })();

  if (!sb) return; // sin supabase-js no hay nada más que hacer

  /* ======================= room ======================= */
  var myId = 'v' + Math.random().toString(36).slice(2, 12);
  var chatListeners = [];

  function makeRoom(name, minGap) {
    var ch = sb.channel(name, { config: { presence: { key: myId }, broadcast: { self: false } } });
    var mine = {}, states = {}, online = {};
    var peerCbs = [], connCbs = [], evCbs = {};
    var connected = false, closed = false, lastSend = 0, sendTimer = null, beat = null;

    function peers() {
      var list = [{ peer: myId, sameTab: true, isMe: true, guest: false, kind: 'viewer', presence: mine }];
      Object.keys(online).forEach(function (id) {
        if (id !== myId) list.push({ peer: id, sameTab: false, isMe: false, guest: false, kind: 'viewer', presence: states[id] || {} });
      });
      return list;
    }
    function firePeers() { var s = { peers: peers() }; peerCbs.forEach(function (cb) { try { cb(s); } catch (e) { console.error(e); } }); }
    function setConn(ok) { if (ok === connected) return; connected = ok; connCbs.forEach(function (cb) { try { cb(ok); } catch (e) { console.error(e); } }); }
    function sendNow() {
      sendTimer = null; if (!connected || closed) return; lastSend = Date.now();
      ch.send({ type: 'broadcast', event: 'st', payload: { id: myId, p: mine } });
    }
    function scheduleSend(force) {
      if (sendTimer) return;
      sendTimer = setTimeout(sendNow, force ? 0 : Math.max(0, minGap - (Date.now() - lastSend)));
    }

    ch.on('presence', { event: 'sync' }, function () {
      var st = ch.presenceState(), next = {};
      Object.keys(st).forEach(function (k) { next[k] = true; });
      Object.keys(states).forEach(function (k) { if (!next[k]) delete states[k]; });
      online = next; firePeers();
    });
    ch.on('presence', { event: 'join' }, function (e) { if (e && e.key !== myId) scheduleSend(true); });
    ch.on('broadcast', { event: 'st' }, function (m) {
      var p = m && m.payload;
      if (!p || typeof p.id !== 'string' || p.id === myId || !p.p || typeof p.p !== 'object') return;
      states[p.id] = p.p; if (!online[p.id]) online[p.id] = true; firePeers();
    });
    ch.on('broadcast', { event: 'ev' }, function (m) {
      var p = m && m.payload;
      if (!p || typeof p.ev !== 'string' || typeof p.id !== 'string') return;
      (evCbs[p.ev] || []).forEach(function (cb) { try { cb({ data: p.data, peer: p.id, sameTab: false, isMe: false }); } catch (e) { console.error(e); } });
    });
    ch.on('broadcast', { event: 'chat-new' }, function () { chatListeners.forEach(function (f) { f(); }); });

    ch.subscribe(function (status) {
      if (closed) return;
      if (status === 'SUBSCRIBED') { setConn(true); ch.track({ at: Date.now() }); scheduleSend(true); }
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setConn(false);
    });
    beat = setInterval(function () { scheduleSend(true); }, 5000);

    return {
      _ping: function () { if (connected) ch.send({ type: 'broadcast', event: 'chat-new', payload: {} }); },
      presence: function (p) {
        if (closed) return Promise.reject(err('closed'));
        if (p && typeof p === 'object') Object.keys(p).forEach(function (k) { mine[k] = p[k]; });
        scheduleSend(false); later(firePeers); return Promise.resolve();
      },
      emit: function (ev, data) {
        if (closed) return Promise.reject(err('closed'));
        later(function () { (evCbs[ev] || []).forEach(function (cb) { try { cb({ data: data, peer: myId, sameTab: true, isMe: true }); } catch (e) { console.error(e); } }); });
        if (!connected) return Promise.resolve();
        return ch.send({ type: 'broadcast', event: 'ev', payload: { id: myId, ev: ev, data: data } }).then(function () {});
      },
      on: function (ev, cb) { (evCbs[ev] = evCbs[ev] || []).push(cb); },
      onPeers: function (cb) { peerCbs.push(cb); later(function () { cb({ peers: peers() }); }); },
      onConnection: function (cb) { connCbs.push(cb); },
      peers: peers,
      connected: function () { return connected; },
      join: function (sub) { return Promise.resolve(makeRoom(name + ':' + String(sub).slice(0, 32), 50)); },
      leave: function () {
        if (closed) return Promise.resolve();
        closed = true; clearInterval(beat); clearTimeout(sendTimer);
        return sb.removeChannel(ch).then(function () {}, function () {});
      }
    };
  }

  /* ======================= db ======================= */
  function wrapDoc(row, pending) {
    var data = { text: row.text, name: row.name, look: row.look, t: Number(row.t), game: row.game, best: row.best };
    return { id: String(row.id), exists: true, data: function () { return data; }, metadata: { hasPendingWrites: !!pending } };
  }
  var myWrites = {};
  function isMine(r) { return !!myWrites[r.t + '|' + r.text]; }

  function chatQuery(lim) {
    return {
      orderBy: function () { return this; },
      limit: function (n) { return chatQuery(n); },
      onSnapshot: function (cb, onErr) {
        var seen = {}, first = true, busy = false, again = false;
        function load() {
          if (busy) { again = true; return; }
          busy = true;
          rpc('dxd_chat_list', { p_token: session.token, p_limit: lim || 120 }).then(function (rows) {
            rows = rows || []; var changes = [];
            rows.forEach(function (r) { var m = isMine(r); if (!seen[r.id]) changes.push({ type: 'added', doc: wrapDoc(r, m) }); seen[r.id] = true; });
            if (first || changes.length) {
              cb({ metadata: { fromCache: false }, docs: rows.map(function (r) { return wrapDoc(r, isMine(r)); }), docChanges: function () { return changes; } });
            }
            first = false;
          }, function (e) { if (first && onErr) { first = false; onErr(e); } })
            .then(function () { busy = false; if (again) { again = false; load(); } });
        }
        chatListeners.push(load);
        load();
        var poll = setInterval(load, 15000);
        return function () { clearInterval(poll); };
      }
    };
  }

  function scoresQuery(game, lim) {
    return {
      where: function (f, op, v) { return scoresQuery(f === 'game' ? v : game, lim); },
      orderBy: function () { return this; },
      limit: function (n) { return scoresQuery(game, n); },
      get: function () {
        return rpc('dxd_scores_top', { p_token: session.token, p_game: String(game), p_limit: lim || 10 })
          .then(function (rows) { return { docs: (rows || []).map(function (r) { return wrapDoc(r); }) }; });
      }
    };
  }

  function collection(name) {
    if (name === 'chat') {
      var q = chatQuery(0);
      q.add = function (obj) {
        myWrites[obj.t + '|' + obj.text] = true;
        return rpc('dxd_chat_add', { p_token: session.token, p_text: obj.text, p_name: obj.name, p_look: obj.look || null, p_t: obj.t })
          .then(function () { chatListeners.forEach(function (f) { f(); }); if (mainRoom) mainRoom._ping(); });
      };
      return q;
    }
    if (name === 'scores') {
      var s = scoresQuery('', 10);
      s.doc = function (id) {
        id = String(id);
        return {
          id: id,
          get: function () {
            return rpc('dxd_score_get', { p_token: session.token, p_id: id }).then(function (rows) {
              return rows && rows.length ? wrapDoc(rows[0]) : { id: id, exists: false, data: function () { return undefined; } };
            });
          },
          set: function (o) {
            return rpc('dxd_score_set', { p_token: session.token, p_id: id, p_game: o.game, p_name: o.name, p_look: o.look || null, p_best: o.best | 0, p_t: o.t });
          }
        };
      };
      return s;
    }
    throw err('invalid_argument', 'colección desconocida: ' + name);
  }

  /* ======================= window.claude ======================= */
  var mainRoom = null;
  window.claude = {
    use: function (cap) {
      return ready.then(function (s) {
        if (cap === 'room') { mainRoom = mainRoom || makeRoom('dxd-' + s.room, 120); return mainRoom; }
        if (cap === 'db') return { collection: collection };
        if (cap === 'user') return { can: function () { return Promise.resolve(true); } };
        throw err('not_supported', cap);
      });
    }
  };
})();
