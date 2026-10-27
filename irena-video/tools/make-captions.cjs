// Genera compositions/captions.html a partir de los tiempos de palabra (transcripción corregida)
const fs = require("fs");
const path = require("path");

// [texto, inicio, fin, estilo]  estilo: "" normal | "em" dorado | "red" rojo
// Ventana A (0–19.3 s) · times de la voz FineVoice (transcribe parakeet)
const G = [
  [["En", 0, 0.32], ["medio", 0.32, 0.72], ["de", 0.72, 0.88], ["una", 0.88, 1.12]],
  [["de", 1.12, 1.28], ["las", 1.28, 1.44], ["épocas", 1.44, 2.16]],
  [["más", 2.16, 2.48], ["oscuras", 2.48, 3.12, "red"]],
  [["de", 3.12, 3.28], ["la", 3.28, 3.52], ["historia,", 3.52, 4.32]],
  [["hubo", 4.32, 4.8], ["una", 4.8, 5.04], ["mujer", 5.04, 5.44, "em"]],
  [["que", 5.44, 5.68], ["decidió", 5.68, 6.32], ["desafiar", 6.32, 7.12]],
  [["a", 7.12, 7.2], ["la", 7.2, 7.36], ["muerte.", 7.36, 8.24, "red"]],
  [["Su", 8.24, 8.56], ["nombre", 8.56, 8.88], ["era", 9.04, 9.36]],
  [["Irena", 9.36, 10.08, "em"], ["Sendler.", 10.08, 10.96, "em"]],
  [["En", 10.96, 11.28], ["1940,", 11.28, 13.12, "em"]],
  [["miles", 13.12, 13.68], ["de", 13.68, 13.84], ["familias", 13.84, 14.4], ["judías", 14.4, 15.84]],
  [["quedaron", 15.84, 16.48], ["encerradas", 16.48, 17.12, "red"]],
  [["en", 17.12, 17.2], ["el", 17.2, 17.36], ["gueto", 17.36, 17.72], ["de", 17.72, 17.88], ["Varsovia,", 17.88, 18.92, "em"]],
  [["en", 18.92, 19.08], ["Polonia.", 19.08, 19.6, "em"]],
];
const LAST_CLOSE = 19.6;

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
