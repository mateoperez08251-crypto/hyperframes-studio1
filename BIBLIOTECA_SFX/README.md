# Biblioteca SFX del estudio

Empieza por [GUIA_DE_USO.md](GUIA_DE_USO.md), luego [CATALOGO.md](CATALOGO.md).

82 efectos seleccionados en WAV 48 kHz, estéreo, PCM 16 bits:
11 pasos, 20 foley/objetos, 13 impactos, 4 transiciones, 18 UI,
9 retro y 7 ambientes. Incluye los cinco paquetes web originales y sus fuentes.

- `seleccion/`: archivos preparados, nombres descriptivos y niveles por categoría.
- `originales/`: sonidos de los paquetes sin modificar.
- `fuentes/`: ZIP originales con comprobación CRC.
- `licencias/` y `LICENCIAS.md`: permisos y procedencia.
- `catalogo.json`: duraciones, picos, RMS, uso candidato y hashes por archivo.
- `fuentes.json`: páginas, descargas y hashes de los paquetes.
- `tools/`: scripts usados para buscar, descargar y preparar la selección.

Se eligieron candidatos por las etiquetas de sus autores. Se decodificaron y
midieron los 82 WAV. No se afirma haber escuchado todos ni que cualquier
efecto encaje sin audición con la imagen y la voz.

Para regenerar se requiere Python con numpy y FFmpeg disponible en PATH:
`python tools/download.py` y `python tools/curate.py`.
La conversión a WAV evita otra compresión perceptual durante la edición;
no recupera información perdida por el OGG original.
