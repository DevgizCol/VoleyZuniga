#!/bin/bash
# Busca videos cortos en YouTube por área, baja el audio y lo transcribe.
# Uso: bash scripts/investigacion/investigar.sh <consultas area|búsqueda> <carpeta de salida fuera del repo>
set -u
CONSULTAS=$(realpath "$1"); SALIDA="$2"; AQUI=$(dirname "$(realpath "$0")")
YTDLP=${YTDLP:-/var/data/python/bin/yt-dlp}
mkdir -p "$SALIDA" && cd "$SALIDA" || exit 1
while IFS='|' read -r area q; do
  [ -z "$q" ] && continue
  "$YTDLP" -q --no-warnings -x --audio-format mp3 --no-playlist \
    --match-filter "duration < 480 & duration > 30" --max-downloads 3 \
    --print-to-file "%(id)s	$area	%(title)s	%(channel)s	%(webpage_url)s	%(duration)s" videos.tsv \
    -o "%(id)s.%(ext)s" "ytsearch12:$q"
done < "$CONSULTAS"
python3 "$AQUI/transcribir.py" "$SALIDA"/*.mp3
