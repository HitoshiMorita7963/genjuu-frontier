// 公式モンスターデータ（data/monster_frontier.json）を、ブラウザで直接読める JS に変換する。
//   file:// で index.html を開いた場合、ブラウザは JSON を fetch できないため、JS として埋め込む。
//   使い方：  node tools/build-data.js
//   JSON を編集したら、必ずこのスクリプトを実行して js/data/monster_frontier.js を更新すること。
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'data', 'monster_frontier.json');
const dst = path.join(root, 'js', 'data', 'monster_frontier.js');

const json = JSON.parse(fs.readFileSync(src, 'utf8')); // 構文エラーがあればここで止まる
const out =
  '// 自動生成ファイル（直接編集しないこと）\n' +
  '//   元データ: data/monster_frontier.json\n' +
  '//   再生成:   node tools/build-data.js\n' +
  'window.Game = window.Game || {};\n' +
  'window.Game.RawMonsterData = ' + JSON.stringify(json, null, 1) + ';\n';
fs.writeFileSync(dst, out, 'utf8');
console.log(`OK: ${json.monsters.length} 種を ${path.relative(root, dst)} に書き出しました`);
