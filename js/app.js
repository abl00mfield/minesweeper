/*-------------------------------- Constants --------------------------------*/
const NUM_COLUMNS = 10;
const NUM_ROWS = 10;
const NUM_MINES = 10;
const mine = "💣";
const flag = "🚩";
const MOVEMENTS = [
  [-1, -1], //top left
  [-1, 0], //top middle
  [-1, 1], //top right
  [0, -1], //left
  [0, 1], //right
  [1, -1], //bottom left
  [1, 0], //bottom middle
  [1, 1], //bottom right
];

/*-------------------------------- Variables --------------------------------*/
let board;
let mineIndexes = [];
let firstClick = false; //ensuring the first click is not a mine
let mineFree = []; //this will store the location of the first click and the surrounding cells, so we don't put a mine there

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector(".board");

/*----------------------------- Event Listeners -----------------------------*/

boardElement.addEventListener("click", handleLeftClick);
boardElement.addEventListener("contextmenu", handleRightClick);
document.getElementById("reset").addEventListener("click", handleReset);

/*-------------------------------- Functions --------------------------------*/

function placeMines() {
  let mineRow = null;
  let mineCol = null;
  for (let i = 0; i < NUM_MINES; i++) {
    let minePos = "";
    do {
      mineRow = Math.floor(Math.random() * 10);
      mineCol = Math.floor(Math.random() * 10);
      minePos = mineRow.toString() + "--" + mineCol.toString();
    } while (mineIndexes.includes(minePos) || mineFree.includes(minePos)); //check if there is already a mine there or if this is where they first clicked
    mineIndexes.push(minePos);
    board[mineRow][mineCol].hasMine = true;
    // console.log(mineIndexes);
    // console.log("mine Free: ", mineFree);
    cell = document.getElementById(minePos).classList.add("mine"); //add the mine to the cell in HTML
  }

  calculateAdjacentMines();
}

function calculateAdjacentMines() {
  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLUMNS; c++) {
      if (!board[r][c].hasMine) {
        let mineCount = 0;
        for (let [dirR, dirC] of MOVEMENTS) {
          let nRow = r + dirR;
          let nCol = c + dirC;
          if (nRow >= 0 && nRow < NUM_ROWS && nCol >= 0 && nCol < NUM_COLUMNS) {
            if (board[nRow][nCol].hasMine) mineCount++;
          }
        }
        board[r][c].adjacentMines = mineCount;
        // console.log(`row: ${r} col: ${c} minesaround: ${mineCount}`);
      }
    }
  }
  //   console.log(board);
}

//dynamically create the board in HTML and the board state array
function createBoard() {
  //add all the cells in the HTML
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLUMNS; j++) {
      let cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.setAttribute("id", `${i}--${j}`);
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

function handleRightClick(event) {
  event.preventDefault();
  const cell = event.target;
  console.log("right click");
  let [row, col] = cell.id.split("--");
  row = parseInt(row);
  col = parseInt(col);

  if (board[row][col].isRevealed) return; //don't do anything if they click on a square already revealed
  board[row][col].isFlagged = !board[row][col].isFlagged; //toggle the flag
  cell.classList.toggle("flagged"); //toggle the class of flagged on the cell
  if (board[row][col].isFlagged) {
    cell.textContent = flag;
  } else {
    cell.textContent = "";
  }
}

function handleLeftClick(event) {
  const cell = event.target;
  let [row, col] = cell.id.split("--");
  row = parseInt(row);
  col = parseInt(col);
  //   console.log(`row: ${row} col: ${col}`);
  if (!firstClick) {
    clearMineArea(row, col);
    firstClick = true;
    placeMines();
  }
  board[row][col].isRevealed = true;
  if (board[row][col].adjacentMines) {
    cell.textContent = board[row][col].adjacentMines;
  }
  cell.classList.add("revealed");
}

/*this function creates an array of coordinates where a mine should not be placed
this ensures that the first place the user clicks and all the squares around it 
will be free of mines */

function clearMineArea(row, col) {
  mineFree.push(`${row}--${col}`); //add the current cell to the list of space to clear
  for (let [r, c] of MOVEMENTS) {
    let nr = row + r;
    let nc = col + c;
    if (nr >= 0 && nr < NUM_ROWS && nc >= 0 && nc < NUM_COLUMNS) {
      //if this area around the cell is on the board
      mineFree.push(`${nr}--${nc}`);
    }
  }
  //   console.log(mineFree);
}

function handleReset() {
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
