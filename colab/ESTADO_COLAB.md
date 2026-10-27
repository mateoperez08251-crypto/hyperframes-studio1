# Colab conectado — 27 de octubre de 2026

Conexión comprobada desde Codex con `ssh colab`. El alias se configura con
`conectar.ps1 -HostName <direccion-actual.trycloudflare.com>`.
La dirección cambia al recrear el túnel; comprobarla antes de usarla.

## Entorno observado

- NVIDIA RTX PRO 6000 Blackwell Server Edition, 97887 MiB de VRAM.
- 48 CPU lógicas, AMD EPYC 9B45; aproximadamente 177 GB de RAM.
- Ubuntu 24.04; Node 22.23.4 y FFmpeg 6.1.1.
- HyperFrames 0.8.193 instalado en `/content/hyperframes-studio`.
- Chrome Headless Shell y sus bibliotecas instalados.
- Drive no estaba montado: conservar fuentes y resultados también en D:.

## Causa del fallo de conexión

El SSH existente escucha en `127.0.0.1:2222`. El túnel anterior apuntaba
a `localhost:22`, devolviendo HTTP 502 y `websocket: bad handshake`.
El destino que funcionó fue `ssh://127.0.0.1:2222`.
No dejar un bucle infinito ocupando una celda: lanzar cloudflared en
segundo plano con salida a archivo o drenar su salida en un hilo.

## Prueba realizada

Se subió una copia de claude-bestia (sin modificar el proyecto original).
Lint y check devolvieron ok; existen advertencias del proyecto previo.
Render de prueba: 1920x1080, 30 fps, 10 segundos, calidad draft, 4 workers.
Tiempo comunicado por HyperFrames: 9,6 segundos; captura beginframe.
Resultado local: `D:\hyperframes-studio\colab\prueba-colab.mp4`.

La prueba directa de FFmpeg con h264_nvenc funcionó. Chrome detecta Mesa
llvmpipe (software), así que no afirmar que la captura WebGL utiliza NVIDIA.
La aceleración gráfica del navegador queda pendiente si el proyecto la necesita.

## Uso posterior

Ejecutar comandos con `ssh colab`, transferir con `scp` y trabajar en
`/content/hyperframes-studio`. Los archivos de /content son temporales.
No subir la llave privada colab_key al servidor, al notebook ni a repositorios.

## Iteración rápida de video — 27-oct-2026

El render de Irena stickman de 20 s tardó 19,6 s; descargar fue el cuello de
botella. El máster CRF20 pesa 79,3 MB y la versión CRF25, 18,7 MB debido al
grano animado. Para revisar, generar primero 720×1280, CRF29, maxrate1200k,
bufsize2400k y AAC128k con faststart. Conservar el máster en Colab y descargar
la calidad final cuando se cierren los cambios. No transferir PNG completos
durante la descarga del video: revisar contact sheets JPG pequeños primero.

El usuario aclaró que quiere aumentar velocidad sin bajar calidad. La prueba
de 4 SCP paralelos no recibió bytes durante unos 165 s y se detuvo; no afirmar
que el paralelismo haya mejorado el enlace. Conservar el máster remoto intacto.
Local: versión redes 18.674.804 bytes completa, SHA256 verificado; máster
parcial 10.911.744 bytes en irena-cine-20s/irena-cine-20s.mp4.partial.
La preview 720p opcional pesa 1.189.554 bytes y está completa.
Se propone medir otra ruta HTTP autenticada o enlace privado directo antes
de invertir en una aplicación completa. No se ha instalado Tailscale.

## Puente HTTPS operativo — resultado posterior del 27-oct-2026

Se implementó `colab/bridge/`: servidor HTTP de solo descarga con token Bearer,
lista explícita de archivos, Range/reanudación, cliente con SHA256 y controlador
PowerShell. Servicio `/content/hyperframes-bridge`, 127.0.0.1:8765.

La primera ruta HTTP/QUIC dio 0,110 MB/s. La referencia HTTPS pública dio
4,113 MB/s. Cambiar el nuevo túnel HTTP a `--protocol http2` dio 1,083 MB/s
en el mismo rango de 1 MiB y 6,570 MB/s en transferencia sostenida.
No concluir que todo QUIC es lento: cambiaron transporte y ruta del túnel.

Máster de Irena ya completo en D: y en Colab: 79.331.914 bytes, 20 s,
1080×1920, 30 fps, 600 frames. Reanudación desde 17.203.200 bytes; descargados
62.128.714 bytes en 9,457 s, hash completo idéntico y decodificación sin errores.

Uso: `& .\colab\bridge\bridge.ps1 connect`, `status`, `list`, o
`get -FileId master -Output <ruta>`. Modificar exports.json para otros videos.
La conexión SSH original continúa para comandos/renders; usar HTTPS HTTP/2
para descargas. No se necesitó instalar Tailscale.
Token local en connection.local.json/bootstrap.local.py, ignorados por Git;
no imprimirlo. `connect` recupera la URL actual. Ver README y RESULTADOS.json.
