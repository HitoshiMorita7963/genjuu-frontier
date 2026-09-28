// セーブ・ロード（ブラウザの localStorage に保存）
//   G.state はすべて JSON にできる純粋なデータなので、そのまま保存する。
//   主人公名・所持金・パーティ・預かり所・アイテム・進行フラグ・マップ位置・図鑑・プレイ時間 を含む。
(function (G) {
  'use strict';

  const KEY = 'genjuu-frontier/save/v1'; // 保存場所は据え置き（旧セーブも読めるように）
  const VERSION = 3;                      // 2 = 公式モンスターデータ（100種）対応 / 3 = 個体値・努力値

  // 旧データ（ver.1・42種）の種族 → 公式データの近い種族（属性・系統・ランクで対応づけ）
  const LEGACY_SPECIES = {
    hinoko: '001', kagurag: '021', enjuou: '041', mizuchibi: '002', kawasen: '022', uzushiou: '042',
    mebuki: '009', tsutamori: '026', yadorigiou: '047', puchimofu: '003', mofurabi: '023', pikosuzume: '006',
    kazehaya: '044', tsubomin: '010', pirikabuto: '005', doronko: '004', drillmog: '029', koryu: '006',
    morifukuro: '017', kinokoron: '009', yoiyami: '018', hotarubi: '019', tsutahebi: '027', sasayaki: '019',
    kobaketa: '017', lumina: '033', ishikoron: '012', gansekio: '029', kurayamiba: '017', hikagoke: '010',
    haganemushi: '016', suisui: '011', yurabi: '015', homuradori: '024', raigarou: '036', mizukagami: '025',
    yominohana: '039', tetsunomoribito: '059', shakutenryu: '064', soukyuryu: '063', getsuei: '056', amawatari: '082',
  };
  G.LEGACY_SPECIES = LEGACY_SPECIES;

  // ver.1 → ver.2：個体・図鑑・フラグの種族IDを置きかえる
  function migrateV1(st) {
    const conv = (m) => G.Monster.migrate(m, LEGACY_SPECIES);
    st.party = (st.party || []).map(conv).filter(Boolean);
    st.storage = (st.storage || []).map(conv).filter(Boolean);
    const dex = {};
    for (const [id, e] of Object.entries(st.dex || {})) {
      const to = G.Species[id] ? id : LEGACY_SPECIES[id];
      if (to) dex[to] = Object.assign(dex[to] || {}, e);
    }
    st.dex = dex;
    const f = st.flags || {};
    // 旧セーブの相棒は、公式データの3体（001/003/004）の同じ役割に置きかえる
    const STARTER = { hinoko: '001', mizuchibi: '004', mebuki: '003' };
    if (f.starter && !G.Species[f.starter]) f.starter = STARTER[f.starter] || '001';
    const RIVAL = { '001': '004', '003': '001', '004': '003' };
    if (f.rivalStarter && !G.Species[f.rivalStarter]) f.rivalStarter = RIVAL[f.starter] || '004';
    return st;
  }

  function storage() {
    try {
      const s = window.localStorage;
      const t = '__test__';
      s.setItem(t, t); s.removeItem(t);
      return s;
    } catch (e) {
      return null; // プライベートモードなどで使えない場合
    }
  }

  // 古いセーブや欠けた項目を補う（今後の項目追加にも対応）
  function normalize(st) {
    if (!st.version || st.version < 2) st = migrateV1(st);
    const base = G.State.create(st.player && st.player.name || 'ユウ', st.player && st.player.gender || 'boy');
    const out = Object.assign(base, st);
    out.player = Object.assign(base.player, st.player || {});
    for (const k of ['items', 'flags', 'dex', 'recipesFound', 'ruleFound', 'lineage']) out[k] = st[k] || {};
    // 幻獣使いレベルがなかったころのセーブ：図鑑・レシピ・物語の進み具合から経験値を見積もる
    if (!st.tamer) out.tamer = { exp: G.Tamer.estimate(out) };
    if (!st.visited) out.visited = G.Tamer.estimateVisited(out);
    // 廃止した道具（ちからの種など）は、売値のお金に替える
    for (const id of Object.keys(out.items)) {
      const it = G.Items[id];
      if (it && it.obsolete) { out.money += Math.floor(it.price / 2) * out.items[id]; delete out.items[id]; }
    }
    // 絆石はなくならない道具になった：持っていた数に関係なく1つ（博士からもらった後なら、使い切っていても）
    if (out.items.bondstone || out.flags.gotStarter) out.items.bondstone = 1;
    for (const k of ['party', 'storage']) out[k] = (st[k] || []).filter((m) => m && G.Species[m.speciesId]);
    // ver.2 以前の個体：個体ボーナス（0〜15）を個体値（0〜31）に換算し、努力値を 0 で追加（能力値はほぼ変わらない）
    for (const m of out.party.concat(out.storage)) {
      G.Individual.ensure(m);
      G.Monster.fitExp(m); // 経験値が今のレベルの範囲の外（進化でマイナス表示になっていたもの）なら直す
      if (!m.moveLv) G.MoveStage.pin(m); // 技の強化の記録がなかったころ：種族が覚えるレベル（なければ今のレベル）で覚えたことにする
      const max = G.Monster.stats(m);
      m.hp = Math.min(m.hp, max.hp);
      m.mp = Math.min(m.mp, max.mp);
    }
    for (const m of out.storage) G.Monster.healFull(m); // 預かり所の幻獣は、いつも HP・MP 満タン
    // 個体IDの通し番号が既存の個体と重ならないようにする
    out.uidSeq = Math.max(out.uidSeq || 0, ...out.party.concat(out.storage).map((m) => m.instanceId || 0),
      ...Object.keys(out.lineage).map(Number));
    out.version = VERSION;
    if (!G.MapData[out.player.map]) Object.assign(out.player, { map: 'sorano', x: 14, y: 12, dir: 'down' });
    return out;
  }

  G.Save = {
    available() { return !!storage(); },

    exists() {
      const s = storage();
      return !!(s && s.getItem(KEY));
    },

    save() {
      const s = storage();
      if (!s) return { ok: false, error: 'このブラウザでは保存できません（localStorageが無効です）。' };
      try {
        const data = { version: VERSION, savedAt: Date.now(), state: G.state };
        s.setItem(KEY, JSON.stringify(data));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: '保存に失敗しました：' + e.message };
      }
    },

    // 読み込んだ state を返す（失敗時は null）
    load() {
      const s = storage();
      if (!s) return null;
      try {
        const raw = s.getItem(KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return normalize(data.state);
      } catch (e) {
        console.error('[save] 読み込み失敗', e);
        return null;
      }
    },

    // タイトル画面などに出す概要
    info() {
      const s = storage();
      if (!s) return null;
      try {
        const data = JSON.parse(s.getItem(KEY) || 'null');
        if (!data) return null;
        const st = data.state;
        const map = G.MapData[st.player.map];
        return {
          name: st.player.name,
          playTime: G.Util.formatTime(st.playTime || 0),
          place: map ? map.name.replace(/\{name\}/g, st.player.name) : '---',
          party: (st.party || []).length,
          lead: st.party && st.party[0] ? `${st.party[0].name} Lv${st.party[0].level}` : '',
          savedAt: new Date(data.savedAt).toLocaleString('ja-JP'),
          chapter1: !!(st.flags && st.flags.chapter1Clear),
        };
      } catch (e) {
        return null;
      }
    },

    remove() { const s = storage(); if (s) s.removeItem(KEY); },
  };

  // オートセーブ（設定でON/OFF）。回復・村への到着・大事なイベントの後に呼ぶ
  G.autoSave = function () {
    if (!G.state || !G.Settings.autosave || !G.Save.available()) return;
    if (G.state.party.length === 0) return; // 相棒を得るまでは保存しない
    const r = G.Save.save();
    if (r.ok) G.UI.toast('オートセーブしました');
  };
})(window.Game);
