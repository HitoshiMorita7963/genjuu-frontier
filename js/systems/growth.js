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

    // 経験値アイテムで得られる経験値（成長の雫は、指定のレベル数ぶん上がるだけの量）
    //   n 個まとめて使ったときの合計
    expItemAmount(m, id, n = 1) {
      const it = G.Items[id];
      if (!it.levels) return it.exp * n;
      const to = Math.min(Mon().MAX_LEVEL, m.level + it.levels * n);
      return Math.max(1, Mon().expForLevel(G.Species[m.speciesId], to) - m.exp);
    },
    // 経験値アイテムを n 個使ったあとのレベル（進化で種族が変わる分は考えない目安）
    levelAfterExp(m, amount) {
      const sp = G.Species[m.speciesId];
      let lv = m.level;
      while (lv < Mon().MAX_LEVEL && m.exp + amount >= Mon().expForLevel(sp, lv + 1)) lv++;
      return lv;
    },
    // 最高レベルまでに必要な個数（これより多く使っても無駄になる）
    expItemsToMax(m, id, have) {
      for (let n = 1; n < have; n++) if (Gr.levelAfterExp(m, Gr.expItemAmount(m, id, n)) >= Mon().MAX_LEVEL) return n;
      return have;
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
        const stagesBefore = m.moves.map((id) => G.MoveStage.stage(m, id));
        m.level++;
        const after = Mon().stats(m);
        m.hp = Math.min(after.hp, m.hp + (after.hp - before.hp));
        m.mp = Math.min(after.mp, m.mp + (after.mp - before.mp));
        leveled = true;
        if (ui.onLevel) ui.onLevel(m);
        G.Audio.se('levelup');
        await ui.msg(`${m.name}は レベル${m.level}に 上がった！`, 1.4);
        await ui.msg(Gr.gainsText(before, after), 1.8);
        // 技の強化：覚えてから一定レベルごとに強くなる
        for (const [i, id] of m.moves.slice().entries()) {
          const st = G.MoveStage.stage(m, id);
          if (st > stagesBefore[i]) await ui.msg(`${m.name}の ${G.Moves[id].name}が きたえられた！（+${st - 1}）`, 1.0);
        }
        for (const [lv, id] of sp.learn) if (lv === m.level) await Gr.learn(m, id, ui);
      }
      if (m.level >= Mon().MAX_LEVEL) m.exp = Mon().expForLevel(sp, Mon().MAX_LEVEL);
      return leveled;
    },

    // 技を覚える（持てる数が埋まっていれば忘れる技を選ぶ）
    async learn(m, id, ui) {
      const mv = G.Moves[id];
      if (m.moves.includes(id)) return;
      const slots = Mon().maxMoves(m.speciesId);
      m.moveLv = m.moveLv || {};
      if (m.moves.length < slots) {
        m.moves.push(id);
        m.moveLv[id] = m.level;
        await ui.msg(`${m.name}は ${mv.name}を 覚えた！`, 1.2);
        return;
      }
      await ui.msg(`${m.name}は ${mv.name}を 覚えようとしている……\nしかし 技を${slots}つ 覚えていて いっぱいだ！`, 0);
      const idx = await G.Screens.open(G.UIScreens.forgetMove(m, id));
      if (idx === null || idx < 0) {
        await ui.msg(`${m.name}は ${mv.name}を 覚えずに 終わった。`, 1.2);
      } else {
        const old = G.Moves[m.moves[idx]].name;
        delete m.moveLv[m.moves[idx]];
        m.moves[idx] = id;
        m.moveLv[id] = m.level;
        await ui.msg(`1、2の……ポカン！\n${m.name}は ${old}を きれいに忘れて ${mv.name}を 覚えた！`, 1.6);
      }
    },

    // 進化先（ctx: { place, item }）
    evolutionTarget(m, ctx = {}) {
      const e = G.Species[m.speciesId].evo;
      if (!e) return null;
      if (e.item) return ctx.item === e.item && !(e.level && m.level < e.level) ? e.to : null;
      if (e.level && m.level < e.level) return null;
      if (e.place && ctx.place !== e.place) return null;
      if (e.branch) {
        const b = Gr.branchChoice(m, e);
        return b ? b.to : null;
      }
      return e.to;
    },
    // 分岐進化：いちばん多く努力値を振った能力（同点が1位なら決まらない）に対応する進化先
    branchChoice(m, e) {
      const I = G.Individual;
      const evs = I.KEYS.map((k) => [k, I.ev(m, k)]).sort((a, b) => b[1] - a[1]);
      if (!evs[0][1] || evs[0][1] === evs[1][1]) return null;
      return e.branch.find((b) => b.stat === evs[0][0]) || null;
    },
    // 分岐進化のレベルに届いているのに、鍛え方で進化先が決まらないとき：ヒントの文（なければ null）
    branchHint(m, ctx = {}) {
      const e = G.Species[m.speciesId].evo;
      if (!e || !e.branch || (e.level && m.level < e.level) || (e.place && ctx.place !== e.place) || Gr.branchChoice(m, e)) return null;
      const N = G.Individual.NAMES;
      return `${m.name}は 進化の力を 秘めているようだ……\n（${e.branch.map((b) => `${N[b.stat]}`).join('か ')}を いちばん多く 鍛えると 進化する）`;
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
      G.MoveStage.pin(m); // 種族が変わっても、技の強化段階はそのまま
      m.speciesId = to;
      Mon().fitExp(m, from); // ふつうは変わらない。系統の最初の姿が違う進化（配合で生まれた種族の進化など）のときだけ合わせる
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
