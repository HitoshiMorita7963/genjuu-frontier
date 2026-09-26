// BGMの楽譜（すべてオリジナル）
//   notes: 8分音符ごとのトークン。'C5' = 発音 / '.' = 前の音をのばす / '-' = 休符 / '|' = 小節線（無視）
//   wave: square | triangle | sawtooth | sine、vol: 音量
(function (G) {
  'use strict';

  const lead = (notes, wave = 'square', vol = 0.07) => ({ notes, wave, vol });
  const bass = (notes, wave = 'triangle', vol = 0.16) => ({ notes, wave, vol });

  G.Music = {
    // タイトル：おだやかで少し壮大に
    title: {
      bpm: 84,
      voices: [
        lead('E5 . G5 . C6 . . . | B5 . A5 . G5 . . . | A5 . F5 . A5 . C6 . | B5 . . . . . - - | G5 . E5 . G5 . C6 . | D6 . C6 . B5 . A5 . | G5 . . . E5 . F5 . | G5 . . . . . - -', 'triangle', 0.1),
        bass('C3 . . . G3 . . . | E3 . . . G3 . . . | F3 . . . A3 . . . | G3 . . . D3 . . . | C3 . . . E3 . . . | F3 . . . D3 . . . | E3 . . . A3 . . . | G3 . . . G2 . . .'),
      ],
    },
    // 村：明るく軽快に
    town: {
      bpm: 116,
      voices: [
        lead('F5 . A5 . C6 . A5 . | G5 . A5 . F5 . . . | D5 . F5 . A5 . G5 . | E5 . . . C5 . . . | F5 . A5 . C6 . D6 . | C6 . A5 . G5 . F5 . | G5 . A5 . G5 . E5 . | F5 . . . . . - -', 'square', 0.055),
        bass('F3 - C4 - F3 - C4 - | C3 - G3 - C3 - G3 - | D3 - A3 - D3 - A3 - | C3 - G3 - C3 - E3 - | F3 - C4 - F3 - C4 - | A2 - E3 - A2 - E3 - | C3 - G3 - C3 - G3 - | F3 - C4 - F3 . . .'),
      ],
    },
    // 草原：冒険のはじまり
    field: {
      bpm: 132,
      voices: [
        lead('G4 . B4 . D5 . G5 . | F#5 . D5 . E5 . . . | C5 . E5 . G5 . E5 . | D5 . . . . . - - | G4 . B4 . D5 . B5 . | A5 . G5 . F#5 . E5 . | D5 . C5 . B4 . A4 . | G4 . . . . . - -', 'square', 0.055),
        bass('G2 - D3 - G2 - D3 - | D3 - A3 - D3 - A3 - | C3 - G3 - C3 - G3 - | D3 - A3 - D3 - F#3 - | G2 - D3 - G2 - D3 - | C3 - G3 - D3 - A3 - | E3 - B3 - D3 - A3 - | G2 - D3 - G2 . . .'),
      ],
    },
    // 森：ひそやかで神秘的に
    forest: {
      bpm: 96,
      voices: [
        lead('A4 . . C5 . . E5 . | D5 . . C5 . . B4 . | A4 . . E5 . . A5 . | G5 . . . . . - - | F5 . . E5 . . D5 . | E5 . . C5 . . A4 . | B4 . . G#4 . . B4 . | A4 . . . . . - -', 'triangle', 0.1),
        bass('A2 . . . E3 . . . | F2 . . . C3 . . . | A2 . . . E3 . . . | G2 . . . D3 . . . | D3 . . . A2 . . . | C3 . . . A2 . . . | E2 . . . E3 . . . | A2 . . . . . . .'),
      ],
    },
    // 洞窟：ゆっくり、不気味に
    cave: {
      bpm: 72,
      voices: [
        lead('D5 . . . - - F5 . | E5 . . . - - A4 . | D5 . . . - - C5 . | A4 . . . . . . . | Bb4 . . . - - D5 . | C5 . . . - - A4 . | G4 . . . A4 . . . | D4 . . . . . . .', 'triangle', 0.09),
        bass('D2 . . . . . . . | A2 . . . . . . . | Bb2 . . . . . . . | A2 . . . . . . . | G2 . . . . . . . | F2 . . . . . . . | A2 . . . . . . . | D2 . . . . . . .', 'sine', 0.2),
      ],
    },
    // 野生・トレーナー戦
    battle: {
      bpm: 168,
      voices: [
        lead('E5 E5 - E5 G5 - E5 - | D5 - B4 - C5 D5 - - | E5 E5 - E5 G5 - A5 - | B5 - A5 - G5 - F#5 - | E5 . G5 . B5 . E6 . | D6 . B5 . A5 . G5 . | F#5 . G5 . A5 . F#5 . | E5 . . . B4 . . .', 'square', 0.05),
        bass('E2 E3 E2 E3 E2 E3 E2 E3 | C3 C4 C3 C4 D3 D4 D3 D4 | E2 E3 E2 E3 E2 E3 E2 E3 | B2 B3 B2 B3 B2 B3 D3 D4 | C3 C4 C3 C4 C3 C4 C3 C4 | G2 G3 G2 G3 D3 D4 D3 D4 | A2 A3 A2 A3 B2 B3 B2 B3 | E2 E3 E2 E3 B2 B3 B2 B3', 'triangle', 0.15),
      ],
    },
    // ボス戦
    boss: {
      bpm: 176,
      voices: [
        lead('C5 - C5 - Eb5 - C5 - | G5 . . . F#5 . . . | F5 - F5 - Ab5 - F5 - | C6 . . . B5 . . . | C5 - Eb5 - G5 - C6 - | Bb5 . Ab5 . G5 . F5 . | Eb5 . F5 . G5 . Ab5 . | G5 . . . B4 . . .', 'sawtooth', 0.04),
        bass('C2 C3 C2 C3 C2 C3 C2 C3 | C2 C3 C2 C3 B1 B2 B1 B2 | F2 F3 F2 F3 F2 F3 F2 F3 | Ab2 Ab3 Ab2 Ab3 G2 G3 G2 G3 | C2 C3 C2 C3 C2 C3 C2 C3 | Bb1 Bb2 Bb1 Bb2 Ab1 Ab2 Ab1 Ab2 | Eb2 Eb3 Eb2 Eb3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3', 'triangle', 0.17),
      ],
    },
    // 勝利ジングル（1回だけ）
    victory: {
      bpm: 150, loop: false,
      voices: [
        lead('C5 E5 G5 C6 . . G5 . | A5 . B5 . C6 . . . . .', 'square', 0.07),
        bass('C3 . . . . . G2 . | F2 . G2 . C3 . . . . .'),
      ],
    },
  };
})(window.Game);
