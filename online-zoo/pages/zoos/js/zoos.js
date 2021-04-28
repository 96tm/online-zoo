const foldButton = document.querySelector(".info-body__button");
const infoBody = document.querySelector(".info__body");
const generalInfo = document.querySelector(".info-body-section--general-info");
const generalInfoHeading = document.querySelector(".info-body-section__title");
const generalInfoFirstParagraph = generalInfo.querySelector(".info-body-section__text");
const overlay = document.querySelector(".text-overlay");
const camera = document.querySelector(".pet-camera__iframe");

const slider = document.querySelector(".carousel__list");
const videoContainers = slider.querySelectorAll(".carousel__video-wrap");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");

let folded = false;
let sliderPage = localStorage.getItem("sliderPage") || 1;

slider.addEventListener("click", event => {
  console.log(event.target)
  if (event.target.matches(".carousel__video-overlay")) {
    const video = event.target.parentElement.querySelector(".carousel__video");
    const videoSrc = video.src;
    console.log(video, camera);
    video.src = camera.src;
    camera.src = videoSrc;
  }
});
arrowRight.addEventListener("click", event => {
  rotateSlider(slider, "right");
});
arrowLeft.addEventListener("click", event => {
  rotateSlider(slider, "left");
});

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

function rotateSlider(slider, direction, numberOfElements = 1) {
  console.log(sliderPage);
  const margin = videoContainers[1].offsetLeft
                 - videoContainers[0].offsetLeft
                 - videoContainers[0].clientWidth;
  const shiftWidth = videoContainers[0].clientWidth + margin;
  const initialLeft = parseFloat(slider.style.left.replace("px", "")) || 0;
  if (direction === "left" && sliderPage !== 1) {
    slider.style.left = numberOfElements
                        * (initialLeft + shiftWidth) + "px";
    sliderPage--;
  }
  else if (direction === "right" && videoContainers.length - 3 > sliderPage) {
    slider.style.left = numberOfElements
                        * (initialLeft - shiftWidth) + "px";
    sliderPage++;
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