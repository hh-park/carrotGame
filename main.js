const playBtn = document.querySelector('.playBtn');
const timer = document.querySelector('.timer');
const counter = document.querySelector('.counter');

let seconds = 10;
let countdown;

playBtn.addEventListener('click', () => {
  counter.textContent = '10';
  timer.textContent = '10:00';

  countdown = setInterval(() => {
    console.log(seconds--);
    timer.textContent = seconds == '10' ? `${seconds}:00` : `0${seconds}:00`;
    if (seconds === 0) {
      console.log('end');
      clearInterval(countdown);
      seconds = 10;
    }
  }, 1000);
});
