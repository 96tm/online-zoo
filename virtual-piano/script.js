const piano = document.querySelector(".piano");
const btnLetters = document.querySelector(".btn-letters");
const btnNotes = document.querySelector(".btn-notes");

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
  pressedKeys[value] = { pressed: false };
});

window.addEventListener("click", (event) => {
  if (event.target === btnLetters) {
    btnLetters.classList.toggle("btn-active");
    btnNotes.classList.toggle("btn-active");
    for (key of piano.querySelectorAll(".piano-key")) {
      key.classList.add("piano-key-letter");
    }
  } else if (event.target === btnNotes) {
    btnLetters.classList.toggle("btn-active");
    btnNotes.classList.toggle("btn-active");
    for (key of piano.querySelectorAll(".piano-key")) {
      key.classList.remove("piano-key-letter");
    }
  }
});
window.addEventListener("keydown", (event) => {
  const keyCode = event.code;
  const keyboardKey = keyCode[keyCode.length - 1];
  const note = keysToNotes.get(keyboardKey);
  if (note && !pressedKeys[keyboardKey]?.pressed) {
    playNote(note);
    pressedKeys[keyboardKey].pressed = true;
    const pianoKey = document.querySelector(
      `.piano-key[data-letter=${keyboardKey}]`
    );
    pianoKey.classList.toggle("piano-key-active");
  }
});
window.addEventListener("keyup", (event) => {
  const keyCode = event.code;
  const keyboardKey = keyCode[keyCode.length - 1];
  if (keyboardKey !== undefined && pressedKeys[keyboardKey]?.pressed) {
    pressedKeys[keyboardKey].pressed = false;
    const pianoKey = document.querySelector(
      `.piano-key[data-letter=${keyboardKey}]`
    );
    pianoKey.classList.toggle("piano-key-active");
  }
});

piano.addEventListener("mousedown", (event) => {
  if (event.target.classList.contains("piano-key")) {
    const key = event.target;
    const note = key.dataset.note;
    playNote(note);
  }
});

function playNote(note) {
  const audio = new Audio((src = `./assets/audio/${note}.mp3`));
  audio.currentTime = 0;
  audio.play();
}
