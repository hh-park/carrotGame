const playBtn = document.querySelector('.playBtn');
const timer = document.querySelector('.timer');
const counter = document.querySelector('.counter');
const gameArea = document.querySelector('.gameArea');

let seconds = 10;
let countdown;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

playBtn.addEventListener('click', () => {
  counter.textContent = '10';
  timer.textContent = '10:00';

  countdown = setInterval(() => {
    timer.textContent = seconds-- == '10' ? `${seconds}:00` : `0${seconds}:00`;
    console.log(seconds);
    if (seconds === 0) {
      clearInterval(countdown);
      seconds = 10;
    }
  }, 1000);

  createCarrots();
});

function createCarrots() {
  for (let i = 0; i < 10; i++) {
    const carrot = document.createElement('div');
    carrot.setAttribute('class', 'carrot');
    carrot.innerHTML = '<img src="img/carrot.png" alt="carrot">';

    const randomWidth = positionRandom(0, winWidth);
    const randomHeight = positionRandom(0, winHeight);
    carrot.style.left = randomWidth + 'px';
    carrot.style.top = randomHeight + 'px';
    gameArea.appendChild(carrot);
  }
}

function positionRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
