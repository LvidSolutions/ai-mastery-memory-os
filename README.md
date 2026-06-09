# AI Mastery Memory OS Pro

A local-first, GitHub Pages-ready learning tool for compressing foundational AI knowledge into active recall.

It includes:

- 234 curated cards across Beginner, Intermediate, Advanced, and Expert levels.
- Spaced repetition with an SM-2-inspired scheduler.
- Active recall writing before answer reveal.
- Flashcards, rewording/Feynman mode, connection drills, concept graph, glossary, and prompt builder.
- 7-day, 14-day, and 30-day AI learning sprints.
- Local progress backup/import/export.
- Safe defensive coverage of prompt injection and AI-worm concepts without offensive malware instructions.

## Svenska snabbstart

### Kör lokalt utan installation

1. Packa upp zip-filen.
2. Öppna `index.html` i webbläsaren.
3. Börja med **Dashboard → Start due review**.

Progress sparas lokalt i webbläsaren. Exportera din progress i **Settings** om du vill flytta den mellan datorer.

### Kör lokalt med enkel server

```bash
cd ai-mastery-memory-os-pro
python3 -m http.server 8000
```

Öppna sedan `http://localhost:8000`.

### Publicera via GitHub Pages

1. Skapa ett nytt GitHub-repo.
2. Ladda upp hela mappen `ai-mastery-memory-os-pro`.
3. Gå till **Settings → Pages**.
4. Välj antingen:
   - **Deploy from branch**: `main` / root, eller
   - **GitHub Actions**: använd workflow-filen i `.github/workflows/deploy-pages.yml`.

## How to use the tool

1. **Reviews**: Write your answer before revealing. Grade honestly: Again, Hard, Good, Easy.
2. **Reword**: Explain a concept in simpler words. The keyword score is only a rough local check.
3. **Connect**: Link concepts into workflows. This is where isolated terms become system understanding.
4. **Prompt Lab**: Build prompts with goal, context, constraints, examples, output format, and evaluation criteria.
5. **Curriculum**: Filter by level/category/status to target weak areas.
6. **Settings**: Export/import progress and tune timer/new-card settings.

## Curriculum coverage

Main categories:

- Learning Science
- AI Foundations
- LLM Mechanics
- Prompting
- RAG & Knowledge
- Agents & Automation
- Tools & Ecosystem
- Evaluation
- Production & System Design
- Math & ML Essentials

The goal is not to pretend that 234 cards make someone an expert. The goal is to build a dense, accurate mental map quickly, then use that map to learn faster, ask better questions, and build/evaluate AI workflows.

## Safety note about “AI worm”

The original request used the phrase “AI worm”. In current cybersecurity usage, that can mean self-propagating AI-enabled malware. This project treats it as likely meaning “AI work/workflow” and includes AI-worm content only as defensive awareness: prompt injection, least privilege, sandboxing, provenance checks, monitoring, and human approval for risky actions.

## Customize the deck

The canonical content is in:

- `scripts/build_data.py` — editable source generator.
- `data/cards.json` — generated JSON export.
- `data/content.js` — generated browser-embedded data.

After editing `scripts/build_data.py`, regenerate:

```bash
python3 scripts/build_data.py
```

## Optional terminal quiz

A lightweight CLI is included:

```bash
python3 scripts/quiz_cli.py --level Beginner --count 10
```

CLI progress is stored in `.ai_mastery_cli_progress.json` in the project folder.

## Files

```text
ai-mastery-memory-os-pro/
├── index.html
├── manifest.webmanifest
├── sw.js
├── data/
│   ├── cards.json
│   └── content.js
├── src/
│   ├── app.js
│   └── styles.css
├── scripts/
│   ├── build_data.py
│   ├── quiz_cli.py
│   └── validate.py
├── docs/
│   ├── CODEX_PROMPT.md
│   ├── CURRICULUM_MAP.md
│   ├── LEARNING_SCIENCE.md
│   └── ARCHITECTURE.md
└── .github/workflows/deploy-pages.yml
```

## Evidence base and references

The learning design is based on spacing, retrieval practice, interleaving, elaboration, and metacognition research. Technical terms are grounded in current public AI/developer documentation and common industry usage. See `docs/LEARNING_SCIENCE.md` and the source notes embedded in `data/cards.json`.
