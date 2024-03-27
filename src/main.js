'use strict';
import PopUp from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

const CARROT_CNT = 5;
const BUG_CNT = 5;
const GAME_DURATION = 7;

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

let started = false;
let score = 0;
let timeCnt = undefined;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  startGame();
});

const gameField = new Field(CARROT_CNT, BUG_CNT);
gameField.setClickListener(onItemClick);

function onItemClick(item) {
  if (!started) {
    return;
  }
  if (item === 'carrot') {
    score++;
    updateScoreBoard();
    if (score === CARROT_CNT) {
      finishGame(true);
    }
  } else if (item === 'bug') {
    finishGame(false);
  }
}

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  sound.playBackground();
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gameFinishBanner.showWithText('REPLAY?');
  sound.playAlert();
  sound.stopBackground();
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
    sound.playWin();
  } else {
    sound.playBug();
  }
  stopGameTimer();
  sound.stopBackground();
  gameFinishBanner.showWithText(win ? 'YOU WON' : 'YOU LOST');
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

function initGame() {
  score = 0;
  gameScore.innerText = CARROT_CNT;
  gameField.init();
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_CNT - score;
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
