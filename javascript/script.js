const gameBoard = document.querySelector(".game-board");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const difficultySelect = document.getElementById("difficulty");

let cards = [];
let flippedCards = [];
let score = 0;
let timer;
let seconds = 0;
let gameStarted = false;

const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createCards(size) {
  cards = [];
  const halfSize = (size * size) / 2;

  // Select emojis based on the grid size
  const selectedEmojis = emojis.slice(0, halfSize);

  // Create pairs of cards
  cards = [...selectedEmojis, ...selectedEmojis];

  shuffleArray(cards);
}

function createGameBoard(size) {
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 100px)`;

  createCards(size);

  cards.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.index = index;

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = card;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = "?";

    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);

    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

function flipCard() {
  if (!gameStarted) return;

  if (
    flippedCards.length < 2 &&
    !this.classList.contains("matched") &&
    !this.classList.contains("flipped")
  ) {
    this.classList.add("flipped");
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const index1 = card1.dataset.index;
  const index2 = card2.dataset.index;

  if (cards[index1] === cards[index2]) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    score++;
    scoreElement.textContent = score;

    if (score === cards.length / 2) {
      endGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }, 500);
  }

  flippedCards = [];
}

function startGame() {
  const difficulty = difficultySelect.value;
  let size;

  switch (difficulty) {
    case "easy":
      size = 4;
      break;
    case "medium":
      size = 6;
      break;
  }

  createGameBoard(size);
  score = 0;
  seconds = 0;
  scoreElement.textContent = score;
  timerElement.textContent = "00:00";
  gameStarted = true;
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  gameStarted = false;
  alert(
    `Congratulations! You completed the game in ${timerElement.textContent} with ${score} matches.`
  );
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

// Initialize the game board
createGameBoard(4);
