// 幻獣使いレベル（プレイヤーのレベル）
//   幻獣を集める・配合する・物語を進めると経験値が入り、レベルが上がる
//   ・ランクの高い幻獣は、幻獣使いレベルが足りないと絆石を拒む
//   ・必要レベルを超えた分だけ、捕獲率が上がる
(function (G) {
  'use strict';

  const C = G.TamerConfig = {
    MAX_LEVEL: 50,
    // 必要な累計経験値：CURVE ×（レベル−1）^POW（Lv5 ≒ 51、Lv12 ≒ 257、Lv20 ≒ 612、Lv50 ≒ 2800）
    CURVE: 5.5,
    POW: 1.6,
    // 絆石を受け入れてくれる幻獣使いレベル（ランクごと）
    RANK_LEVEL: { F: 1, E: 5, D: 12, C: 20, B: 30, A: 40, S: 50, SS: 50, SSS: 50, EX: 50 },
    // 必要レベルを超えた 1 レベルごとの捕獲率ボーナスと、その上限
    BONUS_PER_LEVEL: 0.03,
    BONUS_MAX: 0.5,
    // 経験値
    EXP: {
      wild: 10,      // 初めての種族を捕まえた
      dupWild: 2,    // 持っている種族をまた捕まえた
      fusion: 10,    // 配合で初めての種族が生まれた
      recipe: 5,     // 特別レシピを見つけた
      evolve: 6,     // 進化で初めての種族になった
      gift: 5,       // もらった（相棒など）
      trainer: 5,    // トレーナーに勝った
    },
    // 物語のできごと（フラグが初めて立ったとき）
    EVENTS: {
      gotStarter: 10, fusedOnce: 10, forestOpen: 20, rival1Won: 15, gotLantern: 10,
      noirDefeated: 30, chapter1Boss: 30, chapter1Clear: 40,
      ch2Arrived: 15, keyFire: 30, keyWater: 30, chapter2Clear: 50, snowArrived: 15,
    },
  };

  const T = G.Tamer = {
    expFor(lv) { return lv <= 1 ? 0 : Math.round(C.CURVE * Math.pow(lv - 1, C.POW)); },
    exp() { return (G.state && G.state.tamer && G.state.tamer.exp) || 0; },
    levelOf(exp) {
      let lv = 1;
      while (lv < C.MAX_LEVEL && exp >= T.expFor(lv + 1)) lv++;
      return lv;
    },
    level() { return T.levelOf(T.exp()); },
    // 次のレベルまでの残り（最高レベルなら 0）
    toNext() { const lv = T.level(); return lv >= C.MAX_LEVEL ? 0 : T.expFor(lv + 1) - T.exp(); },

    // 経験値を得る。レベルが上がったら通知する
    gain(n) {
      if (!G.state || !n) return;
      const t = G.state.tamer || (G.state.tamer = { exp: 0 });
      const before = T.level();
      t.exp += n;
      const after = T.level();
      if (after > before) {
        const ranks = Object.keys(C.RANK_LEVEL).filter((r) => C.RANK_LEVEL[r] > before && C.RANK_LEVEL[r] <= after && r !== 'SS' && r !== 'SSS' && r !== 'EX');
        const skills = (G.TamerSkills || []).filter((s) => s.level > before && s.level <= after);
        try {
          G.Audio.se('levelup');
          G.UI.toast(`幻獣使いLvが ${after}に 上がった！` + (ranks.length ? `（${ranks.join('・')}ランクと 絆を結べる）` : '') +
            skills.map((s) => `　スキル『${s.name}』を 覚えた！`).join(''));
        } catch (e) { /* 画面のない環境（テスト）では通知しない */ }
      }
      try { G.UI.refresh(); } catch (e) { /* 同上 */ }
    },

    // 捕獲：その幻獣に必要な幻獣使いレベル・投げられるか・捕獲率の倍率
    needLevel(sp) { return C.RANK_LEVEL[sp.rank] || 1; },
    canCatch(sp) { return G.Settings.demoCatch || T.level() >= T.needLevel(sp); }, // デモプレイ用の捕獲モードでは、どのランクでも絆を結べる
    catchBonus(sp) { return 1 + Math.min(C.BONUS_MAX, Math.max(0, T.level() - T.needLevel(sp)) * C.BONUS_PER_LEVEL); },

    // 以前のセーブ：図鑑・レシピ・物語の進み具合から経験値を見積もる
    estimate(st) {
      const owned = Object.values(st.dex || {}).filter((d) => d.owned).length;
      const recipes = Object.keys(st.recipesFound || {}).length;
      const events = Object.keys(C.EVENTS).filter((k) => st.flags && st.flags[k]).reduce((s, k) => s + C.EVENTS[k], 0);
      return owned * C.EXP.wild + recipes * C.EXP.recipe + events;
    },
  };

  // ---------------- 幻獣使いのスキル（幻獣使いレベルで覚える、フィールドで使う便利な技） ----------------
  //   メニュー →「スキル」から使う
  // ワープ先：その地域に入る出入口の前に着く（from のマップから to へ入るワープの到着位置）
  const WARP_SPOTS = [
    { map: 'sorano', from: 'healer', name: 'ソラノ村（癒しの泉の前）' },
    { map: 'meadow', from: 'sorano', name: 'そよかぜ草原' },
    { map: 'forest', from: 'meadow', name: 'ささやきの森' },
    { map: 'cave1', from: 'forest', name: '灯石の洞窟（入口）' },
    { map: 'lumiere', from: 'lumiere_heal', name: '港町リュミエール（癒しの泉の前）' },
    { map: 'highland', from: 'lumiere', name: '風鳴りの高原' },
    { map: 'volcano', from: 'lumiere', name: '火山の麓' },
    { map: 'lakeside', from: 'highland', name: '湖畔の森' },
    { map: 'snowfield', from: 'highland', name: '北の氷原' },
  ];
  G.TamerSkills = [
    { id: 'warp', name: 'ワープ', level: 5, desc: '一度 行ったことのある 村や洞窟などへ、一瞬で 移動する。' },
    { id: 'escape', name: '脱出', level: 8, desc: '洞窟や草原などから、その地域の 入口へ もどる。' },
    { id: 'repel', name: '気配消し', level: 10, desc: 'しばらく（100歩）、先頭の幻獣より レベルの低い 野生の幻獣が 出てこない。' },
    { id: 'lure', name: '呼び寄せ', level: 12, desc: 'しばらく（100歩）、草むらで 野生の幻獣に 出会いやすくなる。' },
    { id: 'radar', name: '幻獣レーダー', level: 15, desc: 'いまいる地域に 出る幻獣を 調べる。まだ 仲間にしていない 種族には 印がつく。' },
    { id: 'eye', name: '鑑定眼', level: 20, desc: '幻獣の 才能（個体値）が 見える。仲間の 育成情報・配合の結果・戦闘で 絆石を 選ぶときの 相手。（覚えたら いつも効く）' },
    { id: 'heal', name: '癒しの手', level: 25, desc: 'パーティを 全回復する（ひんしの幻獣も 生き返る）。一度 使うと、しばらく 使えない。' },
  ];
  // スキルの数値
  C.SKILL = {
    STEPS: 100,          // 気配消し・呼び寄せが続く歩数
    LURE_RATE: 2.5,      // 呼び寄せ：草むらで出会う確率の倍率
    HEAL_COOLDOWN: 300,  // 癒しの手：次に使えるまでの時間（秒・プレイ時間）
  };
  // 歩数で効くスキル（気配消し・呼び寄せ。どちらか一方だけ）
  T.stepSkill = () => { const s = G.state.skillSteps; return s && s.left > 0 ? s.id : null; };
  T.startStepSkill = (id) => { G.state.skillSteps = { id, left: C.SKILL.STEPS }; };
  // 1歩ごとに呼ぶ。効果が切れたら通知
  T.onStep = () => {
    const s = G.state.skillSteps;
    if (!s || s.left <= 0) return;
    s.left--;
    if (s.left <= 0) { try { G.UI.toast(`${G.TamerSkills.find((x) => x.id === s.id).name}の 効果が 切れた。`); } catch (e) { /* テスト */ } }
  };
  // 癒しの手：あと何秒で使えるか（0 なら使える）
  T.healWait = () => Math.max(0, Math.ceil(((G.state.skillCd && G.state.skillCd.heal) || 0) - G.state.playTime));
  // 脱出：いまいる地域の入口（洞窟の奥は、洞窟の入口）
  const ESCAPE_TO = { cave2: 'cave1' };
  T.escapeSpot = (mapId) => {
    const to = ESCAPE_TO[mapId] || mapId;
    const w = WARP_SPOTS.find((x) => x.map === to && G.MapData[to] && G.MapData[to].encounter);
    if (!w) return null;
    const wp = G.MapData[w.from].warps.find((x) => x.to === to);
    return wp ? Object.assign({}, w, { x: wp.tx, y: wp.ty, dir: wp.dir || 'down' }) : null;
  };
  T.skills = () => G.TamerSkills.filter((s) => T.level() >= s.level);
  T.hasSkill = (id) => T.skills().some((s) => s.id === id);
  // ワープできる場所（一度行ったことがある場所だけ）。着く位置はマップの出入口から決める
  T.warpSpots = () => WARP_SPOTS.filter((w) => G.state.visited && G.state.visited[w.map] && G.MapData[w.map]).map((w) => {
    const src = G.MapData[w.from];
    const wp = src && src.warps.find((x) => x.to === w.map);
    return wp ? Object.assign({}, w, { x: wp.tx, y: wp.ty, dir: wp.dir || 'down' }) : null;
  }).filter(Boolean);
  // 行ったことのある場所の記録（マップに入ったとき）。以前のセーブは物語の進み具合から見積もる
  T.visit = (mapId) => { const v = G.state.visited || (G.state.visited = {}); v[mapId] = true; };
  T.estimateVisited = (st) => {
    const f = (k) => st.flags && st.flags[k];
    const v = { sorano: true };
    if (f('metProfessor')) v.meadow = true;
    if (f('rivalForestMet') || f('forestOpen')) v.forest = true;
    if (f('gotLantern') || f('noirDefeated')) v.cave1 = true;
    if (f('ch2Arrived')) v.lumiere = true;
    if (f('ch2Briefed') || f('keyFire') || f('keyWater')) v.highland = true;
    if (f('keyFire')) v.volcano = true;
    if (f('keyWater')) v.lakeside = true;
    if (f('snowArrived')) v.snowfield = true;
    if (st.player && st.player.map) v[st.player.map] = true;
    return v;
  };

  // ---- 経験値が入るところ（図鑑の記録・レシピの発見・物語のフラグ）にフックする ----
  const record = G.Dex.record;
  G.Dex.record = function (speciesId, how, where) {
    const was = !!(G.state.dex[speciesId] && G.state.dex[speciesId].owned);
    record.call(G.Dex, speciesId, how, where);
    if (!was && how !== 'seen') T.gain(C.EXP[how === 'starter' ? 'gift' : how] || C.EXP.gift);
  };
  const recordRecipe = G.Dex.recordRecipe;
  G.Dex.recordRecipe = function (rc) {
    const was = G.Dex.recipeFound(rc.resultId);
    recordRecipe.call(G.Dex, rc);
    if (!was) T.gain(C.EXP.recipe);
  };
  const setFlag = G.setFlag;
  G.setFlag = function (k, v = true) {
    const had = G.state && G.state.flags[k];
    setFlag(k, v);
    if (!had && v && C.EVENTS[k]) T.gain(C.EVENTS[k]);
  };
})(window.Game);
