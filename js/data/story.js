// ストーリー共通データ（導入文・目的表示・主人公の見た目）
(function (G) {
  'use strict';

  G.Story = {
    TITLE: '幻獣フロンティア',
    SUBTITLE: '～ 絆の紋章 ～',
    RIVAL: 'ジン',

    playerLook(gender) {
      return gender === 'girl'
        ? { hair: '#6a3a1a', style: 'long', ribbon: '#ff5d8a', shirt: '#e0557a', pants: '#2b2b40' }
        : { hair: '#3a2618', hat: '#d8433a', shirt: '#2f6fd0', pants: '#2b2b40' };
    },

    introPages() {
      const who = G.state.player.gender === 'girl' ? '少女' : '少年';
      return [
        'ここは、人と『幻獣（げんじゅう）』が共に生きる大陸――エルディア。',
        '幻獣は、炎や水、風や大地に宿る不思議な力をもつ生き物たち。',
        '人々は遠い昔から、幻獣と『絆の契り』を結び、共に暮らしてきた。',
        '幻獣と心を通わせ、共に戦う者たちを――人は『幻獣使い』と呼ぶ。',
        `大陸の辺境にある小さな村、ソラノ村。\nそこに、幻獣使いを夢見るひとりの${who}がいた。`,
        'その名は――{name}。',
        '今日は、{name}がはじめての相棒と出会う、特別な日……。',
      ];
    },

    // 画面下部に表示する現在の目的
    objective() {
      const f = G.hasFlag;
      if (!f('metMom')) return '母さんに声をかけよう';
      if (!f('metProfessor')) return '村の北東にある青い屋根の研究所で、ミモザ博士に会おう';
      if (!f('gotStarter')) return '研究所の台座から、相棒の幻獣を1体選ぼう';
      if (!f('gotTsubomin')) return '北の『そよかぜ草原』にいる研究員トビを訪ねよう（配合の相手を託してくれる）';
      if (!f('fusedOnce')) return '村の南の『配合の館』で、配合を試してみよう';
      if (!f('forestOpen')) return '幻獣を鍛えて（目安Lv7）、草原の北にいる森の番人ボルグの試練を受けよう';
      if (!f('gotLantern')) return 'ささやきの森を抜けて、北の『灯石の洞窟』を目指そう';
      if (!f('noirDefeated')) return '灯石の洞窟の奥深く、封印の扉を目指そう';
      if (!f('chapter1Boss')) return '開いた封印の扉の奥へ進もう';
      if (!f('chapter1Clear')) return 'ソラノ村へ戻り、ミモザ博士に報告しよう';
      // ---- 第2章 ----
      if (!f('ch2Arrived')) return '灯石の洞窟 B2、守護者の間の奥の抜け道から港町リュミエールへ向かおう';
      if (!f('ch2Briefed')) return '港町の広場にいる学者ルークに話しかけよう';
      if (!f('keyFire') || !f('keyWater')) {
        const rest = [!f('keyFire') && '火山の麓（港の東）', !f('keyWater') && '湖畔の森（高原の西）'].filter(Boolean).join('と');
        return `鍵石を手に入れよう：${rest}`;
      }
      if (!f('chapter2Clear')) return '北の『風鳴りの高原』、風の祭壇へ向かおう';
      return '第2章クリア！　天空竜アストラ（No.082）を配合で生みだしてみよう';
    },
  };
})(window.Game);
