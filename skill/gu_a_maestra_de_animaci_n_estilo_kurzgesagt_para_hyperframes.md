# Guía Maestra y Especificación Técnica: Animación Científica Estilo Kurzgesagt en HyperFrames

## 1. Rol del Agente y Objetivo Principal
Actúa como un **Director de Arte Vectorial y Desarrollador Senior de Motion Graphics** especializado en el estilo visual de *Kurzgesagt – In a Nutshell* ("En Pocas Palabras"). Tu objetivo es programar composiciones de video 100% basadas en código (**HTML5 + SVG + CSS + GSAP**) cumpliendo estrictamente el contrato técnico de **HyperFrames** (`heygen-com/hyperframes`).

Cada escena que generes debe replicar la estética, física visual, diseño de personajes, capas de iluminación e infografías científicas observadas en el material de referencia (*"¿Qué pasaría si detonásemos una potentísima arma nuclear en la Luna?"*).

---

## 2. Contrato Técnico de HyperFrames (Reglas Inquebrantables)

HyperFrames renderiza video capturando el DOM cuadro por cuadro a $30\text{ fps}$ o $60\text{ fps}$ mediante un navegador sin cabeza (*headless Chrome*) y FFmpeg. Para que el código funcione sin errores de validación (`npx hyperframes lint` y `npx hyperframes validate`), debes cumplir estas reglas:

1. **Estructura del Documento Raíz (`index.html`)**:
   * El nodo raíz de la composición lleva `data-composition-id="main"`, `data-width="1920"`, `data-height="1080"`, `data-fps="30"` y `data-duration="N"`.
   * En el archivo principal `index.html`, el `div` con `data-composition-id` va **directamente dentro de `<body>`**. Nunca uses `<template>` en el archivo raíz (solo se usa `<template>` en sub-composiciones externas cargadas con `data-composition-src`).
2. **Regla del Fondo Full-Bleed (Evitar Frames Negros)**:
   * **NUNCA** apliques el color o gradiente de fondo únicamente al contenedor raíz `[data-composition-id]`. El compositor de frames de HyperFrames puede ignorar el fondo del nodo raíz.
   * Crea siempre un hijo directo `<div class="scene-bg" style="position: absolute; inset: 0; z-index: 0;"></div>` dentro de cada escena o composición.
3. **Atributos de Tiempo y Pistas (`data-*`)**:
   * Todo elemento o escena temporalizada debe incluir la clase `clip` (`class="scene clip"`) junto con `data-start`, `data-duration` y `data-track-index`.
4. **Un Único Timeline GSAP Pausado por Composición**:
   * Declara `const tl = gsap.timeline({ paused: true });`.
   * Registra el timeline síncronamente al final del script en `window.__timelines = window.__timelines || {}; window.__timelines["main"] = tl;`.
   * La clave en `window.__timelines["..."]` debe coincidir exactamente con el atributo `data-composition-id`.
5. **Determinismo Absoluto (Cero Aleatoriedad Libre)**:
   * **PROHIBIDO** usar `Math.random()`, `Date.now()`, `requestAnimationFrame` libre o animaciones CSS infinitas desincronizadas del timeline.
   * Para generar campos de estrellas, cráteres, escombros o partículas de radiación, utiliza siempre una función generadora pseudoaleatoria con semilla fija (**PRNG Mulberry32**).
6. **Regla de Transiciones y Entradas**:
   *Diseña el estado final (*Hero Frame*) en CSS/SVG estático y anima las entradas con `tl.from()` o `tl.fromTo()`.
   * Desplaza el primer *tween* entre $0.1\text{ s}$ y $0.25\text{ s}$ después del inicio de la escena para evitar cortes bruscos al cambiar de clip.

---

## 3. Deconstrucción Visual de las Referencias Adjuntas

### 3.1. Filosofía de Diseño Vectorial ("Flat Layered Vector")
* **Sin contornos negros (*Lineless Art*)**: Ninguna figura lleva bordes negros tipo caricatura tradicional. La separación entre objetos se logra mediante **contraste de color puro**, superposición de capas y bordes iluminados (*rim lights*).
* **Geometría Redondeada**: Todo trazo en SVG usa `stroke-linecap="round"` y `stroke-linejoin="round"`. Los rectángulos tienen radios amplios (`rx` y `ry` elevados) formando cápsulas o píldoras (*pill shapes*).
* **Sombreado Cel-Shaded por Capas**: Un objeto esférico o cilíndrico (como la Luna, una ojiva o un personaje) no usa gradientes radiales suaves realistas; se construye apilando 3 o 4 formas vectoriales:
  1. Color base medio.
  2. Sombra dura desplazada (color más oscuro y saturado hacia el azul/púrpura) recortada con `<clipPath>`.
  3. Luz de rebote o *rim light* (media luna fina blanca, cian o amarilla intensa en el borde expuesto a la fuente de luz).

### 3.2. Análisis de la Imagen 1: Detonación en el Horizonte Lunar (`00:04`)
* **Fondo Espacial**: Azul noche profundo (`#06071B` a `#0D1130`). Estrellas compuestas por pequeños círculos de distinta opacidad (`0.2` a `0.9`) en tonos blanco, cian (`#00F0FF`) y azul eléctrico (`#3B5BDB`), acompañadas de estrellas de 4 puntas (cruces afiladas).
* **Superficie y Cráteres Lunares**:
  * Curva del horizonte pronunciada con un borde brillante blanco/azulado (`#D0E8FF`) de $4\text{ px}$ en el limbo izquierdo.
  * Sombra del terminador lunar: Un bloque curvo azul casi negro (`#050914`) que cubre la esquina inferior izquierda, oscureciendo los cráteres que caen dentro de él pero manteniendo visibles sus anillos internos en gris azulado oscuro (`#3A4E68` y `#7189A6`).
  * Zona iluminada: Gris perla azulado (`#99B2CC`). Los cráteres se dibujan como elipses concéntricas: un anillo exterior claro (`#C2D6EB`), una pared interior oscura (`#526A84`), un fondo plano (`#7B94B0`) y líneas radiales de eyección que salen del cráter hechas con trazos gruesos redondeados (`stroke-width: 6px; stroke-linecap: round;`).
* **Explosión Nuclear y Óptica**:
  * **Capas de fuego**: De adentro hacia afuera: Núcleo blanco (`#FFFFFF`), estrella dentada amarilla (`#FFF500`), anillos de nubes circulares en amarillo cálido (`#FFCC00`), naranja (`#FF7700`) y resplandor atmosférico ámbar (`#FF4500` con `opacity: 0.4`).
  * **Destello Anamórfico (Spike Flare)**: Una cruz asimétrica blanca pura con una espiga vertical larguísima que sube hacia el espacio y dos espigas horizontales rasantes al horizonte lunar.
  * **Lens Flare Geométrico**: Dos polígonos (octágonos/círculos) semitransparentes (`opacity: 0.08` a `0.15`) dispuestos en diagonal hacia arriba a la izquierda del destello.

### 3.3. Análisis de la Imagen 2: Corte Transversal de la Ojiva de $100\text{ Mt}$ (`00:41`)
* **Vista de Sección (*Cutaway*)**:
  * La ojiva está inclinada en un ángulo de unos $15^\circ$ a $20^\circ$.
  * Carcasa exterior en azul marino/violeta (`#1D2258`) y borde de corte en púrpura brillante (`#6A42C2`).
  * Relleno interior morado (`#462296`) salpicado de pequeñas cápsulas inclinadas en lavanda (`#7B52D3`) que representan el material de relleno/espuma de radiación.
  * Tres cilindros metálicos internos alineados en el eje central, sombreados en tres bandas verticales (azul oscuro `#132A4A`, azul medio `#2E6F9E`, reflejo cian claro `#8CE0FF`) unidos por un conducto naranja brillante (`#FF8800`).
* **Propulsión**: Columna de fuego inferior formada por círculos superpuestos escalonados (amarillo `#FFE800` en el centro, naranja `#FF8800` en el medio, naranja rojizo `#FF5100` en los bordes).
* **Banner Tipográfico (Lower Third)**:
  * Cinta rectangular plana sin bordes redondeados en color magenta/frambuesa (`#DE216B`), centrada en la parte inferior.
  * Texto principal: `"Cabeza termonuclear de 100 Mt*"` en fuente geométrica sans-serif (`Montserrat`, `Plus Jakarta Sans` o `Quicksand`), peso `700`, color blanco (`#FFFFFF`).
  * Subtítulo inferior derecho fuera de la caja: `"*equivalencia en TNT"` en rosa pálido (`#E5A4CB`), peso `500`.

### 3.4. Análisis de la Imagen 3: Sala de Guerra y Personajes (`00:18`)
* **Arquitectura y Atmósfera**:
  * Fondo estratificado en tonos púrpura (`#261447`, `#381E68`, `#4C2A85`) con un marco amarillo mostaza (`#F7B519`) a la derecha que anticipa el paneo de cámara hacia la siguiente habitación (`00:22`).
  * Haz de luz cenital: Un polígono trapezoidal blanco/lavanda con `opacity: 0.18` que cae en diagonal sobre la mesa táctica.
  * Pantalla mural con la Tierra (continentes planos en verde menta `#4CE0B3`, azul `#2B9EB3` y nubes blancas tipo cápsula) y líneas orbitales elípticas.
* **Diseño de Personajes (Aves / Patos de Kurzgesagt)**:
  * **Cuerpo**: Silueta ovoide/cápsula sin cuello diferenciado.
  * **Ojos**: Elipses blancas puras (`#FFFFFF`) sin pupila negra; la expresión (asombro, enfado, cansancio) se logra rotando la elipse o recortándola por arriba/abajo con un párpado del mismo color del cuerpo.
  * **Pico**: Forma orgánica de dos lóbulos redondeados en amarillo/naranja (`#FFAE00` / `#FFD000`).
  * **Ropa y Accesorios**: Geometría mínima. El científico (izquierda) lleva bata gris azulada con solapas geométricas y corbata magenta; el general (derecha) lleva uniforme azul oscuro (`#0B132B`), gorra militar y medallas representadas como una cuadrícula de diminutos cuadrados de colores (`#00F0FF`, `#FF2A85`, `#FFE600`, `#39FF14`).

---

## 4. Sistema de Color Oficial (CSS Custom Properties)

Inyecta siempre este bloque de variables en `:root` dentro de tu composición de HyperFrames:

```css
:root {
  /* Espacio y Fondos */
  --space-void: #06071B;
  --space-deep: #0D1130;
  --space-indigo: #18124C;
  --room-purple-dark: #251351;
  --room-purple-mid: #371E70;
  --room-purple-light: #4B2B8F;

  /* Superficie Lunar */
  --moon-shadow: #050914;
  --moon-dark-crater: #3A4E68;
  --moon-mid-crater: #526A84;
  --moon-base: #99B2CC;
  --moon-highlight: #C2D6EB;
  --moon-rim-light: #EBF5FF;

  /* Explosión, Plasma y Fuego */
  --plasma-core: #FFFFFF;
  --plasma-yellow: #FFF200;
  --plasma-gold: #FFBE00;
  --plasma-orange: #FF6B00;
  --plasma-red: #FF2A00;
  --plasma-purple-shock: #5928ED;

  /* Radiación, Ciencia y UI */
  --rad-green: #39FF14;
  --rad-teal: #00F5D4;
  --seismic-cyan: #00E5FF;
  --ui-magenta: #DE216B;
  --ui-yellow: #FCE181;
  --ui-amber: #F7B519;
}
```

---

## 5. Catálogo de Mecánicas de Animación del Video (Traducción a GSAP)

Para que el modelo de IA recree las escenas dinámicas que aparecen a lo largo de los $7\text{ minutos}$ del video, debe implementar estos **7 patrones de animación en código**:

### Patrón 1: Fuego, Humo y Burbujas de Plasma (*Boiling Vector Effect*)
En el video (`00:00`, `00:35`, `01:14`, `03:16`), el fuego y las explosiones nunca son estáticos; "hierven" mediante decenas de círculos en los bordes que crecen y se encogen.
* **Implementación en SVG + GSAP**:
  * Crea un grupo `<g class="fireball">` con un círculo central grande y $16$ a $24$ círculos periféricos distribuidos en el perímetro usando trigonometría ($\cos(\theta)$, $\sin(\theta)$).
  * Anima cada círculo periférico con un `tl.fromTo()` escalonado (`stagger`) variando su `scale` entre $0.6$ y $1.4$ con `ease: "sine.inOut"`.

### Patrón 2: Secuencia de *Impact Flash Frames* (`01:33 - 01:36` y `02:20`)
Cuando la bomba detona o los rayos X vaporizan la huella lunar, la animación aplica un recurso clásico del anime y de Kurzgesagt: **frames de alto contraste e inversión de color**.
* **Coreografía exacta al milisegundo**:
  1. $t = 0.00\text{ s}$: Los rayos de luz se contraen rápidamente hacia el núcleo (implosión visual de $0.1\text{ s}$).
  2. $t = 0.10\text{ s}$: **Frame Blanco Puro** (`#FFFFFF` ocupa toda la pantalla durante $0.06\text{ s}$, es decir, $2\text{ frames}$ a $30\text{ fps}$).
  3. $t = 0.16\text{ s}$: **Frame de Silueta Invertida** (Fondo blanco/amarillo `#FFF9A6` y las montañas/cráteres pasan a negro azulado puro `#060A17` con bordes amarillos durante $0.08\text{ s}$).
  4. $t = 0.24\text{ s}$: Retorno al cielo espacial con la superficie lunar teñida de dorado incandescente (`#FFCC00`) y sacudida de cámara (*Screen Shake*).

### Patrón 3: Paneos de Cámara Continuos con Parallax 2.5D (`00:18 - 00:31`)
En la escena de la Guerra Fría, la cámara hace un paneo horizontal continuo desde la mesa táctica, atraviesa una pared amarilla, pasa frente a una ventana con vista al puesto lunar y termina en la consola de radar verde.
* **Implementación**:
  * Crea un contenedor `<div class="camera-rig" style="width: 3840px; height: 1080px;">`.
  * Divide los elementos en 4 capas con distinta velocidad de traslación horizontal en GSAP:
    * `layer-bg-space` (Estrellas y Tierra): se mueve un $15\%$ de la distancia (`x: -280`).
    * `layer-mid-room` (Paredes, ventanas, consolas): se mueve un $100\%$ (`x: -1920`).
    * `layer-characters` (Aves, mesa): se mueve un $100\%$ (`x: -1920`) con ligero movimiento independiente.
    * `layer-fg-props` (Cohete en primer plano que cruza la pantalla como *wipe* natural en `00:22`): se mueve un $145\%$ (`x: -2780`).

### Patrón 4: Ondas de Radiación, Fotones y Ondas Sísmicas (`01:50` y `03:45`)
* **Fotones Térmicos y Rayos X (`01:50`)**:
  * Genera $36$ líneas radiales desde el epicentro ($\theta = 0^\circ$ a $180^\circ$).
  * Usa `stroke-dasharray="12 18"` y anima `strokeDashoffset` de $300$ a $0$ con `ease: "none"` mientras el color interpola de verde (`#39FF14`) a naranja (`#FF6B00`).
* **Ondas Sísmicas en Corte Lunar (`03:45`)**:
  * Dibuja arcos curvos (`<path d="M ... Q ...">`) desde el polo norte lunar hacia los flancos.
  * Usa el atributo `stroke-dasharray` para hacer crecer la línea azul cian (`#00E5FF`) desde el punto de impacto hacia el interior de la Luna, mientras la corteza vibra.

### Patrón 5: Zoom Exponencial Macro-a-Micro (`02:08 - 02:19` y `06:21 - 06:26`)
Para pasar de las huellas de astronauta al taladro, luego a los minerales ($1\text{ mm}$) y finalmente al hielo de agua ($0.1\text{ mm}$):
* Agrupa las escenas en contenedores concéntricos en el centro del viewport (`transform-origin: 50% 50%`).
* Escena A escala de `scale: 1` a `scale: 12` con `ease: "expo.in"`.
* A mitad del zoom, Escena B entra desde `scale: 0.1` y `autoAlpha: 0` hasta `scale: 1` y `autoAlpha: 1` con `ease: "expo.out"`, manteniendo una barra de escala en la esquina inferior derecha cuyo texto cambia dinámicamente (`1 mm` $\to$ `0.1 mm`).

### Patrón 6: Simulación de Partículas en el Vacío vs. Atmósfera (`02:45 - 03:13` y `04:35 - 05:08`)
* **En la Tierra (con atmósfera, `02:45`)**: Cientos de pequeños puntos azules/blancos representan moléculas de aire. A medida que el círculo amarillo crece, los puntos que están a una distancia $r < R_{\text{fuego}}$ son empujados hacia el borde exterior (`R_{\text{fuego}} + \Delta r`), formando un anillo denso comprimido (la onda de choque).
* **En la Luna (sin atmósfera, `04:35`)**: Eyección balística rectilínea. Los fragmentos salen disparados desde el cráter en líneas rectas perfectas con estelas grises y blancas (`<line>` con gradiente lineal de opacidad) sin curvarse ni frenarse, porque no hay resistencia del aire.

### Patrón 7: Sacudida de Cámara Determinista (*Lunar Quake Screen Shake*, `03:55`)
Como en HyperFrames no se puede usar `Math.random()` en un callback `onUpdate`, inyecta una función matemática amortiguada para sacudir cualquier contenedor `.scene-content`:

```javascript
function addDeterministicShake(tl, target, startTime, duration, maxIntensity = 25) {
  const steps = Math.floor(duration * 30); // 30 fps
  const stepDur = duration / steps;
  for (let i = 0; i < steps; i++) {
    const progress = i / steps;
    const decay = 1 - progress; // Amortiguación lineal o cuadrática
    const angle = i * 2.4; // Frecuencia áurea determinista
    const dx = Math.sin(angle * 3.1) * maxIntensity * decay;
    const dy = Math.cos(angle * 2.7) * maxIntensity * decay;
    const rot = Math.sin(angle * 1.9) * (maxIntensity * 0.08) * decay;
    tl.to(target, { x: dx, y: dy, rotation: rot, duration: stepDur, ease: "none" }, startTime + i * stepDur);
  }
  tl.to(target, { x: 0, y: 0, rotation: 0, duration: 0.05 }, startTime + duration);
}
```

---

## 6. Plantilla Base Maestra para HyperFrames (`index.html`)

Cuando el usuario te pida crear una animación con este estilo para HyperFrames, utiliza esta arquitectura exacta como punto de partida. Incluye las 3 escenas clave de las imágenes adjuntas (Sala de Guerra con Aves, Corte Transversal de la Ojiva de $100\text{ Mt}$ y Detonación Nuclear en el Horizonte Lunar):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Kurzgesagt Nuclear Moon - HyperFrames Composition</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <style>
    :root {
      --space-void: #06071B;
      --space-deep: #080442;
      --room-purple-dark: #251351;
      --room-purple-mid: #371E70;
      --room-purple-light: #4B2B8F;
      --moon-shadow: #050914;
      --moon-dark-crater: #3A4E68;
      --moon-mid-crater: #526A84;
      --moon-base: #99B2CC;
      --moon-highlight: #C2D6EB;
      --plasma-core: #FFFFFF;
      --plasma-yellow: #FFF200;
      --plasma-orange: #FF6B00;
      --ui-magenta: #DE216B;
      --font-main: 'Montserrat', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1920px;
      height: 1080px;
      overflow: hidden;
      background: #000;
      font-family: var(--font-main);
    }

    [data-composition-id="main"] {
      position: relative;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
    }

    .scene.clip {
      position: absolute;
      inset: 0;
      width: 1920px;
      height: 1080px;
      overflow: hidden;
    }

    /* Regla obligatoria de HyperFrames: fondo en hijo full-bleed */
    .scene-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .scene-content {
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    /* Cinta científica inferior (Lower Third) */
    .kurz-banner-wrap {
      position: absolute;
      bottom: 95px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      z-index: 10;
    }

    .kurz-banner {
      background: var(--ui-magenta);
      color: #FFFFFF;
      font-size: 46px;
      font-weight: 700;
      padding: 14px 48px;
      letter-spacing: 0.5px;
      white-space: nowrap;
      box-shadow: 0 12px 0 rgba(0, 0, 0, 0.25);
    }

    .kurz-footnote {
      color: #E5A4CB;
      font-size: 26px;
      font-weight: 600;
      margin-top: 12px;
      margin-right: 8px;
    }
  </style>
</head>
<body>

  <!-- COMPOSICIÓN RAÍZ DE HYPERFRAMES (12 segundos @ 30fps) -->
  <div
    data-composition-id="main"
    data-width="1920"
    data-height="1080"
    data-fps="30"
    data-duration="12"
  >

    <!-- ================================================================= -->
    <!-- ESCENA 1 (0s - 4s): SALA DE GUERRA Y PERSONAJES (Imagen 3)        -->
    <!-- ================================================================= -->
    <div class="scene clip" id="scene-warroom" data-start="0" data-duration="4" data-track-index="0">
      <div class="scene-bg" style="background: linear-gradient(90deg, #251351 0%, #371E70 75%, #F7B519 75%, #F7B519 100%);"></div>
      <div class="scene-content">
        <svg viewBox="0 0 1920 1080">
          <!-- Pilares arquitectónicos de fondo -->
          <rect x="0" y="0" width="1500" height="1080" fill="#2A1659" />
          <rect x="1150" y="0" width="380" height="1080" fill="#3B2175" />
          <rect x="1530" y="0" width="390" height="1080" fill="#F7B519" />
          <rect x="1500" y="0" width="40" height="1080" fill="#C97A1B" />

          <!-- Pantalla táctica espacial -->
          <g id="war-screen">
            <rect x="120" y="65" width="760" height="580" rx="12" fill="#0B102C" />
            <!-- Órbitas -->
            <ellipse cx="420" cy="355" rx="280" ry="175" fill="none" stroke="#313B72" stroke-width="5" />
            <ellipse cx="380" cy="355" rx="95" ry="55" fill="none" stroke="#5E4AE3" stroke-width="6" />
            <!-- Tierra minimalista -->
            <circle cx="380" cy="355" r="68" fill="#2B9EB3" />
            <path d="M340,315 Q375,305 390,335 Q415,355 385,385 Q350,390 335,355 Z" fill="#4CE0B3" />
            <rect x="330" y="330" width="55" height="14" rx="7" fill="#FFFFFF" opacity="0.85" />
            <rect x="375" y="365" width="60" height="12" rx="6" fill="#FFFFFF" opacity="0.85" />
            <!-- Luna en el mapa -->
            <circle id="map-moon" cx="615" cy="465" r="22" fill="#C2D6EB" />
          </g>

          <!-- Haz de luz volumétrico cenital -->
          <polygon points="720,0 1190,0 1190,820 390,820" fill="url(#lightBeamGrad)" opacity="0.22" />
          <defs>
            <linearGradient id="lightBeamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
              <stop offset="100%" stop-color="#A58BFF" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Mesa Circular Táctica 2.5D -->
          <g id="war-table" transform="translate(0, 20)">
            <rect x="785" y="850" width="68" height="230" fill="#9E3B42" />
            <ellipse cx="820" cy="790" rx="480" ry="155" fill="#B55945" />
            <ellipse cx="820" cy="765" rx="480" ry="155" fill="#FCE181" />
            <ellipse cx="820" cy="765" rx="340" ry="95" fill="#9E3B42" />
            <!-- Eje central de la mesa -->
            <rect x="775" y="610" width="85" height="210" rx="18" fill="#F7B519" />
            <rect x="795" y="555" width="45" height="75" rx="14" fill="#FCE181" />
          </g>

          <!-- Personaje 1: Ave Científica (Izquierda) -->
          <g id="bird-scientist" transform="translate(560, 680)">
            <!-- Patas -->
            <rect x="-65" y="95" width="50" height="24" rx="12" fill="#1B1447" />
            <rect x="25" y="95" width="50" height="24" rx="12" fill="#1B1447" />
            <!-- Cuerpo Cápsula -->
            <path d="M-85,20 C-85,-95 85,-95 85,20 C85,85 -85,85 -85,20 Z" fill="#6315D6" />
            <!-- Mechón de plumas -->
            <path d="M-20,-72 C-65,-110 -115,-85 -95,-55 C-75,-55 -55,-45 -40,-40 Z" fill="#6315D6" />
            <!-- Bata de laboratorio -->
            <path d="M-85,15 C-85,85 85,85 85,15 L85,45 C85,95 -85,95 -85,45 Z" fill="#9FA8DA" />
            <polygon points="-35,15 0,65 35,15" fill="#FFFFFF" />
            <polygon points="-8,25 0,58 8,25" fill="#DE216B" />
            <!-- Ojo expresivo -->
            <ellipse class="bird-eye" cx="-10" cy="-15" rx="22" ry="16" fill="#FFFFFF" />
            <!-- Pico redondeado -->
            <path d="M40,-20 C65,-55 95,-35 80,-5 C105,5 85,35 45,15 Z" fill="#FFAE00" />
          </g>

          <!-- Personaje 2: Ave General (Derecha) -->
          <g id="bird-general" transform="translate(1110, 560)">
            <!-- Cuerpo Uniforme -->
            <path d="M-75,30 C-75,-85 75,-85 75,30 C75,110 -75,110 -75,30 Z" fill="#0B132B" />
            <!-- Cabeza Azul -->
            <circle cx="-5" cy="-45" r="68" fill="#1E69DE" />
            <!-- Ojo -->
            <circle class="bird-eye" cx="-22" cy="-45" r="28" fill="#FFFFFF" />
            <!-- Pico Militar -->
            <polygon points="-68,-65 -125,-50 -68,-20" fill="#FFD000" stroke="#FFD000" stroke-width="10" stroke-linejoin="round" />
            <!-- Gorra de Plato -->
            <ellipse cx="0" cy="-108" rx="68" ry="22" fill="#1C2541" />
            <path d="M-55,-95 L55,-95 L45,-75 L-45,-75 Z" fill="#0B132B" />
            <circle cx="-12" cy="-108" r="10" fill="#FFD000" />
            <!-- Medallas Minimalistas -->
            <g transform="translate(-35, 35)">
              <rect x="0" y="0" width="12" height="8" rx="2" fill="#00F0FF" />
              <rect x="16" y="0" width="12" height="8" rx="2" fill="#DE216B" />
              <rect x="32" y="0" width="12" height="8" rx="2" fill="#FFF200" />
              <rect x="0" y="12" width="12" height="8" rx="2" fill="#39FF14" />
              <rect x="16" y="12" width="12" height="8" rx="2" fill="#FF6B00" />
              <rect x="32" y="12" width="12" height="8" rx="2" fill="#A58BFF" />
            </g>
          </g>
        </svg>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- ESCENA 2 (4s - 8s): CORTE TRANSVERSAL OJIVA 100 MT (Imagen 2)     -->
    <!-- ================================================================= -->
    <div class="scene clip" id="scene-warhead" data-start="4" data-duration="4" data-track-index="0">
      <div class="scene-bg" style="background: radial-gradient(circle at 50% 40%, #120A5C 0%, #080442 100%);"></div>
      <div class="scene-content">
        <svg viewBox="0 0 1920 1080">
          <!-- Campo de estrellas determinista (se puebla por JS) -->
          <g id="warhead-stars"></g>

          <!-- Grupo de la Ojiva en Sección (Cutaway) -->
          <g id="warhead-rig" transform="translate(960, 520) rotate(14)">
            <!-- Fuego del propulsor (Boiling Circles) -->
            <g id="thruster-plume" transform="translate(0, 230)">
              <circle class="plume-orb" cx="0" cy="40" r="65" fill="#FF6B00" />
              <circle class="plume-orb" cx="-20" cy="110" r="58" fill="#FF6B00" />
              <circle class="plume-orb" cx="15" cy="180" r="52" fill="#FF5100" />
              <circle class="plume-orb" cx="-10" cy="250" r="64" fill="#FF5100" />
              <circle class="plume-orb" cx="0" cy="20" r="45" fill="#FFF200" />
              <circle class="plume-orb" cx="-8" cy="70" r="38" fill="#FFF200" />
            </g>

            <!-- Base del propulsor -->
            <rect x="-95" y="185" width="190" height="48" rx="12" fill="#172A45" />
            <rect x="-35" y="185" width="90" height="48" fill="#2E4C75" />

            <!-- Cono exterior y corte transversal -->
            <path d="M0,-310 C32,-310 155,140 155,175 C155,205 -155,205 -155,175 C-155,140 -32,-310 0,-310 Z" fill="#2E297A" stroke="#5A4FCF" stroke-width="14" />
            <path d="M0,-285 C25,-285 132,135 132,165 C132,188 -132,188 -132,165 C-132,135 -25,-285 0,-285 Z" fill="#462296" />

            <!-- Etapas termonucleares cilíndricas internas -->
            <g id="thermo-stages">
              <!-- Etapa 1 -->
              <rect x="-42" y="-210" width="84" height="95" rx="22" fill="#235789" />
              <rect x="-10" y="-210" width="32" height="95" fill="#7AD7F0" />
              <!-- Etapa 2 -->
              <rect x="-46" y="-95" width="92" height="105" rx="22" fill="#235789" />
              <rect x="-12" y="-95" width="35" height="105" fill="#7AD7F0" />
              <!-- Etapa 3 (Primaria) -->
              <rect x="-46" y="30" width="92" height="115" rx="22" fill="#235789" />
              <rect x="-12" y="30" width="35" height="115" fill="#7AD7F0" />
              <!-- Cableado de ignición naranja -->
              <path id="ignition-wire" d="M-8,-215 L25,-190 L25,-105 L45,-75 L45,25 L55,65 L35,145" fill="none" stroke="#FF8800" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>
        </svg>

        <!-- UI Banner Inferior -->
        <div class="kurz-banner-wrap" id="warhead-banner">
          <div class="kurz-banner">Cabeza termonuclear de 100 Mt*</div>
          <div class="kurz-footnote">*equivalencia en TNT</div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- ESCENA 3 (8s - 12s): DETONACIÓN EN EL HORIZONTE LUNAR (Imagen 1)  -->
    <!-- ================================================================= -->
    <div class="scene clip" id="scene-detonation" data-start="8" data-duration="4" data-track-index="0">
      <div class="scene-bg" style="background: linear-gradient(180deg, #050616 0%, #0D1333 100%);"></div>
      <div class="scene-content" id="detonation-shake-wrapper">
        <svg viewBox="0 0 1920 1080">
          <!-- Campo de estrellas de fondo -->
          <g id="moon-stars"></g>

          <!-- GRUPO EXPLOSIÓN EN EL HORIZONTE (Detrás del limbo lunar) -->
          <g id="horizon-explosion" transform="translate(1030, 620)">
            <!-- Resplandor exterior ámbar -->
            <ellipse id="exp-glow" cx="0" cy="0" rx="520" ry="260" fill="url(#expGlowGrad)" />
            <!-- Rayos cónicos amarillos -->
            <g id="exp-rays">
              <polygon points="0,0 -340,-180 -290,-230" fill="#FFF200" opacity="0.85" />
              <polygon points="0,0 -180,-290 -110,-320" fill="#FFF200" opacity="0.9" />
              <polygon points="0,0 40,-330 120,-310" fill="#FFF200" opacity="0.9" />
              <polygon points="0,0 240,-260 310,-190" fill="#FFF200" opacity="0.85" />
            </g>
            <!-- Nubes circulares de plasma -->
            <g id="exp-clouds">
              <circle cx="-120" cy="-40" r="85" fill="#FF9900" />
              <circle cx="130" cy="-35" r="90" fill="#FF9900" />
              <circle cx="-60" cy="-95" r="95" fill="#FFCC00" />
              <circle cx="65" cy="-90" r="98" fill="#FFCC00" />
              <circle cx="0" cy="-50" r="110" fill="#FFF200" />
              <circle cx="0" cy="-20" r="75" fill="#FFFFFF" />
            </g>
          </g>

          <defs>
            <radialGradient id="expGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFF200" stop-opacity="1" />
              <stop offset="45%" stop-color="#FF7700" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#FF3300" stop-opacity="0" />
            </radialGradient>
            <clipPath id="moonSurfaceClip">
              <ellipse cx="1050" cy="1420" rx="1450" ry="820" />
            </clipPath>
          </defs>

          <!-- SUPERFICIE LUNAR CURVA Y CRÁTERES -->
          <g id="moon-body">
            <!-- Base iluminada de la Luna -->
            <ellipse cx="1050" cy="1420" rx="1450" ry="820" fill="#99B2CC" stroke="#EBF5FF" stroke-width="6" />

            <!-- Cráteres en zona iluminada -->
            <g clip-path="url(#moonSurfaceClip)">
              <!-- Cráter Derecho Grande con líneas de eyección -->
              <g transform="translate(1390, 960)">
                <line x1="-140" y1="-60" x2="-190" y2="-95" stroke="#D6E6F5" stroke-width="10" stroke-linecap="round" />
                <line x1="-80" y1="-90" x2="-105" y2="-135" stroke="#D6E6F5" stroke-width="10" stroke-linecap="round" />
                <line x1="120" y1="60" x2="185" y2="95" stroke="#D6E6F5" stroke-width="10" stroke-linecap="round" />
                <ellipse cx="0" cy="0" rx="145" ry="78" fill="#D6E6F5" />
                <ellipse cx="0" cy="5" rx="125" ry="64" fill="#647D99" />
                <ellipse cx="-10" cy="-10" rx="32" ry="16" fill="#3A4E68" />
                <ellipse cx="45" cy="15" rx="26" ry="14" fill="#3A4E68" />
              </g>

              <!-- Cráteres medianos -->
              <g transform="translate(1050, 775)">
                <ellipse cx="0" cy="0" rx="72" ry="32" fill="#D6E6F5" />
                <ellipse cx="0" cy="4" rx="58" ry="24" fill="#647D99" />
              </g>
              <g transform="translate(1340, 785)">
                <ellipse cx="0" cy="0" rx="68" ry="28" fill="#D6E6F5" />
                <ellipse cx="0" cy="3" rx="54" ry="21" fill="#647D99" />
              </g>

              <!-- Terminador Lunar (Sombra Negra Azulada Izquierda) -->
              <ellipse cx="260" cy="1260" rx="820" ry="560" fill="#050914" />

              <!-- Cráter Principal en la Frontera de Sombra (Imagen 1) -->
              <g transform="translate(765, 895)">
                <!-- Rayos de eyección blancos sobre la roca -->
                <line x1="-85" y1="-85" x2="-115" y2="-125" stroke="#D6E6F5" stroke-width="9" stroke-linecap="round" />
                <line x1="-35" y1="-95" x2="-45" y2="-145" stroke="#D6E6F5" stroke-width="9" stroke-linecap="round" />
                <line x1="35" y1="-95" x2="55" y2="-135" stroke="#D6E6F5" stroke-width="9" stroke-linecap="round" />
                <!-- Anillo exterior en alto contraste -->
                <ellipse cx="0" cy="0" rx="145" ry="76" fill="#99B2CC" stroke="#050914" stroke-width="10" />
                <ellipse cx="0" cy="4" rx="115" ry="58" fill="#182334" />
                <ellipse cx="-15" cy="-12" rx="95" ry="38" fill="#647D99" />
                <circle cx="30" cy="12" r="22" fill="#050914" stroke="#99B2CC" stroke-width="5" />
              </g>
            </g>
          </g>

          <!-- DESTELLO ANAMÓRFICO Y LENS FLARE (En primer plano sobre el horizonte) -->
          <g id="anamorphic-flare" transform="translate(1030, 600)">
            <!-- Espiga vertical gigante -->
            <polygon points="-6,0 0,-420 6,0 0,90" fill="#FFFFFF" />
            <!-- Espiga horizontal rasante -->
            <polygon points="0,-6 -450,0 0,6 450,0" fill="#FFFFFF" />
            <!-- Polígonos de Lens Flare en diagonal -->
            <circle cx="-190" cy="-140" r="85" fill="#A58BFF" opacity="0.14" />
            <circle cx="-330" cy="-290" r="185" fill="#7AD7F0" opacity="0.09" />
          </g>

          <!-- CAPA DE FLASH NUCLEAR (Impact Frame Blanco) -->
          <rect id="nuclear-flash-overlay" x="0" y="0" width="1920" height="1080" fill="#FFFFFF" opacity="0" pointer-events="none" />
        </svg>
      </div>
    </div>

  </div>

  <script>
    (function () {
      // 1. Generador Pseudoaleatorio Determinista (Mulberry32) - Obligatorio en HyperFrames
      function mulberry32(seed) {
        return function () {
          let t = (seed += 0x6d2b79f5);
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      const rand = mulberry32(20261026);

      // Poblar campos de estrellas de forma 100% determinista
      function populateStars(groupId, count) {
        const g = document.getElementById(groupId);
        if (!g) return;
        const colors = ["#FFFFFF", "#00F0FF", "#7B52D3", "#FFE600"];
        for (let i = 0; i < count; i++) {
          const cx = (rand() * 1920).toFixed(1);
          const cy = (rand() * 750).toFixed(1);
          const r = (1.2 + rand() * 3.2).toFixed(1);
          const color = colors[Math.floor(rand() * colors.length)];
          const op = (0.25 + rand() * 0.75).toFixed(2);
          const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          c.setAttribute("cx", cx);
          c.setAttribute("cy", cy);
          c.setAttribute("r", r);
          c.setAttribute("fill", color);
          c.setAttribute("opacity", op);
          g.appendChild(c);
        }
      }

      populateStars("warhead-stars", 90);
      populateStars("moon-stars", 120);

      // 2. Creación del Timeline Único Pausado para HyperFrames
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });

      // =========================================================================
      // ANIMACIÓN ESCENA 1: SALA DE GUERRA (0.0s - 4.0s)
      // =========================================================================
      tl.from("#war-table", { y: 120, opacity: 0, duration: 0.6, ease: "back.out(1.4)" }, 0.15);
      tl.from("#bird-scientist", { scale: 0, transformOrigin: "50% 100%", duration: 0.55, ease: "back.out(1.7)" }, 0.3);
      tl.from("#bird-general", { scale: 0, transformOrigin: "50% 100%", duration: 0.55, ease: "back.out(1.7)" }, 0.45);

      // Movimiento continuo vivo: Balanceo de personajes y órbita lunar
      tl.to("#bird-scientist", { y: "+=12", rotation: -3, duration: 0.8, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.5);
      tl.to("#bird-general", { y: "+=8", rotation: 2, duration: 0.9, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.6);
      tl.fromTo("#map-moon", { attr: { cx: 560, cy: 485 } }, { attr: { cx: 650, cy: 420 }, duration: 3.5, ease: "sine.inOut" }, 0.2);

      // Paneo sutil de cámara hacia la derecha anticipando la siguiente sala
      tl.to("#scene-warroom .scene-content", { x: -110, duration: 3.8, ease: "power1.inOut" }, 0.1);

      // =========================================================================
      // ANIMACIÓN ESCENA 2: CORTE TRANSVERSAL OJIVA 100 MT (4.0s - 8.0s)
      // =========================================================================
      tl.from("#warhead-rig", { y: 350, x: -120, scale: 0.7, duration: 0.75, ease: "power3.out" }, 4.15);
      tl.from("#warhead-banner", { y: 90, opacity: 0, duration: 0.5, ease: "back.out(1.5)" }, 4.4);

      // Efecto de ebullición (Boiling Fire) en el propulsor
      const plumeOrbs = document.querySelectorAll(".plume-orb");
      plumeOrbs.forEach((orb, idx) => {
        tl.fromTo(
          orb,
          { scale: 0.8, transformOrigin: "50% 50%" },
          { scale: 1.28, y: "+=18", duration: 0.22 + (idx % 3) * 0.06, repeat: 12, yoyo: true, ease: "sine.inOut" },
          4.1 + idx * 0.05
        );
      });

      // Flujo de energía por el cable de ignición
      tl.fromTo("#ignition-wire", { strokeDasharray: "20 14", strokeDashoffset: 180 }, { strokeDashoffset: 0, duration: 3.6, ease: "none" }, 4.2);

      // Vibración de vuelo supersónico de la ojiva
      tl.to("#warhead-rig", { x: "+=6", y: "-=8", duration: 0.12, repeat: 28, yoyo: true, ease: "sine.inOut" }, 4.3);

      // =========================================================================
      // ANIMACIÓN ESCENA 3: DETONACIÓN EN EL HORIZONTE LUNAR (8.0s - 12.0s)
      // =========================================================================
      // Flash Frame inicial de impacto nuclear (8.1s - 8.3s)
      tl.fromTo("#nuclear-flash-overlay", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "power2.out" }, 8.05);

      // Expansión violenta de la bola de fuego y rayos
      tl.fromTo(
        "#horizon-explosion",
        { scale: 0.05, transformOrigin: "50% 100%" },
        { scale: 1.15, duration: 2.8, ease: "expo.out" },
        8.05
      );

      // Destello anamórfico (crecimiento afilado vertical)
      tl.fromTo(
        "#anamorphic-flare",
        { scaleY: 0.01, scaleX: 0.1, opacity: 0, transformOrigin: "50% 60%" },
        { scaleY: 1.25, scaleX: 1.1, opacity: 1, duration: 0.45, ease: "expo.out" },
        8.08
      );
      tl.to("#anamorphic-flare", { scaleY: 0.85, duration: 2.5, ease: "sine.inOut" }, 8.6);

      // Sacudida de cámara determinista (Lunamoto al momento de la explosión)
      const shakeTarget = "#detonation-shake-wrapper";
      const shakeStart = 8.08;
      const shakeDur = 1.4;
      const steps = 42;
      for (let i = 0; i < steps; i++) {
        const decay = 1 - i / steps;
        const dx = Math.sin(i * 4.3) * 18 * decay;
        const dy = Math.cos(i * 3.7) * 14 * decay;
        tl.to(shakeTarget, { x: dx, y: dy, duration: shakeDur / steps, ease: "none" }, shakeStart + (i * shakeDur) / steps);
      }
      tl.to(shakeTarget, { x: 0, y: 0, duration: 0.05 }, shakeStart + shakeDur);

      // Registro obligatorio del timeline en HyperFrames
      window.__timelines["main"] = tl;
    })();
  </script>
</body>
</html>
```

---

## 7. Checklist de Auditoría para el Modelo de IA Antes de Entregar

Antes de finalizar cualquier generación de código para HyperFrames con este estilo, el agente debe verificar:
1. ¿Existe un `<div class="scene-bg" style="position:absolute; inset:0;">` dentro de cada escena para evitar que el renderizador elimine el fondo?
2. ¿Se eliminó cualquier llamada a `Math.random()` y se reemplazó por el generador con semilla `mulberry32`?
3. ¿Todas las figuras SVG carecen de bordes negros (`#000000`) y usan en su lugar sombras superpuestas y *rim lights* de alto contraste?
4. ¿Todos los trazos lineales (rayos, ondas sísmicas, eyecciones de cráteres) tienen `stroke-linecap="round"`?
5. ¿El timeline de GSAP se inicializó con `{ paused: true }` y se registró en `window.__timelines["main"]`?