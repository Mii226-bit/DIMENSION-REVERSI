function executeCardEffect(card, index, targets = []) {
  //カード消費
  consumeCard(index);

  let message = card.messages.success;

  switch (card.id) {
    case CARDS.CARD_001_DIMENSION_INVASION.id: //OK
      use001DimensionInvasion(targets[0].row, targets[0].col);
      break;

    case CARDS.CARD_003_DOUBLE_ERASURE.id: //OK
      use003DoubleErasure(targets);
      break;

    case CARDS.CARD_004_RANDOM_REINFORCEMENT.id: //OK
      use004RandomReinforcement();
      break;

    case CARDS.CARD_008_PIECE_RELOCATION.id: //OK
      use008PieceRelocation(targets[0], targets[1]);
      break;

    case CARDS.CARD_012_RANDOM_CORNER_DROP.id: //OK
      const result012 = use012RandomCornerDrop();

      if (result012 === false) {
        message = `${card.name}は失敗した！`;
      }
      break;

    case CARDS.CARD_019_RANDOM_HAND_DISCARD.id: //OK
      message += `\n${use019RandomHandDiscard()}`;
      break;

    case CARDS.CARD_021_ALL_COLORS_SWAP.id:
      use021AllColorsSwap();
      break;

    case CARDS.CARD_022_ROTATE_BOARD_180.id: //OK
      use022RotateBoard180();
      break;

    case CARDS.CARD_030_COPY_HAND_CARD.id:
      use030CopyHandCard();
      break;

    case CARDS.CARD_037_TRADE_ONE_DRAW_TWO.id:
      use037TradeOneDrawTwo();
      break;

    case CARDS.CARD_038_DOCTOR_POT.id: //OK
      message += `\n${use038DoctorPot()}`;
      break;

    default:
      //未実装カード

      break;
  }

  isSelectingTarget = false;
  selectedTargets = [];
  gameMessageText.textContent = message;
  console.log(message);
}

function use001DimensionInvasion(row, col) {
  boardData[row][col] = currentPlayer;
  renderBoard();
}

function use003DoubleErasure(targets) {
  targets.forEach((target) => {
    boardData[target.row][target.col] = EMPTY;
  });

  renderBoard();
}

function use004RandomReinforcement() {
  const emptyCells = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (boardData[row][col] === EMPTY) {
        emptyCells.push({ row, col });
      }
    }
  }

  for (let i = 0; i < 2; i++) {
    if (emptyCells.length === 0) {
      break;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const target = emptyCells.splice(randomIndex, 1)[0];
    boardData[target.row][target.col] = currentPlayer;
  }

  renderBoard();
}

function use008PieceRelocation(from, to) {
  const piece = boardData[from.row][from.col];
  boardData[to.row][to.col] = piece;
  boardData[from.row][from.col] = EMPTY;
  renderBoard();
}

function use012RandomCornerDrop() {
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: BOARD_SIZE - 1 },
    { row: BOARD_SIZE - 1, col: 0 },
    { row: BOARD_SIZE - 1, col: BOARD_SIZE - 1 },
  ];

  //空いてる角だけを取得
  //filter:条件に合うものを取り出して、新しい配列を作る
  const emptyConers = corners.filter((corner) => {
    return boardData[corner.row][corner.col] === EMPTY;
  });

  if (emptyConers.length === 0) {
    return false;
  }

  const randomIndex = Math.floor(Math.random() * emptyConers.length);
  const target = emptyConers[randomIndex];

  boardData[target.row][target.col] = currentPlayer;

  renderBoard();

  return true;
}

function use019RandomHandDiscard() {
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  const opponentHand = playerHands[opponentPlayer];

  if (opponentHand.length === 0) {
    return "だが相手の手札は0枚だった！";
  }

  const randomIndex = Math.floor(Math.random() * opponentHand.length);
  const discardedCard = opponentHand.splice(randomIndex, 1)[0];

  return `相手の「${discardedCard.name}」を破壊した！`;
}

function use021AllColorsSwap() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (boardData[row][col] === BLACK) {
        boardData[row][col] = WHITE;
      } else if (boardData[row][col] === WHITE) {
        boardData[row][col] = BLACK;
      }
    }
  }
  renderBoard();
}

function use022RotateBoard180() {
  //回転後の座標を作成
  const rotateBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(EMPTY),
  );

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const newRow = BOARD_SIZE - 1 - row;
      const newCol = BOARD_SIZE - 1 - col;
      rotateBoard[newRow][newCol] = boardData[row][col];
    }
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      boardData[row][col] = rotateBoard[row][col];
    }
  }

  renderBoard();
}

function use030CopyHandCard() {}

function use037TradeOneDrawTwo() {}

function use038DoctorPot() {
  const drawnCards = drawCard(2);
  const cardNames = drawnCards.map((card) => card.name);

  return `${cardNames.join("と")}を引きました！`;
}
