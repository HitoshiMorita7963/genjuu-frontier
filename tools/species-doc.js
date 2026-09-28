// 種族一覧（docs/種族一覧.md）を公式データから作る。
//   node tools/species-doc.js
//   データ（data/monster_frontier.json）を変えたら実行して、一覧を最新にする。
'use strict';
const fs = require('fs');
const path = require('path');
const R = require('../js/data/statRules.js');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'monster_frontier.json'), 'utf8'));
const K = R.KEYS.map((k) => R.JP[k]);
global.window = { Game: {} };
window.Game.escapeHtml = (s) => s;
require('../js/data/elements.js');
require('../js/data/moves.js');
const moveName = (id) => (window.Game.Moves[id] ? window.Game.Moves[id].name : id);
const RANKS = Object.keys(R.BUDGET);

const lines = [];
lines.push('# 幻獣 種族一覧');
lines.push('');
lines.push(`> 自動生成（\`node tools/species-doc.js\`）。元データ：\`data/monster_frontier.json\`（v${data.version}・${data.monsters.length}種）`);
lines.push('> 種族値の作り方：合計値（ランク・格・入手方法）× 配分（型＋看板能力＋苦手な能力）。ルールは `js/data/statRules.js`。');
lines.push('');
lines.push('## 型');
lines.push('');
lines.push('| 型 | HP | 攻撃 | 防御 | 素早さ | 特殊攻撃 | 特殊防御 | 説明 |');
lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |');
for (const [name, a] of Object.entries(R.ARCHETYPES)) lines.push(`| ${name} | ${a.shape.join(' | ')} | ${a.desc} |`);
lines.push('');
lines.push('## ランクごとの合計値（野生・格「標準」）');
lines.push('');
lines.push('| ' + RANKS.join(' | ') + ' |');
lines.push('| ' + RANKS.map(() => '---:').join(' | ') + ' |');
lines.push('| ' + RANKS.map((r) => R.BUDGET[r]).join(' | ') + ' |');
lines.push('');
lines.push(`格：下位 ${R.TIER['下位'] * 100}%／上位 +${R.TIER['上位'] * 100}%。配合限定（${R.FUSION_BONUS_RANKS.join('・')}ランク）は +${R.FUSION_ONLY_BONUS * 100}%。`);
lines.push('');
for (const rank of RANKS) {
  const list = data.monsters.filter((m) => m.rank === rank);
  if (!list.length) continue;
  lines.push(`## ${rank}ランク（${list.length}種）`);
  lines.push('');
  lines.push('| ID | 図鑑 | 名前 | 系統 | 属性 | 入手 | 型 | 看板 | 苦手 | 格 | ' + K.join(' | ') + ' | 合計 | 努力値 | 技候補 |');
  lines.push('| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | ' + K.map(() => '---:').join(' | ') + ' | ---: | --- | --- |');
  for (const m of list) {
    const st = m.speciesStats || {};
    const total = K.reduce((a, k) => a + (st[k] || 0), 0);
    const ev = Object.entries(m.evYield || {}).map(([k, v]) => `${k}+${v}`).join(' ');
    lines.push(`| ${m.id} | ${m.dexNo || ''} | ${m.name} | ${m.family} | ${m.element}${m.element2 ? '・' + m.element2 : ''} | ${m.obtain} | ${m.archetype} | ${m.signature} | ${m.weakness} | ${m.tier} | ` +
      K.map((k) => st[k]).join(' | ') + ` | ${total} | ${ev} | ${(m.initialMoveCandidates || []).map(moveName).join('・')} |`);
  }
  lines.push('');
}
const out = path.join(ROOT, 'docs', '種族一覧.md');
fs.writeFileSync(out, lines.join('\n'), 'utf8');
console.log('書き出しました:', path.relative(ROOT, out));
