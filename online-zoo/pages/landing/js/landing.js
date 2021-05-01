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