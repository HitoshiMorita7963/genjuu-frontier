// 配合表（開発用・答えがすべて見える）を docs/配合表.md に書き出す
//   node tools/fusion-doc.js
//   レシピ（data/monster_frontier.json）や汎用ルール（js/data/fusionRules.js）を変えたら実行する
'use strict';
const fs = require('fs');
const path = require('path');
const G = require('./lib/load-game')();

const ROOT = path.join(__dirname, '..');
const S = G.Species;
const ids = G.SpeciesOrder;
const RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'EX'];
const OBTAIN = { wild: '野生', fusion: '配合限定', evolve: '進化' };
const lineName = (l) => G.Lineages[l].name;
const nm = (id) => `${S[id].name}`;
const tag = (id) => `${id} ${S[id].name}`;

const recipes = Object.values(G.FusionRecipes.byPair);
const L = [];
L.push('# 配合表（開発用）');
L.push('');
L.push(`> 自動生成（\`node tools/fusion-doc.js\`）。ゲーム内の配合表（メニュー → 配合表）と違い、答えがすべて見えます。`);
L.push(`> 種族 ${ids.length}、特別レシピ ${recipes.length}（親の組み合わせで子が決まる）。レシピのない組み合わせは汎用ルールで決まります。`);
L.push('');

// ---- 1. 特別レシピ（子のランク順） ----
L.push('## 1. 特別レシピ');
L.push('');
for (const r of RANKS) {
  const list = recipes.filter((rc) => S[rc.resultId].rank === r).sort((a, b) => Number(a.resultId) - Number(b.resultId));
  if (!list.length) continue;
  L.push(`### ${r}ランク（${list.length}）`);
  L.push('');
  L.push('| 子 | 系統・属性 | 入手 | 親A | 親B |');
  L.push('| --- | --- | --- | --- | --- |');
  for (const rc of list) {
    const c = S[rc.resultId];
    const [a, b] = rc.parentIds;
    L.push(`| ${tag(rc.resultId)} | ${c.family}・${c.element} | ${OBTAIN[c.obtain]} | ${nm(a)}（${S[a].rank}） | ${nm(b)}（${S[b].rank}） |`);
  }
  L.push('');
}

// ---- 2. 逆引き：この幻獣が親になる特別レシピ ----
L.push('## 2. 逆引き：親として使える特別レシピ');
L.push('');
L.push('| 幻獣 | 相手 → 生まれる子 |');
L.push('| --- | --- |');
for (const id of ids) {
  const uses = recipes.filter((rc) => rc.parentIds.includes(id));
  if (!uses.length) continue;
  const text = uses.map((rc) => {
    const other = rc.parentIds[0] === id ? rc.parentIds[1] : rc.parentIds[0];
    return `${nm(other)} → **${nm(rc.resultId)}**`;
  }).join('<br>');
  L.push(`| ${tag(id)}（${S[id].rank}） | ${text} |`);
}
L.push('');

// ---- 3. 汎用ルール ----
const R = G.FusionRules;
L.push('## 3. 汎用ルール（レシピのない組み合わせ）');
L.push('');
L.push(`- 子のランク：どちらかの親が ${R.upgradeFrom} ランク以上なら **${R.highRank}**、両親とも ${R.lowRank} ランクなら **${R.lowRank}**`);
L.push('- 子の系統：下の表（同じ系統どうしなら同じ系統）。その系統・ランクの「野生で出会える種族」から、親の属性に近いものが選ばれる');
L.push('- 同じ種族の組み合わせなら、選ぶ順番に関係なく必ず同じ子');
L.push('');
L.push('### 系統の表');
L.push('');
L.push('| | ' + R.lineageOrder.map(lineName).join(' | ') + ' |');
L.push('| --- | ' + R.lineageOrder.map(() => '---').join(' | ') + ' |');
for (const x of R.lineageOrder) {
  const row = R.lineageOrder.map((y) => {
    if (x === y) return lineName(x);
    const [p, q] = [x, y].sort((a, b) => R.lineageOrder.indexOf(a) - R.lineageOrder.indexOf(b));
    return lineName(R.familyTable[`${p}+${q}`] || p);
  });
  L.push(`| **${lineName(x)}** | ${row.join(' | ')} |`);
}
L.push('');

// 汎用ルールで実際に生まれる子の集計（全組み合わせを計算）
const agg = {};
let ruleCount = 0;
for (let i = 0; i < ids.length; i++) {
  for (let j = i; j < ids.length; j++) {
    const a = ids[i], b = ids[j];
    if (G.FusionRecipes.lookup(a, b)) continue;
    const c = G.Fusion.ruleResult(a, b);
    if (!c) continue;
    ruleCount++;
    const [la, lb] = [S[a].line, S[b].line].sort((p, q) => R.lineageOrder.indexOf(p) - R.lineageOrder.indexOf(q));
    const key = `${la}+${lb}|${S[c].rank}`;
    (agg[key] = agg[key] || {})[c] = (agg[key][c] || 0) + 1;
  }
}
L.push(`### 汎用ルールで生まれる子（全 ${ruleCount} 組み合わせの集計）`);
L.push('');
L.push('系統の組み合わせごとに、生まれる子と、その子が生まれる組み合わせの数。');
L.push('');
L.push('| 親の系統 | 子のランク | 生まれる子（組み合わせの数） |');
L.push('| --- | --- | --- |');
const order = (key) => {
  const [pair, rank] = key.split('|');
  const [a, b] = pair.split('+').map((l) => R.lineageOrder.indexOf(l));
  return a * 100 + b * 10 + (rank === R.lowRank ? 0 : 1);
};
for (const key of Object.keys(agg).sort((x, y) => order(x) - order(y))) {
  const [pair, rank] = key.split('|');
  const [a, b] = pair.split('+');
  const kids = Object.entries(agg[key]).sort((x, y) => y[1] - x[1]).map(([c, n]) => `${nm(c)}（${n}）`).join('、');
  L.push(`| ${lineName(a)} ＋ ${lineName(b)} | ${rank} | ${kids} |`);
}
L.push('');

const out = path.join(ROOT, 'docs', '配合表.md');
fs.writeFileSync(out, L.join('\n'), 'utf8');
console.log(`書き出しました: ${path.relative(ROOT, out)}（特別レシピ ${recipes.length}、汎用ルール ${ruleCount} 組み合わせ）`);
