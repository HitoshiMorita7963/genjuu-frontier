// =====================================================================
//  個体の育成：種族値・個体値・努力値
// =====================================================================
//  種族値（G.Species[id].stats）… 種族そのものの能力。全個体共通。正本は data/monster_frontier.json（speciesStats）
//  個体値（ivHp 〜 ivSpecialDefense）… 生まれつきの才能 0〜31。レベルアップでの伸び方に効く
//  努力値（evHp 〜 evSpecialDefense）… プレイヤーが育てた結果。戦闘・訓練所・特訓アイテムで増える
//
//  設定値は js/data/growthConfig.js。能力値の計算そのものは G.Monster.stats（js/systems/monster.js）。
//
//  将来の拡張のための入り口：
//   ・G.Individual.TITLES      … 個体限定の称号（条件と、オーラ演出の種類）
//   ・G.Individual.evGainHooks … 努力値の獲得量を変える装備などの効果
//   ・G.StatModifiers          … 装備・特性などによる能力値の補正（js/systems/monster.js）
// =====================================================================
(function (G) {
  'use strict';

  const C = G.GrowthConfig;
  const KEYS = ['hp', 'atk', 'def', 'spd', 'sat', 'sdf'];
  // セーブデータ上の項目名（能力キー → 個体値・努力値の項目）
  const IV_FIELD = { hp: 'ivHp', atk: 'ivAttack', def: 'ivDefense', spd: 'ivSpeed', sat: 'ivSpecialAttack', sdf: 'ivSpecialDefense' };
  const EV_FIELD = { hp: 'evHp', atk: 'evAttack', def: 'evDefense', spd: 'evSpeed', sat: 'evSpecialAttack', sdf: 'evSpecialDefense' };
  const NAMES = { hp: 'HP', atk: '攻撃', def: '防御', spd: '素早さ', sat: '特殊攻撃', sdf: '特殊防御' };
  const IV_DEFAULT = 15;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const randIv = () => G.Util.randInt(C.IV_MAX + 1);

  const I = G.Individual = {
    KEYS, IV_FIELD, EV_FIELD, NAMES,

    // ---------------- 個体値 ----------------
    iv(m, k) { const v = m[IV_FIELD[k]]; return v === undefined || v === null ? IV_DEFAULT : v; },
    ivs(m) { const o = {}; for (const k of KEYS) o[k] = I.iv(m, k); return o; },
    ivTotal(m) { return KEYS.reduce((a, k) => a + I.iv(m, k), 0); },
    setIvs(m, ivs) { for (const k of KEYS) m[IV_FIELD[k]] = clamp(Math.round(ivs[k]), 0, C.IV_MAX); },
    // 個体値を決める。spec: 数値（全能力その値）/ { hp: 31, ... } / 省略（ランダム）
    rollIvs(spec) {
      const o = {};
      for (const k of KEYS) {
        if (typeof spec === 'number') o[k] = spec;
        else if (spec && spec[k] !== undefined) o[k] = spec[k];
        else o[k] = randIv();
      }
      return o;
    },
    tier(iv) { return C.IV_GROWTH_TIERS.find((t) => iv <= t.max) || C.IV_GROWTH_TIERS[C.IV_GROWTH_TIERS.length - 1]; },
    // 個体値による成長補正（段階補正 ＋ 1ポイントごとの微調整）
    ivGrowth(iv) { return I.tier(iv).mul + (iv - C.IV_MAX / 2) * C.IV_FINE; },
    rank(iv) { return C.IV_RANKS.find((r) => iv <= r.max) || C.IV_RANKS[C.IV_RANKS.length - 1]; },
    // 個体値の数値と評価が見られるか：鑑定屋で鑑定してもらった、または 幻獣使いのスキル『鑑定眼』を覚えた
    appraised() { return G.hasFlag(C.APPRAISAL_FLAG) || !!(G.Tamer && G.state && G.Tamer.hasSkill('eye')); },

    // ---------------- 努力値 ----------------
    ev(m, k) { return m[EV_FIELD[k]] || 0; },
    evs(m) { const o = {}; for (const k of KEYS) o[k] = I.ev(m, k); return o; },
    evTotal(m) { return KEYS.reduce((a, k) => a + I.ev(m, k), 0); },
    evRoom(m, k) { return Math.max(0, Math.min(C.EV_MAX_STAT - I.ev(m, k), C.EV_MAX_TOTAL - I.evTotal(m))); },
    // 努力値の成長補正（倍率）と固定分
    evGrowth(ev) { return 1 + C.EV_GROWTH_MUL * ev / C.EV_MAX_STAT; },
    evFlat(ev, level) { return C.EV_FLAT_PER_LEVEL * level * ev / C.EV_MAX_STAT; },
    // 努力値を加える（上限を守る）。実際に増えた量を返す
    addEv(m, k, amount) {
      const add = Math.min(Math.max(0, Math.floor(amount)), I.evRoom(m, k));
      if (add > 0) m[EV_FIELD[k]] = I.ev(m, k) + add;
      return add;
    },
    resetEvs(m) { for (const k of KEYS) m[EV_FIELD[k]] = 0; },

    // 装備などで努力値の獲得量を変える関数（m, gains, ctx）→ gains。今はまだ空
    evGainHooks: [],
    // 敵を倒したときの努力値（{ atk: 4, ... }）
    evFromDefeat(m, enemy, isTrainer) {
      const sp = G.Species[enemy.speciesId];
      let gains = {};
      for (const [k, v] of Object.entries(sp.evYield || {})) gains[k] = v * C.EV_PER_POINT * (isTrainer ? C.EV_TRAINER_MUL : 1);
      for (const h of I.evGainHooks) gains = h(m, gains, { enemy, isTrainer }) || gains;
      const got = {};
      for (const [k, v] of Object.entries(gains)) { const a = I.addEv(m, k, v); if (a) got[k] = a; }
      return got;
    },

    // ---------------- 個体データの補完・旧データの変換 ----------------
    //   旧データの individualBonus（0〜15）は、個体値（0〜31）に換算して引き継ぐ
    ensure(m) {
      const old = m.individualBonus;
      for (const k of KEYS) {
        if (m[IV_FIELD[k]] === undefined || m[IV_FIELD[k]] === null) {
          m[IV_FIELD[k]] = old && old[k] !== undefined ? clamp(old[k] * 2 + ((m.instanceId || 0) + k.length) % 2, 0, C.IV_MAX) : randIv();
        }
        if (typeof m[EV_FIELD[k]] !== 'number') m[EV_FIELD[k]] = 0;
      }
      delete m.individualBonus;
      return m;
    },

    // ---------------- 配合：個体値の継承 ----------------
    //   親Aから2能力・親Bから2能力（個体値が高い能力ほど選ばれやすい）、残りはランダム。
    //   継承した値も一定確率でぶれる。ランダムの能力も両親の平均に少し寄る。
    //   配合値（血統の力）が高い親ほど、ランダムの能力が高く出やすく、継承した値も上にぶれやすい。
    inheritIvs(a, b, rnd = Math.random) {
      const F = C.FUSION_IV;
      const ia = I.ivs(a), ib = I.ivs(b);
      const bl = I.bloodline(a, b);
      const roll = () => { let v = 0; for (let n = 0; n < bl.rolls; n++) v = Math.max(v, Math.floor(rnd() * (C.IV_MAX + 1))); return v; };
      const left = KEYS.slice();
      const out = {};
      const source = {};
      const pickFrom = (ivs) => {
        const w = left.map((k) => (ivs[k] + F.weightBase) ** 2);
        let r = rnd() * w.reduce((x, y) => x + y, 0);
        for (let i = 0; i < left.length; i++) { r -= w[i]; if (r <= 0) return left.splice(i, 1)[0]; }
        return left.pop();
      };
      const inherit = (from, other, tag) => {
        for (let n = 0; n < F.fromEach && left.length; n++) {
          const k = pickFrom(from);
          let v = from[k];
          if (other[k] > v && rnd() < F.bestOfBoth) v = other[k];
          if (rnd() < F.mutateChance) v += (rnd() < bl.upChance ? 1 : -1) * (1 + Math.floor(rnd() * F.mutateRange));
          out[k] = clamp(v, 0, C.IV_MAX);
          source[k] = tag;
        }
      };
      // どちらの親から先に選ぶかも公平に
      if (rnd() < 0.5) { inherit(ia, ib, 'a'); inherit(ib, ia, 'b'); } else { inherit(ib, ia, 'b'); inherit(ia, ib, 'a'); }
      const pullRate = F.randomPull * (1 - C.BLOODLINE.pullFade * Math.min(1, bl.value / 100));
      for (const k of left) {
        const pull = (ia[k] + ib[k]) / 2;
        out[k] = clamp(Math.round(roll() * (1 - pullRate) + pull * pullRate), 0, C.IV_MAX);
        source[k] = 'random';
      }
      // 血統の加護：配合値が高いほど、どの能力も少し上乗せされやすい
      const blessed = [];
      for (const k of KEYS) {
        if (rnd() < bl.blessChance) {
          out[k] = clamp(out[k] + 1 + Math.floor(rnd() * C.BLOODLINE.blessRange), 0, C.IV_MAX);
          blessed.push(k);
        }
      }
      return { ivs: out, source, bloodline: bl, blessed };
    },
    // 配合値（血統の力）の効果：{ value: 親の平均, rolls: ランダム能力の振り直し回数, upChance: 上にぶれる確率 }
    bloodline(a, b) {
      const B = C.BLOODLINE;
      const value = Math.floor(((a.fusionBonus || 0) + (b.fusionBonus || 0)) / 2);
      return {
        value,
        rolls: Math.min(B.maxRolls, 1 + Math.floor(value / B.rollStep)),
        upChance: Math.min(B.upBiasMax, 0.5 + value / B.upBiasPer),
        blessChance: Math.min(B.blessMax, value / B.blessPer),
      };
    },
    // 配合値の説明（UI用）
    bloodlineText(m) {
      const v = m.fusionBonus || 0;
      if (v >= 60) return '血統の力が非常に強い。子は優れた才能をもちやすい';
      if (v >= 30) return '血統の力が強い。子は才能に恵まれやすい';
      if (v >= 10) return '血統の力が育ってきた。子の才能が少し高くなりやすい';
      if (v > 0) return '血統の力がわずかに宿っている';
      return 'まだ血統の力は宿っていない（配合で生まれた子に宿る）';
    },

    // ---------------- 文章での説明 ----------------
    // 鑑定前のヒント（数値や評価は出さない）
    hints(m) {
      const ivs = I.ivs(m);
      const out = [];
      const sorted = KEYS.slice().sort((x, y) => ivs[y] - ivs[x]);
      for (const k of sorted) {
        const r = I.rank(ivs[k]).rank;
        if (r === 'S') out.push(`${NAMES[k]}の才能が 非常に高いようだ`);
        else if (r === 'A') out.push(`${NAMES[k]}に 恵まれている`);
      }
      for (const k of sorted.slice().reverse()) if (I.rank(ivs[k]).rank === 'E') out.push(`${NAMES[k]}は 少し苦手なようだ`);
      const total = I.ivTotal(m);
      if (total >= 150) out.unshift('全体的に 素質に恵まれた個体のようだ');
      if (!out.length) out.push('とくに目立つ才能は 見当たらない。のびのび育ちそうだ');
      return out.slice(0, 4);
    },
    // 鑑定後の評価文（「攻撃の才能：非常に高い」）
    talentText(m, k) { return `${NAMES[k]}の才能：${I.rank(I.iv(m, k)).word}`; },
    // 努力値の説明
    evTexts(m) {
      const evs = I.evs(m);
      const out = [];
      for (const k of KEYS.slice().sort((x, y) => evs[y] - evs[x])) {
        if (evs[k] >= 200) out.push(`${NAMES[k]}を 重点的に鍛えている`);
        else if (evs[k] >= 100) out.push(`${NAMES[k]}の育成が 進んでいる`);
        else if (evs[k] > 0) out.push(`${NAMES[k]}を 少し鍛えた`);
      }
      if (!out.length) out.push('まだ 育成されていない');
      return out;
    },
    // 成長傾向：種族値と個体値から、よく伸びる能力を2つ
    growthText(m) {
      const sp = G.Species[m.speciesId];
      const score = (k) => sp.stats[k] * I.ivGrowth(I.iv(m, k)) * (k === 'hp' ? 0.8 : 1);
      const top = KEYS.slice().sort((x, y) => score(y) - score(x)).slice(0, 2).map((k) => NAMES[k]);
      return `${top.join('と')}が よく伸びる（${G.Monster.GROWTH_NAMES[sp.growth]}）`;
    },

    // ---------------- 称号・オーラ（個体限定） ----------------
    //   test(m, ivs) が真なら、その称号を持つ。aura はオーラ演出の種類（UIで光らせる）
    TITLES: [
      { id: 'perfect', name: '完全なる個体', aura: 'rainbow', desc: 'すべての才能が極まった、奇跡の個体。', test: (m, iv) => KEYS.every((k) => iv[k] >= 31) },
      { id: 'gifted', name: '天賦の才', aura: 'gold', desc: 'すべての能力に、非常に高い才能をもつ。', test: (m, iv) => KEYS.every((k) => iv[k] >= 28) },
      { id: 'prodigy', name: '逸材', aura: 'silver', desc: '全体の才能が高い、選ばれた個体。', test: (m, iv) => KEYS.reduce((a, k) => a + iv[k], 0) >= 150 },
      { id: 'specialist', name: '一芸の極み', aura: null, desc: 'ひとつの能力に、極限の才能をもつ。', test: (m, iv) => KEYS.some((k) => iv[k] >= 31) },
    ],
    // opts.all：鑑定前でも個体値の称号を含める（オーラの判定用）。鑑定前の画面には出さない
    titles(m, opts = {}) {
      const iv = I.ivs(m);
      const list = opts.all || I.appraised() ? I.TITLES.filter((t) => t.test(m, iv)) : [];
      if (m.title) list.unshift({ id: 'custom', name: m.title, aura: m.aura || null, desc: '' }); // イベントで授かる称号など
      return list;
    },
    // 珍しい個体のオーラ（鑑定前でも光って見える）
    aura(m) { const t = I.titles(m, { all: true }).find((x) => x.aura); return t ? t.aura : null; },

    // 配合回数：この個体と、祖先のうち配合で生まれた個体の数
    fusionCount(m, depth = 12) {
      const seen = new Set();
      const walk = (node, d) => {
        if (!node || d < 0 || seen.has(node.instanceId)) return 0;
        seen.add(node.instanceId);
        const ps = node.parentInstanceIds || [];
        if (ps.length < 2) return 0;
        return 1 + ps.reduce((a, id) => a + walk(G.Lineage.get(id), d - 1), 0);
      };
      return walk(m, depth);
    },
  };
})(window.Game);
