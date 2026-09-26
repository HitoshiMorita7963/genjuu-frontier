// ショップの品ぞろえ（値段は js/data/items.js の price。売値はその半額）
(function (G) {
  'use strict';

  G.Shops = {
    sorano: { name: 'ソラノ商店', items: ['potion', 'cure', 'bondstone', 'bondstone2', 'powerseed'] },
    forestHut: { name: '森の行商人', items: ['potion', 'hipotion', 'cure', 'bondstone', 'bondstone2'] },
    lumiere: { name: 'リュミエール港商会', items: ['potion', 'hipotion', 'cure', 'bondstone2', 'bondstone3', 'moondrop', 'powerseed'] },
  };
})(window.Game);
