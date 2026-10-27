//==== カード関連の処理 ====

//手札の初期化
function initializeHand(count = INITIAL_HAND_SIZE) {
  playerHands = {
    [BLACK]: [],
    [WHITE]: [],
  };
  drawCard(count, WHITE);
  drawCard(count, BLACK);
}

//ターン開始時ドロー、カード描画までしてくれてる
function startTurn() {
  hasUsedCard = false;
  hasPlacedPiece = false;
  selectedCard = null;

  drawCard();
}

//カードをハンドに追加（今は固定のカードのみ）
function drawCard(count = 1, player = currentPlayer) {
  //あらかじめ持ってくる
  const hand = playerHands[player];

  //引いたカードを保存する配列
  const drawnCards = [];

  for (let i = 0; i < count; i++) {
    if (hand.length >= MAX_HAND_SIZE) {
      gameMessageText.textContent = `${player === BLACK ? "黒" : "白"}は手札がいっぱいでした！`;
      console.log(`${player === BLACK ? "黒" : "白"}は手札がいっぱいでした！`);
      break;
    }

    const randomIndex = Math.floor(Math.random() * CARD_LIST.length);
    const drawnCard = CARD_LIST[randomIndex];

    hand.push(drawnCard);
    drawnCards.push(drawnCard);

    gameMessageText.textContent = `${player === BLACK ? "黒" : "白"}のターン！\n${CARD_LIST[randomIndex].name}を引きました!`;
    console.log(
      `${player === BLACK ? "黒" : "白"}は${CARD_LIST[randomIndex].name}を引きました!`,
    );
  }
  if (player === currentPlayer) {
    renderCards();
  }

  return drawnCards;
}

//カード描画
function renderCards() {
  cardHand.innerHTML = "";

  playerHands[currentPlayer].forEach((cardData, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.textContent = cardData.name;

    card.addEventListener("click", () => {
      selectCard(index);
    });

    cardHand.appendChild(card);
  });

  updateCardSelection();
}

//カード選択状態を反映
function updateCardSelection() {
  const cards = cardHand.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.classList.toggle("selected", selectedCard === index);
  });
}

//カード選択、一回目は選択二回目は使用
function selectCard(index) {
  if (gameOver) return;

  if (isSelectingHandTarget) {
    selectHandTarget(index);
    return;
  }

  //対象選択中なら一度キャンセル
  if (isSelectingTarget) {
    cancelCardSelection();
  }

  if (selectedCard === index) {
    //既に選ばれてたら使用を試みる
    useCard(index);
  } else {
    selectedCard = index;
    updateCardSelection();

    const card = playerHands[currentPlayer][index];

    const message = hasUsedCard
      ? "※このターンは既にカードを使用しました"
      : "もう一度カードをクリックすると効果発動！";

    gameMessageText.textContent = `${card.description}\n${message}`;
  }
}

//カード使用
function useCard(index) {
  if (gameOver || isSelectingTarget) {
    return;
  }

  if (hasUsedCard) {
    gameMessageText.textContent = `このターンカードはもう使えません！`;
    console.log(`このターンカードはもう使えません！`);
    return;
  }

  const card = playerHands[currentPlayer][index];

  if (!card) {
    return;
  }

  //カードに選択対象があるかどうかの判別
  if (card.targetType === "none") {
    executeCardEffect(card, index);
  } else if (card.targetType === "hand_card") {
    isSelectingHandTarget = true;
    gameMessageText.textContent = card.messages.select;
  } else {
    isSelectingTarget = true;
    gameMessageText.textContent = card.messages.select;
  }
}

//カードの選択対象
function selectTarget(row, col) {
  const card = playerHands[currentPlayer][selectedCard];
  //カードが選ばれてなかったら実行されない
  if (!card) {
    return;
  }

  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  switch (card.targetType) {
    case "opponent_piece":
      // 相手の駒でなければ選択できない
      if (boardData[row][col] !== opponentPlayer) {
        gameMessageText.textContent = card.messages.select;
        return;
      }
      break;

    case "opponent_pieces_2":
      // 相手の駒でなければ選択できない
      if (boardData[row][col] !== opponentPlayer) {
        gameMessageText.textContent = card.messages.select;
        return;
      }

      //some()を使って、すでに選択された駒があるかどうかを確認
      const alreadySelected = selectedTargets.some((target) => {
        return target.row === row && target.col === col;
      });

      if (alreadySelected) {
        gameMessageText.textContent = "その駒はすでに選択されています！";
        return;
      }

      selectedTargets.push({ row, col });

      if (selectedTargets.length === 2) {
        executeCardEffect(card, selectedCard, selectedTargets);
        return;
      }

      console.log(selectedTargets.length);

      if (selectedTargets.length === 1) {
        //1枚だったらそれだけで返す
        const result = countPieces();

        const opponentCount =
          currentPlayer === BLACK ? result.whiteCount : result.blackCount;

        if (opponentCount === 1) {
          executeCardEffect(card, selectedCard, selectedTargets);
          return;
        }
        gameMessageText.textContent = "1枚目を選択しました！";
      }

      return;

    case "piece_then_destination":
      //1回目:移動元の駒を選択

      if (selectedTargets.length === 0) {
        if (boardData[row][col] === EMPTY) {
          gameMessageText.textContent = "移動する駒を選んでください！";
          return;
        }

        selectedTargets.push({ row, col });
        gameMessageText.textContent = "移動先の空きマスを選んでください！";
        return;
      }

      //2回目:移動先の駒の選択
      if (selectedTargets.length === 1) {
        if (boardData[row][col] !== EMPTY) {
          gameMessageText.textContent = "空いているマスを選んでください！";
          return;
        }

        selectedTargets.push({ row, col });
        executeCardEffect(card, selectedCard, selectedTargets);
        return;
      }
      return;

    default:
      gameMessageText.textContent = "このカードの選択対象は未実装です！";
      return;
  }

  //効果を実行
  executeCardEffect(card, selectedCard, [{ row, col }]);
}

// 手札のカードを対象として選択する
function selectHandTarget(index) {
  const card = playerHands[currentPlayer][selectedCard];

  if (!card) return;

  switch (card.targetType) {
    case "hand_card":
      // 使用中のカード自身は選べない
      if (index === selectedCard) {
        gameMessageText.textContent = "使用中のカードはコピーできません！";
        return;
      }

      // コピー対象のカードを取得
      const targetCard = playerHands[currentPlayer][index];

      if (!targetCard) return;

      // 対象カードを効果実行関数へ渡す
      executeCardEffect(card, selectedCard, [targetCard]);
      return;

    default:
      gameMessageText.textContent = "この手札選択効果は未実装です！";
      return;
  }
}

//対象選択中のキャンセル
function cancelCardSelection() {
  isSelectingTarget = false;
  isSelectingHandTarget = false;
  selectedCard = null;
  selectedTargets = [];
  updateCardSelection();
}

//カード消費executeCardEffectsから呼ばれてます
function consumeCard(index) {
  const hand = playerHands[currentPlayer];

  // 使用したカードを1枚削除
  hand.splice(index, 1);

  // カード使用済み
  hasUsedCard = true;

  // 選択解除
  selectedCard = null;

  renderCards();
}
