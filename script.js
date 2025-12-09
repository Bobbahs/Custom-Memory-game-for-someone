const gameBoard = document.getElementById("gameBoard");
const resetButton = document.getElementById("reset");

const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalButtons = document.getElementById("modalButtons");

let currentPlayer = 1;
let points = [0, 0];

const symbols = ["🟦","🟥","🍇","🍉","🍒","🍓","🥝","🍍"];
let cards = [];
let flippedCards = [];
let lockBoard = false;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  p1.classList.toggle("active", currentPlayer === 1);
  p2.classList.toggle("active", currentPlayer === 2);
}

function createBoard() {
  gameBoard.innerHTML = "";
  flippedCards = [];
  lockBoard = false;

  points = [0, 0];
  score1.textContent = 0;
  score2.textContent = 0;

  currentPlayer = 1;
  p1.classList.add("active");
  p2.classList.remove("active");

  const mix = shuffle([...symbols, ...symbols]);
  cards = [];

  mix.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");
    front.textContent = symbol;

    const back = document.createElement("div");
    back.classList.add("card-back");
    back.textContent = "Memory Game";

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.dataset.symbol = symbol;
    card.addEventListener("click", flipCard);

    gameBoard.appendChild(card);
    cards.push(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [c1, c2] = flippedCards;

  if (c1.dataset.symbol === c2.dataset.symbol) {
    // Player earns point
    points[currentPlayer - 1]++;
    score1.textContent = points[0];
    score2.textContent = points[1];

    // mark winner color on cards
    c1.classList.add(currentPlayer === 1 ? "p1-won" : "p2-won");
    c2.classList.add(currentPlayer === 1 ? "p1-won" : "p2-won");

    flippedCards = [];

    // Check win
    const totalPairs = symbols.length;
    if (points[0] + points[1] === totalPairs) {
      setTimeout(showWinner, 600);
    }

  } else {
    lockBoard = true;
    setTimeout(() => {
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;
      switchTurn();
    }, 900);
  }
}

function showWinner() {
  let message = 
    `Player 1: ${points[0]}<br>Player 2: ${points[1]}<br><br>`;

  if (points[0] > points[1]) message += "🎉 Player 1 Wins!";
  else if (points[1] > points[0]) message += "🔥 Player 2 Wins!";
  else message += "🤝 It's a tie!";

  showModal("Game Over", message, [
    {
      text: "Play Again",
      class: "confirm",
      action: () => createBoard()
    }
  ]);
}

resetButton.addEventListener("click", () => {
  showModal("Restart Game?", "Are you sure?", [
    { text: "Yes", class: "confirm", action: () => createBoard() },
    { text: "Cancel", class: "cancel", action: () => {} }
  ]);
});

// modal helpers
function showModal(title, msg, buttons) {
  modalTitle.innerHTML = title;
  modalMessage.innerHTML = msg;
  modalButtons.innerHTML = "";

  buttons.forEach(btn => {
    const el = document.createElement("button");
    el.textContent = btn.text;
    el.className = btn.class;
    el.onclick = () => {
      btn.action();
      hideModal();
    };
    modalButtons.appendChild(el);
  });

  modal.classList.add("show");
}

function hideModal() {
  modal.classList.remove("show");
}

createBoard();
