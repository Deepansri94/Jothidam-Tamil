# AGENTS.md

Instructions for any AI coding agent working in this project. Read this whole file before doing anything.

---

## 01 Purpose

Jothidam Tamil is a complete Tamil astrology desktop app (Electron, Windows).
Your job is to extend it without breaking what exists, in the style already established.
When in doubt, match what is there.

---

## 02 Before you start

Do these in order, every session:

1. Read `docs/PRD.md` for what we are building and what is out of scope.
2. Read `docs/DESIGN_SYSTEM.md` for every visual decision. Use its tokens.
3. Read `docs/ARCHITECTURE.md` for where code lives and what may touch what.
4. Check existing functions in `app.js` before creating a new one.
5. Restate the task in one or two sentences and list the files you expect to touch. Wait for a go-ahead if that list is longer than five files.

---

## 03 General rules

- Follow the design system. If a value is not in `DESIGN_SYSTEM.md`, ask. Do not invent it.
- Keep responsibilities where `ARCHITECTURE.md` puts them. No astrology logic in `index.html`.
- Reuse before creating. Search `app.js` for an existing helper first.
- Small, focused changes. One task, one branch, one clear diff.
- Do not add dependencies, tables, environment variables, or third-party services without asking.
- Do not delete or rewrite working code the task does not require.
- Leave the project runnable after every change.

---

## 04 Code guidelines

- Vanilla JS only. No TypeScript, no frameworks.
- No `eval()`. No `document.write()`. No `innerHTML` with external data.
- Name things by what they do: `calcPorutham`, `renderJathagam`, not `doCalc`.
- Comments explain why, not what. Delete commented-out code.
- Every data-driven view handles empty state (no profile selected / no data).
- UI copy follows `DESIGN_SYSTEM.md` tone: plain, short, no exclamation marks.
- Tamil script labels are acceptable for section headings — use Unicode directly.

---

## 05 Security and best practices

- No secrets, API keys, or credentials anywhere in the codebase.
- All user data stays in `localStorage` under `jt_` prefixed keys.
- No `fetch()` calls from `app.js` to external URLs.
- `nodeIntegration: false` and `contextIsolation: true` must remain set.
- If `docs/SECURITY.md` conflicts with this section, `SECURITY.md` wins.

---

## 06 Useful commands

```
npm install          install dependencies
npm start            run in development (Electron)
npm run build        build Windows installer (must pass before a PR)
```

---

## 07 Definition of done

A task is done when all of these are true:
- The change does what the task asked, and nothing else.
- Build passes locally (`npm run build`).
- New UI matches `DESIGN_SYSTEM.md`.
- `docs/VALIDATE.md` checklist items relevant to the change are ticked.
- The summary says what changed, what was not done, and what the user should check.

---

## 08 When to stop and ask

Stop and ask instead of guessing when:
- The task conflicts with the PRD or an architectural boundary.
- Two reasonable readings of the task lead to different work.
- The change needs a new npm dependency or external API.
- Something is broken that the task did not mention.
