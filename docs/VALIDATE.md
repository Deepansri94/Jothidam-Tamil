# VALIDATE.md

Code review and pre-deployment validation checklist.
Complete every section before merging to `main` and triggering a build.

---

## 01 Code correctness

### app.js
- [ ] Every `save()` call is paired with an update to the in-memory array before it (never save stale data).
- [ ] Every `render*()` function reads from the current in-memory array, not a stale snapshot.
- [ ] `calcRasi()` returns correct planet positions for a known birth date/time/place (cross-check manually).
- [ ] `calcNavamsam()` derives correct Navamsam positions from Rasi positions.
- [ ] `calcPorutham()` returns results for all 10 poruthams — no undefined or missing entries.
- [ ] `calcPanchangam()` returns all 5 timings (Nalla Neram, Subha Horai, Rahu Kalam, Yamagandam, Kuligai) for any given date.
- [ ] `calcDasaBhukti()` produces a timeline covering the full 120-year Vimshottari cycle from the birth Nakshatra.
- [ ] `calcNumerology()` produces Life Path, Name Number, and Destiny Number correctly.
- [ ] PDF export renders Tamil text, chart grid, and all birth details without layout overflow.

### main.js
- [ ] `createWindow()` sets `minWidth` and `minHeight` so the layout never breaks.
- [ ] `httpsGet()` follows redirects correctly and strips `Authorization` header on redirect.
- [ ] Auto-update `checkForUpdate()` handles non-JSON GitHub API responses gracefully.
- [ ] `app.on('window-all-closed')` calls `app.quit()` on non-macOS platforms.

### index.html
- [ ] Every modal has a Cancel button calling `closeModal()` and closes on overlay click.
- [ ] Every `getElementById` reference in `app.js` exists in `index.html` with the exact same id.
- [ ] No inline `style` attributes use hardcoded hex values that conflict with `DESIGN_SYSTEM.md` tokens.

### style.css
- [ ] All color values match the tokens defined in `docs/DESIGN_SYSTEM.md`.
- [ ] `.hidden { display: none !important; }` is present and used consistently.
- [ ] Responsive rule at `max-width: 768px` does not break the sidebar or content layout.

---

## 02 Data integrity

- [ ] Saving a profile stores all fields correctly under `jt_profiles` in localStorage.
- [ ] Loading a saved profile pre-fills all form fields correctly.
- [ ] Deleting a profile removes it from `jt_profiles` and the profile list updates immediately.
- [ ] Settings save correctly under `jt_settings` and persist after app restart.

**How to spot-check in DevTools (F12 → Console):**
```js
JSON.parse(localStorage.getItem('jt_profiles'))
JSON.parse(localStorage.getItem('jt_settings'))
```

---

## 03 UI completeness

- [ ] Every page renders an empty-state message when there is no data (not a blank panel).
- [ ] Porutham match cards show correct color: green for match, red for no-match, gold for partial.
- [ ] Rahu Kalam card is highlighted in red on the Panchangam page.
- [ ] Nalla Neram card is highlighted in green/gold on the Panchangam page.
- [ ] Toast messages appear for every save, delete, and error action.
- [ ] All modals close on Cancel button click and on overlay click.
- [ ] PDF download button is disabled while generation is in progress.

---

## 04 Edge cases

- [ ] Entering an invalid date of birth shows a validation error and does not save.
- [ ] Entering an invalid time of birth shows a validation error and does not save.
- [ ] Generating a Jathagam with no profile selected shows an error toast.
- [ ] Porutham with the same Nakshatra for boy and girl calculates correctly (not a crash).
- [ ] PDF export with no profile selected shows an error toast and does not attempt generation.
- [ ] Panchangam for a Sunday shows correct Rahu Kalam slot (7:30–9:00 AM).

---

## 05 Performance

- [ ] Jathagam chart renders within 500ms of clicking Generate.
- [ ] Porutham results render within 500ms of clicking Calculate.
- [ ] PDF generation completes within 5 seconds for a full horoscope report.
- [ ] No `render*()` function is called more times than necessary on a single user action.

---

## 06 Pre-build checklist

Run these before pushing to `main`:

```
# 1. Check for leftover debug code
grep -n "console.log\|debugger\|TODO\|FIXME" app.js main.js

# 2. Verify no secrets
grep -rn "password\|token\|secret" --include="*.js" --include="*.json" .

# 3. Confirm package.json values
cat package.json | grep -E "name|version|appId|productName"

# 4. Confirm build files list excludes dev artifacts
cat package.json | grep -A 5 '"files"'
```

- [ ] Zero `console.log` / `debugger` statements in `app.js` and `main.js`.
- [ ] `package.json` `appId` is `com.jothidam.tamil`.
- [ ] `package.json` `productName` is `Jothidam Tamil`.
- [ ] `build.files` excludes `.git/`.

---

## 07 Post-install smoke test (on a clean machine)

| Step | Expected result | Pass? |
| --- | --- | --- |
| Launch app | Window opens, Dashboard shows, no errors | |
| Add a profile | Appears in saved profiles list | |
| Generate Jathagam | Rasi and Navamsam charts render with planet positions | |
| Check Porutham | Enter two Nakshatras → 10 porutham cards and score shown | |
| View Panchangam | Today's timings shown with Rahu Kalam highlighted | |
| Read Rasi Palan | Select Rasi → daily/weekly/monthly/yearly palan shown | |
| Dasa Bhukti | Enter birth details → timeline renders | |
| Numerology | Enter name and DOB → numbers calculated | |
| Export PDF | PDF downloads and opens with correct content | |
| Close and reopen app | All saved profiles persist | |
| Check for Update | Shows latest version or triggers download | |

All rows must pass before the build is distributed.
