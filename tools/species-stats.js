// =====================================================================
//  種族値ツール（data/monster_frontier.json を更新する）
// =====================================================================
//  node tools/species-stats.js            … 型が未設定の種族に型を割り当て、種族値が未設定の種族の種族値を計算して、検証する
//  node tools/species-stats.js --all      … 全種族の種族値を、型・看板・苦手・格から計算し直す（手で調整した値は上書きされる）
//  node tools/species-stats.js 041 052    … 指定した種族だけ計算し直す
//  node tools/species-stats.js --check    … 検証だけ（書きかえない）
//
//  種族値のルール（型の配分・ランクごとの合計値）は js/data/statRules.js。
//  JSON の各種族の項目：
//    archetype     型（物理アタッカー など10種類）
//    signature     看板能力（配分 +2）   weakness 苦手な能力（配分 −2）
//    tier          格（下位／標準／上位）
//    speciesStats  種族値（正本。手で微調整してよい）
//    evYield       倒したときの努力値
//  書きかえたあと、js/data/monster_frontier.js も再生成する（tools/build-data.js）。
// =====================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const R = require('../js/data/statRules.js');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'monster_frontier.json');
const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const ALL = args.includes('--all');
const IDS = args.filter((a) => /^\d{3}$/.test(a));

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const K = R.KEYS, JP = R.JP;

// ---------------- 型の割り当て（型が未設定の種族だけ。既存100種の初回用の目安） ----------------
function assignArchetype(m) {
  const { role, family: f, element: e, rank, name } = m;
  const high = ['C', 'B', 'A', 'S', 'SS', 'SSS', 'EX'].includes(rank);
  switch (role) {
    case '攻撃':
      if (f === '鳥') return '一点特化';
      if (e === '地' || ((f === '竜' || f === '魔獣') && high)) return '重戦車';
      return '物理アタッカー';
    case '耐久':
      if (f === '植物' || f === '精霊') return '特殊の壁';
      if (e === '地' || f === '虫' || /カメ|タートル|亀|甲/.test(name)) return '物理の壁';
      if (e === '水' || e === '光' || e === '氷') return '特殊の壁';
      if (f === '竜' || f === '魔獣' || f === '獣') return '重戦車';
      return '物理の壁';
    case '速度':
      return f === '精霊' || f === '植物' ? '高速サポート' : '高速アタッカー';
    case '特殊':
      return '特殊アタッカー';
    case '支援':
      return f === '鳥' || e === '風' ? '高速サポート' : '耐久サポート';
    default:
      return '万能';
  }
}
// 看板能力：型の種類 × 属性で決める。名前に特徴があればそちらを優先
const SIG = {
  attacker: { 炎: 'atk', 闇: 'atk', 風: 'spd', 雷: 'spd', 地: 'def', 氷: 'def', 水: 'hp', 光: 'hp', 無: 'hp' },
  special: { 炎: 'sat', 闇: 'sat', 氷: 'sat', 雷: 'sat', 風: 'spd', 水: 'sdf', 光: 'sdf', 地: 'hp', 無: 'sat' },
  fast: { 風: 'spd', 雷: 'spd', 炎: 'atk', 闇: 'atk', 水: 'spd', 光: 'spd', 地: 'atk', 氷: 'spd', 無: 'spd' },
  wall: { 地: 'def', 氷: 'def', 水: 'sdf', 光: 'sdf', 炎: 'atk', 雷: 'spd', 風: 'spd', 闇: 'sat', 無: 'hp' },
  support: { 風: 'spd', 雷: 'spd', 水: 'sdf', 光: 'sdf', 地: 'def', 炎: 'sat', 闇: 'sat', 無: 'hp', 氷: 'hp' },
  all: {},
};
const GROUP = { 物理アタッカー: 'attacker', 重戦車: 'attacker', 一点特化: 'attacker', 特殊アタッカー: 'special', 高速アタッカー: 'fast',
  物理の壁: 'wall', 特殊の壁: 'wall', 高速サポート: 'support', 耐久サポート: 'support', 万能: 'all' };
const NAME_SIG = [[/カメ|タートル|亀|甲/, 'def'], [/ウルフ|狼|ハウンド|ライガ|キバ/, 'atk'], [/ネコ|キャット|ツバメ|ハヤテ/, 'spd'], [/フェアリー|聖|ヒカリ|イノリ/, 'sdf']];
// 苦手な能力：系統で決める
const WEAK = { 獣: 'sat', 鳥: 'def', 植物: 'spd', 水棲: 'spd', 虫: 'sdf', 魔獣: 'sdf', 精霊: 'hp', 竜: 'spd' };

function assignSignature(m, arche) {
  for (const [re, k] of NAME_SIG) if (re.test(m.name)) return k;
  return SIG[GROUP[arche]][m.element] || 'hp';
}
function assignWeakness(m, arche, sig) {
  let w = WEAK[m.family] || 'sat';
  if (w === sig) {
    // 型でいちばん低い能力（看板以外）
    const s = R.ARCHETYPES[arche].shape;
    w = K.map((k, i) => [k, s[i]]).filter(([k]) => k !== sig).sort((a, b) => a[1] - b[1])[0][0];
  }
  return w;
}

// 種族ごとの揺らぎ（IDから決まる。能力の +1/−1 の組を2つ）
function jitterFor(id) {
  let h = 2166136261;
  for (const c of 'j' + id) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const out = [];
  for (let i = 0; i < 6; i++) { out.push(h % 6); h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0; }
  return out;
}

// ---------------- 実行 ----------------
let changed = 0;
const toJp = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [JP[k], v]));
for (const m of data.monsters) {
  if (!m.archetype && !CHECK_ONLY) {
    m.archetype = assignArchetype(m);
    m.signature = JP[assignSignature(m, m.archetype)];
    m.weakness = JP[assignWeakness(m, m.archetype, R.BY_JP[m.signature])];
    m.tier = m.tier || '標準';
    changed++;
  }
  const need = !m.speciesStats || ALL || IDS.includes(m.id);
  if (need && !CHECK_ONLY) {
    const st = R.compute({
      rank: m.rank, archetype: m.archetype, signature: R.BY_JP[m.signature], weakness: R.BY_JP[m.weakness],
      tier: m.tier, fusionOnly: m.obtain === '配合限定', jitter: jitterFor(m.id),
    });
    m.speciesStats = toJp(st);
    const ev = {};
    const amounts = R.EV_YIELD[m.rank] || [1];
    const sig = R.BY_JP[m.signature];
    ev[JP[sig]] = amounts[0];
    if (amounts[1]) ev[JP[R.secondStat(m.archetype, sig)]] = amounts[1];
    m.evYield = ev;
    changed++;
  }
}

// 項目の並びをそろえる（読みやすさのため）
const ORDER = ['id', 'name', 'family', 'element', 'rank', 'obtain', 'region', 'role', 'archetype', 'signature', 'weakness', 'tier',
  'speciesStats', 'evYield', 'baseStats', 'initialMoveCandidates', 'innateTrait', 'growthType', 'recipe', 'description'];
data.monsters = data.monsters.map((m) => {
  const o = {};
  for (const k of ORDER) if (k in m) o[k] = m[k];
  for (const k of Object.keys(m)) if (!(k in o)) o[k] = m[k];
  return o;
});

// ---------------- 検証 ----------------
const problems = [];
const sigs = new Set();
const byRank = {};
for (const m of data.monsters) {
  if (!R.ARCHETYPES[m.archetype]) problems.push(`${m.id} ${m.name}: 型「${m.archetype}」が不正`);
  if (!R.BY_JP[m.signature] || !R.BY_JP[m.weakness]) problems.push(`${m.id} ${m.name}: 看板／苦手の能力名が不正`);
  if (!R.TIER.hasOwnProperty(m.tier)) problems.push(`${m.id} ${m.name}: 格「${m.tier}」が不正`);
  const st = m.speciesStats;
  if (!st || Object.keys(JP).some((k) => !(st[JP[k]] > 0))) { problems.push(`${m.id} ${m.name}: 種族値が不足`); continue; }
  const total = Object.values(st).reduce((a, b) => a + b, 0);
  const expect = R.total(m.rank, m.tier, m.obtain === '配合限定');
  if (Math.abs(total / expect - 1) > 0.03) problems.push(`${m.id} ${m.name}: 合計 ${total} がルールの目安 ${expect} から3%以上ずれています`);
  sigs.add(Object.values(st).join('/'));
  (byRank[m.rank] = byRank[m.rank] || []).push(total);
}
console.log(`種族 ${data.monsters.length}、種族値の組み合わせ ${sigs.size} 通り`);
for (const [r, list] of Object.entries(byRank)) console.log(`  ${r.padEnd(3)} ${list.length}種 合計 ${Math.min(...list)}〜${Math.max(...list)}`);
const arc = {};
for (const m of data.monsters) arc[m.archetype] = (arc[m.archetype] || 0) + 1;
console.log('  型：' + Object.entries(arc).map(([a, n]) => `${a}${n}`).join(' '));
if (problems.length) { console.log('問題：\n- ' + problems.join('\n- ')); process.exitCode = 1; }

if (!CHECK_ONLY && changed) {
  data.version = '2.0';
  fs.writeFileSync(SRC, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`data/monster_frontier.json を更新しました（${changed} 件）`);
  require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'build-data.js')], { stdio: 'inherit' });
}
