import pathlib,subprocess,json
import numpy as np
from scipy.signal import correlate
root=pathlib.Path(__file__).resolve().parents[1]
raw=root/'render-raw.mp4'
def measure(file):
    r=subprocess.run(['ffmpeg','-hide_banner','-i',str(file),'-vn','-af','loudnorm=I=-14:TP=-2:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    return json.loads(r.stderr[r.stderr.rfind('{'):])
levels=measure(raw)
chain='loudnorm=I=-14:TP=-2:LRA=7:linear=true:'+':'.join(f'{key}={levels[value]}' for key,value in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])
fine=root/'irena-cine-20s.mp4'
for output,crf in [(fine,20),(root/'irena-cine-20s-redes.mp4',25)]:
    subprocess.run(['ffmpeg','-v','error','-i',str(raw),'-c:v','libx264','-preset','medium','-crf',str(crf),'-threads','8','-pix_fmt','yuv420p','-af',chain,'-c:a','aac','-b:a','192k','-ar','48000','-t','20','-movflags','+faststart','-y',str(output)],check=True)
subprocess.run(['ffmpeg','-v','error','-i',str(fine),'-vf','scale=720:1280:flags=lanczos','-c:v','libx264','-preset','medium','-crf','29','-maxrate','1200k','-bufsize','2400k','-threads','8','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-y',str(root/'irena-cine-20s-preview.mp4')],check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size','-of','json',str(fine)],text=True))
assert abs(float(probe['format']['duration'])-20)<.04
assert any(s.get('width')==1080 and s.get('height')==1920 and s.get('nb_frames')=='600' for s in probe['streams'])
final=measure(fine)
assert float(final['input_tp'])<=-1
assert abs(float(final['input_i'])+14)<.8
def pcm(file):
    data=subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-vn','-af','highpass=f=180,lowpass=f=6000','-ar','16000','-ac','1','-f','f32le','pipe:1'])
    return np.frombuffer(data,dtype=np.float32).astype(float)
mix,voice=pcm(fine),pcm(root/'assets/voice/narracion.wav')
corr=correlate(mix,voice,mode='valid',method='fft')
energy=np.concatenate(([0.],np.cumsum(mix**2)))
windows=energy[len(voice):]-energy[:-len(voice)]
scores=corr/np.sqrt(np.maximum(windows*np.dot(voice,voice),1e-20))
lag=int(np.argmax(scores))/16000
assert lag<1/30 and max(scores)>.6
report={'probe':probe,'loudness':final,'voiceSync':{'expectedStart':0,'measuredStart':lag,'correlation':float(max(scores))},'audioReview':'Mezcla medida; no escuchada. División judías/quedaron aproximada, resto de tiempos reutilizados de la transcripción.'}
(root/'verification.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf8')
subprocess.run(['ffmpeg','-v','error','-i',str(fine),'-vf','fps=1/2,scale=270:480,tile=5x2','-frames:v','1','-y',str(root/'render-review.jpg')],check=True)
print(json.dumps(report,indent=2,ensure_ascii=False))
