const mapWrap = document.querySelector(".map-wrap");
const map = mapWrap.querySelector(".map");
const tooltip = document.querySelector(".tooltip");
const header = document.querySelector(".header");
const y0 = -header.getBoundingClientRect().height;
const mapMarks = new Set(document.querySelectorAll(".map__mark"));
const zoomButtonIn = document.querySelector(".zoom__button-in");
const zoomButtonOut = document.querySelector(".zoom__button-out");

let shown = false;
let isDragActivated = false;
let offset = {top: 0, left: 0};
let offsetY = 0;
let startX, startY;
let zoom = 1;

document.addEventListener("DOMContentLoaded", event => {
  offsetY = map.getBoundingClientRect().y;
});

map.addEventListener("mouseover", event => {
  if (event.target.classList.contains("animal-figure")
      || event.target.classList.contains("map__mark")) {
    const animal = event.target.dataset.animal.toLowerCase();
    const tooltip = document.querySelector(".tooltip-" + animal);
    tooltip.style.visibility = "visible";
    // mapMarks.forEach(v => v.classList.remove("map__mark-active"));
    // const figureRect = event.target.getBoundingClientRect();
    // const markId = "#map__mark-" + event.target.dataset.mapMark;
    // const mark = document.querySelector(markId);
    // mark.classList.add("map__mark-active");
    // let [x, y] = [figureRect.left, y0 + event.pageY + figureRect.height];
    // x -= tooltip.getBoundingClientRect().width / 4;
    // console.log(tooltip.getBoundingClientRect().width / 4);
    // const animal = mark.dataset.animal;
    // const location = mark.dataset.location;
    // tooltip.querySelector(".tooltip__animal").innerText = animal;
    // tooltip.querySelector(".tooltip__location").innerText = location;
    // tooltip.style.left = x + "px";
    // tooltip.style.top = y + "px";
    // tooltip.style.visibility = "visible";
    // shown = true;
    // console.log(x, figureRect.x, event.clientX);
  }
});

map.addEventListener("mouseout", event => {
  if (event.target.classList.contains("animal-figure")
      || event.target.classList.contains("map__mark")) {
    const animal = event.target.dataset.animal.toLowerCase();
    const tooltip = document.querySelector(".tooltip-" + animal);
    tooltip.style.visibility = "hidden";
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

mapWrap.addEventListener("mousedown", event => {
    [startX, startY] = [event.clientX, event.clientY - offsetY];
    isDragActivated = true;
});

mapWrap.addEventListener("mouseup", event => {
  console.log('up');
  isDragActivated  = false;
  offset.left = parseInt(map.style.left.replace("px", "")) || 0;
  offset.top = parseInt(map.style.top.replace("px", "")) || 0;
});

mapWrap.addEventListener("mousemove", event => {
  if (isDragActivated)
  {
    map.style.left = offset.left + event.x - startX + "px";
    map.style.top = offset.top + event.y - offsetY - startY + "px";
    console.log('move', offset, event.x - startX, event.y - offsetY - startY);
  }
});