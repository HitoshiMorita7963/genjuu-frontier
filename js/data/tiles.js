// タイル定義（マップ文字 → 性質）
// solid: 通行不可 / encounter: 野生幻獣が出る草むら / counter: カウンター越しに話せる / inspect: 調べたときの文
(function (G) {
  'use strict';

  G.TileDefs = {
    // --- 屋外 ---
    '.': { name: 'grass' },
    ',': { name: 'flowers' },
    ';': { name: 'tallgrass', encounter: true, tall: true },
    '=': { name: 'path' },
    'o': { name: 'plaza' },
    '#': { name: 'tree', solid: true, inspect: '大きな木だ。葉がさらさらと風に揺れている。' },
    '~': { name: 'water', solid: true, anim: 4, inspect: '澄んだ水面が、きらきらと光を返している。' },
    'r': { name: 'rock', solid: true, inspect: 'ごつごつした岩だ。びくともしない。' },
    'F': { name: 'fence', solid: true, inspect: '木の柵だ。' },
    // --- 森 ---
    'g': { name: 'forestground' },
    'v': { name: 'forestflowers' },
    'G': { name: 'foresttall', encounter: true, tall: true },
    'Y': { name: 'pine', solid: true, inspect: 'うっそうと茂る針葉樹だ。昼でも薄暗い。' },
    'h': { name: 'bridge' },
    'K': { name: 'cliff', solid: true, inspect: '切り立った岩壁だ。登れそうにない。' },
    'M': { name: 'cavemouth' },
    'O': { name: 'forestrock', solid: true, inspect: '苔におおわれた岩だ。' },
    // --- 港・火山（第2章） ---
    's': { name: 'sand' },
    'a': { name: 'ash' },
    'A': { name: 'ashtall', encounter: true, tall: true },
    'l': { name: 'lava', solid: true, anim: 4, inspect: '煮えたぎる溶岩だ。近づくだけで肌が焼けそうだ。' },
    'n': { name: 'obsidian', solid: true, inspect: '黒く光る溶岩石だ。' },
    // --- 北の氷原 ---
    'e': { name: 'snow' },
    'E': { name: 'snowtall', encounter: true, tall: true },
    'i': { name: 'ice', solid: true, anim: 4, inspect: '厚く凍りついた湖だ。氷の下で、何かが青く光っている……。' },
    'P': { name: 'snowpine', solid: true, inspect: '雪をかぶったモミの木だ。枝がしなって、今にも雪が落ちてきそう。' },
    'I': { name: 'icerock', solid: true, inspect: '透きとおった氷の岩だ。ひんやりとした冷気がただよってくる。' },
    // --- 洞窟 ---
    'f': { name: 'cavefloor' },
    'z': { name: 'caverough', encounter: true },
    'R': { name: 'cavewall', solid: true },
    'C': { name: 'crystal', solid: true, light: true, inspect: 'ほのかに光る鉱石――『灯石』だ。\n触れると、ほんのりあたたかい。' },
    'B': { name: 'boulder', solid: true, inspect: '大きな岩がごろりと転がっている。' },
    'W': { name: 'cavewater', solid: true, anim: 4, inspect: '地底湖だ。水は冷たく、底が見えないほど深い。' },
    'L': { name: 'stairsdown' },
    'U': { name: 'stairsup' },
    'X': { name: 'sealgate', solid: true },
    // --- 屋内 ---
    'w': { name: 'wall', solid: true },
    '_': { name: 'floor' },
    'k': { name: 'shelf', solid: true, inspect: '本がぎっしりと並んでいる。' },
    't': { name: 'table', solid: true, inspect: 'よく磨かれたテーブルだ。' },
    'b': { name: 'bed', solid: true, inspect: 'ふかふかのベッドだ。' },
    'p': { name: 'plant', solid: true, inspect: 'よく手入れされた観葉植物だ。' },
    'c': { name: 'counter', solid: true, counter: true },
    'm': { name: 'carpet' },
    'x': { name: 'exit' },
    'q': { name: 'pedestal', solid: true, inspect: '石の台座だ。' },
  };
})(window.Game);
