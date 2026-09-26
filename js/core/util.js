// 共通定数・ユーティリティ
window.Game = window.Game || {};
(function (G) {
  'use strict';

  G.TILE = 32;      // 1タイルの論理ピクセル
  G.VIEW_W = 15;    // 表示タイル数（横）
  G.VIEW_H = 11;    // 表示タイル数（縦）
  G.SCALE = 2;      // 内部解像度倍率（くっきり描画用）

  G.DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  G.OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

  G.Scenes = G.Scenes || {};

  G.escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  G.Util = {
    clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },
    randInt(n) { return Math.floor(Math.random() * n); },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    // 座標から決定的な擬似乱数ハッシュ
    hash(x, y, seed) {
      let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul((seed | 0) + 1, 1274126177);
      h = Math.imul(h ^ (h >>> 13), 1103515245);
      return (h ^ (h >>> 16)) >>> 0;
    },
    // シード付き乱数
    rng(seed) {
      let s = (seed >>> 0) || 1;
      return function () {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
      };
    },
    sleep(ms) { return new Promise((r) => setTimeout(r, ms)); },
    formatTime(sec) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      return `${h}:${String(m).padStart(2, '0')}`;
    },
    // 高解像度キャンバス（論理サイズ w×h、内部は SCALE 倍）
    makeCanvas(w, h) {
      const c = document.createElement('canvas');
      c.width = w * G.SCALE;
      c.height = h * G.SCALE;
      const ctx = c.getContext('2d');
      ctx.scale(G.SCALE, G.SCALE);
      ctx.imageSmoothingEnabled = false;
      return { c, ctx };
    },
  };
})(window.Game);
