# Equipo DXD · Dashboard

Directorio privado del equipo: cumpleaños, correos, teléfonos, ideas de regalo,
dirección y contacto de emergencia. Es un proyecto independiente, con sus propias cuentas.

## Acceso
- Cada integrante entra con su **usuario personal**. La primera vez debe crear su propia clave.
- Los administradores agregan integrantes, restablecen claves y quitan accesos
  desde la pestaña **Administración**.

## Privacidad
- Todo el equipo ve: nombre, cargo, cumpleaños, correo, teléfono e ideas de regalo.
- **Dirección y contacto de emergencia** solo los ven la propia persona y los
  administradores. Esto se controla en la base de datos (tablas y funciones `equipo_*`),
  no solo en la pantalla.

## Publicar en Netlify
Arrastra esta carpeta (`equipo-dxd`) a https://app.netlify.com/drop como un sitio
nuevo, o conecta el repo con **Base directory** = `equipo-dxd`.

## Fuente

El diseño usa **Averta**. Como es una fuente con licencia, no viene incluida:
copia `Averta-Regular.woff2`, `Averta-Semibold.woff2` y `Averta-Bold.woff2` en la carpeta `fonts/`.
Sin esos archivos se usa Figtree, que es muy parecida.

## Publicar en Vercel

Importa el repositorio en Vercel y en "Root Directory" elige `equipo-dxd` (Framework: Other, sin comando de build). `vercel.json` aplica las mismas cabeceras que `netlify.toml`.

## Mostrarlo dentro de Google Sites

1. Publica el sitio en Vercel (o Netlify) como siempre.
2. En Google Sites: **Insertar → Insertar → Por URL** y pega el link del sitio
   (puedes agregar `?estilo=claro` al final).
3. Agranda el recuadro para que se vea completo.

El sitio solo permite mostrarse dentro de Google Sites (cabecera `frame-ancestors`);
cualquier otra página que intente incrustarlo será bloqueada.
