let isDOBOpen = false;
let dateOfBirth;
let ageUpdateInterval;
const settingCogEl = document.getElementById("settingIcon");
const settingContentEl = document.getElementById("settingContent");
const initialTextEl = document.getElementById("initialText");
const afterDOBBtnTxtEl = document.getElementById("afterDOBBtnTxt");
const dobButtonEl = document.getElementById("dobButton");
const dobInputEl = document.getElementById("dobInput");

const yearEl = document.getElementById("year");
const monthEl = document.getElementById("month");
const dayEl = document.getElementById("day");
const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minute");
const secondEl = document.getElementById("second");

const SESSION_STORAGE_KEY = "lifeTimerSessionDOB";

const makeTwoDigitNumber = (number) => {
  return number > 9 ? number : `0${number}`;
};

const resetTimerDisplay = () => {
  yearEl.innerHTML = "00";
  monthEl.innerHTML = "00";
  dayEl.innerHTML = "00";
  hourEl.innerHTML = "00";
  minuteEl.innerHTML = "00";
  secondEl.innerHTML = "00";
};

const toggleDateOfBirthSelector = () => {
  settingContentEl.classList.toggle("hide");
  isDOBOpen = !isDOBOpen;
};

const calculateAge = (birthDate, currentDate) => {
  const dateDiff = currentDate - birthDate;
  const year = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 365.25));
  const month = Math.floor((dateDiff / (1000 * 60 * 60 * 24 * 30.44)) % 12);
  const day = Math.floor(dateDiff / (1000 * 60 * 60 * 24)) % 30;
  const hour = Math.floor(dateDiff / (1000 * 60 * 60)) % 24;
  const minute = Math.floor(dateDiff / (1000 * 60)) % 60;
  const second = Math.floor(dateDiff / 1000) % 60;

  return { year, month, day, hour, minute, second };
};

const updateAgeDisplay = (age) => {
  yearEl.innerHTML = makeTwoDigitNumber(age.year);
  monthEl.innerHTML = makeTwoDigitNumber(age.month);
  dayEl.innerHTML = makeTwoDigitNumber(age.day);
  hourEl.innerHTML = makeTwoDigitNumber(age.hour);
  minuteEl.innerHTML = makeTwoDigitNumber(age.minute);
  secondEl.innerHTML = makeTwoDigitNumber(age.second);
};

const updateAge = () => {
  if (!dateOfBirth) return;
  const age = calculateAge(dateOfBirth, new Date());
  updateAgeDisplay(age);
};

const startTimer = () => {
  if (ageUpdateInterval) clearInterval(ageUpdateInterval);
  updateAge();
  ageUpdateInterval = setInterval(updateAge, 1000);
};

const contentToggler = () => {
  if (dateOfBirth) {
    initialTextEl.classList.add("hide");
    afterDOBBtnTxtEl.classList.remove("hide");
    startTimer();
  } else {
    resetTimerDisplay();
    afterDOBBtnTxtEl.classList.add("hide");
    initialTextEl.classList.remove("hide");
  }
};

const setDOBHandler = () => {
  const dateString = dobInputEl.value;
  dateOfBirth = dateString ? new Date(dateString) : null;

  if (dateOfBirth) {
    // Store in sessionStorage for refresh persistence
    sessionStorage.setItem(SESSION_STORAGE_KEY, dateOfBirth.toISOString());
    contentToggler();
  } else {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    contentToggler();
  }
};

// On page load
window.addEventListener('load', () => {
  // Check if we're coming from a page refresh or new session
  const persistedDOB = sessionStorage.getItem(SESSION_STORAGE_KEY);
  
  if (persistedDOB) {
    // This is a refresh - restore the DOB
    dateOfBirth = new Date(persistedDOB);
  } else {
    // This is a new session - reset everything
    dateOfBirth = null;
    resetTimerDisplay();
  }
  
  contentToggler();
});

// Clear session storage when tab is closed
window.addEventListener('beforeunload', () => {
  if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
    // Only clear if there was no DOB set (fresh start next time)
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
});

// Event listeners
settingCogEl.addEventListener("click", toggleDateOfBirthSelector);
dobButtonEl.addEventListener("click", setDOBHandler);