# Pictogramas · Caja Los Andes

Guía para usar, mantener y crear pictogramas de la nueva app. Total: **121 pictogramas** (97 del brandbook reconstruidos + 24 nuevos).

## Dónde están

- **Figma:** archivo `KYkGyj4aPR543B9RTYtMZq`, página *Page 1*, tablero **«Pictogramas · Brandbook Caja Los Andes (construidos y animados)»** → https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=230-7197
- **Componentes:** cada pictograma es un componente llamado `Pictograma/<Categoría>/<nombre>` (ej. `Pictograma/Finanzas/alcancia`). Usar siempre **instancias**, nunca copiar el vector suelto.
- **SVG en el repositorio:** `ilustraciones/pictogramas/<categoria>--<nombre>.svg` (rama `claude/modest-hypatia-eeo6c2`).
- **Versión calcada (obsoleta):** tablero «Pictogramas · versión calcada (obsoleta, solo referencia)». No usar.

## Reglas de construcción (no negociables)

| Regla | Valor |
|---|---|
| Grilla | 64 × 64 px, área segura 4 px (el dibujo vive entre 4 y 60) |
| Trazo | 1,75 px, centrado, terminaciones y uniones redondeadas |
| Color de trazo | `#1C48F5` |
| Color de acento | `#58C0F7` (celeste) |
| Concepto | Ícono **de línea con interior transparente**. El celeste es **solo un acento interno parcial** (círculo dentro de la moneda, franja de la tarjeta, bloque inferior del maletín). Nunca rellenar la figura completa. |
| Superposiciones | Cuando una pieza tapa a otra (tarjeta sobre celular, pin sobre mapa) se usa interior blanco como recorte. Ojo en fondos oscuros. |
| Radios | 3–7 px en rectángulos; curvas simétricas |
| Prohibido | Degradados, amarillos, verdes, sombras, más de dos colores, trazos de grosor distinto |
| Texto dentro del ícono | No. Los números ("24", "+50", "1") se dibujan como trazos |

## Estructura de capas (importante para animar)

Cada componente tiene hasta tres grupos:

- `relleno` → acentos celestes que no se mueven.
- `trazo` → el dibujo principal (estático).
- `acento` → la pieza que **cuenta la acción** y es la que se anima (manecilla, moneda, badge, bandera…).

## Animación

- Animación **nativa de Figma** (keyframes), bucle de **3 s**, en el timeline del tablero.
- Regla: **se anima solo la pieza que tiene sentido** y desde su punto lógico (la manecilla gira desde el centro del reloj, la balanza desde su eje, la borla desde el birrete). Nunca mover el ícono completo sin motivo.
- Figma rota y escala cada pieza **desde su propio centro**: si se cambia el pivote hay que compensar con traslación.
- Movimientos suaves (ease in-out), nada que parpadee más de 3 veces por segundo.

## Catálogo

### Viaje y turismo (4) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| avion | `viaje--avion.svg` | Avanza en diagonal, en dirección de vuelo |
| hotel | `viaje--hotel.svg` | Las ventanas se encienden una tras otra |
| maleta-viaje | `viaje--maleta-viaje.svg` | Se mece desde la base, como si la arrastraran |
| maletin | `viaje--maletin.svg` | Se balancea desde el asa, como si lo cargaran |

### Finanzas (16) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| alcancia | `finanzas--alcancia.svg` | La moneda cae y entra por la ranura; la alcancía rebota |
| balanza | `finanzas--balanza.svg` | La balanza se inclina de lado a lado |
| banco | `finanzas--banco.svg` | El techo da un pequeño salto |
| billete | `finanzas--billete.svg` | El billete se mece suave |
| billetera | `finanzas--billetera.svg` | El billete sale de la billetera |
| bolsa-dinero | `finanzas--bolsa-dinero.svg` | Las monedas caen y se apilan |
| cajero | `finanzas--cajero.svg` | La moneda del cajero gira |
| comercio | `finanzas--comercio.svg` | El toldo se estira |
| crecimiento | `finanzas--crecimiento.svg` | Las barras suben en secuencia y aparece la flecha |
| inversion | `finanzas--inversion.svg` | Las barras crecen; la moneda flota |
| moneda | `finanzas--moneda.svg` | La moneda gira sobre sí misma |
| monedas | `finanzas--monedas.svg` | Las monedas caen una a una |
| pago-tarjeta | `finanzas--pago-tarjeta.svg` | La tarjeta baja hasta la mano |
| seguro-financiero | `finanzas--seguro-financiero.svg` | La moneda cae sobre el escudo y aparece el check |
| tarjeta | `finanzas--tarjeta.svg` | La tarjeta se desliza (swipe) |
| transferencia | `finanzas--transferencia.svg` | Solo las flechas giran alrededor de la moneda |

### Educacional (7) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| graduacion | `educacion--graduacion.svg` | La borla se balancea |
| lectura | `educacion--lectura.svg` | La página da vuelta |
| libro | `educacion--libro.svg` | El libro se mece |
| libro-abierto | `educacion--libro-abierto.svg` | Las líneas de texto aparecen |
| libro-notas | `educacion--libro-notas.svg` | El lápiz escribe |
| portapapeles | `educacion--portapapeles.svg` | Las líneas aparecen |
| portapapeles-editar | `educacion--portapapeles-editar.svg` | El lápiz escribe |

### Dispositivos (5) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| celular | `dispositivos--celular.svg` | El celular vibra y la pantalla se enciende |
| computador | `dispositivos--computador.svg` | Los puntos aparecen como si alguien escribiera |
| pago-movil | `dispositivos--pago-movil.svg` | La tarjeta toca el teléfono |
| salud-movil | `dispositivos--salud-movil.svg` | El corazón late |
| tienda-movil | `dispositivos--tienda-movil.svg` | La tienda sale del teléfono |

### Salud y seguridad (5) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| centro-medico | `salud--centro-medico.svg` | La cruz late |
| ficha-salud | `salud--ficha-salud.svg` | El corazón de la ficha late |
| ficha-seguro | `salud--ficha-seguro.svg` | El escudo aparece con rebote |
| proteccion | `salud--proteccion.svg` | El check aparece con rebote |
| salud | `salud--salud.svg` | El corazón late |

### Estados (5) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| calma | `estados--calma.svg` | El loto respira |
| equilibrio | `estados--equilibrio.svg` | El yin-yang gira completo |
| feliz | `estados--feliz.svg` | La carita aparece con rebote |
| fortaleza | `estados--fortaleza.svg` | La pesa sube y baja |
| idea | `estados--idea.svg` | La ampolleta se enciende y destellan los rayos |

### Tiempo libre (8) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| actividad-fisica | `tiempo-libre--actividad-fisica.svg` | La persona trota y las líneas de velocidad parpadean |
| creatividad | `tiempo-libre--creatividad.svg` | Los rayos destellan |
| deporte | `tiempo-libre--deporte.svg` | El balón rebota |
| descanso | `tiempo-libre--descanso.svg` | Las zZ suben y se desvanecen |
| entradas | `tiempo-libre--entradas.svg` | La entrada se balancea |
| gastronomia | `tiempo-libre--gastronomia.svg` | Tenedor y cuchara chocan |
| gimnasio | `tiempo-libre--gimnasio.svg` | La pesa sube y baja |
| teatro | `tiempo-libre--teatro.svg` | Las máscaras se balancean opuestas |

### Bienestar y beneficios (4) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| beneficios | `bienestar--beneficios.svg` | Los tres círculos flotan en secuencia |
| crecimiento-personal | `bienestar--crecimiento-personal.svg` | Las hojas brotan |
| cuidado | `bienestar--cuidado.svg` | El corazón late |
| regalo | `bienestar--regalo.svg` | La tapa se levanta |

### Metas y logros (4) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| cumbre | `metas--cumbre.svg` | La bandera flamea |
| medalla | `metas--medalla.svg` | La medalla oscila desde la cinta |
| objetivo | `metas--objetivo.svg` | La bandera flamea |
| trofeo | `metas--trofeo.svg` | La estrella destella y gira |

### Tiempo y agenda (8) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| 24-horas | `agenda--24-horas.svg` | Las flechas giran |
| agendar | `agenda--agendar.svg` | El reloj aparece y su manecilla gira |
| calendario | `agenda--calendario.svg` | Los días aparecen uno a uno |
| cronometro | `agenda--cronometro.svg` | La manecilla gira |
| hora | `agenda--hora.svg` | Las manecillas giran |
| reloj | `agenda--reloj.svg` | Las manecillas giran |
| reloj-pulsera | `agenda--reloj-pulsera.svg` | Las manecillas giran |
| reunion | `agenda--reunion.svg` | El reloj aparece con rebote |

### Apoyo (3) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| acuerdo | `apoyo--acuerdo.svg` | Las manos se agitan |
| comunidad | `apoyo--comunidad.svg` | Las personas aparecen en secuencia |
| union | `apoyo--union.svg` | El puño aprieta |

### Asistencia (8) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| asistente-virtual | `asistencia--asistente-virtual.svg` | El robot parpadea |
| ayuda | `asistencia--ayuda.svg` | El signo de pregunta rebota |
| ayuda-movil | `asistencia--ayuda-movil.svg` | El signo de pregunta rebota |
| ayuda-sucursal | `asistencia--ayuda-sucursal.svg` | El signo de pregunta rebota |
| ayuda-viaje | `asistencia--ayuda-viaje.svg` | El signo de pregunta rebota |
| soporte-movil | `asistencia--soporte-movil.svg` | El audífono vibra |
| soporte-sucursal | `asistencia--soporte-sucursal.svg` | El audífono vibra |
| soporte-viaje | `asistencia--soporte-viaje.svg` | El audífono vibra |

### +50 (3) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| activo-50 | `mas50--activo-50.svg` | El badge aparece y la persona trota |
| comunidad-50 | `mas50--comunidad-50.svg` | El badge +50 aparece |
| educacion-50 | `mas50--educacion-50.svg` | El badge +50 aparece |

### Personas (17) · brandbook

| Nombre | Archivo | Animación |
|---|---|---|
| bebe | `personas--bebe.svg` | Se mece |
| familia | `personas--familia.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| hombre | `personas--hombre.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| hombre-adulto | `personas--hombre-adulto.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| madre-bebe | `personas--madre-bebe.svg` | El bebé se mece en brazos |
| madre-hija | `personas--madre-hija.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| madre-hijo | `personas--madre-hijo.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| mujer | `personas--mujer.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| mujer-mayor | `personas--mujer-mayor.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| nina | `personas--nina.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| nino | `personas--nino.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| padre-bebe | `personas--padre-bebe.svg` | El bebé se mece en brazos |
| padre-hija | `personas--padre-hija.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| padre-hijo | `personas--padre-hijo.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| pareja | `personas--pareja.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| pareja-mayor | `personas--pareja-mayor.svg` | Respira suave (personas solas) / se mueven con desfase (grupos) |
| pensionados | `personas--pensionados.svg` | La moneda gira |

### Trámites y app (16) · **nuevo**

| Nombre | Archivo | Animación |
|---|---|---|
| ahorro | `tramites--ahorro.svg` | La moneda cae en el frasco |
| cargas-familiares | `tramites--cargas-familiares.svg` | Entra la credencial y aparece el + |
| certificado | `tramites--certificado.svg` | El sello aparece |
| chat | `tramites--chat.svg` | Los puntos escriben |
| clave | `tramites--clave.svg` | El candado se abre y se cierra |
| descarga | `tramites--descarga.svg` | La flecha baja |
| descuento | `tramites--descuento.svg` | La etiqueta se balancea |
| identidad | `tramites--identidad.svg` | Aparece la persona en la credencial |
| licencia-medica | `tramites--licencia-medica.svg` | La cruz late |
| notificacion | `tramites--notificacion.svg` | La campana suena y aparece el punto |
| pension | `tramites--pension.svg` | La flecha de pago recurrente gira |
| seguro | `tramites--seguro.svg` | El paraguas se balancea |
| simulador-credito | `tramites--simulador-credito.svg` | Las teclas se presionan |
| subsidio | `tramites--subsidio.svg` | La casa sube y baja sobre la mano |
| ubicacion | `tramites--ubicacion.svg` | El pin cae sobre el mapa |
| vivienda | `tramites--vivienda.svg` | La llave gira |

### Turismo (8) · **nuevo**

| Nombre | Archivo | Animación |
|---|---|---|
| barco | `turismo--barco.svg` | Se mece sobre las olas |
| brujula | `turismo--brujula.svg` | La aguja busca el norte |
| bus | `turismo--bus.svg` | Avanza con pequeños saltos |
| cabana | `turismo--cabana.svg` | Las ventanas se encienden |
| camara | `turismo--camara.svg` | El lente enfoca y destella el flash |
| camping | `turismo--camping.svg` | La puerta de la carpa se abre |
| pasaporte | `turismo--pasaporte.svg` | El globo gira |
| playa | `turismo--playa.svg` | Los rayos del sol giran |

## Cómo crear un pictograma nuevo

1. Buscar primero si ya existe uno parecido en el tablero.
2. Dibujar en un frame de 64 × 64 respetando las reglas de arriba (partir duplicando un pictograma similar ayuda).
3. Separar en grupos `relleno`, `trazo` y `acento`.
4. Convertir a componente con el nombre `Pictograma/<Categoría>/<nombre-en-kebab-case>` y descripción.
5. Animar solo el `acento` con una acción coherente con el significado.
6. Exportar SVG a `ilustraciones/pictogramas/` con el nombre `<categoria>--<nombre>.svg`.
7. Revisar a 24, 32 y 64 px: la línea no debe empastarse ni cortarse.

## Pendientes

- Confirmar con Brand si existen los archivos fuente originales (SVG/AI) del brandbook para contrastar.
- Validar los nombres de cada pictograma (los asignamos según lo que muestran).
- Las personas tienen peinados y facciones interpretados: revisar con Brand.
