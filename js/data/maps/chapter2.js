// =====================================================================
//  第2章「空を渡る竜」：港町リュミエールと3つの地域
//    灯石の洞窟 B2（守護者の間の抜け道）→ 港町リュミエール
//      北：風鳴りの高原（風の祭壇）  東：火山の麓（大地の祠）  高原の西：湖畔の森（花冠の祭壇）
//  流れ：学者ルークの話 → 火山でブラスト（ボス）→ 湖畔でジン（ライバル3）→ 風の祭壇でヴェル（最終ボス）
// =====================================================================
(function (G) {
  'use strict';

  const TOWNFOLK = {
    luke: { hair: '#5a4a3a', glasses: true, coat: '#e8e0d0', shirt: '#4a6a8a', pants: '#3a3a4a' },
    seto: { hair: '#3a2a4a', style: 'long', coat: '#6a4a9a', shirt: '#2a1a3a', pants: '#2a1a3a' },
    sailor: { hat: '#f4f4f4', shirt: '#3a5aa8', pants: '#e8e8e8', beard: '#6a4a2a' },
    keeper: { hair: '#c8c8c8', beard: '#e0e0e0', coat: '#2a4a6a', shirt: '#e8e0c0', pants: '#3a3a3a' },
    kid: { hair: '#e0a040', shirt: '#e05a4a', pants: '#3a5a8a' },
    hiker: { hat: '#6a8a3a', beard: '#4a3a2a', shirt: '#8a5a3a', pants: '#3a3a3a' },
  };

  // ---------------- 港町リュミエール ----------------
  const t = G.MapBuilder(32, 24, '.');
  t.rect(0, 0, 32, 2, '#').rect(30, 0, 2, 24, '#').rect(0, 2, 2, 15, 'K');
  t.rect(0, 17, 32, 2, 's').rect(0, 19, 32, 5, '~');
  t.rect(8, 19, 1, 4, 'h').rect(22, 19, 1, 4, 'h');                 // 桟橋
  t.rect(15, 0, 2, 17, '=');                                          // 北への大通り
  t.rect(2, 10, 30, 2, '=');                                          // 東西の大通り（東の出口へ）
  t.set(1, 10, 'M').set(1, 11, 'M');                                  // 洞窟への入口
  t.set(5, 9, '=').set(23, 9, '=');                                   // 建物の前
  t.rect(10, 13, 12, 3, 'o');                                         // 広場
  t.scatter(',', 18, 2, 2, 28, 15, ['.'], 11);
  G.registerMap({
    id: 'lumiere', name: '港町リュミエール', outdoor: true, autosave: true, bg: '#2a5a8a',
    tiles: t.rows(),
    buildings: [
      { x: 3, y: 5, w: 6, h: 4, style: 'healer', label: '癒しの泉', door: { x: 5, to: 'lumiere_heal', tx: 4, ty: 6 } },
      { x: 21, y: 5, w: 5, h: 4, style: 'shop', label: '港商会', door: { x: 23, to: 'lumiere_shop', tx: 4, ty: 6 } },
      { x: 26, y: 12, w: 3, h: 4, style: 'lab', label: '灯台', door: { x: 27, locked: '灯台の扉には鍵がかかっている。\n中から、波の音にまじって古い歌が聞こえる……。' } },
      { x: 3, y: 12, w: 5, h: 3, style: 'house', label: '鑑定屋', door: { x: 5, to: 'lumiere_appraise', tx: 4, ty: 6 } },
    ],
    signs: [
      { x: 14, y: 8, text: '港町リュミエール\n↑ 北：風鳴りの高原　→ 東：火山の麓\n← 西：灯石の洞窟' },
    ],
    warps: [
      { x: 1, y: 10, w: 1, h: 2, to: 'cave2', tx: 20, ty: 18, dir: 'left' },
      { x: 15, y: 0, w: 2, h: 1, to: 'highland', tx: 17, ty: 25, keepX: true, dir: 'up' },
      { x: 31, y: 10, w: 1, h: 2, to: 'volcano', tx: 2, ty: 12, keepY: true, dir: 'right' },
    ],
    items: [
      { x: 28, y: 17, item: 'hipotion', count: 2, flag: 'item_lum_hipotion' },
    ],
    npcs: [
      {
        id: 'luke', name: '学者ルーク', x: 12, y: 12, dir: 'down', look: TOWNFOLK.luke,
        talk: async (E) => {
          if (!E.flag('ch2Briefed')) {
            await E.say('学者ルーク', [
              'きみが {name}くんか！　ミモザ博士から手紙で聞いているよ。\n僕はルーク。この港町で、空の伝承を研究している。',
              '……落ち着いて聞いてくれ。黒環団が、北の『風鳴りの高原』にある\n『風の祭壇』を狙っている。',
              '祭壇には、空を渡る竜――天空竜アストラが眠っているんだ。\nその封印をとくには、ふたつの『鍵石』がいる。',
              'ひとつは東の『火山の麓』にある大地の祠。\nもうひとつは、高原の西にある『湖畔の森』の花冠の祭壇だ。',
              '黒環団より先に、ふたつの鍵石を手に入れてほしい。\n……頼めるかい？',
            ]);
            E.set('ch2Briefed');
            await E.give('moondrop', 1);
            await E.say('学者ルーク', 'それは『月の雫』。ある種の幻獣を進化させる、不思議な雫だよ。\n旅の助けになるはずだ。');
            G.autoSave();
            return;
          }
          const keys = (E.has('fireKey') ? 1 : 0) + (E.has('waterKey') ? 1 : 0);
          if (E.flag('chapter2Clear')) await E.say('学者ルーク', 'アストラが残した『空の羽』……。\n空翔ける大鳥と、風の神。その意味を解いたとき、きっと竜はふたたび現れる。');
          else if (keys === 2) await E.say('学者ルーク', 'ふたつの鍵石がそろった！\n北の高原、風の祭壇へ急いでくれ！');
          else await E.say('学者ルーク', `鍵石はあと ${2 - keys} つ。\n火山の麓の大地の祠と、湖畔の森の花冠の祭壇だ。`);
        },
      },
      {
        id: 'seto', name: '配合屋セト', x: 18, y: 13, dir: 'down', look: TOWNFOLK.seto,
        talk: async (E) => {
          const c = await E.ask('配合屋セト', 'オルド師匠の兄弟子、セトだよ。\n港でも配合ができるように、出張中なのさ。', ['配合する', 'やめる'], 1);
          if (c !== 0) return;
          if (G.Party.all().length < 2) { await E.say('配合屋セト', '親になる幻獣が2体いないとね。'); return; }
          const res = await E.screen(G.UIScreens.fusion());
          if (res) { E.set('fusedOnce'); await E.say('配合屋セト', `いい子が生まれたね。${G.Species[res.child.speciesId].name}か……大切にしなよ。`); }
        },
      },
      {
        id: 'sailor', name: '船乗り', x: 8, y: 18, dir: 'up', look: TOWNFOLK.sailor,
        talk: [
          '海の向こうには、もっと大きな大陸があるらしい。\nいつか幻獣と一緒に渡ってみたいもんだ。',
          '湖畔の森の奥には、深い水の洞と岩の海岸があってな。\n水の幻獣がうようよしてるって話だ。',
        ],
      },
      {
        id: 'keeper', name: '灯台守', x: 27, y: 16, dir: 'down', look: TOWNFOLK.keeper,
        talk: [
          'この灯台に伝わる歌じゃ。\n『空翔ける大鳥、風の神と ともに舞うとき、蒼き竜は目を覚ます』',
          '風の祭壇の竜は、人と幻獣の盟約を見届けた竜だという。\n……黒環団などに渡してはならん。',
        ],
      },
      {
        id: 'portkid', name: '男の子', x: 20, y: 16, dir: 'left', wander: 2, look: TOWNFOLK.kid,
        talk: ['火山の麓には、炎の幻獣がいっぱいいるんだって！', 'でも、黒いマントの怖い人が祠のほうに行くのを見たよ……。'],
      },
    ],
    onEnter: async (E) => {
      if (E.flag('ch2Arrived')) return;
      E.set('ch2Arrived');
      await E.narrate('潮の香りと、かもめの声。\n洞窟の抜け道の先には、海に面した港町が広がっていた。');
      await E.narrate('……ここが『港町リュミエール』だ。\n（広場にいる学者ルークに話しかけてみよう）');
    },
  });

  // ---------------- リュミエールの建物 ----------------
  G.registerMap({
    id: 'lumiere_heal', name: '癒しの泉 リュミエール',
    tiles: ['wwwwwwwwww', 'wp______pw', 'w________w', 'w_cccccc_w', 'w________w', 'wmm____mmw', 'w________w', 'wwwwxxwwww'],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'lumiere', tx: 5, ty: 9, dir: 'down' }],
    inspect: { c: 'つるりとした白いカウンターだ。' },
    npcs: [{
      id: 'nurse2', name: '泉守りミラ', x: 4, y: 2, dir: 'down',
      look: { hair: '#6ab0e0', style: 'long', coat: '#ffffff', shirt: '#3aa6a0', pants: '#3a6a6a' },
      talk: async (E) => {
        const c = await E.ask('泉守りミラ', 'ソラノ村のセラは、わたしの妹なんです。\nあなたの幻獣を回復しますか？', ['はい', 'いいえ'], 1);
        if (c !== 0 || !E.state().party.length) { await E.say('泉守りミラ', 'またいつでもどうぞ。'); return; }
        G.Party.healAll();
        G.Audio.se('heal');
        await E.narrate('♪ ～ ♪ ～ ～ ♪\n幻獣たちは すっかり元気になった！');
        G.autoSave();
      },
    }],
  });
  G.registerMap({
    id: 'lumiere_shop', name: 'リュミエール港商会',
    tiles: ['wwwwwwwwww', 'wkkkkkkkkw', 'w________w', 'wccccc___w', 'w________w', 'w_kk__kk_w', 'w________w', 'wwwwxxwwww'],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'lumiere', tx: 23, ty: 9, dir: 'down' }],
    inspect: { k: '異国の品々が並んでいる。月の雫もあるようだ。', c: '潮風で少し色あせたカウンターだ。' },
    npcs: [{
      id: 'clerk2', name: '商人', x: 3, y: 2, dir: 'down', look: { hair: '#8a5a2a', coat: '#3a5aa8', shirt: '#f5ecd8', pants: '#3a3a3a' },
      talk: async (E) => {
        const c = await E.ask('商人', 'いらっしゃい！　港商会へようこそ。', ['買う', '売る', 'やめる'], 2);
        if (c === 2) return;
        await E.shop('lumiere', c === 0 ? 'buy' : 'sell');
      },
    }],
  });

  // ---------------- 鑑定屋：個体値（生まれつきの才能）を鑑定できるようにする ----------------
  const GRADE = [[170, '伝説級の器'], [150, '逸材'], [120, '優秀'], [90, '平均的']];
  G.registerMap({
    id: 'lumiere_appraise', name: '鑑定屋 ヨミの館',
    tiles: ['wwwwwwwwww', 'wkkkppkkkw', 'w________w', 'w__cccc__w', 'w________w', 'wm______mw', 'w________w', 'wwwwxxwwww'],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'lumiere', tx: 5, ty: 15, dir: 'down' }],
    inspect: { k: ['『才能の書』\n……幻獣の才は6つ。HP・攻撃・防御・素早さ・特殊攻撃・特殊防御。\n才の高き能力ほど、よく伸びる……', '『血の継承』\n……親の才は、子に受け継がれる。優れた親からは、優れた子が生まれやすい……'], c: '水晶玉が置かれたカウンターだ。' },
    npcs: [{
      id: 'appraiser', name: '鑑定士ヨミ', x: 4, y: 2, dir: 'down',
      look: { hood: '#3a2a5a', coat: '#4a3a7a', shirt: '#c8b0f0', pants: '#2a1a3a', eyes: '#f0d040' },
      talk: async (E) => {
        const I = G.Individual;
        const flag = G.GrowthConfig.APPRAISAL_FLAG;
        if (!E.flag(flag)) {
          await E.say('鑑定士ヨミ', [
            'ようこそ、鑑定屋へ。わたしはヨミ。\n幻獣の「生まれつきの才能」を見る者です。',
            '同じ種族でも、才能は一体一体ちがうもの。\n才能の高い能力ほど、レベルが上がったときによく伸びるのです。',
            'あなたの幻獣たちの才能……\nこれからは、数値と評価で分かるようにしておきましょう。',
          ]);
          E.set(flag);
          await E.narrate('幻獣の才能（個体値）が 見られるようになった！\n（メニュー → 幻獣 → 育成情報）');
        }
        const c = await E.ask('鑑定士ヨミ', '今日は何を見ましょう？', ['手持ちを鑑定', '才能について聞く', 'やめる'], 2);
        if (c === 0) {
          for (const m of E.state().party) {
            const total = I.ivTotal(m);
            const grade = (GRADE.find(([min]) => total >= min) || [0, '伸びしろあり'])[1];
            const best = I.KEYS.slice().sort((x, y) => I.iv(m, y) - I.iv(m, x))[0];
            const titles = I.titles(m).map((t) => `『${t.name}』`).join('');
            await E.say('鑑定士ヨミ', `${m.name}……総合評価は「${grade}」（${total}）。\nいちばんの才能は ${I.NAMES[best]}（${I.iv(m, best)}・${I.rank(I.iv(m, best)).rank}）ですね。` +
              (titles ? `\n……この子は ${titles} の称号にふさわしい。` : ''));
          }
        } else if (c === 1) {
          await E.say('鑑定士ヨミ', [
            '才能は 0〜31。E・D・C・B・A・S の6段階で表します。\nS は 28 以上、めったに見られない逸材です。',
            '配合で生まれる子は、両親から2つずつ才能を受け継ぎ、\n残りは運しだい。ただし、親が優秀なほど子も優秀になりやすい。',
            '才能の高い親どうしを掛け合わせ、代を重ねれば……\nいつか、すべてが極まった個体に出会えるかもしれませんね。',
          ]);
        }
      },
    }],
  });

  // ---------------- 風鳴りの高原（雷鳴平原・風切り高原・風の祭壇） ----------------
  const h = G.MapBuilder(36, 28, '.');
  h.border(2, '#');
  h.rect(17, 5, 2, 23, '=');                          // 南の出口から祭壇へ
  h.rect(0, 13, 17, 2, '=');                          // 西の出口（湖畔の森）
  h.rect(13, 2, 10, 4, 'o');                          // 祭壇の広場
  h.blob(7, 8, 4, 3, ';').blob(28, 9, 5, 3, ';').blob(8, 21, 5, 3, ';').blob(28, 21, 5, 3, ';').blob(26, 15, 3, 2, ';');
  h.scatter('r', 14, 2, 2, 32, 24, ['.'], 5).scatter(',', 16, 2, 2, 32, 24, ['.'], 9);
  h.rect(19, 9, 17, 2, '=');                          // 東の出口（北の氷原）
  h.set(32, 9, '#').set(33, 9, '#');                  // 氷原への道は1マス幅（見張りが立つ）
  G.registerMap({
    id: 'highland', name: '風鳴りの高原', outdoor: true, bg: '#2a5a2a', encounter: 'highland', place: 'highland',
    tiles: h.rows(),
    objects: [
      {
        type: 'altar', x: 17, y: 2, color: '#8af0ff',
        text: '風の祭壇だ。ふたつのくぼみがある……。\n鍵石をはめるための場所のようだ。',
      },
      { type: 'altar', x: 31, y: 5, color: '#ffe070', text: '雷の祭壇だ。\nあたりには、雷をまとった精霊の気配がただよっている。' },
    ],
    signs: [
      { x: 16, y: 24, text: '↑ 風の祭壇　↓ 港町リュミエール　← 湖畔の森' },
      { x: 30, y: 8, text: '→ 北の氷原\n（吹雪のため、許可なく立ち入らないこと）' },
    ],
    warps: [
      { x: 17, y: 27, w: 2, h: 1, to: 'lumiere', tx: 15, ty: 1, keepX: true, dir: 'down' },
      { x: 0, y: 13, w: 1, h: 2, to: 'lakeside', tx: 31, ty: 13, keepY: true, dir: 'left' },
      { x: 35, y: 9, w: 1, h: 2, to: 'snowfield', tx: 1, ty: 12, keepY: true, dir: 'right' },
    ],
    items: [
      { x: 30, y: 24, item: 'moondrop', count: 1, flag: 'item_high_moon' },
      { x: 4, y: 4, item: 'bondstone3', count: 1, flag: 'item_high_bond3' },
    ],
    npcs: [
      {
        id: 'hhiker', name: '山男', x: 20, y: 18, dir: 'left', look: TOWNFOLK.hiker,
        talk: ['この高原は、風と雷の幻獣の住みかだ。\n森の精霊モリノタマは、この高原で育つと風の精霊に姿を変えるらしい。'],
      },
      { id: 'vel', name: 'ヴェル', x: 18, y: 3, dir: 'down', spawnOnly: true, look: G.Looks.vel, talk: ['……。'] },
      {
        // 第2章をクリアするまで、北の氷原への道をふさぐ
        id: 'snowguard', name: '氷原の見張り', x: 33, y: 10, dir: 'left', look: TOWNFOLK.hiker,
        visible: (s) => !s.flags.chapter2Clear,
        talk: [
          'この先は『北の氷原』。一年じゅう吹雪がやまない、きびしい土地だ。',
          '黒環団が高原をうろついている今は、とても通せんな。\n……祭壇の騒ぎが片づいたら、また来るといい。',
        ],
      },
    ],
    triggers: [
      {
        // 祭壇の広場に入ると、最終決戦
        x: 13, y: 4, w: 10, h: 2, flag: 'ch2Finale', when: (s) => !s.flags.chapter2Clear,
        run: (E) => finale(E),
      },
    ],
  });

  // ---------------- 火山の麓（大地の祠） ----------------
  const v = G.MapBuilder(34, 26, 'a');
  v.border(2, 'n');
  v.path([[0, 12], [10, 12], [10, 6], [26, 6], [26, 4]], '=', 2);
  v.blob(18, 17, 6, 3, 'l').blob(6, 22, 3, 1, 'l').blob(28, 11, 2, 2, 'l');
  v.blob(5, 18, 4, 3, 'A').blob(28, 18, 4, 3, 'A').blob(15, 10, 3, 2, 'A').blob(5, 6, 3, 2, 'A');
  v.scatter('n', 14, 2, 2, 30, 22, ['a'], 3);
  v.rect(24, 2, 6, 2, 'a');
  G.registerMap({
    id: 'volcano', name: '火山の麓', outdoor: true, bg: '#3a1410', encounter: 'volcano', place: 'volcano',
    tiles: v.rows(),
    objects: [{ type: 'altar', x: 27, y: 2, color: '#ff8a3a', lit: () => !G.hasFlag('keyFire'), text: '大地の祠だ。' }],
    warps: [{ x: 0, y: 12, w: 1, h: 2, to: 'lumiere', tx: 30, ty: 10, keepY: true, dir: 'left' }],
    items: [
      { x: 30, y: 22, item: 'hipotion', count: 2, flag: 'item_vol_hipotion' },
      { x: 3, y: 3, item: 'money', count: 1500, flag: 'item_vol_money' },
    ],
    npcs: [
      {
        id: 'blast', name: 'ブラスト', x: 26, y: 3, dir: 'down', visible: (s) => !s.flags.keyFire, look: G.Looks.blast,
        talk: (E) => volcanoEvent(E),
      },
      {
        id: 'vhiker', name: '温泉めぐりの旅人', x: 4, y: 10, dir: 'right', look: TOWNFOLK.hiker,
        talk: ['火山の幻獣は、炎の技がとにかく強烈だ。\n水の技をもっていくといい。炎は水に弱いからな。', '……それにしても、祠のほうから高笑いが聞こえるんだが。'],
      },
    ],
    triggers: [{ x: 22, y: 6, w: 1, h: 2, flag: 'ch2BlastMet', when: (s) => !s.flags.keyFire, run: (E) => volcanoEvent(E) }],
  });

  // ---------------- 湖畔の森（古樹の森・花冠の庭） ----------------
  const l = G.MapBuilder(34, 26, 'g');
  l.border(2, 'Y');
  l.blob(14, 12, 6, 4, '~');
  l.path([[33, 13], [22, 13], [22, 20], [5, 20], [5, 5], [11, 5]], '=', 1);
  l.rect(3, 2, 10, 3, '.').scatter(',', 16, 3, 2, 10, 3, ['.'], 4);  // 花冠の庭
  l.blob(27, 6, 3, 2, 'G').blob(28, 19, 3, 2, 'G').blob(14, 22, 4, 1, 'G').blob(9, 10, 2, 3, 'G');
  l.scatter('Y', 30, 2, 2, 30, 22, ['g'], 21).scatter('v', 12, 2, 2, 30, 22, ['g'], 17);
  l.rect(32, 13, 2, 2, '=');
  G.registerMap({
    id: 'lakeside', name: '湖畔の森', outdoor: true, bg: '#1f4a2a', encounter: 'lakeside', place: 'lakeside',
    tiles: l.rows(),
    objects: [{ type: 'altar', x: 8, y: 2, color: '#ff9ad0', lit: () => !G.hasFlag('keyWater'), text: '花冠の祭壇だ。' }],
    warps: [{ x: 33, y: 13, w: 1, h: 2, to: 'highland', tx: 1, ty: 13, keepY: true, dir: 'right' }],
    items: [
      { x: 30, y: 4, item: 'moondrop', count: 1, flag: 'item_lake_moon' },
      { x: 3, y: 22, item: 'bondstone3', count: 1, flag: 'item_lake_bond3' },
    ],
    npcs: [
      {
        id: 'jin3', name: 'ジン', x: 8, y: 4, dir: 'down', visible: (s) => !s.flags.keyWater, look: G.Looks.rival,
        talk: (E) => lakeEvent(E),
      },
    ],
  });

  // ================= イベント =================

  // 火山：黒環団幹部ブラスト（ボス）
  async function volcanoEvent(E) {
    E.face('blast', 'down');
    await E.say('ブラスト', ['おっと、ガキが一匹。\nここは黒環団のブラスト様の狩り場だぜ。', 'この祠の『炎の鍵石』は、もうオレのもんだ。\n首領ヴェル様に届けりゃ、空の竜がオレたちの手に入る！']);
    const r = await G.Battle.fight('blast', { bg: 'volcano' });
    if (r !== 'win') { E.set('ch2BlastMet', false); return; }
    await E.say('ブラスト', ['くそっ……ヴェル様に顔向けできねえ……！', 'ええい、持ってけ！　だがな、首領は祭壇でお待ちだ。\nどのみち、お前らに勝ち目はねえよ！']);
    await E.give('fireKey', 1);
    E.set('keyFire');
    await E.walkNpc('blast', 'lllll', 0.14);
    E.hideNpc('blast');
    G.autoSave();
  }

  // 湖畔：ライバルのジン（ライバル戦3）
  async function lakeEvent(E) {
    const bond = (E.flag('rivalBond') || 0) >= 1 || E.flag('rivalAnswer') === 'bond';
    await E.say('ジン', [
      '……よう、{name}。やっぱり来たか。',
      '花冠の祭壇の鍵石は、黒環団より先にオレが見つけた。\n……だが、そのまま渡すのは性に合わねえ。',
    ]);
    const r = await G.Battle.fight('rival3', { bg: 'forest' });
    E.set('rival3Done');
    if (r === 'win') E.set('rival3Won');
    await E.say('ジン', r === 'win'
      ? (bond ? ['……いい戦いだった。', 'お前と幻獣を見てると、強さってのは一人で作るもんじゃねえって思えてくる。'] : ['……チッ、また負けか。', 'だが、次は負けねえ。'])
      : ['オレの勝ちだな。……だが、お前の目はまだ死んでねえ。']);
    await E.say('ジン', ['ほらよ、『水の鍵石』だ。', '黒環団の首領……ヴェルとかいうやつを止めてこい。\nオレは森の出口を見張っておく。……ぬかるなよ、{name}。']);
    await E.give('waterKey', 1);
    E.set('keyWater');
    if (bond) E.set('rivalBond', (E.flag('rivalBond') || 0) + 1);
    await E.walkNpc('jin3', 'rrr', 0.2);
    E.hideNpc('jin3');
    G.autoSave();
  }

  // 高原：風の祭壇で最終決戦 → 天空竜アストラ
  async function finale(E) {
    if (!(E.has('fireKey') && E.has('waterKey'))) {
      await E.narrate('風の祭壇に、ふたつのくぼみがある……。\n（炎の鍵石と水の鍵石をそろえてから来よう）');
      E.set('ch2Finale', false);
      return;
    }
    await E.narrate('ふたつの鍵石が、祭壇に吸いよせられるように光りだした……！');
    E.showNpc('vel', 18, 3, 'down');
    await E.say('ヴェル', ['……ご苦労だった、絆の紋章を持つ者よ。\n鍵石を運んでくれたことに、礼を言おう。']);
    const r = await G.Battle.fight('vel', { bg: 'altar' });
    if (r !== 'win') { E.hideNpc('vel'); E.set('ch2Finale', false); return; }
    await E.say('ヴェル', ['……我ら黒環団は、ここで終わりではない。', '環は、いつか必ず閉じる。\nそのときまで、その鎖を大切にしておくがいい……。']);
    await E.walkNpc('vel', 'rrrrr', 0.14);
    E.hideNpc('vel');
    G.Audio.se('evolve');
    await E.narrate(['ゴォォォォ……！！\n高原に、すさまじい風が吹きあれる！', '祭壇の上空に、蒼い翼がひろがった――\n天空竜アストラだ！']);
    await E.say('天空竜アストラ', [
      '……人の子よ。そなたの幻獣たちの声が、我の眠りに届いた。',
      '黒き環は、盟約を鎖と呼んだ。\nだが、そなたたちの絆は、鎖ではなく翼であった。',
      'いずれ、また会おう。\nそなたの手で、空翔ける大鳥と風の神が交わるとき――\n我は、そなたの幻獣として生まれ変わるであろう。',
    ]);
    await E.give('skyFeather', 1);
    E.set('chapter2Clear');
    G.Dex.record('082', 'seen', '風の祭壇');
    await E.narrate('天空竜アストラは、蒼い空へと飛び去っていった……。');
    G.autoSave();
    await E.screen(G.UIScreens.chapterEnd({ chapter: '第2章', title: '空を渡る竜', next: 'To be continued……' }));
    await E.narrate(`――物語は、まだ続く。\n（天空竜アストラ（${G.dexNoLabel('082')}）は、配合で生みだせるらしい……）`);
    E.hideNpc('snowguard');
    await E.narrate('高原の東、『北の氷原』への道が開かれた。\n（氷と雪の幻獣たちが住んでいるという）');
  }

  // ---------------- 北の氷原（第2章クリア後）：氷・無属性の幻獣が住む ----------------
  const s = G.MapBuilder(32, 26, 'e');
  s.border(2, 'P');
  s.rect(0, 12, 10, 2, 'e');                                                 // 西の入口（高原から）
  s.blob(19, 8, 6, 3, 'i').blob(8, 20, 4, 2, 'i');                            // 凍った湖
  s.blob(6, 6, 3, 2, 'E').blob(14, 18, 3, 2, 'E').blob(25, 18, 3, 2, 'E').blob(26, 5, 2, 1, 'E').blob(11, 9, 2, 1, 'E');
  s.scatter('I', 16, 2, 2, 28, 22, ['e'], 21).scatter('P', 12, 3, 3, 26, 20, ['e'], 22);
  s.rect(0, 12, 6, 2, 'e');                                                   // 入口は必ず通れるように
  G.registerMap({
    id: 'snowfield', name: '北の氷原', outdoor: true, bg: '#8aa8c8', encounter: 'snowfield', place: 'snowfield',
    tiles: s.rows(),
    signs: [{ x: 4, y: 11, text: '北の氷原\n← 風鳴りの高原' }],
    warps: [{ x: 0, y: 12, w: 1, h: 2, to: 'highland', tx: 34, ty: 9, keepY: true, dir: 'left' }],
    items: [
      { x: 28, y: 3, item: 'spdBook', count: 1, flag: 'item_snow_spdbook' },
      { x: 3, y: 22, item: 'bondstone3', count: 2, flag: 'item_snow_bond3' },
      { x: 22, y: 12, item: 'forgetHerb', count: 1, flag: 'item_snow_herb' },
    ],
    npcs: [
      {
        id: 'snowscholar', name: '氷原の研究者', x: 7, y: 13, dir: 'right', look: TOWNFOLK.luke,
        talk: [
          'やあ、ここまで来るとは。わたしは氷の幻獣を調べている。',
          '雪の精霊ユキダマは、この氷原で育つと、ヒョウガスピリットに姿を変えるんだ。\n寒さが、力を呼び覚ますのかもしれない。',
          'それから……吹雪の奥で、銀色の狼を見たという話がある。\nフェンリル――めったに姿を見せない、氷原のぬしだよ。',
        ],
      },
    ],
    onEnter: async (E) => {
      if (E.flag('snowArrived')) return;
      E.set('snowArrived');
      await E.narrate('吐く息が、白くこおりつく。\n一面の雪原の向こうで、凍った湖が青く光っている。');
      await E.narrate('……ここが『北の氷原』だ。\n（雪の積もった草むらには、氷の幻獣がひそんでいる）');
    },
  });
})(window.Game);
