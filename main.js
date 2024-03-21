const playBtn = document.querySelector('.playBtn');
const timer = document.querySelector('.timer');
const counter = document.querySelector('.counter');
const gameArea = document.querySelector('.gameArea');

let seconds = 10;
let cntNum = 10;
let countdown;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

playBtn.addEventListener('click', () => {
  counter.textContent = `${cntNum}`;
  timer.textContent = '10:00';

  countdown = setInterval(() => {
    timer.textContent = seconds-- == '10' ? `${seconds}:00` : `0${seconds}:00`;
    console.log(seconds);
    if (seconds === 0) {
      clearInterval(countdown);
      seconds = 10;
    }
  }, 1000);

  createItem('carrot');
  createItem('bug');
});

counter.textContent.addEventListener('change', () => {
  console.log('changed');
});
function createItem(input) {
  for (let i = 0; i < 10; i++) {
    const gameItem = document.createElement('div');
    gameItem.setAttribute('class', 'item');
    gameItem.setAttribute(
      'id',
      input === 'carrot' ? `carrot_${i}` : `bug_${i}`
    );
    gameItem.setAttribute(
      'onclick',
      input === 'carrot' ? `deleteItem(carrot_${i})` : 'endGame()'
    );
    gameItem.innerHTML = `<img src="img/${input}.png" alt="${input}">`;

    const randomWidth = positionRandom(0, winWidth);
    const randomHeight = positionRandom(0, winHeight);
    gameItem.style.left = randomWidth + 'px';
    gameItem.style.top = randomHeight + 'px';
    gameArea.appendChild(gameItem);
  }
}

function deleteItem(id) {
  cntNum--;
  counter.textContent = `${cntNum}`;
  gameArea.removeChild(id);
  if (cntNum === 0) {
    console.log('win');
    // win popup
  }
}

function endGame() {
  // lose popup
}

function positionRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
