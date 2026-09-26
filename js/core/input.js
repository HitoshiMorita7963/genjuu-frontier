// キーボード入力
(function (G) {
  'use strict';

  const KEYMAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    KeyZ: 'confirm', Enter: 'confirm', NumpadEnter: 'confirm', Space: 'confirm',
    KeyX: 'cancel', Escape: 'cancel', Backspace: 'cancel',
    ShiftLeft: 'dash', ShiftRight: 'dash',
    KeyM: 'mute',
  };

  // 入力が「使われた」ときの効果音（カーソル移動・決定・キャンセル）
  function feedback(a) {
    if (!G.Audio) return;
    if (a === 'confirm') G.Audio.se('confirm');
    else if (a === 'cancel') G.Audio.se('cancel');
    else if (DIR_ACTIONS.includes(a) && (G.Screens && G.Screens.active || (G.Dialog && G.Dialog.active && G.Dialog.choices) || G.scene === G.Scenes.title)) G.Audio.se('cursor');
  }
  const DIR_ACTIONS = ['up', 'down', 'left', 'right'];

  const heldCodes = new Set();
  const pressed = new Set();
  let dirStack = []; // 最後に押した方向を優先

  function isTyping(e) {
    const t = e.target;
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  const virtualHeld = new Set(); // 画面のタッチボタンで押されている操作
  const pendingRelease = new Set(); // 次のフレーム終わりに離す操作

  function isDown(action) {
    if (virtualHeld.has(action)) return true;
    for (const c of heldCodes) if (KEYMAP[c] === action) return true;
    return false;
  }

  window.addEventListener('keydown', (e) => {
    if (isTyping(e)) return;
    const a = KEYMAP[e.code];
    if (!a) return;
    e.preventDefault();
    const isDir = DIR_ACTIONS.includes(a);
    if (!e.repeat || isDir) pressed.add(a); // 方向キーはリピートでメニュー移動可
    heldCodes.add(e.code);
    if (isDir) {
      dirStack = dirStack.filter((d) => d !== a);
      dirStack.push(a);
    }
  });

  window.addEventListener('keyup', (e) => {
    const a = KEYMAP[e.code];
    if (!a) return;
    heldCodes.delete(e.code);
    if (DIR_ACTIONS.includes(a) && !isDown(a)) dirStack = dirStack.filter((d) => d !== a);
  });

  window.addEventListener('blur', () => G.Input.clear());

  G.Input = {
    isDown,
    consume(a) {
      if (pressed.has(a)) { pressed.delete(a); feedback(a); return true; }
      return false;
    },
    press(a) { pressed.add(a); }, // クリックなどからの疑似入力
    // タッチボタン：押している間は hold、離したら release（キーボードと同じ扱い）
    hold(a) {
      if (!virtualHeld.has(a) || pendingRelease.has(a)) pressed.add(a);
      pendingRelease.delete(a);
      virtualHeld.add(a);
      if (DIR_ACTIONS.includes(a)) { dirStack = dirStack.filter((d) => d !== a); dirStack.push(a); }
    },
    // 素早いタップでも最低1フレームは「押されている」ように、離す処理はフレーム終わりまで遅らせる
    release(a) { pendingRelease.add(a); },
    dir() { return dirStack.length ? dirStack[dirStack.length - 1] : null; },
    endFrame() {
      pressed.clear();
      for (const a of pendingRelease) {
        virtualHeld.delete(a);
        if (DIR_ACTIONS.includes(a) && !isDown(a)) dirStack = dirStack.filter((d) => d !== a);
      }
      pendingRelease.clear();
    },
    clearPressed() { pressed.clear(); },
    clear() { pressed.clear(); heldCodes.clear(); virtualHeld.clear(); pendingRelease.clear(); dirStack = []; },
  };
})(window.Game);
