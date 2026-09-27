// 配合ロジック（レシピは js/data/monsterLoader.js が公式データから構築した G.FusionRecipes）
//   ・結果は親の種族IDの組み合わせで固定（選ぶ順番は問わない）
//     公式レシピがあればその子、無ければ汎用ルール（js/data/fusionRules.js：系統とランク）で決まる
//   ・子の能力は子の種族データから計算し、親の能力値はコピーしない
//   ・技：子の初期技に加え、親の習得済み技から最大2つを継承（装備はランクで 4〜6つ）
//   ・特性：固有特性は必ず持ち、親由来の追加特性は最大1つ
//   ・個体値：親A・親Bから2能力ずつ継承（高い個体値ほど選ばれやすい）、残りはランダム（js/systems/individual.js）
//   ・努力値：引き継がない（子は0から育て直す。完成個体のコピーを防ぐ）
//   ・子の生成・親の消費・子の配置を1つの処理として行い、途中で失敗したら元に戻す
(function (G) {
  'use strict';

  const INHERIT_MAX = 2;

  const F = G.Fusion = {
    INHERIT_MAX,

    // 結果の判定：{ speciesId, recipe, kind }
    //   kind: 'recipe' = 公式レシピ / 'rule' = 汎用配合ルール（js/data/fusionRules.js）
    resolve(a, b) {
      if (!a || !b) return null;
      const rc = G.FusionRecipes.lookup(a.speciesId, b.speciesId);
      if (rc) return { speciesId: rc.resultId, recipe: rc, kind: 'recipe' };
      const id = F.ruleResult(a.speciesId, b.speciesId);
      return id ? { speciesId: id, recipe: null, kind: 'rule' } : null;
    },

    // 汎用ルール：系統とランクから、野生で入手できる種族の中で子を決める（親の種族だけで決まる）
    ruleResult(idA, idB) {
      const R = G.FusionRules;
      // 親の並びを決定的にする：ランクが高い方、同ランクならIDが小さい方を「主」とする
      let [pa, pb] = [G.Species[idA], G.Species[idB]];
      const d = G.rankIndex(pb.rank) - G.rankIndex(pa.rank);
      if (d > 0 || (d === 0 && pb.id < pa.id)) [pa, pb] = [pb, pa];
      let line = pa.line;
      if (pa.line !== pb.line) {
        const [x, y] = [pa.line, pb.line].sort((p, q) => R.lineageOrder.indexOf(p) - R.lineageOrder.indexOf(q));
        line = R.familyTable[`${x}+${y}`] || pa.line;
      }
      const up = Math.max(G.rankIndex(pa.rank), G.rankIndex(pb.rank)) >= G.rankIndex(R.upgradeFrom);
      const ranks = up ? R.highRanks : R.lowRanks;
      // 子の候補：野生で出会える種族のうち、進化で姿を変えた種族（進化先）ではないもの
      const evolved = F.evolvedForms();
      const pool = (rank) => G.SpeciesOrder.map((id) => G.Species[id]).filter((sp) => sp.obtain === 'wild' && sp.rank === rank && !evolved.has(sp.id));
      const shares = (sp) => G.elementsOf(sp).some((el) => G.elementsOf(pa).includes(el) || G.elementsOf(pb).includes(el));
      // 同じ系統 → 親と同じ属性 → だれでも、の順に、ランクの高い方から探す
      let cands = [];
      for (const test of [(sp) => sp.line === line, shares, () => true]) {
        for (const rank of ranks) { cands = pool(rank).filter(test); if (cands.length) break; }
        if (cands.length) break;
      }
      if (!cands.length) return null;
      const elRank = (sp) => (G.elementsOf(sp).includes(pa.el) ? 0 : G.elementsOf(sp).includes(pb.el) ? 1 : 2);
      const score = (sp) => [
        sp.id === pa.id || sp.id === pb.id ? 1 : 0,          // 親と同じ種族はなるべく避ける
        elRank(sp),                                          // 主の親の属性を優先
        Number(sp.id),
      ];
      cands.sort((s, t) => {
        const x = score(s), y = score(t);
        for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
        return 0;
      });
      return cands[0].id;
    },

    // 進化先になる種族（配合では生まれない）
    evolvedForms() {
      if (!F._evolved) F._evolved = new Set(G.SpeciesOrder.flatMap((id) => G.evolutionTargets(id)));
      return F._evolved;
    },

    // 配合できるか（できない理由の文、できるなら null）
    check(a, b) {
      if (!a || !b) return '親を2体選んでください。';
      if (a === b || a.instanceId === b.instanceId) return '同じ幻獣どうしは配合できません。';
      const all = G.Party.all();
      if (!all.includes(a) || !all.includes(b)) return '親の幻獣が見つかりません。';
      if (!F.resolve(a, b)) return 'この組み合わせでは、新たな命は生まれないようだ……。';
      // 親2体がいなくなったあと、子を置く場所があるか
      const inParty = [a, b].filter((m) => G.state.party.includes(m)).length;
      const partyFree = G.Monster.PARTY_MAX - (G.state.party.length - inParty);
      const storageFree = G.Monster.STORAGE_MAX - (G.state.storage.length - (2 - inParty));
      if (partyFree <= 0 && storageFree <= 0) return 'パーティも預かり所もいっぱいで、子を迎えられません。';
      return null;
    },

    // 以前に同じ組み合わせで配合したことがあるか（あれば結果を画面に表示できる）
    known(a, b) {
      const res = F.resolve(a, b);
      if (!res) return false;
      if (res.kind === 'recipe') return G.Dex.recipeFound(res.speciesId);
      return (G.state.ruleFound || {})[G.FusionRecipes.pairKey(a.speciesId, b.speciesId)] === res.speciesId;
    },

    // 子の配合ボーナス：両親の平均＋レベルに応じたボーナス。「配合の才」持ちの親がいれば大きく上がる
    childBonus(a, b) {
      const breeder = [a, b].some((m) => G.traitFx(m).breeder);
      const v = Math.floor(((a.fusionBonus || 0) + (b.fusionBonus || 0)) / 2) + 1 + Math.floor((a.level + b.level) / 8) + (breeder ? 5 : 0);
      return Math.min(99, v);
    },

    // 子の初期レベル：両親のレベル合計の1/4（最低1）
    childLevel(a, b) { return Math.max(1, Math.floor((a.level + b.level) / 4)); },

    // ---- 技の継承 ----
    inheritSlots() { return INHERIT_MAX; },
    // 両親の習得済み技のうち継承できるもの（固有技・もがくは不可）
    inheritableMoves(a, b) {
      const out = [];
      for (const id of a.moves.concat(b.moves)) {
        if (!out.includes(id) && G.Moves[id] && G.Moves[id].inherit !== false) out.push(id);
      }
      return out;
    },
    lockedMoves(a, b) {
      const out = [];
      for (const id of a.moves.concat(b.moves)) if (!out.includes(id) && G.Moves[id] && G.Moves[id].inherit === false) out.push(id);
      return out;
    },
    // 誕生後に子の技を選びなおす（配合の館の「技を選ぶ」）
    //   選べるのは、親から受け継げる技（最大 INHERIT_MAX）と、子が今のレベルまでに覚える技。合わせて1〜持てる数（ランクで 4〜6つ）
    //   親の技でも、子が自分で覚える技なら「子の技」として数える（受け継ぎの枠を使わない）
    childOwnMoves(child) { return G.Monster.learnedUpTo(G.Species[child.speciesId], child.level); },
    //   受け継いだ技は、親のときの強化段階（+1 など）のまま
    setChildMoves(child, picks, parentMoves, parentStages = {}) {
      const own = F.childOwnMoves(child);
      const moves = [];
      for (const id of picks) if (!moves.includes(id) && (own.includes(id) || parentMoves.includes(id))) moves.push(id);
      const inherited = moves.filter((id) => !own.includes(id));
      if (!moves.length || moves.length > G.Monster.maxMoves(child.speciesId) || inherited.length > INHERIT_MAX) return false;
      child.moves = moves;
      child.inheritedMoves = inherited;
      F.pinChildMoves(child, parentStages);
      G.Lineage.record(child);
      return true;
    },
    // 子の技の強化段階：自分で覚える技は種族が覚えるレベルから、受け継いだ技は親の段階のまま
    pinChildMoves(child, parentStages) {
      child.moveLv = null;
      G.MoveStage.pin(child);
      for (const id of child.inheritedMoves) G.MoveStage.setStage(child, id, parentStages[id] || 1);
    },
    // 親の技の強化段階（両親とも持っていれば高い方）
    parentStages(a, b) {
      const out = {};
      for (const p of [a, b]) for (const id of p.moves) out[id] = Math.max(out[id] || 1, G.MoveStage.stage(p, id));
      return out;
    },

    // 子の装備技：継承技（最大2）→ 子の初期技 の順で、持てる数まで
    childMoves(speciesId, level, inherited) {
      const own = G.Monster.movesAtLevel(G.Species[speciesId], level);
      const moves = inherited.slice(0, INHERIT_MAX);
      for (const id of own) if (moves.length < G.Monster.maxMoves(speciesId) && !moves.includes(id)) moves.push(id);
      return moves;
    },

    // ---- 特性の継承（固有特性＋親由来の追加特性は最大1つ） ----
    childInheritedTrait(speciesId, a, b) {
      const innate = G.Species[speciesId].innateTrait;
      const cands = [];
      for (const t of G.traitsOf(a).concat(G.traitsOf(b))) if (t !== innate && !cands.includes(t)) cands.push(t);
      cands.sort(() => Math.random() - 0.5);
      for (const t of cands) if (Math.random() * 100 < (G.Traits[t].inherit || 0)) return t;
      return null;
    },

    // 配合を実行（安全な一括処理）。opts.inherit: 継承する技の配列
    perform(a, b, opts = {}) {
      const why = F.check(a, b);
      if (why) throw new Error(why);
      const res = F.resolve(a, b);
      const s = G.state;

      // --- 1) 変更前の状態を控える（失敗したら戻す） ---
      const backup = {
        party: s.party.slice(),
        storage: s.storage.slice(),
        uidSeq: s.uidSeq,
        lineage: Object.assign({}, s.lineage || {}),
        recipesFound: Object.assign({}, s.recipesFound || {}),
        ruleFound: Object.assign({}, s.ruleFound || {}),
        dex: JSON.parse(JSON.stringify(s.dex || {})),
        fusionCount: s.fusionCount || 0,
      };
      try {
        // --- 2) 子を組み立てる（まだどこにも置かない） ---
        const allowed = F.inheritableMoves(a, b);
        const inherit = (opts.inherit || []).filter((id) => allowed.includes(id)).slice(0, INHERIT_MAX);
        const level = F.childLevel(a, b);
        const iv = G.Individual.inheritIvs(a, b);
        const child = G.Monster.create(res.speciesId, level, {
          ivs: iv.ivs,
          moves: F.childMoves(res.speciesId, level, inherit),
          inheritedMoves: inherit,
          inheritedTrait: F.childInheritedTrait(res.speciesId, a, b),
          generation: Math.max(a.generation || 0, b.generation || 0) + 1,
          parentInstanceIds: [a.instanceId, b.instanceId],
          fusionBonus: F.childBonus(a, b),
          how: 'fusion',
          where: '配合の館',
        });
        const parentStages = F.parentStages(a, b);
        F.pinChildMoves(child, parentStages);

        // --- 3) 系譜に親を記録 → 親を消費 → 子を配置 ---
        G.Lineage.record(a);
        G.Lineage.record(b);
        if (!G.Party.remove(a) || !G.Party.remove(b)) throw new Error('親の幻獣を取り除けませんでした。');
        const dest = G.Party.add(child);
        if (!dest) throw new Error('子を置く場所がありません。');
        G.Lineage.record(child);
        G.Dex.record(child.speciesId, 'fusion', '配合の館');
        if (res.recipe) G.Dex.recordRecipe(res.recipe);
        else (s.ruleFound || (s.ruleFound = {}))[G.FusionRecipes.pairKey(a.speciesId, b.speciesId)] = res.speciesId;
        s.fusionCount = (s.fusionCount || 0) + 1;
        // 配合の記念に、経験値アイテム（生まれた子のランクで決まる）。生まれたばかりの子を育てやすくする
        const gift = G.ItemDrops.fusion[G.Species[child.speciesId].rank];
        if (gift) G.addItem(gift[0], gift[1]);

        const ri = G.rankIndex(G.Species[child.speciesId].rank);
        const tier = res.kind === 'rule' ? 'rule' : ri >= 7 ? 'super' : ri >= 5 ? 'rare' : 'recipe';
        return { child, recipe: res.recipe, kind: res.kind, tier, dest, inheritedMoves: inherit, parentMoves: allowed, parentStages, gift, inheritedTrait: child.inheritedTrait, ivSource: iv.source };
      } catch (e) {
        // --- 失敗：親だけ消えた状態にならないよう、すべて元に戻す ---
        s.party.splice(0, s.party.length, ...backup.party);
        s.storage.splice(0, s.storage.length, ...backup.storage);
        s.uidSeq = backup.uidSeq;
        s.lineage = backup.lineage;
        s.recipesFound = backup.recipesFound;
        s.ruleFound = backup.ruleFound;
        s.dex = backup.dex;
        s.fusionCount = backup.fusionCount;
        throw e;
      }
    },
  };
})(window.Game);
