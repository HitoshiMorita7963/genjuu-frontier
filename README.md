# 幻獣フロンティア ～絆の紋章～

ブラウザで遊べる、幻獣（モンスター）収集・配合RPGです。
HTML / CSS / JavaScript のみで作られており、外部ライブラリは使っていません。

## 遊び方

`index.html` をブラウザで開くだけで遊べます（ローカルファイルのままでも動作します）。

| 操作 | キーボード | タッチ |
| --- | --- | --- |
| 移動 | ↑↓←→ / WASD | 十字キー |
| 決定・調べる・話す | Z / Enter / Space | A |
| メニュー・戻る | X / Esc | B |
| ダッシュ | Shift | ダッシュ |
| サウンドON/OFF | M | 設定画面 |

## 主な内容

- 公式モンスター100種と配合レシピ（`data/monster_frontier_100.json`）
- 配合・系譜・図鑑・進化・捕獲・育成
- 育成の3要素：種族値（種族の得意分野）・個体値（生まれつきの才能 0〜31）・努力値（育て方）
  - 訓練所（ソラノ村・配合の館）、鑑定屋（港町リュミエール）、特訓の書
- ストーリー第1章・第2章
- オートセーブ、サウンド（Web Audio による合成音）

## 開発メモ

- モンスターデータの正本は `data/monster_frontier_100.json`。編集後は
  `node tools/build-data.js` で `js/data/monster_frontier_100.js` を再生成します。
- 設計書：`docs/モンスターフロンティア_モンスター100種配合設計書.md`
- 種族値：`js/data/speciesStats.js`（たたき台は `node tools/gen-species-stats.js` で生成。以後は直接調整）
- 個体値・努力値の上限や成長補正などの数値：`js/data/growthConfig.js`
