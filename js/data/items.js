// アイテム定義（効果の実装は PHASE 3〜5）
(function (G) {
  'use strict';

  G.Items = {
    potion:      { name: 'キズぐすり',   type: 'heal',    price: 100, desc: '幻獣のHPを30回復する。' },
    hipotion:    { name: 'いやし草の雫', type: 'heal',    price: 300, desc: '幻獣のHPを80回復する。' },
    cure:        { name: 'なおし草',     type: 'status',  price: 120, desc: '毒・麻痺・睡眠などの状態異常を治す。' },
    bondstone:   { name: '絆石',         type: 'capture', price: 200, rate: 1, color: '#7ad0a0', desc: '野生の幻獣と絆を結ぶための石。弱らせてから使おう。' },
    bondstone2:  { name: '上絆石',       type: 'capture', price: 600, rate: 1.6, color: '#6aa0f0', desc: '絆石よりも絆を結びやすい、澄んだ石。' },
    bondstone3:  { name: '極絆石',       type: 'capture', price: 1500, rate: 2.5, color: '#f0c040', desc: '強い光を宿した希少な絆石。' },
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
    lantern:     { name: '灯石のランタン', type: 'key', price: 0, desc: '灯石を閉じこめたランタン。暗い洞窟でも、まわりを明るく照らしてくれる。' },
    fireKey:     { name: '炎の鍵石', type: 'key', price: 0, desc: '大地の祠に納められていた、赤く熱をおびた鍵石。風の祭壇の封印に関わるという。' },
    waterKey:    { name: '水の鍵石', type: 'key', price: 0, desc: '花冠の祭壇に納められていた、青く澄んだ鍵石。風の祭壇の封印に関わるという。' },
    skyFeather:  { name: '空の羽',   type: 'key', price: 0, desc: '天空竜アストラが残した、青白く光る羽。「空翔ける大鳥と、風の神」……。' },
    kizunaEmblem: { name: '絆の紋章', type: 'key', price: 0, desc: '封印の守護者から授かった、人と幻獣の盟約の証。あたたかな光を宿している。' },
    blackemblem: { name: '黒い環のバッジ', type: 'key',   price: 0,   desc: '黒い輪が刻まれた金属のバッジ。誰かの落とし物だろうか……' },
  };
})(window.Game);
