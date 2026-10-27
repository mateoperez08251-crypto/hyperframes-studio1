# Puente Colab HTTPS

Puente de transferencia controlable desde Codex/PowerShell. Conserva los bytes
del video, reanuda descargas y verifica tamaño y SHA-256 antes de publicar el
archivo local. Los renders se siguen ejecutando con la conexión SSH existente.

## Uso desde D:\hyperframes-studio

```powershell
& .\colab\bridge\bridge.ps1 connect
& .\colab\bridge\bridge.ps1 status
& .\colab\bridge\bridge.ps1 list
& .\colab\bridge\bridge.ps1 get -FileId master -Output 'D:\hyperframes-studio\irena-cine-20s\irena-cine-20s.mp4'
```

`connect` prepara el servicio y guarda la URL actual automáticamente. Requiere
que el alias `ssh colab` ya funcione. Colab debe seguir encendido.
Si ya existe el archivo final, el cliente evita sobrescribirlo. Una descarga
interrumpida queda en `<destino>.partial`; ejecutar de nuevo reanuda desde allí.

Para otro proyecto, editar `exports.json`: asignar identificadores a las rutas
absolutas de los archivos terminados en Colab. Volver a ejecutar `connect`
recarga la lista y reinicia solo el servicio propio si cambió su configuración.
No descargar archivos mientras aún están siendo renderizados.

## Resultado medido el 27-oct-2026

- HTTPS público de referencia: 5 MB en 1,216 s, unos 4,11 MB/s.
- Primer puente, transporte QUIC: 1 MiB en 9,508 s, 0,110 MB/s.
- Nueva ruta con HTTP/2: el mismo rango de 1 MiB en 0,968 s, 1,083 MB/s.
- Transferencia sostenida HTTP/2: 62.128.714 bytes en 9,457 s, 6,570 MB/s.
- Se reanudó desde 17.203.200 bytes y se verificó el archivo final completo:
  79.331.914 bytes; SHA256
  `9c9669aa9fd621b80085ada2c358bfbf2743cc3567a821ea6698e9431302f86c`.
- Video local: 20 s, 1080×1920, 30 fps, 600 frames; decodificación completa sin errores.

Son medidas de esta sesión. Se cambió tanto el transporte como el túnel/ruta;
no prueba que QUIC sea lento en general ni garantiza una velocidad constante.

## Acceso y alcance

El servidor escucha en 127.0.0.1:8765 dentro de Colab. Cloudflared publica HTTPS
con `--protocol http2`. Todas las rutas requieren un token Bearer. Se comprueba
401 sin token; solo se sirven los archivos explícitos de exports.json.
No expone terminal, ejecución de comandos, carpetas ni la llave SSH.

El token queda en `connection.local.json` y en el bootstrap privado local,
ignorados por Git. No compartir esos archivos. En Colab, configuración con
permisos 600 dentro de `/content/hyperframes-bridge`, directorio 700.
La URL temporal cambia si se recrea el túnel; `connect` actualiza la local.

Pruebas: `test_server.py` cubre autenticación, archivos no autorizados, HEAD,
rangos, sufijos y 416. `probe.py` compara un rango del máster con el prefijo
local. La descarga real verificó reanudación y hash completo.
