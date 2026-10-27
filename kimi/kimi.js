// Chat con Kimi K3.1 Pro desde la terminal.
// Uso:
//   node kimi.js "tu pregunta"                 -> respuesta rapida
//   node kimi.js                               -> chat interactivo (escribe "salir" para terminar)
//   node kimi.js --kit "haz un video de ..."   -> le pasa el KIT_VIDEOS_IA como contexto
// Opciones: --fast (kimi-k3)  --model <id>  --effort low|high|max
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import readline from "readline";

const key = process.env.MOONSHOT_API_KEY;
if (!key) {
  console.error("Falta MOONSHOT_API_KEY. Ejecuta: powershell -File set-key.ps1");
  process.exit(1);
}
const client = new OpenAI({ apiKey: key, baseURL: "https://api.moonshot.ai/v1" });

const args = process.argv.slice(2);
const flag = (f) => { const i = args.indexOf(f); if (i < 0) return false; args.splice(i, 1); return true; };
const opt = (f, d) => { const i = args.indexOf(f); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const fast = flag("--fast");
const model = opt("--model", fast ? "kimi-k3" : "kimi-k3.1-pro");
const effort = opt("--effort", "high");
const useKit = flag("--kit");

const messages = [];
if (useKit) {
  const kit = "D:\\hyperframes-studio\\KIT_VIDEOS_IA";
  const files = ["00_PROMPT_MAESTRO.md", "01_FLUJO_Y_REGLAS.md", "02_ESTILOS.md", "03_SONIDOS.md"];
  const ctx = files.map((f) => `### ${f}\n${fs.readFileSync(path.join(kit, f), "utf8")}`).join("\n\n");
  messages.push({ role: "system", content: "Sigue estas instrucciones del usuario al pie de la letra. No puedes ejecutar comandos: entrega archivos completos y comandos exactos para que el usuario los ejecute.\n\n" + ctx });
}

async function ask(text) {
  messages.push({ role: "user", content: text });
  const req = { model, messages, stream: true };
  if (model === "kimi-k3.1-pro") req.reasoning_effort = effort; // solo K3.1 Pro admite reasoning_effort
  const stream = await client.chat.completions.create(req);
  let out = "";
  for await (const chunk of stream) {
    const d = chunk.choices?.[0]?.delta?.content || "";
    out += d; process.stdout.write(d);
  }
  process.stdout.write("\n");
  messages.push({ role: "assistant", content: out });
}

try {
  if (args.length) { await ask(args.join(" ")); }
  else {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log(`Kimi (${model}, esfuerzo ${effort}). Escribe "salir" para terminar.`);
    for await (const line of rl) {
      if (/^(salir|exit)$/i.test(line.trim())) break;
      if (line.trim()) await ask(line);
      process.stdout.write("> ");
    }
    rl.close();
  }
} catch (e) {
  console.error("\nERROR:", e.status || "", e.message);
  if (e.status === 401) console.error("La clave no es valida. Vuelve a ponerla con set-key.ps1");
  if (e.status === 403 || e.status === 429) console.error("Revisa que hayas recargado saldo (minimo 1 $) en platform.kimi.ai");
  process.exit(1);
}
