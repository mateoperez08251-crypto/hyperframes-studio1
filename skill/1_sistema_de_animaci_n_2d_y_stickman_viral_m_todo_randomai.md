# Sistema de Animación 2D y Stickman Viral con Claude Opus 5.5
*(Basado en el flujo de trabajo de RandomAI - `PgA4C6J3PZ4`)*

Este documento detalla cómo construir desde cero el sistema modular para crear videos animados en 2D (estilo *Stickman*, *Explainers*, historias *"What If"* y canales sin rostro o *Faceless*) utilizando **Claude Opus 5.5** y renderizado mediante código (**HTML5 Canvas / SVG / JavaScript**), sin necesidad de software tradicional de animación.

---

## 1. Cómo funciona el método (La Lógica)
A diferencia de los generadores de video por IA tradicionales (que alucinan píxeles y pierden la consistencia del personaje), Claude Opus 5.5 escribe un **motor de animación determinista en JavaScript/Canvas**. 
Para que funcione de forma consistente y escalable, el sistema divide el proyecto en **3 Presets fundamentales**:
1. **`character_preset.md`**: Define el rig del personaje (proporciones, articulaciones, expresiones faciales y ciclos de caminar/hablar).
2. **`scene_preset.md`**: Define la cámara virtual (paneos, zooms, parallax), iluminación 2D, fondos y físicas simples.
3. **`story_script.md`**: Sincroniza el guion, las marcas de tiempo (timestamps) de la voz en off y las acciones de cada escena.

---

## 2. Estructura de Carpetas del Proyecto
Para trabajar con **Claude Code** o **Claude Web (Artifacts)**, organiza tu carpeta local así:

```text
/mi-video-animado
│── /assets
│   ├── voiceover.mp3          # Audio generado (ej. ElevenLabs)
│   └── sfx/                   # Efectos de sonido (whoosh, pop, ding)
│── /presets
│   ├── character_preset.md    # Reglas del personaje y rig 2D
│   ├── scene_style_preset.md  # Reglas visuales y de cámara
│   └── story_structure.md     # Plantilla de guion y escenas
│── index.html                 # Archivo autogenerado por Opus 5.5 (Reproductor/Render)
```

---

## 3. Instrucciones Paso a Paso para Crearlo

### Paso 1: Crear el Preset de Personaje (`character_preset.md`)
Copia o adapta este bloque para darle a Claude las reglas matemáticas de tu personaje 2D:

```markdown
# Directrices de Personaje 2D (Rigging Procedural en Canvas)
- **Estilo Visual:** Stickman expresivo / Cartoon minimalista 2D (estilo Kurzgesagt / Minutephysics / Dan Koe).
- **Trazo y Color:** Líneas limpias con `lineCap = "round"` y `lineJoin = "round"`, grosor de línea de `6px` en color `#111827` o blanco `#FFFFFF` sobre fondo oscuro.
- **Sistema de Esqueleto (Cinemática Directa/Inversa):**
  - Cabeza: Círculo perfecto con soporte para rotación (`headTilt`) y expresiones faciales parametrizadas (`neutral`, `happy`, `shocked`, `angry`, `thinking`, `talking`).
  - Lip-Sync (Sincronización labial): La boca debe alternar entre vocales abiertas y cerradas según una función sinusoidal modulada por el volumen del audio o el estado `isTalking(t)`.
  - Torso y Extremidades: Brazos con codos articulados (`shoulderAngle`, `elbowAngle`) y piernas con rodillas articuladas (`hipAngle`, `kneeAngle`).
- **Animaciones Base Requeridas (Funciones reutilizables):**
  - `idle(t)`: Respiración suave (escalado vertical sutil del torso cada 2 segundos y parpadeo cada 3.5 segundos).
  - `walkCycle(t, speed)`: Movimiento sinusoidal opuesto entre brazos y piernas con rebote vertical de cadera.
  - `gesture(t, type)`: Gestos de explicación (`pointUp`, `shrug`, `facepalm`, `ideaBulb`, `typing`).
```

### Paso 2: Crear el Estilo de Escena y Cámara (`scene_style_preset.md`)
Este preset evita que la animación se vea estática o aburrida:

```markdown
# Directrices de Escena, Cámara y Dirección Visual
- **Resolución y Framerate:** Lienzo `1920x1080` (16:9 para YouTube) o `1080x1920` (9:16 para Shorts/Reels) a `60 FPS` deterministas basados en `t` (tiempo en segundos).
- **Cámara Virtual 2D:**
  - Todas las escenas deben renderizarse dentro de un contenedor afectado por `camera = { x, y, zoom, shake }`.
  - Usa interpolación suave (`easeInOutCubic` o físicas de resorte `spring()`) para mover la cámara entre el personaje y los objetos explicativos.
- **Elementos Flotantes (UI & Props):**
  - Cuando el narrador mencione un concepto clave, haz aparecer iconos vectoriales dibujados por código, gráficos o texto cinético con efecto *pop-in* (escala de `0` a `1.1` y luego a `1.0`).
- **Fondo:**
  - Cuadrícula sutil en movimiento (blueprint o dot-grid), viñeta suave en los bordes y partículas ambientales muy discretas para dar profundidad.
```

---

## 4. El Mega-Prompt para Generar el Video en Claude Opus 5.5
Una vez tengas tu idea o guion, pásale este prompt a **Claude Opus 5.5** (con el modo *Extended Thinking / Max Effort* activado):

> **PROMPT COPIABLE:**
> "Actúa como un director de animación 2D senior y desarrollador creativo experto en HTML5 Canvas y JavaScript. Quiero crear un video animado 2D viral estilo Stickman/Explainer de [DURACIÓN, ej. 45 segundos] sobre [TEMA DEL VIDEO].
>
> **Requisitos del Sistema:**
> 1. Crea un único archivo `index.html` autocontenido usando JavaScript puro y Canvas 2D a 60fps.
> 2. Toda la animación debe ser **100% determinista**, controlada por una función maestra `renderFrame(t)` donde `t` es el tiempo exacto en segundos. No uses `setInterval` descontrolados ni aleatoriedad sin semilla (`seeded random`).
> 3. Construye una clase `StickCharacter` con articulaciones completas (cabeza, torso, hombros, codos, manos, caderas, rodillas, pies), parpadeo automático, expresiones faciales dinámicas (`happy`, `shocked`, `confused`, `determined`, `talking`) y gestos fluidos.
> 4. Implementa una `VirtualCamera` con soporte para zoom dinámico, paneo suave (`easeOutExpo`) y ligero `cameraShake` en momentos de impacto.
> 5. **Estructura de Escenas (Storyboard):**
>    - **0s - 5s (El Gancho):** [Describe el gancho visual, ej. El personaje mira su cuenta bancaria en $0 y entra en pánico con zoom rápido].
>    - **5s - 15s (El Problema):** [Describe la escena 2, ej. La cámara hace zoom out mostrando una rueda de hámster gigante mientras aparecen gráficos de tiempo].
>    - **15s - 30s (La Explicación/Mecanismo):** [Describe diagramas animados, flechas que se dibujan solas y al personaje interactuando con ellos].
>    - **30s - 45s (La Conclusión):** [Describe el cierre épico con texto cinético en pantalla].
> 6. Incluye en la parte inferior una barra de reproducción interactiva (Play/Pause, línea de tiempo arrastrable, botón para exportar/grabar en `.webm`/`.mp4` usando `MediaRecorder` y subtítulos dinámicos sincronizados).
>
> Antes de escribir el código final, diseña la tabla de tiempos exacta segundo a segundo y asegúrate de que ningún texto o elemento se superponga."

---

## 5. Cómo Exportar el Código a Video Final (MP4)
Tienes dos formas de convertir el archivo HTML que te entrega Claude en un archivo de video listo para subir:
1. **Grabador integrado (`MediaRecorder API`):** Pídele a Claude que agregue un botón `"Exportar Video (60fps)"` que capture el `<canvas>` con `canvas.captureStream(60)` y descargue el archivo directamente desde el navegador.
2. **Renderizado perfecto cuadro por cuadro (Playwright + FFmpeg):** Si quieres calidad de estudio sin caídas de frames, pídele a Claude Code que ejecute un script con Playwright que avance la variable `window.seekTo(frame / 60)`, tome captura de cada frame y los una con `FFmpeg`.