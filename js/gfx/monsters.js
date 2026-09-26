// 幻獣のドット絵生成（32×32ドット）。体型(plan)ごとの描画関数＋色・部位パラメータで個性を出す。
// 図形で描いた後、アルファを2値化して輪郭線を自動で付けるので、ドット絵らしい見た目になる。
(function (G) {
  'use strict';

  const N = 32;
  const OUTLINE = [30, 22, 40];
  const EYE = '#1e1628';
  const cache = new Map();
  const shade = (c, a) => G.Sprites.shade(c, a);

  function painter(ctx) {
    return {
      ell(x, y, rx, ry, c, rot = 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill(); },
      rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); },
      poly(pts, c) {
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath(); ctx.fill();
      },
      ring(x, y, rx, ry, c, w) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); },
    };
  }

  function eyes2(g, x1, x2, y, col = EYE) {
    g.rect(x1, y, 2, 3, col); g.rect(x2, y, 2, 3, col);
    g.rect(x1, y, 1, 1, '#ffffff'); g.rect(x2, y, 1, 1, '#ffffff');
  }

  // ---------------- 体型ごとの描画 ----------------
  const PLANS = {
    quad(g, L) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3, d1 = shade(c1, -35);
      // しっぽ
      if (L.tail === 'flame') {
        g.ell(26, 15, 4, 5.5, c3); g.poly([[23, 13], [27, 3], [30, 13]], c3); g.ell(26, 16, 2.2, 3, '#fff6c0');
      } else if (L.tail === 'bushy') {
        g.ell(27, 17, 4.5, 4, c1); g.ell(28, 16, 2.5, 2, c2);
      } else if (L.tail === 'thin') {
        g.rect(24, 19, 5, 2, c1); g.rect(27, 12, 2, 8, c1);
      } else if (L.tail === 'flat') {
        g.ell(27, 24, 5, 2.2, d1);
      } else if (L.tail === 'bolt') {
        g.poly([[23, 19], [28, 12], [27, 16], [31, 10], [28, 20], [29, 17]], c3);
      }
      g.rect(20, 23, 3, 7, d1); g.rect(12, 23, 3, 7, d1);            // 奥の脚
      g.ell(17, 21, 9, 6, c1);                                        // 胴
      g.ell(16, 24, 6, 2.5, c2);                                      // 腹
      g.rect(9, 24, 3, 6, c1); g.rect(21, 24, 3, 6, c1);              // 手前の脚
      g.rect(9, 29, 3, 1, d1); g.rect(21, 29, 3, 1, d1);
      if (L.mane) g.ell(12, 15, 6, 7, L.mane);
      g.ell(9, 14, 7, 6, c1);                                         // 頭
      if (L.ears === 'pointy') {
        g.poly([[4, 11], [5, 3], [10, 9]], c1); g.poly([[9, 9], [13, 3], [15, 11]], c1);
        g.poly([[5.5, 10], [6, 5.5], [8.5, 9]], c2); g.poly([[10.5, 9], [12.5, 5.5], [13.5, 10]], c2);
      } else if (L.ears === 'round') {
        g.ell(5, 9, 2.5, 2.5, c1); g.ell(13, 9, 2.5, 2.5, c1);
        g.ell(5, 9, 1.2, 1.2, c2); g.ell(13, 9, 1.2, 1.2, c2);
      } else if (L.ears === 'long') {
        g.ell(6, 4, 1.8, 5.5, c1); g.ell(11, 3, 1.8, 6, c1);
        g.ell(6, 4, 0.8, 4, c2); g.ell(11, 3, 0.8, 4.5, c2);
      }
      if (L.horn) g.poly([[8, 9], [10, 1], [12, 9]], L.horn);
      g.ell(5, 17, 3.2, 2.4, c2);                                     // 口元
      if (L.nose === 'pink') g.ell(2.5, 16, 1.8, 1.4, '#f08a9a');
      else if (L.nose === 'drill') g.poly([[4, 14], [-1, 16.5], [4, 19]], c3);
      else g.rect(2, 16, 2, 1, EYE);
      eyes2(g, 5, 10, 12, L.eyes || EYE);
    },

    dragon(g, L, f) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3, d1 = shade(c1, -35);
      if (L.halo) g.ring(10, 3, 6, 1.8, c3, 1.5);
      // 翼
      const wing = f ? [[15, 17], [19, 1], [31, 4], [25, 15]] : [[15, 17], [21, 4], [31, 10], [24, 17]];
      g.poly(wing, shade(c1, -20));
      g.poly(f ? [[17, 16], [20, 4], [27, 7]] : [[17, 16], [22, 6], [28, 11]], c2);
      g.poly([[24, 20], [31, 25], [31, 29], [21, 25]], c1);           // しっぽ
      g.rect(20, 23, 3, 7, d1); g.rect(12, 23, 3, 7, d1);
      g.ell(17, 20, 8.5, 6.5, c1);
      g.ell(15, 23, 5, 3, c2);
      g.poly([[15, 14], [17, 10], [19, 14]], c3); g.poly([[20, 15], [22, 11], [24, 16]], c3);
      g.rect(9, 23, 3, 7, c1); g.rect(20, 24, 3, 6, c1);
      g.ell(9, 13, 6.5, 5.5, c1);
      g.poly([[7, 9], [8, 1], [11, 8]], c3); g.poly([[11, 9], [15, 3], [14, 10]], c3);
      g.ell(4, 15, 3.8, 2.6, c1);
      g.rect(1, 14, 1, 1, EYE);
      g.rect(6, 11, 2, 2, EYE); g.rect(6, 11, 1, 1, '#ffffff');
    },

    bird(g, L, f) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3, d1 = shade(c1, -30);
      if (L.bat) {
        const wy = f ? -3 : 0;
        g.poly([[14, 17], [2, 6 + wy], [5, 12 + wy], [1, 17 + wy], [9, 19]], c2);
        g.poly([[18, 17], [30, 6 + wy], [27, 12 + wy], [31, 17 + wy], [23, 19]], c2);
        g.ell(16, 19, 6, 6.5, c1);
        g.poly([[11, 14], [11, 7], [15, 13]], c1); g.poly([[17, 13], [21, 7], [21, 14]], c1);
        g.rect(12, 17, 2, 2, c3); g.rect(18, 17, 2, 2, c3);
        g.rect(14, 22, 1, 2, '#ffffff'); g.rect(17, 22, 1, 2, '#ffffff');
        g.rect(13, 25, 1, 3, d1); g.rect(18, 25, 1, 3, d1);
        return;
      }
      if (L.flame) { g.ell(27, 16, 3.5, 6, '#ffd23a'); g.poly([[24, 14], [30, 5], [31, 16]], '#ffd23a'); g.ell(27, 18, 2, 3, '#fff6c0'); }
      g.poly([[22, 19], [31, 14], [31, 24]], d1);                    // 尾羽
      g.rect(13, 25, 1, 4, c3); g.rect(18, 25, 1, 4, c3);
      g.rect(11, 29, 3, 1, c3); g.rect(17, 29, 3, 1, c3);
      g.ell(16, 19, 8, 8, c1);
      g.ell(14, 21, 5, 5.5, c2);
      if (f) g.poly([[15, 17], [23, 5], [27, 16]], L.flame ? '#ffd23a' : d1);
      else g.ell(20, 19, 6, 4.5, L.flame ? '#f0a03a' : d1);
      if (L.crest) { g.poly([[11, 12], [13, 4], [16, 11]], L.crest); g.poly([[14, 11], [18, 5], [19, 12]], L.crest); }
      if (L.deco === 'owl') {
        g.poly([[9, 12], [9, 6], [13, 11]], c1); g.poly([[19, 11], [23, 6], [23, 12]], c1);
        g.ell(12, 15, 3, 3, '#ffffff'); g.ell(19, 15, 3, 3, '#ffffff');
        g.rect(11, 14, 2, 2, EYE); g.rect(18, 14, 2, 2, EYE);
        g.poly([[14.5, 17], [16, 20], [17.5, 17]], c3);
      } else {
        g.rect(10, 13, 2, 2, EYE); g.rect(10, 13, 1, 1, '#ffffff');
        g.poly([[4, 16], [9, 13.5], [9, 17.5]], c3);
      }
    },

    blob(g, L) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3;
      if (L.deco === 'tree') {
        g.rect(14, 5, 4, 11, L.accent || '#8a5a32');
        g.ell(16, 7, 11, 6, c3); g.ell(8, 10, 5, 4, c3); g.ell(24, 10, 5, 4, c3);
        g.ell(13, 5, 4, 2, shade(c3, 40));
      }
      if (L.deco === 'bud') {
        g.ell(10, 17, 4, 2, '#4fa04a', -0.4); g.ell(22, 17, 4, 2, '#4fa04a', 0.4);
        g.poly([[10, 18], [16, 3], [22, 18]], c3);
        g.poly([[13, 16], [16, 6], [16, 16]], shade(c3, 30));
      }
      g.ell(16, 23, 10, 7.5, c1);
      g.ell(16, 28, 8, 2, shade(c1, -25));
      g.ell(11, 19, 2.5, 1.5, shade(c1, 45));
      if (L.deco === 'sprout') {
        g.rect(15, 10, 2, 7, c3);
        g.ell(12, 10, 4, 2.2, c3, -0.5); g.ell(20, 10, 4, 2.2, c3, 0.5);
      } else if (L.deco === 'flower') {
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          g.ell(16 + Math.cos(a) * 5, 12 + Math.sin(a) * 4, 3.2, 3.2, L.accent || c3);
        }
        g.ell(16, 12, 2.6, 2.6, '#ffe070');
      } else if (L.deco === 'cap') {
        g.ell(16, 17, 13, 7.5, c2);
        g.rect(3, 19, 26, 6, c1);
        g.ell(16, 23, 10, 5, c1);
        g.ell(10, 14, 2.2, 1.6, c3); g.ell(17, 12, 2.6, 2, c3); g.ell(23, 16, 2, 1.5, c3);
      } else if (L.deco === 'moss') {
        g.ell(9, 17, 4, 3, c1); g.ell(16, 15, 5, 3.5, c1); g.ell(23, 17, 4, 3, c1);
        g.rect(8, 15, 1, 1, c3); g.rect(15, 13, 1, 1, c3); g.rect(22, 16, 1, 1, c3); g.rect(19, 14, 1, 1, c3);
      }
      eyes2(g, 11, 19, 21);
      g.rect(15, 25, 2, 1, EYE);
      g.ell(9, 25, 1.5, 1, '#f0a0a0'); g.ell(23, 25, 1.5, 1, '#f0a0a0');
    },

    spirit(g, L, f) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3;
      const y = f ? -1 : 0;
      if (L.wings) { g.ell(7, 15 + y, 4, 6.5, c2, -0.4); g.ell(25, 15 + y, 4, 6.5, c2, 0.4); }
      g.poly([[8, 21 + y], [9, 9 + y], [13, 13 + y], [16, 3 + y], [19, 13 + y], [23, 9 + y], [24, 21 + y]], c1);
      g.ell(16, 20 + y, 8, 7.5, c1);
      g.poly([[12, 25 + y], [16, 31], [20, 25 + y]], c1);
      g.ell(16, 21 + y, 5, 5, c2);
      g.rect(9, 11 + y, 1, 1, c3); g.rect(23, 12 + y, 1, 1, c3);
      eyes2(g, 12, 18, 19 + y);
      if (L.halo) g.ring(16, 3 + y, 6, 1.8, c3, 1.5);
    },

    golem(g, L) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3, d1 = shade(c1, -25);
      g.rect(9, 24, 5, 6, d1); g.rect(18, 24, 5, 6, d1);
      g.rect(2, 12, 5, 11, d1); g.rect(25, 12, 5, 11, d1);
      g.ell(4.5, 24, 3, 2.5, c1); g.ell(27.5, 24, 3, 2.5, c1);
      g.rect(7, 12, 18, 14, c1);
      g.ell(16, 12, 9, 3, c1);
      g.rect(10, 15, 12, 8, c2);
      g.rect(10, 4, 12, 8, c1);
      g.rect(12, 7, 3, 2, c3); g.rect(17, 7, 3, 2, c3);
      g.rect(13, 18, 1, 3, d1); g.rect(18, 16, 1, 2, d1);
      if (L.moss) { g.ell(16, 4, 7, 2, '#5a9a4a'); g.ell(9, 12, 3, 1.5, '#5a9a4a'); g.ell(23, 12, 3, 1.5, '#5a9a4a'); }
    },

    bug(g, L) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3;
      g.rect(11, 25, 1, 5, c2); g.rect(16, 26, 1, 4, c2); g.rect(22, 26, 1, 4, c2);
      g.ell(19, 20, 10, 7, c1);
      g.rect(19, 13, 1, 14, shade(c1, -45));
      g.ell(15, 17, 3, 2, shade(c1, 55));
      g.ell(8, 22, 4.5, 4, c2);
      g.poly([[6, 20], [2, 7], [5, 9], [9, 19]], shade(c1, -20));
      g.poly([[2, 3], [3, 7], [1, 7]], c3); g.rect(3, 5, 2, 1, c3);
      g.rect(5, 21, 2, 2, c3);
    },

    fish(g, L) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3;
      g.poly([[21, 19], [31, 10], [28, 19], [31, 28]], c3);
      g.poly([[9, 14], [16, 6], [20, 14]], c3);
      g.ell(14, 19, 11, 7, c1);
      g.ell(13, 22, 8, 3, c2);
      g.ell(16, 20, 3, 2, shade(c1, -20));
      g.ell(7, 17, 2.5, 2.5, '#ffffff'); g.rect(6, 17, 2, 2, '#8ab0c8');
      g.rect(3, 20, 2, 1, EYE);
    },

    serpent(g, L) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3;
      g.ell(18, 26, 11, 4, shade(c1, -20));
      g.ell(18, 23, 9, 3.5, c1);
      g.ell(19, 20, 6, 3, shade(c1, -15));
      g.poly([[8, 12], [14, 12], [17, 21], [11, 21]], c1);
      g.rect(12, 14, 2, 6, c2);
      g.ell(9, 10, 6, 4.5, c1);
      g.ell(6, 12, 4, 2, c2);
      g.rect(7, 8, 2, 2, '#f0e040'); g.rect(8, 8, 1, 2, EYE);
      g.rect(0, 12, 3, 1, '#e04050');
      if (L.deco === 'leaves') {
        g.ell(14, 7, 3.5, 1.6, c3, -0.6); g.ell(24, 19, 3, 1.5, c3, 0.5); g.ell(10, 25, 3, 1.5, c3, -0.3);
      }
    },

    imp(g, L, f) {
      const c1 = L.c1, c2 = L.c2, c3 = L.c3, d1 = shade(c1, -30);
      const wy = f ? -2 : 0;
      g.poly([[13, 17], [3, 9 + wy], [6, 14 + wy], [3, 19 + wy], [12, 20]], d1);
      g.poly([[19, 17], [29, 9 + wy], [26, 14 + wy], [29, 19 + wy], [20, 20]], d1);
      g.rect(20, 23, 7, 1.6, c1); g.poly([[26, 20], [30, 22.5], [26, 25]], c3);
      if (L.blade) { g.rect(24, 5, 2, 18, '#e8ecff'); g.rect(22, 21, 6, 2, c3); }
      g.rect(12, 25, 3, 5, c1); g.rect(17, 25, 3, 5, c1);
      g.rect(9, 19, 3, 5, c1); g.rect(20, 19, 3, 5, c1);
      g.ell(16, 21, 6, 5.5, c1);
      g.ell(16, 22, 3.5, 3.5, c2);
      g.ell(16, 12, 7.5, 6.5, c1);
      g.poly([[10, 9], [9, 1], [13, 7]], c3); g.poly([[19, 7], [23, 1], [22, 9]], c3);
      g.rect(12, 11, 3, 2, c3); g.rect(18, 11, 3, 2, c3);
      g.rect(13, 11, 1, 2, EYE); g.rect(19, 11, 1, 2, EYE);
      g.rect(13, 15, 6, 1, EYE); g.rect(14, 16, 1, 1, '#ffffff'); g.rect(17, 16, 1, 1, '#ffffff');
    },
  };

  // 2値化＋輪郭線
  function finish(ctx) {
    const img = ctx.getImageData(0, 0, N, N);
    const d = img.data;
    const solid = new Uint8Array(N * N);
    for (let i = 0; i < N * N; i++) {
      if (d[i * 4 + 3] >= 110) { d[i * 4 + 3] = 255; solid[i] = 1; } else d[i * 4 + 3] = 0;
    }
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = y * N + x;
        if (solid[i]) continue;
        const nb = (x > 0 && solid[i - 1]) || (x < N - 1 && solid[i + 1]) || (y > 0 && solid[i - N]) || (y < N - 1 && solid[i + N]);
        if (nb) { d[i * 4] = OUTLINE[0]; d[i * 4 + 1] = OUTLINE[1]; d[i * 4 + 2] = OUTLINE[2]; d[i * 4 + 3] = 255; }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function render(speciesId, frame) {
    const sp = G.Species[speciesId];
    const L = sp.look;
    // 1) 等倍で描く
    const base = document.createElement('canvas');
    base.width = base.height = N;
    const bctx = base.getContext('2d');
    (PLANS[L.plan] || PLANS.blob)(painter(bctx), L, frame);
    // 2) 体格に合わせて縮小（足元基準）→ 2値化・輪郭
    const out = document.createElement('canvas');
    out.width = out.height = N;
    const ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const s = Math.min(1, L.scale || 1) * 0.94;
    const w = Math.round(N * s);
    const bob = frame && L.plan !== 'spirit' ? 1 : 0;
    ctx.drawImage(base, 0, 0, N, N, Math.round((N - w) / 2), N - 1 - w + bob, w, w);
    finish(ctx);
    return out;
  }

  G.MonsterGfx = {
    SIZE: N,
    canvas(speciesId, frame = 0) {
      const key = speciesId + '|' + frame;
      let c = cache.get(key);
      if (!c) { c = render(speciesId, frame); cache.set(key, c); }
      return c;
    },
    // 図鑑の「見ただけ」用シルエット
    silhouetteURL(speciesId) {
      const key = 'sil|' + speciesId;
      let u = cache.get(key);
      if (!u) {
        const c = document.createElement('canvas');
        c.width = c.height = N;
        const ctx = c.getContext('2d');
        ctx.drawImage(G.MonsterGfx.canvas(speciesId, 0), 0, 0);
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = '#2a2e48';
        ctx.fillRect(0, 0, N, N);
        u = c.toDataURL();
        cache.set(key, u);
      }
      return u;
    },
    dataURL(speciesId, frame = 0) {
      const key = 'url|' + speciesId + '|' + frame;
      let u = cache.get(key);
      if (!u) { u = G.MonsterGfx.canvas(speciesId, frame).toDataURL(); cache.set(key, u); }
      return u;
    },
  };
})(window.Game);
