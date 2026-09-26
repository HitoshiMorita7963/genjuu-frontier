// 属性・系統・ランクの定義
//   公式データ（data/monster_frontier_100.json）の日本語表記との対応も、ここで管理する。
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

  // 相性表：攻撃側 → 防御側 の倍率（記載なしは等倍）
  //   2 = 効果抜群 / 0.5 = いまひとつ / 0 = 無効
  G.TypeChart = {
    fire:    { grass: 2, wind: 2, ice: 2, water: 0.5, earth: 0.5, fire: 0.5 },
    water:   { fire: 2, earth: 2, grass: 0.5, water: 0.5 },
    grass:   { water: 2, earth: 2, fire: 0.5, wind: 0.5, grass: 0.5 },
    thunder: { water: 2, wind: 2, earth: 0, grass: 0.5, thunder: 0.5 },
    earth:   { fire: 2, thunder: 2, wind: 0, grass: 0.5 },
    wind:    { grass: 2, earth: 2, thunder: 0.5, fire: 0.5 },
    light:   { dark: 2, light: 0.5, fire: 0.5 },
    dark:    { light: 2, wind: 2, dark: 0.5 },
    ice:     { wind: 2, earth: 2, water: 0.5, fire: 0.5, ice: 0.5 },
  };
  G.typeMultiplier = (atkEl, defEl) => {
    const row = G.TypeChart[atkEl];
    if (!row || row[defEl] === undefined) return 1;
    return row[defEl];
  };

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
