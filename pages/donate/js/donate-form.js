import {checkDonationInput} from "./functions.js"

const donationAmountInputs = document.querySelectorAll(".amount-input");

let lastValidInput = donationAmountInputs[0].value;

donationAmountInputs.forEach(input => {
  input.addEventListener("beforeinput", event => {
    lastValidInput = event.target.value;
  });
})

donationAmountInputs.forEach((input, index) => {
  input.addEventListener("input", event => {
    if (checkDonationInput(event, lastValidInput)) {
      donationAmountInputs[+!index].value = input.value;
    }
  });
})