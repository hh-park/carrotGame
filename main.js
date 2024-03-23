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
