# Guía Técnica: De Código de Opus 5.5 a Video MP4 de Alta Calidad

En los videos analizados se destaca una diferencia clave: **Claude Opus 5.5 no es un modelo difusor de píxeles (como Sora o Runway), sino un ingeniero de sistemas visuales**. Para aprovecharlo al 100% y superar sus limitaciones, aquí tienes la guía de herramientas y el flujo de trabajo profesional.

---

## 1. ¿Qué motor elegir según el estilo de video?

| Estilo de Video | Mejor Motor / Stack | Por qué elegirlo |
| :--- | :--- | :--- |
| **Stickman 2D / Cuentos Virales** | `HTML5 Canvas + Vanilla JS` | Cero dependencias, se previsualiza al instante en un solo archivo `.html` y permite rigging matemático rápido. |
| **Videos SaaS / Explainers Largos** | `Remotion (React)` | Permite dividir escenas en componentes reutilizables, agregar subtítulos automáticos y exportar a MP4 nativo por consola. |
| **Motion Graphics Rápidos / UI** | `HyperFrames / GSAP + SVG` | Curvas de animación preconstruidas de nivel profesional y manipulación perfecta de trazos vectoriales. |
| **Ciencia / Matemáticas / Algoritmos** | `Manim (Python)` o `Canvas` | Precisión científica en fórmulas, grafos, árboles binarios y transformaciones matriciales. |
| **3D / Shaders / Simulaciones** | `Three.js / WebGL / Blender Python` | Iluminación en tiempo real, cámaras con profundidad de campo y partículas aceleradas por GPU. |

---

## 2. Flujo de Trabajo con Claude Code + Remotion / HyperFrames
Si usas **Claude Code** desde tu terminal para automatizar videos completos como hacen los creadores avanzados:

### A. Instalar los "Agent Skills" oficiales
Tanto **Remotion** como **HyperFrames** mantienen habilidades específicas para que Claude Opus 5.5 sepa exactamente cómo estructurar y renderizar proyectos de video sin errores:

```bash
# Para flujos basados en React (Remotion)
npx skills add remotion-dev/skills

# Para flujos basados en HTML/GSAP (HyperFrames)
npx skills add heygen-com/hyperframes
```

### B. El Ciclo de Control de Calidad (QA Loop)
Como menciona *Jorge SinCodigo*, uno de los errores más comunes al pedirle un video a la IA en un solo intento (*one-shot*) es que un texto quede cortado o dos elementos se pisen en el segundo 8.
Para solucionarlo, aplica el ciclo **Generar → Inspeccionar → Corregir → Renderizar**:

1. **Pide la función determinista:** Obliga a Claude a que todo dependa del parámetro `frame` o `time`.
2. **Pide capturas de control (Keyframes):** Antes de renderizar el video completo, dile a Claude:
   > *"Escribe un script rápido que tome capturas PNG en los segundos 1s, 4s, 8s, 12s y 15s, inspeciónalas visualmente para verificar que ningún texto se superponga ni salga del margen seguro, corrige el código si ves fallos y luego genera el render final."*

---

## 3. Script Universal para Convertir cualquier HTML de Opus 5.5 a MP4 (60 FPS Perfectos)
Si creaste tu animación en un único archivo `index.html` y al grabarlo con la pantalla notas tirones (*lag*), usa este método determinista con **Node.js + Playwright + FFmpeg**:

### 1. Prepara tu `index.html`
Pídele a Claude que exponga una función global en tu animación:
```javascript
window.renderAtTime = function(timeInSeconds) {
  // Actualiza y dibuja el canvas exactamente en ese instante
  drawScene(timeInSeconds);
};
```

### 2. Script de captura (`render.js`)
```javascript
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');

(async () => {
  const fps = 60;
  const duration = 15; // Duración en segundos
  const totalFrames = fps * duration;

  if (!fs.existsSync('./frames')) fs.mkdirSync('./frames');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`file://${__dirname}/index.html`);

  console.log('Renderizando frames...');
  for (let i = 0; i < totalFrames; i++) {
    const t = i / fps;
    await page.evaluate((time) => window.renderAtTime(time), t);
    const frameNum = String(i).padStart(5, '0');
    await page.screenshot({ path: `./frames/frame_${frameNum}.png` });
  }

  await browser.close();
  console.log('Uniendo video en MP4 con FFmpeg...');
  execSync(`ffmpeg -y -framerate ${fps} -i ./frames/frame_%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 video_final.mp4`);
  console.log('¡Listo! Archivo guardado como video_final.mp4');
})();
```

---

## 4. Limitaciones Reales a Tener en Cuenta
* **Dónde brilla Opus 5.5:** Diseño gráfico en movimiento, personajes 2D estilizados (Stickman/Vectorial), interfaces, mapas, datos, tipografía cinética, geometría 3D procedural y explicaciones visuales.
* **Dónde NO usarlo:** Rostros humanos fotorrealistas hablando en primer plano o actuación orgánica hipercompleja (para eso es mejor combinar activos de imagen/video externos e insertarlos dentro de las composiciones de código de Opus 5.5).