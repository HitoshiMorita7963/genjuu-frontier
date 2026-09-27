// =====================================================================
//  進化データ（ゲーム独自の拡張。公式データ data/monster_frontier.json には含まれない）
// =====================================================================
//  ・配合でしか生まれない種族（入手「配合限定」）には進化しない（配合の価値を守る）
//  ・進化の中間形態・分岐進化の姿・3段階目は、入手「進化」または「野生」の種族として用意する
//  ・条件はモンスターごとに違う：
//      level : そのレベル以上でレベルアップしたとき
//      place : その場所（マップの place／出現区分）でレベルアップしたとき（level と併用）
//      item  : その道具を使ったとき（level があれば、そのレベル以上のときだけ）
//      branch: 分岐進化。[{ to, stat }]。いちばん多く努力値を振った能力が stat と一致する進化先へ
//  1行追加するだけで、進化を増やせる。
//  多段階進化：進化先の種族にも進化を書けば、つながる（A → B、B → C）。1回のレベルアップで進むのは1段階だけ。
// =====================================================================
(function (G) {
  'use strict';

  const EVOLUTIONS = [
    // ---- 2段階進化：野生の F → 中間形態 E → 野生の D ----
    { from: '001', to: '101', level: 16 }, { from: '101', to: '041', level: 30 },                                   // ヒノコロ → カエンコロ → フレイムウルフ
    { from: '002', to: '102', level: 16 }, { from: '102', to: '042', level: 30 },                                   // ミズリス → ナミリス → アクアウルフ
    { from: '005', to: '103', level: 16 }, { from: '103', to: '043', level: 30 },                                   // ライポン → ライキバ → ライガーハウンド
    { from: '006', to: '104', level: 14 }, { from: '104', to: '044', level: 28 },                                   // ハネピヨ → カゼハネ → ストームホーク
    { from: '007', to: '105', level: 16 }, { from: '105', to: '045', level: 30 },                                   // アカツバメ → ヒエンツバメ → ブレイズホーク
    { from: '008', to: '106', level: 16 }, { from: '106', to: '046', level: 30 },                                   // ミズカモ → ナミカモ → アクアフェザー
    { from: '009', to: '107', level: 18 }, { from: '107', to: '047', level: 32 },                                   // コモリバナ → イワネバナ → ドライアド
    { from: '012', to: '108', level: 16 }, { from: '108', to: '052', level: 30, place: 'cave' },                    // イワガメ → コケガメ → ロックタートル（洞窟で）
    { from: '013', to: '111', level: 16 }, { from: '111', to: '051', level: 30 },                                   // ビリクラゲ → ビリザメ → サンダーシャーク
    { from: '014', to: '109', level: 16 }, { from: '109', to: '053', level: 30 },                                   // ハネムシ → カゼカブト → スカイビートル
    { from: '015', to: '110', level: 16 }, { from: '110', to: '054', level: 30 },                                   // ヒノムシ → ヒノコバチ → インフェルノビー
    { from: '020', to: '112', level: 16 }, { from: '112', to: '059', level: 30, place: 'cave' },                    // スナタマ → ツチダマ → アーススピリット（洞窟で）
    // ---- 3段階目：D → C（進化でのみ出会える） ----
    { from: '041', to: '119', level: 40 },                                                                          // フレイムウルフ → 煉獄狼ヴォルグ
    { from: '044', to: '120', level: 40, place: 'highland' },                                                       // ストームホーク → 嵐翼鷹シュトルム（高原で）
    { from: '047', to: '121', item: 'moondrop', level: 38 },                                                        // ドライアド → 森母樹シルヴァ（月の雫・Lv38以上）
    // ---- 分岐進化：いちばん多く鍛えた能力で進化先が決まる ----
    { from: '003', level: 18, branch: [{ to: '113', stat: 'spd' }, { to: '114', stat: 'atk' }] },                   // カゼネコ → ハヤテネコ／ツムジネコ
    { from: '004', level: 18, branch: [{ to: '115', stat: 'def' }, { to: '116', stat: 'atk' }] },                   // ツチモグラ → ヨロイモグラ／ドリルモグラ
    { from: '010', level: 18, branch: [{ to: '117', stat: 'sat' }, { to: '118', stat: 'sdf' }] },                   // ヒカリソウ → ホシヨミソウ／イノリソウ
    // ---- 1段階の進化（道具） ----
    { from: '016', to: '055', item: 'steelclaw' },            // ツノムシ → ダークホーネット（鋼の爪）
    { from: '018', to: '056', item: 'moondrop' },             // ヨルネコ → デビルキャット（月の雫）
    { from: '019', to: '048', item: 'moondrop' },             // コダマ → フローラルフェアリー（月の雫）
    // ---- 氷原・無属性 ----
    { from: '122', to: '123', level: 20 },                    // ユキウサ → フブキギツネ
    { from: '124', to: '125', level: 20 },                    // ツララムシ → アイスビートル
    { from: '126', to: '127', level: 22, place: 'snowfield' }, // ユキダマ → ヒョウガスピリット（氷原で）
    { from: '128', to: '129', level: 20 },                    // モフリン → ギンモフ
    // ---- E ランク（配合でも生まれる種族）→ D ランク ----
    { from: '021', to: '041', level: 24 },                    // ホムラネコ → フレイムウルフ
    { from: '023', to: '043', level: 24 },                    // ライガネコ → ライガーハウンド
    { from: '024', to: '045', level: 24 },                    // ヒバネドリ → ブレイズホーク
    { from: '025', to: '046', level: 24 },                    // アオツバサ → アクアフェザー
    { from: '028', to: '051', level: 24 },                    // デンキクラゲ → サンダーシャーク
    { from: '029', to: '052', level: 24 },                    // イシガメ → ロックタートル
    { from: '030', to: '053', level: 24 },                    // ツノバチ → スカイビートル
    { from: '032', to: '056', item: 'moondrop' },             // ヤミネコウモリ → デビルキャット（月の雫）
    { from: '033', to: '058', level: 22, place: 'highland' }, // モリノタマ → ウィンドスピリット（高原で）
  ];

  // 進化先の一覧（分岐なら複数）
  const targetsOf = (e) => (e.branch ? e.branch.map((b) => b.to) : [e.to]);

  G.Evolutions = EVOLUTIONS;
  for (const e of EVOLUTIONS) {
    const sp = G.Species[e.from];
    const tos = targetsOf(e);
    if (!sp || tos.some((to) => !G.Species[to])) { G.DataReport.errors.push(`進化データ：存在しない種族 ${e.from} → ${tos.join('／')}`); continue; }
    for (const to of tos) if (G.Species[to].obtain === 'fusion') G.DataReport.warnings.push(`進化データ：${to} は配合限定の種族です`);
    if (e.branch && e.branch.some((b) => !b.stat)) G.DataReport.errors.push(`進化データ：${e.from} の分岐に能力の指定がありません`);
    if (sp.evo) G.DataReport.errors.push(`進化データ：${e.from} の進化が重複しています`);
    sp.evo = { to: e.to || null, level: e.level, place: e.place, item: e.item, branch: e.branch || null };
  }
  // 進化でのみ出会える種族は、どこかから進化してこられること
  for (const id of G.SpeciesOrder) {
    if (G.Species[id].obtain === 'evolve' && !EVOLUTIONS.some((e) => targetsOf(e).includes(id))) {
      G.DataReport.errors.push(`${id} ${G.Species[id].name}：入手が「進化」なのに、進化元がありません`);
    }
  }

  G.evolutionTargets = (id) => { const e = G.Species[id] && G.Species[id].evo; return e ? (e.branch ? e.branch.map((b) => b.to) : [e.to]) : []; };

  // 進化の系統：段階ごとの種族IDの配列（分岐は同じ段階に複数）。例 [['003'], ['113', '114']]
  //   進化元が複数あるとき（例：フレイムウルフ ← カエンコロ／ホムラネコ）は、いちばん長い系統をたどる
  const depthBack = (id, seen = new Set()) => {
    if (seen.has(id)) return 0;
    seen.add(id);
    const prevs = G.SpeciesOrder.filter((x) => G.evolutionTargets(x).includes(id));
    return prevs.length ? 1 + Math.max(...prevs.map((p) => depthBack(p, new Set(seen)))) : 0;
  };
  G.evolutionChain = function (id) {
    let first = id;
    for (let guard = 0; guard < 10; guard++) {
      const prevs = G.SpeciesOrder.filter((x) => G.evolutionTargets(x).includes(first));
      if (!prevs.length) break;
      first = prevs.sort((a, b) => depthBack(b) - depthBack(a))[0];
    }
    const stages = [[first]];
    const seen = new Set([first]);
    while (stages.length < 10) {
      const next = [];
      for (const x of stages[stages.length - 1]) for (const t of G.evolutionTargets(x)) if (!seen.has(t)) { seen.add(t); next.push(t); }
      if (!next.length) break;
      stages.push(next);
    }
    return stages;
  };

  // 進化の条件の説明
  const PLACE = { cave: '洞窟', highland: '高原', volcano: '火山', lakeside: '湖畔', snowfield: '氷原' };
  G.evolutionConditionText = function (evo) {
    if (!evo) return '';
    const lv = evo.level ? `Lv${evo.level}` : '';
    if (evo.item) return `${G.Items[evo.item] ? G.Items[evo.item].name : evo.item}を使う${lv ? `（${lv}以上）` : ''}`;
    let t = `${lv}${evo.place ? `・${PLACE[evo.place] || evo.place}で` : ''}`;
    if (evo.branch) {
      const N = { hp: 'HP', atk: '攻撃', def: '防御', spd: '素早さ', sat: '特殊攻撃', sdf: '特殊防御' };
      t += `（${evo.branch.map((b) => `${N[b.stat]}を鍛えると${G.Species[b.to].name}`).join('／')}）`;
    }
    return t;
  };
})(window.Game);
