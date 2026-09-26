// キャラクター・建物・オブジェクトの描画（すべてCanvasの図形によるオリジナルドット絵）
(function (G) {
  'use strict';

  const T = G.TILE;
  const U = 2;

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + amt)));
    const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // ---------------- キャラクター ----------------
  // look: { skin, hair, style(short|long|spiky|bald), hat, helmet, ribbon, coat, shirt, pants, beard, glasses }
  // frame: 0=停止 1,2=歩行
  function drawCharacter(ctx, x, y, look, dir, frame) {
    const oy = y - 6;
    const p = (px, py, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + px * U, oy + py * U, w * U, h * U); };

    const skin = look.skin || '#f6d2b0';
    const hair = look.hair || '#4a3020';
    const shirt = look.shirt || '#4070c0';
    const pants = look.pants || '#303048';
    const shoe = '#2a2020';
    const eye = '#222233';
    const side = dir === 'left' || dir === 'right';

    // 影
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y + 29, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 足
    if (side) {
      const s = frame === 1 ? -1 : frame === 2 ? 1 : 0;
      p(8 - s, 13, 2, 2, shade(pants, -25)); p(8 - s, 15, 2, 1, shoe);
      p(6 + s, 13, 2, 2, pants); p(6 + s, 15, 2, 1, shoe);
    } else {
      const liftL = frame === 1 ? 1 : 0, liftR = frame === 2 ? 1 : 0;
      p(5, 13, 2, 2 - liftL, pants); p(5, 15 - liftL, 2, 1, shoe);
      p(9, 13, 2, 2 - liftR, pants); p(9, 15 - liftR, 2, 1, shoe);
    }

    // 胴体
    if (look.coat) {
      p(4, 8, 8, 6, look.coat);
      if (dir === 'down') p(7, 8, 2, 5, shirt);
      p(4, 13, 8, 1, shade(look.coat, -30));
    } else {
      p(4, 8, 8, 5, shirt);
      p(4, 12, 8, 1, shade(shirt, -35));
    }
    const armC = look.coat || shirt;
    if (side) {
      const swing = frame === 1 ? -1 : frame === 2 ? 1 : 0;
      const ax = dir === 'left' ? 7 + swing : 8 - swing;
      p(ax, 9, 2, 3, shade(armC, -20));
      p(ax, 12, 2, 1, skin);
    } else {
      const aL = frame === 1 ? -1 : 0, aR = frame === 2 ? -1 : 0;
      p(3, 8 + aL, 1, 4, shade(armC, -15)); p(3, 12 + aL, 1, 1, skin);
      p(12, 8 + aR, 1, 4, shade(armC, -15)); p(12, 12 + aR, 1, 1, skin);
    }

    // 頭
    p(3, 1, 10, 7, skin);
    p(4, 0, 8, 1, skin);

    const style = look.style || 'short';
    if (style !== 'bald') {
      if (dir === 'up') {
        p(3, 0, 10, 7, hair);
        p(4, -1, 8, 1, hair);
        if (style === 'long') p(3, 7, 10, 3, hair);
      } else {
        p(3, 0, 10, 3, hair);
        p(4, -1, 8, 1, hair);
        if (dir === 'down') {
          p(3, 3, 1, 3, hair); p(12, 3, 1, 3, hair);
          p(4, 3, 2, 1, hair); p(10, 3, 2, 1, hair);
          if (style === 'long') { p(2, 3, 2, 7, hair); p(12, 3, 2, 7, hair); }
        } else if (dir === 'left') {
          p(8, 3, 5, 4, hair); p(3, 3, 2, 1, hair);
          if (style === 'long') p(9, 7, 4, 3, hair);
        } else {
          p(3, 3, 5, 4, hair); p(11, 3, 2, 1, hair);
          if (style === 'long') p(3, 7, 4, 3, hair);
        }
      }
      if (style === 'spiky') {
        p(3, -2, 2, 2, hair); p(7, -3, 2, 3, hair); p(11, -2, 2, 2, hair);
      }
    } else {
      p(3, 3, 1, 3, hair); p(12, 3, 1, 3, hair);
    }

    // 顔
    if (dir === 'down') {
      p(5, 4, 1, 2, eye); p(10, 4, 1, 2, eye);
      p(4, 6, 1, 1, '#f0a8a0'); p(11, 6, 1, 1, '#f0a8a0');
      if (look.glasses) { p(4, 4, 3, 1, '#333'); p(9, 4, 3, 1, '#333'); p(7, 4, 2, 1, '#333'); }
    } else if (dir === 'left') {
      p(4, 4, 1, 2, eye);
      if (look.glasses) p(3, 4, 3, 1, '#333');
    } else if (dir === 'right') {
      p(11, 4, 1, 2, eye);
      if (look.glasses) p(10, 4, 3, 1, '#333');
    }

    // ひげ
    if (look.beard && dir !== 'up') {
      if (dir === 'down') p(5, 6, 6, 3, look.beard);
      else if (dir === 'left') p(3, 6, 5, 3, look.beard);
      else p(8, 6, 5, 3, look.beard);
    }

    // フード（顔が影になり、目だけが光る）
    if (look.hood) {
      const hd = look.hood;
      if (dir === 'up') p(2, -1, 12, 10, hd);
      else {
        p(2, -1, 12, 4, hd); p(2, 3, 2, 7, hd); p(12, 3, 2, 7, hd);
        p(4, 3, 8, 5, '#1a1420');
        if (dir === 'down') { p(5, 5, 2, 1, look.eyes || '#e04040'); p(9, 5, 2, 1, look.eyes || '#e04040'); }
        else if (dir === 'left') p(4, 5, 2, 1, look.eyes || '#e04040');
        else p(10, 5, 2, 1, look.eyes || '#e04040');
      }
    }

    // 帽子・かぶと・リボン
    const hat = look.hat || look.helmet;
    if (hat) {
      p(3, -1, 10, 3, hat);
      p(4, -2, 8, 1, hat);
      const brim = shade(hat, -35);
      if (dir === 'down') p(3, 2, 10, 1, brim);
      else if (dir === 'left') p(1, 2, 6, 1, brim);
      else if (dir === 'right') p(9, 2, 6, 1, brim);
      if (look.helmet) { p(7, -2, 2, 1, '#e0e0e8'); }
    }
    if (look.ribbon) {
      if (dir === 'down' || dir === 'up') { p(10, -1, 3, 2, look.ribbon); p(11, 1, 1, 1, shade(look.ribbon, -40)); }
      else if (dir === 'left') p(10, -1, 3, 2, look.ribbon);
      else p(3, -1, 3, 2, look.ribbon);
    }
  }

  // ---------------- 建物 ----------------
  const STYLES = {
    house:  { roof: '#c8553d', wall: '#f3e2c0' },
    lab:    { roof: '#4a6fa5', wall: '#e8ecf0' },
    shop:   { roof: '#3f9a5a', wall: '#f5ecd8' },
    healer: { roof: '#3aa6a0', wall: '#f4f0ea' },
    fusion: { roof: '#6a4a9a', wall: '#e0d8ec' },
    hut:    { roof: '#6a4a2e', wall: '#c8a070' },
  };
  const buildingCache = new Map();

  function renderBuilding(b) {
    const W = b.w * T, H = b.h * T;
    const { c, ctx } = G.Util.makeCanvas(W, H);
    const s = STYLES[b.style] || STYLES.house;
    const roofD = shade(s.roof, -40), roofL = shade(s.roof, 35), wallD = shade(s.wall, -35);
    const roofRows = Math.max(1, b.h - 2);
    const wallTop = roofRows * T;
    const dc = b.door ? b.door.x - b.x : -1;

    // 壁
    ctx.fillStyle = s.wall; ctx.fillRect(2, wallTop - 4, W - 4, H - wallTop + 4);
    ctx.fillStyle = wallD;
    for (let i = 1; i < b.w; i++) ctx.fillRect(i * T - 1, wallTop, 2, H - wallTop);
    ctx.fillRect(2, H - 5, W - 4, 5);

    // 窓
    for (let i = 0; i < b.w; i++) {
      if (i === dc) continue;
      if (b.w >= 5 && (i === 0 || i === b.w - 1)) continue;
      const wx = i * T + 8, wy = wallTop + 10;
      ctx.fillStyle = '#6a4a30'; ctx.fillRect(wx - 2, wy - 2, 20, 18);
      ctx.fillStyle = '#9fd4f8'; ctx.fillRect(wx, wy, 16, 14);
      ctx.fillStyle = '#e4f4ff'; ctx.fillRect(wx + 2, wy + 2, 4, 4);
      ctx.fillStyle = '#6a4a30'; ctx.fillRect(wx + 7, wy, 2, 14); ctx.fillRect(wx, wy + 6, 16, 2);
    }

    // ショップの日よけ
    if (b.style === 'shop') {
      for (let x = 2; x < W - 2; x += 8) {
        ctx.fillStyle = ((x - 2) / 8) % 2 ? '#ffffff' : '#3f9a5a';
        ctx.fillRect(x, wallTop, Math.min(8, W - 2 - x), 8);
      }
      ctx.fillStyle = '#2c7342'; ctx.fillRect(2, wallTop + 8, W - 4, 2);
    }

    // ドア
    if (dc >= 0) {
      const dx = dc * T;
      ctx.fillStyle = '#4a2e18'; ctx.fillRect(dx + 4, H - 30, 24, 30);
      ctx.fillStyle = b.door.locked ? '#7a5aa0' : '#8a5a34'; ctx.fillRect(dx + 6, H - 28, 20, 28);
      ctx.fillStyle = b.door.locked ? '#5a3a80' : '#6a4222';
      ctx.fillRect(dx + 8, H - 25, 7, 10); ctx.fillRect(dx + 17, H - 25, 7, 10);
      ctx.fillStyle = '#f0d060'; ctx.fillRect(dx + 21, H - 13, 3, 3);
      ctx.fillStyle = '#a0a0a8'; ctx.fillRect(dx + 3, H - 3, 26, 3);
      if (b.door.locked) {
        ctx.fillStyle = '#3a2410';
        ctx.fillRect(dx + 5, H - 22, 22, 3);
        ctx.fillRect(dx + 5, H - 11, 22, 3);
      }
    }

    // 屋根
    const rh = wallTop + 4;
    ctx.fillStyle = roofD; ctx.fillRect(0, 2, W, rh - 2);
    ctx.fillStyle = s.roof; ctx.fillRect(2, 0, W - 4, rh - 5);
    ctx.fillStyle = roofD;
    for (let y = 7, row = 0; y < rh - 5; y += 6, row++) {
      ctx.fillRect(2, y, W - 4, 1);
      for (let x = 2 + (row % 2 ? 6 : 0); x < W - 2; x += 12) ctx.fillRect(x, y - 5, 1, 5);
    }
    ctx.fillStyle = roofL; ctx.fillRect(2, 0, W - 4, 3);
    ctx.fillStyle = roofD; ctx.fillRect(0, rh - 5, W, 5);

    // 建物ごとの飾り
    const cx = W / 2;
    if (b.style === 'house') {
      ctx.fillStyle = '#8a5a4a'; ctx.fillRect(W - 24, 2, 9, 16);
      ctx.fillStyle = '#6a3a2a'; ctx.fillRect(W - 25, 2, 11, 3);
    } else if (b.style === 'lab') {
      ctx.fillStyle = '#c8d0dc'; ctx.beginPath(); ctx.arc(W - 30, 22, 11, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
      ctx.fillStyle = '#8890a0'; ctx.fillRect(W - 31, 22, 3, 14);
      ctx.fillStyle = '#ffd35a'; ctx.fillRect(W - 31, 12, 3, 3);
      ctx.fillStyle = '#9fd4f8'; ctx.fillRect(24, 20, 40, 18);
      ctx.fillStyle = roofD; ctx.fillRect(43, 20, 2, 18);
    } else if (b.style === 'healer') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cx, 20, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3aa6a0';
      ctx.beginPath(); ctx.moveTo(cx, 11); ctx.quadraticCurveTo(cx + 8, 22, cx, 28); ctx.quadraticCurveTo(cx - 8, 22, cx, 11); ctx.fill();
    } else if (b.style === 'fusion') {
      const ex = W - 36;
      ctx.strokeStyle = '#f0d060'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ex - 6, 16, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex + 6, 16, 8, 0, Math.PI * 2); ctx.stroke();
    }

    // 看板
    if (b.label) {
      ctx.font = 'bold 10px "DotGothic16", sans-serif';
      const tw = Math.ceil(ctx.measureText(b.label).width);
      const px = (dc >= 0 ? dc * T + 16 : cx) - (tw + 10) / 2;
      const py = rh - 15;
      ctx.fillStyle = '#2a1a10'; ctx.fillRect(px - 1, py - 1, tw + 12, 15);
      ctx.fillStyle = '#4a3020'; ctx.fillRect(px, py, tw + 10, 13);
      ctx.fillStyle = '#fff5d0'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      ctx.fillText(b.label, px + 5, py + 7);
    }
    return c;
  }

  // ---------------- オブジェクト ----------------
  function drawFountain(ctx, x, y, t) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(x + 32, y + 46, 30, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8a909c';
    ctx.beginPath(); ctx.ellipse(x + 32, y + 40, 30, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b8bec8';
    ctx.beginPath(); ctx.ellipse(x + 32, y + 38, 30, 17, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3f8ad8';
    ctx.beginPath(); ctx.ellipse(x + 32, y + 38, 24, 12, 0, 0, Math.PI * 2); ctx.fill();
    // 波紋
    const k = (t * 0.8) % 1;
    ctx.strokeStyle = `rgba(200,230,255,${0.8 - k * 0.8})`; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(x + 32, y + 38, 6 + k * 16, 3 + k * 8, 0, 0, Math.PI * 2); ctx.stroke();
    // 柱と水しぶき
    ctx.fillStyle = '#c8ced8'; ctx.fillRect(x + 28, y + 16, 8, 22);
    ctx.fillStyle = '#9aa0ac'; ctx.fillRect(x + 34, y + 16, 2, 22);
    ctx.fillStyle = '#d8dee8';
    ctx.beginPath(); ctx.ellipse(x + 32, y + 16, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#8cc4f4';
    for (let i = 0; i < 6; i++) {
      const ph = (t * 1.6 + i / 6) % 1;
      const side = i % 2 ? 1 : -1;
      const dx = side * (4 + ph * 12);
      const dy = -6 - Math.sin(ph * Math.PI) * 10 + ph * 18;
      ctx.fillRect(Math.round(x + 31 + dx), Math.round(y + 14 + dy), 2, 2);
    }
    ctx.fillStyle = '#e4f4ff'; ctx.fillRect(x + 31, y + 6 + Math.round(Math.sin(t * 6) * 1), 2, 8);
  }

  // 祭壇（第2章）：石の台座と、属性色に光る紋様
  function drawAltar(ctx, x, y, t, color = '#8af0ff', lit = true) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x + 2, y + 26, 28, 5);
    ctx.fillStyle = '#6a6a7a'; ctx.fillRect(x + 3, y + 18, 26, 10);
    ctx.fillStyle = '#9a9aaa'; ctx.fillRect(x + 5, y + 14, 22, 6);
    ctx.fillStyle = '#b8b8c8'; ctx.fillRect(x + 5, y + 14, 22, 2);
    ctx.fillStyle = '#4a4a5a'; ctx.fillRect(x + 11, y + 20, 10, 6);
    if (lit) {
      const a = 0.5 + Math.sin(t * 3) * 0.3;
      ctx.globalAlpha = a;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x + 16, y + 8, 6 + Math.sin(t * 2) * 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 15, y + 6, 2, 4);
    }
    ctx.fillStyle = color; ctx.fillRect(x + 13, y + 22, 6, 2);
  }

  // 森の祠（小さな石の社）
  function drawShrine(ctx, x, y, t) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x + 4, y + 27, 24, 4);
    ctx.fillStyle = '#6a6a78'; ctx.fillRect(x + 6, y + 14, 20, 15);
    ctx.fillStyle = '#8a8a98'; ctx.fillRect(x + 8, y + 16, 16, 11);
    ctx.fillStyle = '#2a2230'; ctx.fillRect(x + 12, y + 18, 8, 9);
    ctx.fillStyle = '#7a3a2a'; ctx.fillRect(x + 2, y + 9, 28, 5); ctx.fillRect(x + 6, y + 5, 20, 4);
    const a = 0.5 + Math.sin(t * 2) * 0.3;
    ctx.fillStyle = `rgba(255,230,150,${a})`; ctx.fillRect(x + 14, y + 21, 4, 4);
  }

  function drawSign(ctx, x, y) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x + 8, y + 27, 16, 3);
    ctx.fillStyle = '#6a4424'; ctx.fillRect(x + 14, y + 14, 4, 15);
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(x + 3, y + 3, 26, 15);
    ctx.fillStyle = '#b07a44'; ctx.fillRect(x + 4, y + 4, 24, 13);
    ctx.fillStyle = '#8a5a30'; ctx.fillRect(x + 7, y + 8, 18, 1); ctx.fillRect(x + 7, y + 12, 14, 1);
  }

  // 落ちているアイテム（小袋＋きらめき）
  function drawItem(ctx, x, y, t) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(x + 9, y + 25, 14, 3);
    ctx.fillStyle = '#6a4222'; ctx.fillRect(x + 9, y + 14, 14, 12);
    ctx.fillStyle = '#c08a4a'; ctx.fillRect(x + 10, y + 15, 12, 10);
    ctx.fillStyle = '#e0b070'; ctx.fillRect(x + 11, y + 16, 3, 3);
    ctx.fillStyle = '#8a5a2a'; ctx.fillRect(x + 12, y + 11, 8, 4);
    ctx.fillStyle = '#d04040'; ctx.fillRect(x + 11, y + 14, 10, 2);
    const a = (Math.sin(t * 4) + 1) / 2;
    ctx.fillStyle = `rgba(255,250,200,${0.3 + a * 0.7})`;
    const sx = x + 23, sy = y + 9;
    ctx.fillRect(sx - 1, sy - 4, 2, 8); ctx.fillRect(sx - 4, sy - 1, 8, 2);
  }

  G.Sprites = {
    drawCharacter,
    drawFountain,
    drawSign,
    drawItem,
    drawShrine,
    drawAltar,
    building(b) {
      let c = buildingCache.get(b);
      if (!c) { c = renderBuilding(b); buildingCache.set(b, c); }
      return c;
    },
    clearCache() { buildingCache.clear(); },
    shade,
  };
})(window.Game);
