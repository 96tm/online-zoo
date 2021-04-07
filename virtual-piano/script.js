const piano = document.querySelector(".piano");
const btnLetters = document.querySelector(".btn-letters");
const btnNotes = document.querySelector(".btn-notes");
const btnFullscreen = document.querySelector(".fullscreen");
let mouseDown = false;

const keysToNotes = new Map([
  ["D", "c"],
  ["R", "c♯"],
  ["F", "d"],
  ["T", "d♯"],
  ["G", "e"],
  ["H", "f"],
  ["U", "f♯"],
  ["J", "g"],
  ["I", "g♯"],
  ["K", "a"],
  ["O", "a♯"],
  ["L", "b"],
]);

let pressedKeys = {};
[...keysToNotes.keys()].forEach((value) => {
  pressedKeys[value] = { pressed: false, mousePressed: false };
});

window.addEventListener("click", (event) => {
  if (event.target === btnLetters) {
    btnLetters.classList.toggle("btn-active");
    btnNotes.classList.toggle("btn-active");
    for (key of piano.querySelectorAll(".piano-key")) {
      key.classList.toggle("piano-key-letter");
    }
  } else if (event.target === btnNotes) {
    btnLetters.classList.toggle("btn-active");
    btnNotes.classList.toggle("btn-active");
    for (key of piano.querySelectorAll(".piano-key")) {
      key.classList.toggle("piano-key-letter");
    }
  } else if (event.target === btnFullscreen) {
    if (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement
    ) {
      deactivateFullscreen();
    } else {
      activateFullscreen(document.body);
    }
  }
});
window.addEventListener("keydown", (event) => {
  const keyCode = event.code;
  const keyboardKey = keyCode[keyCode.length - 1];
  const note = keysToNotes.get(keyboardKey);
  if (note && !pressedKeys[keyboardKey]?.pressed) {
    pressedKeys[keyboardKey].pressed = true;
    if (!pressedKeys[keyboardKey]?.mousePressed) {
      playNote(note);
      const pianoKey = document.querySelector(
        `.piano-key[data-letter=${keyboardKey}]`
      );
      pianoKey.classList.toggle("piano-key-active");
    }
  }
});
window.addEventListener("keyup", (event) => {
  const keyCode = event.code;
  const keyboardKey = keyCode[keyCode.length - 1];
  if (pressedKeys[keyboardKey]) {
    pressedKeys[keyboardKey].pressed = false;
    if (!pressedKeys[keyboardKey].mousePressed) {
      const pianoKey = document.querySelector(
        `.piano-key[data-letter=${keyboardKey}]`
      );
      pianoKey.classList.remove("piano-key-active");
    }
  }
});

piano.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    const target = event.target;
    if (target.classList.contains("piano-key")) {
      mouseDown = true;
      const note = target.dataset.note;
      const letter = target.dataset.letter;
      pressedKeys[letter].mousePressed = true;
      if (!pressedKeys[letter].pressed) {
        target.classList.toggle("piano-key-active");
        playNote(note);
      }
    }
  }
});
window.addEventListener("mouseup", (event) => {
  if (event.button === 0) {
    mouseDown = false;
    const target = event.target;
    Object.keys(pressedKeys).forEach((value) => {
      pressedKeys[value].mousePressed = false;
    });
    const keys = document.querySelectorAll(".piano-key");
    for (key of keys) {
      const letter = key.dataset.letter;
      if (!pressedKeys[letter]?.pressed) {
        key.classList.remove("piano-key-active");
      }
    }
  }
});
window.addEventListener("mouseover", (event) => {
  target = event.target;
  if (mouseDown && target.classList.contains("piano-key")) {
    target.dispatchEvent(
      new MouseEvent("mousedown", {
        button: 0,
        bubbles: true,
      })
    );
  }
});
piano.addEventListener("mouseout", (event) => {
  target = event.target;
  if (mouseDown && target.classList.contains("piano-key")) {
    pressedKeys[target.dataset.letter].mousePressed = false;
    if (!pressedKeys[target.dataset.letter].pressed) {
      target.classList.remove("piano-key-active");
    }
  }
});
window.addEventListener("contextmenu", (event) => {
  Object.keys(pressedKeys).forEach((value) => {
    pressedKeys[value].mousePressed = false;
    pressedKeys[value].pressed = false;
  });
  document.querySelectorAll(".piano-key").forEach((pianoKey) => {
    pianoKey.classList.remove("piano-key-active");
  });
  mouseDown = false;
});

function playNote(note) {
  const audio = new Audio((src = `./assets/audio/${note}.mp3`));
  audio.currentTime = 0;
  audio.play();
}

function activateFullscreen(element) {
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
function deactivateFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
document.addEventListener("fullscreenchange", (event) => {
  btnFullscreen.classList.toggle("exitfullscreen");
});
