# Nueva app Caja Los Andes · instrucciones para Claude

Trabajo de diseño UX/UI. El diseño vive en Figma; este repo guarda documentación, pictogramas y herramientas.

## Leer primero
- `docs/PANTALLAS.md` — flujos, nodos de Figma, estado y pendientes.
- `docs/ICONOS.md` — sistema de pictogramas y catálogo.
- `docs/MI-PERFIL.md` — hub privado Mi Perfil / Mi Cuenta (US-01 a US-05).
- Skills del proyecto: `.claude/skills/diseno-caja-los-andes` (pantallas) y `.claude/skills/pictograma-caja-los-andes` (íconos).

## Figma
- Archivo: `KYkGyj4aPR543B9RTYtMZq`, página *Page 1*. Link a nodo: `https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=X-Y`.
- Antes de `use_figma`, cargar la skill `figma-use` (y `figma-use-motion` si hay animación).
- Antes de editar una pantalla grande, duplicarla como respaldo. Reutilizar componentes existentes; no desacoplar instancias.
- Averta no carga en el plugin: los textos están en Figtree (Regular/Medium/Bold). No intentar cargar Averta; un nodo con Averta no se puede mover entre padres, solo clonar.
- Animación nativa: `applyManualKeyframeTrack`. Figma rota/escala **desde el centro del nodo**; para otro pivote compensar traslación `t = (P−C) − R·S(P−C)`. Rotación positiva = antihoraria. No mezclar `TRANSLATION_XY` con `TRANSLATION_X/Y`.

## Reglas de negocio (no romper)
1. La app **no crea cuentas ni afiliaciones**.
2. Solo un afiliado **sin clave** puede crear su clave.
3. Solo se afilian **empresas** (por sus trabajadores) y **pensionados**.

## Reglas visuales
- Solo colores de marca: `#094AFF`, `#131252`, `#06C2FA`. Pictogramas: trazo `#1C48F5`, acento `#58C0F7`.
- Sin amarillo ni verde de marca. Colores **funcionales de estado** (solo para estados, siempre con ícono + texto): éxito verde `#006E62`, error rojo `#B42318`.
- Botones píldora. Tono humano y cercano (tuteo). Poco texto: baja carga cognitiva.
- Animaciones coherentes con el significado de cada elemento.

## Pictogramas
- Se **construyen geométricamente**, nunca se calcan. Grilla 64, trazo 1,75 redondeado, interior transparente, celeste solo como acento parcial interno.
- Definiciones en `herramientas/pictogramas/icons_*.py` (helpers en `lib.py`). Generar SVG con:
  `python3 herramientas/pictogramas/generar.py` → `ilustraciones/pictogramas/<categoria>--<nombre>.svg`.
- Grupos SVG `relleno` / `trazo` / `acento`; solo se anima `acento`. Tipo de animación en `herramientas/pictogramas/animaciones.json`.
- Subir a Figma con `upload_assets` y convertir en componente `Pictograma/<Categoría>/<nombre>` dentro del tablero `230:7197`.

## Entorno (Claude Code en la nube)
- El entorno necesita los hosts `mcp.figma.com` y `www.figma.com` permitidos y el conector de Figma conectado.
- Los commits van en la rama de trabajo de la sesión; no subir archivos pesados (pptx, videos) al repo.
