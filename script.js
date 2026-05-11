const cells = document.querySelectorAll(".cell");
const symbolButtons = document.querySelectorAll("#controls button");
const currentPlayerText = document.getElementById("current-player");
const messageText = document.getElementById("message");
const resetButton = document.getElementById("reset-btn");

let board = Array(9).fill(null);
let currentPlayer = 1;
let selectedSymbol = null;
let gameOver = false;

function beats(a, b) {
  if (a === "rock" && b === "scissors") return true;
  if (a === "scissors" && b === "paper") return true;
  if (a === "paper" && b === "rock") return true;
  return false;
}

function getAdjacent(index) {
  const adj = [];
  if (index >= 3) adj.push(index - 3);
  if (index < 6) adj.push(index + 3);
  if (index % 3 !== 0) adj.push(index - 1);
  if (index % 3 !== 2) adj.push(index + 1);
  return adj;
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentPlayerText.textContent =
    currentPlayer === 1 ? "Player 1" : "Player 2";
}

function checkWin() {
  let p1 = 0;
  let p2 = 0;

  board.forEach(cell => {
    if (!cell) return;
    if (cell.player === 1) p1++;
    else p2++;
  });

  if (p1 >= 5) {
    messageText.textContent = "Player 1 Wins!";
    gameOver = true;
  }

  if (p2 >= 5) {
    messageText.textContent = "Player 2 Wins!";
    gameOver = true;
  }
}

function resolveCaptures(activeIndex) {
  const activeCell = board[activeIndex];
  const neighbors = getAdjacent(activeIndex);

  neighbors.forEach(i => {
    const target = board[i];
    if (!target) return;
    if (target.player === activeCell.player) return;

    if (beats(activeCell.symbol, target.symbol)) {
      board[i] = {
        player: activeCell.player,
        symbol: activeCell.symbol
      };
    }
  });
}

function render() {
  cells.forEach((cell, i) => {
    cell.textContent = "";
    cell.classList.remove("player1", "player2");

    if (board[i]) {
      cell.textContent = board[i].symbol.toUpperCase();
      cell.classList.add(
        board[i].player === 1 ? "player1" : "player2"
      );
      cell.disabled = true;
    }
  });
}

function placeMove(index) {
  if (gameOver) return;
  if (board[index] !== null) return;
  if (!selectedSymbol) return;

  board[index] = {
    player: currentPlayer,
    symbol: selectedSymbol
  };

  resolveCaptures(index);
  render();
  checkWin();

  if (!gameOver) {
    switchPlayer();
  }
}

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    placeMove(Number(cell.dataset.index));
  });
});

symbolButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedSymbol = button.dataset.symbol;
  });
});

resetButton.addEventListener("click", () => {
  board = Array(9).fill(null);
  currentPlayer = 1;
  selectedSymbol = null;
  gameOver = false;
  messageText.textContent = "";
  currentPlayerText.textContent = "Player 1";

  cells.forEach(cell => {
    cell.disabled = false;
  });

  render();
});

