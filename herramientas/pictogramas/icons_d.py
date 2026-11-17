from lib import *
import math
import re


def tf(d, cx, by, s):
    """Mapea un path de plantilla (centro x=32, base y=58) a otra posición/escala, sin cambiar el grosor del trazo."""
    out = []
    toks = re.findall(r'[A-Za-z]|-?\d*\.?\d+', d)
    cmd = None; i = 0; args = []
    res = ''
    def X(u): return cx + (u - 32) * s
    def Y(v): return by - (58 - v) * s
    while i < len(toks):
        t = toks[i]
        if re.match(r'[A-Za-z]', t):
            cmd = t; res += t; i += 1; continue
        if cmd in 'ML':
            res += f"{X(float(toks[i])):.2f} {Y(float(toks[i+1])):.2f} "; i += 2
        elif cmd == 'H':
            res += f"{X(float(t)):.2f} "; i += 1
        elif cmd == 'V':
            res += f"{Y(float(t)):.2f} "; i += 1
        elif cmd == 'C':
            for k in range(3):
                res += f"{X(float(toks[i])):.2f} {Y(float(toks[i+1])):.2f} "; i += 2
        elif cmd == 'a':
            rx, ry, rot, la, sw, dx, dy = [float(x) for x in toks[i:i+7]]
            res += f"{rx*s:.2f} {ry*s:.2f} {rot:.0f} {int(la)} {int(sw)} {dx*s:.2f} {dy*s:.2f} "; i += 7
        else:
            raise ValueError(cmd)
    return res.strip()


def person(cx=32, by=58, s=1.0, hair='m', extra='', knock=False):
    T = lambda d: tf(d, cx, by, s)
    parts = ''
    if hair == 'f':      # pelo largo (detrás)
        parts += fs(T('M21.5 24 C21.5 13.5 26 8.5 32 8.5 C38 8.5 42.5 13.5 42.5 24 V37 H21.5 Z'))
    body = T('M17 58 V46.5 C17 40.5 21.5 36 27.5 36 H36.5 C42.5 36 47 40.5 47 46.5 V58 Z')
    parts += (ko(body) if knock or True else st(body))
    parts += st(T('M22 58 V49 M42 58 V49 M28.5 36 L32 39.5 L35.5 36 M29 39 L32 41 L35 39'))
    face = T('M23 22 C23 15.5 27 11.5 32 11.5 C37 11.5 41 15.5 41 22 C41 28.5 37 33 32 33 C27 33 23 28.5 23 22 Z')
    parts += ko(face)
    parts += st(T('M23 22.5 C21.3 22.5 21 25.5 23.3 26 M41 22.5 C42.7 22.5 43 25.5 40.7 26 M29.5 33 V36 M34.5 33 V36'))
    parts += dot(*[float(v) for v in T('M28.6 22.8').strip('M').split()], 1.1 * max(s, 0.85)) + dot(*[float(v) for v in T('M35.4 22.8').strip('M').split()], 1.1 * max(s, 0.85))
    parts += st(T('M29 27.2 C30.6 28.8 33.4 28.8 35 27.2')) if 'beard' not in extra else ''
    if hair in ('m', 'k', 'a'):
        parts += fs(T('M23.2 18.5 C23 12.5 26.5 8.8 32 8.8 C37.5 8.8 41.2 12.3 40.9 18 C38.8 15.6 35.5 14.6 31.2 14.8 C27.8 14.9 25 16.2 23.2 18.5 Z'))
    if hair == 'k':      # remolino niño
        parts += st(T('M31 9 L30 6.5 M33 9 L34.5 6.8'))
    if hair == 'f':
        parts += fs(T('M23 20.5 C23.5 14 27 10.5 32 10.5 C37 10.5 40.5 14 41 20.5 C37 19 34 16.5 32.5 14 C30.5 17.5 27 19.5 23 20.5 Z'))
    if hair == 'g':      # niña con trenzas
        parts += fs(T('M23 21 C22.5 13.5 26.5 9.5 32 9.5 C37.5 9.5 41.5 13.5 41 21 C38 18.5 35 16.5 32 14.8 C29 16.5 26 18.5 23 21 Z'))
        parts += fs(T('M21 30 a2.6 3.2 0 1 0 0.01 0 Z')) + fs(T('M43 30 a2.6 3.2 0 1 0 0.01 0 Z'))
    if hair == 'o':      # mayor con moño y lentes
        parts += fs(T('M23 21 C22.5 14 26.5 10 32 10 C37.5 10 41.5 14 41 21 C38 18.5 35 17.5 32 17.5 C29 17.5 26 18.5 23 21 Z')) + circ(*[float(v) for v in T('M32 7.2').strip('M').split()], 2.8 * s, True, True)
    if 'beard' in extra:
        parts += fs(T('M24.5 26.5 C25.5 31 28.5 33.5 32 33.5 C35.5 33.5 38.5 31 39.5 26.5 C37.5 28.8 35 29.6 32 29.6 C29 29.6 26.5 28.8 24.5 26.5 Z')) + st(T('M28.5 26.3 C30.5 25.2 33.5 25.2 35.5 26.3'))
    if 'glasses' in extra:
        g = T('M25.8 22.8 a2.8 2.8 0 1 0 5.6 0 a2.8 2.8 0 1 0 -5.6 0 M32.6 22.8 a2.8 2.8 0 1 0 5.6 0 a2.8 2.8 0 1 0 -5.6 0 M31.4 22.6 H32.6')
        parts += st(g)
    return parts


def badge50(cx, cy, r=9):
    five = f"M{cx-0.2:.2f} {cy-4.2:.2f} H{cx-3.4:.2f} L{cx-3.8:.2f} {cy-0.6:.2f} C{cx-2.6:.2f} {cy-1.6:.2f} {cx+0.2:.2f} {cy-1.4:.2f} {cx+0.2:.2f} {cy+1.2:.2f} C{cx+0.2:.2f} {cy+3.8:.2f} {cx-3:.2f} {cy+4.4:.2f} {cx-4.2:.2f} {cy+2.6:.2f}"
    zero = f"M{cx+4.3:.2f} {cy-4.2:.2f} C{cx+6.3:.2f} {cy-4.2:.2f} {cx+6.6:.2f} {cy-2:.2f} {cx+6.6:.2f} {cy:.2f} C{cx+6.6:.2f} {cy+2:.2f} {cx+6.3:.2f} {cy+4.2:.2f} {cx+4.3:.2f} {cy+4.2:.2f} C{cx+2.3:.2f} {cy+4.2:.2f} {cx+2:.2f} {cy+2:.2f} {cx+2:.2f} {cy:.2f} C{cx+2:.2f} {cy-2:.2f} {cx+2.3:.2f} {cy-4.2:.2f} {cx+4.3:.2f} {cy-4.2:.2f} Z"
    plus = f"M{cx-7.4:.2f} {cy:.2f} H{cx-4.6:.2f} M{cx-6:.2f} {cy-1.4:.2f} V{cy+1.4:.2f}"
    return circ(cx, cy, r, True, False) + f"<path d='{five} {zero} {plus}' stroke='{S}' stroke-width='1.3' fill='none'/>"


def qmark(cx, cy, s=1):
    return st(f"M{cx-3*s:.2f} {cy-2.5*s:.2f} C{cx-3*s:.2f} {cy-5.5*s:.2f} {cx+3.2*s:.2f} {cy-5.8*s:.2f} {cx+3.2*s:.2f} {cy-2.2*s:.2f} C{cx+3.2*s:.2f} {cy+0.2*s:.2f} {cx:.2f} {cy+0.3*s:.2f} {cx:.2f} {cy+2.6*s:.2f}") + dot(cx, cy + 5.3 * s, 1.15 * s)


def headset(cx, cy, s=1):
    return st(f"M{cx-5*s:.2f} {cy+1*s:.2f} V{cy-0.5*s:.2f} A{5*s:.2f} {5*s:.2f} 0 0 1 {cx+5*s:.2f} {cy-0.5*s:.2f} V{cy+1*s:.2f} M{cx+5*s:.2f} {cy+3.5*s:.2f} C{cx+5*s:.2f} {cy+5.5*s:.2f} {cx+3*s:.2f} {cy+6.3*s:.2f} {cx+0.5*s:.2f} {cy+6.3*s:.2f}") + \
        rect(cx - 6.6 * s, cy + 0.2 * s, 3 * s, 4.6 * s, 1.2 * s) + rect(cx + 3.6 * s, cy + 0.2 * s, 3 * s, 4.6 * s, 1.2 * s)


# ---------------- Personas
add('personas--hombre', accent=person(hair='m'), anim='bob')
add('personas--mujer', accent=person(hair='f'), anim='bob')
add('personas--nino', accent=person(by=58, s=0.9, hair='k'), anim='bob')
add('personas--nina', accent=person(by=58, s=0.9, hair='g'), anim='bob')
add('personas--hombre-adulto', accent=person(hair='a', extra='beard'), anim='bob')
add('personas--mujer-mayor', accent=person(s=0.92, hair='o', extra='glasses'), anim='bob')
baby = fs('M14 58 V52 C14 44.5 21.5 40 32 40 C42.5 40 50 44.5 50 52 V58 Z') + ko('M18 25 C18 15.5 24.3 9 32 9 C39.7 9 46 15.5 46 25 C46 34.5 39.7 41 32 41 C24.3 41 18 34.5 18 25 Z') + \
    st('M18 24 C14.5 23.5 14 29.5 18.4 29.5 M46 24 C49.5 23.5 50 29.5 45.6 29.5 M30 9.3 C27.5 12 30 15.5 33 14 C35 13 34.5 10.5 32.5 10.8 M27.5 31 C30 33.5 34 33.5 36.5 31') + dot(26.5, 25.5, 1.3) + dot(37.5, 25.5, 1.3)
add('personas--bebe', accent=baby, anim='bob')
bundle = lambda cx, cy: ko(f"M{cx-6} {cy+12} C{cx-9} {cy+6} {cx-7} {cy-3} {cx-1} {cy-6} C{cx+5} {cy-8} {cx+9} {cy-3} {cx+8} {cy+3} C{cx+7} {cy+9} {cx+1} {cy+13} {cx-6} {cy+12} Z") + circ(cx + 2, cy - 1.5, 3.4) + st(f"M{cx-4} {cy+9} C{cx-3} {cy+5} {cx+1} {cy+3} {cx+5} {cy+4}")
add('personas--madre-bebe', accent=person(cx=28, hair='f') + bundle(40, 44), anim='bob')
add('personas--padre-bebe', accent=person(cx=28, hair='m') + bundle(40, 44), anim='bob')
pair = lambda a, b, sa=0.9, sb=0.9, ea='', eb='': person(cx=19, by=58, s=sa, hair=a, extra=ea) + person(cx=45.5, by=58, s=sb, hair=b, extra=eb)
add('personas--pareja', accent=pair('m', 'f'), anim='bob')
add('personas--madre-hijo', accent=pair('f', 'k', 0.9, 0.76), anim='bob')
add('personas--madre-hija', accent=pair('f', 'g', 0.9, 0.76), anim='bob')
add('personas--padre-hijo', accent=pair('m', 'k', 0.9, 0.76), anim='bob')
add('personas--padre-hija', accent=pair('m', 'g', 0.9, 0.76), anim='bob')
add('personas--familia', accent=pair('m', 'f') + person(cx=32, by=58, s=0.56, hair='k'), anim='bob')
add('personas--pareja-mayor', accent=pair('a', 'o', 0.9, 0.86, 'beard', 'glasses'), anim='bob')
add('personas--pensionados', stroke=pair('a', 'o', 0.86, 0.82, 'beard', 'glasses'), accent=circ(49, 50, 8.5).replace("fill='none'", "fill='#FFFFFF'") + dollar(49, 50, 3.4), anim='flip')

# ---------------- Apoyo
mini = lambda cx, cy, s: circ(cx, cy, 3.4 * s) + st(f"M{cx-5.5*s:.2f} {cy+11*s:.2f} V{cy+8.5*s:.2f} C{cx-5.5*s:.2f} {cy+5.8*s:.2f} {cx-3*s:.2f} {cy+4.4*s:.2f} {cx:.2f} {cy+4.4*s:.2f} C{cx+3*s:.2f} {cy+4.4*s:.2f} {cx+5.5*s:.2f} {cy+5.8*s:.2f} {cx+5.5*s:.2f} {cy+8.5*s:.2f} V{cy+11*s:.2f}")
add('apoyo--comunidad', stroke=hand(40), accent=mini(36, 11, 0.85) + mini(46.5, 9, 1) + mini(57, 11, 0.85), anim='float')
hs_back = st('M4 26 L13 18.5 M60 26 L51 18.5')
right = ko('M51 18.5 L41.5 13.2 C39.6 12.2 37.3 12.4 35.6 13.7 L25.6 21.5 C24 22.8 24 25.2 25.6 26.4 C27.2 27.6 29.4 27.4 30.9 26.1 L35.6 22.2 L47.5 33.5 C49.4 35.3 49 38.4 46.7 39.6 L44.5 40.7 L38 44.5 L31 47 C29 47.7 27 47.2 25.6 45.8 L13 32.5 L13 18.5 Z')
fingers = "<g transform='rotate(45 31 40)'>" + ''.join(rect(23.5 + i * 4.6, 34.5, 4.2, 10.5, 2.1, True, True) for i in range(4)) + "</g>"
add('apoyo--acuerdo', stroke=hs_back + right + st('M51 18.5 V36'), accent=fingers, anim='shake')
arms = st('M4 50 L15 39 M14 60 L25 49 M60 14 L49 25 M50 4 L39 15')
grip = "<g transform='rotate(-45 32 32)'>" + rect(19, 21, 26, 22, 8).replace("fill='none'", "fill='#FFFFFF'") + ''.join(rect(19 + i * 6.5, 15, 6, 13, 3, True, True) for i in range(4)) + "</g>"
add('apoyo--union', stroke=arms, accent=grip, anim='shake')

# ---------------- Asistencia
ph = lambda x0=10: st(f'M{x0+28} 23 V12 a6 6 0 0 0 -6-6 H{x0+6} a6 6 0 0 0 -6 6 V52 a6 6 0 0 0 6 6 H{x0+22} a6 6 0 0 0 6-6 V44') + st(f'M{x0+11} 11 H{x0+17}') + dot(x0 + 14, 52, 2.3)
add('asistencia--ayuda-movil', stroke=ph(), accent=circ(46, 33, 11, True, True) + qmark(46, 32.5), anim='bounce')
add('asistencia--soporte-movil', stroke=ph(), accent=circ(46, 33, 11, True, True) + headset(46, 32), anim='bounce')
shop = st('M6 25 L11 13 H27 L32 25 a4.3 4.3 0 0 1 -8.6 0 a4.3 4.3 0 0 1 -8.6 0 a4.3 4.3 0 0 1 -8.6 0 M14 13 L10.8 25 M19 13 L19 25 M24 13 L27.2 25 M8 31 V54 a4 4 0 0 0 4 4 H30 a4 4 0 0 0 4-4 V40 M13 36 H19 V42 H13 Z M22 58 V47 a4 4 0 0 1 8 0 V58')
add('asistencia--ayuda-sucursal', stroke=shop, accent=circ(45, 17, 12, True, True) + qmark(45, 16.5, 1.05), anim='bounce')
add('asistencia--soporte-sucursal', stroke=shop, accent=circ(45, 17, 12, True, True) + headset(45, 16, 1.05), anim='bounce')
bag2 = st('M12 18 V8 a3 3 0 0 1 3-3 h5 a3 3 0 0 1 3 3 V18 M33 18 H9 a4 4 0 0 0 -4 4 V54 a4 4 0 0 0 4 4 H35 a4 4 0 0 0 4-4 V48 M13 28 V48 M19 28 V48 M25 28 V48')
add('asistencia--ayuda-viaje', stroke=bag2, accent=circ(45, 32, 12, True, True) + qmark(45, 31.5, 1.05), anim='bounce')
add('asistencia--soporte-viaje', stroke=bag2, accent=circ(45, 32, 12, True, True) + headset(45, 31, 1.05), anim='bounce')
add('asistencia--asistente-virtual', fill=rect(13, 17, 38, 30, 6, True, True),
    stroke=st('M32 17 V12.5 M28 47 V55 M36 47 V55 M20 55.5 H44 M13 28 H10 a3 3 0 0 0 0 6 H13 M51 28 H54 a3 3 0 0 1 0 6 H51') + circ(32, 10, 2.5),
    accent=rect(19, 23, 26, 18, 3.5).replace("fill='none'", "fill='#FFFFFF'") + st('M25 33 C26 31.3 28 31.3 29 33 M35 33 C36 31.3 38 31.3 39 33'), anim='blink')
add('asistencia--ayuda', stroke=circ(32, 32, 27), accent=circ(32, 32, 19.5, True, False) + qmark(32, 31, 1.9), anim='bounce')

# ---------------- +50
add('mas50--comunidad-50', stroke=mini(17, 12, 1.1) + mini(32, 9.5, 1.3) + mini(47, 12, 1.1), accent=badge50(46, 45, 11), anim='pop')
runner = circ(36.5, 9, 4) + st('M32.5 16 L27 30 M32 17 L39 23.5 H45 M30.5 17.5 L22.5 19.5 L18.5 25 M27 30 L35 36 M27 30 L22.5 40 H12 M4 23 H12 M6 29 H14 M4 35 H11')
add('mas50--activo-50', stroke=runner, accent=badge50(46, 46, 11), anim='pop')
add('mas50--educacion-50', stroke=st('M14 22 L36 12 L58 22 L36 32 Z M22 26 V36 C22 40 28 42 36 42 C44 42 50 40 50 36 V26 M36 22 L54 26 V36') + circ(54, 38.5, 2) + fs('M51.8 45 L54 40.5 L56.2 45 Z'),
    accent=badge50(16, 45, 11), anim='pop')
