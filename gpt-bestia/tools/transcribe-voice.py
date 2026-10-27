"""Transcripción con tiempos por palabra usando la GPU de Colab."""
import json
import pathlib
import sys
import torch
import whisper

source = pathlib.Path(sys.argv[1])
output = pathlib.Path(sys.argv[2])
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Whisper small, idioma es, dispositivo {device}", flush=True)
model = whisper.load_model("small", device=device)
result = model.transcribe(
    str(source), language="es", word_timestamps=True, fp16=device == "cuda",
    temperature=0, condition_on_previous_text=False,
)
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print(result["text"], flush=True)
for segment in result["segments"]:
    for word in segment.get("words", []):
        print(f"{word['start']:6.2f}–{word['end']:6.2f} {word['word']}", flush=True)
