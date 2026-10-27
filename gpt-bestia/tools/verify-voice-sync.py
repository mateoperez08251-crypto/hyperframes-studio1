"""Comprueba la posición de la voz real dentro del MP4 por correlación."""
import json
import pathlib
import subprocess
import sys
import numpy as np
from scipy.signal import correlate

root = pathlib.Path(sys.argv[1]).resolve()
video = root / "chatgpt-bestia-20s-con-voz.mp4"
reference = root / "assets/voice/narracion.wav"
rate = 16000

def pcm(file):
    data = subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(file), "-vn", "-af",
        "highpass=f=180,lowpass=f=6000", "-ar", str(rate), "-ac", "1",
        "-f", "f32le", "pipe:1"])
    return np.frombuffer(data, dtype=np.float32).astype(np.float64)

mix, voice = pcm(video), pcm(reference)
corr = correlate(mix, voice, mode="valid", method="fft")
energies = np.concatenate(([0.0], np.cumsum(mix * mix)))
windows = energies[len(voice):] - energies[:-len(voice)]
scores = corr / np.sqrt(np.maximum(windows * np.dot(voice, voice), 1e-20))
best = int(np.argmax(scores))
lag, score = best / rate, float(scores[best])
report = {
    "expectedVoiceStart": 0.35, "measuredVoiceStart": lag,
    "errorMilliseconds": (lag - 0.35) * 1000,
    "correlation": score, "toleranceSeconds": 1 / 30,
    "method": "Correlación del archivo de voz completo contra la mezcla final, banda 180–6000 Hz."
}
(root / "voice-sync-verification.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
assert abs(lag - .35) <= 1 / 30, report
assert score >= .60, report
print(json.dumps(report, indent=2))
