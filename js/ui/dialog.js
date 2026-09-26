// 画面下部のメッセージウィンドウ（文字送り・選択肢）
(function (G) {
  'use strict';

  const el = {};

  const D = G.Dialog = {
    active: false,
    speed: 48, // 文字/秒
    pages: [],
    idx: 0,
    shown: 0,
    speaker: '',
    choices: null,
    sel: 0,
    cancelIndex: null,
    resolve: null,
    drawn: -1,

    init() {
      el.box = document.getElementById('message');
      el.speaker = document.getElementById('message-speaker');
      el.text = document.getElementById('message-text');
      el.choices = document.getElementById('message-choices');
      el.next = document.getElementById('message-next');
      // クリックでも文字送り
      el.box.addEventListener('click', (e) => {
        if (!D.active) return;
        const ch = e.target.closest('[data-choice]');
        if (ch && D.choices) { D.sel = Number(ch.dataset.choice); D.renderChoices(); }
        G.Input.press('confirm');
      });
    },

    // pages: 文字列の配列。opts: { speaker, choices, cancelIndex }
    open(pages, opts = {}) {
      return new Promise((resolve) => {
        D.active = true;
        D.pages = (Array.isArray(pages) ? pages : [pages]).map(G.format);
        D.idx = 0;
        D.shown = 0;
        D.speaker = opts.speaker ? G.format(opts.speaker) : '';
        D.choices = opts.choices || null;
        D.sel = 0;
        D.cancelIndex = opts.cancelIndex !== undefined ? opts.cancelIndex : (D.choices ? D.choices.length - 1 : null);
        D.resolve = resolve;
        D.drawn = -1;
        D.auto = opts.auto || 0; // 秒。表示しきった後、自動で次へ（バトル用）
        D.autoT = 0;
        el.box.classList.remove('idle');
        el.speaker.textContent = D.speaker;
        el.choices.innerHTML = '';
        el.next.classList.add('hidden');
        D.renderText();
      });
    },

    update(dt) {
      if (!D.active) return;
      const page = D.pages[D.idx];
      const In = G.Input;

      if (D.shown < page.length) {
        D.shown = Math.min(page.length, D.shown + dt * D.speed);
        if (In.consume('confirm') || In.consume('cancel')) D.shown = page.length;
        D.renderText();
        return;
      }

      const last = D.idx === D.pages.length - 1;
      if (last && D.choices) {
        if (!el.choices.childElementCount) D.renderChoices();
        if (In.consume('up') || In.consume('left')) { D.sel = (D.sel + D.choices.length - 1) % D.choices.length; D.renderChoices(); }
        if (In.consume('down') || In.consume('right')) { D.sel = (D.sel + 1) % D.choices.length; D.renderChoices(); }
        if (In.consume('confirm')) return D.finish(D.sel);
        if (In.consume('cancel') && D.cancelIndex !== null) return D.finish(D.cancelIndex);
        return;
      }

      let next = In.consume('confirm') || In.consume('cancel');
      if (D.auto) { D.autoT += dt; if (D.autoT >= D.auto) next = true; }
      if (next) {
        D.autoT = 0;
        if (last) D.finish();
        else { D.idx++; D.shown = 0; D.drawn = -1; D.renderText(); }
      }
    },

    finish(value) {
      D.active = false;
      const r = D.resolve;
      D.resolve = null;
      el.choices.innerHTML = '';
      el.next.classList.add('hidden');
      G.Input.clearPressed();
      G.UI.showIdle();
      if (r) r(value);
    },

    renderText() {
      const n = Math.floor(D.shown);
      if (n === D.drawn) return;
      if (n > D.drawn && D.drawn >= 0 && G.Audio) G.Audio.se('text');
      D.drawn = n;
      const page = D.pages[D.idx];
      el.text.textContent = page.slice(0, n);
      const done = n >= page.length;
      const isChoice = D.choices && D.idx === D.pages.length - 1;
      el.next.classList.toggle('hidden', !done || !!isChoice);
    },

    renderChoices() {
      el.choices.innerHTML = D.choices
        .map((c, i) => `<div class="choice${i === D.sel ? ' sel' : ''}" data-choice="${i}">${i === D.sel ? '▶' : '　'} ${c}</div>`)
        .join('');
    },
  };
})(window.Game);
