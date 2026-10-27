# Historia Estravagante – “El Velo de los Sueños”

## Concepto
Una narración surrealista que mezcla poesía cósmica, imágenes oníricas y un **audio de narrador suave** (2 min) para guiar al espectador por un viaje entre dimensiones. El estilo es completamente nuevo: “Neón‑Lágrima”.

- **Neón‑Lágrima** combina colores neón brillantes con efectos de lágrima de tinta que aparecen y desaparecen al ritmo del audio.
- Cada escena se desplaza como si fluyera por una corriente de tinta líquida, mientras el sonido susurra al oyente.

## Guión (texto narrado)
```
En medio de una de las épocas que el tiempo olvidó, el cielo derramó una lluvia de luces líquidas. Cada gota era un susurro, una lágrima que caía del firmamento, formando caminos de neón sobre la oscuridad.

El viajero, un ser de sombra y luz, caminó sobre esas rutas, buscando el Velo que cubre los sueños perdidos. Cada paso resonaba con el latido del universo, y la música del narrador acariciaba su alma.

Al cruzar el puente de cristales rotos, el Velo se abrió, revelando un espejo de infinitas posibilidades. El viajero vio su reflejo multiplicarse en mil versiones, todas cantando la misma melodía de esperanza.

En el último suspiro, el Velo se disolvió en una explosión de colores, dejando al viajero flotando en la eternidad, mientras la voz del narrador se fundía con el eco del cosmos.
```

## Recursos
- Audio narrador (2 min): `FineVoice_vos de narrador 1_[softly] En medio de una de las époc_UTC_2026-10-19 03_31_50.mp3`
- Imágenes de fondo (se pueden generar con IA o usar placeholders): `neon_ink_bg.jpg`
- Sprite del viajero: `traveler.png`

## Estructura HyperFrames
```
extra-story/
├─ index.html          ← punto de entrada
├─ story.html          ← composición visual
├─ story.js            ← timelines GSAP
├─ assets/
│   ├─ audio.mp3       ← audio narrador (copiar del path original)
│   ├─ neon_ink_bg.jpg
│   └─ traveler.png
└─ README.md           ← esta guía
```

## Paso a paso para montar la escena
1. **Crear carpeta** `extra-story` dentro de `d:/hyperframes-studio/`.
2. **Copiar el audio** a `extra-story/assets/audio.mp3` (renombrar si conviene).
3. **Crear `index.html`** con `data-composition-src="story.html"`.
4. **Crear `story.html`** con los elementos visuales (`<img>` de fondo, viajero, efectos de lágrima).
5. **Crear `story.js`** con los timelines:
   - Timeline de fondo neón (gradiente pulsante).
   - Timeline del viajero (movimiento ondulado).
   - Timeline de lágrimas (spawn y fade).
   - Timeline de audio (fade‑in, sincronización con eventos visuales).
6. **Ejecutar** `npx hyperframes render --output dist/extra-story.mp4`.

---

## Código de ejemplo (copiar en los archivos)
### index.html
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>El Velo de los Sueños</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="story.js" defer></script>
</head>
<body>
  <div id="scene" data-composition-src="story.html"></div>
</body>
</html>
```

### story.html
```html
<div class="fondo" data-clip="bg" data-start="0" data-duration="120">
  <img src="assets/neon_ink_bg.jpg" alt="Fondo neón" />
</div>
<img src="assets/traveler.png" id="traveler" class="personaje" data-clip="traveler" data-start="0" data-duration="120" />
<audio src="assets/audio.mp3" data-clip="narr" data-start="0" data-duration="120" preload="auto"></audio>
```

### story.js
```js
window.__timelines = {};
// Fondo neón pulsante
const tlBg = gsap.timeline({defaults:{duration:5, repeat:-1, yoyo:true}});
tlBg.to('.fondo img', {opacity:0.6, ease:'sine.inOut'});
window.__timelines['bg'] = tlBg;

// Viajero movimiento ondulado
const tlTraveler = gsap.timeline({defaults:{duration:2, repeat:-1, yoyo:true}});
tlTraveler.to('#traveler', {y:'+=30', rotation:5, ease:'power1.inOut'});
window.__timelines['traveler'] = tlTraveler;

// Lágrimas (spawn cada 4s)
function spawnLagrima(){
  const drop = document.createElement('div');
  drop.className='lagrima';
  drop.style.position='absolute';
  drop.style.left=Math.random()*window.innerWidth+'px';
  drop.style.top='0px';
  drop.style.width='4px';
  drop.style.height='20px';
  drop.style.background='rgba(255,0,255,0.8)';
  document.body.appendChild(drop);
  gsap.to(drop,{y:window.innerHeight, opacity:0, duration:4, onComplete:()=>drop.remove()});
}
const tlLagrimas = gsap.timeline({repeat:-1});
tlLagrimas.add(spawnLagrima, '+=0').add(spawnLagrima, '+=4');
window.__timelines['lagrimas'] = tlLagrimas;

// Audio con fade‑in/out sincronizado
const tlAudio = gsap.timeline();
tlAudio.fromTo('audio[data-clip="narr"]', {volume:0}, {volume:1, duration:1}, 0);
tlAudio.to('audio[data-clip="narr"]', {volume:0, duration:1}, 119);
window.__timelines['narr'] = tlAudio;
```

---

## Tips de estilización “Neón‑Lágrima”
- Usa **colores** `hsl(280,100%,70%)` y `hsl(190,100%,60%)` para el neón.
- Aplica **blur** ligero (`filter: blur(2px)`) sólo a los fondos, nunca a los elementos animados.
- Añade **glow** con `text-shadow` o `box-shadow` en los textos y el viajero.
- Mantén la **paleta** limitada a 3‑4 colores para que el efecto sea contundente.

---

## Render final
Ejecuta en la raíz del proyecto:
```bash
npx hyperframes render --output dist/velo-sueños.mp4
```

¡Listo! Tendrás una pieza audiovisual extravagante, con audio sincronizado y el estilo **Neón‑Lágrima** creado desde cero.
