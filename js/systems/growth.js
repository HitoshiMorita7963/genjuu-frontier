// 育成：経験値・レベルアップ・技の習得・進化
//   ui = { msg(text) → Promise } を渡すと、バトル中でもフィールドでも同じ処理で使える
(function (G) {
  'use strict';

  const Mon = () => G.Monster;

  const Gr = G.Growth = {
    // 倒した相手から得られる経験値
    expYield(enemy, isTrainer) {
      const sp = G.Species[enemy.speciesId];
      const sum = sp.base.reduce((a, b) => a + b, 0); // 公式データの基礎値（換算後）の合計。種族値の導入前と同じ量
      const y = (sum / 5) * (1 + G.rankIndex(sp.rank) * 0.12) * (enemy.level / 6) * (isTrainer ? 1.5 : 1);
      return Math.max(1, Math.floor(y));
    },

    gainsText(before, after) {
      return ['hp', 'mp', 'atk', 'def', 'spd', 'sat', 'sdf']
        .map((k) => `${Mon().STAT_NAMES[k]}+${after[k] - before[k]}`).join('　');
    },

    // 経験値を得る。レベルが上がったら true
    async gainExp(m, amount, ui, quiet = false) {
      const sp = G.Species[m.speciesId];
      if (m.level >= Mon().MAX_LEVEL) return false;
      m.exp += amount;
      if (!quiet) await ui.msg(`${m.name}は ${amount} の 経験値を もらった！`);
      if (ui.waitBars) await ui.waitBars();
      let leveled = false;
      while (m.level < Mon().MAX_LEVEL && m.exp >= Mon().expForLevel(sp, m.level + 1)) {
        const before = Mon().stats(m);
        m.level++;
        const after = Mon().stats(m);
        m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
        m.mp = Math.min(after.mp, m.mp + (after.mp - before.mp));
        leveled = true;
        if (ui.onLevel) ui.onLevel(m);
        G.Audio.se('levelup');
        await ui.msg(`${m.name}は レベル${m.level}に 上がった！`, 1.4);
        await ui.msg(Gr.gainsText(before, after), 1.8);
        for (const [lv, id] of sp.learn) if (lv === m.level) await Gr.learn(m, id, ui);
      }
      if (m.level >= Mon().MAX_LEVEL) m.exp = Mon().expForLevel(sp, Mon().MAX_LEVEL);
      return leveled;
    },

    // 技を覚える（4つ埋まっていれば忘れる技を選ぶ）
    async learn(m, id, ui) {
      const mv = G.Moves[id];
      if (m.moves.includes(id)) return;
      if (m.moves.length < 4) {
        m.moves.push(id);
        await ui.msg(`${m.name}は ${mv.name}を 覚えた！`, 1.2);
        return;
      }
      await ui.msg(`${m.name}は ${mv.name}を 覚えようとしている……\nしかし 技を4つ 覚えていて いっぱいだ！`, 0);
      const idx = await G.Screens.open(G.UIScreens.forgetMove(m, id));
      if (idx === null || idx < 0) {
        await ui.msg(`${m.name}は ${mv.name}を 覚えずに 終わった。`, 1.2);
      } else {
        const old = G.Moves[m.moves[idx]].name;
        m.moves[idx] = id;
        await ui.msg(`1、2の……ポカン！\n${m.name}は ${old}を きれいに忘れて ${mv.name}を 覚えた！`, 1.6);
      }
    },

    // 進化先（ctx: { place, item }）
    evolutionTarget(m, ctx = {}) {
      const e = G.Species[m.speciesId].evo;
      if (!e) return null;
      if (e.item) return ctx.item === e.item ? e.to : null;
      if (e.level && m.level < e.level) return null;
      if (e.place && ctx.place !== e.place) return null;
      return e.to;
    },

    // 進化演出つきで進化させる（フィールドのイベント内から呼ぶ）
    async evolve(m, to, E) {
      const from = G.Species[m.speciesId];
      const toSp = G.Species[to];
      const screen = G.UIScreens.evolution(m.speciesId, to);
      G.Screens.open(screen);
      await E.narrate(`おや……？\n${m.name}の 様子が……！`);
      G.Audio.se('evolve');
      await screen.play();
      const before = Mon().stats(m);
      m.speciesId = to;
      if (m.name === from.name) m.name = toSp.name;
      const after = Mon().stats(m);
      m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
      m.mp = Math.min(after.mp, m.mp + (after.mp - before.mp));
      G.Dex.record(to, 'evolve', '');
      await E.narrate(`おめでとう！\n${from.name}は ${toSp.name}に 進化した！`);
      const ui = { msg: (t) => E.narrate(t) };
      // 進化後の種族の技のうち、今のレベルまでに覚えるもので、まだ知らない技を覚える
      for (const [lv, id] of toSp.learn) if (lv <= m.level && !m.moves.includes(id)) await Gr.learn(m, id, ui);
      G.Screens.close();
      G.UI.refresh();
    },
  };
})(window.Game);
