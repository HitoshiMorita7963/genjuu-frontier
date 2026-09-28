// =====================================================================
//  図鑑番号ツール：data/monster_frontier.json の各種族に dexNo（図鑑の番号）を振りなおす
// =====================================================================
//  node tools/dex-order.js          … 振りなおして書きかえる（js/data/monster_frontier.js も再生成）
//  node tools/dex-order.js --check  … 確認だけ
//
//  ・種族ID（内部の番号・セーブデータ）は変えない。図鑑に出る番号だけを並べかえる
//  ・種族IDの順に、進化の系統のいちばん最初の姿から番号を振る。進化した姿は、進化前のすぐ後ろの番号になる
//    分岐進化は、1本ずつたどる（例：カゼネコ → ハヤテネコ → シップウリンクス → ツムジネコ → センプウタイガ）
//  ・進化元が複数ある種族（例：フレイムウルフ ← カエンコロ／ホムラネコ）は、先に番号を振った系統に入る
//  進化を追加したら、このツールを実行しなおす。
// =====================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const loadGame = require('./lib/load-game');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'monster_frontier.json');
const CHECK_ONLY = process.argv.includes('--check');

const G = loadGame(ROOT);
const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const ids = data.monsters.map((m) => m.id).sort();

const order = [];
const placed = new Set();
const visit = (id) => {
  if (placed.has(id)) return;
  placed.add(id);
  order.push(id);
  for (const t of G.evolutionTargets(id)) visit(t);
};
for (const id of ids) visit(G.evolutionChain(id)[0][0]);

const noOf = Object.fromEntries(order.map((id, i) => [id, i + 1]));
const changed = data.monsters.filter((m) => m.dexNo !== noOf[m.id]).length;
// dexNo は id のすぐ後ろに置く
data.monsters = data.monsters.map(({ id, dexNo, ...rest }) => ({ id, dexNo: noOf[id], ...rest }));

if (CHECK_ONLY) {
  console.log(changed ? `NG: 図鑑番号がずれている種族が ${changed} 件あります（node tools/dex-order.js で振りなおす）` : `OK: ${order.length} 種の図鑑番号は最新です`);
  process.exit(changed ? 1 : 0);
}
fs.writeFileSync(SRC, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log(`図鑑番号を振りなおしました（${order.length} 種、変更 ${changed} 件）`);
execFileSync(process.execPath, [path.join(__dirname, 'build-data.js')], { stdio: 'inherit' });
