'use strict';
import * as sound from './sound.js';

const IMG_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});

export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    // this.onClick = this.onClick.bind(this);
    // this.field.addEventListener('click', (event) => this.onClick(event));
    this.field.addEventListener('click', this.onClick);
    /*
    함수를 인자로 전달할 때 class 정보는 전달되지 않음
    this.onClick은 Field class의 멤버함수, so this.onClick을 전달하면 class도 전달되야함
    But, Javascript에서는 Class에 있는 함수를 전달할 때 Class무시 & 함수만 콜백으로 전달
    this가 class가 아니기 때문에 this.onItemClick은 undefined
    So, 함수와 class를 binding 해줘야함(this binding)
    */
  }

  init() {
    this.field.innerHTML = '';
    this._addItem('carrot', this.carrotCount, 'img/carrot.png');
    this._addItem('bug', this.bugCount, 'img/bug.png');
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }
  // 외부에서 봤을 때 private하다는 표시 _ (typescript에서는 private 선언 가능)
  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - IMG_SIZE;
    const y2 = this.fieldRect.height - IMG_SIZE;

    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  // 멤버변수로 만들기
  onClick = (event) => {
    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick(ItemType.carrot); // if it's declared, execute
    } else if (target.matches('.bug')) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
