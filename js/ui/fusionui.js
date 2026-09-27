// 配合の館：親A・親Bを選び、確認 → 誕生 → 技を選ぶ（親の技と子の技から）
//   結果は「？？？？」で隠す（すでに発見したレシピなら、図鑑の記録から名前がわかる）
//   キャンセルした場合は何も消費しない
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const TIER_TEXT = {
    rule: '新たな命が誕生した！',
    recipe: '特別な組み合わせだ！　新たな命が誕生した！',
    rare: 'すさまじい力を秘めた幻獣が生まれた……！！',
    super: '伝説に名を刻む幻獣が誕生した……！！！',
  };

  G.UIScreens.fusion = function () {
    return {
      layout: 'full',
      step: 'a',      // a → b → confirm → anim → moves（誕生した子の技を選ぶ）→ done
      sel: 0,
      a: null,
      b: null,
      yes: true,
      note: '',
      picks: [],
      isel: 0,
      result: null,

      candidates() {
        const all = G.Party.all();
        return this.step === 'b' ? all.filter((m) => m !== this.a) : all;
      },

      update(In, dt = 1 / 60) {
        const list = this.candidates();
        const r = () => G.Screens.render();
        if (this.step === 'a' || this.step === 'b') {
          if (list.length && In.consume('up')) { this.sel = (this.sel - 1 + list.length) % list.length; this.note = ''; r(); }
          if (list.length && In.consume('down')) { this.sel = (this.sel + 1) % list.length; this.note = ''; r(); }
          if (In.consume('confirm') && list.length) {
            if (this.step === 'a') { this.a = list[this.sel]; this.step = 'b'; this.sel = 0; this.note = ''; }
            else {
              const why = G.Fusion.check(this.a, list[this.sel]);
              if (why) this.note = why;
              else { this.b = list[this.sel]; this.step = 'confirm'; this.yes = true; this.note = ''; }
            }
            r();
          }
          if (In.consume('cancel')) {
            if (this.step === 'a') return G.Screens.close(null);
            this.step = 'a'; this.a = null; this.sel = 0; this.note = '';
            r();
          }
        } else if (this.step === 'confirm') {
          if (In.consume('left') || In.consume('right') || In.consume('up') || In.consume('down')) { this.yes = !this.yes; r(); }
          if (In.consume('cancel')) { this.step = 'b'; this.b = null; r(); return; }
          if (In.consume('confirm')) {
            if (!this.yes) { this.step = 'b'; this.b = null; r(); return; }
            this.step = 'anim';
            this.animT = 0;
            r();
          }
        } else if (this.step === 'moves') {
          // 誕生した子の技を選ぶ：子が覚える技と、親から受け継げる技を合わせて、持てる数まで
          const pool = this.movePool();
          const n = pool.length + 1; // 最後の行 = 決定
          if (In.consume('up')) { this.isel = (this.isel - 1 + n) % n; this.note = ''; r(); }
          if (In.consume('down')) { this.isel = (this.isel + 1) % n; this.note = ''; r(); }
          In.consume('cancel'); // 親はもういないので、もどれない
          if (In.consume('confirm')) {
            if (this.isel < pool.length) {
              const { id, parent } = pool[this.isel];
              const i = this.picks.indexOf(id);
              this.note = '';
              if (i >= 0) this.picks.splice(i, 1);
              else if (this.picks.length >= G.Monster.maxMoves(this.result.child.speciesId)) this.note = `技は${G.Monster.maxMoves(this.result.child.speciesId)}つまでです。どれかを外してください。`;
              else if (parent && this.parentPicks() >= G.Fusion.INHERIT_MAX) this.note = `親から受け継げる技は${G.Fusion.INHERIT_MAX}つまでです。`;
              else this.picks.push(id);
              r();
              return;
            }
            if (!this.picks.length) { this.note = '技を1つ以上選んでください。'; r(); return; }
            // 選んだ順ではなく、一覧の順（子の技 → 親の技）に並べる
            const order = pool.map((x) => x.id).filter((id) => this.picks.includes(id));
            if (G.Fusion.setChildMoves(this.result.child, order, this.result.parentMoves, this.result.parentStages)) {
              this.result.inheritedMoves = this.result.child.inheritedMoves;
              this.step = 'done';
              this.note = '';
              G.UI.refresh();
            }
            r();
          }
        } else if (this.step === 'anim') {
          this.animT += dt;
          if (this.animT >= 2.2) {
            try {
              this.result = G.Fusion.perform(this.a, this.b);
              G.Audio.se('fanfare');
              this.step = 'moves';
              this.picks = this.result.child.moves.slice();
              this.isel = 0;
              this.note = '';
            } catch (e) {
              // 失敗時は何も消費されていない（fusion.js が元に戻す）
              console.error('[fusion]', e);
              this.note = '配合に失敗しました：' + e.message;
              this.step = 'b'; this.b = null;
            }
            G.UI.refresh();
            r();
          }
        } else if (this.step === 'done') {
          if (In.consume('confirm') || In.consume('cancel')) G.Screens.close(this.result);
        }
      },

      // 技の候補：子が今のレベルまでに覚える技 → 親から受け継げる技（子も覚える技は、子の技として1回だけ）
      movePool() {
        const own = G.Fusion.childOwnMoves(this.result.child);
        return own.map((id) => ({ id, parent: false }))
          .concat(this.result.parentMoves.filter((id) => !own.includes(id)).map((id) => ({ id, parent: true })));
      },
      parentPicks() {
        const own = G.Fusion.childOwnMoves(this.result.child);
        return this.picks.filter((id) => !own.includes(id)).length;
      },

      slot(label, m) {
        if (!m) return `<div class="fz-slot empty"><div class="fz-label">${label}</div><div class="fz-q">―</div></div>`;
        const sp = G.Species[m.speciesId];
        return `<div class="fz-slot"><div class="fz-label">${label}</div>${P().img(m.speciesId, 'mid')}` +
          `<div><div><small>${G.dexNoLabel(sp.id)}</small> ${esc(m.name)} <small>Lv${m.level}</small></div>${P().speciesHead(sp)}` +
          `<div class="small">世代${m.generation}　配合値${m.fusionBonus || 0}</div></div></div>`;
      },

      childSlot() {
        if (this.step === 'done' || this.step === 'moves') {
          const c = this.result.child;
          const sp = G.Species[c.speciesId];
          return `<div class="fz-slot child born"><div class="fz-label">誕生した幻獣</div>${P().img(c.speciesId, 'mid')}` +
            `<div><div><small>${G.dexNoLabel(sp.id)}</small> ${esc(c.name)} <small>Lv${c.level}</small></div>${P().speciesHead(sp)}` +
            `<div class="small">世代${c.generation}　配合値${c.fusionBonus || 0}</div></div></div>`;
        }
        const cls = this.step === 'anim' ? ' glowing' : '';
        // すでに発見したレシピなら、図鑑の記録から子の名前がわかる
        const res = this.a && this.b ? G.Fusion.resolve(this.a, this.b) : null;
        const known = res && G.Fusion.known(this.a, this.b);
        const inner = known
          ? `${P().img(res.speciesId, 'mid')}<div><div>${esc(G.Species[res.speciesId].name)}</div><div class="small">（以前に試した組み合わせ）</div></div>`
          : '<div class="fz-q">？？？？</div>';
        return `<div class="fz-slot child${cls}"><div class="fz-label">誕生する幻獣</div>${inner}</div>`;
      },

      html() {
        const diagram = `<div class="fz-diagram">${this.slot('親A', this.a)}<div class="fz-arrow">＋</div>` +
          `${this.slot('親B', this.b)}<div class="fz-arrow">↓</div>${this.childSlot()}</div>`;
        let left = '';
        let hint = '';
        if (this.step === 'a' || this.step === 'b') {
          const list = this.candidates();
          const tag = (m) => {
            let t = G.Party.where(m) === 'storage' ? ' <span class="tag">預</span>' : '';
            // 2体目の候補：1体目と「特別な組み合わせ」（公式レシピ）になる相手に印（結果は伏せたまま）
            const res = this.step === 'b' ? G.Fusion.resolve(this.a, m) : null;
            if (res && res.kind === 'recipe') t += ' <span class="tag fz">特別</span>';
            return t;
          };
          left = `<div class="fz-prompt">${this.step === 'a' ? '1体目の親を選んでください' : '2体目の親を選んでください'}</div>` +
            (list.length ? list.map((m, i) => P().row(m, i === this.sel, tag(m))).join('') : '<div class="menu-empty">配合できる幻獣がいない。</div>') +
            (this.note ? `<div class="bt-note">${esc(this.note)}</div>` : '');
          hint = `↑↓：えらぶ　Z：けってい　X：${this.step === 'a' ? 'やめる' : 'もどる'}`;
        } else if (this.step === 'confirm') {
          left = '<div class="fz-prompt">この2体を配合しますか？</div>' +
            '<div class="fz-warn">※配合すると、親の2体はいなくなります（系譜には記録されます）。<br>' +
            `生まれる子はレベル${G.Fusion.childLevel(this.a, this.b)}・世代${Math.max(this.a.generation, this.b.generation) + 1}からのスタートです。<br>誕生したあと、親の技と子の技から、最初に覚えている技を選べます。</div>` +
            `<div class="yesno"><span class="${this.yes ? 'sel' : ''}">${this.yes ? '▶' : '　'}はい</span>` +
            `<span class="${this.yes ? '' : 'sel'}">${this.yes ? '　' : '▶'}いいえ</span></div>`;
          hint = '←→：えらぶ　Z：けってい　X：もどる';
        } else if (this.step === 'moves') {
          const pool = this.movePool();
          const c = this.result.child;
          const row = ({ id, parent }, i) => {
            // 強化段階：子の技は子のレベルで、親の技は親の段階のまま
            const st = parent ? (this.result.parentStages[id] || 1) : G.MoveStage.stage(c, id);
            const mv = Object.assign(G.MoveStage.of(null, id), st > 1 ? { pow: G.Moves[id].pow ? Math.round(G.Moves[id].pow * G.MoveStage.MUL[st - 1]) : 0 } : {});
            const on = this.picks.includes(id);
            return `<div class="menu-row${i === this.isel ? ' sel' : ''}"><span class="cursor">${i === this.isel ? '▶' : ''}</span>` +
              `<span class="check">${on ? '■' : '□'}</span>${P().el(mv.el)}${esc(mv.name)}${st > 1 ? `+${st - 1}` : ''}${parent ? '<span class="tag">親</span>' : ''}` +
              `<span class="count">${mv.cat === 'stat' ? '補助' : `威力${mv.pow}`} MP${mv.mp}</span></div>`;
          };
          const ownN = pool.filter((x) => !x.parent).length;
          left = `<div class="fz-born">${esc(G.Species[c.speciesId].name)}が 誕生した！</div>` +
            `<div class="fz-prompt">最初に覚えている技を選んでください（${this.picks.length}/${G.Monster.maxMoves(this.result.child.speciesId)}　親の技 ${this.parentPicks()}/${G.Fusion.INHERIT_MAX}）</div>` +
            '<div class="small muted">― 子が覚える技 ―</div>' + pool.slice(0, ownN).map((x, i) => row(x, i)).join('') +
            (pool.length > ownN ? '<div class="small muted">― 親から受け継ぐ技 ―</div>' + pool.slice(ownN).map((x, i) => row(x, ownN + i)).join('') : '') +
            `<div class="menu-row${this.isel === pool.length ? ' sel' : ''}"><span class="cursor">${this.isel === pool.length ? '▶' : ''}</span><b>この技に 決める</b></div>` +
            (this.note ? `<div class="bt-note">${esc(this.note)}</div>` : '') +
            `<div class="fz-warn">選ばなかった技は、覚えないまま生まれます。<br>固有技は受け継げません。親の特性を1つ受け継ぐことがあります。</div>`;
          hint = '↑↓：えらぶ　Z：選ぶ／けってい';
        } else if (this.step === 'anim') {
          left = '<div class="fz-prompt">2つの命が、光の中でひとつに溶けあっていく……</div>';
        } else {
          const r = this.result;
          const c = r.child;
          const sp = G.Species[c.speciesId];
          const moves = c.moves.map((id) => `${esc(G.Moves[id].name)}${r.inheritedMoves.includes(id) ? '<span class="tag">継承</span>' : ''}`).join('　');
          const traits = G.traitsOf(c).map((t) => `${G.Traits[t].name}${t === c.inheritedTrait ? '<span class="tag">継承</span>' : ''}`).join('　');
          left = `<div class="fz-prompt">${TIER_TEXT[r.tier] || ''}</div>` +
            `<div class="fz-born">${esc(sp.name)}が 誕生した！</div>` +
            `<div class="small">${r.recipe ? `レシピ：${esc(r.recipe.display)}` : '（系統の組み合わせで生まれた）'}</div>` +
            `<div class="small">技：${moves}</div><div class="small">特性：${traits}</div>` +
            `<div class="small">才能：${ivLine(c, r.ivSource)}</div>` +
            `<div class="small">世代${c.generation}／親：${esc(this.a.name)} ＋ ${esc(this.b.name)}</div>` +
            `<div class="small">${r.dest === 'party' ? 'パーティに加わった。' : 'パーティがいっぱいなので、預かり所へ送られた。'}</div>` +
            (r.gift ? `<div class="small">配合の記念に 『${esc(G.Items[r.gift[0]].name)}』を ${r.gift[1]}こ もらった！（もちものから 食べさせよう）</div>` : '');
          hint = 'Z：とじる';
        }
        return '<div class="scr-title">配合の館</div>' +
          `<div class="scr-body two-col fz"><div class="mon-list">${left}</div>${diagram}</div>` +
          `<div class="scr-hint">${hint}</div>`;
      },
    };
  };

  // 子の才能（個体値）。どちらの親から受け継いだかを示す。鑑定前は数値を出さず、ヒントだけ
  function ivLine(c, source = {}) {
    const I = G.Individual;
    if (!I.appraised()) return esc(I.hints(c)[0]) + '<span class="small muted">（親の才能を 一部受け継いだ）</span>';
    const tag = { a: '親A', b: '親B', random: '' };
    return I.KEYS.map((k) => `<span class="nowrap">${I.NAMES[k]}${I.iv(c, k)}<span class="iv-rank iv-${I.rank(I.iv(c, k)).rank}">${I.rank(I.iv(c, k)).rank}</span>` +
      (tag[source[k]] ? `<small class="muted">${tag[source[k]]}</small>` : '') + '</span>').join(' ');
  }
})(window.Game);
