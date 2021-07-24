export function checkDonationInput(event, lastValid) {
  if (!/^(?!0)\d{1,4}$/.test(event.target.value)) {
    event.target.value = lastValid;
    return false;
  }
  return true;
}