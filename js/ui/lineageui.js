// 親子系譜の画面：選んだ幻獣から、親 → 祖父母 → … と最大4世代さかのぼって表示する
//   配合で消えた親も、state.lineage の記録から表示できる
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);

  function card(node, isRoot) {
    const sp = G.Species[node.speciesId];
    const how = { fusion: '配合', wild: '野生', starter: '相棒', gift: '贈り物', trainer: '' }[node.how] || '';
    return `<div class="lg-card${isRoot ? ' root' : ''}">` +
      `<img class="mon-img lg-img" src="${G.MonsterGfx.dataURL(node.speciesId)}" alt="">` +
      `<div class="lg-text"><div class="lg-name">${esc(node.name)}</div>` +
      `<div class="lg-sub">No.${sp ? sp.id : '---'} ${sp ? sp.rank : ''}　Lv${node.level}</div>` +
      `<div class="lg-sub">世代${node.generation}${how ? '・' + how : ''}</div></div></div>`;
  }

  function branch(node, isRoot) {
    const parents = node.parents && node.parents.length
      ? `<div class="lg-parents">${node.parents.map((p) => branch(p, false)).join('')}</div>` : '';
    return `<div class="lg-node">${card(node, isRoot)}${parents}</div>`;
  }

  function countAncestors(t) {
    return (t.parents || []).reduce((n, p) => n + 1 + countAncestors(p), 0);
  }

  G.UIScreens.lineage = function (m) {
    return {
      layout: 'full',
      update(In) { if (In.consume('cancel') || In.consume('confirm')) G.Screens.close(); },
      html() {
        const tree = G.Lineage.tree(m.instanceId, 4);
        const n = tree ? countAncestors(tree) : 0;
        const body = tree && n
          ? `<div class="lg-tree">${branch(tree, true)}</div>`
          : '<div class="menu-empty lg-empty">この幻獣は配合で生まれていないため、系譜の記録はありません。<br>（野生・相棒・贈り物の幻獣は、ここから系譜が始まります）</div>';
        return `<div class="scr-title">系譜 <span class="tab on">${esc(m.name)}</span>` +
          `<span class="dex-count">世代 ${m.generation}　記録された祖先 ${n}体</span></div>` +
          `<div class="scr-body lg-body">${body}</div>` +
          '<div class="scr-hint">左が子、右へ行くほど祖先（最大4世代）　X：もどる</div>';
      },
    };
  };
})(window.Game);
