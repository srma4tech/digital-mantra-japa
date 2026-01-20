# 🕉️ Digital Mantra Japa & Naam Simran

A minimalist, distraction-free **digital japa mala** designed for focused mantra chanting, naam simran, and daily spiritual practice.

🔗 **Live App**  
👉 https://srma4tech.github.io/digital-mantra-japa/

---

## 🌿 Purpose & Philosophy

This application is built with a **spiritual-first mindset**, not as a typical counter app.

Core principles:

- Single-point focus on chanting  
- Minimal UI, no distractions  
- Offline-first, privacy-respecting  
- Discipline-oriented (complete the mala, then stop)

It is intended for:
- Mantra Japa  
- Naam Simran  
- Silent chanting with eyes closed  
- Consistent daily spiritual practice  

---

## ✨ Key Features

### 🔢 Japa Counter
- Bead counter increments on every tap
- Configurable mala sizes: **11 / 21 / 54 / 108**
- Mala count increases automatically after completion

### ⏱ Session Timer
- Starts automatically on the **first tap**
- Tracks chanting duration per session
- Designed to stop **only after mala completion** (user intent)

### 🔒 Lock Mode (Focus Protection)
- Lock affects **only settings**, not chanting
- Prevents accidental changes to:
  - Mantra selection
  - Mala goal
  - Reset / Stop actions
- Tap area remains **fully active at all times**

### 🌗 Light & Dark Mode
- Warm, devotional light mode
- Soft, eye-friendly dark mode
- Suitable for long chanting sessions

### 📊 Stats (Local Only)
- Lifetime japa count
- Per-mantra session tracking
- Stored **only in browser localStorage**
- No cloud sync, no analytics

### 📱 Responsive & Offline
- Works on mobile, tablet, and desktop
- Installable as a Progressive Web App (PWA)
- Fully functional offline

---

## 🧘 Recommended Usage Flow

1. Select your **Mantra**
2. Select **Mala size**
3. (Optional) Enable **Lock**
4. Begin chanting by tapping the center
5. Complete the full mala
6. Stop the session consciously

This mirrors **traditional japa discipline**.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (CDN) + Custom CSS
- **State Management**: Browser `localStorage`
- **Offline Support**: Service Worker (PWA)
- **Hosting**: GitHub Pages

No frameworks.  
No backend.  
No build step.

---

## 📂 Project Structure

```text
digital-mantra-japa/
│
├── index.html
├── README.md
├── manifest.json
├── service-worker.js
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── ui.js
│   ├── state.js
│   ├── timer.js
│   ├── stats.js
│   ├── mantra.js
│   └── utils.js
│
└── assets/
    ├── icons/
    └── audio/
