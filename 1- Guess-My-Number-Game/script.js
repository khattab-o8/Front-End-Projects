'use strict';

const randomNumber = function () {
  return Math.trunc(Math.random() * 20) + 1;
};

// the purpose from this function is to update the DOM element (.message) and visually display the message.
const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

// Global Variable (random number between 1 & 20).
let secretNumber = randomNumber();

let score = 20;
let highScore = 0;

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);

  // when there's No guess.
  if (!guess) {
    // document.querySelector('.message').textContent = '⛔ No Number!';
    displayMessage('⛔ No Number!');

    // when player wins.
  } else if (guess === secretNumber) {
    // document.querySelector('.message').textContent = '🎉 Correct Number!';
    displayMessage('🎉 Correct Number!');

    document.querySelector('.number').textContent = secretNumber;

    document.querySelector('.number').style.width = '30rem';
    document.querySelector('body').style.backgroundColor = '#60b347';

    highScore = score > highScore ? score : highScore;
    document.querySelector('.highscore').textContent = highScore;

    // when guess is wrong.
  } else if (guess !== secretNumber) {
    if (score > 0) {
      // document.querySelector('.message').textContent =
      //   guess > secretNumber ? '📈 Too High' : '📉 Too Low';
      displayMessage(guess > secretNumber ? '📈 Too High' : '📉 Too Low');

      score--;
      document.querySelector('.score').textContent = score;
    } else {
      // document.querySelector('.message').textContent = '💥 You Lost The Game';
      displayMessage('💥 You Lost The Game');
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  // reset variables
  secretNumber = randomNumber();
  score = 20;

  document.querySelector('.number').textContent = '?';
  // document.querySelector('.message').textContent = 'Start guessing...';
  displayMessage('Start guessing...');
  document.querySelector('.score').textContent = score;
  document.querySelector('.guess').value = '';

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});
