// =====================================================================
//  公式モンスターデータの読み込み（正本: data/monster_frontier.json）
// =====================================================================
//  ・G.monsterSpecies（= G.Species）… 種族データ。IDは設計書の "001"〜"100"
//  ・G.fusionRecipes（= G.FusionRecipes.recipes）… 配合レシピ。種族データとは独立
//  ・起動時に、ID重複・存在しない親ID・配合結果の欠落などを検証し、G.DataReport に記録する
//
//  ID・名称・レシピは設計書のまま変更しない。ここで行うのは「ゲームで使える形への変換」だけ。
// =====================================================================
(function (G) {
  'use strict';

  const RAW = G.RawMonsterData;
  const report = G.DataReport = { errors: [], warnings: [], info: [] };
  const err = (m) => report.errors.push(m);
  const warn = (m) => report.warnings.push(m);

  // ---------------- 能力値の換算 ----------------
  // 設計書の基礎値（F≒10〜30、EX≒130〜240）を、戦闘計算で使う内部値に換算する。
  // ランク差は保ちつつ、低ランクでも戦えるよう幅を少し圧縮する（バランス調整はこの係数で行う）。
  const STAT_CONV = { offset: 20, scale: 1.6 };
  const conv = (v) => Math.round(STAT_CONV.offset + v * STAT_CONV.scale);
  // MP は設計書に無いので、特殊攻撃と役割から算出する
  const mpBase = (bs, role) => Math.round(15 + bs['特殊攻撃'] * 1.1 + (role === '支援' ? 12 : 0) + (role === '万能' ? 20 : 0));
  // 成長型 → 経験値の伸び
  const GROWTH = { 速度: 'fast', 攻撃: 'normal', 特殊: 'normal', 支援: 'normal', 耐久: 'slow', 万能: 'slow' };
  // ランク → 捕獲しやすさ（配合限定は野生に出ないので実質使わない）
  const CATCH = { F: 190, E: 140, D: 90, C: 50, B: 30, A: 15, S: 6, SS: 4, SSS: 3, EX: 2 };
  const OBTAIN = { 野生: 'wild', 配合限定: 'fusion', 進化: 'evolve' }; // 進化 = 進化でのみ出会える

  // ---------------- 見た目（ドット絵のパラメータ）を系統・属性・名前から決める ----------------
  const PAL = {
    fire: ['#f08a3a', '#fff0d0', '#ffd23a'], water: ['#4a90d8', '#e8f4ff', '#a8e4ff'],
    wind: ['#6ac8a8', '#f0f8e8', '#f0e070'], earth: ['#a8784a', '#f0dcc0', '#6a4a2a'],
    thunder: ['#e8c02a', '#fff8d0', '#3a3a4a'], light: ['#f4ecb0', '#ffffff', '#f0c8f0'],
    dark: ['#5a4a78', '#b8a8d8', '#f0d040'], ice: ['#9ad8f0', '#ffffff', '#5aa8d8'],
    none: ['#e8e4f0', '#ffffff', '#ffd35a'],
  };
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + amt)));
    return '#' + ((1 << 24) | (f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1);
  }
  function lookFor(raw, el, ri) {
    const n = raw.name;
    const [b1, c2, c3] = PAL[el] || PAL.none;
    const c1 = shade(b1, ((Number(raw.id) % 5) - 2) * 9);
    const L = { c1, c2, c3, scale: Math.min(1.15, 0.72 + ri * 0.07) };
    const has = (re) => re.test(n);
    if (ri >= 6) L.halo = true;
    switch (raw.family) {
      case '獣':
        L.plan = 'quad';
        if (has(/モグラ/)) Object.assign(L, { ears: 'none', tail: 'thin', nose: 'pink' });
        else if (has(/リス/)) Object.assign(L, { ears: 'round', tail: 'bushy' });
        else if (has(/ネコ|キャット/)) Object.assign(L, { ears: 'pointy', tail: 'thin' });
        else Object.assign(L, { ears: 'pointy', tail: el === 'fire' ? 'flame' : el === 'thunder' ? 'bolt' : el === 'water' ? 'flat' : 'bushy' });
        if (has(/ウルフ|ハウンド|フェンリル|ライガ|獣/) || ri >= 3) L.mane = shade(c3, 20);
        if (ri >= 3) L.horn = c3;
        break;
      case '鳥':
        L.plan = 'bird';
        if (ri >= 2) L.crest = c3;
        if (el === 'fire') L.flame = true;
        break;
      case '植物':
        L.plan = 'blob';
        L.deco = has(/ドライアド|樹/) ? 'tree' : has(/バナ|フラワー|フェアリー/) ? 'flower' : has(/ソウ|リーフ|ツタ/) ? 'sprout' : 'bud';
        L.accent = el === 'fire' ? '#ff8a4a' : el === 'thunder' ? '#ffe070' : '#ffb0d0';
        break;
      case '水棲':
        if (has(/カメ|タートル|亀/)) L.plan = 'golem';
        else if (has(/クラゲ/)) L.plan = 'spirit';
        else if (has(/タマリ/)) { L.plan = 'blob'; L.deco = 'moss'; }
        else L.plan = 'fish';
        break;
      case '虫':
        L.plan = 'bug';
        break;
      case '魔獣':
        if (has(/コウモリ/)) { L.plan = 'bird'; L.bat = true; }
        else if (has(/ネコ|キャット/)) Object.assign(L, { plan: 'quad', ears: 'pointy', tail: 'thin', eyes: c3 });
        else if (has(/ウルフ|狼|ケルベロス|セレス/)) Object.assign(L, { plan: 'quad', ears: 'pointy', tail: 'bushy', mane: c3, horn: ri >= 4 ? c3 : undefined });
        else if (has(/グラン|巨獣/)) { L.plan = 'golem'; L.moss = true; }
        else { L.plan = 'imp'; if (ri >= 4) L.blade = true; }
        break;
      case '精霊':
        L.plan = 'spirit';
        if (el === 'light' || el === 'wind') L.wings = true;
        break;
      case '竜':
      default:
        L.plan = 'dragon';
    }
    return L;
  }

  // ---------------- 配合ヒント（答えを直接言わない） ----------------
  const EL_WORD = { fire: '炎を宿す', water: '水をまとう', wind: '風に乗る', earth: '大地の', thunder: '雷をはらむ', light: '光を放つ', dark: '闇にひそむ', ice: '凍てつく', none: 'まっさらな' };
  const FAM_WORD = { 獣: '獣', 鳥: '鳥', 植物: '草花', 水棲: '水の生き物', 虫: '虫', 魔獣: '魔獣', 精霊: '精霊', 竜: '竜' };
  const phrase = (sp) => `${EL_WORD[sp.el]}${FAM_WORD[sp.family]}`;

  // ---------------- 種族データの構築 ----------------
  const S = {};
  const order = [];
  if (!RAW || !Array.isArray(RAW.monsters)) {
    err('公式データ（G.RawMonsterData）が読み込まれていません。js/data/monster_frontier.js を確認してください。');
  } else {
    for (const r of RAW.monsters) {
      if (S[r.id]) { err(`ID重複: ${r.id}`); continue; }
      const el = G.ElementByName[r.element];
      const line = G.LineageByName[r.family];
      const ri = G.rankIndex(r.rank);
      if (!el) err(`${r.id} ${r.name}: 未対応の属性「${r.element}」`);
      if (!line) err(`${r.id} ${r.name}: 未対応の系統「${r.family}」`);
      if (ri < 0) err(`${r.id} ${r.name}: 未対応のランク「${r.rank}」`);
      if (!OBTAIN[r.obtain]) err(`${r.id} ${r.name}: 未対応の入手区分「${r.obtain}」`);
      const bs = r.baseStats;
      for (const m of r.initialMoveCandidates) if (!G.Moves[m]) err(`${r.id} ${r.name}: 技「${m}」が未定義`);
      if (!G.Traits[r.innateTrait]) err(`${r.id} ${r.name}: 特性「${r.innateTrait}」が未定義`);
      const c = r.initialMoveCandidates;
      // 種族値（正本は JSON の speciesStats。作り方のルールは js/data/statRules.js）
      const SR = G.StatRules;
      const stats = {};
      for (const k of SR.KEYS) {
        const v = r.speciesStats && r.speciesStats[SR.JP[k]];
        if (!(v > 0)) err(`${r.id} ${r.name}: 種族値「${SR.JP[k]}」が未設定です（node tools/species-stats.js）`);
        stats[k] = v > 0 ? v : 1;
      }
      if (!SR.ARCHETYPES[r.archetype]) err(`${r.id} ${r.name}: 型「${r.archetype}」が未定義`);
      const evYield = {};
      for (const [name, v] of Object.entries(r.evYield || {})) {
        if (!SR.BY_JP[name]) err(`${r.id} ${r.name}: 努力値報酬の能力「${name}」が不正`);
        else evYield[SR.BY_JP[name]] = v;
      }
      S[r.id] = {
        id: r.id,
        no: Number(r.id),
        name: r.name,
        family: r.family,          // 設計書の表記（表示用）
        element: r.element,
        el: el || 'none',
        line: line || 'beast',
        rank: r.rank,
        role: r.role,
        growthType: r.growthType,
        growth: GROWTH[r.growthType] || 'normal',
        obtain: OBTAIN[r.obtain] || 'fusion',
        wild: r.obtain === '野生',
        region: r.region,
        habitat: r.region || (r.obtain === '進化' ? '進化でのみ出会える' : '配合でのみ誕生'),
        base: [conv(bs.HP), mpBase(bs, r.role), conv(bs['攻撃']), conv(bs['防御']), conv(bs['素早さ']), conv(bs['特殊攻撃']), conv(bs['特殊防御'])],
        raw: bs,                   // 設計書の基礎値（MP・経験値の計算に使う。命中・回避の欄は使わない）
        stats,                     // 種族値 { hp, atk, def, spd, sat, sdf }
        statTotal: SR.KEYS.reduce((a, k) => a + stats[k], 0),
        archetype: r.archetype,    // 型（物理アタッカー など）
        signature: SR.BY_JP[r.signature] || null, // 看板能力
        weakness: SR.BY_JP[r.weakness] || null,   // 苦手な能力
        tier: r.tier || '標準',
        evYield,                   // 倒したときの努力値
        innateTrait: r.innateTrait,
        traits: [r.innateTrait],
        moveCandidates: c.slice(),
        // 初期技候補：1つめ・2つめはLv1から、3つめ（強力な技）はLv10で覚える
        learn: [[1, c[0]], [1, c[1]], [10, c[2]]].filter((x) => x[1]),
        catch: CATCH[r.rank] || 50,
        desc: r.description,
        recipeDisplay: r.recipe ? r.recipe.display : null,
        // 見た目：系統・属性・名前から自動で決め、JSON の look があれば上書き（分岐進化の姿を描き分けるときなど）
        look: Object.assign(lookFor(r, el || 'none', Math.max(0, ri)), r.look || {}),
      };
      order.push(r.id);
    }
  }

  // ---------------- 配合レシピ（種族データから独立させる） ----------------
  //   親IDをソートしたキーで照合するので、親の選択順は結果に影響しない
  const pairKey = (a, b) => [a, b].sort().join('+');
  const recipes = [];
  const byPair = {};
  for (const r of (RAW && RAW.monsters) || []) {
    if (!r.recipe) {
      if (r.obtain === '配合限定') err(`${r.id} ${r.name}: 配合限定なのにレシピがありません`);
      continue;
    }
    const [a, b] = r.recipe.parentIds;
    if (r.recipe.resultId !== r.id) err(`${r.id}: レシピの resultId（${r.recipe.resultId}）が一致しません`);
    if (!S[a]) err(`${r.id} ${r.name}: 存在しない親ID ${a}`);
    if (!S[b]) err(`${r.id} ${r.name}: 存在しない親ID ${b}`);
    if (!S[r.recipe.resultId]) err(`${r.id}: 配合結果 ${r.recipe.resultId} が存在しません`);
    if (!S[a] || !S[b] || !S[r.id]) continue;
    const key = pairKey(a, b);
    const rc = {
      parentIds: [a, b].sort(),
      resultId: r.id,
      display: r.recipe.display,
      hint: `${phrase(S[a])}と、${phrase(S[b])}。\nこの2体を掛け合わせると……${EL_WORD[S[r.id].el]}${FAM_WORD[S[r.id].family]}が生まれるらしいよ。`,
    };
    recipes.push(rc);
    if (byPair[key]) {
      // 同じ親の組み合わせに複数の結果がある：先に定義された（IDが小さい）ものを採用し、警告を残す
      const first = S[byPair[key].resultId];
      warn(`親の組み合わせが重複: ${S[a].name} + ${S[b].name} → ${first.id} ${first.name} / ${r.id} ${r.name}` +
        `（${first.id} を採用。${r.id} はこの組み合わせでは生まれません）`);
      rc.shadowedBy = first.id;
      continue;
    }
    byPair[key] = rc;
  }

  G.Species = G.monsterSpecies = S;
  G.SpeciesOrder = order;
  G.FusionRecipes = {
    recipes,          // 全レシピ（重複で使われないものも含む）
    byPair,           // 親IDペア → 採用レシピ
    pairKey,
    lookup(a, b) { return byPair[pairKey(a, b)] || null; },
  };
  G.fusionRecipes = recipes;
  G.StatConversion = STAT_CONV;

  // ---------------- 検証結果のまとめ ----------------
  const fusionOnly = order.filter((id) => S[id].obtain === 'fusion').length;
  report.info.push(`種族 ${order.length}（野生 ${order.length - fusionOnly} / 配合限定 ${fusionOnly}）、レシピ ${recipes.length}（有効 ${Object.keys(byPair).length}）`);
  if (report.errors.length) console.error('[データ検証] エラー\n- ' + report.errors.join('\n- '));
  if (report.warnings.length) console.warn('[データ検証] 警告\n- ' + report.warnings.join('\n- '));
  console.info('[データ検証] ' + report.info.join(' ') + `（エラー ${report.errors.length}・警告 ${report.warnings.length}）`);
})(window.Game);
