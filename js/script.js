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

const hand = document.querySelector(".hand");

async function fetchTide() {
  //const response = await fetch("https://api.cybai.re/tide?id=72");
  const response = {
    id: 72,
    name: "Roscoff",
    forecast: {
      date_index: "20231112",
      date: "Dim. 12 novembre 2023",
      tide_data: [
        {
          high_tide: {
            time: "05h09",
            high: "8,45m",
            coeff: "79",
            timestamp: "12/11/2023 05:09:00",
          },
        },
        {
          low_tide: {
            time: "11h30",
            high: "2,02m",
            timestamp: "12/11/2023 11:30:00",
          },
        },
        {
          high_tide: {
            time: "17h23",
            high: "8,54m",
            coeff: "82",
            timestamp: "12/11/2023 17:23:00",
          },
        },
        {
          low_tide: {
            time: "23h48",
            high: "1,86m",
            timestamp: "12/11/2023 23:48:00",
          },
        },
      ],
    },
    last_tide: {
      high_tide: {
        time: "05h09",
        high: "8,45m",
        coeff: "79",
        timestamp: "12/11/2023 05:09:00",
      },
    },
    next_tide: {
      low_tide: {
        time: "11h30",
        high: "2,02m",
        timestamp: "12/11/2023 11:30:00",
      },
    },
    data: {
      202311120: {
        date: "Dim. 12 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "05h09",
              high: "8,45m",
              coeff: "79",
              timestamp: "12/11/2023 05:09:00",
            },
          },
          {
            low_tide: {
              time: "11h30",
              high: "2,02m",
              timestamp: "12/11/2023 11:30:00",
            },
          },
          {
            high_tide: {
              time: "17h23",
              high: "8,54m",
              coeff: "82",
              timestamp: "12/11/2023 17:23:00",
            },
          },
          {
            low_tide: {
              time: "23h48",
              high: "1,86m",
              timestamp: "12/11/2023 23:48:00",
            },
          },
        ],
      },
      202311121: {
        date: "Lun. 13 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "05h43",
              high: "8,65m",
              coeff: "84",
              timestamp: "13/11/2023 05:43:00",
            },
          },
          {
            low_tide: {
              time: "12h05",
              high: "1,80m",
              timestamp: "13/11/2023 12:05:00",
            },
          },
          {
            high_tide: {
              time: "17h58",
              high: "8,66m",
              coeff: "86",
              timestamp: "13/11/2023 17:58:00",
            },
          },
        ],
      },
      202311122: {
        date: "Mar. 14 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "00h23",
              high: "1,75m",
              coeff: "87",
              timestamp: "14/11/2023 00:23:00",
            },
          },
          {
            low_tide: {
              time: "06h15",
              high: "8,75m",
              timestamp: "14/11/2023 06:15:00",
            },
          },
          {
            high_tide: {
              time: "12h41",
              high: "1,70m",
              coeff: "87",
              timestamp: "14/11/2023 12:41:00",
            },
          },
          {
            low_tide: {
              time: "18h32",
              high: "8,68m",
              timestamp: "14/11/2023 18:32:00",
            },
          },
        ],
      },
      202311123: {
        date: "Mer. 15 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "00h58",
              high: "1,77m",
              coeff: "86",
              timestamp: "15/11/2023 00:58:00",
            },
          },
          {
            low_tide: {
              time: "06h48",
              high: "8,76m",
              timestamp: "15/11/2023 06:48:00",
            },
          },
          {
            high_tide: {
              time: "13h17",
              high: "1,71m",
              coeff: "84",
              timestamp: "15/11/2023 13:17:00",
            },
          },
          {
            low_tide: {
              time: "19h07",
              high: "8,59m",
              timestamp: "15/11/2023 19:07:00",
            },
          },
        ],
      },
      202311124: {
        date: "Jeu. 16 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "01h34",
              high: "1,90m",
              coeff: "82",
              timestamp: "16/11/2023 01:34:00",
            },
          },
          {
            low_tide: {
              time: "07h23",
              high: "8,67m",
              timestamp: "16/11/2023 07:23:00",
            },
          },
          {
            high_tide: {
              time: "13h55",
              high: "1,85m",
              coeff: "79",
              timestamp: "16/11/2023 13:55:00",
            },
          },
          {
            low_tide: {
              time: "19h45",
              high: "8,38m",
              timestamp: "16/11/2023 19:45:00",
            },
          },
        ],
      },
      202311125: {
        date: "Ven. 17 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "02h12",
              high: "2,17m",
              coeff: "75",
              timestamp: "17/11/2023 02:12:00",
            },
          },
          {
            low_tide: {
              time: "08h03",
              high: "8,45m",
              timestamp: "17/11/2023 08:03:00",
            },
          },
          {
            high_tide: {
              time: "14h35",
              high: "2,12m",
              coeff: "71",
              timestamp: "17/11/2023 14:35:00",
            },
          },
          {
            low_tide: {
              time: "20h28",
              high: "8,06m",
              timestamp: "17/11/2023 20:28:00",
            },
          },
        ],
      },
      202311126: {
        date: "Sam. 18 novembre 2023",
        tide_data: [
          {
            high_tide: {
              time: "02h54",
              high: "2,55m",
              coeff: "66",
              timestamp: "18/11/2023 02:54:00",
            },
          },
          {
            low_tide: {
              time: "08h48",
              high: "8,13m",
              timestamp: "18/11/2023 08:48:00",
            },
          },
          {
            high_tide: {
              time: "15h22",
              high: "2,50m",
              coeff: "61",
              timestamp: "18/11/2023 15:22:00",
            },
          },
          {
            low_tide: {
              time: "21h20",
              high: "7,67m",
              timestamp: "18/11/2023 21:20:00",
            },
          },
        ],
      },
    },
  };
  //return await response.json(); // Parse the response as JSON
  return response;
}

async function setDate() {
  // TODO only fetch the tide data when changing tide type (once every ~6hours)
  const { last_tide, next_tide } = await fetchTide();
  const [last_tide_type, { timestamp: last_timestamp }] =
    Object.entries(last_tide)[0];
  const [next_tide_type, { timestamp: next_timestamp }] =
    Object.entries(next_tide)[0];
  console.log(last_tide_type, last_timestamp, next_tide_type, next_timestamp);
  const last_date = new Date(last_timestamp);
  const next_date = new Date(next_timestamp);

  let degrees = 0;

  const now_timestamp = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
  });
  const now = new Date(now_timestamp);
  if ((last_timestamp <= now_timestamp) & (now_timestamp <= next_timestamp)) {
    const start = last_tide_type == "high_tide" ? 90 : 270;
    const offset = (180 * (now - last_date)) / (next_date - last_date);
    degrees = start + offset;
  } else {
    console.error(
      // TODO handle error graphically
      `Error with API data: last_tide = ${last_timestamp}, now = ${now}, next_tide = ${next_timestamp}`
    );
  }

  console.log(degrees);
  hand.style.transform = `rotate(${degrees}deg)`;
}

document.addEventListener("DOMContentLoaded", async function () {
  initiateTheme();
  setDate();
  setInterval(setDate, 60000);
});
