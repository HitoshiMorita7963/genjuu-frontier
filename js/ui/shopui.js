// ショップ画面：買う／売る（個数指定つき）
(function (G) {
  'use strict';

  const esc = (s) => G.escapeHtml(s);
  const sellPrice = (id) => Math.floor(G.Items[id].price / 2);

  G.UIScreens.shop = function (shopId, startTab = 'buy') {
    const shop = G.Shops[shopId];
    return {
      layout: 'menu wide center',
      tab: startTab,
      sel: 0,
      qty: 0,        // 0 = 個数選択していない
      note: '',
      list() {
        if (this.tab === 'buy') return shop.items;
        return Object.keys(G.state.items).filter((id) => G.Items[id].type !== 'key' && G.Items[id].price > 0);
      },
      price(id) { return this.tab === 'buy' ? G.Items[id].price : sellPrice(id); },
      maxQty(id) {
        if (this.tab === 'buy') return Math.max(0, Math.min(99, Math.floor(G.state.money / G.Items[id].price)));
        return G.state.items[id] || 0;
      },
      update(In) {
        const list = this.list();
        const r = () => G.Screens.render();
        if (this.qty > 0) {
          const id = list[this.sel];
          const max = this.maxQty(id);
          if (In.consume('up')) this.qty = Math.min(max, this.qty + 1);
          if (In.consume('down')) this.qty = Math.max(1, this.qty - 1);
          if (In.consume('right')) this.qty = Math.min(max, this.qty + 10);
          if (In.consume('left')) this.qty = Math.max(1, this.qty - 10);
          if (In.consume('cancel')) this.qty = 0;
          if (In.consume('confirm')) {
            const total = this.price(id) * this.qty;
            if (this.tab === 'buy') {
              G.addMoney(-total); G.addItem(id, this.qty);
              this.note = `${G.Items[id].name}を ${this.qty}こ 買った！（-${total}G）`;
            } else {
              G.addMoney(total); G.addItem(id, -this.qty);
              this.note = `${G.Items[id].name}を ${this.qty}こ 売った！（+${total}G）`;
              if (this.sel >= this.list().length) this.sel = Math.max(0, this.list().length - 1);
            }
            this.qty = 0;
            G.Audio.se('buy');
            G.UI.refresh();
          }
          r();
          return;
        }
        if (list.length && In.consume('up')) { this.sel = (this.sel - 1 + list.length) % list.length; this.note = ''; r(); }
        if (list.length && In.consume('down')) { this.sel = (this.sel + 1) % list.length; this.note = ''; r(); }
        if (In.consume('left') || In.consume('right')) { this.tab = this.tab === 'buy' ? 'sell' : 'buy'; this.sel = 0; this.note = ''; r(); }
        if (In.consume('cancel')) return G.Screens.close();
        if (In.consume('confirm') && list.length) {
          const id = list[this.sel];
          if (this.maxQty(id) < 1) this.note = this.tab === 'buy' ? 'お金が 足りないようです……' : '';
          else this.qty = 1;
          r();
        }
      },
      html() {
        const list = this.list();
        const tabs = `<span class="tab${this.tab === 'buy' ? ' on' : ''}">買う</span><span class="tab${this.tab === 'sell' ? ' on' : ''}">売る</span>`;
        const rows = list.length ? list.map((id, i) => {
          const it = G.Items[id];
          const own = G.state.items[id] || 0;
          return `<div class="menu-row${i === this.sel ? ' sel' : ''}"><span class="cursor">${i === this.sel ? '▶' : ''}</span>` +
            `${it.name}<small>　所持${own}</small><span class="count">${this.price(id)} G</span></div>`;
        }).join('') : '<div class="menu-empty">売れる道具を 持っていない。</div>';
        const cur = list[this.sel];
        const qtyBox = this.qty > 0
          ? `<div class="qty-box">${G.Items[cur].name} × <b>${this.qty}</b>　＝　<b>${this.price(cur) * this.qty} G</b>` +
            `<br><small>↑↓：±1　←→：±10　Z：${this.tab === 'buy' ? '買う' : '売る'}　X：やめる</small></div>` : '';
        return `<div class="scr-title">${esc(shop.name)} ${tabs}<span class="shop-money">所持金 ${G.state.money.toLocaleString()} G</span></div>` +
          `<div class="menu-list">${rows}</div>` + qtyBox +
          `<div class="menu-desc">${this.note ? esc(this.note) : cur ? G.Items[cur].desc : ''}</div>` +
          '<div class="menu-hint">↑↓：えらぶ　←→：買う／売る　Z：けってい　X：でる</div>';
      },
    };
  };
})(window.Game);
