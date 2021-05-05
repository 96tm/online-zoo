const arrowLeft = document.querySelector(".pets__arrow--left");
const arrowRight = document.querySelector(".pets__arrow--right");
const sliderContainer = document.querySelector(".pets__gallery");
const sliderList = sliderContainer.querySelector(".pets__list");
const testimonialsContainer = document.querySelector(".testimonials__cards-wrap");
const testimonialsList = testimonialsContainer.querySelector(".testimonials__cards");
const testimonialsRangeInput = document.querySelector(".testimonials__scroll-input");

let gap = 30;
let petsSlider = null;
let testimonialsSlider = null;

document.addEventListener("DOMContentLoaded", event => {
  const petsOptions = getPetsOptions();
  console.log('loaded', petsOptions)

  petsSlider = new PetsSlider(sliderList, sliderContainer,
                              petsOptions.sliderStep,
                              petsOptions.numberOfVisible,
                              arrowLeft, arrowRight);
  testimonialsSlider = new TestimonialsSlider(testimonialsList,
                                              testimonialsContainer,
                                              testimonialsRangeInput, 30, 1, 4);
});

window.addEventListener("resize", event => {
  const petsOptions = getPetsOptions();
  petsSlider.sliderStep = petsOptions.sliderStep;
  petsSlider.numberOfVisible = petsOptions.numberOfVisible;
  sliderContainer.scroll(0, 0);
});

class PetsSlider {
  constructor(slider, wrap, step, numberOfVisible,
              arrowLeft, arrowRight, offset = 0) {
    this.slider = slider;
    this.wrap = wrap;
    this._sliderStep = step;
    this._numberOfVisible = numberOfVisible;
    this.offset = offset;
    this.arrowLeft = arrowLeft;
    this.arrowRight = arrowRight;
    this.index = 0;
    this.numberOfElements = this.slider.children.length;
    this.init();
  }

  get cardWidth () {
    return this.slider.firstElementChild.clientWidth;
  }
  get shiftValue() {
    const margin = this.slider.children[1].offsetLeft
                   - this.slider.firstElementChild.offsetLeft
                   - this.slider.firstElementChild.clientWidth;
    return this.slider.firstElementChild.clientWidth + margin;
  }
  set numberOfVisible(value) {
    this._numberOfVisible = value;
  }
  get numberOfVisible() {
    return this._numberOfVisible;
  }
  set sliderStep(value) {
    this._sliderStep = value;
  }
  get sliderStep() {
    return this._sliderStep;
  }

  rotateLeft(event, step = this.sliderStep) {
    this.index--;
    setTimeout(event => {
      for(let i = 0; i < step; i++) {
        let item = this.slider.lastElementChild;
        let temp = item.cloneNode(true);
        this.slider.firstElementChild.before(temp);
        item.remove();
      };
      this.offset = "0";
    });
  }
  rotateRight(event, step = this.sliderStep) {
    this.index++;
    setTimeout(event => {
      for(let i = 0; i < step; i++) {
        let item = this.slider.firstElementChild;
        let temp = item.cloneNode(true);
        this.slider.append(temp);
        item.remove();
      };
      this.offset -= this.sliderStep * this.shiftValue;
    });
  }

  init() {
    this.arrowLeft.addEventListener("click", this.rotateLeft.bind(this));
    this.arrowRight.addEventListener("click", this.rotateRight.bind(this));
  }
}

class TestimonialsSlider {
  constructor(slider, wrap, rangeInput, gap, step, numberOfVisible) {
    this.slider = slider;
    this.wrap = wrap;
    this.rangeInput = rangeInput;
    this._gap = gap;
    this.sliderStep = step;
    this.numberOfVisible = numberOfVisible;
    this.scroll = 0;
    this.index = 0;
    this.numberOfItems = this.slider.children.length;
    this.slideShowHandle = null;
    this.init();
  }

  set gap(value) {
    this._gap = value;
  }
  get gap() {
    return this._gap;
  }

  slideRight() {
    this.index = (this.index + this.sliderStep) % (this.numberOfItems - this.numberOfVisible + 1);
    this.scroll = (this.getCardWidth() + this.gap) * this.index;
    this.wrap.scrollTo(this.scroll, 0);
    this.rangeInput.value = this.index;
  }
  slideLeft() {
    this.index = Math.max(0, (this.index - this.sliderStep));
    this.scroll = (this.getCardWidth() + this.gap) * this.index;
    this.wrap.scrollTo(this.scroll, 0);
    this.rangeInput.value = this.index;

  }
  getCardWidth() {
    return this.slider.firstElementChild.offsetWidth;
  }
  init() {
    this.rangeInput.addEventListener("input", this.handleRangeInput.bind(this));
    this.slideShowHandle = setInterval(this.slideRight.bind(this), 10 * 1000);
    this.slider.addEventListener("click", event => {
      if(event.target.closest(".testimonials__list-item") && this.slideShowHandle) {
        clearInterval(this.slideShowHandle);
        this.slideShowHandle = null;
        setTimeout(() => {
          this.slideShowHandle = setInterval(this.slideRight.bind(this), 10 * 1000);
        }, 40 * 1000);
      }
    });
  }
  handleRangeInput(event) {
    const newValue = parseInt(event.target.value)
    const diff = newValue - this.index;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.slideRight();
      }
    }
    else {
      for (let i = 0; i < -diff; i++) {
        console.log(i, -diff)
        this.slideLeft();
      }
    }
  }
}

function getPetsOptions() {
  const petsOptions = {numberOfVisible: 6, sliderStep: 6};
  if (document.body.offsetWidth > 320 && document.body.offsetWidth <= 640) {
    petsOptions.numberOfVisible = 4;
    petsOptions.sliderStep = 4;
  }
  return petsOptions;
}