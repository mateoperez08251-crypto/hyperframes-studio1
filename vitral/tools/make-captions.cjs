// Genera compositions/captions.html desde audio/transcript.json (estilo Vitral Vivo)
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
let W = JSON.parse(fs.readFileSync(path.join(root, "audio/transcript.json"), "utf8"));

// ---- Correcciones del reconocimiento de voz ----
const out = [];
W.forEach((w) => {
  if (w.text === "quién." && Math.abs(w.start - 60.57) < 0.05) return; // duplicado del corte
  if (w.text === "judíaron") { out.push({ text: "judías", start: 14.4, end: 15.1 }, { text: "quedaron", start: 15.1, end: 15.84 }); return; }
  if (w.text === "habvertido") { out.push({ text: "habían", start: 22.56, end: 23.0 }, { text: "convertido", start: 23.0, end: 23.6 }); return; }
  if (w.text === "Irene") { out.push({ ...w, text: "Irena" }); return; }
  out.push(w);
});
W = out;

// ---- Palabras destacadas: em = dorado (luz), red = rubí (oscuridad) ----
const EM = ["irena", "sendler", "1940", "1943", "varsovia", "polonia", "niños", "nombres", "vida", "compasión", "misión", "red", "resistencia", "liberarla", "pequeños", "mujer", "hogares", "conventos", "orfanatos", "protegido", "extraordinaria"];
const RED = ["muerte", "oscuras", "oscuros", "encerradas", "hambre", "enfermedades", "miedo", "arrestaron", "torturaron", "condenaron", "destrucción", "peligrosa", "nazi", "atrapados", "secreta"];
const kindOf = (t) => {
  const k = t.toLowerCase().replace(/[.,;:!?¿¡]/g, "");
  return EM.includes(k) ? "em" : RED.includes(k) ? "red" : "";
};

// ---- Agrupar: máx 3 palabras / 17 letras; corta en puntuación o pausa ----
const G = [];
let cur = [];
W.forEach((w, i) => {
  const len = cur.map((c) => c.text).join(" ").length + (cur.length ? 1 : 0) + w.text.length;
  const prev = cur[cur.length - 1];
  if (cur.length && (cur.length >= 3 || len > 17 || /[.,;:?!]$/.test(prev.text) || w.start - prev.end > 0.3)) { G.push(cur); cur = []; }
  cur.push(w);
});
if (cur.length) G.push(cur);

const END = 121.6;
const r3 = (n) => Math.round(n * 1000) / 1000;
let html = "", js = "";
G.forEach((words, gi) => {
  const open = gi === 0 ? 0.1 : words[0].start;
  const close = gi === G.length - 1 ? END - 0.05 : Math.min(G[gi + 1][0].start, words[words.length - 1].end + 1.6);
  const id = `cap-g${gi + 1}`;
  html += `    <div id="${id}" class="cap clip" data-start="${r3(open)}" data-duration="${r3(close - open)}">\n`;
  html += `      <div class="cap-in">` + words.map((w, wi) => `<span id="${id}-w${wi + 1}" class="cw"><span class="ci">${w.text}</span></span>`).join("") + `</div>\n    </div>\n`;
  js += `      group("#${id}", ${r3(open)}, ${r3(close)}, [${words.map((w) => `[${r3(w.start)}, ${r3(w.end)}, "${kindOf(w.text)}"]`).join(", ")}]);\n`;
});

const tpl = `<template>
  <style>
    #root {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .cap {
      position: absolute;
      left: 0;
      top: 1440px;
      width: 100%;
      height: 190px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }
    /* Placa de cristal emplomado */
    .cap-in {
      display: inline-block;
      padding: 16px 48px 22px;
      text-align: center;
      font-family: "Playfair Display", serif;
      font-weight: 900;
      font-size: 76px;
      line-height: 1.1;
      white-space: nowrap;
      border: 7px solid #120d0b;
      border-radius: 26px 26px 26px 26px;
      background: linear-gradient(160deg, rgba(58, 34, 92, 0.92) 0%, rgba(24, 18, 52, 0.94) 55%, rgba(16, 38, 64, 0.94) 100%);
      box-shadow: 0 0 0 3px rgba(214, 170, 92, 0.55), inset 0 3px 0 rgba(255, 255, 255, 0.16), inset 0 -10px 24px rgba(0, 0, 0, 0.45), 0 18px 40px rgba(0, 0, 0, 0.6);
    }
    .cw {
      display: inline-block;
      margin: 0 0.17em;
    }
    .ci {
      display: inline-block;
      color: rgba(240, 228, 206, 0.42);
      text-shadow: 0 3px 0 rgba(0, 0, 0, 0.6);
    }
  </style>

  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
${html}  </div>

  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      const INK = "rgba(250, 242, 226, 1)";
      const DIM = "rgba(240, 228, 206, 0.42)";
      const GOLD = "rgba(255, 196, 84, 1)";
      const RED = "rgba(255, 102, 112, 1)";
      const fit = window.__hyperframes && window.__hyperframes.fitTextFontSize;

      function group(sel, open, close, words) {
        const g = document.querySelector(sel);
        const inner = g.querySelector(".cap-in");
        if (fit) {
          try {
            const r = fit(Array.from(inner.querySelectorAll(".ci")).map((s) => s.textContent).join(" "), { fontFamily: "Playfair Display", fontWeight: 900, maxWidth: 740, baseFontSize: 76, minFontSize: 44, step: 2 });
            if (r && r.fontSize) inner.style.fontSize = Math.min(76, r.fontSize) + "px";
          } catch (e) {}
        }
        // La placa entra girando como un cristal que se encaja en su plomo
        tl.fromTo(inner, { rotationX: -70, y: 30, opacity: 0, transformPerspective: 700 }, { rotationX: 0, transformPerspective: 700, y: 0, opacity: 1, duration: 0.24, ease: "back.out(1.6)" }, open);
        tl.to(inner, { opacity: 0, y: -14, duration: 0.12, ease: "power1.in" }, Math.max(open + 0.3, close - 0.12));
        const spans = g.querySelectorAll(".ci");
        words.forEach(([s, e, kind], i) => {
          const el = spans[i];
          const hi = kind === "red" ? RED : GOLD;
          const done = kind === "red" ? RED : kind === "em" ? GOLD : INK;
          const a = Math.max(open, s);
          tl.fromTo(el, { color: DIM }, { color: hi, duration: 0.06, ease: "none", immediateRender: false }, a);
          tl.fromTo(el, { scale: 1 }, { scale: 1.08, duration: 0.09, ease: "power2.out", immediateRender: false }, a);
          tl.fromTo(el, { scale: 1.08 }, { scale: 1, duration: 0.2, ease: "power2.out", immediateRender: false }, a + 0.09);
          tl.fromTo(el, { color: hi }, { color: done, duration: 0.12, ease: "none", immediateRender: false }, Math.max(a + 0.07, e));
        });
      }

${js}
      window.__timelines["captions"] = tl;
    })();
  </script>
</template>
`;
fs.mkdirSync(path.join(root, "compositions"), { recursive: true });
fs.writeFileSync(path.join(root, "compositions", "captions.html"), tpl, "utf8");
console.log("captions.html:", G.length, "grupos");
