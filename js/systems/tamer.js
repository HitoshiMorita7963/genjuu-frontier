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
        try {
          G.Audio.se('levelup');
          G.UI.toast(`幻獣使いLvが ${after}に 上がった！` + (ranks.length ? `（${ranks.join('・')}ランクと 絆を結べる）` : ''));
        } catch (e) { /* 画面のない環境（テスト）では通知しない */ }
      }
      try { G.UI.refresh(); } catch (e) { /* 同上 */ }
    },

    // 捕獲：その幻獣に必要な幻獣使いレベル・投げられるか・捕獲率の倍率
    needLevel(sp) { return C.RANK_LEVEL[sp.rank] || 1; },
    canCatch(sp) { return T.level() >= T.needLevel(sp); },
    catchBonus(sp) { return 1 + Math.min(C.BONUS_MAX, Math.max(0, T.level() - T.needLevel(sp)) * C.BONUS_PER_LEVEL); },

    // 以前のセーブ：図鑑・レシピ・物語の進み具合から経験値を見積もる
    estimate(st) {
      const owned = Object.values(st.dex || {}).filter((d) => d.owned).length;
      const recipes = Object.keys(st.recipesFound || {}).length;
      const events = Object.keys(C.EVENTS).filter((k) => st.flags && st.flags[k]).reduce((s, k) => s + C.EVENTS[k], 0);
      return owned * C.EXP.wild + recipes * C.EXP.recipe + events;
    },
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
