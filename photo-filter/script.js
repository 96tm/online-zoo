const btnFullscreen = document.querySelector(".fullscreen");
const btnNext = document.querySelector(".btn-next");
const btnLoad = document.querySelector(".btn-load--input");
const btnSave = document.querySelector(".btn-save");
const btnReset = document.querySelector(".btn-reset");
const filters = document.querySelector(".filters");
const filterList = ["blur", "invert", "sepia", "saturate", "hue", ];
const units = new Map([["blur", "px"], ["invert","%"],
    ["sepia","%"],
    ["saturate","%"],
    ["hue","deg"],])

const image = document.querySelector("img");
const baseUrl = "https://github.com/rolling-scopes-school/stage1-tasks/tree/assets/images/";

let imageIndex = 0;


window.addEventListener("click", event => {
  if (event.target === btnFullscreen) {
    toggleFullscreen();
  }
  else if (event.target === btnSave) {
    console.log(image.src)
    const tempImage = document.createElement("img");
    tempImage.setAttribute("crossOrigin", "anonymous");
    tempImage.src = image.src;
    tempImage.addEventListener("load", event => {
      const canvas = document.createElement("canvas");
      canvas.width = tempImage.width;
      canvas.height = tempImage.height;
      const ctx = canvas.getContext("2d");
      ctx.filter = getCanvasFilters();
      ctx.drawImage(tempImage, 0, 0);
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      link.delete;
      canvas.remove();
      link.remove();
      tempImage.remove();
    });
  }
  else if (event.target === btnReset) {
    for (let filterLabel of filters.children) {
      const input = filterLabel.querySelector("input");
      let initial = input.name === "saturate" ? 100 : 0;
      const output = filterLabel.querySelector("output");
      output.value = input.value = initial;
    }
    image.style.setProperty("filter", "none");
  }
  else if (event.target === btnNext) {
    const directoryName = getDirectoryName();
    const url = baseUrl + directoryName;
    const image = fetch(url).then(result => {
      console.log(result);
    });
  }
});

function getCanvasFilters() {
  let filters = [];
  filterList.forEach(v => {
    const filterName = v === "hue" ? "hue-rotate" : v;
    const value = image.style.getPropertyValue(`--${v}`);
    if (value) {
      filters.push(`${filterName}(${value})`);
    }
  });
  return filters.join(" ");
}

filters.addEventListener("input", event => {
  const target = event.target;
  if (target.matches("input") && filterList.includes(target.name)) {
    const output = target.closest("label").querySelector("output");
    output.value = target.value;
    const value = output.value + units.get(target.name);
    image.style.setProperty(`--${target.name}`, value);
  }
});


btnLoad.addEventListener("input", event => {
  const files = btnInput.files;
  let file = null;
  if (files.length && (file = files[0])) {
    if (["image/png", "image/jpeg"].includes(file.type)) {
      image.src = URL.createObjectURL(file);
    }
  }
});

function getDirectoryName() {
  const date = new Date();
  const hours = (new Date()).getHours();
  if (hours > 6 && hours < 12) {
    return "morning";
  }
  else if (hours > 11 && hours < 18) {
    return "day";
  }
  else if (hours > 17) {
    return "evening";
  }
  else {
    return "night";
  }
}

/*
  #region fullscreen functionality start
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
/* #endregion fullscreen functionality end */