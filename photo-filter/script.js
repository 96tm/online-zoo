// #region state and constants start
const btnFullscreen = document.querySelector(".fullscreen");
const btnNext = document.querySelector(".btn-next");
const btnLoad = document.querySelector(".btn-load--input");
const btnSave = document.querySelector(".btn-save");
const btnReset = document.querySelector(".btn-reset");
const filters = document.querySelector(".filters");
const image = document.querySelector("img");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const filterList = ["blur", "invert", "sepia", "saturate", "hue", ];
const units = new Map([
    ["blur", "px"],
    ["invert","%"],
    ["sepia","%"],
    ["saturate","%"],
    ["hue","deg"],]);
const baseUrl = "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";

let imageIndex = 1;
let directoryName = getDirectoryName();
// #endregion state and constants end

// #region event listeners start
window.addEventListener("click", event => {
  if (event.target === btnFullscreen) {
    toggleFullscreen();
  }
  else if (event.target === btnSave) {
    const tempImage = document.createElement("img");
    tempImage.setAttribute("crossOrigin", "anonymous");
    tempImage.addEventListener("load", event => {
      canvas.width = tempImage.width;
      canvas.height = tempImage.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imageToCanvasRatio = Math.hypot(image.width,
                                            image.height)
                                  / Math.hypot(tempImage.width,
                                              tempImage.height);
      ctx.filter = getCanvasFilters(imageToCanvasRatio);
      ctx.drawImage(tempImage, 0, 0);
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      link.remove();
      tempImage.remove();
    });
    tempImage.src = image.src;
  }
  else if (event.target === btnReset) {
    for (let filterLabel of filters.children) {
      const input = filterLabel.querySelector("input");
      let initial = input.name === "saturate" ? 100 : 0;
      const output = filterLabel.querySelector("output");
      output.value = input.value = initial;
      image.style.setProperty(`--${input.name}`, initial + units.get(input.name));
    }
  }
  else if (event.target === btnNext) {
    const newDirectoryName = getDirectoryName();
    if (directoryName !== newDirectoryName) {
      directoryName = newDirectoryName;
      imageIndex = 1;
    }
    const url = baseUrl + directoryName + "/"
                + imageIndex.toString().padStart(2, "0") + ".jpg";
    image.src = url;
    imageIndex = Math.max(1, ((imageIndex + 1) % 21));
  }
  btnLoad.value = "";
});

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
  console.log('load file');
  const files = btnInput.files;
  let file = null;
  if (files.length && (file = files[0])) {
    console.log('got file', file);
    if (["image/png", "image/jpeg"].includes(file.type)) {
      console.log('loaded');
      image.src = URL.createObjectURL(file);
    }
  }
});
// #endregion event listeners start

// #region helpers start
function getDirectoryName() {
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

function getCanvasFilters(blurRatio) {
  let filters = [];
  filterList.forEach(v => {
    const filterName = v === "hue" ? "hue-rotate" : v;
    let value = image.style.getPropertyValue(`--${v}`);
    if (value) {
      if (v === "blur") {
        value = value.slice(0, -2) / blurRatio + "px";
      }
      filters.push(`${filterName}(${value})`);
    }
  });
  return filters.join(" ");
}
// #endregion helpers end

// #region fullscreen functionality start
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
// #endregion fullscreen functionality end