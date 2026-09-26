// 導入ナレーション
(function (G) {
  'use strict';

  const W = G.VIEW_W * G.TILE, H = G.VIEW_H * G.TILE;

  const S = G.Scenes.intro = {
    t: 0,
    enter() {
      S.t = 0;
      G.Events.run(async (E) => {
        await E.wait(400);
        await E.narrate(G.Story.introPages());
        G.Field.start();
      });
    },
    update(dt) { S.t += dt; },
    render(ctx) {
      ctx.fillStyle = '#07081a';
      ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2 - 10;
      const a = Math.min(1, S.t / 1.5);
      // 絆の紋章（ふたつの環）
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(cx, cy);
      ctx.rotate(S.t * 0.2);
      ctx.strokeStyle = '#ffd35a';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(-18, 0, 34, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#8ad0ff';
      ctx.beginPath(); ctx.arc(18, 0, 34, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = a * 0.6;
      for (let i = 0; i < 24; i++) {
        const ang = i / 24 * Math.PI * 2 + S.t * 0.3;
        const r = 70 + Math.sin(S.t * 2 + i) * 8;
        ctx.fillStyle = i % 2 ? '#ffd35a' : '#8ad0ff';
        ctx.fillRect(Math.round(cx + Math.cos(ang) * r), Math.round(cy + Math.sin(ang) * r), 2, 2);
      }
      ctx.globalAlpha = 1;
    },
  };
})(window.Game);
