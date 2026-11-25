# Pantallas · Nueva app Caja Los Andes

Guía para continuar el diseño de pantallas. Todo está en el mismo archivo de Figma.

- **Archivo:** `KYkGyj4aPR543B9RTYtMZq` · página *Page 1*
- **Link a un nodo:** `https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=X-Y` (el ID `98:4882` se escribe `98-4882` en el link)

---

## 1. Reglas de negocio (leer antes de diseñar)

1. **La app NO crea cuentas ni afiliaciones.** Nunca diseñar "Crear cuenta" ni "Afíliate aquí".
2. **Solo un afiliado que aún no tiene clave puede crear su clave** desde la app.
3. **Se pueden afiliar solo empresas (por sus trabajadores) y pensionados.** Un independiente o un trabajador de empresa no afiliada recibe orientación, no un formulario.
4. El ingreso es siempre por **RUT**. El sistema decide el camino (tiene clave / sin clave / no afiliado / bloqueado).

## 2. Convenciones visuales

| Tema | Regla |
|---|---|
| Colores | Solo marca: `#094AFF` (primario), `#131252` (texto/oscuro), `#06C2FA` (acento). Pictogramas: trazo `#1C48F5`, acento `#58C0F7` |
| Prohibido | Amarillo y verde de marca. **Estados funcionales:** éxito verde `#006E62`, error rojo `#B42318`, siempre con ícono + texto |
| Botones | Píldora (radio completo). Primario relleno `#094AFF`, secundario contorno |
| Tipografía | Objetivo: **Averta**. Hoy los textos están en **Figtree** (Regular / Medium / Bold) porque Averta no carga en las herramientas. Alternativa libre: **Mulish**. Pendiente el cambio global |
| Tono | Humano y cercano, tuteo ("Te damos la bienvenida", "¿Olvidaste tu clave?") |
| Carga cognitiva | Poco texto: un título, una línea de apoyo, una acción principal. Accesos directos solo con texto (sin íconos) cuando la pantalla ya tiene ilustración |
| Ilustraciones | 36 ilustraciones 327 × 220 (ej. bienvenida `7:2`). Ver *Guía ilustraciones* `177:6824` |
| Pictogramas | Usar instancias `Pictograma/<Categoría>/<nombre>`. Ver `docs/ICONOS.md` |
| Animación | Coherente con el contexto de cada elemento; suave; nunca decorativa sin sentido |

## 3. Flujos

Estado: ✅ listo para revisión · 🟡 en curso / requiere ajuste · ⏳ pendiente

### 3.1 Home público ✅
| Pantalla | Nodo |
|---|---|
| Home público · Full Banner (versión vigente) | [`98:4882`](https://www.figma.com/design/KYkGyj4aPR543B9RTYtMZq/?node-id=98-4882) |
| Opción B | `152:5134` |
| Respaldos | `149:4782`, `213:6946` |
| Sitemap Home público | `186:6950` |
| Componente Tarjeta/Beneficio vitrina | `145:9600` |

Secciones del home, de arriba hacia abajo: Header · Banner Escuela de Verano · Trámites frecuentes (accesos) · Tarjeta "¿Eres afiliado?" (test sin RUT, liquidación animada) · Beneficios para ti (carrusel vitrina) · Banner Cargas familiares · Navbar.

### 3.2 Búsqueda de beneficios ✅
| Pantalla | Nodo |
|---|---|
| Sugerencias | `152:4911` |
| Escribiendo | `156:5040` |
| Resultados | `152:5026` |
| Sin resultados | `156:5150` |
| Detalle del beneficio | `156:5204` |

### 3.3 Test "¿Eres afiliado?" (sin RUT) 🟡
| Pantalla | Nodo |
|---|---|
| 1 · Ingresos | `157:5066` |
| 2 · Liquidación | `157:5371` |
| 3a · Sí eres afiliado | `157:5673` |
| 3b · Tu empresa no está afiliada | `157:5954` |
| 3c · Independiente | `157:6222` |

Faltan: resultado **pensionado** y resultado **"no tengo liquidación"**.

### 3.4 Log in · Validador de RUT ✅ (flujo vigente)
| Grupo | Pantallas |
|---|---|
| A · Ingreso RUT | 1.1 Bienvenida vacío `173:6569` (con accesos "Ayuda ›" y "Sucursales ›"), 1.2 `173:6587`, 1.3 `173:6622`, 1.4 `173:6661`, 1.5 `173:6699`, 1.6 `173:6737` |
| B | 2.1 `174:6676`, 2.2 `174:6738`, 2.3 `174:6800`, 2.4 `174:6868`, 2.5 `174:6940` |
| C | 3.1 `174:6992`, 3.2 `174:7047` |
| D | 4.1 `174:7107`, 4.2 `174:7157`, 4.3 `174:7206` |

- Sección antigua `49:3494` renombrada "· ANTERIOR" (solo referencia).
- La sección `145:11007` "LOG IN Flujo DESDE Crear cuenta" contradice la regla 1: revisar si se elimina.
- 1.1 Bienvenida original: `145:10569`.

### 3.5 Crear clave 4.x ✅
| Pantalla | Nodo |
|---|---|
| 4.1 | `133:6961` |
| 4.2 | `136:4421` |
| 4.3 | `136:4530` |
| 4.4 | `136:4647` |
| 4.5 | `136:4779` |
| 4.6 | `136:4917` |
| 4.7 | `136:5055` |
| Componentes · Clave | `136:4198` |

### 3.6 Términos y clave creada 🟡
| Pantalla | Nodo |
|---|---|
| 5.1 Términos | `140:7596` |
| Política de privacidad | `106:3977`, `106:4164` |
| 5.3 Cuenta creada | `262:7468` · variante blanca `122:4031` · opción C `123:4058` |
| 5.3 Bienvenida animada · A Regalo sorpresa (`sonidos/bienvenida-a-regalo.mp3`) | `117:6618` |
| 5.3 Bienvenida animada · B Fiesta andina (`sonidos/bienvenida-b-fiesta-andina.mp3`) | `268:7502` |
| 5.3 Bienvenida animada · C Beneficios al vuelo (`sonidos/bienvenida-c-beneficios.mp3`) | `270:7536` |
| 5.3 Bienvenida animada · D Minimal (revelado circular azul; tonos cortos `sonidos/tono-1-pulso`, `tono-2-brillo`, `tono-3-andes`) | `273:7609` |
| 5.3 Bienvenida animada · E Bienestar activado (fondo D + beneficios C + switch; `melodia-1-caja-los-andes` + `switch-bienestar`) | `281:7616` |
| 5.3 Bienvenida animada · F Switch bienestar (switch glass al centro, destello + beneficios; `sonidos/melodia-real-*.mp3`) | `284:7662` |
| 5.3 Bienvenida animada · F2 Switch bienestar, fondo blanco | `297:7708` |
| 5.3 Propuesta animada A · "Lluvia de challa" | `219:7090` |
| 5.3 Propuesta animada B · "Fiesta azul" | `223:7117` |

Ajustar textos: no es "cuenta creada" sino **"clave creada"** (regla 1). Las bienvenidas animadas no tienen botón ni info extra: solo pictograma + título, y pasan solas al Home (2,5 s). Falta elegir entre A, B y C. Sonidos: `herramientas/sonidos/generar.py`.

### 3.7 Reconexión 🟡
2.1 `113:6231` · 2.2 `115:3977` · 2.3 `115:4217` · 2.4 `115:4457`. Falta el estado **cancelar**.

### 3.8 Verificación / registro 🟡
3.1 `104:5566` · V5a `41:33` · V5b `42:1155` · V5c `42:1218` · R2 `68:2577` · R4 `68:2591`.
Hay que adaptarlo a la regla 1 (no hay registro: solo verificación de identidad para crear clave).

### 3.9 Sucursales ✅
`68:2878` · `68:2947` · `68:3000` · componentes `82:3192`.

### 3.10 Notificaciones ✅
Lista `89:3778` · Detalle `94:3835` · componentes `89:3733`.

### 3.11 Centro de ayuda ✅
Página "App · Centro de ayuda" `21:63` · componentes `21:3`.

### 3.12 Tableros de apoyo
| Tablero | Nodo |
|---|---|
| Guía de ilustraciones | `177:6824` |
| Pictogramas (construidos y animados) | `230:7197` |
| Pictogramas calcados (obsoleto, no usar) | `225:7144` |
| Ilustración animada de seguridad | `1:2` |
| Ejemplo "Ready for Dev" (LOG-01 … LOG-08) | encabezado "Ready for Dev · Encabezado" |

## 4. Pendientes (priorizados)

| # | Tarea | Tipo |
|---|---|---|
| 1 | Ajustar Verificación/registro y 5.x a la regla "no se crean cuentas" | Diseño |
| 2 | Test afiliado: resultados pensionado y sin liquidación | Diseño |
| 3 | Reconexión: estado cancelar | Diseño |
| 4 | Recuperar clave (flujo completo) | Diseño |
| 5 | Menú ≡ (home público) | Diseño |
| 6 | Campañas del carrusel del home | Diseño |
| 7 | Simulador de crédito | Diseño |
| 8 | Cambio global de tipografía a Averta (o Mulish) | Diseño |
| 9 | Elegir propuesta 5.3 (A o B) | Decisión |
| 10 | Confirmar n.º de intentos de clave y tiempo de bloqueo | Negocio |
| 11 | Contrato de API con backend (respuestas del validador de RUT) | Técnico |

## 5. Cómo trabajar sin romper nada

- Duplicar la pantalla antes de cambios grandes y nombrar el respaldo con "· respaldo".
- Usar componentes e instancias existentes (Clave, Sucursales, Notificaciones, Tarjeta vitrina, Pictogramas); no desacoplar.
- Nombrar frames como `<n.º> · <Nombre>` (ej. `2.3 · RUT sin clave`) dentro de la sección de su flujo.
- Al terminar un flujo, marcarlo en esta tabla y moverlo a "Ready for Dev" con el encabezado de ejemplo.

### Loader · V4 Buscándote en tu Caja (`309:24801`)
Bucle de 2,4 s mientras se valida el RUT: el isotipo outline se dibuja y se borra (path trim, línea que viaja); halos con dos ondas tipo sonar; arco azul que gira alrededor del centro y se alarga y acorta (estilo loader nativo); el isotipo central queda fijo (sin animación). Respaldo: `318:7778`.

### 3.13 Mi Perfil · Mi Cuenta (hub privado) 🟡
Sección `404:7795` · 14 pantallas P-01 a P-14 + tablero de handoff. Detalle en `docs/MI-PERFIL.md`.

### Stepper vertical (página «stepper v1» `513:11742`) ✅
- `Stepper / Paso vertical` `514:11748`. Estado: Actual (azul), Pendiente (naranjo), Éxito (verde), Error (rojo) y Disable (gris). Textos: Título, Descripción y Fecha. Booleanos: Mostrar descripción, Mostrar fecha, Mostrar conector, **Mostrar mensaje 1** y **Mostrar mensaje 2**. Los dos mensajes son instancias expuestas: su Tipo y su Texto se editan desde el panel del paso.
- `Stepper / Mensaje adicional` `514:11852`. Tipo: Información, Confirmación, En proceso y Advertencia. Texto editable y booleano «Mostrar ícono».
- Alto libre: al estirar un paso (o fijar su alto) el conector se estira solo hasta el siguiente paso; con «Hug» vuelve al alto de su contenido.
- Ejemplo con instancias: sección «Casuísticas «En revisión» · con componentes» `524:11499`.
- Duplicados y borradores archivados en «Archivo · no usar» `522:11472`.
- Nota: Rawson Pro no carga en el plugin, así que los títulos y fechas de los ejemplos se escriben a mano en Figma.

### Splash de apertura (página «splash» `621:14220`) 🟡
- **Splash · Switch (apertura de la app)** `629:12067`: basado en la bienvenida F2. El isotipo aparece, el switch se enciende y el isotipo pasa al logo completo (≈1,5 s, timeline de 3,2 s). Sin textos ni pictogramas de beneficios. Fondo blanco.
- Pantalla de inicio nativa: blanca y vacía. Con «Reducir movimiento»: logo completo fijo. Notas para dev al lado del frame.
- **Splash · Switch azul (apertura brutal)** `633:12067`: fondo navy, un círculo azul llena la pantalla, isotipo y logo en blanco (celeste se mantiene), switch glass sobre azul, 2 ondas de luz al encender, brillo celeste detrás del logo; el switch se retira y el logo queda centrado (2,9 s).
- **Splash · Activa tu Bienestar** `635:12067` (basado en el comercial «Activa tu Bienestar»): fondo azul, pastilla de vidrio con borde tornasol, la perilla se enciende como esfera de luz que florece y llena la pantalla de blanco; en blanco aparece el isotipo, se arma el logo completo, sale «Activa tu Bienestar» y se dibujan las líneas de marca celeste y azul (3,6 s).
- **Splash · Activa tu Bienestar · ventana isotipo** `637:12067`: igual que el anterior, pero la luz del switch se convierte en el isotipo con una foto por dentro, que crece hasta llenar la pantalla (zoom a través de la «A»); luego barrido blanco curvo y cierre con logo y «Activa tu Bienestar» (5,6 s). Borde tornasol reforzado. Foto de prueba tomada del comercial: reemplazar en la capa «Foto». Sonido: `sonidos/splash-activa-tu-bienestar.mp3` (cierre musical del comercial, entra con el barrido blanco a los 2,9 s; confirmar derechos de uso de la música en la app).
- Splash anterior (azul, «Cargando…»): `621:14477`.
