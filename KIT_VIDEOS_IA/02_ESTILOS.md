# 02 — CATÁLOGO DE ESTILOS

Cada estilo trae: para qué sirve · paleta · fuente · técnica · movimiento ·
paquete de sonido (ver `03_SONIDOS.md`) · errores típicos.
**✅ = probado y terminado en esta máquina** (hay ejemplo en `ejemplos/`).

---

## 1. ✅ Vitral Vivo (vidriera de iglesia) — `ejemplos/vitral-irena`
- **Para:** biografías, historias heroicas, religión, historia, homenajes.
- **Paleta:** fondo `#07060c`; vidrios en HSL saturado (rojo 0–10°, oro 40–48°,
  verde 130–150°, azul 200–225°, violeta 270–290°); plomo `#141018`;
  luz dorada `#e3a83e`; rubí para lo oscuro `#c4473a`.
- **Fuente:** serif con peso (Playfair Display / similar) en subtítulos con caja de plomo.
- **Técnica:** Canvas con `renderFrame(t)`. Cada forma = polígono con relleno
  `glassFill` (degradado + ruido) y borde grueso de plomo (`leadLine`).
  Fondo de mosaico Voronoi, rosetón giratorio, rayos de luz, motas flotando.
  Personajes = figuras de vidrio (cabeza circular, túnica en piezas) + halo.
- **Movimiento:** lento, solemne. Transición entre escenas = ola de cristales
  que gira por el centro ~0,15 s antes del corte. Cámara con zoom suave (`cam()`).
- **Subtítulos:** máx 3 palabras / 17 letras por grupo; palabras de "luz" en
  dorado y de "oscuridad" en rubí.
- **Sonido:** paquete CRISTAL.
- **Errores típicos:** demasiado contraste en el plomo (se ve sucio); escenas
  sin aura/rayos se ven planas.

## 2. ✅ Tipografía cinética de choque — `ejemplos/claude-bestia`
- **Para:** frases virales, hooks de 5–15 s, anuncios, intros.
- **Paleta:** fondo `#0e0b0a` con resplandor cálido, texto crema `#f4ede4`, acento coral `#d97757`.
- **Fuente:** Archivo Black (incluida en HyperFrames).
- **Técnica:** GSAP. Cada palabra/letra entra **chocando** contra la anterior
  (que rebota); la primera palabra de una frase saca de cuadro a la frase previa.
  Sombra 3D dura + sombra suave. Funciones: `slam() recoil() knock() shake() flash() burst()`.
- **Movimiento:** muy rápido, golpes cada 0,2–0,5 s, sacudida de cámara en los golpes grandes.
- **Sonido:** paquete IMPACTO.
- **Errores típicos:** tweens solapados en la misma propiedad (usar `bake()`);
  `data-motion-blur` (prohibido).

## 3. Stickman cinematográfico
- **Para:** historias, "What If", explicaciones con personajes, true crime suave.
- **Paleta:** fondo oscuro `#101014`; tinta `#efe6d6`; oro `#e3a83e`; rojo `#c4473a`; multitud `#b3bccb`.
- **Técnica:** Canvas, rig de palitos (cabeza, torso, brazos y piernas con 2
  segmentos, ángulos por articulación). Poses clave + interpolación con easing.
  Guía completa: `guias/1_sistema_de_animaci_n_2d_y_stickman...md`.
- **Movimiento:** acting exagerado (anticipación → acción → asentamiento), cámara que acompaña.
- **Sonido:** paquete CINEMÁTICO + pasos/whoosh.
- **Errores típicos:** articulaciones que se doblan al revés; personaje "flotando" (marcar el suelo).

## 4. Apple Keynote
- **Para:** producto, tecnología, anuncios premium, datos impactantes.
- **Paleta:** negro puro `#000` o blanco `#fbfbfd`; texto `#f5f5f7`; un solo
  acento con degradado (azul→violeta `#2997ff → #a259ff`).
- **Fuente:** Inter / SF-like, pesos 600–800, tracking negativo en titulares.
- **Técnica:** GSAP. Mucho espacio vacío, una idea por pantalla, revelado por
  máscara, números que cuentan, objetos con brillo especular.
- **Movimiento:** suave y lento (`power3.out`, 0,8–1,4 s), nada rebota.
- **Sonido:** paquete MINIMAL.
- **Errores típicos:** meter demasiado texto; usar más de un color de acento.

## 5. Explainer Vox / Kurzgesagt
- **Para:** ciencia, historia, geopolítica, "¿por qué…?".
- **Paleta Kurzgesagt:** fondo azul noche `#1b2340`, formas planas saturadas
  (`#ff6b6b #ffd166 #06d6a0 #4cc9f0`), sin contornos negros.
  **Paleta Vox:** papel `#f2efe6`, negro `#1a1a1a`, amarillo `#ffd200`, recortes de foto.
- **Fuente:** Montserrat / Poppins bold.
- **Técnica:** SVG/Canvas de formas planas con sombra larga suave; mapas que
  se dibujan; flechas animadas; elementos con "respiración" (escala 1→1,03).
- **Movimiento:** elástico ligero (`back.out(1.4)`), todo entra escalonado.
- **Sonido:** paquete EXPLAINER.

## 6. 3Blue1Brown (matemática / datos)
- **Para:** matemática, finanzas, estadística, cualquier cosa con gráficas.
- **Paleta:** fondo `#000` o `#0f0f0f`; azul `#58c4dd`, amarillo `#ffff00`
  apagado `#fce06b`, verde `#83c167`, rojo `#fc6255`.
- **Fuente:** CMU Serif / KaTeX para fórmulas; Inter para texto.
- **Técnica:** trazos que se dibujan (`stroke-dashoffset`), transformación de
  una fórmula en otra, ejes y funciones que se trazan.
- **Movimiento:** pausado y preciso (`sine.inOut`).
- **Sonido:** paquete MINIMAL (casi nada) + música suave.

## 7. SaaS / Producto UI
- **Para:** demos de app, startups, landing en video.
- **Paleta:** fondo `#0b0d12`, tarjetas glass `rgba(255,255,255,.06)` con borde
  `rgba(255,255,255,.12)`, acento `#7c5cff` o `#22d3ee`.
- **Técnica:** maquetas de interfaz en HTML real, cursor animado que hace
  clic, tarjetas que se ensamblan, zoom a la parte importante.
- **Sonido:** paquete UI.

## 8. Pixel art / retro
- **Para:** gaming, nostalgia, humor.
- **Paleta:** limitada (PICO-8: `#1d2b53 #7e2553 #008751 #ab5236 #ff004d #ffa300 #ffec27 #29adff`).
- **Fuente:** Press Start 2P.
- **Técnica:** Canvas a baja resolución (p. ej. 270×480) escalado ×4 con
  `imageSmoothingEnabled=false`; movimiento por pasos enteros de píxel.
- **Sonido:** paquete RETRO (chiptune).

## 9. 3D (Three.js)
- **Para:** objetos, planetas, logos, escenas espectaculares.
- **Técnica:** Three.js con reloj controlado por `t` (nunca `requestAnimationFrame`
  libre); luces + niebla; materiales PBR sencillos.
- **Ojo esta GPU (Intel HD 4600):** escenas ligeras, sin postprocesado pesado.
  Probar 3 capturas antes de renderizar.
- **Sonido:** paquete CINEMÁTICO.

## 10. Fluidos / partículas abstractas
- **Para:** fondos, intros, música, transiciones.
- **Técnica:** Canvas 2D con campo de flujo (ruido simplex con semilla) y
  miles de partículas con estela (`globalAlpha` bajo, sin borrar del todo).
- **Sonido:** paquete AMBIENTE.

---

## Cómo elegir rápido
| Quiero… | Estilo |
|---|---|
| Biografía emotiva / histórica | 1 Vitral o 3 Stickman |
| Hook viral corto | 2 Tipografía cinética |
| Producto o tecnología | 4 Apple o 7 SaaS |
| Explicar algo complejo | 5 Explainer o 6 3B1B |
| Gaming / humor | 8 Pixel |
| Espectáculo visual | 9 3D o 10 Fluidos |

Más detalle técnico en `guias/` (las guías originales del usuario).
