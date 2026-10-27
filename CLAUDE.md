# Instrucciones para el agente (se leen solas al abrir Claude Code en esta carpeta)

Antes de hacer cualquier video, lee en este orden:
1. `KIT_VIDEOS_IA/00_PROMPT_MAESTRO.md` — cómo trabajar con el usuario.
2. `KIT_VIDEOS_IA/01_FLUJO_Y_REGLAS.md` — flujo, comandos y **errores conocidos**.
3. `KIT_VIDEOS_IA/02_ESTILOS.md` y `KIT_VIDEOS_IA/03_SONIDOS.md` — el estilo y sonido pedidos.
4. `CONTEXTO.md` — historial de videos terminados.

Reglas rápidas:
- Español, respuestas cortas. Corrige la ortografía del texto en pantalla.
- Windows + PowerShell. C: casi lleno: todo en D:, temporales en `D:\hf-temp`.
- CLI fijo: `npx --yes hyperframes@0.8.193 <comando>`.
- Renders largos desacoplados con `render-run.bat` (ver 01). No vigilar el log cada pocos segundos.
- No digas "listo" sin lint + check + capturas revisadas + MP4 verificado.
- Si hay Colab conectado: `ssh colab "comando"` (ver `KIT_VIDEOS_IA/04_CONECTAR_OTROS_MODELOS.md`).
