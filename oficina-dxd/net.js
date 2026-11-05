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

  // Botón "Salir": invalida la sesión en el servidor, la borra del navegador y vuelve al login.
  // El nombre y el personaje guardados en este navegador se mantienen.
  window.dxdLogout = function () {
    var tok = session && session.token;
    lsSet(null);
    var done = function () { location.reload(); };
    if (tok && sb) rpc('dxd_logout', { p_token: tok }).then(done, done); else done();
    setTimeout(done, 2500);
  };

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

  // Escena viva del login: ciclo de día y noche, luces que se encienden,
  // nubes, pájaros, luciérnagas y animales paseando frente a la oficina.
  function hx(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) { var A = hx(a), B = hx(b); return '#' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0'); }).join(''); }
  function smooth(e0, e1, x) { var t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
  var CYCLE = 64; // segundos por día completo
  function phaseNow(t0, el) { var h = new Date().getHours() + new Date().getMinutes() / 60; // 6h amanecer, 12h día, 19h atardecer, 0h noche
    var p0 = h >= 6 && h < 18 ? .02 + (h - 6) / 12 * .38 : h >= 18 && h < 20 ? .40 + (h - 18) / 2 * .10 : h >= 20 ? .5 + (h - 20) / 10 * .4 : .5 + (h + 4) / 10 * .4;
    return (p0 + (el - t0) / 1000 / CYCLE) % 1; }
  function dark(p) { return p < .40 ? 0 : p < .52 ? smooth(.40, .52, p) : p < .90 ? 1 : 1 - smooth(.90, 1, p); }
  function warm(p) { return Math.max(0, 1 - Math.abs(p - .46) / .07) + Math.max(0, 1 - Math.abs(p - .95) / .06) + (p < .03 ? 1 - p / .03 : 0); }

  function makeScene(cv) {
    var g = cv.getContext('2d'), W = 300, H = 180, narrow = false, bx = 100, seed = 7, t0 = performance.now(), last = t0, run = true;
    var stars = [], wins = [], clouds = [], animals = [], birds = [], flies = [], nextSpawn = 0, greet = '';
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function R(x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function layout() {
      var vw = cv.clientWidth || innerWidth, vh = cv.clientHeight || innerHeight;
      W = Math.max(150, Math.round(H * vw / vh)); cv.width = W; cv.height = H; g.imageSmoothingEnabled = false;
      narrow = vw < 760; bx = Math.round(narrow ? W / 2 : W * .34); seed = 7;
      stars = []; for (var i = 0; i < W / 3; i++) stars.push([rnd() * W, rnd() * 72, rnd() < .3, rnd() * 6]);
      wins = []; var bw = 132, x0 = bx - bw / 2, top = 38;
      for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) { if (r === 3 && (c === 2 || c === 3)) continue;
        wins.push({ x: x0 + 10 + c * 19, y: top + 8 + r * 17, th: rnd() * .85 + .1, mon: rnd() < .5, plant: rnd() < .3 }); }
      if (!clouds.length) for (var k = 0; k < 4; k++) clouds.push({ x: rnd() * W, y: 10 + rnd() * 40, s: .6 + rnd() * .8, v: 2 + rnd() * 3 });
      flies = []; for (var f = 0; f < 14; f++) flies.push({ x: Math.random() * W, y: 150 + Math.random() * 28, ph: Math.random() * 6 });
    }
    var DOGS = [['#c98b3c', '#8a5a22'], ['#f2f2f2', '#3b2a20'], ['#3b2a20', '#1d140e'], ['#8a8a8a', '#4a4a4a'], ['#e8d2a8', '#b08a50'], ['#a0522d', '#5e2e14']];
    var CATS = ['#2b2222', '#f2a93b', '#dcdce6', '#7a6a5a'];
    function spawn(now) {
      var dir = Math.random() < .5 ? 1 : -1, x = dir > 0 ? -20 : W + 20, y = 152 + Math.random() * 24, k = Math.random(), sc0 = window.__dxdScene;
      if (k < .45 && sc0 && sc0.randLook) { // personas: caminan, trotan, pasean a su perro o entran a la oficina
        var jog = Math.random() < .2, dogw = !jog && Math.random() < .4, py = 147 + Math.random() * 4;
        var per = { t: 'person', look: sc0.randLook(), x: x, y: py, dir: dir, v: jog ? 32 : 15 + Math.random() * 6, walk: 0, stop: 0, enter: !dogw && !jog && Math.random() < .3 };
        animals.push(per);
        if (dogw) { var dd = DOGS[Math.floor(Math.random() * DOGS.length)]; animals.push({ t: Math.random() < .4 ? 'pup' : 'dog', c: dd[0], c2: dd[1], spot: Math.random() < .35, x: x + dir * 15, y: py + 3, dir: dir, v: per.v, walk: 0, stop: 0, owner: per }); }
        nextSpawn = now + 2000 + Math.random() * 3500; return;
      }
      if (k < .7) { var d = DOGS[Math.floor(Math.random() * DOGS.length)]; animals.push({ t: Math.random() < .3 ? 'pup' : 'dog', c: d[0], c2: d[1], spot: Math.random() < .35, x: x, y: y, dir: dir, v: 14 + Math.random() * 12, walk: 0, stop: 0 }); }
      else if (k < .86) animals.push({ t: 'cat', c: CATS[Math.floor(Math.random() * CATS.length)], x: x, y: y, dir: dir, v: 10 + Math.random() * 8, walk: 0, stop: 0 });
      else { var n = 2 + Math.floor(Math.random() * 3); for (var i = 0; i <= n; i++) animals.push({ t: i ? 'duckling' : 'duck', x: x - dir * i * 8, y: y, dir: dir, v: 9, walk: Math.random(), stop: 0 }); }
      nextSpawn = now + 2500 + Math.random() * 4000;
    }
    function drawDog(a) {
      var s = a.t === 'pup' ? .75 : 1, f = Math.floor(a.walk * 8) % 2, wag = Math.floor(performance.now() / 120) % 2;
      g.save(); g.translate(Math.round(a.x), Math.round(a.y)); g.scale(a.dir * s, s);
      R(-6, 0, 12, 1, 'rgba(0,0,0,.18)');
      var legs = a.stop ? [-4, -2, 2, 4] : f ? [-5, -2, 2, 5] : [-4, -1, 1, 4]; legs.forEach(function (lx) { R(lx, -3, 1, 3, a.c2); });
      R(-5, -7, 10, 4, a.c); if (a.spot) R(-2, -7, 3, 2, a.c2);
      var hy = a.stop ? -7 : -10; R(3, hy, 5, 4, a.c); R(7, hy + 2, 2, 2, a.c2); R(3, hy - 1, 2, 2, a.c2); R(6, hy + 1, 1, 1, '#111');
      R(-7, -9 + (wag ? -1 : 0), 2, 2, a.c); g.restore(); }
    function drawCat(a) {
      var f = Math.floor(a.walk * 8) % 2; g.save(); g.translate(Math.round(a.x), Math.round(a.y)); g.scale(a.dir, 1);
      R(-5, 0, 10, 1, 'rgba(0,0,0,.18)'); (f ? [-4, -1, 2, 4] : [-3, 0, 1, 3]).forEach(function (lx) { R(lx, -2, 1, 2, a.c); });
      R(-4, -5, 9, 3, a.c); R(4, -8, 4, 4, a.c); R(4, -9, 1, 1, a.c); R(7, -9, 1, 1, a.c); R(6, -7, 1, 1, '#ffd23d');
      R(-6, -9, 1, 5, a.c); R(-5, -10, 1, 1, a.c); g.restore(); }
    function drawDuck(a) {
      var b = a.t === 'duckling', f = Math.floor(a.walk * 6) % 2; g.save(); g.translate(Math.round(a.x), Math.round(a.y)); g.scale(a.dir, 1);
      if (b) { R(-2, -4, 4, 3, '#ffd23d'); R(1, -6, 2, 2, '#ffd23d'); R(3, -5, 1, 1, '#f2a93b'); R(-1 + f, -1, 1, 1, '#f2a93b'); }
      else { R(-4, -6, 7, 4, '#f6f6f6'); R(2, -10, 3, 4, '#f6f6f6'); R(5, -9, 2, 1, '#f2a93b'); R(3, -9, 1, 1, '#111'); R(-5, -6, 1, 2, '#e6e6e6'); R(-1 + f, -2, 1, 2, '#f2a93b'); R(1 - f, -2, 1, 2, '#f2a93b'); }
      g.restore(); }

    function frame(now) {
      var dt = Math.min(.1, (now - last) / 1000); last = now;
      var p = reduce ? phaseNow(t0, t0) : phaseNow(t0, now), d = dark(p), w = Math.min(1, warm(p)), lights = smooth(.36, .5, p) * (p < .93 ? 1 : 1 - smooth(.93, .98, p));
      // cielo
      var sky = g.createLinearGradient(0, 0, 0, 120);
      sky.addColorStop(0, mix(mix('#3d8fe0', '#070a1f', d), '#4a2a7a', w * .5));
      sky.addColorStop(.6, mix(mix('#7cc0ff', '#1b2170', d), '#e0607a', w * .7));
      sky.addColorStop(1, mix(mix('#cfeeff', '#5a4fc2', d), '#ffa04a', w * .85));
      g.fillStyle = sky; g.fillRect(0, 0, W, 120);
      // estrellas
      if (d > .05) for (var i = 0; i < stars.length; i++) { var st = stars[i], tw = .6 + .4 * Math.sin(now / 600 + st[3]); g.globalAlpha = d * tw; R(st[0], st[1], 1, 1, st[2] ? '#ffffff' : '#9aa2ff'); } g.globalAlpha = 1;
      // sol y luna (arco por el cielo)
      var sp = p < .5 ? p / .5 : null, mp = p >= .45 ? (p - .45) / .55 : null;
      if (sp !== null) { var sx = W * (.05 + .9 * sp), sy = 95 - Math.sin(sp * Math.PI) * 80; g.fillStyle = mix('#fff3b0', '#ff8a3d', w); g.beginPath(); g.arc(sx, sy, 7, 0, 7); g.fill();
        g.globalAlpha = .25; g.beginPath(); g.arc(sx, sy, 11, 0, 7); g.fill(); g.globalAlpha = 1; }
      if (mp !== null) { var mx = W * (.05 + .9 * mp), my = 95 - Math.sin(mp * Math.PI) * 78; g.fillStyle = '#f1f2ff'; g.beginPath(); g.arc(mx, my, 6, 0, 7); g.fill();
        g.fillStyle = mix('#3d8fe0', '#0a0e28', Math.min(1, d + .3)); g.beginPath(); g.arc(mx + 3, my - 2, 5, 0, 7); g.fill(); }
      // nubes
      for (var c = 0; c < clouds.length; c++) { var cl = clouds[c]; if (!reduce) cl.x += cl.v * dt; if (cl.x > W + 30) { cl.x = -30; cl.y = 10 + Math.random() * 40; }
        g.globalAlpha = .85 - d * .55; var cc = mix('#ffffff', '#3a3f7a', d); var s2 = cl.s; R(cl.x, cl.y, 22 * s2, 5 * s2, cc); R(cl.x + 4 * s2, cl.y - 3 * s2, 10 * s2, 4 * s2, cc); R(cl.x + 12 * s2, cl.y - 2 * s2, 7 * s2, 3 * s2, cc); g.globalAlpha = 1; }
      // pájaros de día, murciélagos de noche
      if (!reduce && Math.random() < dt * .25 && birds.length < 4) birds.push({ x: -10, y: 15 + Math.random() * 45, v: 18 + Math.random() * 14, ph: Math.random() * 6, bat: d > .6 });
      birds = birds.filter(function (b) { b.x += b.v * dt; var fl = Math.sin(now / (b.bat ? 70 : 140) + b.ph) > 0, col = b.bat ? '#14162a' : mix('#2a2f4e', '#111', d);
        R(b.x, b.y, 1, 1, col); R(b.x - 2, b.y + (fl ? -1 : 1), 2, 1, col); R(b.x + 1, b.y + (fl ? -1 : 1), 2, 1, col); return b.x < W + 10; });
      // cordillera
      g.fillStyle = mix('#7d8fd6', '#2a2f6e', d); g.beginPath(); g.moveTo(0, 112);
      for (var x = 0; x <= W; x += 6) g.lineTo(x, 84 + Math.abs(Math.sin(x * .045)) * 20 + Math.sin(x * .13) * 4); g.lineTo(W, 120); g.lineTo(0, 120); g.fill();
      for (var x2 = 0; x2 <= W; x2 += 6) { var yy = 84 + Math.abs(Math.sin(x2 * .045)) * 20 + Math.sin(x2 * .13) * 4; if (yy < 92) R(x2 - 2, yy, 5, 3, mix('#ffffff', '#c8cbf0', d)); }
      R(0, 108, W, 40, mix('#6f8fb4', '#1c2050', d)); // ciudad lejana
      for (var cx = 0; cx < W; cx += 13) { var chh = 6 + ((cx * 7) % 11); R(cx, 122 - chh, 9, chh + 4, mix('#8aa3c4', '#232860', d)); }
      R(0, 128, W, 18, '#4c9457'); for (var hx2 = 0; hx2 < W; hx2 += 8) R(hx2, 126, 6, 3, '#58a865'); // seto
      // edificio (colores de día; la noche se aplica con un velo)
      var bw = 132, top = 38, x0 = bx - bw / 2;
      R(x0 - 4, top - 4, bw + 8, 6, '#4a5288'); R(x0, top, bw, 108, '#3a4170'); R(x0, top, 3, 108, '#4a5288'); R(x0 + bw - 3, top, 3, 108, '#2a3058');
      R(bx - 34, top - 22, 68, 18, '#06070d'); R(bx - 34, top - 22, 68, 1, '#3d4cff'); R(bx - 34, top - 5, 68, 1, '#3d4cff');
      for (var wi = 0; wi < wins.length; wi++) { var wn = wins[wi]; R(wn.x, wn.y, 14, 11, '#1d2140'); R(wn.x + 1, wn.y + 1, 12, 9, mix('#a8d4ff', '#232850', d)); R(wn.x + 2, wn.y + 2, 4, 2, 'rgba(255,255,255,' + (.5 - d * .5) + ')'); }
      var dy = top + 8 + 3 * 17, dh = 146 - dy - 4;
      R(bx - 15, dy - 2, 30, dh + 2, '#14162a'); R(bx - 13, dy, 12, dh, '#bfe0ff'); R(bx + 1, dy, 12, dh, '#bfe0ff');
      // farolas
      var lamps = [x0 - 14, x0 + bw + 12];
      lamps.forEach(function (lx) { R(lx, 116, 2, 30, '#2a2f4e'); R(lx - 3, 114, 8, 3, '#2a2f4e'); R(lx - 2, 117, 6, 2, '#5a5f80'); });
      // vereda, camino y jardín
      var gy = 146; R(0, gy - 2, W, 4, '#7a7d8f'); R(0, gy + 2, W, H - gy, '#5cb85c'); for (var s3 = 0; s3 < W; s3 += 16) R(s3, gy + 2, 8, H - gy, '#66c266');
      R(bx - 16, gy - 2, 32, H - gy + 2, '#e3dac2'); for (var pp = gy; pp < H; pp += 6) R(bx - 16, pp, 32, 1, '#cfc4a8');
      R(bx - 18, gy - 4, 36, 6, '#14162a'); for (var m = 0; m < 5; m++) R(bx - 15 + m * 7, gy - 2, 4, 2, m % 2 ? '#8a92ff' : '#3d4cff');
      [bx - 24, bx + 20].forEach(function (px) { R(px, gy - 9, 6, 6, '#c2603b'); R(px - 1, gy - 15, 8, 7, '#3f9a55'); R(px + 1, gy - 17, 4, 3, '#55c06f'); });
      function tree(tx) { R(tx - 1, gy - 2, 4, 14, '#7b5530'); g.fillStyle = '#3f9a55'; g.beginPath(); g.arc(tx + 1, gy - 8, 10, 0, 7); g.fill(); g.fillStyle = '#55c06f'; g.beginPath(); g.arc(tx - 2, gy - 11, 6, 0, 7); g.fill(); }
      function bench(b2) { R(b2, gy + 10, 22, 3, '#9a6a3a'); R(b2, gy + 6, 22, 2, '#9a6a3a'); R(b2 + 2, gy + 13, 2, 4, '#4a3420'); R(b2 + 18, gy + 13, 2, 4, '#4a3420'); }
      for (var t = x0 - 30; t > -12; t -= 46) tree(t); for (var t2 = x0 + bw + 30; t2 < W + 12; t2 += 46) tree(t2);
      bench(x0 - 34); bench(x0 + bw + 14);
      // animales
      if (!reduce) { if (now > nextSpawn && animals.length < 9) spawn(now);
        animals.forEach(function (a) { if (a.stop > 0) { a.stop -= dt; return; } a.walk += dt;
          if (a.entering) { a.y -= 9 * dt; if (a.y < 141) a.gone = true; return; }
          a.x += a.dir * a.v * dt;
          if (a.enter && Math.abs(a.x - bx) < 2) { a.entering = true; a.x = bx; }
          if ((a.t === 'dog' || a.t === 'pup') && !a.owner && Math.random() < dt * .12) a.stop = .8 + Math.random() * 1.2; });
        animals = animals.filter(function (a) { return !a.gone && a.x > -40 && a.x < W + 40; }); }
      var near = null, sc = window.__dxdScene, dexX = bx + 30;
      animals.forEach(function (a) { if (!a.owner || a.owner.gone) return; g.strokeStyle = '#3a2a1a'; g.lineWidth = 1; g.beginPath();
        g.moveTo(Math.round(a.owner.x + a.dir * 4) + .5, Math.round(a.owner.y - 9) + .5); g.lineTo(Math.round(a.x + a.dir * 4) + .5, Math.round(a.y - 7) + .5); g.stroke(); });
      animals.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (a) { if (Math.abs(a.x - dexX) < 34 && !a.entering) near = a;
        if (a.t === 'person') { if (sc && sc.drawChar) try { sc.drawChar(g, a.x, a.y, a.look, a.entering ? 'up' : a.dir > 0 ? 'right' : 'left', Math.floor(a.walk * (a.v > 25 ? 12 : 8)) % 4, false, 1); } catch (e) {} }
        else if (a.t === 'cat') drawCat(a); else if (a.t === 'duck' || a.t === 'duckling') drawDuck(a); else drawDog(a); });
      if (sc && sc.drawChar) { try { sc.drawChar(g, dexX, gy + 8, sc.DEXI_LOOK, near ? (near.x < dexX ? 'left' : 'right') : 'down', 0, false, 1); } catch (e) {} }
      // velo de noche y tono cálido del atardecer
      if (d > 0) { g.fillStyle = 'rgba(8,10,40,' + (d * .6) + ')'; g.fillRect(0, 84, W, H - 84); g.fillRect(x0 - 4, top - 4, bw + 8, 50); }
      if (w > 0) { g.fillStyle = 'rgba(255,140,80,' + (w * .12) + ')'; g.fillRect(0, 0, W, H); }
      // luces: ventanas, puerta y farolas
      for (var wj = 0; wj < wins.length; wj++) { var wo = wins[wj]; if (lights > wo.th) { R(wo.x + 1, wo.y + 1, 12, 9, '#ffd98a'); if (wo.mon) { R(wo.x + 3, wo.y + 5, 6, 4, '#3d4cff'); R(wo.x + 5, wo.y + 9, 2, 1, '#14162a'); } if (wo.plant) R(wo.x + 9, wo.y + 4, 2, 5, '#3ddc97'); } }
      if (lights > .05) { g.globalAlpha = Math.min(1, lights * 1.5); R(bx - 13, dy, 12, dh, '#ffe6a8'); R(bx + 1, dy, 12, dh, '#ffe6a8'); R(bx - 13, dy, 12, 2, '#fff4d6');
        g.globalAlpha = lights * .22; g.fillStyle = '#ffd98a'; g.beginPath(); g.moveTo(bx - 14, gy); g.lineTo(bx + 14, gy); g.lineTo(bx + 26, H); g.lineTo(bx - 26, H); g.fill();
        lamps.forEach(function (lx) { g.globalAlpha = lights; R(lx - 2, 117, 6, 2, '#fff1b8');
          var rg = g.createRadialGradient(lx + 1, 119, 1, lx + 1, 128, 22); rg.addColorStop(0, 'rgba(255,225,140,.45)'); rg.addColorStop(1, 'rgba(255,225,140,0)');
          g.fillStyle = rg; g.beginPath(); g.moveTo(lx - 1, 118); g.lineTo(lx + 3, 118); g.lineTo(lx + 16, gy + 4); g.lineTo(lx - 14, gy + 4); g.fill(); });
        g.globalAlpha = 1; }
      R(bx - 13, dy + dh / 2, 1, 4, '#8a6a2a'); R(bx + 2, dy + dh / 2, 1, 4, '#8a6a2a');
      // letrero DXD (siempre iluminado)
      if (sc && sc.drawMark) sc.drawMark(g, bx - 30, top - 20, 14);
      g.fillStyle = '#f1f2ff'; g.font = '700 10px Silkscreen, monospace'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText('DXD', bx - 8, top - 12.5);
      // luciérnagas
      if (d > .4) flies.forEach(function (f) { var a = (Math.sin(now / 400 + f.ph) + 1) / 2 * (d - .4) / .6; if (a < .15) return; g.globalAlpha = a;
        R(f.x + Math.sin(now / 900 + f.ph) * 6, f.y + Math.cos(now / 700 + f.ph) * 3, 1, 1, '#eaff8a'); }); g.globalAlpha = 1;
      // saludo según la hora
      var gr = d > .7 ? 'noches' : (p >= .3 && p < .6) ? 'tardes' : 'días';
      if (gr !== greet) { greet = gr; var el = document.querySelector('#dxdLogin .say');
        if (el) el.textContent = '¡Buen' + (gr === 'días' ? 'os' : 'as') + ' ' + gr + '! Soy Dexi. Muéstrame tu acceso y te abro la puerta de la oficina.'; }
    }
    var acc = 0;
    function loop(now) { if (!run) return; if (now - acc >= 33) { acc = now; frame(now); } requestAnimationFrame(loop); }
    layout();
    return { start: function () { frame(performance.now()); if (!reduce) requestAnimationFrame(loop); },
      resize: function () { layout(); frame(performance.now()); }, stop: function () { run = false; } };
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
        var cv = box.querySelector('canvas'), scene = makeScene(cv), redraw = function () { scene.resize(); };
        scene.start(); addEventListener('resize', redraw);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
        var f = box.querySelector('form'), u = f.username, p = f.password, b = f.querySelector('button'), e = f.querySelector('.err');
        setTimeout(function () { u.focus(); }, 50);
        f.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (!u.value.trim() || !p.value) { e.textContent = 'Escribe tu usuario y tu clave.'; return; }
          b.disabled = true; b.textContent = 'Abriendo la puerta…'; e.textContent = '';
          rpc('dxd_login', { p_user: u.value, p_pass: p.value }).then(function (s) {
            if (!s || !s.token) { e.textContent = 'Usuario o clave incorrectos.'; p.value = ''; p.focus(); return; }
            lsSet(s); removeEventListener('resize', redraw); scene.stop(); box.remove(); resolve(s);
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
    var fresh = false;
    return check.then(function (s) { if (s) return s; fresh = true; return showLogin(); }).then(function (s) {
      session = s; lsSet(s); unlock();
      if (fresh) dispatchEvent(new CustomEvent('dxd:login', { detail: { user: s.user } })); // personaje nuevo en cada inicio de sesión
      if (SHARED_USERS.indexOf(String(s.user).toLowerCase()) < 0) prefillName(s.user); // usuario compartido: cada uno pone su nombre
      return s;
    });
  })();

  if (!sb) return; // sin supabase-js no hay nada más que hacer

  // Llamadas a funciones dxd_* con la sesión actual (cola de DJ, etc.)
  window.dxdRpc = function (fn, args) { return ready.then(function (s) { return rpc(fn, Object.assign({ p_token: s.token }, args || {})); }); };

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
