# Plantillas de Prompts Maestros para Crear cada Estilo en Claude Opus 5.5

Usa estas plantillas directamente en **Claude Opus 5.5** (Web o Claude Code). Están estructuradas con las **9 capas de dirección profesional** (Rol, Objetivo, Formato, Estructura, Dirección de Arte, Lenguaje de Movimiento, Restricciones Negativas, Motor Técnico y Control de Calidad).

---

## 1. Prompt: El Showreel Viral de una Línea (Descubrimiento Abierto)
Ideal para probar la capacidad creativa máxima de Opus 5.5 sin darle restricciones previas:

```text
Haz un video dinámico de motion graphics de 15 segundos que demuestre lo increíble diseñador de movimiento que eres, como si fuera tu showreel principal para tu portafolio profesional. Ve con todo (go all out). Entrégalo en un único archivo HTML autocontenido a 60fps con controles de reproducción y sonido generado por Web Audio API.
```

---

## 2. Prompt: Comercial Estilo "Apple Keynote" (Alta Precisión)
Ideal para presentar una marca, app o servicio con acabado minimalista de estudio:

```text
Actúa como un Director Creativo de Motion Design al estilo de los films de lanzamiento de Apple.
Crea una película de lanzamiento en 2D de 25 segundos en una sola toma continua (one continuous take) para la marca: "[NOMBRE DE TU MARCA]".
Promesa central: "[TU PROPUESTA DE VALOR EN UNA FRASE]".

DIRECCIÓN DE ARTE Y MOVIMIENTO:
- Lienzo cálido off-white (#F5F5F7), interfaz en negro profundo (#1D1D1F) y acentos en cristal líquido (frosted glass) con desenfoque y refracción.
- Ninguna escena se corta ni hace fade-out: cada escena se transforma geométricamente a partir de la anterior.
- El texto emerge desde líneas de máscara (clip-path), los iconos brotan desde escala 0 usando físicas de resorte (spring physics), y una forma negra inunda el cuadro para contraerse y revelar la siguiente escena.
- Un cursor vectorial conduce toda la acción con clics reales (efecto de compresión al hacer clic), arrastres y selección. La cámara hace zoom dinámico para seguir al cursor.

PROHIBIDO (Negative Prompt):
- Prohibido usar crossfades, blur-ins genéricos, giros 3D baratos, lluvias de partículas sin sentido, resplandores neón o pausas estáticas mayores a 0.8 segundos.

RITMO Y ESTRUCTURA (120 BPM):
- Escena 1 (0-4s): Apertura con el logotipo tipográfico y transición de diafragma hacia una cuadrícula Bento interactiva.
- Escena 2 (4-10s): El cursor interactúa con tarjetas de cristal líquido que muestran métricas en tiempo real animadas.
- Escena 3 (10-18s): La cámara se aleja revelando la interfaz dentro de una ventana minimalista, desplegando un flujo de trabajo paso a paso.
- Escena 4 (18-25s): Secuencia de confirmación final que inunda el lienzo y hace un loop perfecto hacia el logotipo inicial.

MOTOR TÉCNICO:
- Un único archivo HTML autocontenido, 1920x1080 a 60fps.
- Renderizado cuadro por cuadro como una función pura del tiempo `draw(t)` (sin depender de CSS transitions asíncronas).
- Incluye efectos de sonido sutiles (clics, pops, sub-bass drops) sintetizados con Web Audio API sincronizados a los picos de movimiento.
```

---

## 3. Prompt: Video Estilo "Vox / Explainer Documental"
Ideal para canales de YouTube sobre historia, finanzas, geopolítica o negocios:

```text
Actúa como el director de animación principal de Vox y Johnny Harris.
Crea una animación explicativa de 30 segundos en un solo archivo HTML (Canvas + SVG) sobre el tema: "[TEMA A EXPLICAR]".

ESTILO VISUAL:
- Fondo con textura de cuadrícula técnica y papel editorial crema oscuro o pizarra táctica (#18181B).
- Tipografía editorial combinando títulos Serif elegantes con etiquetas Monospace técnicas.
- Uso de efecto "resaltador amarillo" (#FACC15) que subraya frases clave dentro de recortes de documentos.
- Gráficos de líneas y mapas estilizados que se dibujan progresivamente en pantalla con punteros de coordenadas y etiquetas de datos.

LENGUAJE DE CÁMARA:
- Movimiento de cámara 2.5D con efecto Parallax (el fondo, los gráficos medios y las etiquetas en primer plano se mueven a distintas velocidades durante los paneos).
- Movimientos de cámara con curva `easeInOutQuart` rápidos seguidos de un ligero drift lento (cámara flotante documental).

ESTRUCTURA DE LA SECUENCIA:
- 0-6s: Fecha histórica o dato impactante que se escribe tipo máquina de escribir mientras se dibuja una línea de tiempo.
- 6-15s: Zoom hacia un nodo de la línea de tiempo que se expande en un diagrama de conexiones con flechas animadas.
- 15-24s: Comparativa visual de datos (gráfico animado que rompe la escala con alerta visual).
- 24-30s: Resumen visual con recorte resaltado y cierre de cámara.
```

---

## 4. Prompt: Tipografía Cinética Sincronizada (Para Shorts / Reels / Música)
Ideal para retención extrema en formato vertical o videos musicales:

```text
Actúa como un especialista en Tipografía Cinética y Diseño Experimental.
Crea una pieza de 20 segundos en formato vertical (1080x1920, 9:16) o panorámico (1920x1080) que anime el siguiente guion palabra por palabra con composiciones visuales cambiantes:

GUION:
"[PEGA AQUÍ TU TEXTO DE 30-50 PALABRAS]"

REGLAS DE DISEÑO:
1. Nunca muestres una sola línea de texto aburrida en el centro. Usa composiciones tipográficas de póster suizo: textos gigantes que llenan la pantalla, rotaciones de 90 grados de toda la cámara, texto en máscara negativa (blanco sobre negro que se invierte a negro sobre blanco en el impacto).
2. Vincula palabras específicas a metáforas visuales geométricas (ej. si dice "crecer", las letras se estiran verticalmente; si dice "romper", la palabra se divide en dos bloques con desplazamiento).
3. Ritmo percusivo a 128 BPM: cada cambio de escena o golpe tipográfico debe coincidir exactamente con el beat.
4. Genera una pista rítmica minimalista (kick, hi-hat, bass synth) con Web Audio API para acompañar los golpes visuales.
```