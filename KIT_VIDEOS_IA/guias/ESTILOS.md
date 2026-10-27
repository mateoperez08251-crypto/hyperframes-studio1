# Estilos de video guardados

Dos estilos probados con la historia de **Irena Sendler** (vertical 9:16, voz narrada y subtítulos karaoke).
Los dos usan la **misma estructura**: un canvas 2D determinista + subtítulos HTML + audio. Solo cambia cómo se dibuja.

| | Estilo 1: **Stickman** | Estilo 2: **Títere de papel** |
|---|---|---|
| Proyecto | `irena-sendler/` | `irena-titere/` |
| Video | `irena-sendler-redes.mp4` | `irena-titere-redes.mp4` |
| Sensación | Animación limpia, viva, "línea que hierve" | Stop-motion artesanal, cartulina y chinchetas |
| Cuadros | Fluido 30 fps (línea tiembla 12 veces/s) | A saltitos: 15 cuadros/s |
| Subtítulos | Texto claro con sombra, sin caja | Tinta oscura sobre tira de papel rasgado |

---

## Base común (sirve para los dos)

### Formato
- **1080×1920** (vertical), 30 fps. `init --example blank --resolution portrait`.
- `index.html` monta: `story` (canvas, z-index 1) + `captions` (z-index 2, `data-track-kind="captions"`) + `<audio>` de la voz + `<audio>` de efectos.
- Solo voz, sin música (si el usuario no pide música).

### Flujo de trabajo
1. **Transcribir** la voz con tiempo por palabra:
   `npx hyperframes transcribe <audio> --engine parakeet --language es --dir <dir> --json`
   (sin Parakeet da `whisper_unavailable`). Corregir ortografía a mano.
2. **Cortar** la voz en un silencio limpio (mirar huecos entre palabras).
3. **Escenas**: un corte (`CUTS`) por cada frase/idea. Escenas de 2–4 s.
4. **Subtítulos**: `tools/make-captions.cjs` (grupos de 2–4 palabras; palabras clave en dorado `em` o rojo `red`). Es `.cjs` porque el `package.json` es `"type":"module"`.
5. **SFX** alineados al pico: `npx hyperframes audio <sfx> --json` → `items[0].moments.peak`.
6. `lint` → `check --json` → `snapshot --at ...` → **mirar las capturas** → `render`.
7. Versión liviana para redes:
   `ffmpeg -i in.mp4 -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart out.mp4`

### Motor del canvas
- Un tween proxy de GSAP: `clock.t` de 0 a END, `onUpdate → renderAt(t)`. Todo se dibuja en función de `T` → **determinista**.
- Nada de `Math.random()`: usar `hash(n)` con semilla.
- Utilidades: `seg(t,a,b)`, `eOut / eIn / eIO / eBack`, `bump(t,t0,d)`, `mix(colA,colB,k)`, `rgba(col,a)`.
- `hexRGB` debe aceptar `#hex` **y** `rgb(...)` (si no, las mezclas encadenadas dan negro).
- Cámara `cam(zoom, cx, cy)` con **sacudidas** (`SHAKES`), **punch** de 4 % en cada corte y **destellos** (`FLASHES`) en los golpes.
- Capa final en pantalla: grano + viñeta (+ textura de papel en el títere).

### Personaje (API común de `stick(o)`)
```js
stick({
  x, y, s,            // posición (pies) y escala
  dir: 1 | -1,        // mira a derecha / izquierda
  pose,               // { aB, aF, lB, lF: [ángulo, codo/rodilla], lean, tilt }
  eyes: "open" | "wide" | "closed" | "happy" | "none",
  brows: "angry" | "sad" | null,
  mouth: "flat" | "smile" | "frown" | "o" | "grit" | "none",
  dress, bun, hair,   // mujer: vestido, moño, color de pelo
  fists, sq, rot, col, look, lookY, extra, face
});
```
- Poses: `idlePose(id)` (respira), `walkPose(t, hz, id)`, `blendPose(a, b, k)`.
- Irena = `irena(o)`: vestido dorado `#e3a83e`, moño.

### Recursos de escena reutilizables
`sky()`, `ground()`, `skyline()` (ciudad con ventanas que se apagan), `cloud()`, `rain()`, `dust()`,
`wall()` + `barbed()` (muro de ladrillo con alambre de púas), `reaper()` (la Muerte con guadaña y ojos rojos),
mapa con contorno real (lon/lat → `proj`) + chincheta + ondas, calendario que pasa hojas, `panel()` (viñetas que entran de lado).

### Reglas aprendidas
- No usar `data-motion-blur`. No solapar tweens en la misma propiedad.
- El frame 0 no puede estar vacío.
- No solapar audios en la misma `data-track-index`.
- Subtítulos en `top: 1330px` (debajo del suelo de las escenas, zona libre). A 1150 tapaban el dibujo.
- Al trasladar/rotar piezas con `ctx.translate`, devolver también la `y` (bug del calendario).
- PowerShell: rutas con `[ ]` → `-LiteralPath`.

---

## Estilo 1 — Stickman

**Look:** fondo oscuro cinematográfico, personajes de palitos color crema con cabeza grande y cara expresiva.

### Paleta
| Uso | Color |
|---|---|
| Tinta / personaje | `#efe6d6` |
| Dorado (Irena, acentos) | `#e3a83e` |
| Rojo (peligro, muerte) | `#c4473a` |
| Multitud | `#b3bccb` |
| Fondo | `#0f1116` |

### Personaje
- Líneas redondas grosor 7, cabeza círculo radio 25 rellena oscura `#16181f` con borde crema.
- **"Línea viva"**: cada punto tiembla con `J(k, amp)` que cambia **12 veces por segundo** (`F12 = floor(T*12)`).
- Vestido = trapecio relleno; moño = circulito detrás de la cabeza.

### Subtítulos
- Montserrat 800, 74 px, color crema al 55 % → se ilumina palabra por palabra.
- Sombra fuerte: `0 5px 0 rgba(0,0,0,.55), 0 0 22px rgba(0,0,0,.85)`.
- Colores: INK `rgba(239,230,214,1)`, GOLD `rgba(240,182,72,1)`, RED `rgba(236,104,84,1)`.
- Cada palabra: escala 1 → 1.1 → 1.

---

## Estilo 2 — Títere de papel

**Look:** teatro de títeres de cartulina; piezas recortadas unidas con **chinchetas de latón**, sombras de papel, movimiento a saltitos de stop-motion.

### Paleta
| Uso | Color |
|---|---|
| Piel | `#efd5ae` |
| Tinta de la cara | `#2a1d16` |
| Chinchetas (latón) | `#c99a3e` (borde `#6e4f18`, brillo `#f6e3a0`) |
| Ropa (por `id`) | `#5d6b7f` `#7b5a47` `#56664f` `#6e5a70` `#8a7356` `#4f5d6b` |
| Pelo (por `id`) | `#4a3426` `#2e2420` `#6b4a2e` `#3b3b40` |
| Vestido Irena | `#e3a83e`, pelo `#7a4a2a` |
| Papel de subtítulos | `#efe4cf` |

### Personaje (rig de títere)
- Cada hueso = **tira gruesa** con borde más oscuro (`bone()`), torso = trapecio, cabeza = círculo de cartulina radio 31.
- **Chinchetas** en codos, rodillas, caderas, hombro y cuello (`pin()`).
- **Sombra de papel** en cada pieza: `shadowBlur 7, offset (3, 6)`.
- Cara: ojos con brillito, **mejillas rosadas**, cejas y boca en tinta.
- Pelo recortado en zigzag; moño en la mujer; `hat: true` = sombrero de los años 40.
- Manos = círculo de piel; zapatos = polígono oscuro.
- `rod: true` → **varilla de madera** del titiritero bajando desde la mano (Irena la lleva; en el retrato no).
- Multitud: ropa desaturada; fila lejana más grisácea. `col: "#050507"` = silueta negra (la sombra del miedo).
- Temblor de la mano del titiritero: rotación ±1° que cambia en cada cuadro.

### Movimiento
- **15 cuadros/s**: `T = floor(t * 15) / 15` → se ve a saltitos como stop-motion.
- Leve parpadeo de luz cálida por cuadro: `rgba(255,214,150, 0.035–0.065)`.

### Decorados
- Suelo con **borde cortado a tijera** + línea discontinua (costura).
- Edificios, muro, mapa, calendario y paneles con sombra de papel.
- Nubes, luna y sol **colgados de hilos**.
- La Muerte de cartulina con chinchetas en la mano.
- Textura de **papel con fibras** en `overlay` al 22 % + grano suave al 25 %.

### Subtítulos
- Tira de papel crema `#efe4cf` con **bordes rasgados** (`clip-path: polygon(...)`) y manchitas.
- Sombra: `filter: drop-shadow(4px 8px 6px rgba(10,6,3,.55))` en el contenedor `.cap-wrap`.
- Inclinada **−1.6° / +1.4°** alternando por grupo (la rotación va en `.cap-wrap`, no en `.cap-in`, porque GSAP anima su transform).
- Tinta: INK `rgba(42,29,22,1)`, DIM al 38 %, GOLD `rgba(178,106,18,1)`, RED `rgba(168,50,42,1)`.

### Cómo pasar un proyecto stickman a títere
```powershell
robocopy proyecto-stickman proyecto-titere /E /XD .hyperframes
node tools/to-puppet.cjs tools/puppet.js   # reemplaza stick(), decorados, cuadros y textura
node tools/make-captions.cjs                # versión con tiras de papel
```
- `to-puppet.cjs` y `puppet.js` (el rig del títere) están en `irena-titere/tools/`. Copia esa carpeta `tools/` al proyecto nuevo.

---

## Escenas de ejemplo (Irena, 30 s)

| # | Tiempo | Frase | Imagen |
|---|---|---|---|
| 1 | 0–4.3 | "En medio de una de las épocas más oscuras…" | Cielo que se oscurece, rayo, hombre asustado |
| 2 | 4.3–8.2 | "…una mujer que decidió desafiar a la muerte." | Irena bajo un foco; sube la Muerte; paso desafiante |
| 3 | 8.2–11 | "Su nombre era Irena Sendler." | Retrato en marco dorado con brillo |
| 4 | 11–13.1 | "En 1940," | Hojas de calendario vuelan hasta 1940 |
| 5 | 13.1–16.5 | "…familias judías quedaron encerradas" | Familias caminando; caen los muros |
| 6 | 16.5–19.3 | "…gueto de Varsovia, en Polonia." | Mapa, chincheta, rótulos |
| 7 | 19.3–22.3 | "El hambre, las enfermedades y el miedo" | Tres viñetas |
| 8 | 22.3–26.2 | "…parte de la vida cotidiana." | Día/noche, rayitas contando días |
| 9 | 26.2–31.4 | "Pero Irena no estaba dispuesta…" | Irena camina al muro y lo toca con luz cálida |

