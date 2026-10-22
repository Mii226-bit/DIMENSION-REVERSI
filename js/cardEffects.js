function executeCardEffect(card, index, row, col) {
  //カード消費
  consumeCard(index);

  let message = card.messages.success;

  switch (card.id) {
    case CARDS.CARD_001_DIMENSION_INVASION.id:
      use001DimensionInvasion(row, col);
      break;

    case CARDS.CARD_003_DOUBLE_ERASURE.id:
      use003DoubleErasure(row, col);
      break;

    case CARDS.CARD_004_RANDOM_REINFORCEMENT.id:
      use004RandomReinforcement();
      break;

    case CARDS.CARD_008_PIECE_RELOCATION.id:
      use008PieceRelocation(row, col);
      break;

    case CARDS.CARD_012_RANDOM_CORNER_DROP.id:
      use012RandomCornerDrop();
      break;

    case CARDS.CARD_019_RANDOM_HAND_DISCARD.id:
      message += `\n${use019RandomHandDiscard()}`;
      break;

    case CARDS.CARD_021_ALL_COLORS_SWAP.id:
      use021AllColorsSwap();
      break;

    case CARDS.CARD_022_ROTATE_BOARD_180.id:
      use022RotateBoard180();
      break;

    case CARDS.CARD_030_COPY_HAND_CARD.id:
      use030CopyHandCard();
      break;

    case CARDS.CARD_037_TRADE_ONE_DRAW_TWO.id:
      use037TradeOneDrawTwo();
      break;

    case CARDS.CARD_038_DOCTOR_POT.id:
      message += `\n${use038DoctorPot()}`;
      break;

    default:
      //未実装カード

      break;
  }

  isSelectingTarget = false;
  gameMessageText.textContent = message;
  console.log(message);
}

function use019RandomHandDiscard() {
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  const opponentHand = playerHands[opponentPlayer];

  if (opponentHand.length === 0) {
    return "だが相手の手札は0枚だった！";
  }

  const randomIndex = Math.floor(Math.random() * opponentHand.length);
  const discardedCard = opponentHand.splice(randomIndex, 1)[0];

  return `相手の${discardedCard.name}は消滅した！`;
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

function use038DoctorPot() {
  const drawnCards = drawCard(2);
  const cardNames = drawnCards.map((card) => card.name);

  return `${cardNames.join("と")}を引きました！`;
}

// // 盤面を更新
// renderBoard();

// gameMessageText.textContent = "次元の浸食を発動しました！";
