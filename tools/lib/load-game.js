// ツール用：index.html と同じ順番でゲームのスクリプトを読み込み、Game オブジェクトを返す（ブラウザなしで動かす）
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function loadGame(root = path.join(__dirname, '..', '..')) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const quiet = () => {};
  const store = {};
  const ctx = {
    console: { log: console.log, info: quiet, warn: quiet, error: console.error },
    setTimeout, clearTimeout, setInterval, clearInterval, Math, JSON, performance: { now: () => 0 },
    document: { addEventListener() {}, getElementById: () => null },
    localStorage: { getItem: (k) => store[k] || null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
  };
  ctx.window = ctx;
  ctx.addEventListener = () => {};
  vm.createContext(ctx);
  for (const m of html.matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, m[1]), 'utf8'), ctx, { filename: m[1] });
  }
  return ctx.Game;
};
