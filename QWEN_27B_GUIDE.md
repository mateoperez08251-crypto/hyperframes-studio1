# Guía completa para usar **Qwen‑27B** con **HyperFrames**

---

## 1. Visión general
Esta guía está escrita en español y está pensada para que el modelo de lenguaje **Qwen‑27B** genere proyectos HyperFrames sin quedarse “trabado”.  Se cubren:
- Consideraciones específicas del modelo.
- Estructura de *prompt* recomendada.
- Sintaxis de los archivos `.html`/`.js` de HyperFrames.
- Directrices de animación con **GSAP**.
- Evitar errores comunes (random, motion‑blur, superposición).
- Paso a paso para compilar y renderizar.

---

## 2. Particularidades de Qwen‑27B
| Característica | Recomendación |
|---|---|
| **Límite de tokens** (≈ 8 k) | Mantén los *prompts* por debajo de 3 k tokens y usa comentarios concisos. |
| **Determinismo** | Evita `Math.random()` y `Date.now()`. Usa `seedrandom` con semilla fija si necesita aleatoriedad. |
| **Formato de salida** | Qwen tiende a añadir **```** extra o a mezclar texto con código. Usa delimitadores claros:
```markdown
```html
<!-- código HyperFrames -->
```
```js
// GSAP timeline
```
``` 
| **Hallucination** | Provee ejemplos de fragmentos válidos en el *prompt* para guiar al modelo. |

---

## 3. Estructura recomendada del *prompt*
```
[INSTRUCCIONES GENERALES]
- Usa siempre comillas dobles en atributos HTML.
- Cada elemento animado lleva `data‑clip="<id>"` y atributos `data‑start` / `data‑duration`.
- Declara la línea base en `index.html` y referencia sub‑composiciones con `data‑composition‑src`.

[PROYECTO]
Nombre: "EscenaDemo"
Descripción: "Animación de un personaje títere de papel que saluda."
Assets: ["personaje.png", "fondo.jpg", "saludo.wav"]

[CODIGO]
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>EscenaDemo</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body>
  <img src="personaje.png" id="personaje" data‑clip="p1" data‑start="0" data‑duration="2" />
  <audio src="saludo.wav" data‑clip="s1" data‑start="2" data‑duration="3"></audio>
</body>
</html>
```

[ANIMACIÓN]
```js
window.__timelines = {};
const tl = gsap.timeline({defaults:{duration:0.5}});
tl.from("#personaje", {y:100, opacity:0})
  .to("#personaje", {rotation:15, repeat:1, yoyo:true}, "+=0.5")
  .to("#personaje", {scale:1.1, duration:0.3}, "+=0.2");
window.__timelines["p1"] = tl;
```
```

---

## 4. Directrices de animación con GSAP
1. **No sobrecargar la misma propiedad** en la misma línea de tiempo.
2. **Separar timelines** por `data‑clip` para que HyperFrames los sincronice.
3. **Duración total** debe coincidir con el mayor `data‑start + data‑duration`.
4. **Evita `data‑motion‑blur="on"`** en dispositivos con GPUs antiguas (ej. Intel HD 4600).
5. Usa **easing** explícitos (`ease: "power2.out"`).
6. Declara los *timelines* **después** del DOM para que los selectores existan.

---

## 5. Solución de problemas más frecuente con Qwen‑27B
| Problema | Síntoma | Acción correctiva |
|---|---|---|
| Código truncado o con ````` extra | Salida incompleta o bloque de código incorrecto | Añade al final del *prompt* la frase "**FIN DEL CÓDIGO**" y delimita con triple backticks. |
| Comentarios mezclados con HTML | El parser de HyperFrames ignora partes del markup | Usa `<!-- comment -->` para HTML y `/* comment */` para JS. |
| Animación que no se inicia | Falta `window.__timelines["id"]` o `data‑start` fuera de rango | Verifica que el `id` coincida entre atributo y mapa de timelines. |
| Model se “cuelga” en loops largos | Salida demasiado extensa > token limit | Divide la escena en sub‑composiciones y genera cada una por separado. |

---

## 6. Ejemplo completo (Escena “Saludo”) 
### 6.1. `index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Saludo Títere</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="saludo.js" defer></script>
</head>
<body>
  <div id="escena" data-composition-src="saludo.html"></div>
</body>
</html>
```

### 6.2. `saludo.html`
```html
<div class="fondo" data-clip="bg" data-start="0" data-duration="5">
  <img src="fondo.jpg" alt="Fondo" />
</div>
<img src="personaje.png" id="personaje" class="personaje" data-clip="p1" data-start="0" data-duration="5" />
<audio src="saludo.wav" data-clip="s1" data-start="1" data-duration="3"></audio>
```

### 6.3. `saludo.js`
```js
window.__timelines = {};
// Timeline para el personaje
const tlPersonaje = gsap.timeline({defaults:{duration:0.4}});

tlPersonaje.from("#personaje", {y:150, opacity:0, ease:"back.out(1)"})
          .to("#personaje", {rotation:10, repeat:1, yoyo:true, ease:"power1.inOut"}, "+=0.2")
          .to("#personaje", {scale:1.05, duration:0.2}, "+=0.3");
window.__timelines["p1"] = tlPersonaje;

// Timeline para el audio
const tlAudio = gsap.timeline();
tlAudio.to("audio[data-clip='s1']", {volume:1, duration:0.5}, 1);
window.__timelines["s1"] = tlAudio;
```

## 4.1. Efectos de sonido suaves y coordinados

Para que los efectos de audio en HyperFrames suenen fluidos y estén perfectamente sincronizados con la animación visual, sigue estas buenas prácticas:

- **Fade‑in / Fade‑out**: controla el volumen de forma gradual usando GSAP. Ejemplo:
```js
const tlAudio = gsap.timeline();
// Fade‑in al iniciar el clip (volumen de 0 a 1 en 0.5 s)
tlAudio.fromTo("audio[data-clip='s1']", {volume:0}, {volume:1, duration:0.5}, 0);
// Fade‑out al terminar (volumen de 1 a 0 en 0.5 s)
tlAudio.to("audio[data-clip='s1']", {volume:0, duration:0.5}, "+=2.5");
window.__timelines["s1"] = tlAudio;
```
- **Sincronización con visuales**: alinea el inicio del audio con `data-start` del elemento visual correspondiente. Usa el mismo valor de tiempo en la línea de tiempo de GSAP (`+=<offset>`).
- **Cross‑fade entre audios**: cuando necesites pasar de un sonido a otro sin pausa, superponlos ligeramente y ajusta los volúmenes simultáneamente.
```js
const tlCross = gsap.timeline();
tlCross.to("audio[data-clip='s1']", {volume:0, duration:0.3}, 2.7) // fade‑out del primer audio
      .fromTo("audio[data-clip='s2']", {volume:0}, {volume:1, duration:0.3}, 2.7); // fade‑in del segundo
window.__timelines["sCross"] = tlCross;
```
- **Usa Howler.js (opcional)**: si requieres control avanzado (loop, sprite, 3D positioning), incluye la librería y controla los objetos Howler dentro de los timelines.
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
```
```js
const sound = new Howl({src:['efecto.wav'], volume:0});
const tlHowl = gsap.timeline();
tlHowl.to(sound, {volume:1, duration:0.4}, 0) // fade‑in
      .to(sound, {volume:0, duration:0.4}, "+=1.5"); // fade‑out
window.__timelines['howl'] = tlHowl;
```
- **Evita solapamientos bruscos**: nunca reproduzcas dos audios con volúmenes al 100 % al mismo tiempo; siempre utiliza al menos 0.2 s de cross‑fade.
- **Prueba en dispositivos**: algunos navegadores limitan el autoplay; asegúrate de iniciar el audio después de una interacción del usuario (p.ej., click) o usa la opción `muted` y habilita `unmute` vía script.

Con estas técnicas los efectos sonoros se percibirán como parte integral de la animación, logrando una experiencia más inmersiva.

---

## 7. Compilación y renderizado con HyperFrames CLI
```bash
# Instalar HyperFrames (si aún no está)
npx -y hyperframes@latest install

# Generar proyecto (ejemplo)
npx hyperframes init saludo-titere
cd saludo-titere

# Copiar los archivos creados arriba dentro de la carpeta del proyecto
# Renderizar
npx hyperframes render --output dist/saludo.mp4
```

> **Tip:** Si el modelo genera demasiado código en una sola respuesta, pídele que lo entregue en *bloques* (`// BLOQUE 1`, `// BLOQUE 2`). Después concatena los bloques manualmente.

---

## 8. Buenas prácticas para iteraciones rápidas
1. **Prompt corto + ejemplo** – siempre incluye al menos un fragmento válido.
2. **Pide la lista de assets** antes de generar código, así el modelo no olvida incluirlos.
3. **Usa “continuar”** cuando la salida llegue al límite de tokens.
4. **Verifica** con `npx hyperframes lint` antes de renderizar.

---

## 9. Resumen rápido (cheat‑sheet)
- ✅ Delimita código con triple backticks y especifica el lenguaje.
- ✅ No uses `Math.random()` ni `Date.now()`.
- ✅ Cada elemento animado → `data-clip`, `data-start`, `data-duration`.
- ✅ Declara timelines en `window.__timelines["id"]`.
- ✅ Evita `data-motion-blur="on"`.
- ✅ Divide escenas largas en sub‑composiciones.

---

## 10. Referencias rápidas
- **GSAP Docs:** https://gsap.com/docs/
- **HyperFrames CLI:** https://github.com/hyperframes/hyperframes-cli
- **Qwen‑27B Prompt Guide:** https://github.com/QwenLM/Qwen-27B-prompt

---

*Fin de la guía.*
