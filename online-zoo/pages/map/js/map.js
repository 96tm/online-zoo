const mapWrap = document.querySelector(".map-wrap");
const map = mapWrap.querySelector(".map");
const tooltip = document.querySelector(".tooltip");
const header = document.querySelector(".header");
const mapMarks = new Set(document.querySelectorAll(".map__mark"));
const zoomButtonIn = document.querySelector(".zoom__button-in");
const zoomButtonOut = document.querySelector(".zoom__button-out");

const animalLinks = {Gorillas: "../../pages/zoos/cam-gorilla-online.html",
                     Alligators: "../../pages/zoos/cam-alligator-online.html",
                     Eagles: "../../pages/zoos/cam-eagle-online.html",
                     Pandas: "../../pages/zoos/cam-panda-online.html"};
const zoomStep = 0.25;
let currentTooltip = null;
let tooltipInitialPosition = {top: 0, left: 0};
let isDragActivated = false;
// let isCurrentTooltipHidden = false;
let offset = {top: 0, left: 0};
let offsetY = 0;
let startX, startY;
let zoomValue = 1;
let headerOffset = -header.getBoundingClientRect().height;

document.addEventListener("DOMContentLoaded", event => {
  Array.from(document.querySelectorAll(".tooltip__button")).forEach(v => {
    const tooltip = v.closest(".tooltip");
    v.href = animalLinks[tooltip.dataset.animal];
  });
  const tooltip = document.querySelector(".tooltip-alligators");
  const animal = tooltip.dataset.animal;
  const marks = Array.from(document.querySelectorAll(`.map__mark[data-animal=${animal}]`));
  colorMarks(marks);
  showTooltip(tooltip);
});

window.addEventListener("resize", event => {
  offsetY = map.getBoundingClientRect().y;
  headerOffset = -header.getBoundingClientRect().height;
  if (currentTooltip) {
    moveTooltip(currentTooltip);
  }
});

// map.addEventListener("mouseover", handleMouseOverAnimal);
zoomButtonIn.addEventListener("mousedown", zoomIn);
zoomButtonOut.addEventListener("mousedown", zoomOut);

mapWrap.addEventListener("mousedown", event => {
  if (event.which === 1) {
    if (event.target.classList.contains("animal-figure")
        || event.target.classList.contains("map__mark")) {
          const animal = event.target.dataset.animal;
          const tooltip = document.querySelector(`.tooltip-${animal.toLowerCase()}`);
          const marks = Array.from(document.querySelectorAll(`.map__mark[data-animal=${animal}]`));
          colorMarks(marks);
          showTooltip(tooltip);
    }
    else if (!event.target.matches(".tooltip__button")) {
      colorMarks();
      hideTooltips();
      [startX, startY] = [event.clientX, event.clientY - offsetY];
      isDragActivated = true;
    }
  }
});

mapWrap.addEventListener("mouseup", handleMouseUp);

document.addEventListener("mousemove", handleMouseMove);

// #region functions
function zoomIn(event) {
  if (zoomValue < 4) {
    zoomValue += zoomStep;
    zoom(zoomValue);
    if (currentTooltip) {
      moveTooltip(currentTooltip);
    }
  }
}
function zoomOut(event) {
  if (zoomValue > 1) {
    zoomValue -= zoomStep;
    zoom(zoomValue);
    if (currentTooltip) {
      moveTooltip(currentTooltip);
    }
  }
}

function zoom(value) {
  map.style.transform = `scale(${value})`;
}

function showTooltip(tooltip) {
  moveTooltip(tooltip);
  hideTooltips();
  tooltip.classList.add("visible");
  currentTooltip = tooltip;
}

function hideTooltips() {
  const tooltips = Array.from(document.querySelectorAll(".tooltip"));
  tooltips.forEach(v => {
    v.classList.remove("visible");
  });
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
  marks = marks || [];
  const inactiveMarks = Array.from(document.querySelectorAll(".map__mark"));
  inactiveMarks.forEach(v => {
    v.classList.remove("map__mark--color");
  });
  marks.forEach(v => {
    v.classList.add("map__mark--color");
  });
}

function moveMap(xDistance, yDistance) {
  const mapRect = map.getBoundingClientRect();
  const newMapOffsetX = offset.left + xDistance;
  const newMapOffsetY = offset.top + yDistance - offsetY;

  if (Math.min(1.75, zoomValue) * Math.abs(newMapOffsetX) > mapRect.width / 2 
      || Math.min(1.75, zoomValue) * Math.abs(newMapOffsetY) > mapRect.height / 2) {
          return;
  }

  map.style.left = `${newMapOffsetX}px`;
  map.style.top =  `${newMapOffsetY}px`;
}

function handleMouseMove(event) {
  if (isDragActivated)
  {
    const xDistance = event.x - startX;
    const yDistance = event.y - startY;
    moveMap(xDistance, yDistance);
    // isCurrentTooltipHidden = true;
    // if (currentTooltip) moveTooltip(currentTooltip);
  }
}

function handleMouseUp(event) {
  isDragActivated  = false;
  offset.left = parseInt(map.style.left.replace("px", "")) || 0;
  offset.top = parseInt(map.style.top.replace("px", "")) || 0;
  if (currentTooltip) {
    tooltipInitialPosition.left = currentTooltip.style.left.replace("px", "");
    tooltipInitialPosition.top = currentTooltip.style.top.replace("px", "");
    // if (currentTooltip && isCurrentTooltipHidden) {
    //   console.log('show', currentTooltip)
    //   moveTooltip(currentTooltip);
    //   currentTooltip.classList.add("visible");
    //   console.log(currentTooltip.classList)
    //   showTooltip(currentTooltip);
    // }
  }
}

function handleMouseOverAnimal(event) {
  if (event.target.classList.contains("animal-figure")
      || event.target.classList.contains("map__mark")) {
    const animal = event.target.dataset.animal;
    const tooltip = document.querySelector(`.tooltip-${animal.toLowerCase()}`);
    const marks = Array.from(document.querySelectorAll(`.map__mark[data-animal=${animal}]`));
    colorMarks(marks);
    showTooltip(tooltip);
  }
}
// #endregion functions
