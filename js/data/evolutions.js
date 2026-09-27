// =====================================================================
//  進化データ（ゲーム独自の拡張。公式データ data/monster_frontier_100.json には含まれない）
// =====================================================================
//  ・進化先は「野生でも入手できる D ランク（041〜060）」に限定し、配合限定の種族を進化で手に入れられないようにする
//    例外：allowFusionOnly: true を付けた行は、配合限定の種族にも進化できる（2段階進化の途中など）
//  ・系統と属性が同じ（または近い）種族へ進化する
//  ・条件はモンスターごとに違う：
//      level: そのレベル以上でレベルアップしたとき
//      place: その場所（マップの place／出現区分）でレベルアップしたとき（level と併用）
//      item : その道具を使ったとき
//  1行追加するだけで、進化を増やせる。
//  2段階進化：進化先の種族にも進化を書けば、つながる（A → B、B → C）。1回のレベルアップで進むのは1段階だけ。
// =====================================================================
(function (G) {
  'use strict';

  const EVOLUTIONS = [
    // ---- 2段階進化（試験導入）：ヒノコロ（F）→ ホムラネコ（E）→ フレイムウルフ（D） ----
    { from: '001', to: '021', level: 16, allowFusionOnly: true }, // ヒノコロ → ホムラネコ
    { from: '021', to: '041', level: 26 },                    // ホムラネコ → フレイムウルフ（配合で生まれたホムラネコも進化する）
    // ---- 野生の F ランク → D ランク ----
    { from: '002', to: '042', level: 20 },                    // ミズリス → アクアウルフ
    { from: '005', to: '043', level: 20 },                    // ライポン → ライガーハウンド
    { from: '006', to: '044', level: 18 },                    // ハネピヨ → ストームホーク
    { from: '007', to: '045', level: 20 },                    // アカツバメ → ブレイズホーク
    { from: '008', to: '046', level: 20 },                    // ミズカモ → アクアフェザー
    { from: '009', to: '047', level: 22 },                    // コモリバナ → ドライアド
    { from: '012', to: '052', level: 18, place: 'cave' },     // イワガメ → ロックタートル（洞窟で）
    { from: '013', to: '051', level: 20 },                    // ビリクラゲ → サンダーシャーク
    { from: '014', to: '053', level: 20 },                    // ハネムシ → スカイビートル
    { from: '015', to: '054', level: 20 },                    // ヒノムシ → インフェルノビー
    { from: '016', to: '055', item: 'steelclaw' },            // ツノムシ → ダークホーネット（鋼の爪）
    { from: '018', to: '056', item: 'moondrop' },             // ヨルネコ → デビルキャット（月の雫）
    { from: '019', to: '048', item: 'moondrop' },             // コダマ → フローラルフェアリー（月の雫）
    { from: '020', to: '059', level: 18, place: 'cave' },     // スナタマ → アーススピリット（洞窟で）
    // ---- 配合で生まれた E ランク → D ランク ----
    { from: '023', to: '043', level: 24 },                    // ライガネコ → ライガーハウンド
    { from: '024', to: '045', level: 24 },                    // ヒバネドリ → ブレイズホーク
    { from: '025', to: '046', level: 24 },                    // アオツバサ → アクアフェザー
    { from: '028', to: '051', level: 24 },                    // デンキクラゲ → サンダーシャーク
    { from: '029', to: '052', level: 24 },                    // イシガメ → ロックタートル
    { from: '030', to: '053', level: 24 },                    // ツノバチ → スカイビートル
    { from: '032', to: '056', item: 'moondrop' },             // ヤミネコウモリ → デビルキャット（月の雫）
    { from: '033', to: '058', level: 22, place: 'highland' }, // モリノタマ → ウィンドスピリット（高原で）
  ];

  G.Evolutions = EVOLUTIONS;
  for (const e of EVOLUTIONS) {
    const sp = G.Species[e.from];
    if (!sp || !G.Species[e.to]) { G.DataReport.errors.push(`進化データ：存在しない種族 ${e.from} → ${e.to}`); continue; }
    if (G.Species[e.to].obtain !== 'wild' && !e.allowFusionOnly) G.DataReport.warnings.push(`進化データ：${e.to} は配合限定の種族です`);
    if (sp.evo) G.DataReport.errors.push(`進化データ：${e.from} の進化先が複数あります`);
    sp.evo = { to: e.to, level: e.level, place: e.place, item: e.item };
  }

  // 進化の系統（最初の姿 → 最後の姿）。ループしていてもとまるように、同じ種族は2回たどらない
  G.evolutionChain = function (id) {
    let first = id;
    for (let guard = 0; guard < 10; guard++) {
      const prev = EVOLUTIONS.find((e) => e.to === first && G.Species[e.from] && G.Species[e.from].evo && G.Species[e.from].evo.to === first);
      if (!prev) break;
      first = prev.from;
    }
    const chain = [first];
    while (chain.length < 10) {
      const e = G.Species[chain[chain.length - 1]].evo;
      if (!e || chain.includes(e.to)) break;
      chain.push(e.to);
    }
    return chain;
  };
  // 進化の条件の説明
  G.evolutionConditionText = function (evo) {
    if (!evo) return '';
    const PLACE = { cave: '洞窟', highland: '高原', volcano: '火山', lakeside: '湖畔' };
    if (evo.item) return `${G.Items[evo.item] ? G.Items[evo.item].name : evo.item}を使う`;
    return `Lv${evo.level}${evo.place ? `・${PLACE[evo.place] || evo.place}で` : ''}`;
  };
})(window.Game);
