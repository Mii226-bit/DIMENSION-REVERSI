//ゲームデータを入れるよ

const CARDS = {
  CARD_001_DIMENSION_INVASION: {
    id: "dimension_invasion",
    name: "次元の浸食",
    type: "attack",
    icon: "✦",

    description: "相手の駒を1枚選び、自分の色に変える。",

    targetType: "opponent_piece",

    messages: {
      select: "色を変える相手の駒を選んでください。",
      success: "次元の浸食が成功しました！",
    },
  },
  //   CARD_002_CORNER_CONQUEST: {
  //     id: "corner_conquest",
  //     name: "角の簒奪",
  //     type: "attack",
  //     icon: "◈",
  //     description: "盤面の四隅から1マスを選び、自分の駒を置く。",
  //     targetType: "corner_cell",

  //     messages: {
  //       select: "駒を配置する角を選んでください。",
  //       success: "角の簒奪が成功しました！",
  //     },

  //     notes: "既存の駒は取り除く。空きマスへの使用と反転判定は未定。",
  //   },

  CARD_003_DOUBLE_ERASURE: {
    id: "double_erasure",
    name: "ダブル消去",
    type: "attack",
    icon: "✕",
    description: "相手の駒を2枚選び、盤面から取り除く。",
    targetType: "opponent_pieces_2",

    messages: {
      select: "消去する相手の駒を2枚選んでください。",
      success: "ダブル消去が成功しました！",
    },

    notes: "相手の駒が2枚未満の場合の処理は未定。",
  },

  CARD_004_RANDOM_REINFORCEMENT: {
    id: "random_reinforcement",
    name: "ランダム配置",
    type: "attack",
    icon: "✧",
    description: "盤面のランダムな位置に自分の駒を2枚配置する。",
    targetType: "none",

    messages: {
      success: "駒をランダムに二個配置しました！",
    },

    notes: "配置場所の条件と通常の反転判定を行うかは未定。",
  },

  //   CARD_005_SINGLE_REVERSAL: {
  //     id: "single_reversal",
  //     name: "反転の一閃",
  //     type: "attack",
  //     icon: "↻",
  //     description: "相手の駒を1枚選び、反転させる。",
  //     targetType: "opponent_piece",

  //     messages: {
  //       select: "反転させる相手の駒を選んでください。",
  //       success: "反転の一閃が成功しました！",
  //     },

  //     notes: "次元の浸食との効果の差別化を検討。",
  //   },

  //防御系
  //   CARD_006_GROWTH_SEED: {
  //     id: "growth_seed",
  //     name: "増殖の種子",
  //     type: "defense",
  //     icon: "❀",
  //     description:
  //       "このターンに置いた駒が、2ターンの間、最も近い空きマスへ増殖する。",
  //     targetType: "this_turn_piece",

  //     messages: {
  //       select: "増殖させる駒を選んでください。",
  //       success: "増殖の種子が発動しました！",
  //     },

  //     notes: "増殖のタイミング、距離の計算、増殖回数は未定。",
  //   },

  //   CARD_007_ONE_TURN_SANCTUARY: {
  //     id: "one_turn_sanctuary",
  //     name: "絶対防壁",
  //     type: "defense",
  //     icon: "⬡",
  //     description: "駒を1枚選び、1ターンの間無敵にする。",
  //     targetType: "piece",

  //     messages: {
  //       select: "無敵にする駒を選んでください。",
  //       success: "絶対防壁を展開しました！",
  //     },

  //     notes: "無敵が防ぐ効果の範囲は未定。",
  //   },

  CARD_008_PIECE_RELOCATION: {
    id: "piece_relocation",
    name: "座標転移",
    type: "defense",
    icon: "⇄",
    description: "盤面の駒を1枚選び、好きな場所に移動させる。",
    targetType: "piece_then_destination",

    messages: {
      select: "移動する駒と移動先を選んでください。",
      success: "座標転移が成功しました！",
    },

    notes: "移動先の条件と移動後の反転判定は未定。",
  },

  //   CARD_009_EFFECT_NULLIFICATION: {
  //     id: "effect_nullification",
  //     name: "効果遮断",
  //     type: "defense",
  //     icon: "⊘",
  //     description: "相手のカード効果を1つ無効化する。",
  //     targetType: "opponent_card_effect",

  //     messages: {
  //       select: "無効化するカード効果を選んでください。",
  //       success: "相手のカード効果を遮断しました！",
  //     },

  //     notes: "発動タイミングと無効化可能な効果は未定。",
  //   },

  //   CARD_010_NEXT_TURN_CARD_LOCK: {
  //     id: "next_turn_card_lock",
  //     name: "封札の呪印",
  //     type: "defense",
  //     icon: "⌑",
  //     description: "次のターン、カードを使用できなくする。",
  //     targetType: "none",

  //     messages: {
  //       success: "封札の呪印が発動しました！",
  //     },

  //     notes: "カード使用を禁止する対象は未定。",
  //   },

  //   CARD_011_NEXT_TURN_MOVE_LOCK: {
  //     id: "next_turn_move_lock",
  //     name: "着手封印",
  //     type: "defense",
  //     icon: "⛓",
  //     description: "次の相手ターン、相手は通常の駒配置ができなくなる。",
  //     targetType: "none",

  //     messages: {
  //       success: "着手封印が発動しました！",
  //     },

  //     notes: "カード使用の可否とターン終了処理は未定。",
  //   },

  CARD_012_RANDOM_CORNER_DROP: {
    id: "random_corner_drop",
    name: "角取り名人",
    type: "defense",
    icon: "⌗",
    description: "空いている角からランダムに1マス選ばれ、\n自分の駒を置く。",
    targetType: "none",

    messages: {
      success: "角取り名人が成功しました！",
    },

    notes: "空き角がない場合と反転判定は未定。",
  },

  //   CARD_013_NEXT_TURN_IMMUNITY: {
  //     id: "next_turn_immunity",
  //     name: "次元加護",
  //     type: "defense",
  //     icon: "◇",
  //     description: "次のターン、相手のカード効果を受けなくなる。",
  //     targetType: "none",

  //     messages: {
  //       success: "次元加護が発動しました！",
  //     },

  //     notes: "効果の対象となるターンと防御範囲は未定。",
  //   },

  //   CARD_014_MIRROR_COUNTER: {
  //     id: "mirror_counter",
  //     name: "鏡界反射",
  //     type: "defense",
  //     icon: "↶",
  //     description: "次に受ける相手のカード効果を反射する。",
  //     targetType: "none",

  //     messages: {
  //       success: "鏡界反射を発動しました！",
  //     },

  //     notes: "反射できる効果と反射時の処理は要検討。",
  //   },

  //   CARD_015_BOARD_INTERFERENCE_SHIELD: {
  //     id: "board_interference_shield",
  //     name: "位相障壁",
  //     type: "defense",
  //     icon: "▣",
  //     description: "2ターンの間、盤面に干渉するカードの影響を受けない。",
  //     targetType: "none",

  //     messages: {
  //       success: "位相障壁を展開しました！",
  //     },

  //     notes: "対象となるカード効果と持続時間の数え方は未定。",
  //   },

  //   CARD_016_FLIP_LIMIT_FIELD: {
  //     id: "flip_limit",
  //     name: "反転制限",
  //     type: "defense",
  //     icon: "≋",
  //     description: "1ターンの間、1回の着手で2枚以上の駒を反転できなくする。",
  //     targetType: "none",

  //     messages: {
  //       success: "反転制限領域が発動しました！",
  //     },

  //     notes: "制限するプレイヤーと、2枚以上反転する手の扱いは未定。",
  //   },

  //   CARD_017_UNDERDOG_REVERSAL: {
  //     id: "underdog_reversal",
  //     name: "逆境の反攻",
  //     type: "defense",
  //     icon: "⚡",
  //     description: "自分の駒が相手より少ない場合、相手の駒を5枚反転させる。",
  //     targetType: "opponent_pieces_5",

  //     messages: {
  //       select: "反転させる相手の駒を選んでください。",
  //       success: "逆境の反攻が成功しました！",
  //     },

  //     notes: "対象の選択方法と相手の駒が5枚未満の場合は未定。",
  //   },

  //妨害系
  //   CARD_018_TURN_SKIP: {
  //     id: "turn_skip",
  //     name: "時飛ばし",
  //     type: "disruption",
  //     icon: "⌛",
  //     description: "相手のターンを1回飛ばす。",
  //     targetType: "none",

  //     messages: {
  //       success: "時飛ばしが発動しました！",
  //     },

  //     notes: "スキップ時のドローや継続効果の扱いは未定。",
  //   },

  CARD_019_RANDOM_HAND_DISCARD: {
    id: "random_hand_discard",
    name: "手札崩壊",
    type: "disruption",
    icon: "✂",
    description: "相手の手札からランダムに1枚捨てさせる。",
    targetType: "none",

    messages: {
      success: "手札崩壊が成功しました！",
    },

    notes: "相手の手札が0枚の場合の扱いは未定。",
  },

  //   CARD_020_OPPONENT_CARD_THEFT_USE: {
  //     id: "opponent_card_theft_use",
  //     name: "能力強奪",
  //     type: "disruption",
  //     icon: "☷",
  //     description: "相手の手札を確認し、1枚選んでその効果を使用する。",
  //     targetType: "opponent_hand_card",

  //     messages: {
  //       select: "使用する相手のカードを選んでください。",
  //       success: "能力強奪が成功しました！",
  //     },

  //     notes: "選んだカードの消費方法と使用条件は未定。",
  //   },
  CARD_021_ALL_COLORS_SWAP: {
    id: "all_colors_swap",
    name: "白黒反転",
    type: "disruption",
    icon: "◐",
    description: "盤面上の白い駒と黒い駒をすべて入れ替える。\n理不尽。",
    targetType: "none",

    messages: {
      success: "黒と白が入れ替わりました！\n理不尽でごめんね(^ε^)-☆Chu!!",
    },
  },

  CARD_022_ROTATE_BOARD_180: {
    id: "rotate_board_180",
    name: "盤面転回",
    type: "disruption",
    icon: "⤾",
    description:
      "盤面にあるすべての駒の配置を180度回転させる。\n意味？そんなもの自分で探すんだよ",
    targetType: "none",

    messages: {
      success: "盤面転回が成功しました！",
    },
  },

  //   CARD_023_ERASE_LOWER_HALF: {
  //     id: "erase_lower_half",
  //     name: "下界消滅",
  //     type: "disruption",
  //     icon: "↓",
  //     description: "特定の条件を満たすと、盤面の下半分にある駒をすべて消す。",
  //     targetType: "none",

  //     messages: {
  //       success: "下界消滅が発動しました！",
  //     },

  //     notes: "発動条件は未定。",
  //   },

  //   CARD_024_ERASE_UPPER_HALF: {
  //     id: "erase_upper_half",
  //     name: "上界消滅",
  //     type: "disruption",
  //     icon: "↑",
  //     description: "特定の条件を満たすと、盤面の上半分にある駒をすべて消す。",
  //     targetType: "none",

  //     messages: {
  //       success: "上界消滅が発動しました！",
  //     },

  //     notes: "発動条件は未定。",
  //   },

  //   CARD_025_TOTAL_ERASURE: {
  //     id: "total_erasure",
  //     name: "盤面零化",
  //     type: "disruption",
  //     icon: "∅",
  //     description: "盤面にあるすべての駒を消す。",
  //     targetType: "none",

  //     messages: {
  //       success: "盤面零化が発動しました！",
  //     },

  //     notes: "全消去後のゲーム進行と終了判定は要検討。",
  //   },

  //   CARD_026_STEAL_HAND_CARD: {
  //     id: "steal_hand_card",
  //     name: "次元の略奪",
  //     type: "disruption",
  //     icon: "⌁",
  //     description: "相手の手札から1枚奪い、自分の手札に加える。",
  //     targetType: "opponent_hand_card_or_random",

  //     messages: {
  //       select: "奪う相手のカードを選んでください。",
  //       success: "次元の略奪が成功しました！",
  //     },

  //     notes: "ランダムか選択式かは未定。手札上限の処理も要検討。",
  //   },

  //   CARD_027_HAND_SHUFFLE: {
  //     id: "hand_shuffle",
  //     name: "手札撹乱",
  //     type: "disruption",
  //     icon: "⤨",
  //     description: "手札にあるカードの並び順をシャッフルする。",
  //     targetType: "none",

  //     messages: {
  //       success: "手札撹乱が発動しました！",
  //     },

  //     notes: "シャッフル対象と、並び替え以外の効果を持つかは未定。",
  //   },

  //   CARD_028_HAND_EXCHANGE: {
  //     id: "hand_exchange",
  //     name: "手札交換",
  //     type: "disruption",
  //     icon: "⇆",
  //     description: "自分と相手の手札をすべて入れ替える。",
  //     targetType: "none",

  //     messages: {
  //       success: "手札交換が成功しました！",
  //     },
  //   },

  //   CARD_029_AUTO_PLAY_THREE_TURNS: {
  //     id: "auto_play_three_turns",
  //     name: "自律暴走",
  //     type: "disruption",
  //     icon: "⚙",
  //     description: "3ターンの間、自分と相手の行動が自動で決定される。",
  //     targetType: "none",

  //     messages: {
  //       success: "自律暴走が始まりました！",
  //     },

  //     notes: "自動行動のルールと3ターンの数え方は未定。",
  //   },

  CARD_030_COPY_HAND_CARD: {
    id: "copy_hand_card",
    name: "複製術式",
    type: "disruption",
    icon: "▤",
    description: "自分の手札から1枚選び、そのカードをコピーする。",
    targetType: "own_hand_card",

    messages: {
      select: "コピーするカードを選んでください。",
      success: "複製術式が成功しました！",
    },

    notes: "手札上限に達している場合の扱いは未定。",
  },

  //   CARD_031_BLOCK_EMPTY_CELL: {
  //     id: "block_empty_cell",
  //     name: "座標封鎖",
  //     type: "disruption",
  //     icon: "▧",
  //     description:
  //       "空きマスを1つ選び、次の相手ターンにそのマスへ駒を置けなくする。",
  //     targetType: "empty_cell",

  //     messages: {
  //       select: "封鎖する空きマスを選んでください。",
  //       success: "座標封鎖が成功しました！",
  //     },

  //     notes: "特殊カードによる配置も封鎖するかは未定。",
  //   },

  //   CARD_032_BLOCK_NEXT_DRAW: {
  //     id: "block_next_draw",
  //     name: "ドロー封印",
  //     type: "disruption",
  //     icon: "⊠",
  //     description: "次の相手ターン開始時、相手はカードを引けなくなる。",
  //     targetType: "none",

  //     messages: {
  //       success: "ドロー封印が発動しました！",
  //     },
  //   },

  //特殊系
  //   CARD_033_FIVE_TURN_DEADLINE: {
  //     id: "five_turn_deadline",
  //     name: "終焉の刻限",
  //     type: "special",
  //     icon: "◷",
  //     description: "このカードの発動から5ターン後に試合を強制終了する。",
  //     targetType: "none",

  //     messages: {
  //       success: "終焉の刻限が刻まれました！",
  //     },

  //     notes: "5ターンの数え方と終了時の勝敗判定は未定。",
  //   },

  //   CARD_034_DOUBLE_PLACEMENT: {
  //     id: "double_placement",
  //     name: "二重着手",
  //     type: "special",
  //     icon: "Ⅱ",
  //     description: "このターン、通常の駒配置を2回行える。",
  //     targetType: "none",

  //     messages: {
  //       success: "二重着手が発動しました！",
  //     },

  //     notes: "途中で置ける場所がなくなった場合の処理は未定。",
  //   },

  //   CARD_035_RECLAIM_DISCARDED_CARD: {
  //     id: "reclaim_discarded_card",
  //     name: "失札再生",
  //     type: "special",
  //     icon: "✣",
  //     description: "使用済みのカードを1枚選び、自分の手札に戻す。",
  //     targetType: "discarded_card",

  //     messages: {
  //       select: "復活させるカードを選んでください。",
  //       success: "失札再生が成功しました！",
  //     },

  //     notes: "使用済みカードの保存方法と手札上限への対応は未定。",
  //   },

  //   CARD_036_GIANT_THREE_BY_THREE: {
  //     id: "giant_three_by_three",
  //     name: "巨像降臨",
  //     type: "special",
  //     icon: "▦",
  //     description: "次の自分のターンに置く駒を3×3の巨大な駒にする。",
  //     targetType: "none",

  //     messages: {
  //       success: "巨像降臨の準備が整いました！",
  //     },

  //     notes: "3×3の占有範囲と通常の反転判定は未定。",
  //   },

  CARD_037_TRADE_ONE_DRAW_TWO: {
    id: "trade_one_draw_two",
    name: "次元交換",
    type: "special",
    icon: "⇌",
    description: "自分の手札を1枚捨て、新しいカードを2枚引く。",
    targetType: "own_hand_card",

    messages: {
      select: "交換するカードを1枚選んでください。",
      success: "次元交換が成功しました！",
    },

    notes: "使用中のカードを交換対象にできるか、手札上限の扱いは未定。",
  },

  CARD_038_DOCTOR_POT: {
    id: "doctor_pot",
    name: "強欲な博士",
    type: "special",
    icon: "🏺",
    description:
      "自分のデッキからカードを2枚引く。\nどこかで見たことある気がするのは気のせい。",
    targetType: "none",

    messages: {
      success: "強欲な博士を使用！",
    },
  },

  //   CARD_039_RANDOM_BOARD_RESIZE: {
  //     id: "random_board_resize",
  //     name: "次元伸縮",
  //     type: "special",
  //     icon: "⤢",
  //     description: "盤面の大きさをランダムに変更する。",
  //     targetType: "none",

  //     messages: {
  //       success: "次元伸縮が発動しました！",
  //     },

  //     notes: "変更できるサイズと既存の駒の扱いは要検討。",
  //   },

  //   CARD_40_SHUFFLE_ALL_PIECES: {
  //     id: "shuffle_all_pieces",
  //     name: "盤上混沌",
  //     type: "special",
  //     icon: "⤨",
  //     description: "盤面にあるすべての駒の配置をランダムに入れ替える。",
  //     targetType: "none",

  //     messages: {
  //       success: "盤上混沌が発動しました！",
  //     },

  //     notes: "空きマスもシャッフルの対象に含めるかは未定。",
  //   },

  //   CARD_041_CHANGE_COLORS_RED_BLUE: {
  //     id: "change_colors_red_blue",
  //     name: "異彩変換",
  //     type: "special",
  //     icon: "◉",
  //     description: "駒の色を赤と青に変更する。",
  //     targetType: "none",

  //     messages: {
  //       success: "異彩変換が発動しました！",
  //     },

  //     notes: "見た目だけの変更か、ゲームのルールにも影響するかは未定。",
  //   },
};

const CARD_LIST = Object.values(CARDS);
