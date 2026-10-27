# KIT VIDEOS IA — HyperFrames Studio

Todo lo necesario para que **cualquier modelo** (Claude, Gemini, GPT, Qwen…)
haga videos como el de Irena Sendler sin repetir los errores ya resueltos.

## Cómo usarlo (3 pasos)
1. Abre un chat nuevo con el modelo (mejor si tiene acceso a archivos y terminal,
   como Antigravity, Claude Code o Cursor).
2. Abre [00_PROMPT_MAESTRO.md](00_PROMPT_MAESTRO.md), copia el bloque entre `=====`,
   rellena **TU PEDIDO** y pégalo.
3. Si el modelo NO tiene acceso a tus archivos (chat web), adjunta además
   `01`, `02` y `03`, y el ejemplo del estilo que quieras.

## Qué hay aquí
| Archivo / carpeta | Para qué |
|---|---|
| `00_PROMPT_MAESTRO.md` | El texto que se pega al modelo + mini-prompts de corrección |
| `01_FLUJO_Y_REGLAS.md` | Paso a paso, comandos exactos, **tabla de errores conocidos**, checklist |
| `02_ESTILOS.md` | 10 estilos: paleta, fuente, técnica, movimiento, sonido |
| `03_SONIDOS.md` | Volúmenes, sincronía exacta, paquetes de efectos por estilo, música |
| `04_CONECTAR_OTROS_MODELOS.md` | Cómo usar Colab con ChatGPT, Gemini, Claude, Codex, etc. |
| `colab/` | Notebook de conexión (`conexion-colab.ipynb`) + `conectar.ps1` |
| `plantilla/render-run.bat` | Render que no se corta (temporales en D:) + versiones fine/redes |
| `plantilla/tools/add-music.ps1` | Música de fondo con la voz siempre por encima |
| `ejemplos/vitral-irena/` | ✅ Proyecto completo del video de Irena (estilo vitral) |
| `ejemplos/claude-bestia/` | ✅ Tipografía cinética de choque |
| `sonidos/` | Efectos ya descargados (con `CREDITS.md`) |
| `guias/` | Las guías originales (stickman, 10 estilos, prompts, flujo técnico) |

## Atajos para ti
- **Solo cambiar la música:**
  `powershell -ExecutionPolicy Bypass -File tools\add-music.ps1 -Video X-fine.mp4 -Music "musica.mp3" -MusicVol 0.4 -Redes`
- **Relanzar un render que se cortó (luz, etc.):** doble clic en `render-run.bat` del proyecto.
