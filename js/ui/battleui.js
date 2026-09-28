// バトルのコマンド画面（たたかう／ためる／ぼうぎょ／めいそう／モンスター／捕獲／道具／逃げる）
//   たたかう：いちばん上に MP を使わない「こうげき」、その下に覚えている技
//   ためる  ：次の攻撃のダメージが2倍になる（MPを使わない）
//   ぼうぎょ：そのターンのダメージを半分にする（MPを使わない）
//   めいそう：MPを回復する（守りは固くならない）
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const CMDS = [
    { id: 'fight', label: 'たたかう' },
    { id: 'charge', label: 'ためる' },
    { id: 'guard', label: 'ぼうぎょ' },
    { id: 'meditate', label: 'めいそう' },
    { id: 'party', label: 'モンスター' },
    { id: 'catch', label: '捕獲' },
    { id: 'item', label: '道具' },
    { id: 'run', label: '逃げる' },
  ];
  const CAT = { phys: '物理', spec: '特殊', stat: '補助' };
  const EYE = { hp: 'HP', atk: '攻', def: '防', spd: '速', sat: '特攻', sdf: '特防' }; // 鑑定眼で見る才能の短い名前
  const stones = () => ['bondstone', 'bondstone2', 'bondstone3'].filter((id) => G.state.items[id] > 0);

  function partyRows(b, sel, note) {
    return G.state.party.map((m, i) => {
      const tag = m === b.sides.player.mon ? ' <span class="tag">戦闘中</span>'
        : m.hp <= 0 ? ' <span class="tag dead">ひんし</span>'
          : m.status ? ` <span class="tag">${G.Battle.STATUS[m.status].short}</span>` : '';
      return P().row(m, i === sel, tag);
    }).join('').replace(/^/, '<div class="bt-list2">') + '</div>' + (note ? `<div class="bt-note">${note}</div>` : '');
  }

  G.UIScreens.battleCommand = function (b) {
    return {
      layout: 'battle',
      view: 'main',
      sel: 0,
      note: '',
      item: null,
      me() { return b.sides.player.mon; },
      moveList() { return ['kougeki'].concat(this.me().moves); }, // 通常攻撃はいつも選べる
      go(view) { this.view = view; this.sel = 0; this.note = ''; G.Screens.render(); },

      update(In) {
        const move = (n, cols) => {
          if (In.consume('up')) { this.sel = Math.max(0, this.sel - cols); this.note = ''; G.Screens.render(); }
          if (In.consume('down')) { this.sel = Math.min(n - 1, this.sel + cols); this.note = ''; G.Screens.render(); }
          if (cols > 1 && In.consume('left')) { this.sel = Math.max(0, this.sel - 1); this.note = ''; G.Screens.render(); }
          if (cols > 1 && In.consume('right')) { this.sel = Math.min(n - 1, this.sel + 1); this.note = ''; G.Screens.render(); }
        };

        if (this.view === 'main') {
          move(CMDS.length, 4); // メインは4列×2行
          if (In.consume('confirm')) {
            const c = CMDS[this.sel];
            if (c.id === 'catch') {
              if (b.type !== 'wild') { this.note = '人の幻獣を 捕まえることは できない！'; G.Screens.render(); return; }
              if (!G.Party.hasRoom()) { this.note = 'パーティも預かり所も いっぱいだ！'; G.Screens.render(); return; }
              const fsp = G.Species[b.sides.enemy.mon.speciesId];
              if (!G.Tamer.canCatch(fsp)) { this.note = `${b.sides.enemy.mon.name}は 絆石を 拒んでいる……（幻獣使いLv${G.Tamer.needLevel(fsp)} が必要。今は Lv${G.Tamer.level()}）`; G.Screens.render(); return; }
              if (b.catchLocked) { this.note = `${b.sides.enemy.mon.name}は 怒っていて、もう 絆を 結べない！`; G.Screens.render(); return; }
              return this.go('catch');
            }
            if (c.id === 'run') return G.Screens.close({ type: 'run' });
            if (c.id === 'guard') return G.Screens.close({ type: 'guard' });
            if (c.id === 'meditate') {
              const me = this.me();
              if (me.mp >= G.Monster.stats(me).mp) { this.note = 'MPは 満タンだ！'; G.Screens.render(); return; }
              return G.Screens.close({ type: 'meditate' });
            }
            if (c.id === 'charge') {
              if (b.sides.player.charged) { this.note = 'もう じゅうぶん 力を ためている！'; G.Screens.render(); return; }
              return G.Screens.close({ type: 'charge' });
            }
            if (c.id === 'fight') return this.go('moves');
            if (c.id === 'party') return this.go('party');
            if (c.id === 'item') return this.go('items');
          }
          In.consume('cancel');
          return;
        }

        if (this.view === 'moves') {
          const list = this.moveList();
          move(list.length, 2); // 技は2列（最大4行）
          if (In.consume('cancel')) return this.go('main');
          if (In.consume('confirm')) {
            const id = list[this.sel];
            if (G.MoveStage.of(this.me(), id).mp > this.me().mp) { this.note = 'MPが 足りない！'; G.Screens.render(); return; }
            return G.Screens.close({ type: 'move', move: id });
          }
          return;
        }

        if (this.view === 'party') {
          move(G.state.party.length, 2); // 幻獣は2列
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
          move(G.state.party.length, 2);
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
          body = `<div class="bt-grid main">${CMDS.map((c, i) =>
            `<div class="bt-cmd${i === this.sel ? ' sel' : ''}${c.soon ? ' disabled' : ''}${c.id === 'run' && b.type !== 'wild' ? ' disabled' : ''}">` +
            `<span class="cursor">${i === this.sel ? '▶' : ''}</span>${c.label}</div>`).join('')}</div>`;
          hint = '↑↓←→：えらぶ　Z：けってい';
          const tip = {
            guard: 'そのターンに受けるダメージを半分にする（先に動ける）',
            meditate: `MPを最大の${Math.round(G.GrowthConfig.MEDITATE_MP_RATE * 100)}%回復する（守りは固くならない）`,
            charge: `次の攻撃のダメージが${G.GrowthConfig.CHARGE_MUL}倍になる（入れかえると消える）`,
          }[CMDS[this.sel].id];
          const charged = b.sides.player.charged ? '<b class="charged">力をためている！</b>　' : '';
          if (tip || charged) body += `<div class="bt-info"><small>${charged}${tip || ''}</small></div>`;
        } else if (this.view === 'moves') {
          const list = this.moveList();
          const cur = G.MoveStage.of(this.me(), list[this.sel]);
          // 相手への相性（◎ 効果ばつぐん／△ いまひとつ）とタイプ一致（★）
          const foe = b.sides.enemy.mon;
          const fsp = foe && G.Species[foe.speciesId];
          const mySp = G.Species[this.me().speciesId];
          const mulOf = (mv) => (mv.cat === 'stat' || !fsp ? 1 : G.typeMultiplier(mv.el, G.elementsOf(fsp)));
          const mark = (mv) => { const x = mulOf(mv); return x > 1 ? '<b class="eff up">◎</b>' : x < 1 ? '<b class="eff down">△</b>' : ''; };
          const effText = (mv) => { const x = mulOf(mv); return x > 1 ? `<b class="eff up">効果ばつぐん（×${x}）</b>` : x < 1 ? `<b class="eff down">いまひとつ（×${x}）</b>` : ''; };
          body = `<div class="bt-grid">${list.map((id, i) => {
            const mv = G.MoveStage.of(this.me(), id);
            const lack = mv.mp > this.me().mp;
            return `<div class="bt-cmd move${i === this.sel ? ' sel' : ''}${lack ? ' disabled' : ''}">` +
              `<span class="cursor">${i === this.sel ? '▶' : ''}</span>${P().el(mv.el)}<span class="mv-name">${esc(mv.name)}${mv.stage > 1 ? `<small class="mv-plus">+${mv.stage - 1}</small>` : ''}</span>` +
              `${mark(mv)}<small>MP${mv.mp}</small></div>`;
          }).join('')}</div>` +
            `<div class="bt-info">${cur.basic ? '物理/特殊' : CAT[cur.cat]}　威力 ${cur.pow || '-'}　命中 ${cur.acc}　${cur.maxStage > 1 ? `強化 +${cur.stage - 1}/+${cur.maxStage - 1}　` : ''}` +
            `${cur.cat !== 'stat' && G.isStab(cur.el, mySp) ? `<b class="eff stab">タイプ一致×${G.stabMultiplier(cur.el, mySp)}</b>　` : ''}${effText(cur)}　` +
            `<br><small>${esc(cur.desc || '')}</small></div>`;
        } else if (this.view === 'party') {
          body = `<div class="bt-title">入れかえる幻獣は？</div>${partyRows(b, this.sel)}`;
        } else if (this.view === 'catch') {
          const ids = stones();
          const foe = b.sides.enemy.mon;
          const st = G.Monster.stats(foe);
          // 捕獲率：この絆石を今投げたときに成功する確率（HP・状態異常・絆石の種類で変わる）
          const pct = (id) => Math.round(b.catchChance(foe, id) * 100);
          const hint = foe.hp <= st.hp * 0.25 ? 'かなり弱っている！' : foe.hp <= st.hp * 0.5 ? '弱ってきている。' : 'まだまだ元気だ……';
          body = '<div class="bt-title">どの絆石を 投げる？</div>' + (ids.length
            ? ids.map((id, i) => `<div class="menu-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
              `<span class="stone-icon" style="--c:${G.Items[id].color}"></span>${G.Items[id].name}<span class="catch-rate">捕獲率 <b>${pct(id)}%</b></span><span class="count">×${G.Items[id].infinite ? '∞' : G.state.items[id]}</span></div>`).join('') +
              `<div class="bt-info"><small>${esc(foe.name)}は ${hint}${foe.status ? '（状態異常で 成功しやすい）' : ''}　あと <b>${G.CatchRules.maxFails - b.catchFails}</b>回 失敗で 怒る${G.Tamer.hasSkill('eye') ? `<br>才能（鑑定眼）：${G.Individual.KEYS.map((k) => `<span class="nowrap">${EYE[k]}<b class="iv-rank iv-${G.Individual.rank(G.Individual.iv(foe, k)).rank}">${G.Individual.rank(G.Individual.iv(foe, k)).rank}</b></span>`).join(' ')}` : ''}<br>幻獣使いLv${G.Tamer.level()}（${G.Species[foe.speciesId].rank}ランクは Lv${G.Tamer.needLevel(G.Species[foe.speciesId])}〜・捕獲率 ×${G.Tamer.catchBonus(G.Species[foe.speciesId]).toFixed(2)}）</small></div>`
            : '<div class="menu-empty">絆石を 持っていない。</div>');
        } else if (this.view === 'items') {
          const ids = G.ItemUse.battleItems();
          body = '<div class="bt-title">どの道具を使う？</div>' + (ids.length
            ? ids.map((id, i) => `<div class="menu-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
              `${G.Items[id].name}<span class="count">×${G.Items[id].infinite ? '∞' : G.state.items[id]}</span></div>`).join('') +
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
        // 2列：↑↓は2つ、←→は1つずつ動く
        const mv = (d) => { this.sel = (this.sel + d + n) % n; this.note = ''; G.Screens.render(); };
        if (In.consume('up')) mv(-2);
        if (In.consume('down')) mv(2);
        if (In.consume('left')) mv(-1);
        if (In.consume('right')) mv(1);
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
