// フィールド（マップ表示・移動・当たり判定・マップ切替・調べる/話す）
(function (G) {
  'use strict';

  const T = G.TILE;
  const VW = G.VIEW_W * T, VH = G.VIEW_H * T;
  const WALK = 0.18, RUN = 0.1, NPC_STEP = 0.32, FADE = 0.22, TURN_DELAY = 0.09;

  const F = G.Field = {
    map: null,
    p: null,          // プレイヤー
    npcs: [],
    solid: null,      // 静的な当たり判定
    t: 0,
    trans: null,      // フェード中のマップ切替
    pendingEnter: false,
    particles: [],
    lastBump: null,
    turnDelay: 0,
    lastOutdoor: null,
  };

  // ---------------- 開始・ロード ----------------
  F.start = function () {
    const s = G.state.player;
    G.setScene(F.scene);
    F.load(s.map, s.x, s.y, s.dir);
    F.trans = { phase: 'in', t: 0 };
  };

  function makeMover(x, y, dir) {
    return { x, y, dir, moving: false, fromX: x, fromY: y, toX: x, toY: y, prog: 0, speed: WALK, frame: 0, parity: 0 };
  }

  function makeNpc(n) {
    return Object.assign(makeMover(n.x, n.y, n.dir || 'down'), {
      def: n, id: n.id, name: n.name, look: n.look,
      homeX: n.x, homeY: n.y, wander: n.wander || 0, timer: 1 + Math.random() * 3,
    });
  }

  // ---- イベント用：NPCの出現・退場・移動、条件待ち ----
  F.showNpc = function (id, x, y, dir) {
    const def = F.map.npcs.find((n) => n.id === id);
    const n = makeNpc(def);
    if (x !== undefined) { n.x = n.fromX = n.toX = x; n.y = n.fromY = n.toY = y; }
    if (dir) n.dir = dir;
    F.npcs.push(n);
    return n;
  };
  F.hideNpc = function (id) { F.npcs = F.npcs.filter((n) => n.id !== id); };
  F.waitUntil = (cond) => new Promise((res) => F.waiters.push({ cond, res }));
  // path: 'uurrd' のような文字列（u/d/l/r）
  F.walkNpc = async function (id, path, speed = 0.22) {
    const D = { u: 'up', d: 'down', l: 'left', r: 'right' };
    const n = F.npcs.find((x) => x.id === id);
    if (!n) return;
    for (const c of path) {
      n.dir = D[c];
      const v = G.DIRS[D[c]];
      // イベント中の移動は当たり判定を無視して確実に歩かせる
      n.moving = true; n.fromX = n.x; n.fromY = n.y; n.toX = n.x + v.x; n.toY = n.y + v.y; n.prog = 0; n.speed = speed; n.parity ^= 1;
      await F.waitUntil(() => !n.moving);
    }
  };

  F.load = function (id, x, y, dir) {
    const m = G.MapData[id];
    if (!m) throw new Error('マップが見つかりません: ' + id);
    F.map = m;
    F.p = makeMover(x, y, dir);
    F.p.walking = false;
    F.npcs = m.npcs
      .filter((n) => !n.spawnOnly && (!n.visible || n.visible(G.state)))
      .map(makeNpc);
    F.waiters = [];
    F.buildSolid();
    F.particles = [];
    F.lastBump = null;
    Object.assign(G.state.player, { map: id, x, y, dir });
    F.pendingEnter = true;
    G.UI.refresh();
    G.Audio.bgm(F.bgmName());
    if (m.autosave) G.autoSave();
    if (m.outdoor && F.lastOutdoor !== id) G.UI.banner(G.format(m.name));
    if (m.outdoor) F.lastOutdoor = id;
  };

  F.buildSolid = function () {
    const m = F.map;
    const g = new Uint8Array(m.w * m.h);
    const mark = (x, y, v) => { if (x >= 0 && y >= 0 && x < m.w && y < m.h) g[y * m.w + x] = v; };
    for (let y = 0; y < m.h; y++) {
      for (let x = 0; x < m.w; x++) {
        const d = G.TileDefs[m.tiles[y][x]];
        if (!d || d.solid) g[y * m.w + x] = 1;
      }
    }
    for (const b of m.buildings) {
      for (let y = b.y; y < b.y + b.h; y++) for (let x = b.x; x < b.x + b.w; x++) mark(x, y, 1);
      if (b.door && !F.doorLocked(b)) mark(b.door.x, b.door.y, 0);
    }
    for (const o of m.objects) {
      if (o.visible && !o.visible()) continue;
      for (let y = o.y; y < o.y + (o.h || 1); y++) for (let x = o.x; x < o.x + (o.w || 1); x++) mark(x, y, 1);
    }
    for (const s of m.signs) mark(s.x, s.y, 1);
    F.solid = g;
  };

  // ---------------- 参照ヘルパー ----------------
  F.tileAt = (x, y) => G.mapTile(F.map, x, y);
  F.npcAt = (x, y) => F.npcs.find((n) => (n.x === x && n.y === y) || (n.moving && n.toX === x && n.toY === y));
  F.signAt = (x, y) => F.map.signs.find((s) => s.x === x && s.y === y);
  F.itemAt = (x, y) => F.map.items.find((it) => it.x === x && it.y === y && !G.hasFlag(it.flag));
  // フィールドの落とし物（一定時間ごとに現れる道具。G.state.fieldDrops[マップID] = { next, items: [{ x, y, item, count }] }）
  F.drops = () => { const d = G.state.fieldDrops && G.state.fieldDrops[F.map.id]; return d ? d.items : []; };
  F.dropAt = (x, y) => F.drops().find((d) => d.x === x && d.y === y);
  F.objectAt = (x, y) => F.map.objects.find((o) => (!o.visible || o.visible()) && x >= o.x && x < o.x + (o.w || 1) && y >= o.y && y < o.y + (o.h || 1));
  F.buildingAt = (x, y) => F.map.buildings.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
  F.warpAt = (x, y) => F.map.warps.find((w) => x >= w.x && x < w.x + (w.w || 1) && y >= w.y && y < w.y + (w.h || 1) &&
    !(w.building && F.doorLocked(w.building)));
  // unlockFlag が立つと開くドア
  F.doorLocked = (b) => !!(b.door && b.door.locked && !(b.door.unlockFlag && G.hasFlag(b.door.unlockFlag)));
  F.lockedDoorAt = (x, y) => {
    const b = F.buildingAt(x, y);
    return b && b.door && b.door.x === x && b.door.y === y && F.doorLocked(b) ? b : null;
  };

  F.blocked = function (x, y, self) {
    const m = F.map;
    if (x < 0 || y < 0 || x >= m.w || y >= m.h) return true;
    if (F.solid[y * m.w + x]) return true;
    if (F.itemAt(x, y) || F.dropAt(x, y)) return true;
    for (const n of F.npcs) {
      if (n === self) continue;
      if ((n.x === x && n.y === y) || (n.moving && n.toX === x && n.toY === y)) return true;
    }
    if (self !== F.p) {
      const p = F.p;
      if ((p.x === x && p.y === y) || (p.moving && p.toX === x && p.toY === y)) return true;
    }
    return false;
  };

  // ---------------- 移動 ----------------
  F.tryMove = function (m, dir, speed) {
    const v = G.DIRS[dir];
    const nx = m.x + v.x, ny = m.y + v.y;
    m.dir = dir;
    if (F.blocked(nx, ny, m)) {
      if (m === F.p) F.bump(nx, ny);
      return false;
    }
    m.moving = true;
    m.fromX = m.x; m.fromY = m.y;
    m.toX = nx; m.toY = ny;
    m.prog = 0;
    m.speed = speed;
    m.parity ^= 1;
    return true;
  };

  F.advance = function (m, dt) {
    m.prog += dt / m.speed;
    m.frame = m.prog < 0.5 ? (m.parity ? 1 : 2) : 0;
    if (m.prog >= 1) {
      m.x = m.toX; m.y = m.toY;
      m.moving = false;
      m.prog = 0;
      m.frame = 0;
    }
  };

  F.pos = (m) => ({
    x: (m.moving ? m.fromX + (m.toX - m.fromX) * m.prog : m.x) * T,
    y: (m.moving ? m.fromY + (m.toY - m.fromY) * m.prog : m.y) * T,
  });

  F.bump = function (x, y) {
    if (F.lastBump && F.lastBump.x === x && F.lastBump.y === y) return;
    F.lastBump = { x, y };
    G.Audio.se('bump');
    const b = F.lockedDoorAt(x, y);
    if (b) G.Events.run((E) => E.narrate(b.door.locked));
  };

  // 1歩進み終えたとき
  F.onStep = function () {
    const p = F.p;
    F.lastBump = null;
    Object.assign(G.state.player, { x: p.x, y: p.y, dir: p.dir });

    const w = F.warpAt(p.x, p.y);
    if (w) {
      const tx = w.tx + (w.keepX ? p.x - w.x : 0);
      const ty = w.ty + (w.keepY ? p.y - w.y : 0);
      F.warp(w.to, tx, ty, w.dir || p.dir);
      return true;
    }

    // イベントの発生地点（map.triggers）
    for (const tr of F.map.triggers || []) {
      const inside = p.x >= tr.x && p.x < tr.x + (tr.w || 1) && p.y >= tr.y && p.y < tr.y + (tr.h || 1);
      if (inside && !G.hasFlag(tr.flag) && (!tr.when || tr.when(G.state))) {
        G.setFlag(tr.flag);
        G.Events.run((E) => tr.run(E));
        return true;
      }
    }

    const def = G.TileDefs[F.tileAt(p.x, p.y)];
    if (def && def.encounter) {
      F.rustle(p.x, p.y);
      const enc = F.map.encounter;
      const canFight = G.state.party.some((m) => m.hp > 0);
      if (F.safeSteps > 0) F.safeSteps--; // 戦闘直後の数歩は遭遇しない
      else if (enc && canFight && G.hasFlag('seenTallGrass') && Math.random() < G.Encounters[enc].rate) {
        F.startWildBattle(enc);
        return true;
      }
      if (!G.hasFlag('seenTallGrass')) {
        G.setFlag('seenTallGrass');
        G.Events.run((E) => E.narrate([
          '背の高い草むらだ。\n……ガサガサッ！',
          '草の奥で、何かがこちらをうかがっている気配がする……。',
        ]));
        return true;
      }
    }
    return false;
  };

  // ---------------- バトル ----------------
  F.startWildBattle = function (key) {
    const e = G.Encounters[key];
    const r = G.rollEncounter(key);
    const wild = G.Monster.create(r.speciesId, r.level, { how: 'wild', where: e.where });
    G.Events.run(async () => {
      G.Audio.se('encounter');
      G.Audio.bgm('battle');
      await new Promise((res) => { F.flash = { t: 0, dur: 0.7, res }; });
      const result = await G.Battle.start({ type: 'wild', enemies: [wild], bg: e.bg, where: e.where });
      await F.afterBattle(result);
    });
  };

  // 全滅したら癒しの泉へ運ばれる（所持金の1/4を失う）
  F.afterBattle = async function (result) {
    F.safeSteps = 3;
    if (result !== 'lose') {
      await F.checkEvolutions(G.Battle.lastLeveled || [], G.E);
      return;
    }
    const lost = Math.floor(G.state.money / 4);
    G.addMoney(-lost);
    G.Party.healAll();
    F.load('healer', 4, 4, 'up');
    F.pendingEnter = false;
    F.trans = { phase: 'in', t: 0 };
    await new Promise((res) => { F.transDone = res; });
    await G.E.say('泉守りセラ', [
      '……気がつきましたか？\n倒れていたあなたを、草原の人たちが運んできてくれたんですよ。',
      `幻獣たちは元気になりました。${lost > 0 ? `\n（あわてて ${lost}G 落としてしまった……）` : ''}`,
      '無理をしてはいけませんよ。',
    ]);
  };

  // レベルが上がった幻獣の進化判定（場所条件は現在のマップの出現区分で判定）。バトルのあと・経験値アイテムのあと
  F.checkEvolutions = async function (mons, E) {
    const place = F.map.place || F.map.encounter;
    for (const m of mons) {
      if (m.hp <= 0 || !G.state.party.includes(m)) continue;
      const to = G.Growth.evolutionTarget(m, { place });
      if (to) await G.Growth.evolve(m, to, E);
      else {
        const hint = G.Growth.branchHint(m, { place });
        if (hint) await E.narrate(hint);
      }
    }
  };

  // ---------------- 落とし物 ----------------
  //   野生の幻獣が出るマップに、一定時間（プレイ時間）ごとに道具が現れる。取っても、時間がたてばまた現れる
  //   マップにいないあいだの時間も数え、入ったときに上限までまとめて現れる
  F.updateDrops = function () {
    if (!F.map.encounter || !G.state) return;
    const cfg = G.ItemDrops.field;
    const now = G.state.playTime;
    const all = G.state.fieldDrops || (G.state.fieldDrops = {});
    const d = all[F.map.id] || (all[F.map.id] = { next: now + cfg.first, items: [] });
    const gap = () => cfg.interval[0] + Math.random() * (cfg.interval[1] - cfg.interval[0]);
    for (let guard = 0; now >= d.next && guard < 10; guard++) {
      if (d.items.length >= cfg.max) { d.next = now + gap(); break; }
      const spot = F.dropSpot();
      if (spot) {
        const [item, , count] = G.ItemDrops.roll(cfg.table);
        d.items.push({ x: spot.x, y: spot.y, item, count });
      }
      d.next += gap();
    }
  };
  // 落とし物を置ける場所：主人公から歩いて行ける、何もない床（出入口・イベントの場所・人のいる場所とその近くは避ける）
  F.dropSpot = function () {
    const m = F.map, p = F.p;
    const ng = new Set();
    const ban = (x, y, r = 0) => { for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) ng.add((y + j) * m.w + x + i); };
    for (const w of m.warps) for (let j = 0; j < (w.h || 1); j++) for (let i = 0; i < (w.w || 1); i++) ban(w.x + i, w.y + j, 1);
    for (const t of m.triggers || []) for (let j = 0; j < (t.h || 1); j++) for (let i = 0; i < (t.w || 1); i++) ban(t.x + i, t.y + j);
    for (const n of m.npcs) ban(n.x, n.y, 1);
    for (const n of F.npcs) ban(n.x, n.y);
    ban(p.x, p.y, 1);
    // 主人公の位置から歩いて行ける床を探す
    const seen = new Uint8Array(m.w * m.h);
    const q = [[p.x, p.y]];
    seen[p.y * m.w + p.x] = 1;
    const cands = [];
    while (q.length) {
      const [x, y] = q.shift();
      if (!ng.has(y * m.w + x) && !F.itemAt(x, y) && !F.dropAt(x, y)) cands.push({ x, y });
      for (const v of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + v[0], ny = y + v[1];
        if (nx < 0 || ny < 0 || nx >= m.w || ny >= m.h || seen[ny * m.w + nx]) continue;
        seen[ny * m.w + nx] = 1;
        if (!F.solid[ny * m.w + nx] && !F.itemAt(nx, ny) && !F.signAt(nx, ny)) q.push([nx, ny]);
      }
    }
    return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
  };

  // マップごとのBGM（map.bgm で個別指定もできる）
  F.bgmName = function () {
    const m = F.map;
    if (!m) return 'town';
    if (m.bgm) return m.bgm;
    if (m.dark) return 'cave';
    if (m.encounter === 'forest') return 'forest';
    if (m.encounter) return 'field';
    return 'town';
  };

  F.warp = function (to, x, y, dir) {
    G.Audio.se('door');
    F.trans = { phase: 'out', t: 0, dest: { map: to, x, y, dir } };
  };

  // ---------------- 調べる・話す ----------------
  F.interact = function () {
    const p = F.p;
    const v = G.DIRS[p.dir];
    let x = p.x + v.x, y = p.y + v.y;

    // カウンター越しに話しかける
    const front = G.TileDefs[F.tileAt(x, y)];
    if (front && front.counter && F.npcAt(x + v.x, y + v.y)) { x += v.x; y += v.y; }

    const n = F.npcAt(x, y);
    if (n) {
      if (n.moving) return;
      n.dir = G.OPPOSITE[p.dir];
      const talk = n.def.talk;
      G.Events.run(async (E) => {
        if (typeof talk === 'function') await talk(E, n);
        else await E.say(n.name, talk);
      });
      return;
    }

    const sign = F.signAt(x, y);
    if (sign) { G.Events.run((E) => E.narrate(sign.text)); return; }

    const drop = F.dropAt(x, y);
    if (drop) {
      const list = F.drops();
      list.splice(list.indexOf(drop), 1);
      G.Events.run(async (E) => {
        await E.narrate('何か 落ちている……！');
        await E.give(drop.item, drop.count || 1);
      });
      return;
    }
    const item = F.itemAt(x, y);
    if (item) {
      G.Events.run(async (E) => {
        G.setFlag(item.flag);
        if (item.item === 'money') await E.money(item.count);
        else await E.give(item.item, item.count || 1);
      });
      return;
    }

    const b = F.buildingAt(x, y);
    if (b) {
      if (F.lockedDoorAt(x, y)) G.Events.run((E) => E.narrate(b.door.locked));
      else if (b.inspect) G.Events.run((E) => E.narrate(b.inspect));
      return;
    }

    const o = F.objectAt(x, y);
    if (o) {
      if (o.talk) G.Events.run((E) => o.talk(E, o));
      else if (o.text) G.Events.run((E) => E.narrate(o.text));
      return;
    }

    const ch = F.tileAt(x, y);
    if (!ch) return;
    let txt = (F.map.inspect && F.map.inspect[ch]) || (G.TileDefs[ch] && G.TileDefs[ch].inspect);
    if (Array.isArray(txt)) txt = txt[G.Util.hash(x, y, 3) % txt.length]; // 本棚ごとに内容を固定
    if (txt) G.Events.run((E) => E.narrate(txt));
  };

  // ---------------- 更新 ----------------
  F.updatePlayer = function (dt) {
    const p = F.p;
    const In = G.Input;
    if (p.moving) {
      F.advance(p, dt);
      if (p.moving) return;
      if (F.onStep()) return;
    }
    if (In.consume('cancel')) { G.Screens.open(G.UIScreens.menu()); return; }
    if (In.consume('confirm')) { F.interact(); return; }

    const d = In.dir();
    if (!d) { p.walking = false; F.lastBump = null; F.turnDelay = 0; return; }
    if (d !== p.dir && !p.walking) {
      p.dir = d;
      F.turnDelay = TURN_DELAY;
      return;
    }
    if (F.turnDelay > 0) { F.turnDelay -= dt; return; }
    p.walking = F.tryMove(p, d, In.isDown('dash') ? RUN : WALK);
  };

  F.updateNpcs = function (dt, free) {
    for (const n of F.npcs) {
      if (n.moving) { F.advance(n, dt); continue; }
      if (!free || !n.wander) continue;
      n.timer -= dt;
      if (n.timer > 0) continue;
      n.timer = 1.2 + Math.random() * 2.5;
      const d = G.Util.pick(['up', 'down', 'left', 'right']);
      const v = G.DIRS[d];
      const nx = n.x + v.x, ny = n.y + v.y;
      const far = Math.abs(nx - n.homeX) > n.wander || Math.abs(ny - n.homeY) > n.wander;
      const tile = G.TileDefs[F.tileAt(nx, ny)];
      if (Math.random() < 0.35 || far || F.warpAt(nx, ny) || (tile && tile.encounter)) { n.dir = d; continue; }
      F.tryMove(n, d, NPC_STEP);
    }
  };

  F.rustle = function (x, y) {
    for (let i = 0; i < 6; i++) {
      F.particles.push({
        x: x * T + 8 + Math.random() * 16, y: y * T + 18 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 40, life: 0.45,
      });
    }
  };

  F.update = function (dt) {
    F.t += dt;
    G.state.playTime += dt;
    if (!F.trans && !F.p.moving) F.updateDrops();

    for (const pt of F.particles) { pt.life -= dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 160 * dt; }
    F.particles = F.particles.filter((pt) => pt.life > 0);

    if (F.trans) {
      F.trans.t += dt;
      if (F.trans.phase === 'out' && F.trans.t >= FADE) {
        const d = F.trans.dest;
        F.load(d.map, d.x, d.y, d.dir);
        F.trans = { phase: 'in', t: 0 };
      } else if (F.trans.phase === 'in' && F.trans.t >= FADE) {
        F.trans = null;
        if (F.transDone) { const r = F.transDone; F.transDone = null; r(); }
      }
      return;
    }
    if (F.flash) {
      F.flash.t += dt;
      if (F.flash.t >= F.flash.dur) { const r = F.flash.res; F.flash = null; r(); }
      return;
    }

    const free = !G.Dialog.active && !G.Screens.active && !G.Events.running;
    F.updateNpcs(dt, free);
    if (F.waiters.length) {
      const ready = F.waiters.filter((w) => w.cond());
      F.waiters = F.waiters.filter((w) => !ready.includes(w));
      ready.forEach((w) => w.res());
    }

    if (G.Dialog.active) return;
    if (G.Screens.active) { G.Screens.update(dt); return; }
    if (G.Events.running) return;

    if (F.pendingEnter) {
      F.pendingEnter = false;
      G.UI.showIdle();
      if (F.map.onEnter) { G.Events.run((E) => F.map.onEnter(E)); return; }
    }
    F.updatePlayer(dt);
  };

  // ---------------- 描画 ----------------
  F.render = function (ctx) {
    const m = F.map;
    ctx.fillStyle = m.bg || '#000';
    ctx.fillRect(0, 0, VW, VH);

    const pp = F.pos(F.p);
    const mw = m.w * T, mh = m.h * T;
    const camX = Math.round(mw <= VW ? -(VW - mw) / 2 : G.Util.clamp(pp.x + T / 2 - VW / 2, 0, mw - VW));
    const camY = Math.round(mh <= VH ? -(VH - mh) / 2 : G.Util.clamp(pp.y + T / 2 - VH / 2, 0, mh - VH));

    const x0 = Math.max(0, Math.floor(camX / T)), x1 = Math.min(m.w - 1, Math.floor((camX + VW) / T));
    const y0 = Math.max(0, Math.floor(camY / T)), y1 = Math.min(m.h - 1, Math.floor((camY + VH) / T));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        ctx.drawImage(G.TileGfx.get(m, x, y, F.t), x * T - camX, y * T - camY, T, T);
      }
    }

    for (const b of m.buildings) {
      ctx.drawImage(G.Sprites.building(b), b.x * T - camX, b.y * T - camY, b.w * T, b.h * T);
    }
    for (const o of m.objects) {
      if (o.type === 'fountain') G.Sprites.drawFountain(ctx, o.x * T - camX, o.y * T - camY, F.t);
      if (o.type === 'shrine') G.Sprites.drawShrine(ctx, o.x * T - camX, o.y * T - camY, F.t);
      if (o.type === 'altar') G.Sprites.drawAltar(ctx, o.x * T - camX, o.y * T - camY, F.t, o.color, !o.lit || o.lit());
      if (o.type === 'boulder' && (!o.visible || o.visible())) ctx.drawImage(G.TileGfx.paintChar('B'), o.x * T - camX, o.y * T - camY, T, T);
      if (o.type === 'sealgate' && (!o.visible || o.visible())) {
        for (let i = 0; i < (o.w || 1); i++) ctx.drawImage(G.TileGfx.paintChar('X', Math.floor(F.t * 3) % 4), (o.x + i) * T - camX, o.y * T - camY, T, T);
      }
      if (o.type === 'monster' && (!o.visible || o.visible())) {
        const frame = Math.floor(F.t * 2 + o.x) % 2;
        const s = o.scale || 1;
        ctx.drawImage(G.MonsterGfx.canvas(o.speciesId, frame), o.x * T - camX - (s - 1) * T / 2, o.y * T - camY - 12 - (s - 1) * T, T * s, T * s);
      }
    }
    for (const s of m.signs) G.Sprites.drawSign(ctx, s.x * T - camX, s.y * T - camY);
    for (const it of m.items) {
      if (!G.hasFlag(it.flag)) G.Sprites.drawItem(ctx, it.x * T - camX, it.y * T - camY, F.t);
    }
    for (const d of F.drops()) G.Sprites.drawDrop(ctx, d.x * T - camX, d.y * T - camY, F.t + d.x * 0.7, (G.Items[d.item] || {}).color);

    // キャラクター（手前ほど後に描く）
    const actors = F.npcs.map((n) => ({ m: n, look: n.look })).concat([{ m: F.p, look: G.Story.playerLook(G.state.player.gender) }]);
    actors.sort((a, b) => F.pos(a.m).y - F.pos(b.m).y);
    for (const a of actors) {
      const pos = F.pos(a.m);
      const sx = Math.round(pos.x - camX), sy = Math.round(pos.y - camY);
      G.Sprites.drawCharacter(ctx, sx, sy, a.look, a.m.dir, a.m.frame);
      const tx = Math.round(pos.x / T), ty = Math.round(pos.y / T);
      const def = G.TileDefs[F.tileAt(tx, ty)];
      if (def && def.tall) ctx.drawImage(G.TileGfx.tallOverlay(F.tileAt(tx, ty)), tx * T - camX, ty * T - camY, T, T);
    }

    ctx.fillStyle = '#9be07a';
    for (const pt of F.particles) ctx.fillRect(Math.round(pt.x - camX), Math.round(pt.y - camY), 3, 2);

    if (m.dark) F.renderDarkness(ctx, pp, camX, camY, x0, x1, y0, y1);
    if (F.flash) { // エンカウント演出：白黒の点滅
      const k = F.flash.t / F.flash.dur;
      const blink = Math.floor(k * 6) % 2;
      ctx.fillStyle = blink ? 'rgba(0,0,0,0.75)' : `rgba(255,255,255,${0.6 * (1 - k)})`;
      ctx.fillRect(0, 0, VW, VH);
    }
    if (F.trans) {
      const a = F.trans.phase === 'out' ? F.trans.t / FADE : 1 - F.trans.t / FADE;
      ctx.fillStyle = `rgba(0,0,0,${G.Util.clamp(a, 0, 1)})`;
      ctx.fillRect(0, 0, VW, VH);
    }
  };

  // 暗いダンジョン：主人公のまわりと灯石だけが見える。ランタンがあれば視界が広がる
  let darkCv = null;
  F.renderDarkness = function (ctx, pp, camX, camY, x0, x1, y0, y1) {
    if (!darkCv) darkCv = G.Util.makeCanvas(VW, VH);
    const d = darkCv.ctx;
    d.globalCompositeOperation = 'source-over';
    d.clearRect(0, 0, VW, VH);
    d.fillStyle = 'rgba(6,4,14,0.86)';
    d.fillRect(0, 0, VW, VH);
    d.globalCompositeOperation = 'destination-out';
    const hole = (x, y, r) => {
      const g = d.createRadialGradient(x, y, r * 0.35, x, y, r);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      d.fillStyle = g;
      d.fillRect(x - r, y - r, r * 2, r * 2);
    };
    const flicker = Math.sin(F.t * 7) * 3;
    hole(pp.x + T / 2 - camX, pp.y + T / 2 - camY, (G.state.items.lantern ? 118 : 50) + flicker);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const def = G.TileDefs[F.map.tiles[y][x]];
        if (def && def.light) hole(x * T + T / 2 - camX, y * T + T / 2 - camY, 46 + Math.sin(F.t * 2 + x) * 4);
      }
    }
    ctx.drawImage(darkCv.c, 0, 0, VW, VH);
  };

  F.scene = {
    enter() {},
    update: (dt) => F.update(dt),
    render: (ctx) => F.render(ctx),
  };
})(window.Game);
