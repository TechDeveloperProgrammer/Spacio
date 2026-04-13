#!/usr/bin/env bash

# =========================================
# FIX TECLADO - ESPACIO Y TAB
# Funciona incluso si no puedes usar espacio
# =========================================

echo "[+] Aplicando configuración de teclado..."

# Crear archivo temporal de keymap usando hex (sin depender de espacios físicos)
MAP_FILE="/tmp/fix_teclado.map"

printf 'keycode\x2042\x20=\x20space\x0a' > "$MAP_FILE"
printf 'keycode\x2054\x20=\x20space\x0a' >> "$MAP_FILE"
printf 'keycode\x2015\x20=\x20Tab\x0a' >> "$MAP_FILE"

echo "[+] Keymap creado en $MAP_FILE"

# Cargar configuración
sudo loadkeys "$MAP_FILE"

# Verificar
if [ $? -eq 0 ]; then
    echo "[✓] Teclado reparado temporalmente"
    echo "    - Shift izquierdo -> SPACE"
    echo "    - Shift derecho  -> SPACE"
    echo "    - Tab restaurado"
else
    echo "[✗] Error al aplicar configuración"
fi

# Opcional: hacer persistente
read -p "¿Hacerlo permanente? (y/n): " RESP

if [[ "$RESP" == "y" || "$RESP" == "Y" ]]; then
    echo "[+] Guardando configuración permanente..."

    sudo mkdir -p /etc/keymap
    sudo cp "$MAP_FILE" /etc/keymap/fix_teclado.map

    echo "KEYMAP=/etc/keymap/fix_teclado.map" | sudo tee /etc/vconsole.conf > /dev/null

    echo "[✓] Configuración permanente aplicada"
fi

echo "[+] Listo"
