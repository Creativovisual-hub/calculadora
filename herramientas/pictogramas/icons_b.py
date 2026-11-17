from lib import *

# ---------------- Educacional
add('educacion--graduacion', fill=fs('M14 27 V40 C14 44.5 22 48 32 48 C42 48 50 44.5 50 40 V27 L32 35 Z'),
    stroke=st('M4 22 L32 10 L60 22 L32 34 Z'),
    accent=st('M32 22 L54 26 V38') + circ(54, 40.5, 2.2) + fs('M51.6 47.5 L54 42.7 L56.4 47.5 Z'), anim='swing')
book_back = 'M6 18 H11 V48 H25 a4 4 0 0 1 4 4 H35 a4 4 0 0 1 4-4 H53 V18 H58 V53 a3 3 0 0 1 -3 3 H39 l-2 3 h-10 l-2-3 H9 a3 3 0 0 1 -3-3 Z'
pageL = 'M11 14 a3 3 0 0 1 3-3 H27 a5 5 0 0 1 5 5 V52 a5 5 0 0 0 -5-5 H11 Z'
pageR = 'M53 14 a3 3 0 0 0 -3-3 H37 a5 5 0 0 0 -5 5 V52 a5 5 0 0 1 5-5 H53 Z'
add('educacion--libro-abierto', fill=fs(book_back), stroke=ko(pageL) + ko(pageR),
    accent=st('M16 21 H26 M16 27.5 H26 M16 34 H26 M38 21 H48 M38 27.5 H48 M38 34 H48'), anim='blink')
pencil = "<g transform='rotate(40 47 31)'>" + ko('M44 13 a3 3 0 0 1 6 0 V41 H44 Z') + st('M44 41 L47 47 L50 41 M44 18 H50') + "</g>"
add('educacion--libro-notas', fill=fs(book_back), stroke=ko(pageL) + ko(pageR) + st('M16 21 H26 M16 27.5 H26 M16 34 H26'), accent=pencil, anim='write')
lect_back = 'M7 20 H12 V50 C18 48 26 49 32 54 C38 49 46 48 52 50 V20 H57 V54 H38 L32 57.5 L26 54 H7 Z'
add('educacion--lectura', fill=fs(lect_back),
    stroke=ko('M32 54 C26 49 18 48 12 50 V13 C18 11 26 12.5 32 18 Z') + ko('M32 18 C38 12.5 46 11 52 13 V50 C46 48 38 49 32 54 Z'),
    accent=st('M32 18 V54'), anim='float')
add('educacion--libro', fill=fl('M14 52 V10 a4 4 0 0 1 4-4 H20 V48 H18 a4 4 0 0 0 -4 4 Z'),
    stroke=st('M14 52 V10 a4 4 0 0 1 4-4 H52 V48 H18 a4 4 0 0 0 0 8 H52 M20 6 V48 M30 56 H52') + st('M22 52 V60 L25 57.5 L28 60 V52'),
    accent=rect(30, 20, 22, 12, 3, True, False), anim='pop')
clipT = lambda x: st(f'M{x-8} 14 V11 a3 3 0 0 1 3-3 h1.5 a3.5 3.5 0 0 1 7 0 H{x+5} a3 3 0 0 1 3 3 V14 a2 2 0 0 1 -2 2 H{x-6} a2 2 0 0 1 -2-2 Z')
add('educacion--portapapeles', fill=fl('M20 46 a2 2 0 0 1 2-2 h20 a2 2 0 0 1 2 2 V54 H20 Z'),
    stroke=st('M24 11 H18 a4 4 0 0 0 -4 4 V54 a4 4 0 0 0 4 4 H46 a4 4 0 0 0 4-4 V15 a4 4 0 0 0 -4-4 H40') + clipT(32),
    accent=st('M20 23 H38 M20 29 H34 M20 35 H30'), anim='blink')
pencil2 = "<g transform='rotate(40 44 38)'>" + ko('M41 23 a3 3 0 0 1 6 0 V47 H41 Z') + st('M41 47 L44 52.5 L47 47 M41 28 H47') + "</g>"
add('educacion--portapapeles-editar', fill=fl('M14 47 a2 2 0 0 1 2-2 h16 a2 2 0 0 1 2 2 V54 H14 Z'),
    stroke=st('M18 11 H12 a4 4 0 0 0 -4 4 V54 a4 4 0 0 0 4 4 H40 a4 4 0 0 0 4-4 V53 M34 11 H40 a4 4 0 0 1 4 4 V30') + clipT(26) + st('M14 23 H32 M14 29 H28 M14 35 H24'),
    accent=pencil2, anim='write')

# ---------------- Dispositivos
phone = lambda x=18, w=28: rect(x, 6, w, 52, 6) + st(f'M{x + w/2 - 3} 11 H{x + w/2 + 3}') + dot(x + w/2, 52, 2.3)
add('dispositivos--celular', stroke=phone(), accent=rect(22.5, 16, 19, 28, 2.5, True, False), anim='blink')
add('dispositivos--pago-movil', stroke=rect(26, 6, 26, 52, 6) + st('M36 11 H42') + dot(39, 52, 2.3),
    accent=st('M8 27 a3 3 0 0 1 3-3 H35 a3 3 0 0 1 3 3 V41 a3 3 0 0 1 -3 3 H11 a3 3 0 0 1 -3-3 Z').replace("fill='none'", "fill='#FFFFFF'") + fl('M8 27 a3 3 0 0 1 3-3 H35 a3 3 0 0 1 3 3 V30 H8 Z') + st('M8 30 H38 M20 39 H30') + dot(13, 39, 1.3), anim='slide')
store_aw = 'M34 30 L37 24 H55 L58 30 a3 3 0 0 1 -6 0 a3 3 0 0 1 -6 0 a3 3 0 0 1 -6 0 a3 3 0 0 1 -6 0 Z'
add('dispositivos--tienda-movil', stroke=st('M42 21 V12 a6 6 0 0 0 -6-6 H20 a6 6 0 0 0 -6 6 V52 a6 6 0 0 0 6 6 H36 a6 6 0 0 0 6-6 V51') + st('M25 11 H31') + dot(28, 52, 2.3),
    accent=fs(store_aw) + st('M41 24 L40 30 M46 24 V30 M51 24 L52 30') + ko('M36 34 V48 H56 V34') + fl('M37 35 H55 V47 H37 Z').replace(F, F) + st('M43 48 V42 a3 3 0 0 1 6 0 V48'), anim='pop')
add('dispositivos--salud-movil', stroke=st('M46 25 V12 a6 6 0 0 0 -6-6 H24 a6 6 0 0 0 -6 6 V52 a6 6 0 0 0 6 6 H40 a6 6 0 0 0 6-6 V51') + st('M29 11 H35') + dot(32, 52, 2.3) + st('M23 21 H34 M23 27 H31 M23 33 H30 M23 39 H28'),
    accent=fs('M47 56 L37.5 46.5 C34.6 43.6 35.2 38.7 39 37.1 C41.8 35.9 44.7 36.8 47 39.5 C49.3 36.8 52.2 35.9 55 37.1 C58.8 38.7 59.4 43.6 56.5 46.5 Z') + st('M47 40.5 V50 M42.3 45.2 H51.7'), anim='beat')
add('dispositivos--computador', fill=fl('M4 37 H60 V39 a5 5 0 0 1 -5 5 H9 a5 5 0 0 1 -5-5 Z'),
    stroke=rect(4, 10, 56, 34, 5) + st('M4 37 H60 M26 44 V54 M38 44 V54 M19 54.5 H45'),
    accent=circ(21, 24, 2.6, False, False).replace("fill='none'", f"fill='{S}'") + circ(32, 24, 2.6, False, False).replace("fill='none'", f"fill='{S}'") + circ(43, 24, 2.6, False, False).replace("fill='none'", f"fill='{S}'"), anim='typing')

# ---------------- Estados
add('estados--feliz', stroke=circ(32, 32, 27),
    accent=circ(32, 32, 20, True, False) + st('M21.5 28 a3.6 3.6 0 0 1 7.2 0 M35.3 28 a3.6 3.6 0 0 1 7.2 0 M24 37.5 C27.5 42 36.5 42 40 37.5'), anim='beat')
head = 'M20 58.5 L21.5 50 C13 46 8 38.5 8 30 C8 16.7 18.7 6 32 6 C44 6 53.5 15 53.5 27 C53.5 28 53.4 29.1 53.2 30.1 L57.5 37.5 C58.1 38.5 57.4 39.5 56.3 39.5 H53.5 V45 C53.5 47.2 51.7 49 49.5 49 H45 L44 58.5'
yin = fl('M30 17 A12 12 0 0 1 30 41 C36.5 41 36.5 29 30 29 C23.5 29 23.5 17 30 17 Z') + circ(30, 29, 12) + st('M30 17 C23.5 17 23.5 29 30 29 C36.5 29 36.5 41 30 41') + circ(30, 23, 1.6) + dot(30, 35, 1.6)
add('estados--equilibrio', stroke=st(head), accent=yin, anim='spin')
lotus = fs('M30 17 C34.5 21 35.5 28.5 30 34 C24.5 28.5 25.5 21 30 17 Z') + st('M25.5 23 C20 22 17.5 25 18 29 C19 32.5 24 34 30 34 C36 34 41 32.5 42 29 C42.5 25 40 22 34.5 23 M14 27 C14 32 20 38 30 38 C40 38 46 32 46 27')
add('estados--calma', stroke=st(head), accent=lotus, anim='pulse')
idea = fs('M30 19 a7 7 0 0 1 4.5 12.4 V33.5 H25.5 V31.4 A7 7 0 0 1 30 19 Z') + st('M26.5 37 H33.5 M27.5 40 H32.5 M30 10 V14 M19 17.5 L21.8 20.3 M41 17.5 L38.2 20.3 M15 27 H19 M41 27 H45 M20 35 L22 33 M40 35 L38 33')
add('estados--idea', stroke=st(head), accent=idea, anim='blink')
dumb = rect(19.5, 21, 5, 16, 2.5, True, True) + rect(35.5, 21, 5, 16, 2.5, True, True) + rect(15.5, 25, 4, 8, 2, False, True) + rect(40.5, 25, 4, 8, 2, False, True) + st('M24.5 29 H35.5')
add('estados--fortaleza', stroke=st(head), accent=dumb, anim='lift')
