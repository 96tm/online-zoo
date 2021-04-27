import {checkDonationInput} from "./functions.js"

const donationInput = document.querySelector(".friend-form__input-amount-number");
const radioButtonsContainer = document.querySelector(".friend-form__amount-radio-buttons");

let lastValidInput = donationInput.value;

radioButtonsContainer.addEventListener("change", event => {
  if (event.target.matches(".friend-form__amount-radio")) {
    donationInput.value = event.target.value;
  }
});

donationInput.addEventListener("input", event => {
  if (checkDonationInput(event, lastValidInput)){
    const value = event.target.value;
    let radio = null;
    if (radio = radioButtonsContainer.querySelector(`#amount-radio-${value}`)) {
      radio.checked = true;
    }
    else {
      if (radio = radioButtonsContainer.querySelector(".friend-form__amount-radio[checked]")) {
        radio.checked = false;
      };
    }
  }
});

donationInput.addEventListener("beforeinput", event => {
  lastValidInput = event.target.value;
});