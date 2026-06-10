# AI Mastery Memory OS Pro

A local-first learning system for becoming highly competent with AI and modern web development — built on evidence-based learning science.

**Live app:** https://lvidsolutions.github.io/ai-mastery-memory-os/ (GitHub Pages) · Vercel deploy supported (see below)

## What it does

- **Reviews** — active-recall flashcards with spaced repetition. Write your answer before revealing, then grade yourself (Again / Hard / Good / Easy).
- **Architecture Web mode** — 36 illustrated web-development terms every architecture-firm website is built from: wireframe diagrams, a professional explanation, an explanation a 5-year-old understands, why it matters for architecture studios, an example, related concepts, and a review question.
- **Dual coding** — every revealed answer adds a visual memory image, a draw-it-yourself prompt, and optional audio explanations (text-to-speech).
- **Reword (Feynman)** — explain a concept in your own words and compare against the model answer.
- **Connect** — drill the relationships between concepts to build a systems view.
- **Prompt Lab** — a structured prompt builder plus a searchable library of prompt methods for ChatGPT, Claude, coding agents, RAG, research, and more.
- **Curriculum & glossary** — 300+ cards across four tiers: Beginner → Intermediate → Advanced → Expert.
- **Focus timer** — Pomodoro-style timer for study sprints.

Progress is stored locally in your browser. Export/import it as JSON in **Settings** to move between devices.

## Run locally (no install)

1. Download or clone this repository.
2. Open `index.html` in a browser.
3. Start with **Dashboard → Start due review**.

## Run locally with a simple server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions** (one-time setting — without it the site returns 404).
4. The workflow in `.github/workflows/deploy-pages.yml` deploys automatically on every push to `main`.

Expected URL: `https://<owner>.github.io/ai-mastery-memory-os/`

## Deploy to Vercel

1. Import the GitHub repository at vercel.com (Framework preset: **Other**, no build command, output directory: root).
2. Every push to `main` deploys to production; every pull request gets a preview URL.
3. `vercel.json` is included and sets cache headers so app updates appear immediately.

## Project structure

```
index.html                 app shell
src/app.js                 application logic and views
src/styles.css             styles
src/mobile.css             small-screen and safe-area refinements
data/content.js            core curriculum (generated data)
data/memory-ai-expert-pack.js   additional expert cards + prompt methods
data/no-memory-review-format.js review-answer format (professional + ELI5)
data/webdev.js             Architecture Web module (36 terms + SVG wireframes)
data/dual-coding-aids.js   visual memory images + audio support
scripts/                   data build/validate utilities (Python)
docs/                      architecture, curriculum map, learning science, audits
```

## Learning method

The app applies proven techniques as functionality, not theory: retrieval practice (answer before reveal), spaced repetition (graded scheduling), interleaving (mixed review queue), dual coding (visual + verbal + audio), elaboration (why-it-matters and connection drills), and the Feynman technique (Reword mode). See `docs/LEARNING_SCIENCE.md`.

## License

MIT — see `LICENSE`.
