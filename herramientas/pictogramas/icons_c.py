from lib import *
import math


def pivot(cx, cy, r):
    return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='#FFFFFF' fill-opacity='0'/>"


def mirror(svgfrag):
    return f"<g transform='translate(64 0) scale(-1 1)'>{svgfrag}</g>"


# ---------------- Tiempo libre
add('tiempo-libre--gimnasio', stroke=st('M4 32 H60'),
    accent=rect(8, 22, 6, 20, 3, True, True) + rect(14, 12, 7.5, 40, 3.75, False, True).replace("fill='none'", "fill='#FFFFFF'") + rect(50, 22, 6, 20, 3, True, True) + rect(42.5, 12, 7.5, 40, 3.75, False, True).replace("fill='none'", "fill='#FFFFFF'"), anim='lift')
tk = 'M8 20 a3 3 0 0 1 3-3 H53 a3 3 0 0 1 3 3 V27 a5 5 0 0 0 0 10 V44 a3 3 0 0 1 -3 3 H11 a3 3 0 0 1 -3-3 V37 a5 5 0 0 0 0-10 Z'
add('tiempo-libre--entradas', accent="<g transform='rotate(-12 32 32)'>" + fl('M8 20 a3 3 0 0 1 3-3 H25 V47 H11 a3 3 0 0 1 -3-3 V37 a5 5 0 0 0 0-10 Z') + st(tk) + f"<path d='M41 19 V45' stroke='{S}' stroke-width='{W}' stroke-dasharray='4 3.6'/>" + "</g>", anim='swing')
sad = 'M30 8 H57 V21 C57 29.5 51 35 43.5 35 C38.5 35 34.3 32.6 32 28.8'
add('tiempo-libre--teatro', stroke=fs(sad + ' L30 22 Z') + st('M37.5 18 C39 16.5 41.5 16.5 43 18 M46.5 18 C48 16.5 50.5 16.5 52 18 M38.5 28 C42 25.5 47 25.5 50.5 28'),
    accent=ko('M7 30 H33 V44 C33 52 27 57.5 20 57.5 C13 57.5 7 52 7 44 Z') + st('M12 39 C13.5 37.5 16 37.5 17.5 39 M22.5 39 C24 37.5 26.5 37.5 28 39 M13.5 47 C17 50.5 23 50.5 26.5 47'), anim='swing')
add('tiempo-libre--deporte', fill=circ(32, 32, 17, True, False),
    accent=circ(32, 32, 26) + st('M32 6 V58 M6 32 H58 M17 11.5 C25.5 21 25.5 43 17 52.5 M47 11.5 C38.5 21 38.5 43 47 52.5'), anim='spin')
fork = "<g transform='rotate(-45 32 32)'>" + rect(29.5, 29, 5, 28, 2.5).replace("fill='none'", "fill='#FFFFFF'") + st('M25 7 V17 C25 21.5 28 24.5 32 24.5 C36 24.5 39 21.5 39 17 V7 M30 7 V18 M34 7 V18 M32 24.5 V29') + "</g>"
spoon = "<g transform='rotate(45 32 32)'>" + rect(29.5, 23, 5, 34, 2.5, True, True) + f"<ellipse cx='32' cy='14' rx='7.5' ry='9' fill='{F}' stroke='{S}' stroke-width='{W}'/>" + "</g>"
add('tiempo-libre--gastronomia', stroke="<g transform='translate(32 32) scale(1.18) translate(-32 -32)'>" + fork + '</g>', accent="<g transform='translate(32 32) scale(1.18) translate(-32 -32)'>" + spoon + '</g>', anim='pop')
add('tiempo-libre--creatividad', stroke=fs('M32 16 a12 12 0 0 1 7.5 21.4 V42 H24.5 V37.4 A12 12 0 0 1 32 16 Z') + st('M26 46.5 H38 M27.5 50.5 H36.5 M29.5 54.5 H34.5'),
    accent=st('M32 4 V9 M13.5 11.5 L17 15 M50.5 11.5 L47 15 M6 28 H11 M53 28 H58 M13.5 44.5 L17 41 M50.5 44.5 L47 41'), anim='blink')
add('tiempo-libre--descanso', fill=fl('M22 31 H48 a10 10 0 0 1 10 10 V47 H22 Z'),
    stroke=st('M6 22 V58 M6 47 H58 V58 M22 31 H48 a10 10 0 0 1 10 10 V47 M22 31 V47') + circ(14.5, 40.5, 5),
    accent=st('M13 21 H18.5 L13 27.5 H18.5 M21.5 14 H25.5 L21.5 19 H25.5'), anim='float')
add('tiempo-libre--actividad-fisica', fill=rect(15, 21, 11, 19, 2, True, False),
    stroke=st('M4 27 H12 M6 33 H14 M4 39 H11'),
    accent=circ(42.5, 10.5, 4.5) + st('M38 18 L32 34 M37.5 19 L45 26.5 H51.5 M36 19.5 L27 21.5 L22.5 28 M32 34 L42 41 L40 53 M32 34 L26.5 45.5 H15'), anim='slide')

# ---------------- Bienestar y beneficios
small_heart = lambda cx, cy, s: st(f'M{cx} {cy+2.6*s} L{cx-2.6*s} {cy} C{cx-3.4*s} {cy-0.8*s} {cx-3*s} {cy-2.5*s} {cx-1.6*s} {cy-2.6*s} C{cx-0.8*s} {cy-2.7*s} {cx-0.2*s} {cy-2.2*s} {cx} {cy-1.6*s} C{cx+0.2*s} {cy-2.2*s} {cx+0.8*s} {cy-2.7*s} {cx+1.6*s} {cy-2.6*s} C{cx+3*s} {cy-2.5*s} {cx+3.4*s} {cy-0.8*s} {cx+2.6*s} {cy} Z')
add('bienestar--beneficios', stroke=hand(40),
    accent=circ(15, 14, 6.5) + small_heart(15, 14.3, 1.25) + coin(32, 14, 6.5, True, 2.6) + circ(49, 14, 6.5) + st('M46 17 L52 11') + dot(46.5, 11.5, 1.2) + dot(51.5, 16.5, 1.2), anim='float')
leaves = fs('M44 26 C38 23 37 15 41 9 C46 12 47.5 20 44 26 Z') + fs('M44 26 C38 26 33 23 31.5 17 C37 15.5 42.5 19 44 26 Z') + fs('M45 26 C51 26 56 23 57.5 17 C52 15.5 46.5 19 45 26 Z')
add('bienestar--crecimiento-personal', stroke=hand(40), accent="<g transform='translate(44 30) scale(1.2) translate(-44 -26)'>" + leaves + '</g>', anim='grow')
lhand = st('M15 15 C10 22 9 32.5 13.5 40 L21.5 52.5 M17.5 29 L25 36.5 C28 39.5 30 43 30 47.5 V53 M20 53 H31')
add('bienestar--cuidado', stroke=lhand + mirror(lhand),
    accent=fs('M32 35 L23.5 26.5 C21 24 21.5 19.8 24.7 18.4 C27.1 17.4 29.6 18.2 32 20.8 C34.4 18.2 36.9 17.4 39.3 18.4 C42.5 19.8 43 24 40.5 26.5 Z'), anim='beat')
add('bienestar--regalo', fill=rect(17, 38, 30, 16, 2, True, False),
    stroke=st('M12 32 V54 a4 4 0 0 0 4 4 H48 a4 4 0 0 0 4-4 V32 M32 32 V58'),
    accent=rect(8, 22, 48, 10, 2.5) + st('M32 22 V32 M32 22 C28 14 18.5 11.5 19 17.5 C19.4 21.5 27 22 32 22 C37 22 44.6 21.5 45 17.5 C45.5 11.5 36 14 32 22'), anim='lift')

# ---------------- Metas y logros
star = lambda cx, cy, R, r: 'M' + ' L'.join(f"{cx + (R if i % 2 == 0 else r) * math.cos(math.radians(-90 + i * 36)):.2f} {cy + (R if i % 2 == 0 else r) * math.sin(math.radians(-90 + i * 36)):.2f}" for i in range(10)) + ' Z'
add('metas--trofeo', stroke=st('M18 7 H46 V24 C46 32 40 38 32 38 C24 38 18 32 18 24 Z M18 12 H10 V17 C10 23 14 27 18.5 27 M46 12 H54 V17 C54 23 50 27 45.5 27 M29 38 L28 48 M35 38 L36 48') + rect(23, 48, 18, 6.5, 3.25),
    accent=fs(star(32, 22, 8.5, 4)), anim='spin')
add('metas--medalla', stroke=st('M17 6 H24 L34.5 26 M21 30.5 L17 6') ,
    accent=fs('M41 6 H48 L40 27 L34.5 25 Z') + circ(32, 44, 14).replace("fill='none'", "fill='#FFFFFF'") + circ(32, 44, 9.5) + st('M29.5 41 L32.8 38.5 V50'), anim='swing')
add('metas--cumbre', stroke=st('M5 56 L19 33 L29.5 50 M23 41 L34 22 L50 50 M43 40 L49 31 L59 47'),
    accent=fl('M29.5 30 L34 22 L38.5 30 L36.3 28.2 L34 31 L31.7 28.2 Z') + st('M34 22 V9') + fs('M34 9 H42 V15 H34 Z') + st('M43 20 H50 M45 24 H55'), anim='swing')
add('metas--objetivo', stroke=circ(30, 36, 23) + circ(30, 36, 14) + circ(30, 36, 5.5),
    accent=st('M30 36 V8') + fs('M30 7 H44 V12 H52 V22 H38 V17 H30 Z'), anim='swing')

# ---------------- Tiempo y agenda
dots = ''.join(dot(x, y, 2.4) for y in (33, 43) for x in (21, 32, 43))
add('agenda--calendario', fill=fl('M6 17 a4 4 0 0 1 4-4 H54 a4 4 0 0 1 4 4 V23 H6 Z'),
    stroke=rect(6, 13, 52, 43, 4) + st('M6 23 H58 M20 7 V17 M44 7 V17'), accent=dots, anim='typing')
add('agenda--cronometro', fill=circ(34, 37, 14, True, False),
    stroke=circ(34, 37, 21) + circ(34, 10, 3) + st('M34 13 V16 M3.5 31 H11 M5.5 37 H12 M3.5 43 H11'),
    accent=pivot(34, 37, 11) + st('M34 29 V37 L40 42'), anim='tick')
digits = st('M21.5 27.5 C21.5 25 23.5 23.5 26 23.5 C28.5 23.5 30.3 25.2 30.3 27.5 C30.3 31 21.5 35.5 21.5 40.5 H30.5') + st('M40 23.5 L33 35 H43.5 M40 23.5 V40.5')
add('agenda--24-horas', fill=circ(32, 32, 17.5, True, False) + digits,
    accent=st(arc_arrow(32, 32, 26, 105, 245) + arc_arrow(32, 32, 26, 285, 425)), anim='spin')
ticks = ''.join(st(f"M{32 + 21.5*math.cos(math.radians(a)):.2f} {32 + 21.5*math.sin(math.radians(a)):.2f} L{32 + 24*math.cos(math.radians(a)):.2f} {32 + 24*math.sin(math.radians(a)):.2f}") for a in range(0, 360, 30))
add('agenda--reloj', fill=circ(32, 32, 16.5, True, False), stroke=circ(32, 32, 27) + ticks,
    accent=pivot(32, 32, 13) + st('M32 32 V20 M32 32 L26 37'), anim='tick')
add('agenda--reloj-pulsera', stroke=rect(15, 16, 34, 32, 7),
    fill=fs('M22 16 L24.5 6.5 H39.5 L42 16 Z') + fs('M22 48 L24.5 57.5 H39.5 L42 48 Z'),
    accent=pivot(32, 32, 11) + st('M32 32 V23 M32 32 L27 37'), anim='tick')
add('agenda--hora', fill=circ(32, 32, 19.5, True, False), stroke=circ(32, 32, 27),
    accent=pivot(32, 32, 13) + st('M32 32 V19.5 M32 32 L25 38'), anim='tick')
add('agenda--agendar', stroke=st('M6 33 V15 a4 4 0 0 1 4-4 H48 a4 4 0 0 1 4 4 V31 M34 50 H10 a4 4 0 0 1 -4-4 V33 M6 21 H52 M18 6 V14 M40 6 V14'),
    accent=circ(46.5, 46.5, 12.5, True, True) + st('M46.5 39.5 V46.5 H52'), anim='pop')
add('agenda--reunion', stroke=circ(36, 16, 7.5) + st('M23.5 58 V45 C23.5 37.5 29 32 36 32 C40.5 32 44 34 46 37.2') + circ(50, 23, 6.3) + st('M41.5 58 V47 C41.5 41.5 45.5 37.5 51 37.5 C56.5 37.5 60 41.5 60 47 V58'),
    accent=circ(12, 41, 8.5, True, True) + st('M12 36 V41 L15 43 M12 49.5 V58'), anim='pop')
