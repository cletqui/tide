/* Global Constants */

const TIDE_DATA_URL = "https://api.cybai.re/tide?name=";
const HARBOURS_DATA_URL = "https://api.cybai.re/tide/harbours?name=";
const INTERVAL = 60000;

/* Global Variables */

let isDarkMode = true;
let harbourName = "";
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

const refreshSearchBar = (harbour = harbourName) => {
  const searchBar = document.getElementById("search-bar");
  window.localStorage.setItem("harbourName", harbour);
  searchBar.placeholder = harbour;
};

/**
 * Updates the position of a hand element on the page by rotating it to the specified degrees.
 *
 * @param {number} degrees - The degrees to rotate the hand element.
 * @returns {void}
 */
const updateHand = (degrees) => {
  const hand = document.querySelector(".hand");
  hand.style.transform = `rotate(${degrees}deg)`;
};

/**
 * Sets the time and updates the hand position based on the current tide information.
 *
 * @function setTime
 * @returns {void}
 */
const setTime = () => {
  const { last_tide, next_tide } = tide;
  let degrees = 0;

  const now_timestamp = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
  });
  const now = createDateObject(now_timestamp);

  if (last_tide) {
    const [_, { timestamp: last_timestamp }] = Object.entries(last_tide)[0];
    const [next_tide_type, { timestamp: next_timestamp }] =
      Object.entries(next_tide)[0];
    const last_date = createDateObject(last_timestamp);
    const next_date = createDateObject(next_timestamp);

    if (last_timestamp <= now_timestamp && now_timestamp <= next_timestamp) {
      degrees = calculateDegrees(next_tide_type, now, last_date, next_date);
    } else {
      degrees = next_tide_type == "high_tide" ? 90 : 270; // Keep hand in specific place regarding the last known tide type
      fetchTide().then((tideData) => (tide = tideData)); // Update tide data to fetch new next tide
    }
  } else if (next_tide) {
    // If last tide was the day before, last_tide will be null. We extrapolate last tide from next tide
    const [next_tide_type, { timestamp: next_timestamp }] =
      Object.entries(next_tide)[0];
    const next_date = createDateObject(next_timestamp);
    const last_date = createDateObject(next_timestamp);
    last_date.setHours(last_date.getHours() - 6); // Construct a fictional last tide date 6 hours before the next date

    degrees = calculateDegrees(next_tide_type, now, last_date, next_date);
  }

  updateHand(degrees);
};

/* Operating Functions */

/**
 * Fetches tide data from the specified URL and returns it as JSON.
 *
 * @async
 * @function fetchTide
 * @returns {Promise<Object>} A promise that resolves to the fetched tide data as JSON.
 * @throws {Error} If there is an error fetching the tide data.
 */
const fetchTide = async (name) => {
  // const response = await fetch("../tide.json");
  // return await response.json();
  // TODO sanitize name input
  const url = `${TIDE_DATA_URL}Roscoff`;
  console.log(url);
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(TIDE_DATA_URL, requestOptions);
    return await response.json(); // Parse the response as JSON
  } catch (error) {
    console.error(`Error fetching tide data: ${error}`);
  }
};

const fetchHarbours = async (name) => {
  // TODO sanitize name
  const url = `${HARBOURS_DATA_URL}${name}`;
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, requestOptions);
    return await response.json(); // Parse the response as JSON
  } catch (error) {
    console.error(`Error fetching tide data: ${error}`);
  }
};

/**
 * Creates a Date object from a timestamp string in "dd/mm/yyyy hh:mm:ss" format.
 *
 * @param {string} timestamp - The timestamp string to create the Date object from.
 * @returns {Date|undefined} The created Date object, or undefined if the timestamp is invalid.
 */
const createDateObject = (timestamp) => {
  const [date, time] = timestamp.split(" ");
  if (date && time) {
    [day, month, year] = date.split("/");
    [hours, minutes, seconds] = time.split(":");
    return new Date(year, month, day, hours, minutes, seconds);
  }
};

/**
 * Calculates the degrees for the next tide based on the current time and previous and next tide dates.
 *
 * @param {string} next_tide_type - The type of the next tide ("low_tide" or "high_tide").
 * @param {number} now - The current time in milliseconds since January 1, 1970.
 * @param {number} last_date - The date of the previous tide in milliseconds since January 1, 1970.
 * @param {number} next_date - The date of the next tide in milliseconds since January 1, 1970.
 * @returns {number} The degrees for the next tide.
 */
const calculateDegrees = (next_tide_type, now, last_date, next_date) => {
  const start = next_tide_type == "low_tide" ? 90 : 270;
  const offset = (180 * (now - last_date)) / (next_date - last_date);
  return start + offset;
};

/**
 * Handles the input event of a search bar.
 *
 * @param {KeyboardEvent} event - The input event object.
 * @returns {void}
 */
const searchBarInput = async (event) => {
  if (event.key === "Enter") {
    const harbour = event.target.value;
    const nearestHarbours = await fetchHarbours(harbour);
    console.log(nearestHarbours);
    refreshSearchBar(harbour);
    event.target.value = "";
  }
};

/* Startup Function */

/**
 * Adds event listeners to various buttons in the application.
 */
const addEventListeners = () => {
  const searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("keypress", (e) => searchBarInput(e));
};

document.addEventListener("DOMContentLoaded", async function () {
  // TODO initiate the clock with the nearest harbour
  addEventListeners();
  initiateTheme();
  refreshSearchBar();
  tide = await fetchTide();
  setTime();
  setInterval(setTime, INTERVAL);
});
