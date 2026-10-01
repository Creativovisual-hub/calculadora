# Flujo Licencias Médicas (prototipo mobile)

Implementación HTML/CSS/JS del diseño Figma **UI_CHRIS_2022 → página "flujo LM"**
(`f7BQekeYnYbT9jYNeab4ZO`, node `3264:3065`), sin dependencias ni build.

## Correr en local

```bash
./lm/download-assets.sh        # una vez: baja logos, banners e íconos de redes desde Figma
npx serve lm                   # o: cd lm && python3 -m http.server 8080
```

Abre `http://localhost:8080/#login`. La barra superior "Pantalla" salta a cualquier pantalla del flujo.
En producción (Vercel) queda en `/lm/`.

> Las URLs de assets de Figma caducan ~7 días después de generarse (2026-10-01). Si el script
> falla, hay que volver a pedirlas. Mientras falten, la página muestra reemplazos (wordmark de
> texto, íconos Font Awesome) para que no se rompa el layout.

## Pantallas (rutas hash)

| Figma | Ruta |
|---|---|
| Inicio Login SVP - 3 | `#login` |
| Dashboard - Mobile 2 cards | `#dashboard` |
| 01 Mis Licencias (listado) | `#licencias` |
| Enviado a COMPIN | `#detalle/compin` |
| modal (datos bancarios) | `#detalle/compin?modal=banco` |
| Documentación pendiente | `#detalle/pendiente` |
| modal upload | `#detalle/pendiente?modal=upload` |
| Documentación pendiente (todo cargado) | `#detalle/completa` |
| Envío — documentación enviada | `#detalle/enviada` |
| Resolución — licencia pagada | `#detalle/pagada` |

## Interacciones

- Login: el botón se habilita al completar RUT y clave.
- Dashboard: carrusel con flechas/puntos y acordeones de productos.
- Mis Licencias: búsqueda por número y filtro por estado (en la URL).
- Datos bancarios: el modal guarda y actualiza la tarjeta.
- Documentos: adjuntar archivo o foto (máx. 10 MB) → "Cargado"; con los 4 cargados aparece la
  declaración y "Enviar documentos" lleva a "Documentación enviada".

## Notas

- Tipografía: Rawson Pro es comercial; se usa **Nunito Sans** de reemplazo (si Rawson Pro está
  instalada, se usa automáticamente).
- Íconos: Material Icons (los mismos del design system) y Font Awesome Free para los íconos FA
  Pro del Figma. Ambos van empaquetados en `vendor/`, así que funciona sin conexión.
- Textos placeholder del Figma ("Botón de prueba", "Title") se reemplazaron por los que muestran
  las capturas; se corrigió "Yipo de cuenta" → "Tipo de cuenta".
