const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s,'utf8');
const P={void:'#06071B',deep:'#0D1130',purple:'#251351',mid:'#371E70',light:'#4B2B8F',teal:'#2B9EB3',mint:'#4CE0B3',gold:'#F7B519',cream:'#FCE181',coral:'#DE216B',ink:'#151638'};
function rng(seed){return ()=>{let t=seed+=0x6d2b79f5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const rand=rng(20261027);
const R=(x,y,w,h,c,r=0,a='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${a}/>`;
const C=(x,y,r,c,a='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${a}/>`;
const E=(x,y,rx,ry,c,a='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" ${a}/>`;
const D=(d,c,a='')=>`<path d="${d}" fill="${c}" stroke-linecap="round" stroke-linejoin="round" ${a}/>`;
const overscan=new Set(['n-wipe','c-reveal','c-back','f-walls','n-far','n-mid','n-road','n-front','c-foreground','p-portrait','c-iris','p-cover']);
const G=(id,s,a='')=>`<g id="${id}" ${overscan.has(id)?'data-layout-allow-overflow':''} ${a}>${s}</g>`;
function stars(prefix,n){return G(prefix,Array.from({length:n},()=>C(Math.round(rand()*1920),70+Math.round(rand()*460),1+rand()*2.4,rand()>.7?P.mint:'#A899D1',`opacity="${.2+rand()*.45}"`)).join(''),'data-layout-ignore')}
function building(p,x,ground,w,h,color,light=false){
 const top=ground-h;let windows='';const cols=Math.max(2,Math.floor((w-34)/56)),rows=Math.max(2,Math.floor((h-40)/90));
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const xx=x+24+col*(w-42)/cols,yy=top+35+row*87,lit=light&&rand()>.32;
  windows+=G(`${p}-win-${row}-${col}`,R(xx-3,yy-3,29,49,'#3E2E64',12)+R(xx,yy,23,43,lit?'#F7C66F':'#302347',10)+R(xx+10,yy,3,43,color)+R(xx,yy+20,23,3,color),lit?'class="lit-window"':'');
 }
 return G(p,D(`M${x-8} ${top}L${x+w*.5} ${top-66}L${x+w+8} ${top}Z`,'#27213E')+R(x,top,w,h,color,3)+R(x+w-22,top,22,h,'#372857')+R(x-8,top, w+16,12,'#866298',2)+R(x+10,ground-14,w-8,14,'#28223D')+windows+R(x+w*.5-21,ground-75,42,75,'#211E39',20)+R(x+w*.5-8,top-88,24,43,'#27213E',2));
}
function city(prefix,ground=890,far=false){
 let out='';let x=-100;let i=0;
 while(x<2050){const w=far?100+rand()*110:160+rand()*120,h=far?110+rand()*150:290+rand()*200;out+=building(`${prefix}-${i++}`,x,ground,w,h,far?'#2D2454':['#62456E','#4C4379','#3E6075','#73516F'][i%4],!far);x+=w+12}
 return out;
}
function lamp(p,x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})">${R(-7,-270,14,270,'#24334D',5)}${D('M0 -260Q0 -320 60 -320Q95 -320 95 -292','none','stroke="#24334D" stroke-width="12"')}${R(62,-292,65,70,P.gold,12)}${R(72,-282,45,49,P.cream,8)}${D('M65 -292H125L112 -314H78Z',P.teal)}${E(0,3,38,10,'#22253C')}</g>`}
function woman(p,x,y,s=1,lantern=false){
 const coat='M-84 -315Q0 -348 84 -315L123 -110Q0 -73 -123 -110Z';
 const head=E(-8,-415,90,105,'#663D50')+R(-67,-415,137,91,'#663D50',28)+E(0,-410,67,86,'#F2B38E')+D('M25 -492Q75 -470 67 -410Q64 -360 20 -333Q65 -389 25 -492','#D78678')+D('M-72 -415Q-76 -503 2 -513Q74 -510 75 -440Q25 -480 -12 -463Q-38 -452 -58 -416Z','#6F3E4C')+D('M-60 -443Q-45 -493 5 -497Q45 -498 65 -470Q8 -484 -25 -450Z','#9B5758')+G(p+'-eyes',E(-24,-414,13,10,'#FFF4DF')+E(27,-414,13,10,'#FFF4DF')+E(-19,-414,4.5,7,'#28223D')+E(32,-414,4.5,7,'#28223D'))+D('M-39 -438Q-24 -448 -10 -438M13 -438Q29 -447 42 -436','none','stroke="#73494F" stroke-width="6"')+D('M3 -412L-3 -388H9','none','stroke="#CE8575" stroke-width="5"')+D('M-16 -366Q3 -357 22 -369','none','stroke="#A85A67" stroke-width="5"')+E(-43,-388,11,5,'#EC9B88')+D('M-64 -435Q-69 -385 -47 -359','none','stroke="#FCE1B2" stroke-width="5"');
 const light=lantern?G(p+'-lantern',C(154,-163,86,P.cream,'opacity=".12"')+D('M132 -212V-231Q155 -257 178 -231V-212','none','stroke="#25435A" stroke-width="7"')+R(122,-214,66,94,P.teal,9)+R(132,-203,46,68,P.gold,5)+R(143,-196,23,55,P.cream,9)+R(118,-219,74,12,'#245871',4)+R(119,-129,72,12,'#245871',4)):'';
 return `<g transform="translate(${x} ${y}) scale(${s})">${G(p+'-rig',
 E(0,-2,147,23,'#0C1C35','opacity=".32"')+
 G(p+'-leg-l',R(-75,-128,54,113,'#38405A',18)+D('M-78 -30H-21V-2H-100Q-114 -15 -78 -30','#152C42')+R(-102,-6,81,9,P.teal,4))+
 G(p+'-leg-r',R(21,-128,54,113,'#2B304E',18)+D('M20 -30H74L103 -8Q105 0 88 0H20Z','#152C42')+R(20,-6,85,9,P.teal,4))+
 G(p+'-arm-l',D('M-78 -299Q-112 -297 -130 -233L-141 -169Q-118 -145 -96 -169L-79 -235Z','#C18B40')+E(-120,-155,21,26,'#F2B38E')+D('M-130 -145V-120Q-130 -103 -109 -103H-54Q-36 -103 -36 -120V-146','none','stroke="#315B70" stroke-width="10"')+R(-157,-118,132,100,P.teal,14)+R(-157,-66,132,48,'#21677E',12)+R(-117,-97,45,16,'#F2F7DB',2)+R(-103,-112,16,46,'#F2F7DB',2))+
 `<defs><clipPath id="${p}-coatclip">${D(coat,'white')}</clipPath></defs>`+
 D(coat,P.gold)+G(p+'-coat-shadow',D('M20 -349H150V-70H-5Q45 -173 20 -349','#A66C58'),`clip-path="url(#${p}-coatclip)"`)+D('M-80 -312L-108 -120','none',`stroke="${P.cream}" stroke-width="6"`)+D('M-48 -326L0 -269L-12 -342Z',P.cream)+D('M48 -326L0 -269L12 -342Z','#FFE7A2')+[0,1,2].map(i=>C(0,-252+i*51,7,'#B77A37')).join('')+
 G(p+'-arm-r',D('M78 -305Q119 -295 162 -248L139 -212Q106 -235 64 -248Z','#DF9E3B')+E(151,-235,23,23,'#F2B38E')+light)+
 R(-25,-357,50,42,'#E5A183',16)+G(p+'-head',head)
 )}</g>`;
}
function civilian(p,x,y,s,coat='#2B9EB3',child=false){
 const mouthId = p+'-mouth';
 return `<g transform="translate(${x} ${y}) scale(${s})">${G(p+'-rig',E(0,0,82,12,'#151C36','opacity=".3"')+R(-47,-78,33,78,'#28314B',12)+R(13,-78,33,78,'#20273F',12)+R(-56,-13,47,17,'#182A3E',8)+R(8,-13,51,17,'#182A3E',8)+D('M-68 -250Q0 -275 68 -250L80 -76H-80Z',coat)+D('M20 -261L80 -247V-76H-9Z','#265472','opacity=".4"')+R(-88,-230,30,133,coat,14)+R(60,-230,29,133,coat,14)+E(-72,-92,14,19,'#F2B38E')+E(73,-92,14,19,'#F2B38E')+R(-18,-284,36,38,'#DA997D',12)+E(0,-328,60,75,child?'#A65F50':'#564157')+E(0,-320,49,61,'#F2B38E')+D('M-51 -326Q-61 -406 18 -402Q65 -382 58 -325Q5 -371 -51 -326Z',child?'#A65F50':'#564157')+E(-18,-325,9,7,'#FFF5DE')+E(20,-325,9,7,'#FFF5DE')+C(-15,-325,3,'#2A2A45')+C(23,-325,3,'#2A2A45')+D('M-12 -288Q0 -290 12 -288','none','id="' + mouthId + '" stroke="#B27472" stroke-width="4"'))}</g>`;
}
const colors=`:root{--space-void:#06071B;--space-deep:#0D1130;--space-indigo:#18124C;--room-purple-dark:#251351;--room-purple-mid:#371E70;--room-purple-light:#4B2B8F;--moon-shadow:#050914;--moon-dark-crater:#3A4E68;--moon-mid-crater:#526A84;--moon-base:#99B2CC;--moon-highlight:#C2D6EB;--moon-rim-light:#EBF5FF;--plasma-core:#FFF;--plasma-yellow:#FFF200;--plasma-gold:#FFBE00;--plasma-orange:#FF6B00;--plasma-red:#FF2A00;--plasma-purple-shock:#5928ED;--rad-green:#39FF14;--rad-teal:#00F5D4;--seismic-cyan:#00E5FF;--ui-magenta:#DE216B;--ui-yellow:#FCE181;--ui-amber:#F7B519}`;
function scene(id,seconds,bg,art,script,css='',html=''){
 write('compositions/'+id+'.html',`<template><style>${colors}#root{position:absolute;inset:0;overflow:hidden;font-family:"Montserrat",sans-serif}.scene-bg{position:absolute;inset:0;background:${bg}}.stage{position:absolute;inset:0;width:100%;height:100%;overflow:hidden}.label{position:absolute;color:#FFF4DE;font-family:"Montserrat",sans-serif}*{box-sizing:border-box}${css}</style><div id="root" data-composition-id="${id}" data-width="1920" data-height="1080"><div class="scene-bg" data-layout-ignore></div><svg class="stage" viewBox="0 0 1920 1080" stroke-linecap="round" stroke-linejoin="round">${art}</svg>${html}</div><script>(()=>{const tl=gsap.timeline({paused:true});${script};window.__timelines=window.__timelines||{};window.__timelines['${id}']=tl})();</script></template>`);
}

// PLANO 1: arquitectura estratificada; el mundo es visible desde el frame cero.
let pavers='';for(let row=0;row<8;row++){const y=695+row*56,w=75+row*24;for(let col=-6;col<7;col++)pavers+=D(`M${1070+col*w} ${y}l${w-9} 0 24 36h-${w+8}Z`,row%2?'#2B3653':'#303C59','opacity=".55"')}
const nArt=stars('n-stars',32)+C(1450,194,98,'#574175')+C(1430,176,72,'#8A6B9C')+G('n-clouds',R(140,225,590,56,'#201F44',28)+R(1030,332,650,66,'#201F44',33)+R(650,157,420,43,'#201F44',22))+G('n-far',city('n-f',650,true))+G('n-mid',city('n-m',920,false))+G('n-road',D('M1040 625L1170 625L1810 1080H400Z','#1C2A46')+'<defs><clipPath id="n-roadclip">'+D('M1040 625L1170 625L1810 1080H400Z','white')+'</clipPath></defs><g clip-path="url(#n-roadclip)">'+pavers+'</g>'+D('M1040 625L400 1080M1170 625L1810 1080','none','stroke="#425777" stroke-width="10"'))+G('n-light',D('M1500 260L780 990L1420 1050Z','#E5BEE8','opacity=".10"')+D('M380 210L490 1040L1110 1030Z','#B9A5DF','opacity=".08"'))+G('n-front',building('n-near-l',-220,1120,650,930,'#24213E',true)+building('n-near-r',1730,1120,570,1000,'#24213E',false)+lamp('n-lamp',590,1080,1.25))+G('n-shadow',D('M0 850Q1000 520 1920 860V1080H0Z','#0B142D','opacity=".38"'))+G('n-wipe',R(0,0,1920,1080,P.purple),'transform="translate(1920 0)"');
scene('night',4.32,P.void,nArt,`
tl.fromTo('#n-far',{x:0},{x:-16,duration:4.3,ease:'none'},0);
tl.fromTo('#n-mid',{x:0},{x:-65,duration:4.3,ease:'none'},0);
tl.fromTo('#n-front',{x:0},{x:-140,duration:4.3,ease:'none'},0);
tl.fromTo('#n-road',{scale:1},{scale:1.09,duration:4.3,ease:'none',transformOrigin:'57% 55%'},0);
tl.fromTo('#n-light',{rotation:-7},{rotation:6,duration:3.7,ease:'sine.inOut',transformOrigin:'75% 20%'},.12);
tl.to('#n-mid .lit-window,#n-front .lit-window',{opacity:.12,duration:.22,stagger:.003,ease:'power2.in'},2.48);
tl.fromTo('#n-wipe',{x:1920},{x:0,duration:.24,ease:'power3.in'},4.05)
`);

// PLANO 2: actuación de cabeza, brazos, maletín y farol en tiempos distintos.
const cArt=R(0,580,1920,500,'#17243F')+G('c-back',building('c-house-l',-70,970,620,870,'#48305F',false)+building('c-house-r',1470,970,560,920,'#382953',false)+R(600,100,770,850,'#21173E',190)+R(660,132,660,818,'#4B346B',180)+D('M720 950V320Q970 70 1220 320V950Z','#0D1830'))+G('c-door-light',D('M1100 350L1750 1080H550Z',P.cream,'opacity=".08"'))+D('M0 1000H1920V1080H0Z','#28334B')+[0,1,2,3,4].map(i=>R(100+i*360,1015,210,11,'#3B4861',5)).join('')+woman('c-irena',810,985,1.32,true)+G('c-foreground',R(-30,0,165,1080,'#151D35')+R(1800,0,150,1080,'#151D35'))+G('c-iris',C(1015,770,1,P.cream),'opacity="0"')+G('c-reveal',R(0,0,1920,1080,P.purple));
scene('choice',3.92,P.purple,cArt,`
tl.fromTo('#c-reveal',{x:0},{x:-1920,duration:.32,ease:'power3.out'},.01);
tl.fromTo('#c-irena-rig',{x:-160},{x:0,duration:.82,ease:'power3.out'},.12);
tl.fromTo('#c-irena-head',{rotation:-6},{rotation:0,duration:.7,ease:'power2.out',transformOrigin:'50% 90%'},.24);
tl.fromTo('#c-irena-leg-l',{rotation:-12},{rotation:0,duration:.18,yoyo:true,repeat:2,transformOrigin:'50% 0%'},.14);
tl.fromTo('#c-irena-leg-r',{rotation:10},{rotation:0,duration:.18,yoyo:true,repeat:2,transformOrigin:'50% 0%'},.30);
tl.fromTo('#c-irena-arm-l',{rotation:9},{rotation:0,duration:.7,ease:'power2.out',transformOrigin:'80% 5%'},.26);
tl.fromTo('#c-irena-arm-r',{rotation:11},{rotation:-13,duration:.55,ease:'power3.out',transformOrigin:'10% 10%'},1.98);
tl.fromTo('#c-irena-eyes',{scaleY:1},{scaleY:.1,duration:.07,yoyo:true,repeat:1,transformOrigin:'50% 50%'},1.33);
tl.fromTo('#c-door-light',{opacity:0},{opacity:.85,duration:.6,ease:'power2.out'},2.02);
tl.fromTo('#c-foreground',{x:0},{x:-50,duration:3.5,ease:'none'},.12);
tl.fromTo('#c-iris',{opacity:1,scale:1},{opacity:1,scale:2200,duration:.28,ease:'power3.in',svgOrigin:'1015 770'},3.62)
`);

// PLANO 3: el círculo de luz se recoge y presenta un retrato coherente con el rig.
const pArt=G('p-rays',Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return D(`M${520+Math.cos(a)*412} ${560+Math.sin(a)*412}L${520+Math.cos(a)*450} ${560+Math.sin(a)*450}`,'none',`stroke="${i%2?P.coral:P.cream}" stroke-width="${i%3?8:15}"`)}).join(''))+C(520,560,408,P.gold)+C(520,560,388,P.mint)+C(560,610,330,'#319B9F')+`<defs><clipPath id="p-mask">${C(520,560,388,'white')}</clipPath></defs>`+G('p-portrait',woman('p-irena',510,1120,1.85,false),'clip-path="url(#p-mask)"')+G('p-cover',C(960,540,1450,P.cream));
scene('portrait',2.72,P.purple,pArt,`
tl.fromTo('#p-cover',{scale:1},{scale:0,duration:.48,ease:'power3.out',svgOrigin:'520 560'},.02);
tl.fromTo('#p-portrait',{opacity:0,y:60},{opacity:1,y:0,duration:.52,ease:'power3.out'},.12);
tl.fromTo('#p-name1',{opacity:0,x:70},{opacity:1,x:0,duration:.24,ease:'power3.out'},.88);
tl.fromTo('#p-name2',{opacity:0,x:70},{opacity:1,x:0,duration:.24,ease:'power3.out'},1.60);
tl.fromTo('#p-role',{opacity:0},{opacity:1,duration:.25},.4);
tl.fromTo('#p-line',{scaleX:0},{scaleX:1,duration:.5,ease:'power3.out',transformOrigin:'0 50%'},1.8);
tl.fromTo('#p-irena-eyes',{scaleY:1},{scaleY:.1,duration:.065,yoyo:true,repeat:1,transformOrigin:'50% 50%'},1.5)
`,`.label{left:1010px;right:120px}#p-role{top:300px;font-size:31px;font-weight:700;letter-spacing:.15em;color:#FCE181;opacity:0}#p-name1{top:390px;font-size:118px;font-weight:900;line-height:1.08;opacity:0}#p-name2{top:535px;font-size:128px;font-weight:900;line-height:1.08;opacity:0}#p-line{top:710px;height:12px;background:#DE216B;width:610px}`,
`<div id="p-role" class="label">ASISTENTE SOCIAL</div><div id="p-name1" class="label">IRENA</div><div id="p-name2" class="label">SENDLER</div><div id="p-line" class="label" data-layout-ignore></div>`);

// PLANO 4: patio, familias y verja. Los rostros quedan por encima del muro.
let bricks='';for(let row=0;row<4;row++)for(let col=-1;col<17;col++)bricks+=R(col*128+(row%2?64:0),820+row*65,119,56,['#61466D','#705078','#795381'][(row+col+30)%3],5);
const leftGate=D('M685 835V505Q820 394 960 394V835Z','#282447','fill-opacity=".12" stroke="#A58FB9" stroke-width="13"')+[710,740,940].map(x=>D(`M${x} 510V830`,'none','stroke="#A58FB9" stroke-width="8"')).join('')+D('M690 720H960','none','stroke="#A58FB9" stroke-width="10"');
const fArt=G('f-sky',C(1540,240,180,'#4C326D')+R(160,140,700,90,'#38295B',45)+R(1040,290,650,65,'#38295B',33))+G('f-back',building('f-house-1',80,945,420,640,'#5B527E',true)+building('f-house-2',500,945,370,710,'#536C85',true)+building('f-house-3',875,945,360,620,'#62638F',true)+building('f-house-4',1230,945,480,720,'#4F4A77',true))+R(0,920,1920,160,'#364D63')+D('M600 550H1300L1650 1080H260Z','#3D5C72')+G('f-families',G('f-family1',civilian('f-mother',808,966,.88,P.coral)+civilian('f-child1',906,973,.57,P.gold,true),'opacity="0"')+G('f-family2',civilian('f-father',1100,964,.95,P.teal)+civilian('f-child2',1010,973,.54,P.mint,true),'opacity="0"'))+G('f-walls',R(0,805,1920,275,'#4D3C61')+R(-30,805,610,275,'#5A4067')+R(1345,805,600,275,'#5A4067')+bricks+R(565,405,120,675,'#5B3C6D',10)+R(565,405,24,675,'#886384',7)+R(1235,405,120,675,'#5B3C6D',10)+R(1235,405,24,675,'#886384',7)+R(545,390,160,35,'#8B678B',8)+R(1215,390,160,35,'#8B678B',8))+G('f-gate-l',leftGate)+G('f-gate-r',`<g transform="translate(1920 0) scale(-1 1)">${leftGate}</g>`)+G('f-lock',R(935,739,50,59,P.gold,9)+D('M945 740V724Q960 706 975 724V740','none',`stroke="${P.cream}" stroke-width="8"`),'opacity="0"')+G('f-year',R(135,122,456,175,P.coral,16)+R(155,108,24,49,P.cream,12)+R(543,108,24,49,P.cream,12)+R(159,158,408,4,'#F68AB5'))+G('f-locplate',R(1380,480,440,170,P.purple,20)+R(1380,500,6,130,P.gold,3),'opacity="0"')+G('f-connector',D('M1380 579H1320L1296 616','none',`stroke="${P.cream}" stroke-width="5" stroke-dasharray="160" stroke-dashoffset="160"`)+C(1296,616,10,P.gold),'opacity="0"');
scene('ghetto',9.04,P.purple,fArt,`
tl.fromTo('#f-year',{y:-260,rotation:-8},{y:0,rotation:0,duration:.20,ease:'power3.out',transformOrigin:'50% 50%'},.12);
tl.fromTo('#f-year-text',{opacity:0},{opacity:1,duration:.12},.20);
tl.fromTo('#f-year-text',{y:-260},{y:0,duration:.20,ease:'power3.out'},.12);
tl.fromTo('#f-back',{x:35},{x:-20,duration:8.9,ease:'none'},.12);
tl.fromTo('#f-family1',{opacity:0,y:28},{opacity:1,y:0,duration:.6,ease:'power3.out'},2.16);
tl.fromTo('#f-family2',{opacity:0,y:24},{opacity:1,y:0,duration:.6,ease:'power3.out'},2.62);
tl.fromTo('#f-child1-rig',{rotation:3},{rotation:-4,duration:.5,ease:'power2.out',transformOrigin:'50% 100%'},3.55);
tl.fromTo('#f-child2-rig',{x:14},{x:-12,duration:.5,ease:'power3.out'},3.85);
tl.fromTo('#f-mother-mouth,#f-father-mouth,#f-child1-mouth,#f-child2-mouth',{attr:{d:'M-12 -288Q0 -290 12 -288'}},{attr:{d:'M-12 -286Q0 -296 12 -286'},duration:.32,stagger:.06,ease:'power2.out'},4.80);
tl.fromTo('#f-gate-l',{x:-630},{x:0,duration:.62,ease:'power3.in'},4.26);
tl.fromTo('#f-gate-r',{x:630},{x:0,duration:.62,ease:'power3.in'},4.26);
tl.fromTo('#f-lock',{opacity:0,scale:1.6},{opacity:1,scale:1,duration:.18,ease:'back.out(1.3)',svgOrigin:'960 770'},4.88);
tl.fromTo('#f-locplate',{opacity:0},{opacity:1,duration:.2},5.99);
tl.fromTo('#f-loc1',{opacity:0,x:35},{opacity:1,x:0,duration:.25,ease:'power3.out'},5.99);
tl.fromTo('#f-loc2',{opacity:0,x:35},{opacity:1,x:0,duration:.20,ease:'power3.out'},6.74);
tl.fromTo('#f-loc2',{color:'#FCE181'},{color:'#FFFFFF',duration:.12},7.44);tl.to('#f-loc2',{color:'#FCE181',duration:.28},7.56);
tl.fromTo('#f-connector',{opacity:0},{opacity:1,duration:.18},6.24);tl.to('#f-connector path',{strokeDashoffset:0,duration:.45,ease:'power2.out'},6.24)
`,`.label{font-weight:800}#f-year-text{left:168px;top:143px;width:390px;text-align:center;font-size:122px;color:#FFF7E7;line-height:1.15;opacity:0}#f-loc1{left:1410px;top:500px;font-size:51px;opacity:0}#f-loc2{left:1410px;top:575px;font-size:32px;letter-spacing:.16em;color:#FCE181;opacity:0}`,
`<div id="f-year-text" class="label">1940</div><div id="f-loc1" class="label">VARSOVIA</div><div id="f-loc2" class="label">POLONIA</div>`);

// Audio: muestras reales, recorte de ataque, nivel por función y pico medido después del procesado.
const spec=[['sweep','whoosh-short',.7,.85,-8,'highpass=f=100'],['shine','sparkle',1.3,.88,-11,'highpass=f=550'],['paper','paper',.7,1,-8,'highpass=f=150'],['gate','pipe-hit',.9,.7,-5,'highpass=f=75,lowpass=f=1600'],['step','body-fall',.32,1.2,-10,'highpass=f=90,lowpass=f=1500'],['rumble','impact-bass-1',1.25,.8,-8,'highpass=f=55,lowpass=f=500'],['air','whoosh-cinematic',4.2,.7,-18,'highpass=f=250,lowpass=f=2400'],['pop','pop',.3,.85,-11,'highpass=f=150'],['latch','click',.3,.8,-7,'highpass=f=300']];
const assets={};
function measure(file){const b=execFileSync('ffmpeg',['-v','error','-i',file,'-ac','1','-ar','48000','-f','f32le','pipe:1'],{maxBuffer:16*1024*1024});let peak=0,best=0,max=0;for(let i=0;i+1920<=b.length;i+=1920){let e=0;for(let j=i;j<i+1920;j+=4){const v=b.readFloatLE(j);e+=v*v;max=Math.max(max,Math.abs(v));}if(e>best){best=e;peak=(i/4+240)/48000;}}return{peak,db:20*Math.log10(Math.max(max,1e-9))};}
for(const[name,source,len,rate,target,filter]of spec){
 const input=path.join(root,'assets/sfx/'+source+'.mp3'),out=path.join(root,'assets/sfx/'+name+'.wav');
 const original=measure(input),start=name==='air'?0:Math.max(0,original.peak-.05);
 const sr=Number(JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','a:0','-show_entries','stream=sample_rate','-of','json',input],{encoding:'utf8'})).streams[0].sample_rate);
 execFileSync('ffmpeg',['-v','error','-ss',String(start),'-i',input,'-t',String(len*rate),'-af',`asetrate=${sr*rate},aresample=48000,${filter},afade=t=out:st=${Math.max(.05,len-.12)}:d=0.12`,'-c:a','pcm_s16le','-y',out]);
 const initial=measure(out),tmp=out+'.norm.wav';execFileSync('ffmpeg',['-v','error','-i',out,'-af',`volume=${target-initial.db}dB`,'-c:a','pcm_s16le','-y',tmp]);fs.renameSync(tmp,out);
 const final=measure(out),d=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',out],{encoding:'utf8'}).trim());assets[name]={file:'assets/sfx/'+name+'.wav',peak:final.peak,duration:d,peakDb:final.db};
}
const cues=[['air',0,.65,'calle nocturna','start'],['sweep',4.22,.72,'muro pasa por cámara'],['step',4.75,.65,'primer apoyo'],['step',5.12,.60,'segundo apoyo'],['latch',6.35,.75,'elevar farol'],['sweep',8.18,.75,'luz del farol'],['shine',9.38,.60,'nombre Irena'],['paper',11.29,.82,'año 1940'],['pop',13.68,.58,'familia izquierda'],['pop',14.14,.56,'familia derecha'],['sweep',15.60,.55,'desplazar verja'],['gate',15.84,.90,'verja cerrada'],['rumble',15.84,.60,'peso de la verja'],['latch',16.02,.82,'cerradura'],['paper',17.25,.64,'Varsovia'],['shine',18.45,.52,'Polonia']];
const audio=cues.map(([name,hit,vol,cause,align],i)=>{const s=assets[name],start=align==='start'?hit:Math.max(0,hit+1/30-s.peak);return `<audio id="sfx-${i}" class="clip" src="${s.file}" data-start="${start.toFixed(4)}" data-duration="${Math.min(s.duration,20-start).toFixed(4)}" data-volume="${vol}" data-track-index="${10+i}" data-fade-out="0.08"></audio>`}).join('\n');
const hosts=[['night',0,4.32],['choice',4.32,3.92],['portrait',8.24,2.72],['ghetto',10.96,9.04]].map(([id,t,d],i)=>`<div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${t}" data-duration="${d}" data-track-kind="graphics" data-track-index="${i+1}" data-width="1920" data-height="1080"></div>`).join('\n');
write('index.html',`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=1920,height=1080"><title>Irena · una luz en la oscuridad</title><script src="assets/gsap.min.js"></script><style>${colors}*{margin:0;box-sizing:border-box}html,body,#root{width:1920px;height:1080px;overflow:hidden;background:#06071B}#root{position:relative;font-family:"Montserrat",sans-serif}</style></head><body><div id="root" data-composition-id="main" data-width="1920" data-height="1080" data-fps="30" data-start="0" data-duration="20">${hosts}<audio id="narration" class="clip" src="assets/voice/narracion.wav" data-start="0" data-duration="19.08" data-volume=".95" data-track-index="7" data-fade-out=".04"></audio><audio id="music" class="clip" src="assets/music/ambiente.mp3" data-start="0" data-duration="20" data-volume=".16" data-track-index="8" data-fade-in=".5" data-fade-out="1.1"></audio>${audio}</div><script>window.__timelines=window.__timelines||{};window.__timelines.main=gsap.timeline({paused:true});</script></body></html>`);
write('audio/sfx-timing.json',JSON.stringify({assets,cues},null,2));
const source=JSON.parse(fs.readFileSync(path.join(root,'audio/transcript-source.json'),'utf8'));write('audio/transcript.json',JSON.stringify(source.filter(w=>w.start<19.08),null,2));
console.log('4 escenas SVG, 20 segundos, 600 frames, 16 sonidos y voz original.');
