// Convierte compositions/story.html (stickman) en versión títere de papel
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "compositions", "story.html");
const puppet = fs.readFileSync(process.argv[2], "utf8");
let s = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

function rep(a, b) {
  if (!s.includes(a)) { console.error("NO ENCONTRADO:\n" + a); process.exit(1); }
  s = s.replace(a, b);
}

// 1) Rig: reemplaza la función stick completa
const i0 = s.indexOf("      function stick(o) {");
const i1 = s.indexOf("      // ---------- La Muerte ----------");
if (i0 < 0 || i1 < 0) { console.error("no encuentro stick()"); process.exit(1); }
s = s.slice(0, i0) + puppet + "\n" + s.slice(i1);

// 2) Stop-motion a 15 cuadros por segundo
rep("        T = clamp(t, 0, END);\n        F12 = Math.floor(T * 12);",
    "        T = Math.floor(clamp(t, 0, END) * 15 + 1e-6) / 15;\n        F12 = Math.floor(T * 15 + 1e-6);");

// 3) Suelo con borde cortado a tijera
rep(`      function ground(y, col, lineCol) {
        ctx.fillStyle = col;
        ctx.fillRect(-500, y, W + 1000, H - y + 600);
        if (lineCol) line([[-500, y], [W + 500, y]], lineCol, 4);
      }`,
`      function ground(y, col, lineCol) {
        ctx.beginPath();
        ctx.moveTo(-500, y + 4);
        for (let x = -500; x <= W + 500; x += 34) ctx.lineTo(x, y + (hash(x * 0.37 + y) - 0.5) * 7);
        ctx.lineTo(W + 500, H + 600); ctx.lineTo(-500, H + 600); ctx.closePath();
        ctx.shadowColor = "rgba(10,6,3,0.5)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = -5;
        ctx.fillStyle = col; ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0)"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        if (lineCol) {
          ctx.strokeStyle = lineCol; ctx.lineWidth = 3; ctx.setLineDash([14, 10]);
          ctx.beginPath(); ctx.moveTo(-500, y + 12); ctx.lineTo(W + 500, y + 12); ctx.stroke(); ctx.setLineDash([]);
        }
      }`);

// 4) Edificios de cartulina con sombra
rep(`          ctx.closePath();
          ctx.fill();
          if (!lights) return;`,
`          ctx.closePath();
          ctx.shadowColor = "rgba(8,5,3,0.55)"; ctx.shadowBlur = 9; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 5;
          ctx.fill();
          ctx.shadowColor = "rgba(0,0,0,0)"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
          if (!lights) return;`);

// 5) Nubes colgadas de hilos, con sombra de papel
rep(`        const blobs = [[0, 0, 90], [80, 20, 80], [-85, 25, 75], [160, 45, 60], [-160, 50, 55], [30, 50, 85]];
        blobs.forEach(([bx, by, r]) => circle(x + bx * s, y + by * s + 6 * s, r * s, rim));
        blobs.forEach(([bx, by, r]) => circle(x + bx * s, y + by * s, r * s, col));`,
`        const blobs = [[0, 0, 90], [80, 20, 80], [-85, 25, 75], [160, 45, 60], [-160, 50, 55], [30, 50, 85]];
        hang(x - 60 * s, y - 70 * s); hang(x + 90 * s, y - 50 * s);
        ctx.beginPath();
        blobs.forEach(([bx, by, r]) => { ctx.moveTo(x + bx * s + r * s, y + by * s); ctx.arc(x + bx * s, y + by * s, r * s, 0, Math.PI * 2); });
        paperShadow(true); ctx.fillStyle = col; ctx.fill(); paperShadow(false);
        blobs.forEach(([bx, by, r]) => circle(x + bx * s, y + by * s + 10 * s, r * s * 0.82, rgba("#000000", 0.08)));`);

// 6) Muro con sombra de capa
rep(`        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.fillStyle = "#2b1a15"; ctx.fillRect(x, y, w, h);`,
`        paperShadow(true); ctx.fillStyle = "#2b1a15"; ctx.fillRect(x, y, w, h); paperShadow(false);
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.fillStyle = "#2b1a15"; ctx.fillRect(x, y, w, h);`);

// 7) La Muerte de cartulina: sombra en la capa, chincheta en la mano
rep(`        ctx.fillStyle = "#07080b"; ctx.fill();
        ctx.strokeStyle = "#4a2f33"; ctx.lineWidth = 4; ctx.stroke();`,
`        paperShadow(true); ctx.fillStyle = "#14121a"; ctx.fill(); paperShadow(false);
        ctx.strokeStyle = "#4a2f33"; ctx.lineWidth = 4; ctx.stroke();`);
rep(`        circle(30, -110, 9, "#d8d2c6");`, `        circle(30, -110, 9, "#d8d2c6"); pin([30, -110], false); pin([-6, -150], false);`);

// 8) Sol y luna colgados de hilos
rep(`        if (isSun) {
          circle(ax, ay, 80, rgba("#ffd27a", 0.25));`,
`        hang(ax, ay - 50);
        if (isSun) {
          circle(ax, ay, 80, rgba("#ffd27a", 0.25));`);
rep(`        circle(170, 300, 46, "#e6e4dc");`, `        hang(170, 254); paperShadow(true); circle(170, 300, 46, "#e6e4dc"); paperShadow(false);`);

// 9) Mapa y paneles de cartulina
rep(`        ctx.fillStyle = mix("#181b24", "#8a2e28", fillK); ctx.fill();`,
`        paperShadow(true); ctx.fillStyle = mix("#2a2f3b", "#8a2e28", fillK); ctx.fill(); paperShadow(false);`);
rep(`        rrect(0, 0, PW, PH, 26);
        ctx.fillStyle = tint; ctx.fill();`,
`        rrect(0, 0, PW, PH, 26);
        paperShadow(true); ctx.fillStyle = tint; ctx.fill(); paperShadow(false);`);
rep(`        rrect(x, y, w, h, 18);
        ctx.fillStyle = "#ece4d3"; ctx.fill();`,
`        rrect(x, y, w, h, 18);
        paperShadow(true); ctx.fillStyle = "#ece4d3"; ctx.fill(); paperShadow(false);`);

// 10) Irena con varilla; el hombre del principio con sombrero
rep(`        return stick(Object.assign({ dress: GOLD, bun: true, hair: "#d9cdb8", id: 7 }, o));`,
    `        return stick(Object.assign({ dress: GOLD, bun: true, hair: "#7a4a2a", id: 7, rod: true }, o));`);
rep(`          x: 540, y: 1110, s: 2.3, id: 3, dir: 1, look: 3, lookY: -3,`,
    `          x: 540, y: 1110, s: 2.3, id: 3, dir: 1, look: 3, lookY: -3, hat: true, cloth: "#5b6474",`);
rep(`          col: mix("#efe6d6", "#bdb6aa", k),\n        });`, `        });`);
// En el retrato no hace falta la varilla
rep(`          mouth: "smile", lw: 6, jit: 0.8,`, `          mouth: "smile", rod: false,`);

// 11) Textura de papel + parpadeo de luz de stop-motion (en lugar del grano)
rep(`      const GRAIN = [];
      for (let g = 0; g < 4; g++) {`, `      const GRAIN = [];
      const PAPER = (function () {
        const c = document.createElement("canvas");
        c.width = 360; c.height = 360;
        const g = c.getContext("2d");
        const img = g.createImageData(360, 360);
        for (let y = 0; y < 360; y++) for (let x = 0; x < 360; x++) {
          const i = (y * 360 + x) * 4;
          const fib = Math.sin(x * 0.09 + Math.sin(y * 0.031) * 6) * Math.sin(y * 0.27 + x * 0.013);
          const v = 128 + (hash(x * 1.31 + y * 7.17) - 0.5) * 90 + fib * 26;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
        g.putImageData(img, 0, 0);
        return ctx.createPattern(c, "repeat");
      })();
      for (let g = 0; g < 4; g++) {`);
rep(`        ctx.globalAlpha = 0.5;
        ctx.fillStyle = GRAIN[F12 % 4];
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;`,
`        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = GRAIN[F12 % 4];
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
        // Luz que parpadea un poquito entre cuadros, como en stop-motion
        ctx.fillStyle = "rgba(255,214,150," + (0.035 + 0.03 * hash(F12 * 3.7)) + ")";
        ctx.fillRect(0, 0, W, H);`);

fs.writeFileSync(file, s, "utf8");
console.log("OK títere aplicado,", s.split("\n").length, "líneas");
