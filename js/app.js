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
let mineIndexes = [];
let firstClick = false; //ensuring the first click is not a mine
let mineFree = []; //this will store the location of the first click and the surrounding cells, so we don't put a mine there

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector(".board");

/*----------------------------- Event Listeners -----------------------------*/

boardElement.addEventListener("click", handleLeftClick);
document.getElementById("reset").addEventListener("click", handleReset);

/*-------------------------------- Functions --------------------------------*/

function placeMines() {
  for (let i = 0; i < NUM_MINES; i++) {
    let minePos = "";
    do {
      let mineRow = Math.floor(Math.random() * 10);
      let mineCol = Math.floor(Math.random() * 10);
      minePos = mineRow.toString() + mineCol.toString();
    } while (mineIndexes.includes(minePos) || mineFree.includes(minePos)); //check if there is already a mine there or if this is where they first clicked
    mineIndexes.push(minePos);
    cell = document.getElementById(minePos).classList.add("mine"); //add the mine to the cell in HTML
  }
}

//dynamically create the board in HTML and the board state array
function createBoard() {
  //add all the cells in the HTML
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLUMNS; j++) {
      let cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.setAttribute("id", `${i}${j}`);
      boardElement.appendChild(cellElement);
    }
  }
  //set up the board game state array of objects
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
  console.log(`row: ${row} col: ${col}`);
  if (!firstClick) {
    clearMineArea(row, col);
    firstClick = true;
    placeMines();
  }
  board[row][col].isRevealed = true;
  cell.classList.add("revealed");
}

/*this function creates an array of coordinates where a mine should not be placed
this ensures that the first place the user clicks and all the squares around it 
will be free of mines */

function clearMineArea(row, col) {
  let rowAbove = parseInt(row) - 1;
  let colLeft = parseInt(col) - 1;
  for (let r = rowAbove; r < rowAbove + 3; r++) {
    for (let c = colLeft; c < colLeft + 3; c++) {
      if (r >= 0 && r < NUM_ROWS && c >= 0 && c < NUM_COLUMNS) {
        mineFree.push(`${r}${c}`);
      }
    }
  }
}

function handleReset() {
  console.log("reset");
  init();
}

function init() {
  //initialize back to beginning state
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

  mineIndexes = []; //reset array of mine indexes
  firstClick = false;
  mineFree = [];
  //   placeMines();
}

createBoard();
