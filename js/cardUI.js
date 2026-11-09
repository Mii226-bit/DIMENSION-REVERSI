//背景色暗くしたりするやつ
function updateTargetHighlights() {
  board.classList.toggle("target-selecting", isSelectingTarget);

  //前回のハイライトを削除
  const cells = board.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.classList.remove("selectable-target");
  });

  if (!isSelectingTarget || selectedCard === null) {
    return;
  }

  const card = playerHands[currentPlayer][selectedCard];

  if (!card) return;

  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const piece = boardData[row][col];

    let isSelectable = false;

    switch (card.targetType) {
      case "opponent_piece":
        isSelectable = piece === opponentPlayer;
        break;

      case "opponent_pieces_2":
        const alreadySelected = selectedTargets.some((target) => {
          return target.row === row && target.col === col;
        });

        isSelectable = piece === opponentPlayer && !alreadySelected;
        break;

      case "piece_then_destination":
        if (selectedTargets.length === 0) {
          isSelectable = piece !== EMPTY;
        } else {
          isSelectable = piece === EMPTY;
        }
        break;
    }
    if (isSelectable) {
      cell.classList.add("selectable-target");
    }
  });
}

// プレイヤー情報を更新する
function updatePlayerInfo() {
  const result = countPieces();

  // 現在操作しているプレイヤーと相手
  const myPlayer = currentPlayer;
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  // 上側：相手プレイヤー
  renderPlayerInfo("top", opponentPlayer, result);

  // 下側：現在のプレイヤー
  renderPlayerInfo("bottom", myPlayer, result);
}

// 指定されたプレイヤーの情報を表示する
function renderPlayerInfo(position, player, pieceCounts) {
  const pieceElement = document.getElementById(`${position}-player-piece`);
  const pieceCountElement = document.getElementById(`${position}-piece-count`);
  const handCountElement = document.getElementById(`${position}-hand-count`);

  // 駒の色
  const isBlack = player === BLACK;

  pieceElement.classList.toggle("black", isBlack);
  pieceElement.classList.toggle("white", !isBlack);

  // 駒の枚数
  const pieceCount = isBlack ? pieceCounts.blackCount : pieceCounts.whiteCount;

  pieceCountElement.textContent = `${isBlack ? "黒" : "白"}の駒：${pieceCount}枚`;

  // 手札の枚数
  const handCount = playerHands[player].length;

  handCountElement.textContent = `${handCount}/${MAX_HAND_SIZE}`;

  // 手札がいっぱいならバッジの色を変更
  handCountElement.parentElement.classList.toggle(
    "hand-full",
    handCount >= MAX_HAND_SIZE,
  );
}
