# SECURITY.md

Security review checklist. Run through every item before pushing to `main` or handing the build to a user.
If any item fails, fix it before proceeding. Do not ship with open items.

---

## 01 Secrets and credentials

- [ ] No API keys, tokens, or passwords are hardcoded in any `.js`, `.html`, or `.json` file.
- [ ] `package.json` contains no private registry tokens or auth fields.
- [ ] `.gitignore` excludes `node_modules/`, `dist/`, `release/`, and any `.env` files.
- [ ] GitHub Actions workflows use `${{ secrets.GITHUB_TOKEN }}` only — no personal access tokens committed.
- [ ] No `console.log` statements print sensitive user data (names, dates of birth).

**How to check:**
```
grep -r "password\|token\|secret\|apikey\|api_key" --include="*.js" --include="*.json" --include="*.html" .
```
Expected result: zero matches outside of `node_modules/`.

---

## 02 Data storage

- [ ] All user data (profiles, settings) is stored in `localStorage` on the user's own machine under `jt_` prefixed keys.
- [ ] No `fetch()` calls in `app.js` point to external URLs (the only allowed external call is the GitHub Releases API in `main.js` for auto-update).
- [ ] jsPDF is loaded from CDN in index.html — confirm the CDN URL uses `https://`.

**How to check:**
```
grep -n "fetch\|XMLHttpRequest\|axios" app.js
```
Expected result: zero matches.

---

## 03 Electron security

- [ ] `nodeIntegration: false` is set in all `BrowserWindow` `webPreferences`.
- [ ] `contextIsolation: true` is set in all `BrowserWindow` `webPreferences`.
- [ ] `preload.js` only exposes `checkUpdate`, `onUpdateResult` — no `require`, `fs`, or `shell` exposed to the renderer.
- [ ] `setWindowOpenHandler` returns `{ action: 'deny' }` — external URLs open via `shell.openExternal`.
- [ ] `setMenuBarVisibility(false)` is set on the main window.
- [ ] No `webSecurity: false` anywhere in the codebase.

**How to check:**
```
grep -n "nodeIntegration\|contextIsolation\|webSecurity\|enableRemoteModule" main.js preload.js
```
Expected: `nodeIntegration: false`, `contextIsolation: true`, no `webSecurity: false`.

---

## 04 Input validation

- [ ] Date of birth is validated as a valid date before saving.
- [ ] Time of birth is validated as HH:MM format before saving.
- [ ] No user input is passed to `eval()`, `innerHTML` without sanitisation, or `document.write()`.

**How to check:**
```
grep -n "eval\|document\.write\|innerHTML" app.js
```
Review each `innerHTML` hit — confirm it only uses data from `localStorage`, not from any external source.

---

## 05 Auto-update security

- [ ] The GitHub Releases API URL in `main.js` points to the correct repository (`Deepansri94/Jothidam-Tamil`).
- [ ] The downloaded `.exe` is saved to the user's `Downloads` folder and opened via `shell.openPath` — not executed programmatically.
- [ ] HTTP redirects in `httpsGet` strip custom headers before following to S3 or CDN URLs.

---

## 06 Build artefact

- [ ] The `files` array in `package.json` `build` config excludes `.git/`.
- [ ] The final `.exe` is signed (recommended for v2 — unsigned EXEs trigger Windows SmartScreen warnings on first run).

---

## 07 Dependency audit

Run before every release:
```
npm audit
```
- [ ] Zero `critical` severity vulnerabilities.
- [ ] Zero `high` severity vulnerabilities in runtime dependencies.

---

## 08 Pre-ship smoke test

- [ ] Install the `.exe` on a clean Windows machine.
- [ ] App opens without errors.
- [ ] Enter birth details → Jathagam renders correctly.
- [ ] Enter two Nakshatras → Porutham results display.
- [ ] Select today's date → Panchangam timings show.
- [ ] Export PDF → file downloads and opens correctly.
- [ ] No DevTools console errors on normal use.
- [ ] Windows Defender does not block the installer.

---

## Known accepted risks

| Risk | Reason accepted | Mitigation |
| --- | --- | --- |
| Data stored in localStorage (no encryption) | App runs on the user's private machine | Acceptable for v1 |
| No code signing on the EXE | Cost and complexity for v1 | User clicks "Run anyway" on SmartScreen once |
| Auto-update does not verify checksum | GitHub CDN is trusted | Add SHA256 verification in v2 |
| jsPDF loaded from CDN | Requires internet on first load | Bundle locally in v2 |
