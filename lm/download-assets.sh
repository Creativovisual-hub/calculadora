#!/usr/bin/env bash
# Descarga los assets del diseño Figma "UI_CHRIS_2022 / flujo LM" a lm/assets/.
# Las URLs las entrega el MCP de Figma y caducan ~7 días después de generarse
# (2026-10-01). Si fallan, vuelve a pedir el design context de los nodos.
set -euo pipefail
cd "$(dirname "$0")/assets"

get() { curl -fsSL -o "$1" "$2" && echo "ok  $1" || echo "ERR $1"; }

L=https://www.figma.com/api/mcp/asset/4dc42ab0-3785-48f1-8e2e-316bbed78094   # Login 3264:6887
D=https://www.figma.com/api/mcp/asset/64ac168f-4624-4160-aefe-15b44ab2a747   # Dashboard 3264:6923
M=https://www.figma.com/api/mcp/asset/a50950f2-a9b7-48a1-83c8-46b6816d34d2   # Mis Licencias 3264:6852
B=https://www.figma.com/api/mcp/asset/da87b7bd-ceb8-423e-910f-30655065b7b8   # Modal datos bancarios 3264:7011

# Logos
get logo-cla-icon.svg        "$D/6152e.svg"   # icon/logo/CLA (header privado)
get logo-cla-full.svg        "$L/b4d72.svg"   # icono/Logos/CLA2 (login)
get logo-cla-footer.svg      "$M/8df5f.svg"   # logo footer privado
get logo-cla-square.svg      "$L/f77ba.svg"   # icono/Logos/Caja Los Andes 2 (header público)
get logo-tapp.svg            "$L/ab86f.svg"   # icon/logo/Tapp (header público)
get logo-tapp-white.svg      "$B/1884f.svg"   # Tapp logo (banner modal)
get logo-recaptcha.svg       "$L/d3258.svg"
# Header / perfil
get header-bar.svg           "$D/96c11.svg"   # Rectangle 7022 (franja degradada)
get avatar.png               "$D/bcb39.png"
get tag-nuevo.svg            "$D/3dec7.svg"
# Dashboard
get banner-credito.png       "$D/47bfc.png"
get banner-seguro.png        "$D/5b941.png"
get banner-copec.png         "$D/ea70f.png"
get tapp-thumb.png           "$D/41306.png"
# Modal datos bancarios
get banner-tapp.png          "$B/a030d.png"
# Footer privado: redes y tiendas
get social-facebook.svg      "$M/4871a.svg"
get social-instagram.svg     "$M/9ca77.svg"
get social-x.svg             "$M/383e1.svg"
get social-youtube.svg       "$M/aa73a.svg"
get social-linkedin.svg      "$M/985e7.svg"
get store-google-play.svg    "$M/f8cdc.svg"
get store-app-store.svg      "$M/d75bf.svg"
