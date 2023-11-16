/* Global Constants */

const TIDE_DATA_URL = "https://data.cybai.re/tide";
const HARBOURS_DATA_URL = "https://data.cybai.re/tide/harbours";

const iconPath = "./icons/";
const getIconPath = (icon) => `${iconPath}${icon}.svg`;

const icons = {
  BURGER: getIconPath("menu-burger"),
  COMPRESS: getIconPath("compress"),
  CROSS: getIconPath("cross"),
  CROSS_CIRCLE: getIconPath("cross-circle"),
  EXPAND: getIconPath("expand"),
  INFO: getIconPath("info"),
  MOON: getIconPath("moon"),
  SUN: getIconPath("sun"),
};

const INTERVAL = 60000;

/* Global Variables */

let isDarkMode = true;
let globalHarbour = {};
let globalTide = {};

/* Display Functions */

/**
 * Shows or hides the menu and updates the menu button icon accordingly.
 */
const showMenu = () => {
  const header = document.getElementById("header");
  const menuButton = document.getElementById("menu-icon");
  header.classList.toggle("menu-visible");
  menuButton.src = header.classList.contains("menu-visible")
    ? icons.CROSS
    : icons.BURGER;
};

/**
 * Initiates the theme based on the user's preferred color scheme.
 *
 * @function initiateTheme
 * @returns {void}
 */
const initiateTheme = () => {
  isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = `${
    isDarkMode ? "dark" : "light"
  }-theme`;
};

/**
 * Toggles the theme between dark mode and light mode.
 */
const toggleTheme = () => {
  isDarkMode = !isDarkMode;
  document.getElementById("theme-icon").src = isDarkMode
    ? icons.MOON
    : icons.SUN;
  document.documentElement.dataset.theme = `${
    isDarkMode ? "dark" : "light"
  }-theme`;
};

/**
 * Toggles the full screen mode and updates the full screen icon accordingly.
 */
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  document.getElementById("full-screen-icon").src = document.fullscreenElement
    ? icons.COMPRESS
    : icons.EXPAND;
};

/**
 * Toggles the visibility of information elements and updates the info icon accordingly.
 */
const toggleInfo = () => {
  document.querySelectorAll(".info").forEach((element) => {
    element.classList.toggle("show");
  });
  document.getElementById("info-icon").src = document
    .getElementById("coeff")
    .classList.contains("show")
    ? icons.CROSS_CIRCLE
    : icons.INFO;
};

/**
 * Updates the search bar with the specified harbour information.
 *
 * @function updateSearchBar
 * @param {Object} harbour - The harbour object containing the name property.
 * @param {string} harbour.name - The name of the harbour.
 * @returns {void}
 */
const updateSearchBar = (harbour) => {
  const searchBar = document.getElementById("search-bar");
  searchBar.placeholder = harbour?.name || "";
  searchBar.title = harbour?.name || "Port";
  searchBar.value = "";
};

/**
 * Clears the value of the search bar.
 *
 * @function clearSearchBar
 * @returns {void}
 */
const clearSearchBar = () => {
  document.getElementById("search-bar").value = "";
};

/**
 * Clears the harbour information in the search bar.
 *
 * @function clearHarbour
 * @returns {void}
 */
const clearHarbour = () => {
  const searchBar = document.getElementById("search-bar");
  searchBar.placeholder = "";
  searchBar.title = "Port";
};

/**
 * Shows the harbour information in the search bar.
 *
 * @function showHarbour
 * @returns {void}
 */
const showHarbour = () => {
  const { name } = getHarbour();
  const searchBar = document.getElementById("search-bar");
  searchBar.placeholder = name;
  searchBar.title = name;
};

/**
 * Shows the dropdown element.
 *
 * @function showDropdown
 * @returns {void}
 */
const showDropdown = () => {
  document.getElementById("search-dropdown").style.display = "block";
};

/**
 * Hides the dropdown element.
 *
 * @function hideDropdown
 * @returns {void}
 */
const hideDropdown = () => {
  const dropdown = document.getElementById("search-dropdown");
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }
  dropdown.style.display = "none";
};

/**
 * Handles the click event outside the box element to hide the dropdown.
 *
 * @function handleClickOutsideDropdown
 * @param {MouseEvent} event - The click event object.
 * @returns {void}
 */
function handleClickOutsideDropdown(event) {
  const dropdown = document.getElementById("search-dropdown");
  const searchBar = document.getElementById("search-bar");

  if (
    dropdown.style.display === "block" &&
    (!dropdown.contains(event.target) || !searchBar.contains(event.target))
  ) {
    hideDropdown();
  }
}

/**
 * Updates the position of a hand element on the page by rotating it to the specified degrees.
 *
 * @function updateHand
 * @param {number} degrees - The degrees to rotate the hand element.
 * @returns {void}
 */
const updateHand = (degrees) => {
  document.querySelector(
    ".hand"
  ).style.webkitTransform = `rotate(${degrees}deg)`;
};

/**
 * Updates the information display with details from the last and next tide events.
 *
 * @param {Object} last_tide - Object containing details of the last tide event.
 * @param {Object} next_tide - Object containing details of the next tide event.
 * @returns {void} - The function updates the content of specific DOM elements:
 *   - 'pm-info': Displays the time and height of the next high tide or last tide.
 *   - 'bm-info': Displays the time and height of the last high tide or next tide.
 *   - 'coeff': Displays the coefficient information with a fallback to 'N/A' if unavailable.
 */
const updateInfo = (last_tide, next_tide) => {
  const { time: last_time, high: last_high, coeff: last_coeff } = last_tide;
  const {
    type: next_type,
    time: next_time,
    high: next_high,
    coeff: next_coeff,
  } = next_tide;

  const last_info = `${last_time} (${last_high})`;
  const next_info = `${next_time} (${next_high})`;

  document.getElementById("pm-info").innerText =
    next_type == "high_tide" ? next_info : last_info;
  document.getElementById("bm-info").innerText =
    next_type == "high_tide" ? last_info : next_info;
  document.getElementById("coeff").innerText = `coeff. ${
    last_coeff || next_coeff || "N/A"
  }`;
};

/**
 * Sets the global harbour and updates the search bar with the harbour information.
 *
 * @function setHarbour
 * @param {Object} harbour - The harbour object to be set as the global harbour.
 * @param {string} harbour.name - The name of the harbour.
 * @returns {void}
 */
const setHarbour = (harbour) => {
  globalHarbour = harbour;
  window.localStorage.setItem("harbour", JSON.stringify(harbour));
  updateSearchBar(harbour);
};

/**
 * Sets the tide data and stores it in the global variable and local storage.
 * @param {Object} tide - The tide data object.
 * @param {Object} tide.last_tide - The last tide data.
 * @param {Object} tide.next_tide - The next tide data.
 * @returns {void}
 */
const setTide = (tide) => {
  globalTide = tide;
  window.localStorage.setItem("last_tide", JSON.stringify(tide.last_tide));
  window.localStorage.setItem("next_tide", JSON.stringify(tide.next_tide));
};

/**
 * Sets the time and updates the hand position based on the current tide information.
 *
 * @function setTime
 * @returns {void}
 */
const setTime = () => {
  const { last_tide, next_tide } = getTide();
  let degrees = 0;

  if (last_tide && Object.keys(last_tide).length > 0) {
    if (calculateDegrees(last_tide, next_tide)) {
      degrees = calculateDegrees(last_tide, next_tide);
    } else {
      degrees = next_tide_type == "high_tide" ? 90 : 270; // Keep hand in specific place regarding the last known tide type
      fetchTide(globalHarbour).then((tideData) => setTide(tideData)); // Update tide data to fetch new next tide
    }
  } else if (next_tide && Object.keys(next_tide).length > 0) {
    const { type, timestamp } = next_tide;

    const extrapolate_date = createDateObject(timestamp); // Construct a fictional last tide date 6 hours before the next date
    extrapolate_date.setHours(extrapolate_date.getHours() - 6);

    const last_tide = {
      type: type == "low_tide" ? "high_tide" : "low_tide",
      time: `${extrapolate_date.getHours()}h${extrapolate_date.getMinutes()}`,
      high: "unknown",
      timestamp: extrapolate_date.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      }),
    };
    degrees = calculateDegrees(last_tide, next_tide);
  }

  updateInfo(last_tide, next_tide);
  updateHand(degrees);
};

/* Operating Functions */

/**
 * Initializes the harbour based on the stored value in local storage or provides a default harbour.
 *
 * @function initHarbour
 * @returns {Object} - The harbour object with id and name properties.
 */
const initHarbour = () => {
  return (
    JSON.parse(window.localStorage.getItem("harbour")) || {
      id: 72,
      name: "Roscoff",
    }
  );
};

/**
 * Retrieves the harbour from the global variable or local storage.
 *
 * @function getHarbour
 * @returns {string|null} - The harbour value, or null if not found.
 */
const getHarbour = () => {
  return globalHarbour || JSON.parse(window.localStorage.getItem("harbour"));
};

/**
 * Retrieves the tide data from the global variable or local storage.
 *
 * @function getTide
 * @returns {Object|null} - The tide data object, or null if not found.
 */
const getTide = () => {
  return Object.keys(globalTide).length
    ? globalTide
    : {
        last_tide: JSON.parse(window.localStorage.getItem("last_tide")),
        next_tide: JSON.parse(window.localStorage.getItem("next_tide")),
      };
};

/**
 * Fetches tide data from the specified URL and returns it as JSON.
 *
 * @async
 * @function fetchTide
 * @returns {Promise<Object>} - A promise that resolves to the fetched tide data as JSON.
 * @throws {Error} - If there is an error fetching the tide data.
 */

const fetchTide = async (harbour) => {
  try {
    const response = await fetch(`${TIDE_DATA_URL}?id=${harbour.id}`);
    return response.json();
  } catch (error) {
    throw new Error(`Error fetching tide data: ${error}`);
  }
};

/**
 * Fetches harbour data based on the specified name.
 *
 * @async
 * @function fetchHarbours
 * @param {string} name - The name of the harbour.
 * @returns {Promise<Object>} - A promise that resolves to the harbour data as an object.
 */
const fetchHarbours = async (name) => {
  try {
    const response = await fetch(`${HARBOURS_DATA_URL}?name=${name}`);
    return response.json();
  } catch (error) {
    throw new Error(`Error fetching harbour data: ${error}`);
  }
};

/**
 * Creates a dropdown element based on the nearest harbours data.
 *
 * @function createDropdown
 * @param {Object} nearestHarbours - The object containing the nearest harbours data.
 * @param {Array<Object>} nearestHarbours.availableHarbours - The array of available harbour objects.
 * @param {Array<Object>} nearestHarbours.nearHarbours - The array of near harbour objects.
 * @returns {void}
 */
const createDropdown = (nearestHarbours) => {
  const dropdown = document.getElementById("search-dropdown");
  const keys = Object.keys(nearestHarbours);

  if (keys.includes("availableHarbours") && keys.includes("nearHarbours")) {
    if (nearestHarbours.availableHarbours.length > 0) {
      appendHarbours(
        dropdown,
        nearestHarbours.availableHarbours,
        "Port disponible:",
        "availableHarbours"
      );
    }

    if (nearestHarbours.nearHarbours.length > 0) {
      appendHarbours(
        dropdown,
        nearestHarbours.nearHarbours,
        "Port proche:",
        "nearHarbours"
      );
    }

    if (
      nearestHarbours.availableHarbours.length === 0 &&
      nearestHarbours.nearHarbours.length === 0
    ) {
      appendHarbours(dropdown, [], "Aucun port trouvé.", "error");
    }
  }
};

/**
 * Appends harbour elements to the dropdown.
 *
 * @function appendHarbours
 * @param {HTMLElement} dropdown - The dropdown element to append the harbour elements to.
 * @param {Array<Object>} harbours - The array of harbour objects to be appended.
 * @param {string} titleText - The text content of the title element.
 * @param {string} titleId - The id of the title element.
 * @returns {void}
 */
const appendHarbours = (dropdown, harbours, titleText, titleId) => {
  const titleChild = document.createElement("div");
  titleChild.id = titleId;
  titleChild.innerText = titleText;
  dropdown.appendChild(titleChild);

  for (const harbour of harbours) {
    const harbourChild = document.createElement("a");
    harbourChild.id = harbour.harbour.id;
    harbourChild.innerText = harbour.harbour.name;
    harbourChild.addEventListener("click", (e) => selectDropdown(e));
    dropdown.appendChild(harbourChild);
  }
};

/**
 * Handles the selection of a dropdown item.
 *
 * @function selectDropdown
 * @param {Event} event - The event object representing the selection.
 * @param {string} event.target.id - The id of the selected dropdown item.
 * @param {string} event.target.innerText - The text content of the selected dropdown item.
 * @returns {void}
 */
const selectDropdown = async (event) => {
  const harbour = { id: event.target.id, name: event.target.innerText };
  setHarbour(harbour);

  const tide = await fetchTide(harbour);
  setTide(tide);

  setTime();

  clearSearchBar();
  updateSearchBar(harbour);
  document.activeElement.blur();
  hideDropdown();
};

/**
 * Creates a Date object from a timestamp string in "dd/mm/yyyy hh:mm:ss" format.
 *
 * @function createDateObject
 * @param {string} timestamp - The timestamp string to create the Date object from.
 * @returns {Date|undefined} The created Date object, or undefined if the timestamp is invalid.
 */
const createDateObject = (timestamp) => {
  const [date, time] = timestamp.split(" ");
  if (date && time) {
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
};

/**
 * Calculates the degrees for the next tide based on the current time and previous and next tide dates.
 * @param {Object} last_tide - The object representing the last tide.
 * @param {string} last_tide.timestamp - The timestamp of the last tide.
 * @param {Object} next_tide - The object representing the next tide.
 * @param {string} next_tide.type - The type of the next tide ("low_tide" or "high_tide").
 * @param {string} next_tide.timestamp - The timestamp of the next tide.
 * @returns {number|null} - The degrees for the next tide, or null if there is an error.
 */
const calculateDegrees = (last_tide, next_tide) => {
  try {
    const now = createDateObject(
      new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
    );
    const last_date = createDateObject(last_tide.timestamp);
    const next_date = createDateObject(next_tide.timestamp);

    const start = next_tide.type == "low_tide" ? 90 : 270;
    const offset = (180 * (now - last_date)) / (next_date - last_date);

    return start + offset;
  } catch (error) {
    return null;
  }
};

/**
 * Handles the input event of a search bar.
 *
 * @async
 * @function searchBarInput
 * @param {KeyboardEvent} event - The input event object.
 * @returns {void}
 */
const searchBarInput = async (event) => {
  if (event.key === "Enter") {
    const searchInput = event.target.value;
    const nearestHarbours = await fetchHarbours(searchInput);

    if (nearestHarbours.hasOwnProperty("harbour")) {
      const { harbour } = nearestHarbours;
      clearSearchBar();
      setHarbour(harbour);
      updateSearchBar(harbour);

      const tide = await fetchTide(harbour);
      setTide(tide);

      setTime();

      document.activeElement.blur();
    } else if (
      nearestHarbours.hasOwnProperty("availableHarbours") ||
      nearestHarbours.hasOwnProperty("nearHarbours")
    ) {
      createDropdown(nearestHarbours);
      showDropdown();
    }
  }
};

/* Startup Function */

/**
 * Adds event listeners to the search bar for handling keypress events.
 *
 * @function addEventListeners
 * @returns {void}
 */
const addEventListeners = () => {
  document.getElementById("menu-button").addEventListener("click", showMenu);

  document
    .getElementById("theme-button")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("full-screen-button")
    .addEventListener("click", toggleFullScreen);
  document.getElementById("info-button").addEventListener("click", toggleInfo);

  document.addEventListener("click", handleClickOutsideDropdown);

  document
    .getElementById("search-bar")
    .addEventListener("focusin", clearHarbour);
  document
    .getElementById("search-bar")
    .addEventListener("focusout", showHarbour);
  document
    .getElementById("search-bar")
    .addEventListener("keypress", searchBarInput);
};

document.addEventListener("DOMContentLoaded", async function () {
  addEventListeners();
  initiateTheme();

  const harbour = initHarbour();
  setHarbour(harbour);

  const tide = await fetchTide(harbour);
  setTide(tide);

  setTime();
  setInterval(setTime, INTERVAL);
});
