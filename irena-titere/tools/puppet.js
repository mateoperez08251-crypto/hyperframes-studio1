      // ---------- Títere de papel: piezas recortadas unidas con chinchetas ----------
      // Misma API que el antiguo stickman (pose, eyes, brows, mouth, dress, bun...), dibujado como cartulina.
      const SKIN = "#efd5ae", INKF = "#2a1d16", BRASS = "#c99a3e";
      const CLOTHES = ["#5d6b7f", "#7b5a47", "#56664f", "#6e5a70", "#8a7356", "#4f5d6b"];
      const HAIRS = ["#4a3426", "#2e2420", "#6b4a2e", "#3b3b40"];
      function paperShadow(on, k) {
        if (on) {
          ctx.shadowColor = "rgba(18,10,4," + 0.45 * (k == null ? 1 : k) + ")";
          ctx.shadowBlur = 7; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 6;
        } else {
          ctx.shadowColor = "rgba(0,0,0,0)"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        }
      }
      const darker = (c, k) => mix(c, "#140e0a", k);
      function bone(a, b, w, col, edge) {
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
        ctx.strokeStyle = edge; ctx.lineWidth = w; paperShadow(true); ctx.stroke();
        paperShadow(false);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
        ctx.strokeStyle = col; ctx.lineWidth = w - 3; ctx.stroke();
      }
      function pin(p, sil) {
        if (sil) return;
        circle(p[0], p[1], 4.8, "#6e4f18");
        circle(p[0], p[1], 3.7, BRASS);
        circle(p[0] - 1.2, p[1] - 1.2, 1.4, "#f6e3a0");
      }
      function poly(pts, fill, edge, shadow) {
        ctx.beginPath();
        pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
        ctx.closePath();
        if (shadow !== false) paperShadow(true);
        ctx.fillStyle = fill; ctx.fill();
        paperShadow(false);
        if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1.6; ctx.lineJoin = "round"; ctx.stroke(); }
      }
      // Hilo del que cuelga un decorado (nubes, luna, sol)
      function hang(x, y) { line([[x, y], [x + 2, -600]], "rgba(232,222,200,0.32)", 2); }

      function stick(o) {
        const s = o.s || 1, d = o.dir || 1, id = o.id || 1;
        const TH = 44, SH = 44, UA = 34, FA = 32, TORSO = 80, HR = 31;
        const p = o.pose || idlePose(id);
        const fy = (l) => Math.cos(l[0]) * TH + Math.cos(l[0] + l[1]) * SH;
        const hipH = Math.max(fy(p.lB), fy(p.lF)) + 4;
        const sq = o.sq || 1;
        const colStr = typeof o.col === "string" ? o.col : "";
        const sil = colStr === "#050507";
        const far = colStr === "#7f8898";
        const crowd = far || colStr === CROWD;
        const tone = (c) => (sil ? "#0a0a0c" : far ? mix(mix(c, "#7d7f86", 0.45), "#1a1c24", 0.3) : crowd ? mix(c, "#8d8c8a", 0.35) : c);
        const baseCloth = o.cloth || CLOTHES[id % CLOTHES.length];
        const skin = tone(o.headFill === "#2c3d2f" ? "#b9c79a" : o.skin || (crowd ? "#ddc6a2" : SKIN));
        const cloth = tone(baseCloth);
        const pants = tone(o.pants || darker(baseCloth, 0.35));
        const sleeve = tone(o.sleeve || (o.dress ? "#efe4cf" : baseCloth));
        const hairSrc = o.hair && o.hair !== CROWD && o.hair !== "#7f8898" ? o.hair : HAIRS[id % HAIRS.length];
        const hair = tone(hairSrc);
        const shoe = tone("#2a211d");
        const edge = (c) => (sil ? "#000000" : darker(c, 0.32));

        // La mano del titiritero: el títere tiembla un poquito en cada cuadro
        const wob = (hash(id * 7.7 + F12 * 1.37) - 0.5) * 0.035;
        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.rotate((o.rot || 0) + wob * (o.rot ? 0.3 : 1));
        ctx.scale(s * d * (1 + (1 - sq) * 0.6), s * sq);
        if (o.alpha != null) ctx.globalAlpha = o.alpha;
        ctx.lineJoin = "round";

        const hip = [0, -hipH + (o.bob || 0)];
        const lean = p.lean || 0;
        const u = [Math.sin(lean), -Math.cos(lean)];   // hacia arriba por el torso
        const n = [Math.cos(lean), Math.sin(lean)];    // perpendicular
        const at = (base, a, b) => [base[0] + u[0] * a + n[0] * b, base[1] + u[1] * a + n[1] * b];
        const neck = at(hip, TORSO, 0);
        const sh = at(hip, TORSO * 0.86, 0);
        const ht = lean + (p.tilt || 0) + (o.tilt || 0);
        const head = [neck[0] + Math.sin(ht) * (HR + 4), neck[1] - Math.cos(ht) * (HR + 4)];
        const limb = (base, a, L1, L2) => {
          const j = [base[0] + Math.sin(a[0]) * L1, base[1] + Math.cos(a[0]) * L1];
          const e = [j[0] + Math.sin(a[0] + a[1]) * L2, j[1] + Math.cos(a[0] + a[1]) * L2];
          return [base, j, e];
        };
        const legB = limb(at(hip, 0, -5), p.lB, TH, SH);
        const legF = limb(at(hip, 0, 5), p.lF, TH, SH);
        const armB = limb(sh, p.aB, UA, FA);
        const armF = limb(sh, p.aF, UA, FA);
        const legCol = o.dress ? tone("#3b302c") : pants;

        const drawLeg = (L) => {
          bone(L[0], L[1], 18, legCol, edge(legCol));
          bone(L[1], L[2], 16, legCol, edge(legCol));
          ctx.save(); ctx.translate(L[2][0], L[2][1]);
          poly([[-8, -6], [13, -6], [18, 2], [17, 5], [-9, 5]], shoe, null);
          ctx.restore();
          pin(L[1], sil);
        };
        const drawArm = (A) => {
          bone(A[0], A[1], 16, sleeve, edge(sleeve));
          bone(A[1], A[2], 14, sleeve, edge(sleeve));
          paperShadow(true); circle(A[2][0], A[2][1], o.fists ? 9 : 7.5, skin); paperShadow(false);
          circle(A[2][0], A[2][1], o.fists ? 9 : 7.5, null, edge(skin), 1.4);
          pin(A[1], sil);
        };

        drawArm(armB);
        drawLeg(legB);
        drawLeg(legF);
        // Cuello
        bone(at(hip, TORSO * 0.9, 0), neck, 12, skin, edge(skin));
        // Torso
        const torsoCol = o.dress ? tone(o.dress) : cloth;
        poly([at(hip, TORSO * 0.95, -18), at(hip, TORSO * 0.95, 18), at(hip, -6, 15), at(hip, -6, -15)], torsoCol, edge(torsoCol));
        if (!sil) {
          poly([at(hip, TORSO * 0.95, -8), at(hip, TORSO * 0.95, 8), at(hip, TORSO * 0.78, 0)], tone("#efe4cf"), null, false);
          if (!o.dress) { circle(...at(hip, TORSO * 0.55, 0), 2.6, edge(cloth)); circle(...at(hip, TORSO * 0.32, 0), 2.6, edge(cloth)); }
        }
        if (o.dress) {
          const dc = tone(o.dress);
          poly([at(hip, TORSO * 0.3, -13), at(hip, TORSO * 0.3, 13), at(hip, -46, 40), at(hip, -46, -40)], dc, edge(dc));
          poly([at(hip, -37, -37), at(hip, -37, 37), at(hip, -46, 40), at(hip, -46, -40)], darker(dc, 0.22), null, false);
          if (!sil) for (let k = -2; k <= 2; k++) circle(...at(hip, -18, k * 12), 2.2, rgba("#fff6dc", 0.55));
        }
        pin(at(hip, 0, -5), sil); pin(at(hip, 0, 5), sil);

        // Cabeza
        if (o.bun) {
          const bx = head[0] + Math.cos(ht + Math.PI * 1.2) * HR * 1.02;
          const by = head[1] + Math.sin(ht + Math.PI * 1.2) * HR * 1.02;
          paperShadow(true); circle(bx, by, 13, hair); paperShadow(false);
          circle(bx, by, 13, null, edge(hair), 1.4);
        }
        paperShadow(true); circle(head[0], head[1], HR, skin); paperShadow(false);
        circle(head[0], head[1], HR, null, edge(skin), 1.6);
        ctx.save();
        ctx.translate(head[0], head[1]);
        ctx.rotate(ht);
        if (o.hat && !sil) {
          const hc = tone("#3a3230");
          poly([[-HR * 0.7, -HR * 0.42], [HR * 0.74, -HR * 0.42], [HR * 0.6, -HR * 1.28], [-HR * 0.58, -HR * 1.28]], hc, edge(hc));
          poly([[-HR * 0.7, -HR * 0.62], [HR * 0.74, -HR * 0.62], [HR * 0.72, -HR * 0.5], [-HR * 0.69, -HR * 0.5]], tone("#7a2e26"), null, false);
          poly([[-HR - 8, -HR * 0.36], [HR + 12, -HR * 0.36], [HR + 10, -HR * 0.5], [-HR - 6, -HR * 0.5]], hc, edge(hc));
        } else if (!sil) {
          ctx.beginPath();
          ctx.arc(0, 0, HR + 1.5, Math.PI * 1.02, Math.PI * 1.98);
          const N = 9;
          for (let k = 0; k <= N; k++) {
            const xx = lerp(HR * 0.98, -HR * 0.98, k / N);
            ctx.lineTo(xx, -HR * (k % 2 ? 0.42 : 0.26) + (o.bun ? -3 : 0));
          }
          ctx.closePath();
          paperShadow(true, 0.7); ctx.fillStyle = hair; ctx.fill(); paperShadow(false);
        }
        // Cara (tinta sobre el papel)
        const col = INKF;
        const lx = o.look == null ? 6 : o.look;
        const ly = o.lookY || 0;
        const flw = 3;
        let eyes = o.eyes || "open";
        const bp = (T + id * 1.37) % 3.6;
        if (o.blink !== false && bp < 0.14 && eyes !== "closed" && eyes !== "happy") eyes = "closed";
        const ex = [lx - 10, lx + 10], ey = ly - 3;
        if (eyes === "open") { circle(ex[0], ey, 4, col); circle(ex[1], ey, 4, col); circle(ex[0] + 1.3, ey - 1.3, 1.2, "#fff6e6"); circle(ex[1] + 1.3, ey - 1.3, 1.2, "#fff6e6"); }
        else if (eyes === "wide") {
          circle(ex[0], ey, 7.5, "#fbf5ea", col, 2); circle(ex[1], ey, 7.5, "#fbf5ea", col, 2);
          circle(ex[0] + 1, ey, 3, col); circle(ex[1] + 1, ey, 3, col);
        } else if (eyes === "closed") {
          ctx.beginPath(); ctx.arc(ex[0], ey - 2, 5, Math.PI * 0.15, Math.PI * 0.85); ctx.strokeStyle = col; ctx.lineWidth = flw; ctx.stroke();
          ctx.beginPath(); ctx.arc(ex[1], ey - 2, 5, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
        } else if (eyes === "happy") {
          ctx.beginPath(); ctx.arc(ex[0], ey + 2, 5, Math.PI * 1.1, Math.PI * 1.9); ctx.strokeStyle = col; ctx.lineWidth = flw; ctx.stroke();
          ctx.beginPath(); ctx.arc(ex[1], ey + 2, 5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        }
        if (o.brows === "angry") {
          line([[ex[0] - 7, ey - 13], [ex[0] + 5, ey - 8]], col, flw);
          line([[ex[1] + 7, ey - 13], [ex[1] - 5, ey - 8]], col, flw);
        } else if (o.brows === "sad") {
          line([[ex[0] - 7, ey - 8], [ex[0] + 5, ey - 13]], col, flw);
          line([[ex[1] + 7, ey - 8], [ex[1] - 5, ey - 13]], col, flw);
        }
        if (!sil && eyes !== "none") {
          circle(lx - 15, ly + 9, 5.5, "rgba(214,104,90,0.42)");
          circle(lx + 16, ly + 9, 5.5, "rgba(214,104,90,0.42)");
        }
        const m = o.mouth || "flat";
        ctx.strokeStyle = col; ctx.lineWidth = flw; ctx.lineCap = "round";
        if (m === "smile") { ctx.beginPath(); ctx.arc(lx, ly + 6, 9, Math.PI * 0.18, Math.PI * 0.82); ctx.stroke(); }
        else if (m === "frown") { ctx.beginPath(); ctx.arc(lx, ly + 19, 8, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
        else if (m === "o") { circle(lx, ly + 12, 5, "#5a2a22", col, 2); }
        else if (m === "flat") { line([[lx - 7, ly + 12], [lx + 7, ly + 12]], col, flw); }
        else if (m === "grit") {
          ctx.beginPath(); ctx.rect(lx - 9, ly + 8, 18, 8); ctx.fillStyle = "#fbf5ea"; ctx.fill(); ctx.stroke();
          line([[lx - 9, ly + 12], [lx + 9, ly + 12]], col, 1.6);
        }
        if (o.face) o.face(ctx, lx, ly, col, flw);
        ctx.restore();
        pin(neck, sil);

        drawArm(armF);
        pin(sh, sil);
        if (o.extra) o.extra({ hip, neck, sh, head, handF: armF[2], handB: armB[2], elbowF: armF[1], col: "#efe4cf", lw: 7 });
        // Varilla del titiritero
        if (o.rod) {
          const h = armF[2];
          line([h, [h[0] + 26, h[1] + 1500]], "#6e4a2b", 4.5);
          line([[h[0] + 1, h[1]], [h[0] + 27, h[1] + 1500]], "rgba(255,226,170,0.25)", 1.5);
          pin(h, false);
        }
        ctx.restore();
      }
