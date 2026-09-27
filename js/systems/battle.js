// ターン制バトル本体。演出（アニメ・メッセージ）を await で順番に流す。
//   G.Battle.start({ enemies:[個体...], type:'wild'|'trainer', trainer, bg, where }) → 'win' | 'lose' | 'run'
//   描画は js/scenes/battle.js、コマンド画面は js/ui/battleui.js
(function (G) {
  'use strict';

  const STAT_LABEL = { atk: '攻撃', def: '防御', spd: '素早さ', sat: '特攻', sdf: '特防', acc: '命中', eva: '回避' };
  const STATUS = {
    poison: { name: '毒', short: '毒', inflict: 'は 毒におかされた！', guard: 'poison_guard' },
    burn:   { name: 'やけど', short: '火傷', inflict: 'は やけどを負った！' },
    para:   { name: '麻痺', short: '麻痺', inflict: 'は 体がしびれて 動きにくくなった！', guard: 'para_guard' },
    sleep:  { name: '眠り', short: '眠り', inflict: 'は 眠ってしまった！', guard: 'sleep_guard' },
  };
  const stageMul = (s) => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));
  const stageMul3 = (s) => (s >= 0 ? (3 + s) / 3 : 3 / (3 - s));
  const other = (side) => (side === 'player' ? 'enemy' : 'player');
  const fx = (m) => G.traitFx(m); // 特性の効果（js/data/traits.js）
  // 特性の名前（メッセージ用）：効果キーを持つ最初の特性
  const traitName = (m, key) => {
    const t = G.traitsOf(m).find((id) => G.Traits[id].fx && G.Traits[id].fx[key] !== undefined);
    return t ? G.Traits[t].name : '特性';
  };

  function freshSide() {
    return { mon: null, stages: { atk: 0, def: 0, spd: 0, sat: 0, sdf: 0, acc: 0, eva: 0 }, sleep: 0 };
  }

  class Battle {
    constructor(opts) {
      this.type = opts.type || 'wild';
      this.trainer = opts.trainer || null;
      this.enemyParty = opts.enemies;
      this.bg = opts.bg || 'meadow';
      this.where = opts.where || '';
      this.sides = { player: freshSide(), enemy: freshSide() };
      this.over = false;
      this.result = null;
      this.runAttempts = 0;
      this.participants = new Set(); // この敵と戦った幻獣（経験値の分配先）
      this.leveled = new Set();      // レベルが上がった幻獣（戦闘後の進化判定用）
      this.stone = null;             // 投げた絆石の演出状態
      // 演出用の状態
      this.t = 0;
      this.anims = [];
      this.fx = [];
      this.sprite = {
        player: { dx: 0, dy: 0, alpha: 0, flash: 0, shake: 0 },
        enemy: { dx: 0, dy: 0, alpha: 0, flash: 0, shake: 0 },
        trainer: { dx: 0, dy: 0, alpha: 0, flash: 0, shake: 0 },
      };
      this.disp = { player: { hp: 0, mp: 0, exp: 0 }, enemy: { hp: 0, mp: 0, exp: 0 } };
      this.screenFlash = 0;
    }

    // ---------------- 演出ヘルパー ----------------
    msg(text, auto = 0.9) { return G.Dialog.open([text], { auto }); }
    wait(sec) { return this.animate(null, 'wait', sec); }
    animate(side, kind, dur, extra = {}) {
      return new Promise((resolve) => this.anims.push(Object.assign({ side, kind, t: 0, dur, resolve }, extra)));
    }
    waitBars() {
      return new Promise((resolve) => this.anims.push({ kind: 'bars', t: 0, dur: 9, resolve }));
    }
    barsSettled() {
      for (const s of ['player', 'enemy']) {
        const m = this.sides[s].mon;
        const d = this.disp[s];
        if (m && (Math.abs(d.hp - m.hp) > 0.01 || Math.abs(d.mp - m.mp) > 0.01 || Math.abs(d.exp - m.exp) > 0.01)) return false;
      }
      return true;
    }

    update(dt) {
      this.t += dt;
      // HP・MPバーをなめらかに追従
      for (const s of ['player', 'enemy']) {
        const m = this.sides[s].mon;
        if (!m) continue;
        const st = G.Monster.stats(m);
        const step = Math.max(st.hp, 20) * 1.2 * dt;
        const d = this.disp[s];
        d.hp += Math.sign(m.hp - d.hp) * Math.min(Math.abs(m.hp - d.hp), step);
        d.mp += Math.sign(m.mp - d.mp) * Math.min(Math.abs(m.mp - d.mp), Math.max(st.mp, 10) * 1.5 * dt);
        const sp = G.Species[m.speciesId];
        const span = Math.max(1, G.Monster.expForLevel(sp, m.level + 1) - G.Monster.expForLevel(sp, m.level));
        d.exp += Math.sign(m.exp - d.exp) * Math.min(Math.abs(m.exp - d.exp), span * 1.2 * dt);
      }
      for (const a of this.anims) {
        a.t += dt;
        const k = Math.min(1, a.t / a.dur);
        const sp = a.side ? this.sprite[a.side] : null;
        const dir = a.side === 'player' ? 1 : -1;
        switch (a.kind) {
          case 'appear': sp.alpha = k; sp.dx = (1 - k) * 60 * -dir; break;
          case 'withdraw': sp.alpha = 1 - k; sp.dx = k * 40 * -dir; break;
          case 'attack': sp.dx = Math.sin(k * Math.PI) * 18 * dir; break;
          case 'hit': sp.flash = Math.floor(k * 8) % 2; sp.shake = Math.sin(k * 40) * 4 * (1 - k); break;
          case 'faint': sp.dy = k * 40; sp.alpha = 1 - k; break;
          case 'bars': if (this.barsSettled()) a.t = a.dur; break;
          case 'throw': this.stone.x = 130 + 230 * k; this.stone.y = 230 - 130 * k - Math.sin(k * Math.PI) * 70; this.stone.rot += dt * 14; break;
          case 'absorb': sp.alpha = 1 - k; this.stone.glow = Math.sin(k * Math.PI); break;
          case 'drop': this.stone.rot = 0; this.stone.y = 100 + 42 * k - Math.abs(Math.sin(k * Math.PI * 2)) * 10 * (1 - k); break;
          case 'wobble': this.stone.rot = Math.sin(k * Math.PI * 2) * 0.45; break;
          case 'click': this.stone.glow = 1 - k; break;
          case 'breakout': sp.alpha = k; break;
          default: break;
        }
        if (a.t >= a.dur) {
          if (sp) { sp.flash = 0; sp.shake = 0; if (a.kind === 'attack') sp.dx = 0; if (a.kind === 'appear') { sp.dx = 0; sp.alpha = 1; } }
          a.done = true;
        }
      }
      const done = this.anims.filter((a) => a.done);
      this.anims = this.anims.filter((a) => !a.done);
      done.forEach((a) => a.resolve());
      for (const f of this.fx) { f.t += dt; }
      this.fx = this.fx.filter((f) => f.t < f.dur);
      this.screenFlash = Math.max(0, this.screenFlash - dt * 3);
    }

    addFx(kind, side, color, dur = 0.5) {
      this.fx.push({ kind, side, color, t: 0, dur });
      if (kind !== 'hit') G.Audio.se(kind); // heal / up / down / status
    }

    // ---------------- 能力値 ----------------
    stat(side, key) {
      const s = this.sides[side];
      const m = s.mon;
      const base = G.Monster.stats(m);
      const f = fx(m);
      if (key === 'acc') return (base.acc + (f.acc || 0)) * stageMul3(s.stages.acc);
      if (key === 'eva') return base.eva + (f.eva || 0);
      let v = base[key] * stageMul(s.stages[key]) * (f.stat[key] || 1);
      if (key === 'spd' && m.status === 'para') v *= 0.5;
      return v;
    }

    // ---------------- 流れ ----------------
    async run() {
      const enemy = this.enemyParty[0];
      const tr = this.trainer;
      if (!tr) {
        this.setActive('enemy', enemy);
        G.Dex.record(enemy.speciesId, 'seen', this.where);
        await this.animate('enemy', 'appear', 0.5);
        await G.Dialog.open([`野生の ${enemy.name}が 飛び出してきた！`]);
      } else {
        // トレーナー戦：本人が登場 → セリフ → 下がって幻獣をくり出す
        if (tr.boss) { this.screenFlash = 1; await this.wait(0.4); }
        if (tr.look) {
          await this.animate('trainer', 'appear', 0.5);
          await G.Dialog.open([tr.boss ? `ボス戦！\n${tr.name}が 勝負をしかけてきた！` : `${tr.name}が 勝負をしかけてきた！`]);
          if (tr.intro && tr.intro.length) await G.Dialog.open(tr.intro, { speaker: tr.name });
          await this.animate('trainer', 'withdraw', 0.35);
        } else {
          await G.Dialog.open([tr.introText || `${tr.name}が あらわれた！`]);
        }
        this.setActive('enemy', enemy);
        G.Dex.record(enemy.speciesId, 'seen', this.where);
        await this.msg(tr.look ? `${tr.name}は ${enemy.name}を くり出した！` : `${enemy.name}が 立ちはだかる！`, 0.8);
        await this.animate('enemy', 'appear', 0.45);
      }
      const lead = G.state.party.find((m) => m.hp > 0);
      await this.sendOut('player', lead);
      await this.onEnter('enemy');

      while (!this.over) {
        const action = await this.chooseAction();
        await this.playTurn(action);
      }
      await this.finish();
      return this.result;
    }

    setActive(side, mon) {
      const s = this.sides[side] = freshSide();
      s.mon = mon;
      if (mon.status === 'sleep') s.sleep = 1 + G.Util.randInt(3);
      this.disp[side].hp = mon.hp;
      this.disp[side].mp = mon.mp;
      this.disp[side].exp = mon.exp;
      if (side === 'player') this.participants.add(mon);
    }

    async sendOut(side, mon) {
      this.setActive(side, mon);
      this.sprite[side].dy = 0;
      if (side === 'player') await this.msg(`ゆけっ！ ${mon.name}！`, 0.5);
      else {
        G.Dex.record(mon.speciesId, 'seen', this.where);
        await this.msg(this.trainer.look ? `${this.trainer.name}は ${mon.name}を くり出した！` : `${mon.name}が 立ちはだかる！`, 0.7);
      }
      await this.animate(side, 'appear', 0.4);
      await this.onEnter(side);
    }

    // 登場時の特性
    async onEnter(side) {
      const m = this.sides[side].mon;
      if (m && fx(m).intimidate && this.sides[other(side)].mon) {
        await this.msg(`${m.name}の ${traitName(m, 'intimidate')}！`, 0.6);
        await this.changeStage(other(side), 'atk', -1);
      }
    }

    chooseAction() {
      const m = this.sides.player.mon;
      G.UI.showIdle(`${m.name}は どうする？`);
      return G.Screens.open(G.UIScreens.battleCommand(this));
    }

    enemyAction() {
      const me = this.sides.enemy.mon;
      const foe = this.sides.player.mon;
      const usable = me.moves.filter((id) => G.Moves[id].mp <= me.mp);
      if (!usable.length) return { type: 'move', move: 'kougeki' }; // MPが尽きたら通常攻撃
      const sp = G.Species[me.speciesId];
      const fsp = G.Species[foe.speciesId];
      const st = G.Monster.stats(me);
      const weights = usable.map((id) => {
        const mv = G.Moves[id];
        const eff = mv.eff || {};
        if (mv.cat !== 'stat') {
          return mv.pow * G.typeMultiplier(mv.el, G.elementsOf(fsp)) * (G.isStab(mv.el, sp) ? 1.5 : 1) + 15;
        }
        if (eff.heal) return me.hp < st.hp * 0.5 ? 90 : 3;
        if (eff.status) return foe.status ? 2 : 35;
        if (mv.target === 'self') return this.sides.enemy.stages[eff.stat] >= 2 ? 3 : 25;
        return this.sides.player.stages[eff.stat] <= -2 ? 3 : 20;
      });
      const total = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * total;
      for (let i = 0; i < usable.length; i++) { r -= weights[i]; if (r <= 0) return { type: 'move', move: usable[i] }; }
      return { type: 'move', move: usable[0] };
    }

    async playTurn(pAct) {
      this.sides.player.guard = false; // ぼうぎょは、そのターンだけ
      this.sides.enemy.guard = false;
      pAct.side = 'player';
      pAct.mon = this.sides.player.mon;
      const eAct = Object.assign(this.enemyAction(), { side: 'enemy', mon: this.sides.enemy.mon });
      // 「先制感知」などの特性は、一定確率で先に動ける
      const quick = (a) => (a.type === 'move' && Math.random() < (fx(a.mon).quick || 0) ? 0.5 : 0);
      const prio = (a) => (a.type !== 'move' ? 10 : (G.Moves[a.move].prio || 0) + (a.quickBonus || 0));
      pAct.quickBonus = quick(pAct);
      eAct.quickBonus = quick(eAct);
      const acts = [pAct, eAct].sort((a, b) =>
        prio(b) - prio(a) || this.stat(b.side, 'spd') - this.stat(a.side, 'spd') || Math.random() - 0.5);

      for (const a of acts) {
        if (this.over) return;
        if (this.sides[a.side].mon !== a.mon || a.mon.hp <= 0) continue; // 倒れた・交代した
        await this.doAction(a);
        await this.checkFaints();
      }
      if (!this.over) {
        await this.endOfTurn();
        await this.checkFaints();
      }
    }

    async doAction(a) {
      if (a.type === 'move') return this.useMove(a.side, a.move);
      if (a.type === 'switch') {
        const cur = this.sides.player.mon;
        await this.msg(`もどれ、${cur.name}！`, 0.5);
        await this.animate('player', 'withdraw', 0.3);
        return this.sendOut('player', a.target);
      }
      if (a.type === 'item') {
        const text = G.ItemUse.use(a.item, a.target);
        await this.msg(`${G.state.player.name}は ${G.Items[a.item].name}を 使った！`, 0.6);
        if (a.target === this.sides.player.mon) this.addFx('heal', 'player', '#8af08a', 0.6);
        await this.waitBars();
        await this.msg(text || 'しかし 効果がなかった……', 0.8);
        G.UI.refresh();
        return undefined;
      }
      if (a.type === 'guard') return this.guard(a.side);
      if (a.type === 'charge') return this.charge(a.side);
      if (a.type === 'meditate') return this.meditate(a.side);
      if (a.type === 'run') return this.tryRun();
      if (a.type === 'catch') return this.throwStone(a.item);
      return undefined;
    }

    // ぼうぎょ：そのターンに受けるダメージを半分にする。先に動ける
    async guard(side) {
      const s = this.sides[side];
      s.guard = true;
      await this.msg(`${s.mon.name}は 身を守っている！`, 0.6);
    }

    // めいそう：心を静めて、MPを最大の MEDITATE_MP_RATE（最低2）回復する。守りは固くならない
    async meditate(side) {
      const m = this.sides[side].mon;
      const max = G.Monster.stats(m).mp;
      await this.msg(`${m.name}は 目を閉じて 心を静めている……`, 0.6);
      const gain = Math.min(max - m.mp, Math.max(2, Math.round(max * G.GrowthConfig.MEDITATE_MP_RATE)));
      if (gain <= 0) { await this.msg('しかし MPは 満タンだ！', 0.6); return; }
      m.mp += gain;
      this.addFx('heal', side, '#8ab8f0', 0.5);
      await this.waitBars();
      await this.msg(`${m.name}の MPが ${gain} 回復した！`, 0.6);
    }

    // ためる：次の攻撃のダメージを CHARGE_MUL 倍にする（重ねがけはできない。入れかえると消える）
    async charge(side) {
      const s = this.sides[side];
      const m = s.mon;
      if (s.charged) { await this.msg(`${m.name}は もう じゅうぶん 力を ためている！`, 0.7); return; }
      s.charged = true;
      this.addFx('heal', side, '#ffd35a', 0.5);
      await this.msg(`${m.name}は 力を ためている！`, 0.6);
    }

    async tryRun() {
      if (this.type !== 'wild') { await this.msg('勝負の最中に 逃げることはできない！'); return; }
      this.runAttempts++;
      const my = this.stat('player', 'spd'), foe = this.stat('enemy', 'spd');
      const chance = my >= foe ? 1 : (my * 128 / foe + 30 * this.runAttempts) / 256;
      if (Math.random() < chance) {
        G.Audio.se('run');
        await this.msg('うまく 逃げきれた！', 0.8);
        this.over = true;
        this.result = 'run';
      } else {
        await this.msg('しかし 逃げられなかった！', 0.8);
      }
    }

    // ---------------- 技 ----------------
    async useMove(side, moveId) {
      const me = this.sides[side];
      const foeSide = other(side);
      const foe = this.sides[foeSide];
      const m = me.mon;

      if (m.status === 'sleep') {
        me.sleep--;
        if (me.sleep <= 0) { m.status = null; await this.msg(`${m.name}は 目を覚ました！`, 0.6); }
        else { await this.msg(`${m.name}は ぐうぐう 眠っている。`, 0.7); return; }
      }
      if (m.status === 'para' && Math.random() < 0.25) {
        await this.msg(`${m.name}は 体がしびれて 動けない！`, 0.7);
        return;
      }

      let mv = G.Moves[moveId];
      if (m.mp < mv.mp) { moveId = 'kougeki'; mv = G.Moves.kougeki; } // MPが足りなければ通常攻撃に
      m.mp -= mv.mp;
      await this.msg(`${m.name}の ${mv.name}！`, 0.5);

      // ためた力：次の攻撃技で使う（外れても消える。補助技では消えない）
      me.power = 1;
      if (me.charged && mv.cat !== 'stat') {
        me.charged = false;
        me.power = G.GrowthConfig.CHARGE_MUL;
        await this.msg('ためた力を 一気に 解きはなった！', 0.5);
      }

      const selfTarget = mv.target === 'self';
      if (!selfTarget && !foe.mon) { await this.msg('しかし 相手がいない……'); return; }
      await this.animate(side, 'attack', 0.3);

      // 命中判定：技の命中 × 使い手の命中（基準100＋特性、戦闘中の上げ下げ）× 相手の回避（特性の回避1につき1%かわす）
      const myFx = fx(m);
      if (!selfTarget) {
        let acc = mv.acc * (this.stat(side, 'acc') / 100) * stageMul3(-foe.stages.eva) * (1 - Math.min(50, this.stat(foeSide, 'eva')) / 100);
        if (mv.cat === 'stat' && myFx.hex) acc += 20; // 呪術の才
        if (Math.random() * 100 >= acc) { await this.msg('しかし 攻撃は 外れた！', 0.7); return; }
      }

      const eff = mv.eff || {};
      if (mv.cat === 'stat') {
        if (eff.heal) {
          const max = G.Monster.stats(m).hp;
          if (m.hp >= max) { await this.msg('しかし HPは 満タンだ！', 0.7); }
          else {
            const before = m.hp;
            m.hp = Math.min(max, m.hp + Math.floor(max * eff.heal * (myFx.healBoost || 1)));
            this.addFx('heal', side, '#8af08a', 0.7);
            await this.waitBars();
            await this.msg(`${m.name}の HPが ${m.hp - before} 回復した！`, 0.7);
          }
        }
        if (eff.stat) await this.changeStage(selfTarget ? side : foeSide, eff.stat, eff.stages);
        if (eff.stats) for (const st of eff.stats) await this.changeStage(selfTarget ? side : foeSide, st, eff.stages);
        if (eff.status) {
          const ok = await this.inflict(foeSide, eff.status, true);
          if (!ok) await this.msg('しかし うまく 決まらなかった！', 0.7);
        }
        return;
      }

      // ダメージ技
      const r = this.calcDamage(side, foeSide, mv);
      if (r.mul === 0) { await this.msg(`${foe.mon.name}には 効果が ないようだ……`, 0.8); return; }
      this.addFx('hit', foeSide, G.Elements[mv.el].color, 0.45);
      G.Audio.se(r.mul > 1 ? 'super' : r.mul < 1 ? 'weak' : 'hit');
      this.screenFlash = r.mul > 1 ? 0.6 : 0.25;
      const fm = foe.mon;
      let dmg = r.dmg;
      let endured = false;
      if (fx(fm).sturdy && fm.hp === G.Monster.stats(fm).hp && dmg >= fm.hp) { dmg = fm.hp - 1; endured = true; }
      fm.hp = Math.max(0, fm.hp - dmg);
      await this.animate(foeSide, 'hit', 0.4);
      await this.waitBars();
      if (r.crit) await this.msg('急所に 当たった！', 0.6);
      if (r.mul > 1) await this.msg('効果は 抜群だ！', 0.7);
      else if (r.mul < 1) await this.msg('効果は いまひとつのようだ……', 0.7);
      if (endured) await this.msg(`${fm.name}は ${traitName(fm, 'sturdy')}で もちこたえた！`, 0.7);

      // 連撃の才：もう一度当たる（威力半分）
      if (fm.hp > 0 && myFx.doubleHit && Math.random() < myFx.doubleHit) {
        const extra = Math.max(1, Math.floor(this.calcDamage(side, foeSide, mv).dmg / 2));
        fm.hp = Math.max(0, fm.hp - extra);
        dmg += extra;
        G.Audio.se('hit');
        await this.animate(foeSide, 'hit', 0.3);
        await this.waitBars();
        await this.msg(`${traitName(m, 'doubleHit')}！ もう一撃 当たった！`, 0.6);
      }

      const drainRate = (eff.drain || 0) + (mv.cat === 'spec' ? (myFx.specDrain || 0) : 0);
      if (drainRate && dmg > 0 && m.hp > 0) {
        const max = G.Monster.stats(m).hp;
        const heal = Math.max(1, Math.floor(dmg * drainRate));
        m.hp = Math.min(max, m.hp + heal);
        await this.waitBars();
        await this.msg(`${fm.name}から 体力を 吸い取った！`, 0.6);
      }
      if (eff.recoil && dmg > 0) {
        m.hp = Math.max(0, m.hp - Math.max(1, Math.floor(dmg * eff.recoil)));
        await this.waitBars();
        await this.msg(`${m.name}は 反動を 受けた！`, 0.6);
      }
      // 追加効果（呪術の才なら発動率2倍）
      const chanceMul = myFx.hex ? 2 : 1;
      if (fm.hp > 0 && eff.status && Math.random() * 100 < (eff.chance || 100) * chanceMul) await this.inflict(foeSide, eff.status, false);
      if (fm.hp > 0 && eff.stat && Math.random() * 100 < (eff.chance || 100) * chanceMul) await this.changeStage(foeSide, eff.stat, eff.stages);
    }

    // ダメージ計算
    calcDamage(side, foeSide, mv) {
      const a = this.sides[side].mon, d = this.sides[foeSide].mon;
      const asp = G.Species[a.speciesId], dsp = G.Species[d.speciesId];
      // 通常攻撃（こうげき）は、攻撃と特殊攻撃の高い方を使う
      const phys = mv.basic ? this.stat(side, 'atk') >= this.stat(side, 'sat') : mv.cat === 'phys';
      let A = this.stat(side, phys ? 'atk' : 'sat');
      const D = Math.max(1, this.stat(foeSide, phys ? 'def' : 'sdf'));
      if (phys && a.status === 'burn') A *= 0.5;
      const lv = a.level;
      let dmg = Math.floor(Math.floor((2 * lv) / 5 + 2) * mv.pow * A / D / 50) + 2;
      const mul = G.typeMultiplier(mv.el, dsp.el);
      const af = fx(a), df = fx(d);
      const crit = Math.random() < (af.crit ? 1 / 6 : 1 / 16);
      let mod = mul * (crit ? 1.5 : 1) * (0.85 + Math.random() * 0.15);
      if (G.isStab(mv.el, asp)) mod *= af.stab || 1.5;                             // タイプ一致は1.5倍（複合タイプはどちらでも。属性共鳴で1.8）
      if (af.elements && af.elements[mv.el]) mod *= af.elements[mv.el];           // ○○の加護
      if (mul > 1 && af.superBoost) mod *= af.superBoost;                          // 弱点看破
      if (af.finisher && d.hp <= G.Monster.stats(d).hp / 2) mod *= af.finisher;   // 追撃本能
      if (!phys && df.guardSpec) mod *= df.guardSpec;                              // 水鏡の守り
      if (this.sides[foeSide].guard) mod *= 0.5;                                   // ぼうぎょ中はダメージ半分
      mod *= this.sides[side].power || 1;                                          // ためた力（ためる）
      dmg = mul === 0 ? 0 : Math.max(1, Math.floor(dmg * mod));
      return { dmg, mul, crit };
    }

    async inflict(side, status, fromPureMove) {
      const m = this.sides[side].mon;
      const def = STATUS[status];
      if (!m || m.hp <= 0 || m.status) return false;
      const f = fx(m);
      const guarded = (f.guard && f.guard.includes(status)) || (f.statusResist && Math.random() < f.statusResist);
      if (guarded) {
        const key = f.guard && f.guard.includes(status) ? 'guard' : 'statusResist';
        if (fromPureMove) await this.msg(`${m.name}は ${traitName(m, key)}で 守られている！`, 0.7);
        return fromPureMove;
      }
      if (status === 'burn' && G.elementsOf(G.Species[m.speciesId]).includes('fire')) return false;
      m.status = status;
      if (status === 'sleep') this.sides[side].sleep = 1 + G.Util.randInt(3);
      this.addFx('status', side, '#c08af0', 0.5);
      await this.msg(`${m.name}${def.inflict}`, 0.7);
      return true;
    }

    async changeStage(side, stat, n) {
      const s = this.sides[side];
      const m = s.mon;
      if (!m) return;
      const cur = s.stages[stat];
      const next = Math.max(-6, Math.min(6, cur + n));
      if (next === cur) {
        await this.msg(`${m.name}の ${STAT_LABEL[stat]}は もう ${n > 0 ? '上がらない' : '下がらない'}！`, 0.7);
        return;
      }
      s.stages[stat] = next;
      this.addFx(n > 0 ? 'up' : 'down', side, n > 0 ? '#f0c040' : '#6aa0f0', 0.7);
      const word = n >= 2 ? 'ぐーんと 上がった！' : n > 0 ? '上がった！' : n <= -2 ? 'がくっと 下がった！' : '下がった！';
      await this.msg(`${m.name}の ${STAT_LABEL[stat]}が ${word}`, 0.7);
    }

    async endOfTurn() {
      for (const side of ['player', 'enemy']) {
        const m = this.sides[side].mon;
        if (!m || m.hp <= 0) continue;
        const max = G.Monster.stats(m).hp;
        if (m.status === 'poison' || m.status === 'burn') {
          m.hp = Math.max(0, m.hp - Math.max(1, Math.floor(max / (m.status === 'poison' ? 8 : 16))));
          await this.animate(side, 'hit', 0.3);
          await this.waitBars();
          await this.msg(`${m.name}は ${m.status === 'poison' ? '毒' : 'やけど'}の ダメージを 受けた！`, 0.6);
        }
        const regen = fx(m).regen;
        if (m.hp > 0 && regen && m.hp < max) {
          m.hp = Math.min(max, m.hp + Math.max(1, Math.floor(max / regen)));
          this.addFx('heal', side, '#8af08a', 0.5);
          await this.waitBars();
          await this.msg(`${m.name}は ${traitName(m, 'regen')}で 少し 回復した。`, 0.6);
        }      }
    }

    async checkFaints() {
      for (const side of ['enemy', 'player']) {
        if (this.over) return;
        const s = this.sides[side];
        const m = s.mon;
        if (!m || m.hp > 0) continue;
        m.status = null;
        G.Audio.se('faint');
        await this.animate(side, 'faint', 0.5);
        await this.msg(side === 'enemy' && this.type === 'wild' ? `野生の ${m.name}は たおれた！` : `${m.name}は たおれた！`, 0.9);
        s.mon = null;
        if (side === 'enemy') {
          await this.onEnemyFainted(m);
          const next = this.enemyParty.find((x) => x.hp > 0);
          if (next) await this.sendOut('enemy', next);
          else { this.over = true; this.result = 'win'; }
        } else {
          const healthy = G.state.party.filter((x) => x.hp > 0);
          if (!healthy.length) { this.over = true; this.result = 'lose'; }
          else {
            const pick = await G.Screens.open(G.UIScreens.battleParty(this, true));
            await this.sendOut('player', pick);
          }
        }
      }
    }

    // 敵を倒したとき：戦った幻獣（生きているもの）全員に経験値
    async onEnemyFainted(enemy) {
      const amount = G.Growth.expYield(enemy, !!this.trainer);
      const ui = {
        msg: (t, a = 1.0) => this.msg(t, a),
        waitBars: () => this.waitBars(),
        onLevel: (m) => this.leveled.add(m),
      };
      for (const m of this.participants) {
        if (m.hp > 0 && G.state.party.includes(m)) {
          G.Individual.evFromDefeat(m, enemy, !!this.trainer); // 努力値は、実際に戦った幻獣だけがもらえる
          await G.Growth.gainExp(m, amount, ui);
        }
      }
      // 戦っていない仲間も 3割 の経験値（配合で生まれた子を育てやすくする）
      const others = G.state.party.filter((m) => m.hp > 0 && !this.participants.has(m) && m.level < G.Monster.MAX_LEVEL);
      if (others.length) {
        await this.msg('ほかの仲間も 経験値を 少しもらった！', 0.8);
        for (const m of others) await G.Growth.gainExp(m, Math.max(1, Math.floor(amount * 0.3)), ui, true);
      }
      const cur = this.sides.player.mon;
      this.participants = new Set(cur && cur.hp > 0 ? [cur] : []);
    }

    // ---------------- 捕獲 ----------------
    catchChance(foe, itemId) {
      const st = G.Monster.stats(foe);
      const sp = G.Species[foe.speciesId];
      const statusBonus = foe.status === 'sleep' ? 2 : foe.status ? 1.5 : 1;
      const a = ((3 * st.hp - 2 * foe.hp) * sp.catch * G.Items[itemId].rate * statusBonus) / (3 * st.hp);
      return Math.min(1, a / 255);
    }

    async throwStone(itemId) {
      const it = G.Items[itemId];
      const foe = this.sides.enemy.mon;
      G.addItem(itemId, -1);
      await this.msg(`${G.state.player.name}は ${it.name}を 投げた！`, 0.4);
      this.stone = { item: itemId, x: 130, y: 230, rot: 0, glow: 0 };
      G.Audio.se('throw');
      await this.animate(null, 'throw', 0.55);
      await this.animate('enemy', 'absorb', 0.45);
      await this.animate(null, 'drop', 0.35);
      // HPが低いほど、状態異常ほど、上位の絆石ほど成功しやすい。4回の判定をすべて通れば成功
      const p = Math.pow(this.catchChance(foe, itemId), 1 / 4);
      let shakes = 0;
      while (shakes < 4 && Math.random() < p) shakes++;
      for (let i = 0; i < Math.min(3, shakes); i++) { G.Audio.se('wobble'); await this.animate(null, 'wobble', 0.6); }
      if (shakes >= 4) {
        G.Audio.se('catch');
        await this.animate(null, 'click', 0.5);
        this.addFx('up', 'enemy', '#fff0a0', 0.8);
        await G.Dialog.open([`やった！\n野生の ${foe.name}と 絆を 結んだ！`]);
        this.stone = null;
        this.sides.enemy.mon = null;
        foe.origin = { how: 'wild', where: this.where };
        const dest = G.Party.add(foe);
        G.Dex.record(foe.speciesId, 'wild', this.where);
        G.UI.refresh();
        await this.msg(dest === 'party' ? `${foe.name}が 仲間に 加わった！` : `パーティが いっぱいなので\n${foe.name}は 預かり所へ 送られた。`, 1.4);
        this.over = true;
        this.result = 'caught';
        return;
      }
      this.stone = null;
      G.Audio.se('breakout');
      await this.animate('enemy', 'breakout', 0.3);
      await this.msg(['ダメだ！ 絆を 結べなかった！', 'ああっ！ 石から 飛び出してしまった！', 'おしい！ もう少しだったのに！', 'あと ちょっとで 絆を 結べたのに！'][Math.min(3, shakes)], 1.0);
    }

    async finish() {
      const tr = this.trainer;
      if (this.result === 'win') {
        G.Audio.jingle('victory', G.Field.bgmName());
        if (tr) {
          if (tr.look) {
            this.sprite.trainer.dy = 0;
            await this.animate('trainer', 'appear', 0.4);
          }
          await G.Dialog.open([tr.boss ? `${tr.name}を たおした！` : `${tr.name}との 勝負に 勝った！`]);
          if (tr.defeat && tr.defeat.length) await G.Dialog.open(tr.defeat, { speaker: tr.name });
        } else {
          await this.msg('戦いに 勝利した！', 1.0);
        }
        // お金：倒した幻獣のレベルとランクから。「幸運」持ちが戦っていれば1.5倍
        let gold = this.enemyParty.reduce((s, m) => s + m.level * 6 + G.rankIndex(G.Species[m.speciesId].rank) * 10, 0);
        if (tr) gold = tr.reward !== undefined ? tr.reward : gold * 3;
        const lucky = G.state.party.some((m) => m.hp > 0 && fx(m).lucky);
        if (lucky) gold = Math.floor(gold * 1.5);
        if (gold > 0) {
          G.addMoney(gold);
          G.UI.refresh();
          await this.msg(`${gold}G を 手に入れた！${lucky ? '（幸運！）' : ''}`, 1.2);
        }
      } else if (this.result === 'lose') {
        if (tr && tr.canLose) {
          await G.Dialog.open([`${G.state.player.name}は ${tr.name}に 負けてしまった……`]);
        } else {
          await G.Dialog.open([`${G.state.player.name}の 手持ちの幻獣は すべて たおれてしまった……`, '目の前が 真っ暗に なった！']);
        }
      }
    }
  }

  G.Battle = {
    current: null,
    STATUS,
    async start(opts) {
      const b = new Battle(opts);
      G.Battle.current = b;
      const prevScene = G.scene;
      G.UI.hideBanner();
      G.Audio.bgm(opts.trainer && opts.trainer.boss ? 'boss' : 'battle');
      G.setScene(G.Scenes.battle);
      let result;
      try {
        result = await b.run();
        G.Battle.lastLeveled = [...b.leveled];
      } finally {
        G.Screens.closeAll();
        G.Battle.current = null;
        G.setScene(prevScene);
        if (G.Audio.current() !== 'victory') G.Audio.bgm(G.Field.bgmName());
        G.UI.refresh();
      }
      return result;
    },

    // js/data/trainers.js のトレーナーと戦う。負けても良い戦い（canLose）は全員回復して戻る
    async fight(key, opts = {}) {
      const def = G.Trainers[key];
      const party = typeof def.party === 'function' ? def.party() : def.party;
      // トレーナーの幻獣は個体値を固定して、戦いの難しさが毎回同じになるようにする
      const ivs = def.ivs !== undefined ? def.ivs : def.boss ? G.GrowthConfig.BOSS_IV : G.GrowthConfig.TRAINER_IV;
      const enemies = party.map(([id, lv]) => G.Monster.create(id, lv, { power: def.power || 0, ivs, how: 'trainer' }));
      const trainer = Object.assign({}, def, {
        name: G.format(def.name),
        intro: (def.intro || []).map(G.format),
        defeat: (def.defeat || []).map(G.format),
      });
      const result = await G.Battle.start({
        type: 'trainer', trainer, enemies, bg: opts.bg || (G.Field.map && G.Encounters[G.Field.map.encounter] ? G.Encounters[G.Field.map.encounter].bg : 'meadow'),
        where: opts.where || (G.Field.map ? G.format(G.Field.map.name) : ''),
      });
      if (result === 'lose' && def.canLose) G.Party.healAll();
      // 勝利時の進化判定・全滅時の搬送はフィールド側の共通処理に任せる
      else await G.Field.afterBattle(result);
      return result;
    },
  };
})(window.Game);
