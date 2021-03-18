const piano = document.querySelector(".piano");
const btnLetters = document.querySelector(".btn-letters");
const btnNotes = document.querySelector(".btn-notes");

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
  const pianoKey = document.querySelector(`[data-letter=${keyboardKey}]`);
  if (pianoKey && pianoKey.dataset.note) {
    playNote(pianoKey.dataset.note);
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
