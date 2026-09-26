// 起動・メインループ
(function (G) {
  'use strict';

  G.setScene = function (scene) {
    G.scene = scene;
    if (scene.enter) scene.enter();
  };

  function boot() {
    const canvas = document.getElementById('game');
    canvas.width = G.VIEW_W * G.TILE * G.SCALE;
    canvas.height = G.VIEW_H * G.TILE * G.SCALE;
    const ctx = canvas.getContext('2d');

    G.UI.init();
    G.Dialog.init();
    G.Screens.init();
    G.Touch.init();
    G.applySettings();
    G.setScene(G.Scenes.title);

    // Webフォント読み込み後に建物の看板を描き直す
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => G.Sprites.clearCache());

    // 1フレーム分の更新と描画（デバッグ・自動テストからも呼べる）
    G.tick = function (dt) {
      try {
        if (G.Input.consume('mute')) G.UI.toast(G.Audio.toggleMute() ? 'サウンド：OFF（Mキー）' : 'サウンド：ON（Mキー）');
        if (G.Dialog.active) G.Dialog.update(dt);
        G.scene.update(dt);
        ctx.setTransform(G.SCALE, 0, 0, G.SCALE, 0, 0);
        ctx.imageSmoothingEnabled = false;
        G.scene.render(ctx);
      } catch (err) {
        console.error(err);
      }
      G.Input.endFrame();
    };

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      G.tick(dt);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('DOMContentLoaded', boot);
})(window.Game);
