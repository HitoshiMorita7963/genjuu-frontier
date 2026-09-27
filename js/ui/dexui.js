// 幻獣図鑑
//   未発見：？？？？ ／ 見ただけ：シルエットと名前 ／ 仲間にした：すべての情報
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const P = () => G.UIParts;
  const OBTAIN = { wild: '野生', fusion: '配合限定', evolve: '進化でのみ' };
  // 配合レシピの表示：見つけていれば「A + B → C」、まだなら伏せる
  function recipeLine(sp) {
    const rc = G.fusionRecipes.find((r) => r.resultId === sp.id);
    if (!rc) return '';
    if (rc.shadowedBy) return '<div class="small">配合レシピ：（別の幻獣と同じ組み合わせのため、配合では生まれない）</div>';
    if (G.Dex.recipeFound(sp.id)) return `<div class="small">配合レシピ：${esc(rc.display)}</div>`;
    return '<div class="small">配合レシピ：？？？？ ＋ ？？？？</div>';
  }

  G.UIScreens.dex = function () {
    return {
      layout: 'full',
      sel: 0,
      filter: 'all', // all | owned | fused
      list() {
        const d = G.state.dex;
        return G.SpeciesOrder.filter((id) => {
          if (this.filter === 'owned') return d[id] && d[id].owned;
          if (this.filter === 'fused') return d[id] && d[id].fused;
          return true;
        });
      },
      update(In) {
        const list = this.list();
        const n = list.length;
        const r = () => G.Screens.render();
        if (n && In.consume('up')) { this.sel = (this.sel - 1 + n) % n; r(); }
        if (n && In.consume('down')) { this.sel = (this.sel + 1) % n; r(); }
        if (In.consume('left') || In.consume('right')) {
          const order = ['all', 'owned', 'fused'];
          this.filter = order[(order.indexOf(this.filter) + 1) % order.length];
          this.sel = 0;
          r();
        }
        if (In.consume('cancel')) G.Screens.close();
        In.consume('confirm');
      },
      afterRender(el) {
        const s = el.querySelector('.dex-row.sel');
        if (s) s.scrollIntoView({ block: 'nearest' });
      },
      html() {
        const d = G.state.dex;
        const all = G.SpeciesOrder;
        const seen = all.filter((id) => d[id]).length;
        const owned = all.filter((id) => d[id] && d[id].owned).length;
        const list = this.list();
        const rows = list.length ? list.map((id, i) => {
          const e = d[id];
          const no = String(all.indexOf(id) + 1).padStart(3, '0');
          const name = e ? G.Species[id].name : '？？？？';
          const icon = e
            ? `<img class="mon-img icon" src="${e.owned ? G.MonsterGfx.dataURL(id) : G.MonsterGfx.silhouetteURL(id)}" alt="">`
            : '<span class="dex-unknown">?</span>';
          const mark = e && e.owned ? (e.fused ? '<span class="tag fz">配</span>' : '<span class="tag own">●</span>') : '';
          return `<div class="dex-row${i === this.sel ? ' sel' : ''}${e ? '' : ' unknown'}">${icon}<small>No.${no}</small> ${esc(name)} ${mark}</div>`;
        }).join('') : '<div class="menu-empty">該当する幻獣はいない。</div>';

        const id = list[this.sel];
        let detail = '';
        if (id) {
          const e = d[id];
          const sp = G.Species[id];
          const no = String(all.indexOf(id) + 1).padStart(3, '0');
          if (!e) {
            detail = `<div class="dex-detail-empty"><div class="dex-unknown big">?</div><div>No.${no}　？？？？</div>` +
              '<div class="small">まだ見たことのない幻獣だ。</div></div>';
          } else if (!e.owned) {
            detail = `<div class="detail-head"><img class="mon-img big" src="${G.MonsterGfx.silhouetteURL(id)}" alt="">` +
              `<div><div class="detail-name">No.${no} ${esc(sp.name)}</div>${P().speciesHead(sp)}` +
              `<div class="small">見かけた場所：${esc(e.where || '---')}</div></div></div>` +
              '<div class="desc">見かけたことはあるが、まだ仲間にしたことがない。</div>';
          } else {
            detail = `<div class="detail-head">${P().img(id, 'big')}` +
              `<div><div class="detail-name">No.${no} ${esc(sp.name)}</div>${P().speciesHead(sp)}` +
              `<div class="small">生息地：${esc(sp.habitat)}</div>` +
              `<div class="small">系統：${esc(sp.family)}　属性：${esc(sp.element)}　役割：${esc(sp.role)}</div>` +
              `<div class="small">入手：${OBTAIN[sp.obtain] || '---'}${sp.obtain === 'wild' && sp.recipeDisplay ? '・配合' : ''}${e.fused ? '　<span class="tag fz">配合で発見</span>' : ''}</div>` +
              recipeLine(sp) +
              `<div class="small">記録した場所：${esc(e.where || '---')}</div>` +
              `<div class="small">特性：${sp.traits.map((t) => G.Traits[t].name).join('／')}</div></div></div>` +
              `<div class="desc">${esc(sp.desc)}</div>`;
          }
        }
        const f = { all: 'すべて', owned: '仲間にした', fused: '配合で発見' }[this.filter];
        return `<div class="scr-title">幻獣図鑑 <span class="tab on">${f}</span>` +
          `<span class="dex-count">見た ${seen}　仲間 ${owned}　レシピ発見 ${Object.keys(G.state.recipesFound || {}).length}/${Object.keys(G.FusionRecipes.byPair).length}　／ 全${all.length}種</span></div>` +
          `<div class="scr-body two-col"><div class="mon-list dex-list">${rows}</div><div class="mon-detail">${detail}</div></div>` +
          '<div class="scr-hint">↑↓：えらぶ　←→：表示の切りかえ　X：もどる</div>';
      },
    };
  };
})(window.Game);
