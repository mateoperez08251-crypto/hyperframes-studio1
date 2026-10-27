// Une las dos transcripciones (0-61 s y 60-121.6 s) en audio/transcript.json
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = (p) => {
  const j = JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  return Array.isArray(j) ? j : j.words || j.segments || [];
};
const a = read("audio/ta/transcript.json");
const b = read("audio/tb/transcript.json").map((w) => ({ ...w, start: +(w.start + 60).toFixed(3), end: +(w.end + 60).toFixed(3) }));
const CUT = 60.6;
const words = [...a.filter((w) => w.start < CUT), ...b.filter((w) => w.start >= CUT)];
fs.writeFileSync(path.join(root, "audio/transcript.json"), JSON.stringify(words, null, 1));
// Vista compacta: una línea por cada ~8 palabras
let line = [];
words.forEach((w, i) => {
  line.push(w.start.toFixed(2) + ":" + w.text);
  if (line.length >= 8 || /[.?!]$/.test(w.text)) { console.log(line.join(" ")); line = []; }
});
if (line.length) console.log(line.join(" "));
console.log("TOTAL", words.length, "palabras, fin", words[words.length - 1].end);
