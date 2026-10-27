// Genera compositions/captions.html a partir de los tiempos de palabra (transcripción corregida)
const fs = require("fs");
const path = require("path");

// [texto, inicio, fin, estilo]  estilo: "" normal | "em" dorado | "red" rojo
// Ventana B (0–20 s) · tramo "...quienes eran / 1943 / la arrestaron, la torturaron"
// times = transcribe(parakeet) - 2 s (la voz empieza en el mp3 60 s)
const G = [
  [["olvidaran", 0.08, 0.8], ["qui\u00e9nes", 0.8, 1.2], ["eran.", 1.36, 2.08]],
  [["Por", 2.08, 2.4], ["eso", 2.4, 2.72], ["conservaba", 2.96, 3.84]],
  [["registros", 3.84, 4.48]],
  [["secretos", 4.48, 5.12], ["con", 5.12, 5.36], ["sus", 5.36, 5.6]],
  [["verdaderos", 5.6, 6.32], ["nombres", 6.32, 7.04, "em"]],
  [["y", 7.04, 7.36], ["los", 7.36, 7.6]],
  [["lugares", 7.6, 8.08, "em"], ["donde", 8.08, 8.48]],
  [["hab\u00edan", 8.48, 8.96], ["sido", 8.96, 9.28]],
  [["escondidos.", 9.28, 10.48, "red"]],
  [["En", 10.48, 10.72]],
  [["1943,", 10.72, 13.12, "em"]],
  [["la", 13.12, 13.36], ["polic\u00eda", 13.36, 13.92]],
  [["secreta", 13.92, 14.48, "em"], ["nazi", 14.48, 14.96]],
  [["descubri\u00f3", 15.28, 16.08]],
  [["sus", 16.08, 16.32], ["actividades.", 16.32, 17.52, "red"]],
  [["La", 17.52, 17.76], ["arrestaron,", 17.76, 18.96, "red"]],
  [["la", 18.96, 19.28], ["torturaron", 19.28, 20, "red"]],
];
const LAST_CLOSE = 20;
const r3 = (n) => Math.round(n * 1000) / 1000;
let html = "";
let js = "";
G.forEach((words, gi) => {
  const open = gi === 0 ? 0.12 : words[0][1];
  const close = gi === G.length - 1 ? LAST_CLOSE : G[gi + 1][0][1];
  const id = `cap-g${gi + 1}`;
  html += `    <div id="${id}" class="cap clip" data-start="${r3(open)}" data-duration="${r3(close - open)}">\n`;
  html += `      <div class="cap-in">`;
  html += words
    .map((w, wi) => `<span id="${id}-w${wi + 1}" class="cw${w[3] ? " " + w[3] : ""}"><span class="ci">${w[0]}</span></span>`)
    .join(" ");
  html += `</div>\n    </div>\n`;
  js += `      group("#${id}", ${r3(open)}, [${words.map((w) => `[${r3(w[1])}, ${r3(w[2])}, "${w[3] || ""}"]`).join(", ")}]);\n`;
});

const out = `<template>
  <style>
    #root {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .cap {
      position: absolute;
      left: 0;
      top: 1330px;
      width: 100%;
      height: 170px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }
    .cap-in {
      display: block;
      width: 100%;
      padding: 0 90px;
      text-align: center;
      font-family: "Montserrat", sans-serif;
      font-weight: 800;
      font-size: 74px;
      line-height: 1.12;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .cw {
      display: inline-block;
    }
    .ci {
      display: inline-block;
      color: rgba(239, 230, 214, 0.55);
      text-shadow: 0 5px 0 rgba(0, 0, 0, 0.55), 0 0 22px rgba(0, 0, 0, 0.85), 0 0 4px rgba(0, 0, 0, 0.9);
    }
  </style>

  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
${html}  </div>

  <script>
    (function () {
      const tl = gsap.timeline({ paused: true });
      const INK = "rgba(239, 230, 214, 1)";
      const DIM = "rgba(239, 230, 214, 0.55)";
      const GOLD = "rgba(240, 182, 72, 1)";
      const RED = "rgba(236, 104, 84, 1)";
      const fit = window.__hyperframes && window.__hyperframes.fitTextFontSize;

      function group(sel, open, words) {
        const g = document.querySelector(sel);
        const inner = g.querySelector(".cap-in");
        if (fit) {
          try {
            const r = fit(inner.textContent.trim(), { fontFamily: "Montserrat", fontWeight: 800, maxWidth: 860, baseFontSize: 78, minFontSize: 42, step: 2 });
            if (r && r.fontSize) inner.style.fontSize = Math.min(78, r.fontSize) + "px";
          } catch (e) {}
        }
        tl.fromTo(inner, { y: 26, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.2, ease: "power3.out" }, open);
        const spans = g.querySelectorAll(".ci");
        words.forEach(([s, e, kind], i) => {
          const el = spans[i];
          const hi = kind === "red" ? RED : GOLD;
          const done = kind === "red" ? RED : kind === "em" ? GOLD : INK;
          const a = Math.max(open, s);
          tl.fromTo(el, { color: DIM }, { color: hi, duration: 0.06, ease: "none", immediateRender: false }, a);
          tl.fromTo(el, { scale: 1 }, { scale: 1.1, duration: 0.09, ease: "power2.out", immediateRender: false }, a);
          tl.fromTo(el, { scale: 1.1 }, { scale: 1, duration: 0.22, ease: "power2.out", immediateRender: false }, a + 0.09);
          tl.fromTo(el, { color: hi }, { color: done, duration: 0.12, ease: "none", immediateRender: false }, Math.max(a + 0.07, e));
        });
      }

${js}
      window.__timelines["captions"] = tl;
    })();
  </script>
</template>
`;

fs.writeFileSync(path.join(__dirname, "..", "compositions", "captions.html"), out, "utf8");
console.log("captions.html escrito:", G.length, "grupos");
