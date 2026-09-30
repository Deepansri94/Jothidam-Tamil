# Architecture: Jothidam Tamil

## 01 System overview

```
Electron Main Process (main.js)
    |
    v
BrowserWindow loads index.html
    |
    v
app.js (all frontend logic)  <-->  localStorage (all data)
    |
    v
preload.js (IPC bridge — update check only)
```

- No backend server. No network calls except the GitHub Releases API for auto-update.
- All user data lives in localStorage on the machine.
- Astrology calculations are done entirely in app.js using pre-computed lookup tables.
- The frontend reads and writes localStorage directly. There is no API layer.

---

## 02 Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Desktop shell | Electron | Same stack as other projects, no new dependency |
| Frontend | HTML + Vanilla JS + CSS | No build step, same as other projects |
| Data storage | localStorage | Per-machine, zero setup |
| Astrology engine | Vanilla JS lookup tables | No external library needed for v1 |
| PDF export | jsPDF (CDN) | Client-side, no install, works offline after first load |
| Build | electron-builder (NSIS) | Same as other projects |

Do not add React, Vue, a database, or a backend server without asking.

---

## 03 Project structure

```
Jothidam-Tamil/
  index.html       Page structure and all modals
  app.js           All UI logic, astrology calculations, localStorage operations
  style.css        All styles, tokens from DESIGN_SYSTEM.md
  main.js          Electron main: creates window, handles auto-update
  preload.js       Exposes electronAPI (checkUpdate, onUpdateResult)
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

Where new code belongs:
- New page/section: add a `<section>` in index.html and a render function in app.js
- New modal: add modal HTML at the bottom of index.html, open/close via openModal/closeModal
- New data type: add a load/save pair at the top of app.js, initialize from localStorage
- New astrology calculation: add a pure function in app.js, no side effects

---

## 04 Data model

All stored in localStorage as JSON under `jt_` prefixed keys.

```
jt_profiles[]     { id, name, dob, tob, pob, lat, lng, nakshatra, rasi, lagnam }
jt_settings       { appLang, defaultCity }
```

Rules:
- ids are Date.now().toString() strings.
- All astrology calculations are derived from the profile at render time — nothing pre-computed is stored.
- Profiles are the only persistent data; all chart/palan output is computed on demand.

---

## 05 Astrology calculation boundaries

| Module | Input | Output | Lives in |
| --- | --- | --- | --- |
| `calcRasi()` | dob, tob, lat, lng | planet positions object | app.js |
| `calcNavamsam()` | planet positions | navamsam positions | app.js |
| `calcPorutham()` | boy nakshatra, girl nakshatra | 10 porutham results | app.js |
| `calcPanchangam()` | date | 5 timing slots | app.js |
| `calcDasaBhukti()` | nakshatra, dob | dasa timeline array | app.js |
| `calcNumerology()` | dob, name | numerology numbers | app.js |

Never:
- Fetch external URLs from app.js for astrology data.
- Store calculated chart output in localStorage — always recompute from the profile.

---

## 06 Decisions that look wrong but are intentional

- Pre-computed lookup tables instead of Swiss Ephemeris: sufficient accuracy for v1, no WASM dependency.
- jsPDF loaded from CDN in index.html: acceptable for desktop Electron app where network is available on first run; bundle locally in v2.
- All 6 features in one app.js file: consistent with other projects in this workspace; split into modules in v2 if file exceeds 2000 lines.

---

## 07 Scalability

- Expected scale: dozens of saved profiles per user on a single machine.
- localStorage limit (~5MB) is more than sufficient.
- Not planned: cloud sync, multi-device, multi-user.

---

## 08 When to stop and ask

Stop and ask if a task requires:
- Adding a backend server or database
- Network calls from app.js to external astrology APIs
- A new npm dependency
- Changing the core calculation logic in section 05
