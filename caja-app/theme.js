// ---------- Apariencia del inicio público: Claro / Oscuro / Automático ----------
// Se elige en el menú público (Configuración). Se recuerda en este teléfono.
const themeSeg = $('#themeSeg');
const themeMQ = matchMedia('(prefers-color-scheme: dark)');
let themePref = 'light';
// Versión acotada: siempre modo claro (el selector de apariencia está oculto)

function applyTheme(animate) {
  const dark = themePref === 'dark' || (themePref === 'auto' && themeMQ.matches);
  const root = document.documentElement;
  if (animate && !reduceMotion) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 500); }
  root.classList.toggle('theme-dark', dark);
  $$('[data-theme-opt]', themeSeg).forEach(b => b.setAttribute('aria-checked', String(b.dataset.themeOpt === themePref)));
  const i = ['light', 'dark', 'auto'].indexOf(themePref);
  themeSeg.style.setProperty('--i', i);
  updateBar();
}
themeSeg.addEventListener('click', e => {
  const b = e.target.closest('[data-theme-opt]'); if (!b) return;
  themePref = b.dataset.themeOpt;
  try { localStorage.setItem('cla-tema-v2', themePref); } catch (_) {}
  haptic(8);
  applyTheme(true);
  toast(themePref === 'dark' ? 'Modo oscuro activado' : themePref === 'light' ? 'Modo claro activado' : 'Sigue el modo de tu teléfono', themePref === 'dark' ? '🌙' : themePref === 'light' ? '☀️' : '⚙️');
});
themeMQ.addEventListener?.('change', () => { if (themePref === 'auto') applyTheme(true); });
applyTheme(false);
// Botón rápido sol/luna arriba del menú
const themeQuick = $('#themeQuick');
function syncQuick() { const d = document.documentElement.classList.contains('theme-dark'); themeQuick.setAttribute('aria-label', d ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'); }
themeQuick.addEventListener('click', () => {
  themePref = document.documentElement.classList.contains('theme-dark') ? 'light' : 'dark';
  try { localStorage.setItem('cla-tema-v2', themePref); } catch (_) {}
  haptic(8); applyTheme(true); syncQuick();
  toast(themePref === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', themePref === 'dark' ? '🌙' : '☀️');
});
themeSeg.addEventListener('click', syncQuick);
syncQuick();
