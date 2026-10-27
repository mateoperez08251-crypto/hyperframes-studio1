import pathlib,subprocess,json
import numpy as np
root=pathlib.Path(__file__).resolve().parents[1]
rate=48000
assets={}
settings={'trailer-boom':(1.6,-7),'impact-bass-1':(.85,-8),'impact-bass-2':(1.05,-7),'body-fall':(.6,-5),'swosh':(.3,-10),'whoosh':(.55,-9),'whoosh-short':(.45,-10),'punch-snare':(.35,-7)}
for name,(duration,db) in settings.items():
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(root/'assets/sfx'/f'{name}.mp3'),'-ac','1','-ar',str(rate),'-f','f32le','pipe:1'])
    wave=np.frombuffer(raw,dtype=np.float32).copy()
    width=round(.01*rate)
    envelope=np.convolve(wave.astype(float)**2,np.ones(width)/width,'valid')
    peak=int(np.argmax(envelope))+width//2
    begin=max(0,peak-round(.075*rate))
    wave=wave[begin:begin+round(duration*rate)]
    fade=min(round(.13*rate),len(wave)//3)
    wave[-fade:]*=np.linspace(1,0,fade)
    wave*=10**(db/20)/max(float(np.max(np.abs(wave))),1e-6)
    output=root/'assets/sfx'/f'{name}.wav'
    subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(rate),'-ac','1','-i','pipe:0','-c:a','pcm_s16le','-y',str(output)],input=wave.tobytes(),check=True)
    envelope=np.convolve(wave.astype(float)**2,np.ones(width)/width,'valid')
    assets[name]={'file':f'assets/sfx/{name}.wav','peak':(int(np.argmax(envelope))+width//2)/rate,'duration':len(wave)/rate,'peakDb':db}
cues=[('thunder','trailer-boom',2.42,.75),('spot','impact-bass-1',4.32,.4),('reaper','whoosh',6.5,.75),('step','body-fall',7.36,.7),('defy','impact-bass-2',7.36,.45),('portrait','swosh',8.4,.7),('page1','swosh',11.1,.45),('page2','swosh',11.24,.45),('page3','swosh',11.38,.45),('page4','swosh',11.52,.45),('year','impact-bass-1',11.56,.65),('wall-left','body-fall',15.9,.9),('wall-right','body-fall',16.02,.9),('wall-weight','impact-bass-2',16.02,.6),('map','whoosh-short',16.65,.55),('pin','punch-snare',17.42,.7)]
tags=[];report=[]
for i,(name,asset,hit,volume) in enumerate(cues):
    data=assets[asset]; start=hit+1/30-data['peak']
    duration=min(data['duration'],20-start)
    tags.append(f'<audio id="sfx-{name}" class="clip" src="{data["file"]}" data-start="{start:.6f}" data-duration="{duration:.6f}" data-volume="{volume}" data-track-index="{10+i}"></audio>')
    report.append({'id':name,'asset':asset,'visualHit':hit,'start':start,'peak':data['peak'],'peakOffsetFrames':1,'volume':volume})
index=root/'index.html'
text=index.read_text(encoding='utf8')
text=text.replace('<!-- SFX_GENERATED -->','\n'.join(tags))
index.write_text(text,encoding='utf8')
(root/'audio/sync.json').write_text(json.dumps({'assets':assets,'cues':report},indent=2),encoding='utf8')
print('Processed effects and aligned',len(cues),'cues')
