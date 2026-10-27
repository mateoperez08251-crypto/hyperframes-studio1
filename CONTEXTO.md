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
8. **Disco C: casi lleno**: en los `.bat` de render pon `set TEMP=D:\hf-temp` y `set TMP=D:\hf-temp`.
9. **Renders largos**: lánzalos desacoplados (`Invoke-CimMethod Win32_Process Create` con `cmd /c render-run.bat`); si se lanzan con `Start-Process` desde la terminal del agente, mueren al cerrarse esa terminal.

## 4b. Video terminado: `vitral/` — Irena Sendler (estilo vitral)
`D:\hyperframes-studio\vitral\irena-vitral.mp4` (1080×1920, 121,6 s), más `-fine` y `-redes`. **Al usuario le encantó** (25-oct-2026). Relanzar con `render-run.bat`.

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

## 8. Colab y ChatGPT — 27-oct-2026

- Colab conectado desde Codex por `ssh colab`; ver `colab/ESTADO_COLAB.md`.
- GPU RTX PRO 6000 Blackwell de 96 GB, 48 CPU y unos 177 GB de RAM.
- SSH de esta sesión escucha en `127.0.0.1:2222`; el túnel a localhost:22 daba 502.
- Proyecto nuevo `gpt-bestia/`: 20 s, 1920×1080, 30 fps. Mismas cuatro frases
  que claude-bestia, con CHATGPT, menta/verde/blanco, logo oficial, mensajes,
  tecla, bombilla y ventana de código. Render remoto comunicado: 9,4 s.
- Usuario señaló falta de sincronización: se normalizaron efectos individuales
  (las teclas estaban unos 27 dB bajo los pops), se midieron picos después del
  procesado y se alinearon al impacto visual +1 frame. Tabla en audio-sync.json.
- Mezcla final medida: −14,37 LUFS, −1,80 dBTP; 600 frames y 20,000 s.
- Archivo: `gpt-bestia/chatgpt-bestia-20s.mp4`. Ver REVIEW.md y verification.json.
- Voz recibida el 27-oct-2026: 18,181 s. Se incorporó a velocidad natural
  desde 0,35 s y se remontaron los seis actos para seguir el diálogo real,
  incluida la repetición «Sí. Solo. Con. Código» y «Esto es ChatGPT».
- Nueva entrega: `gpt-bestia/chatgpt-bestia-20s-con-voz.mp4`, 20,000 s,
  1920×1080, 30 fps, mezcla −14,02 LUFS y −2,00 dBTP. Se conserva la base sin voz.
- Transcripción con Whisper small es en GPU y tiempos en `audio/voice-timing.json`.
  Correlación de voz completa contra mezcla final: inicio medido 0,35 s,
  diferencia 0 ms y correlación 0,972. Esto verifica la posición del audio;
  los tiempos fonéticos siguen siendo estimaciones revisadas.
- Para regenerar: `node tools/build.cjs` seguido de `node tools/sync-voice.cjs`.
  Comprobaciones en check-voz.json, verification-voz.json y voice-sync-verification.json.
- Preview de esta sesión: http://localhost:3020/#project/gpt-bestia mediante
  forwarding SSH a 3002 de Colab. Chrome usa software; NVENC funciona.

## 9. Prueba de Irena con la guía vectorial nueva — 27-oct-2026

- El usuario consideró que la voz de gpt-bestia tapaba los efectos; aceptó esa
  entrega y pidió otra prueba. Aumentar la presencia de acciones físicas sin
  reducir toda la voz ni llenar cada palabra de sonidos.
- Guía nueva localizada: `skill/gu_a_maestra_de_animaci_n_estilo_kurzgesagt_para_hyperframes.md`.
- Proyecto nuevo `irena-vector-20s/`, separado de los ejemplos previos. Cuatro
  escenas SVG editables: noche urbana con parallax, Irena con farol y maletín,
  retrato y nombre, familias y cierre del gueto. Sombras vectoriales por capas,
  paleta violeta / oro / teal, sin contornos negros.
- Audio: fragmento 0–19,08 s de `AUDIOS/narrador historia de irene.mp3`
  (original 121,6 s), termina después de «Varsovia, en Polonia». Velocidad natural.
- Entrega `irena-vector-20s/irena-vector-20s.mp4`, 20 s, 1080p, 30 fps,
  600 frames. Render de Colab comunicado: 11,3 s.
- Mezcla: −14,01 LUFS, −2,70 dBTP. La voz empieza a 0 s y la correlación
  del archivo completo con la mezcla es 0,973. El golpe de la verja tiene
  RMS 2,29 dB por encima de la voz en su ventana de impacto, antes del mastering.
- Lint, runtime, layout, contraste y craft pasan sin errores ni advertencias.
  Capturas revisadas en review/, datos en check.json y verification.json.
- Las fachadas y el retrato son ilustrativos, no reproducciones documentales.
  Hay créditos CC BY del papel y apoyos en assets/CREDITS.md.
- Preview de esta sesión: http://localhost:3021/#project/irena-vector-20s
  mediante forwarding SSH al puerto 3003 de Colab.

## 10. Referencia de Claude y prueba stickman — 27-oct-2026

- El usuario confirmó como referencia `irena-video2/irena-sendler-20s.mp4`
  (el inicio de la historia), después de mostrar también `irena-sendler-b.mp4`.
- Insistió en leer completos todos los MD relacionados antes de comenzar.
  Priorizar `ESTILOS.md`, el guion, KIT 00/01/02/03 y los AGENTS del ejemplo.
  El estilo elegido es stickman cinematográfico vertical con actuación,
  cámara, subtítulos karaoke, voz y efectos; sin música según ESTILOS.md.
- Nueva carpeta `irena-cine-20s/`: reutiliza el rig y las seis escenas iniciales
  editables de `irena-video/`. No presentar esa base como diseño original nuevo.
  Añade duración exacta de 20 s, corrección RGB del Canvas, subtítulos finales
  ajustados y 16 efectos normalizados/alineados con el contacto visual +1 frame.
- Exportación remota terminada: 1080×1920, 30 fps, 600 frames; render 19,6 s.
  Mezcla −13,99 LUFS, −2,04 dBTP. Voz a 0 s, velocidad natural, correlación 0,959.
  División de «judías/quedaron» aproximada por fallo de la transcripción original.
- `check`: cero errores. Un aviso conservado por el tamaño del Canvas compartido.
  Capturas de caras/poses/cámara y cierre revisadas; sonido medido, no escuchado.
- Archivos de salida: `irena-cine-20s.mp4` (CRF 20) y
  `irena-cine-20s-redes.mp4` (CRF 25). Ver verificación y REVIEW en el proyecto.
- Preview de esta sesión http://localhost:3022/#project/irena-cine-20s,
  forwarding SSH a 3004 de Colab.
- El usuario pidió mejorar la espera. Usar primero preview 720p con bitrate
  máximo 1200k y AAC128k; máster en Colab hasta cerrar cambios. La descarga
  por Cloudflare, especialmente PNG de grano, fue el cuello de botella.

## 11. Puente de descarga rápida HTTPS — 27-oct-2026

- Usuario autorizó implementar la prueba HTTPS y quiere conservar máxima
  calidad. Se creó controlador `colab/bridge/bridge.ps1`, servicio solo descarga
  autenticado por token, archivos explícitos, reanudación y verificación SHA256.
- Ruta HTTP/QUIC inicial: 0,110 MB/s. Nuevo túnel HTTP/2: transferencia sostenida
  6,570 MB/s. 62,1 MB restantes del máster descargados en 9,457 s.
- `irena-cine-20s/irena-cine-20s.mp4` ya está completo localmente: 79.331.914 bytes,
  hash idéntico a Colab y decodificación completa sin errores.
- Usar SSH para renders/comandos y el puente HTTP/2 para transferencias. No
  fue necesario Tailscale. No afirmar que el cambio de protocolo sea la única
  causa: también cambió la ruta temporal de Cloudflare.
- Para siguientes sesiones: leer colab/bridge/README.md y exports.json;
  `bridge.ps1 connect` obtiene la URL vigente. Token en archivos *.local.json
  y bootstrap.local.py ignorados: no imprimir ni subir a repositorios.

## 12. Biblioteca nueva de efectos — 27-oct-2026

- Usuario pidió buscar nuevos SFX en la web, guardarlos en una carpeta y crear
  un MD para elegir los necesarios según cada video.
- Carpeta `BIBLIOTECA_SFX/`. Leer `GUIA_DE_USO.md` y `CATALOGO.md` antes de
  sonorizar; catalogo.json aporta tiempos de pico y niveles medidos.
- Cinco paquetes nuevos: Kenney RPG Audio, Impact Sounds, Interface Sounds,
  Digital Audio y 100 CC0 SFX #2 de rubberduck/OpenGameArt. Licencias CC0
  verificadas en sus fuentes; ZIP y licencias conservados, procedencia por archivo.
- 82 WAV seleccionados a 48 kHz estéreo PCM16: 11 pasos, 20 foley, 13 impactos,
  4 transiciones, 18 UI, 9 retro y 7 ambientes. Además, 445 archivos originales
  de los ZIP, incluyendo dos demos Preview. No anunciar 445 efectos individuales.
- Guía por estilo, plan candidato para Irena 0–20 s, fórmula de sincronización,
  recomendaciones para que la voz no tape contactos, y licencias por proyecto.
- Verificación: todos los WAV decodificados, formatos/tamaños/hash comprobados,
  ZIP con CRC correcto. Selección por etiquetas del autor; no escucha auditiva
  completa. Audicionar los candidatos al montar cada video.
- Openverse no respondió a búsquedas de lápiz, lluvia, latido y viento real;
  no se descargaron ni deben presentarse como disponibles. Los sonidos de aire
  son candidatos de barrido, no grabaciones identificadas de viento natural.
- Esta tarea prepara la biblioteca; no aplicó otra mezcla al video de Irena.
