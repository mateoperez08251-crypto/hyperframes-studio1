const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const clips=JSON.parse(fs.readFileSync(path.join(root,'assets/sfx/cues.json'),'utf8'));
for(const [name,c] of Object.entries(clips)){
 const pcm=execFileSync('ffmpeg',['-v','error','-i',path.join(root,c.file),'-f','f32le','-ac','1','-ar','48000','pipe:1']);
 let max=0,best=0,peak=0;const energies=[];
 for(let i=0;i+1920<=pcm.length;i+=1920){let e=0;for(let j=i;j<i+1920;j+=4){const v=pcm.readFloatLE(j);e+=v*v;max=Math.max(max,Math.abs(v));} energies.push(e);if(e>best){best=e;peak=i/4/48000;}}
 const onset=energies.findIndex(e=>e>=best*.25)*.01;
 console.log(JSON.stringify({name,plannedPeak:c.peak,actualPeak:peak,onset,errorMs:Math.round((peak-c.peak)*1000),maxDb:Math.round(20*Math.log10(max)*10)/10}));
}
