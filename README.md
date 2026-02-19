# Digital Mantra Japa and Naam Simran

A minimalist digital japa mala for focused mantra chanting and naam simran.

Live app:
https://srma4tech.github.io/digital-mantra-japa/

## Features

- Bead counter increments on each tap (or Enter/Space)
- Configurable mala size: 11 / 21 / 54 / 108
- Automatic mala completion tracking
- Session timer starts on first tap
- Stop After Mala button (enabled only on completed mala boundary)
- Lock mode prevents accidental tap counting
- Light and dark theme
- Per-mantra local stats (malas and time, including `0 sec` when no time is recorded)
- PWA support with offline cache
- Optional Google Analytics insights (opt-in)

## Analytics setup

1. Open `index.html`.
2. Set `window.APP_CONFIG.gaMeasurementId` to your GA4 Measurement ID (example: `G-ABC123XYZ9`).
3. Open the app and enable `Allow anonymous usage analytics` in the guide.

## Notes

- Core user data is stored locally in browser localStorage.
- `Reset` and `Stop After Mala` clear current session beads/malas from localStorage, while lifetime count and mantra stats remain.
- Analytics is disabled by default and sent only if user opts in.
- Tailwind CSS is loaded from CDN and also cached by service worker after first load.

## Tech stack

- HTML, CSS, vanilla JavaScript
- Tailwind CSS (CDN)
- Service Worker + Web App Manifest
- localStorage persistence
- Google Analytics 4 (optional)

## Project structure

```text
digital-mantra-japa/
|-- index.html
|-- README.md
|-- manifest.json
|-- service-worker.js
|-- css/
|   `-- styles.css
|-- js/
|   |-- app.js
|   |-- ui.js
|   |-- state.js
|   |-- counter.js
|   |-- timer.js
|   |-- stats.js
|   |-- mantra.js
|   |-- analytics.js
|   `-- utils.js
`-- assets/
    |-- icons/
    `-- audio/
```
