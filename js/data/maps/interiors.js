// ソラノ村の建物内部
(function (G) {
  'use strict';

  // 最初の3体（公式データ：始まりの草原の獣たち）炎・風・地
  const STARTERS = ['001', '003', '004'];
  // ライバルは、主人公の相棒に強い属性を選ぶ（相性：水→炎→風→地→雷→水）
  //   炎（ヒノコロ）には水（ミズリス）、風（カゼネコ）には炎（ヒノコロ）、地（ツチモグラ）には風（カゼネコ）
  const RIVAL_PICK = { '001': '002', '003': '001', '004': '003' };

  // 最初の相棒を選ぶ（キャンセル時は false）
  async function chooseStarter(E, preselect) {
    const id = await E.screen(G.UIScreens.starter(STARTERS, preselect));
    if (!id) return false;
    E.set('starter', id);
    E.set('gotStarter');
    await E.giveMonster(id, 5, 'starter', 'ミモザ研究所');
    const rv = RIVAL_PICK[id];
    E.set('rivalStarter', rv);
    G.Dex.record(rv, 'seen', 'ミモザ研究所');
    E.face('rival', 'up');
    await E.say('ジン', [
      `……なら、オレはこいつだ。${G.Species[rv].name}！`,
      `${G.Species[rv].element}は ${G.Species[id].element}に強い。\n……相性ってやつを、よく覚えておくんだな。`,
    ]);
    await E.say('ミモザ博士', [
      'ふたりとも、いい相棒に恵まれたね。',
      'それから、これを持っていきなさい。\n野生の幻獣と絆を結ぶための『絆石』だ。',
    ]);
    await E.give('bondstone', 1);
    await E.say('ミモザ博士', [
      'ふしぎな石でね、何度投げても なくならないんだ。\n野生の幻獣は、弱らせてから投げると仲間になってくれやすい。眠りや麻痺なら、なおいいね。',
      'ただし、何度も失敗すると 幻獣が怒ってしまう。\n逃げられたり、心を閉ざされたりするから、よく弱らせてから投げるんだよ。',
      'そうそう、村の南の『配合の館』の館主が、旅から戻ってきたそうだ。\n2体の幻獣から新しい命を生み出す場所……ぜひ一度見てくるといい。',
      'それと、北の『そよかぜ草原』にいる研究員のトビが、\nキミに頼みたいことがあると言っていたよ。',
      `メニュー（${G.Touch && G.Touch.visible() ? 'Bボタン' : 'Xキー'}）の『幻獣』から、相棒のくわしい能力を見られるよ。\nさあ、いってらっしゃい！`,
    ]);
    return true;
  }

  // 第1章の結末（守護者を鎮めて博士に報告）
  async function chapterEnding(E) {
    await E.say('ミモザ博士', [
      'おお、{name}！　無事だったか！',
      '……そうか。黒環団、封印の守護者、そして『絆の紋章』……。',
      'その紋章は、人と幻獣の盟約の証だと伝えられている。\n守護者は、キミと幻獣たちの絆を認めたんだね。',
      '黒環団が各地の封印を狙っているのなら、\n『空を渡る竜』の伝説も、ただのおとぎ話ではないのかもしれない。',
      'この先の旅は、きっと厳しくなる。\nだが、キミとキミの幻獣たちなら……大丈夫だ。',
      '森の祠の言い伝え……『空翔ける大鳥と 風の神』か。\n配合の研究も、まだまだ奥が深そうだね。',
    ]);
    E.set('chapter1Clear');
    G.autoSave();
    await E.screen(G.UIScreens.chapterEnd());
    await E.say('ミモザ博士', [
      'そうそう、港町リュミエールの友人、学者ルークから手紙が届いていてね。\n黒環団が、北の高原の『風の祭壇』を狙っているらしい。',
      '守護者が眠りについたとき、洞窟の奥の大岩が崩れて、\n港町へ抜ける道が開いたそうだ。',
      '行ってくれるかい、{name}。\n港町のルークを訪ねておくれ！',
    ]);
    await E.narrate('――第2章「空を渡る竜」がはじまる。\n（灯石の洞窟 B2、守護者の間の奥から港町へ行けるようになった）');
  }

  // ---------------- 主人公の家 ----------------
  G.registerMap({
    id: 'home',
    name: '{name}の家',
    tiles: [
      'wwwwwwwwww',
      'wkk__p__bw',
      'w_______bw',
      'w__tt____w',
      'w__tt____w',
      'w________w',
      'wp__mm__pw',
      'wwwwxxwwww',
    ],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'sorano', tx: 5, ty: 7, dir: 'down' }],
    inspect: {
      k: 'ボロボロの『はじめての幻獣図鑑』。\n子どものころから何度も読み返した、たからものだ。',
      b: 'さっきまで寝ていたベッドだ。まだ少しあたたかい。',
    },
    npcs: [
      {
        id: 'mom', name: '母さん', x: 5, y: 4, dir: 'up',
        look: { hair: '#7a4a2a', style: 'long', shirt: '#d86a5a', coat: '#f4ead0', pants: '#6a4a6a' },
        talk: async (E) => {
          if (!E.flag('metProfessor')) {
            await E.say('母さん', '博士の研究所は、村の北東にある青い屋根の建物よ。\n寄り道しないでね！');
          } else if (!E.flag('gotStarter')) {
            await E.say('母さん', 'あら、まだ相棒を選んでいないの？\n博士を待たせちゃだめよ。');
          } else if (!E.flag('visitedMeadow')) {
            const m = E.state().party[0];
            await E.say('母さん', [
              m ? `まあ、それがあなたの相棒？\n${m.name}っていうのね。よろしくね。` : 'あら、おかえりなさい。',
              '北の草原に行くなら、背の高い草むらには気をつけるのよ！',
            ]);
          } else {
            await E.say('母さん', [
              'おかえり、{name}。',
              'あなたの顔を見てると、旅立った日のお父さんを思い出すわ。\n……あの人、今ごろどこにいるのかしらね。',
            ]);
            E.set('heardAboutFather');
          }
        },
      },
    ],
    onEnter: async (E) => {
      if (E.flag('metMom')) return;
      E.face('mom', 'right');
      await E.say('母さん', [
        '{name}、やっと起きたのね！',
        '今日は、ミモザ博士の研究所で、はじめての幻獣を受け取る日でしょう？',
        '博士の研究所は、村の北東にある青い屋根の建物よ。',
        'ふふっ……あなたが幻獣使いになるなんてね。\nお父さんが聞いたら、きっと喜ぶわ。',
        'さあ、いってらっしゃい！',
      ]);
      E.set('metMom');
    },
  });

  // ---------------- ミモザ博士の研究所 ----------------
  G.registerMap({
    id: 'lab',
    name: 'ミモザ幻獣研究所',
    tiles: [
      'wwwwwwwwwwwwww',
      'wkkkkkkkkkkkkw',
      'w____________w',
      'w___q_q_q____w',
      'w____________w',
      'wtt________ttw',
      'wtt________ttw',
      'w____________w',
      'wp____mm____pw',
      'wwwwwwxxwwwwww',
    ],
    warps: [{ x: 6, y: 9, w: 2, h: 1, to: 'sorano', tx: 20, ty: 8, dir: 'down' }],
    inspect: {
      k: [
        '『幻獣属性学・入門』\n……水は炎を鎮め、炎は風にあおられて燃えさかり、風は土を削る。\n土は雷を吸い、雷は水を走る……',
        '『系統学概論』\n……同じ系統の幻獣を掛け合わせると……\n（難しくて読めない）',
        '『幻獣と盟約の歴史』\n……ある章だけ、ページがごっそり破り取られている。',
        '『配合研究ノート　第3巻』\n……親の覚えた技のいくつかは、子へと受け継がれる……',
      ],
      q: '空っぽの石の台座だ。',
      t: '研究資料が山積みになっている。',
    },
    // 台座の上の相棒候補
    objects: STARTERS.map((id, i) => ({
      type: 'monster', x: 4 + i * 2, y: 3, speciesId: id,
      visible: () => G.getFlag('starter') !== id && G.getFlag('rivalStarter') !== id,
      talk: async (E, o) => {
        const sp = G.Species[id];
        if (!o.visible()) await E.narrate('空っぽの台座だ。');
        else if (!E.flag('metProfessor')) await E.narrate(`台座の上で、${sp.name}がすやすやと眠っている。\n（まずは博士に話しかけよう）`);
        else if (!E.flag('gotStarter')) await chooseStarter(E, i);
        else await E.narrate(`${sp.name}がこちらを見つめている。\n（この子は研究所で大切に育てられるそうだ）`);
      },
    })),
    npcs: [
      {
        id: 'professor', name: 'ミモザ博士', x: 6, y: 2, dir: 'down',
        look: { hair: '#e8c860', style: 'long', glasses: true, coat: '#f4f4f4', shirt: '#6a8a5a', pants: '#3a3a4a' },
        talk: async (E) => {
          if (E.flag('chapter1Boss') && !E.flag('chapter1Clear')) {
            await chapterEnding(E);
            return;
          }
          if (!E.flag('metProfessor')) {
            await E.say('ミモザ博士', [
              'おお、来たね {name}！　待っていたよ。',
              'わたしはミモザ。この地方の幻獣を研究している学者さ。',
              '幻獣には『属性』と『系統』がある。\n炎、水、風……獣に鳥、なかには竜なんてのもいる。',
              'そして幻獣は、人と絆を結ぶことで、本当の力を発揮するんだ。',
              '……さて、本題だ。\nそこの3つの台座にいるのが、キミの相棒候補の幻獣たちだよ。',
            ]);
            E.face('rival', 'left');
            await E.say('ジン', '……フン。のんびりしたもんだな。');
            await E.say('ミモザ博士', 'おっと、紹介しよう。彼はジン。\nキミと同じく、今日はじめての幻獣を受け取る子だ。');
            const c = await E.ask('ジン', [
              'オレはジン。……幻獣使いに必要なのは『強さ』だけだ。',
              '『絆』だの『友情』だの……\nそんなもの、弱いヤツの言い訳だろ？',
            ], ['絆だって、きっと力になる！', '……（だまっている）'], 1);
            if (c === 0) {
              E.set('rivalAnswer', 'bond');
              await E.say('ジン', ['ハッ、口だけならなんとでも言えるさ。', 'いずれ証明してやるよ。\nどっちが正しいかをな。']);
            } else {
              E.set('rivalAnswer', 'silent');
              await E.say('ジン', 'なんだ、言い返す言葉もないのか。\nつまらないヤツだな。');
            }
            await E.say('ミモザ博士', [
              'やれやれ……。まあ、競い合える相手がいるのはいいことだ。',
              'さあ {name}、台座の3体から、キミの相棒を選んでおくれ！',
            ]);
            E.set('metProfessor');
            E.set('metRival');
            if (!(await chooseStarter(E, 0))) {
              await E.say('ミモザ博士', 'ははは、迷うのも無理はない。\n決まったら、わたしか台座に声をかけておくれ。');
            }
          } else if (!E.flag('gotStarter')) {
            await E.say('ミモザ博士', '相棒は決まったかい？');
            if (!(await chooseStarter(E, 0))) await E.say('ミモザ博士', 'ゆっくり考えるといい。');
          } else {
            // まだやっていないことを優先して話す。済んでいれば、ためになる話を
            if (!E.flag('gotTsubomin')) await E.say('ミモザ博士', '草原にいる研究員のトビが、キミに頼みたいことがあると言っていたよ。');
            else if (!E.flag('fusedOnce')) await E.say('ミモザ博士', '村の南の『配合の館』には、もう行ってみたかい？\nトビから託された子と、キミの相棒を配合してみるといい。');
            else {
              await E.say('ミモザ博士', E.pick([
                '幻獣の強さは、生まれ持った力だけでは決まらない。\n育て方……そして『配合』によっても大きく変わるんだ。',
                '配合で生まれた子には『配合値』――血統の力が宿る。\n代を重ねて血統が強まるほど、才能に恵まれた子が生まれやすいんだ。',
                '幻獣の属性には、得意な相手と苦手な相手がある。\n水は炎に、炎は風に、風は土に、土は雷に、雷は水に強い。光と闇はおたがいに強いんだ。',
              ]));
            }
          }
        },
      },
      {
        id: 'rival', name: 'ジン', x: 9, y: 4, dir: 'up',
        look: { hair: '#2a2a3a', style: 'spiky', coat: '#b83a3a', shirt: '#2a2a2a', pants: '#2a2a3a' },
        talk: async (E) => {
          if (!E.flag('metRival')) {
            await E.say('ジン', '……なんだよ。\n話があるなら、先に博士のところへ行け。');
          } else if (E.flag('gotStarter')) {
            const rv = G.Species[E.flag('rivalStarter')].name;
            await E.say('ジン', [`オレの${rv}は、すぐに強くなる。`, E.flag('rivalAnswer') === 'bond'
              ? '次に会ったときは勝負だ。\nお前の言う『絆』とやら、見せてもらうぜ。'
              : '次に会ったときは勝負だ。\n逃げるなよ。']);
          } else if (E.flag('rivalAnswer') === 'bond') {
            await E.say('ジン', '証明してみせろよ。お前の言う『絆』とやらをな。');
          } else {
            await E.say('ジン', '……フン。');
          }
        },
      },
      {
        id: 'assistant', name: '助手ノエル', x: 11, y: 7, dir: 'left', wander: 1,
        look: { hair: '#4a6a9a', glasses: true, coat: '#f4f4f4', shirt: '#4a7ab0', pants: '#3a3a4a' },
        // 配合の館が開いているか（相棒を受け取ると館主が戻る）で話を変える
        talk: async (E) => {
          await E.say('助手ノエル', [
            'こんにちは！　研究所の助手のノエルです。',
            '博士は幻獣の『配合』についても研究しているんですよ。\n2体の幻獣から、新しい命が生まれる……不思議ですよね。',
          ]);
          if (!E.flag('gotStarter')) await E.say('助手ノエル', '村の南にある『配合の館』は、いまは閉まっていますけど……\nいつか見学してみたいなあ。');
          else if (!E.flag('fusedOnce')) await E.say('助手ノエル', '村の南の『配合の館』、館主のオルドさんが戻って、また開いたんですよ！\nあなたも、ぜひ行ってみてください。');
          else await E.say('助手ノエル', 'もう配合をしたんですか！？　どんな子が生まれたんですか？\n……今度、わたしにも見せてくださいね！');
        },
      },
    ],
    onEnter: async (E) => {
      if (E.flag('labEntered')) return;
      E.set('labEntered');
      await E.say('ミモザ博士', 'おお、{name}！　こっちだ、こっち！\n奥まで来ておくれ。');
    },
  });

  // ---------------- ショップ ----------------
  G.registerMap({
    id: 'shop',
    name: 'ソラノ商店',
    tiles: [
      'wwwwwwwwww',
      'wkkkkkkkkw',
      'w________w',
      'wccccc___w',
      'w________w',
      'w_kk__kk_w',
      'w________w',
      'wwwwxxwwww',
    ],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'sorano', tx: 5, ty: 15, dir: 'down' }],
    inspect: {
      k: '商品棚だ。キズぐすりや絆石が、ずらりと並んでいる。',
      c: 'よく磨かれたカウンターだ。',
    },
    npcs: [
      {
        id: 'clerk', name: '店員', x: 3, y: 2, dir: 'down',
        look: { hair: '#4a3a2a', coat: '#3f9a5a', shirt: '#f5ecd8', pants: '#3a3a3a' },
        talk: async (E) => {
          const c = await E.ask('店員', 'いらっしゃいませ！　ソラノ商店へようこそ！\nご用件は？', ['買う', '売る', 'やめる'], 2);
          if (c === 2) { await E.say('店員', 'またのお越しを！'); return; }
          await E.shop('sorano', c === 0 ? 'buy' : 'sell');
          await E.say('店員', 'ありがとうございました！');
        },
      },
      {
        id: 'customer', name: '買い物客', x: 7, y: 4, dir: 'left', wander: 1,
        look: { hair: '#8a5a2a', shirt: '#6a6ab0', pants: '#4a4a3a' },
        talk: [
          '『絆石』っていうのは、野生の幻獣と絆を結ぶための石なんだって。',
          '何度でも投げられるけど、失敗ばかりだと幻獣が怒っちゃうんだって。\n少し弱らせてから使うのがコツなんだってさ。',
        ],
      },
    ],
  });

  // ---------------- 回復施設「癒しの泉」 ----------------
  G.registerMap({
    id: 'healer',
    name: '癒しの泉',
    tiles: [
      'wwwwwwwwww',
      'wp______pw',
      'w________w',
      'w_cccccc_w',
      'w________w',
      'wmm____mmw',
      'w________w',
      'wwwwxxwwww',
    ],
    warps: [{ x: 4, y: 7, w: 2, h: 1, to: 'sorano', tx: 21, ty: 15, dir: 'down' }],
    inspect: { c: 'つるりとした白いカウンターだ。' },
    npcs: [
      {
        id: 'nurse', name: '泉守りセラ', x: 4, y: 2, dir: 'down',
        look: { hair: '#e89ab0', style: 'long', coat: '#ffffff', shirt: '#3aa6a0', pants: '#3a6a6a' },
        talk: async (E) => {
          await E.say('泉守りセラ', 'ようこそ『癒しの泉』へ。\nここでは、幻獣たちの傷と疲れを癒やしています。');
          const c = await E.ask('泉守りセラ', 'あなたの幻獣を回復しますか？', ['はい', 'いいえ'], 1);
          if (c === 0) {
            if (E.state().party.length === 0) {
              await E.say('泉守りセラ', '……あら？\nまだ幻獣を連れていないみたいですね。');
              await E.say('泉守りセラ', 'ふふ、相棒ができたら、またいらしてください。');
            } else {
              await E.say('泉守りセラ', 'では、お預かりしますね。');
              G.Party.healAll();
              G.Audio.se('heal');
              await E.narrate('♪ ～ ♪ ～ ～ ♪\n泉の水が、幻獣たちをやさしく包みこんだ。');
              G.autoSave();
              await E.say('泉守りセラ', 'お待たせしました。\nみんな、すっかり元気になりましたよ！');
            }
          } else {
            await E.say('泉守りセラ', 'またいつでもどうぞ。');
          }
        },
      },
      {
        id: 'healkid', name: '男の子', x: 7, y: 5, dir: 'up', wander: 1,
        look: { hair: '#aa5a2a', shirt: '#e05a4a', pants: '#3a3a5a' },
        talk: [
          'ここの泉の水をあびると、幻獣はすぐに元気になるんだ！',
          'しかもタダ！　すごいよね！',
        ],
      },
    ],
  });

  // ---------------- 配合の館 ----------------
  G.registerMap({
    id: 'fusionhall',
    name: '配合の館',
    tiles: [
      'wwwwwwwwwwww',
      'wkkkkppkkkkw',
      'w__________w',
      'w___cccc___w',
      'w__________w',
      'w_mm____mm_w',
      'w__________w',
      'wp________pw',
      'wwwwwxxwwwww',
    ],
    warps: [{ x: 5, y: 8, w: 2, h: 1, to: 'sorano', tx: 13, ty: 19, dir: 'down' }],
    inspect: {
      k: [
        '『配合の手引き』\n……ふたつの親の『系統』が、子の系統を決める。\nただし特別な組み合わせでは、まったく別の命が生まれる……',
        '『配合録　第一巻』\n……炎の獣と、風の獣。ふたつの獣が交わるとき……\n（その先はかすれて読めない）',
        '『世代の書』\n……配合で生まれた子もまた、親となれる。\n代を重ねた幻獣ほど、秘めた力は大きい……',
      ],
      c: '年季の入った木のカウンターだ。',
    },
    npcs: [
      {
        id: 'fusionmaster', name: '配合師オルド', x: 5, y: 2, dir: 'down',
        look: { hair: '#b0b0b0', beard: '#e8e8e8', coat: '#6a4a9a', shirt: '#4a3a6a', pants: '#3a2a4a' },
        talk: async (E) => {
          if (!E.flag('metFusionMaster')) {
            await E.say('配合師オルド', [
              'ほっほっ、よく来たの。\nわしがこの館の主、配合師オルドじゃ。',
              'そう、村で会った白ひげのじじいじゃよ。\n旅の荷ほどきがやっと終わってのう。',
              '配合とは、2体の幻獣を親として、新たな命を誕生させる術じゃ。\n親となった2体は、子の中にとけこんで生き続ける。',
            ]);
            E.set('metFusionMaster');
          }
          const c = await E.ask('配合師オルド', 'さて、どうするかの？', ['配合する', '配合について聞く', 'やめる'], 2);
          if (c === 0) {
            if (G.Party.all().length < 2) {
              await E.say('配合師オルド', '配合には、親となる幻獣が2体必要じゃ。\n仲間を増やしてから、また来なされ。');
              return;
            }
            await E.say('配合師オルド', 'では、親となる2体を選びなされ。\n何が生まれるかは……生まれてのお楽しみじゃ。');
            const res = await E.screen(G.UIScreens.fusion());
            if (!res) { await E.say('配合師オルド', 'よいよい、じっくり考えなされ。'); return; }
            E.set('fusedOnce');
            const sp = G.Species[res.child.speciesId];
            await E.say('配合師オルド', res.tier === 'rule'
              ? [`ほう、${sp.name}か。元気な子じゃ。`, '配合で生まれた子はレベルが低いところからじゃが、\n親の才能と、血統の力をしっかり受け継いでおる。']
              : res.tier === 'recipe'
                ? [`おお、${sp.name}！　特別な組み合わせを見つけたのう。`, 'この組み合わせは図鑑に記録しておくのじゃぞ。']
                : [`な、なんと……${sp.name}じゃと！？`, 'これほどの幻獣が生まれるとは……！\n大切に育てるのじゃぞ。']);
            await E.say('配合師オルド', '生まれた子の親や祖先は、\nメニューの『幻獣』から「系譜」で見られるぞ。');
          } else if (c === 1) {
            await E.say('配合師オルド', [
              'たいていは、両親の『系統』とランクで子が決まる。\n獣と鳥なら鳥、植物と精霊なら精霊……といった具合にの。',
              'じゃが、ある決まった組み合わせでだけ生まれる、\n特別な幻獣もおる。配合限定の幻獣は、みなそうじゃ。',
              '同じ親どうしなら、どちらを先に選んでも、\n何度やっても同じ子が生まれる。',
              '子が生まれたら、最初に覚えている技を選べる。\n子が自分で覚える技と、親の技（2つまで）を合わせて4つじゃ。\nさらに親の特性を1つ、受け継ぐこともある。',
              '子は、両親の生まれつきの『才能』を2つずつ受け継ぐ。\n才能に恵まれた親どうしなら、子も恵まれやすいのじゃ。',
              'さらに配合で生まれた子には『配合値』――血統の力が宿る。\n代を重ねるほど強まり、その子どもは、より高い才能をもって生まれやすくなる。',
              'ただし、進化してはじめて見られる姿の幻獣は、配合では生まれん。\nそういう子は、手塩にかけて育てて、進化させてやるのじゃ。',
              '「配合の才」をもつ親なら、血統の力はいっそう強まるぞ。',
              'ただし、鍛えた成果――『努力値』は受け継がれん。\n子は、また一から育ててやるのじゃぞ。',
              '生まれた子もまた親になれる。\n世代を重ねた先には……伝説の竜が待っておるやもしれん。',
              '見つけた組み合わせは、図鑑に記録されるぞ。',
            ]);
          }
        },
      },
      {
        // 訓練所：努力値を育てる（序盤から利用できる）
        id: 'trainer', name: '訓練師ガンツ', x: 2, y: 4, dir: 'right',
        look: { hair: '#2a2a2a', style: 'spiky', coat: '#b8683a', shirt: '#f0e0c0', pants: '#4a3a2a' },
        talk: async (E) => {
          const T = G.GrowthConfig.TRAINING;
          if (!E.flag('metTrainer')) {
            await E.say('訓練師ガンツ', [
              'おう！　オレは訓練師ガンツ。\nオルドじいさんの館の片すみで、幻獣の特訓を請け負ってる。',
              '幻獣の強さは、3つで決まる。\n『種族』の力、生まれつきの『才能』、そして『育て方』だ。',
              '種族と才能は変えられねえが、育て方はお前しだい。\n戦った相手や特訓の中身で、伸びる能力が変わる。これを『努力値』って呼ぶ。',
              'ほれ、はじめての客への おまけだ。',
            ]);
            E.set('metTrainer');
            await E.give('atkBook', 1);
          }
          const c = await E.ask('訓練師ガンツ', `特訓は 1回 ${T.cost}G だ。どうする？`, ['特訓する', '努力値について聞く', 'やめる'], 2);
          if (c === 0) {
            if (!E.state().party.length) { await E.say('訓練師ガンツ', '鍛える幻獣を 連れてきな。'); return; }
            await E.screen(G.UIScreens.training());
            await E.say('訓練師ガンツ', 'いい汗かいたな！　また来いよ。');
          } else if (c === 1) {
            const C = G.GrowthConfig;
            await E.say('訓練師ガンツ', [
              '努力値は、戦って倒した相手の種類でたまる。\n炎の獣なら攻撃、硬い岩の幻獣なら防御、すばしこい鳥なら素早さ……ってな具合だ。',
              `ひとつの能力は ${C.EV_MAX_STAT} まで、ぜんぶ合わせて ${C.EV_MAX_TOTAL} までしか鍛えられねえ。\n何を伸ばすか、よく考えな。`,
              '努力値は、その能力の『伸び』をよくする。\nもとから得意な能力を鍛えるほど、ぐんと強くなるぞ。',
              'やり直したくなったら、ここでリセットもできる。\n配合で生まれた子は、努力値ゼロからの出直しだ。',
            ]);
          }
        },
      },
      {
        id: 'fusionapprentice', name: '弟子のリコ', x: 9, y: 6, dir: 'left', wander: 1,
        look: { hair: '#c0503a', style: 'long', shirt: '#6a4a9a', pants: '#3a2a4a' },
        talk: async (E) => {
          await E.say('弟子のリコ', 'わたしはオルド師匠の弟子、リコ！\n配合の研究ノートから、ヒントを教えてあげるね。');
          // まだ見つけていない配合のうち、手持ちの幻獣が親になれるもの → 生まれる子のランクが低いもの の順に1つ
          const owned = new Set(G.Party.all().map((m) => m.speciesId));
          const rankOf = (r) => G.rankIndex(G.Species[r.resultId].rank);
          const next = Object.values(G.FusionRecipes.byPair)
            .filter((r) => !G.Dex.recipeFound(r.resultId))
            .sort((a, b) => (b.parentIds.filter((p) => owned.has(p)).length - a.parentIds.filter((p) => owned.has(p)).length) ||
              rankOf(a) - rankOf(b) || Number(a.resultId) - Number(b.resultId))[0];
          if (!next) {
            await E.say('弟子のリコ', 'すごい……ノートに書いてある配合、ぜんぶ見つけちゃったの！？\n師匠もびっくりだよ！');
            return;
          }
          if (rankOf(next) >= G.rankIndex('A') && !E.flag('chapter1Clear')) {
            await E.say('弟子のリコ', 'ここから先は、師匠の秘密のノートなんだ……。\nもっと旅をして、一人前になったら教えてあげる！');
            return;
          }
          await E.say('弟子のリコ', next.hint);
          await E.say('弟子のリコ', '配合をすると、親の2体はいなくなっちゃうの。\nどの子を親にするかは、よーく考えてね。');
        },
      },
    ],
  });
})(window.Game);
