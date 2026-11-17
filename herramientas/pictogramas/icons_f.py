from lib import *
import math

# ---------------- Turismo (nuevos) · mismo concepto: línea + acento celeste parcial interno
# Playa: sombrilla + sol + arena
umb = 'M8 30 C8 19 17 11 28 11 C39 11 48 19 48 30 C44.7 27.6 40 27.6 38 30 C35.3 27.6 30.7 27.6 28 30 C25.3 27.6 20.7 27.6 18 30 C15.3 27.6 10.7 27.6 8 30 Z'
add('turismo--playa', fill=fl('M22 29.5 C24.3 27.8 26.6 27.8 28 29.5 C29.4 27.8 31.7 27.8 34 29.5 C33.4 20 31 13.5 28 11.4 C25 13.5 22.6 20 22 29.5 Z'),
    stroke=st(umb + ' M28 11.4 C25 13.5 22.6 20 22 29.5 M28 11.4 C31 13.5 33.4 20 34 29.5 M28 30 L33 52 M6 52.5 H58 M10 58 H24 M32 58 H42'),
    accent=circ(50, 14, 5, True, False) + st('M50 4.5 V6.5 M50 21.5 V23.5 M40.5 14 H42.5 M57.5 14 H59.5 M43.3 7.3 L44.7 8.7 M55.3 19.3 L56.7 20.7 M56.7 7.3 L55.3 8.7'), anim='spin')
# Centro vacacional: cabaña
add('turismo--cabana', fill=fl('M26 44 H38 V58 H26 Z'),
    stroke=st('M4 32 L32 9 L60 32 M10 27 V58 H54 V27 M4 58 H60 M26 58 V44 H38 V58 M44 12 V20 M44 12 H50 V25') + rect(15, 36, 7, 7, 1) + rect(42, 36, 7, 7, 1),
    accent=fl('M16 37 H21 V42 H16 Z') + fl('M43 37 H48 V42 H43 Z'), anim='blink')
# Camping: carpa
add('turismo--camping', fill=fl('M32 18 L44 56 H20 Z'),
    stroke=st('M32 10 L54 56 H10 Z M32 18 L20 56 M32 18 L44 56 M4 56.5 H60 M32 10 L29 5 M32 10 L35 5'),
    accent=st('M32 18 V56'), anim='pop')
# Cámara de fotos
add('turismo--camara', fill=fl('M10 25 a3 3 0 0 1 3-3 H51 a3 3 0 0 1 3 3 V28 H10 Z'),
    stroke=st('M8 22 a5 5 0 0 1 5-5 H21 L25 11 H39 L43 17 H51 a5 5 0 0 1 5 5 V50 a5 5 0 0 1 -5 5 H13 a5 5 0 0 1 -5-5 Z') + circ(32, 36, 11.5),
    accent=circ(32, 36, 7, True, False) + circ(48, 24.5, 1.8, True, True), anim='flash')
# Pasaporte
add('turismo--pasaporte', fill=fl('M16 6 H20 V58 H16 a4 4 0 0 1 -4-4 V10 a4 4 0 0 1 4-4 Z'),
    stroke=st('M16 6 H48 a4 4 0 0 1 4 4 V54 a4 4 0 0 1 -4 4 H16 a4 4 0 0 1 -4-4 V10 a4 4 0 0 1 4-4 Z M20 6 V58 M28 46 H44'),
    accent=circ(36, 27, 9) + st('M27 27 H45 M36 18 C32.5 21 32.5 33 36 36 M36 18 C39.5 21 39.5 33 36 36'), anim='spin')
# Brújula
add('turismo--brujula', stroke=circ(32, 32, 26) + st('M32 6 V10 M32 54 V58 M6 32 H10 M54 32 H58'),
    accent=fs('M40.5 23.5 L35 35 L23.5 40.5 L29 29 Z') + circ(32, 32, 2.2, False, False).replace("fill='none'", f"fill='{S}'"), anim='needle')
# Bus de turismo
add('turismo--bus', fill=fl('M12 16 a3 3 0 0 1 3-3 H49 a3 3 0 0 1 3 3 V30 H12 Z'),
    stroke=st('M10 46 V14 a6 6 0 0 1 6-6 H48 a6 6 0 0 1 6 6 V46 a3 3 0 0 1 -3 3 H13 a3 3 0 0 1 -3-3 Z M10 32 H54 M32 8 V32 M10 40 H16 M48 40 H54') + rect(14, 49, 9, 8, 3) + rect(41, 49, 9, 8, 3),
    accent='', anim='none')
# Crucero / barco
add('turismo--barco', fill=fl('M12.5 44.5 H51.5 L48.5 50.2 H15.5 Z'),
    stroke=st('M8 37 H56 L48.5 51 H15.5 Z M18 37 V27 H46 V37 M24 27 V19 H40 V27 M32 19 V12'),
    accent=st('M4 58 C8 55 12 55 16 58 C20 61 24 61 28 58 C32 55 36 55 40 58 C44 61 48 61 52 58 C55 56 58 56 60 57.5'), anim='wave')
