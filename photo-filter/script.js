const btnFullscreen = document.querySelector('.fullscreen');
const btnLoad = document.querySelector('.btn-load--input');
const filters = document.querySelector('.filters');
const filterList = ['blur', 'invert', 'sepia', 'saturate', 'hue', ];
const image = document.querySelector('img');

window.addEventListener('click', event => {
  if (event.target === btnFullscreen) {
    toggleFullscreen();
  }
});

filters.addEventListener('input', event => {
  const target = event.target;
  if (target.matches('input') && filterList.includes(target.name)) {
    const output = target.closest('label').querySelector('output');
    output.value = target.value;
  }
});

btnLoad.addEventListener('input', event => {
  const files = btnInput.files;
  let file = null;
  if (files.length && (file = files[0])) {
    if (["image/png", "image/jpeg"].includes(file.type)) {
      image.src = URL.createObjectURL(file);
    }
  }
});

/*
  fullscreen functionality
*/
function toggleFullscreen () {
  if (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement
  ) {
    exitFullscreen();
  } else {
    enterFullscreen(document.body);
  }
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}