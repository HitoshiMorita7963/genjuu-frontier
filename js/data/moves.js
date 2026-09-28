// 技データ
//   el: 属性 / cat: phys(物理) spec(特殊) stat(補助) / pow: 威力 / acc: 命中 / mp: 消費MP
//   target: foe | self / eff: 追加効果 / prio: 先制度
//   inherit: false = 配合で継承できない（固有技）
(function (G) {
  'use strict';

  const M = (name, el, cat, pow, acc, mp, extra = {}) =>
    Object.assign({ name, el, cat, pow, acc, mp, target: cat === 'stat' ? 'foe' : 'foe', inherit: true }, extra);

  G.Moves = {
    // ---- 無 ----
    taiatari:   M('たいあたり',   'none', 'phys', 35, 95, 0, { desc: '体ごとぶつかる。' }),
    hikkaki:    M('ひっかき',     'none', 'phys', 40, 100, 0, { desc: '鋭い爪でひっかく。' }),
    nakigoe:    M('なきごえ',     'none', 'stat', 0, 100, 0, { eff: { stat: 'atk', stages: -1 }, desc: '相手の攻撃を下げる。' }),
    niramu:     M('にらみつける', 'none', 'stat', 0, 100, 0, { eff: { stat: 'def', stages: -1 }, desc: '相手の防御を下げる。' }),
    kiaitame:   M('気合ため',     'none', 'stat', 0, 100, 3, { target: 'self', eff: { stat: 'atk', stages: 2 }, desc: '自分の攻撃を大きく上げる。' }),
    katakunaru: M('かたくなる',   'none', 'stat', 0, 100, 2, { target: 'self', eff: { stat: 'def', stages: 1 }, desc: '自分の防御を上げる。' }),
    idaten:     M('韋駄天',       'none', 'stat', 0, 100, 4, { target: 'self', eff: { stat: 'spd', stages: 2 }, desc: '自分の素早さを大きく上げる。' }),
    nemuriuta:  M('ねむりうた',   'none', 'stat', 0, 60, 5, { eff: { status: 'sleep', chance: 100 }, desc: '相手を眠らせる。' }),
    sutemi:     M('すてみ突進',   'none', 'phys', 90, 90, 6, { eff: { recoil: 0.25 }, desc: '反動で自分も傷つく。' }),
    // MP切れのときに自動で使う技（覚えることはできない）
    mogaku:     M('もがく',       'none', 'phys', 30, 100, 0, { eff: { recoil: 0.25 }, inherit: false, hidden: true, desc: 'MPが足りないときに、必死にもがく。' }),
    // 通常攻撃：MPを使わない。攻撃と特殊攻撃の高い方で攻撃する（basic）。バトルの「たたかう」にいつも並ぶ
    kougeki:    M('こうげき',     'none', 'phys', 40, 100, 0, { basic: true, inherit: false, hidden: true, desc: 'MPを使わない通常攻撃。攻撃と特殊攻撃の、高い方の能力で攻撃する。' }),

    // ---- 炎 ----
    hinoko:     M('ひのこ',   'fire', 'spec', 40, 100, 2, { eff: { status: 'burn', chance: 10 }, desc: '小さな炎を飛ばす。やけどさせることがある。' }),
    kakyu:      M('火球',     'fire', 'spec', 60, 95, 4, { eff: { status: 'burn', chance: 10 }, desc: '燃えさかる火の玉を放つ。' }),
    homuraba:   M('焔牙',     'fire', 'phys', 60, 95, 4, { eff: { status: 'burn', chance: 10 }, desc: '炎をまとった牙でかみつく。' }),
    bakuen:     M('爆炎',     'fire', 'spec', 90, 85, 9, { desc: '大爆発する炎で焼きつくす。' }),
    guren:      M('紅蓮舞',   'fire', 'phys', 110, 90, 12, { inherit: false, desc: '【固有技】紅蓮の炎をまとい舞い踊る。' }),
    hiensho:    M('飛炎翔',   'fire', 'phys', 85, 100, 8, { prio: 1, inherit: false, desc: '【固有技】炎の翼で先制して突撃する。' }),
    shakunetsu: M('灼熱咆哮', 'fire', 'spec', 120, 90, 14, { inherit: false, desc: '【固有技】天をも焦がす咆哮。' }),

    // ---- 水 ----
    mizutsubute: M('みずつぶて', 'water', 'spec', 40, 100, 2, { desc: '水の粒を勢いよく飛ばす。' }),
    suijin:      M('水刃',       'water', 'phys', 55, 100, 4, { desc: '水の刃で切り裂く。' }),
    uzushio:     M('渦潮撃',     'water', 'spec', 60, 95, 4, { eff: { stat: 'spd', stages: -1, chance: 20 }, desc: '渦に巻きこむ。素早さを下げることがある。' }),
    gekiryu:     M('激流',       'water', 'spec', 90, 85, 9, { desc: '激しい水流で押し流す。' }),
    iyashiame:   M('癒しの雨',   'water', 'stat', 0, 100, 6, { target: 'self', eff: { heal: 0.4 }, desc: 'HPを最大の40%回復する。' }),
    daiuzujin:   M('大渦陣',     'water', 'spec', 110, 90, 12, { inherit: false, desc: '【固有技】海をもうねらせる大渦。' }),
    suikyou:     M('水鏡の祈り', 'water', 'stat', 0, 100, 10, { target: 'self', inherit: false, eff: { heal: 0.5, stat: 'sdf', stages: 1 }, desc: '【固有技】HPを回復し、特防を上げる。' }),

    // ---- 草 ----
    konohatsubute: M('木の葉つぶて', 'grass', 'spec', 40, 100, 2, { desc: '鋭い葉を飛ばす。' }),
    tsutauchi:     M('ツタ打ち',     'grass', 'phys', 50, 100, 3, { desc: 'しなるツタで打ちすえる。' }),
    mahihoushi:    M('麻痺胞子',     'grass', 'stat', 0, 75, 5, { eff: { status: 'para', chance: 100 }, desc: '相手を麻痺させる。' }),
    dokuhoushi:    M('毒胞子',       'grass', 'stat', 0, 85, 4, { eff: { status: 'poison', chance: 100 }, desc: '相手を毒にする。' }),
    kyusei:        M('吸精',         'grass', 'spec', 45, 100, 5, { eff: { drain: 0.5 }, desc: '与えたダメージの半分を吸収する。' }),
    kougousei:     M('光合成',       'grass', 'stat', 0, 100, 6, { target: 'self', eff: { heal: 0.5 }, desc: 'HPを最大の50%回復する。' }),
    hanaarashi:    M('花嵐',         'grass', 'spec', 90, 90, 9, { desc: '花びらの嵐を巻き起こす。' }),
    jukaisou:      M('樹界葬',       'grass', 'spec', 110, 90, 12, { inherit: false, eff: { drain: 0.3 }, desc: '【固有技】森そのものが相手を呑みこむ。' }),

    // ---- 雷 ----
    seidenki:  M('静電気',     'thunder', 'spec', 40, 100, 2, { eff: { status: 'para', chance: 10 }, desc: 'ぱちっと電気を流す。' }),
    raigeki:   M('雷撃',       'thunder', 'spec', 65, 95, 5, { eff: { status: 'para', chance: 10 }, desc: '雷を落とす。麻痺させることがある。' }),
    jinraiga:  M('迅雷牙',     'thunder', 'phys', 60, 95, 4, { eff: { status: 'para', chance: 10 }, desc: '電気をまとった牙でかみつく。' }),
    shibiredenpa: M('しびれ電波', 'thunder', 'stat', 0, 90, 5, { eff: { status: 'para', chance: 100 }, desc: '相手を麻痺させる。' }),
    gourai:    M('轟雷',       'thunder', 'spec', 95, 80, 10, { desc: 'すさまじい落雷。' }),
    raijinsou: M('雷迅走',     'thunder', 'phys', 100, 95, 11, { prio: 1, inherit: false, desc: '【固有技】稲妻の速さで駆け抜ける。' }),

    // ---- 地 ----
    sunakake:  M('砂かけ',     'earth', 'stat', 0, 100, 0, { eff: { stat: 'acc', stages: -1 }, desc: '相手の命中を下げる。' }),
    ganseki:   M('岩石落とし', 'earth', 'phys', 50, 90, 3, { desc: '岩を落としてぶつける。' }),
    daichiken: M('大地の拳',   'earth', 'phys', 75, 90, 6, { desc: '大地の力をこめた拳。' }),
    teppeki:   M('鉄壁',       'earth', 'stat', 0, 100, 4, { target: 'self', eff: { stat: 'def', stages: 2 }, desc: '自分の防御を大きく上げる。' }),
    jinari:    M('地鳴り',     'earth', 'phys', 90, 90, 9, { desc: '大地を揺らして攻撃する。' }),
    tekkaiotoshi: M('鉄塊落とし', 'earth', 'phys', 110, 90, 12, { inherit: false, desc: '【固有技】巨大な鉄の塊を叩きつける。' }),

    // ---- 風 ----
    fujin:      M('風刃',       'wind', 'spec', 45, 100, 2, { desc: '風の刃を放つ。' }),
    tsumuji:    M('つむじ風',   'wind', 'spec', 60, 95, 4, { desc: '渦巻く風で切り刻む。' }),
    shippu:     M('疾風突き',   'wind', 'phys', 50, 100, 3, { prio: 1, desc: '目にも止まらぬ速さで先制攻撃する。' }),
    ootatsumaki: M('大竜巻',    'wind', 'spec', 95, 85, 10, { desc: '巨大な竜巻を起こす。' }),
    soukyuretsu: M('蒼穹裂破', 'wind', 'spec', 115, 90, 13, { inherit: false, desc: '【固有技】空を裂く蒼い烈風。' }),

    // ---- 光 ----
    senkou:     M('閃光',       'light', 'spec', 45, 100, 3, { desc: 'まばゆい光を放つ。' }),
    mekuramashi: M('目くらまし', 'light', 'stat', 0, 100, 2, { eff: { stat: 'acc', stages: -1 }, desc: '相手の命中を下げる。' }),
    iyashihikari: M('癒しの光', 'light', 'stat', 0, 100, 5, { target: 'self', eff: { heal: 0.4 }, desc: 'HPを最大の40%回復する。' }),
    seinaruya:  M('聖なる矢',   'light', 'spec', 75, 95, 7, { desc: '光の矢で射抜く。' }),
    tenkankou:  M('天環光',     'light', 'spec', 130, 90, 16, { inherit: false, desc: '【固有技】天に輪を描く、はじまりの光。' }),

    // ---- 闇 ----
    yamizume:   M('闇爪',       'dark', 'phys', 50, 100, 3, { desc: '闇をまとった爪で切り裂く。' }),
    noroigoe:   M('呪いの声',   'dark', 'stat', 0, 100, 3, { eff: { stat: 'sat', stages: -1 }, desc: '相手の特攻を下げる。' }),
    akumu:      M('悪夢',       'dark', 'stat', 0, 65, 5, { eff: { status: 'sleep', chance: 100 }, desc: '相手を眠らせる。' }),
    ankokuha:   M('暗黒波',     'dark', 'spec', 80, 90, 8, { desc: '闇の波動を放つ。' }),
    // ================= 公式データ（100種）の技：キーは設計書の技名そのもの =================
    '火花':     M('火花',     'fire', 'spec', 40, 100, 2, { eff: { status: 'burn', chance: 10 }, desc: '小さな火花を飛ばす。やけどさせることがある。' }),
    '烈火弾':   M('烈火弾',   'fire', 'spec', 65, 95, 5, { eff: { status: 'burn', chance: 15 }, desc: '燃えさかる炎の弾を撃ちだす。' }),
    '灼熱波':   M('灼熱波',   'fire', 'spec', 90, 90, 9, { desc: '灼熱の波で一帯を焼きはらう。' }),
    '水刃':     M('水刃',     'water', 'phys', 50, 100, 3, { desc: '水の刃で切り裂く。' }),
    '癒しの雫': M('癒しの雫', 'water', 'stat', 0, 100, 5, { target: 'self', eff: { heal: 0.4 }, desc: 'HPを最大の40%回復する。' }),
    '潮流撃':   M('潮流撃',   'water', 'spec', 85, 90, 8, { eff: { stat: 'spd', stages: -1, chance: 20 }, desc: '渦巻く潮流で押し流す。素早さを下げることがある。' }),
    '風切り':   M('風切り',   'wind', 'phys', 45, 100, 2, { desc: '鋭い風で切りつける。' }),
    '追い風':   M('追い風',   'wind', 'stat', 0, 100, 4, { target: 'self', eff: { stat: 'spd', stages: 2 }, desc: '自分の素早さを大きく上げる。' }),
    '旋風刃':   M('旋風刃',   'wind', 'spec', 85, 90, 8, { desc: 'つむじ風の刃で切り刻む。' }),
    '岩つぶて': M('岩つぶて', 'earth', 'phys', 45, 95, 2, { desc: '岩のつぶてをぶつける。' }),
    '硬化':     M('硬化',     'earth', 'stat', 0, 100, 4, { target: 'self', eff: { stat: 'def', stages: 2 }, desc: '体を硬くして、防御を大きく上げる。' }),
    '大地震':   M('大地震',   'earth', 'phys', 95, 85, 10, { desc: '大地を揺るがす一撃。' }),
    '電撃':     M('電撃',     'thunder', 'spec', 45, 100, 2, { eff: { status: 'para', chance: 10 }, desc: '電気を浴びせる。麻痺させることがある。' }),
    '麻痺針':   M('麻痺針',   'thunder', 'stat', 0, 85, 4, { eff: { status: 'para', chance: 100 }, desc: '電気を帯びた針で相手を麻痺させる。' }),
    '雷鳴落とし': M('雷鳴落とし', 'thunder', 'spec', 95, 85, 10, { desc: '轟く雷を落とす。' }),
    '光弾':     M('光弾',     'light', 'spec', 45, 100, 2, { desc: '光の弾を放つ。' }),
    '小回復':   M('小回復',   'light', 'stat', 0, 100, 4, { target: 'self', eff: { heal: 0.35 }, desc: 'HPを最大の35%回復する。' }),
    '聖なる守り': M('聖なる守り', 'light', 'stat', 0, 100, 4, { target: 'self', eff: { stat: 'sdf', stages: 2 }, desc: '聖なる光に包まれ、特防を大きく上げる。' }),
    '影縫い':   M('影縫い',   'dark', 'phys', 50, 100, 3, { eff: { stat: 'spd', stages: -1, chance: 30 }, desc: '影を縫いとめる。素早さを下げることがある。' }),
    '呪い霧':   M('呪い霧',   'dark', 'stat', 0, 85, 4, { eff: { status: 'poison', chance: 100 }, desc: '呪いの霧で相手を毒にする。' }),
    '暗黒波':   M('暗黒波',   'dark', 'spec', 85, 90, 8, { desc: '闇の波動を放つ。' }),
    '氷牙':     M('氷牙',     'ice', 'phys', 60, 95, 4, { desc: '凍てつく牙でかみつく。' }),
    '冷気':     M('冷気',     'ice', 'stat', 0, 100, 3, { eff: { stat: 'spd', stages: -2 }, desc: '冷たい空気で相手の素早さを大きく下げる。' }),
    '凍結爪':   M('凍結爪',   'ice', 'phys', 90, 90, 9, { desc: 'すべてを凍らせる爪で切り裂く。' }),
    '星砕き':   M('星砕き',   'none', 'phys', 120, 95, 12, { inherit: false, desc: '【固有技】星をも砕く一撃。' }),
    '全能の波動': M('全能の波動', 'none', 'stat', 0, 100, 10, { target: 'self', inherit: false, eff: { stats: ['atk', 'def', 'spd', 'sat', 'sdf'], stages: 1 }, desc: '【固有技】すべての能力を上げる。' }),
    '創世の息吹': M('創世の息吹', 'none', 'spec', 130, 100, 16, { inherit: false, eff: { drain: 0.25 }, desc: '【固有技】世界を生みだした息吹。与えたダメージの一部を吸収する。' }),
    // ---- 型に合わせて技を選べるように追加（物理が足りない属性・特殊が足りない属性） ----
    '炎獄爪':   M('炎獄爪',   'fire', 'phys', 90, 90, 9, { eff: { status: 'burn', chance: 10 }, desc: '燃えさかる爪で切り裂く。やけどさせることがある。' }),
    '怒涛撃':   M('怒涛撃',   'water', 'phys', 90, 90, 9, { desc: '押しよせる大波のような体当たり。' }),
    '烈風脚':   M('烈風脚',   'wind', 'phys', 90, 90, 9, { desc: '風をまとった鋭い蹴り。' }),
    '轟雷爪':   M('轟雷爪',   'thunder', 'phys', 90, 90, 9, { eff: { status: 'para', chance: 10 }, desc: '雷をまとった爪。麻痺させることがある。' }),
    '光刃':     M('光刃',     'light', 'phys', 50, 100, 3, { desc: '光の刃で切りつける。' }),
    '聖光斬':   M('聖光斬',   'light', 'phys', 90, 90, 9, { desc: '聖なる光をまとった一閃。' }),
    '奈落斬':   M('奈落斬',   'dark', 'phys', 90, 90, 9, { desc: '闇の底へ引きずりこむ斬撃。' }),
    '氷礫':     M('氷礫',     'ice', 'spec', 45, 100, 2, { desc: '氷のつぶてを撃ちだす。' }),
    '雪嵐':     M('雪嵐',     'ice', 'spec', 90, 90, 9, { eff: { stat: 'spd', stages: -1, chance: 20 }, desc: '吹きすさぶ雪の嵐。素早さを下げることがある。' }),
    '砂塵':     M('砂塵',     'earth', 'spec', 45, 100, 2, { desc: '砂ぼこりを巻きあげてぶつける。' }),
    '地脈波':   M('地脈波',   'earth', 'spec', 90, 90, 9, { desc: '大地の力を波動にして放つ。' }),
    '衝撃波':   M('衝撃波',   'none', 'spec', 45, 100, 2, { desc: '見えない衝撃を放つ。' }),
    '真空波':   M('真空波',   'none', 'spec', 85, 90, 8, { desc: '空気を裂く、見えない刃の波動。' }),
    '極光':     M('極光',     'light', 'spec', 90, 90, 9, { desc: '夜空をおおう光のカーテンを放つ。' }),
    // ---- 上位属性の技（焔・嵐・霆・晶・聖・冥。上位属性の幻獣が使うとタイプ一致2倍） ----
    '焔刃':     M('焔刃',     'blaze', 'phys', 55, 100, 2, { desc: '焔をまとった刃で切りつける。' }),
    '焔獄撃':   M('焔獄撃',   'blaze', 'phys', 95, 90, 4, { eff: { status: 'burn', chance: 20 }, desc: '地獄の焔を叩きつける。やけどさせることがある。' }),
    '焔弾':     M('焔弾',     'blaze', 'spec', 50, 100, 1, { desc: '焔のかたまりを撃ちだす。' }),
    '焔華':     M('焔華',     'blaze', 'spec', 70, 95, 3, { eff: { status: 'burn', chance: 15 }, desc: '焔の花を咲かせて焼きつくす。' }),
    '劫火':     M('劫火',     'blaze', 'spec', 95, 90, 4, { desc: 'すべてを灰にする、終わりの焔。' }),
    '嵐爪':     M('嵐爪',     'storm', 'phys', 55, 100, 2, { desc: '嵐の勢いで引き裂く。' }),
    '暴嵐脚':   M('暴嵐脚',   'storm', 'phys', 95, 90, 4, { desc: '荒れくるう嵐をまとった蹴り。' }),
    '嵐弾':     M('嵐弾',     'storm', 'spec', 50, 100, 1, { desc: '渦巻く風のかたまりを撃ちだす。' }),
    '裂空波':   M('裂空波',   'storm', 'spec', 70, 95, 3, { desc: '空を裂く、嵐の波動。' }),
    '大嵐':     M('大嵐',     'storm', 'spec', 95, 90, 4, { eff: { stat: 'spd', stages: -1, chance: 20 }, desc: 'あたり一面を吹きとばす大嵐。素早さを下げることがある。' }),
    '嵐の加護': M('嵐の加護', 'storm', 'stat', 0, 100, 2, { target: 'self', eff: { stat: 'spd', stages: 2 }, desc: '嵐を身にまとい、素早さを大きく上げる。' }),
    '霆牙':     M('霆牙',     'bolt', 'phys', 55, 100, 2, { eff: { status: 'para', chance: 10 }, desc: '霆をまとった牙。麻痺させることがある。' }),
    '霆撃爪':   M('霆撃爪',   'bolt', 'phys', 95, 90, 4, { desc: '天をつんざく霆の爪。' }),
    '霆光':     M('霆光',     'bolt', 'spec', 50, 100, 1, { desc: 'まばゆい霆の光を放つ。' }),
    '迅霆':     M('迅霆',     'bolt', 'spec', 70, 95, 3, { desc: '目にもとまらぬ霆を落とす。' }),
    '天霆':     M('天霆',     'bolt', 'spec', 95, 90, 4, { eff: { status: 'para', chance: 20 }, desc: '天から降りそそぐ霆。麻痺させることがある。' }),
    '霆縛':     M('霆縛',     'bolt', 'stat', 0, 90, 2, { eff: { status: 'para', chance: 100 }, desc: '霆の鎖でしばり、麻痺させる。' }),
    '晶槍':     M('晶槍',     'crystal', 'phys', 55, 100, 2, { desc: '結晶の槍で突く。' }),
    '晶岩崩し': M('晶岩崩し', 'crystal', 'phys', 95, 90, 4, { desc: '巨大な結晶の岩をくずし落とす。' }),
    '晶弾':     M('晶弾',     'crystal', 'spec', 50, 100, 1, { desc: '鋭い結晶のかけらを撃ちだす。' }),
    '晶光波':   M('晶光波',   'crystal', 'spec', 70, 95, 3, { desc: '結晶に集めた光を放つ。' }),
    '晶界':     M('晶界',     'crystal', 'spec', 95, 90, 4, { desc: 'あたりを結晶の世界に変える。' }),
    '晶壁':     M('晶壁',     'crystal', 'stat', 0, 100, 2, { target: 'self', eff: { stat: 'def', stages: 2 }, desc: '結晶の壁で身を守り、防御を大きく上げる。' }),
    '聖刃':     M('聖刃',     'holy', 'phys', 55, 100, 2, { desc: '聖なる光の刃で切りつける。' }),
    '聖剣':     M('聖剣',     'holy', 'phys', 95, 90, 4, { desc: '光かがやく聖なる剣の一撃。' }),
    '聖光弾':   M('聖光弾',   'holy', 'spec', 50, 100, 1, { desc: '聖なる光の弾を放つ。' }),
    '聖燐':     M('聖燐',     'holy', 'spec', 70, 95, 3, { desc: '聖なる光の粉をまき散らす。' }),
    '聖天光':   M('聖天光',   'holy', 'spec', 95, 90, 4, { desc: '天から聖なる光を降らせる。' }),
    '聖なる癒し': M('聖なる癒し', 'holy', 'stat', 0, 100, 3, { target: 'self', eff: { heal: 0.5 }, desc: 'HPを最大の50%回復する。' }),
    '冥爪':     M('冥爪',     'abyss', 'phys', 55, 100, 2, { desc: '冥府の闇をまとった爪。' }),
    '冥府斬':   M('冥府斬',   'abyss', 'phys', 95, 90, 4, { desc: '冥府へ引きずりこむ斬撃。' }),
    '冥弾':     M('冥弾',     'abyss', 'spec', 50, 100, 1, { desc: '冥府の闇のかたまりを撃ちだす。' }),
    '冥霧':     M('冥霧',     'abyss', 'spec', 70, 95, 3, { eff: { status: 'poison', chance: 20 }, desc: '冥府の霧でつつむ。毒にすることがある。' }),
    '冥獄波':   M('冥獄波',   'abyss', 'spec', 95, 90, 4, { desc: '冥府の底から湧きあがる波動。' }),
    '冥呪':     M('冥呪',     'abyss', 'stat', 0, 90, 2, { eff: { status: 'poison', chance: 100 }, desc: '冥府の呪いで、相手を毒にする。' }),
    // ---- 無属性（追加種族の技。どの属性にも等倍） ----
    '突進':     M('突進',     'none', 'phys', 45, 100, 2, { desc: '全身でぶつかっていく。' }),
    '気合いため': M('気合いため', 'none', 'stat', 0, 100, 4, { target: 'self', eff: { stat: 'atk', stages: 1 }, desc: '気合いをためて、攻撃を上げる。' }),
    '渾身撃':   M('渾身撃',   'none', 'phys', 90, 90, 9, { desc: '力のかぎりを込めた一撃。' }),

    yomizaki:   M('黄泉咲き',   'dark', 'spec', 100, 90, 11, { inherit: false, eff: { drain: 0.3 }, desc: '【固有技】黄泉の花を咲かせ、命を吸う。' }),
    getsueizan: M('月影斬',     'dark', 'phys', 110, 95, 12, { inherit: false, desc: '【固有技】月の影より放つ必殺の一太刀。' }),
  };

  // ---------------- 消費MPのルール ----------------
  //   上の定義に書いた mp ではなく、ここで威力と種類から決める（序盤でも技を何回か使えるように）
  //   攻撃技：威力 50以下 1／65以下 2／80以下 3／95以下 4／110以下 5／それより上 6
  //   補助技：回復 3／それ以外 2
  //   消費0の技（たいあたり・こうげき など）はそのまま0。個別に決めたい技は mpFixed: true を付ける
  G.MP_COST_RULE = { steps: [[50, 1], [65, 2], [80, 3], [95, 4], [110, 5]], top: 6, heal: 3, stat: 2 };
  G.mpCost = function (mv) {
    const R = G.MP_COST_RULE;
    if (mv.mpFixed || mv.mp === 0) return mv.mp;
    if (mv.cat === 'stat') return mv.eff && (mv.eff.heal || mv.eff.healAll) ? R.heal : R.stat;
    const s = R.steps.find(([max]) => mv.pow <= max);
    return s ? s[1] : R.top;
  };
  for (const mv of Object.values(G.Moves)) mv.mp = G.mpCost(mv);
})(window.Game);
