/* Global Constants */

const TIDE_DATA_URL = "https://api.cybai.re/tide?id=72";
const INTERVAL = 1000;

/* Global Variables */

let isDarkMode = true;
let tide = {};

/* Display Functions */

/**
 * Initiates the theme based on the user's system default theme preference.
 */
const initiateTheme = () => {
  /**
   * The user's system default theme preference.
   *
   * @type {MediaQueryList}
   */
  const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)");

  /**
   * Indicates whether the current theme is dark mode.
   *
   * @type {boolean}
   */
  isDarkMode = defaultTheme.matches;

  /**
   * The value of the 'data-theme' attribute based on the current theme.
   *
   * @type {string}
   */
  const themeAttribute = `${isDarkMode ? "dark" : "light"}-theme`;

  /**
   * The <html> element.
   *
   * @type {HTMLElement}
   */
  const htmlElement = document.querySelector("html");

  // Set the 'data-theme' attribute of the <html> element
  htmlElement.dataset.theme = themeAttribute;
};

function updateHand(degrees) {
  const hand = document.querySelector(".hand");
  hand.style.transform = `rotate(${degrees}deg)`;
}

/* Display Functions */

const fetchTide = async () => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(TIDE_DATA_URL, requestOptions);
    const tideData = await response.json(); // Parse the response as JSON
    tide = tideData;
    return tideData;
  } catch (error) {
    console.error(`Error fetching tide data: ${error}`);
  }
};

const setTime = () => {
  const { last_tide, next_tide } = tide;
  let degrees = 0;

  const now_timestamp = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
  });
  const now = new Date(now_timestamp);

  if (last_tide) {
    const [_, { timestamp: last_timestamp }] = Object.entries(last_tide)[0];
    const [next_tide_type, { timestamp: next_timestamp }] =
      Object.entries(next_tide)[0];
    const last_date = new Date(last_timestamp);
    const next_date = new Date(next_timestamp);

    if ((last_timestamp <= now_timestamp) & (now_timestamp <= next_timestamp)) {
      degrees = calculateDegrees(next_tide_type, now, last_date, next_date);
    } else {
      degrees = next_tide_type == "high_tide" ? 90 : 270; // Keep hand in specific place regarding the last known tide type
      fetchTide(); // Start a fetch to update tide data
      console.error(
        `Last and next tides unsynchronised with now time:\nlast_tide = ${last_timestamp}\nnow = ${now_timestamp}\nnext_tide = ${next_timestamp}`
      );
    }
  } else if (next_tide) {
    // If last tide was the day before, last_tide will be null. We extrapolate last tide from next tide
    const [next_tide_type, { timestamp: next_timestamp }] =
      Object.entries(next_tide)[0];
    const next_date = new Date(next_timestamp);
    const last_date = new Date(next_timestamp);
    last_date.setHours(last_date.getHours() - 6); // Construct a fictional last tide date 6 hours before the next date

    degrees = calculateDegrees(next_tide_type, now, last_date, next_date);
  }

  updateHand(degrees);
};

function calculateDegrees(next_tide_type, now, last_date, next_date) {
  const start = next_tide_type == "low_tide" ? 90 : 270;
  const offset = (180 * (now - last_date)) / (next_date - last_date);
  return start + offset;
}

document.addEventListener("DOMContentLoaded", async function () {
  initiateTheme();
  await fetchTide();
  setTime();
  setInterval(setTime, 60000);
});
