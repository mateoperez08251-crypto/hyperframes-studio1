"""Normaliza la mezcla renderizada y guarda evidencia verificable del MP4."""
import json
import pathlib
import subprocess
import sys

project = pathlib.Path(sys.argv[1]).resolve()
source = project / (sys.argv[3] if len(sys.argv) > 3 else "render-raw.mp4")
target = project / (sys.argv[2] if len(sys.argv) > 2 else "chatgpt-bestia-20s.mp4")
with_voice = "con-voz" in target.name
report_name = "verification-voz.json" if with_voice else "verification.json"
review_name = "render-review-voz.jpg" if with_voice else "render-review.jpg"

compression = "acompressor=threshold=0.125:ratio=2.5:attack=5:release=100:makeup=1.4,"

def loudness(video, prefix=""):
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(video), "-vn", "-af",
         prefix + "loudnorm=I=-14:TP=-2:LRA=7:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True, check=True)
    return json.loads(result.stderr[result.stderr.rfind("{"):].strip())

first = loudness(source, compression)
audio_filter = (
    compression + "loudnorm=I=-14:TP=-2:LRA=7:linear=true:"
    f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
    f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
    f"offset={first['target_offset']}"
)
review_filter = (
    "select='eq(n,30)+eq(n,96)+eq(n,225)+eq(n,342)+eq(n,438)+eq(n,555)',scale=640:360,tile=3x2"
    if with_voice else
    "select='eq(n,60)+eq(n,240)+eq(n,420)+eq(n,570)',scale=640:360,tile=2x2"
)
subprocess.run(
    ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(source),
     "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy", "-af", audio_filter,
     "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-t", "20", "-movflags", "+faststart",
     "-y", str(target)], check=True)
measured = loudness(target)
probe = json.loads(subprocess.check_output(
    ["ffprobe", "-v", "error", "-show_entries",
     "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size",
     "-of", "json", str(target)], text=True))
assert abs(float(probe["format"]["duration"]) - 20) < .1, probe
assert any(s.get("width") == 1920 and s.get("height") == 1080 for s in probe["streams"])
assert any(s["codec_type"] == "audio" for s in probe["streams"])
assert abs(float(measured["input_i"]) + 14) < .7, measured
assert float(measured["input_tp"]) <= -1, measured
subprocess.run(
    ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(target), "-vf",
     review_filter,
     "-frames:v", "1", "-y", str(project / review_name)], check=True)
report = {"file": target.name, "probe": probe, "loudness": measured,
          "note": "Sonido medido, no escuchado; capturas del MP4 revisadas por separado."}
(project / report_name).write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report, indent=2))
