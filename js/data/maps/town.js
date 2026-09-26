// 始まりの町：ソラノ村
(function (G) {
  'use strict';

  G.registerMap({
    id: 'sorano',
    name: 'ソラノ村',
    outdoor: true,
    autosave: true, // 村に着くとオートセーブ
    bg: '#2a5a2a',
    tiles: [
      '#############==#############',
      '#############==#############',
      '##..,........==........,..##',
      '##...........==...........##',
      '##...........==...........##',
      '##...........==...........##',
      '##...........==...........##',
      '##...=.......==...........##',
      '##.======================.##',
      '##........oooooooo........##',
      '##........oooooooo........##',
      '##........oooooooo........##',
      '##...........==...........##',
      '##...........==...........##',
      '##...........==...........##',
      '##.======================.##',
      '##......=..........=......##',
      '##......=..........=.~~~~.##',
      '##......=..........=.~~~~.##',
      '##......============......##',
      '##..,..................,..##',
      '############################',
    ],
    buildings: [
      { x: 3, y: 3, w: 5, h: 4, style: 'house',
        door: { x: 5, to: 'home', tx: 4, ty: 6 } },
      { x: 17, y: 3, w: 7, h: 5, style: 'lab', label: '研究所',
        door: { x: 20, to: 'lab', tx: 6, ty: 8 } },
      { x: 3, y: 11, w: 5, h: 4, style: 'shop', label: 'ショップ',
        door: { x: 5, to: 'shop', tx: 4, ty: 6 } },
      { x: 19, y: 11, w: 6, h: 4, style: 'healer', label: '癒しの泉',
        door: { x: 21, to: 'healer', tx: 4, ty: 6 } },
      { x: 10, y: 16, w: 8, h: 3, style: 'fusion', label: '配合の館',
        door: { x: 13, to: 'fusionhall', tx: 5, ty: 7, unlockFlag: 'gotStarter',
          locked: '扉には鍵がかかっている。\n『配合の館 ―― 館主不在につき、しばらく休館いたします』' } },
    ],
    objects: [
      { type: 'fountain', x: 13, y: 9, w: 2, h: 2,
        text: '村の真ん中の噴水だ。澄んだ水がこんこんと湧き出ている。' },
    ],
    signs: [
      { x: 12, y: 4, text: 'ここは ソラノ村\n～ 風と幻獣のふるさと ～' },
      { x: 15, y: 2, text: '↑ 北：そよかぜ草原' },
    ],
    warps: [
      // 北の出口 → 草原の南端
      { x: 13, y: 0, w: 2, h: 1, to: 'meadow', tx: 16, ty: 26, keepX: true, dir: 'up' },
    ],
    npcs: [
      {
        // ライバル戦2：守護者を鎮めて戻ると、広場でジンが待っている
        id: 'rivalTown', name: 'ジン', x: 15, y: 12, dir: 'down',
        visible: (s) => !!s.flags.chapter1Boss && !s.flags.rival2Done,
        look: G.Looks.rival,
        talk: async (E) => {
          await E.say('ジン', [
            '……戻ったか。守護者を鎮めたらしいな。',
            'オレはこの数日、ずっと考えてた。\n強さってのは何なのか……。',
          ]);
          const r = await G.Battle.fight('rival2', { bg: 'meadow' });
          const bond = (E.flag('rivalBond') || 0) >= 1 || E.flag('rivalAnswer') === 'bond';
          if (r === 'win') {
            E.set('rival2Won');
            await E.say('ジン', bond ? [
              'お前の言う『絆』ってやつ……少しだけ、わかった気がする。',
              'オレはオレのやり方で強くなる。\nだが……幻獣の声を聞くことは、忘れねえ。',
              'またな、{name}。……次に会うときも、ライバルだ。',
            ] : [
              'ふん……今回はお前の勝ちだ。',
              'だがオレは止まらねえ。いつか必ず、お前を超えてみせる。',
            ]);
          } else {
            await E.say('ジン', [
              'オレの勝ちだ。……だが、今日のお前は手ごわかった。',
              bond ? '洞窟での借りは、これで返したぜ。\n……またやろう、{name}。' : '……次もオレが勝つ。',
            ]);
          }
          E.set('rival2Done');
          G.autoSave();
          await E.say('ジン', '博士が待ってるぜ。早く報告してこい。');
          await E.walkNpc('rivalTown', 'uuu', 0.18);
          E.hideNpc('rivalTown');
        },
      },
      {
        id: 'elder', name: '長老ゴルド', x: 11, y: 10, dir: 'down',
        look: { hair: '#dcdcdc', style: 'bald', beard: '#eeeeee', shirt: '#7a6a4a', pants: '#4a3a2a' },
        talk: [
          'この村の名はソラノ。はるか昔、空を渡る大いなる幻獣が、翼を休めた地だと伝わっておる。',
          '人と幻獣は、遠い昔に『盟約』を交わした。それ以来、互いに支え合って生きてきたのじゃ。',
          '……じゃが近ごろ、その盟約をこころよく思わぬ者たちがおる、という噂も耳にする。\n気をつけるのじゃぞ、若いの。',
        ],
      },
      {
        id: 'flowergirl', name: '女の子 ミナ', x: 9, y: 5, dir: 'down', wander: 2,
        look: { hair: '#f0a040', style: 'long', ribbon: '#ffffff', shirt: '#f06a8a', pants: '#8a4a6a' },
        talk: [
          '幻獣ってね、みんな性格がちがうんだよ！\nおこりんぼうだったり、のんびり屋さんだったり。',
          'わたしも大きくなったら、ふわふわの幻獣とお友だちになるんだ～！',
        ],
      },
      {
        id: 'tipboy', name: '男の子 ケン', x: 16, y: 13, dir: 'left', wander: 2,
        look: { hair: '#3a2a1a', hat: '#3a8ad0', shirt: '#f0c040', pants: '#3a3a5a' },
        talk: [
          'なあなあ、知ってる？\nShiftキーを押しながら歩くと、走れるんだぜ！',
          'それと、XキーかEscキーでメニューが開けるんだ。\n持ち物の確認はこまめにな！',
        ],
      },
      {
        id: 'kindwoman', name: 'おばさん', x: 22, y: 9, dir: 'down',
        look: { hair: '#5a3a2a', style: 'long', shirt: '#8ac06a', pants: '#5a4a3a' },
        talk: async (E) => {
          if (!E.flag('gotGiftPotion')) {
            await E.say('おばさん', [
              'あら、{name}ちゃん。今日から幻獣使いの見習いになるんですってね。',
              'おめでとう！　これはおばさんからのお祝いよ。',
            ]);
            E.set('gotGiftPotion');
            await E.give('potion', 3);
            await E.say('おばさん', 'キズぐすりは、幻獣の傷を癒やすお薬よ。\n無理はさせないであげてね。');
          } else {
            await E.say('おばさん', 'キズぐすりは『ショップ』でも買えるわよ。\n回復は『癒しの泉』で、タダでしてもらえるわ。');
          }
        },
      },
      {
        id: 'fusionelder', name: '白ひげの老人', x: 9, y: 17, dir: 'right',
        visible: (s) => !s.flags.gotStarter, // 相棒を得ると館の中へ戻る
        look: { hair: '#b0b0b0', beard: '#e8e8e8', coat: '#6a4a9a', shirt: '#4a3a6a', pants: '#3a2a4a' },
        talk: async (E) => {
          await E.say('白ひげの老人', [
            'ほっほっ。そこの館が気になるかの？\nここは『配合の館』。2体の幻獣から、新たな命を生み出す場所じゃ。',
            '親の力や技を受け継いだ子が生まれ、その子がまた親となる……。\n配合を重ねれば、野には決しておらぬ幻獣にも出会えるという。',
            'ただ、いまは館主が旅に出ていて閉まっておる。',
            '炎を宿す獣と、空を舞う鳥を掛け合わせると……\nおっと、これはまだ早い話じゃったな。ほっほっほっ。',
          ]);
          E.set('heardFusionRumor');
        },
      },
      {
        id: 'fisher', name: '釣り人', x: 20, y: 18, dir: 'right',
        look: { hat: '#6a8a4a', beard: '#6a4a3a', shirt: '#4a6a8a', pants: '#3a3a3a' },
        talk: [
          'この池には、水属性の幻獣が棲んでおるという話じゃが……\nわしは50年、一度も見たことがないのう。',
          '釣れるのは長靴ばかりじゃ。',
        ],
      },
      {
        id: 'rumorman', name: '青年', x: 11, y: 2, dir: 'down',
        look: { hair: '#2a4a2a', shirt: '#c05a3a', pants: '#3a3a4a' },
        talk: async (E) => {
          await E.say('青年', [
            '……なあ、聞いてくれよ。\n昨日、草原の奥で黒いフードの連中を見かけたんだ。',
            '野生の幻獣を、無理やり鉄の檻に詰め込んでた。\nみんな胸に、黒い輪っかみたいな印をつけてたな……。',
            '何者なんだろう。……あんたも草原に出るなら気をつけな。',
          ]);
          E.set('heardBlackHoods');
        },
      },
    ],
  });
})(window.Game);
