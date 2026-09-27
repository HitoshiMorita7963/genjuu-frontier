// アイテム定義（効果の実装は PHASE 3〜5）
(function (G) {
  'use strict';

  G.Items = {
    potion:      { name: 'キズぐすり',   type: 'heal',    price: 100, desc: '幻獣のHPを30回復する。' },
    hipotion:    { name: 'いやし草の雫', type: 'heal',    price: 300, desc: '幻獣のHPを80回復する。' },
    cure:        { name: 'なおし草',     type: 'status',  price: 120, desc: '毒・麻痺・睡眠などの状態異常を治す。' },
    bondstone:   { name: '絆石',         type: 'capture', price: 60, rate: 1, color: '#7ad0a0', desc: '野生の幻獣と絆を結ぶための石。弱らせてから使おう。' },
    bondstone2:  { name: '上絆石',       type: 'capture', price: 200, rate: 1.6, color: '#6aa0f0', desc: '絆石よりも絆を結びやすい、澄んだ石。' },
    bondstone3:  { name: '極絆石',       type: 'capture', price: 500, rate: 2.5, color: '#f0c040', desc: '強い光を宿した希少な絆石。' },
    steelclaw:   { name: '鋼の爪',       type: 'evolve',  price: 2000, desc: 'ツノムシに使うと、鋭い針をもつ姿に進化するという。' },
    moondrop:    { name: '月の雫',       type: 'evolve',  price: 3000, desc: '月の光を閉じこめた雫。夜や闇、光に縁のある幻獣を進化させる。' },
    // 特訓アイテム（努力値を上げる。上限：1能力252・合計510）
    powerseed:   { name: 'ちからの種',   type: 'ev', stat: 'atk', gain: 4, price: 300, desc: '攻撃の努力値が 4 上がる。小さな特訓の第一歩。' },
    hpBook:      { name: '体力の書',     type: 'ev', stat: 'hp',  price: 1000, desc: 'HPの努力値が 10 上がる特訓の書。' },
    atkBook:     { name: '剛力の書',     type: 'ev', stat: 'atk', price: 1000, desc: '攻撃の努力値が 10 上がる特訓の書。' },
    defBook:     { name: '堅守の書',     type: 'ev', stat: 'def', price: 1000, desc: '防御の努力値が 10 上がる特訓の書。' },
    spdBook:     { name: '疾風の書',     type: 'ev', stat: 'spd', price: 1000, desc: '素早さの努力値が 10 上がる特訓の書。' },
    satBook:     { name: '魔力の書',     type: 'ev', stat: 'sat', price: 1000, desc: '特殊攻撃の努力値が 10 上がる特訓の書。' },
    sdfBook:     { name: '護心の書',     type: 'ev', stat: 'sdf', price: 1000, desc: '特殊防御の努力値が 10 上がる特訓の書。' },
    forgetHerb:  { name: '忘れ草の香',   type: 'evreset', price: 800, desc: '努力値をすべて 0 にもどす香。育て方を見直したいときに。' },
    // 経験値アイテム（配合の記念・野生の幻獣の落とし物・フィールドの落とし物で手に入る）
    expS:        { name: '経験の実',     type: 'exp', exp: 800,   price: 200,  color: '#9ad86a', desc: '幻獣に食べさせると、経験値が 800 もらえる実。' },
    expM:        { name: '経験の果実',   type: 'exp', exp: 4000,  price: 800,  color: '#f0a040', desc: '幻獣に食べさせると、経験値が 4000 もらえる果実。' },
    expL:        { name: '黄金の果実',   type: 'exp', exp: 15000, price: 3000, color: '#f8d848', desc: '幻獣に食べさせると、経験値が 15000 もらえる、まばゆい果実。' },
    levelDrop:   { name: '成長の雫',     type: 'exp', levels: 1,  price: 1500, color: '#8ad0f8', desc: '幻獣のレベルが 1 上がる、ふしぎな雫。' },
    lantern:     { name: '灯石のランタン', type: 'key', price: 0, desc: '灯石を閉じこめたランタン。暗い洞窟でも、まわりを明るく照らしてくれる。' },
    fireKey:     { name: '炎の鍵石', type: 'key', price: 0, desc: '大地の祠に納められていた、赤く熱をおびた鍵石。風の祭壇の封印に関わるという。' },
    waterKey:    { name: '水の鍵石', type: 'key', price: 0, desc: '花冠の祭壇に納められていた、青く澄んだ鍵石。風の祭壇の封印に関わるという。' },
    skyFeather:  { name: '空の羽',   type: 'key', price: 0, desc: '天空竜アストラが残した、青白く光る羽。「空翔ける大鳥と、風の神」……。' },
    kizunaEmblem: { name: '絆の紋章', type: 'key', price: 0, desc: '封印の守護者から授かった、人と幻獣の盟約の証。あたたかな光を宿している。' },
    blackemblem: { name: '黒い環のバッジ', type: 'key',   price: 0,   desc: '黒い輪が刻まれた金属のバッジ。誰かの落とし物だろうか……' },
  };

  // ---------------- 経験値アイテムの入手 ----------------
  G.ItemDrops = {
    // フィールドの落とし物：野生の幻獣が出るマップに、一定時間ごとにランダムな場所へ現れる（取っても、また現れる）
    field: {
      first: 30,              // 初めて入ったマップで、最初の落とし物が現れるまでの時間（秒・プレイ時間）
      interval: [120, 240],   // 次の落とし物が現れるまでの時間（秒・プレイ時間。マップにいないあいだも数える）
      max: 3,                 // 1つのマップに同時に落ちている数の上限
      table: [                // [道具, 重み, 個数]
        ['expS', 45, 1], ['expS', 10, 2], ['expM', 12, 1], ['expL', 2, 1], ['levelDrop', 3, 1],
        ['potion', 12, 1], ['bondstone', 10, 2], ['cure', 4, 1], ['hipotion', 2, 1],
      ],
    },
    // 野生の幻獣を倒したとき：たまに経験値アイテムを落としていく（ランクが高いほど良いものを落としやすい）
    wild: { rate: 0.15, table: [['expS', 80], ['expM', 18], ['expL', 2]], rankBonus: 0.04 },
    // 配合したとき：生まれた子のランクに応じて、記念にもらえる
    fusion: { F: ['expS', 2], E: ['expS', 2], D: ['expM', 1], C: ['expM', 1], B: ['expM', 2], A: ['expM', 2], S: ['expL', 1], SS: ['expL', 1], SSS: ['expL', 1], EX: ['expL', 1] },
  };
  // 重み付きの抽選 table: [[値, 重み, ...], ...] → その行
  G.ItemDrops.roll = (table) => {
    let r = Math.random() * table.reduce((s, x) => s + x[1], 0);
    for (const row of table) { r -= row[1]; if (r <= 0) return row; }
    return table[0];
  };
})(window.Game);
