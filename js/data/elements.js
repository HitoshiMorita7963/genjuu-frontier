// 属性・系統・ランクの定義
//   公式データ（data/monster_frontier.json）の日本語表記との対応も、ここで管理する。
(function (G) {
  'use strict';

  // 属性（幻獣は 炎・水・風・地・雷・光・闇・氷・無 のいずれか。草は旧データの技のために残している）
  G.Elements = {
    none:    { name: '無', color: '#b8b4a8' },
    fire:    { name: '炎', color: '#f06a3a' },
    water:   { name: '水', color: '#3f8ad8' },
    grass:   { name: '草', color: '#4fb04a' },
    thunder: { name: '雷', color: '#e8c02a' },
    earth:   { name: '地', color: '#a8783a' },
    wind:    { name: '風', color: '#6ac8b8' },
    light:   { name: '光', color: '#f4e48a' },
    dark:    { name: '闇', color: '#7a5aa8' },
    ice:     { name: '氷', color: '#9ae0f4' },
  };
  // 公式データの表記 → 内部キー
  G.ElementByName = { 炎: 'fire', 水: 'water', 風: 'wind', 地: 'earth', 雷: 'thunder', 光: 'light', 闇: 'dark', 氷: 'ice', 無: 'none', 草: 'grass' };

  // 相性：ジャンケンのような「めぐり」（設計者の指定）
  //   水 → 炎 → 風 → 地（土） → 雷 → 水 …（矢印の先に強い＝2倍、逆向きは弱い＝0.5倍）
  //   光 ⇄ 闇（おたがいに2倍）
  //   氷・無は、どの属性とも等倍（相性は未定。決まったらここに足す）
  //   めぐりの属性は「得意な相手1つ・苦手な相手1つ」になる。無効（0倍）はない
  G.ElementCycle = ['water', 'fire', 'wind', 'earth', 'thunder'];
  G.TypeChart = {};
  G.ElementCycle.forEach((el, i) => {
    const next = G.ElementCycle[(i + 1) % G.ElementCycle.length];
    const prev = G.ElementCycle[(i - 1 + G.ElementCycle.length) % G.ElementCycle.length];
    G.TypeChart[el] = { [next]: 2, [prev]: 0.5 };
  });
  G.TypeChart.light = { dark: 2 };
  G.TypeChart.dark = { light: 2 };

  // 攻撃の属性 → 防御側の属性（1つ、または複合タイプの2つ）の倍率。複合タイプは掛け算
  G.typeMultiplier = (atkEl, defEls) => {
    const row = G.TypeChart[atkEl] || {};
    const list = Array.isArray(defEls) ? defEls : [defEls];
    return list.reduce((mul, el) => mul * (row[el] === undefined ? 1 : row[el]), 1);
  };
  // その種族の属性（複合タイプなら2つ）
  G.elementsOf = (sp) => sp.els || [sp.el];
  // タイプ一致（技の属性が、使い手の属性のどれかと同じ。無属性は一致しない）
  G.isStab = (moveEl, sp) => moveEl !== 'none' && G.elementsOf(sp).includes(moveEl);
  // 表示用の属性名（例：「水・風」）
  G.elementLabel = (sp) => G.elementsOf(sp).map((el) => G.Elements[el].name).join('・');

  // 系統（公式データの8系統。machine は旧データ用に残している）
  G.Lineages = {
    beast:   { name: '獣系',   desc: '鋭い感覚と身体能力をもつ幻獣たち。' },
    wing:    { name: '鳥系',   desc: '空中戦と素早い行動を得意とする幻獣たち。' },
    plant:   { name: '植物系', desc: '自然の力を蓄え、持久戦に強い幻獣たち。' },
    aqua:    { name: '水棲系', desc: '水場で力を発揮し、耐久力に優れる幻獣たち。' },
    insect:  { name: '虫系',   desc: '小柄ながら特化した能力をもつ幻獣たち。' },
    fiend:   { name: '魔獣系', desc: '攻撃や状態異常に長けた異形の幻獣たち。' },
    spirit:  { name: '精霊系', desc: '属性の力を操り、支援や特殊技を得意とする幻獣たち。' },
    dragon:  { name: '竜系',   desc: '古き血を引く、誇り高き竜の一族。' },
    machine: { name: '機甲系', desc: '鋼や岩の硬い体をもつ幻獣たち。' },
  };
  G.LineageByName = { 獣: 'beast', 鳥: 'wing', 植物: 'plant', 水棲: 'aqua', 虫: 'insect', 魔獣: 'fiend', 精霊: 'spirit', 竜: 'dragon' };

  // ランク（高いほど強い傾向だが、低ランクにも役割がある）
  G.Ranks = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'EX'];
  G.rankIndex = (r) => G.Ranks.indexOf(r);
})(window.Game);
