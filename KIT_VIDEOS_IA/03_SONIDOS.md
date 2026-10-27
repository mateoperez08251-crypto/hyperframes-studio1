# 03 — SONIDO: EFECTOS, VOZ Y MÚSICA

## Biblioteca nueva del estudio — 27-oct-2026

Antes de elegir efectos, leer [BIBLIOTECA_SFX/GUIA_DE_USO.md](../BIBLIOTECA_SFX/GUIA_DE_USO.md)
y su catálogo. Contiene 82 WAV nuevos seleccionados por categorías, fuentes CC0,
tiempos de pico y recomendaciones por estilo y para Irena. Copiar solo los
necesarios al proyecto. El usuario pide que los contactos importantes se
distingan de la voz: no aplicar multiplicadores fijos sin comprobar cada archivo.

## 1. Jerarquía (lo más importante)
| Capa | Volumen (`data-volume`) | Nota |
|---|---|---|
| **Voz del narrador** | 1.0 | Manda siempre. Nada la tapa. |
| Efectos de golpe / corte | 0.4 – 0.7 | Solo en momentos clave. |
| Efectos suaves (brillos, whoosh) | 0.08 – 0.2 | Decoran, no distraen. |
| Música de fondo | vía `add-music.ps1` | Base 0.40 + ducking (baja sola cuando hay voz). |
| Mezcla final | −14 LUFS, pico < −1 dBFS | Estándar YouTube/TikTok/IG. |

Regla: **si dudas, más bajo.** Un efecto por momento importante, no por cada palabra
(salvo tipografía cinética, donde cada golpe lleva sonido).

## 2. Sincronización exacta
1. Mide el pico del archivo: `npx --yes hyperframes@0.8.193 audio assets/sfx/x.mp3 --json`
2. `data-start = momento_visual + 1/30 − pico` (el pico cae 1 frame después del golpe).
3. Cada `<audio>` en su propia `data-track-index` (10, 11, 12…).
4. Guarda picos y duraciones en un objeto `PEAK`/`LEN` dentro del script que genera
   `index.html` (ver `ejemplos/vitral-irena/tools/make-index.cjs`).

## 3. Conseguir sonidos
- **Incluidos en HyperFrames:** impact-bass-1, impact-bass-2, glitch-1, whoosh, whoosh-short.
- **Buscar en Openverse (gratis, CC):**
  `npx --yes hyperframes@0.8.193 media-use resolve --type sfx --intent "glass chime soft" --project .`
  Quedan en `.media/` → copiarlos a `assets/sfx/` y anotar créditos en `assets/sfx/CREDITS.md`.
- **Biblioteca ya descargada:** `KIT_VIDEOS_IA\sonidos\` (copiar lo necesario al proyecto).

## 4. Paquetes por estilo
| Paquete | Estilos | Efectos (intent para buscar) | Dónde ponerlos | Vol |
|---|---|---|---|---|
| **CRISTAL** ✅ | Vitral | glass chime, glass sparkle, glass shatter (liberación), whoosh-short (entradas), swosh (fechas), impact-bass-1 grave (momentos oscuros) | Cada corte de escena alterna chime/sparkle | chime 0.6, sparkle 0.1, whoosh 0.12–0.15, bass 0.07 |
| **IMPACTO** ✅ | Tipografía cinética | punch snare, pipe hit, body fall, trailer boom, impact-bass, swosh, glitch | Cada palabra que choca; boom en la frase final | 0.5–0.9 |
| **CINEMÁTICO** | Stickman, 3D | low boom, riser, whoosh, footsteps, door slam, heartbeat | Cambios de acto, tensión, revelaciones | 0.3–0.6 |
| **MINIMAL** | Apple, 3B1B | soft click, subtle whoosh, soft pop, shimmer | Aparición de cada idea / número | 0.1–0.3 |
| **EXPLAINER** | Vox/Kurzgesagt | pop, bubble, swipe, paper slide, marker draw, ding | Cada elemento que entra | 0.2–0.4 |
| **UI** | SaaS | mouse click, keyboard typing, notification, toggle, success chime | Clics del cursor, tarjetas | 0.2–0.4 |
| **RETRO** | Pixel | 8-bit jump, coin, power up, laser, explosion chiptune | Acciones del personaje | 0.3–0.5 |
| **AMBIENTE** | Fluidos | drone pad, wind, deep hum, shimmer | Continuo + acentos | 0.1–0.3 |

## 5. Música de fondo (sin re-renderizar)
```powershell
powershell -ExecutionPolicy Bypass -File tools\add-music.ps1 `
  -Video video-fine.mp4 -Music "D:\ruta\musica.mp3" -Out video-musica.mp4
```
- `-MusicVol 0.40` (por defecto). Usuario dijo "no se oye" con 0.22 → 0.40 fue bien.
- `-DuckRatio 4`: cuánto baja al hablar el narrador (más alto = baja más).
- Hace fade-in 2 s, fade-out al final, ducking por sidechain y loudnorm −14 LUFS.
- Si la música es más corta que el video, termina con fade (no se corta en seco).
  Si quieres que cubra todo, usa `-Loop`.
- Música por estilo: Vitral/Stickman histórico → ambiental/orquestal suave;
  Cinética → trap/phonk con golpes; Apple → piano/electrónica limpia;
  Explainer → ukelele/lofi alegre; 3B1B → piano tranquilo; Pixel → chiptune.

## 6. Voz
- Mejor grabada/generada aparte (FineVoice, ElevenLabs…) en un solo mp3.
- La voz decide la duración del video y los cortes (vía transcripción).
- Verifica que no clipee: pico < −1 dBFS antes de usarla.
