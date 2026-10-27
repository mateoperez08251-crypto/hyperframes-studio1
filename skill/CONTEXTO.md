# CONTEXTO DEL PROYECTO — HyperFrames Studio

> Léelo completo antes de hacer nada. Resume la conversación anterior
> (ID: `52014600-92a7-4502-8b42-bf655d08d1f6`, 24-oct-2026).

## 1. Quién es el usuario y cómo trabajar con él
- Habla español, escribe rápido y con faltas: interpreta la intención y corrige la ortografía del texto que vaya en pantalla.
- Quiere que hagas las cosas, no que preguntes demasiado: instala lo necesario y continúa solo.
- Ya activó "Always Proceed": ejecuta los comandos sin pedir permiso.
- Respuestas cortas y en español.

## 2. Objetivo general
Crear **videos virales solo con código** (sin software de animación) para canales sin rostro: stickman, explainers, "What If", tipografía cinética, estilo Apple Keynote, Vox/Kurzgesagt, SaaS, 3Blue1Brown, pixel art, 3D y fluidos. Formatos 16:9 (YouTube) y 9:16 (Shorts/Reels).

Sus guías están en esta misma carpeta (léelas si el pedido toca ese tema):
| Archivo | Contenido |
|---|---|
| `1_sistema_de_animaci_n_2d_y_stickman_viral_m_todo_randomai.md` | Stickman 2D: presets de personaje/escena/guion, rig en Canvas, mega-prompt |
| `2_cat_logo_de_los_10_estilos_visuales_con_opus_5_5_an_lisis_sincodigo.md` | Los 10 estilos visuales y su técnica |
| `3_plantillas_de_prompts_listos_para_copiar_por_estilo.md` | Prompts maestros (Showreel, Apple, Vox, tipografía cinética) |
| `4_flujo_t_cnico_de_producci_n_y_renderizado_remotion_canvas_y_ffmpeg.md` | Qué motor elegir y el ciclo de control: generar → revisar capturas → corregir → generar el MP4 |

**Adaptación a HyperFrames:** sus guías hablan de `renderFrame(t)`, Playwright+FFmpeg y MediaRecorder. En HyperFrames todo eso lo reemplazan una línea de tiempo GSAP en pausa + `npx hyperframes render`. No uses Web Audio sintetizado: los sonidos van como archivos `<audio>`.

## 3. Entorno instalado
- **Carpeta base:** `D:\hyperframes-studio\`
- Node v24.20, npm 11.19, FFmpeg 9.0.2: ya instalados.
- **Skills de HyperFrames** en `D:\hyperframes-studio\.agents\skills\`: `hyperframes` (léela primero), `hyperframes-cli`, `hyperframes-registry`, `media-use`, `slideshow`, `figma`, `remotion-to-hyperframes`.
- CLI fijado en el proyecto: `npx --yes hyperframes@0.8.193 <comando>`
- Proyecto nuevo: `npx hyperframes init <nombre>` dentro de `D:\hyperframes-studio\`

## 4. Video ya terminado: `claude-bestia/`
**Archivo final:** `D:\hyperframes-studio\claude-bestia\claude-bestia.mp4` (1920×1080, 30 fps, 10 s, con audio). **Al usuario le gustó.**

Texto: "CLAUDE" → "ES UNA BESTIA" → "ESTO SE CREÓ SOLO CON CÓDIGO" → "¡NO JODAS, MEN!"
(el usuario escribió "besita"; se interpretó como "bestia".)

Estilo: tipografía cinética. Cada letra o palabra entra **chocando contra la anterior** (que rebota) y la primera palabra de cada frase **saca de cuadro a la frase previa**. Sombra 3D dura + sombra suave, sacudida de cámara, flash y esquirlas en los golpes grandes, y sonidos sincronizados a cada impacto.

- Paleta: fondo `#0e0b0a` con resplandor cálido, texto crema `#f4ede4`, acento coral Claude `#d97757`
- Fuente: Archivo Black (incluida en HyperFrames)
- `compositions/kinetic.html`: toda la animación en una sola escena, porque las frases chocan entre sí. Las funciones `slam()`, `recoil()`, `knock()`, `shake()`, `flash()` y `burst()` son reutilizables para otros videos de este estilo.
- `index.html`: escena raíz + 28 `<audio>` de efectos. Cada sonido se coloca para que su pico (medido con `npx hyperframes audio <archivo> --json`) caiga 1 frame después del golpe visual.
- `assets/sfx/`: punch-snare, pipe-hit, body-fall, swosh, trailer-boom (Openverse) + impact-bass-1/2, glitch-1, whoosh, whoosh-short (librería incluida). Créditos CC BY en `assets/sfx/CREDITS.md`.

## 5. Lecciones aprendidas (IMPORTANTE)
1. **NO uses `data-motion-blur="on"`** en esta máquina (GPU Intel HD 4600): hace desaparecer el texto en el render y en las capturas. Usa `filter: blur()` en las entradas.
2. **Nunca pongas varias animaciones GSAP sobre la misma propiedad que se solapen en el tiempo** (`check` avisa con `gsap_tween_tail`). Para la sacudida de cámara y los rebotes, calcula una función del tiempo que sume todos los impactos y conviértela en tramos de 1/60 s que no se solapen (función `bake()` en `kinetic.html`).
3. Capas decorativas a pantalla completa (viñeta, flash): `data-layout-ignore` y/o `data-layout-allow-occlusion`, y la viñeta **debajo** del texto, o `check` da `text_occluded`.
4. En los contenedores de frases que chocan a propósito usa `data-layout-allow-overlap`.
5. El frame 0 no debe estar vacío (es la miniatura): poner un contorno fantasma del título desde el inicio.
6. En la misma pista de audio no deben solaparse clips (`duplicate_audio_track`): recorta duraciones o usa otra `data-track-index`.
7. Sonidos: `npx hyperframes media-use resolve --type sfx --intent "..." --project .` (busca en Openverse y los guarda en `.media/`; luego cópialos a `assets/sfx/`).

## 6. Flujo de trabajo estándar
1. Leer `.agents/skills/hyperframes/SKILL.md` y la referencia del tipo de video.
2. Escribir las composiciones.
3. `npx hyperframes lint` → `npx hyperframes check --json` y corregir todos los errores.
4. `npx hyperframes snapshot --at t1,t2,...` y **mirar el contact-sheet** (captura antes y justo después de cada choque o transición).
5. `npx hyperframes render --quality delivery --output <nombre>.mp4`
6. Verificar con `ffprobe` (duración) y `npx hyperframes audio <video>.mp4 --json` (volumen ~−14 LUFS, sin distorsión, golpes donde caen los visuales).

## 7. Próximos pasos ofrecidos (pendientes de que el usuario elija)
- Versión vertical 9:16 de `claude-bestia` para Reels y Shorts.
- Cambios de colores, velocidad o texto.
- Siguiente estilo de su catálogo (stickman, Apple Keynote, Vox...).
- Una versión en Remotion si la quiere (por ahora todo se hizo en HyperFrames).
