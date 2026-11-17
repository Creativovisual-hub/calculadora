S = '#1C48F5'; F = '#58C0F7'; W = 1.75
ICONS = {}   # name -> svg
ANIM = {}    # name -> animation type for group 'acento'


def st(d): return f"<path d='{d}' stroke='{S}' stroke-width='{W}' fill='none'/>"
def fl(d): return f"<path d='{d}' fill='{F}'/>"
def fs(d): return f"<path d='{d}' fill='{F}' stroke='{S}' stroke-width='{W}'/>"
def ko(d): return f"<path d='{d}' fill='#FFFFFF' stroke='{S}' stroke-width='{W}'/>"


def circ(cx, cy, r, fill=False, stroke=True, knock=False):
    f = F if fill else ('#FFFFFF' if knock else 'none')
    return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{f}'" + (f" stroke='{S}' stroke-width='{W}'" if stroke else "") + "/>"


def rect(x, y, w, h, r, fill=False, stroke=True):
    return f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='{r}' fill='{F if fill else 'none'}'" + (f" stroke='{S}' stroke-width='{W}'" if stroke else "") + "/>"


def dot(cx, cy, r=1.4): return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{S}'/>"


def dollar(cx, cy, s):
    d = (f"M{cx+0.55*s:.2f} {cy-0.6*s:.2f} C{cx+0.35*s:.2f} {cy-0.9*s:.2f} {cx-0.6*s:.2f} {cy-0.95*s:.2f} {cx-0.6*s:.2f} {cy-0.38*s:.2f} "
         f"C{cx-0.6*s:.2f} {cy+0.05*s:.2f} {cx+0.6*s:.2f} {cy-0.08*s:.2f} {cx+0.6*s:.2f} {cy+0.42*s:.2f} "
         f"C{cx+0.6*s:.2f} {cy+0.98*s:.2f} {cx-0.45*s:.2f} {cy+0.95*s:.2f} {cx-0.62*s:.2f} {cy+0.6*s:.2f} "
         f"M{cx} {cy-1.2*s:.2f} V{cy+1.2*s:.2f}")
    return st(d)


def coin(cx, cy, r, fill=True, s=None):
    return circ(cx, cy, r, fill, True) + dollar(cx, cy, s or r * 0.4)


def hand(y=36, x=8, scale=1.0):
    # mano abierta (palma arriba) desde la izquierda; y = línea superior de la palma
    def P(px, py): return f"{x + (px - 8) * scale:.2f} {y + (py - 36) * scale:.2f}"
    d = (f"M{P(8,32)} V{y + 24*scale:.2f} "
         f"M{P(8,36)} H{x + (22-8)*scale:.2f} C{P(25,36)} {P(27.5,37.5)} {P(28.5,40)} H{x + (35-8)*scale:.2f} "
         f"L{P(50,34)} C{P(53,33)} {P(56,35)} {P(55.5,38)} C{P(55.3,39.4)} {P(54.4,40.5)} {P(53,41.2)} "
         f"L{P(37,50)} C{P(35.5,50.8)} {P(34,51)} {P(32.5,51)} H{x:.2f} M{P(24,45)} H{x + (33-8)*scale:.2f}")
    return st(d)


def svg(fill='', stroke='', accent=''):
    return ("<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' fill='none' stroke-linecap='round' stroke-linejoin='round'>"
            + (f"<g id='relleno'>{fill}</g>" if fill else "")
            + (f"<g id='trazo'>{stroke}</g>" if stroke else "")
            + (f"<g id='acento'>{accent}</g>" if accent else "")
            + "</svg>")


def add(name, fill='', stroke='', accent='', anim='pop'):
    ICONS[name] = svg(fill, stroke, accent)
    ANIM[name] = anim


import math
def P(cx, cy, r, t):
    a = math.radians(t); return cx + r * math.cos(a), cy + r * math.sin(a)


def arc(cx, cy, r, t0, t1):
    x0, y0 = P(cx, cy, r, t0); x1, y1 = P(cx, cy, r, t1)
    large = 1 if (t1 - t0) % 360 > 180 else 0
    return f"M{x0:.2f} {y0:.2f} A{r} {r} 0 {large} 1 {x1:.2f} {y1:.2f}"


def head(x, y, dx, dy, L=6, spread=38):
    a = math.atan2(dy, dx); out = ''
    for s in (spread, -spread):
        b = a + math.pi - math.radians(s)
        out += f" M{x:.2f} {y:.2f} L{x + L*math.cos(b):.2f} {y + L*math.sin(b):.2f}"
    return out


def arc_arrow(cx, cy, r, t0, t1, L=6):
    x1, y1 = P(cx, cy, r, t1); a = math.radians(t1)
    return arc(cx, cy, r, t0, t1) + head(x1, y1, -math.sin(a), math.cos(a), L)
