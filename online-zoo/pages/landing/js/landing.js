const buttonLeft = document.querySelector(".pets__arrow--left");
const buttonRight = document.querySelector(".pets__arrow--right");
const sliderContainer = document.querySelector(".pets__gallery");
const sliderList = sliderContainer.querySelector(".pets__list");
const testimonialsContainer = document.querySelector(".testimonials__cards-wrap");
const testimonialsList = testimonialsContainer.querySelector(".testimonials__cards");
const testimonialsRangeInput = document.querySelector(".testimonials__scroll-input");
let gap = 30;

class Slider {
  constructor(slider, sliderContainer, sliderIndex,
              step, gap, numberOfVisible, scroll = 0) {
    this.slider = slider;
    this.sliderContainer = sliderContainer;
    this.sliderIndex = sliderIndex;
    this.sliderStep = step;
    this.gap = gap;
    this.numberOfVisible = numberOfVisible;
    this.scroll = scroll;
    this.numberOfCards = this.slider.children.length;
    this.padSlider();
  }

  getCardWidth() {
    return this.slider.firstElementChild.offsetWidth;
  }

  scrollLeft() {
    if (this.sliderIndex >= this.numberOfVisible) {
      this.sliderIndex -= this.numberOfVisible;
      this.scroll -= (this.getCardWidth() + this.gap) * this.sliderStep;
      this.sliderContainer.scrollTo(this.scroll, 0);
      console.log(this.sliderIndex, this.scroll, this.getCardWidth(), this.gap, this.getCardWidth() + this.gap, (this.getCardWidth() + this.gap) * this.sliderStep)
    }
    else {
      // if (this.sliderIndex < this.numberOfCards - this.numVisible) {
      //   this.scroll -= (this.getCardWidth * this.gap) * this.sliderStep;
      //   this.sliderIndex -= this.numberOfVisible;
      // }
      const first = this.slider.firstElementChild;
      for (let i = this.numberOfCards - this.numberOfVisible; i < this.numberOfCards; i++) {
        // this.slider.append(this.slider.children[i].cloneNode(true));
        first.before(this.slider.children[i]);
      }
      this.sliderContainer.scrollTo(this.scroll, 0);
    }
  }

  scrollRight () {
    if (this.sliderIndex + this.numberOfVisible < this.numberOfCards) {
      this.sliderIndex += this.numberOfVisible;
      this.scroll += (this.getCardWidth() + this.gap) * this.sliderStep;
      this.sliderContainer.scrollTo(this.scroll, 0);
      console.log(this.sliderIndex, this.scroll, this.getCardWidth(), this.gap, this.getCardWidth() + this.gap, (this.getCardWidth() + this.gap) * this.sliderStep)
    }
    else{
      for (let i = 0; i < this.numberOfVisible; i++) {
        // this.slider.append(this.slider.children[i].cloneNode(true));
        this.slider.append(this.slider.firstElementChild);
      }
      if (this.sliderIndex > this.numVisible) {
        this.scroll -= (this.getCardWidth * this.gap) * this.sliderStep;
        this.sliderIndex -= this.numberOfVisible;

      }
      this.sliderContainer.scrollTo(this.scroll, 0);
    }
  }

  padSlider() {
    const off = this.numberOfCards % this.sliderStep;
    console.log(off, this.numberOfVisible);
    for (let i = 0; i < this.numberOfVisible - off; i++) {
      const li = document.createElement("li");
      li.classList.add("pets__list-item");
      this.slider.append(li);
    }
    this.numberOfCards += this.numberOfVisible - off;
  }
}

const slider = new Slider(sliderList, sliderContainer, 0, 3, gap, 6);

buttonLeft.addEventListener("click", event => {
  slider.scrollLeft();
});

buttonRight.addEventListener("click", event => {
  slider.scrollRight();
});

class Slider1 {
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
    this.slideShowHandle = setInterval(this.slideRight.bind(this), 1 * 1000);
    this.slider.addEventListener("click", event => {
      console.log(event.currentTarget)
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
    console.log('change', event.target.value, 'diff', diff);
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

const s = new Slider1(testimonialsList, testimonialsContainer, testimonialsRangeInput, 30, 1, 4);