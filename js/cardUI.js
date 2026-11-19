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

  renderOpponentHand();
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

  pieceCountElement.textContent = `${pieceCount}枚`;

  // 手札の枚数
  const handCount = playerHands[player].length;

  handCountElement.textContent = `${handCount}/${MAX_HAND_SIZE}`;

  // 手札がいっぱいならバッジの色を変更
  handCountElement.parentElement.classList.toggle(
    "hand-full",
    handCount >= MAX_HAND_SIZE,
  );
}

//相手のカードを表示
function renderOpponentHand() {
  const opponentHand = document.getElementById("opponent-hand");

  const opponentPlayer = currentPlayer == BLACK ? WHITE : BLACK;
  const handCount = playerHands[opponentPlayer].length;

  opponentHand.replaceChildren();
  for (let i = 0; i < handCount; i++) {
    const card = document.createElement("div");
    card.classList.add("opponent-card");

    opponentHand.appendChild(card);
  }
}

// 手札を左右にスクロール
function scrollHand(direction) {
  const firstCard = cardHand.querySelector(".card");

  if (!firstCard) return;

  const cardWidth = firstCard.offsetWidth;
  const gap = parseFloat(getComputedStyle(cardHand).columnGap) || 0;

  cardHand.scrollBy({
    left: direction * (cardWidth + gap),
    behavior: "smooth",
  });
}

// スクロール位置に応じて矢印を更新
function updateHandArrows() {
  const prevButton = document.getElementById("hand-prev");
  const nextButton = document.getElementById("hand-next");

  const maxScroll = cardHand.scrollWidth - cardHand.clientWidth;

  prevButton.disabled = cardHand.scrollLeft <= 1;

  nextButton.disabled = cardHand.scrollLeft >= maxScroll - 1;
}

// 手札スクロールの初期設定
function initializeHandScroll() {
  const prevButton = document.getElementById("hand-prev");
  const nextButton = document.getElementById("hand-next");

  prevButton.addEventListener("click", () => {
    scrollHand(-1);
  });

  nextButton.addEventListener("click", () => {
    scrollHand(1);
  });

  cardHand.addEventListener("scroll", updateHandArrows);

  window.addEventListener("resize", updateHandArrows);

  updateHandArrows();
}
