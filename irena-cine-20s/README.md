# Irena — adaptación de la referencia de Claude

Prueba de 20 segundos en vertical, 1080×1920, 30 fps.
Se reutilizan el rig, las seis escenas iniciales y el generador de subtítulos
de `../irena-video/`, correspondientes al ejemplo que confirmó el usuario.
Los originales permanecen en sus carpetas.

Cambios: duración exacta de 20 segundos, voz original a velocidad natural,
corrección del lector de colores RGB del Canvas, subtítulos finales ajustados
y 16 efectos procesados con sus picos a un frame del contacto visual.

Entregas: `irena-cine-20s.mp4` (CRF 20) y `irena-cine-20s-redes.mp4` (CRF 25).
Revisión rápida: `irena-cine-20s-preview.mp4`, 720×1280, CRF 29,
máximo 1200 kb/s de video y audio 128 kb/s. Transferir primero esta versión;
conservar el máster en Colab durante las iteraciones y descargarlo al cerrar.
Estado local actualizado: máster CRF20, redes y preview completos en D:.
El puente HTTPS con HTTP/2 reanudó la descarga del máster y recibió los
62,1 MB restantes en 9,457 s. SHA256 del archivo completo verificado.
La prueba anterior de cuatro SCP paralelos no avanzó y fue detenida.
Usar `../colab/bridge/bridge.ps1` para las próximas transferencias.
`SPEC.md` contiene dirección y lecturas; `STORYBOARD.md`, los planos;
`audio/sync.json`, los eventos; `verification.json`, las mediciones.

Render en Colab desde `/content/hyperframes-studio/irena-cine-20s`:

```sh
../node_modules/.bin/hyperframes check --json
../node_modules/.bin/hyperframes render --quality delivery --workers 4 --output render-raw.mp4
python tools/finalize.py
```

La vista editable local de esta sesión es http://localhost:3022/#project/irena-cine-20s.
El botón Edit with Framey permite seguir editando en la aplicación de HyperFrames.

`tools/adapt.cjs` registra las transformaciones iniciales sobre los archivos
copiados; no es un regenerador completo desde cero. Los HTML finales son las
fuentes editables. Para cambiar sonidos, editar `tools/sound.py` y regenerar
su bloque de audio en el índice, conservando la voz.
