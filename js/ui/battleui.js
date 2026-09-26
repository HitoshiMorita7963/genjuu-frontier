// バトルのコマンド画面（たたかう／モンスター／捕獲／道具／逃げる）
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const CMDS = [
    { id: 'fight', label: 'たたかう' },
    { id: 'party', label: 'モンスター' },
    { id: 'catch', label: '捕獲' },
    { id: 'item', label: '道具' },
    { id: 'run', label: '逃げる' },
  ];
  const CAT = { phys: '物理', spec: '特殊', stat: '補助' };
  const stones = () => ['bondstone', 'bondstone2', 'bondstone3'].filter((id) => G.state.items[id] > 0);

  function partyRows(b, sel, note) {
    return G.state.party.map((m, i) => {
      const tag = m === b.sides.player.mon ? ' <span class="tag">戦闘中</span>'
        : m.hp <= 0 ? ' <span class="tag dead">ひんし</span>'
          : m.status ? ` <span class="tag">${G.Battle.STATUS[m.status].short}</span>` : '';
      return P().row(m, i === sel, tag);
    }).join('') + (note ? `<div class="bt-note">${note}</div>` : '');
  }

  G.UIScreens.battleCommand = function (b) {
    return {
      layout: 'battle',
      view: 'main',
      sel: 0,
      note: '',
      item: null,
      me() { return b.sides.player.mon; },
      moveList() {
        const m = this.me();
        const usable = m.moves.filter((id) => G.Moves[id].mp <= m.mp);
        return usable.length ? m.moves : ['mogaku'];
      },
      go(view) { this.view = view; this.sel = 0; this.note = ''; G.Screens.render(); },

      update(In) {
        const move = (n, cols) => {
          if (In.consume('up')) { this.sel = Math.max(0, this.sel - cols); this.note = ''; G.Screens.render(); }
          if (In.consume('down')) { this.sel = Math.min(n - 1, this.sel + cols); this.note = ''; G.Screens.render(); }
          if (cols > 1 && In.consume('left')) { this.sel = Math.max(0, this.sel - 1); this.note = ''; G.Screens.render(); }
          if (cols > 1 && In.consume('right')) { this.sel = Math.min(n - 1, this.sel + 1); this.note = ''; G.Screens.render(); }
        };

        if (this.view === 'main') {
          move(CMDS.length, 2);
          if (In.consume('confirm')) {
            const c = CMDS[this.sel];
            if (c.id === 'catch') {
              if (b.type !== 'wild') { this.note = '人の幻獣を 捕まえることは できない！'; G.Screens.render(); return; }
              if (!G.Party.hasRoom()) { this.note = 'パーティも預かり所も いっぱいだ！'; G.Screens.render(); return; }
              return this.go('catch');
            }
            if (c.id === 'run') return G.Screens.close({ type: 'run' });
            if (c.id === 'fight') return this.go('moves');
            if (c.id === 'party') return this.go('party');
            if (c.id === 'item') return this.go('items');
          }
          In.consume('cancel');
          return;
        }

        if (this.view === 'moves') {
          const list = this.moveList();
          move(list.length, 2);
          if (In.consume('cancel')) return this.go('main');
          if (In.consume('confirm')) {
            const id = list[this.sel];
            if (G.Moves[id].mp > this.me().mp) { this.note = 'MPが 足りない！'; G.Screens.render(); return; }
            return G.Screens.close({ type: 'move', move: id });
          }
          return;
        }

        if (this.view === 'party') {
          move(G.state.party.length, 1);
          if (In.consume('cancel')) return this.go('main');
          if (In.consume('confirm')) {
            const m = G.state.party[this.sel];
            if (m === this.me()) this.note = `${m.name}は すでに 戦っている！`;
            else if (m.hp <= 0) this.note = `${m.name}は たおれていて 戦えない！`;
            else return G.Screens.close({ type: 'switch', target: m });
            G.Screens.render();
          }
          return;
        }

        if (this.view === 'catch') {
          const ids = stones();
          if (ids.length) move(ids.length, 1);
          if (In.consume('cancel')) return this.go('main');
          if (In.consume('confirm') && ids.length) return G.Screens.close({ type: 'catch', item: ids[this.sel] });
          return;
        }

        if (this.view === 'items') {
          const ids = G.ItemUse.battleItems();
          if (ids.length) move(ids.length, 1);
          if (In.consume('cancel')) return this.go('main');
          if (In.consume('confirm') && ids.length) { this.item = ids[this.sel]; this.go('itemTarget'); }
          return;
        }

        if (this.view === 'itemTarget') {
          move(G.state.party.length, 1);
          if (In.consume('cancel')) return this.go('items');
          if (In.consume('confirm')) {
            const m = G.state.party[this.sel];
            if (!G.ItemUse.usableOn(this.item, m)) { this.note = '使っても 効果が なさそうだ。'; G.Screens.render(); return; }
            return G.Screens.close({ type: 'item', item: this.item, target: m });
          }
        }
      },

      html() {
        let body = '';
        let hint = 'Z：けってい　X：もどる';
        if (this.view === 'main') {
          body = `<div class="bt-grid">${CMDS.map((c, i) =>
            `<div class="bt-cmd${i === this.sel ? ' sel' : ''}${c.soon ? ' disabled' : ''}${c.id === 'run' && b.type !== 'wild' ? ' disabled' : ''}">` +
            `<span class="cursor">${i === this.sel ? '▶' : ''}</span>${c.label}</div>`).join('')}</div>`;
          hint = '↑↓←→：えらぶ　Z：けってい';
        } else if (this.view === 'moves') {
          const list = this.moveList();
          const cur = G.Moves[list[this.sel]];
          body = `<div class="bt-grid">${list.map((id, i) => {
            const mv = G.Moves[id];
            const lack = mv.mp > this.me().mp;
            return `<div class="bt-cmd move${i === this.sel ? ' sel' : ''}${lack ? ' disabled' : ''}">` +
              `<span class="cursor">${i === this.sel ? '▶' : ''}</span>${P().el(mv.el)}<span class="mv-name">${esc(mv.name)}</span>` +
              `<small>MP${mv.mp}</small></div>`;
          }).join('')}</div>` +
            `<div class="bt-info">${CAT[cur.cat]}　威力 ${cur.pow || '-'}　命中 ${cur.acc}　` +
            `<span class="mp-now">残りMP ${this.me().mp}</span><br><small>${esc(cur.desc || '')}</small></div>`;
        } else if (this.view === 'party') {
          body = `<div class="bt-title">入れかえる幻獣は？</div>${partyRows(b, this.sel)}`;
        } else if (this.view === 'catch') {
          const ids = stones();
          const foe = b.sides.enemy.mon;
          const st = G.Monster.stats(foe);
          const hint = foe.hp <= st.hp * 0.25 ? 'かなり弱っている！' : foe.hp <= st.hp * 0.5 ? '弱ってきている。' : 'まだまだ元気だ……';
          body = '<div class="bt-title">どの絆石を 投げる？</div>' + (ids.length
            ? ids.map((id, i) => `<div class="menu-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
              `<span class="stone-icon" style="--c:${G.Items[id].color}"></span>${G.Items[id].name}<span class="count">×${G.state.items[id]}</span></div>`).join('') +
              `<div class="bt-info"><small>${esc(foe.name)}は ${hint}${foe.status ? '（状態異常だと成功しやすい）' : ''}</small></div>`
            : '<div class="menu-empty">絆石を 持っていない。</div>');
        } else if (this.view === 'items') {
          const ids = G.ItemUse.battleItems();
          body = '<div class="bt-title">どの道具を使う？</div>' + (ids.length
            ? ids.map((id, i) => `<div class="menu-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
              `${G.Items[id].name}<span class="count">×${G.state.items[id]}</span></div>`).join('') +
              `<div class="bt-info"><small>${G.Items[ids[this.sel]].desc}</small></div>`
            : '<div class="menu-empty">戦闘で使える道具を 持っていない。</div>');
        } else if (this.view === 'itemTarget') {
          body = `<div class="bt-title">${G.Items[this.item].name}を だれに使う？</div>${partyRows(b, this.sel)}`;
        }
        return body + (this.note ? `<div class="bt-note">${esc(this.note)}</div>` : '') + `<div class="bt-hint">${hint}</div>`;
      },
    };
  };

  // 倒れたときの交代（forced = キャンセル不可）
  G.UIScreens.battleParty = function (b, forced) {
    return {
      layout: 'battle',
      sel: Math.max(0, G.state.party.findIndex((m) => m.hp > 0)),
      note: '',
      update(In) {
        const n = G.state.party.length;
        if (In.consume('up')) { this.sel = (this.sel - 1 + n) % n; this.note = ''; G.Screens.render(); }
        if (In.consume('down')) { this.sel = (this.sel + 1) % n; this.note = ''; G.Screens.render(); }
        if (!forced && In.consume('cancel')) return G.Screens.close(null);
        if (In.consume('confirm')) {
          const m = G.state.party[this.sel];
          if (m.hp <= 0) { this.note = `${m.name}は たおれていて 戦えない！`; G.Screens.render(); return; }
          G.Screens.close(m);
        }
      },
      html() {
        return `<div class="bt-title">次に 戦う幻獣を 選んでください</div>${partyRows(b, this.sel, this.note ? esc(this.note) : '')}` +
          '<div class="bt-hint">↑↓：えらぶ　Z：けってい</div>';
      },
    };
  };
})(window.Game);
