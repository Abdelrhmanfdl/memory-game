let aboveGrid = document.getElementById("above-grid");

aboveGrid.onclick = function () {
  let aboveGrid = document.getElementById("above-grid");
  document.getElementById("time").innerText = "60";
  document.getElementById("flips").innerText = "0";
  aboveGrid.style.display = "none";
  processARound();
};

function processARound() {
  let cards = document.getElementById("cards-grid").children,
    lastFlippedCards = [],
    doneCards = [],
    attempts = 0,
    timer = 60,
    timerId;

  // defining cards actions
  for (let card of cards) {
    flipBack(card);
    card.onclick = function () {
      if (lastFlippedCards.length < 2 && canBeFlipped(card)) {
        document.getElementById("flips").innerText = ++attempts;
        flip(card);
        lastFlippedCards.push(card);
        if (lastFlippedCards.length == 2) processMatching();
      }
    };
    setTimeout(
      function (x) {
        x.children[1].classList = ["general-back"];
      },
      100,
      card
    );
  }

  setTimeout(function () {
    distributeCrads();
    timerId = setInterval(processTimer, 1000);
  }, 100);

  function canBeFlipped(card) {
    // assert that this card is not already flipped
    return !doneCards.includes(card) && !lastFlippedCards.includes(card);
  }

  function processMatching() {
    // check that the currently flipped two cards have the same type
    let back1 = lastFlippedCards[0].children[1];
    let back2 = lastFlippedCards[1].children[1];

    if (back1.classList[1] == back2.classList[1]) {
      doneCards.push(lastFlippedCards[0]);
      doneCards.push(lastFlippedCards[1]);
      lastFlippedCards = [];

      setTimeout(function () {
        back1.classList += " done-card";
        back2.classList += " done-card";
      }, 200);
    } else {
      setTimeout(function () {
        flipBack(lastFlippedCards[0]);
        flipBack(lastFlippedCards[1]);
        lastFlippedCards = [];
      }, 420);
    }
  }

  function processTimer() {
    // manages the timer, ends the round
    timer--;
    let timerLabal = document.getElementById("time");
    timerLabal.innerText = timer;

    if (doneCards.length == 16) {
      updateBestScore();
      clearInterval(timerId);
      document.getElementById("above-grid").style.display = "unset";
    }

    if (timer == 0) {
      clearInterval(timerId);
      document.getElementById("above-grid").style.display = "unset";
    }
  }

  function updateBestScore() {
    // updates the best score at end of the game
    let bestScore = document.getElementById("best-score"),
      newBestScore;
    if (bestScore.innerText == "-") newBestScore = attempts;
    else newBestScore = Math.min(attempts, parseInt(bestScore.innerText));

    bestScore.innerText = newBestScore;
  }

  function flipBack(card) {
    card.style.transform = "rotateY(0deg)";
  }
  function flip(card) {
    card.style.transform = "rotateY(180deg)";
  }

  function distributeCrads() {
    // random distribution
    let cardTypes = [];
    for (let i = 1; i <= 8; i++)
      for (let j = 1; j <= 2; j++) cardTypes.push(" type" + i);

    for (let i = 15; i >= 0; i--) {
      let idx = Math.random() * i;
      idx = Math.floor(idx);

      cards[i].children[1].classList += cardTypes[idx];
      [cardTypes[idx], cardTypes[i]] = [cardTypes[i], cardTypes[idx]];

      cardTypes.pop();
    }
  }
}
