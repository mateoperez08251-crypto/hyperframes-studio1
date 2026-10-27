# 01 — FLUJO DE TRABAJO, REGLAS Y ERRORES CONOCIDOS

Probado en esta máquina: Windows · Node v24 · FFmpeg · GPU Intel HD 4600 · 4 núcleos ·
**disco C: casi lleno** (usar D: para todo).

---

## 1. Entorno
| Cosa | Valor |
|---|---|
| Carpeta base | `D:\hyperframes-studio\` |
| CLI (versión fija) | `npx --yes hyperframes@0.8.193 <comando>` |
| Proyecto nuevo | `cd D:\hyperframes-studio` → `npx --yes hyperframes@0.8.193 init <nombre>` |
| Skills | `D:\hyperframes-studio\.agents\skills\` (`hyperframes` primero) |
| Temporales | `D:\hf-temp` (NUNCA la carpeta Temp de C:) |
| Plantillas de este kit | `KIT_VIDEOS_IA\plantilla\` |

## 2. Estructura de un proyecto
```
<proyecto>/
  index.html              ← raíz: escenas + subtítulos + <audio> (voz, sfx)
  compositions/
    story.html            ← la animación (GSAP o Canvas con renderFrame(t))
    captions.html         ← subtítulos palabra a palabra (opcional)
  assets/voice/narracion.mp3
  assets/sfx/*.mp3        ← efectos + CREDITS.md
  audio/transcript.json   ← tiempos por palabra
  tools/                  ← scripts que GENERAN index.html / captions.html
  render-run.bat          ← render desacoplado + versiones fine/redes
  tools/add-music.ps1     ← música de fondo con ducking (sin re-render)
```
**Regla de oro:** si hay muchos tiempos (sfx, cortes, subtítulos), no los
escribas a mano en el HTML: escribe un script en `tools/` que genere el HTML
a partir de una lista de tiempos (ver `ejemplos/vitral-irena/tools/make-index.cjs`).

## 3. Flujo paso a paso
1. **Guion.** Divide en actos/escenas con duración. Si hay voz, la voz manda los tiempos.
2. **Audio de voz.** Copia el mp3 a `assets/voice/narracion.mp3`.
   Duración: `ffprobe -v error -show_entries format=duration -of csv=p=0 <mp3>`
3. **Transcripción con tiempos** (para cortes y subtítulos):
   `npx --yes hyperframes@0.8.193 transcribe assets/voice/narracion.mp3 --json`
   (si el audio es largo y falla, córtalo en 2 partes con ffmpeg y únelas
   sumando el offset — ver `ejemplos/vitral-irena/tools/merge-transcript.cjs`).
   **Revisa y corrige** palabras mal reconocidas (nombres propios sobre todo).
4. **Cortes de escena** = momentos de la transcripción (inicio de frase clave).
   Guárdalos en un array `CUTS` compartido por la animación y los sfx.
5. **Composición.** Escribe `story.html` (+ `captions.html`). Línea de tiempo
   GSAP en pausa o Canvas con `renderFrame(t)` determinista (mismo `t` → mismo frame;
   nada de `Math.random()` sin semilla, nada de `Date.now()`).
6. **Sonido.** Elige el paquete del estilo (03_SONIDOS.md). Mide el pico de
   cada sfx: `npx --yes hyperframes@0.8.193 audio assets/sfx/x.mp3 --json`
   y colócalo para que el pico caiga **1 frame después** del golpe visual:
   `data-start = momento_visual + 1/30 − pico`.
7. **Validar:**
   - `npx --yes hyperframes@0.8.193 lint`
   - `npx --yes hyperframes@0.8.193 check --json` → corregir TODO.
8. **Capturas:** `npx --yes hyperframes@0.8.193 snapshot --at 0,1.5,4,...`
   Incluye: frame 0, justo antes y justo después de cada corte/choque, y el final.
   **Abre y mira el contact-sheet.** Busca: texto cortado, elementos fuera de
   cuadro, frames vacíos, subtítulos tapando caras, colores apagados.
9. **Render desacoplado** (sobrevive si se cierra la terminal):
   ```powershell
   Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
     CommandLine='cmd.exe /c D:\hyperframes-studio\<proyecto>\render-run.bat';
     CurrentDirectory='D:\hyperframes-studio\<proyecto>' }
   ```
   Progreso: `Get-Content render.log -Tail 1` (cada 5–10 min, no más).
   Velocidad de referencia en esta PC: ~2,5 frames/s → 2 min de video ≈ 25 min.
10. **Música** (si hay): `powershell -ExecutionPolicy Bypass -File tools\add-music.ps1 -Music "<mp3>"`
11. **Verificar el MP4:**
    - Duración: `ffprobe ... <video>.mp4` = duración esperada.
    - Volumen: `ffmpeg -i <video>.mp4 -af ebur128=peak=true -f null -` → I ≈ −14 LUFS, Peak < −1 dBFS.
    - Ábrelo: `Start-Process <video>.mp4`.

## 4. Formatos
| Formato | Tamaño | `data-resolution` | Zona segura |
|---|---|---|---|
| 9:16 Shorts/Reels/TikTok | 1080×1920 | `portrait` | Deja libre ~250 px abajo y ~150 px arriba (botones de la app). Subtítulos en el tercio central-bajo. |
| 16:9 YouTube | 1920×1080 | `landscape` | Márgenes 5 %. |
Siempre 30 fps. Para cambiar de formato **recoloca**, no estires.

## 5. ERRORES CONOCIDOS (léelos ANTES de depurar)
| # | Síntoma | Causa | Solución |
|---|---|---|---|
| 1 | Texto desaparece en render/capturas | `data-motion-blur="on"` con esta GPU | No usarlo. Simula con `filter: blur()` en la entrada. |
| 2 | `check` avisa `gsap_tween_tail` / saltos raros | Dos tweens sobre la misma propiedad solapados | Una sola animación por propiedad y tramo. Para sacudidas/rebotes que se suman, calcula una función del tiempo y "hornéala" en tramos de 1/60 s (`bake()` en `ejemplos/claude-bestia`). |
| 3 | `text_occluded` | Viñeta/flash encima del texto | Capas decorativas con `data-layout-ignore` / `data-layout-allow-occlusion` y la viñeta **debajo** del texto. |
| 4 | `overlap` en textos que chocan a propósito | — | `data-layout-allow-overlap` en el contenedor. |
| 5 | Miniatura negra | Frame 0 vacío | Que en t=0 ya haya algo (título fantasma, fondo, personaje). |
| 6 | `duplicate_audio_track` | Dos `<audio>` solapados en la misma pista | Cada sfx en su propia `data-track-index` (10, 11, 12…) o recorta duración. |
| 7 | Render se corta a mitad o no arranca, aviso "Low disk space" | Temporales en C: lleno | `set TEMP=D:\hf-temp` y `set TMP=D:\hf-temp` en el .bat (ya en la plantilla). |
| 8 | Render muere al cerrar la terminal del agente | Lanzado con `Start-Process` desde esa terminal | Lanzar con `Invoke-CimMethod Win32_Process Create` (paso 9). |
| 9 | Sonidos a destiempo | Se colocó el inicio del archivo, no su pico | Fórmula del paso 6. |
| 10 | La música tapa la voz | Volumen fijo alto | `add-music.ps1` (ducking por sidechain + loudnorm −14). Subir: `-MusicVol 0.5`; que baje menos al hablar: `-DuckRatio 3`. |
| 11 | No suena música en web/sintetizada | Web Audio no se graba | Todo sonido como archivo `<audio>`. Nunca Web Audio. |
| 12 | Subtítulos con palabras mal escritas | Reconocimiento de voz | Lista de correcciones en el script de captions (ver ejemplo vitral). |
| 13 | Error "file in use" al escribir el MP4 | El reproductor lo tiene abierto | Guardar con otro nombre (`-v2`) o cerrar el reproductor. |
| 14 | Frames distintos en cada render | Aleatorio sin semilla | PRNG con semilla (`mulberry32(seed)`). |

## 6. Checklist final (copiar y marcar)
- [ ] Ortografía del texto en pantalla corregida
- [ ] `lint` 0 errores · `check` 0 errores
- [ ] Contact-sheet revisado (frame 0, cortes, final)
- [ ] Voz se entiende por encima de todo
- [ ] Duración correcta · −14 LUFS · pico < −1 dBFS
- [ ] Versiones: `-fine` (alta) y `-redes` (ligera)
- [ ] `CONTEXTO.md` actualizado
