// 自動生成ファイル（直接編集しないこと）
//   元データ: data/monster_frontier.json
//   再生成:   node tools/build-data.js
window.Game = window.Game || {};
window.Game.RawMonsterData = {
 "title": "モンスターフロンティア",
 "version": "2.4",
 "rules": {
  "partyLimit": 6,
  "maxEquippedMoves": 4,
  "fusionConsumesParents": true
 },
 "monsters": [
  {
   "id": "001",
   "name": "ヒノコロ",
   "family": "獣",
   "element": "炎",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 58,
    "攻撃": 74,
    "防御": 39,
    "素早さ": 43,
    "特殊攻撃": 22,
    "特殊防御": 39
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 24,
    "攻撃": 15,
    "防御": 9,
    "素早さ": 12,
    "特殊攻撃": 10,
    "特殊防御": 9,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は炎。"
  },
  {
   "id": "002",
   "name": "ミズリス",
   "family": "獣",
   "element": "水",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 72,
    "攻撃": 28,
    "防御": 40,
    "素早さ": 27,
    "特殊攻撃": 34,
    "特殊防御": 74
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は水。"
  },
  {
   "id": "003",
   "name": "カゼネコ",
   "family": "獣",
   "element": "風",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 49,
    "攻撃": 60,
    "防御": 32,
    "素早さ": 74,
    "特殊攻撃": 24,
    "特殊防御": 36
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 10,
    "防御": 8,
    "素早さ": 20,
    "特殊攻撃": 9,
    "特殊防御": 9,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は風。"
  },
  {
   "id": "004",
   "name": "ツチモグラ",
   "family": "獣",
   "element": "地",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 71,
    "攻撃": 34,
    "防御": 71,
    "素早さ": 24,
    "特殊攻撃": 25,
    "特殊防御": 50
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "岩つぶて",
    "硬化",
    "大地震"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "耐久",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は地。"
  },
  {
   "id": "005",
   "name": "ライポン",
   "family": "獣",
   "element": "雷",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 51,
    "攻撃": 59,
    "防御": 30,
    "素早さ": 74,
    "特殊攻撃": 25,
    "特殊防御": 36
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 10,
    "防御": 8,
    "素早さ": 20,
    "特殊攻撃": 9,
    "特殊防御": 9,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "jinraiga",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "雷走り",
   "growthType": "速度",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は雷。"
  },
  {
   "id": "006",
   "name": "ハネピヨ",
   "family": "鳥",
   "element": "風",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 50,
    "攻撃": 60,
    "防御": 25,
    "素早さ": 74,
    "特殊攻撃": 30,
    "特殊防御": 36
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 10,
    "防御": 8,
    "素早さ": 20,
    "特殊攻撃": 9,
    "特殊防御": 9,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "疾風脚",
   "growthType": "速度",
   "recipe": null,
   "description": "空中戦と素早い行動を得意とする。 属性は風。"
  },
  {
   "id": "007",
   "name": "アカツバメ",
   "family": "鳥",
   "element": "炎",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 44,
    "攻撃": 77,
    "防御": 19,
    "素早さ": 66,
    "特殊攻撃": 39,
    "特殊防御": 30
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 24,
    "攻撃": 15,
    "防御": 9,
    "素早さ": 12,
    "特殊攻撃": 10,
    "特殊防御": 9,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "狩人の本能",
   "growthType": "攻撃",
   "recipe": null,
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "008",
   "name": "ミズカモ",
   "family": "鳥",
   "element": "水",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "支援",
   "archetype": "高速サポート",
   "signature": "特殊防御",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 55,
    "攻撃": 32,
    "防御": 30,
    "素早さ": 62,
    "特殊攻撃": 41,
    "特殊防御": 55
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 26,
    "攻撃": 7,
    "防御": 11,
    "素早さ": 12,
    "特殊攻撃": 14,
    "特殊防御": 15,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": null,
   "description": "空中戦と素早い行動を得意とする。 属性は水。"
  },
  {
   "id": "009",
   "name": "コモリバナ",
   "family": "植物",
   "element": "地",
   "rank": "F",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 72,
    "攻撃": 27,
    "防御": 47,
    "素早さ": 22,
    "特殊攻撃": 37,
    "特殊防御": 70
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "耐久",
   "recipe": null,
   "description": "自然の力を蓄え、持久戦に強い。 属性は地。"
  },
  {
   "id": "010",
   "name": "ヒカリソウ",
   "family": "植物",
   "element": "光",
   "rank": "F",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 72,
    "攻撃": 24,
    "防御": 47,
    "素早さ": 25,
    "特殊攻撃": 41,
    "特殊防御": 66
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 26,
    "攻撃": 7,
    "防御": 11,
    "素早さ": 12,
    "特殊攻撃": 14,
    "特殊防御": 15,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "精霊の加護",
   "growthType": "支援",
   "recipe": null,
   "description": "自然の力を蓄え、持久戦に強い。 属性は光。"
  },
  {
   "id": "011",
   "name": "ミズタマリ",
   "family": "水棲",
   "element": "水",
   "rank": "F",
   "obtain": "野生",
   "region": "清流の岸辺",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 72,
    "攻撃": 28,
    "防御": 41,
    "素早さ": 23,
    "特殊攻撃": 37,
    "特殊防御": 74
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "甲殻装甲",
   "growthType": "耐久",
   "recipe": null,
   "description": "水場で力を発揮し、耐久力に優れる。 属性は水。"
  },
  {
   "id": "012",
   "name": "イワガメ",
   "family": "水棲",
   "element": "地",
   "rank": "F",
   "obtain": "野生",
   "region": "清流の岸辺",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 72,
    "攻撃": 33,
    "防御": 72,
    "素早さ": 19,
    "特殊攻撃": 30,
    "特殊防御": 49
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "岩つぶて",
    "硬化",
    "大地震"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": null,
   "description": "水場で力を発揮し、耐久力に優れる。 属性は地。"
  },
  {
   "id": "013",
   "name": "ビリクラゲ",
   "family": "水棲",
   "element": "雷",
   "rank": "F",
   "obtain": "野生",
   "region": "清流の岸辺",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 55,
    "攻撃": 27,
    "防御": 36,
    "素早さ": 41,
    "特殊攻撃": 74,
    "特殊防御": 42
   },
   "evYield": {
    "特殊攻撃": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 8,
    "防御": 8,
    "素早さ": 13,
    "特殊攻撃": 18,
    "特殊防御": 15,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "電撃",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "呪術の才",
   "growthType": "特殊",
   "recipe": null,
   "description": "水場で力を発揮し、耐久力に優れる。 属性は雷。"
  },
  {
   "id": "014",
   "name": "ハネムシ",
   "family": "虫",
   "element": "風",
   "rank": "F",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 50,
    "攻撃": 61,
    "防御": 31,
    "素早さ": 74,
    "特殊攻撃": 29,
    "特殊防御": 30
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 10,
    "防御": 8,
    "素早さ": 20,
    "特殊攻撃": 9,
    "特殊防御": 9,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "追撃本能",
   "growthType": "速度",
   "recipe": null,
   "description": "小柄ながら特化した能力を持つ。 属性は風。"
  },
  {
   "id": "015",
   "name": "ヒノムシ",
   "family": "虫",
   "element": "炎",
   "rank": "F",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 59,
    "攻撃": 74,
    "防御": 38,
    "素早さ": 44,
    "特殊攻撃": 27,
    "特殊防御": 33
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 24,
    "攻撃": 15,
    "防御": 9,
    "素早さ": 12,
    "特殊攻撃": 10,
    "特殊防御": 9,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "急所狙い",
   "growthType": "攻撃",
   "recipe": null,
   "description": "小柄ながら特化した能力を持つ。 属性は炎。"
  },
  {
   "id": "016",
   "name": "ツノムシ",
   "family": "虫",
   "element": "地",
   "rank": "F",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 73,
    "攻撃": 31,
    "防御": 71,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 43
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "甲殻装甲",
   "growthType": "耐久",
   "recipe": null,
   "description": "小柄ながら特化した能力を持つ。 属性は地。"
  },
  {
   "id": "017",
   "name": "ヤミコウモリ",
   "family": "魔獣",
   "element": "闇",
   "rank": "F",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 54,
    "攻撃": 26,
    "防御": 37,
    "素早さ": 48,
    "特殊攻撃": 74,
    "特殊防御": 36
   },
   "evYield": {
    "特殊攻撃": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 8,
    "防御": 8,
    "素早さ": 13,
    "特殊攻撃": 18,
    "特殊防御": 15,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "noroigoe",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "属性共鳴",
   "growthType": "特殊",
   "recipe": null,
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "018",
   "name": "ヨルネコ",
   "family": "魔獣",
   "element": "闇",
   "rank": "F",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 50,
    "攻撃": 62,
    "防御": 30,
    "素早さ": 74,
    "特殊攻撃": 30,
    "特殊防御": 29
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 22,
    "攻撃": 10,
    "防御": 8,
    "素早さ": 20,
    "特殊攻撃": 9,
    "特殊防御": 9,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "影縫い",
    "idaten",
    "奈落斬"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "019",
   "name": "コダマ",
   "family": "精霊",
   "element": "光",
   "rank": "F",
   "obtain": "野生",
   "region": "古木の祠",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 66,
    "攻撃": 24,
    "防御": 48,
    "素早さ": 32,
    "特殊攻撃": 39,
    "特殊防御": 66
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 26,
    "攻撃": 7,
    "防御": 11,
    "素早さ": 12,
    "特殊攻撃": 14,
    "特殊防御": 15,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "状態異常耐性",
   "growthType": "支援",
   "recipe": null,
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は光。"
  },
  {
   "id": "020",
   "name": "スナタマ",
   "family": "精霊",
   "element": "地",
   "rank": "F",
   "obtain": "野生",
   "region": "砂礫の丘",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 65,
    "攻撃": 28,
    "防御": 47,
    "素早さ": 27,
    "特殊攻撃": 39,
    "特殊防御": 69
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 8,
    "防御": 16,
    "素早さ": 9,
    "特殊攻撃": 9,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "再生皮膚",
   "growthType": "耐久",
   "recipe": null,
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は地。"
  },
  {
   "id": "021",
   "name": "ホムラネコ",
   "family": "獣",
   "element": "炎",
   "element2": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 71,
    "攻撃": 84,
    "防御": 45,
    "素早さ": 60,
    "特殊攻撃": 28,
    "特殊防御": 47
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 34,
    "攻撃": 22,
    "防御": 14,
    "素早さ": 17,
    "特殊攻撃": 16,
    "特殊防御": 14,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "風切り",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "001",
     "003"
    ],
    "resultId": "021",
    "display": "ヒノコロ + カゼネコ → ホムラネコ"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は炎。"
  },
  {
   "id": "022",
   "name": "ヌマモグラ",
   "family": "獣",
   "element": "水",
   "element2": "地",
   "rank": "E",
   "obtain": "野生",
   "region": "清流の洞窟",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 88,
    "攻撃": 34,
    "防御": 50,
    "素早さ": 34,
    "特殊攻撃": 39,
    "特殊防御": 90
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 42,
    "攻撃": 15,
    "防御": 21,
    "素早さ": 14,
    "特殊攻撃": 15,
    "特殊防御": 18,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "砂塵",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "002",
     "004"
    ],
    "resultId": "022",
    "display": "ミズリス + ツチモグラ → ヌマモグラ"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は水。"
  },
  {
   "id": "023",
   "name": "ライガネコ",
   "family": "獣",
   "element": "雷",
   "element2": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "雷鳴平原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 60,
    "攻撃": 80,
    "防御": 37,
    "素早さ": 85,
    "特殊攻撃": 29,
    "特殊防御": 44
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 17,
    "防御": 13,
    "素早さ": 25,
    "特殊攻撃": 15,
    "特殊防御": 14,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "005",
     "003"
    ],
    "resultId": "023",
    "display": "ライポン + カゼネコ → ライガネコ"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は雷。"
  },
  {
   "id": "024",
   "name": "ヒバネドリ",
   "family": "鳥",
   "element": "炎",
   "element2": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "攻撃",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 54,
    "攻撃": 100,
    "防御": 23,
    "素早さ": 74,
    "特殊攻撃": 47,
    "特殊防御": 37
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 34,
    "攻撃": 22,
    "防御": 14,
    "素早さ": 17,
    "特殊攻撃": 16,
    "特殊防御": 14,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "風切り",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "破壊衝動",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "006",
     "007"
    ],
    "resultId": "024",
    "display": "ハネピヨ + アカツバメ → ヒバネドリ"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "025",
   "name": "アオツバサ",
   "family": "鳥",
   "element": "水",
   "element2": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "風切り高原",
   "role": "支援",
   "archetype": "高速サポート",
   "signature": "特殊防御",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 67,
    "攻撃": 37,
    "防御": 36,
    "素早さ": 77,
    "特殊攻撃": 51,
    "特殊防御": 67
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 36,
    "攻撃": 14,
    "防御": 16,
    "素早さ": 17,
    "特殊攻撃": 20,
    "特殊防御": 20,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "fujin",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "精霊の加護",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "006",
     "008"
    ],
    "resultId": "025",
    "display": "ハネピヨ + ミズカモ → アオツバサ"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は水。"
  },
  {
   "id": "026",
   "name": "ヒカリバナ",
   "family": "植物",
   "element": "光",
   "rank": "E",
   "obtain": "野生",
   "region": "古木の祠",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 87,
    "攻撃": 29,
    "防御": 58,
    "素早さ": 30,
    "特殊攻撃": 50,
    "特殊防御": 81
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 36,
    "攻撃": 14,
    "防御": 16,
    "素早さ": 17,
    "特殊攻撃": 20,
    "特殊防御": 20,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "癒しの波動",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "009",
     "010"
    ],
    "resultId": "026",
    "display": "コモリバナ + ヒカリソウ → ヒカリバナ"
   },
   "description": "自然の力を蓄え、持久戦に強い。 属性は光。"
  },
  {
   "id": "027",
   "name": "ホノオツタ",
   "family": "植物",
   "element": "炎",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 68,
    "攻撃": 34,
    "防御": 44,
    "素早さ": 49,
    "特殊攻撃": 90,
    "特殊防御": 50
   },
   "evYield": {
    "特殊攻撃": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 15,
    "防御": 13,
    "素早さ": 18,
    "特殊攻撃": 24,
    "特殊防御": 20,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "火花",
    "烈火弾",
    "灼熱波"
   ],
   "innateTrait": "属性共鳴",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "009",
     "015"
    ],
    "resultId": "027",
    "display": "コモリバナ + ヒノムシ → ホノオツタ"
   },
   "description": "自然の力を蓄え、持久戦に強い。 属性は炎。"
  },
  {
   "id": "028",
   "name": "デンキクラゲ",
   "family": "水棲",
   "element": "雷",
   "element2": "水",
   "rank": "E",
   "obtain": "野生",
   "region": "雷鳴の海",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 68,
    "攻撃": 34,
    "防御": 43,
    "素早さ": 50,
    "特殊攻撃": 90,
    "特殊防御": 50
   },
   "evYield": {
    "特殊攻撃": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 15,
    "防御": 13,
    "素早さ": 18,
    "特殊攻撃": 24,
    "特殊防御": 20,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "呪術の才",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "011",
     "013"
    ],
    "resultId": "028",
    "display": "ミズタマリ + ビリクラゲ → デンキクラゲ"
   },
   "description": "水場で力を発揮し、耐久力に優れる。 属性は雷。"
  },
  {
   "id": "029",
   "name": "イシガメ",
   "family": "水棲",
   "element": "地",
   "element2": "水",
   "rank": "E",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 88,
    "攻撃": 40,
    "防御": 87,
    "素早さ": 24,
    "特殊攻撃": 37,
    "特殊防御": 59
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 42,
    "攻撃": 15,
    "防御": 21,
    "素早さ": 14,
    "特殊攻撃": 15,
    "特殊防御": 18,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "水刃",
    "硬化",
    "大地震"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "012",
     "011"
    ],
    "resultId": "029",
    "display": "イワガメ + ミズタマリ → イシガメ"
   },
   "description": "水場で力を発揮し、耐久力に優れる。 属性は地。"
  },
  {
   "id": "030",
   "name": "ツノバチ",
   "family": "虫",
   "element": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 61,
    "攻撃": 74,
    "防御": 37,
    "素早さ": 90,
    "特殊攻撃": 36,
    "特殊防御": 37
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 17,
    "防御": 13,
    "素早さ": 25,
    "特殊攻撃": 15,
    "特殊防御": 14,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "雷走り",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "014",
     "016"
    ],
    "resultId": "030",
    "display": "ハネムシ + ツノムシ → ツノバチ"
   },
   "description": "小柄ながら特化した能力を持つ。 属性は風。"
  },
  {
   "id": "031",
   "name": "ホノオガ",
   "family": "虫",
   "element": "炎",
   "element2": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 70,
    "攻撃": 90,
    "防御": 47,
    "素早さ": 52,
    "特殊攻撃": 35,
    "特殊防御": 41
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 34,
    "攻撃": 22,
    "防御": 14,
    "素早さ": 17,
    "特殊攻撃": 16,
    "特殊防御": 14,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "風切り",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "015",
     "014"
    ],
    "resultId": "031",
    "display": "ヒノムシ + ハネムシ → ホノオガ"
   },
   "description": "小柄ながら特化した能力を持つ。 属性は炎。"
  },
  {
   "id": "032",
   "name": "ヤミネコウモリ",
   "family": "魔獣",
   "element": "闇",
   "rank": "E",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 67,
    "攻撃": 32,
    "防御": 44,
    "素早さ": 64,
    "特殊攻撃": 85,
    "特殊防御": 43
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 32,
    "攻撃": 15,
    "防御": 13,
    "素早さ": 18,
    "特殊攻撃": 24,
    "特殊防御": 20,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "noroigoe",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "属性共鳴",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "017",
     "018"
    ],
    "resultId": "032",
    "display": "ヤミコウモリ + ヨルネコ → ヤミネコウモリ"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "033",
   "name": "モリノタマ",
   "family": "精霊",
   "element": "光",
   "rank": "E",
   "obtain": "野生",
   "region": "古木の祠",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 81,
    "攻撃": 29,
    "防御": 57,
    "素早さ": 37,
    "特殊攻撃": 51,
    "特殊防御": 80
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 36,
    "攻撃": 14,
    "防御": 16,
    "素早さ": 17,
    "特殊攻撃": 20,
    "特殊防御": 20,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "019",
     "020"
    ],
    "resultId": "033",
    "display": "コダマ + スナタマ → モリノタマ"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は光。"
  },
  {
   "id": "034",
   "name": "フレアフェザー",
   "family": "鳥",
   "element": "炎",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "攻撃",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 70,
    "攻撃": 131,
    "防御": 30,
    "素早さ": 96,
    "特殊攻撃": 62,
    "特殊防御": 48
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "破壊衝動",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "021",
     "024"
    ],
    "resultId": "034",
    "display": "ホムラネコ + ヒバネドリ → フレアフェザー"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "035",
   "name": "ヌマガメ",
   "family": "水棲",
   "element": "水",
   "element2": "地",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 115,
    "攻撃": 44,
    "防御": 64,
    "素早さ": 35,
    "特殊攻撃": 61,
    "特殊防御": 118
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 56,
    "攻撃": 23,
    "防御": 28,
    "素早さ": 21,
    "特殊攻撃": 23,
    "特殊防御": 25,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "砂塵",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "再生皮膚",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "022",
     "029"
    ],
    "resultId": "035",
    "display": "ヌマモグラ + イシガメ → ヌマガメ"
   },
   "description": "水場で力を発揮し、耐久力に優れる。 属性は水。"
  },
  {
   "id": "036",
   "name": "ライジンネコ",
   "family": "魔獣",
   "element": "雷",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 78,
    "攻撃": 96,
    "防御": 49,
    "素早さ": 118,
    "特殊攻撃": 49,
    "特殊防御": 47
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 25,
    "防御": 20,
    "素早さ": 32,
    "特殊攻撃": 23,
    "特殊防御": 21,
    "命中": 93,
    "回避": 22
   },
   "initialMoveCandidates": [
    "jinraiga",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "疾風脚",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "023",
     "028"
    ],
    "resultId": "036",
    "display": "ライガネコ + デンキクラゲ → ライジンネコ"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は雷。"
  },
  {
   "id": "037",
   "name": "セイクリッドフラワー",
   "family": "植物",
   "element": "光",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 114,
    "攻撃": 38,
    "防御": 74,
    "素早さ": 40,
    "特殊攻撃": 66,
    "特殊防御": 105
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 50,
    "攻撃": 22,
    "防御": 23,
    "素早さ": 24,
    "特殊攻撃": 28,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "慈愛の光",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "026",
     "033"
    ],
    "resultId": "037",
    "display": "ヒカリバナ + モリノタマ → セイクリッドフラワー"
   },
   "description": "自然の力を蓄え、持久戦に強い。 属性は光。"
  },
  {
   "id": "038",
   "name": "カエンビー",
   "family": "虫",
   "element": "炎",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 91,
    "攻撃": 118,
    "防御": 62,
    "素早さ": 69,
    "特殊攻撃": 45,
    "特殊防御": 52
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "連撃の才",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "030",
     "031"
    ],
    "resultId": "038",
    "display": "ツノバチ + ホノオガ → カエンビー"
   },
   "description": "小柄ながら特化した能力を持つ。 属性は炎。"
  },
  {
   "id": "039",
   "name": "ヨルサソリ",
   "family": "虫",
   "element": "闇",
   "element2": "地",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 86,
    "攻撃": 45,
    "防御": 57,
    "素早さ": 74,
    "特殊攻撃": 118,
    "特殊防御": 57
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 23,
    "防御": 20,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "砂塵",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "魔力吸収",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "032",
     "020"
    ],
    "resultId": "039",
    "display": "ヤミネコウモリ + スナタマ → ヨルサソリ"
   },
   "description": "小柄ながら特化した能力を持つ。 属性は闇。"
  },
  {
   "id": "040",
   "name": "フェニクス",
   "family": "鳥",
   "element": "炎",
   "element2": "光",
   "rank": "D",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "高速サポート",
   "signature": "特殊攻撃",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 88,
    "攻撃": 49,
    "防御": 47,
    "素早さ": 101,
    "特殊攻撃": 74,
    "特殊防御": 78
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 50,
    "攻撃": 22,
    "防御": 23,
    "素早さ": 24,
    "特殊攻撃": 28,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "灼熱波"
   ],
   "innateTrait": "精霊の加護",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "034",
     "037"
    ],
    "resultId": "040",
    "display": "フレアフェザー + セイクリッドフラワー → フェニクス"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "041",
   "name": "フレイムウルフ",
   "family": "獣",
   "element": "炎",
   "rank": "D",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 88,
    "攻撃": 113,
    "防御": 60,
    "素早さ": 66,
    "特殊攻撃": 34,
    "特殊防御": 59
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は炎。"
  },
  {
   "id": "042",
   "name": "アクアウルフ",
   "family": "獣",
   "element": "水",
   "rank": "D",
   "obtain": "野生",
   "region": "清流の洞窟",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 51,
    "防御": 63,
    "素早さ": 41,
    "特殊攻撃": 50,
    "特殊防御": 106
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 56,
    "攻撃": 23,
    "防御": 28,
    "素早さ": 21,
    "特殊攻撃": 23,
    "特殊防御": 25,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "水刃",
    "癒しの雫",
    "怒涛撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は水。"
  },
  {
   "id": "043",
   "name": "ライガーハウンド",
   "family": "獣",
   "element": "雷",
   "rank": "D",
   "obtain": "野生",
   "region": "雷鳴平原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 76,
    "攻撃": 101,
    "防御": 45,
    "素早さ": 106,
    "特殊攻撃": 38,
    "特殊防御": 54
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 25,
    "防御": 20,
    "素早さ": 32,
    "特殊攻撃": 23,
    "特殊防御": 21,
    "命中": 93,
    "回避": 22
   },
   "initialMoveCandidates": [
    "jinraiga",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "鋭い感覚と身体能力を持つ。 属性は雷。"
  },
  {
   "id": "044",
   "name": "ストームホーク",
   "family": "鳥",
   "element": "風",
   "rank": "D",
   "obtain": "野生",
   "region": "風切り高原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 76,
    "攻撃": 92,
    "防御": 38,
    "素早さ": 113,
    "特殊攻撃": 46,
    "特殊防御": 55
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 25,
    "防御": 20,
    "素早さ": 32,
    "特殊攻撃": 23,
    "特殊防御": 21,
    "命中": 93,
    "回避": 22
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "追撃本能",
   "growthType": "速度",
   "recipe": null,
   "description": "空中戦と素早い行動を得意とする。 属性は風。"
  },
  {
   "id": "045",
   "name": "ブレイズホーク",
   "family": "鳥",
   "element": "炎",
   "rank": "D",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "攻撃",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 66,
    "攻撃": 126,
    "防御": 29,
    "素早さ": 93,
    "特殊攻撃": 60,
    "特殊防御": 46
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "急所狙い",
   "growthType": "攻撃",
   "recipe": null,
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "046",
   "name": "アクアフェザー",
   "family": "鳥",
   "element": "水",
   "rank": "D",
   "obtain": "野生",
   "region": "湖畔の森",
   "role": "支援",
   "archetype": "高速サポート",
   "signature": "特殊防御",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 84,
    "攻撃": 46,
    "防御": 46,
    "素早さ": 98,
    "特殊攻撃": 62,
    "特殊防御": 84
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 50,
    "攻撃": 22,
    "防御": 23,
    "素早さ": 24,
    "特殊攻撃": 28,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "癒しの波動",
   "growthType": "支援",
   "recipe": null,
   "description": "空中戦と素早い行動を得意とする。 属性は水。"
  },
  {
   "id": "047",
   "name": "ドライアド",
   "family": "植物",
   "element": "地",
   "rank": "D",
   "obtain": "野生",
   "region": "古樹の森",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 107,
    "攻撃": 42,
    "防御": 71,
    "素早さ": 34,
    "特殊攻撃": 61,
    "特殊防御": 105
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 56,
    "攻撃": 23,
    "防御": 28,
    "素早さ": 21,
    "特殊攻撃": 23,
    "特殊防御": 25,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": null,
   "description": "自然の力を蓄え、持久戦に強い。 属性は地。"
  },
  {
   "id": "048",
   "name": "フローラルフェアリー",
   "family": "精霊",
   "element": "光",
   "rank": "D",
   "obtain": "野生",
   "region": "花冠の庭",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 101,
    "攻撃": 38,
    "防御": 69,
    "素早さ": 48,
    "特殊攻撃": 63,
    "特殊防御": 101
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 50,
    "攻撃": 22,
    "防御": 23,
    "素早さ": 24,
    "特殊攻撃": 28,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": null,
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は光。"
  },
  {
   "id": "049",
   "name": "サンダーリーフ",
   "family": "植物",
   "element": "雷",
   "rank": "D",
   "obtain": "野生",
   "region": "雷鳴平原",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 85,
    "攻撃": 42,
    "防御": 55,
    "素早さ": 62,
    "特殊攻撃": 113,
    "特殊防御": 63
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 23,
    "防御": 20,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "電撃",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "魔力吸収",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "028",
     "037"
    ],
    "resultId": "049",
    "display": "デンキクラゲ + セイクリッドフラワー → サンダーリーフ"
   },
   "description": "自然の力を蓄え、持久戦に強い。 属性は雷。"
  },
  {
   "id": "050",
   "name": "アビスフィッシュ",
   "family": "水棲",
   "element": "闇",
   "element2": "水",
   "rank": "D",
   "obtain": "野生",
   "region": "深水洞",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 84,
    "攻撃": 41,
    "防御": 56,
    "素早さ": 64,
    "特殊攻撃": 113,
    "特殊防御": 62
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 23,
    "防御": 20,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "弱点看破",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "032",
     "035"
    ],
    "resultId": "050",
    "display": "ヤミネコウモリ + ヌマガメ → アビスフィッシュ"
   },
   "description": "水場で力を発揮し、耐久力に優れる。 属性は闇。"
  },
  {
   "id": "051",
   "name": "サンダーシャーク",
   "family": "水棲",
   "element": "雷",
   "element2": "水",
   "rank": "D",
   "obtain": "野生",
   "region": "雷鳴の海",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 88,
    "攻撃": 105,
    "防御": 59,
    "素早さ": 75,
    "特殊攻撃": 34,
    "特殊防御": 59
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "水刃",
    "気合いため",
    "轟雷爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": null,
   "description": "水場で力を発揮し、耐久力に優れる。 属性は雷。"
  },
  {
   "id": "052",
   "name": "ロックタートル",
   "family": "水棲",
   "element": "地",
   "element2": "水",
   "rank": "D",
   "obtain": "野生",
   "region": "岩礁海岸",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 108,
    "攻撃": 50,
    "防御": 109,
    "素早さ": 31,
    "特殊攻撃": 46,
    "特殊防御": 76
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 56,
    "攻撃": 23,
    "防御": 28,
    "素早さ": 21,
    "特殊攻撃": 23,
    "特殊防御": 25,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "水刃",
    "硬化",
    "大地震"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": null,
   "description": "水場で力を発揮し、耐久力に優れる。 属性は地。"
  },
  {
   "id": "053",
   "name": "スカイビートル",
   "family": "虫",
   "element": "風",
   "rank": "D",
   "obtain": "野生",
   "region": "風切り高原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 77,
    "攻撃": 93,
    "防御": 45,
    "素早さ": 113,
    "特殊攻撃": 45,
    "特殊防御": 47
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 25,
    "防御": 20,
    "素早さ": 32,
    "特殊攻撃": 23,
    "特殊防御": 21,
    "命中": 93,
    "回避": 22
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "小柄ながら特化した能力を持つ。 属性は風。"
  },
  {
   "id": "054",
   "name": "インフェルノビー",
   "family": "虫",
   "element": "炎",
   "rank": "D",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 88,
    "攻撃": 114,
    "防御": 60,
    "素早さ": 66,
    "特殊攻撃": 42,
    "特殊防御": 50
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "破壊衝動",
   "growthType": "攻撃",
   "recipe": null,
   "description": "小柄ながら特化した能力を持つ。 属性は炎。"
  },
  {
   "id": "055",
   "name": "ダークホーネット",
   "family": "虫",
   "element": "闇",
   "rank": "D",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 85,
    "攻撃": 43,
    "防御": 54,
    "素早さ": 70,
    "特殊攻撃": 113,
    "特殊防御": 55
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 23,
    "防御": 20,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "noroigoe",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "弱点看破",
   "growthType": "特殊",
   "recipe": null,
   "description": "小柄ながら特化した能力を持つ。 属性は闇。"
  },
  {
   "id": "056",
   "name": "デビルキャット",
   "family": "魔獣",
   "element": "闇",
   "rank": "D",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 89,
    "攻撃": 105,
    "防御": 58,
    "素早さ": 76,
    "特殊攻撃": 42,
    "特殊防御": 50
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 48,
    "攻撃": 30,
    "防御": 21,
    "素早さ": 24,
    "特殊攻撃": 24,
    "特殊防御": 21,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "影縫い",
    "気合いため",
    "奈落斬"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": null,
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "057",
   "name": "ライトウルフ",
   "family": "魔獣",
   "element": "光",
   "rank": "D",
   "obtain": "野生",
   "region": "花冠の庭",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 46,
    "防御": 73,
    "素早さ": 45,
    "特殊攻撃": 63,
    "特殊防御": 84
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 50,
    "攻撃": 22,
    "防御": 23,
    "素早さ": 24,
    "特殊攻撃": 28,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "慈愛の光",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "037",
     "033"
    ],
    "resultId": "057",
    "display": "セイクリッドフラワー + モリノタマ → ライトウルフ"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は光。"
  },
  {
   "id": "058",
   "name": "ウィンドスピリット",
   "family": "精霊",
   "element": "風",
   "rank": "D",
   "obtain": "野生",
   "region": "風の祭壇",
   "role": "速度",
   "archetype": "高速サポート",
   "signature": "素早さ",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 78,
    "攻撃": 46,
    "防御": 54,
    "素早さ": 105,
    "特殊攻撃": 63,
    "特殊防御": 74
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 25,
    "防御": 20,
    "素早さ": 32,
    "特殊攻撃": 23,
    "特殊防御": 21,
    "命中": 93,
    "回避": 22
   },
   "initialMoveCandidates": [
    "fujin",
    "小回復",
    "旋風刃"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は風。"
  },
  {
   "id": "059",
   "name": "アーススピリット",
   "family": "精霊",
   "element": "地",
   "rank": "D",
   "obtain": "野生",
   "region": "大地の祠",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 101,
    "攻撃": 41,
    "防御": 71,
    "素早さ": 41,
    "特殊攻撃": 59,
    "特殊防御": 107
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 56,
    "攻撃": 23,
    "防御": 28,
    "素早さ": 21,
    "特殊攻撃": 23,
    "特殊防御": 25,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "耐久",
   "recipe": null,
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は地。"
  },
  {
   "id": "060",
   "name": "サンダースピリット",
   "family": "精霊",
   "element": "雷",
   "rank": "D",
   "obtain": "野生",
   "region": "雷の祭壇",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 76,
    "攻撃": 42,
    "防御": 56,
    "素早さ": 70,
    "特殊攻撃": 113,
    "特殊防御": 63
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 23,
    "防御": 20,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "電撃",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "弱点看破",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "028",
     "033"
    ],
    "resultId": "060",
    "display": "デンキクラゲ + モリノタマ → サンダースピリット"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は雷。"
  },
  {
   "id": "061",
   "name": "フェンリル",
   "family": "獣",
   "element": "氷",
   "rank": "C",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "防御",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 130,
    "防御": 83,
    "素早さ": 84,
    "特殊攻撃": 43,
    "特殊防御": 71
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 66,
    "攻撃": 41,
    "防御": 31,
    "素早さ": 34,
    "特殊攻撃": 35,
    "特殊防御": 31,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "氷牙",
    "気合いため",
    "凍結爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "041",
     "042"
    ],
    "resultId": "061",
    "display": "フレイムウルフ + アクアウルフ → フェンリル"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は氷。"
  },
  {
   "id": "062",
   "name": "雷獣ライガ",
   "family": "獣",
   "element": "雷",
   "rank": "C",
   "obtain": "野生",
   "region": "雷鳴平原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 94,
    "攻撃": 125,
    "防御": 56,
    "素早さ": 130,
    "特殊攻撃": 47,
    "特殊防御": 68
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 64,
    "攻撃": 36,
    "防御": 30,
    "素早さ": 42,
    "特殊攻撃": 34,
    "特殊防御": 31,
    "命中": 94,
    "回避": 27
   },
   "initialMoveCandidates": [
    "jinraiga",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "先制感知",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "043",
     "060"
    ],
    "resultId": "062",
    "display": "ライガーハウンド + サンダースピリット → 雷獣ライガ"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は雷。"
  },
  {
   "id": "063",
   "name": "天空鳥ガルーダ",
   "family": "鳥",
   "element": "風",
   "rank": "C",
   "obtain": "野生",
   "region": "風の祭壇",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 96,
    "攻撃": 111,
    "防御": 47,
    "素早さ": 140,
    "特殊攻撃": 57,
    "特殊防御": 69
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 64,
    "攻撃": 36,
    "防御": 30,
    "素早さ": 42,
    "特殊攻撃": 34,
    "特殊防御": 31,
    "命中": 94,
    "回避": 27
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "044",
     "058"
    ],
    "resultId": "063",
    "display": "ストームホーク + ウィンドスピリット → 天空鳥ガルーダ"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は風。"
  },
  {
   "id": "064",
   "name": "炎翼鳥イグニス",
   "family": "鳥",
   "element": "炎",
   "rank": "C",
   "obtain": "野生",
   "region": "大地の祠",
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "攻撃",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 85,
    "攻撃": 156,
    "防御": 35,
    "素早さ": 115,
    "特殊攻撃": 71,
    "特殊防御": 58
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 66,
    "攻撃": 41,
    "防御": 31,
    "素早さ": 34,
    "特殊攻撃": 35,
    "特殊防御": 31,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "破壊衝動",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "045",
     "040"
    ],
    "resultId": "064",
    "display": "ブレイズホーク + フェニクス → 炎翼鳥イグニス"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "065",
   "name": "世界樹の妖精",
   "family": "精霊",
   "element": "光",
   "rank": "C",
   "obtain": "野生",
   "region": "花冠の庭",
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 126,
    "攻撃": 47,
    "防御": 89,
    "素早さ": 56,
    "特殊攻撃": 77,
    "特殊防御": 125
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 68,
    "攻撃": 33,
    "防御": 33,
    "素早さ": 34,
    "特殊攻撃": 39,
    "特殊防御": 37,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "精霊の加護",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "047",
     "048"
    ],
    "resultId": "065",
    "display": "ドライアド + フローラルフェアリー → 世界樹の妖精"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は光。"
  },
  {
   "id": "066",
   "name": "雷樹獣",
   "family": "魔獣",
   "element": "雷",
   "rank": "C",
   "obtain": "野生",
   "region": "雷の祭壇",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 103,
    "攻撃": 53,
    "防御": 69,
    "素早さ": 88,
    "特殊攻撃": 140,
    "特殊防御": 67
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 64,
    "攻撃": 34,
    "防御": 30,
    "素早さ": 35,
    "特殊攻撃": 43,
    "特殊防御": 37,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "電撃",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "魔力増幅",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "049",
     "062"
    ],
    "resultId": "066",
    "display": "サンダーリーフ + 雷獣ライガ → 雷樹獣"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は雷。"
  },
  {
   "id": "067",
   "name": "深淵鮫",
   "family": "水棲",
   "element": "闇",
   "element2": "水",
   "rank": "C",
   "obtain": "野生",
   "region": "深水洞",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 140,
    "防御": 73,
    "素早さ": 73,
    "特殊攻撃": 52,
    "特殊防御": 73
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 66,
    "攻撃": 41,
    "防御": 31,
    "素早さ": 34,
    "特殊攻撃": 35,
    "特殊防御": 31,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "水刃",
    "気合いため",
    "奈落斬"
   ],
   "innateTrait": "狩人の本能",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "050",
     "051"
    ],
    "resultId": "067",
    "display": "アビスフィッシュ + サンダーシャーク → 深淵鮫"
   },
   "description": "水場で力を発揮し、耐久力に優れる。 属性は闇。"
  },
  {
   "id": "068",
   "name": "大地亀王",
   "family": "水棲",
   "element": "地",
   "rank": "C",
   "obtain": "野生",
   "region": "岩礁海岸",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 134,
    "攻撃": 66,
    "防御": 135,
    "素早さ": 35,
    "特殊攻撃": 56,
    "特殊防御": 94
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 74,
    "攻撃": 34,
    "防御": 38,
    "素早さ": 31,
    "特殊攻撃": 34,
    "特殊防御": 35,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "岩つぶて",
    "硬化",
    "大地震"
   ],
   "innateTrait": "大地の根",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "052",
     "059"
    ],
    "resultId": "068",
    "display": "ロックタートル + アーススピリット → 大地亀王"
   },
   "description": "水場で力を発揮し、耐久力に優れる。 属性は地。"
  },
  {
   "id": "069",
   "name": "天空甲虫",
   "family": "虫",
   "element": "雷",
   "element2": "風",
   "rank": "C",
   "obtain": "野生",
   "region": "風切り高原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "防御",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 95,
    "攻撃": 114,
    "防御": 68,
    "素早さ": 129,
    "特殊攻撃": 57,
    "特殊防御": 57
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 64,
    "攻撃": 36,
    "防御": 30,
    "素早さ": 42,
    "特殊攻撃": 34,
    "特殊防御": 31,
    "命中": 94,
    "回避": 27
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "追撃本能",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "053",
     "060"
    ],
    "resultId": "069",
    "display": "スカイビートル + サンダースピリット → 天空甲虫"
   },
   "description": "小柄ながら特化した能力を持つ。 属性は雷。"
  },
  {
   "id": "070",
   "name": "炎獄蜂",
   "family": "虫",
   "element": "炎",
   "element2": "闇",
   "rank": "C",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 141,
    "防御": 73,
    "素早さ": 83,
    "特殊攻撃": 52,
    "特殊防御": 62
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 66,
    "攻撃": 41,
    "防御": 31,
    "素早さ": 34,
    "特殊攻撃": 35,
    "特殊防御": 31,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "影縫い",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "急所狙い",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "054",
     "055"
    ],
    "resultId": "070",
    "display": "インフェルノビー + ダークホーネット → 炎獄蜂"
   },
   "description": "小柄ながら特化した能力を持つ。 属性は炎。"
  },
  {
   "id": "071",
   "name": "魔獣王ケルベロス",
   "family": "魔獣",
   "element": "闇",
   "rank": "B",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 165,
    "攻撃": 158,
    "防御": 117,
    "素早さ": 43,
    "特殊攻撃": 55,
    "特殊防御": 72
   },
   "evYield": {
    "攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 88,
    "攻撃": 54,
    "防御": 43,
    "素早さ": 47,
    "特殊攻撃": 48,
    "特殊防御": 43,
    "命中": 95,
    "回避": 27
   },
   "initialMoveCandidates": [
    "影縫い",
    "気合いため",
    "奈落斬"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "056",
     "061"
    ],
    "resultId": "071",
    "display": "デビルキャット + フェンリル → 魔獣王ケルベロス"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "072",
   "name": "光狼セレス",
   "family": "魔獣",
   "element": "光",
   "rank": "B",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 160,
    "攻撃": 67,
    "防御": 105,
    "素早さ": 67,
    "特殊攻撃": 90,
    "特殊防御": 121
   },
   "evYield": {
    "攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 90,
    "攻撃": 46,
    "防御": 45,
    "素早さ": 47,
    "特殊攻撃": 52,
    "特殊防御": 49,
    "命中": 95,
    "回避": 27
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "慈愛の光",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "057",
     "065"
    ],
    "resultId": "072",
    "display": "ライトウルフ + 世界樹の妖精 → 光狼セレス"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は光。"
  },
  {
   "id": "073",
   "name": "風神スピリオン",
   "family": "精霊",
   "element": "風",
   "rank": "B",
   "obtain": "配合限定",
   "region": null,
   "role": "速度",
   "archetype": "高速サポート",
   "signature": "素早さ",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 110,
    "攻撃": 69,
    "防御": 80,
    "素早さ": 153,
    "特殊攻撃": 90,
    "特殊防御": 108
   },
   "evYield": {
    "素早さ": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 86,
    "攻撃": 49,
    "防御": 42,
    "素早さ": 55,
    "特殊攻撃": 47,
    "特殊防御": 43,
    "命中": 95,
    "回避": 32
   },
   "initialMoveCandidates": [
    "fujin",
    "小回復",
    "旋風刃"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "058",
     "063"
    ],
    "resultId": "073",
    "display": "ウィンドスピリット + 天空鳥ガルーダ → 風神スピリオン"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は風。"
  },
  {
   "id": "074",
   "name": "大地神ガイア",
   "family": "精霊",
   "element": "地",
   "rank": "B",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 147,
    "攻撃": 62,
    "防御": 104,
    "素早さ": 58,
    "特殊攻撃": 85,
    "特殊防御": 154
   },
   "evYield": {
    "防御": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 96,
    "攻撃": 47,
    "防御": 50,
    "素早さ": 44,
    "特殊攻撃": 47,
    "特殊防御": 47,
    "命中": 95,
    "回避": 27
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "059",
     "068"
    ],
    "resultId": "074",
    "display": "アーススピリット + 大地亀王 → 大地神ガイア"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は地。"
  },
  {
   "id": "075",
   "name": "雷神ヴォルト",
   "family": "精霊",
   "element": "雷",
   "rank": "B",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 62,
    "防御": 79,
    "素早さ": 104,
    "特殊攻撃": 165,
    "特殊防御": 91
   },
   "evYield": {
    "特殊攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 86,
    "攻撃": 47,
    "防御": 42,
    "素早さ": 48,
    "特殊攻撃": 56,
    "特殊防御": 49,
    "命中": 95,
    "回避": 27
   },
   "initialMoveCandidates": [
    "電撃",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "弱点看破",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "060",
     "062"
    ],
    "resultId": "075",
    "display": "サンダースピリット + 雷獣ライガ → 雷神ヴォルト"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は雷。"
  },
  {
   "id": "076",
   "name": "炎帝フェニクス",
   "family": "鳥",
   "element": "炎",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "攻撃",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 112,
    "攻撃": 210,
    "防御": 49,
    "素早さ": 155,
    "特殊攻撃": 98,
    "特殊防御": 76
   },
   "evYield": {
    "攻撃": 2,
    "素早さ": 1
   },
   "baseStats": {
    "HP": 115,
    "攻撃": 70,
    "防御": 57,
    "素早さ": 62,
    "特殊攻撃": 64,
    "特殊防御": 59,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "040",
     "064"
    ],
    "resultId": "076",
    "display": "フェニクス + 炎翼鳥イグニス → 炎帝フェニクス"
   },
   "description": "空中戦と素早い行動を得意とする。 属性は炎。"
  },
  {
   "id": "077",
   "name": "深海龍リヴァル",
   "family": "竜",
   "element": "水",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 182,
    "攻撃": 69,
    "防御": 104,
    "素早さ": 58,
    "特殊攻撃": 98,
    "特殊防御": 189
   },
   "evYield": {
    "特殊防御": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 123,
    "攻撃": 63,
    "防御": 64,
    "素早さ": 59,
    "特殊攻撃": 63,
    "特殊防御": 63,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "067",
     "068"
    ],
    "resultId": "077",
    "display": "深淵鮫 + 大地亀王 → 深海龍リヴァル"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は水。"
  },
  {
   "id": "078",
   "name": "森羅獣ユグドラ",
   "family": "精霊",
   "element": "地",
   "element2": "光",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 168,
    "攻撃": 62,
    "防御": 133,
    "素早さ": 77,
    "特殊攻撃": 107,
    "特殊防御": 153
   },
   "evYield": {
    "防御": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 117,
    "攻撃": 62,
    "防御": 59,
    "素早さ": 62,
    "特殊攻撃": 68,
    "特殊防御": 65,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "地脈波"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "065",
     "074"
    ],
    "resultId": "078",
    "display": "世界樹の妖精 + 大地神ガイア → 森羅獣ユグドラ"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は地。"
  },
  {
   "id": "079",
   "name": "雷帝獣ゼノライガ",
   "family": "獣",
   "element": "雷",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 126,
    "攻撃": 168,
    "防御": 77,
    "素早さ": 175,
    "特殊攻撃": 63,
    "特殊防御": 91
   },
   "evYield": {
    "攻撃": 2,
    "素早さ": 1
   },
   "baseStats": {
    "HP": 113,
    "攻撃": 65,
    "防御": 56,
    "素早さ": 70,
    "特殊攻撃": 63,
    "特殊防御": 59,
    "命中": 96,
    "回避": 37
   },
   "initialMoveCandidates": [
    "jinraiga",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "追撃本能",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "066",
     "075"
    ],
    "resultId": "079",
    "display": "雷樹獣 + 雷神ヴォルト → 雷帝獣ゼノライガ"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は雷。"
  },
  {
   "id": "080",
   "name": "暗黒魔獣バルガス",
   "family": "魔獣",
   "element": "闇",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 190,
    "攻撃": 182,
    "防御": 133,
    "素早さ": 48,
    "特殊攻撃": 63,
    "特殊防御": 84
   },
   "evYield": {
    "攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 115,
    "攻撃": 70,
    "防御": 57,
    "素早さ": 62,
    "特殊攻撃": 64,
    "特殊防御": 59,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "影縫い",
    "気合いため",
    "奈落斬"
   ],
   "innateTrait": "急所狙い",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "071",
     "067"
    ],
    "resultId": "080",
    "display": "魔獣王ケルベロス + 深淵鮫 → 暗黒魔獣バルガス"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "081",
   "name": "聖獣セラフィム",
   "family": "獣",
   "element": "光",
   "element2": "風",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 182,
    "攻撃": 63,
    "防御": 119,
    "素早さ": 76,
    "特殊攻撃": 92,
    "特殊防御": 168
   },
   "evYield": {
    "特殊防御": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 117,
    "攻撃": 62,
    "防御": 59,
    "素早さ": 62,
    "特殊攻撃": 68,
    "特殊防御": 65,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "fujin",
    "小回復",
    "極光"
   ],
   "innateTrait": "癒しの波動",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "072",
     "073"
    ],
    "resultId": "081",
    "display": "光狼セレス + 風神スピリオン → 聖獣セラフィム"
   },
   "description": "鋭い感覚と身体能力を持つ。 属性は光。"
  },
  {
   "id": "082",
   "name": "天空竜アストラ",
   "family": "竜",
   "element": "風",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 125,
    "攻撃": 154,
    "防御": 62,
    "素早さ": 189,
    "特殊攻撃": 78,
    "特殊防御": 92
   },
   "evYield": {
    "素早さ": 2,
    "攻撃": 1
   },
   "baseStats": {
    "HP": 113,
    "攻撃": 65,
    "防御": 56,
    "素早さ": 70,
    "特殊攻撃": 63,
    "特殊防御": 59,
    "命中": 96,
    "回避": 37
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "先制感知",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "063",
     "073"
    ],
    "resultId": "082",
    "display": "天空鳥ガルーダ + 風神スピリオン → 天空竜アストラ"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は風。"
  },
  {
   "id": "083",
   "name": "地帝巨獣グラン",
   "family": "魔獣",
   "element": "地",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 183,
    "攻撃": 83,
    "防御": 182,
    "素早さ": 63,
    "特殊攻撃": 78,
    "特殊防御": 111
   },
   "evYield": {
    "防御": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 123,
    "攻撃": 63,
    "防御": 64,
    "素早さ": 59,
    "特殊攻撃": 63,
    "特殊防御": 63,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "岩つぶて",
    "硬化",
    "大地震"
   ],
   "innateTrait": "大地の根",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "074",
     "071"
    ],
    "resultId": "083",
    "display": "大地神ガイア + 魔獣王ケルベロス → 地帝巨獣グラン"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は地。"
  },
  {
   "id": "084",
   "name": "雷光竜ゼノス",
   "family": "竜",
   "element": "雷",
   "element2": "光",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 139,
    "攻撃": 70,
    "防御": 92,
    "素早さ": 105,
    "特殊攻撃": 189,
    "特殊防御": 105
   },
   "evYield": {
    "特殊攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 113,
    "攻撃": 63,
    "防御": 56,
    "素早さ": 63,
    "特殊攻撃": 72,
    "特殊防御": 65,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "光弾",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "魔力吸収",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "075",
     "081"
    ],
    "resultId": "084",
    "display": "雷神ヴォルト + 聖獣セラフィム → 雷光竜ゼノス"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は雷。"
  },
  {
   "id": "085",
   "name": "黒翼竜ノクス",
   "family": "竜",
   "element": "闇",
   "element2": "風",
   "rank": "A",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 142,
    "攻撃": 70,
    "防御": 90,
    "素早さ": 104,
    "特殊攻撃": 189,
    "特殊防御": 105
   },
   "evYield": {
    "特殊攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 113,
    "攻撃": 63,
    "防御": 56,
    "素早さ": 63,
    "特殊攻撃": 72,
    "特殊防御": 65,
    "命中": 96,
    "回避": 32
   },
   "initialMoveCandidates": [
    "fujin",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "弱点看破",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "080",
     "082"
    ],
    "resultId": "085",
    "display": "暗黒魔獣バルガス + 天空竜アストラ → 黒翼竜ノクス"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は闇。"
  },
  {
   "id": "086",
   "name": "炎天竜イグナード",
   "family": "竜",
   "element": "炎",
   "element2": "風",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 212,
    "攻撃": 203,
    "防御": 149,
    "素早さ": 38,
    "特殊攻撃": 69,
    "特殊防御": 109
   },
   "evYield": {
    "攻撃": 3
   },
   "baseStats": {
    "HP": 145,
    "攻撃": 87,
    "防御": 74,
    "素早さ": 78,
    "特殊攻撃": 82,
    "特殊防御": 75,
    "命中": 97,
    "回避": 37
   },
   "initialMoveCandidates": [
    "風切り",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "076",
     "084"
    ],
    "resultId": "086",
    "display": "炎帝フェニクス + 雷光竜ゼノス → 炎天竜イグナード"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は炎。"
  },
  {
   "id": "087",
   "name": "海皇龍ネプティア",
   "family": "竜",
   "element": "水",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 203,
    "攻撃": 77,
    "防御": 116,
    "素早さ": 62,
    "特殊攻撃": 111,
    "特殊防御": 211
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 153,
    "攻撃": 80,
    "防御": 81,
    "素早さ": 75,
    "特殊攻撃": 81,
    "特殊防御": 79,
    "命中": 97,
    "回避": 37
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "077",
     "081"
    ],
    "resultId": "087",
    "display": "深海龍リヴァル + 聖獣セラフィム → 海皇龍ネプティア"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は水。"
  },
  {
   "id": "088",
   "name": "世界樹竜ユグドラシル",
   "family": "竜",
   "element": "光",
   "element2": "地",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 202,
    "攻撃": 71,
    "防御": 133,
    "素早さ": 70,
    "特殊攻撃": 117,
    "特殊防御": 187
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 147,
    "攻撃": 79,
    "防御": 76,
    "素早さ": 78,
    "特殊攻撃": 86,
    "特殊防御": 81,
    "命中": 97,
    "回避": 37
   },
   "initialMoveCandidates": [
    "砂塵",
    "小回復",
    "極光"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "078",
     "082"
    ],
    "resultId": "088",
    "display": "森羅獣ユグドラ + 天空竜アストラ → 世界樹竜ユグドラシル"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は光。"
  },
  {
   "id": "089",
   "name": "雷獄竜ヴァルゼオン",
   "family": "竜",
   "element": "雷",
   "element2": "闇",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 137,
    "攻撃": 173,
    "防御": 71,
    "素早さ": 211,
    "特殊攻撃": 87,
    "特殊防御": 101
   },
   "evYield": {
    "素早さ": 3
   },
   "baseStats": {
    "HP": 143,
    "攻撃": 82,
    "防御": 73,
    "素早さ": 86,
    "特殊攻撃": 81,
    "特殊防御": 75,
    "命中": 97,
    "回避": 42
   },
   "initialMoveCandidates": [
    "影縫い",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "追撃本能",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "079",
     "085"
    ],
    "resultId": "089",
    "display": "雷帝獣ゼノライガ + 黒翼竜ノクス → 雷獄竜ヴァルゼオン"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は雷。"
  },
  {
   "id": "090",
   "name": "終魔獣アビス",
   "family": "魔獣",
   "element": "闇",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 156,
    "攻撃": 79,
    "防御": 101,
    "素早さ": 132,
    "特殊攻撃": 211,
    "特殊防御": 101
   },
   "evYield": {
    "特殊攻撃": 3
   },
   "baseStats": {
    "HP": 143,
    "攻撃": 80,
    "防御": 73,
    "素早さ": 79,
    "特殊攻撃": 90,
    "特殊防御": 81,
    "命中": 97,
    "回避": 37
   },
   "initialMoveCandidates": [
    "noroigoe",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "弱点看破",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "080",
     "083"
    ],
    "resultId": "090",
    "display": "暗黒魔獣バルガス + 地帝巨獣グラン → 終魔獣アビス"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "091",
   "name": "炎神竜アグニア",
   "family": "竜",
   "element": "炎",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 230,
    "攻撃": 221,
    "防御": 162,
    "素早さ": 42,
    "特殊攻撃": 76,
    "特殊防御": 119
   },
   "evYield": {
    "攻撃": 3
   },
   "baseStats": {
    "HP": 175,
    "攻撃": 105,
    "防御": 91,
    "素早さ": 94,
    "特殊攻撃": 100,
    "特殊防御": 93,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "086",
     "088"
    ],
    "resultId": "091",
    "display": "炎天竜イグナード + 世界樹竜ユグドラシル → 炎神竜アグニア"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は炎。"
  },
  {
   "id": "092",
   "name": "海神竜ポセイディア",
   "family": "竜",
   "element": "水",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 221,
    "攻撃": 85,
    "防御": 129,
    "素早さ": 67,
    "特殊攻撃": 119,
    "特殊防御": 229
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 183,
    "攻撃": 98,
    "防御": 98,
    "素早さ": 91,
    "特殊攻撃": 99,
    "特殊防御": 97,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "087",
     "088"
    ],
    "resultId": "092",
    "display": "海皇龍ネプティア + 世界樹竜ユグドラシル → 海神竜ポセイディア"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は水。"
  },
  {
   "id": "093",
   "name": "雷神竜ゼウレウス",
   "family": "竜",
   "element": "雷",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 170,
    "攻撃": 84,
    "防御": 111,
    "素早さ": 129,
    "特殊攻撃": 229,
    "特殊防御": 127
   },
   "evYield": {
    "特殊攻撃": 3
   },
   "baseStats": {
    "HP": 173,
    "攻撃": 98,
    "防御": 90,
    "素早さ": 95,
    "特殊攻撃": 108,
    "特殊防御": 99,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "電撃",
    "raigeki",
    "雷鳴落とし"
   ],
   "innateTrait": "呪術の才",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "086",
     "089"
    ],
    "resultId": "093",
    "display": "炎天竜イグナード + 雷獄竜ヴァルゼオン → 雷神竜ゼウレウス"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は雷。"
  },
  {
   "id": "094",
   "name": "闇神竜ネメシス",
   "family": "竜",
   "element": "闇",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 170,
    "攻撃": 84,
    "防御": 111,
    "素早さ": 146,
    "特殊攻撃": 229,
    "特殊防御": 110
   },
   "evYield": {
    "特殊攻撃": 3
   },
   "baseStats": {
    "HP": 173,
    "攻撃": 98,
    "防御": 90,
    "素早さ": 95,
    "特殊攻撃": 108,
    "特殊防御": 99,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "noroigoe",
    "呪い霧",
    "暗黒波"
   ],
   "innateTrait": "魔力吸収",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "089",
     "090"
    ],
    "resultId": "094",
    "display": "雷獄竜ヴァルゼオン + 終魔獣アビス → 闇神竜ネメシス"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は闇。"
  },
  {
   "id": "095",
   "name": "天界獣セレスティア",
   "family": "精霊",
   "element": "光",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 205,
    "攻撃": 77,
    "防御": 144,
    "素早さ": 95,
    "特殊攻撃": 125,
    "特殊防御": 204
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 177,
    "攻撃": 97,
    "防御": 93,
    "素早さ": 94,
    "特殊攻撃": 104,
    "特殊防御": 99,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "精霊の加護",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "081",
     "091"
    ],
    "resultId": "095",
    "display": "聖獣セラフィム + 炎神竜アグニア → 天界獣セレスティア"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は光。"
  },
  {
   "id": "096",
   "name": "深淵王アビスロード",
   "family": "魔獣",
   "element": "闇",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 230,
    "攻撃": 221,
    "防御": 162,
    "素早さ": 60,
    "特殊攻撃": 75,
    "特殊防御": 102
   },
   "evYield": {
    "攻撃": 3
   },
   "baseStats": {
    "HP": 183,
    "攻撃": 98,
    "防御": 98,
    "素早さ": 91,
    "特殊攻撃": 99,
    "特殊防御": 97,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "影縫い",
    "気合いため",
    "奈落斬"
   ],
   "innateTrait": "甲殻装甲",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "090",
     "094"
    ],
    "resultId": "096",
    "display": "終魔獣アビス + 闇神竜ネメシス → 深淵王アビスロード"
   },
   "description": "攻撃や状態異常に長けた異形の生物。 属性は闇。"
  },
  {
   "id": "097",
   "name": "天空神龍オルフェウス",
   "family": "竜",
   "element": "光",
   "element2": "風",
   "rank": "SSS",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 182,
    "攻撃": 90,
    "防御": 118,
    "素早さ": 137,
    "特殊攻撃": 228,
    "特殊防御": 155
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 203,
    "攻撃": 116,
    "防御": 106,
    "素早さ": 113,
    "特殊攻撃": 126,
    "特殊防御": 115,
    "命中": 99,
    "回避": 47
   },
   "initialMoveCandidates": [
    "fujin",
    "seinaruya",
    "極光"
   ],
   "innateTrait": "属性共鳴",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "092",
     "093"
    ],
    "resultId": "097",
    "display": "海神竜ポセイディア + 雷神竜ゼウレウス → 天空神龍オルフェウス"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は光。"
  },
  {
   "id": "098",
   "name": "混沌竜カオス",
   "family": "竜",
   "element": "闇",
   "element2": "光",
   "rank": "SSS",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 247,
    "攻撃": 237,
    "防御": 173,
    "素早さ": 44,
    "特殊攻撃": 83,
    "特殊防御": 126
   },
   "evYield": {
    "攻撃": 3
   },
   "baseStats": {
    "HP": 205,
    "攻撃": 123,
    "防御": 107,
    "素早さ": 112,
    "特殊攻撃": 118,
    "特殊防御": 109,
    "命中": 99,
    "回避": 47
   },
   "initialMoveCandidates": [
    "光刃",
    "気合いため",
    "奈落斬"
   ],
   "innateTrait": "連撃の才",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "094",
     "097"
    ],
    "resultId": "098",
    "display": "闇神竜ネメシス + 天空神龍オルフェウス → 混沌竜カオス"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は闇。"
  },
  {
   "id": "099",
   "name": "神獣エターナル",
   "family": "精霊",
   "element": "光",
   "rank": "SSS",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 218,
    "攻撃": 82,
    "防御": 155,
    "素早さ": 100,
    "特殊攻撃": 137,
    "特殊防御": 218
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 207,
    "攻撃": 115,
    "防御": 109,
    "素早さ": 112,
    "特殊攻撃": 122,
    "特殊防御": 115,
    "命中": 99,
    "回避": 47
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "状態異常耐性",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "095",
     "096"
    ],
    "resultId": "099",
    "display": "天界獣セレスティア + 深淵王アビスロード → 神獣エターナル"
   },
   "description": "属性の力を操り、支援や特殊技を得意とする。 属性は光。"
  },
  {
   "id": "100",
   "name": "創世竜アーク",
   "family": "竜",
   "element": "無",
   "rank": "EX",
   "obtain": "配合限定",
   "region": null,
   "role": "万能",
   "archetype": "万能",
   "signature": "HP",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 225,
    "攻撃": 158,
    "防御": 156,
    "素早さ": 136,
    "特殊攻撃": 147,
    "特殊防御": 158
   },
   "evYield": {
    "HP": 3
   },
   "baseStats": {
    "HP": 240,
    "攻撃": 130,
    "防御": 125,
    "素早さ": 120,
    "特殊攻撃": 130,
    "特殊防御": 125,
    "命中": 99,
    "回避": 50
   },
   "initialMoveCandidates": [
    "星砕き",
    "全能の波動",
    "創世の息吹"
   ],
   "innateTrait": "無限の可能性",
   "growthType": "万能",
   "recipe": {
    "parentIds": [
     "098",
     "099"
    ],
    "resultId": "100",
    "display": "混沌竜カオス + 神獣エターナル → 創世竜アーク"
   },
   "description": "高い基礎能力と強力な属性技を持つ。 属性は無。"
  },
  {
   "id": "101",
   "name": "カエンコロ",
   "family": "獣",
   "element": "炎",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "下位",
   "speciesStats": {
    "HP": 67,
    "攻撃": 86,
    "防御": 46,
    "素早さ": 51,
    "特殊攻撃": 25,
    "特殊防御": 43
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 27,
    "攻撃": 39,
    "防御": 13,
    "素早さ": 17,
    "特殊攻撃": 5,
    "特殊防御": 13,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": null,
   "description": "ヒノコロが成長した姿。しっぽの炎が大きくなり、走るたびに火の粉を散らす。"
  },
  {
   "id": "102",
   "name": "ナミリス",
   "family": "獣",
   "element": "水",
   "rank": "E",
   "obtain": "野生",
   "region": "清流の岸辺",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "特殊攻撃",
   "tier": "下位",
   "speciesStats": {
    "HP": 83,
    "攻撃": 32,
    "防御": 47,
    "素早さ": 32,
    "特殊攻撃": 38,
    "特殊防御": 86
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 36,
    "攻撃": 5,
    "防御": 15,
    "素早さ": 5,
    "特殊攻撃": 9,
    "特殊防御": 39,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "水鏡の守り",
   "growthType": "耐久",
   "recipe": null,
   "description": "ミズリスが成長した姿。体をおおう水の膜が厚くなり、攻撃を受け流す。"
  },
  {
   "id": "103",
   "name": "ライキバ",
   "family": "獣",
   "element": "雷",
   "rank": "E",
   "obtain": "野生",
   "region": "雷鳴平原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "下位",
   "speciesStats": {
    "HP": 58,
    "攻撃": 76,
    "防御": 34,
    "素早さ": 80,
    "特殊攻撃": 29,
    "特殊防御": 41
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 21,
    "攻撃": 33,
    "防御": 7,
    "素早さ": 35,
    "特殊攻撃": 5,
    "特殊防御": 11,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "jinraiga",
    "idaten",
    "轟雷爪"
   ],
   "innateTrait": "雷走り",
   "growthType": "速度",
   "recipe": null,
   "description": "ライポンが成長した姿。電気をためた牙で、すれちがいざまにかみつく。"
  },
  {
   "id": "104",
   "name": "カゼハネ",
   "family": "鳥",
   "element": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "風切り高原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "下位",
   "speciesStats": {
    "HP": 57,
    "攻撃": 71,
    "防御": 29,
    "素早さ": 86,
    "特殊攻撃": 34,
    "特殊防御": 41
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 21,
    "攻撃": 29,
    "防御": 5,
    "素早さ": 39,
    "特殊攻撃": 7,
    "特殊防御": 11,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "疾風脚",
   "growthType": "速度",
   "recipe": null,
   "description": "ハネピヨが成長した姿。風をつかんで、ひと息に高く舞いあがる。"
  },
  {
   "id": "105",
   "name": "ヒエンツバメ",
   "family": "鳥",
   "element": "炎",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "一点特化",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "下位",
   "speciesStats": {
    "HP": 51,
    "攻撃": 89,
    "防御": 22,
    "素早さ": 76,
    "特殊攻撃": 45,
    "特殊防御": 35
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 17,
    "攻撃": 41,
    "防御": 5,
    "素早さ": 33,
    "特殊攻撃": 13,
    "特殊防御": 7,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "狩人の本能",
   "growthType": "攻撃",
   "recipe": null,
   "description": "アカツバメが成長した姿。炎の軌跡を残しながら、稲妻のように飛ぶ。"
  },
  {
   "id": "106",
   "name": "ナミカモ",
   "family": "鳥",
   "element": "水",
   "rank": "E",
   "obtain": "野生",
   "region": "湖畔の森",
   "role": "支援",
   "archetype": "高速サポート",
   "signature": "特殊防御",
   "weakness": "防御",
   "tier": "下位",
   "speciesStats": {
    "HP": 64,
    "攻撃": 35,
    "防御": 35,
    "素早さ": 72,
    "特殊攻撃": 49,
    "特殊防御": 63
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 25,
    "攻撃": 7,
    "防御": 7,
    "素早さ": 31,
    "特殊攻撃": 15,
    "特殊防御": 24,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": null,
   "description": "ミズカモが成長した姿。水面をすべるように泳ぎ、仲間の傷を癒す。"
  },
  {
   "id": "107",
   "name": "イワネバナ",
   "family": "植物",
   "element": "地",
   "rank": "E",
   "obtain": "野生",
   "region": "若葉の森",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "下位",
   "speciesStats": {
    "HP": 82,
    "攻撃": 33,
    "防御": 54,
    "素早さ": 24,
    "特殊攻撃": 46,
    "特殊防御": 79
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 37,
    "攻撃": 5,
    "防御": 19,
    "素早さ": 5,
    "特殊攻撃": 13,
    "特殊防御": 34,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "大地の根",
   "growthType": "耐久",
   "recipe": null,
   "description": "コモリバナが成長した姿。岩のすきまに根を張り、どんな嵐にも倒れない。"
  },
  {
   "id": "108",
   "name": "コケガメ",
   "family": "水棲",
   "element": "地",
   "element2": "水",
   "rank": "E",
   "obtain": "野生",
   "region": "夕闇の洞穴",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "下位",
   "speciesStats": {
    "HP": 81,
    "攻撃": 37,
    "防御": 83,
    "素早さ": 23,
    "特殊攻撃": 37,
    "特殊防御": 57
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 37,
    "攻撃": 9,
    "防御": 37,
    "素早さ": 5,
    "特殊攻撃": 7,
    "特殊防御": 21,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "甲殻装甲",
   "growthType": "耐久",
   "recipe": null,
   "description": "イワガメが成長した姿。甲羅に苔が生え、洞窟の湿り気を好む。"
  },
  {
   "id": "109",
   "name": "カゼカブト",
   "family": "虫",
   "element": "風",
   "rank": "E",
   "obtain": "野生",
   "region": "風切り高原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊防御",
   "tier": "下位",
   "speciesStats": {
    "HP": 57,
    "攻撃": 70,
    "防御": 35,
    "素早さ": 86,
    "特殊攻撃": 35,
    "特殊防御": 35
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 21,
    "攻撃": 29,
    "防御": 7,
    "素早さ": 39,
    "特殊攻撃": 7,
    "特殊防御": 7,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "追撃本能",
   "growthType": "速度",
   "recipe": null,
   "description": "ハネムシが成長した姿。硬い角と羽で、風に乗って突進する。"
  },
  {
   "id": "110",
   "name": "ヒノコバチ",
   "family": "虫",
   "element": "炎",
   "rank": "E",
   "obtain": "野生",
   "region": "火山の麓",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "下位",
   "speciesStats": {
    "HP": 66,
    "攻撃": 86,
    "防御": 44,
    "素早さ": 51,
    "特殊攻撃": 32,
    "特殊防御": 39
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 27,
    "攻撃": 39,
    "防御": 13,
    "素早さ": 17,
    "特殊攻撃": 5,
    "特殊防御": 9,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "急所狙い",
   "growthType": "攻撃",
   "recipe": null,
   "description": "ヒノムシが成長した姿。熱をおびた針をもち、群れで巣を守る。"
  },
  {
   "id": "111",
   "name": "ビリザメ",
   "family": "水棲",
   "element": "雷",
   "element2": "水",
   "rank": "E",
   "obtain": "野生",
   "region": "雷鳴の海",
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "素早さ",
   "tier": "下位",
   "speciesStats": {
    "HP": 65,
    "攻撃": 86,
    "防御": 46,
    "素早さ": 45,
    "特殊攻撃": 32,
    "特殊防御": 44
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 27,
    "攻撃": 39,
    "防御": 13,
    "素早さ": 13,
    "特殊攻撃": 5,
    "特殊防御": 13,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "水刃",
    "気合いため",
    "轟雷爪"
   ],
   "innateTrait": "雷走り",
   "growthType": "攻撃",
   "recipe": null,
   "description": "ビリクラゲが姿を変えた、小さなサメ。電気をまとった体当たりが得意。"
  },
  {
   "id": "112",
   "name": "ツチダマ",
   "family": "精霊",
   "element": "地",
   "rank": "E",
   "obtain": "野生",
   "region": "砂礫の丘",
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "防御",
   "weakness": "HP",
   "tier": "下位",
   "speciesStats": {
    "HP": 76,
    "攻撃": 32,
    "防御": 54,
    "素早さ": 32,
    "特殊攻撃": 46,
    "特殊防御": 78
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 33,
    "攻撃": 5,
    "防御": 19,
    "素早さ": 5,
    "特殊攻撃": 13,
    "特殊防御": 34,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "砂塵",
    "硬化",
    "地脈波"
   ],
   "innateTrait": "再生皮膚",
   "growthType": "耐久",
   "recipe": null,
   "description": "スナタマが成長した姿。砂を固めた殻をまとい、少しずつ体を直す。"
  },
  {
   "id": "113",
   "name": "ハヤテネコ",
   "family": "獣",
   "element": "風",
   "rank": "E",
   "obtain": "進化",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 60,
    "攻撃": 74,
    "防御": 37,
    "素早さ": 90,
    "特殊攻撃": 31,
    "特殊防御": 43
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 23,
    "攻撃": 31,
    "防御": 8,
    "素早さ": 41,
    "特殊攻撃": 5,
    "特殊防御": 13,
    "命中": 92,
    "回避": 17
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "素早さを鍛えたカゼネコの進化形。目にもとまらぬ速さで駆けぬける。",
   "look": {
    "c1": "#9ae8c8",
    "c3": "#f0f8ff",
    "tail": "thin",
    "scale": 0.8
   }
  },
  {
   "id": "114",
   "name": "ツムジネコ",
   "family": "獣",
   "element": "風",
   "rank": "E",
   "obtain": "進化",
   "region": null,
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 71,
    "攻撃": 90,
    "防御": 47,
    "素早さ": 53,
    "特殊攻撃": 26,
    "特殊防御": 48
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 29,
    "攻撃": 41,
    "防御": 14,
    "素早さ": 19,
    "特殊攻撃": 5,
    "特殊防御": 14,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "風切り",
    "気合いため",
    "烈風脚"
   ],
   "innateTrait": "疾風脚",
   "growthType": "攻撃",
   "recipe": null,
   "description": "攻撃を鍛えたカゼネコの進化形。つむじ風をまとった爪でなぎはらう。",
   "look": {
    "c1": "#3a9a7a",
    "c3": "#e8f070",
    "mane": "#e8f070",
    "horn": "#f0f0f0",
    "scale": 0.86
   }
  },
  {
   "id": "115",
   "name": "ヨロイモグラ",
   "family": "獣",
   "element": "地",
   "rank": "E",
   "obtain": "進化",
   "region": null,
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 86,
    "攻撃": 41,
    "防御": 87,
    "素早さ": 31,
    "特殊攻撃": 29,
    "特殊防御": 61
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 39,
    "攻撃": 10,
    "防御": 39,
    "素早さ": 5,
    "特殊攻撃": 5,
    "特殊防御": 23,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "岩つぶて",
    "硬化",
    "大地震"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "耐久",
   "recipe": null,
   "description": "防御を鍛えたツチモグラの進化形。岩のようなうろこで全身を守る。",
   "look": {
    "c1": "#8a8a7a",
    "c3": "#5a5a4a",
    "ears": "none",
    "mane": "#6a6a5a",
    "tail": "flat",
    "scale": 0.88
   }
  },
  {
   "id": "116",
   "name": "ドリルモグラ",
   "family": "獣",
   "element": "地",
   "rank": "E",
   "obtain": "進化",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 89,
    "攻撃": 87,
    "防御": 65,
    "素早さ": 18,
    "特殊攻撃": 29,
    "特殊防御": 47
   },
   "evYield": {
    "攻撃": 1
   },
   "baseStats": {
    "HP": 41,
    "攻撃": 39,
    "防御": 25,
    "素早さ": 5,
    "特殊攻撃": 5,
    "特殊防御": 14,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "岩つぶて",
    "気合いため",
    "大地震"
   ],
   "innateTrait": "破壊衝動",
   "growthType": "攻撃",
   "recipe": null,
   "description": "攻撃を鍛えたツチモグラの進化形。回転する爪で岩盤をもうち砕く。",
   "look": {
    "c1": "#8a5a2a",
    "c3": "#d8d8e0",
    "ears": "none",
    "horn": "#d8d8e0",
    "tail": "thin",
    "scale": 0.86
   }
  },
  {
   "id": "117",
   "name": "ホシヨミソウ",
   "family": "植物",
   "element": "光",
   "rank": "E",
   "obtain": "進化",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 67,
    "攻撃": 34,
    "防御": 43,
    "素早さ": 50,
    "特殊攻撃": 90,
    "特殊防御": 51
   },
   "evYield": {
    "特殊攻撃": 1
   },
   "baseStats": {
    "HP": 27,
    "攻撃": 6,
    "防御": 13,
    "素早さ": 16,
    "特殊攻撃": 41,
    "特殊防御": 16,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "光弾",
    "seinaruya",
    "極光"
   ],
   "innateTrait": "魔力増幅",
   "growthType": "特殊",
   "recipe": null,
   "description": "特殊攻撃を鍛えたヒカリソウの進化形。星の光を集めて放つ。",
   "look": {
    "c1": "#a898f0",
    "deco": "flower",
    "accent": "#ffe070"
   }
  },
  {
   "id": "118",
   "name": "イノリソウ",
   "family": "植物",
   "element": "光",
   "rank": "E",
   "obtain": "進化",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 86,
    "攻撃": 30,
    "防御": 58,
    "素早さ": 30,
    "特殊攻撃": 50,
    "特殊防御": 81
   },
   "evYield": {
    "特殊防御": 1
   },
   "baseStats": {
    "HP": 39,
    "攻撃": 5,
    "防御": 21,
    "素早さ": 5,
    "特殊攻撃": 16,
    "特殊防御": 36,
    "命中": 92,
    "回避": 12
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "癒しの波動",
   "growthType": "支援",
   "recipe": null,
   "description": "特殊防御を鍛えたヒカリソウの進化形。祈るように花を閉じ、仲間を守る。",
   "look": {
    "c1": "#f0ecc0",
    "deco": "bud",
    "accent": "#ffb0d0"
   }
  },
  {
   "id": "119",
   "name": "煉獄狼ヴォルグ",
   "family": "獣",
   "element": "炎",
   "rank": "C",
   "obtain": "進化",
   "region": null,
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 108,
    "攻撃": 140,
    "防御": 72,
    "素早さ": 83,
    "特殊攻撃": 44,
    "特殊防御": 73
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 53,
    "攻撃": 73,
    "防御": 31,
    "素早さ": 37,
    "特殊攻撃": 11,
    "特殊防御": 31,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "homuraba",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "猛火の闘志",
   "growthType": "攻撃",
   "recipe": null,
   "description": "長く共に戦ったフレイムウルフが至る姿。燃えさかる鬣は、主の闘志に応えて輝く。"
  },
  {
   "id": "120",
   "name": "嵐翼鷹シュトルム",
   "family": "鳥",
   "element": "風",
   "rank": "C",
   "obtain": "進化",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 94,
    "攻撃": 114,
    "防御": 48,
    "素早さ": 140,
    "特殊攻撃": 57,
    "特殊防御": 67
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 44,
    "攻撃": 56,
    "防御": 14,
    "素早さ": 73,
    "特殊攻撃": 21,
    "特殊防御": 28,
    "命中": 94,
    "回避": 27
   },
   "initialMoveCandidates": [
    "風切り",
    "idaten",
    "烈風脚"
   ],
   "innateTrait": "先制感知",
   "growthType": "速度",
   "recipe": null,
   "description": "高原の風を受けて進化したストームホーク。羽ばたきひとつで嵐を呼ぶ。"
  },
  {
   "id": "121",
   "name": "森母樹シルヴァ",
   "family": "植物",
   "element": "地",
   "rank": "C",
   "obtain": "進化",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 134,
    "攻撃": 48,
    "防御": 99,
    "素早さ": 47,
    "特殊攻撃": 78,
    "特殊防御": 114
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 69,
    "攻撃": 14,
    "防御": 47,
    "素早さ": 14,
    "特殊攻撃": 34,
    "特殊防御": 56,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "砂塵",
    "小回復",
    "地脈波"
   ],
   "innateTrait": "慈愛の光",
   "growthType": "支援",
   "recipe": null,
   "description": "月の雫を受けたドライアドの姿。森の命を育む、大樹の精。"
  },
  {
   "id": "122",
   "name": "ユキウサ",
   "family": "獣",
   "element": "氷",
   "rank": "F",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 50,
    "攻撃": 58,
    "防御": 30,
    "素早さ": 74,
    "特殊攻撃": 26,
    "特殊防御": 37
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 16,
    "攻撃": 23,
    "防御": 5,
    "素早さ": 31,
    "特殊攻撃": 5,
    "特殊防御": 8,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "氷牙",
    "idaten",
    "凍結爪"
   ],
   "innateTrait": "残像",
   "growthType": "速度",
   "recipe": null,
   "description": "雪原を跳ねまわる白いウサギ。耳で冷たい風の向きを読む。",
   "look": {
    "c1": "#ffffff",
    "c3": "#9ad8f0",
    "ears": "round",
    "tail": "bushy"
   }
  },
  {
   "id": "123",
   "name": "フブキギツネ",
   "family": "獣",
   "element": "氷",
   "rank": "D",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "素早さ",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 76,
    "攻撃": 92,
    "防御": 46,
    "素早さ": 113,
    "特殊攻撃": 38,
    "特殊防御": 55
   },
   "evYield": {
    "素早さ": 2
   },
   "baseStats": {
    "HP": 33,
    "攻撃": 43,
    "防御": 14,
    "素早さ": 56,
    "特殊攻撃": 9,
    "特殊防御": 19,
    "命中": 93,
    "回避": 22
   },
   "initialMoveCandidates": [
    "氷牙",
    "idaten",
    "凍結爪"
   ],
   "innateTrait": "疾風脚",
   "growthType": "速度",
   "recipe": null,
   "description": "吹雪にまぎれて獲物に近づく、銀色のキツネ。"
  },
  {
   "id": "124",
   "name": "ツララムシ",
   "family": "虫",
   "element": "氷",
   "rank": "F",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 71,
    "攻撃": 32,
    "防御": 71,
    "素早さ": 25,
    "特殊攻撃": 32,
    "特殊防御": 44
   },
   "evYield": {
    "防御": 1
   },
   "baseStats": {
    "HP": 30,
    "攻撃": 6,
    "防御": 29,
    "素早さ": 5,
    "特殊攻撃": 5,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "氷礫",
    "冷気",
    "雪嵐"
   ],
   "innateTrait": "甲殻装甲",
   "growthType": "耐久",
   "recipe": null,
   "description": "つららのような殻をもつ虫。寒いほど殻が硬くなる。"
  },
  {
   "id": "125",
   "name": "アイスビートル",
   "family": "虫",
   "element": "氷",
   "rank": "D",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "耐久",
   "archetype": "物理の壁",
   "signature": "防御",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 109,
    "攻撃": 51,
    "防御": 109,
    "素早さ": 39,
    "特殊攻撃": 45,
    "特殊防御": 67
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 53,
    "攻撃": 17,
    "防御": 53,
    "素早さ": 9,
    "特殊攻撃": 14,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "氷牙",
    "冷気",
    "凍結爪"
   ],
   "innateTrait": "甲殻装甲",
   "growthType": "耐久",
   "recipe": null,
   "description": "氷の鎧をまとった甲虫。体当たりで氷壁をも砕く。"
  },
  {
   "id": "126",
   "name": "ユキダマ",
   "family": "精霊",
   "element": "氷",
   "rank": "F",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 52,
    "攻撃": 26,
    "防御": 35,
    "素早さ": 47,
    "特殊攻撃": 74,
    "特殊防御": 41
   },
   "evYield": {
    "特殊攻撃": 1
   },
   "baseStats": {
    "HP": 16,
    "攻撃": 5,
    "防御": 8,
    "素早さ": 14,
    "特殊攻撃": 31,
    "特殊防御": 11,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "氷礫",
    "冷気",
    "雪嵐"
   ],
   "innateTrait": "属性共鳴",
   "growthType": "特殊",
   "recipe": null,
   "description": "雪の結晶が集まって生まれた精霊。ふれると、ひんやり冷たい。"
  },
  {
   "id": "127",
   "name": "ヒョウガスピリット",
   "family": "精霊",
   "element": "氷",
   "rank": "D",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "HP",
   "tier": "標準",
   "speciesStats": {
    "HP": 77,
    "攻撃": 41,
    "防御": 55,
    "素早さ": 71,
    "特殊攻撃": 113,
    "特殊防御": 63
   },
   "evYield": {
    "特殊攻撃": 2
   },
   "baseStats": {
    "HP": 33,
    "攻撃": 11,
    "防御": 19,
    "素早さ": 29,
    "特殊攻撃": 56,
    "特殊防御": 24,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "氷礫",
    "冷気",
    "雪嵐"
   ],
   "innateTrait": "呪術の才",
   "growthType": "特殊",
   "recipe": null,
   "description": "氷河の奥に宿る精霊。凍てつく息で、あたりを白く染める。"
  },
  {
   "id": "128",
   "name": "モフリン",
   "family": "獣",
   "element": "無",
   "rank": "F",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "万能",
   "archetype": "万能",
   "signature": "HP",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 63,
    "攻撃": 44,
    "防御": 44,
    "素早さ": 44,
    "特殊攻撃": 36,
    "特殊防御": 44
   },
   "evYield": {
    "HP": 1
   },
   "baseStats": {
    "HP": 24,
    "攻撃": 13,
    "防御": 13,
    "素早さ": 13,
    "特殊攻撃": 8,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "突進",
    "気合いため",
    "渾身撃"
   ],
   "innateTrait": "再生皮膚",
   "growthType": "万能",
   "recipe": null,
   "description": "分厚い毛に包まれた、まるい獣。どんな土地にもすぐなじむ。",
   "look": {
    "c1": "#f4efe4",
    "c3": "#e0c8a0",
    "ears": "round",
    "tail": "bushy"
   }
  },
  {
   "id": "129",
   "name": "ギンモフ",
   "family": "獣",
   "element": "無",
   "rank": "D",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "万能",
   "archetype": "万能",
   "signature": "HP",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 97,
    "攻撃": 67,
    "防御": 68,
    "素早さ": 67,
    "特殊攻撃": 53,
    "特殊防御": 68
   },
   "evYield": {
    "HP": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 27,
    "防御": 27,
    "素早さ": 27,
    "特殊攻撃": 19,
    "特殊防御": 27,
    "命中": 93,
    "回避": 17
   },
   "initialMoveCandidates": [
    "突進",
    "気合いため",
    "渾身撃"
   ],
   "innateTrait": "再生皮膚",
   "growthType": "万能",
   "recipe": null,
   "description": "銀色の毛並みをもつモフリンの進化形。苦手なことが、ほとんどない。",
   "look": {
    "c1": "#c8ccd8",
    "c3": "#a0a8c0",
    "ears": "round",
    "tail": "bushy",
    "mane": "#e8ecf4"
   }
  },
  {
   "id": "130",
   "name": "シモドリ",
   "family": "鳥",
   "element": "氷",
   "rank": "F",
   "obtain": "野生",
   "region": "北の氷原",
   "role": "支援",
   "archetype": "高速サポート",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 55,
    "攻撃": 32,
    "防御": 28,
    "素早さ": 69,
    "特殊攻撃": 41,
    "特殊防御": 50
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 19,
    "攻撃": 5,
    "防御": 5,
    "素早さ": 28,
    "特殊攻撃": 11,
    "特殊防御": 16,
    "命中": 90,
    "回避": 13
   },
   "initialMoveCandidates": [
    "氷礫",
    "小回復",
    "雪嵐"
   ],
   "innateTrait": "守護の祈り",
   "growthType": "支援",
   "recipe": null,
   "description": "霜の羽をもつ小鳥。群れで鳴きかわし、仲間に危険を知らせる。"
  },
  {
   "id": "131",
   "name": "マルハト",
   "family": "鳥",
   "element": "無",
   "rank": "F",
   "obtain": "野生",
   "region": "始まりの草原",
   "role": "万能",
   "archetype": "万能",
   "signature": "素早さ",
   "weakness": "防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 58,
    "攻撃": 43,
    "防御": 40,
    "素早さ": 49,
    "特殊攻撃": 41,
    "特殊防御": 44
   },
   "evYield": {
    "素早さ": 1
   },
   "baseStats": {
    "HP": 21,
    "攻撃": 13,
    "防御": 9,
    "素早さ": 16,
    "特殊攻撃": 11,
    "特殊防御": 13,
    "命中": 90,
    "回避": 8
   },
   "initialMoveCandidates": [
    "突進",
    "気合いため",
    "渾身撃"
   ],
   "innateTrait": "先制感知",
   "growthType": "万能",
   "recipe": null,
   "description": "まんまるな体の鳩。人なつこく、村の広場でもよく見かける。"
  },
  {
   "id": "132",
   "name": "大地鳥ガイアホーク",
   "family": "鳥",
   "element": "地",
   "element2": "風",
   "rank": "C",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "重戦車",
   "signature": "防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 147,
    "攻撃": 130,
    "防御": 113,
    "素早さ": 27,
    "特殊攻撃": 49,
    "特殊防御": 75
   },
   "evYield": {
    "防御": 2
   },
   "baseStats": {
    "HP": 76,
    "攻撃": 66,
    "防御": 56,
    "素早さ": 5,
    "特殊攻撃": 16,
    "特殊防御": 33,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "風切り",
    "気合いため",
    "大地震"
   ],
   "innateTrait": "不屈の肉体",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "044",
     "052"
    ],
    "resultId": "132",
    "display": "ストームホーク + ロックタートル → 大地鳥ガイアホーク"
   },
   "description": "岩の翼をもつ巨鳥。飛ぶことより、大地を踏みしめて戦うことを選んだ。"
  },
  {
   "id": "133",
   "name": "水蓮精ミナモ",
   "family": "植物",
   "element": "水",
   "rank": "C",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 141,
    "攻撃": 50,
    "防御": 92,
    "素早さ": 49,
    "特殊攻撃": 79,
    "特殊防御": 130
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 73,
    "攻撃": 16,
    "防御": 43,
    "素早さ": 16,
    "特殊攻撃": 36,
    "特殊防御": 66,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "癒しの雫",
    "潮流撃"
   ],
   "innateTrait": "癒しの波動",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "046",
     "047"
    ],
    "resultId": "133",
    "display": "アクアフェザー + ドライアド → 水蓮精ミナモ"
   },
   "description": "湖面に咲く蓮の精。その花びらは、傷ついた者の痛みを洗い流す。"
  },
  {
   "id": "134",
   "name": "炎魔ヘルハウンド",
   "family": "魔獣",
   "element": "炎",
   "element2": "闇",
   "rank": "C",
   "obtain": "配合限定",
   "region": null,
   "role": "攻撃",
   "archetype": "物理アタッカー",
   "signature": "攻撃",
   "weakness": "特殊防御",
   "tier": "標準",
   "speciesStats": {
    "HP": 113,
    "攻撃": 146,
    "防御": 76,
    "素早さ": 85,
    "特殊攻撃": 55,
    "特殊防御": 66
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 56,
    "攻撃": 76,
    "防御": 33,
    "素早さ": 39,
    "特殊攻撃": 19,
    "特殊防御": 26,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "影縫い",
    "気合いため",
    "炎獄爪"
   ],
   "innateTrait": "破壊衝動",
   "growthType": "攻撃",
   "recipe": {
    "parentIds": [
     "041",
     "056"
    ],
    "resultId": "134",
    "display": "フレイムウルフ + デビルキャット → 炎魔ヘルハウンド"
   },
   "description": "地の底の炎をまとう魔犬。吠え声は、岩をも溶かす熱を帯びる。"
  },
  {
   "id": "135",
   "name": "光甲虫ルミナビートル",
   "family": "虫",
   "element": "光",
   "rank": "C",
   "obtain": "配合限定",
   "region": null,
   "role": "耐久",
   "archetype": "特殊の壁",
   "signature": "特殊防御",
   "weakness": "攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 140,
    "攻撃": 44,
    "防御": 80,
    "素早さ": 55,
    "特殊攻撃": 76,
    "特殊防御": 146
   },
   "evYield": {
    "特殊防御": 2
   },
   "baseStats": {
    "HP": 73,
    "攻撃": 12,
    "防御": 36,
    "素早さ": 19,
    "特殊攻撃": 33,
    "特殊防御": 76,
    "命中": 94,
    "回避": 22
   },
   "initialMoveCandidates": [
    "光弾",
    "小回復",
    "極光"
   ],
   "innateTrait": "精霊の加護",
   "growthType": "耐久",
   "recipe": {
    "parentIds": [
     "053",
     "057"
    ],
    "resultId": "135",
    "display": "スカイビートル + ライトウルフ → 光甲虫ルミナビートル"
   },
   "description": "光を宿す甲羅をもつ甲虫。闇の力をはね返す。"
  },
  {
   "id": "136",
   "name": "闇牙獣ヤトガ",
   "family": "獣",
   "element": "闇",
   "rank": "C",
   "obtain": "配合限定",
   "region": null,
   "role": "速度",
   "archetype": "高速アタッカー",
   "signature": "攻撃",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 96,
    "攻撃": 130,
    "防御": 60,
    "素早さ": 136,
    "特殊攻撃": 49,
    "特殊防御": 70
   },
   "evYield": {
    "攻撃": 2
   },
   "baseStats": {
    "HP": 46,
    "攻撃": 66,
    "防御": 23,
    "素早さ": 69,
    "特殊攻撃": 16,
    "特殊防御": 29,
    "命中": 94,
    "回避": 27
   },
   "initialMoveCandidates": [
    "影縫い",
    "idaten",
    "奈落斬"
   ],
   "innateTrait": "急所狙い",
   "growthType": "速度",
   "recipe": {
    "parentIds": [
     "043",
     "056"
    ],
    "resultId": "136",
    "display": "ライガーハウンド + デビルキャット → 闇牙獣ヤトガ"
   },
   "description": "夜の闇にとけこむ黒い獣。気づいたときには、牙がそこにある。"
  },
  {
   "id": "137",
   "name": "氷竜グラシア",
   "family": "竜",
   "element": "氷",
   "rank": "B",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 122,
    "攻撃": 61,
    "防御": 78,
    "素早さ": 92,
    "特殊攻撃": 165,
    "特殊防御": 92
   },
   "evYield": {
    "特殊攻撃": 2,
    "HP": 1
   },
   "baseStats": {
    "HP": 61,
    "攻撃": 23,
    "防御": 34,
    "素早さ": 43,
    "特殊攻撃": 88,
    "特殊防御": 42,
    "命中": 95,
    "回避": 27
   },
   "initialMoveCandidates": [
    "氷礫",
    "冷気",
    "雪嵐"
   ],
   "innateTrait": "属性共鳴",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "061",
     "127"
    ],
    "resultId": "137",
    "display": "フェンリル + ヒョウガスピリット → 氷竜グラシア"
   },
   "description": "北の果てに棲む氷の竜。そのため息は、湖を一瞬で凍らせる。"
  },
  {
   "id": "138",
   "name": "氷晶竜ニヴル",
   "family": "竜",
   "element": "氷",
   "rank": "SS",
   "obtain": "配合限定",
   "region": null,
   "role": "特殊",
   "archetype": "特殊アタッカー",
   "signature": "特殊攻撃",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 170,
    "攻撃": 83,
    "防御": 112,
    "素早さ": 127,
    "特殊攻撃": 229,
    "特殊防御": 129
   },
   "evYield": {
    "特殊攻撃": 3
   },
   "baseStats": {
    "HP": 91,
    "攻撃": 38,
    "防御": 54,
    "素早さ": 65,
    "特殊攻撃": 128,
    "特殊防御": 64,
    "命中": 98,
    "回避": 42
   },
   "initialMoveCandidates": [
    "氷礫",
    "冷気",
    "雪嵐"
   ],
   "innateTrait": "魔力吸収",
   "growthType": "特殊",
   "recipe": {
    "parentIds": [
     "087",
     "137"
    ],
    "resultId": "138",
    "display": "海皇龍ネプティア + 氷竜グラシア → 氷晶竜ニヴル"
   },
   "description": "永久凍土の底で眠る伝説の竜。その身は、溶けることのない氷晶でできている。"
  },
  {
   "id": "139",
   "name": "始原獣オリジン",
   "family": "獣",
   "element": "無",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "万能",
   "archetype": "万能",
   "signature": "HP",
   "weakness": "特殊攻撃",
   "tier": "標準",
   "speciesStats": {
    "HP": 179,
    "攻撃": 125,
    "防御": 125,
    "素早さ": 125,
    "特殊攻撃": 101,
    "特殊防御": 125
   },
   "evYield": {
    "HP": 3
   },
   "baseStats": {
    "HP": 97,
    "攻撃": 63,
    "防御": 63,
    "素早さ": 63,
    "特殊攻撃": 48,
    "特殊防御": 63,
    "命中": 97,
    "回避": 37
   },
   "initialMoveCandidates": [
    "突進",
    "気合いため",
    "渾身撃"
   ],
   "innateTrait": "無限の可能性",
   "growthType": "万能",
   "recipe": {
    "parentIds": [
     "081",
     "129"
    ],
    "resultId": "139",
    "display": "聖獣セラフィム + ギンモフ → 始原獣オリジン"
   },
   "description": "すべての獣の祖とされる伝説の幻獣。あらゆる姿に変わる力を秘めている。"
  },
  {
   "id": "140",
   "name": "星海鯨アステル",
   "family": "水棲",
   "element": "光",
   "element2": "水",
   "rank": "S",
   "obtain": "配合限定",
   "region": null,
   "role": "支援",
   "archetype": "耐久サポート",
   "signature": "特殊防御",
   "weakness": "素早さ",
   "tier": "標準",
   "speciesStats": {
    "HP": 202,
    "攻撃": 70,
    "防御": 134,
    "素早さ": 70,
    "特殊攻撃": 117,
    "特殊防御": 187
   },
   "evYield": {
    "特殊防御": 3
   },
   "baseStats": {
    "HP": 112,
    "攻撃": 29,
    "防御": 68,
    "素早さ": 29,
    "特殊攻撃": 58,
    "特殊防御": 102,
    "命中": 97,
    "回避": 37
   },
   "initialMoveCandidates": [
    "mizutsubute",
    "小回復",
    "極光"
   ],
   "innateTrait": "慈愛の光",
   "growthType": "支援",
   "recipe": {
    "parentIds": [
     "065",
     "077"
    ],
    "resultId": "140",
    "display": "世界樹の妖精 + 深海龍リヴァル → 星海鯨アステル"
   },
   "description": "夜空の海を泳ぐという伝説の鯨。背の星々は、迷う者を導く灯りとなる。"
  }
 ]
};
