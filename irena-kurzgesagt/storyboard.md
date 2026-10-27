# STORYBOARD — «La historia de Irena Sendler» (Kurzgesagt)

18 escenas `class="clip"` sincronizadas (0 → 121.6 s) sobre `data-track-index="0"`.
Cada banda de tiempo es contigua (sin huecos ni solapamiento). El primer tween de
cada escena va desplazado +0.12 s tras el inicio del clip.

## Paleta Kurzgesagt (saturada, alto contraste, sin contornos negros)
- `--teal #2B9EB3` · `--green #4CE0B3` · `--blue #1E69DE` · `--navy #0B132B`
- `--gold #F7B519` · `--cream #FCE181` · `--coral #DE216B` · `--violet #6315D6`
- `--void #06071B` · `--plasma #FFF200` · `--room-purple #251351`

## Reglas deterministas cumplidas
- Sin `Math.random()`, sin `Date.now()`, sin animaciones CSS infinitas: todo depende del tiempo de la timeline.
- PRNG `mulberry32(20261027)` para estrellas, partículas y campos.
- Un único `gsap.timeline({ paused: true })` registrado como `window.__timelines["main"]`.
- Cada escena tiene `<div class="scene-bg">` full-bleed (`position:absolute; inset:0; z-index:0`).
- Los `.clip` no se animan en `display/visibility/autoAlpha`; se animan sus hijos.
- `transform-origin` centrado para todas las escalas.
- `data-layout-ignore` en capas decorativas a pantalla completa (viñeta, flash, partículas).

## Tabla de escenas
| # | t0 | t1 | Frase clave (narrador) | Imagen / accion hero (estado final) |
|---|----|----|------------------------|--------------------------------------|
| S1 | 0.00 | 4.32 | "En medio de una de las epocas mas oscuras de la historia..." | Cielo void→violet, skyline Varsovia apagandose, rayo determinista, luna. Silueta de mujer con un nino a la espalda. |
| S2 | 4.32 | 8.24 | "hubo una mujer que decidio desafiar a la muerte." | Foco cenital dorado; Irena (vector redondeado, vestido dorado, sin contorno) camina contra la sombra de la Muerte que asciende. Rim light verde. |
| S3 | 8.24 | 10.96 | "Su nombre era Irena Sendler." | Retrato circular en marco dorado (perfil vectorial), particulas de luz, banner "IRENA SENDLER - 1901-1982". |
| S4 | 10.96 | 13.12 | "En 1940..." | Calendario circular animado que gira hasta 1940; anillo rojo; marcas de anios con PRNG. |
| S5 | 13.12 | 16.48 | "familias judias quedaron encerradas en el gueto..." | Muros curvos de ladrillo (capas, sin contorno) que cierran; familias (capsules) dentro; sombra de la Muerte al fondo. |
| S6 | 16.48 | 19.28 | "de Varsovia, en Polonia." | Mapa de Polonia en trazo animado (strokeDashoffset), pin dorado, ondas concentricas, etiquetas VARSOVIA - POLONIA. |
| S7 | 19.28 | 22.32 | "El hambre, las enfermedades y el miedo..." | Tres paneles curvados que entran por el lado: espiga vacia / cruz medica / ojo del miedo. |
| S8 | 22.32 | 26.24 | "se habian convertido en parte de la vida cotidiana." | Ciclos de dia/noche en arco (sol→luna orbitando), reloj de manecillas, rayitas de dias. |
| S9 | 26.24 | 38.64 | "Irena logro entrar al gueto... comenzo una mision extremadamente peligrosa: sacar a los ninos..." | Irena pasa el alambre de puas (cortadura de luz), sacos de ayuda, red clandestina de nodos que se enciende. |
| S10 | 38.64 | 47.28 | "Sacar a los ninos... escondidos en hogares, conventos y orfanatos, lejos de la persecucion." | Manos entregan un nino (capsula verde) por una hendidura de luz; tres destinos con ninos como puntos de luz; camiones de persecucion lejanos. |
| S11 | 47.28 | 55.28 | "Que aquellos pequenos olvidaran quienenes eran." | Circulo de luz en negacion; ojos de nino que se abren; silueta de Irena con mano levantada (gesto "no"). |
| S12 | 55.28 | 70.40 | "conservaba registros secretos con sus verdaderos nombres y los lugares donde habian sido escondidos." | Cofre con tarjetas de nombres; iniciales de ninos que flotan y se archivan. |
| S13 | 70.40 | 77.52 | "En 1943, la polica secreta nazi descubrio sus actividades." | Ojo de vigilancia nazi (circulo rojo con iris) que se abre sobre la ciudad; anio 1943; lineas de radar. |
| S14 | 77.52 | 85.76 | "La arrestaron, la torturaron y la condenaron a muerte. Pero no consiguieron detener su mision." | Celda con barrotes; Irena con brazos cruzados de fuerza (rim verde); cadena que se parte (flash). |
| S15 | 85.76 | 92.16 | "La resistencia logro liberarla y ella continuo ayudando desde la clandestinidad." | Barrera que se abre, Irena camina hacia la luz, destello; nodos de la red latiendo. |
| S16 | 92.16 | 98.80 | "Durante decadas, gran parte del mundo desconocio su extraordinaria historia." | Globo terraqueo de lineas (PRNG) con un punto apagado sobre Europa; decadas pasando. |
| S17 | 98.80 | 111.20 | "el de Irena Sendler merece recordarse por haber protegido la vida..." | Libro abierto: nombres grises que se desvanecen vs. el nombre de Irena que brilla en dorado; escudo con corazon verde. |
| S18 | 111.20 | 121.60 | "elegir la compasion por encima del miedo." | Cielo que se ilumina, multitud que levanta la cabeza, gran corazon de luz central, texto cinetico "COMPASION > MIEDO". Flash final + sacudida determinista.

## Estructura de tiempos GSAP (segundo absoluto)
- Animacion continua de fondo (particulas, orbitas, pulsos): `repeat: N, yoyo: true` acotada a la duracion de cada clip (nunca `repeat: -1`).
- Sacudidas de camara: funcion amortiguada `addDeterministicShake` con tramos que no se solapan.
- Flash de impacto: overlay full-bleed `opacity 0→0.6→0` en tramos acotados.
- Entradas hero: `tl.fromTo(...)` con `transform-origin` centrado, desplazadas +0.12 s tras el inicio.
