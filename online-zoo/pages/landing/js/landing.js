const buttonLeft = document.querySelector(".pets__arrow--left");
const buttonRight = document.querySelector(".pets__arrow--right");
const sliderContainer = document.querySelector(".pets__gallery");
const sliderList = document.querySelector(".pets__list");
let gap = 30;

class Slider {
  constructor(slider, sliderContainer, sliderIndex,
              step, gap, numberOfVisible, scroll = 0) {
    this.slider = slider;
    this.sliderContainer = sliderContainer;
    this.sliderIndex = sliderIndex;
    this.sliderStep = step;
    this.cardWidth = this.slider.firstElementChild.offsetWidth;
    this.gap = gap;
    this.numberOfVisible = numberOfVisible;
    this.scroll = scroll;
    this.numberOfCards = this.slider.children.length;
    this.padSlider();
  }

  scrollLeft() {
    if (this.sliderIndex >= this.sliderStep) {
      this.sliderIndex -= this.sliderStep;
      this.scroll -= (this.cardWidth + this.gap) * this.sliderStep;
      this.sliderContainer.scrollTo(this.scroll, 0);
    }
  }

  scrollRight () {
    if (this.sliderIndex + this.sliderStep <= this.numberOfCards) {
      this.sliderIndex += this.sliderStep;
      this.scroll += (this.cardWidth + this.gap) * this.sliderStep;
      this.sliderContainer.scrollTo(this.scroll, 0);
    }
  }

  padSlider() {
    const off = this.numberOfCards % this.sliderStep;
    console.log(off, this.numberOfVisible);
    for (let i = 0; i < this.numberOfVisible - off; i++) {
      const li = document.createElement("li");
      li.classList.add("pets__list-item");
      li.style.width = "100%";
      this.slider.append(li);
    }
  }
}

const slider = new Slider(sliderList, sliderContainer, 0, 3, gap, 6);

buttonLeft.addEventListener("click", event => {
  slider.scrollLeft();
});

buttonRight.addEventListener("click", event => {
  slider.scrollRight();
});