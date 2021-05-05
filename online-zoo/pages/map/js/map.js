const mapWrap = document.querySelector(".map-wrap");
const map = mapWrap.querySelector(".map");
const tooltip = document.querySelector(".tooltip");
const header = document.querySelector(".header");
const mapMarks = new Set(document.querySelectorAll(".map__mark"));
const zoomButtonIn = document.querySelector(".zoom__button-in");
const zoomButtonOut = document.querySelector(".zoom__button-out");

const animalLinks = {Gorillas: "/online-zoo/pages/zoos/cam-gorilla-online.html",
                     Alligators: "/online-zoo/pages/zoos/cam-alligator-online.html",
                     Eagles: "/online-zoo/pages/zoos/cam-eagle-online.html",
                     Pandas: "/online-zoo/pages/zoos/cam-panda-online.html"};
let currentTooltip = null;
let tooltipInitialPosition = {top: 0, left: 0};
let shown = false;
let isDragActivated = false;
let offset = {top: 0, left: 0};
let offsetY = 0, offsetYTemp = 0;;
let startX, startY;
let zoom = 1;
let resolutionOffsetX = 0;
let headerOffset = -header.getBoundingClientRect().height;

document.addEventListener("DOMContentLoaded", event => {
  Array.from(document.querySelectorAll(".tooltip__button")).forEach(v => {
    console.log('button', v.dataset.animal)
    const tooltip = v.closest(".tooltip");
    v.href = animalLinks[tooltip.dataset.animal];
    console.log(v.href, animalLinks[tooltip.dataset.animal])
  });

  offsetY = map.getBoundingClientRect().y;
  if (window.screen.availWidth < 1600) {
    const ratio = 1600 / window.screen.availWidth;
    resolutionOffsetX
  }
  else {
    resolutionOffsetX = 0;
  }
  const tooltip = document.querySelector(".tooltip-alligators");
  const animal = tooltip.dataset.animal;
  const marks = Array.from(document.querySelectorAll(`.map__mark[data-animal=${animal}]`));
  colorMarks(marks);
  showTooltip(tooltip);
});

window.addEventListener("resize", event => {
  if (currentTooltip) {
    moveTooltip(currentTooltip);
  }
  offsetY = map.getBoundingClientRect().y;
  headerOffset = -header.getBoundingClientRect().height;
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

document.querySelector(".main").addEventListener("pointerout", event => {
  // isDragActivated = false;
  console.log('OUT')
  if (event.target.classList.contains("animal-figure")
      || event.target.classList.contains("map__mark")) {
  }
});

zoomButtonIn.addEventListener("mousedown", event => {
  if (zoom < 4) {
    map.style.transform = `scale(${zoom + 0.25})`;
    zoom += 0.25;
    if (currentTooltip) {
      moveTooltip(currentTooltip);
    }
  }
});

zoomButtonOut.addEventListener("mousedown", event => {
  if (zoom > 1) {
    map.style.transform = `scale(${zoom - 0.25})`;
    zoom -= 0.25;
    if (currentTooltip) {
      moveTooltip(currentTooltip);
    }
  }
});

mapWrap.addEventListener("pointerdown", event => {
  if (event.which === 1) {
    [startX, startY] = [event.clientX, event.clientY - offsetY];
    console.log('down', startX, startY);
    isDragActivated = true;
    if (currentTooltip) {
      console.log("===DOWN===");
      console.log(`tooltip offset x=${tooltipInitialPosition.left}, y=${tooltipInitialPosition.top}`);
    }
  }
});

mapWrap.addEventListener("pointerup", event => {
  console.log('up');
  isDragActivated  = false;
  offset.left = parseInt(map.style.left.replace("px", "")) || 0;
  offset.top = parseInt(map.style.top.replace("px", "")) || 0;
  if (currentTooltip) {
    tooltipInitialPosition.left = currentTooltip.style.left.replace("px", "");
    tooltipInitialPosition.top = currentTooltip.style.top.replace("px", "");
    offsetYTemp = 0;

  }
});

mapWrap.addEventListener("pointermove", event => {
  if (isDragActivated)
  {
    const xDistance = event.x - startX;
    const yDistance = event.y - startY;
    const newMapOffsetX = offset.left + xDistance;
    const newMapOffsetY = offset.top + yDistance - offsetY;
    const mapRect = map.getBoundingClientRect();
    console.log(`new offset: x=${newMapOffsetX}, y=${newMapOffsetY}, maprect.width/2=${mapRect.width/2}, maprect.height/2=${mapRect.width/2}`);
    if (Math.min(1.75, zoom) * Math.abs(newMapOffsetX) > mapRect.width / 2 
        || Math.min(1.75, zoom) * Math.abs(newMapOffsetY) > mapRect.height / 2) {
      return;
    }

    map.style.left = `${newMapOffsetX}px`;
    map.style.top =  `${newMapOffsetY}px`;
    if (currentTooltip) {
      // console.log("===moving tooltip===");
      // console.log(`map offsetY=${map.style.top}, offsetX=${map.style.left}`);

      // console.log(`offsetY=${offsetY}`);
      // console.log(`difference: x=${xDistance}, y=${yDistance - offsetY}`);
      // console.log(`old tooltip offset: x=${currentTooltip.style.left}, y=${currentTooltip.style.top}`);
      // console.log(`old initial offset: x=${tooltipInitialPosition.left}, y=${tooltipInitialPosition.top}`);
      moveTooltip(currentTooltip);
    }
  }
});

// #region functions
function showTooltip(tooltip) {
  const tooltips = Array.from(document.querySelectorAll(".tooltip"));
  moveTooltip(tooltip);
  tooltips.forEach(v => {
    v.classList.remove("visible");
  });
  tooltip.classList.add("visible");
  currentTooltip = tooltip;
  console.log("===showing tooltip===");
  console.log(`tooltip position: top=${tooltipInitialPosition.top}, left=${tooltipInitialPosition.left}`);
  console.log(`tooltip style: top=${currentTooltip.style.top}, left=${currentTooltip.style.left}`);
  console.log(`offset: top=${offset.top}, left=${offset.left}`);
  console.log(`header offset: ${headerOffset}`);
  console.log(`page offset: ${pageYOffset}`);
  console.log("==========");
}

function moveTooltip(tooltip) {
  const animal = tooltip.dataset.animal;
  const animalImage = [...map.querySelectorAll(`.animal-figure[data-animal=${animal}]`)].slice(-1)[0];
  const imageRect = animalImage.getBoundingClientRect();
  const tooltipArrowOffset = tooltip.getBoundingClientRect().width / 2.8;
  tooltipInitialPosition = 
  {
    left: imageRect.x - tooltipArrowOffset + imageRect.width / 2,
    top: imageRect.y + imageRect.height + pageYOffset + headerOffset
  };
  tooltip.style.left = `${tooltipInitialPosition.left}px`;
  tooltip.style.top = `${tooltipInitialPosition.top}px`;
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
// #endregion functions
