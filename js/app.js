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
const cellElements = document.querySelectorAll(".cell");
/*----------------------------- Event Listeners -----------------------------*/

boardElement.addEventListener("click", handleLeftClick);

/*-------------------------------- Functions --------------------------------*/

//dynamically create the board
function createHTMLBoard() {
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLUMNS; j++) {
      let cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.setAttribute("id", `${i}${j}`);
      boardElement.appendChild(cellElement);
    }
  }
}

function handleLeftClick(event) {
  const cell = event.target;
  const row = cell.id[0];
  const col = cell.id[1];
  board[row][col].isRevealed = true;
  cell.classList.add("revealed");
  cell.textContent = "c";
}

function init() {
  //set up the data for the board
  board = Array.from({ length: NUM_ROWS }, () =>
    Array.from({ length: NUM_COLUMNS }, () => ({
      isRevealed: false,
      hasMine: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  cellElements.forEach(index, value);
}

createHTMLBoard();
