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

- 公式モンスターと配合レシピ（`data/monster_frontier.json`）
- 配合・系譜・図鑑・進化・捕獲・育成
- 育成の3要素：種族値（種族の得意分野）・個体値（生まれつきの才能 0〜31）・努力値（育て方）
  - 訓練所（ソラノ村・配合の館）、鑑定屋（港町リュミエール）、特訓の書
- ストーリー第1章・第2章
- オートセーブ、サウンド（Web Audio による合成音）

## 開発メモ

- モンスターデータの正本は `data/monster_frontier.json`。編集後は
  `node tools/build-data.js` で `js/data/monster_frontier.js` を再生成します。
- 設計書：`docs/モンスターフロンティア_モンスター100種配合設計書.md`
- 種族値：JSON の `speciesStats`（型・看板能力・苦手な能力・格から `node tools/species-stats.js` で計算。手で微調整してよい）
  - 作り方のルール（型の配分・ランクごとの合計値）：`js/data/statRules.js`
  - 一覧：`docs/種族一覧.md`（`node tools/species-doc.js` で再生成）
- 個体値・努力値の上限や成長補正などの数値：`js/data/growthConfig.js`
