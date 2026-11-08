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
