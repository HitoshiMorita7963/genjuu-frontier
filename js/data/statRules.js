// =====================================================================
//  種族値の設計ルール（型・ランクごとの合計値・看板能力）
// =====================================================================
//  種族値 ＝ 合計値（ランク・格・入手方法で決まる）× 配分（型＋看板能力＋苦手な能力）
//  ・ゲーム本体（型の名前の表示・データ検証）と、種族値を作るツール（tools/species-stats.js）の両方で使う
//  ・各種族の種族値そのものは公式データ（data/monster_frontier.json の stats）が正本。
//    このルールは「新しく作るとき・作り直すとき」の基準と、検証の目安
// =====================================================================
(function (root) {
  'use strict';

  const KEYS = ['hp', 'atk', 'def', 'spd', 'sat', 'sdf'];
  const JP = { hp: 'HP', atk: '攻撃', def: '防御', spd: '素早さ', sat: '特殊攻撃', sdf: '特殊防御' };

  const R = {
    KEYS,
    JP,
    BY_JP: Object.fromEntries(Object.entries(JP).map(([k, v]) => [v, k])),

    // 型ごとの配分（合計100。HP・攻撃・防御・素早さ・特殊攻撃・特殊防御）
    ARCHETYPES: {
      物理アタッカー: { shape: [21, 25, 14, 16, 10, 14], role: '攻撃', desc: '物理技で攻める。攻撃が高く、特殊攻撃は低め' },
      特殊アタッカー: { shape: [20, 10, 13, 17, 25, 15], role: '特殊', desc: '特殊技で攻める。特殊攻撃が高い' },
      高速アタッカー: { shape: [18, 22, 11, 25, 11, 13], role: '速度', desc: '先手をとって攻める。素早さと攻撃が高く、打たれ弱い' },
      物理の壁: { shape: [26, 12, 24, 9, 11, 18], role: '耐久', desc: '物理攻撃に強い。HPと防御が高く、遅い' },
      特殊の壁: { shape: [26, 10, 15, 10, 14, 25], role: '耐久', desc: '特殊攻撃に強い。HPと特殊防御が高い' },
      重戦車: { shape: [27, 24, 19, 7, 9, 14], role: '攻撃', desc: 'とても遅いが、HP・攻撃・防御がそろって高い' },
      高速サポート: { shape: [20, 11, 13, 23, 15, 18], role: '支援', desc: '先手で補助や回復をする' },
      耐久サポート: { shape: [26, 9, 17, 11, 15, 22], role: '支援', desc: '倒れにくく、補助や回復で味方を支える' },
      万能: { shape: [21, 16, 16, 16, 15, 16], role: '万能', desc: '苦手がなく、なんでもこなす' },
      一点特化: { shape: [16, 28, 9, 22, 14, 11], role: '攻撃', desc: '攻撃に全てをかけた、打たれ弱い型' },
    },

    // ランクごとの合計値（野生・格「標準」の基準）。F〜C は従来とほぼ同じ、B 以上は伸びをゆるやかに
    BUDGET: { F: 275, E: 335, D: 420, C: 520, B: 610, A: 700, S: 780, SS: 850, SSS: 910, EX: 980 },
    // 同じランクの中での格
    TIER: { 下位: -0.05, 標準: 0, 上位: 0.05 },
    FUSION_ONLY_BONUS: 0.04,   // 配合でしか生まれない種族は +4%（配合のごほうび）
    FUSION_BONUS_RANKS: ['F', 'E', 'D', 'C'], // ↑は野生の同ランクがいるランクだけ（B以上は全種が配合限定なので基準どおり）
    SIGNATURE: 2,              // 看板能力 +2（配分の点）
    WEAKNESS: -2,              // 苦手な能力 −2

    // 倒したときの努力値（ランクごと）。1つめは看板能力、2つめは型の2番めに高い能力
    EV_YIELD: { F: [1], E: [1], D: [2], C: [2], B: [2, 1], A: [2, 1], S: [3], SS: [3], SSS: [3], EX: [3] },

    // 種族の合計値（格・入手方法を反映）
    total(rank, tier = '標準', fusionOnly = false) {
      const b = R.BUDGET[rank];
      if (!b) return null;
      const bonus = fusionOnly && R.FUSION_BONUS_RANKS.includes(rank) ? R.FUSION_ONLY_BONUS : 0;
      return Math.round(b * (1 + (R.TIER[tier] || 0) + bonus));
    },

    // 型・看板・苦手から配分（合計100）を作る
    shape(archetype, signature, weakness) {
      const a = R.ARCHETYPES[archetype];
      if (!a) return null;
      const s = a.shape.slice();
      const si = KEYS.indexOf(signature), wi = KEYS.indexOf(weakness);
      if (si >= 0) s[si] += R.SIGNATURE;
      if (wi >= 0 && wi !== si) s[wi] += R.WEAKNESS;
      return s;
    },

    // 種族値を計算する（整数。合計はぴったり total に合わせる）
    //   jitter: 種族ごとのわずかな揺らぎ（能力ごとに −1〜+1、合計は変えない）
    compute({ rank, archetype, signature, weakness, tier, fusionOnly, jitter }) {
      const total = R.total(rank, tier, fusionOnly);
      const shape = R.shape(archetype, signature, weakness);
      if (!total || !shape) return null;
      const sum = shape.reduce((x, y) => x + y, 0);
      const raw = shape.map((p) => total * p / sum);
      const out = raw.map(Math.floor);
      // 端数の大きい順に 1 ずつ配って合計を合わせる
      let rest = total - out.reduce((x, y) => x + y, 0);
      raw.map((v, i) => [v - Math.floor(v), i]).sort((x, y) => y[0] - x[0]).forEach(([, i]) => { if (rest > 0) { out[i]++; rest--; } });
      if (jitter) {
        // 看板能力は揺らさない。ほかの能力で +1/−1 を同じ数だけ
        for (let i = 0; i + 1 < jitter.length; i += 2) {
          const [up, down] = [jitter[i], jitter[i + 1]];
          if (up === down || KEYS[up] === signature || KEYS[down] === signature) continue;
          out[up] += 1; out[down] -= 1;
        }
      }
      return Object.fromEntries(KEYS.map((k, i) => [k, out[i]]));
    },

    // 型の2番めに高い能力（看板能力を除く）
    secondStat(archetype, signature) {
      const s = R.shape(archetype, signature, null);
      return KEYS.map((k, i) => [k, s[i]]).filter(([k]) => k !== signature).sort((x, y) => y[1] - x[1])[0][0];
    },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = R;
  else root.Game.StatRules = R;
})(typeof window !== 'undefined' ? window : this);
