function executeCardEffect(card, index, row, col) {
  switch (card.id) {
    case CARDS.DOCTOR_POT.id:
      break;

    default:
      //未実装カード
      consumeCard(index);
      isSelectingTarget = false;
      gameMessageText.textContent = card.messages.success;
      break;
  }
}

// // 相手の駒を自分の色に変更
// boardData[row][col] = currentPlayer;

// // カードを消費
// consumeCard(selectedCard);

// // 対象選択モードを終了
// isSelectingTarget = false;

// // 盤面を更新
// renderBoard();

// gameMessageText.textContent = "次元の浸食を発動しました！";
