// ささやきの森（草原の北）と森の小屋
(function (G) {
  'use strict';

  const HOOD = { hood: '#1e1a28', coat: '#26222e', shirt: '#1a1620', pants: '#1a1620', eyes: '#e04040' };

  G.registerMap({
    id: 'forest',
    name: 'ささやきの森',
    outdoor: true,
    bg: '#1f4a2a',
    encounter: 'forest',
    tiles: [
      'KKKKKKKKKKKKKKKKKKMKKKKKKKKKKKKKKKKK',
      'YYKKKKKKKKKKKKKKKg=gKKKKKKKKKKKKKKYY',
      'YYYggGGGGggvgggggg=ggggGGGGGggvggYYY',
      'YYYgGGGGGGggggOggg=gggGGGGGGgggYgYYY',
      'YYYgGGGGGgggYYgggg=ggggGGGGggggYYYYY',
      'YYYggggggggYYYYggg=gggggggggggYYYYYY',
      'YYYggvgggggYYYYggg=gggggggvgggggYYYY',
      'YYYYYYggggggYYgggg===========ggggYYY',
      'YYYYYYYggggggggggg=ggggggggg=ggggYYY',
      'YYYYYYYYggggGGGggg=gYYYYgggg=ggggYYY',
      'YYYYYYYYgggGGGGggg=gYYYYYggg=gvggYYY',
      'YYYYYggggggGGGGggg=gYYYYYggg=ggggYYY',
      'YYYYYggggggGGGggvg=gYYYYgggg=ggggYYY',
      'YYYYYggggggggggggg=gYYYggggggggggYYY',
      'YYYYYgg============gYYYYgggggggYYYYY',
      'YYYYYYggGGGGgggggg=gYYYYYYYggYYYYYYY',
      'YYYYgggGGGGGgggggg=ggggGGGGGggggYYYY',
      'YYYggggGGGGggggvgg=gggGGGGGGgggggYYY',
      'YY~~~~~~~~~~~~~~~~h~~~~~~~~~~~~~~~YY',
      'YY~~~~~~~~~~~~~~~~h~~~~~~~~~~~~~~~YY',
      'YYYgggGGGGGggggggg=gggggGGGGGGgggYYY',
      'YYYggGGGGGGgggOggg=ggggGGGGGGGgggYYY',
      'YYYgGGGGGGgggggggg=gggGGGGGGggvggYYY',
      'YYYggGGGGgggYYgggg=ggggGGGGgggYYYYYY',
      'YYYgggggggYYYYgggg=ggggggggggYYYYYYY',
      'YYYYYYgggggggggggg=gggggggggYYYYYYYY',
      'YYYYYYYYYggggggggg=ggggggYYYYYYYYYYY',
      'YYYYYYYYYYYYYYYYgg=ggYYYYYYYYYYYYYYY',
      'YYYYYYYYYYYYYYYYYg=gYYYYYYYYYYYYYYYY',
      'YYYYYYYYYYYYYYYYYY=YYYYYYYYYYYYYYYYY',
    ],
    buildings: [
      { x: 5, y: 11, w: 5, h: 3, style: 'hut', label: '森の小屋',
        door: { x: 7, to: 'forest_hut', tx: 4, ty: 6 } },
    ],
    objects: [
      {
        type: 'shrine', x: 30, y: 9,
        talk: async (E) => {
          await E.narrate([
            '苔むした小さな祠だ。石に文字が刻まれている……',
            '『いにしえ、空を渡る大いなる竜あり。\n　人と幻獣の盟約を見届け、天へと還る』',
            '『空翔ける大鳥と 風の神 ふたたび交わるとき\n　竜は再び 翼をひろげん』',
          ]);
          E.set('readForestShrine');
        },
      },
    ],
    signs: [
      { x: 20, y: 27, text: '↑ 北：灯石の洞窟\n↓ 南：そよかぜ草原' },
      { x: 16, y: 13, text: '← 森の小屋（休憩・回復できます）' },
    ],
    warps: [
      { x: 18, y: 29, to: 'meadow', tx: 16, ty: 1, dir: 'down' },
      { x: 18, y: 0, to: 'cave1', tx: 15, ty: 20, dir: 'up' },
    ],
    items: [
      { x: 13, y: 3, item: 'hipotion', count: 1, flag: 'item_forest_hipotion' },
      { x: 4, y: 17, item: 'expS', count: 3, flag: 'item_forest_bond2' },
      { x: 31, y: 16, item: 'money', count: 300, flag: 'item_forest_money' },
      { x: 22, y: 24, item: 'cure', count: 2, flag: 'item_forest_cure' },
      { x: 32, y: 12, item: 'expS', count: 2, flag: 'item_forest_seed' },
    ],
    npcs: [
      {
        id: 'woodcutter', name: '木こり', x: 20, y: 26, dir: 'down',
        look: { hat: '#a04a2a', beard: '#6a4a2a', shirt: '#7a3a2a', pants: '#3a3a2a' },
        talk: [
          'よう、ここは『ささやきの森』だ。\n風が吹くと、木々がひそひそ話しているように聞こえるだろう？',
          'この森には、土や光の幻獣が多い。\n土のやつらには風の技、光のやつらには闇の技がよく効くぞ。',
        ],
      },
      {
        id: 'buggirl', name: '虫とり少女', x: 10, y: 22, dir: 'right', wander: 1,
        look: { hair: '#6a3a2a', style: 'long', hat: '#e0c040', shirt: '#e08a3a', pants: '#4a4a3a' },
        talk: [
          'この森でね、ぴかぴか光る精霊を見たの！',
          'でも、近づいたらすぐ消えちゃった……。\n月明かりの夜にしか出てこないんだって。',
        ],
      },
      {
        id: 'rivalF', name: 'ジン', x: 18, y: 23, dir: 'down', spawnOnly: true,
        look: G.Looks.rival,
        talk: ['……。'],
      },
      {
        id: 'hooded', name: '黒フードの人物', x: 30, y: 11, dir: 'left', spawnOnly: true,
        look: HOOD,
        talk: ['……。'],
      },
    ],
    triggers: [
      {
        // 森に入ってすぐ、ライバルのジンが待ちかまえている（ライバル戦1）
        x: 18, y: 27, flag: 'rivalForestMet',
        run: async (E) => {
          await E.say('？？？', 'おい、待てよ。');
          E.showNpc('rivalF', 18, 23, 'down');
          await E.walkNpc('rivalF', 'ddd');
          const bond = E.flag('rivalAnswer') === 'bond';
          await E.say('ジン', [
            '……来たか、{name}。番人の試練、お前も越えたらしいな。',
            bond ? '『絆だって力になる』……研究所でそう言ったよな。\nその言葉が本物かどうか、ここで確かめてやる！'
              : '研究所では、だんまりだったな。\nお前が何を考えてるのか……幻獣で語ってみせろ！',
          ]);
          const r = await G.Battle.fight('rival1');
          if (r === 'win') {
            E.set('rival1Won');
            await E.say('ジン', [
              '……チッ、まぐれだ。',
              'だが……お前の幻獣、ちゃんとお前の声に応えてたな。\nオレの指示より、ほんの少しだけ……速かった。',
            ]);
          } else {
            await E.say('ジン', [
              'これが強さだ。',
              '絆だの何だの言ってるうちに、置いていかれるぞ。',
            ]);
          }
          const c = await E.ask('ジン', '……なんだよ、その顔は。', ['次も 負けない！', 'いい勝負だった', '……'], 2);
          if (c === 0) { E.set('rivalBond', (E.flag('rivalBond') || 0) + 1); await E.say('ジン', 'ハッ、言ってろ。'); }
          else if (c === 1) { E.set('rivalBond', (E.flag('rivalBond') || 0) + 1); await E.say('ジン', '……フン。……悪くは、なかった。'); }
          else await E.say('ジン', '……ちっ、張り合いのないやつだ。');
          await E.say('ジン', 'オレは先に洞窟へ行く。\n黒フードの連中が何か企んでるって噂だ。……強いやつがいるなら、望むところだぜ。');
          await E.walkNpc('rivalF', 'uuuu', 0.16);
          E.hideNpc('rivalF');
        },
      },
      {
        // 東の空き地に初めて入ると、謎の人物と出会う
        x: 28, y: 10, w: 5, h: 3, flag: 'sawHoodedForest',
        run: async (E) => {
          const p = G.Field.p;
          const sx = p.x === 30 && p.y === 11 ? 31 : 30;
          await E.narrate('……ガサッ！\n茂みの奥で、何かが動いた。');
          E.showNpc('hooded', sx, 11, p.x < sx ? 'left' : 'right');
          await E.say('黒フードの人物', [
            '……子どもか。\nこんな森の奥に、何の用だ。',
            'この森の幻獣どもが、我らの『環』にふさわしい器かどうか……\n見定めに来ただけだ。',
            'おまえの連れている幻獣……フッ、まだ青いな。\n邪魔をするなら容赦はせん。……今は、見逃してやろう。',
          ]);
          await E.walkNpc('hooded', sx === 30 ? 'rruuuu' : 'ruuuu', 0.16);
          E.hideNpc('hooded');
          await E.narrate('黒いフードの人物は、森の奥へと消えていった……。');
          if (E.has('blackemblem')) {
            await E.narrate('去りぎわ、胸元に黒い輪の紋章が見えた。\n……草原で拾ったバッジと、同じ紋章だ！');
            E.set('linkedEmblem');
          } else {
            await E.narrate('去りぎわ、胸元に黒い輪の紋章が見えた気がする……。');
          }
        },
      },
    ],
  });

  // ---------------- 森の小屋 ----------------
  G.registerMap({
    id: 'forest_hut',
    name: '森の小屋',
    tiles: [
      'wwwwwwwwww',
      'wkkp__pkkw',
      'w________w',
      'w_tt_ccc_w',
      'w________w',
      'wmm____mmw',
      'w________w',
      'wwwwxxwwww',
    ],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'forest', tx: 7, ty: 14, dir: 'down' }],
    inspect: {
      k: '薬草の図鑑がずらりと並んでいる。',
      t: '乾かした薬草が、いい香りを漂わせている。',
      c: '古い木のカウンターだ。',
    },
    npcs: [
      {
        id: 'hermit', name: '森のおばば', x: 2, y: 4, dir: 'right',
        look: { hair: '#d8d8d8', style: 'long', coat: '#5a7a4a', shirt: '#3a5a3a', pants: '#3a3a2a' },
        talk: async (E) => {
          const c = await E.ask('森のおばば', 'ひっひっ、よう来たね。\n疲れた幻獣を休ませていくかい？', ['休ませる', 'いいえ'], 1);
          if (c !== 0) { await E.say('森のおばば', '無理はするんじゃないよ。'); return; }
          if (!E.state().party.length) { await E.say('森のおばば', 'おや、幻獣を連れておらんのかい。'); return; }
          G.Party.healAll();
          G.Audio.se('heal');
          await E.narrate('薬草を煮つめた、ふしぎな香りの湯気が立ちのぼる……\n幻獣たちは すっかり元気になった！');
          G.autoSave();
          await E.say('森のおばば', E.flag('sawHoodedForest')
            ? '……黒いフードの連中に会ったのかい。\nあやつら、幻獣を「器」と呼んでおるそうじゃ。気味が悪いねぇ。'
            : 'いつでもおいで。ここは旅人の休み場じゃからね。');
        },
      },
      {
        id: 'peddler', name: '行商人', x: 6, y: 2, dir: 'down',
        look: { hat: '#4a6a8a', shirt: '#8a6a4a', pants: '#3a3a4a' },
        talk: async (E) => {
          const c = await E.ask('行商人', 'へい、らっしゃい！\n森の奥まで来た旅人さん向けの品ぞろえだよ！', ['買う', '売る', 'やめる'], 2);
          if (c === 2) return;
          await E.shop('forestHut', c === 0 ? 'buy' : 'sell');
          await E.say('行商人', '毎度あり！　洞窟に行くなら、回復薬は多めにね！');
        },
      },
    ],
  });
})(window.Game);
