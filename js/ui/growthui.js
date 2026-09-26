// 育成まわりの画面：技の入れ替え・進化演出
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const CAT = { phys: '物理', spec: '特殊', stat: '補助' };

  function moveRow(id, selected, extra = '') {
    const mv = G.Moves[id];
    return `<div class="menu-row${selected ? ' sel' : ''}"><span class="cursor">${selected ? '▶' : ''}</span>` +
      `${P().el(mv.el)}${esc(mv.name)}${extra}<span class="count">${CAT[mv.cat]}　威力${mv.pow || '-'}　命中${mv.acc}　MP${mv.mp}</span></div>`;
  }

  // 4つ埋まっているときに忘れる技を選ぶ。戻り値：忘れる技の番号、-1 = 覚えない
  G.UIScreens.forgetMove = function (m, newId) {
    return {
      layout: 'menu wide center',
      sel: 0,
      update(In) {
        const n = m.moves.length + 1;
        if (In.consume('up')) { this.sel = (this.sel - 1 + n) % n; G.Screens.render(); }
        if (In.consume('down')) { this.sel = (this.sel + 1) % n; G.Screens.render(); }
        if (In.consume('cancel')) return G.Screens.close(-1);
        if (In.consume('confirm')) G.Screens.close(this.sel < m.moves.length ? this.sel : -1);
      },
      html() {
        const cur = this.sel < m.moves.length ? G.Moves[m.moves[this.sel]] : G.Moves[newId];
        return `<div class="menu-title">${esc(m.name)}は どの技を 忘れる？</div>` +
          m.moves.map((id, i) => moveRow(id, i === this.sel)).join('') +
          `<div class="menu-sep"></div>` +
          moveRow(newId, this.sel === m.moves.length, ' <span class="tag">新</span>') +
          `<div class="menu-desc">${this.sel === m.moves.length ? '（新しい技を あきらめる）<br>' : ''}${esc(cur.desc || '')}</div>` +
          '<div class="menu-hint">Z：けってい　X：覚えない</div>';
      },
    };
  };

  // 進化演出。play() で光の明滅 → 新しい姿へ
  G.UIScreens.evolution = function (fromId, toId) {
    return {
      layout: 'full evo',
      t: 0,
      playing: false,
      done: false,
      resolve: null,
      showNew: false,
      play() {
        this.playing = true;
        this.t = 0;
        return new Promise((r) => { this.resolve = r; });
      },
      update(In, dt) {
        In.consume('confirm'); In.consume('cancel');
        if (!this.playing) return;
        this.t += dt;
        // だんだん速く入れ替わる
        const speed = 2 + this.t * 5;
        const show = this.t > 3.2 ? true : Math.floor(this.t * speed) % 2 === 1;
        if (show !== this.showNew) { this.showNew = show; G.Screens.render(); }
        if (this.t > 3.4) {
          this.playing = false;
          this.done = true;
          G.Screens.render();
          const r = this.resolve; this.resolve = null; r();
        }
      },
      html() {
        const id = this.showNew ? toId : fromId;
        const cls = this.playing ? ' evo-flash' : this.done ? ' evo-done' : '';
        return `<div class="evo-stage${cls}"><img class="mon-img evo-img" src="${G.MonsterGfx.dataURL(id)}" alt=""></div>`;
      },
    };
  };
})(window.Game);
