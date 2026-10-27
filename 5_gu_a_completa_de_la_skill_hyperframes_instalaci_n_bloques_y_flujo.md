# Guía Maestra de HyperFrames: Cómo Manejar la Skill para Crear Animaciones Profesionales

**HyperFrames** (`heygen-com/hyperframes`) es el framework open-source creado específicamente para que los **agentes de IA (Claude Code, Cursor, Codex, Gemini CLI)** conviertan **HTML, CSS, GSAP, Three.js y SVG** en videos `.mp4` deterministas con calidad de estudio.

A diferencia de Remotion (que obliga a la IA a escribir componentes complejos de React y compilarlos), **HyperFrames usa HTML puro con atributos de datos (`data-*`)** y un sistema de **7 Agent Skills** que le enseñan al modelo las reglas de diseño, ritmo, sonido, catálogo de efectos y renderizado sin errores.

---

## 1. Instalación de la Skill de HyperFrames

Abre tu terminal en la carpeta donde quieras trabajar tus videos y ejecuta uno de estos dos métodos:

### Opción A: Instalación directa de las Skills en tu Agente (Claude Code / Cursor)
```bash
npx skills add heygen-com/hyperframes
```
*(Cuando te aparezca el selector en la terminal, elige **Core Skills** y luego reinicia o abre tu agente en esa carpeta).*

### Opción B: Instalación y Actualización desde la rama principal (Más reciente)
Si quieres asegurarte de tener las últimas funciones y los más de 450 bloques actualizados al día:
```bash
npx hyperframes skills update
```

### Opción C: El "Prompt Rápido" (Para que el agente lo configure solo)
Si ya tienes abierto Claude Code o tu agente en una carpeta vacía, simplemente pégale esto:
> *"Configura esta carpeta para HyperFrames: ejecuta `npx hyperframes skills update` y luego, usando `/hyperframes`, créame un video de lanzamiento de 15 segundos sobre [TU TEMA O URL]. Abre el preview local cuando termines."*

---

## 2. Cómo Funcionan las Sub-Skills Internas (Comandos `/` del Agente)

Cuando instalas HyperFrames, tu agente de IA desbloquea **comandos especializados (Skills)** que puedes invocar directamente en tus prompts:

| Comando / Skill | Para qué sirve y cuándo usarlo |
| :--- | :--- |
| **`/hyperframes`** | **La skill principal.** Úsala siempre al inicio de cualquier petición para crear, animar o editar un video. Contiene el contrato de renderizado, el bucle de inspección visual y las reglas de dirección cinematográfica. |
| **`/hyperframes-registry`** | **El catálogo de +450 bloques.** Obliga al agente a buscar e insertar componentes ya probados (transiciones con shaders, tipografía cinética, mapas, gráficos, cámaras 3D, overlays) antes de programarlos desde cero. |
| **`/media-use`** | **Gestión de Audio, Voz y Color.** Sirve para que el agente agregue efectos de sonido (SFX), música de fondo con *auto-ducking* (baja el volumen cuando hay voz), locuciones, recortes de fondo (alpha channel) y corrección de color (LUTs). |
| **`/hyperframes-cli`** | **Control de consola.** Le enseña al agente a iniciar proyectos (`init`), validar que no haya errores de sincronización (`lint`), abrir el estudio interactivo (`preview`) y exportar el MP4 (`render`). |
| **`/remotion-to-hyperframes`** | **Migración y Clonación 1:1.** Convierte proyectos antiguos de Remotion, Lottie, Three.js o videos de referencia en composiciones HTML editables en HyperFrames verificadas cuadro por cuadro. |
| **`/figma` y `/slideshow`** | **Skills bajo demanda.** Convierten diseños de Figma o presentaciones directamente en escenas animadas HTML (no en imágenes planas). |

---

## 3. Flujo de Trabajo Paso a Paso (De Cero a MP4)

### Paso 1: Inicializar un proyecto con plantilla visual
Puedes iniciar un proyecto en blanco o partir de una dirección de arte preconfigurada:
```bash
npx hyperframes init mi-video
cd mi-video
```
**Plantillas disponibles al iniciar (`init templates`):**
* `kinetic-type`: Ideal para promos lideradas por tipografía rápida y carteles dinámicos.
* `product-promo`: Ideal para lanzamientos de apps/SaaS con múltiples escenas de UI.
* `swiss-grid`: Estilo técnico, corporativo y minimalista con cuadrículas suizas.
* `warm-grain`: Estilo editorial con textura cálida y grano cinematográfico.
* `play-mode`: Videos energéticos para redes sociales (Reels/Shorts/TikTok).
* `nyt-graph`: Gráficos periodísticos e historias basadas en datos.
* `decision-tree`: Diagramas explicativos y tutoriales paso a paso.

---

### Paso 2: Usar el Catálogo de Bloques (`npx hyperframes add`)
Uno de los mayores secretos de por qué los videos hechos con HyperFrames se ven tan profesionales es que **no tienes que pedirle a la IA que invente cada efecto desde cero**. Puedes inyectar bloques editables directamente en tu proyecto:

```bash
# Transiciones y Efectos Visuales (Shaders / Overlays)
npx hyperframes add flash-through-white
npx hyperframes add editorial-flash-overlay
npx hyperframes add organic-light-leak-overlay
npx hyperframes add cinematic-zoom

# Gráficos, Datos y Diagramas
npx hyperframes add data-chart
npx hyperframes add mk-progress-stat
npx hyperframes add flowchart
npx hyperframes add mk-specs-list

# Código, UI y Redes Sociales
npx hyperframes add code-typing
npx hyperframes add lt-dark-card
npx hyperframes add instagram-follow
```
> **Tip para tu prompt:** Dile a Claude: *"Usa `/hyperframes-registry` para revisar qué bloques del catálogo encajan en este video e instálalos con `npx hyperframes add` antes de armar las escenas"*.

---

### Paso 3: Definir la Identidad de Movimiento con `FRAME.md`
Así como los proyectos web usan un `DESIGN.md`, HyperFrames introduce el estándar **`FRAME.md`**. 
Es un archivo Markdown en la raíz de tu proyecto donde defines **una sola vez** las reglas de tu marca o canal para que el agente las respete en todos los videos futuros:

```markdown
# FRAME.md — Dirección de Cámara y Movimiento
- **Paleta Base:** Fondo `#0A0A0C`, Superficies `#141418`, Acento Primario `#3B82F6`, Texto `#F8FAFC`.
- **Tipografía:** Títulos en `Inter Tight` (700, tracking `-0.03em`), Datos en `JetBrains Mono`.
- **Física de Movimiento:**
  - Prohibido usar `linear` o `ease` genérico.
  - Entradas de elementos: `cubic-bezier(0.16, 1, 0.3, 1)` de 450ms.
  - Salidas: Rápidas de 220ms con desplazamiento vertical de `-16px`.
- **Ritmo de Edición:** Cortes cada 2.5 a 3.5 segundos. Nunca dejar la pantalla sin movimiento secundario (micro-movimiento de cámara o cursores activos).
- **Audio:** Mezclar efectos de sonido sutiles (`whoosh` suave en transiciones, `click` mecánico en interacciones de botones).
```

---

### Paso 4: Previsualizar en el Studio Interactivo y Ajustar Keyframes
A diferencia de generar un HTML suelto, HyperFrames incluye un **Studio local con línea de tiempo y editor de keyframes**:
```bash
npx hyperframes preview
```
Esto abre una interfaz en tu navegador con:
* **Línea de tiempo (Timeline Editor):** Puedes arrastrar el cabezal cuadro por cuadro.
* **Inspector de Canvas:** Haz clic sobre cualquier texto o tarjeta en el video para moverlo o editarlo visualmente.
* **Carriles de Keyframes:** Ajusta las curvas de velocidad de cada propiedad animada sin tocar código.

---

### Paso 5: Validar y Renderizar a MP4 (Calidad Nativa)
Antes de exportar, el agente (o tú mismo) puede verificar que ninguna animación rompa el determinismo y luego renderizar el video con audio mezclado:
```bash
# Verifica que las animaciones sean 100% deterministas (seek-safe)
npx hyperframes lint

# Exporta el video final en MP4 (1080p o 4K a 60fps)
npx hyperframes render --output video_final.mp4
```

---

## 4. Cómo Funciona el Código por Dentro (La Anatomía de un HTML en HyperFrames)

Cuando el agente usa la skill `/hyperframes`, escribe un `index.html` limpio controlado por atributos `data-*` y adaptadores de animación (**GSAP, WAAPI, CSS, Lottie o Three.js**). Así luce una estructura básica que entiende el motor:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <!-- Configuración global de la composición para el motor de HyperFrames -->
  <meta name="hyperframes:width" content="1920" />
  <meta name="hyperframes:height" content="1080" />
  <meta name="hyperframes:fps" content="60" />
  <meta name="hyperframes:duration" content="12" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
</head>
<body>
  <main id="stage" data-hf-composition>
    <!-- Escena 1: 0s a 4s -->
    <section class="scene" data-hf-track="scene-1" data-hf-start="0" data-hf-duration="4">
      <h1 class="hero-title">Escribe HTML. Renderiza Video.</h1>
    </section>

    <!-- Escena 2: 4s a 12s -->
    <section class="scene" data-hf-track="scene-2" data-hf-start="4" data-hf-duration="8">
      <div class="bento-card">Velocidad Determinista a 60 FPS</div>
    </section>
  </main>

  <script>
    // Timeline maestra de GSAP conectada al reloj determinista de HyperFrames
    const tl = gsap.timeline({ paused: true });
    tl.from(".hero-title", { y: 80, opacity: 0, duration: 0.8, ease: "expo.out" }, 0)
      .to(".hero-title", { scale: 0.9, opacity: 0, duration: 0.4, ease: "power2.in" }, 3.6)
      .from(".bento-card", { scale: 0.85, opacity: 0, duration: 0.7, ease: "back.out(1.4)" }, 4.0);

    // HyperFrames controla exactamente el segundo `t` durante el preview y el render
    window.__hyperframes_seek = (timeInSeconds) => {
      tl.seek(timeInSeconds);
    };
  </script>
</body>
</html>
```

---

## 5. Prompts Maestros Específicos para Usar con la Skill `/hyperframes`

Copia y pega cualquiera de estos prompts dentro de **Claude Code** o **Cursor** una vez instalada la skill:

### A. Prompt para Video de Lanzamiento a partir de una Web o Repositorio
```text
Usando /hyperframes y /hyperframes-registry, crea un video promocional de 20 segundos a 60fps para [URL DE TU WEB O DESCRIPCIÓN DE TU PROYECTO].
1. Revisa primero qué bloques de UI, código y transiciones del catálogo (`npx hyperframes catalog`) puedes incorporar.
2. Diseña primero el storyboard escena por escena siguiendo un estilo limpio y moderno.
3. Usa /media-use para añadir efectos de sonido sincronizados a los cambios de escena y a los clics del cursor.
4. Ejecuta `npx hyperframes lint`, abre `npx hyperframes preview` y avísame para revisarlo.
```

### B. Prompt para Video "Faceless Explainer" (Sin Rostro) con Gráficos y Datos
```text
Usando /hyperframes, crea un video explicativo faceless de 30 segundos en formato 16:9 sobre "[TEMA A EXPLICAR]".
1. Parte de la plantilla `swiss-grid` o `nyt-graph`.
2. Incorpora los bloques `data-chart`, `flowchart` y `cinematic-zoom` desde `/hyperframes-registry`.
3. Añade subtítulos dinámicos integrados en el diseño visual (no como una capa genérica encima).
4. Verifica los fotogramas clave de cada escena antes de renderizar para asegurar que ningún texto se pise.
```

### C. Prompt para Clonar el Estilo de un Video de Referencia (Recreación 1:1)
```text
Usando /hyperframes y /remotion-to-hyperframes, analiza el video de referencia que está en `./referencia.mp4` (o esta descripción de tiempos).
Extrae su lenguaje de movimiento, ritmo de cortes y estilo tipográfico en un archivo `FRAME.md`, y reconstruye una versión editable 100% en HTML dentro de HyperFrames adaptada a mi marca "[NOMBRE DE TU MARCA]".
```