# Digital Mantra Japa and Naam Simran

A minimalist digital japa mala for focused mantra chanting and naam simran.

Live app:
https://srma4tech.github.io/digital-mantra-japa/

## Features

- Bead counter increments on each tap (or Enter/Space)
- Configurable mala size: 11 / 21 / 54 / 108
- Automatic mala completion tracking
- Session timer starts on first tap
- Lock mode protects settings (chanting stays active)
- Light and dark theme
- Per-mantra local stats (malas and time)
- PWA support with offline cache

## Notes

- All user data is stored locally in browser localStorage.
- No backend, no analytics, no account.
- Tailwind CSS is loaded from CDN and also cached by service worker after first load.

## Tech stack

- HTML, CSS, vanilla JavaScript
- Tailwind CSS (CDN)
- Service Worker + Web App Manifest
- localStorage persistence

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
|   `-- utils.js
`-- assets/
    |-- icons/
    `-- audio/
```
