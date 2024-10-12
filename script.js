// Add smooth scroll for the navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const movesCount = document.getElementById('moves-count');
const timeCount = document.getElementById('time-count');
const winModal = document.getElementById('win-modal');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');
const playAgainButton = document.getElementById('play-again');

const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

const emojis = ['🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'];
let cards = [];
let flippedCards = [];
let moves = 0;
let time = 0;
let gameInterval;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(emoji) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<div class="card-content">${emoji}</div>`;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        playSound(flipSound);

        if (flippedCards.length === 2) {
            moves++;
            movesCount.textContent = moves;
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.innerHTML === card2.innerHTML) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        playSound(matchSound);
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];

    if (document.querySelectorAll('.flipped').length === cards.length) {
        endGame();
    }
}

function playSound(audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.error("Error playing sound:", e));
}

function startGame() {
    gameBoard.innerHTML = '';
    cards = shuffleArray([...emojis, ...emojis]);
    cards.forEach(emoji => gameBoard.appendChild(createCard(emoji)));
    moves = 0;
    time = 0;
    movesCount.textContent = moves;
    updateTime();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        time++;
        updateTime();
    }, 1000);
}

function updateTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeCount.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
    clearInterval(gameInterval);
    playSound(winSound);
    finalMoves.textContent = moves;
    finalTime.textContent = timeCount.textContent;
    winModal.style.display = 'block';
}

function resetGame() {
    clearInterval(gameInterval);
    gameBoard.innerHTML = '';
    moves = 0;
    time = 0;
    movesCount.textContent = moves;
    updateTime();
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
playAgainButton.addEventListener('click', () => {
    winModal.style.display = 'none';
    startGame();
});

startGame();
