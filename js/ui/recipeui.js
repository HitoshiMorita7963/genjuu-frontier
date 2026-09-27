// 配合表（メニュー → 配合表）
//   特別レシピ：公式レシピ。見つけた組み合わせは「親 ＋ 親 → 子」、まだなら ？？？？ で伏せてヒントだけ
//   系統の配合：レシピのない組み合わせ（汎用ルール）で、これまでに生まれた子
//   手持ち（パーティ＋預かり所）に親が2体そろっている見つけた組み合わせには「配合できる」と出す
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const TABS = [{ id: 'recipe', label: '特別レシピ' }, { id: 'rule', label: '系統の配合' }];

  const seen = (id) => !!(G.state.dex[id] && G.state.dex[id].seen);
  const owned = (id) => !!(G.state.dex[id] && G.state.dex[id].owned);
  // 図鑑の記録に合わせたアイコン：仲間にした → 絵、見ただけ → シルエット、未発見 → ？
  function icon(id) {
    if (owned(id)) return `<img class="mon-img icon" src="${G.MonsterGfx.dataURL(id)}" alt="">`;
    if (seen(id)) return `<img class="mon-img icon" src="${G.MonsterGfx.silhouetteURL(id)}" alt="">`;
    return '<span class="dex-unknown">?</span>';
  }
  const nameOf = (id) => (seen(id) ? esc(G.Species[id].name) : '？？？？');
  // 手持ちに、その2種族がそろっているか（同じ種族どうしなら2体いるか）
  function canFuse(a, b) {
    const ids = G.Party.all().map((m) => m.speciesId);
    if (a === b) return ids.filter((x) => x === a).length >= 2;
    return ids.includes(a) && ids.includes(b);
  }

  G.UIScreens.recipeBook = function () {
    return {
      layout: 'full',
      tab: 0,
      sel: 0,
      rows() {
        if (TABS[this.tab].id === 'recipe') {
          return Object.values(G.FusionRecipes.byPair)
            .sort((x, y) => Number(x.resultId) - Number(y.resultId))
            .map((rc) => ({ a: rc.parentIds[0], b: rc.parentIds[1], c: rc.resultId, found: G.Dex.recipeFound(rc.resultId), hint: rc.hint }));
        }
        return Object.entries(G.state.ruleFound || {})
          .map(([key, c]) => { const [a, b] = key.split('+'); return { a, b, c, found: true }; })
          .sort((x, y) => Number(x.c) - Number(y.c));
      },
      update(In) {
        const n = this.rows().length;
        const r = () => G.Screens.render();
        if (n && In.consume('up')) { this.sel = (this.sel - 1 + n) % n; r(); }
        if (n && In.consume('down')) { this.sel = (this.sel + 1) % n; r(); }
        if (In.consume('left') || In.consume('right')) { this.tab = (this.tab + 1) % TABS.length; this.sel = 0; r(); }
        if (In.consume('cancel')) G.Screens.close();
        In.consume('confirm');
      },
      html() {
        const rows = this.rows();
        const total = Object.keys(G.FusionRecipes.byPair).length;
        const found = Object.keys(G.state.recipesFound || {}).filter((id) => G.FusionRecipes.recipes.some((r) => r.resultId === id && !r.shadowedBy)).length;
        const list = rows.length ? rows.map((row, i) => {
          const sp = G.Species[row.c];
          const ok = row.found && canFuse(row.a, row.b);
          const body = row.found
            ? `${icon(row.a)}<span class="rc-name">${nameOf(row.a)}</span><span class="rc-op">＋</span>${icon(row.b)}<span class="rc-name">${nameOf(row.b)}</span>`
            : '<span class="dex-unknown">?</span><span class="rc-name">？？？？</span><span class="rc-op">＋</span><span class="dex-unknown">?</span><span class="rc-name">？？？？</span>';
          return `<div class="rc-row${i === this.sel ? ' sel' : ''}${row.found ? '' : ' unknown'}">${body}` +
            `<span class="rc-op">→</span>${row.found || seen(row.c) ? icon(row.c) : '<span class="dex-unknown">?</span>'}` +
            `<span class="rc-name result">${row.found ? esc(sp.name) : nameOf(row.c)}</span>${P().rank(sp.rank)}` +
            `${ok ? '<span class="tag fz">配合できる</span>' : ''}</div>`;
        }).join('') : '<div class="menu-empty">まだ ありません。<br>レシピのない組み合わせで配合すると、ここに記録されます。</div>';

        const cur = rows[this.sel];
        let detail = '';
        if (cur) {
          const sp = G.Species[cur.c];
          if (cur.found) {
            detail = `<b>${esc(G.Species[cur.a].name)} ＋ ${esc(G.Species[cur.b].name)} → ${esc(sp.name)}</b>` +
              `<span class="small">　${esc(sp.element)}・${esc(sp.family)}・${sp.rank}ランク${canFuse(cur.a, cur.b) ? '　手持ちの2体で配合できる' : ''}</span>`;
          } else {
            detail = `<span class="small muted">まだ見つけていない組み合わせ（${sp.rank}ランクの幻獣が生まれる）</span><br>${esc(cur.hint || '').replace(/\n/g, '<br>')}`;
          }
        }
        const tabs = TABS.map((t, i) => `<span class="tab${i === this.tab ? ' on' : ''}">${t.label}</span>`).join('');
        return `<div class="scr-title">配合表 ${tabs}<span class="dex-count">特別レシピ 発見 ${found} / ${total}</span></div>` +
          `<div class="scr-body rc-body"><div class="rc-list">${list}</div><div class="rc-detail">${detail}</div></div>` +
          '<div class="scr-hint">↑↓：えらぶ　←→：特別レシピ／系統の配合　X：もどる</div>';
      },
    };
  };
})(window.Game);
