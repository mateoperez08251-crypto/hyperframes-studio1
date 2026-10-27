# 04 — CONECTAR COLAB A CUALQUIER MODELO

Hay 3 niveles según el tipo de chatbot. **Elige según lo que uses.**

---

## Nivel 1 — Agentes con terminal (control TOTAL de Colab) ⭐ recomendado
**Sirve para:** Antigravity, Claude Code, Codex CLI (OpenAI/ChatGPT), Gemini CLI, Cursor, Windsurf, Cline.
Estos pueden ejecutar comandos en tu PC → se conectan a Colab por SSH y lo manejan solos.

1. Sube `colab/conexion-colab.ipynb` a Colab (**Archivo → Subir notebook**), elige la GPU,
   ejecuta la celda 2 y copia la dirección `xxxx.trycloudflare.com`.
2. En tu PC (o pídeselo al agente):
   ```powershell
   powershell -ExecutionPolicy Bypass -File D:\hyperframes-studio\colab\conectar.ps1 -HostName xxxx.trycloudflare.com
   ```
   Debe salir `CONECTADO` + tu GPU.
3. Pega esto al agente (además del prompt maestro):
   > Tienes un servidor Colab con GPU accesible con `ssh colab`.
   > - Ejecutar: `ssh colab "comando"`
   > - Subir: `scp -r carpeta colab:/content/`  ·  Bajar: `scp colab:/content/x.mp4 .`
   > - Instalar Node allí la primera vez:
   >   `ssh colab "curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs"`
   > - Renders largos con `nohup ... > render.log 2>&1 &` y revisa `tail -1 render.log` cada pocos minutos.
   > - Guarda resultados importantes en `/content/drive/MyDrive/hyperframes-studio` (si está montado)
   >   o bájalos al PC: Colab borra todo al desconectarse.

**Instalar los agentes gratis/baratos:**
| Agente | Instalar | Modelo |
|---|---|---|
| Gemini CLI | `npm i -g @google/gemini-cli` → `gemini` | Gemini (tiene plan gratis) |
| Codex CLI | `npm i -g @openai/codex` → `codex` | ChatGPT (entra con tu cuenta Plus/Pro) |
| Claude Code | `npm i -g @anthropic-ai/claude-code` → `claude` | Claude |
Ábrelos dentro de `D:\hyperframes-studio` para que vean el kit.

---

## Nivel 2 — Gemini dentro de Colab (sin instalar nada)
Colab trae Gemini integrado (botón ✨ / "Gemini" en la barra). Puede **crear y ejecutar
celdas él mismo** dentro del notebook.
1. Abre un notebook nuevo en Colab con tu GPU.
2. Sube `00_PROMPT_MAESTRO.md`, `01`, `02`, `03` a `/content` (icono de carpeta → subir).
3. Dile a Gemini: *"Lee los .md de /content y sigue el prompt maestro para: [tu pedido]"*.
Limitación: no ve tu PC; el resultado lo descargas desde el panel de archivos o Drive.

---

## Nivel 3 — Chat web (ChatGPT, Claude.ai, Gemini web, Qwen…)
No pueden ejecutar nada ni conectarse a Colab: **tú eres el puente**.
1. Pega el prompt maestro y adjunta `01`, `02`, `03` y el ejemplo del estilo.
2. Añade: *"No puedes ejecutar comandos. Dame el código en celdas de Colab numeradas,
   una por paso. Yo las ejecuto y te pego la salida o el error."*
3. Ejecuta cada celda en Colab y pégale la salida. Él corrige.
Funciona, pero es más lento y gasta más mensajes.

---

## Seguridad
- `colab/colab_key` es la llave privada: **no la subas a chats ni a GitHub**.
- Solo funciona mientras la celda de Colab esté corriendo; la dirección cambia cada vez.
- Para cortar el acceso: detén la celda o desconecta el entorno.
