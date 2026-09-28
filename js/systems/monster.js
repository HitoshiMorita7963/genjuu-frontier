// 幻獣の個体生成・能力値計算・パーティ/預かり所・図鑑・系譜
//
//  個体データ（セーブにそのまま保存される）
//   instanceId        個体ID（通し番号）
//   speciesId         種族ID（"001"〜"100"）
//   name, level, exp, hp, mp, status
//   moves             装備技（ランクで 4〜6つ。Monster.maxMoves）
//   moveLv            （任意）技を覚えたレベル { 技ID: レベル }。技の強化段階の計算に使う（G.MoveStage）
//   inheritedMoves    親から受け継いだ技（moves の内訳）
//   innateTrait       固有特性（種族の特性）
//   inheritedTrait    親由来の追加特性（最大1つ、なければ null）
//   generation        世代（野生・初期個体=0、配合で生まれるたびに 親の最大世代+1）
//   parentInstanceIds 親の個体ID [a, b]（配合で生まれた個体のみ）
//   ivHp, ivAttack, ivDefense, ivSpeed, ivSpecialAttack, ivSpecialDefense
//                     個体値（0〜31・生まれつきの才能。js/systems/individual.js）
//   evHp, evAttack, evDefense, evSpeed, evSpecialAttack, evSpecialDefense
//                     努力値（育成の結果。1能力252・合計510まで）
//   fusionBonus       配合値（血統の力）。配合を重ねるほど高まり、子の個体値を高くなりやすくする。能力値には直接効かない
//   power             （トレーナーの幻獣のみ）ボスなどの能力の底上げ（％）
//   origin            入手方法と場所
//   title, aura       （任意）イベントで授かった個体限定の称号・オーラ
(function (G) {
  'use strict';

  const STAT_KEYS = ['hp', 'mp', 'atk', 'def', 'spd', 'sat', 'sdf'];
  const GROWTH_K = { fast: 0.8, normal: 1, slow: 1.25 };

  // 装備・特性などによる能力値の補正。fn(m, out) で out を書きかえる（今は空。将来の装備などで使う）
  G.StatModifiers = [];

  const Mon = G.Monster = {
    MAX_LEVEL: 50,
    PARTY_MAX: (G.RawMonsterData && G.RawMonsterData.rules && G.RawMonsterData.rules.partyLimit) || 6,
    STORAGE_MAX: 60,
    // 同時に持てる技の数（ランクで増える）：F・E 4つ／D・C 5つ／B 以上 6つ
    MOVE_SLOTS: { F: 4, E: 4, D: 5, C: 5, B: 6, A: 6, S: 6, SS: 6, SSS: 6, EX: 6 },
    MAX_MOVES: 6, // いちばん多いとき
    maxMoves(spOrId) { const sp = typeof spOrId === 'string' ? G.Species[spOrId] : spOrId; return Mon.MOVE_SLOTS[sp.rank] || 4; },
    STAT_KEYS,
    STAT_NAMES: { hp: 'HP', mp: 'MP', atk: '攻撃', def: '防御', spd: '素早さ', sat: '特攻', sdf: '特防', acc: '命中', eva: '回避' },
    GROWTH_NAMES: { fast: '早熟', normal: '普通', slow: '晩成' },

    species: (m) => G.Species[m.speciesId],

    // レベル lv に到達するのに必要な累計経験値（高ランクほど少し多く必要）
    expForLevel(sp, lv) {
      if (lv <= 1) return 0;
      const rankK = 1 + Math.max(0, G.rankIndex(sp.rank)) * 0.06;
      return Math.floor(GROWTH_K[sp.growth] * rankK * lv * lv * lv);
    },

    // レベル lv までに覚える技（覚える順）
    learnedUpTo(sp, lv) {
      const learned = [];
      for (const [l, id] of sp.learn) if (l <= lv && !learned.includes(id)) learned.push(id);
      return learned;
    },
    // 野生・トレーナー・図鑑用：レベル lv までに覚える技から、持てる数まで（覚える順に並べる）
    //   使うのは技候補の3つと、タイプ一致の技・補助の技だけ。相性の穴を埋める技やタイプ不一致の無属性技は、
    //   配合で子の技を選ぶときに使う（敵が弱点を突いてきて、ボス戦が急に難しくならないように）
    //   4つを超えるときは ①いちばん強いタイプ一致の攻撃技 ②型の技（技候補の2つめ） ③残りは新しく覚えた順
    movesAtLevel(sp, lv) {
      const mv = (id) => G.Moves[id];
      const kit = Mon.learnedUpTo(sp, lv).filter((id) => sp.moveCandidates.includes(id) || mv(id).cat === 'stat' || G.stabMultiplier(mv(id).el, sp) > 1);
      const max = Mon.maxMoves(sp);
      if (kit.length <= max) return kit;
      const val = (id) => (mv(id).pow || 0) * G.stabMultiplier(mv(id).el, sp);
      const attacks = kit.filter((id) => mv(id).cat !== 'stat').sort((a, b) => val(b) - val(a));
      const pick = [];
      const add = (id) => { if (id && kit.includes(id) && !pick.includes(id) && pick.length < max) pick.push(id); };
      add(attacks[0]);
      add(sp.moveCandidates[1]);
      for (const id of kit.slice().reverse()) add(id);
      return kit.filter((id) => pick.includes(id));
    },

    create(speciesId, level, opts = {}) {
      const sp = G.Species[speciesId];
      if (!sp) throw new Error('未定義の幻獣: ' + speciesId);
      const s = G.state;
      s.uidSeq = (s.uidSeq || 0) + 1;
      const m = {
        instanceId: s.uidSeq,
        speciesId,
        name: opts.name || sp.name,
        level,
        exp: Mon.expForLevel(sp, level),
        hp: 0,
        mp: 0,
        moves: (opts.moves || Mon.movesAtLevel(sp, level)).slice(0, Mon.maxMoves(sp)),
        inheritedMoves: opts.inheritedMoves || [],
        innateTrait: sp.innateTrait,
        inheritedTrait: opts.inheritedTrait || null,
        generation: opts.generation || 0,
        parentInstanceIds: opts.parentInstanceIds || [],
        fusionBonus: opts.fusionBonus || 0,
        status: null,
        origin: { how: opts.how || 'wild', where: opts.where || '' },
      };
      if (opts.power) m.power = opts.power;
      MS.pin(m); // 技を覚えたレベル（種族が覚えるレベル。技の強化段階に使う）
      // 個体値：opts.ivs（数値 or 能力ごと）を指定しなければランダム。努力値は 0 から
      G.Individual.setIvs(m, G.Individual.rollIvs(opts.ivs));
      G.Individual.resetEvs(m);
      const st = Mon.stats(m);
      m.hp = st.hp;
      m.mp = st.mp;
      return m;
    },

    // 能力値 ＝ 種族値 × Lv/50 × 個体値の成長補正 × 努力値の成長補正 ＋ 努力値の固定分 ＋ 5（HPは ＋Lv＋10）
    //   → トレーナーの底上げ（power％）・永続強化（boost）・G.StatModifiers（装備など）の順に補正
    //   個体値・努力値は「伸び方」に効くため、種族値が高い能力ほどよく伸びる。設定は js/data/growthConfig.js
    //   MP は個体値・努力値の対象外（種族のMP基礎値から計算）
    //   配合値（fusionBonus）は能力値に効かない（配合で子の個体値に効く：G.Individual.inheritIvs）
    stats(m) {
      const sp = Mon.species(m);
      const I = G.Individual;
      const L = m.level;
      const fb = 1 + (m.power || 0) / 100;
      const out = {};
      for (const k of STAT_KEYS) {
        let v;
        if (k === 'mp') {
          v = Math.floor((sp.base[1] * 2 + 8) * L / 100) + 5;
        } else {
          const ev = I.ev(m, k);
          const grow = sp.stats[k] * L / 50 * I.ivGrowth(I.iv(m, k)) * I.evGrowth(ev);
          const flat = I.evFlat(ev, L) * (k === 'hp' ? 2 : 1);
          v = Math.floor(grow + flat) + (k === 'hp' ? L + 10 : 5);
        }
        out[k] = Math.floor(v * fb) + ((m.boost && m.boost[k]) || 0); // boost = 旧データの種による永続強化
      }
      // 命中・回避は種族で差をつけない（当たりやすさは技の命中で決まる）。
      // 特性（狩人の本能・残像など）と、戦闘中の上げ下げだけがこの基準に効く
      out.acc = 100;
      out.eva = 0;
      for (const f of G.StatModifiers) f(m, out);
      return out;
    },

    healFull(m) {
      const st = Mon.stats(m);
      m.hp = st.hp;
      m.mp = st.mp;
      m.status = null;
    },

    // 旧形式（ver.1）の個体を新形式に変換する。変換できない種族なら null
    migrate(m, speciesMap) {
      if (m.speciesId && G.Species[m.speciesId]) return m;
      const to = speciesMap[m.species] || (G.Species[m.species] ? m.species : null);
      if (!to) return null;
      const sp = G.Species[to];
      const n = {
        instanceId: m.uid || m.instanceId,
        speciesId: to,
        name: sp.name, // 旧種族名は新しい種族名に置きかえる
        level: m.level || 1,
        exp: 0,
        hp: 0, mp: 0,
        moves: Mon.movesAtLevel(sp, m.level || 1),
        inheritedMoves: [],
        innateTrait: sp.innateTrait,
        inheritedTrait: null,
        generation: m.gen || 0,
        parentInstanceIds: [],
        individualBonus: m.iv || {},   // 下の ensure で個体値に換算される
        fusionBonus: m.plus || 0,
        boost: m.boost,
        status: null,
        origin: m.origin || { how: 'wild', where: '' },
      };
      G.Individual.ensure(n);
      n.exp = Mon.expForLevel(sp, n.level);
      Mon.healFull(n);
      return n;
    },
  };

  // ---------------- パーティ・預かり所 ----------------
  G.Party = {
    all() { return G.state.party.concat(G.state.storage); },
    hasRoom() { return G.state.party.length < Mon.PARTY_MAX || G.state.storage.length < Mon.STORAGE_MAX; },
    // パーティに空きがあればパーティへ、なければ預かり所へ。どちらも満杯なら null
    add(m) {
      if (G.state.party.length < Mon.PARTY_MAX) { G.state.party.push(m); return 'party'; }
      if (G.state.storage.length < Mon.STORAGE_MAX) { G.state.storage.push(m); return 'storage'; }
      return null;
    },
    remove(m) {
      for (const list of [G.state.party, G.state.storage]) {
        const i = list.indexOf(m);
        if (i >= 0) { list.splice(i, 1); return true; }
      }
      return false;
    },
    where(m) { return G.state.party.includes(m) ? 'party' : 'storage'; },
    healAll() { G.state.party.forEach(Mon.healFull); },
  };

  // ---------------- 図鑑（発見記録・配合レシピ発見記録） ----------------
  G.Dex = {
    // how: seen | starter | gift | wild | fusion | evolve
    record(speciesId, how, where) {
      const d = G.state.dex;
      const e = d[speciesId] || (d[speciesId] = { seen: true, owned: false, fused: false, where: '' });
      e.seen = true;
      if (how !== 'seen') e.owned = true;
      if (how === 'fusion') e.fused = true;
      if (where && !e.where) e.where = where;
    },
    // 配合で見つけたレシピを記録（図鑑に「A + B → C」として表示される）
    recordRecipe(rc) {
      const f = G.state.recipesFound || (G.state.recipesFound = {});
      if (!f[rc.resultId]) f[rc.resultId] = { parentIds: rc.parentIds.slice(), at: Math.floor(G.state.playTime) };
    },
    recipeFound(resultId) { return !!(G.state.recipesFound && G.state.recipesFound[resultId]); },
  };

  // ---------------- 親子系譜 ----------------
  //   配合で親は消えるため、親になった個体・生まれた子の記録を state.lineage に残す
  G.Lineage = {
    snapshot(m) {
      return {
        instanceId: m.instanceId,
        speciesId: m.speciesId,
        name: m.name,
        level: m.level,
        generation: m.generation || 0,
        parentInstanceIds: (m.parentInstanceIds || []).slice(),
        how: m.origin ? m.origin.how : '',
        ivs: m.ivs || G.Individual.ivs(m), // 親の個体値（配合で消えた後も参照できるように）
      };
    },
    record(m) {
      const L = G.state.lineage || (G.state.lineage = {});
      L[m.instanceId] = G.Lineage.snapshot(m);
    },
    // 個体（今いる個体でも、配合で消えた親でも）の記録を取得
    get(instanceId) {
      const live = G.Party.all().find((m) => m.instanceId === instanceId);
      if (live) return G.Lineage.snapshot(live);
      return (G.state.lineage || {})[instanceId] || null;
    },
    // 系譜の木（depth 世代さかのぼる）
    tree(instanceId, depth = 4) {
      const node = G.Lineage.get(instanceId);
      if (!node) return null;
      const t = Object.assign({}, node);
      t.parents = depth > 0 ? node.parentInstanceIds.map((id) => G.Lineage.tree(id, depth - 1)).filter(Boolean) : [];
      return t;
    },
  };

  // ---------------- 技の強化 ----------------
  //   技は、覚えてからレベルが上がるほど強くなる（STEP レベルごとに1段階。+1〜+3）
  //   段階の数：ふつうの技 4段階（+3まで）／強い技（威力85以上）と補助技 3段階（+2まで）／最強格（威力100以上・固有技など）は強化なし
  //   攻撃技は威力が上がる。補助技は命中が上がり、消費MPが下がり、回復量が増える
  const MS = G.MoveStage = {
    STEP: 10,
    MUL: [1, 1.1, 1.2, 1.3],
    maxStage(mv) {
      if (!mv || mv.basic || mv.hidden) return 1;
      if (mv.cat === 'stat') return 3;
      if (mv.pow >= 100) return 1;
      return mv.pow >= 85 ? 3 : 4;
    },
    // 技を覚えたレベル（記録がなければ、種族が覚えるレベル。それもなければ今のレベル）
    learnedAt(m, id) {
      if (m.moveLv && m.moveLv[id] != null) return m.moveLv[id];
      const e = G.Species[m.speciesId].learn.find(([lv, x]) => x === id && lv <= m.level);
      return e ? e[0] : m.level;
    },
    stage(m, id) {
      const mv = G.Moves[id];
      return Math.min(MS.maxStage(mv), 1 + Math.floor(Math.max(0, m.level - MS.learnedAt(m, id)) / MS.STEP));
    },
    // 今の技の「覚えたレベル」を記録しておく（進化で種族が変わっても段階がもどらないように）
    pin(m) {
      const lv = {};
      for (const id of m.moves) lv[id] = MS.learnedAt(m, id);
      m.moveLv = lv;
    },
    // 段階 st になるように、覚えたレベルを決める（配合で親の技を受け継ぐとき）
    setStage(m, id, st) {
      m.moveLv = m.moveLv || {};
      m.moveLv[id] = m.level - (Math.max(1, st) - 1) * MS.STEP;
    },
    // 強化を反映した技のデータ（威力・命中・MP・回復量）。m がなければ強化なし
    of(m, id) {
      const base = G.Moves[id];
      const st = m ? MS.stage(m, id) : 1;
      const mv = Object.assign({}, base, { id, stage: st, maxStage: MS.maxStage(base) });
      if (st <= 1) return mv;
      const k = MS.MUL[st - 1];
      if (base.pow) mv.pow = Math.round(base.pow * k);
      if (base.cat === 'stat') {
        mv.acc = Math.min(100, base.acc + 5 * (st - 1));
        if (base.mp) mv.mp = Math.max(1, base.mp - (st - 1));
        if (base.eff && base.eff.heal) mv.eff = Object.assign({}, base.eff, { heal: Math.min(1, Math.round(base.eff.heal * k * 100) / 100) });
      }
      return mv;
    },
    // 表示名（例：焔牙+2）
    label(m, id) {
      const st = m ? MS.stage(m, id) : 1;
      return G.Moves[id].name + (st > 1 ? `+${st - 1}` : '');
    },
  };})(window.Game);
