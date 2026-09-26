// 効果音・BGM（Web Audio API で合成。音声ファイルは使わない）
//   ブラウザの自動再生制限のため、最初のキー入力/クリックで音声を有効化する。
//   BGMの楽譜は js/data/music.js
(function (G) {
  'use strict';

  let ctx = null;
  let master = null, bgmGain = null, seGain = null;
  let noiseBuf = null;
  let wanted = null;      // 鳴らしたいBGM（音声が有効になる前に指定されたもの）
  let cur = null;         // 再生中のBGM名
  let seq = null;         // シーケンサの状態
  let lastBlip = 0;

  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(name) {
    const m = name.match(/^([A-G])([#b]?)(\d)$/);
    if (!m) return 0;
    let n = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
    const midi = 12 * (Number(m[3]) + 1) + n;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // 'E5 . G5 - ...' → 各ステップの発音 [{ f, len }]
  function parseVoice(str) {
    const toks = str.replace(/\|/g, ' ').trim().split(/\s+/);
    const ev = new Array(toks.length).fill(null);
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t === '.' || t === '-') continue;
      let len = 1;
      while (toks[i + len] === '.') len++;
      ev[i] = { f: freq(t), len };
    }
    return ev;
  }
  const parsed = {};
  function track(name) {
    if (!parsed[name]) {
      const t = G.Music[name];
      if (!t) return null;
      parsed[name] = Object.assign({}, t, { voices: t.voices.map((v) => Object.assign({}, v, { ev: parseVoice(v.notes) })) });
    }
    return parsed[name];
  }

  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain(); master.connect(ctx.destination);
    bgmGain = ctx.createGain(); bgmGain.connect(master);
    seGain = ctx.createGain(); seGain.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    A.applyVolume();
    return true;
  }

  // 1音（波形・周波数・開始・長さ・音量・出力先）
  function tone(type, f, t, dur, vol, out, f2) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol, t + Math.max(0.01, dur - 0.05));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(t, dur, vol, out, hp = 800) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out);
    s.start(t); s.stop(t + dur);
  }
  function arp(notes, step, type, vol) {
    const t = ctx.currentTime;
    notes.forEach((n, i) => tone(type, freq(n), t + i * step, step * 1.6, vol, seGain));
  }

  // ---------------- 効果音 ----------------
  const SE = {
    cursor: () => tone('square', 880, ctx.currentTime, 0.04, 0.05, seGain),
    confirm: () => tone('square', 660, ctx.currentTime, 0.07, 0.06, seGain, 990),
    cancel: () => tone('square', 440, ctx.currentTime, 0.07, 0.05, seGain, 300),
    text: () => tone('triangle', 1250, ctx.currentTime, 0.025, 0.035, seGain),
    bump: () => tone('square', 120, ctx.currentTime, 0.07, 0.07, seGain, 90),
    door: () => { const t = ctx.currentTime; noise(t, 0.12, 0.08, seGain, 2000); tone('triangle', 330, t, 0.15, 0.08, seGain, 220); },
    encounter: () => { const t = ctx.currentTime; for (let i = 0; i < 3; i++) tone('square', 300, t + i * 0.12, 0.1, 0.07, seGain, 900); },
    hit: () => { const t = ctx.currentTime; noise(t, 0.15, 0.2, seGain, 400); tone('square', 160, t, 0.1, 0.1, seGain, 60); },
    super: () => { const t = ctx.currentTime; noise(t, 0.22, 0.25, seGain, 300); tone('square', 220, t, 0.18, 0.12, seGain, 50); tone('square', 1200, t + 0.05, 0.12, 0.05, seGain, 1800); },
    weak: () => { const t = ctx.currentTime; noise(t, 0.08, 0.1, seGain, 1500); },
    faint: () => tone('square', 520, ctx.currentTime, 0.5, 0.08, seGain, 80),
    up: () => arp(['C5', 'E5', 'G5'], 0.06, 'square', 0.05),
    down: () => arp(['G4', 'E4', 'C4'], 0.06, 'square', 0.05),
    heal: () => arp(['C5', 'E5', 'G5', 'C6', 'E6'], 0.07, 'triangle', 0.08),
    status: () => { const t = ctx.currentTime; for (let i = 0; i < 4; i++) tone('triangle', 500 + (i % 2) * 150, t + i * 0.06, 0.06, 0.06, seGain); },
    throw: () => tone('triangle', 300, ctx.currentTime, 0.4, 0.07, seGain, 1200),
    wobble: () => { const t = ctx.currentTime; tone('square', 180, t, 0.05, 0.08, seGain); tone('square', 140, t + 0.08, 0.05, 0.06, seGain); },
    catch: () => arp(['G4', 'C5', 'E5', 'G5', 'C6'], 0.09, 'square', 0.07),
    breakout: () => { const t = ctx.currentTime; noise(t, 0.2, 0.15, seGain, 1200); tone('square', 600, t, 0.2, 0.06, seGain, 200); },
    item: () => arp(['E5', 'G5', 'C6'], 0.09, 'square', 0.06),
    levelup: () => arp(['C5', 'E5', 'G5', 'C6', 'G5', 'C6'], 0.08, 'square', 0.07),
    evolve: () => arp(['C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6', 'G6'], 0.1, 'triangle', 0.08),
    fanfare: () => arp(['C5', 'C5', 'C5', 'G5', 'E5', 'G5', 'C6'], 0.11, 'square', 0.07),
    run: () => tone('square', 300, ctx.currentTime, 0.25, 0.05, seGain, 900),
    save: () => arp(['A5', 'E6'], 0.08, 'triangle', 0.06),
    buy: () => arp(['E6', 'B6'], 0.05, 'square', 0.04),
  };

  // ---------------- BGM ----------------
  function stopSeq() {
    if (seq) { clearInterval(seq.timer); seq = null; }
  }
  function startSeq(name, onEnd) {
    stopSeq();
    const tr = track(name);
    if (!tr) return;
    const stepDur = 60 / tr.bpm / 2; // 8分音符
    const len = Math.max(...tr.voices.map((v) => v.ev.length));
    seq = { tr, step: 0, next: ctx.currentTime + 0.06, stepDur, len, onEnd };
    const s = seq;
    s.timer = setInterval(() => {
      if (seq !== s) return;
      while (s.next < ctx.currentTime + 0.15) {
        for (const v of s.tr.voices) {
          const e = v.ev[s.step];
          if (e && e.f) tone(v.wave, e.f, s.next, e.len * s.stepDur * 0.95, v.vol, bgmGain);
        }
        s.step++;
        s.next += s.stepDur;
        if (s.step >= s.len) {
          if (s.tr.loop === false) { stopSeq(); if (s.onEnd) setTimeout(s.onEnd, 300); return; }
          s.step = 0;
        }
      }
    }, 25);
  }

  const A = G.Audio = {
    unlock() {
      if (!init()) return;
      if (ctx.state === 'suspended') ctx.resume();
      if (wanted && cur !== wanted) A.bgm(wanted);
    },
    applyVolume() {
      if (!ctx) return;
      const S = G.Settings;
      master.gain.value = S.muted ? 0 : 1;
      bgmGain.gain.value = (S.bgm / 10) * 0.9;
      seGain.gain.value = (S.se / 10) * 1.2;
    },
    se(name) {
      if (!ctx || ctx.state !== 'running' || G.Settings.muted) return;
      if (name === 'text') {
        const now = ctx.currentTime;
        if (now - lastBlip < 0.05) return;
        lastBlip = now;
      }
      try { if (SE[name]) SE[name](); } catch (e) { /* 音が鳴らなくてもゲームは続ける */ }
    },
    bgm(name) {
      wanted = name;
      if (!ctx || ctx.state !== 'running') return;
      if (cur === name && seq) return;
      cur = name;
      if (!name) { stopSeq(); return; }
      startSeq(name);
    },
    // ジングル（1回だけ鳴らし、終わったら元のBGMへ）
    jingle(name, then) {
      wanted = then || wanted;
      if (!ctx || ctx.state !== 'running') return;
      cur = name;
      startSeq(name, () => { if (cur === name) { cur = null; A.bgm(then || wanted); } });
    },
    current: () => cur,
    toggleMute() {
      G.Settings.muted = !G.Settings.muted;
      G.saveSettings();
      return G.Settings.muted;
    },
  };

  // 最初の操作で音声を有効化
  const unlock = () => A.unlock();
  window.addEventListener('keydown', unlock);
  window.addEventListener('pointerdown', unlock);

  // タブが裏に回ったら（別のタブ・最小化など）音を止め、戻ったら再開する
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else if (!G.Settings.muted) ctx.resume();
  });
})(window.Game);
