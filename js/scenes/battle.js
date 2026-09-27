// バトル画面の描画（左下：自分の幻獣／右上：敵の幻獣／右下：コマンド）
(function (G) {
  'use strict';

  const W = G.VIEW_W * G.TILE, H = G.VIEW_H * G.TILE;
  const FONT = '"DotGothic16", sans-serif';
  const POS = {
    enemy: { x: 360, y: 150, size: 104, plat: [80, 16] },
    player: { x: 118, y: 300, size: 124, plat: [100, 20] },
  };

  const BG = {
    meadow: { sky: ['#7cc4ee', '#d6f0ff'], far: '#8ccf7a', ground: ['#8fd070', '#6fb655'], plat: '#5f9e48' },
    forest: { sky: ['#2f5a3a', '#6a9a5a'], far: '#2a4a2a', ground: ['#4a7a3a', '#35602a'], plat: '#2c4f22' },
    cave:   { sky: ['#1a1628', '#3a3048'], far: '#2a2438', ground: ['#4a4458', '#383346'], plat: '#2a2536' },
    volcano: { sky: ['#3a1410', '#a8401a'], far: '#4a2418', ground: ['#6a5a4e', '#56483e'], plat: '#3a2e28' },
    altar:  { sky: ['#1a2a5a', '#8ad0f0'], far: '#5a7ab0', ground: ['#9aa8c0', '#7a88a0'], plat: '#5a6680' },
    snow:   { sky: ['#8aa8c8', '#e8f2fa'], far: '#c8d8e8', ground: ['#eef4fa', '#d0dcea'], plat: '#a8bcd4' },
  };

  function drawBg(ctx, b) {
    const s = BG[b.bg] || BG.meadow;
    const g = ctx.createLinearGradient(0, 0, 0, 170);
    g.addColorStop(0, s.sky[0]); g.addColorStop(1, s.sky[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 170);
    if (b.bg === 'meadow') {
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      const cx = (b.t * 6) % (W + 120) - 60;
      for (const [x, y, r] of [[cx, 40, 16], [cx + 18, 34, 20], [cx + 40, 42, 14], [cx + 220, 70, 12], [cx + 236, 64, 16]]) {
        ctx.beginPath(); ctx.arc(((x % (W + 120)) + W + 120) % (W + 120) - 60, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.fillStyle = s.far;
    ctx.beginPath(); ctx.moveTo(0, 170);
    for (let x = 0; x <= W; x += 8) ctx.lineTo(x, 150 - Math.abs(Math.sin(x * 0.015)) * 26);
    ctx.lineTo(W, 170); ctx.fill();
    ctx.fillStyle = s.ground[0]; ctx.fillRect(0, 165, W, H - 165);
    ctx.fillStyle = s.ground[1];
    for (let y = 175; y < H; y += 14) ctx.fillRect(0, y, W, 2);
    for (const side of ['enemy', 'player']) {
      const p = POS[side];
      ctx.fillStyle = s.plat;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.plat[0], p.plat[1], 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(p.x, p.y - 3, p.plat[0] - 8, p.plat[1] - 6, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawMon(ctx, b, side) {
    const m = b.sides[side].mon;
    const sp = b.sprite[side];
    if (!m && sp.alpha <= 0) return;
    const mon = m || b.lastMon && b.lastMon[side];
    if (!mon) return;
    if (sp.flash) return; // 被弾時の点滅
    const p = POS[side];
    const frame = Math.floor(b.t * 2 + (side === 'enemy' ? 1 : 0)) % 2;
    const c = G.MonsterGfx.canvas(mon.speciesId, frame);
    const x = Math.round(p.x - p.size / 2 + sp.dx + sp.shake);
    const y = Math.round(p.y - p.size + 6 + sp.dy);
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, sp.alpha));
    if (side === 'player') {
      ctx.translate(x + p.size, y); ctx.scale(-1, 1);
      ctx.drawImage(c, 0, 0, p.size, p.size);
    } else {
      ctx.drawImage(c, x, y, p.size, p.size);
    }
    ctx.restore();
  }

  // トレーナー本人（登場時と勝負後）
  function drawTrainer(ctx, b) {
    const tr = b.trainer;
    const sp = b.sprite.trainer;
    if (!tr || !tr.look || sp.alpha <= 0) return;
    const p = POS.enemy;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, sp.alpha));
    ctx.translate(Math.round(p.x - 48 + sp.dx), Math.round(p.y - 100 + sp.dy));
    ctx.scale(3, 3);
    G.Sprites.drawCharacter(ctx, 0, 6, tr.look, 'down', 0);
    ctx.restore();
  }

  // 相手トレーナーの残りの幻獣（●＝戦える／○＝たおれた）
  function drawPartyDots(ctx, b) {
    if (!b.trainer) return;
    b.enemyParty.forEach((m, i) => {
      ctx.fillStyle = m.hp > 0 ? '#ffd35a' : '#50506a';
      ctx.beginPath(); ctx.arc(24 + i * 14, 70, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#1a1d30'; ctx.lineWidth = 1.5; ctx.stroke();
    });
  }

  function drawFx(ctx, b) {
    for (const f of b.fx) {
      const p = POS[f.side];
      const k = f.t / f.dur;
      const cx = p.x, cy = p.y - p.size * 0.45;
      ctx.save();
      ctx.globalAlpha = 1 - k;
      ctx.fillStyle = f.color;
      ctx.strokeStyle = f.color;
      if (f.kind === 'hit') {
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, cy, 10 + k * 40, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * Math.PI * 2;
          ctx.fillRect(Math.round(cx + Math.cos(a) * (8 + k * 46)) - 3, Math.round(cy + Math.sin(a) * (8 + k * 46)) - 3, 6, 6);
        }
      } else if (f.kind === 'heal') {
        for (let i = 0; i < 7; i++) {
          const x = cx - 30 + i * 10, y = cy + 30 - k * 60 - (i % 3) * 10;
          ctx.fillRect(x - 1, y - 4, 3, 9); ctx.fillRect(x - 4, y - 1, 9, 3);
        }
      } else if (f.kind === 'up' || f.kind === 'down') {
        const dir = f.kind === 'up' ? -1 : 1;
        for (let i = 0; i < 5; i++) {
          const x = cx - 32 + i * 16, y = cy + dir * (k * 50 - 20) + (i % 2) * 10;
          ctx.beginPath(); ctx.moveTo(x, y + dir * -8); ctx.lineTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.fill();
          ctx.fillRect(x - 2, y, 4, 8 * -dir);
        }
      } else if (f.kind === 'status') {
        for (let i = 0; i < 6; i++) {
          ctx.beginPath(); ctx.arc(cx - 25 + i * 10, cy + 10 - k * 40 - (i % 2) * 12, 4, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  // 絆石（ひし形の宝石）
  function drawStone(ctx, b) {
    const s = b.stone;
    if (!s) return;
    const col = G.Items[s.item].color || '#7ad0a0';
    ctx.save();
    ctx.translate(Math.round(s.x), Math.round(s.y));
    ctx.rotate(s.rot);
    if (s.glow > 0) {
      ctx.fillStyle = `rgba(255,250,210,${0.5 * s.glow})`;
      ctx.beginPath(); ctx.arc(0, 0, 14 + s.glow * 20, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#1e1628';
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(9, 0); ctx.lineTo(0, 12); ctx.lineTo(-9, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(7, 0); ctx.lineTo(0, 10); ctx.lineTo(-7, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(3, -2); ctx.lineTo(-3, -1); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function bar(ctx, x, y, w, h, v, max, colors) {
    ctx.fillStyle = '#1a1d30'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = '#3a3f5a'; ctx.fillRect(x, y, w, h);
    const r = max > 0 ? Math.max(0, Math.min(1, v / max)) : 0;
    ctx.fillStyle = colors ? colors : r > 0.5 ? '#5ad16a' : r > 0.2 ? '#f0c040' : '#f05a4a';
    ctx.fillRect(x, y, Math.round(w * r), h);
  }

  function infoBox(ctx, b, side, x, y, w, detailed) {
    const m = b.sides[side].mon;
    if (!m) return;
    const st = G.Monster.stats(m);
    const d = b.disp[side];
    const h = detailed ? 62 : 46;
    ctx.fillStyle = 'rgba(20,22,44,0.9)'; ctx.fillRect(x, y, w, h);
    const boss = side === 'enemy' && b.trainer && b.trainer.boss;
    ctx.strokeStyle = boss ? '#f06070' : '#e9e4d4'; ctx.lineWidth = 2; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    ctx.textBaseline = 'top'; ctx.textAlign = 'left';
    ctx.font = `14px ${FONT}`; ctx.fillStyle = '#ffffff';
    ctx.fillText(m.name, x + 8, y + 6);
    ctx.textAlign = 'right'; ctx.font = `12px ${FONT}`; ctx.fillStyle = '#ffd35a';
    ctx.fillText(`Lv${m.level}`, x + w - 8, y + 8);
    const el = G.Elements[G.Species[m.speciesId].el];
    ctx.textAlign = 'left';
    ctx.font = `14px ${FONT}`;
    const nw = ctx.measureText(m.name).width;
    ctx.fillStyle = el.color; ctx.fillRect(x + 12 + nw, y + 7, 18, 14);
    ctx.fillStyle = '#141424'; ctx.font = `11px ${FONT}`; ctx.fillText(el.name, x + 15 + nw, y + 9);
    if (m.status) {
      const s = G.Battle.STATUS[m.status];
      ctx.fillStyle = '#b05ab0'; ctx.fillRect(x + 34 + nw, y + 7, 28, 14);
      ctx.fillStyle = '#ffffff'; ctx.fillText(s.short, x + 37 + nw, y + 9);
    }
    ctx.font = `10px ${FONT}`; ctx.fillStyle = '#ffd35a';
    ctx.fillText('HP', x + 8, y + 28);
    bar(ctx, x + 28, y + 30, w - 40, 6, d.hp, st.hp);
    if (detailed) {
      ctx.fillStyle = '#8ab8ff'; ctx.fillText('MP', x + 8, y + 42);
      bar(ctx, x + 28, y + 44, 70, 5, d.mp, st.mp, '#5a9af0');
      ctx.textAlign = 'right'; ctx.fillStyle = '#ffffff'; ctx.font = `12px ${FONT}`;
      ctx.fillText(`${Math.ceil(d.hp)} / ${st.hp}`, x + w - 10, y + 40);
      ctx.font = `10px ${FONT}`; ctx.fillStyle = '#a8c8ff';
      ctx.fillText(`${Math.round(d.mp)}/${st.mp}`, x + 150, y + 41);
      // 経験値バー
      const sp = G.Species[m.speciesId];
      const lo = G.Monster.expForLevel(sp, m.level), hi = G.Monster.expForLevel(sp, m.level + 1);
      const ratio = m.level >= G.Monster.MAX_LEVEL ? 1 : (d.exp - lo) / Math.max(1, hi - lo);
      ctx.textAlign = 'left'; ctx.fillStyle = '#80e0f0'; ctx.font = `8px ${FONT}`;
      ctx.fillText('EXP', x + 8, y + 53);
      bar(ctx, x + 28, y + 55, w - 40, 3, Math.max(0, ratio), 1, '#40c8e0');
    }
    ctx.textAlign = 'left';
  }

  G.Scenes.battle = {
    enter() {},
    update(dt) {
      const b = G.Battle.current;
      if (b) b.update(dt);
      if (G.Screens.active) G.Screens.update(dt);
    },
    render(ctx) {
      const b = G.Battle.current;
      if (!b) return;
      // 倒れた直後もアニメ用に最後の個体を覚えておく
      b.lastMon = b.lastMon || {};
      for (const s of ['player', 'enemy']) if (b.sides[s].mon) b.lastMon[s] = b.sides[s].mon;
      drawBg(ctx, b);
      if (b.trainer && b.trainer.boss) {
        // ボス戦：赤く脈打つ縁どり
        const a = 0.18 + Math.sin(b.t * 3) * 0.08;
        const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.7);
        g.addColorStop(0, 'rgba(160,0,40,0)');
        g.addColorStop(1, `rgba(160,0,40,${a})`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      drawTrainer(ctx, b);
      drawMon(ctx, b, 'enemy');
      drawMon(ctx, b, 'player');
      drawStone(ctx, b);
      drawFx(ctx, b);
      infoBox(ctx, b, 'enemy', 14, 16, 210, false);
      infoBox(ctx, b, 'player', 256, 176, 212, true);
      drawPartyDots(ctx, b);
      if (b.screenFlash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.6, b.screenFlash)})`;
        ctx.fillRect(0, 0, W, H);
      }
      // 開始時のワイプ
      if (b.t < 0.5) {
        const k = b.t / 0.5;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, (H / 2) * (1 - k));
        ctx.fillRect(0, H - (H / 2) * (1 - k), W, (H / 2) * (1 - k));
      }
    },
  };
})(window.Game);
