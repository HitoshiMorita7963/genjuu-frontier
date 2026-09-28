// 灯石の洞窟（ダンジョン）B1・B2。暗いので、ランタンで視界が広がる
(function (G) {
  'use strict';

  G.registerMap({
    id: 'cave1',
    name: '灯石の洞窟 B1',
    dark: true,
    encounter: 'cave',
    place: 'cave',
    banner: true,
    outdoor: true, // 地名バナーを出す
    bg: '#0c0a14',
    tiles: [
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRffffffffRRRRRRRRRRffffffffRR',
      'RRfCfzzzffRRRRRRRRRRfzzzzzLfRR',
      'RRfzzzzffBRRRRRRRRRRffzzzzffRR',
      'RRffzzzfffRRRRRRRRRRfCffzzffRR',
      'RRRffffffRRRRRRRRRRRRffffffRRR',
      'RRRRfffRRRRRRRRRRRRRRRfffRRRRR',
      'RRRRfffRRRRRRRRRRRRRRRfffRRRRR',
      'RRRRffffffffffffffffffffffRRRR',
      'RRRRfzzzzfffffffffffzzzzzfRRRR',
      'RRRRRRRRRRRRRffffRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRffffRRRRRRRRRRRRR',
      'RRRRRRRRRffffffffffffRRRRRRRRR',
      'RRWWWWWfffzzzffffzzzfffCRRRRRR',
      'RRWWWWWffzzzzffffzzzzffffRRRRR',
      'RRWWWWffffzzfffffffzzfffBfRRRR',
      'RRWWWWWffffffffffffffffffRRRRR',
      'RRRWWWfffzzzffffffzzzfffRRRRRR',
      'RRRRRRRffffffffffffffffRRRRRRR',
      'RRRRRRRRRRRRRffffRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRffffRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRfRRRRRRRRRRRRRR',
    ],
    warps: [
      { x: 15, y: 21, to: 'forest', tx: 18, ty: 1, dir: 'down' },
      { x: 26, y: 2, to: 'cave2', tx: 4, ty: 3, dir: 'down' },
    ],
    items: [
      { x: 2, y: 4, item: 'steelclaw', count: 1, flag: 'item_cave_claw' },
      { x: 25, y: 9, item: 'expM', count: 1, flag: 'item_cave_bond2' },
      { x: 8, y: 16, item: 'cure', count: 1, flag: 'item_cave_cure' },
      { x: 22, y: 18, item: 'money', count: 500, flag: 'item_cave_money' },
    ],
    npcs: [
      {
        id: 'miner', name: '鉱夫ガンツ', x: 16, y: 19, dir: 'left',
        look: { helmet: '#e0b030', beard: '#5a3a2a', shirt: '#6a5a4a', pants: '#3a3a3a' },
        talk: [
          'この洞窟の岩肌には『灯石』がうまっている。\nほんのり光る石だが、それだけじゃ足元はおぼつかねえ。',
          '奥へ進むほど、幻獣も手ごわくなる。\nコケガメやツチダマは、この洞窟の中で鍛えると姿を変えるって話だ。',
        ],
      },
      {
        id: 'hiker', name: '山男', x: 12, y: 16, dir: 'down', wander: 2,
        look: { hat: '#4a7a4a', beard: '#3a2a1a', shirt: '#8a4a3a', pants: '#3a3a3a' },
        talk: [
          '地底湖のほとりには、水辺の幻獣も棲んでいるらしい。\nミズタマリやイワガメを見かけたってやつがいたな。',
          '北東の階段を下りると、さらに深い階層だ。\n……最近、奥から妙な音が聞こえるんだよな。',
        ],
      },
    ],
    onEnter: async (E) => {
      if (E.flag('gotLantern')) return;
      E.set('gotLantern');
      E.face('miner', 'down');
      await E.say('鉱夫ガンツ', [
        'おっと、そこの坊主……いや、嬢ちゃんか？\n暗くてよく見えねえな。',
        'そんな装備で洞窟に入るつもりか？\n真っ暗で、一歩先も見えやしねえぞ。',
        'ほれ、こいつを持っていきな。\n灯石を閉じこめたランタンだ。',
      ]);
      await E.give('lantern', 1);
      await E.say('鉱夫ガンツ', 'それがありゃ、まわりがずっと明るく見えるはずだ。\n気をつけてな！');
    },
  });

  G.registerMap({
    id: 'cave2',
    name: '灯石の洞窟 B2',
    dark: true,
    encounter: 'cave2',
    place: 'cave',
    outdoor: true,
    bg: '#0c0a14',
    tiles: [
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRffffRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRfUffRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRffzzfffffffffzzzzfffRRRRRRR',
      'RRRRzzzffCfffffzzzzzzffRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRffRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRffRRRRRRRR',
      'RRRRRRffffffffffffffffffffRRRR',
      'RRRRRRfzzzzfffCffffzzzzzffRRRR',
      'RRRRRRffRRRRRRRRRRRRRRRRffRRRR',
      'RRRRRRffRRRRRRRRRRRRRRRRffRRRR',
      'RRRRffffffRRRRRRRRRRRRffffffRR',
      'RRRRfzzzzfRRRRRRRRRRRRfzzzzfRR',
      'RRRRffzzffRRRRRRRRRRRRffzzffRR',
      'RRRRRffffffffffffffffffffffRRR',
      'RRRRRRffffffffffffffffffffRRRR',
      'RRRRRRRRRRRRRRffRRRRRRRRRRRRRR',
      'RRRRRRRRRRfffffffffffRRRRRRRRR',
      'RRRRRRRRRRfffCfffCfffURRRRRRRR',
      'RRRRRRRRRRfffffffffffRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
      'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',
    ],
    warps: [
      { x: 4, y: 2, to: 'cave1', tx: 26, ty: 3, dir: 'down' },
      // 守護者の間の奥：港町リュミエールへの抜け道（第1章クリア後に大岩が崩れる）
      { x: 21, y: 18, to: 'lumiere', tx: 2, ty: 10, dir: 'right' },
    ],
    inspect: {
      X: [
        '古びた石の扉が、固く閉ざされている。\n中央の紋様が、紫色にあやしく脈打っている……。',
      ],
    },
    items: [
      { x: 4, y: 13, item: 'hipotion', count: 2, flag: 'item_cave2_hipotion' },
      { x: 27, y: 11, item: 'expM', count: 2, flag: 'item_cave2_bond3' },
      { x: 8, y: 4, item: 'expM', count: 1, flag: 'item_cave2_seed' },
      { x: 22, y: 3, item: 'money', count: 800, flag: 'item_cave2_money' },
    ],
    npcs: [
      {
        id: 'noir', name: 'ノワール', x: 15, y: 15, dir: 'down',
        visible: (s) => !s.flags.noirDefeated,
        look: G.Looks.noir,
        talk: (E) => noirEvent(E),
      },
      {
        id: 'jinDown', name: 'ジン', x: 12, y: 15, dir: 'down',
        visible: (s) => !!s.flags.rivalForestMet && !s.flags.jinLeftCave,
        look: G.Looks.rival,
        talk: ['くっ……。'],
      },
      {
        id: 'oldadventurer', name: '老冒険者', x: 22, y: 13, dir: 'down',
        look: { hair: '#c8c8c8', beard: '#e0e0e0', coat: '#6a5a3a', shirt: '#4a3a2a', pants: '#3a3a3a' },
        talk: async (E) => {
          await E.say('老冒険者', [
            'この下の石の扉……あれは何百年も開いたことのない封印じゃ。',
            'じゃが近ごろ、扉の向こうから強い気配がする。\nまるで、誰かが封印をこじ開けようとしておるような……。',
          ]);
          if (E.flag('sawHoodedForest')) {
            await E.say('老冒険者', '黒いフードの者を見た？\n……なるほどのう。やつら、封印に用があるのかもしれん。');
          }
          await E.say('老冒険者', '言い伝えでは、封印の守護者は大地の力をもつという。\n雷はほとんど効かん……風の技を用意しておくことじゃ。\n手前の階で、先に回復しておくのも忘れるでないぞ。');
        },
      },
    ],
    objects: [
      // 癒しの灯石（B2の回復ポイント。見た目はタイルの灯石そのもの）
      {
        type: 'none', x: 9, y: 4,
        talk: async (E) => {
          G.Party.healAll();
          G.Audio.se('heal');
          await E.narrate('ひときわ大きな灯石だ。\nあたたかな光が、幻獣たちの傷と疲れを癒やしていく……。\n（パーティが全回復した）');
          G.autoSave();
        },
      },
      // 封印の扉（ノワールを倒すと開く）
      {
        type: 'sealgate', x: 14, y: 16, w: 2, h: 1,
        visible: () => !G.hasFlag('sealOpen'),
        text: '古びた石の扉が、固く閉ざされている。\n中央の紋様が、紫色にあやしく脈打っている……。',
      },
      // 港町への抜け道をふさぐ大岩（第1章クリアで消える）
      {
        type: 'boulder', x: 21, y: 18,
        visible: () => !G.hasFlag('chapter1Clear'),
        text: '大きな岩が道をふさいでいる。\nすき間から、かすかに潮の香りがする……。',
      },
      // 封印の奥の守護者（ボス3）
      {
        type: 'monster', speciesId: '059', x: 15, y: 18, scale: 2,
        visible: () => !G.hasFlag('guardianCalmed'),
        talk: (E) => guardianEvent(E),
      },
    ],
    triggers: [
      { x: 9, y: 14, w: 1, h: 2, flag: 'noirEvent', when: (s) => !s.flags.noirDefeated, run: (E) => noirEvent(E) },
      { x: 22, y: 14, w: 1, h: 2, flag: 'noirEvent', when: (s) => !s.flags.noirDefeated, run: (E) => noirEvent(E) },
      { x: 10, y: 17, w: 11, h: 1, flag: 'guardianEvent', when: (s) => !s.flags.guardianCalmed, run: (E) => guardianEvent(E) },
    ],
  });

  // ---------------- ボス2：黒環団幹部ノワール ----------------
  async function noirEvent(E) {
    E.set('sawSealGate');
    await E.narrate('暗がりの奥から、話し声が聞こえる……。');
    if (G.Field.npcs.some((n) => n.id === 'jinDown')) {
      await E.say('ジン', ['くっ……{name}、か……。', 'あの女……強え……。\nオレの幻獣が、まるで歯が立たなかった……。']);
    }
    E.face('noir', G.Field.p.x < 15 ? 'left' : 'right');
    await E.say('黒ずくめの女', [
      'あら、また子どもが一匹。',
      'わたしは『黒環団（こっかんだん）』の幹部、ノワール。\n森では、部下が世話になったわね。',
      '黒環団は、幻獣を『器』として環に束ね、その力で世界の理を塗りかえる者たち。',
      'この扉の奥には、いにしえの守護者が眠っている。\nその力、わたしたちの環に加えさせてもらうわ。',
    ]);
    const c = await E.ask('ノワール', [
      'そこのボウヤは、強さを求めてわたしに挑んだ。',
      'でも、ただ強いだけの幻獣なんて、ただの道具。\n道具の扱いなら、わたしのほうが上だったってこと。',
    ], ['幻獣は道具じゃない！', '……'], 1);
    E.set('noirAnswer', c === 0 ? 'bond' : 'silent');
    await E.say('ノワール', c === 0
      ? 'ふふ……なら、その言葉。力で証明してごらんなさい！'
      : '怖くて声も出ない？　いいわ、遊んであげる。');
    const r = await G.Battle.fight('noir');
    if (r !== 'win') { E.set('noirEvent', false); return; } // 負けたら何度でも挑戦できる
    await E.say('ノワール', [
      '……いいわ。今日のところは引いてあげる。',
      'でも、もう遅い。封印の鍵は、すでに解いてあるの。',
      '目覚めた守護者は、近づく者すべてを敵とみなす……。\nせいぜい、がんばることね。',
      '黒環の導きのあらんことを。',
    ]);
    await E.walkNpc('noir', G.Field.p.x < 15 ? 'rrr' : 'lll', 0.14);
    E.hideNpc('noir');
    E.set('noirDefeated');
    await E.narrate('ゴゴゴゴゴ……！！\n石の扉が、ひとりでに開いていく……！');
    E.set('sealOpen');
    G.Field.buildSolid();
    G.autoSave();
    if (G.Field.npcs.some((n) => n.id === 'jinDown')) {
      const bond = (E.flag('rivalBond') || 0) >= 1;
      await E.say('ジン', [
        '……見てたぜ。',
        'あいつの言うとおり、オレは幻獣を……道具みたいに扱ってたのかもしれねえ。',
        bond ? 'お前の幻獣は、お前のために戦ってた。……オレのとは、何かが違った。' : '……ちっ。認めたくはねえがな。',
      ]);
      if (bond) {
        await E.say('ジン', 'これ、持ってけ。……借りを作るのは、性に合わねえんだ。');
        await E.give('hipotion', 2);
      }
      await E.say('ジン', 'オレは……いったん村へ戻る。\n扉の奥のやつは、お前にまかせた。……しくじるなよ。');
      await E.walkNpc('jinDown', 'lll', 0.2);
      E.hideNpc('jinDown');
      E.set('jinLeftCave');
    }
  }

  // ---------------- ボス3：封印の守護者 ----------------
  async function guardianEvent(E) {
    await E.narrate([
      'ゴゴゴゴ……！',
      'いにしえの守護者が、怒りに燃える目でこちらをにらんでいる！\nまわりの岩陰からも、守護者の眷属が姿を現した！',
    ]);
    const r = await G.Battle.fight('guardian', { bg: 'cave' });
    if (r !== 'win') { E.set('guardianEvent', false); return; }
    await E.narrate('守護者たちは、静かに動きを止めた……。\n……どこからか、重く、やさしい声が響く。');
    await E.say('守護者の声', [
      '人の子よ。\n黒き環の者に眠りを破られ、我は怒りに我を失っていた。',
      'だが、そなたの幻獣たちは……そなたを信じ、そなたのために戦った。\nそこに、確かな『絆』を見た。',
      'これを受け取るがよい。\nいにしえの盟約の証――『絆の紋章』だ。',
    ]);
    await E.give('kizunaEmblem', 1);
    await E.say('守護者の声', [
      '黒き環の者たちは、各地の封印を解き、眠れる力を集めている。',
      'やがて……空を渡る竜の封印にも、その手を伸ばすであろう。',
      '人の子よ、行け。\nそなたの旅は、まだ始まったばかりだ。',
    ]);
    E.set('guardianCalmed');
    E.set('chapter1Boss');
    G.Field.buildSolid();
    G.autoSave();
    await E.narrate('守護者は再び、深い眠りについた……。\n（ソラノ村へ戻り、ミモザ博士に報告しよう）');
  }
})(window.Game);
