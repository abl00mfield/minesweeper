/*-------------------------------- Constants --------------------------------*/
const NUM_COLUMNS = 10;
const NUM_ROWS = 10;
const NUM_MINES = 10;
const mine = "💣";
const pinkFlag = "../assets/images/pink.png";
const audioWin = new Audio("../assets/audio/win.mp3");
const audioLose = new Audio("../assets/audio/explosion.mp3");
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
let minesLeftToFind = NUM_MINES;
let gameState = "active";
let gameTimer;
let seconds = 0;
let isRunning = false;
let easyMode = false;

/*------------------------ Cached Element References ------------------------*/
const boardElement = document.querySelector(".board");
const counterElemement = document.getElementById("counter");
const messageElement = document.getElementById("message");
const timerElement = document.getElementById("timer");

/*----------------------------- Event Listeners -----------------------------*/

boardElement.addEventListener("click", handleLeftClick);
boardElement.addEventListener("contextmenu", handleRightClick);
document.getElementById("reset").addEventListener("click", handleReset);

/*-------------------------------- Functions --------------------------------*/

//This function places all the mines on the board and excludes the first cell that is clicked on to make game play easier for the user
//There is an easy mode that also clears the area around the first click to make game play easier

function placeMines() {
  let mineRow = null;
  let mineCol = null;
  for (let i = 0; i < NUM_MINES; i++) {
    let minePos = "";
    do {
      mineRow = Math.floor(Math.random() * 10); //generate an random row and column
      mineCol = Math.floor(Math.random() * 10);
      minePos = mineRow.toString() + "--" + mineCol.toString();
    } while (mineIndexes.includes(minePos) || mineFree.includes(minePos)); //check if there is already a mine there or if this is where they first clicked
    mineIndexes.push(minePos); //this string holds all the mine positions
    board[mineRow][mineCol].hasMine = true; //update the state of the board
  }
  calculateAdjacentMines(); //calculate the adjacent mines
}

/* this function goes over the entire board and updates the board array with
the adjacent mine counts */
function calculateAdjacentMines() {
  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLUMNS; c++) {
      const cellElement = document.getElementById(`${r}--${c}`); //grad the cellElement
      if (!board[r][c].hasMine) {
        let mineCount = 0;
        for (let [dirR, dirC] of MOVEMENTS) {
          //count the mines all around the cell
          let nRow = r + dirR;
          let nCol = c + dirC;
          if (nRow >= 0 && nRow < NUM_ROWS && nCol >= 0 && nCol < NUM_COLUMNS) {
            if (board[nRow][nCol].hasMine) mineCount++;
          }
        }
        board[r][c].adjacentMines = mineCount;
        switch (
          board[r][c].adjacentMines //different colors for different number of mines
        ) {
          case 1:
            cellElement.classList.add("blue");
            break;
          case 2:
            cellElement.classList.add("green");
            break;
          case 3:
            cellElement.classList.add("orange");
            break;
          case 4:
            cellElement.classList.add("purple");
            break;
        }
      }
    }
  }
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
  counterElemement.textContent = minesLeftToFind; //initialize the counter
  updateTimer(); //initialize the timer
}

function handleRightClick(event) {
  event.preventDefault();
  if (!firstClick) {
    startTimer();
  }
  if (gameState === "active") {
    const cell = event.target.closest(".cell"); //grab the cell clicked on, and not the image if there is one
    let imgElement = cell.querySelector("img"); //if the cell has an image (flag) grab it so we can delete
    let [row, col] = cell.id.split("--");
    row = parseInt(row);
    col = parseInt(col);
    if (board[row][col].isRevealed) return; //don't do anything if they click on a square already revealed

    board[row][col].isFlagged = !board[row][col].isFlagged; //toggle the flag
    cell.classList.toggle("flagged"); //toggle the class of flagged on the cell

    if (board[row][col].isFlagged) {
      let newImg = document.createElement("img"); //add the flag image to the HTML
      newImg.setAttribute("src", pinkFlag);
      newImg.setAttribute("alt", "Pink Flag");
      cell.appendChild(newImg);
      minesLeftToFind -= 1;
    } else {
      if (imgElement) {
        imgElement.remove();
      }
      minesLeftToFind += 1;
    }
    counterElemement.textContent = minesLeftToFind;
  }
}

function handleLeftClick(event) {
  if (gameState === "active") {
    const cell = event.target.closest(".cell");
    let [row, col] = cell.id.split("--");
    row = parseInt(row);
    col = parseInt(col);
    if (!firstClick) {
      startTimer();
      clearMineArea(row, col);
      firstClick = true;
      placeMines();
    }
    if (board[row][col].isFlagged) return;
    // board[row][col].isRevealed = true;
    checkForMine(row, col);
    revealCells(row, col);
    renderBoard();
    checkForWin();
    // console.log("revealed: ", document.querySelectorAll(".revealed").length);
    // console.log("amount needed to win: ", NUM_ROWS * NUM_COLUMNS - NUM_MINES);

    // if (board[row][col].adjacentMines) {
    //   cell.textContent = board[row][col].adjacentMines;
    // }
    // cell.classList.add("revealed");
  } else {
  }
}

function checkForWin() {
  if (
    document.querySelectorAll(".revealed").length === //the number of revealed cells is equal to
    NUM_ROWS * NUM_COLUMNS - NUM_MINES //the board size - the number of mines
  ) {
    stopTimer();
    messageElement.textContent = "YOU WIN!!";
    gameState = "won";
    audioWin.play();
  }
}

function checkForMine(row, col) {
  const cellStr = `${row}--${col}`;
  if (mineIndexes.includes(cellStr)) {
    stopTimer();
    //mark all mines on board if they clicked on a mine
    gameState = "lost";

    messageElement.textContent = "YOU LOSE!!";
    audioLose.play();
    mineIndexes.forEach((mineStr) => {
      const cellElement = document.getElementById(mineStr);
      cellElement.classList.add("mine");
      cellElement.textContent = mine;
    });
  }
}
/* a recursive function that reveals all the cells starting from the left
click and reveals all the surrounding cells until it hits the edge
of the board, a mine, a numbered square, or a flag */

function revealCells(row, col) {
  //base cases
  if (row < 0 || row > NUM_ROWS - 1 || col < 0 || col > NUM_COLUMNS - 1) {
    return; //if we are off the board
  }
  myCell = board[row][col];
  // console.log("inside revealCells, currentCell: ", myCell);
  if (myCell.isRevealed || myCell.isFlagged || myCell.hasMine) {
    return; //if we've hit a mine, a flagged cell, or a cell that is already revealed
  }
  myCell.isRevealed = true;
  if (myCell.adjacentMines) {
    return;
  }

  //now call the function on all of the surrounding cells
  for (let [checkRow, checkCol] of MOVEMENTS) {
    let newRow = row + checkRow;
    let newCol = col + checkCol;
    revealCells(newRow, newCol);
  }
}

function renderBoard() {
  //update gameboard to reflect game state
  counterElemement.textContent = minesLeftToFind;
  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLUMNS; c++) {
      const cellElement = document.getElementById(`${r}--${c}`);
      const cell = board[r][c];
      if (cell.isRevealed) {
        cellElement.classList.add("revealed");
        if (cell.adjacentMines) {
          cellElement.textContent = cell.adjacentMines;
        }
      }
    }
  }
}

/*this function creates an array of coordinates where a mine should not be placed
this ensures that the first place the user clicks and all the squares around it 
will be free of mines */

function clearMineArea(row, col) {
  mineFree.push(`${row}--${col}`); //add the current cell to the list of space to clear
  if (easyMode) {
    for (let [r, c] of MOVEMENTS) {
      let nr = row + r;
      let nc = col + c;
      if (nr >= 0 && nr < NUM_ROWS && nc >= 0 && nc < NUM_COLUMNS) {
        //if this area around the cell is on the board
        mineFree.push(`${nr}--${nc}`);
      }
    }
  }
}

function handleReset() {
  init();
  renderBoard();
}

function updateTimer() {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  timerElement.textContent =
    minutes.toString().padStart(2, "0") +
    ":" +
    secs.toString().padStart(2, "0");
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    gameTimer = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(gameTimer);
  isRunning = false;
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

  //reset all game state variables
  mineIndexes = []; //reset array of mine indexes
  firstClick = false;
  mineFree = [];
  minesLeftToFind = NUM_MINES;
  gameState = "active";
  messageElement.textContent = "";
  seconds = 0;
  isRunning = false;
  updateTimer();
}

createBoard();
