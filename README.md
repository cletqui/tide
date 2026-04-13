# Tide Clock

A minimalist tide clock for French harbours. The clock hand shows where you are in the current tidal cycle — no numbers needed.

[![pages-build-deployment](https://github.com/cletqui/tide/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/cletqui/tide/actions/workflows/pages/pages-build-deployment)

**Live:** [cletqui.github.io/tide](https://cletqui.github.io/tide) · [tide.pages.dev](https://tide.pages.dev)

## How it works

The hand rotates between high tide (12 o'clock) and low tide (6 o'clock), showing elapsed time within the current tidal cycle. The info panel (toggle with ℹ️) reveals exact times and tidal coefficient.

Tide data is fetched from [data.cybai.re](https://github.com/cletqui/data) — a personal Cloudflare Worker that scrapes [maree.info](https://maree.info) and caches results for 12 hours.

## Features

- Analog clock hand representing the tidal cycle
- Search any French harbour by name
- Dropdown suggestions for ambiguous searches
- PM / BM tide times and tidal coefficient (morte-eau → vive-eau exceptionnelle)
- Dark / light theme (persisted across sessions)
- Fullscreen mode
- Responsive layout

## Project structure

```
tide/
├── css/style.css
├── icons/
├── js/script.js
└── index.html
```

## API

Tide data comes from `GET https://data.cybai.re/tide?id={harbourId}`.

Response includes `last_tide`, `next_tide`, `forecast` (full week), `coeff_label`, and a `cached` flag.

## License

MIT — see [LICENSE](LICENSE).
