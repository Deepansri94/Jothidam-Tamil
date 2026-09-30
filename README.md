# ஜோதிடம் Tamil — Jothidam Tamil

முழுமையான தமிழ் ஜோதிட Desktop App — Complete Tamil Astrology Desktop Application

Built with Electron + Vanilla JS. All data stored locally. No internet required except for auto-updates.

---

## Features

| Feature | Description |
| --- | --- |
| 🪐 ஜாதகம் (Jathagam) | Generate Rasi and Navamsam birth charts with planet positions |
| 💍 திருமண பொருத்தம் (Porutham) | Check 10 porutham compatibility with score and Dosham analysis |
| 📅 தமிழ் பஞ்சாங்கம் (Panchangam) | Daily Nalla Neram, Subha Horai, Rahu Kalam, Yamagandam, Kuligai |
| ⭐ ராசி பலன் (Rasi Palan) | Daily, weekly, monthly, yearly forecasts for all 12 Rasis |
| 🔮 கருவிகள் (Tools) | Dasa Bhukti, Pancha Pakshi Sastram, Jamakol Arudam, Numerology |
| 📄 PDF ஏற்றுமதி | Export professional Jathagam and Porutham reports as PDF |

---

## Getting Started

### Prerequisites

- Windows 10 or later
- [Node.js](https://nodejs.org/) (for development only)

### Install & Run (Development)

```bash
npm install
npm start
```

### Build Installer

```bash
npm run build
```

Output: `dist/JothidamTamil-Setup.exe`

---

## Project Structure

```
Jothidam-Tamil/
  index.html       Page structure and all modals
  app.js           All UI logic and astrology calculations
  style.css        All styles (dark cosmic theme)
  main.js          Electron main: window creation, auto-update
  preload.js       IPC bridge (checkUpdate, onUpdateResult)
  package.json     Electron + electron-builder config
  docs/
    PRD.md
    ARCHITECTURE.md
    DESIGN_SYSTEM.md
    SECURITY.md
    VALIDATE.md
    AGENTS.md
    build-desktopEXE.md
```

---

## Data Storage

All data stored in `localStorage` under `jt_` prefixed keys:

| Key | Contents |
| --- | --- |
| `jt_profiles` | Saved birth profiles |
| `jt_settings` | App settings (default city) |

No data is sent to any external server.

---

## Auto-Update

Checks [GitHub Releases](https://github.com/Deepansri94/Jothidam-Tamil/releases) for updates tagged `build-N`. Downloads installer to user's Downloads folder.

---

## Known Limitations (v1)

- Planet positions use simplified lookup tables — upgrade to Swiss Ephemeris in v2 for higher accuracy
- jsPDF loaded from CDN — requires internet on first load; will be bundled locally in v2
- No code signing — Windows SmartScreen will show a warning; click "Run anyway"
- Place of birth limited to major Tamil Nadu cities — free lat/long entry in v2
