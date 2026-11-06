"""Transcribe cada audio pasado como argumento a <audio>.txt (CPU, idioma automático)."""
import os
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

modelo = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=10)
for ruta in sys.argv[1:]:
    salida = ruta.rsplit(".", 1)[0] + ".txt"
    if os.path.exists(salida):
        continue
    # PyAV instalado es incompatible con faster-whisper: decodificamos con ffmpeg (16 kHz mono f32)
    crudo = subprocess.run(["ffmpeg", "-v", "error", "-i", ruta, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                           capture_output=True, check=True).stdout
    segmentos, _ = modelo.transcribe(np.frombuffer(crudo, np.float32), vad_filter=True)
    texto = " ".join(s.text.strip() for s in segmentos)
    if not texto:  # video sin voz (solo música): se omite sin detener la tanda
        print(f"SIN VOZ {ruta}")
        continue
    open(salida, "w").write(texto)
    print(f"OK {ruta} ({len(texto)} caracteres)")
