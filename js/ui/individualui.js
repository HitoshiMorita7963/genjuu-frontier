// 育成情報画面（種族値・個体値・努力値・系譜）と、訓練所の画面
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const I = () => G.Individual;
  const C = () => G.GrowthConfig;

  function cycle(i, n, d) { return (i + d + n) % n; }

  // 称号とオーラ
  function titleBadges(m) {
    return I().titles(m).map((t) => `<span class="title-badge${t.aura ? ' aura-' + t.aura : ''}" title="${esc(t.desc)}">${esc(t.name)}</span>`).join('');
  }
  function portrait(m) {
    const aura = I().aura(m);
    return `<div class="portrait${aura ? ' aura aura-' + aura : ''}">${P().img(m.speciesId, 'big')}</div>`;
  }
  function ivCell(m, k) {
    if (!I().appraised()) return '<span class="muted">？</span>';
    const v = I().iv(m, k);
    const r = I().rank(v).rank;
    return `${v} <span class="iv-rank iv-${r}">${r}</span>`;
  }
  function evBar(v, max = C().EV_MAX_STAT) {
    return `${P().bar(v, max, 'ev')}<small>${v}</small>`;
  }

  // 進化の系統（図鑑で見たことのない姿は ？？？？）と、次の進化の条件
  function evoText(m) {
    const chain = G.evolutionChain(m.speciesId);
    if (chain.length < 2) return '進化しない';
    const known = (id) => id === m.speciesId || (G.state.dex[id] && G.state.dex[id].seen);
    const names = chain.map((id) => (id === m.speciesId ? `<b>${esc(G.Species[id].name)}</b>` : known(id) ? esc(G.Species[id].name) : '？？？？')).join(' → ');
    const evo = G.Species[m.speciesId].evo;
    return names + `<small>${evo ? `次の進化：${esc(G.evolutionConditionText(evo))}` : '最後の姿'}</small>`;
  }

  const PAGES = ['能力', '才能・育成', '系譜・継承'];

  G.UIScreens.monsterInfo = function (m, startPage = 0) {
    return {
      layout: 'full',
      page: startPage,
      update(In) {
        if (In.consume('left')) { this.page = cycle(this.page, PAGES.length, -1); G.Screens.render(); }
        if (In.consume('right')) { this.page = cycle(this.page, PAGES.length, 1); G.Screens.render(); }
        if (In.consume('cancel') || In.consume('confirm')) G.Screens.close();
      },
      head() {
        const sp = G.Species[m.speciesId];
        return `<div class="info-head">${portrait(m)}<div>` +
          `<div class="detail-name"><small>No.${sp.id}</small> ${esc(m.name)} <small>Lv${m.level}</small></div>` +
          `${P().speciesHead(sp)}<div class="small">役割：${esc(sp.role)}型　成長：${G.Monster.GROWTH_NAMES[sp.growth]}</div>` +
          `<div class="titles">${titleBadges(m)}</div></div></div>`;
      },
      // 1ページ目：能力値の内訳
      pageStats() {
        const sp = G.Species[m.speciesId];
        const st = G.Monster.stats(m);
        const rows = I().KEYS.map((k) => `<tr><th>${I().NAMES[k]}</th><td class="num">${st[k]}</td>` +
          `<td>${P().bar(sp.stats[k], 140, 'stat')}<small>${sp.stats[k]}</small></td>` +
          `<td>${ivCell(m, k)}</td><td>${evBar(I().ev(m, k))}</td></tr>`).join('');
        return `<table class="info-table"><tr><th>能力</th><th>能力値</th><th>種族値</th><th>個体値</th><th>努力値</th></tr>${rows}` +
          `<tr class="sum"><th>合計</th><td></td><td><small>${sp.statTotal}</small></td>` +
          `<td>${I().appraised() ? `<small>${I().ivTotal(m)}／${6 * C().IV_MAX}</small>` : ''}</td>` +
          `<td><small>${I().evTotal(m)}／${C().EV_MAX_TOTAL}</small></td></tr></table>` +
          `<div class="info-note">成長傾向：${esc(I().growthText(m))}</div>` +
          `<div class="info-note small">MP ${st.mp}　命中 ${st.acc}　回避 ${st.eva}</div>`;
      },
      // 2ページ目：才能（個体値）と育成（努力値）
      pageTalent() {
        let talent;
        if (I().appraised()) {
          talent = I().KEYS.map((k) => `<div class="talent-row">${ivCell(m, k)}<span>${esc(I().talentText(m, k))}</span></div>`).join('');
        } else {
          talent = I().hints(m).map((t) => `<div class="talent-row"><span>「${esc(t)}」</span></div>`).join('') +
            '<div class="small muted">（鑑定屋に見てもらえば、才能を くわしく知ることができるらしい）</div>';
        }
        const evRows = I().KEYS.map((k) => `<div class="ev-row"><span>${I().NAMES[k]}</span>${evBar(I().ev(m, k))}</div>`).join('');
        const room = C().EV_MAX_TOTAL - I().evTotal(m);
        const titles = I().titles(m);
        return `<div class="info-cols"><div><div class="info-sub">個体情報（生まれつきの才能）</div>${talent}` +
          (titles.length ? `<div class="info-sub">称号</div>${titles.map((t) => `<div class="small"><b>${esc(t.name)}</b> ${esc(t.desc)}</div>`).join('')}` : '') +
          `</div><div><div class="info-sub">育成状況（努力値）</div>${evRows}` +
          `<div class="small">合計 ${I().evTotal(m)}／${C().EV_MAX_TOTAL}（あと ${room}）</div>` +
          `${I().evTexts(m).map((t) => `<div class="small">・${esc(t)}</div>`).join('')}</div></div>`;
      },
      // 3ページ目：系譜と継承
      pageLineage() {
        const pn = (m.parentInstanceIds || []).map((id) => G.Lineage.get(id)).filter(Boolean);
        const parent = (p) => {
          const SHORT = { hp: 'HP', atk: '攻', def: '防', spd: '速', sat: '特攻', sdf: '特防' };
          const ivs = p.ivs && I().appraised()
            ? `<div class="small muted">個体値 ${I().KEYS.map((k) => `${SHORT[k]}${p.ivs[k]}`).join(' ')}</div>` : '';
          return `<div class="parent-card">${P().img(p.speciesId, 'icon')}<div>${esc(p.name)} <small>Lv${p.level}・世代${p.generation}</small>${ivs}</div></div>`;
        };
        const inhMoves = (m.inheritedMoves || []).map((id) => G.Moves[id] ? esc(G.Moves[id].name) : id).join('、') || 'なし';
        const inhTrait = m.inheritedTrait && G.Traits[m.inheritedTrait]
          ? `${esc(G.Traits[m.inheritedTrait].name)} <small>${esc(G.Traits[m.inheritedTrait].desc)}</small>` : 'なし';
        const how = { wild: '野生で出会った', starter: '最初の相棒', gift: 'ゆずり受けた', fusion: '配合で誕生', trainer: 'トレーナーの幻獣' }[m.origin && m.origin.how] || '―';
        return `<div class="info-cols"><table class="status info-lineage">` +
          `<tr><th>世代</th><td>${m.generation || 0}</td></tr>` +
          `<tr><th>配合回数</th><td>${I().fusionCount(m)} 回<small>（この個体と祖先が、配合で生まれた回数）</small></td></tr>` +
          `<tr><th>配合値</th><td>${m.fusionBonus || 0}<small>${esc(I().bloodlineText(m))}</small></td></tr>` +
          `<tr><th>入手</th><td>${how}${m.origin && m.origin.where ? `（${esc(m.origin.where)}）` : ''}</td></tr>` +
          `<tr><th>継承した技</th><td>${inhMoves}</td></tr>` +
          `<tr><th>継承した特性</th><td>${inhTrait}</td></tr>` +
          `<tr><th>進化</th><td>${evoText(m)}</td></tr></table>` +
          `<div><div class="info-sub">親</div>${pn.length ? `<div class="parents">${pn.map(parent).join('')}</div>` : '<div class="small muted">配合で生まれた個体ではない。</div>'}</div></div>`;
      },
      html() {
        const tabs = PAGES.map((p, i) => `<span class="tab${i === this.page ? ' on' : ''}">${p}</span>`).join('');
        const body = [this.pageStats, this.pageTalent, this.pageLineage][this.page].call(this);
        return `<div class="scr-title">育成情報 ${tabs}</div><div class="scr-body info-body">${this.head()}${body}</div>` +
          '<div class="scr-hint">←→：ページ　X：もどる</div>';
      },
    };
  };

  // ---------------- 訓練所：お金を払って努力値を上げる ----------------
  G.UIScreens.training = function () {
    const T = C().TRAINING;
    const STATS = I().KEYS;
    return {
      layout: 'full',
      mode: 'mon',   // mon：幻獣を選ぶ / stat：鍛える能力を選ぶ
      sel: 0,
      ssel: 0,
      note: '',
      update(In) {
        const list = G.state.party;
        const r = () => G.Screens.render();
        if (this.mode === 'mon') {
          if (In.consume('up')) { this.sel = cycle(this.sel, list.length, -1); this.note = ''; r(); }
          if (In.consume('down')) { this.sel = cycle(this.sel, list.length, 1); this.note = ''; r(); }
          if (In.consume('cancel')) return G.Screens.close();
          if (In.consume('confirm') && list.length) { this.mode = 'stat'; this.ssel = 0; this.note = ''; r(); }
          return;
        }
        const n = STATS.length + 1; // 最後の行は「努力値をリセット」
        if (In.consume('up')) { this.ssel = cycle(this.ssel, n, -1); this.note = ''; r(); }
        if (In.consume('down')) { this.ssel = cycle(this.ssel, n, 1); this.note = ''; r(); }
        if (In.consume('cancel')) { this.mode = 'mon'; this.note = ''; r(); return; }
        if (In.consume('confirm')) { this.train(list[this.sel]); r(); }
      },
      train(m) {
        const I_ = I();
        if (this.ssel === STATS.length) {
          if (!I_.evTotal(m)) { this.note = `${m.name}は まだ 育成されていない。`; return; }
          if (G.state.money < T.resetCost) { this.note = 'お金が 足りない。'; return; }
          G.addMoney(-T.resetCost);
          I_.resetEvs(m);
          const max = G.Monster.stats(m);
          m.hp = Math.min(m.hp, max.hp); m.mp = Math.min(m.mp, max.mp);
          this.note = `${m.name}の 努力値を すべて 0 に もどした。`;
          G.Audio.se('confirm');
          G.UI.refresh();
          return;
        }
        const k = STATS[this.ssel];
        if (!I_.evRoom(m, k)) { this.note = `${I_.NAMES[k]}は これ以上 鍛えられない。`; return; }
        if (G.state.money < T.cost) { this.note = 'お金が 足りない。'; return; }
        const before = G.Monster.stats(m).hp;
        const got = I_.addEv(m, k, T.gain);
        m.hp += G.Monster.stats(m).hp - before;
        G.addMoney(-T.cost);
        G.Audio.se('levelup');
        this.note = `${m.name}は ${I_.NAMES[k]}を 鍛えた！　努力値 +${got}`;
        G.UI.refresh();
      },
      html() {
        const list = G.state.party;
        const m = list[this.sel];
        const rows = list.map((x, i) => P().row(x, i === this.sel && this.mode === 'mon', ` <small>努力値 ${I().evTotal(x)}/${C().EV_MAX_TOTAL}</small>`)).join('');
        let right = '';
        if (m) {
          const st = G.Monster.stats(m);
          const statRows = STATS.map((k, i) => `<div class="menu-row${this.mode === 'stat' && i === this.ssel ? ' sel' : ''}">` +
            `<span class="cursor">${this.mode === 'stat' && i === this.ssel ? '▶' : ''}</span>` +
            `<span class="train-name">${I().NAMES[k]}</span><span class="train-val">${st[k]}</span>${evBar(I().ev(m, k))}</div>`).join('');
          const reset = `<div class="menu-row${this.mode === 'stat' && this.ssel === STATS.length ? ' sel' : ''}">` +
            `<span class="cursor">${this.mode === 'stat' && this.ssel === STATS.length ? '▶' : ''}</span>努力値をリセット（${T.resetCost}G）</div>`;
          right = `<div class="info-head">${portrait(m)}<div><div class="detail-name">${esc(m.name)} <small>Lv${m.level}</small></div>` +
            `<div class="small">努力値 ${I().evTotal(m)}／${C().EV_MAX_TOTAL}</div>` +
            `${I().evTexts(m).slice(0, 2).map((t) => `<div class="small">・${esc(t)}</div>`).join('')}</div></div>${statRows}${reset}`;
        }
        return `<div class="scr-title">訓練所 <span class="count">所持金 ${G.state.money.toLocaleString()} G　特訓 1回 ${T.cost}G（努力値 +${T.gain}）</span></div>` +
          `<div class="scr-body two-col"><div class="mon-list">${rows}</div><div class="mon-detail">${right}</div></div>` +
          `${this.note ? `<div class="bt-note">${esc(this.note)}</div>` : ''}` +
          `<div class="scr-hint">${this.mode === 'mon' ? '↑↓：幻獣をえらぶ　Z：決定　X：やめる' : '↑↓：能力をえらぶ　Z：特訓する　X：幻獣をえらび直す'}</div>`;
      },
    };
  };
})(window.Game);
