// 町の外：そよかぜ草原
(function (G) {
  'use strict';

  const FOREST_LEVEL = 7; // 森へ入るのに必要な幻獣のレベル（目安）
  // 相棒ごとに、公式レシピで配合できる相手（001+003→021、003+005→023、004+002→022）
  const GIFT_FOR_STARTER = { '001': '003', '003': '005', '004': '002' };
  const GUARD_LOOK = { helmet: '#8a8a9a', shirt: '#5a6a8a', pants: '#3a3a4a', beard: '#5a4030' };

  G.registerMap({
    id: 'meadow',
    name: 'そよかぜ草原',
    outdoor: true,
    bg: '#2a5a2a',
    encounter: 'meadow', // js/data/encounters.js
    tiles: [
      '################=#################',
      '###############.=.################',
      '##..,.......###.=.###.......,...##',
      '##;;;;;;;.......=.......;;;;;;..##',
      '##;;;;;;;...r...=.......;;;;;;;.##',
      '##;;;;;;;.......=...,...;;;;;;;.##',
      '##.;;;;;;.......=.......;;;;;;..##',
      '##.......##.....=..........r....##',
      '##......####....=...............##',
      '##.......##.....=====...,.......##',
      '##..~~~~........=...=.....;;;;;.##',
      '##.~~~~~~.......=...=....;;;;;;.##',
      '##.~~~~~~.......=...=....;;;;;;.##',
      '##..~~~~..;;;;..=...====..;;;;..##',
      '##........;;;;;.=.....r...;;;;..##',
      '##..r.....;;;;;.=........,......##',
      '##........;;;;..=...............##',
      '###.............=..........###..##',
      '####............=.........#####.##',
      '###..,..........=..........###..##',
      '##..;;;;;;;.....=....;;;;;;;;...##',
      '##..;;;;;;;;....=....;;;;;;;;...##',
      '##..;;;;;;;;....=....;;;;;;;;...##',
      '##...;;;;;;.....=.....;;;;;;....##',
      '##...........r..=...............##',
      '##..,...........==.......,......##',
      '###.............==.............###',
      '################==################',
    ],
    signs: [
      { x: 15, y: 25, text: '↑ 北：ささやきの森\n↓ 南：ソラノ村' },
      { x: 15, y: 2, text: 'この先『ささやきの森』\n※幻獣を連れていない方の立ち入りを禁ず　―― 森の番人' },
    ],
    warps: [
      // 南の出口 → ソラノ村の北端
      { x: 16, y: 27, w: 2, h: 1, to: 'sorano', tx: 13, ty: 1, keepX: true, dir: 'down' },
      // 北の出口 → ささやきの森
      { x: 16, y: 0, to: 'forest', tx: 18, ty: 28, dir: 'up' },
    ],
    items: [
      { x: 31, y: 18, item: 'potion', count: 1, flag: 'item_meadow_potion' },
      { x: 3, y: 19, item: 'bondstone', count: 2, flag: 'item_meadow_bondstone' },
      { x: 12, y: 8, item: 'powerseed', count: 1, flag: 'item_meadow_seed' },
      { x: 31, y: 12, item: 'blackemblem', count: 1, flag: 'item_meadow_emblem' },
    ],
    npcs: [
      {
        id: 'forestguard', name: '森の番人ボルグ', x: 16, y: 1, dir: 'down',
        visible: (s) => !s.flags.forestOpen,
        look: GUARD_LOOK,
        talk: async (E) => {
          const party = E.state().party;
          const best = party.reduce((mx, m) => Math.max(mx, m.level), 0);
          if (party.length === 0) {
            await E.say('森の番人ボルグ', [
              'この先は『ささやきの森』だ。',
              '森の幻獣は、草原の連中よりずっと気性が荒い。\n幻獣を連れていない者を通すわけにはいかんな。',
              'ミモザ博士から相棒を受け取ったら、また来るといい。',
            ]);
          } else {
            const c = await E.ask('森の番人ボルグ', [
              'ほう、幻獣を連れているな。いい目をしている。',
              '森の幻獣は手ごわい。通りたければ、わしの『試練』を受けてもらおう。',
              `${best < FOREST_LEVEL ? `（目安は レベル${FOREST_LEVEL}以上じゃ）\n` : ''}……挑むか？`,
            ], ['試練を受ける', 'やめておく'], 1);
            if (c !== 0) { await E.say('森の番人ボルグ', '準備ができたら、また来い。'); return; }
            const r = await G.Battle.fight('guardBorg');
            if (r !== 'win') {
              await E.say('森の番人ボルグ', 'まだまだだな。草原でもっと鍛えてこい！\n（幻獣たちは手当てしておいたぞ）');
              return;
            }
            await E.say('森の番人ボルグ', [
              'いいだろう、通ってよし！',
              '試練を越えた証だ。これを持っていけ。',
            ]);
            await E.give('bondstone2', 2);
            await E.say('森の番人ボルグ', '森の奥には『灯石の洞窟』がある。\n……近ごろ、黒いフードの連中が出入りしているらしい。気をつけるんだぞ。');
            E.set('forestOpen');
            G.autoSave();
            await E.walkNpc('forestguard', 'l');
            E.face('forestguard', 'right');
          }
        },
      },
      {
        id: 'forestguard2', name: '森の番人ボルグ', x: 15, y: 1, dir: 'right',
        visible: (s) => !!s.flags.forestOpen,
        look: GUARD_LOOK,
        talk: [
          '森の中には、旅人が休める小屋がある。\n困ったら立ち寄るといい。',
          '……そういえば最近、黒いフードの連中が森に出入りしているらしい。\n用心しろよ。',
        ],
      },
      {
        id: 'bugboy', name: '虫とり少年', x: 11, y: 5, dir: 'left', wander: 2,
        look: { hat: '#e0c040', shirt: '#6ab04a', pants: '#5a4a3a' },
        talk: [
          '背の高い草むらに入ると、野生の幻獣が飛び出してくるんだ！',
          'ぼくはまだ幻獣を連れてないから、草むらのそばで観察してるだけなんだけどね。',
        ],
      },
      {
        id: 'traveler', name: '旅人', x: 23, y: 15, dir: 'left',
        look: { hat: '#8a5a3a', coat: '#7a6a4a', shirt: '#5a4a3a', pants: '#3a3a3a', beard: '#5a3a2a' },
        talk: [
          'やあ、旅の者だ。この大陸は広いぞ。',
          'この草原の北には『ささやきの森』。\nその先の『灯石（ひいし）の洞窟』を抜ければ、港町リュミエールにたどり着く。',
          'いつか君も、自分の目で確かめてくるといい。',
        ],
      },
      {
        id: 'fieldassistant', name: '研究員トビ', x: 21, y: 11, dir: 'down',
        look: { hair: '#6a4a2a', glasses: true, coat: '#f4f4f4', shirt: '#4a8a6a', pants: '#3a3a4a' },
        talk: async (E) => {
          await E.say('研究員トビ', [
            'やあ！　ミモザ研究所の研究員、トビだよ。\nいまは草原の生態調査中なんだ。',
            '幻獣は住む場所によって顔ぶれがまったくちがう。\n草原、森、洞窟……同じ種類でも、性格や強さがさまざまなんだ。',
          ]);
          // 相棒と配合できる（公式レシピがある）子を託してくれる。フラグ名は旧セーブとの互換のため据え置き
          if (E.flag('gotStarter') && !E.flag('gotTsubomin')) {
            const giftId = GIFT_FOR_STARTER[E.flag('starter')] || '003';
            const gift = G.Species[giftId];
            await E.say('研究員トビ', [
              'おっ、それが博士からもらった相棒かい？　いい顔してるね！',
              `実はキミに頼みがあるんだ。\n調査中に、群れからはぐれた${gift.name}を保護してね。`,
              'キミの相棒と、とても相性がいい子なんだ。\nこの2体を配合すると……ふふ、何が生まれるかはお楽しみ。',
              'ボクより、キミと一緒のほうが幸せになれそうだ。\n……連れていってくれるかい？',
            ]);
            E.set('gotTsubomin');
            await E.giveMonster(giftId, 5, 'gift', 'そよかぜ草原');
            await E.say('研究員トビ', '2体そろったなら、村の『配合の館』を訪ねてごらん。\nどんな子が生まれるか、ボクも楽しみだよ！');
            return;
          }
          if (E.flag('heardBlackHoods')) {
            await E.say('研究員トビ', '……黒いフードの集団？\nそういえば昨日、東のほうで見慣れない足跡を見つけたよ。\n何か落としていったかもしれないね。');
          }
        },
      },
      {
        id: 'pondgirl', name: '女の子', x: 9, y: 13, dir: 'left',
        look: { hair: '#3a2a4a', style: 'long', shirt: '#6a8ae0', pants: '#4a4a6a' },
        talk: [
          'この池、ときどき水面がぶくぶくって泡立つの。',
          'きっと何かが棲んでるんだわ！　でも、のぞきこんでも何も見えないの……。',
        ],
      },
    ],
    onEnter: async (E) => {
      if (E.flag('visitedMeadow')) return;
      E.set('visitedMeadow');
      await E.narrate('草の香りを乗せたやわらかな風が、ほおをなでていく。\n……ここが『そよかぜ草原』だ。');
    },
  });
})(window.Game);
