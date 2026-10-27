"""Entrega MP4, nivel final, verificación de voz y presencia relativa de efectos."""
import json
import pathlib
import subprocess
import sys
import numpy as np
from scipy.signal import correlate

root = pathlib.Path(sys.argv[1]).resolve()
raw, target = root / "render-raw.mp4", root / "irena-vector-20s.mp4"
prefix = "acompressor=threshold=0.18:ratio=1.8:attack=10:release=110:makeup=1,"

def loudness(file, before=""):
    run = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(file), "-vn", "-af",
        before + "loudnorm=I=-14:TP=-2:LRA=7:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True, check=True)
    return json.loads(run.stderr[run.stderr.rfind("{"):].strip())

first = loudness(raw, prefix)
chain = (prefix + "loudnorm=I=-14:TP=-2:LRA=7:linear=true:"
    f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
    f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:offset={first['target_offset']}")
subprocess.run(["ffmpeg", "-v", "error", "-i", str(raw), "-map", "0:v:0", "-map", "0:a:0",
    "-c:v", "copy", "-af", chain, "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
    "-t", "20", "-movflags", "+faststart", "-y", str(target)], check=True)
final = loudness(target)
probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
    "stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size",
    "-of", "json", str(target)], text=True))
assert abs(float(probe["format"]["duration"]) - 20) < .05, probe
assert any(s.get("nb_frames") == "600" and s.get("width") == 1920 for s in probe["streams"])
assert abs(float(final["input_i"]) + 14) < .7, final
assert float(final["input_tp"]) <= -1, final

rate = 16000
def pcm(file, band=False):
    args=["ffmpeg", "-v", "error", "-i", str(file), "-vn"]
    if band: args += ["-af", "highpass=f=180,lowpass=f=6000"]
    data=subprocess.check_output(args+["-ac", "1", "-ar", str(rate), "-f", "f32le", "pipe:1"])
    return np.frombuffer(data, dtype=np.float32).astype(np.float64)

voice_file = root / "assets/voice/narracion.wav"
mix, voice_band = pcm(target, True), pcm(voice_file, True)
corr=correlate(mix,voice_band,mode="valid",method="fft")
energies=np.concatenate(([0.],np.cumsum(mix*mix)))
windows=energies[len(voice_band):]-energies[:-len(voice_band)]
scores=corr/np.sqrt(np.maximum(windows*np.dot(voice_band,voice_band),1e-20))
lag=int(np.argmax(scores))/rate
score=float(np.max(scores))
assert lag <= 1/30 and score > .6, (lag, score)

timing=json.loads((root/"audio/sfx-timing.json").read_text())
voice=pcm(voice_file)*.95
effects=np.zeros(rate*20)
for name, hit, vol, cause, *mode in timing["cues"]:
    asset=timing["assets"][name]
    start=hit if mode and mode[0]=="start" else max(0,hit+1/30-asset["peak"])
    wave=pcm(root/asset["file"])*vol
    begin=round(start*rate); length=min(len(wave),len(effects)-begin)
    effects[begin:begin+length]+=wave[:length]
presence=[]
for name,hit in [("verja",15.84),("papel del año",11.29),("cambio de plano",8.18)]:
    a=round((hit-.02)*rate);b=round((hit+.14)*rate)
    fx=float(np.sqrt(np.mean(effects[a:b]**2)))
    vo=float(np.sqrt(np.mean(voice[a:b]**2)))
    presence.append({"event":name,"fxRelativeToVoiceDb":round(20*np.log10(max(fx,1e-9)/max(vo,1e-9)),2)})

subprocess.run(["ffmpeg", "-v", "error", "-i", str(target), "-vf",
    "select='eq(n,84)+eq(n,162)+eq(n,297)+eq(n,354)+eq(n,492)+eq(n,576)',scale=640:360,tile=3x2",
    "-frames:v", "1", "-y", str(root/"render-review.jpg")], check=True)
report={"file":target.name,"probe":probe,"loudness":final,
    "voiceSync":{"expectedStart":0,"measuredStart":lag,"correlation":score},
    "effectsPresenceBeforeMastering":presence,
    "notes":"Voz original a velocidad natural. Mezcla medida, no escuchada. Las relaciones RMS son una comprobación técnica de presencia, no una evaluación perceptiva."}
(root/"verification.json").write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
print(json.dumps(report,indent=2,ensure_ascii=False))
