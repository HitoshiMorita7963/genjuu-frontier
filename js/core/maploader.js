// マップ登録。マップデータ（js/data/maps/*.js）は G.registerMap() で登録する。
(function (G) {
  'use strict';

  G.MapData = {};

  G.registerMap = function (def) {
    def.h = def.tiles.length;
    def.w = def.tiles[0].length;
    def.tiles.forEach((row, i) => {
      if (row.length !== def.w) {
        console.warn(`[map ${def.id}] ${i}行目の幅が ${row.length}（期待値 ${def.w}）`);
      }
    });
    def.buildings = def.buildings || [];
    def.objects = def.objects || [];
    def.signs = def.signs || [];
    def.npcs = def.npcs || [];
    def.items = def.items || [];
    def.warps = def.warps || [];

    // 建物のドアを自動でワープに変換
    for (const b of def.buildings) {
      if (!b.door) continue;
      if (b.door.y === undefined) b.door.y = b.y + b.h - 1;
      // 施錠中のドアはワープ無効（unlockFlag で開く。判定は Field.doorLocked）
      if (b.door.to) {
        def.warps.push({
          x: b.door.x, y: b.door.y, to: b.door.to,
          tx: b.door.tx, ty: b.door.ty, dir: b.door.dir || 'up', building: b,
        });
      }
    }
    G.MapData[def.id] = def;
  };

  // マップを「塗る」ための小さな道具（文字の手打ちより崩れにくい）
  //   const b = G.MapBuilder(36, 28, '.'); b.rect(...); b.path(...); def.tiles = b.rows();
  G.MapBuilder = function (w, h, fill) {
    const g = Array.from({ length: h }, () => Array(w).fill(fill));
    const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
    let seed = 12345;
    const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const b = {
      w, h,
      get: (x, y) => (inb(x, y) ? g[y][x] : null),
      set(x, y, c) { if (inb(x, y)) g[y][x] = c; return b; },
      rect(x, y, rw, rh, c) { for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) b.set(i, j, c); return b; },
      // 外周を太さ t で塗る
      border(t, c) { b.rect(0, 0, w, t, c).rect(0, h - t, w, t, c).rect(0, 0, t, h, c).rect(w - t, 0, t, h, c); return b; },
      // 点を順に L 字でつなぐ道（太さ width）
      path(points, c, width = 1) {
        for (let k = 0; k + 1 < points.length; k++) {
          let [x1, y1] = points[k];
          const [x2, y2] = points[k + 1];
          while (x1 !== x2) { b.rect(x1, y1, width, width, c); x1 += Math.sign(x2 - x1); }
          while (y1 !== y2) { b.rect(x1, y1, width, width, c); y1 += Math.sign(y2 - y1); }
          b.rect(x2, y2, width, width, c);
        }
        return b;
      },
      // だ円形に塗る（池・草むらなど）
      blob(cx, cy, rx, ry, c) {
        for (let j = cy - ry; j <= cy + ry; j++) for (let i = cx - rx; i <= cx + rx; i++) {
          if (((i - cx) / (rx + 0.5)) ** 2 + ((j - cy) / (ry + 0.5)) ** 2 <= 1) b.set(i, j, c);
        }
        return b;
      },
      // 範囲内の onlyOn の上に c をまばらに置く（毎回同じ配置になる）
      scatter(c, n, x, y, rw, rh, onlyOn, s = 7) {
        seed = s;
        for (let k = 0; k < n; k++) {
          const i = x + Math.floor(rnd() * rw), j = y + Math.floor(rnd() * rh);
          if (!onlyOn || g[j] && onlyOn.includes(g[j][i])) b.set(i, j, c);
        }
        return b;
      },
      rows: () => g.map((r) => r.join('')),
    };
    return b;
  };

  G.mapTile = function (map, x, y) {
    if (x < 0 || y < 0 || x >= map.w || y >= map.h) return null;
    return map.tiles[y][x];
  };
})(window.Game);
