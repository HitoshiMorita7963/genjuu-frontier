// 種族値テーブル（js/data/speciesStats.js）の「たたき台」を作るツール
//   node tools/gen-species-stats.js            … 生成（既存ファイルがあれば上書きしない）
//   node tools/gen-species-stats.js --force    … 上書き
//
// 方針：
//   ・公式データ（data/monster_frontier_100.json）の基礎値を、ゲーム内の強さの目安に換算し、
//     6能力の「合計」は変えずに（＝種族の総合的な強さ・ランク差を保ったまま）配分だけを調整する。
//   ・役割（攻撃・耐久・速度・特殊・支援・万能）をはっきりさせ、系統・属性・名前で個性をつける。
//   ・生成後の js/data/speciesStats.js は手で調整してよい（そちらが正本。このツールは初回用）。
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'js/data/speciesStats.js');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/monster_frontier_100.json'), 'utf8'));

const KEYS = ['hp', 'atk', 'def', 'spd', 'sat', 'sdf'];
const JP = { hp: 'HP', atk: '攻撃', def: '防御', spd: '素早さ', sat: '特殊攻撃', sdf: '特殊防御' };
// monsterLoader.js の換算（offset 20, scale 1.6）＋ 新しい能力値計算での平均的な個体に合わせた +4
const conv = (v) => Math.round(20 + v * 1.6) + 4;

// 役割ごとの配分の強調（＋は伸ばす、−は抑える）
const ROLE = {
  攻撃: { atk: 0.22, sat: -0.10, def: -0.04 },
  耐久: { hp: 0.08, def: 0.16, sdf: 0.06, spd: -0.18, atk: -0.04 },
  速度: { spd: 0.24, def: -0.10, hp: -0.04 },
  特殊: { sat: 0.24, sdf: 0.06, atk: -0.16 },
  支援: { hp: 0.04, sdf: 0.08, def: 0.04, atk: -0.06 },
  万能: {},
};
// 系統ごとの個性
const FAMILY = {
  獣: { atk: 0.06, spd: 0.04, sat: -0.04 },
  鳥: { spd: 0.08, def: -0.06, atk: 0.02 },
  植物: { sdf: 0.06, hp: 0.04, spd: -0.06 },
  水棲: { hp: 0.06, sdf: 0.04, spd: -0.02 },
  虫: { def: 0.05, spd: 0.04, hp: -0.05 },
  魔獣: { atk: 0.04, sat: 0.04, def: -0.04 },
  精霊: { sat: 0.06, sdf: 0.05, hp: -0.05, atk: -0.04 },
  竜: { hp: 0.04, atk: 0.04, sat: 0.03, spd: -0.02 },
};
// 属性ごとの個性（炎→攻撃、地→防御、風→素早さ……）
const ELEMENT = {
  炎: { atk: 0.06, sat: 0.03, sdf: -0.03 },
  水: { sdf: 0.05, hp: 0.02 },
  風: { spd: 0.07, def: -0.03 },
  地: { def: 0.08, spd: -0.04 },
  雷: { spd: 0.04, sat: 0.04, def: -0.03 },
  光: { sdf: 0.05, sat: 0.02 },
  闇: { atk: 0.03, sat: 0.04, sdf: -0.02 },
  氷: { def: 0.03, sat: 0.04, spd: -0.02 },
  無: {},
};
// 名前から読み取れる特徴
const NAME = [
  [/カメ|タートル|イワ|ガン|ゴーレム|岩|鎧|甲/, { def: 0.10, spd: -0.05 }],
  [/ツバサ|ハネ|ホーク|ドリ|鳥|ガルーダ|スカイ/, { spd: 0.05 }],
  [/ウルフ|ハウンド|キバ|ツメ|ブレード|ライガ/, { atk: 0.06 }],
  [/ネコ|キャット|リス/, { spd: 0.04 }],
  [/フェアリー|ヒカリ|セイクリッド|聖/, { sdf: 0.04, sat: 0.03 }],
  [/ドライアド|樹|モリ/, { hp: 0.05 }],
];

// 種族ごとに少しだけ揺らす（同じ役割・ランクでも数値がそろいすぎないように）
function jitter(id, k) {
  let h = 2166136261;
  for (const c of id + k) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (((h >>> 0) % 1000) / 1000 - 0.5) * 0.06; // ±3%
}

function add(w, o) { for (const k in o) w[k] += o[k]; }

const rows = [];
const byRank = {};
for (const m of data.monsters) {
  const b = m.baseStats;
  const raw = { hp: conv(b.HP), atk: conv(b['攻撃']), def: conv(b['防御']), spd: conv(b['素早さ']), sat: conv(b['特殊攻撃']), sdf: conv(b['特殊防御']) };
  const total = KEYS.reduce((a, k) => a + raw[k], 0);
  const w = { hp: 1, atk: 1, def: 1, spd: 1, sat: 1, sdf: 1 };
  add(w, ROLE[m.role] || {});
  add(w, FAMILY[m.family] || {});
  add(w, ELEMENT[m.element] || {});
  for (const [re, o] of NAME) if (re.test(m.name)) add(w, o);
  for (const k of KEYS) w[k] += jitter(m.id, k);
  const shaped = {};
  for (const k of KEYS) shaped[k] = raw[k] * w[k];
  // 合計を元の合計にそろえる（整数化の誤差は最も大きい能力で吸収）
  const s = KEYS.reduce((a, k) => a + shaped[k], 0);
  const base = {};
  for (const k of KEYS) base[k] = Math.max(10, Math.round(shaped[k] * total / s));
  const diff = total - KEYS.reduce((a, k) => a + base[k], 0);
  const top = KEYS.reduce((a, k) => (base[k] > base[a] ? k : a), 'hp');
  base[top] += diff;
  rows.push({ m, base, total });
  (byRank[m.rank] = byRank[m.rank] || []).push(base);
}

// 努力値の報酬：同じランクの平均と比べて「この種族が特に秀でている能力」を与える
const avg = {};
for (const r in byRank) {
  avg[r] = {};
  for (const k of KEYS) avg[r][k] = byRank[r].reduce((a, b) => a + b[k], 0) / byRank[r].length;
}
const EV_AMOUNT = { F: [1], E: [1], D: [2], C: [2], B: [2, 1], A: [2, 1], S: [3], SS: [3], SSS: [3], EX: [3] };
for (const row of rows) {
  const rel = KEYS.map((k) => [k, row.base[k] / avg[row.m.rank][k]]).sort((a, b) => b[1] - a[1]);
  const ev = {};
  (EV_AMOUNT[row.m.rank] || [1]).forEach((n, i) => { ev[rel[i][0]] = n; });
  row.ev = ev;
}

const line = (row) => {
  const b = row.base;
  const ev = Object.entries(row.ev).map(([k, v]) => `${k}: ${v}`).join(', ');
  return `    '${row.m.id}': { hp: ${pad(b.hp)}, atk: ${pad(b.atk)}, def: ${pad(b.def)}, spd: ${pad(b.spd)}, sat: ${pad(b.sat)}, sdf: ${pad(b.sdf)}, ev: { ${ev} } }, // ${row.m.name}（${row.m.rank}・${row.m.role}）合計${row.total}`;
};
const pad = (n) => String(n).padStart(3, ' ');

const src = `// =====================================================================
//  種族値（全100種）と、倒したときにもらえる努力値
// =====================================================================
//  種族値 ＝ その種族そのものの能力（同じ種族なら全個体共通）
//    hp / atk / def / spd / sat / sdf ＝ HP・攻撃・防御・素早さ・特殊攻撃・特殊防御
//    Lv50・平均的な個体・努力値なし のとき、能力値 ≒ 種族値＋5（HPは 種族値＋60）になる。
//  ev ＝ この種族を倒したときにもらえる努力値（種族ごとに個別に設定できる）
//
//  たたき台は tools/gen-species-stats.js で生成（公式データの基礎値から、種族の合計値を保ったまま
//  役割・系統・属性で配分を調整）。このファイルを直接書きかえてバランス調整してよい。
//  MP・命中・回避は種族値の対象外（MPは公式データから算出、命中・回避は公式データの値）。
// =====================================================================
(function (G) {
  'use strict';

  G.SpeciesStatTable = {
${rows.map(line).join('\n')}
  };
})(window.Game);
`;

if (fs.existsSync(OUT) && !process.argv.includes('--force')) {
  console.log('既に存在するため上書きしません（上書きするには --force）:', path.relative(ROOT, OUT));
  process.exit(0);
}
fs.writeFileSync(OUT, src, 'utf8');
console.log('生成しました:', path.relative(ROOT, OUT), `（${rows.length}種）`);
for (const id of ['001', '002', '003', '009', '012', '044']) {
  const r = rows.find((x) => x.m.id === id);
  console.log(id, r.m.name, r.m.role, JSON.stringify(r.base), JSON.stringify(r.ev));
}
