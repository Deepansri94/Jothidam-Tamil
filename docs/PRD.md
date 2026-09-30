# PRD: Jothidam Tamil

## 01 Product overview

| Field | Value |
| --- | --- |
| Product name | Jothidam Tamil |
| Tagline | முழுமையான தமிழ் ஜோதிடம் — Complete Tamil Astrology Desktop App |
| Description | A desktop app for Tamil-speaking users to generate birth charts, check marriage compatibility, view daily Panchangam timings, read horoscope forecasts, and export professional PDF reports — all offline on their own machine. |
| Stage | MVP |
| Platform | Desktop (Electron, Windows) |

---

## 02 Problem

Tamil astrology users today rely on fragmented online tools — one site for Jathagam, another for Panchangam, another for Porutham. These sites are ad-heavy, require internet, and do not produce professional printable reports. There is no single offline desktop app that covers all core Tamil astrology needs in the Tamil language.

---

## 03 Goal

Give Tamil-speaking users a single, fast, offline desktop app that covers all core astrology needs — from birth chart generation to marriage matching to daily Panchangam — with professional PDF export.

---

## 04 Target users

Primary user:
- Who: Tamil-speaking individuals, families, and astrologers in Tamil Nadu and diaspora
- Trigger: Need to check Jathagam, Porutham, or daily Nalla Neram without internet
- Today they use: Online astrology sites, printed almanacs, manual calculations
- They will switch because: Offline, fast, Tamil language, professional PDF output, all features in one app

Not for:
- Non-Tamil astrology systems (Sanskrit, Western, Chinese)
- Professional astrologers needing paid consultation management (v2)
- Mobile users (v2)

---

## 05 Core features

| # | Feature | What the user can do | Done when |
| --- | --- | --- | --- |
| 1 | Jathagam (Birth Chart) | Enter date, time, place of birth → get Rasi chart and Navamsam chart with planet positions | Both charts render with correct planet placements; Nakshatra and Lagnam shown |
| 2 | Thirumana Porutham | Enter boy and girl Nakshatra → get 10 porutham results with Dosham analysis and overall score | All 10 poruthams calculated and displayed with match / no-match / partial status |
| 3 | Tamil Panchangam | Select a date → view Nalla Neram, Subha Horai, Rahu Kalam, Yamagandam, Kuligai timings | All 5 timings shown correctly for the selected date |
| 4 | Rasi Palan | Select Rasi → view daily, weekly, monthly, yearly forecasts | All 12 Rasi palans available across all 4 time periods |
| 5 | Astrological Tools | Dasa Bhukti timeline, Pancha Pakshi Sastram, Jamakol Arudam, Numerology | Each tool produces correct output based on birth details |
| 6 | PDF Report Export | Generate and download professional horoscope or matching report as PDF | PDF renders with Tamil text, chart, and all details; downloads to user's machine |

---

## 06 Success metrics

| Metric | Target | Measured by |
| --- | --- | --- |
| Birth chart renders correctly | Accurate planet positions | Cross-check with known Jathagam |
| All 10 poruthams calculated | 100% | Manual verification against traditional method |
| Panchangam timings correct | Accurate for today's date | Cross-check with printed almanac |
| PDF exports successfully | No errors | Download and open on clean machine |

---

## 07 Out of scope (v1)

- Prasna Jothidam (horary astrology)
- Muhurtham calculator
- Paid consultation booking
- Cloud sync or multi-device
- Mobile app
- Languages other than Tamil and English labels

---

## 08 Open questions

- Ephemeris data: use pre-computed lookup tables (simpler, v1) or full Swiss Ephemeris WASM (accurate, heavier)?
  Recommendation: pre-computed lookup tables for v1, upgrade to Swiss Ephemeris in v2.
- PDF library: jsPDF (client-side, no install) or Puppeteer (heavier)?
  Recommendation: jsPDF for v1.
- Place of birth: free-text with lat/long lookup, or dropdown of major Tamil Nadu cities?
  Recommendation: dropdown of major cities for v1, free lat/long entry in v2.
