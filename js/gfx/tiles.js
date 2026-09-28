// タイルのドット絵をCanvasで生成してキャッシュする（画像素材なし）
(function (G) {
  'use strict';

  const T = G.TILE;
  const U = 2; // 1ドット = 2論理px（16×16ドット/タイル）
  const cache = new Map();

  const C = {
    grass: '#79c25c', grassD: '#5fa845', grassL: '#9bdc7c',
    tall: '#4e9a3e', tallD: '#347a2a', tallL: '#7cc65c',
    path: '#dfc28c', pathD: '#c7a468', pathL: '#efd8aa',
    plaza: '#d4cdbd', plazaD: '#b3ab98', plazaL: '#e8e2d4',
    water: '#3f8ad8', waterD: '#2f6fb8', waterL: '#8cc4f4', shore: '#e8d9a8',
    leaf: '#3c8c3a', leafD: '#26602a', leafL: '#5db34c', trunk: '#7a4e2a', trunkD: '#5a381e',
    rock: '#9a9aa8', rockD: '#62627a', rockL: '#c8c8d4',
    floor: '#c99a62', floorD: '#ad7f4c',
    wallpaper: '#f1e4c6', wallStripe: '#e3d0a8', wallTrim: '#8a6a4a', wallTop: '#4a3a30', wallTopL: '#5f4c3e',
    wood: '#8a5a32', woodD: '#643e20', woodL: '#b88250',
  };
  const BOOKS = ['#c0443a', '#3a6ac0', '#3a9a5a', '#d8a83a', '#8a4ab0', '#e07a3a'];

  function P(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x * U, y * U, w * U, h * U); }

  // ---------- 屋外 ----------
  function grass(ctx, r) {
    P(ctx, 0, 0, 16, 16, C.grass);
    for (let i = 0; i < 5; i++) {
      const x = 1 + Math.floor(r() * 13), y = 2 + Math.floor(r() * 13);
      P(ctx, x, y, 1, 1, C.grassD);
      P(ctx, x + 1, y - 1, 1, 1, C.grassD);
      if (r() < 0.5) P(ctx, x - 1, y - 1, 1, 1, C.grassL);
    }
  }

  function flowers(ctx, r) {
    grass(ctx, r);
    const cols = ['#fff4f0', '#ff8fb0', '#ffd84a', '#b8a0ff'];
    for (let i = 0; i < 3; i++) {
      const x = 2 + Math.floor(r() * 11), y = 2 + Math.floor(r() * 11);
      const c = cols[Math.floor(r() * cols.length)];
      P(ctx, x, y - 1, 1, 1, c); P(ctx, x - 1, y, 1, 1, c);
      P(ctx, x + 1, y, 1, 1, c); P(ctx, x, y + 1, 1, 1, c);
      P(ctx, x, y, 1, 1, '#f0a020');
    }
  }

  const TALL = {
    ';': { base: C.tall, d: C.tallD, l: C.tallL },
    'G': { base: '#2f6a32', d: '#1e4a24', l: '#4f8f45' },
    'A': { base: '#6a5a4e', d: '#4a3a32', l: '#9a7a5e' },
    'E': { base: '#c8dcec', d: '#8aa8c8', l: '#f4faff' },
  };

  // ---------- 北の氷原 ----------
  function snow(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#e8f0f8');
    for (let i = 0; i < 6; i++) P(ctx, Math.floor(r() * 15), Math.floor(r() * 15), 2, 1, r() < 0.5 ? '#d0dcea' : '#ffffff');
    if (r() < 0.3) P(ctx, 3 + Math.floor(r() * 9), 3 + Math.floor(r() * 9), 1, 1, '#a8c0d8');
  }
  function ice(ctx, r, frame) {
    P(ctx, 0, 0, 16, 16, '#9ccbe8');
    P(ctx, 0, 0, 16, 1, '#c8e4f4');
    for (let i = 0; i < 3; i++) {
      const x = Math.floor(r() * 12), y = 2 + Math.floor(r() * 12);
      P(ctx, x, y, 4, 1, '#d8eefa'); P(ctx, x + 1, y + 1, 2, 1, '#7ab0d8');
    }
    P(ctx, (frame * 4 + 3) % 14, 7, 2, 1, '#ffffff'); // きらめき
  }
  function snowpine(ctx, r) {
    snow(ctx, r);
    P(ctx, 3, 14, 10, 2, 'rgba(40,60,90,0.25)');
    P(ctx, 7, 12, 2, 4, '#5a3a1e');
    const layers = [[1, 6], [4, 9], [7, 12], [10, 14]];
    for (const [y, w] of layers) {
      P(ctx, 8 - Math.floor(w / 2), y, w, 3, '#1f4a3a');
      P(ctx, 8 - Math.floor(w / 2) + 1, y, w - 2, 1, '#f4faff'); // 枝につもった雪
    }
    P(ctx, 7, 0, 2, 2, '#f4faff');
  }
  function icerock(ctx, r) {
    snow(ctx, r);
    P(ctx, 2, 13, 12, 2, 'rgba(40,60,90,0.25)');
    P(ctx, 3, 5, 10, 9, '#6aa0cc'); P(ctx, 4, 4, 8, 1, '#6aa0cc');
    P(ctx, 4, 5, 8, 7, '#a8d4f0'); P(ctx, 5, 5, 3, 3, '#e8f6ff'); P(ctx, 9, 8, 2, 3, '#e8f6ff');
  }

  // ---------- 港・火山 ----------
  function sand(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#e8d49a');
    for (let i = 0; i < 6; i++) P(ctx, Math.floor(r() * 15), Math.floor(r() * 15), 1, 1, r() < 0.5 ? '#d4bc80' : '#f4e4b8');
  }
  function ash(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#7a6a5e');
    for (let i = 0; i < 7; i++) P(ctx, Math.floor(r() * 15), Math.floor(r() * 15), 2, 1, r() < 0.5 ? '#6a5a4e' : '#8a7a6a');
  }
  function lava(ctx, r, frame) {
    P(ctx, 0, 0, 16, 16, '#c8401a');
    for (let i = 0; i < 3; i++) {
      const y = 3 + i * 5, x = (frame * 3 + i * 5) % 16;
      P(ctx, x, y, 4, 1, '#ffb030'); P(ctx, (x + 9) % 16, y + 2, 3, 1, '#8a2010');
    }
    P(ctx, (frame * 5) % 14, 8, 2, 2, '#ffe070');
  }
  function obsidian(ctx, r) {
    ash(ctx, r);
    P(ctx, 2, 13, 12, 2, 'rgba(0,0,0,0.3)');
    P(ctx, 3, 4, 10, 10, '#2a2230'); P(ctx, 2, 6, 12, 6, '#2a2230');
    P(ctx, 4, 5, 3, 2, '#5a4a6a'); P(ctx, 9, 8, 2, 1, '#5a4a6a');
  }
  function blade(ctx, x, y, pal) {
    P(ctx, x, y + 1, 1, 4, pal.d);
    P(ctx, x + 1, y, 1, 5, pal.l);
    P(ctx, x + 2, y + 1, 1, 4, pal.d);
  }
  function tallgrass(ctx, r, frame, v, pal = TALL[';']) {
    P(ctx, 0, 0, 16, 16, pal.base);
    const sway = frame % 2;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        blade(ctx, col * 4 - 1 + (row % 2 ? 2 : 0) + (row === 0 ? sway : 0), row * 5 + 1, pal);
      }
    }
  }
  // キャラの足元に重ねる草（下半分）
  function tallgrassOverlay(ctx, pal) {
    P(ctx, 0, 12, 16, 4, pal.base);
    for (let col = 0; col < 5; col++) blade(ctx, col * 4 - 1 + 2, 9, pal);
    P(ctx, 0, 15, 16, 1, pal.d);
  }

  // ---------- 森 ----------
  function forestground(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#4f8a3e');
    for (let i = 0; i < 6; i++) {
      const x = Math.floor(r() * 15), y = Math.floor(r() * 15);
      P(ctx, x, y, 1, 1, r() < 0.5 ? '#3f7432' : '#6a9e4c');
    }
    if (r() < 0.4) { const x = 2 + Math.floor(r() * 10); P(ctx, x, 12, 3, 1, '#8a6a3a'); P(ctx, x + 1, 11, 1, 1, '#8a6a3a'); }
  }
  function pine(ctx, r) {
    forestground(ctx, r);
    P(ctx, 3, 14, 10, 2, 'rgba(0,0,0,0.25)');
    P(ctx, 7, 12, 2, 4, '#5a3a1e');
    const layers = [[1, 6], [4, 9], [7, 12], [10, 14]];
    for (const [y, w] of layers) {
      P(ctx, 8 - Math.floor(w / 2), y, w, 3, '#1f4a2a');
      P(ctx, 8 - Math.floor(w / 2) + 1, y, w - 2, 2, '#2f6a3a');
    }
    P(ctx, 7, 0, 2, 2, '#2f6a3a');
    P(ctx, 6, 5, 2, 1, '#4a8a4a'); P(ctx, 5, 8, 2, 1, '#4a8a4a'); P(ctx, 4, 11, 2, 1, '#4a8a4a');
  }
  function forestflowers(ctx, r) {
    forestground(ctx, r);
    const cols = ['#f0e8ff', '#c8a0ff', '#ffd84a'];
    for (let i = 0; i < 3; i++) {
      const x = 2 + Math.floor(r() * 11), y = 2 + Math.floor(r() * 11), c = cols[Math.floor(r() * 3)];
      P(ctx, x, y - 1, 1, 1, c); P(ctx, x - 1, y, 1, 1, c); P(ctx, x + 1, y, 1, 1, c); P(ctx, x, y + 1, 1, 1, c);
      P(ctx, x, y, 1, 1, '#f0a020');
    }
  }
  function forestrock(ctx, r) {
    forestground(ctx, r);
    P(ctx, 2, 13, 12, 2, 'rgba(0,0,0,0.25)');
    P(ctx, 3, 5, 10, 9, C.rockD); P(ctx, 4, 4, 8, 1, C.rockD);
    P(ctx, 4, 5, 8, 7, C.rock); P(ctx, 5, 5, 4, 2, C.rockL);
    P(ctx, 4, 4, 5, 2, '#4f8f45'); P(ctx, 9, 6, 3, 1, '#4f8f45');
  }
  function bridge(ctx) {
    P(ctx, 0, 0, 16, 16, C.water);
    P(ctx, 1, 0, 14, 16, '#9a6a3a');
    for (let y = 1; y < 16; y += 3) P(ctx, 1, y, 14, 1, '#6a4422');
    P(ctx, 1, 0, 1, 16, '#5a3a1e'); P(ctx, 14, 0, 1, 16, '#5a3a1e');
  }
  function cliff(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#7a6a5a');
    for (let y = 0; y < 16; y += 4) P(ctx, 0, y + 3, 16, 1, '#5a4a3e');
    for (let i = 0; i < 4; i++) P(ctx, Math.floor(r() * 14), Math.floor(r() * 14), 2, 1, '#9a8a78');
  }
  function cavemouth(ctx, r) {
    cliff(ctx, r);
    P(ctx, 2, 3, 12, 13, '#15101c');
    P(ctx, 3, 2, 10, 1, '#15101c');
    P(ctx, 1, 3, 1, 13, '#5a4a3e'); P(ctx, 14, 3, 1, 13, '#5a4a3e');
  }

  // ---------- 洞窟 ----------
  function cavefloor(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#5a5068');
    for (let i = 0; i < 5; i++) P(ctx, Math.floor(r() * 15), Math.floor(r() * 15), 1 + Math.floor(r() * 2), 1, r() < 0.5 ? '#4a4258' : '#6a6078');
  }
  function caverough(ctx, r) {
    P(ctx, 0, 0, 16, 16, '#4a4258');
    for (let i = 0; i < 9; i++) {
      const x = Math.floor(r() * 14), y = Math.floor(r() * 14);
      P(ctx, x, y, 2, 2, '#383246'); P(ctx, x, y, 1, 1, '#6a6078');
    }
  }
  function cavewall(ctx, r, f, v) {
    if (v & 1) { // 正面の岩肌
      P(ctx, 0, 0, 16, 16, '#3e3450');
      for (let y = 2; y < 16; y += 5) P(ctx, 0, y, 16, 1, '#2e2640');
      P(ctx, Math.floor(r() * 10), 4, 4, 1, '#56486a');
      P(ctx, 0, 14, 16, 2, '#241c30');
    } else {
      P(ctx, 0, 0, 16, 16, '#1e1828');
      P(ctx, 1, 1, 14, 14, '#261e32');
    }
  }
  function crystal(ctx, r, frame) {
    cavefloor(ctx, r);
    const glow = ['#9ff0ff', '#c8f8ff', '#9ff0ff', '#78d8f0'][frame % 4];
    P(ctx, 3, 13, 10, 2, 'rgba(0,0,0,0.3)');
    P(ctx, 6, 3, 4, 11, '#3a8aa8'); P(ctx, 7, 2, 2, 1, '#3a8aa8');
    P(ctx, 7, 4, 2, 9, glow);
    P(ctx, 3, 8, 3, 6, '#3a8aa8'); P(ctx, 4, 9, 1, 4, glow);
    P(ctx, 10, 7, 3, 7, '#3a8aa8'); P(ctx, 11, 8, 1, 5, glow);
  }
  function boulder(ctx, r) {
    cavefloor(ctx, r);
    P(ctx, 2, 13, 12, 2, 'rgba(0,0,0,0.3)');
    P(ctx, 3, 4, 10, 10, '#6a6278'); P(ctx, 2, 6, 12, 6, '#6a6278');
    P(ctx, 4, 5, 4, 2, '#8a8298'); P(ctx, 3, 12, 10, 2, '#4a4258');
  }
  function cavewater(ctx, r, frame) {
    P(ctx, 0, 0, 16, 16, '#1e3a6a');
    for (let i = 0; i < 3; i++) {
      const y = 3 + i * 5, x = (frame * 2 + i * 6) % 16;
      P(ctx, x, y, 3, 1, '#4a78b8');
    }
  }
  function stairs(ctx, r, f, v, down) {
    cavefloor(ctx, r);
    P(ctx, 2, 2, 12, 12, '#241c30');
    for (let i = 0; i < 4; i++) {
      const c = down ? ['#6a6078', '#524862', '#3e3450', '#2a2238'][i] : ['#2a2238', '#3e3450', '#524862', '#6a6078'][i];
      P(ctx, 3, 3 + i * 3, 10, 2, c);
    }
  }
  function sealgate(ctx, r, frame) {
    P(ctx, 0, 0, 16, 16, '#4a4060');
    P(ctx, 1, 0, 14, 16, '#6a5a80');
    P(ctx, 7, 0, 2, 16, '#3a3050');
    P(ctx, 5, 6, 6, 4, ['#c070ff', '#e0a0ff', '#c070ff', '#9050d0'][frame % 4]);
    P(ctx, 6, 7, 4, 2, '#ffffff');
  }

  function tree(ctx, r) {
    grass(ctx, r);
    P(ctx, 3, 14, 10, 2, 'rgba(0,0,0,0.18)');
    P(ctx, 6, 10, 4, 5, C.trunk);
    P(ctx, 8, 10, 2, 5, C.trunkD);
    const rows = [[4, 8], [2, 12], [1, 14], [1, 14], [0, 16], [0, 16], [0, 16], [1, 14], [1, 14], [2, 12], [4, 8]];
    rows.forEach(([x0, w], y) => {
      P(ctx, x0, y, w, 1, C.leafD);
      if (y > 0 && y < rows.length - 1) P(ctx, x0 + 1, y, w - 2, 1, C.leaf);
    });
    P(ctx, 2, 8, 12, 1, C.leafD);
    for (let i = 0; i < 6; i++) P(ctx, 2 + Math.floor(r() * 11), 3 + Math.floor(r() * 5), 1, 1, C.leafD);
    P(ctx, 4, 2, 4, 2, C.leafL); P(ctx, 3, 4, 2, 2, C.leafL); P(ctx, 9, 3, 2, 1, C.leafL);
  }

  // mask: 1=上が陸 2=左が陸 4=右が陸 8=下が陸
  function water(ctx, r, frame, mask) {
    P(ctx, 0, 0, 16, 16, C.water);
    for (let i = 0; i < 3; i++) {
      const y = 3 + i * 5;
      const x = (frame * 2 + i * 5) % 16;
      P(ctx, x, y, 4, 1, C.waterL);
      P(ctx, (x + 9) % 16, y + 2, 3, 1, C.waterD);
    }
    if (mask & 1) { P(ctx, 0, 0, 16, 2, C.shore); P(ctx, 0, 2, 16, 1, C.waterL); }
    if (mask & 2) { P(ctx, 0, 0, 2, 16, C.shore); P(ctx, 2, 0, 1, 16, C.waterL); }
    if (mask & 4) { P(ctx, 14, 0, 2, 16, C.shore); P(ctx, 13, 0, 1, 16, C.waterD); }
    if (mask & 8) { P(ctx, 0, 14, 16, 2, C.shore); P(ctx, 0, 13, 16, 1, C.waterD); }
  }

  function path(ctx, r) {
    P(ctx, 0, 0, 16, 16, C.path);
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(r() * 15), y = 1 + Math.floor(r() * 14);
      P(ctx, x, y, 2, 1, C.pathD);
      if (r() < 0.5) P(ctx, x, y - 1, 1, 1, C.pathL);
    }
  }

  function plaza(ctx) {
    P(ctx, 0, 0, 16, 16, C.plaza);
    P(ctx, 0, 0, 16, 1, C.plazaL);
    P(ctx, 0, 7, 16, 1, C.plazaD);
    P(ctx, 0, 8, 16, 1, C.plazaL);
    P(ctx, 0, 15, 16, 1, C.plazaD);
    P(ctx, 7, 0, 1, 7, C.plazaD);
    P(ctx, 3, 8, 1, 7, C.plazaD);
    P(ctx, 11, 8, 1, 7, C.plazaD);
  }

  function rock(ctx, r) {
    grass(ctx, r);
    P(ctx, 2, 13, 12, 2, 'rgba(0,0,0,0.2)');
    P(ctx, 4, 4, 8, 1, C.rockD);
    P(ctx, 3, 5, 10, 9, C.rockD);
    P(ctx, 4, 5, 8, 7, C.rock);
    P(ctx, 5, 5, 4, 2, C.rockL);
    P(ctx, 4, 12, 8, 1, C.rockD);
    P(ctx, 9, 8, 2, 1, C.rockD);
  }

  function fence(ctx, r) {
    grass(ctx, r);
    P(ctx, 0, 6, 16, 2, C.woodL); P(ctx, 0, 10, 16, 2, C.woodL);
    P(ctx, 0, 8, 16, 1, C.woodD); P(ctx, 0, 12, 16, 1, C.woodD);
    P(ctx, 2, 4, 2, 11, C.wood); P(ctx, 12, 4, 2, 11, C.wood);
  }

  // ---------- 屋内 ----------
  function floor(ctx, r, f, v) {
    P(ctx, 0, 0, 16, 16, C.floor);
    for (let y = 3; y < 16; y += 4) P(ctx, 0, y, 16, 1, C.floorD);
    const off = (v & 1) ? 4 : 10;
    P(ctx, off, 0, 1, 3, C.floorD);
    P(ctx, (off + 8) % 16, 4, 1, 3, C.floorD);
    P(ctx, off, 8, 1, 3, C.floorD);
    P(ctx, (off + 6) % 16, 12, 1, 3, C.floorD);
  }

  function wall(ctx, r, f, v) {
    if (v & 1) { // 正面の壁（壁紙）
      P(ctx, 0, 0, 16, 16, C.wallpaper);
      for (let x = 1; x < 16; x += 4) P(ctx, x, 2, 1, 11, C.wallStripe);
      P(ctx, 0, 0, 16, 2, C.wallTrim);
      P(ctx, 0, 13, 16, 3, C.wallTrim);
      P(ctx, 0, 13, 16, 1, '#a8845e');
    } else {
      P(ctx, 0, 0, 16, 16, C.wallTop);
      P(ctx, 1, 1, 14, 14, C.wallTopL);
    }
  }

  function shelf(ctx, r) {
    P(ctx, 0, 0, 16, 16, C.woodD);
    P(ctx, 1, 1, 14, 14, C.wood);
    for (const y of [1, 6, 11]) {
      P(ctx, 1, y, 14, 4, '#3a2412');
      let x = 2;
      while (x < 14) {
        const w = 1 + Math.floor(r() * 2);
        const h = 3 + Math.floor(r() * 2);
        P(ctx, x, y + 4 - h, Math.min(w, 14 - x), h, BOOKS[Math.floor(r() * BOOKS.length)]);
        x += w + (r() < 0.2 ? 1 : 0);
      }
      P(ctx, 1, y + 4, 14, 1, C.woodD);
    }
  }

  // mask: 1=上 2=左 4=右 8=下 に同じタイルが続く
  function table(ctx, r, f, v) {
    floor(ctx, r, f, 0);
    const t = (v & 1) ? 0 : 3, l = (v & 2) ? 0 : 1, rr = (v & 4) ? 0 : 1, b = (v & 8) ? 0 : 4;
    P(ctx, l, t, 16 - l - rr, 16 - t - b, C.woodL);
    if (!(v & 1)) P(ctx, l, t, 16 - l - rr, 1, '#d8a470');
    if (!(v & 8)) {
      P(ctx, l, 12, 16 - l - rr, 1, C.woodD);
      if (!(v & 2)) P(ctx, l + 1, 13, 2, 3, C.woodD);
      if (!(v & 4)) P(ctx, 13 - rr + 1, 13, 2, 3, C.woodD);
    }
  }

  function bed(ctx, r, f, v) {
    floor(ctx, r, f, 0);
    const top = !(v & 1), bottom = !(v & 8);
    P(ctx, 1, top ? 1 : 0, 14, bottom ? 14 - (top ? 1 : 0) : 16, C.woodD);
    P(ctx, 2, top ? 2 : 0, 12, 16, '#e8eef8');
    if (top) { P(ctx, 3, 3, 10, 4, '#ffffff'); P(ctx, 3, 7, 10, 1, '#c8d0e0'); }
    const blanketTop = top ? 9 : 0;
    P(ctx, 2, blanketTop, 12, (bottom ? 14 : 16) - blanketTop, '#5a7bd0');
    P(ctx, 2, blanketTop, 12, 1, '#7a9be8');
    if (bottom) P(ctx, 1, 14, 14, 2, C.woodD);
  }

  function plant(ctx, r, f) {
    floor(ctx, r, f, 0);
    P(ctx, 3, 14, 10, 2, 'rgba(0,0,0,0.18)');
    P(ctx, 5, 10, 6, 5, '#b8643a'); P(ctx, 5, 10, 6, 1, '#d8844a');
    P(ctx, 4, 3, 8, 7, '#2f7a35'); P(ctx, 3, 5, 10, 3, '#2f7a35');
    P(ctx, 5, 4, 3, 2, '#5cb04a'); P(ctx, 9, 6, 2, 2, '#5cb04a'); P(ctx, 7, 1, 2, 3, '#3f9a45');
  }

  function counter(ctx, r, f, v) {
    floor(ctx, r, f, 0);
    const l = (v & 2) ? 0 : 1, rr = (v & 4) ? 0 : 1;
    P(ctx, l, 2, 16 - l - rr, 14, C.woodD);
    P(ctx, l, 2, 16 - l - rr, 6, '#d09a60');
    P(ctx, l, 2, 16 - l - rr, 1, '#e8b880');
    P(ctx, l, 9, 16 - l - rr, 6, '#a86e3a');
  }

  function carpet(ctx, r, f, v) {
    floor(ctx, r, f, 0);
    const t = (v & 1) ? 0 : 1, l = (v & 2) ? 0 : 1, rr = (v & 4) ? 0 : 1, b = (v & 8) ? 0 : 1;
    P(ctx, l, t, 16 - l - rr, 16 - t - b, '#e0b050');
    P(ctx, l + (l ? 1 : 0), t + (t ? 1 : 0), 16 - l - rr - (l ? 1 : 0) - (rr ? 1 : 0), 16 - t - b - (t ? 1 : 0) - (b ? 1 : 0), '#b84a4a');
    P(ctx, 7, 7, 2, 2, '#e0b050');
  }

  function exitmat(ctx, r, f) {
    floor(ctx, r, f, 0);
    P(ctx, 1, 2, 14, 14, '#4a6a3a');
    for (let y = 4; y < 16; y += 3) P(ctx, 2, y, 12, 1, '#6a8a5a');
  }

  function pedestal(ctx, r, f) {
    floor(ctx, r, f, 0);
    P(ctx, 3, 14, 10, 2, 'rgba(0,0,0,0.2)');
    P(ctx, 3, 11, 10, 4, '#6d7484');
    P(ctx, 5, 6, 6, 6, '#a0a8b8');
    P(ctx, 4, 4, 8, 2, '#c8d0e0');
    P(ctx, 6, 7, 1, 4, '#c8d0e0');
  }

  const PAINTERS = {
    '.': grass, ',': flowers, ';': tallgrass, '#': tree, '~': water, '=': path,
    'o': plaza, 'r': rock, 'F': fence, 'w': wall, '_': floor, 'k': shelf,
    't': table, 'b': bed, 'p': plant, 'c': counter, 'm': carpet, 'x': exitmat, 'q': pedestal,
    'g': forestground, 'G': (ctx, r, f, v) => tallgrass(ctx, r, f, v, TALL.G), 'Y': pine, 'h': bridge,
    'K': cliff, 'M': cavemouth, 'O': forestrock, 'v': forestflowers,
    's': sand, 'a': ash, 'A': (ctx, r, f, v) => tallgrass(ctx, r, f, v, TALL.A), 'l': lava, 'n': obsidian,
    'e': snow, 'E': (ctx, r, f, v) => tallgrass(ctx, r, f, v, TALL.E), 'i': ice, 'P': snowpine, 'I': icerock,
    'f': cavefloor, 'z': caverough, 'R': cavewall, 'C': crystal, 'B': boulder, 'W': cavewater,
    'L': (ctx, r, f, v) => stairs(ctx, r, f, v, true), 'U': (ctx, r, f, v) => stairs(ctx, r, f, v, false), 'X': sealgate,
  };
  const SAME_MASK = new Set(['t', 'b', 'c', 'm']);

  function variantFor(map, ch, x, y) {
    const at = (dx, dy) => G.mapTile(map, x + dx, y + dy);
    if (ch === 'w' || ch === 'R') {
      const below = at(0, 1);
      return below && below !== ch && below !== 'x' ? 1 : 0;
    }
    if (ch === '~') {
      let m = 0;
      const land = (c) => c !== null && c !== '~';
      if (land(at(0, -1))) m |= 1;
      if (land(at(-1, 0))) m |= 2;
      if (land(at(1, 0))) m |= 4;
      if (land(at(0, 1))) m |= 8;
      return m;
    }
    if (SAME_MASK.has(ch)) {
      let m = 0;
      if (at(0, -1) === ch) m |= 1;
      if (at(-1, 0) === ch) m |= 2;
      if (at(1, 0) === ch) m |= 4;
      if (at(0, 1) === ch) m |= 8;
      return m;
    }
    if (ch === '_') return (x + y) & 1;
    return G.Util.hash(x, y, 7) & 3;
  }

  function paint(ch, v, frame) {
    const key = `${ch}|${v}|${frame}`;
    let c = cache.get(key);
    if (c) return c;
    const cv = G.Util.makeCanvas(T, T);
    const painter = PAINTERS[ch];
    if (painter) {
      painter(cv.ctx, G.Util.rng(v * 131 + ch.charCodeAt(0) * 7 + 1), frame, v);
    } else {
      cv.ctx.fillStyle = '#f0f';
      cv.ctx.fillRect(0, 0, T, T);
    }
    cache.set(key, cv.c);
    return cv.c;
  }

  const overlays = {};
  const ANIM4 = new Set(['C', 'X']);

  G.TileGfx = {
    get(map, x, y, time) {
      const ch = map.tiles[y][x];
      const def = G.TileDefs[ch];
      let frame = 0;
      if (def && def.anim) frame = Math.floor(time * 3) % def.anim;
      else if (def && def.tall) frame = Math.floor(time * 1.5) % 2;
      else if (ANIM4.has(ch)) frame = Math.floor(time * 3) % 4;
      return paint(ch, variantFor(map, ch, x, y), frame);
    },
    // 任意のタイル絵を直接取得（オブジェクト描画用）
    paintChar(ch, frame = 0) { return paint(ch, 0, frame); },
    tallOverlay(ch = ';') {
      if (!overlays[ch]) {
        const cv = G.Util.makeCanvas(T, T);
        tallgrassOverlay(cv.ctx, TALL[ch] || TALL[';']);
        overlays[ch] = cv.c;
      }
      return overlays[ch];
    },
  };
})(window.Game);
