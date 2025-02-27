const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

function cleanInputString(str) {
  return str.replace(/[+\-\s]/g, ''); // Remove spaces, +, and -
}

function isInvalidInput(str) {
  return /\d+e\d+/i.test(str); // Check for scientific notation (e.g., 1e3)
}

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  
  if (!targetInputContainer) {
    alert("Error: Please select a valid category!");
    return;
  }

  const entryNumber = targetInputContainer.querySelectorAll('input[type="number"]').length + 1;
  const entryHTML = `
    <div class="entry-group">
      <input type="text" placeholder="Food/Exercise Name" id="${entryDropdown.value}-${entryNumber}-name" required />
      <input type="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories" required />
    </div>`;
  
  targetInputContainer.insertAdjacentHTML('beforeend', entryHTML);
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const categories = ["breakfast", "lunch", "dinner", "snacks", "exercise"];
  const calorieData = {};

  categories.forEach(category => {
    const inputs = document.querySelectorAll(`#${category} input[type='number']`);
    calorieData[category] = getCaloriesFromInputs(inputs);
  });

  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) return;

  const consumedCalories = calorieData.breakfast + calorieData.lunch + calorieData.dinner + calorieData.snacks;
  const remainingCalories = budgetCalories - consumedCalories + calorieData.exercise;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p><strong>${budgetCalories}</strong> Calories Budgeted</p>
    <p><strong>${consumedCalories}</strong> Calories Consumed</p>
    <p><strong>${calorieData.exercise}</strong> Calories Burned</p>
  `;

  output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
  let totalCalories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);

    if (isInvalidInput(currVal) || Number(currVal) < 0 || currVal === "") {
      alert(`Invalid Input: ${currVal || "Empty Field"}`);
      isError = true;
      return 0;
    }
    totalCalories += Number(currVal);
  }
  return totalCalories;
}

function clearForm() {
  document.querySelectorAll('.input-container').forEach(container => container.innerHTML = '');
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
