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
