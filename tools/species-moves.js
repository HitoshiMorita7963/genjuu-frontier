// =====================================================================
//  技候補ツール：型（物理・特殊・壁・サポート）に合わせて、各種族の技候補を決める
// =====================================================================
//  node tools/species-moves.js          … 全種族の技候補（initialMoveCandidates）を型から決め直す
//  node tools/species-moves.js --check  … 型と技が合っているかの確認だけ
//
//  ・技候補は3つ。1つめ・2つめは Lv1、3つめ（強い技）は Lv10 で覚える（js/data/monsterLoader.js）
//  ・物理の型は物理技、特殊の型は特殊技。壁・サポート・万能は、攻撃と特殊攻撃の高い方にそろえる
//  ・固有技（引き継げない技）を持つ種族は変えない
//  ・手で書きかえた技候補も、このツールを実行すると上書きされる（個別に変えたい種族は KEEP に入れる）
// =====================================================================
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'monster_frontier.json');
global.window = { Game: {} };
window.Game.escapeHtml = (s) => s;
require('../js/data/elements.js');
require('../js/data/moves.js');
const MOVES = window.Game.Moves;

// 属性ごとの技：物理（弱・強）、特殊（弱・中・強）、補助（回復・強化）
const SETS = {
  炎: { pW: 'homuraba', pS: '炎獄爪', sW: '火花', sM: '烈火弾', sS: '灼熱波', heal: null, buff: null },
  水: { pW: '水刃', pS: '怒涛撃', sW: 'mizutsubute', sM: 'uzushio', sS: '潮流撃', heal: '癒しの雫', buff: null },
  風: { pW: '風切り', pS: '烈風脚', sW: 'fujin', sM: 'tsumuji', sS: '旋風刃', heal: null, buff: '追い風' },
  地: { pW: '岩つぶて', pS: '大地震', sW: '砂塵', sM: null, sS: '地脈波', heal: null, buff: '硬化' },
  雷: { pW: 'jinraiga', pS: '轟雷爪', sW: '電撃', sM: 'raigeki', sS: '雷鳴落とし', heal: null, buff: '麻痺針' },
  光: { pW: '光刃', pS: '聖光斬', sW: '光弾', sM: 'seinaruya', sS: '極光', heal: '小回復', buff: '聖なる守り' },
  闇: { pW: '影縫い', pS: '奈落斬', sW: 'noroigoe', sM: null, sS: '暗黒波', heal: null, buff: '呪い霧' },
  氷: { pW: '氷牙', pS: '凍結爪', sW: '氷礫', sM: null, sS: '雪嵐', heal: null, buff: '冷気' },
  無: { pW: '突進', pS: '渾身撃', sW: '衝撃波', sM: null, sS: '真空波', heal: null, buff: null },
  // 上位属性
  焔: { pW: '焔刃', pS: '焔獄撃', sW: '焔弾', sM: '焔華', sS: '劫火', heal: null, buff: null },
  嵐: { pW: '嵐爪', pS: '暴嵐脚', sW: '嵐弾', sM: '裂空波', sS: '大嵐', heal: null, buff: '嵐の加護' },
  霆: { pW: '霆牙', pS: '霆撃爪', sW: '霆光', sM: '迅霆', sS: '天霆', heal: null, buff: '霆縛' },
  晶: { pW: '晶槍', pS: '晶岩崩し', sW: '晶弾', sM: '晶光波', sS: '晶界', heal: null, buff: '晶壁' },
  聖: { pW: '聖刃', pS: '聖剣', sW: '聖光弾', sM: '聖燐', sS: '聖天光', heal: '聖なる癒し', buff: '聖なる守り' },
  冥: { pW: '冥爪', pS: '冥府斬', sW: '冥弾', sM: '冥霧', sS: '冥獄波', heal: null, buff: '冥呪' },
};
const PHYS_TYPES = ['物理アタッカー', '重戦車', '一点特化', '高速アタッカー'];
const KEEP = new Set([]); // 技候補を手で決めた種族のID

// 上位属性の技がまだないときは、下位の属性の技で代用する（上位属性の技を作ったら SETS に足す）
const UPPER_BASE = { 焔: '炎', 嵐: '風', 霆: '雷', 晶: '地', 聖: '光', 冥: '闇' };
const setOf = (el) => SETS[el] || SETS[UPPER_BASE[el]];
function movesFor(m) {
  const S = setOf(m.element);
  const st = m.speciesStats;
  const physical = PHYS_TYPES.includes(m.archetype) || (m.archetype !== '特殊アタッカー' && st['攻撃'] > st['特殊攻撃']);
  // 複合タイプは、弱い技を2つめの属性にする（どちらもタイプ一致になり、相性の選択肢が増える）
  const S2 = m.element2 ? setOf(m.element2) : S;
  const W = physical ? S2.pW : S2.sW;
  const Str = physical ? S.pS : S.sS;
  let mid;
  switch (m.archetype) {
    case '高速アタッカー': mid = 'idaten'; break;                         // 韋駄天：素早さを大きく上げる
    case '物理アタッカー': case '重戦車': case '一点特化': mid = '気合いため'; break;
    case '特殊アタッカー': mid = S.sM || S.buff || '気合いため'; break;
    case '物理の壁': mid = S.buff || 'katakunaru'; break;                 // かたくなる：防御を上げる
    case '特殊の壁': mid = S.heal || S.buff || '小回復'; break;
    case '耐久サポート': case '高速サポート': mid = S.heal || '小回復'; break;
    default: mid = S.buff || S.heal || '気合いため';
  }
  return [W, mid, Str];
}

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const CHECK_ONLY = process.argv.includes('--check');
let changed = 0;
const problems = [];
for (const m of data.monsters) {
  const cur = m.initialMoveCandidates || [];
  const signature = cur.some((id) => MOVES[id] && MOVES[id].inherit === false);
  if (signature || KEEP.has(m.id)) continue;
  const next = movesFor(m);
  for (const id of next) if (!MOVES[id]) problems.push(`${m.id} ${m.name}: 技「${id}」が未定義`);
  if (!CHECK_ONLY && next.join() !== cur.join()) { m.initialMoveCandidates = next; changed++; }
}
// 確認：物理の型なのに攻撃技がすべて特殊、などのずれ
for (const m of data.monsters) {
  const atk = (m.initialMoveCandidates || []).map((id) => MOVES[id]).filter((mv) => mv && mv.cat !== 'stat');
  const physical = PHYS_TYPES.includes(m.archetype);
  if (physical && atk.length && atk.every((mv) => mv.cat === 'spec')) problems.push(`${m.id} ${m.name}: 物理の型なのに特殊技だけ`);
  if (m.archetype === '特殊アタッカー' && atk.length && atk.every((mv) => mv.cat === 'phys')) problems.push(`${m.id} ${m.name}: 特殊の型なのに物理技だけ`);
}
const combos = new Set(data.monsters.map((m) => m.initialMoveCandidates.join('/')));
console.log(`技候補の組み合わせ ${combos.size} 通り / ${data.monsters.length}種`);
if (problems.length) { console.log('問題：\n- ' + problems.join('\n- ')); process.exitCode = 1; }
if (!CHECK_ONLY && changed) {
  fs.writeFileSync(SRC, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`技候補を更新しました（${changed} 種）`);
  require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'build-data.js')], { stdio: 'inherit' });
}
