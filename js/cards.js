//==== カード関連の処理 ====

//ターン開始時ドロー、カード描画までしてくれてる
function startTurn() {
  hasUsedCard = false;
  selectedCard = null;

  drawCard();
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

function selectCard(index) {
  if (selectedCard === index) {
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

function selectTarget(row, col) {
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  // 相手の駒でなければ選択できない
  if (boardData[row][col] !== opponentPlayer) {
    gameMessageText.textContent = "相手の駒を選択してください！";
    return;
  }

  // 相手の駒を自分の色に変更
  boardData[row][col] = currentPlayer;

  // カードを消費
  consumeCard(selectedCard);

  // 対象選択モードを終了
  isSelectingTarget = false;

  // 盤面を更新
  renderBoard();

  gameMessageText.textContent = "次元の浸食を発動しました！";
}

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
function updateCardSelection() {
  const cards = cardHand.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.classList.toggle("selected", selectedCard === index);
  });
}

//カード使用
function useCard(index) {
  if (gameOver) {
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
    //なにこれ？
  }

  const successMessage = card.messages.success;

  consumeCard(index);

  gameMessageText.textContent = successMessage;

  //   switch (card.id) {
  //     case "dimension_invasion":
  //       isSelectingTarget = true;

  //       gameMessageText.textContent = "相手の駒を選択してください！";
  //       break;

  //     default:
  //       gameMessageText.textContent = `${card.name}を使用しました!`;
  //       console.log(`${card.name}を使用しました`);
  //       break;
  //   }
}

//カードをハンドに追加（今は固定のカードのみ）
function drawCard(count = 1, player = currentPlayer) {
  //あらかじめ持ってくる
  const hand = playerHands[player];

  for (let i = 0; i < count; i++) {
    if (hand.length >= MAX_HAND_SIZE) {
      gameMessageText.textContent = `${player === BLACK ? "黒" : "白"}は手札がいっぱいでした！`;
      console.log(`${player === BLACK ? "黒" : "白"}は手札がいっぱいでした！`);
      break;
    }

    const randomIndex = Math.floor(Math.random() * CARD_LIST.length);
    hand.push(CARD_LIST[randomIndex]);

    gameMessageText.textContent = `${player === BLACK ? "黒" : "白"}は${CARD_LIST[randomIndex].name}を引きました!`;
    console.log(
      `${player === BLACK ? "黒" : "白"}は${CARD_LIST[randomIndex].name}を引きました!`,
    );
  }
  if (player === currentPlayer) {
    renderCards();
  }
}

//手札の初期化
function initializeHand(count = INITIAL_HAND_SIZE) {
  playerHands = {
    [BLACK]: [],
    [WHITE]: [],
  };
  drawCard(count, WHITE);
  drawCard(count, BLACK);
}
