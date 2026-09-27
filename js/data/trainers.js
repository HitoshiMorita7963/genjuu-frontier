// トレーナー・ボスのデータ
//   party: [[種族ID, レベル], ...]（関数にすると進行状況に応じて変えられる）
//   power: 手持ち幻獣の能力の底上げ（％。ボスを強くする。プレイヤーの幻獣には無い）
//   boss: ボス演出 / canLose: 負けても全滅扱いにしない（ライバル戦・試練）
//   intro: 戦闘開始時のセリフ / defeat: 負けたときのセリフ
(function (G) {
  'use strict';

  const RIVAL_LOOK = { hair: '#2a2a3a', style: 'spiky', coat: '#b83a3a', shirt: '#2a2a2a', pants: '#2a2a3a' };
  G.Looks = {
    rival: RIVAL_LOOK,
    guard: { helmet: '#8a8a9a', shirt: '#5a6a8a', pants: '#3a3a4a', beard: '#5a4030' },
    noir: { hair: '#7a4ab0', style: 'long', coat: '#1e1a28', shirt: '#6a2a4a', pants: '#1a1620' },
  };

  // ライバルの相棒。2戦目では、配合で生まれた姿（公式レシピの子）で出てくる
  const RIVAL_FUSED = { '001': '021', '003': '023', '004': '022' };
  function rivalMon(level) {
    const id = G.getFlag('rivalStarter') || '004';
    return [level >= 16 && RIVAL_FUSED[id] ? RIVAL_FUSED[id] : id, level];
  }

  // 第2章：ライバルの相棒は、野生の D ランク（進化・配合でも得られる姿）になっている
  const RIVAL_FINAL = { '001': '041', '003': '043', '004': '042' };
  G.Looks.blast = { hair: '#d8482a', style: 'spiky', coat: '#1e1a28', shirt: '#8a2a1a', pants: '#1a1620' };
  G.Looks.vel = { hood: '#0e0c18', coat: '#1a1628', shirt: '#4a1a5a', pants: '#12101c', eyes: '#f0d040' };

  G.Trainers = {
    guardBorg: {
      name: '森の番人ボルグ', look: G.Looks.guard, boss: true, canLose: true, reward: 600, power: 10,
      party: [['009', 7], ['016', 8]],
      intro: ['森の番人の試練、受けてもらうぞ！', 'わしの幻獣を倒せぬ者に、森は越えられん！'],
      defeat: ['……見事！', 'その力なら、森の奥でも立ち向かえよう。'],
    },
    rival1: {
      name: 'ライバルのジン', look: RIVAL_LOOK, canLose: true, reward: 500,
      party: () => [rivalMon(9), ['006', 7]],
      intro: ['博士の研究所での続きだ。\nどっちの考えが正しいか、ここではっきりさせてやる！'],
      defeat: ['……チッ。'],
    },
    noir: {
      name: '黒環団幹部ノワール', look: G.Looks.noir, boss: true, reward: 1500, power: 15,
      party: [['017', 13], ['018', 14], ['032', 15]],
      intro: ['わたしの『環』の力、見せてあげる。'],
      defeat: ['……っ！', 'この子……ただの子どもじゃない……。'],
    },
    guardian: {
      name: '封印の守護者', look: null, boss: true, reward: 0, power: 8,
      party: [['012', 14], ['029', 15], ['059', 17]],
      introText: '目覚めた守護者たちが、怒りのままに襲いかかってきた！',
      defeat: [],
    },
    rival2: {
      name: 'ライバルのジン', look: RIVAL_LOOK, canLose: true, reward: 1200, power: 5,
      party: () => [['044', 16], ['056', 16], rivalMon(18)],
      intro: ['……洞窟でのこと、礼は言わねえ。', 'だが、確かめたいことがある。\n全力でこい、{name}！'],
      defeat: ['……ああ、負けだ。完敗だよ。'],
    },

    // ================= 第2章 =================
    blast: {
      name: '黒環団幹部ブラスト', look: G.Looks.blast, boss: true, reward: 3000, power: 8,
      party: [['041', 23], ['045', 23], ['064', 25]],
      intro: ['ハッハァ！　祠の鍵石は、この黒環団のブラスト様がいただいた！', '取り返したけりゃ、オレの炎を越えてみな！'],
      defeat: ['ぐっ……！　この炎が、押し返されるだと……！？'],
    },
    rival3: {
      name: 'ライバルのジン', look: RIVAL_LOOK, canLose: true, reward: 2500, power: 8,
      party: () => [['044', 24], ['056', 24], [RIVAL_FINAL[G.getFlag('rivalStarter')] || '042', 26]],
      intro: ['……来たか、{name}。', '鍵石を渡す前に、確かめさせてくれ。\n今のオレと、今のお前。どっちが上かをな！'],
      defeat: ['……ハハッ。やっぱり、お前は強えな。'],
    },
    vel: {
      name: '黒環団首領ヴェル', look: G.Looks.vel, boss: true, reward: 8000, power: 5, // 種族値の見直しで B ランクが圧縮された分を補う
      party: [['063', 23], ['071', 23], ['073', 24]],
      intro: ['……よく来た、絆の紋章を持つ者よ。', '我が名はヴェル。黒環団を束ねる者。\n空を渡る竜の力は、我らの環がいただく。', '人と幻獣の盟約など、鎖にすぎぬ。\n――その鎖、ここで断ち切ってくれよう！'],
      defeat: ['……なぜだ。なぜ、鎖に縛られた幻獣が、これほどの力を……。'],
    },
  };
})(window.Game);
