# AI Mastery Memory OS

A local-first learning system for AI, website terminology, and SEO & CMS, built around active recall and spaced repetition.

**Live app:** https://lvidsolutions.github.io/ai-mastery-memory-os/ (GitHub Pages) · Vercel deploy supported (see below)

## What it does

- **Review** — a landing screen where you choose exactly one of AI Review, Website Terminology Review, or SEO & CMS Review, then use active-recall flashcards with spaced repetition. Each track reviews only its own cards.
- **AI Curriculum** — AI terminology, prompting, RAG, agents, evaluation, safety, tools, and production patterns.
- **Website Curriculum** — 36 illustrated website terminology cards with wireframes, professional explanations, plain-English explanations, examples, and review questions.
- **SEO & CMS Curriculum** — 119 SEO, CMS, and backend concepts grouped into seven subcategories (SEO Foundations, Technical SEO, Website Architecture SEO, Backend & Infrastructure, CMS Concepts, CMS-Powered SEO Implementation, and Architecture-Firm SEO), each with a professional explanation, plain-English explanation, why-it-matters, website + architecture-firm examples, related concepts, and a review question. Browse by subcategory and start an SEO & CMS Review directly from the page.
- **Dual coding** — every revealed answer adds a visual memory image, a draw-it-yourself prompt, and optional audio explanations (text-to-speech).
- **Prompt Lab** — a structured prompt builder plus a searchable library of prompt methods for ChatGPT, Claude, coding agents, RAG, research, and more.
- **Progress** — review counts, due cards, retention, calibration, and tier progress.
- **Focus timer** — Pomodoro-style timer for study sprints.

Primary navigation: Dashboard, Review, AI Curriculum, Website Curriculum, SEO & CMS Curriculum, Prompt Lab, Progress, Settings.

Progress is stored locally in your browser. Export/import it as JSON in **Settings** to move between devices.

## Run locally (no install)

1. Download or clone this repository.
2. Open `index.html` in a browser.
3. Start with **Dashboard -> Review**.

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
data/webdev.js             Website terminology module (36 terms + SVG wireframes)
data/seo-cms.js            SEO & CMS module (119 SEO/CMS/backend concepts in 7 subcategories)
data/dual-coding-aids.js   visual memory images + audio support
scripts/                   data build/validate utilities (Python)
docs/                      architecture, curriculum map, learning science, audits
```

## Learning method

The app applies proven techniques as functionality, not theory: retrieval practice (answer before reveal), spaced repetition (graded scheduling), interleaving (mixed review queue), dual coding (visual + verbal + audio), and elaboration through why-it-matters explanations and examples. See `docs/LEARNING_SCIENCE.md`.

## License

MIT — see `LICENSE`.
