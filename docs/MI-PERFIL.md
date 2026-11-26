# Mi Perfil · Mi Cuenta (hub privado)

> **Versión vigente: v2 (estilo app)** → https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=419-8405 · prototipo «Mi Perfil v2 (completo)» (inicia en MP-12).
> La v3 (fondo blanco, estilo Centro de ayuda) y la v1 (wireframe) quedan como referencia.

## Cobertura de la HU (v2)

| Requisito | Pantallas |
|---|---|
| US-01 Entrada desde Landing privado / menú de cuenta | MP-12, MP-13 |
| US-01 Hub (minimalista) y variantes por arquetipo | MP-01 · MP-25 pensionado (texto 130 %) · MP-26 carga familiar |
| US-01 Mis datos: ver y editar correo, teléfono, dirección | MP-14, MP-15 (validación), MP-16 (código SMS), MP-17 (dirección), MP-20 (guardado) |
| US-01 Medio de pago y cargas familiares | MP-18, MP-19 |
| US-02 Accesibilidad con vista previa y AA/AAA | MP-04, MP-11 |
| US-03 Bandeja por dominio, detalle con línea de tiempo, folio, fecha, acción requerida | MP-02, MP-03, MP-22 |
| US-03 Resolver la acción requerida en la app | MP-21 (subir documento), MP-22 (recibido + fecha estimada) |
| US-04 Soft login, cambio de dispositivo, consentimientos, notificaciones (campanita y push) | MP-05, MP-24, MP-07, MP-06, MP-12 |
| US-05 Vacío, skeleton, error parcial, validación | MP-08, MP-10, MP-09, MP-15 |
| US-05 Handoff (estados, validación, tokens, App Shell, eventos) | Tablero «US-05 · Handoff Mi Perfil v2» |
| Borde: legado embebido en el App Shell | MP-23 |
| Borde: escalado SO × app | MP-11, MP-25 + tabla de tokens (tope 1,5) |

> **Alcance: solo App** (iOS/Android). No se diseña versión Web.

**Valor agregado para bajar llamadas y visitas:**
- Fecha estimada del próximo paso en cada trámite.
- Subir el documento pedido desde la app.
- Folio copiable y ayuda con el folio precargado.
- «Avísame cuando avance».
- Barra de perfil completo con atajo al dato que falta.
- Hub adaptado al tipo de afiliado.

Componente nuevo: `v2/Campo`, con 5 estados (Default, Foco, Error, Verificado, Deshabilitado).
Respaldo del hub anterior: «MP-01 · versión anterior (respaldo)».

---

## Histórico

> **Versión vigente: v3 (fondo blanco · estilo Centro de ayuda iOS)** → https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=428-9224 · prototipo «Mi Perfil v3». Mismas 11 pantallas que la v2, con fondo blanco, encabezado azul y barra flotante del Centro de ayuda, tipografía Lexend, tarjetas blancas con sombra suave (radio 18) y destacados en gris #F2F4F9 (radio 20) con botón píldora azul.
>
> **Versión anterior: v2 (estilo app).** Sección «Mi Perfil · v2 (estilo app)» → https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=419-8405 · prototipo «Mi Perfil v2».
> Estilo tomado de «31 Mi perfil · completa» y «32 Certificados · completa»: fondo lavanda claro, contenedores blancos (radio 20, borde #E6EAF4, sombra suave), botón volver circular, baldosas de ícono celestes, héroe en degradado navy→azul, enlaces «Acción ›».
>
> | ID | Pantalla |
> |---|---|
> | MP-01 | Mi Perfil (hub): avatar, perfil 80 % completo, «Para ti» (acción requerida), trámites con barra de pasos, accesos rápidos, configuración |
> | MP-02 | Mis trámites en curso (resumen, filtros, tarjetas con pasos; vista clásica para dominios no migrados) |
> | MP-03 | Detalle del trámite (resumen, acción requerida, «Así va tu trámite», ayuda) |
> | MP-04 / MP-11 | Accesibilidad (100 %) y (150 % + alto contraste) |
> | MP-05 / 06 / 07 | Seguridad · Notificaciones · Consentimientos |
> | MP-08 / 09 / 10 | Vacío «Todo al día» · Error parcial por dominio · Cargando |
> | 31 / 32 | «Mis datos» y «Certificados» = pantallas de referencia existentes |
>
> La versión anterior (sección `404-7795`, P-01 a P-14) queda como **wireframe**; su tablero de handoff (estados, escalado, App Shell y eventos) sigue vigente.

**Figma:** sección «Mi Perfil · Mi Cuenta (hub privado)» → https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=404-7795
**Prototipo:** flujo «Mi Perfil» (inicia en P-01).

**Objetivo de negocio:**
- Bajar las llamadas al Call Center y las visitas a sucursal por estado de trámites.
- Subir la autogestión, sobre las 214.649 visitas/mes actuales a «Actualización de perfil».
- Mejorar el SNEX y cumplir accesibilidad AA/AAA.

## Pantallas

| ID | Pantalla | Historia | Nodo |
|---|---|---|---|
| P-01 | Mi perfil (hub) | US-01 | ver sección |
| P-02 | Mis datos | US-01 | |
| P-03 | Editar teléfono (validación) | US-01 / US-05 | |
| P-04 | Cargas familiares | US-01 | |
| P-05 | Accesibilidad (100 %) | US-02 | |
| P-06 | Accesibilidad (150 % + alto contraste) | US-02 | |
| P-07 | Mis solicitudes en curso | US-03 | |
| P-08 | Detalle de solicitud (línea de tiempo) | US-03 | |
| P-09 | Sin solicitudes (vacío) | US-03 / US-05 | |
| P-10 | Error parcial por dominio | US-03 / US-05 | |
| P-11 | Cargando (skeleton) | US-05 | |
| P-12 | Seguridad y dispositivos | US-04 | |
| P-13 | Notificaciones | US-04 | |
| P-14 | Consentimientos | US-04 | |
| — | Tablero «US-05 · Handoff Mi Perfil» | US-05 | |

## Decisiones de diseño

- **Hub por bloques:** tarjeta del afiliado y luego Mi cuenta → Seguimiento → Configuración. Si hay un trámite que requiere acción, aparece un aviso arriba con acceso directo.
- **Mis datos:** paridad AS-IS. Nombre y RUT se muestran bloqueados y se indica que se corrigen en sucursal. Correo, teléfono y dirección se editan con verificación.
- **Cargas familiares:** solo lectura. La app no crea afiliaciones, así que agregar o quitar cargas lo hace el empleador o una sucursal.
- **Accesibilidad:**
  - Vista previa en vivo con una tarjeta real de solicitud y el contraste calculado.
  - Escala de texto en 100 / 115 / 130 / 150 %.
  - Ajustes: seguir el tamaño del teléfono, alto contraste, reducir animaciones y modo lector de pantalla.
- **Solicitudes:**
  - Filtros por dominio con contador.
  - Tarjeta con pictograma, trámite, etiqueta de estado, folio y fecha.
  - Detalle con resumen, alerta de acción requerida con su llamado a la acción, y línea de tiempo de 5 pasos.
- **Etiquetas de estado:** se distinguen por ícono, texto y color, nunca solo por color. Sin verde ni amarillo, por regla de marca; el rojo se usa solo para «Rechazada».

  | Estado | Colores | Contraste |
  |---|---|---|
  | En revisión | Navy sobre celeste 10 % | 15,6:1 |
  | Aprobada | Blanco sobre azul #094AFF | 6,1:1 |
  | Requiere acción | Azul con borde | 6,1:1 |
  | Rechazada | Rojo oscuro #B0102A sobre rosa | 6,1:1 |

- **Excepciones:**
  - Vacío: invita a explorar beneficios.
  - Error parcial: solo falla el dominio afectado, que tiene su propio «Reintentar» que recarga solo ese dominio.
  - Skeleton: replica la forma real de la pantalla.
- **Seguridad:**
  - Ingreso con huella o rostro (soft login).
  - Cambio de clave.
  - Un dispositivo activo a la vez, con la opción «Cambiar de dispositivo», que pide validar la identidad.
- **Notificaciones:** push por categoría, más correo y SMS. La campanita muestra siempre todo, y los avisos de seguridad no se pueden apagar.
- **Consentimientos:** los opcionales se activan y desactivan con un switch. Los obligatorios se muestran con su fecha de aceptación y un enlace para verlos.

## Reglas para casos borde

**Convivencia entre módulos AS-IS y evolucionados**
- Mi Perfil es un App Shell: encabezado, barra inferior, fondo y espaciados.
- Cada módulo es un plugin que se pinta dentro del shell.
- Los dominios aún no migrados se abren como «Vista clásica ↗», embebida dentro del shell, con el mismo encabezado y botón volver.

| Módulo | Ene 2027 | Desde feb 2027 |
|---|---|---|
| Mis datos / Actualización de perfil | AS-IS | Evolucionado |
| Licencias médicas | Nativo | Nativo |
| Centro de notificaciones | Nativo | Nativo |
| Créditos, Seguros, Ahorro | Vista clásica | Nativo |

**Accesibilidad del SO y de la app al mismo tiempo**
- Escala efectiva = escala del SO × escala de la app, con tope de 1,5.
- Las tarjetas crecen en alto (nunca tienen alto fijo) y los títulos no se truncan.
- Desde 130 %, la tarjeta de solicitud pasa a layout vertical.
- El área táctil mínima es 48 px.

| Token | Base | Máximo |
|---|---|---|
| `text/title` | 17/24 | 26/36 |
| `text/heading` | 18/24 | 27/36 |
| `text/body` | 16/22 | 24/33 |
| `text/caption` | 13/18 | 19,5/27 |
| `text/tag` | 12/16 | 18/24 |

## Analítica (hiper-taggeo)

16 eventos en snake_case, iguales en iOS y Android y sin datos personales (el folio va con hash). El detalle de cada evento está en el tablero de handoff:

`perfil_view`, `perfil_menu_click`, `datos_editar_click`, `datos_guardar`, `accesibilidad_cambio`, `solicitudes_view`, `solicitudes_filtro`, `solicitud_detalle_view`, `solicitud_accion_click`, `solicitudes_error_dominio`, `solicitudes_reintentar`, `solicitudes_vacio_cta`, `seguridad_biometria`, `dispositivo_cambio_inicio`, `notificaciones_toggle`, `consentimiento_toggle`.

## Componentes nuevos (frame «Componentes · Mi Perfil»)

- `Solicitud/Estado`: 4 variantes.
- `Solicitud/Tarjeta`: con pictograma intercambiable.
- `Perfil/Fila menú`: con etiqueta, detalle, contador y pictograma intercambiable.
- `Control/Switch`: activo e inactivo.
- `Privado/Encabezado`: título como propiedad.
- `Privado/Barra inferior`.

Se reutilizan `Login/Botón`, `Login/Campo` y los pictogramas.

## Pendientes y supuestos para validar

- **Datos de ejemplo:** folios, fechas y nombres son ficticios. Falta confirmar el formato real de folio por dominio.
- **Pasos de la línea de tiempo:** confirmar con negocio los pasos por dominio. Por ahora solo está la licencia médica.
- **Código por SMS:** falta la pantalla de ingreso del código al editar el teléfono.
- **Tokens del Design System Runtime:** los colores y textos están como valores, no como variables. Hay que conectarlos cuando exista la librería.

## Drawer privado (entrada a Mi Perfil)
Pantalla «Drawer privado · Mi cuenta» `538:11353` (Page 1, a la derecha de la sección v2). Flujo de prototipo «Drawer privado → Mi Perfil».
- Tarjeta del afiliado → **Mi Perfil** (datos y medios de pago) → hoy enlaza a MP-14.
- Grupo «Mi cuenta», fuera de Mi Perfil: Certificados (→ 32), Cargas familiares (→ MP-19), Solicitudes (→ MP-02, contador «en curso»), Configuración (notificaciones, accesibilidad y seguridad; pantalla interna pendiente).
- «Tus productos» en grilla de 2 columnas (mismos íconos que «Panel del menú/Variant2») y «Cerrar sesión».
- Sin amarillo ni verde: el botón amarillo y el punto verde del panel original se reemplazaron.
- Opciones del drawer (para decidir):
  - **Opción A** `543:11357`: todo en vertical con el diseño de filas original, en secciones Mi cuenta / Tus productos / ¿Necesitas ayuda?
  - **Opción B** `543:11510`: por áreas: Mi cuenta / Mis finanzas (Créditos, Ahorro) / Salud (Licencias médicas, Seguros) / Bienestar (Beneficios, Pensionados) / Turismo / ¿Necesitas ayuda?
  - La línea punteada celeste marca el pliegue de 812 px; bajo ella el drawer hace scroll.
- **MP-27 · Mi Perfil (desde drawer)** `548:11203`: destino del botón «Mi perfil» del drawer (opción A). Contiene solo datos y medios de pago: avatar, barra «Tu perfil está al 80 %» con atajo a la dirección (→ MP-17), aviso de verificación, Datos de contacto (editar → MP-15), Medios de pago (→ MP-18). Nombre, estado «Afiliada activa» y RUT van bajo el avatar como identidad (nunca editables); el avatar se cambia con el botón lápiz. Cargas familiares salió de Mi Perfil porque ahora está en el drawer.
- **MP-27 v2 (experiencia y accesibilidad):** datos de contacto como filas tocables (ícono, etiqueta con «Verificado», valor de 16 px y flecha), sin el botón «Editar datos de contacto». La dirección pendiente es una fila destacada con borde punteado y botón «+» (→ MP-17). Medio de pago: «Cuenta RUT · BancoEstado · termina en 4521». Notas de accesibilidad en el frame `557:11294`. Respaldo: `556:11267`.
- Íconos en Font Awesome Regular: `envelope` (correo), `message` (teléfono; `mobile` es Pro y el plugin no tiene Font Awesome Pro, así que se cambia en Figma), `location-dot` (dirección, instancia Pro), `credit-card` (medio de pago), `pen-to-square` (avatar).
- Datos de contacto como lista limpia: ícono de 24 px | etiqueta de 14 px gris + valor de 16 px, con separadores. La dirección pendiente va en azul con su ayuda debajo. Medio de pago con el mismo patrón de ícono, sin baldosa.

## Flujo Mi Perfil desde el drawer (sección `580:11461`, «Flujo · Mi Perfil (desde drawer)»)
Pantallas conectadas con flechas estilo FigJam y con prototipo:
- Drawer A → **MP-27 Mi Perfil**. Las filas de contacto tienen «Editar» o «Agregar» y abren hojas inferiores:
  - MP-27c Cambiar correo · MP-27d Cambiar teléfono (→ código SMS MP-16)
  - MP-27e Buscar dirección (buscador con sugerencias y «Usar mi ubicación actual») → MP-27f Confirmar dirección (depto e indicaciones)
- **MP-29 Medio de pago:** lista de cuentas con el componente `Cuenta bancaria` (`584:11531`, Seleccionada Sí/No: radio, borde azul y etiqueta «Aquí recibes tus pagos»). Tocar otra cuenta lleva a MP-29c (selección cambiada + «Recibir mis pagos en…»). «Agregar otra cuenta» abre la **hoja inferior** MP-29b sobre Medio de pago (selectores de Banco y Tipo de cuenta, y Número). Banco abre la hoja MP-29d (buscador y todos los bancos) y Tipo de cuenta abre la hoja MP-29e (opciones con radio); al elegir, vuelven a MP-29b. Se quitó «Último depósito».
- **MP-30 Editar perfil:** avatar con pictogramas o foto, y nombre para saludarte (el nombre legal y el RUT no se editan).
- **Biometría obligatoria:** todo guardado pasa por **MP-31 Confirmar con biometría** (huella o rostro, con alternativa «Usar mi clave») → **MP-27g** aviso «¡Listo! Guardamos tu cambio», que vuelve solo a Mi Perfil a los 2,5 s.

### Resultados de guardado y alias
- Componente **`Aviso de cambio`** (`594:12086`): Estado Éxito/Error × Tipo (Correo, Teléfono, Dirección, Cuenta nueva, Cuenta de pago, Perfil). Éxito en verde `#006E62` y Error en rojo `#B42318`, con un solo ícono transversal por estado (`circle-check` en éxito, `circle-xmark` en error), igual para todos los tipos. Textos cortos y cercanos («¡Listo! Cambiamos tu correo» / «Ups, no pudimos…» + «Reintentar»). Éxito dura 4 s; Error no se cierra solo.
- Cada flujo tiene su biometría (MP-31a–f) y su pantalla de éxito con el dato nuevo destacado (MP-27g/h/i/j, MP-29f/g).
- **Alias** («Te saludamos como …» en Mi Perfil, se edita en MP-30). Tablero «¿Dónde se ve tu alias?» (`597:11976`): inicio privado («Hola, Mari»), tarjeta del drawer y push/campanita. Nunca en documentos, certificados ni pagos (ahí va el nombre legal). Vacío = primer nombre legal; máx. 20 caracteres.
- **Editar todo a la vez:** en MP-27 el título «Datos de contacto» tiene el enlace «Editar todo» → **MP-27k · Editar mis datos** `694:12068` (correo, teléfono, dirección con selector que abre el buscador MP-27e, y depto opcional; un solo «Guardar cambios») → **MP-31g** biometría una sola vez → **MP-27l** aviso «¡Listo! Guardamos tus datos». La edición por dato (hojas inferiores) se mantiene para cambios puntuales.
- **Editar mis datos · un solo CTA y casos** (sin «Cancelar»; volver = salir sin guardar). «Guardar cambios» solo se habilita con todo completo y válido:
  - A · Sin llenar `738:12165`: placeholders, CTA deshabilitado, «Completa correo, teléfono y dirección para guardar».
  - B · Completo `738:12246`: CTA habilitado, aviso de biometría una sola vez.
  - C · Falta un dato `738:12340`: teléfono vacío en foco con «Falta tu teléfono para guardar», CTA deshabilitado.
  - D · Con errores `738:12430`: correo sin dominio, teléfono incompleto y dirección sin elegir de la lista, en rojo con mensaje claro; CTA deshabilitado y «Corrige los 3 datos marcados».
- **Más de 1 medio de pago:** MP-27m `745:12296`. La tarjeta «Medios de pago» muestra el contador («2 cuentas»), la cuenta principal con la etiqueta «Aquí recibes tus pagos», las demás cuentas debajo y el enlace «Cambiar o agregar cuenta ›», que lleva a Medio de pago (MP-29). Con 1 sola cuenta se mantiene la fila simple de MP-27.
