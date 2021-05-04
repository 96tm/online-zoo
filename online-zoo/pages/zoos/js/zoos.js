const foldButton = document.querySelector(".info-body__button");
const infoBody = document.querySelector(".info__body");
const generalInfo = document.querySelector(".info-body-section--general-info");
const generalInfoHeading = document.querySelector(".info-body-section__title");
const generalInfoFirstParagraph = generalInfo.querySelector(".info-body-section__text");
const overlay = document.querySelector(".text-overlay");
const camera = document.querySelector(".pet-camera__iframe");

const sliderList = document.querySelector(".carousel__list");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");

let folded = false;

foldButton.addEventListener("click", event => {
  infoBody.classList.toggle("hidden-sections");
  if (folded) {
    infoBody.style.height = infoBody.scrollHeight + "px";
    event.target.textContent = "Read less";
    hideOverlay();
  }
  else {
    paragraphRect = generalInfoFirstParagraph.getBoundingClientRect();
    infoRect = infoBody.getBoundingClientRect();
    infoBody.style.height = paragraphRect.y - infoRect.y + paragraphRect.height + "px";
    event.target.textContent = "Read more";
    showOverlay();
    infoBody.scrollIntoView("top");
  }
  folded = !folded;
});

class Slider {
  constructor(slider, wrap, step, numberOfVisible,
              arrowLeft, arrowRight, offset = 0) {
    this.slider = slider;
    this.wrap = wrap;
    this.sliderStep = step;
    this.numberOfVisible = numberOfVisible;
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
      // this.slider.style.transform = "none";
    });
    // if (this.index < 0) {
    //   this.index = 0;
    //   setTimeout(event => {
    //     for(let i = 0; i < step; i++) {
    //       let item = this.slider.lastElementChild;
    //       let temp = item.cloneNode(true);
    //       this.slider.firstElementChild.before(temp);
    //       item.remove();
    //     };
    //     this.offset = "0";
    //     this.slider.style.transform = "none";
    //   });
    // }
    // else {
    //   this.offset += this.sliderStep * this.shiftValue;
    //   this.slider.style.transform = `translateX(${this.offset}px)`;
    // }
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
    // if (this.numberOfElements - this.numberOfVisible < this.index) {
    //   this.index--;
    //   setTimeout(event => {
    //     for(let i = 0; i < step; i++) {
    //       let item = this.slider.firstElementChild;
    //       let temp = item.cloneNode(true);
    //       this.slider.append(temp);
    //       item.remove();
    //     };
    //     this.offset -= this.sliderStep * this.shiftValue;
    //   });
    // }
    // else {
    //   this.offset -= this.sliderStep * this.shiftValue;
    //   this.slider.style.transform = `translateX(${this.offset}px)`;
    // }
  }

  init() {
    this.arrowLeft.addEventListener("click", this.rotateLeft.bind(this));
    this.arrowRight.addEventListener("click", this.rotateRight.bind(this));
    this.slider.addEventListener("click", event => {
      if (event.target.matches(".carousel__video-overlay")) {
        const video = event.target.parentElement.querySelector(".carousel__video");
        const videoSrc = video.src;
        video.src = camera.src;
        camera.src = videoSrc;
      }
    });
  }
}

function showOverlay() {
  const headingHeight = generalInfoHeading.clientHeight;
  const paragraphHeight = generalInfoFirstParagraph.clientHeight;
  const margin = generalInfoFirstParagraph.offsetTop
                 - generalInfoHeading.offsetTop
                 - headingHeight;
  overlay.style.width = generalInfo.clientWidth + "px";
  overlay.style.height = headingHeight + paragraphHeight + margin + "px";
  overlay.style.left = generalInfo.offsetLeft + "px";
  overlay.style.top = generalInfo.offsetTop + "px";
  overlay.style.display = "initial";
}

function hideOverlay() {
  overlay.style.display = "none";
}

const slider = new Slider(sliderList, null, 1, 4, arrowLeft, arrowRight);
