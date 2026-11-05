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

  function err(code, message) { var e = new Error(message || code); e.code = code; return e; }
  function later(fn) { setTimeout(fn, 0); }
  function lsGet() { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; } }
  function lsSet(v) { try { if (v) localStorage.setItem(LS_KEY, JSON.stringify(v)); else localStorage.removeItem(LS_KEY); } catch (e) {} }

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
  var css = '' +
    '#dxdLogin{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;' +
    'background:radial-gradient(120% 90% at 80% 0%,#1a2070 0%,#06070d 60%);font-family:Manrope,system-ui,sans-serif;color:#f1f2ff}' +
    '#dxdLogin form{width:100%;max-width:360px;background:#0d1020;border:1px solid #262b4c;border-radius:20px;padding:28px 24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 30px 80px rgba(0,0,0,.5)}' +
    '#dxdLogin h1{margin:0;font-family:Syncopate,"Arial Black",sans-serif;font-size:22px;letter-spacing:.06em;' +
    'background:linear-gradient(135deg,#dcdaff 0%,#8a92ff 42%,#3141f0 100%);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '#dxdLogin p{margin:0 0 6px;color:#8d93ba;font-size:13px}' +
    '#dxdLogin label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:700;color:#c6c7ff}' +
    '#dxdLogin input{font:inherit;font-size:16px;color:#f1f2ff;background:#171b33;border:1px solid #262b4c;border-radius:12px;padding:12px 14px}' +
    '#dxdLogin input:focus{outline:2px solid #c6c7ff;outline-offset:1px}' +
    '#dxdLogin button{font:inherit;font-weight:800;font-size:15px;border:0;border-radius:12px;padding:13px;margin-top:4px;cursor:pointer;color:#fff;background:#3d4cff}' +
    '#dxdLogin button[disabled]{opacity:.6;cursor:wait}' +
    '#dxdLogin .err{min-height:18px;color:#ff6b7a;font-size:13px;font-weight:600}';

  function showLogin() {
    return new Promise(function (resolve) {
      function mount() {
        var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
        var box = document.createElement('div'); box.id = 'dxdLogin';
        box.innerHTML = '<form autocomplete="on" novalidate>' +
          '<h1>DXD</h1><p>Oficina virtual del equipo. Ingresa con tu usuario.</p>' +
          '<label>Usuario<input name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>' +
          '<label>Clave<input name="password" type="password" autocomplete="current-password" required></label>' +
          '<div class="err" role="alert"></div>' +
          '<button type="submit">Entrar</button></form>';
        document.body.appendChild(box);
        var f = box.querySelector('form'), u = f.username, p = f.password, b = f.querySelector('button'), e = f.querySelector('.err');
        setTimeout(function () { u.focus(); }, 50);
        f.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (!u.value.trim() || !p.value) { e.textContent = 'Escribe tu usuario y tu clave.'; return; }
          b.disabled = true; b.textContent = 'Entrando…'; e.textContent = '';
          rpc('dxd_login', { p_user: u.value, p_pass: p.value }).then(function (s) {
            if (!s || !s.token) { e.textContent = 'Usuario o clave incorrectos.'; p.value = ''; p.focus(); return; }
            lsSet(s); box.remove(); resolve(s);
          }, function () { e.textContent = 'No se pudo conectar. Revisa tu internet e intenta de nuevo.'; })
            .then(function () { b.disabled = false; b.textContent = 'Entrar'; });
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
      session = s; lsSet(s); prefillName(s.user); return s;
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
