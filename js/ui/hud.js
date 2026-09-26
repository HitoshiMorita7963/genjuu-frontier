// 上部の主人公情報・地名バナー・待機中メッセージ
(function (G) {
  'use strict';

  const el = {};
  let bannerTimer = null;

  G.UI = {
    init() {
      el.name = document.getElementById('hud-name');
      el.money = document.getElementById('hud-money');
      el.party = document.getElementById('hud-party');
      el.loc = document.getElementById('hud-location');
      el.banner = document.getElementById('location-banner');
      el.speaker = document.getElementById('message-speaker');
      el.text = document.getElementById('message-text');
      el.box = document.getElementById('message');
      el.controls = document.getElementById('controls');
    },

    refresh() {
      const s = G.state;
      if (!s) {
        el.name.textContent = '---';
        el.money.textContent = '---';
        el.party.textContent = '0';
        el.loc.textContent = '---';
        return;
      }
      el.name.textContent = s.player.name;
      el.money.textContent = s.money.toLocaleString();
      el.party.textContent = String(s.party.length);
      const map = G.MapData[s.player.map];
      el.loc.textContent = map ? G.format(map.name) : '---';
    },

    // 会話していないときのメッセージ欄
    showIdle(text) {
      if (G.Dialog.active) return;
      el.box.classList.add('idle');
      el.speaker.textContent = text ? '' : '目的';
      el.text.textContent = text || (G.state ? G.Story.objective() : '');
    },

    setControls(html) { el.controls.innerHTML = html; },

    // 画面右上に一瞬だけ出す通知（オートセーブ・サウンド切替など）
    toast(text) {
      if (!el.toast) {
        el.toast = document.createElement('div');
        el.toast.id = 'toast';
        document.getElementById('screen').appendChild(el.toast);
      }
      el.toast.textContent = text;
      el.toast.classList.remove('show');
      void el.toast.offsetWidth;
      el.toast.classList.add('show');
      clearTimeout(el.toastTimer);
      el.toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1600);
    },

    hideBanner() {
      clearTimeout(bannerTimer);
      el.banner.classList.remove('show');
    },

    banner(text) {
      el.banner.textContent = text;
      el.banner.classList.remove('show');
      void el.banner.offsetWidth; // アニメーション再開
      el.banner.classList.add('show');
      clearTimeout(bannerTimer);
      bannerTimer = setTimeout(() => el.banner.classList.remove('show'), 2200);
    },
  };
})(window.Game);
