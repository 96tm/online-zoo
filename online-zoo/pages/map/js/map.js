const map = document.querySelector(".map");
const tooltip = document.querySelector(".tooltip");
const header = document.querySelector(".header");
const y0 = -header.getBoundingClientRect().height;
const mapMarks = new Set(document.querySelectorAll(".map__mark"));
let shown = false;

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