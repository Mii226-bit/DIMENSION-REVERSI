//==== 定数 ====

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
let BOARD_SIZE = 8;
const MIN_BOARD_SIZE = 4;
const MAX_BOARD_SIZE = 10;
const MAX_HAND_SIZE = 7;
const INITIAL_HAND_SIZE = 3;

//==== ゲームデータ ====

let playerHands = {
  [BLACK]: [],
  [WHITE]: [],
};

//BOARD_SIZEの大きさだけ配列作成
let boardData = Array.from({ length: BOARD_SIZE }, () =>
  Array(BOARD_SIZE).fill(EMPTY),
);

const DIRECTIONS = [
  [0, -1], //左
  [-1, -1], //左上
  [-1, 0], //上
  [-1, 1], //右上
  [0, 1], //右
  [1, 1], //右下
  [1, 0], //下
  [1, -1], //左下
];

//==== 状態を表す変数 ====

let gameOver = false;
let currentPlayer = BLACK;
let selectedCard = null;
let hasUsedCard = false;
let hasPlacedPiece = false;
let isSelectingTarget = false;
let isSelectingHandTarget = false;
let selectedTargets = [];

//==== HTML要素の取得 ====

//ゲーム情報
const blackCountText = document.getElementById("black-count");
const turnInfoText = document.getElementById("turn-info");
const whiteCountText = document.getElementById("white-count");
const gameMessageText = document.getElementById("game-message");
// 盤面の要素を取得
const board = document.getElementById("board");
const cardHand = document.getElementById("card-hand");
const resetButton = document.getElementById("resetButton");
const endTurnButton = document.getElementById("endTurnButton");

//==== 盤面生成 ====
createBoardCells();

//リセットボタンのクリックイベント
resetButton.addEventListener("click", () => {
  resetGame();
});

//ターンエンドボタン
endTurnButton.addEventListener("click", () => {
  requestEndTurn();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    requestEndTurn();
  }
});

//カード外クリック処理
document.addEventListener("click", (event) => {
  if (event.target.closest(".card")) {
    return;
  }
  if (event.target.closest("#board")) {
    return;
  }

  if (selectedCard !== null || isSelectingTarget || isSelectingHandTarget) {
    cancelCardSelection();
    gameMessageText.textContent = "";
  }
});

//==== ゲーム進行に関する関数 ====

//クリック処理
function cellClick(row, col) {
  if (gameOver) {
    return;
  }

  //カード効果で選択中
  if (isSelectingTarget) {
    selectTarget(row, col);
    return;
  }

  if (hasPlacedPiece) {
    gameMessageText.textContent = "このターンもう駒を置いています！";
    return;
  }

  gameMessageText.textContent = "";

  if (!canFlip(row, col)) {
    gameMessageText.textContent =
      "そこには置けないにょ～ん（笑）\n画面ちゃんと見てね";
    console.log(`置けません(${row},${col})`);
    return;
  }

  boardData[row][col] = currentPlayer;

  //置いた駒に対応してひっくり返す
  flipPieces(row, col);

  //駒を置いたことを記録
  hasPlacedPiece = true;

  if (hasUsedCard) {
    //カード使用済みならターン終了
    finishTurn();
  } else {
    //カード未使用ならターン継続
    renderBoard();
  }
}

//ターンエンド処理
function requestEndTurn() {
  if (gameOver) return;

  const canPlace = !hasPlacedPiece && hasValidMove();
  const canUseCard = !hasUsedCard && playerHands[currentPlayer].length > 0;

  let message = "";

  if (canPlace) {
    message += "まだ駒を置いていません。\n";
  }

  if (canUseCard) {
    message += "まだカードを使用していません。\n";
  }

  if (message !== "") {
    const confirmed = confirm(`${message}ターンを終了しますか？`);

    if (!confirmed) {
      return;
    }
  }

  finishTurn();
}

//敗北判定、プレイヤー交代
function finishTurn() {
  const result = countPieces();
  const myCount =
    currentPlayer === BLACK ? result.blackCount : result.whiteCount;

  //自分の駒が0なら敗北
  if (myCount === 0) {
    endGame("noPieces");
    return;
  }

  const totalPieces = result.blackCount + result.whiteCount;
  const totalCells = BOARD_SIZE * BOARD_SIZE;

  if (totalPieces === totalCells) {
    endGame();
    return;
  }

  cancelCardSelection();

  switchPlayer();
  startTurn();
  renderBoard();
}

//プレイヤーを切り替える
function switchPlayer() {
  // 駒が置けたらプレイヤーを切り替える
  if (currentPlayer === BLACK) {
    currentPlayer = WHITE;
  } else {
    currentPlayer = BLACK;
  }
  // alert(`${currentPlayer === BLACK ? "黒" : "白"}のターンですわよ`);
  console.log(`${currentPlayer === BLACK ? "黒" : "白"}のターン！`);
}

//ゲームリセット
function resetGame() {
  gameMessageText.textContent = "";
  gameMessageText.classList.remove("result-message");

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      boardData[row][col] = EMPTY;
    }
  }
  boardData[BOARD_SIZE / 2 - 1][BOARD_SIZE / 2 - 1] = WHITE;
  boardData[BOARD_SIZE / 2 - 1][BOARD_SIZE / 2] = BLACK;
  boardData[BOARD_SIZE / 2][BOARD_SIZE / 2 - 1] = BLACK;
  boardData[BOARD_SIZE / 2][BOARD_SIZE / 2] = WHITE;

  gameOver = false;
  currentPlayer = BLACK;
  isSelectingTarget = false;
  isSelectingHandTarget = false;
  selectedTargets = [];

  initializeHand();
  startTurn();
  renderBoard();
}

//盤面の大きさ変える関数
function resizeBoard(newSize) {
  if (newSize < MIN_BOARD_SIZE || newSize > MAX_BOARD_SIZE) {
    return false;
  }

  const oldSize = BOARD_SIZE;

  //新しい二次元配列作成
  const newBoard = Array.from({ length: newSize }, () =>
    Array(newSize).fill(EMPTY),
  );

  const offset = (newSize - oldSize) / 2;

  for (let row = 0; row < oldSize; row++) {
    for (let col = 0; col < oldSize; col++) {
      const newRow = row + offset;
      const newCol = col + offset;

      if (newRow >= 0 && newRow < newSize && newCol >= 0 && newCol < newSize) {
        newBoard[newRow][newCol] = boardData[row][col];
      }
    }
  }

  //データ更新
  boardData = newBoard;
  BOARD_SIZE = newSize;

  createBoardCells();
  renderBoard();

  return true;
}

//ゲームの勝敗判定
function endGame(reason = "normal") {
  gameOver = true;
  const result = countPieces();

  renderBoard();

  gameMessageText.classList.add("result-message");

  turnInfoText.textContent = "ゲーム終了！";

  //駒が0枚でターン終了された
  if (reason === "noPieces") {
    const winner = currentPlayer === BLACK ? "白" : "黒";

    gameMessageText.textContent = `${winner} WIN!\n相手の駒が0枚になりました！`;

    return;
  }

  if (result.blackCount === result.whiteCount) {
    gameMessageText.textContent = "引き分け！";
    console.log("引き分け");
  } else if (result.blackCount > result.whiteCount) {
    gameMessageText.textContent = "黒　WIN!";
    console.log("黒の勝ち！");
  } else {
    gameMessageText.textContent = "白　WIN!";
    console.log("白の勝ち！");
  }
  console.log(
    "\n黒：" + result.blackCount + "枚\n白：" + result.whiteCount + "枚",
  );
}

//==== ルール判定・計算系 ====

//ひっくり返せるかどうか:返り値boolean
function canFlip(row, col) {
  if (boardData[row][col] !== EMPTY) {
    return false;
  }
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  for (let i = 0; i < DIRECTIONS.length; i++) {
    const rowDirection = DIRECTIONS[i][0];
    const colDirection = DIRECTIONS[i][1];

    let checkRow = row + rowDirection;
    let checkCol = col + colDirection;

    if (
      checkRow < 0 ||
      checkRow >= BOARD_SIZE ||
      checkCol < 0 ||
      checkCol >= BOARD_SIZE ||
      boardData[checkRow][checkCol] !== opponentPlayer
    ) {
      continue;
    }

    //隣は相手の駒だったのでその先を調べる
    checkRow += rowDirection;
    checkCol += colDirection;

    while (
      checkRow >= 0 &&
      checkRow < BOARD_SIZE &&
      checkCol >= 0 &&
      checkCol < BOARD_SIZE
    ) {
      if (boardData[checkRow][checkCol] === EMPTY) {
        break;
      }
      if (boardData[checkRow][checkCol] === currentPlayer) {
        return true;
      }
      checkRow += rowDirection;
      checkCol += colDirection;
    }
  }
  return false;
}

//実際にデータを書き換える
function flipPieces(row, col) {
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  for (let i = 0; i < DIRECTIONS.length; i++) {
    const rowDirection = DIRECTIONS[i][0];
    const colDirection = DIRECTIONS[i][1];

    const flipList = [];

    //ひっくりかえせるかどうかの変数
    let canFlipDirection = false;
    let checkRow = row + rowDirection;
    let checkCol = col + colDirection;
    if (
      checkRow < 0 ||
      checkRow >= BOARD_SIZE ||
      checkCol < 0 ||
      checkCol >= BOARD_SIZE ||
      boardData[checkRow][checkCol] !== opponentPlayer
    ) {
      continue;
    }

    //隣は相手の駒だったのでその先を調べる
    flipList.push([checkRow, checkCol]);
    checkRow += rowDirection;
    checkCol += colDirection;

    while (
      checkRow >= 0 &&
      checkRow < BOARD_SIZE &&
      checkCol >= 0 &&
      checkCol < BOARD_SIZE
    ) {
      if (boardData[checkRow][checkCol] === EMPTY) {
        break;
      }
      if (boardData[checkRow][checkCol] === currentPlayer) {
        canFlipDirection = true;
        break;
      }
      flipList.push([checkRow, checkCol]);
      checkRow += rowDirection;
      checkCol += colDirection;
    }

    //trueだったらデータとして書き換える
    if (canFlipDirection) {
      for (let j = 0; j < flipList.length; j++) {
        boardData[flipList[j][0]][flipList[j][1]] = currentPlayer;
      }
    }
  }
}

//おけるマスがあるかどうか
function hasValidMove() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (canFlip(row, col)) {
        return true;
      }
    }
  }
  return false;
}

//白と黒の駒の数を数える
function countPieces() {
  let blackCount = 0;
  let whiteCount = 0;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (boardData[row][col] === BLACK) {
        blackCount++;
      } else if (boardData[row][col] === WHITE) {
        whiteCount++;
      }
    }
  }
  return {
    blackCount,
    whiteCount,
  };
}

//==== 画面表示系 ====

//画面を描画
function createBoardCells() {
  board.innerHTML = "";

  board.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener("click", () => {
        cellClick(row, col);
      });
      board.appendChild(cell);
    }
  }
}

function renderBoard() {
  //cells:マス目の要素を取得してvalueに格納
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    const value = boardData[row][col];

    //前の色を消す
    cell.innerHTML = "";

    if (value === EMPTY) {
      return;
    }

    //piece=駒 を作る
    const piece = document.createElement("div");
    piece.classList.add("piece");

    if (value === BLACK) {
      piece.classList.add("black");
    }
    if (value === WHITE) {
      piece.classList.add("white");
    }
    cell.appendChild(piece);
  });
  showValidMoves();
  updateGameInfo();
}

//おけるマスを表示する
function showValidMoves() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`,
      );
      cell.classList.remove("valid-move");
      if (!hasPlacedPiece && canFlip(row, col)) {
        cell.classList.add("valid-move");
      }
    }
  }
}

//ゲーム情報の更新
function updateGameInfo() {
  const result = countPieces();

  blackCountText.textContent = `黒：${result.blackCount}枚`;
  whiteCountText.textContent = `白：${result.whiteCount}枚`;

  turnInfoText.textContent = `今のターン：${currentPlayer === BLACK ? "黒" : "白"}`;

  console.log(
    "黒の枚数：" + result.blackCount + "\n白の枚数：" + result.whiteCount,
  );
}

//初期状態の盤面を描画
resetGame();
