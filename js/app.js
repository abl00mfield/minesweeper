/*-------------------------------- Constants --------------------------------*/
const NUM_COLUMNS = 10;
const NUM_ROWS = 10;
const NUM_MINES = 10;
const mine = "💣";
const flag = "🚩";
// const board = Array.from({ length: NUM_ROWS }, () =>
//   Array.from({ length: NUM_COLUMNS }, () => ({
//     isRevealed: false,
//     hasMine: false,
//     isFlagged: false,
//     adjacentMines: 0,
//   }))
// );

/*-------------------------------- Variables --------------------------------*/
let board;

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector(".board");

/*----------------------------- Event Listeners -----------------------------*/

boardElement.addEventListener("click", handleLeftClick);
document.getElementById("reset").addEventListener("click", handleReset);

/*-------------------------------- Functions --------------------------------*/

//dynamically create the board in HTML and the board state array
function createBoard() {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLUMNS; j++) {
      let cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.setAttribute("id", `${i}${j}`);
      boardElement.appendChild(cellElement);
    }
  }
  board = Array.from({ length: NUM_ROWS }, () =>
    Array.from({ length: NUM_COLUMNS }, () => ({
      isRevealed: false,
      hasMine: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
}

function handleLeftClick(event) {
  const cell = event.target;
  const row = cell.id[0];
  const col = cell.id[1];
  board[row][col].isRevealed = true;
  cell.classList.add("revealed");
  cell.textContent = "c";
}

function handleReset() {
  console.log("reset");
  init();
}

function init() {
  //set up the data for the board
  board.forEach((row) => {
    row.forEach((cell) => {
      cell.isRevealed = false;
      cell.hasMine = false;
      cell.isFlagged = false;
      cell.adjacentMines = 0;
    });
  });

  //set each cell to it's initial state
  const cellElements = document.querySelectorAll(".cell");
  cellElements.forEach((cell) => {
    cell.className = "cell";
    cell.textContent = "";
  });
}

createBoard();
