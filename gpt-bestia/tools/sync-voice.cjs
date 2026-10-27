// Ejecutar después de build.cjs. Los golpes y el audio comparten esta tabla.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s,'utf8');
const offset=.35, duration=20;
const sourceWords=JSON.parse(read('audio/voice-transcript.json')).segments.flatMap(s=>s.words||[]);
const timing={
  title:.48, es:1.50+offset, una:1.88+offset, bestia:2.38+offset,
  todo:4.19+offset, esto:4.32+offset, se:4.80+offset, creo:5.42+offset,
  solo:5.80+offset, con:6.34+offset, codigo:6.68+offset,
  si:8.06+offset, solo2:9.10+offset, con2:9.72+offset, codigo2:10.58+offset,
  laugh:12.22+offset, no:13.12+offset, jodas:13.30+offset, men:14+offset,
  esto2:15.17+offset, es2:15.56+offset, chatgpt2:16.26+offset
};
write('audio/voice-timing.json',JSON.stringify({offset,duration,sourceWords,timing,notes:'Whisper small es, GPU. Es/una y comienzos tras silencio refinados con silencedetect. Voz a velocidad 1; sin recortes del diálogo.'},null,2));
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-i',path.join(root,'assets/voice/narracion-original.mp3'),'-af','loudnorm=I=-16:TP=-2:LRA=7','-ar','48000','-c:a','pcm_s16le','-y',path.join(root,'assets/voice/narracion.wav')]);
const voiceDuration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',path.join(root,'assets/voice/narracion.wav')],{encoding:'utf8'}).trim());
let html=read('compositions/kinetic.html');
function clip(id,start,end){
 const re=new RegExp(`(<div id="${id}"[^>]*data-start=")[^"]+(" data-duration=")[^"]+`);
 if(!re.test(html))throw new Error('Falta clip '+id);
 html=html.replace(re,`$1${start.toFixed(3)}$2${(end-start).toFixed(3)}`);
}
clip('k-p1',0,2.42);clip('message-host',.02,2.32);clip('reply-host',.95,2.32);
clip('k-p2',timing.es-.24,timing.todo+.55);
clip('key-host',3.28,timing.todo+.5);clip('bulb-host',3.55,timing.todo+.5);
clip('k-p3',timing.todo-.24,timing.si+.55);
clip('editor-host',6.95,timing.si+.55);
clip('k-p4',timing.no-.24,timing.esto2+.55);
clip('bubble-a-host',11.95,13.75);clip('bubble-b-host',12.25,13.75);
clip('end-host',17.55,20);
html=html.replace('<div class="line l1"><span id="k-w-esto"','<div class="line l1"><span id="k-w-todo" class="w"><span class="wi">TODO</span></span><span id="k-w-esto"');
html=html.replace('#k-p3 .l1{font-size:118px}','#k-p3 .l1{font-size:96px}');
const word=(id,text,accent='')=>`<span id="${id}" class="w ${accent}"><span class="wi">${text}</span></span>`;
const repeatMarkup=`<div id="repeat" class="phrase clip" data-start="${timing.si-.24}" data-duration="${timing.no+.55-(timing.si-.24)}" data-layout-allow-overflow><div class="pin" data-layout-allow-overlap><div class="line l1">${word('r-si','SÍ.')}</div><div class="line l2">${word('r-solo','SOLO')}${word('r-con','CON')}</div><div class="line l3">${word('r-codigo','CÓDIGO','accent')}</div></div></div>`;
const closeMarkup=`<div id="closing" class="phrase clip" data-start="${timing.esto2-.24}" data-duration="${20-(timing.esto2-.24)}" data-layout-allow-overflow><div class="pin" data-layout-allow-overlap><div class="line l1">${word('c-esto','ESTO')}${word('c-es','ES')}</div><div class="line l2">${word('c-chatgpt','CHATGPT','accent')}</div></div></div>`;
html=html.replace('  <div id="k-p4"',repeatMarkup+'\n  <div id="k-p4"');
html=html.replace('  <div id="bubble-a-host"',closeMarkup+'\n  <div id="bubble-a-host"');
html=html.replace('ChatGPT. Solo código.</div>','CREADO SOLO CON CÓDIGO</div>');
html=html.replace('</style>',`
#repeat .pin{padding-top:90px}#repeat .l1{font-size:115px}#repeat .l2{font-size:160px}#repeat .l3{font-size:260px}
#closing .l1{font-size:130px}#closing .l2{font-size:248px}#end-note{font-size:36px;letter-spacing:.02em}
</style>`);
const cut=html.indexOf('const letters = [');
if(cut<0)throw new Error('No se encontró el inicio del montaje');
const schedule=`
const T=${JSON.stringify(timing)};
const letters=['#k-c1','#k-c2','#k-c3','#k-c4','#k-c5','#k-c6','#k-c7'];
letters.forEach((id,i)=>{const t=T.title+i*.11;slam(id,t,{dx:1000,s:i===6?1.9:1.5,r:i%2?5:-5,dur:.16,big:i===6});if(i)recoil(letters.slice(0,i).reverse(),t,-15,0,-1.2);shake(t,i===6?14:5)});
tl.fromTo('#k-ghost',{opacity:.3},{opacity:0,duration:.15},1.1);burst(1.14,520,0,12,11);
function pop(sel,t,dx=0,dy=100,r=0){tl.fromTo(sel,{opacity:0,x:dx,y:dy,scale:.75,rotation:r},{opacity:1,x:0,y:0,scale:1,rotation:0,duration:.32,ease:'back.out(1.6)'},t)}
pop('#message',.02,160,0,-3);pop('#reply',.95,-100,0,3);
tl.fromTo('#send',{scale:1},{scale:.82,duration:.08,yoyo:true,repeat:1},.82);
tl.fromTo('#reply span',{y:0},{y:-9,duration:.14,stagger:.07,yoyo:true,repeat:1,ease:'sine.inOut'},1.25);
slam('#k-w-es',T.es,{dx:-1300,s:1.7,r:-7});knock('#k-p1 .pin',T.es,{x:1900,y:-70,r:10});shake(T.es,15);tl.set('#k-bg',{background:'#092C25'},T.es);
tl.to(['#message','#reply'],{y:380,rotation:12,duration:.28,ease:'power3.in'},T.es-.02);
slam('#k-w-una',T.una,{dx:1100,s:1.5,r:7});recoil(['#k-w-es'],T.una,-20,0,-2);shake(T.una,7);
slam('#k-w-bestia',T.bestia,{dy:800,s:2.1,r:-4,big:true,dur:.2});recoil(['#k-w-una','#k-w-es'],T.bestia,0,-20,1);shake(T.bestia,22);flash(T.bestia,.10);burst(T.bestia,0,150,16,23);
pop('#key',3.28,-100,70,-10);pop('#bulb',3.55,70,100,12);
tl.to('#key',{y:12,duration:.08,yoyo:true,repeat:1},3.88);
slam('#k-w-todo',T.todo,{dy:-760,s:1.5,r:5,dur:.16});knock('#k-p2 .pin',T.todo,{y:1450,r:9});shake(T.todo,15);tl.set('#k-bg',{background:'#F4FAF7'},T.todo);
tl.to(['#key','#bulb'],{y:380,duration:.28,ease:'power3.in'},T.todo-.02);
slam('#k-w-esto',T.esto,{dx:1000,s:1.4,r:6,dur:.12});recoil(['#k-w-todo'],T.esto,-16,0,-1);
slam('#k-w-se',T.se,{dx:1000,s:1.4,r:6,dur:.16});recoil(['#k-w-esto','#k-w-todo'],T.se,-16,0,-1);
slam('#k-w-creo',T.creo,{dx:1000,s:1.5,r:7});recoil(['#k-w-se','#k-w-esto'],T.creo,-18,0,-1);
slam('#k-w-solo',T.solo,{dx:-1100,s:1.5,r:-7});recoil(['#k-w-creo','#k-w-se','#k-w-esto'],T.solo,0,-16,0);
slam('#k-w-con',T.con,{dx:1000,s:1.4,r:6});recoil(['#k-w-solo'],T.con,-18,0,-1);
slam('#k-w-codigo',T.codigo,{dy:760,s:2,r:5,big:true,dur:.2});recoil(['#k-w-con','#k-w-solo','#k-w-creo','#k-w-se','#k-w-esto'],T.codigo,0,-18,0);shake(T.codigo,20);burst(T.codigo,-160,220,12,37);
pop('#editor',6.95,350,0,6);tl.fromTo('.code-line',{opacity:0,x:-10},{opacity:1,x:0,duration:.10,stagger:.12,ease:'power2.out'},7.24);tl.fromTo('#play',{scale:0},{scale:1,duration:.22,ease:'back.out(2)'},7.90);
slam('#r-si',T.si,{dx:1200,s:1.8,r:6});knock('#k-p3 .pin',T.si,{x:-1900,r:-9});tl.to('#editor',{x:-2000,rotation:-12,duration:.34,ease:'power3.in'},T.si-.02);tl.set('#k-bg',{background:'#C7F8E2'},T.si);shake(T.si,16);
slam('#r-solo',T.solo2,{dx:-1100,s:1.8,r:-6});recoil(['#r-si'],T.solo2,0,-16,0);shake(T.solo2,10);
slam('#r-con',T.con2,{dx:1100,s:1.6,r:6});recoil(['#r-solo'],T.con2,-18,0,-1);shake(T.con2,8);
slam('#r-codigo',T.codigo2,{dy:760,s:2.1,r:4,big:true,dur:.2});recoil(['#r-si','#r-solo','#r-con'],T.codigo2,0,-20,0);shake(T.codigo2,22);flash(T.codigo2,.1);
pop('#bubble-a',11.95,-90,90,-10);pop('#bubble-b',12.25,90,90,10);
tl.fromTo(['#bubble-a','#bubble-b'],{rotation:0},{rotation:7,duration:.12,yoyo:true,repeat:3,ease:'sine.inOut'},T.laugh);
slam('#k-w-no',T.no,{dx:1200,s:1.7,r:8,dur:.16});knock('#repeat .pin',T.no,{x:-1900,r:-10});shake(T.no,16);tl.set('#k-bg',{background:'#9CF3C5'},T.no);
tl.to(['#bubble-a','#bubble-b'],{y:380,duration:.28,ease:'power3.in'},T.no-.02);
slam('#k-w-jodas',T.jodas,{dy:-800,s:1.6,r:-6,dur:.16});recoil(['#k-w-no'],T.jodas,-20,0,-2);shake(T.jodas,9);
slam('#k-w-men',T.men,{s:4,r:-4,big:true,dur:.22});recoil(['#k-w-jodas','#k-w-no'],T.men,0,-22,0);shake(T.men,26);flash(T.men,.14);burst(T.men,0,160,18,53);
slam('#c-esto',T.esto2,{dx:-1200,s:1.7,r:-7});knock('#k-p4 .pin',T.esto2,{x:1800,r:10});tl.set('#k-bg',{background:'#C7F8E2'},T.esto2);shake(T.esto2,14);
slam('#c-es',T.es2,{dx:1100,s:1.5,r:6});recoil(['#c-esto'],T.es2,-18,0,-1);
slam('#c-chatgpt',T.chatgpt2,{dy:800,s:2.2,r:-4,big:true,dur:.22});recoil(['#c-es','#c-esto'],T.chatgpt2,0,-20,0);shake(T.chatgpt2,22);
tl.fromTo('#logo-tile',{scale:1},{scale:1.10,duration:.12,ease:'power2.out'},T.chatgpt2);tl.to('#logo-tile',{scale:1,duration:.35,ease:'elastic.out(1,.5)'},T.chatgpt2+.12);
tl.fromTo('#end-note',{opacity:0,y:24},{opacity:1,y:0,duration:.2,ease:'power3.out'},17.55);
bakeCamera();bakeRecoils();window.__timelines.kinetic=tl;
})();</script>\n</template>\n`;
html=html.slice(0,cut)+schedule;
write('compositions/kinetic.html',html);

const manifest=JSON.parse(read('assets/sfx/cues.json'));
const cues=[];
const add=(name,hit,volume,cause)=>cues.push({name,hit,volume,cause});
for(let i=0;i<7;i++)add(i%2?'pop':'tap',timing.title+i*.11,.20,'letra '+i);
add('thump',1.14,.24,'CHATGPT completo');
for(const key of ['es','una','todo','esto','se','creo','solo','con','si','solo2','con2','no','jodas','esto2','es2'])add('tap',timing[key],.26,'palabra '+key);
for(const key of ['bestia','codigo','codigo2','men','chatgpt2']){add('thump',timing[key],.37,'golpe '+key);add('digital',timing[key],.16,'acento '+key);}
for(const key of ['es','todo','si','no','esto2'])add('sweep',timing[key],.24,'transición '+key);
for(const [hit,cause] of [[.34,'mensaje'],[1.27,'respuesta'],[3.60,'tecla'],[3.87,'bombilla'],[7.27,'editor'],[12.27,'burbuja izquierda'],[12.57,'burbuja derecha']])add('pop',hit,.24,cause);
add('click',.90,.20,'enviar mensaje');add('tap',3.96,.20,'pulsar tecla');add('pop',8.12,.18,'botón de reproducción');add('shine',17.8,.20,'remate');
cues.sort((a,b)=>a.hit-b.hit);
const audio=cues.map((cue,i)=>{
 const sample=manifest[cue.name];cue.audioStart=cue.hit+1/30-sample.peak;cue.audioPeak=cue.hit+1/30;
 return `<audio id="cue-${i}" class="clip" src="${sample.file}" data-start="${cue.audioStart.toFixed(4)}" data-duration="${Math.min(sample.duration,20-cue.audioStart).toFixed(4)}" data-track-index="${10+i}" data-volume="${cue.volume}" data-fade-out="0.04"></audio>`;
}).join('\n');
write('audio-sync.json',JSON.stringify(cues,null,2));
const index=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1920,height=1080"><title>ChatGPT es una bestia · con voz</title><script src="assets/gsap.min.js"></script><style>*{box-sizing:border-box;margin:0}html,body,#root{width:1920px;height:1080px;overflow:hidden;background:#C7F8E2}#root{position:relative;font-family:"Archivo Black",sans-serif}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="20" data-width="1920" data-height="1080"><div id="kinetic" class="clip" data-composition-id="kinetic" data-composition-src="compositions/kinetic.html" data-start="0" data-duration="20" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>
<audio id="narration" class="clip" src="assets/voice/narracion.wav" data-start="${offset}" data-duration="${voiceDuration}" data-track-index="3" data-volume="1" data-fade-in="0.015" data-fade-out="0.06"></audio>
<audio id="music" class="clip" src="assets/music/ambient.mp3" data-start="0" data-duration="20" data-track-index="2" data-volume="0.10" data-fade-in="0.3" data-fade-out="1.5"></audio>
${audio}</div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`;
write('index.html',index);
console.log(JSON.stringify({seconds:20,voiceDuration,voiceOffset:offset,voiceEnd:offset+voiceDuration,effects:cues.length,timing},null,2));
