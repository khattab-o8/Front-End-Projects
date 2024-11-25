'use strict';

// Select elements.
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceImage = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores = [0, 0];
let currentScore = 0;
let activePlayer = 0;
let playing = true;

const switchPlayer = function () {
  // Switch to the next player.
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  currentScore = 0;

  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

const resetTheGame = function () {
  // Global variables.
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  // Total score
  score0El.textContent = 0;
  score1El.textContent = 0;
  // Current score
  current0El.textContent = 0;
  current1El.textContent = 0;
  // Dice image
  diceImage.classList.add('hidden');

  // player--winner class
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');

  // player--active class
  player1El.classList.remove('player--active');
  player0El.classList.add('player--active');
};

// Starting condition.
resetTheGame();

// Rolling dice functionality.
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1- Generate a random dice roll.
    const dice = Math.trunc(Math.random() * 6) + 1;

    // 2- Display dice roll.
    diceImage.classList.remove('hidden');
    diceImage.src = `dice-${dice}.png`;

    // 3- Check is dice roll = 1
    if (dice !== 1) {
      // Add dice roll to current score and display new score.
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // Switch to the next player.
      switchPlayer();
    }
  }
});

// Holds score functionality.
btnHold.addEventListener('click', function () {
  if (playing) {
    // 1- Add Current score to active player total score.
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    // 2- check if total score >= 100
    if (scores[activePlayer] >= 100) {
      //  -> true: The active player wins and finish the game.
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');

      diceImage.classList.add('hidden');
    } else {
      // -> false : Switch to the next player.
      switchPlayer();
    }
  }
});

// Reset the game functionality.
btnNew.addEventListener('click', resetTheGame);
