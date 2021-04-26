const foldButton = document.querySelector(".info-body__button");
const info = document.querySelector(".info__body");
let folded = false;

foldButton.addEventListener("click", event => {
  console.log(info.style.height, info.scrollHeight + "px", (info.style.height !== info.scrollHeight + "px"));
  if (folded) {
    console.log('unfold')
    info.style.height = info.scrollHeight + "px";
    event.target.textContent = "Read less";
  }
  else {
    console.log('fold')
    info.style.height = 500 + "px";
    event.target.textContent = "Read more";
  }
  folded = !folded;
});