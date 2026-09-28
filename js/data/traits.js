// 特性
//   inherit: 配合で子へ受け継がれる確率（％）
//   fx: バトルでの効果（js/systems/battle.js が解釈する）
//     stat:{atk:1.15,…} 能力倍率 / acc,eva: 加算 / crit: 会心率アップ / sturdy: 一撃耐え
//     regen: 毎ターン最大HPの1/n回復 / statusResist: 状態異常を防ぐ確率(1=無効) / guard:[状態異常]
//     intimidate / lucky / breeder / element+power: 属性技強化 / guardSpec: 特殊ダメージ倍率
//     hex: 補助・追加効果が決まりやすい / stab: タイプ一致倍率 / healBoost: 回復倍率
//     doubleHit: 追撃確率 / specDrain: 特殊技の吸収率 / superBoost: 抜群時倍率
//     finisher: 相手HP半分以下で倍率 / quick: 先制確率
(function (G) {
  'use strict';

  const T = {};
  const def = (key, name, inherit, desc, fx) => { T[key] = { name, inherit, desc, fx }; };

  // ---------------- 公式データ（100種）の特性 ----------------
  def('猛火の闘志', '猛火の闘志', 35, '攻撃が15%上がる。', { stat: { atk: 1.15 } });
  def('破壊衝動', '破壊衝動', 30, '攻撃が25%上がるが、防御が10%下がる。', { stat: { atk: 1.25, def: 0.9 } });
  def('水鏡の守り', '水鏡の守り', 35, '受ける特殊攻撃のダメージを20%減らす。', { guardSpec: 0.8 });
  def('守護の祈り', '守護の祈り', 40, '特防が20%上がる。', { stat: { sdf: 1.2 } });
  def('甲殻装甲', '甲殻装甲', 40, '防御が20%上がる。', { stat: { def: 1.2 } });
  def('不屈の肉体', '不屈の肉体', 30, 'HPが満タンのとき、一撃では倒れない。', { sturdy: true });
  def('大地の根', '大地の根', 30, '毎ターンHPが1/12回復し、防御が10%上がる。', { regen: 12, stat: { def: 1.1 } });
  def('再生皮膚', '再生皮膚', 30, '毎ターンHPが1/16回復する。', { regen: 16 });
  def('残像', '残像', 35, '回避が10上がる。', { eva: 10 });
  def('疾風脚', '疾風脚', 40, '素早さが20%上がる。', { stat: { spd: 1.2 } });
  def('雷走り', '雷走り', 40, '素早さが15%上がる。', { stat: { spd: 1.15 } });
  def('先制感知', '先制感知', 25, '25%の確率で、相手より先に行動できる。', { quick: 0.25 });
  def('狩人の本能', '狩人の本能', 35, '命中が10上がり、会心の一撃が出やすい。', { acc: 10, crit: true });
  def('急所狙い', '急所狙い', 30, '会心の一撃が出やすい。', { crit: true });
  def('追撃本能', '追撃本能', 30, '相手のHPが半分以下のとき、与えるダメージが1.2倍になる。', { finisher: 1.2 });
  def('弱点看破', '弱点看破', 30, '効果抜群のときのダメージが1.3倍になる。', { superBoost: 1.3 });
  def('連撃の才', '連撃の才', 25, '攻撃技が20%の確率で、もう一度当たる（威力半分）。', { doubleHit: 0.2 });
  def('属性共鳴', '属性共鳴', 30, '自分と同じ属性の技の威力が、さらに上がる（タイプ一致の倍率 +0.3。1.5→1.8倍）。', { stab: 1.8 });
  def('魔力増幅', '魔力増幅', 35, '特攻が20%上がる。', { stat: { sat: 1.2 } });
  def('魔力吸収', '魔力吸収', 30, '特殊技で与えたダメージの10%を回復する。', { specDrain: 0.1 });
  def('呪術の才', '呪術の才', 35, '補助技や追加効果が決まりやすい。', { hex: true });
  def('精霊の加護', '精霊の加護', 40, '50%の確率で状態異常を防ぐ。', { statusResist: 0.5 });
  def('状態異常耐性', '状態異常耐性', 30, '状態異常にならない。', { statusResist: 1 });
  def('癒しの波動', '癒しの波動', 40, '回復技の効果が1.5倍になる。', { healBoost: 1.5 });
  def('慈愛の光', '慈愛の光', 40, '回復技の効果が1.5倍になり、毎ターン少し回復する。', { healBoost: 1.5, regen: 24 });
  def('無限の可能性', '無限の可能性', 0, 'すべての能力が10%上がり、状態異常にならない。',
    { stat: { atk: 1.1, def: 1.1, spd: 1.1, sat: 1.1, sdf: 1.1 }, statusResist: 1 });

  // ---------------- 旧データの特性（以前のセーブデータとの互換用） ----------------
  def('swift', '俊足', 40, '素早さが15%上がる。', { stat: { spd: 1.15 } });
  def('ironwall', '鉄壁の体', 40, '防御が15%上がる。', { stat: { def: 1.15 } });
  def('mighty', '剛力', 40, '攻撃が15%上がる。', { stat: { atk: 1.15 } });
  def('sage', '賢者', 40, '特攻が15%上がる。', { stat: { sat: 1.15 } });
  def('poison_guard', '毒耐性', 50, '毒状態にならない。', { guard: ['poison'] });
  def('para_guard', '麻痺耐性', 50, '麻痺状態にならない。', { guard: ['para'] });
  def('sleep_guard', '不眠', 50, '睡眠状態にならない。', { guard: ['sleep'] });
  def('critical', '会心の眼', 30, '会心の一撃が出やすくなる。', { crit: true });
  def('regen', '自然治癒', 30, '毎ターン最大HPの1/16回復する。', { regen: 16 });
  def('sturdy', '不屈', 30, 'HP満タンのとき、一撃では倒れない。', { sturdy: true });
  def('intimidate', '威圧', 30, '戦闘開始時、相手の攻撃を下げる。', { intimidate: true });
  def('evasive', '霞隠れ', 35, '回避が10上がる。', { eva: 10 });
  def('hunter', '狩人の目', 35, '命中が10上がる。', { acc: 10 });
  def('lucky', '幸運', 45, '戦闘で得るお金が1.5倍になる。', { lucky: true });
  def('breeder', '配合の才', 60, '配合したとき、子の「配合値」（血統の力）が大きく上がる。', { breeder: true });
  const blessings = { fire: '炎', water: '水', grass: '草', thunder: '雷', earth: '地', wind: '風', light: '光', dark: '闇' };
  for (const [el, n] of Object.entries(blessings)) {
    def(el + '_blessing', `${n}の加護`, 35, `${n}属性の技の威力が1.2倍になる。`, { element: el, power: 1.2 });
  }

  G.Traits = T;

  // 個体の特性（固有特性＋親から受け継いだ追加特性）
  G.traitsOf = (m) => [m.innateTrait, m.inheritedTrait].filter((t) => t && T[t]);
  // 個体の特性効果をまとめたもの
  G.traitFx = function (m) {
    const out = { stat: {} };
    for (const t of G.traitsOf(m)) {
      const fx = T[t].fx || {};
      for (const [k, v] of Object.entries(fx)) {
        if (k === 'stat') for (const [s, mul] of Object.entries(v)) out.stat[s] = (out.stat[s] || 1) * mul;
        else if (k === 'acc' || k === 'eva') out[k] = (out[k] || 0) + v;
        else if (k === 'guard') out.guard = (out.guard || []).concat(v);
        else if (k === 'regen') out.regen = Math.min(out.regen || 99, v);
        else if (k === 'statusResist') out.statusResist = Math.max(out.statusResist || 0, v);
        else if (k === 'element') (out.elements = out.elements || {})[v] = fx.power || 1.2;
        else if (k !== 'power') out[k] = v;
      }
    }
    return out;
  };
})(window.Game);
