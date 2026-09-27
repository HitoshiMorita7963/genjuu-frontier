// 画面（メニュー・パーティ・配合など）の重ね合わせ管理と共通パーツ
//   G.Screens.open(screen) は閉じたときの値で解決する Promise を返す（イベントから await できる）
//   screen = { layout: 'menu'|'full', html(), update(Input, dt), afterRender?(el) }
//
//   スクロール：画面は入力のたびに作り直すので、
//     ・作り直す前のスクロール位置を覚えておき、作り直した後に戻す
//     ・選択中の行（.sel）が、スクロールする枠の中で見えるように自動でスクロールする
//     ・選択のない画面（系譜・育成情報など）は G.Screens.scroll(sel, dx, dy) で矢印キーからスクロールできる
(function (G) {
  'use strict';

  let el = null;
  let lastLayout = null;

  const scrollable = (e) => {
    const cs = getComputedStyle(e);
    return (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1) ||
      (/(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 1);
  };
  // 作り直しても同じ要素を指せるキー（クラス名＋同じクラスの中での順番）を、全要素に1回の走査でつける
  function eachKeyed(fn) {
    const count = {};
    for (const e of el.querySelectorAll('*')) {
      const cls = (typeof e.className === 'string' && e.className) || e.tagName;
      count[cls] = (count[cls] || 0) + 1;
      fn(e, `${cls}#${count[cls]}`);
    }
  }
  function saveScroll() {
    const out = {};
    if (!el) return out;
    eachKeyed((e, key) => { if (e.scrollTop || e.scrollLeft) out[key] = [e.scrollTop, e.scrollLeft]; });
    if (el.scrollTop) out.__root = [el.scrollTop, 0];
    return out;
  }
  function restoreScroll(saved) {
    if (saved.__root) el.scrollTop = saved.__root[0];
    eachKeyed((e, key) => { const s = saved[key]; if (s) { e.scrollTop = s[0]; e.scrollLeft = s[1]; } });
  }
  // スマホなど幅の狭い画面では、ゲーム画面（キャンバス）が小さいので、
  // 全画面のメニューだけ「上の情報バー 〜 タッチボタンの上（なければ画面の下）」まで広げる。
  // 進化の演出・章クリアは下のメッセージ欄を使うので広げない
  const NARROW = 640;
  //   バトルのコマンドは、狭い画面ではキャンバスの下（メッセージ欄の位置）に横いっぱいで出す
  function fitLayer(s) {
    const layout = s.layout || '';
    const narrow = window.innerWidth <= NARROW;
    const wide = narrow && /\bfull\b/.test(layout) && !/\b(evo|ending)\b/.test(layout);
    const dock = narrow && /\bbattle\b/.test(layout);
    el.classList.toggle('expanded', wide);
    el.classList.toggle('docked', dock);
    el.style.top = el.style.bottom = el.style.left = el.style.right = el.style.maxHeight = '';
    if (!wide && !dock) return;
    const pad = document.getElementById('touch-pad');
    const padTop = pad && !pad.classList.contains('hidden') ? pad.getBoundingClientRect().top : window.innerHeight;
    if (wide) {
      const hud = document.getElementById('hud');
      el.style.top = `${Math.max(4, hud ? hud.getBoundingClientRect().top : 8)}px`;
      el.style.bottom = `${Math.max(4, window.innerHeight - padTop + 6)}px`;
      return;
    }
    const msg = document.getElementById('message').getBoundingClientRect();
    el.style.top = `${msg.top}px`;
    el.style.left = `${msg.left}px`;
    el.style.right = `${window.innerWidth - msg.right}px`;
    el.style.maxHeight = `${Math.max(msg.height, padTop - msg.top - 6)}px`;
  }
  window.addEventListener('resize', () => { const s = G.Screens.top(); if (s && el) fitLayer(s); });

  // 選択中の要素が、いちばん近いスクロール枠の中で見えるようにする（ページ全体は動かさない）
  function followSelection() {
    for (const sel of el.querySelectorAll('.sel')) {
      let box = sel.parentElement;
      while (box && box !== el.parentElement && !scrollable(box)) box = box.parentElement;
      if (!box || box === el.parentElement) continue;
      const b = box.getBoundingClientRect(), r = sel.getBoundingClientRect();
      const pad = 4;
      if (r.top < b.top + pad) box.scrollTop -= b.top + pad - r.top;
      else if (r.bottom > b.bottom - pad) box.scrollTop += r.bottom - (b.bottom - pad);
    }
  }

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
      if (!s) { el.className = 'hidden'; el.innerHTML = ''; lastLayout = null; return; }
      // 同じ画面の作り直しなら、スクロール位置を引き継ぐ（別の画面に切りかわったら先頭から）
      const same = lastLayout === s;
      const saved = same ? saveScroll() : {};
      el.className = 'ui-layer ' + (s.layout || 'menu');
      fitLayer(s);
      el.innerHTML = s.html();
      if (!same) el.scrollTop = 0;
      lastLayout = s;
      if (same) restoreScroll(saved);
      if (s.afterRender) s.afterRender(el);
      followSelection();
    },
    // 選択のない画面を矢印キーでスクロールする（selector の枠を dx, dy ピクセル動かす）
    scroll(selector, dx, dy) {
      const box = el && el.querySelector(selector);
      if (!box) return false;
      box.scrollLeft += dx;
      box.scrollTop += dy;
      return true;
    },
    // 矢印キーでスクロールするときの共通処理（押されたキーがあれば true）
    scrollKeys(In, selector, { vertical = true, horizontal = false, step = 48 } = {}) {
      let moved = false;
      if (vertical && In.consume('up')) moved = G.Screens.scroll(selector, 0, -step) || moved;
      if (vertical && In.consume('down')) moved = G.Screens.scroll(selector, 0, step) || moved;
      if (horizontal && In.consume('left')) moved = G.Screens.scroll(selector, -step * 2, 0) || moved;
      if (horizontal && In.consume('right')) moved = G.Screens.scroll(selector, step * 2, 0) || moved;
      return moved;
    },
  };

  // ---------------- 共通パーツ ----------------
  const esc = (s) => G.escapeHtml(s);
  const P = G.UIParts = {
    img(speciesId, cls = '') {
      return `<img class="mon-img ${cls}" src="${G.MonsterGfx.dataURL(speciesId)}" alt="">`;
    },
    // 属性のバッジ（上位属性は ◆ 付き。例：◆氷）
    el(el) {
      const e = G.Elements[el];
      const up = e.base ? ` upper" title="${G.Elements[e.base].name}の上位属性` : '';
      return `<span class="badge el${up}" style="--c:${e.color}">${e.base ? '◆' : ''}${e.name}</span>`;
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
      return `<div class="badges">${G.elementsOf(sp).map(P.el).join('')}${P.line(sp.line)}${P.rank(sp.rank)}</div>`;
    },
    // 個体の詳細
    detail(m) {
      const sp = G.Species[m.speciesId];
      const st = G.Monster.stats(m);
      const nextExp = m.level >= G.Monster.MAX_LEVEL ? null : G.Monster.expForLevel(sp, m.level + 1);
      const curExp = G.Monster.expForLevel(sp, m.level);
      const statRows = ['atk', 'def', 'spd', 'sat', 'sdf']
        .map((k) => `<tr><th>${G.Monster.STAT_NAMES[k]}</th><td>${st[k]}</td></tr>`).join('');
      const inh = m.inheritedMoves || [];
      const moves = m.moves.map((id) => {
        const mv = G.MoveStage.of(m, id); // 強化（+1 など）を反映
        const cat = { phys: '物理', spec: '特殊', stat: '補助' }[mv.cat];
        const next = mv.stage < mv.maxStage ? `<small class="muted">（次の強化 Lv${G.MoveStage.learnedAt(m, id) + mv.stage * G.MoveStage.STEP}）</small>` : '';
        return `<tr><td>${P.el(mv.el)}${esc(G.MoveStage.label(m, id))}${next}${mv.inherit ? '' : ' <span class="sig">固有</span>'}${inh.includes(id) ? ' <span class="tag">継承</span>' : ''}</td>` +
          `<td>${cat}</td><td>${mv.pow || '-'}</td><td>${mv.acc}</td><td>${mv.mp}</td></tr>`;
      }).join('');
      const traits = G.traitsOf(m).map((t) =>
        `<div><b>${G.Traits[t].name}</b>${t === m.inheritedTrait ? ' <span class="tag">継承</span>' : ''} <small>${G.Traits[t].desc}</small></div>`).join('');
      const pn = (m.parentInstanceIds || []).map((id) => G.Lineage.get(id)).filter(Boolean);
      const parents = pn.length === 2
        ? `<div class="small">親：${esc(pn[0].name)} ＋ ${esc(pn[1].name)}</div>` : '';
      return `<div class="detail-head">${P.img(m.speciesId, 'big')}<div>` +
        `<div class="detail-name"><small>${G.dexNoLabel(sp.id)}</small> ${esc(m.name)} <small>Lv${m.level}</small></div>` +
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
