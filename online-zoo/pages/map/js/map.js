const mapWrap = document.querySelector(".map-wrap");
const map = mapWrap.querySelector(".map");
const tooltip = document.querySelector(".tooltip");
const header = document.querySelector(".header");
const headerOffset = -header.getBoundingClientRect().height;
const mapMarks = new Set(document.querySelectorAll(".map__mark"));
const zoomButtonIn = document.querySelector(".zoom__button-in");
const zoomButtonOut = document.querySelector(".zoom__button-out");

const animalLinks = {Gorillas: 1};
let currentTooltip = null;
let tooltipInitialPosition = {top: 0, left: 0};
let shown = false;
let isDragActivated = false;
let offset = {top: 0, left: 0};
let offsetY = 0;
let startX, startY;
let zoom = 1;

document.addEventListener("DOMContentLoaded", event => {
  offsetY = map.getBoundingClientRect().y;
  console.log('offsetY', offsetY)
});

map.addEventListener("mouseover", event => {
  if (event.target.classList.contains("animal-figure")
      || event.target.classList.contains("map__mark")) {
    const animal = event.target.dataset.animal;
    const tooltip = document.querySelector(`.tooltip-${animal.toLowerCase()}`);
    const marks = Array.from(document.querySelectorAll(`.map__mark[data-animal=${animal}]`));
    console.log(`map__mark[data-animal=${animal}]`);
    colorMarks(marks);
    showTooltip(tooltip);
  }
});

map.addEventListener("mouseout", event => {
  if (event.target.classList.contains("animal-figure")
      || event.target.classList.contains("map__mark")) {
  //   const animal = event.target.dataset.animal.toLowerCase();
  //   const tooltip = document.querySelector(".tooltip-" + animal);
  //   tooltip.style.visibility = "hidden";
  }
});

zoomButtonIn.addEventListener("mousedown", event => {
  console.log('zoom in')
  if (zoom < 4) {
    map.style.transform = `scale(${zoom + 0.25})`;
    zoom += 0.25;
  }
});

zoomButtonOut.addEventListener("mousedown", event => {
  console.log('zoom out')
  if (zoom > 1) {
    map.style.transform = `scale(${zoom - 0.25})`;
    zoom -= 0.25;
  }
});

mapWrap.addEventListener("pointerdown", event => {
    [startX, startY] = [event.clientX, event.clientY - offsetY];
    console.log('down', startX, startY)
    isDragActivated = true;
});

mapWrap.addEventListener("pointerup", event => {
  console.log('up');
  isDragActivated  = false;
  offset.left = parseInt(map.style.left.replace("px", "")) || 0;
  offset.top = parseInt(map.style.top.replace("px", "")) || 0;
  if (currentTooltip) {
    tooltipInitialPosition.left = currentTooltip.style.left.replace("px", "");
    tooltipInitialPosition.top = currentTooltip.style.top.replace("px", "");
  }
});

mapWrap.addEventListener("pointermove", event => {
  if (isDragActivated)
  {
    const xDistance = event.x - startX;
    const yDistance = event.y - startY;
    map.style.left = offset.left + xDistance + "px";
    map.style.top = offset.top + yDistance - offsetY + "px";
    if (currentTooltip) {
      console.log("===moving tooltip===");
      console.log(`map offsetY=${map.style.top}, offsetX=${map.style.left}`);

      console.log(`offsetY=${offsetY}`);
      console.log(`difference: x=${xDistance}, y=${yDistance}`);
      console.log(`old tooltip offset: x=${currentTooltip.style.left}, y=${currentTooltip.style.top}`);
      console.log(`old initial offset: x=${tooltipInitialPosition.left}, y=${tooltipInitialPosition.top}`);

      currentTooltip.style.left = tooltipInitialPosition.left + xDistance + "px";
      currentTooltip.style.top = tooltipInitialPosition.top + yDistance - offsetY + "px";
      console.log(`new tooltip offset: x=${currentTooltip.style.left}, y=${currentTooltip.style.top}`);
      console.log("======");
    }
  }
});

function showTooltip(tooltip) {
  const animal = tooltip.dataset.animal;
  const tooltips = Array.from(document.querySelectorAll(".tooltip"));
  tooltips.forEach(v => {
    v.classList.remove("visible");
  });
  tooltip.classList.add("visible");
  const animalImage = [...map.querySelectorAll(`.animal-figure[data-animal=${animal}]`)].slice(-1)[0];
  const imageRect = animalImage.getBoundingClientRect();
  tooltipInitialPosition = 
  {
    left: imageRect.x,
    top: imageRect.y + imageRect.height + pageYOffset + headerOffset
  };
  tooltip.style.left = `${tooltipInitialPosition.left}px`;
  tooltip.style.top = `${tooltipInitialPosition.top}px`;
  currentTooltip = tooltip;
  console.log("===showing tooltip===");
  console.log(`tooltip position: top=${tooltipInitialPosition.top}, left=${tooltipInitialPosition.left}`);
  console.log(`image rect: y=${imageRect.y}, x=${imageRect.x}`);
  console.log(`offset: top=${offset.top}, left=${offset.left}`);
  console.log(`header offset: ${headerOffset}`);
  console.log(`page offset: ${pageYOffset}`);
  console.log("==========");

}

function colorMarks(marks) {
  const inactiveMarks = Array.from(document.querySelectorAll(".map__mark"));
  inactiveMarks.forEach(v => {
    v.classList.remove("map__mark--color");
  });
  marks.forEach(v => {
    v.classList.add("map__mark--color");
  });
}