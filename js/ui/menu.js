// フィールドメニュー（X / Esc）と、そこから開く画面
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;

  const ENTRIES = [
    { id: 'monsters', label: '幻獣' },
    { id: 'items', label: 'もちもの' },
    { id: 'status', label: '主人公' },
    { id: 'skills', label: 'スキル' },
    { id: 'dex', label: '図鑑' },
    { id: 'recipes', label: '配合表' },
    { id: 'save', label: 'セーブ' },
    { id: 'settings', label: 'せってい' },
    { id: 'close', label: 'とじる' },
  ];

  let lastSel = 0;

  function cycle(i, n, d) { return (i + d + n) % n; }

  G.UIScreens = {
    menu() {
      return {
        layout: 'menu',
        sel: lastSel,
        update(In) {
          if (In.consume('up')) { this.sel = cycle(this.sel, ENTRIES.length, -1); G.Screens.render(); }
          if (In.consume('down')) { this.sel = cycle(this.sel, ENTRIES.length, 1); G.Screens.render(); }
          if (In.consume('cancel')) return G.Screens.close();
          if (In.consume('confirm')) {
            const e = ENTRIES[this.sel];
            lastSel = this.sel;
            if (e.disabled) return;
            if (e.id === 'close') return G.Screens.close();
            if (e.id === 'monsters') G.Screens.open(G.UIScreens.party());
            if (e.id === 'items') G.Screens.open(G.UIScreens.items());
            if (e.id === 'status') G.Screens.open(G.UIScreens.status());
            if (e.id === 'skills') G.Screens.open(G.UIScreens.skills());
            if (e.id === 'dex') G.Screens.open(G.UIScreens.dex());
            if (e.id === 'recipes') G.Screens.open(G.UIScreens.recipeBook());
            if (e.id === 'save') G.Screens.open(G.UIScreens.save());
            if (e.id === 'settings') G.Screens.open(G.UIScreens.settings());
          }
        },
        html() {
          return '<div class="menu-title">メニュー</div>' + ENTRIES.map((e, i) =>
            `<div class="menu-row${i === this.sel ? ' sel' : ''}${e.disabled ? ' disabled' : ''}">` +
            `<span class="cursor">${i === this.sel ? '▶' : ''}</span>${e.label}` +
            `${e.disabled ? '<span class="soon">準備中</span>' : ''}</div>`).join('');
        },
      };
    },

    // 幻獣使いのスキル（幻獣使いレベルで覚える）。ワープは、行き先を選ぶ
    skills() {
      return {
        layout: 'menu wide',
        sel: 0,
        mode: 'list', // list | warp | radar
        wsel: 0,
        note: '',
        update(In) {
          const r = () => G.Screens.render();
          if (this.mode === 'radar') {
            if (In.consume('cancel') || In.consume('confirm')) { this.mode = 'list'; r(); }
            return;
          }
          if (this.mode === 'warp') {
            const spots = G.Tamer.warpSpots();
            if (spots.length && In.consume('up')) { this.wsel = cycle(this.wsel, spots.length, -1); r(); }
            if (spots.length && In.consume('down')) { this.wsel = cycle(this.wsel, spots.length, 1); r(); }
            if (In.consume('cancel')) { this.mode = 'list'; r(); return; }
            if (In.consume('confirm') && spots.length) {
              const w = spots[this.wsel];
              G.Screens.closeAll();
              G.UI.toast(`${w.name}へ ワープ！`);
              G.Field.warp(w.map, w.x, w.y, w.dir);
            }
            return;
          }
          const list = G.TamerSkills;
          if (In.consume('up')) { this.sel = cycle(this.sel, list.length, -1); this.note = ''; r(); }
          if (In.consume('down')) { this.sel = cycle(this.sel, list.length, 1); this.note = ''; r(); }
          if (In.consume('cancel')) return G.Screens.close();
          if (In.consume('confirm')) {
            const s = list[this.sel];
            if (!G.Tamer.hasSkill(s.id)) this.note = `幻獣使いLv${s.level}で 覚える スキルだ。`;
            else this.use(s);
            r();
          }
        },
        // スキルを使う（ワープ・レーダーは、次の画面へ）
        use(s) {
          const T = G.Tamer, F = G.Field;
          const outdoor = G.MapData[G.state.player.map] && G.MapData[G.state.player.map].encounter;
          if (s.id === 'warp') { this.mode = 'warp'; this.wsel = 0; return; }
          if (s.id === 'radar') {
            if (!outdoor) { this.note = 'ここには 野生の幻獣が いないようだ。'; return; }
            this.mode = 'radar'; this.wsel = 0; return;
          }
          if (s.id === 'escape') {
            const w = T.escapeSpot(G.state.player.map);
            if (!w) { this.note = 'ここでは 使えない。'; return; }
            G.Screens.closeAll();
            G.UI.toast(`${w.name}の 入口へ もどった！`);
            F.warp(w.map, w.x, w.y, w.dir);
            return;
          }
          if (s.id === 'repel' || s.id === 'lure') {
            T.startStepSkill(s.id);
            this.note = `${s.name}を 使った！（${G.TamerConfig.SKILL.STEPS}歩のあいだ 効く）`;
            return;
          }
          if (s.id === 'eye') { this.note = '鑑定眼は 覚えていれば いつも効く。仲間の 育成情報で 才能の数値が、絆石を 選ぶ画面で 相手の才能が 見える。'; return; }
          if (s.id === 'heal') {
            const wait = T.healWait();
            if (wait > 0) { this.note = `まだ 使えない。（あと ${Math.floor(wait / 60)}分${wait % 60}秒）`; return; }
            G.Party.healAll();
            (G.state.skillCd || (G.state.skillCd = {})).heal = G.state.playTime + G.TamerConfig.SKILL.HEAL_COOLDOWN;
            G.Audio.se('heal');
            G.UI.refresh();
            this.note = 'あたたかい光が パーティを 包んだ……\n幻獣たちは すっかり 元気になった！';
          }
        },
        html() {
          if (this.mode === 'radar') {
            // 幻獣レーダー：この地域に出る幻獣（見たことがなければ ？？？？）。仲間にしていない種族に印
            const enc = G.Encounters[G.MapData[G.state.player.map].encounter];
            const ids = [...new Set(enc.table.map((r) => r[0]))].sort((a, b) => G.Species[a].no - G.Species[b].no);
            const d = G.state.dex;
            const rows = ids.map((id) => {
              const e = d[id], sp = G.Species[id];
              const mark = e && e.owned ? '<span class="tag own">済</span>' : '<span class="tag fz">未</span>';
              return `<div class="menu-row"><span class="cursor"></span><span class="dex-no">${G.dexNoLabel(id)}</span>&nbsp;${e ? esc(sp.name) : '？？？？'}` +
                `<span class="count">${sp.rank}ランク　${mark}</span></div>`;
            }).join('');
            const left = ids.filter((id) => !(d[id] && d[id].owned)).length;
            return `<div class="menu-title">幻獣レーダー：${esc(enc.where)}</div><div class="menu-list">${rows}</div>` +
              `<div class="menu-desc">この地域の幻獣 ${ids.length}種のうち、まだ 仲間にしていないのは ${left}種。</div><div class="menu-hint">X：もどる</div>`;
          }
          if (this.mode === 'warp') {
            const spots = G.Tamer.warpSpots();
            return '<div class="menu-title">ワープ：どこへ 行く？</div>' +
              `<div class="menu-list">${spots.length ? spots.map((w, i) => `<div class="menu-row${i === this.wsel ? ' sel' : ''}"><span class="cursor">${i === this.wsel ? '▶' : ''}</span>${esc(w.name)}` +
                `${w.map === G.state.player.map ? '<span class="count">いまいる場所</span>' : ''}</div>`).join('') : '<div class="menu-empty">まだ 行ける場所が ない。</div>'}</div>` +
              '<div class="menu-desc">一度 行ったことのある場所へ、一瞬で 移動する。</div><div class="menu-hint">Z：ワープする　X：もどる</div>';
          }
          const rows = G.TamerSkills.map((s, i) => {
            const ok = G.Tamer.hasSkill(s.id);
            return `<div class="menu-row${i === this.sel ? ' sel' : ''}${ok ? '' : ' disabled'}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>${esc(s.name)}` +
              `<span class="count">${ok ? '' : `幻獣使いLv${s.level}で 覚える`}</span></div>`;
          }).join('');
          const cur = G.TamerSkills[this.sel];
          return `<div class="menu-title">スキル（幻獣使いLv${G.Tamer.level()}）</div><div class="menu-list">${rows}</div>` +
            `<div class="menu-desc">${esc(this.note || (cur ? cur.desc : ''))}</div><div class="menu-hint">Z：使う　X：もどる</div>`;
        },
      };
    },

    items() {
      return {
        layout: 'menu wide',
        sel: 0,
        target: null, // 使う道具を選んだ後、対象を選ぶ
        tsel: 0,
        qty: 0,       // 経験値アイテム・特訓の書：使う個数を選んでいるとき 1 以上
        note: '',
        // 並べる道具（デモプレイ用の無限モードでは、持っていない経験値アイテムも並べる）
        ids() {
          const ids = Object.keys(G.state.items);
          if (G.Settings.demoExp) for (const id in G.Items) if (G.demoInfinite(id) && !ids.includes(id)) ids.push(id);
          return ids;
        },
        have(id) { return G.demoInfinite(id) ? 999 : G.state.items[id] || 0; },
        update(In) {
          const ids = this.ids();
          if (this.target && this.qty) {
            const max = this.maxQty(this.target, G.state.party[this.tsel]);
            const step = (d) => { this.qty = Math.max(1, Math.min(max, this.qty + d)); G.Screens.render(); };
            if (In.consume('left')) step(-1);
            if (In.consume('right')) step(1);
            if (In.consume('up')) step(10);
            if (In.consume('down')) step(-10);
            if (In.consume('cancel')) { this.qty = 0; G.Screens.render(); return; }
            if (In.consume('confirm')) { const n = this.qty; this.qty = 0; this.apply(this.target, G.state.party[this.tsel], n); }
            return;
          }
          if (this.target) {
            const n = G.state.party.length;
            if (In.consume('up')) { this.tsel = cycle(this.tsel, n, -1); this.note = ''; G.Screens.render(); }
            if (In.consume('down')) { this.tsel = cycle(this.tsel, n, 1); this.note = ''; G.Screens.render(); }
            if (In.consume('cancel')) { this.target = null; this.note = ''; G.Screens.render(); return; }
            if (In.consume('confirm')) {
              const m = G.state.party[this.tsel];
              // 2個以上持っていて、まとめて使える道具なら、個数を選ぶ
              const why = this.cannotUse(this.target, m);
              if (why) { this.note = why; G.Screens.render(); }
              else if (this.maxQty(this.target, m) > 1) { this.qty = 1; this.note = ''; G.Screens.render(); }
              else this.apply(this.target, m, 1);
            }
            return;
          }
          if (ids.length && In.consume('up')) { this.sel = cycle(this.sel, ids.length, -1); this.note = ''; G.Screens.render(); }
          if (ids.length && In.consume('down')) { this.sel = cycle(this.sel, ids.length, 1); this.note = ''; G.Screens.render(); }
          if (In.consume('cancel')) return G.Screens.close();
          if (In.consume('confirm') && ids.length) {
            const it = G.Items[ids[this.sel]];
            if (['heal', 'status', 'revive', 'evolve', 'boost', 'ev', 'evreset', 'exp'].includes(it.type)) {
              if (!G.state.party.length) this.note = '幻獣を 連れていない。';
              else { this.target = ids[this.sel]; this.tsel = 0; }
            } else {
              this.note = it.type === 'capture' ? '野生の幻獣との 戦いで 使う道具だ。' : 'ここでは 使えない。';
            }
            G.Screens.render();
          }
        },
        // まとめて使える道具（経験値アイテム・特訓の書）で、使えないときの理由
        cannotUse(id, m) {
          const it = G.Items[id];
          if (it.type === 'exp' && m.level >= G.Monster.MAX_LEVEL) return `${m.name}は もう これ以上 レベルが 上がらない。`;
          if (it.type === 'ev' && !G.Individual.evRoom(m, it.stat)) return `${m.name}の ${G.Individual.NAMES[it.stat]}は これ以上 鍛えられない。`;
          return null;
        },
        // まとめて使える最大の個数（持っている数まで。上限に届く数より多くは使わない）
        maxQty(id, m) {
          const it = G.Items[id];
          const have = this.have(id);
          if (it.type === 'exp') return G.Growth.expItemsToMax(m, id, have);
          if (it.type === 'ev') return Math.max(1, Math.min(have, Math.ceil(G.Individual.evRoom(m, it.stat) / (it.gain || G.GrowthConfig.EV_ITEM_GAIN))));
          return 1;
        },
        apply(id, m, n = 1) {
          const it = G.Items[id];
          if (it.type === 'evolve') {
            const to = G.Growth.evolutionTarget(m, { item: id });
            if (!to) { this.note = '使っても 効果が ないようだ。'; G.Screens.render(); return; }
            G.addItem(id, -1);
            G.Screens.closeAll();
            G.Events.run((E) => G.Growth.evolve(m, to, E));
            return;
          }
          if (it.type === 'exp') {
            // 経験値アイテム：レベルアップ・技の習得・進化の演出があるので、メニューを閉じてイベントとして進める
            if (m.level >= G.Monster.MAX_LEVEL) { this.note = `${m.name}は もう これ以上 レベルが 上がらない。`; G.Screens.render(); return; }
            const amount = G.Growth.expItemAmount(m, id, n);
            const back = { sel: this.sel, tsel: this.tsel, id };
            if (!G.demoInfinite(id)) G.addItem(id, -n);
            G.Screens.closeAll();
            G.Events.run(async (E) => {
              G.Audio.se('heal');
              await E.narrate(`${m.name}は ${it.name}を ${n > 1 ? `${n}こ ` : ''}食べた！`);
              const ui = { msg: (t) => E.narrate(t) };
              if (await G.Growth.gainExp(m, amount, ui)) await G.Field.checkEvolutions([m], E);
              G.UI.refresh();
              // もちもの画面にもどる（続けて使えるように）
              G.Screens.open(G.UIScreens.menu());
              const scr = G.UIScreens.items();
              if (scr.have(back.id)) Object.assign(scr, { sel: back.sel, target: back.id, tsel: back.tsel });
              G.Screens.open(scr);
            });
            return;
          }
          if (it.type === 'ev') {
            const I = G.Individual;
            const before = G.Monster.stats(m).hp;
            let got = 0, used = 0;
            for (; used < n; used++) {
              const g = I.addEv(m, it.stat, it.gain || G.GrowthConfig.EV_ITEM_GAIN);
              if (!g) break;
              got += g;
            }
            m.hp += G.Monster.stats(m).hp - before; // 最大HPが増えた分だけ、今のHPも増やす
            if (!got) { this.note = `${m.name}の ${I.NAMES[it.stat]}は これ以上 鍛えられない。`; G.Screens.render(); return; }
            G.addItem(id, -used);
            this.note = `${m.name}の ${I.NAMES[it.stat]}の努力値が ${got} 上がった！（${I.ev(m, it.stat)}／${G.GrowthConfig.EV_MAX_STAT}）`;
          } else if (it.type === 'evreset') {
            if (!G.Individual.evTotal(m)) { this.note = `${m.name}は まだ 育成されていない。`; G.Screens.render(); return; }
            G.Individual.resetEvs(m);
            const max = G.Monster.stats(m);
            m.hp = Math.min(m.hp, max.hp); m.mp = Math.min(m.mp, max.mp);
            G.addItem(id, -1);
            this.note = `${m.name}の 努力値が すべて 0 に もどった。`;
          } else {
            this.note = G.ItemUse.use(id, m) || '使っても 効果が ないようだ。';
          }
          if (!G.state.items[id]) { this.target = null; this.sel = 0; }
          G.UI.refresh();
          G.Screens.render();
        },
        html() {
          const ids = this.ids();
          if (this.target && this.qty) {
            const m = G.state.party[this.tsel];
            const it = G.Items[this.target];
            const max = this.maxQty(this.target, m);
            let after = '';
            if (it.type === 'exp') after = `Lv${m.level} → Lv${G.Growth.levelAfterExp(m, G.Growth.expItemAmount(m, this.target, this.qty))}（経験値 +${G.Growth.expItemAmount(m, this.target, this.qty)}）`;
            if (it.type === 'ev') {
              const I = G.Individual;
              const add = Math.min(I.evRoom(m, it.stat), (it.gain || G.GrowthConfig.EV_ITEM_GAIN) * this.qty);
              after = `${I.NAMES[it.stat]}の努力値 ${I.ev(m, it.stat)} → ${I.ev(m, it.stat) + add}（上限 ${G.GrowthConfig.EV_MAX_STAT}）`;
            }
            return `<div class="menu-title">${it.name}を いくつ使う？</div>` +
              `<div class="menu-list">${P().row(m, true, '')}</div>` +
              `<div class="use-qty"><span class="qty-arrow">◀</span><b class="qty-num">× ${this.qty}</b><span class="qty-arrow">▶</span>` +
              `<span class="count">持っている数 ${G.demoInfinite(this.target) ? '∞' : G.state.items[this.target] || 0}　最大 ${max}</span></div>` +
              `<div class="menu-desc">${esc(after)}</div><div class="menu-hint">←→：1ずつ　↑↓：10ずつ　Z：使う　X：もどる</div>`;
          }
          if (this.target) {
            return `<div class="menu-title">${G.Items[this.target].name}を だれに使う？</div>` +
              `<div class="menu-list">${G.state.party.map((m, i) => P().row(m, i === this.tsel, m.status ? ` <span class="tag">${G.Battle.STATUS[m.status].short}</span>` : '')).join('')}</div>` +
              `<div class="menu-desc">${esc(this.note)}</div><div class="menu-hint">Z：使う　X：もどる</div>`;
          }
          const rows = ids.length
            ? ids.map((id, i) => `<div class="menu-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
              `${G.Items[id].name}<span class="count">×${G.Items[id].infinite || G.demoInfinite(id) ? '∞' : G.state.items[id]}</span></div>`).join('')
            : '<div class="menu-empty">なにも持っていない。</div>';
          const cur = ids[this.sel];
          return `<div class="menu-title">もちもの</div><div class="menu-list">${rows}</div>` +
            `<div class="menu-desc">${this.note ? esc(this.note) : cur ? G.Items[cur].desc : ''}</div><div class="menu-hint">Z：使う　X：もどる</div>`;
        },
      };
    },

    status() {
      return {
        layout: 'menu wide',
        update(In) { if (In.consume('cancel') || In.consume('confirm')) G.Screens.close(); },
        html() {
          const s = G.state;
          const dexOwned = Object.values(s.dex).filter((d) => d.owned).length;
          return '<div class="menu-title">主人公</div>' +
            `<table class="status"><tr><th>なまえ</th><td>${esc(s.player.name)}</td></tr>` +
            `<tr><th>しゅべつ</th><td>${s.player.gender === 'girl' ? '少女' : '少年'}・幻獣使い見習い</td></tr>` +
            `<tr><th>幻獣使いLv</th><td>${G.Tamer.level()}<small>${G.Tamer.toNext() ? `（次のLvまで ${G.Tamer.toNext()}）` : '（最高レベル）'}</small></td></tr>` +
            `<tr><th>絆を結べる</th><td>${Object.entries(G.TamerConfig.RANK_LEVEL).filter(([r]) => !['SS', 'SSS', 'EX'].includes(r)).map(([r, lv]) => `<span class="nowrap${G.Tamer.level() >= lv ? '' : ' muted'}">${r}${G.Tamer.level() >= lv ? '' : `(Lv${lv})`}</span>`).join(' ')}</td></tr>` +
            `<tr><th>所持金</th><td>${s.money.toLocaleString()} G</td></tr>` +
            `<tr><th>仲間の幻獣</th><td>パーティ ${s.party.length} 体／預かり所 ${s.storage.length} 体</td></tr>` +
            `<tr><th>図鑑</th><td>${dexOwned} / ${G.SpeciesOrder.length} 種</td></tr>` +
            `<tr><th>配合回数</th><td>${s.fusionCount || 0} 回</td></tr>` +
            `<tr><th>紋章</th><td>${s.items.kizunaEmblem ? '絆の紋章' : 'なし'}</td></tr>` +
            `<tr><th>プレイ時間</th><td>${G.Util.formatTime(s.playTime)}</td></tr></table>` +
            '<div class="menu-hint">X：もどる</div>';
        },
      };
    },

    // セーブ（既存データがあれば上書き確認）
    save() {
      return {
        layout: 'menu wide center',
        yes: true,
        result: null,
        prev: G.Save.info(),
        update(In) {
          if (this.result) { if (In.consume('confirm') || In.consume('cancel')) G.Screens.close(); return; }
          if (In.consume('left') || In.consume('right') || In.consume('up') || In.consume('down')) { this.yes = !this.yes; G.Screens.render(); }
          if (In.consume('cancel')) return G.Screens.close();
          if (In.consume('confirm')) {
            if (!this.yes) return G.Screens.close();
            this.result = G.Save.save();
            if (this.result.ok) G.Audio.se('save');
            G.Screens.render();
          }
        },
        html() {
          const s = G.state;
          const cur = `<table class="status"><tr><th>なまえ</th><td>${esc(s.player.name)}</td></tr>` +
            `<tr><th>現在地</th><td>${esc(G.format(G.MapData[s.player.map].name))}</td></tr>` +
            `<tr><th>プレイ時間</th><td>${G.Util.formatTime(s.playTime)}</td></tr>` +
            `<tr><th>仲間</th><td>${s.party.length}体（預かり所 ${s.storage.length}体）</td></tr></table>`;
          if (this.result) {
            return '<div class="menu-title">セーブ</div>' + cur +
              `<div class="menu-desc">${this.result.ok ? '冒険の記録を 書きこみました！' : esc(this.result.error)}</div>` +
              '<div class="menu-hint">Z：とじる</div>';
          }
          const prev = this.prev
            ? `<div class="small">前回の記録：${esc(this.prev.name)}／${esc(this.prev.place)}／${this.prev.playTime}<br>（${this.prev.savedAt}）</div>`
            : '<div class="small">記録はまだありません。</div>';
          return '<div class="menu-title">セーブ</div>' + cur + prev +
            `<div class="menu-desc">${this.prev ? '前回の記録に 上書きしますか？' : '冒険の記録を 書きこみますか？'}</div>` +
            `<div class="yesno"><span class="${this.yes ? 'sel' : ''}">${this.yes ? '▶' : '　'}はい</span>` +
            `<span class="${this.yes ? '' : 'sel'}">${this.yes ? '　' : '▶'}いいえ</span></div>` +
            '<div class="menu-hint">←→：えらぶ　Z：けってい　X：やめる</div>';
        },
      };
    },

    // 設定：文字の速さ・音量・オートセーブ
    settings() {
      const S = G.Settings;
      const ROWS = [
        { key: 'textSpeed', label: '文字の速さ', show: () => G.TEXT_SPEED_NAMES[S.textSpeed], step: (d) => { S.textSpeed = Math.max(0, Math.min(2, S.textSpeed + d)); } },
        { key: 'bgm', label: 'BGMの音量', show: () => vol(S.bgm), step: (d) => { S.bgm = Math.max(0, Math.min(10, S.bgm + d)); } },
        { key: 'se', label: '効果音の音量', show: () => vol(S.se), step: (d) => { S.se = Math.max(0, Math.min(10, S.se + d)); G.Audio.se('confirm'); } },
        { key: 'muted', label: 'サウンド', show: () => (S.muted ? 'OFF' : 'ON'), step: () => { S.muted = !S.muted; } },
        { key: 'autosave', label: 'オートセーブ', show: () => (S.autosave ? 'ON' : 'OFF'), step: () => { S.autosave = !S.autosave; } },
        { key: 'touch', label: 'タッチボタン', show: () => ({ auto: '自動', on: '表示', off: '非表示' })[S.touch || 'auto'],
          step: (d) => { const o = ['auto', 'on', 'off']; S.touch = o[(o.indexOf(S.touch || 'auto') + (d || 1) + 3) % 3]; } },
        { key: 'demoExp', label: '経験値アイテム無限（デモ）', show: () => (S.demoExp ? 'ON' : 'OFF'), step: () => { S.demoExp = !S.demoExp; } },
        { key: 'demoCatch', label: '絶対に捕まえられる（デモ）', show: () => (S.demoCatch ? 'ON' : 'OFF'), step: () => { S.demoCatch = !S.demoCatch; } },
      ];
      function vol(v) { return `<span class="vol">${'■'.repeat(v)}${'□'.repeat(10 - v)}</span> ${v}`; }
      return {
        layout: 'menu wide center',
        sel: 0,
        update(In) {
          if (In.consume('up')) { this.sel = cycle(this.sel, ROWS.length, -1); G.Screens.render(); }
          if (In.consume('down')) { this.sel = cycle(this.sel, ROWS.length, 1); G.Screens.render(); }
          const d = In.consume('right') ? 1 : In.consume('left') ? -1 : 0;
          if (d || In.consume('confirm')) { ROWS[this.sel].step(d || 1); G.saveSettings(); G.Screens.render(); }
          if (In.consume('cancel')) G.Screens.close();
        },
        html() {
          return '<div class="menu-title">せってい</div>' + ROWS.map((r, i) =>
            `<div class="menu-row setting-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
            `${r.label}<span class="count">◀ ${r.show()} ▶</span></div>`).join('') +
            '<div class="menu-desc">オートセーブ：村に着いたとき・回復したとき・大事な戦いのあとに、自動で記録します。<br>Mキーで いつでもサウンドのON/OFFを切りかえられます。<br>経験値アイテム無限：デモプレイ用。経験値アイテムを 持っていなくても もちものに並び、使っても なくなりません。<br>絶対に捕まえられる：デモプレイ用。野生の幻獣なら、HPや幻獣使いLvに関係なく 絆石で かならず 絆を結べます。</div>' +
            '<div class="menu-hint">↑↓：えらぶ　←→：変更　X：もどる</div>';
        },
      };
    },

    // 章クリア画面（opts: chapter, title, next）
    chapterEnd(opts = {}) {
      const o = Object.assign({ chapter: '第1章', title: '絆の紋章', next: 'To be continued…… 第2章「空を渡る竜」' }, opts);
      const res = (k) => (s) => (s.flags[k + 'Done'] || s.flags[k + 'Won'] ? (s.flags[k + 'Won'] ? '勝ち' : '負け') : '―');
      return {
        layout: 'full ending',
        t: 0,
        update(In, dt = 1 / 60) {
          this.t += dt;
          if (this.t > 1.5 && (In.consume('confirm') || In.consume('cancel'))) G.Screens.close();
        },
        html() {
          const s = G.state;
          const owned = Object.values(s.dex).filter((d) => d.owned).length;
          const lead = s.party[0];
          return '<div class="ending">' +
            `<div class="ending-sub">${esc(o.chapter)}</div><div class="ending-title">${esc(o.title)}</div><div class="ending-sub">―― 完 ――</div>` +
            (lead ? `<div class="ending-mon">${P().img(lead.speciesId, 'big')}<div>${esc(lead.name)} Lv${lead.level}</div></div>` : '') +
            `<table class="status ending-stats"><tr><th>幻獣使い</th><td>${esc(s.player.name)}</td></tr>` +
            `<tr><th>プレイ時間</th><td>${G.Util.formatTime(s.playTime)}</td></tr>` +
            `<tr><th>図鑑</th><td>${owned} / ${G.SpeciesOrder.length} 種</td></tr>` +
            `<tr><th>配合回数</th><td>${s.fusionCount || 0} 回</td></tr>` +
            `<tr><th>ライバル戦</th><td>${s.flags.rival1Won ? '勝ち' : '負け'} ／ ${res('rival2')(s)} ／ ${res('rival3')(s)}</td></tr></table>` +
            `<div class="ending-next">${esc(o.next)}</div>` +
            '<div class="scr-hint">Z：つづける</div></div>';
        },
      };
    },

    // 手持ち・預かり所の一覧と詳細
    party() {
      return {
        layout: 'full',
        tab: 'party',
        sel: 0,
        mode: 'list',   // list | actions | swap
        act: 0,
        swapFrom: -1,
        note: '',
        list() { return this.tab === 'party' ? G.state.party : G.state.storage; },
        actions() { return this.tab === 'party' ? ['育成情報', '系譜を見る', '並べかえ', '預ける', 'やめる'] : ['育成情報', '系譜を見る', 'パーティに加える', 'やめる']; },
        update(In) {
          const list = this.list();
          const n = list.length;
          const r = () => G.Screens.render();
          if (this.mode === 'actions') {
            const acts = this.actions();
            if (In.consume('up')) { this.act = cycle(this.act, acts.length, -1); r(); }
            if (In.consume('down')) { this.act = cycle(this.act, acts.length, 1); r(); }
            if (In.consume('cancel')) { this.mode = 'list'; r(); return; }
            if (In.consume('confirm')) this.doAction(acts[this.act]);
            return;
          }
          if (n && In.consume('up')) { this.sel = cycle(this.sel, n, -1); this.note = ''; r(); }
          if (n && In.consume('down')) { this.sel = cycle(this.sel, n, 1); this.note = ''; r(); }
          if (this.mode === 'swap') {
            if (In.consume('cancel')) { this.mode = 'list'; this.note = ''; r(); return; }
            if (In.consume('confirm')) {
              const p = G.state.party;
              [p[this.swapFrom], p[this.sel]] = [p[this.sel], p[this.swapFrom]];
              this.mode = 'list';
              this.note = '並びを 入れかえた。先頭の幻獣が 最初に戦う。';
              r();
            }
            return;
          }
          if (In.consume('left') || In.consume('right')) {
            this.tab = this.tab === 'party' ? 'storage' : 'party';
            this.sel = 0; this.note = '';
            r();
          }
          if (In.consume('cancel')) return G.Screens.close();
          if (In.consume('confirm') && n) { this.mode = 'actions'; this.act = 0; r(); }
        },
        doAction(a) {
          const m = this.list()[this.sel];
          this.mode = 'list';
          if (a === '育成情報') { G.Screens.open(G.UIScreens.monsterInfo(m)); return; }
          if (a === '系譜を見る') { G.Screens.open(G.UIScreens.lineage(m)); return; }
          if (a === '並べかえ') { this.mode = 'swap'; this.swapFrom = this.sel; this.note = 'どの幻獣と 入れかえる？'; }
          else if (a === '預ける') {
            if (G.state.party.filter((x) => x !== m && x.hp > 0).length === 0) this.note = '戦える幻獣が いなくなってしまう！';
            else { G.Party.remove(m); G.Party.toStorage(m); this.note = `${m.name}を 預かり所へ 預けた。（HP・MPは 満タンに なった）`; this.sel = Math.max(0, this.sel - 1); }
          } else if (a === 'パーティに加える') {
            if (G.state.party.length >= G.Monster.PARTY_MAX) this.note = 'パーティが いっぱいだ！';
            else { G.Party.remove(m); G.state.party.push(m); this.note = `${m.name}が パーティに 加わった。`; this.sel = Math.max(0, this.sel - 1); }
          }
          G.UI.refresh();
          G.Screens.render();
        },
        html() {
          const list = this.list();
          const tabs = `<span class="tab${this.tab === 'party' ? ' on' : ''}">パーティ ${G.state.party.length}/6</span>` +
            `<span class="tab${this.tab === 'storage' ? ' on' : ''}">預かり所 ${G.state.storage.length}</span>`;
          const rows = list.length
            ? list.map((m, i) => P().row(m, i === this.sel, this.mode === 'swap' && i === this.swapFrom ? ' <span class="tag">入替元</span>' : '')).join('')
            : `<div class="menu-empty">${this.tab === 'party' ? 'まだ幻獣を連れていない。' : '預けている幻獣はいない。'}</div>`;
          const acts = this.mode === 'actions'
            ? `<div class="mon-actions">${this.actions().map((a, i) => `<div class="menu-row${i === this.act ? ' sel' : ''}"><span class="cursor">${i === this.act ? '▶' : ''}</span>${a}</div>`).join('')}</div>` : '';
          const cur = list[this.sel];
          return `<div class="scr-title">幻獣 ${tabs}</div>` +
            `<div class="scr-body two-col"><div class="mon-list">${rows}${acts}${this.note ? `<div class="bt-note">${esc(this.note)}</div>` : ''}</div>` +
            `<div class="mon-detail">${cur ? P().detail(cur) : ''}</div></div>` +
            '<div class="scr-hint">↑↓：えらぶ　Z：操作　←→：パーティ／預かり所　X：もどる</div>';
        },
      };
    },

    // 最初の3体から1体を選ぶ
    starter(ids, preselect = 0) {
      return {
        layout: 'full',
        sel: preselect,
        confirm: false,
        update(In) {
          if (this.confirm) {
            if (In.consume('confirm')) return G.Screens.close(ids[this.sel]);
            if (In.consume('cancel')) { this.confirm = false; G.Screens.render(); }
            return;
          }
          if (In.consume('left')) { this.sel = cycle(this.sel, ids.length, -1); G.Screens.render(); }
          if (In.consume('right')) { this.sel = cycle(this.sel, ids.length, 1); G.Screens.render(); }
          if (In.consume('confirm')) { this.confirm = true; G.Screens.render(); }
          if (In.consume('cancel')) G.Screens.close(null);
        },
        html() {
          const cards = ids.map((id, i) => {
            const sp = G.Species[id];
            const st = G.Monster.stats({ speciesId: id, level: 50, fusionBonus: 0 }); // 平均的な個体（個体値15・努力値0）
            const bars = ['hp', 'atk', 'def', 'spd', 'sat', 'sdf'].map((k) =>
              `<div class="mini-stat"><span>${G.Monster.STAT_NAMES[k]}</span>${P().bar(st[k], k === 'hp' ? 170 : 120, 'stat')}</div>`).join('');
            return `<div class="starter-card${i === this.sel ? ' sel' : ''}">${P().img(id, 'big')}` +
              `<div class="detail-name">${sp.name}</div>${P().speciesHead(sp)}` +
              `<div class="small">特性：${G.Traits[sp.traits[0]].name}</div>` +
              `<div class="desc">${sp.desc}</div>${bars}</div>`;
          }).join('');
          const sp = G.Species[ids[this.sel]];
          const foot = this.confirm
            ? `<div class="confirm-box">${sp.name}を相棒にしますか？　<b>Z：はい</b>　X：いいえ</div>`
            : '<div class="scr-hint">←→：えらぶ　Z：けってい　X：やめる</div>';
          return '<div class="scr-title">相棒にする幻獣を選んでください</div>' +
            `<div class="starter-cards">${cards}</div>${foot}`;
        },
      };
    },
  };
})(window.Game);
