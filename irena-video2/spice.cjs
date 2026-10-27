const fs = require("fs");
const path = require("path");
const dir = path.resolve(__dirname);
const storyPath = path.join(dir, "compositions", "story.html");
const newScenes = fs.readFileSync(path.join(dir, "new-scenes.txt"), "utf8");

let s = fs.readFileSync(storyPath, "utf8");

// 1) Constantes
const subs = [
  ["const END = 19.6;", "const END = 20;"],
  ["const SHAKES = [[2.42, 9], [7.36, 20], [11.56, 12], [15.9, 10], [16.02, 16], [17.42, 6]];",
   "const SHAKES = [[11.0, 12], [17.6, 18], [18.4, 14]];"],
  ["const FLASHES = [[2.42, 0.6, \"#dfe6ff\"], [7.36, 0.32, \"#ff6a4d\"], [11.56, 0.25, \"#ffffff\"], [16.02, 0.18, \"#ffffff\"]];",
   "const FLASHES = [[11.0, 0.2, \"#ffffff\"], [17.6, 0.35, \"#ff5a4a\"], [18.4, 0.2, \"#ffe6d6\"]];"],
  ["const CUTS = [0, 4.32, 8.24, 10.96, 13.12, 16.48];",
   "const CUTS = [0, 2.1, 7.0, 11.0, 17.5];"],
  ["const SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8, scene9];",
   "const SCENES = [scene1, scene2, scene3, scene4, scene5];"],
];
for (const [a, b] of subs) {
  if (!s.includes(a)) { console.error("MARCADOR NO ENCONTRADO: " + a.slice(0, 60)); process.exit(2); }
  s = s.replace(a, b);
}

// 2) Reemplazo del bloque de escenas (de "ESCENA 1" hasta la capa de overlays)
const startTok = "      // ======================================================================\n      // ESCENA 1";
const endTok = "      // ---------- Grano de película";
const si = s.indexOf(startTok);
const ei = s.indexOf(endTok);
if (si < 0 || ei < 0 || si > ei) { console.error("Rango de escenas inválido si=" + si + " ei=" + ei); process.exit(3); }
s = s.slice(0, si) + newScenes + s.slice(ei);

fs.writeFileSync(storyPath, s);
console.log("story.html actualizado:", fs.statSync(storyPath).size, "bytes");
