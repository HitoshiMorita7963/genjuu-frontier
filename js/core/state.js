// ゲーム状態（PHASE 7 でそのまま localStorage に保存できるよう、純粋なデータのみ保持）
(function (G) {
  'use strict';

  G.State = {
    create(name, gender) {
      return {
        version: 2,
        player: { name, gender, map: 'home', x: 7, y: 2, dir: 'down' },
        money: 1000,
        items: {},        // { itemId: 個数 }
        flags: {},        // ストーリー進行フラグ
        party: [],        // 手持ち幻獣（最大6）
        storage: [],      // 預かり所
        dex: {},          // 図鑑の発見記録 { 種族ID: { seen, owned, fused, where } }
        recipesFound: {}, // 配合レシピの発見記録 { 子の種族ID: { parentIds, at } }
        ruleFound: {},    // 汎用ルールで試した組み合わせ { "親ID+親ID": 子の種族ID }
        lineage: {},      // 親子系譜 { 個体ID: { speciesId, name, level, generation, parentInstanceIds } }
        playTime: 0,
      };
    },
  };

  G.state = null;

  G.hasFlag = (k) => !!(G.state && G.state.flags[k]);
  G.getFlag = (k) => (G.state ? G.state.flags[k] : undefined);
  G.setFlag = (k, v = true) => { G.state.flags[k] = v; };

  G.addItem = (id, n = 1) => {
    const items = G.state.items;
    items[id] = (items[id] || 0) + n;
    if (items[id] <= 0) delete items[id];
  };
  G.addMoney = (n) => { G.state.money = Math.max(0, G.state.money + n); };

  // テキスト中の {name} などを置換
  G.format = (text) => {
    const name = G.state ? G.state.player.name : '';
    return String(text).replace(/\{name\}/g, name).replace(/\{rival\}/g, 'ジン');
  };
})(window.Game);
