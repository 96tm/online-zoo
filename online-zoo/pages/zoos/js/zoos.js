const foldButton = document.querySelector(".info-body__button");
const footer = document.querySelector(".footer");
const sidebarButton = document.querySelector(".sidebar__button");
const infoBody = document.querySelector(".info__body");
const generalInfo = document.querySelector(".info-body-section--general-info");
const generalInfoHeading = document.querySelector(".info-body-section__title");
const generalInfoFirstParagraph = generalInfo.querySelector(
  ".info-body-section__text"
);
const overlay = document.querySelector(".text-overlay");
const camera = document.querySelector(".pet-camera__iframe");
const sliderList = document.querySelector(".carousel__list");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");

const TRANSITION_INTERVAL = 1000;

let folded = false;

window.addEventListener("resize", (event) => {
  if (folded) {
    resizeParagraph();
    showOverlay();
  }
});

sidebarButton.addEventListener("click", (event) => {
  foldButton.scrollIntoView();
});

foldButton.addEventListener("click", handleFoldButton);

class Slider {
  constructor(slider, wrap, step, numberOfVisible, arrowLeft, arrowRight) {
    this.slider = slider;
    this.wrap = wrap;
    this.sliderStep = step;
    this.numberOfVisible = numberOfVisible;
    this.arrowLeft = arrowLeft;
    this.arrowRight = arrowRight;
    this.numberOfElements = this.slider.children.length;
    this.timeoutHandle = null;
    this.init();
  }

  get cardWidth() {
    return this.slider.firstElementChild.clientWidth;
  }

  get shiftValue() {
    const margin =
      this.slider.children[1].offsetLeft -
      this.slider.firstElementChild.offsetLeft -
      this.slider.firstElementChild.clientWidth;
    return this.slider.firstElementChild.clientWidth + margin;
  }

  rotateLeft(event, step = this.sliderStep) {
    if (!this.timeoutHandle) {
      this.slider.classList.remove("slider-transition");
      for (let i = 0; i < step; i++) {
        let item = this.slider.lastElementChild;
        let temp = item.cloneNode(true);
        this.slider.firstElementChild.before(temp);
        item.remove();
      }
      this.slider.style.marginLeft = `-${this.sliderStep * this.shiftValue}px`;
      this.timeoutHandle = setTimeout(
        (() => {
          this.slider.classList.add("slider-transition");
          this.slider.style.marginLeft = 0;
          setTimeout(
            (() => (this.timeoutHandle = null)).bind(this),
            TRANSITION_INTERVAL
          );
        }).bind(this)
      );
    }
  }

  rotateRight(event, step = this.sliderStep) {
    if (!this.timeoutHandle) {
      this.slider.classList.add("slider-transition");
      this.slider.style.marginLeft = `-${this.sliderStep * this.shiftValue}px`;
      this.timeoutHandle = setTimeout((event) => {
        for (let i = 0; i < step; i++) {
          let item = this.slider.firstElementChild;
          let temp = item.cloneNode(true);
          this.slider.append(temp);
          item.remove();
        }
        this.slider.classList.remove("slider-transition");
        this.slider.style.marginLeft = 0;
        this.timeoutHandle = null;
      }, TRANSITION_INTERVAL);
    }
  }

  init() {
    this.arrowLeft.addEventListener("click", this.rotateLeft.bind(this));
    this.arrowRight.addEventListener("click", this.rotateRight.bind(this));
    this.slider.addEventListener("click", (event) => {
      if (event.target.matches(".carousel__video-overlay")) {
        const video = event.target.parentElement.querySelector(
          ".carousel__video"
        );
        const videoSrc = video.src;
        video.src = camera.src;
        camera.src = videoSrc;
      }
    });
  }
}

function handleFoldButton(event) {
  foldInfo();
  infoBody.scrollIntoView("top");
}

function foldInfo() {
  infoBody.classList.toggle("hidden-sections");
  if (folded) {
    infoBody.style.height = infoBody.scrollHeight + "px";
    foldButton.textContent = "Read less";
    hideOverlay();
  } else {
    paragraphRect = generalInfoFirstParagraph.getBoundingClientRect();
    infoRect = infoBody.getBoundingClientRect();
    infoBody.style.height =
      paragraphRect.y - infoRect.y + paragraphRect.height + "px";
    foldButton.textContent = "Read more";
    showOverlay();
  }
  folded = !folded;
}

function resizeParagraph() {
  paragraphRect = generalInfoFirstParagraph.getBoundingClientRect();
  infoRect = infoBody.getBoundingClientRect();
  infoBody.style.height =
    paragraphRect.y - infoRect.y + paragraphRect.height + "px";
}

function showOverlay() {
  const headingHeight = generalInfoHeading.clientHeight;
  const paragraphHeight = generalInfoFirstParagraph.clientHeight;
  const margin =
    generalInfoFirstParagraph.offsetTop -
    generalInfoHeading.offsetTop -
    headingHeight;
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
