const account1 = {
  owner: 'Ahmed Khattab', // ak
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-04-18T21:31:17.178Z',
    '2023-06-16T09:15:04.904Z',
    '2023-10-23T07:42:02.383Z',
    '2024-05-28T10:17:24.185Z',
    '2024-08-15T17:01:17.194Z',
    '2024-08-17T14:11:59.604Z',
    '2024-08-19T10:51:36.790Z',
    '2024-08-20T18:36:17.929Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account2 = {
  owner: 'Lama Mohamed', // lm
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-10-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-05T16:33:06.386Z',
    '2024-04-10T14:43:26.374Z',
    '2024-08-13T18:49:59.371Z',
    '2024-08-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

///////////////////////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//--------------//
// Global variables.
let currentAccount, timer;
let stored = false;

//--------------//
// functions:

// format Currency
const formatCurrency = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  return new Intl.NumberFormat(locale, options).format(value);
};
// format Date
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(date, new Date());

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
//  Movements
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0;

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);
    const formatedMov = formatCurrency(mov, account.locale, account.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//  Balance
const calclDisplayBalance = function (account) {
  const balance = account.movements
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);
  account.balance = balance;
  labelBalance.textContent = formatCurrency(
    balance,
    account.locale,
    account.currency
  );
};
//  Summary
const calclDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(
    income,
    account.locale,
    account.currency
  );

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};
//  Create username for each account.
const createUsernames = function (accs) {
  // produce side effect - simply do some work - create new property and initiate it.

  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
//  UI
const updateUI = function (account) {
  // Display Balance
  calclDisplayBalance(account);
  // Display Movements
  displayMovements(account);
  // Display Summary
  calclDisplaySummary(account);
};
//  Input Field
const clearInputField = function (userOrTransferTo, pinOrAmount) {
  // Clear input field.
  userOrTransferTo.value = pinOrAmount.value = '';
  pinOrAmount.blur();
};
// Logout Timer
const startLogoutTimer = function () {
  // Set time to 5 minutes
  let duration = 300; // 300 seconds

  const tick = function () {
    const min = String(Math.trunc(duration / 60)).padStart(2, '0');
    const sec = String(duration % 60).padStart(2, '0');

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (duration === 0) {
      clearInterval(timerOut);

      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }

    // Decrease 1s
    duration--;
  };
  // Call the timer every second
  tick();
  const timerOut = setInterval(tick, 1000);

  return timerOut;
};
// reset Timer
const resetTimer = function () {
  clearInterval(timer);
  timer = startLogoutTimer();
};

//--------------//
// Event handlers

// * login handler
btnLogin.addEventListener('click', function (event) {
  // prevent from submitting.
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message.
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!👋`;

    //------------//
    // date and time of now.
    const now = new Date();

    //configuration object
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //------------//

    // Clear input field.
    clearInputField(inputLoginUsername, inputLoginPin);

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // update UI
    updateUI(currentAccount);
  }
});

// * transfer handler
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear input field.
  clearInputField(inputTransferTo, inputTransferAmount);

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing The Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // update UI
    updateUI(currentAccount);

    // RESET TIMER
    resetTimer();
  }
});

// * Loan handler
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= (loanAmount * 10) / 100)
  ) {
    setTimeout(() => {
      // Add positive amount to current user.
      currentAccount.movements.push(loanAmount);
      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI.
      updateUI(currentAccount);

      // RESET TIMER
      resetTimer();
    }, 2500);
  }
  // Clear Input Field
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// * Close Acc handler
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // [1, 2, 3].indexOf() // reference.

    // Delete Account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear input field.
  clearInputField(inputCloseUsername, inputClosePin);
});

// * Sort handler
btnSort.addEventListener('click', function (event) {
  event.preventDefault();

  displayMovements(currentAccount, !stored);
  stored = !stored; // update state variable.(flip variable)

  // RESET TIMER
  resetTimer();
});
