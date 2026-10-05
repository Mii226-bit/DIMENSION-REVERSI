const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const BOARD_SIZE = 8;
const boardData = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
boardData[3][3] = WHITE;
boardData[3][4] = BLACK;
boardData[4][3] = BLACK;
boardData[4][4] = WHITE;
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

let currentPlayer = BLACK;
// 盤面の要素を取得
const board = document.getElementById("board");

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
//クリック処理
function cellClick(row, col) {
  console.log(`Clicked cell at row ${row}, col ${col}`);

  if (boardData[row][col] !== EMPTY || !canFlip(row, col)) {
    alert("そこには置けないにょ～ん（笑）\n画面ちゃんと見てね\nぷ\nぷ\nぷ");
    return;
  }

  alert("おけるわよ\nうおお");
  //クリックした場所に駒を置く
  boardData[row][col] = currentPlayer;

  //置いた駒に対応してひっくり返す
  flipPieces(row, col);

  renderBoard();

  switchPlayer();
}

//プレイヤーを切り替える
function switchPlayer() {
  // 駒が置けたらプレイヤーを切り替える
  if (currentPlayer === BLACK) {
    currentPlayer = WHITE;
  } else {
    currentPlayer = BLACK;
  }
  alert(`${currentPlayer === BLACK ? "黒" : "白"}のターンですわよ`);
  console.log(`${currentPlayer === BLACK ? "黒" : "白"}のターン！`);
}

//cells:マス目の要素を取得してvalueに格納
function renderBoard() {
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
}

function canFlip(row, col) {
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
  for (let i = 0; i < DIRECTIONS.length; i++) {
    const rowDIRECTION = DIRECTIONS[i][0];
    const colDirection = DIRECTIONS[i][1];

    let checkRow = row + rowDIRECTION;
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
    checkRow += rowDIRECTION;
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
      checkRow += rowDIRECTION;
      checkCol += colDirection;
    }
  }
  return false;
}

function flipPieces(row, col) {
  const opponentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

  for (let i = 0; i < DIRECTIONS.length; i++) {
    const rowDIRECTION = DIRECTIONS[i][0];
    const colDirection = DIRECTIONS[i][1];

    const flipList = [];

    //ひっくりかえせるかどうかの変数
    let canFlipDirection = false;
    let checkRow = row + rowDIRECTION;
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
    checkRow += rowDIRECTION;
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
      checkRow += rowDIRECTION;
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
//初期状態の盤面を描画
renderBoard();
