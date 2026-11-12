# Equipo DXD · Dashboard

Directorio privado del equipo: cumpleaños, correos, teléfonos, ideas de regalo,
dirección y contacto de emergencia. Es un sitio aparte de la oficina virtual.

## Acceso
- Cada integrante entra con su **usuario personal** (el usuario compartido de la
  oficina no tiene acceso). La primera vez debe crear su propia clave.
- Los administradores agregan integrantes, restablecen claves y quitan accesos
  desde la pestaña **Administración**.

## Privacidad
- Todo el equipo ve: nombre, cargo, cumpleaños, correo, teléfono e ideas de regalo.
- **Dirección y contacto de emergencia** solo los ven la propia persona y los
  administradores. Esto se controla en la base de datos (funciones `dxd_team_*`),
  no solo en la pantalla.

## Publicar en Netlify
Arrastra esta carpeta (`equipo-dxd`) a https://app.netlify.com/drop como un sitio
nuevo, o conecta el repo con **Base directory** = `equipo-dxd`.
