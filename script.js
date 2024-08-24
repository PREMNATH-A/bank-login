const accounts = [
  {
    owner: "Prem Nath",
    movements: [3500, 1000, -800, 1200, 3600, -1500],
    interestRate: 1.5,
    password: 8090,
  },
  {
    owner: "Jessica Agnes",
    movements: [4500, 500, -750, 200, 3200, -1800, 500, 1200, -1750, 1800],
    interestRate: 1.5,
    password: 9080,
  },
  {
    owner: "Hari Haran",
    movements: [4500, 500, -750, 200, 3200, -1000, 500, 1200, -1500, 1800],
    interestRate: 1.5,
    password: 9988,
  },
  {
    owner: "Sweety Angel",
    movements: [5000, 500, -750, 200, 3200, -1200, 500, 1200, -1400, 2000],
    interestRate: 1.5,
    password: 8899,
  },
  {
    owner: "Suriya Bharathi",
    movements: [4000, 400, -550, 200, 3500, -1000, 400, 1100, -2400, 4000],
    interestRate: 1.5,
    password: 2468,
  },
];

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

const inputLoginUsername = document.querySelector(".login-input-username");
const inputLoginPassword = document.querySelector(".login-input-password");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-username");
const inputClosePassword = document.querySelector(".form-input-password");


function updateUI(currentAccount) {
  displayMovements(currentAccount);
  displaySummary(currentAccount);
  displayBalance(currentAccount);
}


function createUsernames(accounts) {
  accounts.forEach((account) => {
    account.username = account.owner  //username : Hari Haran
      .toLowerCase()//hari haran
      .split(" ")//["hari","haran"]
      .map((word) => word.at(0)) // [h,h]
      .join("");//hh
  });
}
createUsernames(accounts);

// console.log(accounts);

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  // console.log(currentAccount);
  
  if (currentAccount?.password === Number(inputLoginPassword.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    containerApp.style.opacity = 1;

    updateUI(currentAccount);
  } else {
    
    labelWelcome.textContent = "Login failed!";
    containerApp.style.opacity = 0;
  }


  inputLoginUsername.value = inputLoginPassword.value = "";
  inputLoginPassword.blur();
});

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = "";
  console.log(account);

  const moves = sort
    ? account.movements.slice(0).sort((a, b) => a - b)
    : account.movements;

  moves.forEach((move, i) => {
    const type = move > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements-row">
          <div class="movements-type movements-type-${type}">${
      i + 1
    } ${type}</div>
          <div class="movements-date">5 days ago</div>
          <div class="movements-value">${move}$</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function displaySummary(account) {

  const incomes = account.movements
    .filter((move) => move > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = `${incomes}$`;


  const outcomes = account.movements
    .filter((move) => move < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}$`;

 
  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest}$`;
}

function displayBalance(account) {
  account.balance = account.movements.reduce((acc, move) => acc + move, 0);

  labelBalance.textContent = `${account.balance}$`;
}

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receiverAccount?.username &&
    receiverAccount
  ) {
   
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
  
    updateUI(currentAccount);
  
    labelWelcome.textContent = "Transaction successful!";
  } else {
    labelWelcome.textContent = "Transaction failed!";
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
   
    currentAccount.movements.push(amount);
   
    updateUI(currentAccount);
   
    labelWelcome.textContent = "loan successful";
  } else {
    labelWelcome.textContent = "loan not successful";
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.password === Number(inputClosePassword.value)
  ) {
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );

  
    accounts.splice(index, 1);

   
    containerApp.style.opacity = 0;

   
    labelWelcome.textContent = "account deleted";
  } else {
    labelWelcome.textContent = "delete can not be done";
  }
  inputCloseUsername.value = inputClosePassword.value = "";
  inputClosePassword.blur();
});

let sortedMove = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sortedMove);
  sortedMove = !sortedMove;
});




 