from lib import *

# ---------------- Viaje y turismo
plane = 'M60 32 C60 34.5 58 36.5 55.5 36.5 H41 L31 55 C30.4 56 29.4 56.5 28.3 56.5 H24.5 L28.5 36.5 H17.5 L14 42 C13.5 42.6 12.8 43 12 43 H8 L9.8 32 L8 21 H12 C12.8 21 13.5 21.4 14 22 L17.5 27.5 H28.5 L24.5 7.5 H28.3 C29.4 7.5 30.4 8 31 9 L41 27.5 H55.5 C58 27.5 60 29.5 60 32 Z'
add('viaje--avion', accent=f"<g transform='rotate(-45 32 32)'>{fl('M41 36.5 L31 55 C30.4 56 29.4 56.5 28.3 56.5 H24.5 L28.5 36.5 Z')}{st(plane)}</g>", anim='fly')
add('viaje--maleta-viaje', stroke=st('M25 16 V9 a3 3 0 0 1 3-3 h8 a3 3 0 0 1 3 3 V16') + rect(14, 16, 36, 42, 6),
    accent=fl('M18 36 a4 4 0 0 1 4-4 h20 a4 4 0 0 1 4 4 V54 H18 Z') + st('M26 26 V44 M32 26 V44 M38 26 V44'), anim='bounce')
add('viaje--maletin', fill=fl('M11 41 a6 6 0 0 1 6-6 h30 a6 6 0 0 1 6 6 V51 H11 Z'),
    stroke=rect(4, 17, 56, 38, 7) + st('M22 27 H42'), accent=st('M22 17 V12 a4 4 0 0 1 4-4 h12 a4 4 0 0 1 4 4 V17'), anim='lift')
win = ''.join(rect(x, y, 4, 4, 1) for y in (26, 33, 40) for x in (25, 33))
add('viaje--hotel', fill=fl('M20 24 H40 V58 H20 Z'),
    stroke=st('M6 58 H58') + st('M8 58 V12 H18 V58 M10 12 V9 a2 2 0 0 1 2-2 h2 a2 2 0 0 1 2 2 V12') + st('M20 58 V22 H40 V58 M25 22 V17 H35 V22 M30 17 V11') + st('M27 58 V51 a3 3 0 0 1 6 0 V58') + st('M40 58 V11 L56 19 V58 M46 58 V42 H51 V58'),
    accent=win, anim='blink')

# ---------------- Salud y seguridad
add('salud--centro-medico', stroke=st('M4 58 H60') + st('M10 58 V13 a7 7 0 0 1 7-7 h30 a7 7 0 0 1 7 7 V58') + st('M25 58 V45 a4 4 0 0 1 4-4 h6 a4 4 0 0 1 4 4 V58'),
    accent=circ(32, 22, 9, True, False) + st('M32 17 V27 M27 22 H37'), anim='pulse')
add('salud--proteccion', stroke=st('M32 6 L52 13 V30 C52 44 43.5 53 32 58 C20.5 53 12 44 12 30 V13 Z'),
    accent=circ(32, 32, 12, True, False) + st('M26 32 L30.5 36.5 L39 27.5'), anim='pop')
add('salud--salud', accent=circ(32, 30, 12, True, False) + st('M32 58 L9.5 35.5 C2.5 28.5 4 16.5 13 12.5 C20 9.5 27 12 32 18.5 C37 12 44 9.5 51 12.5 C60 16.5 61.5 28.5 54.5 35.5 Z') + st('M32 23 V37 M25 30 H39'), anim='beat')
clip = st('M24 14 V11 a3 3 0 0 1 3-3 h1.5 a3.5 3.5 0 0 1 7 0 H37 a3 3 0 0 1 3 3 V14 a2 2 0 0 1 -2 2 H26 a2 2 0 0 1 -2-2 Z')
board = st('M24 11 H16 a4 4 0 0 0 -4 4 V54 a4 4 0 0 0 4 4 H38 M40 11 H43 a4 4 0 0 1 4 4 V31')
lines = st('M18 25 H32 M18 32 H31 M18 39 H29')
heart = 'M49 61 L37.8 49.8 C34.4 46.4 35.1 40.6 39.5 38.7 C42.8 37.3 46.3 38.4 49 41.6 C51.7 38.4 55.2 37.3 58.5 38.7 C62.9 40.6 63.6 46.4 60.2 49.8 Z'
add('salud--ficha-salud', stroke=board + clip + lines, accent=fs(heart) + st('M49 43 V53 M44 48 H54'), anim='beat')
shield = 'M49 34 L61 38.5 V47.5 C61 54.5 56 59 49 62 C42 59 37 54.5 37 47.5 V38.5 Z'
add('salud--ficha-seguro', stroke=board + clip + lines, accent=fs(shield) + st('M43.5 47.5 L47.5 51.5 L54.5 44.5'), anim='pop')

# ---------------- Finanzas
add('finanzas--moneda', stroke=circ(32, 32, 26), accent=coin(32, 32, 19, True, 8).replace(f"stroke='{S}' stroke-width='{W}'/>", "/>", 1), anim='flip')
pig = ('M15 36 C15 27 22.5 22 32 22 C41.5 22 49 27 49 36 C49 41.5 46.5 45.5 43 48 V55 a2 2 0 0 1 -2 2 h-3 a2 2 0 0 1 -2-2 V51.5 H28 V55 a2 2 0 0 1 -2 2 h-3 a2 2 0 0 1 -2-2 V48 '
       'C18.8 46.5 17.2 44.5 16.3 42 H12.5 a2 2 0 0 1 -2-2 V35 a2 2 0 0 1 2-2 H15.5 M19.5 26.5 L18.5 19 L26.5 23.2 M49 35 C53 35.5 55 33 53.5 30.8')
add('finanzas--alcancia', stroke=st(pig) + dot(22.5, 31.5, 1.6), accent=coin(45, 13, 9, True, 3.6), anim='drop')
add('finanzas--billete', stroke=rect(6, 16, 52, 32, 5) + st('M13 16 a7 7 0 0 1 -7 7 M51 16 a7 7 0 0 0 7 7 M6 41 a7 7 0 0 1 7 7 M58 41 a7 7 0 0 0 -7 7'),
    accent=circ(32, 32, 10, True, False) + dollar(32, 32, 4.2), anim='pulse')
add('finanzas--transferencia', stroke=st(arc_arrow(32, 32, 25.5, 105, 245) + arc_arrow(32, 32, 25.5, 285, 425)),
    accent=circ(32, 32, 15, True, False) + dollar(32, 32, 6.2), anim='spin')
add('finanzas--pago-tarjeta', stroke=hand(),
    accent=fl('M30 9 a3 3 0 0 1 3-3 h20 a3 3 0 0 1 3 3 V12 H30 Z') + rect(30, 6, 26, 19, 3) + st('M30 12 H56 M41 19 H51') + dot(35, 19), anim='lift')
add('finanzas--tarjeta', fill=fl('M6 19 a5 5 0 0 1 5-5 h42 a5 5 0 0 1 5 5 V22 H6 Z'),
    stroke=rect(6, 14, 52, 36, 5) + st('M6 22 H58 M38.5 37 H54 M41 42 H50') + dot(14.5, 38, 2), accent='', anim='none')
add('finanzas--cajero', stroke=st('M4 58 H60') + st('M12 58 V13 a6 6 0 0 1 6-6 H46 a6 6 0 0 1 6 6 V58') + st('M25 58 V46 a4 4 0 0 1 4-4 h6 a4 4 0 0 1 4 4 V58'),
    accent=circ(32, 23, 9, True, False) + dollar(32, 23, 3.8), anim='flip')
cols = ''.join(rect(x, 27, 9, 22, 4.5) for x in (13.5, 27.5, 41.5))
add('finanzas--banco', fill=fl('M8 18 H56 V24 H8 Z'), stroke=st('M32 6 L56 18 H8 Z') + rect(8, 18, 48, 6, 1) + cols + st('M10 52.5 H54 M6 57.5 H58'), anim='none')
add('finanzas--monedas', stroke=st('M22.5 22.5 A10.5 10.5 0 1 1 40 12.5') + dollar(31.5, 15.5, 3.8),
    accent=coin(44, 36, 11.5, True, 4.4) + circ(24, 41, 11.5, False, True, knock=True) + dollar(24, 41, 4.4), anim='stack')
add('finanzas--balanza', stroke=st('M32 13 V56 M20 56.5 H44') + circ(32, 10, 3) + st('M14 20.5 L50 14.5'),
    accent=st('M14 20.5 L8.5 33.5 M14 20.5 L19.5 33.5') + coin(14, 40, 7, True, 2.8) + st('M50 14.5 L44.5 27.5 M50 14.5 L55.5 27.5') + coin(50, 34, 7, True, 2.8), anim='swing')
bag = 'M24.5 21 C16 25 9.5 34.5 10 45 C10.5 53 15 57.5 23 57.5 H36 M38.5 21 C42.5 23.5 45.5 27 47.3 31.5 M24.5 21 H38.5 M25 21 L21.5 12.5 L28.5 14 L31.5 9.5 L34.5 14 L41.5 12.5 L38.5 21'
stack = ''.join(fs(f'M{x} {y} h13 a2.6 2.6 0 0 1 0 5.2 h-13 a2.6 2.6 0 0 1 0-5.2 Z') for x, y in ((41, 36), (43, 41.6), (41, 47.2), (43, 52.8)))
add('finanzas--bolsa-dinero', stroke=st(bag) + dollar(28, 40, 5.5), accent=stack, anim='stack')
add('finanzas--billetera', stroke=rect(6, 18, 48, 37, 5) + st('M8.5 22.5 H28'),
    accent=fs('M24 22.5 L43 11.5 C44.2 10.8 45.6 11.2 46.3 12.3 L52 22.5 Z'), fill='', anim='lift')
ICONS['finanzas--billetera'] = ICONS['finanzas--billetera'].replace('</svg>', f"<g id='broche'>{rect(46, 31, 14, 10, 5).replace('none', '#FFFFFF', 1)}{circ(51.5, 36, 1.6)}</g></svg>")
add('finanzas--seguro-financiero', stroke=st('M40.5 8.6 L32 6 L12 13 V30 C12 44 20.5 53 32 58 C42 53.5 48.5 46 51 35.5') + st('M22 38 L27.5 43.5 L37 34'),
    accent=coin(47, 15, 9, True, 3.6), anim='drop')
bar = lambda x, y, fill: (fs if fill else st)(f'M{x} 56 V{y+3.5} a3.5 3.5 0 0 1 7 0 V56' + (' Z' if fill else ''))
add('finanzas--crecimiento', stroke=st('M6 56.5 H58'), fill='',
    accent=bar(11, 44, False) + bar(21, 38, True) + bar(31, 31, False) + bar(41, 23, True) + st('M12 34 L47 14 M40.5 13 L47 14 L44 20'), anim='grow')
minibars = ''.join(st(f'M{x} 26 V{y+2.5} a2.5 2.5 0 0 1 5 0 V26') for x, y in ((31, 17), (38.5, 13), (46, 9)))
add('finanzas--inversion', stroke=hand(36) + st('M27 26.5 H58'), accent=minibars + coin(14, 13, 8, True, 3.2), anim='grow')
aw_top = 'M14 8 H50 L59 24 a5.4 5.4 0 0 1 -10.8 0 a5.4 5.4 0 0 1 -10.8 0 a5.4 5.4 0 0 1 -10.8 0 a5.4 5.4 0 0 1 -10.8 0 a5.4 5.4 0 0 1 -10.8 0 Z'
stripes = fl('M14 8 H21.2 L15.8 24 a5.4 5.4 0 0 1 -10.8 0 Z') + fl('M28.4 8 H35.6 L37.4 24 a5.4 5.4 0 0 1 -10.8 0 Z') + fl('M42.8 8 H50 L59 24 a5.4 5.4 0 0 1 -10.8 0 Z')
add('finanzas--comercio', stroke=st('M10 30 V54 a4 4 0 0 0 4 4 H50 a4 4 0 0 0 4-4 V30') + rect(16, 35, 9, 8, 1) + st('M34 58 V44 a5 5 0 0 1 10 0 V58'),
    accent=stripes + st(aw_top + ' M21.2 8 L15.8 24 M28.4 8 L26.6 24 M35.6 8 L37.4 24 M42.8 8 L48.2 24'), anim='swing')
