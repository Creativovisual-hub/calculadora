# Oficina DXD

Oficina virtual multijugador del equipo (mapa pixel, chat, juegos y rankings).
Se entra con usuario y clave (pídeselos a quien administra la oficina).
La sesión queda guardada en el navegador por 60 días.

## Cómo funciona

- `index.html`: la oficina (exportada desde claude.ai).
- `net.js`: pantalla de login y conexión en vivo con Supabase, reemplazando lo que
  en claude.ai hacía `window.claude`.
- `supabase.js`: librería supabase-js 2.45.4 (incluida para no depender de un CDN).

En la base de datos todo vive en tablas `dxd_*` y funciones `dxd_*`. Las claves se guardan
cifradas (bcrypt) y las tablas no se pueden leer con la clave pública: se accede solo a
través de funciones que exigen una sesión válida.

## Publicar en Netlify

Arrastra esta carpeta (`oficina-dxd`) a https://app.netlify.com/drop, o conecta el repo
con **Base directory** = `oficina-dxd`.

## Agregar usuarios o cambiar claves

En el SQL Editor de Supabase:

```sql
insert into public.dxd_users (username, pass_hash)
values ('nombre', extensions.crypt('<clave>', extensions.gen_salt('bf', 10)));

update public.dxd_users set pass_hash = extensions.crypt('<clave nueva>', extensions.gen_salt('bf', 10))
where username = 'nombre';
```
