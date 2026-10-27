const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const project = path.resolve(__dirname, '..');
const write = (p, s) => fs.writeFileSync(path.join(project, p), s, 'utf8');
const sfxDir = path.join(project, 'assets/sfx');
const manifest = {};
// Recortar muestras reales alrededor del transitorio y medir el pico RMS, sin síntesis.
for (const [name, source, duration, rate] of [
  ['tap','key-press',.22,1], ['pop','pop',.34,1], ['pop-low','pop',.4,.8],
  ['message','notification',1.1,1], ['digital','glitch-3',.65,1.15],
  ['shine','sparkle',1.35,1], ['sweep','whoosh-cinematic',.8,1.12],
  ['click','click-soft',.25,1], ['thump','impact-bass-1',.75,.82]
]) {
  const input = path.join(sfxDir, source+'.mp3');
  const pcm = execFileSync('ffmpeg',['-v','error','-i',input,'-f','f32le','-ac','1','-ar','24000','pipe:1']);
  let peak = 0, best = -1;
  for(let offset=0; offset+960<=pcm.length; offset+=960){
    let energy=0; for(let j=offset;j<offset+960;j+=4) energy+=pcm.readFloatLE(j)**2;
    if(energy>best){best=energy;peak=offset/4/24000;}
  }
  const start = Math.max(0, peak-.06);
  const output = path.join(sfxDir,name+'.wav');
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss',String(start),'-i',input,'-t',String(duration*rate),'-af',`asetrate=44100*${rate},aresample=44100,afade=t=out:st=${Math.max(.05,duration-.09)}:d=0.09`,'-ac','2','-ar','44100','-y',output]);
  // Normalizar cada muestra antes de mezclar: las teclas originales estaban
  // unos 27 dB por debajo de los pops y apenas se percibían.
  function measure(file){
    const data=execFileSync('ffmpeg',['-v','error','-i',file,'-f','f32le','-ac','1','-ar','48000','pipe:1']);
    let max=0,best=-1,peakTime=0;
    for(let i=0;i+1920<=data.length;i+=1920){let e=0;for(let j=i;j<i+1920;j+=4){const v=data.readFloatLE(j);e+=v*v;max=Math.max(max,Math.abs(v));}if(e>best){best=e;peakTime=(i/4+240)/48000;}}
    return {peak:peakTime,maxDb:20*Math.log10(Math.max(max,1e-9))};
  }
  const before=measure(output);
  const targetDb={tap:-6,pop:-10,'pop-low':-9,message:-12,digital:-10,shine:-14,sweep:-11,click:-8,thump:-5}[name];
  const normalized=path.join(sfxDir,name+'-normalized.wav');
  execFileSync('ffmpeg',['-v','error','-i',output,'-af',`volume=${targetDb-before.maxDb}dB`,'-c:a','pcm_s16le','-y',normalized]);
  fs.renameSync(normalized,output);
  const actual=measure(output);
  const actualDuration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',output],{encoding:'utf8'}).trim());
  manifest[name]={file:`assets/sfx/${name}.wav`,peak:actual.peak,duration:actualDuration,maxDb:actual.maxDb};
}
write('assets/sfx/cues.json', JSON.stringify(manifest,null,2));

const base = fs.readFileSync(path.resolve(project,'../claude-bestia/compositions/kinetic.html'),'utf8');
let helpers = base.slice(base.indexOf('      // ---------- Generador'),base.indexOf('      // ---------- Fondo vivo'));
// La lluvia de piezas usa nodos escritos en HTML, con IDs estables.
helpers=helpers.replace('const s = document.createElement("div");','const s = $("#chip-" + seed + "-" + i);');
helpers=helpers.replace('          debris.appendChild(s);','');
helpers=helpers.replaceAll('#d97757','#087A52').replaceAll('#f4ede4','#F4FAF7');
helpers=helpers.replace('extrude(depth, "#b05a3c", "#3a1609")','extrude(6, "#075F43", "#034732")');
helpers=helpers.replace('extrude(depth, "#b8a796", "#2e221b")','extrude(6, "#85B5A2", "#477865")');
helpers=helpers.replace('filter: "blur(14px)"','filter: "blur(6px)"');
const letters = [...'CHATGPT'];
const word = (id,text,accent='') => `<span id="k-w-${id}" class="w ${accent}"><span class="wi">${text}</span></span>`;
const chipMarkup = [[11,12],[23,16],[37,12],[53,18]].map(([seed,n])=>Array.from({length:n},(_,i)=>`<i id="chip-${seed}-${i}" class="k-shard"></i>`).join('')).join('');
const markup = `
<div id="k-bg" data-layout-ignore></div>
<div id="k-cam">
  <div id="k-debris" data-layout-ignore>${chipMarkup}</div>
  <div id="logo-host" class="clip" data-start="0" data-duration="20" data-layout-ignore><div id="logo-tile"><img src="assets/brand/openai.svg" alt="Símbolo de OpenAI" width="140" height="140"></div></div>
  <div id="k-p1" class="phrase clip" data-start="0" data-duration="5.2" data-layout-allow-overflow>
    <div class="pin" data-layout-allow-overlap>
      <div id="k-ghost" class="line letters" data-layout-ignore>CHATGPT</div>
      <div class="line letters">${letters.map((s,i)=>`<span id="k-c${i+1}" class="w ${i>3?'accent':''}"><span class="wi">${s}</span></span>`).join('')}</div>
    </div>
  </div>
  <div id="message-host" class="clip prop-host" data-start="2.25" data-duration="2.85" data-layout-allow-overflow>
    <div id="message" class="message">Haz algo brutal.<span id="send"><svg viewBox="0 0 48 48"><path d="M24 35V13m-9 9 9-9 9 9"/></svg></span></div>
  </div>
  <div id="reply-host" class="clip prop-host" data-start="3.35" data-duration="1.8" data-layout-allow-overflow><div id="reply" class="reply"><span></span><span></span><span></span></div></div>
  <div id="k-p2" class="phrase clip" data-start="4.35" data-duration="5.55" data-layout-allow-overflow><div class="pin" data-layout-allow-overlap>
    <div class="line l1">${word('es','ES')}${word('una','UNA')}</div><div class="line l2">${word('bestia','BESTIA','accent')}</div>
  </div></div>
  <div id="key-host" class="clip prop-host" data-start="6.1" data-duration="3.7" data-layout-allow-overflow><div id="key" class="key"><svg viewBox="0 0 120 100"><path d="m40 28-23 22 23 22m40-44 23 22-23 22M68 14 52 86"/></svg></div></div>
  <div id="bulb-host" class="clip prop-host" data-start="7.25" data-duration="2.55" data-layout-allow-overflow><div id="bulb" class="bulb"><svg viewBox="0 0 120 140"><path d="M40 92C38 76 22 69 22 47a38 38 0 0 1 76 0c0 22-16 29-18 45M41 103h38m-34 13h30m-24 12h18M60 1v-13M5 45H-7m122 0h13M17 7 8-2m95 9 9-9"/><path d="m47 49 13 13 13-13M60 62v29"/></svg></div></div>
  <div id="k-p3" class="phrase clip" data-start="9.05" data-duration="6.75" data-layout-allow-overflow><div class="pin" data-layout-allow-overlap>
    <div class="line l1">${word('esto','ESTO')}${word('se','SE')}${word('creo','CREÓ')}</div><div class="line l2">${word('solo','SOLO')}${word('con','CON')}</div><div class="line l3">${word('codigo','CÓDIGO','accent')}</div>
  </div></div>
  <div id="editor-host" class="clip prop-host" data-start="11.7" data-duration="4.1" data-layout-allow-overflow><div id="editor" class="editor">
    <div class="editor-top"><i></i><i></i><i></i></div>
    <div id="code-lines"><div class="code-line"><b>&lt;</b>html<b>&gt;</b></div><div class="code-line indent"><b>const</b> idea =</div><div class="code-line indent green">"brutal";</div><div class="code-line indent">animate(idea);</div><div class="code-line"><b>&lt;/</b>html<b>&gt;</b></div></div>
    <div id="play" class="play"><svg viewBox="0 0 50 50"><path d="m19 12 22 13-22 13z"/></svg></div>
  </div></div>
  <div id="k-p4" class="phrase clip" data-start="14.95" data-duration="5.05" data-layout-allow-overflow><div class="pin" data-layout-allow-overlap>
    <div class="line l1">${word('no','¡NO')}${word('jodas','JODAS,')}</div><div class="line l2">${word('men','MEN!','accent')}</div>
  </div></div>
  <div id="bubble-a-host" class="clip prop-host" data-start="17.25" data-duration="2.75" data-layout-allow-overflow><div id="bubble-a" class="mini-bubble"><svg viewBox="0 0 100 70"><path d="M10 10h80v42H45L28 66V52H10z"/><path d="M28 30h44"/></svg></div></div>
  <div id="bubble-b-host" class="clip prop-host" data-start="18.15" data-duration="1.85" data-layout-allow-overflow><div id="bubble-b" class="mini-bubble"><svg viewBox="0 0 100 70"><path d="M10 10h80v42H72v14L55 52H10z"/><path d="m35 30 10 10 22-24"/></svg></div></div>
  <div id="end-host" class="clip" data-start="17.85" data-duration="2.15"><div id="end-note">ChatGPT. Solo código.</div></div>
</div><div id="k-flash" data-layout-ignore data-layout-allow-occlusion></div>`;

const style = `
#root{position:absolute;inset:0;overflow:hidden;font-family:"Archivo Black",sans-serif;background:#C7F8E2}
*{box-sizing:border-box} #k-bg{position:absolute;inset:0;background:#C7F8E2} #k-cam{position:absolute;inset:0}
.phrase,.pin{position:absolute;inset:0}.pin{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
.line{display:flex;justify-content:center;align-items:baseline;gap:.24em;white-space:nowrap;line-height:1.08;letter-spacing:-.035em}.letters{gap:.008em}
.w,.wi{display:inline-block}.wi{color:#092C25}.accent .wi{color:#087A52}
#k-p1 .line{font-size:268px}#k-p1 .pin{padding-top:20px}#k-ghost{position:absolute;opacity:.3;color:transparent;-webkit-text-stroke:2px #087A52;letter-spacing:-.035em}
#k-p2 .l1{font-size:150px}#k-p2 .l2{font-size:285px}#k-p2 .wi{color:#F4FAF7}#k-p2 .accent .wi{color:#A4FFD0}
#k-p3 .pin{align-items:flex-start;padding-left:170px;padding-right:650px}#k-p3 .l1{font-size:118px}#k-p3 .l2{font-size:132px}#k-p3 .l3{font-size:226px}
#k-p4 .l1{font-size:175px}#k-p4 .l2{font-size:322px}#k-p4 .accent .wi{color:#092C25}
#logo-host{position:absolute;left:880px;top:80px;width:160px;height:160px}#logo-tile{position:relative;width:160px;height:160px;background:white;border:4px solid #092C25;border-radius:36px;box-shadow:10px 12px 0 #75B89C}
#logo-tile img{position:absolute;left:-36px;top:-36px;display:block;width:224px;height:224px}
.prop-host{position:absolute}.message{width:780px;height:112px;background:white;border:4px solid #092C25;border-radius:34px;box-shadow:10px 12px 0 #75B89C;display:flex;align-items:center;padding:0 25px 0 38px;font-size:42px;color:#092C25;gap:80px;transform-origin:right bottom}
#message-host{left:570px;top:810px}#send{width:68px;height:68px;display:grid;place-items:center;background:#092C25;border-radius:50%;margin-left:auto}#send svg{width:48px;height:48px;fill:none;stroke:white;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
#reply-host{left:390px;top:810px}.reply{display:flex;align-items:center;gap:12px;width:138px;height:112px;border:4px solid #092C25;border-radius:34px;background:#087A52;box-shadow:8px 10px 0 #75B89C;padding:22px}.reply span{width:18px;height:18px;border-radius:50%;background:#F4FAF7}
#key-host{left:224px;top:780px}.key{width:180px;height:150px;background:#C7F8E2;border:4px solid #78B397;border-radius:28px;box-shadow:0 16px 0 #3B7461,0 24px 0 #061B15;padding:20px}.key svg{width:100%;height:100%;fill:none;stroke:#092C25;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
#bulb-host{left:1530px;top:755px}.bulb{width:162px;height:180px;background:#E2FF9B;border:4px solid #092C25;border-radius:36px;padding:20px;box-shadow:12px 12px 0 #153E30}.bulb svg{width:100%;height:100%;overflow:visible;fill:none;stroke:#092C25;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
#editor-host{left:1320px;top:310px}.editor{width:430px;height:454px;background:#092C25;border:4px solid #092C25;border-radius:30px;box-shadow:14px 16px 0 #8CBFAA;overflow:hidden}.editor-top{height:60px;display:flex;align-items:center;gap:12px;padding-left:25px;border-bottom:3px solid #315C4C}.editor-top i{width:12px;height:12px;border-radius:50%;background:#9EE2BF}#code-lines{padding:24px;font-family:"IBM Plex Mono",monospace;font-size:32px;line-height:1.6;color:#F4FAF7}.indent{padding-left:20px}.code-line b,.green{color:#A4FFD0;font-weight:400}.play{position:absolute;right:24px;bottom:24px;width:66px;height:66px;border-radius:50%;background:#C7F8E2;display:grid;place-items:center}.play svg{width:45px;height:45px;fill:#092C25}
#bubble-a-host{left:180px;top:780px}#bubble-b-host{left:1515px;top:780px}.mini-bubble{width:205px;height:160px;background:white;border:4px solid #092C25;border-radius:30px;box-shadow:12px 12px 0 #4FA780;padding:18px}.mini-bubble svg{width:100%;height:100%;fill:none;stroke:#092C25;stroke-width:6;stroke-linejoin:round;stroke-linecap:round}
#end-host{position:absolute;left:0;right:0;top:865px;text-align:center}#end-note{font-family:"Inter",sans-serif;font-size:38px;font-weight:700;color:#092C25}
#k-debris{position:absolute;left:50%;top:50%;width:0;height:0}.k-shard{position:absolute;left:0;top:0;border-radius:3px;opacity:0}
#k-flash{position:absolute;inset:0;background:#D5FFE5;opacity:0;pointer-events:none}
`;
const schedule = `
const letters = ${JSON.stringify(letters.map((_,i)=>'#k-c'+(i+1)))};
letters.forEach((id,i)=>{const t=.42+i*.21;slam(id,t,{dx:1050,s:i===6?2.1:1.5,r:i%2?8:-6,big:i===6});if(i)recoil(letters.slice(0,i).reverse(),t,-22,0,-1.8);shake(t,i===6?19:7)});
tl.fromTo('#k-ghost',{opacity:.3},{opacity:0,duration:.22},1.72);burst(1.68,520,0,12,11);
tl.fromTo('#logo-tile',{scale:1,rotation:0},{scale:1.08,rotation:-6,duration:.14,ease:'power2.out'},1.68);
tl.to('#logo-tile',{scale:1,rotation:0,duration:.38,ease:'elastic.out(1,.5)'},1.82);
function pop(sel,t,dx=0,dy=120,r=0){tl.fromTo(sel,{opacity:0,x:dx,y:dy,scale:.75,rotation:r},{opacity:1,x:0,y:0,scale:1,rotation:0,duration:.38,ease:'back.out(1.6)'},t)}
// Adaptación del origen de escala del componente registry/chat-message.
pop('#message',2.25,180,0,-4);pop('#reply',3.35,-120,0,5);
tl.fromTo('#send',{scale:1},{scale:.82,duration:.1,ease:'power2.in'},3.05);tl.to('#send',{scale:1,duration:.2,ease:'back.out(2)'},3.15);
tl.fromTo('#reply span',{y:0},{y:-10,duration:.18,stagger:.1,yoyo:true,repeat:3,ease:'sine.inOut'},3.55);
slam('#k-w-es',4.6,{dx:-1300,s:1.8,r:-8});knock('#k-p1 .pin',4.6,{x:1900,y:-80,r:12});shake(4.6,18);
tl.set('#k-bg',{background:'#092C25'},4.6);tl.to(['#message','#reply'],{y:380,rotation:12,duration:.35,ease:'power3.in'},4.56);
slam('#k-w-una',4.85,{dx:1100,s:1.6,r:10});recoil(['#k-w-es'],4.85,-22,0,-2);shake(4.85,9);
slam('#k-w-bestia',5.23,{dy:800,s:2.3,r:-4,big:true,dur:.23});recoil(['#k-w-una','#k-w-es'],5.23,0,-22,1);shake(5.23,26);flash(5.23,.12);burst(5.23,0,150,16,23);
pop('#key',6.1,-120,80,-12);tl.to('#key',{y:14,duration:.1,ease:'power3.in'},6.8);tl.to('#key',{y:0,duration:.26,ease:'back.out(3)'},6.9);
pop('#bulb',7.25,80,120,15);tl.fromTo('#bulb',{rotation:0},{rotation:-12,duration:.16,yoyo:true,repeat:3,ease:'sine.inOut'},7.85);
slam('#k-w-esto',9.3,{dy:-800,s:1.7,r:6});knock('#k-p2 .pin',9.3,{y:1450,r:10});shake(9.3,20);tl.set('#k-bg',{background:'#F4FAF7'},9.3);
tl.to(['#key','#bulb'],{y:360,duration:.35,ease:'power3.in'},9.25);
slam('#k-w-se',9.55,{dx:1000,s:1.4,r:8});recoil(['#k-w-esto'],9.55,-20,0,-2);shake(9.55,7);
slam('#k-w-creo',9.82,{dx:1000,s:1.5,r:8});recoil(['#k-w-se','#k-w-esto'],9.82,-20,0,-2);shake(9.82,7);
slam('#k-w-solo',10.25,{dx:-1100,s:1.6,r:-8});recoil(['#k-w-creo','#k-w-se','#k-w-esto'],10.25,0,-18,0);shake(10.25,8);
slam('#k-w-con',10.5,{dx:1000,s:1.5,r:8});recoil(['#k-w-solo'],10.5,-20,0,-2);shake(10.5,7);
slam('#k-w-codigo',10.95,{dy:760,s:2.1,r:5,big:true,dur:.22});recoil(['#k-w-con','#k-w-solo','#k-w-creo','#k-w-se','#k-w-esto'],10.95,0,-20,0);shake(10.95,23);burst(10.95,-160,220,12,37);
pop('#editor',11.7,400,0,8);tl.fromTo('.code-line',{opacity:0,x:-12},{opacity:1,x:0,duration:.16,stagger:.28,ease:'power2.out'},12.1);
tl.fromTo('#play',{scale:0},{scale:1,duration:.3,ease:'back.out(2)'},13.65);tl.to('#play',{scale:.85,duration:.12,yoyo:true,repeat:1},14.15);
slam('#k-w-no',15.2,{dx:1200,s:1.8,r:10});knock('#k-p3 .pin',15.2,{x:-1900,r:-12});shake(15.2,20);tl.set('#k-bg',{background:'#9CF3C5'},15.2);tl.to('#editor',{x:-2000,rotation:-18,duration:.48,ease:'power3.in'},15.16);
slam('#k-w-jodas',15.6,{dy:-850,s:1.7,r:-8});recoil(['#k-w-no'],15.6,-24,0,-2);shake(15.6,10);
slam('#k-w-men',16.18,{s:4.5,r:-4,big:true,dur:.24});recoil(['#k-w-jodas','#k-w-no'],16.18,0,-26,0);shake(16.18,30);flash(16.18,.18);burst(16.18,0,160,18,53);
pop('#bubble-a',17.25,-100,100,-12);pop('#bubble-b',18.15,100,100,12);tl.fromTo('#end-note',{opacity:0,y:30},{opacity:1,y:0,duration:.15,ease:'power3.out'},17.85);
bakeCamera();bakeRecoils();window.__timelines['kinetic']=tl;
`;
write('compositions/kinetic.html',`<template>\n<style>${style}</style>\n<div id="root" data-composition-id="kinetic" data-width="1920" data-height="1080">${markup}</div>\n<script>(function(){const tl=gsap.timeline({paused:true});const $=s=>document.querySelector(s);\n${helpers}\n${schedule}\n})();</script>\n</template>\n`);
const cues=[['tap',.42,.7],['pop',.63,.75],['tap',.84,.7],['pop-low',1.05,.8],['tap',1.26,.7],['pop',1.47,.8],['digital',1.68,.7],['pop',2.58,.65],['click',3.13,.65],['message',3.68,.55],['sweep',4.6,.65],['pop-low',4.6,.9],['tap',4.85,.8],['digital',5.23,.85],['pop-low',5.23,.8],['pop',6.43,.7],['tap',6.9,.7],['shine',7.58,.55],['sweep',9.3,.65],['tap',9.3,.8],['pop',9.55,.7],['tap',9.82,.7],['pop-low',10.25,.75],['tap',10.5,.7],['digital',10.95,.8],['pop',12.03,.65],['tap',12.15,.55],['tap',12.43,.55],['tap',12.71,.55],['tap',12.99,.55],['tap',13.27,.55],['pop',13.9,.6],['click',14.27,.6],['sweep',15.2,.75],['pop-low',15.2,.85],['digital',15.6,.6],['digital',16.18,.9],['pop-low',16.18,.9],['pop',17.58,.7],['message',18.48,.5],['shine',18.75,.45]];
// Las entradas de objetos duran 0,38 s: el pop se fija al asentamiento,
// y los golpes grandes conservan exactamente el reloj de slam().
const propLandings=new Map([[2.58,2.63],[3.68,3.73],[6.43,6.48],[7.58,7.63],[12.03,12.08],[13.9,13.95],[17.58,17.63],[18.48,18.53]]);
for(const cue of cues){if(propLandings.has(cue[1]))cue[1]=propLandings.get(cue[1]);}
for(const hit of [1.68,5.23,10.95,16.18])cues.push(['thump',hit,.9]);
cues.sort((a,b)=>a[1]-b[1]);
write('audio-sync.json',JSON.stringify(cues.map(([name,hit,volume])=>({name,visualHit:hit,audioStart:Math.max(0,hit+1/30-manifest[name].peak),audioPeak:hit+1/30,volume})),null,2));
const audio = cues.map(([name,hit,volume],i)=>{const c=manifest[name];const start=Math.max(0,hit+1/30-c.peak);return `<audio id="cue-${i}" class="clip" src="${c.file}" data-start="${start.toFixed(4)}" data-duration="${Math.min(c.duration,20-start).toFixed(4)}" data-track-index="${10+i}" data-volume="${volume}" data-fade-out="0.05"></audio>`}).join('\n');
write('index.html',`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1920,height=1080"><title>ChatGPT es una bestia</title><script src="assets/gsap.min.js"></script><style>*{box-sizing:border-box;margin:0}html,body,#root{width:1920px;height:1080px;overflow:hidden;background:#C7F8E2}#root{position:relative;font-family:"Archivo Black",sans-serif}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="20" data-width="1920" data-height="1080"><div id="kinetic" class="clip" data-composition-id="kinetic" data-composition-src="compositions/kinetic.html" data-start="0" data-duration="20" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>\n<audio id="music" class="clip" src="assets/music/ambient.mp3" data-start="0" data-duration="20" data-track-index="2" data-volume="0.25" data-fade-in="0.3" data-fade-out="1.5"></audio>\n${audio}\n</div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>\n`);
console.log('Generado: 20 segundos, 600 frames, '+cues.length+' efectos sincronizados.');
