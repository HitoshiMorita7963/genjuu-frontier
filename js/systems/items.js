// 道具の効果（バトル中・フィールドの両方で使う）
(function (G) {
  'use strict';

  const HEAL = { potion: 30, hipotion: 80 };

  G.ItemUse = {
    // 対象の幻獣に使えるか
    usableOn(id, m) {
      const it = G.Items[id];
      if (!it) return false;
      if (it.type === 'revive') return m.hp <= 0; // ひんしの幻獣にだけ使える
      if (m.hp <= 0) return false;
      if (it.type === 'heal') return m.hp < G.Monster.stats(m).hp;
      if (it.type === 'status') return !!m.status;
      return false;
    },
    // 使う（成功時はメッセージを返し、個数を減らす）
    use(id, m) {
      if (!G.ItemUse.usableOn(id, m)) return null;
      const it = G.Items[id];
      G.addItem(id, -1);
      if (it.type === 'revive') {
        const max = G.Monster.stats(m).hp;
        m.hp = Math.max(1, Math.floor(max * it.revive));
        m.status = null;
        return `${m.name}は 元気を 取りもどした！（HP ${m.hp}/${max}）`;
      }
      if (it.type === 'heal') {
        const max = G.Monster.stats(m).hp;
        const before = m.hp;
        m.hp = Math.min(max, m.hp + HEAL[id]);
        return `${m.name}の HPが ${m.hp - before} 回復した！`;
      }
      m.status = null;
      return `${m.name}の 状態異常が なおった！`;
    },
    battleItems() {
      return Object.keys(G.state.items).filter((id) => ['heal', 'status', 'revive'].includes(G.Items[id].type));
    },
  };
})(window.Game);
