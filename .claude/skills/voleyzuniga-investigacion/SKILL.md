---
name: voleyzuniga-investigacion
description: Investigar videos (YouTube, Instagram, TikTok) sobre rendimiento, seguridad, diseño, mercadeo y buenas prácticas, transcribirlos en local y convertirlos en ideas clasificadas contra el código real de VoleyZuniga. Usar cuando el usuario pase enlaces o pida investigar un tema.
---

# Investigación de videos → ideas aplicables

Objetivo: lista de ideas clasificada como **ya lo tenemos / aplica / no aplica (y por qué)**. No cubre: implementar las ideas (eso va por `voleyzuniga-ciclo-cambio`).

## Entradas

- Búsquedas de YouTube: archivo `area|búsqueda` (ver `scripts/investigacion/consultas.txt`).
- Enlaces sueltos de Instagram/TikTok (no hay buscador para esas redes: pedirlos al usuario).
- Herramientas: `yt-dlp` en `/var/data/python/bin/`, `faster-whisper` (CPU, modelo small), `ffmpeg`.

## Bucle

1. Descargar y transcribir (los audios quedan fuera del repo):
   ```bash
   bash scripts/investigacion/investigar.sh scripts/investigacion/consultas.txt /ruta/scratch/reels
   # enlaces sueltos:
   /var/data/python/bin/yt-dlp -x --audio-format mp3 -o "/ruta/scratch/reels/%(id)s.%(ext)s" <url>
   python3 scripts/investigacion/transcribir.py /ruta/scratch/reels/*.mp3
   ```
2. Clasificar con Gemini (no gasta cuota de Anthropic) por área, quitando duplicados y relleno.
   - Gemini (`agy`) rechaza entradas grandes (`Argument list too long`): partir el corpus en trozos de ~55 000 caracteres, extraer ideas en formato `área | idea | fuente` por trozo (nivel `rapido`) y clasificar después la lista unida.
3. Contrastar cada idea con el código (rutas `archivo:línea`) y con los informes de auditoría.
4. Verificar la clasificación con otra familia (`gemini_verificar`).
5. Guardar en `docs/investigacion/` (solo ideas y fuentes; no subir audios ni transcripciones completas de terceros).

## Eval

- Cada idea "aplica" tiene evidencia en el código y un costo estimado.
- Si tras ~10 videos de un área casi no salen ideas nuevas, parar esa área.

## Notas

- Videos sin voz se omiten ("SIN VOZ"); ya transcritos no se repiten.
- PyAV instalado es incompatible con faster-whisper: `transcribir.py` decodifica con ffmpeg.
- Descargar de Instagram/TikTok va contra sus condiciones; uso interno de investigación.
