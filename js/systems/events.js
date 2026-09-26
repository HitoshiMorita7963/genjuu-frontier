// イベントスクリプト実行。NPCの会話やマップ進入イベントは async 関数 (E) => {...} で書く。
(function (G) {
  'use strict';

  G.Events = {
    running: false,
    async run(fn) {
      if (this.running) return;
      this.running = true;
      try {
        await fn(G.E);
      } catch (err) {
        console.error('[event]', err);
      } finally {
        this.running = false;
        G.Input.clearPressed();
        G.UI.refresh();
        G.UI.showIdle();
      }
    },
  };

  // イベント内で使うAPI
  G.E = {
    say(speaker, ...texts) { return G.Dialog.open(texts.flat(), { speaker }); },
    narrate(...texts) { return G.Dialog.open(texts.flat(), { speaker: '' }); },
    // 最後のページで選択肢を表示し、選ばれた番号を返す
    ask(speaker, texts, choices, cancelIndex) {
      return G.Dialog.open([texts].flat(), { speaker, choices, cancelIndex });
    },
    flag: (k) => G.getFlag(k),
    set: (k, v = true) => G.setFlag(k, v),
    state: () => G.state,
    pick: (arr) => G.Util.pick(arr),
    wait: (ms) => G.Util.sleep(ms),
    async give(id, n = 1) {
      G.addItem(id, n);
      G.Audio.se('item');
      G.UI.refresh();
      await G.E.narrate(`${G.state.player.name}は\n『${G.Items[id].name}』を ${n}こ 手に入れた！`);
    },
    async money(n) {
      G.addMoney(n);
      G.UI.refresh();
      await G.E.narrate(`${n}G を 手に入れた！`);
    },
    // 画面（スターター選択・配合など）を開き、閉じたときの値を返す
    screen: (s) => G.Screens.open(s),
    // 幻獣を仲間にする（パーティが満員なら預かり所へ）
    async giveMonster(speciesId, level, how, where) {
      const m = G.Monster.create(speciesId, level, { how, where });
      const dest = G.Party.add(m);
      if (!dest) {
        await G.E.narrate('しかし パーティも預かり所も いっぱいで、仲間にできなかった……。');
        return null;
      }
      G.Dex.record(speciesId, how, where);
      G.UI.refresh();
      await G.E.narrate(`${G.state.player.name}は ${m.name}を 仲間にした！` +
        (dest === 'storage' ? '\n（パーティがいっぱいなので、預かり所へ送られた）' : ''));
      return m;
    },
    npc: (id) => G.Field.npcs.find((n) => n.id === id),
    showNpc: (id, x, y, dir) => G.Field.showNpc(id, x, y, dir),
    hideNpc: (id) => G.Field.hideNpc(id),
    walkNpc: (id, path, speed) => G.Field.walkNpc(id, path, speed),
    has: (itemId) => (G.state.items[itemId] || 0) > 0,
    shop: (shopId, tab) => G.Screens.open(G.UIScreens.shop(shopId, tab)),
    face(id, dir) { const n = G.E.npc(id); if (n) n.dir = dir; },
  };
})(window.Game);
