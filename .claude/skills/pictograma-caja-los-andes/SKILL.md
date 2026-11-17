---
name: pictograma-caja-los-andes
description: Crear, corregir o animar pictogramas del sistema Caja Los Andes (línea #1C48F5 + acento celeste #58C0F7, grilla 64). Usar cuando pidan un ícono o pictograma nuevo, mejorar uno existente, o animarlo en Figma.
---

# Pictogramas · Caja Los Andes

Referencia completa: `docs/ICONOS.md`. Código: `herramientas/pictogramas/`.

## Concepto (lo que más se corrige)
- **Construido geométricamente**, nunca calcado: líneas perfectas, sin cortes.
- Ícono **de línea con interior transparente**. El celeste es **solo un acento interno parcial** (un círculo dentro, una franja, un bloque inferior). Nunca la figura completa rellena.
- Grilla 64 × 64, dibujo entre 4 y 60. Trazo 1,75, caps/joins redondeados. Números como trazos, sin texto.
- Mismo peso visual que sus vecinos de categoría: comparar siempre lado a lado.

## Crear uno nuevo
1. Agregar en el `icons_*.py` correspondiente (o uno nuevo, sumándolo a `generar.py`):
   ```python
   add('categoria--nombre', fill=fl('...'), stroke=st('...'), accent=st('...'), anim='swing')
   ```
   Helpers en `lib.py`: `st` (trazo), `fl` (relleno celeste), `fs` (relleno + trazo), `ko` (blanco + trazo, para tapar), `circ`, `rect`, `dot`, `coin`, `hand`, `arc`, `head`, `arc_arrow`.
2. `python3 herramientas/pictogramas/generar.py`.
3. Renderizar a PNG (Playwright, ya instalado) junto a 3–4 íconos de la misma categoría y revisar a 24, 32 y 64 px. Corregir colisiones y cortes.
4. Subir a Figma: `upload_assets` → POST del SVG → `figma.createComponentFromNode` → nombre `Pictograma/<Categoría>/<nombre>` en el tablero `230:7197`.
5. Animar **solo el grupo `acento`** con una acción coherente (manecilla gira, moneda cae, campana suena, bandera flamea). Bucle 3 s, ease in-out. Recordar: Figma rota desde el centro del nodo → compensar pivote.
6. Agregar fila al catálogo de `docs/ICONOS.md` y hacer commit.
