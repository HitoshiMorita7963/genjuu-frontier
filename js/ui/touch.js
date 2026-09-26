// スマホ・タブレット用のタッチ操作（十字キー＋A/B＋ダッシュ）
//   設定「タッチボタン」：自動（タッチ画面なら表示）／表示／非表示
(function (G) {
  'use strict';

  let pad = null;

  function isTouchDevice() {
    return (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window;
  }

  function bind(btn) {
    const act = btn.dataset.act;
    const down = (e) => {
      e.preventDefault();
      G.Audio.unlock();
      btn.classList.add('on');
      G.Input.hold(act);
      if (btn.setPointerCapture && e.pointerId !== undefined) btn.setPointerCapture(e.pointerId);
    };
    const up = (e) => {
      e.preventDefault();
      btn.classList.remove('on');
      G.Input.release(act);
    };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('lostpointercapture', up);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  G.Touch = {
    init() {
      pad = document.getElementById('touch-pad');
      pad.querySelectorAll('[data-act]').forEach(bind);
      G.Touch.apply();
    },
    visible() {
      const mode = G.Settings.touch || 'auto';
      return mode === 'on' || (mode === 'auto' && isTouchDevice());
    },
    apply() {
      if (!pad) return;
      const show = G.Touch.visible();
      pad.classList.toggle('hidden', !show);
      document.getElementById('app').classList.toggle('touch-mode', show);
    },
  };
})(window.Game);
