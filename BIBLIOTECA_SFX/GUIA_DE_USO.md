# Biblioteca de efectos — leer antes de sonorizar un video

Creada el 27-oct-2026. Selección inicial: **82 efectos WAV**, organizados en
siete categorías, además de los paquetes originales descargados de la web.
Esta guía sirve para elegir los necesarios; no es una instrucción de usarlos todos.

## 1. Archivos que debes consultar

- [CATALOGO.md](CATALOGO.md): escucha cada archivo desde su enlace y consulta duración,
  instante del pico y RMS. Los nombres son descripciones de uso candidato.
- [catalogo.json](catalogo.json): datos exactos para generar una línea de tiempo.
- [LICENCIAS.md](LICENCIAS.md): autor, licencia y página de origen por paquete.
- `seleccion/`: WAV listos para copiar al `assets/sfx/` de cada proyecto.
- `originales/`: archivos recibidos sin modificar; `fuentes/`: ZIP originales.

Selección por etiquetas de los autores y medidas técnicas. No se ha hecho
una evaluación auditiva de todos los timbres. Audicionar los elegidos antes
de cerrar una mezcla; la medición por sí sola no prueba que encajen.

## 2. Elección por tipo de video

| Tipo de video | Elegir primero | Uso | Evitar |
|---|---|---|---|
| Historia / Irena / stickman dramático | `pasos/paso_concreto_01..03`, `foley/ropa_01..03`, `foley/papel_hoja_01..03`, `foley/cerrojo_metal`, `impactos/madera_pesada_01`, `impactos/trueno_01` | Pie apoyado, gesto, calendario/documento, cierre, muro, relámpago | Sonidos de recompensa, láseres y error de computadora sin objeto que los motive |
| Documental / Vox / mapa | `foley/papel_hoja_03`, `ui/tick_01`, `ui/seleccionar`, `transiciones/aire_02` | Recorte, fecha, marcador geográfico y paso entre planos | Sonorizar cada palabra de la narración |
| Explainer vectorial | `ui/abrir_panel`, `ui/clic_02`, `ui/confirmacion_01`, `transiciones/expandir` | Entradas de ideas, iconos y resultados | Impactos pesados en objetos pequeños |
| SaaS / ChatGPT / demo de interfaz | `ui/clic_01..03`, `ui/toggle`, `ui/scroll`, `ui/confirmacion_01..02`, `ui/error`, `ui/glitch_01` | Acciones reales del cursor y cambios de estado | Clics sin clic visible; glitch permanente |
| Tipografía cinética / promo | `impactos/golpe_fuerte_01..02`, `impactos/metal_pesado_01`, `transiciones/aire_01..02`, `ui/glitch_02` | Contactos de letras, cortes y remate | Usar el mismo golpe para todas las intensidades |
| Apple / producto elegante | `ui/clic_01`, `ui/cristal_ui`, `transiciones/expandir`, `ui/tick_02` | Detalles cortos, ajustes y revelaciones | Campana o puñetazo fuerte en cada aparición |
| Pixel / videojuego / retro | `retro/salto_01..02`, `retro/powerup_01..02`, `retro/laser_01..02`, `retro/tres_tonos` | Salto, premio, disparo y final de nivel | Usarlos en un documental histórico serio |
| 3D / objetos / materiales | `impactos/metal_pesado_01`, `impactos/madera_pesada_01`, `impactos/cristal_ligero`, `impactos/golpe_suave` | Elegir el material que toca y su peso | Un sonido de metal para tela o papel |
| Ambiente / máquina / agua | `ambientes/maquina_01..02`, `ambientes/agua_01`, `ambientes/ambiente_abstracto_01..02` | Fondo con una causa visible o narrativa | Tráfico moderno en una escena histórica; confundir ambiente abstracto con viento real |

Los identificadores anteriores están bajo `seleccion/` y terminan en `.wav`.
Alternar dos o tres variaciones de pasos. No variar el sonido al azar entre materiales.

## 3. Plan candidato para Irena: primeros 20 segundos

Referencia visual confirmada: `irena-video2/irena-sendler-20s.mp4`.
Adaptación editable actual: `irena-cine-20s/`. Estos son candidatos para un
próximo montaje; esta biblioteca no modifica automáticamente la mezcla del video.

| Tiempo visual | Acción | Archivo nuevo candidato | Tratamiento |
|---:|---|---|---|
| 2,42 | Relámpago | `impactos/trueno_01.wav` | Para trueno natural, dejar una pequeña demora después de la luz. Para golpe estilizado, alinear el pico al flash. Audicionar y recortar la cola si invade el siguiente acto. |
| 4,32 | Cambio a Irena iluminada | `transiciones/aire_02.wav` | Barrido breve alrededor del corte; no un golpe enorme. |
| 6,50 | Aparición de la muerte | `transiciones/aire_01.wav` | Probar un movimiento de aire, sin mantenerlo sobre toda la frase. |
| 7,36 | Paso de desafío | `pasos/paso_concreto_01.wav` | Contacto del pie. Opcional un solo `impactos/golpe_suave.wav` si el paso necesita peso. |
| 7,36–7,60 | Brazo y vestido se mueven | `foley/ropa_02.wav` | Muy discreto y subordinado al apoyo del pie; omitirlo si no aporta. |
| 8,24 | Retrato | `ui/cristal_ui.wav` | Acento breve opcional; evitar que suene a notificación de teléfono. |
| 11,10 / 11,24 / 11,38 / 11,52 | Hojas del calendario | `foley/papel_hoja_03.wav` y `papel_hoja_02.wav` | Alternar versiones. Recortar o espaciar según la duración de cada hoja para que no se acumule ruido. |
| 11,56 | Se fija 1940 | `impactos/golpe_suave.wav` | Un único apoyo al asentamiento del año. |
| 13,12–15,60 | Caminan las familias | `pasos/paso_concreto_01..03.wav` | Un sonido por apoyo visible, no un metrónomo ajeno a las piernas. |
| 15,90 / 16,02 | Se cierran los muros | `impactos/golpe_suave.wav` + `impactos/piedras_01.wav` | Piedras es solo candidato de textura; audicionar porque su RMS es bajo. Usar un impacto principal estilizado y una cola corta de material. Buscar otro si no comunica el peso del muro. |
| 16,48 | Entrada del mapa | `transiciones/aire_02.wav` | Más bajo que los muros para recuperar claridad de narración. |
| 17,42 | Pin de Varsovia | `ui/tick_01.wav` | Marca breve del pin. |
| 19,08–20 | Cierre | Silencio de efectos o cola existente | Dejar respirar la última palabra. |

No añadir música a esta prueba de Irena salvo que el usuario lo pida.
En el tramo B de registros/documentos: probar `papel_hoja_02`, `libro_abrir`,
`libro_cerrar`, `ropa_01`, `cerrojo_metal` y `puerta_cerrar_02` según acciones visibles.
No hay una grabación específica de lápiz: no llamar «escritura real» a un roce de papel.

## 4. Sincronización: el contacto manda

1. Elegir el sonido y preparar su recorte/ganancia final.
2. Medir de nuevo si se recortó o procesó: el pico del original ya no basta.
3. Para un golpe a 30 fps, usar como punto inicial:

```text
data-start = segundo_del_contacto + 1/30 - peak10msSeconds
```

`peak10msSeconds` es la ventana de mayor energía, no el principio del sonido
ni una marca semántica infalible. Los gestos de tela y las hojas se alinean
por la fricción visible. Un whoosh puede anticipar un corte; un ambiente
comienza y termina según el plano y no se sincroniza por su pico global.
Si el inicio calculado es negativo, recortar/preparar el archivo y medirlo otra vez.

Ejemplo sobre el WAV suministrado, sin otro procesamiento:

```text
paso_concreto_01: contacto = 7,36 s; pico10ms = 0,005 s
inicio = 7,36 + 0,033333 - 0,005 = 7,388333 s
```

Guardar la tabla de eventos del proyecto con archivo, inicio, duración,
ganancia, contacto visual y motivo. Usar archivos locales en `<audio>` con
`id`, `class="clip"`, `data-start`, `data-duration` y pista propia o sin solapes.

## 5. Nivel y presencia: corregir la voz que tapa los efectos

Los WAV seleccionados tienen estos picos de muestra de referencia:

| Categoría | Pico preparado dBFS | `data-volume` inicial orientativo |
|---|---:|---:|
| Impactos | −6 | 0,35–0,85 |
| Pasos / foley | −8 | pasos 0,30–0,70; ropa 0,15–0,35 |
| Transiciones / retro | −10 | 0,20–0,60 |
| UI | −12 | 0,25–0,60 |
| Ambientes | −20 | 0,15–0,50 |

Son puntos de partida, no una mezcla garantizada. Igualar picos no iguala
la sonoridad; consultar también el RMS y escuchar dentro de la narración.
No copiar los mismos multiplicadores a archivos originales sin normalizar.

El usuario señaló que la voz tapaba efectos en un video anterior. Dar presencia
a los contactos importantes: si no se distinguen, ajustar ese efecto, escoger
otro con mejor ataque o bajar localmente 1–2 dB la voz durante 80–150 ms con
entradas/salidas suaves. Evitar reducir toda la narración para arreglar un golpe.
Priorizar la comprensión de la voz y comprobar el resultado a volumen normal.

Mezcla final de referencia: alrededor de −14 LUFS integrados, techo de pico
verdadero −2 dBTP para margen de codificación. Medir el MP4 final y revisar
también el efecto aislado junto a la voz en su ventana de contacto.

## 6. Reutilización y licencias

Copiar solo los archivos elegidos a cada proyecto. Registrar procedencia,
autor y licencia en su `assets/sfx/CREDITS.md`; esta colección es CC0, con
crédito opcional, y se conserva el origen por trazabilidad. Los efectos viejos
CC BY de otros proyectos conservan sus propias obligaciones.

Buscar aquí antes de volver a descargar. Si falta un sonido específico,
buscarlo con una descripción concreta, verificar la licencia y añadirlo al
catálogo; no sustituir una grabación real por un nombre engañoso.

La búsqueda adicional de lluvia, viento real, latido y lápiz mediante Openverse
no respondió en esta sesión. Esos efectos no se anuncian como descargados.
