// ショップの品ぞろえ（値段は js/data/items.js の price。売値はその半額）
(function (G) {
  'use strict';

  G.Shops = {
    sorano: { name: 'ソラノ商店', items: ['potion', 'cure', 'revive'] },
    forestHut: { name: '森の行商人', items: ['potion', 'hipotion', 'cure', 'revive'] },
    lumiere: { name: 'リュミエール港商会', items: ['potion', 'hipotion', 'cure', 'revive', 'revive2', 'moondrop',
      'hpBook', 'atkBook', 'defBook', 'spdBook', 'satBook', 'sdfBook', 'forgetHerb'] },
  };
})(window.Game);
