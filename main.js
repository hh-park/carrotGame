'use strict';

const IMG_SIZE = 80;
const CARROT_CNT = 5;
const BUG_CNT = 5;
const GAME_DURATION = 7;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;
let score = 0;
let timeCnt = undefined;

field.addEventListener('click', onFieldClick);

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener('click', () => {
  stopGameTimer();
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY?');
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? 'YOU WON' : 'YOU LOST');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fa-solid');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION;
  updateTimerText(remainingTimeSec);
  timeCnt = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timeCnt);
      finishGame(CARROT_CNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timeCnt);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerHTML = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerText = CARROT_CNT;
  addItem('carrot', CARROT_CNT, 'img/carrot.png');
  addItem('bug', BUG_CNT, 'img/bug.png');
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_CNT) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  }
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_CNT - score;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - IMG_SIZE;
  const y2 = fieldRect.height - IMG_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// -----------------------------------------------------------------

const playBtn = document.querySelector('.playBtn');
const timer = document.querySelector('.timer');
const counter = document.querySelector('.counter');
const gameArea = document.querySelector('.gameArea');
const resultHtml = `
                    <div class="result">
                      <button class="replayBtn">
                        <i class="fa-solid fa-rotate-right"></i>
                      </button>
                      <p class="resultValue">LOST</p>
                    </div>`;

const initCntNum = 10;
let cntNum = initCntNum;
let init = true;
let countdown;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let resultStatus = 'win';

// init
playBtn.addEventListener('click', () => {
  if (init === true) {
    init = false;
    playBtn.innerHTML = `
          <i class="fa-solid fa-stop"></i>
    `;
    setTimer();
    createItem('carrot');
    createItem('bug');
  } else {
    init = true;
    resultPopup('Replay?');
  }
});

function setTimer() {
  let seconds = 10;
  counter.textContent = `${cntNum}`;
  timer.textContent = '10:00';
  countdown = setInterval(() => {
    timer.textContent = seconds-- == '10' ? `${seconds}:00` : `0${seconds}:00`;
    if (seconds === 0) {
      resultPopup('LOST');
      clearInterval(countdown);
      seconds = 10;
    }
  }, 1000);
}

function createItem(input) {
  for (let i = 0; i < cntNum; i++) {
    const gameItem = document.createElement('div');
    gameItem.setAttribute('class', 'item');
    gameItem.setAttribute(
      'id',
      input === 'carrot' ? `carrot_${i}` : `bug_${i}`
    );
    gameItem.setAttribute(
      'onclick',
      input === 'carrot' ? `deleteItem(carrot_${i})` : 'resultPopup("LOST")'
    );
    gameItem.innerHTML = `<img src="img/${input}.png" alt="${input}">`;

    const randomWidth = positionRandom(0, winWidth);
    const randomHeight = positionRandom(0, winHeight);
    gameItem.style.left = randomWidth + 'px';
    gameItem.style.top = randomHeight + 'px';
    gameArea.appendChild(gameItem);
  }
}

function positionRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function deleteItem(id) {
  cntNum--;
  counter.textContent = `${cntNum}`;
  gameArea.removeChild(id);
  if (cntNum === 0) {
    resultPopup('WIN');
  }
}

function resultPopup(value) {
  const result = document.createElement('div');
  result.setAttribute('class', 'result');
  result.innerHTML = `
        <div class="result">
        <div class="resultPopup">
          <button class="replayBtn" onclick="replay()">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
          <p class="resultValue">${value}</p>
        </div>
      </div>
  `;
  gameArea.appendChild(result);

  playBtn.style.visibility = 'hidden';
  clearInterval(countdown);
}

function replay() {
  if (init === true) {
    init = false;
    playBtn.style.visibility = 'visible';
  }
  cntNum = initCntNum;
  counter.textContent = cntNum;
  gameArea.innerHTML = '';
  setTimer();
  createItem('carrot');
  createItem('bug');
}
