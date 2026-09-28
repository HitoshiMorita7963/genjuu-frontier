// タイトル画面・名前入力
(function (G) {
  'use strict';

  const W = G.VIEW_W * G.TILE, H = G.VIEW_H * G.TILE;
  const OPTIONS = ['はじめから', 'つづきから'];

  const S = G.Scenes.title = {
    t: 0,
    sel: 0,
    mode: 'menu',
    stars: [],
    motes: [],
    gender: 'boy',

    enter() {
      S.t = 0;
      S.mode = 'menu';
      S.saveInfo = G.Save.info();
      G.Audio.bgm('title');
      S.sel = S.saveInfo ? 1 : 0; // セーブがあれば「つづきから」を初期選択
      const r = G.Util.rng(42);
      S.stars = Array.from({ length: 70 }, () => ({ x: r() * W, y: r() * H * 0.55, p: r() * 6, s: r() < 0.2 ? 2 : 1 }));
      S.motes = Array.from({ length: 26 }, () => ({ x: r() * W, y: r() * H, v: 6 + r() * 14, p: r() * 6 }));
      G.state = null;
      G.UI.refresh();
      G.UI.showIdle('↑↓：えらぶ　Z / Enter / Space：けってい');
      G.UI.setControls(CONTROLS_HTML);
      S.bindNameEntry();
    },

    update(dt) {
      S.t += dt;
      for (const m of S.motes) {
        m.y -= m.v * dt;
        if (m.y < -4) { m.y = H + 4; m.x = Math.random() * W; }
      }
      const In = G.Input;
      // セーブがあるのに「はじめから」を選んだときの確認
      if (S.mode === 'confirmNew') {
        if (In.consume('left') || In.consume('right') || In.consume('up') || In.consume('down')) S.yes = !S.yes;
        if (In.consume('cancel')) S.mode = 'menu';
        if (In.consume('confirm')) { if (S.yes) S.openNameEntry(); else S.mode = 'menu'; }
        return;
      }
      if (S.mode !== 'menu') return;
      if (In.consume('up') || In.consume('down')) S.sel = 1 - S.sel;
      if (In.consume('confirm')) {
        if (S.sel === 0 && S.saveInfo) { S.mode = 'confirmNew'; S.yes = false; }
        else if (S.sel === 0) S.openNameEntry();
        else if (S.saveInfo) S.continueGame();
        else G.UI.showIdle(G.Save.available() ? 'セーブデータがありません。' : 'このブラウザでは セーブデータを使えません。');
      }
    },

    render(ctx) {
      // 空
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#141a44');
      g.addColorStop(0.5, '#4a3f7e');
      g.addColorStop(0.8, '#e0906a');
      g.addColorStop(1, '#f4c07a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      for (const s of S.stars) {
        const a = 0.4 + 0.6 * Math.abs(Math.sin(S.t * 1.5 + s.p));
        ctx.fillStyle = `rgba(255,255,230,${a})`;
        ctx.fillRect(Math.round(s.x), Math.round(s.y), s.s, s.s);
      }
      // 山並み
      drawHills(ctx, 250, 40, 0.012, '#3a3470', 0);
      drawHills(ctx, 280, 26, 0.02, '#2a4a50', 2);
      drawHills(ctx, 305, 14, 0.035, '#2f6a3a', 5);
      ctx.fillStyle = '#2f6a3a';
      ctx.fillRect(0, 312, W, H - 312);
      // 空を渡る幻獣のシルエット
      const bx = ((S.t * 22) % (W + 120)) - 60;
      const by = 150 + Math.sin(S.t * 0.8) * 8;
      const flap = Math.sin(S.t * 5) * 6;
      ctx.fillStyle = 'rgba(30,20,60,0.75)';
      ctx.beginPath();
      ctx.moveTo(bx - 22, by - flap); ctx.quadraticCurveTo(bx - 8, by - 4, bx, by);
      ctx.quadraticCurveTo(bx + 8, by - 4, bx + 22, by - flap);
      ctx.quadraticCurveTo(bx + 8, by + 2, bx + 4, by + 5);
      ctx.lineTo(bx + 14, by + 12); ctx.lineTo(bx, by + 7); ctx.lineTo(bx - 4, by + 5);
      ctx.quadraticCurveTo(bx - 8, by + 2, bx - 22, by - flap);
      ctx.fill();
      // 光の粒
      for (const m of S.motes) {
        const a = 0.3 + 0.5 * Math.abs(Math.sin(S.t * 2 + m.p));
        ctx.fillStyle = `rgba(190,255,200,${a})`;
        ctx.fillRect(Math.round(m.x), Math.round(m.y), 2, 2);
      }

      // タイトル
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '44px "DotGothic16", sans-serif';
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#1a1030';
      ctx.strokeText(G.Story.TITLE, W / 2, 92);
      const tg = ctx.createLinearGradient(0, 70, 0, 114);
      tg.addColorStop(0, '#fff6c8');
      tg.addColorStop(1, '#ffb84a');
      ctx.fillStyle = tg;
      ctx.fillText(G.Story.TITLE, W / 2, 92);
      ctx.font = '18px "DotGothic16", sans-serif';
      ctx.lineWidth = 5;
      ctx.strokeText(G.Story.SUBTITLE, W / 2, 132);
      ctx.fillStyle = '#e8e0ff';
      ctx.fillText(G.Story.SUBTITLE, W / 2, 132);

      // メニュー
      if (S.mode === 'menu') {
        ctx.fillStyle = 'rgba(16,18,40,0.8)';
        ctx.fillRect(W / 2 - 80, 214, 160, 70);
        ctx.strokeStyle = '#e9e4d4';
        ctx.lineWidth = 2;
        ctx.strokeRect(W / 2 - 80, 214, 160, 70);
        ctx.font = '16px "DotGothic16", sans-serif';
        OPTIONS.forEach((o, i) => {
          const y = 236 + i * 26;
          ctx.fillStyle = i === 1 && !S.saveInfo ? '#8a8aa0' : '#ffffff';
          ctx.fillText(o, W / 2 + 6, y);
          if (i === S.sel && Math.floor(S.t * 3) % 2 === 0) {
            ctx.fillStyle = '#ffd35a';
            ctx.fillText('▶', W / 2 - 56, y);
          }
        });
      }
      if (S.mode === 'confirmNew') {
        ctx.fillStyle = 'rgba(16,18,40,0.92)';
        ctx.fillRect(W / 2 - 170, 200, 340, 100);
        ctx.strokeStyle = '#ffd35a'; ctx.lineWidth = 2;
        ctx.strokeRect(W / 2 - 170, 200, 340, 100);
        ctx.font = '12px "DotGothic16", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('セーブデータがあります。はじめから遊ぶと、', W / 2, 222);
        ctx.fillText('次にセーブ（オートセーブ含む）したときに上書きされます。', W / 2, 240);
        ctx.font = '15px "DotGothic16", sans-serif';
        ctx.fillStyle = S.yes ? '#ffd35a' : '#ffffff';
        ctx.fillText(`${S.yes ? '▶' : '　'}はじめる`, W / 2 - 60, 276);
        ctx.fillStyle = S.yes ? '#ffffff' : '#ffd35a';
        ctx.fillText(`${S.yes ? '　' : '▶'}やめる`, W / 2 + 60, 276);
      }
      // セーブデータの概要
      if (S.mode === 'menu' && S.sel === 1 && S.saveInfo) {
        const i = S.saveInfo;
        const lines = [
          [`${i.name}　${i.place}${i.chapter1 ? '　★第1章クリア' : ''}`, '#ffd35a'],
          [`プレイ時間 ${i.playTime}　仲間 ${i.party}体${i.lead ? `（${i.lead}）` : ''}`, '#d8dcf0'],
        ];
        // 枠は文字に合わせて広げる（画面の幅まで）。それでも入らなければ字を小さくする
        const maxW = W - 24;
        let size = 11;
        ctx.font = `${size}px "DotGothic16", sans-serif`;
        const widest = () => Math.max(...lines.map(([t]) => ctx.measureText(t).width));
        while (size > 8 && widest() + 24 > maxW) ctx.font = `${--size}px "DotGothic16", sans-serif`;
        const bw = Math.min(maxW, Math.max(260, widest() + 24));
        ctx.fillStyle = 'rgba(16,18,40,0.85)';
        ctx.fillRect(W / 2 - bw / 2, 290, bw, 44);
        lines.forEach(([t, c], k) => { ctx.fillStyle = c; ctx.fillText(t, W / 2, 302 + k * 16); });
      } else {
        ctx.font = '10px "DotGothic16", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('オリジナル幻獣育成RPG', W / 2, H - 14);
      }
      ctx.textAlign = 'left';
    },

    // ---------- つづきから ----------
    continueGame() {
      const st = G.Save.load();
      if (!st) { G.UI.showIdle('セーブデータの読み込みに失敗しました。'); S.saveInfo = null; return; }
      G.state = st;
      G.Input.clear();
      G.UI.refresh();
      G.Field.start();
      G.UI.banner(`${st.player.name}の冒険を再開！`);
    },

    // ---------- 名前入力 ----------
    bindNameEntry() {
      if (S.bound) return;
      S.bound = true;
      const overlay = document.getElementById('name-entry');
      const input = document.getElementById('name-input');
      const ok = document.getElementById('name-ok');
      overlay.querySelectorAll('[data-gender]').forEach((btn) => {
        btn.addEventListener('click', () => { S.gender = btn.dataset.gender; S.renderGender(); input.focus(); });
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); S.submitName(); }
        if (e.key === 'Escape') { e.preventDefault(); S.closeNameEntry(); }
      });
      ok.addEventListener('click', () => S.submitName());
    },

    openNameEntry() {
      S.mode = 'name';
      const overlay = document.getElementById('name-entry');
      overlay.classList.remove('hidden');
      S.renderGender();
      const input = document.getElementById('name-input');
      input.value = '';
      setTimeout(() => input.focus(), 30);
      G.UI.showIdle('名前を入力して Enter（または「けってい」）。Esc で戻る。');
      S.previewTimer = setInterval(S.renderPreview, 250);
    },

    closeNameEntry() {
      document.getElementById('name-entry').classList.add('hidden');
      clearInterval(S.previewTimer);
      document.getElementById('name-input').blur();
      S.mode = 'menu';
      G.Input.clear();
      G.UI.showIdle('↑↓：えらぶ　Z / Enter / Space：けってい');
    },

    renderGender() {
      document.querySelectorAll('#name-entry [data-gender]').forEach((b) => {
        b.classList.toggle('selected', b.dataset.gender === S.gender);
      });
      S.renderPreview();
    },

    renderPreview() {
      const cv = document.getElementById('name-preview');
      const ctx = cv.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(3, 0, 0, 3, 0, 0);
      const dirs = ['down', 'left', 'up', 'right'];
      const d = dirs[Math.floor(Date.now() / 1000) % 4];
      const f = [0, 1, 0, 2][Math.floor(Date.now() / 250) % 4];
      G.Sprites.drawCharacter(ctx, 0, 11, G.Story.playerLook(S.gender), d, f);
    },

    submitName() {
      const input = document.getElementById('name-input');
      let name = input.value.trim().replace(/\s+/g, '');
      if (!name) name = S.gender === 'girl' ? 'ハル' : 'ユウ';
      name = Array.from(name).slice(0, 8).join('');
      document.getElementById('name-entry').classList.add('hidden');
      clearInterval(S.previewTimer);
      input.blur();
      G.Input.clear();
      G.state = G.State.create(name, S.gender);
      G.UI.refresh();
      G.setScene(G.Scenes.intro);
    },
  };

  function drawHills(ctx, base, amp, freq, color, seed) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = base - Math.abs(Math.sin(x * freq + seed)) * amp - Math.sin(x * freq * 2.7 + seed) * amp * 0.3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.fill();
  }

  const CONTROLS_HTML =
    '<span><kbd>↑↓←→</kbd>/<kbd>WASD</kbd> 移動</span>' +
    '<span><kbd>Shift</kbd> ダッシュ</span>' +
    '<span><kbd>Z</kbd>/<kbd>Enter</kbd>/<kbd>Space</kbd> 決定・調べる・話す</span>' +
    '<span><kbd>X</kbd>/<kbd>Esc</kbd> メニュー・戻る</span>' +
    '<span><kbd>M</kbd> サウンドON/OFF</span>';
})(window.Game);
