# Phase 1 — Repository Audit & Implementation Plan

Date: 2026-06-11 · Auditor: Claude (Fable 5) · Scope: full repo at `origin/main` (commit at audit time)

---

## 1. Architecture (as found)

- **Stack:** zero-dependency vanilla-JS SPA. `index.html` → `data/content.js` (global `window.AI_MASTERY_DATA`, ~9.7k lines) → `src/app.js` (1,085-line IIFE, innerHTML view templates, event delegation) → `src/styles.css` (single-line minified rules).
- **PWA:** `manifest.webmanifest` + `sw.js` (cache-first, hardcoded asset list, cache key `…-v2`).
- **Data pipeline:** `curriculum.export.json` (declared source) → `scripts/build_data.py` → `data/content.js` + `data/cards.json`. `scripts/validate.py` passes ("OK: 234 cards, 234 glossary terms").
- **Deploy:** two GitHub Actions workflows (`deploy-pages.yml`, `static.yml`), both deploying the repo root to Pages on push to `main`.
- **Features present:** SM-2-style reviews (Again/Hard/Good/Easy), level + category + status filters, Reword (Feynman-style) mode, Connect (concept graph) mode, Prompt Lab (6-field builder + 8 flat templates), curriculum browser, glossary, Pomodoro timer, sprints, JSON export/import, localStorage persistence.

## 2. Findings (ranked by impact)

**F1 — Source-of-truth pipeline is broken.** `curriculum.export.json` contains **203** cards; the built `data/content.js` contains **234**. The built artifact was edited directly after generation. Running `npm run build:data` today would silently **delete ~31 cards**. → Decision: make `data/content.js` (split into modular data files) the canonical source; retire or rewrite `build_data.py` as an exporter, not a builder. Remove `data/cards.json` (duplicate payload, loaded by nothing in `index.html`).

**F2 — Concept graph is 91% dead.** 625 of 690 `connections` strings match no card title, so the Connect view's "related cards" and backlinks are mostly empty. Connection-finding (relational encoding) is one of the highest-value learning mechanics — it must resolve to real cards. → Fix: re-key connections to card **ids**, validate at build time, fail CI on broken links.

**F3 — Scheduler is outdated (SM-2 variant).** Custom ease-factor logic with ad-hoc intervals and a 1/3/4/5 rating mapping. The current evidence-based standard is **FSRS-6** (21-parameter DSR model; default in Anki; benchmarked more accurate than SM-2 for ~99.5% of users, ~20–30% fewer reviews for equal retention). → Replace with a faithful FSRS-6 port (official default parameters extracted from `open-spaced-repetition/py-fsrs`), desired-retention setting, migration of existing `{ease, interval, due}` state.

**F4 — Learning-science gaps (engine level).** Present: retrieval practice, self-grading, crude weak-card injection, shuffle (incidental interleaving), Feynman-ish Reword. Missing: **confidence rating before reveal (calibration)**, dedicated weak-card drill queue, deliberate cross-category interleaving control, **dual coding (zero visuals in 234 cards)**, transfer/application prompts surfaced during review, elaborative-interrogation step, tier gating / progressive overload, analytics (retention %, forecast, streak, calibration curve), recommended-next-action.

**F5 — Prompt Lab is below 2026 practice.** One generic builder + 8 flat templates; no categories, no per-tool guidance, no search, no quality checklist. Current practice it must encode: outcome-first contracts for GPT-5.x (outcome, constraints, evidence rules, output shape; minimal step-by-step), reasoning-effort/verbosity tuning, XML-tag structuring + extended-thinking guidance for Claude, AGENTS.md/CLAUDE.md conventions for coding agents, grounded-RAG answer contracts ("answer only from context; say I don't know; cite"), LLM-as-judge rubrics, structured-output schemas, deep-research scoping.

**F6 — GitHub Pages is down (404) + duplicate workflows.** `https://lvidsolutions.github.io/ai-mastery-memory-os/` returns 404 even though both workflows exist. Likely cause: Pages source not set to "GitHub Actions" in repo Settings (owner-only action), and two workflows race in the same `pages` concurrency group. → Delete `static.yml`, keep one workflow; owner enables Settings → Pages → Source: **GitHub Actions**. Add `vercel.json` for the planned Vercel deploy.

**F7 — Language.** App UI and all 234 cards are English. Swedish exists only in `README.md` (setup/deploy instructions). Phase 3 scope = rewrite README in English (plus consistency pass). The `åäö` regex in `app.js` is slug-normalization, not UI text — keep.

**F8 — Mobile gaps.** `position:sticky` topbar disabled on small screens, no `env(safe-area-inset-*)` support, ~36px touch targets (Apple HIG: 44px), horizontally scrolling tab bar with no affordance, no bottom navigation, 4-button grade row cramped at 390px, cache-first SW will serve stale builds to phones until the version string is bumped manually.

**F9 — Web-dev / architecture-website coverage: 1 card of 234.** Phase 2 is greenfield: a dedicated module (~36 terms) with wireframe SVGs is required.

**F10 — Misc debt.** `glossary` array duplicates all 234 cards 1:1 (payload bloat); `styles.css` is unmaintainable single-line CSS; rating keymap uses 1/3/4/5 instead of 1–4; docs (`ARCHITECTURE.md`, `CURRICULUM_MAP.md`, `LEARNING_SCIENCE.md`) will be stale after refactor.

## 3. Concept audit verdicts

- **Keep & strengthen (190 `concept` + 10 `skill` cards):** AI Foundations, LLM Mechanics, Agents & Automation, RAG, Production — solid, current, zero date-fragile phrasings, 100% have `example` + `practice` fields.
- **Convert (33 `tool` cards):** name + marketing-blurb pairs are weak SRS material (recognition, not skill). Move to a reference **Tool Directory** view; replace in the review rotation with decision-style cards ("when would you pick X over Y").
- **Expand (thin areas):** Safety & Governance (1 card), Evaluation (5), RAG (3 tagged), Math & ML Essentials (5), prompting techniques (self-consistency, ReAct, reflection, AGENTS.md, structured outputs: 0–1 mentions each), and the entire web-dev tier (F9).
- **Merge:** glossary into card browser (one source).

## 4. Card schema v3 (Phase 2+ builds on this)

```js
{
  id, tier: 1|2|3|4,            // Beginner..Expert (numeric for gating)
  category, type,                // concept | skill | pattern | term
  title, front, back,            // back = professional explanation
  eli5,                          // simple-English explanation (new, required)
  whyItMatters, example, practice,
  visual: { kind: 'svg', ref },  // dual coding (new, optional)
  links: [cardId, ...],          // id-keyed, validated (replaces connections)
  tags: [...]
}
```

Review state per card (FSRS-6): `{ stability, difficulty, due, lastReview, reps, lapses, state, confidence[] }`.

## 5. Implementation plan (Phases 2–7)

- **P2 Architecture Website Review Mode:** new `data/webdev.js` module — ~36 terms (hero, sticky header, mega menu, project grid, masonry, case study, CTA, forms, typography scale, white space, responsive layout, scroll animation, parallax, breadcrumbs, SEO metadata, accessibility, loading states, image optimization, design system, component library, CMS, slug, routing, deployment, Vercel, GitHub workflow, …), each with professional + ELI5 explanations, inline wireframe **SVG** (no external images), architecture-firm relevance, example, related ids, review question. Ships on schema v3.
- **P3 English standardization:** README.md rewrite; full-repo consistency sweep.
- **P4 Learning engine:** FSRS-6 port + state migration; confidence-before-reveal (calibration log + curve); weak-card drill mode; interleaving toggle; tier gating with mastery thresholds; Explain-Simply (ELI5) mode wired into Reword; transfer prompts in review; analytics view (retention, 7-day forecast, streak, calibration); recommended-next-action on dashboard.
- **P5 Prompt Lab:** categorized library (ChatGPT/GPT-5.x, Claude, coding agents/Codex, research, RAG, tool calling, structured outputs, business strategy, web design, architecture-website design, debugging, deployment, evaluation) — each with purpose, when-to-use, formula, copy-ready template, example, quality checklist; search + filter + one-tap copy.
- **P6 Mobile:** bottom tab bar, 44px+ targets, safe-area insets, 390px-first review/prompt layouts, no horizontal overflow, SW update flow (skipWaiting + reload prompt).
- **P7 QA/cleanup:** delete `static.yml`, `data/cards.json`; rewrite `build_data.py` as validator/exporter with broken-link CI check; restructure `styles.css`; refresh docs; full smoke test (jsdom) for zero console errors.

## 6. Blockers

1. **No push credentials in this environment** (verified: `fatal: could not read Username`, no credential helper/token/gh/SSH). Work is committed locally; pushing requires either a connected GitHub integration or owner-run commands.
2. **Pages 404 fix requires owner action:** repo Settings → Pages → Build and deployment → Source: **GitHub Actions** (one-time), then re-run the deploy workflow.
