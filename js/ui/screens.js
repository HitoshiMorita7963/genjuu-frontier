// 画面（メニュー・パーティ・配合など）の重ね合わせ管理と共通パーツ
//   G.Screens.open(screen) は閉じたときの値で解決する Promise を返す（イベントから await できる）
//   screen = { layout: 'menu'|'full', html(), update(Input, dt), afterRender?(el) }
(function (G) {
  'use strict';

  let el = null;

  G.Screens = {
    stack: [],
    init() { el = document.getElementById('ui-layer'); },
    get active() { return this.stack.length > 0; },
    top() { return this.stack[this.stack.length - 1]; },
    open(screen) {
      return new Promise((resolve) => {
        screen._resolve = resolve;
        this.stack.push(screen);
        G.Input.clearPressed();
        this.render();
      });
    },
    close(value) {
      const s = this.stack.pop();
      G.Input.clearPressed();
      this.render();
      if (s && s._resolve) s._resolve(value);
    },
    closeAll() { while (this.stack.length) this.close(); },
    update(dt) { const s = this.top(); if (s) s.update(G.Input, dt); },
    render() {
      const s = this.top();
      if (!s) { el.className = 'hidden'; el.innerHTML = ''; return; }
      el.className = 'ui-layer ' + (s.layout || 'menu');
      el.innerHTML = s.html();
      if (s.afterRender) s.afterRender(el);
    },
  };

  // ---------------- 共通パーツ ----------------
  const esc = (s) => G.escapeHtml(s);
  const P = G.UIParts = {
    img(speciesId, cls = '') {
      return `<img class="mon-img ${cls}" src="${G.MonsterGfx.dataURL(speciesId)}" alt="">`;
    },
    el(el) {
      const e = G.Elements[el];
      return `<span class="badge el" style="--c:${e.color}">${e.name}</span>`;
    },
    line(line) { return `<span class="badge line">${G.Lineages[line].name}</span>`; },
    rank(r) { return `<span class="badge rank rank-${r}">${r}</span>`; },
    bar(v, max, cls = 'hp') {
      const pct = max > 0 ? Math.max(0, Math.min(100, (v / max) * 100)) : 0;
      return `<span class="bar ${cls}"><i style="width:${pct}%"></i></span>`;
    },
    // 一覧の1行
    row(m, selected, extra = '') {
      const st = G.Monster.stats(m);
      const aura = G.Individual.aura(m);
      return `<div class="mon-row${selected ? ' sel' : ''}">` +
        `${P.img(m.speciesId, 'icon')}` +
        `<div class="mon-row-main"><div>${esc(m.name)} <small>Lv${m.level}</small>${aura ? ` <span class="aura-mark aura-${aura}">✦</span>` : ''}${extra}</div>` +
        `<div class="mon-row-sub">${P.bar(m.hp, st.hp)}<small>${m.hp}/${st.hp}</small></div></div></div>`;
    },
    // 種族の基本情報
    speciesHead(sp) {
      return `<div class="badges">${P.el(sp.el)}${P.line(sp.line)}${P.rank(sp.rank)}</div>`;
    },
    // 個体の詳細
    detail(m) {
      const sp = G.Species[m.speciesId];
      const st = G.Monster.stats(m);
      const nextExp = m.level >= G.Monster.MAX_LEVEL ? null : G.Monster.expForLevel(sp, m.level + 1);
      const curExp = G.Monster.expForLevel(sp, m.level);
      const statRows = ['atk', 'def', 'spd', 'sat', 'sdf', 'acc', 'eva']
        .map((k) => `<tr><th>${G.Monster.STAT_NAMES[k]}</th><td>${st[k]}</td></tr>`).join('');
      const inh = m.inheritedMoves || [];
      const moves = m.moves.map((id) => {
        const mv = G.Moves[id];
        const cat = { phys: '物理', spec: '特殊', stat: '補助' }[mv.cat];
        return `<tr><td>${P.el(mv.el)}${esc(mv.name)}${mv.inherit ? '' : ' <span class="sig">固有</span>'}${inh.includes(id) ? ' <span class="tag">継承</span>' : ''}</td>` +
          `<td>${cat}</td><td>${mv.pow || '-'}</td><td>${mv.acc}</td><td>${mv.mp}</td></tr>`;
      }).join('');
      const traits = G.traitsOf(m).map((t) =>
        `<div><b>${G.Traits[t].name}</b>${t === m.inheritedTrait ? ' <span class="tag">継承</span>' : ''} <small>${G.Traits[t].desc}</small></div>`).join('');
      const pn = (m.parentInstanceIds || []).map((id) => G.Lineage.get(id)).filter(Boolean);
      const parents = pn.length === 2
        ? `<div class="small">親：${esc(pn[0].name)} ＋ ${esc(pn[1].name)}</div>` : '';
      return `<div class="detail-head">${P.img(m.speciesId, 'big')}<div>` +
        `<div class="detail-name"><small>No.${sp.id}</small> ${esc(m.name)} <small>Lv${m.level}</small></div>` +
        `${P.speciesHead(sp)}` +
        `<div class="small">HP ${P.bar(m.hp, st.hp)} ${m.hp}/${st.hp}</div>` +
        `<div class="small">MP ${P.bar(m.mp, st.mp, 'mp')} ${m.mp}/${st.mp}</div>` +
        `<div class="small">EXP ${nextExp === null ? 'MAX' : `${m.exp - curExp} / ${nextExp - curExp}`} ` +
        `（${G.Monster.GROWTH_NAMES[sp.growth]}）</div>` +
        `</div></div>` +
        `<div class="detail-cols"><table class="stats">${statRows}</table>` +
        `<div><div class="small">世代 <b>${m.generation}</b>　配合値 <b>${m.fusionBonus || 0}</b>　努力値 <b>${G.Individual.evTotal(m)}</b></div>${parents}` +
        `<div class="small talent-hint">${esc(G.Individual.hints(m)[0])}</div>` +
        `<div class="traits">${traits}</div></div></div>` +
        `<table class="moves"><tr><th>技</th><th>分類</th><th>威力</th><th>命中</th><th>MP</th></tr>${moves}</table>` +
        `<div class="desc">${esc(sp.desc)}</div>`;
    },
  };
})(window.Game);
