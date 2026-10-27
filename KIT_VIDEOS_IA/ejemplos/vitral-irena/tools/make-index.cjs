// Genera index.html: escena + subtítulos + voz + efectos suaves sincronizados
const fs = require("fs");
const path = require("path");
const END = 121.6;
const CUTS = [8.24, 10.96, 19.28, 26.24, 30.56, 38.64, 45.28, 55.28, 62.08, 70.4, 77.52, 82.64, 92.16, 98.8, 105.2, 115.35];
// Pico de cada archivo (medido con `hyperframes audio --json`)
const PEAK = { "glass-chime": 0.418, "glass-sparkle": 0.027, "glass-shatter": 0.006, "whoosh-short": 0.162, swosh: 0.055, "impact-bass-1": 0.073 };
const LEN = { "glass-chime": 2.4, "glass-sparkle": 1.7, "glass-shatter": 0.62, "whoosh-short": 0.5, swosh: 0.3, "impact-bass-1": 2.0 };
const FRAME = 1 / 30;
const sfx = [];
// El momento visual de cada corte: la ola de cristales gira por el centro ~0.15 s antes del corte
CUTS.forEach((c, i) => {
  const file = i % 2 ? "glass-sparkle" : "glass-chime";
  sfx.push({ id: `sfx-corte${i + 1}`, file, at: c - 0.15, vol: file === "glass-chime" ? 0.6 : 0.1, fade: 0.8 });
});
sfx.push(
  { id: "sfx-irena-sube", file: "whoosh-short", at: 5.3, vol: 0.15 },
  { id: "sfx-muerte", file: "glass-sparkle", at: 7.36, vol: 0.1, fade: 0.8 },
  { id: "sfx-1940", file: "swosh", at: 11.3, vol: 0.2 },
  { id: "sfx-familias", file: "whoosh-short", at: 13.2, vol: 0.12 },
  { id: "sfx-ninos", file: "whoosh-short", at: 50.3, vol: 0.12 },
  { id: "sfx-tiras", file: "whoosh-short", at: 64.8, vol: 0.12 },
  { id: "sfx-1943", file: "impact-bass-1", at: 70.75, vol: 0.07, fade: 1.2 },
  { id: "sfx-ojo", file: "swosh", at: 73.95, vol: 0.18 },
  { id: "sfx-barrotes", file: "impact-bass-1", at: 78.0, vol: 0.07, fade: 1.2 },
  { id: "sfx-liberada", file: "glass-shatter", at: 87.36, vol: 0.35 },
  { id: "sfx-libro", file: "swosh", at: 105.35, vol: 0.18 },
  { id: "sfx-corazon", file: "glass-sparkle", at: 109.6, vol: 0.08, fade: 0.8 },
  { id: "sfx-compasion", file: "glass-chime", at: 118.85, vol: 0.6, fade: 0.8 }
);
const r3 = (n) => Math.round(n * 1000) / 1000;
const audio = sfx
  .map((s, i) => {
    const start = r3(Math.max(0, s.at + FRAME - PEAK[s.file]));
    const dur = r3(Math.min(LEN[s.file], END - start));
    return `      <audio id="${s.id}" class="clip" src="assets/sfx/${s.file}.mp3" data-start="${start}" data-duration="${dur}" data-track-index="${10 + i}" data-volume="${s.vol}"${s.fade ? ` data-fade-out="${s.fade}"` : ""}></audio>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Irena Sendler — Vitral Vivo</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: #07060c;
      }
      #root {
        position: relative;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${END}" data-width="1080" data-height="1920">
      <div id="story" data-composition-id="story" data-composition-src="compositions/story.html" data-start="0" data-duration="${END}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index: 1"></div>

      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${END}" data-track-index="2" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index: 2"></div>

      <!-- Voz completa (FineVoice, 121.6 s) -->
      <audio id="voice" class="clip" src="assets/voice/narracion.mp3" data-start="0" data-duration="${END}" data-track-index="3" data-volume="1" data-fade-out="0.1"></audio>

      <!-- Efectos suaves de cristal: el pico de cada uno cae 1 frame después de la acción visual -->
${audio}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(__dirname, "..", "index.html"), html, "utf8");
console.log("index.html:", sfx.length, "efectos");
