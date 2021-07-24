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
  const petsOptions = PetsSlider.getOptions();
  const testimonialsOptions = TestimonialsSlider.getOptions();

  petsSlider = new PetsSlider(sliderList, sliderContainer,
                              petsOptions.sliderStep,
                              petsOptions.numberOfVisible,
                              arrowLeft, arrowRight);
  testimonialsSlider = new TestimonialsSlider(testimonialsList,
                                              testimonialsContainer,
                                              testimonialsOptions.sliderStep,
                                              testimonialsOptions.numberOfVisible,
                                              testimonialsRangeInput);
  testimonialsSlider.startSlideShow();
});

window.addEventListener("resize", event => {
  const petsOptions = PetsSlider.getOptions();  
  petsSlider.sliderStep = petsOptions.sliderStep;
  petsSlider.numberOfVisible = petsOptions.numberOfVisible;
  sliderContainer.scroll(0, 0);

  const testimonialsOptions = TestimonialsSlider.getOptions();
  testimonialsSlider.reset();
  testimonialsSlider.sliderStep = testimonialsOptions.sliderStep;
  testimonialsSlider.numberOfVisible = testimonialsOptions.numberOfVisible;
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

  // #region getters/setters
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
  // #endregion getters/setters

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

  static getOptions() {
    const options = {numberOfVisible: 6, sliderStep: 6};
    if (document.body.offsetWidth > 320 && document.body.offsetWidth <= 640) {
      options.numberOfVisible = 4;
      options.sliderStep = 4;
    }
    return options;
  }
}

class TestimonialsSlider {
  constructor(slider, wrap, step, numberOfVisible,
              rangeInput) {
    this.slider = slider;
    this.wrap = wrap;
    this.rangeInput = rangeInput;
    this._sliderStep = step;
    this._numberOfVisible = numberOfVisible;
    this.scroll = 0;
    this.index = 0;
    this.slideShowHandle = null;
    this.slideShowTimeoutHandle = null;
    this.init();
  }
  get shiftValue() {
    const margin = this.slider.children[1].getBoundingClientRect().x
                   - this.slider.firstElementChild.getBoundingClientRect().x
                   - this.slider.firstElementChild.getBoundingClientRect().width;
    return this.slider.firstElementChild.getBoundingClientRect().width + margin;
  }
  set sliderStep(value) {
    this._sliderStep = value;
  }
  get sliderStep() {
    return this._sliderStep;
  }
  set numberOfVisible(value) {
    this._numberOfVisible = value;
  }
  get numberOfVisible() {
    return this._numberOfVisible;
  }
  get numberOfElements() {
    return this.numberOfVisible + 7;
  }

  rotateRight() {
    this.index = (this.index + this.sliderStep) % (this.numberOfElements - this.numberOfVisible + 1);
    this.scroll = this.shiftValue * this.index;
    this.slider.style.left = `${-this.scroll}px`
    this.rangeInput.value = this.index;
  }

  rotateLeft() {
    this.index = Math.max(0, (this.index - this.sliderStep));
    this.scroll = this.shiftValue * this.index;
    this.slider.style.left = `${-this.scroll}px`
    this.rangeInput.value = this.index;
  }

  init() {
    this.rangeInput.addEventListener("input", this.handleRangeInput.bind(this));
    this.slider.addEventListener("click", event => {
      if(event.target.closest(".testimonials__list-item")) {
        this.stopSlideShow();
        this.resumeSlideShow();
      }
    });
  }

  handleRangeInput(event) {
    const newValue = parseInt(event.target.value)
    const diff = newValue - this.index;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.rotateRight();
      }
    }
    else {
      for (let i = 0; i < -diff; i++) {
        this.rotateLeft();
      }
    }
  }

  resumeSlideShow() {
    clearTimeout(this.slideShowTimeoutHandle);
    this.slideShowTimeoutHandle = setTimeout(this.startSlideShow.bind(this), 30 * 1000);
  }

  startSlideShow() {
    this.slideShowHandle = setInterval(this.rotateRight.bind(this), 10 * 1000);
  }

  stopSlideShow() {
    clearInterval(this.slideShowHandle);
    this.slideShowHandle = null;
  }

  reset() {
    this.stopSlideShow();
    this.scroll = 0;
    this.index = 0;
    this.rangeInput.value = 0;
    this.slider.style.left = "0";
    this.startSlideShow();
  }

  static getOptions() {
    const options = {numberOfVisible: 4, sliderStep: 1};
    if (document.body.offsetWidth > 640 && document.body.offsetWidth <= 1000) {
      options.numberOfVisible = 3;
      options.sliderStep = 1;
    }
    return options;
  }
}