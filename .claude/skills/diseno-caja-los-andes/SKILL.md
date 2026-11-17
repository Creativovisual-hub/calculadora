---
name: diseno-caja-los-andes
description: Diseñar, editar o revisar pantallas de la nueva app Caja Los Andes en Figma (archivo KYkGyj4aPR543B9RTYtMZq). Usar cuando pidan crear o ajustar una pantalla, un flujo, un estado, un componente o una animación de la app, o revisar si una pantalla cumple las reglas de marca y de negocio.
---

# Diseño de pantallas · Caja Los Andes

## Antes de empezar
1. Leer `docs/PANTALLAS.md` (flujos, nodos, estado, pendientes).
2. Cargar la skill `figma-use` (y `figma-use-motion` si hay animación) y abrir sesión con `create_session` sobre `KYkGyj4aPR543B9RTYtMZq`.
3. Mirar la pantalla vecina del mismo flujo con `get_screenshot` y copiar su estructura: márgenes, header, botones, componentes.

## Pasos
1. **Respaldo:** si se modifica una pantalla existente, duplicarla primero ("· respaldo").
2. **Reutilizar:** instancias de componentes existentes (Clave `136:4198`, Sucursales `82:3192`, Notificaciones `89:3733`, Centro de ayuda `21:3`, Tarjeta vitrina `145:9600`, `Pictograma/...`). No desacoplar.
3. **Construir** dentro de la sección del flujo, nombrando `<n.º> · <Nombre>`.
4. **Verificar** con `get_screenshot` y corregir antes de mostrar.
5. **Actualizar** `docs/PANTALLAS.md` (nodo nuevo, estado) y hacer commit.
6. Entregar al usuario el link directo `https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=X-Y`.

## Checklist de revisión
- [ ] No ofrece crear cuenta ni afiliarse (solo empresas y pensionados se afilian; solo el afiliado sin clave crea clave).
- [ ] Solo `#094AFF`, `#131252`, `#06C2FA` (+ pictogramas `#1C48F5` / `#58C0F7`). Sin amarillo ni verde; rojo solo error.
- [ ] Botones píldora; una acción principal por pantalla.
- [ ] Texto mínimo: título + una línea de apoyo. Tuteo, tono humano.
- [ ] Accesos directos solo texto si la pantalla ya tiene ilustración.
- [ ] Tipografía Figtree (Regular/Medium/Bold) hasta el cambio a Averta. No intentar cargar Averta.
- [ ] Animaciones con sentido: solo se mueve lo que cuenta la acción.

## Trampas conocidas de Figma
- Rotación y escala ocurren **desde el centro del nodo**; para pivotear en otro punto compensar con traslación `t = (P−C) − R·S(P−C)`. Rotación positiva = antihoraria.
- No mezclar `TRANSLATION_XY` con `TRANSLATION_X/Y`.
- Nodos con Averta no se pueden mover de padre: clonarlos.
