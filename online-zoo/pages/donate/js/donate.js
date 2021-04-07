const donationInput = document.querySelector(".friend-form__input-amount-number");

donationInput.addEventListener("keydown", checkLength);

function checkLength(event){
  console.log(event)
  if (donationInput.value.length >= 4 && event.code !== "Backspace") {
    event.preventDefault();
  }
}