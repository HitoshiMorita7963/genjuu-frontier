// 設定（セーブデータとは別に保存。どのセーブでも共通）
(function (G) {
  'use strict';

  const KEY = 'genjuu-frontier/settings';
  const DEFAULTS = { textSpeed: 1, bgm: 6, se: 7, autosave: true, muted: false, touch: 'auto', demoExp: false, demoGrow: false, demoCatch: false };
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

  // デモプレイ用：道具を無限に使えるモード（持っていなくても もちものに並び、使ってもなくならない）
  //   demoExp  … 経験値アイテム
  //   demoGrow … 努力値アイテム（特訓の書・忘れ草の香）と進化アイテム（鋼の爪・月の雫）
  const GROW_TYPES = ['ev', 'evreset', 'evolve'];
  G.demoInfinite = (id) => {
    const it = G.Items[id];
    if (!it || it.obsolete) return false; // 廃止した道具は出さない
    if (it.type === 'exp') return !!G.Settings.demoExp;
    if (GROW_TYPES.includes(it.type)) return !!G.Settings.demoGrow;
    return false;
  };

  G.TEXT_SPEED_NAMES =['おそい', 'ふつう', 'はやい'];
})(window.Game);
