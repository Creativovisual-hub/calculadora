from lib import *
import math


def caps(cx, cy, w, h, ang):
    r = min(w, h) / 2
    return f"<rect x='{cx - w/2:.2f}' y='{cy - h/2:.2f}' width='{w}' height='{h}' rx='{r}' fill='{F}' stroke='{S}' stroke-width='{W}' transform='rotate({ang} {cx:.2f} {cy:.2f})'/>"


# ---------------- Apoyo (rehechos con más detalle)
ac_left = st('M19.5 7.5 L22.8 14.5 M5 24.2 L12.6 26.2 M22.8 14.5 L12.6 26.2 M22.8 14.5 C25.6 16.4 27.9 17.8 30.6 19.2 M12.6 26.2 C13.6 30.6 14.8 33.5 16.6 36.2')
ac_right = st('M59.5 22.8 L55.4 29.2 M47.2 11.2 C43.8 13.8 40.6 15.6 37 16.2 C34.4 16.6 32.3 17.7 30.6 19.2 '
              'M47 23.4 C41.4 23.8 37.2 22.6 32.3 24.6 C28.4 26.3 28.4 31.4 32.5 30.6 C35 30.1 37 28.2 39.8 27.8 '
              'M55.4 29.2 C53.8 31 52.6 32.6 52.2 34.2 '
              'M41.6 28.6 L51.8 39.4 C53.4 41.1 51.9 43.9 49.6 43.1 '
              'M39.2 34.2 L47 42.6 C48.6 44.3 47.1 47.1 44.8 46.3 '
              'M37.8 40.2 L42.4 45.4 C43.9 47.1 42.4 49.6 40.3 48.8 '
              'M37.4 46.6 C36.4 48.3 37.6 50.4 39.6 49.9')
ac_fingers = ''.join(caps(19.6 + i * 4.7, 39 + i * 4.7, 5.8, 10.5, 45) for i in range(4))
add('apoyo--acuerdo', stroke=ac_left + ac_right, accent=ac_fingers, anim='shake')

un_fist = ''.join(caps(14.8 + i * 5.4, 34.2 - i * 5.4, 7, 16, -45) for i in range(4))
un_hand = st('M31.5 9.6 C33 6.4 37 6 38.8 8.6 C40.6 7.2 43.8 7.8 44.6 10.6 C46.8 9.8 49.6 11.4 49.4 14.2 C51.9 14.2 54 16.8 52.8 19.4 '
             'C55.4 20.4 55.9 23.8 53.6 25.4 C55.6 27.6 55 31.2 51.8 32.2 L41.5 39.8 C36.5 43.4 30.5 44.8 24.5 43.4 '
             'M9.5 43.5 C12.6 40.6 16.2 40.2 19.2 42.2 L24.5 43.4 '
             'M24.5 43.4 C26.8 46 29.6 47.6 32.8 48 M32.8 48 L30.8 56.5 M32.8 48 C36.8 47.6 40 46.4 43 44.2 M43 44.2 L46.6 49.2 M51.8 32.2 L55.6 36.6')
add('apoyo--union', stroke=un_hand, accent=un_fist, anim='shake')

# ---------------- Nuevos (Trámites y app)
doc = 'M14 10 a4 4 0 0 1 4-4 H38 L48 16 V54 a4 4 0 0 1 -4 4 H18 a4 4 0 0 1 -4-4 Z M38 6 V16 H48'
add('tramites--licencia-medica', stroke=st(doc) + st('M20 24 H32 M20 30 H34 M20 36 H28'),
    accent=circ(44, 45, 11, True, True) + st('M44 39.5 V50.5 M38.5 45 H49.5'), anim='beat')
add('tramites--simulador-credito', fill=rect(18, 11, 28, 11, 2.5, True, False),
    stroke=rect(12, 5, 40, 54, 6) + rect(18, 11, 28, 11, 2.5) + st('M40 16.5 H42'),
    accent=''.join(rect(x, y, 6, 6, 2) for y in (29, 38, 47) for x in (18, 29)) + rect(40, 29, 6, 24, 2, True, True), anim='typing')
add('tramites--certificado', stroke=st('M10 10 a4 4 0 0 1 4-4 H50 a4 4 0 0 1 4 4 V38 M30 50 H14 a4 4 0 0 1 -4-4 V10 M18 17 H46 M18 24 H40 M18 31 H32'),
    accent=fs('M39 49 L36.5 59 L42 56.5 L46 60.5 L46 50 Z') + fs('M50 50 V60.5 L54 56.5 L59.5 59 L57 49 Z') + circ(48, 42, 9.5, True, True) + st(f"M44 42 L47 45 L52.5 39.5"), anim='pop')
idcard = lambda x, y, w, h, fillc: rect(x, y, w, h, 4, fillc, True)
add('tramites--cargas-familiares', stroke=st('M8 20 a4 4 0 0 1 4-4 H38 a4 4 0 0 1 4 4 V30 M24 46 H12 a4 4 0 0 1 -4-4 V20') + circ(18, 27, 4) + st('M11.5 40 C12.5 35.5 15 33.5 18 33.5 C21 33.5 23.5 35.5 24.5 40 M29 25 H37 M29 31 H34'),
    accent=rect(26, 34, 32, 22, 4, True, True) + circ(35, 42.5, 3.4).replace("fill='none'", "fill='#FFFFFF'") + st('M29.5 52 C30.3 48.3 32.4 46.6 35 46.6 C37.6 46.6 39.7 48.3 40.5 52 M45 42 H53 M45 47.5 H51') + circ(52, 13, 7.5, False, True).replace("fill='none'", f"fill='{F}'") + st('M52 9.5 V16.5 M48.5 13 H55.5'), anim='pop')
add('tramites--ubicacion', fill=fl('M6 18 L22 12 L42 18 L58 12 V46 L42 52 L22 46 L6 52 Z'),
    stroke=st('M6 18 L22 12 L42 18 L58 12 V46 L42 52 L22 46 L6 52 Z M22 12 V46 M42 18 V52'),
    accent=fs('M32 44 C32 44 21 33.5 21 25 A11 11 0 0 1 43 25 C43 33.5 32 44 32 44 Z') + circ(32, 25, 4).replace("fill='none'", "fill='#FFFFFF'"), anim='bounce')
add('tramites--notificacion', stroke=st('M32 8 V11'),
    accent=fs('M32 11 C24 11 18.5 17 18.5 25 V35 L14 42 H50 L45.5 35 V25 C45.5 17 40 11 32 11 Z') + st('M27 47 C27.5 50 29.5 52 32 52 C34.5 52 36.5 50 37 47') + circ(46, 13, 6, True, True), anim='swing')
add('tramites--clave', fill=rect(14, 28, 36, 28, 6, True, True),
    stroke=st('M32 38 a3.5 3.5 0 0 1 1.8 6.5 V49 H30.2 V44.5 A3.5 3.5 0 0 1 32 38 Z'),
    accent=st('M21 28 V20 a11 11 0 0 1 22 0 V28'), anim='lift')
add('tramites--identidad', fill=fl('M6 17 a5 5 0 0 1 5-5 H53 a5 5 0 0 1 5 5 V22 H6 Z'),
    stroke=rect(6, 12, 52, 40, 5) + st('M6 22 H58 M35 30 H50 M35 36.5 H50 M35 43 H44'),
    accent=circ(19.5, 33, 5) + st('M11.5 45.5 C12.6 40.6 15.6 38.4 19.5 38.4 C23.4 38.4 26.4 40.6 27.5 45.5'), anim='pop')
add('tramites--descarga', stroke=st(doc) + st('M20 24 H32 M20 30 H30'),
    accent=circ(44, 44, 11.5, True, True) + st('M44 37.5 V50 M39 45 L44 50 L49 45'), anim='bounce')
add('tramites--chat', fill=fs('M26 26 H52 a6 6 0 0 1 6 6 V46 a6 6 0 0 1 -6 6 H50 V59 L42 52 H32 a6 6 0 0 1 -6-6 Z'),
    stroke=ko('M12 6 H38 a6 6 0 0 1 6 6 V28 a6 6 0 0 1 -6 6 H22 L14 41 V34 H12 a6 6 0 0 1 -6-6 V12 a6 6 0 0 1 6-6 Z'),
    accent=dot(17, 20, 2.2) + dot(25, 20, 2.2) + dot(33, 20, 2.2), anim='typing')
add('tramites--descuento', fill='',
    stroke='',
    accent=fs('M34 6 H54 a4 4 0 0 1 4 4 V30 L32 56 a4 4 0 0 1 -5.7 0 L8 37.7 a4 4 0 0 1 0-5.7 Z') + circ(47, 17, 3.6).replace("fill='none'", "fill='#FFFFFF'") + st('M22 39 L36 25') + circ(23.5, 27.5, 3) + circ(34.5, 37.5, 3), anim='swing')
add('tramites--vivienda', stroke=st('M6 30 L30 10 L44 21.7 M54 30 L48.5 25.4 M12 25 V54 a4 4 0 0 0 4 4 H32 M48 25 V32'),
    fill=rect(18, 40, 11, 18, 2, True, True),
    accent=circ(46, 46, 12, True, True) + circ(42, 42, 3.6).replace("fill='none'", "fill='#FFFFFF'") + st('M44.6 44.6 L51.5 51.5 M48.6 48.6 L50.8 46.4 M50.4 50.4 L52.6 48.2'), anim='spin')

# ---- v2: concepto brandbook (línea con interior blanco + acento celeste parcial interno)
WH = lambda d: f"<path d='{d}' fill='#FFFFFF' stroke='{S}' stroke-width='{W}'/>"
add('tramites--ubicacion', fill=fl('M22 12 L42 18 V52 L22 46 Z'),
    stroke=st('M6 18 L22 12 L42 18 L58 12 V46 L42 52 L22 46 L6 52 Z M22 12 V46 M42 18 V52'),
    accent=WH('M32 44.5 C32 44.5 21 34 21 25.5 A11 11 0 0 1 43 25.5 C43 34 32 44.5 32 44.5 Z') + circ(32, 25.5, 5, True, False), anim='bounce')
add('tramites--descuento', fill='', stroke='',
    accent=st('M34 6 H54 a4 4 0 0 1 4 4 V30 L32 56 a4 4 0 0 1 -5.7 0 L8 37.7 a4 4 0 0 1 0-5.7 Z') + circ(29.5, 32.5, 10.5, True, False) + circ(47, 17, 3.6) + st('M23 39 L36 26') + circ(24.5, 28, 2.6) + circ(34.5, 37, 2.6), anim='swing')
add('tramites--notificacion', stroke=st('M32 7 V11'),
    accent=fl('M21.5 33 H42.5 L46.5 39.5 H17.5 Z') + st('M32 11 C24 11 18.5 17 18.5 25 V35 L14 42 H50 L45.5 35 V25 C45.5 17 40 11 32 11 Z') + st('M27 47 C27.5 50 29.5 52 32 52 C34.5 52 36.5 50 37 47') + circ(46, 13, 6, True, True), anim='swing')
add('tramites--clave', fill=fl('M18 42 a3 3 0 0 1 3-3 H43 a3 3 0 0 1 3 3 V49 a3 3 0 0 1 -3 3 H21 a3 3 0 0 1 -3-3 Z'),
    stroke=rect(14, 28, 36, 28, 6) + st('M32 36 a3.4 3.4 0 0 1 1.7 6.3 V46.5 H30.3 V42.3 A3.4 3.4 0 0 1 32 36 Z').replace("fill='none'", "fill='#FFFFFF'"),
    accent=st('M21 28 V20 a11 11 0 0 1 22 0 V28'), anim='lift')
add('tramites--vivienda', fill=fl('M17 40 H29 V55 H17 Z'),
    stroke=st('M6 30 L30 10 L44 21.7 M54 30 L48.5 25.4 M12 25 V54 a4 4 0 0 0 4 4 H32 M48 25 V32') + rect(18, 40, 11, 18, 2),
    accent=circ(46, 46, 12, True, True) + circ(42, 42, 3.6).replace("fill='none'", "fill='#FFFFFF'") + st('M44.6 44.6 L51.5 51.5 M48.6 48.6 L50.8 46.4 M50.4 50.4 L52.6 48.2'), anim='spin')
add('tramites--cargas-familiares', stroke=st('M8 20 a4 4 0 0 1 4-4 H38 a4 4 0 0 1 4 4 V30 M24 46 H12 a4 4 0 0 1 -4-4 V20') + circ(18, 27, 4) + st('M11.5 40 C12.5 35.5 15 33.5 18 33.5 C21 33.5 23.5 35.5 24.5 40 M29 25 H37 M29 31 H34'),
    accent=WH('M26 38 a4 4 0 0 1 4-4 H54 a4 4 0 0 1 4 4 V52 a4 4 0 0 1 -4 4 H30 a4 4 0 0 1 -4-4 Z') + fl('M27 38 a3 3 0 0 1 3-3 H54 a3 3 0 0 1 3 3 V40 H27 Z') + st('M26 40.5 H58') + circ(35, 46, 3) + st('M30 54.5 C30.8 51.4 32.6 50 35 50 C37.4 50 39.2 51.4 40 54.5 M45 46 H53 M45 50.5 H51') + circ(52, 13, 7.5, True, True) + st('M52 9.5 V16.5 M48.5 13 H55.5'), anim='pop')
add('tramites--chat', fill=WH('M26 26 H52 a6 6 0 0 1 6 6 V46 a6 6 0 0 1 -6 6 H50 V59 L42 52 H32 a6 6 0 0 1 -6-6 Z') + fl('M31 38 H53 V46 a2 2 0 0 1 -2 2 H33 a2 2 0 0 1 -2-2 Z'),
    stroke=WH('M12 6 H38 a6 6 0 0 1 6 6 V28 a6 6 0 0 1 -6 6 H22 L14 41 V34 H12 a6 6 0 0 1 -6-6 V12 a6 6 0 0 1 6-6 Z'),
    accent=dot(17, 20, 2.2) + dot(25, 20, 2.2) + dot(33, 20, 2.2), anim='typing')

# ---- v3: vivienda y notificación pulidos
add('tramites--vivienda', fill=fl('M22 43.5 a1.5 1.5 0 0 1 1.5-1.5 H29.5 a1.5 1.5 0 0 1 1.5 1.5 V58 H22 Z'),
    stroke=st('M6 29 L32 8 L58 29 M12 24.5 V54 a4 4 0 0 0 4 4 H34.5 M52 24.5 V33.5') + st('M20 58 V42 a2 2 0 0 1 2-2 H31 a2 2 0 0 1 2 2 V58'),
    accent=circ(47, 46, 12, True, True) + circ(43, 42, 3.6).replace("fill='none'", "fill='#FFFFFF'") + st('M45.6 44.6 L52.5 51.5 M49.6 48.6 L51.8 46.4 M51.4 50.4 L53.6 48.2'), anim='spin')
add('tramites--notificacion', stroke=st('M32 6.5 V11'),
    accent=fl('M21.2 34 H42.8 L46.6 39.8 H17.4 Z') + st('M32 11 C24 11 18.5 17 18.5 25 V34.5 L14 42 H50 L45.5 34.5 V25 C45.5 17 40 11 32 11 Z') + st('M27 42 A5 5 0 0 0 37 42') + circ(51, 11, 5.5, True, True), anim='swing')

# ---- nuevos: pensión, ahorro, subsidio, seguro
coinE = lambda cy: st(f'M14 {cy} C14 {cy-3.3} 20.3 {cy-6} 28 {cy-6} C35.7 {cy-6} 42 {cy-3.3} 42 {cy} V{cy+5} C42 {cy+8.3} 35.7 {cy+11} 28 {cy+11} C20.3 {cy+11} 14 {cy+8.3} 14 {cy+5} Z M14 {cy} C14 {cy+3.3} 20.3 {cy+6} 28 {cy+6} C35.7 {cy+6} 42 {cy+3.3} 42 {cy}')
add('tramites--pension',
    fill=fl('M17.5 22 C17.5 20 22.2 18.2 28 18.2 C33.8 18.2 38.5 20 38.5 22 C38.5 24 33.8 25.8 28 25.8 C22.2 25.8 17.5 24 17.5 22 Z'),
    stroke=coinE(44) + coinE(33) + coinE(22),
    accent=st(arc_arrow(40, 30, 19, -60, 70, 5.5)), anim='spin')
add('tramites--ahorro', fill=fl('M17 40 H47 V50 a6 6 0 0 1 -6 6 H23 a6 6 0 0 1 -6-6 Z'),
    stroke=st('M22 20 V24 C16 26.5 13 31 13 36 V52 a6 6 0 0 0 6 6 H45 a6 6 0 0 0 6-6 V36 C51 31 48 26.5 42 24 V20') + rect(19, 14, 26, 6, 3) + st('M24 46 a3 3 0 1 0 0.01 0 M35 44 a3 3 0 1 0 0.01 0'),
    accent=coin(32, 6.5, 6.5, True, 2.5), anim='drop')
add('tramites--subsidio', stroke=hand(40),
    accent=st('M30 18 L44 7 L58 18 M33.5 16 V30 H54.5 V16') + fl('M41 22.5 a1.5 1.5 0 0 1 1.5-1.5 h3 a1.5 1.5 0 0 1 1.5 1.5 V30 H41 Z') + st('M40 30 V22 a2 2 0 0 1 2-2 H46 a2 2 0 0 1 2 2 V30'), anim='lift')
umb_top = 'M6 32 C6 18.5 17.6 8 32 8 C46.4 8 58 18.5 58 32 C55.4 29.5 51.6 29.5 49 32 C46.4 29.5 42.6 29.5 40 32 C37.4 29.5 34.6 29.5 32 32 C29.4 29.5 25.6 29.5 23 32 C20.4 29.5 16.6 29.5 15 32 C12.4 29.5 8.6 29.5 6 32 Z'
add('tramites--seguro', fill=fl('M23 31.4 C25.6 29.5 29.4 29.5 32 31.4 C34.6 29.5 38.4 29.5 41 31.4 C40.5 19 36.8 9.5 32 8.2 C27.2 9.5 23.5 19 23 31.4 Z'),
    stroke=st(umb_top + ' M32 8.2 C27.2 9.5 23.5 19 23 31.4 M32 8.2 C36.8 9.5 40.5 19 41 31.4'),
    accent=st('M32 32 V51 a5 5 0 0 1 -10 0') + st('M32 5 V8'), anim='swing')

# ---- v2 pensión, ahorro, subsidio
add('tramites--pension',
    fill=fl('M17.5 17 C17.5 15 22.2 13.2 28 13.2 C33.8 13.2 38.5 15 38.5 17 C38.5 19 33.8 20.8 28 20.8 C22.2 20.8 17.5 19 17.5 17 Z'),
    stroke=st('M14 17 C14 13.7 20.3 11 28 11 C35.7 11 42 13.7 42 17 C42 20.3 35.7 23 28 23 C20.3 23 14 20.3 14 17 Z M14 17 V51 C14 54.3 20.3 57 28 57 C35.7 57 42 54.3 42 51 V17 M14 28.5 C14 31.8 20.3 34.5 28 34.5 C35.7 34.5 42 31.8 42 28.5 M14 40 C14 43.3 20.3 46 28 46 C35.7 46 42 43.3 42 40'),
    accent=st(arc_arrow(40, 31, 18, -55, 65, 5.5)), anim='spin')
ICONS['tramites--pension']=ICONS['tramites--pension'].replace("<g id='acento'>","<g id='moneda'>"+dollar(28, 39.5, 3.1)+"</g><g id='acento'>")
add('tramites--ahorro', fill=fl('M17 40 H47 V50 a6 6 0 0 1 -6 6 H23 a6 6 0 0 1 -6-6 Z'),
    stroke=st('M22 22 V25.5 C16 28 13 32.5 13 37.5 V52 a6 6 0 0 0 6 6 H45 a6 6 0 0 0 6-6 V37.5 C51 32.5 48 28 42 25.5 V22') + rect(19, 16, 26, 6, 3) + st('M24 46 a3 3 0 1 0 0.01 0 M35 44 a3 3 0 1 0 0.01 0'),
    accent=coin(32, 8.5, 5.5, True, 2.2), anim='drop')
add('tramites--subsidio', stroke=hand(40),
    accent=st('M27 20 L42.5 6 L58 20 M31 16.5 V32 H54 V16.5') + fl('M39.5 25 a1.5 1.5 0 0 1 1.5-1.5 h3 a1.5 1.5 0 0 1 1.5 1.5 V32 H39.5 Z') + st('M38.5 32 V24 a2 2 0 0 1 2-2 H44.5 a2 2 0 0 1 2 2 V32'), anim='lift')
