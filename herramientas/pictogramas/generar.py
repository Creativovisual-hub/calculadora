"""Genera los SVG de pictogramas en ilustraciones/pictogramas/.
Uso: python3 herramientas/pictogramas/generar.py
Cada pictograma se define con add(nombre, fill, stroke, accent, anim) en icons_*.py."""
import os, sys, json, importlib
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import lib
for m in ['icons_a', 'icons_b', 'icons_c', 'icons_d', 'icons_e', 'icons_f']:
    importlib.import_module(m)
OUT = os.path.join(AQUI, '..', '..', 'ilustraciones', 'pictogramas')
os.makedirs(OUT, exist_ok=True)
for k, v in lib.ICONS.items():
    open(os.path.join(OUT, f'{k}.svg'), 'w').write(v)
json.dump(lib.ANIM, open(os.path.join(AQUI, 'animaciones.json'), 'w'), indent=1, ensure_ascii=False)
print(len(lib.ICONS), 'pictogramas generados')
