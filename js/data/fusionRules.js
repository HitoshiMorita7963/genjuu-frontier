// =====================================================================
//  汎用配合ルール（公式レシピに無い組み合わせのときだけ使う）
// =====================================================================
//  ・公式レシピ（data/monster_frontier.json）が常に優先される
//  ・子の系統は、両親の系統から下の表で決まる（同じ系統どうしなら同じ系統）
//  ・子は「野生で入手できる種族」の中から選ぶ（配合限定の種族は公式レシピでしか生まれない）
//  ・子のランク：両親のどちらかが E 以上なら D、両親とも F なら F
//  ・同じ親の種族の組み合わせなら、選ぶ順番に関係なく必ず同じ子になる
//  表を書きかえるだけで、ルールを調整できる。
// =====================================================================
(function (G) {
  'use strict';

  G.FusionRules = {
    // 系統の並び（表のキーはこの順に並べた「A+B」）
    lineageOrder: ['beast', 'wing', 'plant', 'aqua', 'insect', 'fiend', 'spirit', 'dragon'],
    familyTable: {
      'beast+wing': 'wing', 'beast+plant': 'beast', 'beast+aqua': 'aqua', 'beast+insect': 'insect',
      'beast+fiend': 'fiend', 'beast+spirit': 'beast', 'beast+dragon': 'beast',
      'wing+plant': 'plant', 'wing+aqua': 'wing', 'wing+insect': 'insect', 'wing+fiend': 'fiend',
      'wing+spirit': 'spirit', 'wing+dragon': 'wing',
      'plant+aqua': 'plant', 'plant+insect': 'insect', 'plant+fiend': 'plant', 'plant+spirit': 'spirit',
      'plant+dragon': 'plant',
      'aqua+insect': 'aqua', 'aqua+fiend': 'fiend', 'aqua+spirit': 'aqua', 'aqua+dragon': 'aqua',
      'insect+fiend': 'fiend', 'insect+spirit': 'insect', 'insect+dragon': 'insect',
      'fiend+spirit': 'fiend', 'fiend+dragon': 'fiend',
      'spirit+dragon': 'spirit',
    },
    // 子のランク：どちらかの親が upgradeFrom 以上なら high、そうでなければ low
    upgradeFrom: 'E',
    lowRank: 'F',
    highRank: 'D',
  };
})(window.Game);
