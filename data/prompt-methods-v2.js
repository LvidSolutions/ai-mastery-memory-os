/* Prompt Lab expansion v2 — fills category gaps with current best practice:
   web design, architecture-website design, reasoning-model prompting, AGENTS.md. */
(() => {
  'use strict';
  const DATA = window.AI_MASTERY_DATA;
  if (!DATA || !Array.isArray(DATA.promptMethods) || DATA.__promptV2) return;
  DATA.__promptV2 = true;

  DATA.promptMethods.push(
    {
      id: 'web-design-brief',
      category: 'Web Design',
      tools: 'Claude, ChatGPT, v0, Cursor, Claude Code',
      name: 'Web Design Brief Contract',
      use: 'Getting a model to design or build a page/component that looks intentional instead of generic-template output.',
      why: 'Models default to safe, generic SaaS aesthetics. Naming a specific tone, typography direction, spacing system, and explicit anti-patterns forces distinctive output. Constraints produce taste; vague "make it beautiful" produces Bootstrap.',
      formula: 'PURPOSE + AUDIENCE + TONE (3 adjectives) + TYPE & SPACING SYSTEM + COLOR TOKENS + LAYOUT STRUCTURE + ANTI-PATTERNS + ACCEPTANCE CHECK',
      template: `Design and build: [page/component]

Purpose: [the one job this page does]
Audience: [who lands here and what they decide]

Art direction:
- Tone: [3 adjectives, e.g. calm, editorial, precise]
- Typography: [display + body pairing or direction; modular scale ratio]
- Color: [2-3 tokens with hex; how the accent is rationed]
- Spacing: [base unit, e.g. 8px grid; generous white space rules]
- Layout: [grid, hierarchy, what dominates the viewport]

Do NOT:
- Generic SaaS dashboard look, purple gradients, glassmorphism
- More than one accent color, decorative icons, stock-photo feel
- [project-specific anti-patterns]

Technical:
- [stack, responsive breakpoints, accessibility AA, performance budget]

Acceptance check (answer before delivering):
1) Could this be mistaken for a default template? If yes, revise.
2) Is hierarchy obvious in a 3-second squint test?
3) Does every element earn its place?`,
      eval: 'Distinctive at first glance? Hierarchy survives squint test? Anti-patterns absent? Responsive + accessible? One clear action per view?'
    },
    {
      id: 'architecture-site-design',
      category: 'Web Design',
      tools: 'Claude, ChatGPT, v0, Cursor, CMS builders',
      name: 'Architecture Firm Website Spec',
      use: 'Specifying or building any part of an architecture-studio website: portfolio grids, case studies, studio pages.',
      why: 'Firm sites have a known grammar (photography-led, restrained type, gallery-like white space) and a known business goal (win commissions). Encoding both lets the model make correct trade-offs instead of generic agency choices.',
      formula: 'STUDIO POSITIONING + TARGET CLIENT + SITE GRAMMAR + CONTENT MODEL + PAGE SPEC + IMAGE STRATEGY + CONVERSION PATH + QUALITY BAR',
      template: `Build: [page/feature] for an architecture firm website.

Studio positioning: [e.g. 22-person Stockholm studio, cultural + adaptive reuse, Kasper Salin nominee]
Target visitor: [commissioning clients / competition juries / press] deciding [what]

Site grammar (non-negotiable):
- Photography dominates; UI chrome stays minimal and quiet
- Strict typographic scale [ratio], generous white space, gallery pacing
- Project grid as the portfolio argument; case studies tell brief → process → outcome

Content model: Project { title, slug, typology, status, year, hero, gallery[], credits, body }

Page spec:
- [sections in order, with what each must communicate]

Images: [aspect ratios, AVIF/WebP + srcset widths, blur-up placeholders, zero layout shift]

Conversion path: every page ends in [CTA, e.g. "Start a conversation" → contact form with project type + timeline]

Quality bar: feels like a gallery, loads fast on mobile, WCAG AA, breadcrumbs + OG metadata per project.`,
      eval: 'Photography-led? Case study argues process? Conversion path present? Image pipeline specified? Would a commissioning client trust this studio in 10 seconds?'
    },
    {
      id: 'reasoning-model-minimal',
      category: 'Prompt Engineering',
      tools: 'GPT-5 thinking, o-series, Claude extended thinking, DeepSeek R1, Gemini thinking',
      name: 'Reasoning Model Outcome Contract',
      use: 'Prompting reasoning/thinking models, which plan internally and degrade when micromanaged with step-by-step instructions.',
      why: 'Reasoning models already deliberate; "think step by step" and rigid procedures interfere with their planning. Current guidance is outcome-first: define the result, the evidence rules, and the output shape — let the model choose the path. Zero-shot first; add examples only if outputs miss.',
      formula: 'OUTCOME + SUCCESS CRITERIA + CONSTRAINTS & ALLOWED ACTIONS + EVIDENCE RULES + OUTPUT SHAPE (no process steps)',
      template: `Outcome: [exactly what must be true when you are done]

Success criteria:
- [measurable/checkable criterion 1]
- [criterion 2]

Constraints:
- [hard limits: scope, sources, side effects, length]
- If information is missing, state assumptions explicitly rather than inventing facts.

Evidence rules: [what counts as support; when to say "I don't know"]

Output shape:
[exact structure of the final answer — sections, format, length]

Do not narrate your reasoning process; deliver the result.`,
      eval: 'No step-by-step micromanagement? Outcome checkable? Output shape exact? Assumptions surfaced? Shorter than your instinct said?'
    },
    {
      id: 'agents-md-conventions',
      category: 'Codex / Coding',
      tools: 'Codex, Claude Code (CLAUDE.md), Cursor, GitHub Copilot',
      name: 'AGENTS.md Repo Conventions File',
      use: 'Writing the standing instructions file coding agents read before touching your repository (AGENTS.md; CLAUDE.md for Claude Code).',
      why: 'Coding agents follow repo convention files on every task — one good file upgrades every future session. Keep it short and operational: build/test commands early, hard rules explicit; long prose gets lost-in-the-middle.',
      formula: 'PROJECT ONE-LINER + COMMANDS (build/test/run) + ARCHITECTURE MAP + CODE CONVENTIONS + HARD RULES + DEFINITION OF DONE',
      template: `# AGENTS.md

[One line: what this project is and the stack.]

## Commands
- Run: [command]
- Test: [command]  ← run before claiming done
- Lint/validate: [command]

## Architecture
- [entry point] → [core modules and what owns what, 4-6 lines max]

## Conventions
- [style rules that differ from defaults: naming, formatting, patterns to copy]
- Mirror existing patterns in [reference file] before inventing new ones.

## Hard rules
- Never [touch X / add dependencies / commit secrets / rewrite generated files]
- Keep diffs minimal and scoped to the task.

## Definition of done
- Tests pass, no console errors, [project-specific checks].`,
      eval: 'Under one screen? Commands near the top? Hard rules unambiguous? Points at reference files instead of describing style in prose?'
    }
  );
})();
