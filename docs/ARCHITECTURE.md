# Architecture

## Overview

The app is intentionally static and local-first.

- `index.html` loads the shell.
- `data/content.js` defines `window.AI_MASTERY_DATA`, so the app works from `file://` without fetch/CORS issues.
- `src/app.js` renders the UI with vanilla JavaScript.
- `src/styles.css` contains all styling.
- Progress is stored in browser `localStorage` under `ai-mastery-memory-os-pro:v2`.
- `data/cards.json` is provided for scripts, external tools, and customization.

## Why no backend?

A backend would complicate setup and create privacy questions. This version is designed for:

- Double-click local use.
- GitHub Pages hosting.
- Offline-friendly learning.
- Easy inspection and modification.

## Spaced repetition model

Each card stores:

- `reviews`
- `reps`
- `interval`
- `ease`
- `due`
- `lapses`
- recent answers

Ratings:

- Again: due in about 10 minutes, ease decreases.
- Hard: shorter interval.
- Good: normal interval expansion.
- Easy: larger interval expansion.

This is inspired by SM-2 but simplified for readability.

## Data shape

Each card contains:

```json
{
  "id": "unique-card-id",
  "level": "Beginner",
  "category": "Prompting",
  "type": "concept",
  "title": "Prompt anatomy",
  "front": "What are the core parts of a strong prompt?",
  "back": "A strong prompt states goal, context...",
  "whyItMatters": "Prompt quality often determines...",
  "example": "Summarize this contract...",
  "tags": ["prompting"],
  "chunk": "Prompting fundamentals",
  "connections": ["Few-shot prompting"],
  "practice": "Write one prompt..."
}
```

## Extension ideas

- Add multilingual card variants.
- Add import from Markdown/PDF notes.
- Add a real semantic similarity checker for rewording.
- Add cloud sync with explicit user consent.
- Add teacher/admin decks.
- Add richer graph visualization.
- Add tests with Playwright if adopting a package-based build.

---

## 2026-06 update (Phases 1–7)

- **Scheduler:** SM-2 logic replaced by `src/fsrs.js` — FSRS-6 with official default parameters; legacy progress migrates automatically (interval→stability, ease→difficulty).
- **Data layers (load order matters):** `content.js` → `memory-ai-expert-pack.js` → `prompt-methods-v2.js` → `no-memory-review-format.js` → `webdev.js` → `fsrs.js` → `app.js` → UI enhancement layers.
- **Architecture Web module:** `data/webdev.js` owns 36 illustrated terms + the wireframe SVG renderer (`window.ARCH_WEB`).
- **Source of truth:** the `data/*.js` files are canonical. The old `curriculum.export.json` → `build_data.py` pipeline was removed (it was stale and would have deleted cards on rebuild). `data/cards.json` remains only for the optional Python CLI quiz.
- **Validation gate:** `node scripts/validate-app.js` (also `npm run validate`) runs in CI before every Pages deploy — deck integrity, link integrity, FSRS sanity, asset wiring.
- **Workflows:** single Pages workflow (`deploy-pages.yml`); the duplicate `static.yml` was removed.
