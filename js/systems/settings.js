// 設定（セーブデータとは別に保存。どのセーブでも共通）
(function (G) {
  'use strict';

  const KEY = 'genjuu-frontier/settings';
  const DEFAULTS = { textSpeed: 1, bgm: 6, se: 7, autosave: true, muted: false, touch: 'auto', demoExp: false };
  const TEXT_SPEEDS = [28, 48, 90]; // 文字/秒（おそい・ふつう・はやい）

  G.Settings = Object.assign({}, DEFAULTS);
  try {
    const raw = window.localStorage && localStorage.getItem(KEY);
    if (raw) Object.assign(G.Settings, JSON.parse(raw));
  } catch (e) { /* 保存できない環境では既定値のまま */ }

  G.saveSettings = function () {
    try { localStorage.setItem(KEY, JSON.stringify(G.Settings)); } catch (e) { /* 無視 */ }
    G.applySettings();
  };

  G.applySettings = function () {
    if (G.Dialog) G.Dialog.speed = TEXT_SPEEDS[G.Settings.textSpeed] || 48;
    if (G.Audio) G.Audio.applyVolume();
    if (G.Touch) G.Touch.apply();
  };

  // デモプレイ用：経験値アイテムを無限に使えるモード（持っていなくても もちものに並び、使ってもなくならない）
  G.demoInfinite = (id) => !!(G.Settings.demoExp && G.Items[id] && G.Items[id].type === 'exp');

  G.TEXT_SPEED_NAMES =['おそい', 'ふつう', 'はやい'];
})(window.Game);
