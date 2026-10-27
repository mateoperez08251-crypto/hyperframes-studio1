# Texto animado vertical — HyperFrames

Proyecto inicial de animación tipográfica cinética de 8 segundos, 1080 × 1920 (9:16), 30 fps por defecto de HyperFrames.

## Contenido
- `index.html`: composición raíz de 8 s.
- `compositions/texto-animado.html`: escena con animación GSAP, brillo, aro y textos editables mediante variables.
- `package.json`: comandos para comprobar, previsualizar y renderizar.

## Requisitos
Node.js y npm instalados.

## Ejecutar
En una terminal, dentro de esta carpeta:

```bash
npm install
npx hyperframes check --json
npx hyperframes preview
```

Cuando hayas revisado la vista previa y quieras producir el MP4:

```bash
npx hyperframes render
```

Consulta `npx hyperframes render --help` si tu versión de HyperFrames requiere una opción de salida específica.

## Personalizar
En `index.html`, cambia los valores `default` de las variables `linea1`, `linea2` y `firma`. También puedes editar el texto secundario directamente en `compositions/texto-animado.html`.

## Nota
Este paquete contiene el código fuente del proyecto; el MP4 no está incluido porque el render requiere ejecutar HyperFrames en un entorno compatible.
