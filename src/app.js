(() => {
  'use strict';

  const DATA = window.AI_MASTERY_DATA;
  const STORAGE_KEY = 'ai-mastery-memory-os-pro:v2';
  const MINUTE = 60 * 1000;
  const DAY = 24 * 60 * MINUTE;

  const TABS = [
    ['dashboard', 'Dashboard'],
    ['review', 'Reviews'],
    ['reword', 'Reword'],
    ['connections', 'Connect'],
    ['promptlab', 'Prompt Lab'],
    ['curriculum', 'Curriculum'],
    ['glossary', 'Glossary'],
    ['settings', 'Settings']
  ];

  const defaultState = () => ({
    tab: 'dashboard',
    filters: { q: '', level: 'All', category: 'All', status: 'All' },
    progress: {},
    queue: [],
    queueIndex: 0,
    showAnswer: false,
    currentAnswer: '',
    reword: { id: null, answer: '', lastScore: null },
    connect: { id: null, answer: '' },
    promptLab: { goal: '', context: '', constraints: '', examples: '', output: '', quality: '' },
    timer: {
      mode: 'focus',
      focusMinutes: 25,
      breakMinutes: 5,
      secondsLeft: 25 * 60,
      running: false,
      totalFocusSeconds: 0
    },
    selectedSprint: 'sprint-7',
    dailyNew: 18,
    lastOpened: Date.now()
  });

  let state = loadState();
  const app = document.getElementById('app');
  const tabs = document.getElementById('tabs');
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  let timerInterval = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return deepMerge(defaultState(), parsed);
    } catch (err) {
      console.warn('Could not load saved state:', err);
      return defaultState();
    }
  }

  function deepMerge(base, patch) {
    for (const [key, value] of Object.entries(patch || {})) {
      if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
        base[key] = deepMerge(base[key], value);
      } else {
        base[key] = value;
      }
    }
    return base;
  }

  function saveState() {
    state.lastOpened = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function slug(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function fmtDate(ts) {
    if (!ts) return 'not scheduled';
    const d = new Date(ts);
    const now = Date.now();
    if (ts <= now) return 'due now';
    const hours = Math.round((ts - now) / (60 * MINUTE));
    if (hours < 24) return `in ${Math.max(1, hours)}h`;
    const days = Math.round((ts - now) / DAY);
    return `in ${days}d`;
  }

  function fmtMinutes(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function cardById(id) {
    return DATA.cards.find((card) => card.id === id) || DATA.cards[0];
  }

  function progressFor(id) {
    if (!state.progress[id]) {
      state.progress[id] = {
        reviews: 0,
        reps: 0,
        interval: 0,
        ease: 2.5,
        due: Date.now(),
        lapses: 0,
        lastRating: null,
        lastReviewed: null,
        answers: []
      };
    }
    return state.progress[id];
  }

  function cardStatus(card) {
    const p = progressFor(card.id);
    const due = p.due <= Date.now();
    if (p.reviews === 0) return 'New';
    if (due) return 'Due';
    if (p.reps >= 4 && p.interval >= 14 && p.ease >= 2.35) return 'Mastered';
    if (p.lapses > 0 || p.ease < 2.05 || p.lastRating === 1) return 'Weak';
    return 'Learning';
  }

  function filteredCards(limit = Infinity) {
    const q = state.filters.q.trim().toLowerCase();
    const cards = DATA.cards.filter((card) => {
      if (state.filters.level !== 'All' && card.level !== state.filters.level) return false;
      if (state.filters.category !== 'All' && card.category !== state.filters.category) return false;
      if (state.filters.status !== 'All' && cardStatus(card) !== state.filters.status) return false;
      if (!q) return true;
      const haystack = [card.title, card.front, card.back, card.whyItMatters, card.example, card.category, card.level, ...(card.tags || []), ...(card.connections || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
    return cards.slice(0, limit);
  }

  function allStats() {
    const progress = DATA.cards.map((card) => progressFor(card.id));
    const seen = progress.filter((p) => p.reviews > 0);
    const due = DATA.cards.filter((card) => progressFor(card.id).reviews > 0 && progressFor(card.id).due <= Date.now());
    const mastered = DATA.cards.filter((card) => cardStatus(card) === 'Mastered');
    const weak = DATA.cards.filter((card) => cardStatus(card) === 'Weak');
    const reviews = progress.reduce((sum, p) => sum + p.reviews, 0);
    const good = progress.reduce((sum, p) => sum + (p.answers || []).filter((a) => a.rating >= 4).length, 0);
    const retention = reviews ? Math.round((good / reviews) * 100) : 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const reviewedToday = progress.filter((p) => p.lastReviewed >= todayStart.getTime()).length;
    return { seen: seen.length, due: due.length, mastered: mastered.length, weak: weak.length, reviews, retention, reviewedToday };
  }

  function renderTabs() {
    tabs.innerHTML = TABS.map(([id, label]) => `
      <button class="tab-btn ${state.tab === id ? 'active' : ''}" data-action="set-tab" data-tab="${id}">${label}</button>
    `).join('');
  }

  function render() {
    renderTabs();
    const renderers = {
      dashboard: renderDashboard,
      review: renderReview,
      reword: renderReword,
      connections: renderConnections,
      promptlab: renderPromptLab,
      curriculum: renderCurriculum,
      glossary: renderGlossary,
      settings: renderSettings
    };
    app.innerHTML = (renderers[state.tab] || renderDashboard)();
    updateTimerFace();
  }

  function renderDashboard() {
    const s = allStats();
    const levelCards = DATA.levels.map((level) => {
      const cards = DATA.cards.filter((card) => card.level === level);
      const done = cards.filter((card) => progressFor(card.id).reviews > 0).length;
      const pct = Math.round((done / cards.length) * 100);
      return { level, done, total: cards.length, pct };
    });
    const weakCards = DATA.cards
      .filter((card) => ['Weak', 'Due'].includes(cardStatus(card)))
      .slice(0, 6);

    return `
      <section class="grid two">
        <div class="panel hero">
          <span class="eyebrow">Evidence-informed AI learning system</span>
          <h2>Compress foundational AI knowledge into active recall, not passive reading.</h2>
          <p>This app trains concepts, terminology, tool names, prompting, RAG, agents, evaluation, safety, and production system thinking through a spaced repetition workflow.</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="start-review">Start due review</button>
            <button class="btn ghost" data-action="set-tab" data-tab="promptlab">Open Prompt Lab</button>
            <button class="btn ghost" data-action="set-tab" data-tab="curriculum">Browse curriculum</button>
          </div>
        </div>
        <div class="panel">${renderTimer()}</div>
      </section>

      <section class="stat-grid" style="margin-top:18px">
        ${statCard(s.due, 'Due cards')}
        ${statCard(s.seen, `Seen of ${DATA.cards.length}`)}
        ${statCard(`${s.retention}%`, 'Good/Easy ratings')}
        ${statCard(Math.floor(state.timer.totalFocusSeconds / 60), 'Focus minutes')}
      </section>

      <section class="grid two" style="margin-top:18px">
        <div class="panel">
          <h3>Level progress</h3>
          <div class="list">
            ${levelCards.map((l) => `
              <div class="list-item">
                <div class="row"><strong>${l.level}</strong><span class="spacer"></span><span class="muted">${l.done}/${l.total}</span></div>
                <div class="progress-bar" style="--w:${l.pct}%"><span></span></div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="panel">
          <h3>Today’s highest-leverage plan</h3>
          <div class="list">
            <div class="list-item"><strong>1. Recall</strong><p>Review ${Math.max(1, s.due)} due cards before learning new cards.</p></div>
            <div class="list-item"><strong>2. Chunk</strong><p>Use Connect mode to link one weak concept to at least three related terms.</p></div>
            <div class="list-item"><strong>3. Apply</strong><p>Use Prompt Lab to design one AI workflow prompt with output format and eval criteria.</p></div>
          </div>
        </div>
      </section>

      <section class="grid two" style="margin-top:18px">
        <div class="panel">
          <h3>Weak or due concepts</h3>
          ${weakCards.length ? `<div class="card-grid">${weakCards.map(miniCard).join('')}</div>` : `<div class="empty">No weak cards yet. Start reviews to calibrate your memory.</div>`}
        </div>
        <div class="panel">
          <h3>Learning principles baked in</h3>
          <div class="list">
            ${DATA.principles.map((p) => `<div class="list-item"><strong>${escapeHTML(p)}</strong></div>`).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function statCard(value, label) {
    return `<div class="stat"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`;
  }

  function miniCard(card) {
    const p = progressFor(card.id);
    return `
      <div class="mini-card">
        <div class="meta"><span class="badge dark">${escapeHTML(card.level)}</span><span class="badge dark">${escapeHTML(cardStatus(card))}</span></div>
        <h4>${escapeHTML(card.title)}</h4>
        <p>${escapeHTML(card.front)}</p>
        <p class="small muted">Due: ${fmtDate(p.due)} · Ease: ${p.ease.toFixed(2)}</p>
        <button class="btn ghost" data-action="review-card" data-id="${card.id}">Review this</button>
      </div>
    `;
  }

  function renderTimer() {
    const total = (state.timer.mode === 'focus' ? state.timer.focusMinutes : state.timer.breakMinutes) * 60;
    const progress = total > 0 ? Math.round(((total - state.timer.secondsLeft) / total) * 100) : 0;
    return `
      <div class="timer">
        <div class="timer-face" style="--progress:${progress}%">
          <div>
            <div id="timerTime" class="timer-time">${fmtMinutes(state.timer.secondsLeft)}</div>
            <div id="timerMode" class="timer-mode">${state.timer.mode === 'focus' ? 'Focus sprint' : 'Recovery break'}</div>
          </div>
        </div>
        <div class="row">
          ${state.timer.running ? `<button class="btn warn" data-action="pause-timer">Pause</button>` : `<button class="btn primary" data-action="start-timer">Start</button>`}
          <button class="btn ghost" data-action="reset-timer">Reset</button>
          <button class="btn ghost" data-action="switch-timer">Switch mode</button>
        </div>
        <p class="small muted">Default: ${state.timer.focusMinutes} min focus / ${state.timer.breakMinutes} min break. Keep sessions short and effortful.</p>
      </div>
    `;
  }

  function renderFilters() {
    return `
      <div class="filters">
        <input class="input" data-filter="q" placeholder="Search concept, tool, tag..." value="${escapeHTML(state.filters.q)}" />
        <select data-filter="level">
          ${['All', ...DATA.levels].map((l) => `<option ${state.filters.level === l ? 'selected' : ''}>${escapeHTML(l)}</option>`).join('')}
        </select>
        <select data-filter="category">
          ${['All', ...DATA.categories].map((c) => `<option ${state.filters.category === c ? 'selected' : ''}>${escapeHTML(c)}</option>`).join('')}
        </select>
        <select data-filter="status">
          ${['All', 'New', 'Due', 'Learning', 'Weak', 'Mastered'].map((st) => `<option ${state.filters.status === st ? 'selected' : ''}>${escapeHTML(st)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  function buildQueue() {
    const cards = filteredCards();
    const due = cards.filter((card) => progressFor(card.id).reviews > 0 && progressFor(card.id).due <= Date.now());
    const failedLearning = cards.filter((card) => progressFor(card.id).reviews > 0 && progressFor(card.id).reps === 0 && progressFor(card.id).due <= Date.now());
    const fresh = cards.filter((card) => progressFor(card.id).reviews === 0).slice(0, state.dailyNew);
    const weak = cards.filter((card) => cardStatus(card) === 'Weak' && progressFor(card.id).due > Date.now()).slice(0, 8);
    const ids = unique([...due, ...failedLearning, ...fresh, ...weak].map((card) => card.id));
    state.queue = shuffle(ids);
    state.queueIndex = 0;
    state.showAnswer = false;
    state.currentAnswer = '';
    saveState();
  }

  function renderReview() {
    if (!state.queue.length || state.queueIndex >= state.queue.length) {
      const count = filteredCards().length;
      return `
        <section class="panel">
          <span class="eyebrow">Active recall + spaced repetition</span>
          <h2>Review queue</h2>
          <p>Write your own answer first. Reveal only after retrieval effort, then grade honestly. This is the core of the system.</p>
          ${renderFilters()}
          <div class="empty">
            <h3>${state.queue.length ? 'Review session complete.' : 'No active queue yet.'}</h3>
            <p>${count} cards match your filters. Build a queue from due cards, weak cards, and a small number of new cards.</p>
            <button class="btn primary" data-action="build-queue">Build review queue</button>
          </div>
        </section>
      `;
    }

    const card = cardById(state.queue[state.queueIndex]);
    const p = progressFor(card.id);
    const percent = Math.round(((state.queueIndex) / state.queue.length) * 100);
    return `
      <section class="card-review">
        <div class="toolbar">
          <button class="btn ghost" data-action="build-queue">Refresh queue</button>
          <span class="badge dark">${state.queueIndex + 1}/${state.queue.length}</span>
          <span class="badge dark">${escapeHTML(card.level)}</span>
          <span class="badge dark">${escapeHTML(card.category)}</span>
          <span class="spacer"></span>
          <span class="small muted">Due: ${fmtDate(p.due)} · Reviews: ${p.reviews} · Ease: ${p.ease.toFixed(2)}</span>
        </div>
        <div class="progress-bar" style="--w:${percent}%"><span></span></div>
        <article class="flashcard">
          <div class="meta">
            <span class="badge">${escapeHTML(cardStatus(card))}</span>
            <span class="badge">${escapeHTML(card.chunk)}</span>
            ${card.tags.slice(0, 4).map((t) => `<span class="badge">#${escapeHTML(t)}</span>`).join('')}
          </div>
          <h2>${escapeHTML(card.title)}</h2>
          <p><strong>Question:</strong> ${escapeHTML(card.front)}</p>
          <label for="answer"><strong>Your answer before reveal</strong></label>
          <textarea id="answer" data-field="currentAnswer" placeholder="Write from memory. Bullet points are fine.">${escapeHTML(state.currentAnswer)}</textarea>
          ${state.showAnswer ? renderAnswer(card) : `<div class="row"><button class="btn primary" data-action="reveal-answer">Reveal answer</button><span class="small muted">Shortcut: <span class="kbd">Space</span> outside textarea</span></div>`}
        </article>
      </section>
    `;
  }

  function renderAnswer(card) {
    return `
      <div class="answer-reveal">
        <h3>Reference answer</h3>
        <p>${escapeHTML(card.back)}</p>
        <p><strong>Why it matters:</strong> ${escapeHTML(card.whyItMatters)}</p>
        <p><strong>Example:</strong> ${escapeHTML(card.example)}</p>
        <p><strong>Practice:</strong> ${escapeHTML(card.practice)}</p>
        <p><strong>Connections:</strong> ${card.connections.map(escapeHTML).join(' · ')}</p>
      </div>
      <div class="row" style="margin-top:14px">
        <button class="btn bad" data-action="grade" data-rating="1">Again · 10m</button>
        <button class="btn warn" data-action="grade" data-rating="3">Hard</button>
        <button class="btn good" data-action="grade" data-rating="4">Good</button>
        <button class="btn purple" data-action="grade" data-rating="5">Easy</button>
      </div>
    `;
  }

  function renderReword() {
    const cards = filteredCards();
    if (!state.reword.id || !cards.some((card) => card.id === state.reword.id)) {
      state.reword.id = (cards[0] || DATA.cards[0]).id;
    }
    const card = cardById(state.reword.id);
    const score = scoreTextAgainstCard(state.reword.answer, card);
    return `
      <section class="grid two">
        <div class="panel light">
          <span class="eyebrow" style="color:#0369a1;background:#e0f2fe;border-color:#bae6fd">Feynman rewording</span>
          <h2>Explain it simply: ${escapeHTML(card.title)}</h2>
          <p><strong>Prompt:</strong> ${escapeHTML(card.front)}</p>
          <p class="muted">Write as if teaching a smart beginner. Avoid copying the reference answer. The local score checks keyword coverage, not truth; use it as a nudge.</p>
          <textarea data-field="rewordAnswer" placeholder="Explain this in simple words...">${escapeHTML(state.reword.answer)}</textarea>
          <div class="row" style="margin-top:12px">
            <button class="btn primary" data-action="save-reword">Save rewording</button>
            <button class="btn ghost" data-action="random-reword">Random concept</button>
            <button class="btn ghost" data-action="review-card" data-id="${card.id}">Review card</button>
          </div>
          <div class="answer-reveal">
            <h3>Reference answer</h3>
            <p>${escapeHTML(card.back)}</p>
            <p><strong>Example:</strong> ${escapeHTML(card.example)}</p>
          </div>
        </div>
        <div class="panel">
          <h3>Coverage signal</h3>
          <div class="stat"><strong>${score.percent}%</strong><span>${score.hit.length}/${score.keywords.length} key terms present</span></div>
          <div class="progress-bar" style="--w:${score.percent}%"><span></span></div>
          <h4>Hit terms</h4>
          <div class="graph">${score.hit.map((k) => `<span class="node active">${escapeHTML(k)}</span>`).join('') || '<span class="muted">No key terms yet.</span>'}</div>
          <h4>Missing terms</h4>
          <div class="graph">${score.missing.slice(0, 16).map((k) => `<span class="node">${escapeHTML(k)}</span>`).join('') || '<span class="muted">Looks covered. Now check if it is accurate.</span>'}</div>
          <hr style="border-color:var(--line);border-style:solid;border-width:1px 0 0;margin:18px 0">
          ${renderFilters()}
        </div>
      </section>
    `;
  }

  function renderConnections() {
    const cards = filteredCards(60);
    if (!state.connect.id || !DATA.cards.some((card) => card.id === state.connect.id)) {
      state.connect.id = DATA.cards[0].id;
    }
    const card = cardById(state.connect.id);
    const backlinks = DATA.cards.filter((candidate) => candidate.connections.some((c) => c.toLowerCase() === card.title.toLowerCase())).slice(0, 10);
    const related = DATA.cards.filter((candidate) => card.connections.some((c) => c.toLowerCase() === candidate.title.toLowerCase())).slice(0, 10);
    return `
      <section class="grid two">
        <div class="panel">
          <span class="eyebrow">Connecting + chunking</span>
          <h2>Concept graph</h2>
          <p>Build a systems view. AI expertise comes from knowing how terms connect in workflows.</p>
          ${renderFilters()}
          <div class="graph">
            ${cards.map((c) => `<button class="node ${c.id === card.id ? 'active' : ''}" data-action="select-connect" data-id="${c.id}">${escapeHTML(c.title)}</button>`).join('')}
          </div>
        </div>
        <div class="panel light">
          <h2>${escapeHTML(card.title)}</h2>
          <p>${escapeHTML(card.back)}</p>
          <div class="meta"><span class="badge">${escapeHTML(card.level)}</span><span class="badge">${escapeHTML(card.category)}</span><span class="badge">${escapeHTML(card.chunk)}</span></div>
          <h3>Direct connections</h3>
          <div class="graph">${card.connections.map((c) => `<span class="node active" style="color:#0f172a;background:#e0f2fe">${escapeHTML(c)}</span>`).join('')}</div>
          <h3>Cards that point here</h3>
          <div class="list">${backlinks.length ? backlinks.map((c) => `<div class="list-item light"><strong>${escapeHTML(c.title)}</strong><p>${escapeHTML(c.front)}</p></div>`).join('') : '<p>No backlinks yet.</p>'}</div>
          <h3>Connection drill</h3>
          <p class="muted">Explain how <strong>${escapeHTML(card.title)}</strong> connects to one related term.</p>
          <textarea data-field="connectAnswer" placeholder="Example: RAG connects to hallucination because...">${escapeHTML(state.connect.answer)}</textarea>
          <div class="row" style="margin-top:12px">
            <button class="btn primary" data-action="save-connect">Save connection note</button>
            <button class="btn ghost" data-action="review-card" data-id="${card.id}">Review card</button>
          </div>
        </div>
      </section>
      <section class="panel" style="margin-top:18px">
        <h3>Related cards</h3>
        ${related.length ? `<div class="card-grid">${related.map(miniCard).join('')}</div>` : `<div class="empty">No exact related card titles found. Use the direct connection terms as a search query.</div>`}
      </section>
    `;
  }

  function renderPromptLab() {
    const built = buildPrompt();
    const score = scorePromptLab();
    return `
      <section class="grid two">
        <div class="panel">
          <span class="eyebrow">Prompting + AI workflow design</span>
          <h2>Prompt Lab</h2>
          <p>Turn rough intent into a structured prompt with context, constraints, output format, and quality criteria.</p>
          ${promptField('goal', 'Goal / task', 'What should the AI do?')}
          ${promptField('context', 'Context / source material', 'Relevant background, source text, data, audience...')}
          ${promptField('constraints', 'Constraints', 'Must use, must avoid, length, tone, assumptions, safety...')}
          ${promptField('examples', 'Examples', 'Optional few-shot examples or counterexamples...')}
          ${promptField('output', 'Output format', 'Markdown table, JSON schema, bullets, decision memo...')}
          ${promptField('quality', 'Quality bar / eval criteria', 'How will you judge if this is correct?')}
          <div class="row">
            <button class="btn primary" data-action="copy-prompt">Copy built prompt</button>
            <button class="btn ghost" data-action="refresh-promptlab">Update preview</button>
            <button class="btn ghost" data-action="clear-promptlab">Clear</button>
          </div>
        </div>
        <div class="panel light">
          <h3>Prompt quality score</h3>
          <div class="stat" style="background:#fff;color:#0f172a;border-color:#e2e8f0"><strong>${score.percent}%</strong><span>${score.label}</span></div>
          <div class="progress-bar" style="--w:${score.percent}%"><span></span></div>
          <h3>Built prompt</h3>
          <pre class="answer-box" style="white-space:pre-wrap;color:#0f172a;background:#fff">${escapeHTML(built)}</pre>
          <h3>Missing / weak areas</h3>
          <div class="list">${score.missing.map((m) => `<div class="list-item light"><strong>${escapeHTML(m)}</strong></div>`).join('') || '<div class="list-item light"><strong>All core prompt parts are present.</strong></div>'}</div>
        </div>
      </section>
      <section class="panel" style="margin-top:18px">
        <h3>Reusable prompt templates</h3>
        <div class="card-grid">
          ${DATA.promptTemplates.map((t, idx) => `
            <div class="mini-card">
              <h4>${escapeHTML(t.name)}</h4>
              <p><strong>Use:</strong> ${escapeHTML(t.use)}</p>
              <p class="small muted">${escapeHTML(t.template.slice(0, 180))}${t.template.length > 180 ? '...' : ''}</p>
              <button class="btn ghost" data-action="use-template" data-index="${idx}">Load template</button>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  function promptField(key, label, placeholder) {
    const value = state.promptLab[key] || '';
    return `
      <label class="small" for="pl-${key}"><strong>${escapeHTML(label)}</strong></label>
      <textarea id="pl-${key}" data-prompt-field="${key}" placeholder="${escapeHTML(placeholder)}">${escapeHTML(value)}</textarea>
    `;
  }

  function buildPrompt() {
    const p = state.promptLab;
    return [
      p.goal ? `Goal:\n${p.goal}` : 'Goal:\n[Add the exact task]',
      p.context ? `Context:\n${p.context}` : 'Context:\n[Add relevant facts, source material, audience, and assumptions]',
      p.constraints ? `Constraints:\n${p.constraints}` : 'Constraints:\n[Add scope, safety, style, length, source limits, and must-avoid items]',
      p.examples ? `Examples:\n${p.examples}` : 'Examples:\n[Optional: add 1-3 examples or edge cases]',
      p.output ? `Output format:\n${p.output}` : 'Output format:\n[Specify schema, table, sections, or exact fields]',
      p.quality ? `Quality bar:\n${p.quality}` : 'Quality bar:\n[Define how the answer will be evaluated]',
      'Before finalizing, check whether the answer follows the constraints and output format. State uncertainty when evidence is incomplete.'
    ].join('\n\n');
  }

  function scorePromptLab() {
    const labels = {
      goal: 'Specific goal', context: 'Relevant context', constraints: 'Constraints', examples: 'Examples or edge cases', output: 'Output format', quality: 'Quality/eval criteria'
    };
    const filled = Object.entries(state.promptLab).filter(([, v]) => v && v.trim().length >= 12).map(([k]) => k);
    const missing = Object.entries(labels).filter(([k]) => !filled.includes(k)).map(([, v]) => v);
    const percent = Math.round((filled.length / Object.keys(labels).length) * 100);
    const label = percent >= 84 ? 'Production-ready structure' : percent >= 50 ? 'Good draft, add missing controls' : 'Too vague for reliable output';
    return { percent, missing, label };
  }

  function renderCurriculum() {
    const cards = filteredCards(120);
    const total = filteredCards().length;
    return `
      <section class="panel">
        <span class="eyebrow">Curriculum map</span>
        <h2>AI foundations → operator → builder → expert</h2>
        <p>${DATA.cards.length} cards cover core terminology, system concepts, tool names, prompting, RAG, agents, evaluation, safety, and production patterns. Use filters to target weak areas.</p>
        ${renderFilters()}
        <div class="toolbar">
          <button class="btn primary" data-action="build-queue">Build queue from filters</button>
          <span class="small muted">Showing ${cards.length} of ${total} matching cards.</span>
        </div>
        <div class="card-grid">${cards.map((card) => miniCard(card)).join('')}</div>
      </section>
      <section class="grid two" style="margin-top:18px">
        <div class="panel">
          <h3>Sprint plan</h3>
          <select data-field="selectedSprint">
            ${DATA.sprints.map((s) => `<option value="${s.id}" ${state.selectedSprint === s.id ? 'selected' : ''}>${escapeHTML(s.name)}</option>`).join('')}
          </select>
          ${renderSprint()}
        </div>
        <div class="panel">
          <h3>Safe scope note</h3>
          <div class="warning">The original wording included “AI worm”. This curriculum treats that as likely “AI work/workflow”. AI worms are included only as a defensive security concept: no malware-building steps, propagation instructions, or exploitation playbooks.</div>
          <h3 style="margin-top:18px">Source notes</h3>
          <div class="list">${DATA.sourceNotes.slice(0, 5).map((s) => `<div class="list-item"><strong>${escapeHTML(s.name)}</strong><p>${escapeHTML(s.note)}</p></div>`).join('')}</div>
        </div>
      </section>
    `;
  }

  function renderSprint() {
    const sprint = DATA.sprints.find((s) => s.id === state.selectedSprint) || DATA.sprints[0];
    return `
      <div style="margin-top:14px">
        <p>${escapeHTML(sprint.goal)} Suggested: ${sprint.dailyMinutes} minutes/day.</p>
        <div class="timeline">
          ${sprint.days.slice(0, sprint.id === 'sprint-30' ? 10 : sprint.days.length).map((d) => `
            <div class="day">
              <div class="day-num">${d.day}</div>
              <div><strong>${escapeHTML(d.focus)}</strong><ul>${d.tasks.map((t) => `<li>${escapeHTML(t)}</li>`).join('')}</ul></div>
            </div>
          `).join('')}
        </div>
        ${sprint.id === 'sprint-30' ? '<p class="small muted">The 30-day sprint repeats the ten themes in deeper cycles. Open data/cards.json to customize each day.</p>' : ''}
      </div>
    `;
  }

  function renderGlossary() {
    const q = state.filters.q.trim().toLowerCase();
    const terms = DATA.glossary.filter((g) => {
      if (state.filters.level !== 'All' && g.level !== state.filters.level) return false;
      if (state.filters.category !== 'All' && g.category !== state.filters.category) return false;
      if (!q) return true;
      return [g.term, g.definition, g.category, ...(g.tags || [])].join(' ').toLowerCase().includes(q);
    });
    return `
      <section class="panel">
        <span class="eyebrow">Searchable AI vocabulary</span>
        <h2>Glossary</h2>
        <p>Use this as a quick reference, then convert weak terms back into active recall in Reviews.</p>
        ${renderFilters()}
        <div class="table-wrap">
          <table>
            <thead><tr><th>Term</th><th>Level</th><th>Category</th><th>Definition</th><th>Action</th></tr></thead>
            <tbody>
              ${terms.map((g) => {
                const card = DATA.cards.find((c) => c.title === g.term);
                return `<tr><td><strong>${escapeHTML(g.term)}</strong></td><td>${escapeHTML(g.level)}</td><td>${escapeHTML(g.category)}</td><td>${escapeHTML(g.definition)}</td><td>${card ? `<button class="btn ghost" data-action="review-card" data-id="${card.id}">Review</button>` : ''}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderSettings() {
    const s = allStats();
    return `
      <section class="grid two">
        <div class="panel">
          <span class="eyebrow">Local-first settings</span>
          <h2>Settings and backup</h2>
          <p>Your progress is saved in this browser's localStorage. Export regularly if you move devices or clear browser data.</p>
          <div class="list">
            <label class="list-item"><strong>New cards per queue</strong><input class="input" type="number" min="1" max="60" data-setting="dailyNew" value="${state.dailyNew}" /></label>
            <label class="list-item"><strong>Focus minutes</strong><input class="input" type="number" min="5" max="120" data-setting="focusMinutes" value="${state.timer.focusMinutes}" /></label>
            <label class="list-item"><strong>Break minutes</strong><input class="input" type="number" min="1" max="45" data-setting="breakMinutes" value="${state.timer.breakMinutes}" /></label>
          </div>
          <div class="toolbar">
            <button class="btn primary" data-action="export-progress">Export progress JSON</button>
            <button class="btn ghost" data-action="import-progress">Import progress JSON</button>
            <input id="importFile" type="file" accept="application/json" hidden />
            <button class="btn bad" data-action="reset-progress">Reset progress</button>
          </div>
        </div>
        <div class="panel">
          <h3>Progress summary</h3>
          <div class="stat-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
            ${statCard(s.reviews, 'Total reviews')}
            ${statCard(s.reviewedToday, 'Cards reviewed today')}
            ${statCard(s.mastered, 'Mastered cards')}
            ${statCard(s.weak, 'Weak cards')}
          </div>
          <h3 style="margin-top:18px">Keyboard shortcuts</h3>
          <div class="list">
            <div class="list-item"><span class="kbd">Space</span> Reveal answer when not typing.</div>
            <div class="list-item"><span class="kbd">1</span> Again · <span class="kbd">2</span> Hard · <span class="kbd">3</span> Good · <span class="kbd">4</span> Easy after reveal.</div>
          </div>
          <h3 style="margin-top:18px">Version</h3>
          <p>${escapeHTML(DATA.appName)} ${escapeHTML(DATA.version)} · generated ${escapeHTML(DATA.generated)}</p>
        </div>
      </section>
    `;
  }

  function gradeCurrent(rating) {
    const card = cardById(state.queue[state.queueIndex]);
    const p = progressFor(card.id);
    const now = Date.now();
    const q = Number(rating);
    p.reviews += 1;
    p.lastReviewed = now;
    p.lastRating = q;
    p.answers = p.answers || [];
    p.answers.push({ t: now, rating: q, answer: state.currentAnswer.slice(0, 1200) });
    if (p.answers.length > 12) p.answers = p.answers.slice(-12);

    if (q < 3) {
      p.lapses += 1;
      p.reps = 0;
      p.interval = 0;
      p.ease = Math.max(1.3, p.ease - 0.22);
      p.due = now + 10 * MINUTE;
    } else {
      p.reps += 1;
      const oldEase = p.ease || 2.5;
      const nextEase = oldEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      p.ease = Math.max(1.3, nextEase);
      if (p.reps === 1) {
        p.interval = q === 3 ? 1 : q === 4 ? 2 : 3;
      } else if (p.reps === 2) {
        p.interval = q === 3 ? 2 : q === 4 ? 4 : 6;
      } else {
        const multiplier = q === 3 ? 1.25 : q === 4 ? p.ease : p.ease * 1.35;
        p.interval = Math.max(1, Math.round((p.interval || 1) * multiplier));
      }
      p.due = now + p.interval * DAY;
    }

    state.queueIndex += 1;
    state.showAnswer = false;
    state.currentAnswer = '';
    if (state.queueIndex >= state.queue.length) {
      toast('Session complete. Nice work: retrieval beats rereading.');
    }
    saveState();
    render();
  }

  function scoreTextAgainstCard(text, card) {
    const stop = new Set('what when where why how does that this with from into about your before after through using used such have will into than then they them because plus minus means very each also only'.split(' '));
    const words = [card.title, card.back, card.whyItMatters, ...(card.tags || []), ...(card.connections || [])]
      .join(' ')
      .toLowerCase()
      .replace(/[^a-z0-9åäö]+/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stop.has(w));
    const keywords = unique(words).slice(0, 26);
    const lower = (text || '').toLowerCase();
    const hit = keywords.filter((k) => lower.includes(k));
    const missing = keywords.filter((k) => !lower.includes(k));
    const percent = keywords.length ? Math.round((hit.length / keywords.length) * 100) : 0;
    return { keywords, hit, missing, percent };
  }

  function unique(list) {
    return [...new Set(list)];
  }

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  function download(filename, content, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard.')).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    el.remove();
    toast('Copied to clipboard.');
  }

  function startTimer() {
    state.timer.running = true;
    saveState();
    ensureTimerInterval();
    render();
  }

  function pauseTimer() {
    state.timer.running = false;
    saveState();
    render();
  }

  function resetTimer() {
    state.timer.running = false;
    state.timer.secondsLeft = (state.timer.mode === 'focus' ? state.timer.focusMinutes : state.timer.breakMinutes) * 60;
    saveState();
    render();
  }

  function switchTimerMode() {
    state.timer.running = false;
    state.timer.mode = state.timer.mode === 'focus' ? 'break' : 'focus';
    state.timer.secondsLeft = (state.timer.mode === 'focus' ? state.timer.focusMinutes : state.timer.breakMinutes) * 60;
    saveState();
    render();
  }

  function ensureTimerInterval() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      if (!state.timer.running) return;
      state.timer.secondsLeft = Math.max(0, state.timer.secondsLeft - 1);
      if (state.timer.mode === 'focus') state.timer.totalFocusSeconds += 1;
      if (state.timer.secondsLeft <= 0) {
        const finished = state.timer.mode;
        state.timer.mode = finished === 'focus' ? 'break' : 'focus';
        state.timer.secondsLeft = (state.timer.mode === 'focus' ? state.timer.focusMinutes : state.timer.breakMinutes) * 60;
        state.timer.running = false;
        toast(finished === 'focus' ? 'Focus sprint complete. Take a recovery break.' : 'Break complete. Ready for recall.');
      }
      saveState();
      updateTimerFace();
    }, 1000);
  }

  function updateTimerFace() {
    const time = document.getElementById('timerTime');
    const mode = document.getElementById('timerMode');
    const face = document.querySelector('.timer-face');
    if (!time || !mode || !face) return;
    const total = (state.timer.mode === 'focus' ? state.timer.focusMinutes : state.timer.breakMinutes) * 60;
    const progress = total > 0 ? Math.round(((total - state.timer.secondsLeft) / total) * 100) : 0;
    time.textContent = fmtMinutes(state.timer.secondsLeft);
    mode.textContent = state.timer.mode === 'focus' ? 'Focus sprint' : 'Recovery break';
    face.style.setProperty('--progress', `${progress}%`);
  }

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'set-tab') {
      state.tab = btn.dataset.tab;
      saveState();
      render();
      return;
    }
    if (action === 'start-review') {
      state.tab = 'review';
      if (!state.queue.length || state.queueIndex >= state.queue.length) buildQueue();
      saveState();
      render();
      return;
    }
    if (action === 'build-queue') {
      buildQueue();
      state.tab = 'review';
      render();
      toast(`${state.queue.length} cards added to review queue.`);
      return;
    }
    if (action === 'review-card') {
      state.queue = [btn.dataset.id];
      state.queueIndex = 0;
      state.showAnswer = false;
      state.currentAnswer = '';
      state.tab = 'review';
      saveState();
      render();
      return;
    }
    if (action === 'reveal-answer') {
      state.showAnswer = true;
      saveState();
      render();
      return;
    }
    if (action === 'grade') {
      gradeCurrent(Number(btn.dataset.rating));
      return;
    }
    if (action === 'random-reword') {
      const cards = filteredCards();
      const card = cards[Math.floor(Math.random() * cards.length)] || DATA.cards[Math.floor(Math.random() * DATA.cards.length)];
      state.reword.id = card.id;
      state.reword.answer = '';
      saveState();
      render();
      return;
    }
    if (action === 'save-reword') {
      const p = progressFor(state.reword.id);
      p.rewords = p.rewords || [];
      p.rewords.push({ t: Date.now(), text: state.reword.answer.slice(0, 1200), score: scoreTextAgainstCard(state.reword.answer, cardById(state.reword.id)).percent });
      if (p.rewords.length > 8) p.rewords = p.rewords.slice(-8);
      saveState();
      render();
      toast('Rewording saved locally.');
      return;
    }
    if (action === 'select-connect') {
      state.connect.id = btn.dataset.id;
      state.connect.answer = '';
      saveState();
      render();
      return;
    }
    if (action === 'save-connect') {
      const p = progressFor(state.connect.id);
      p.connectionNotes = p.connectionNotes || [];
      p.connectionNotes.push({ t: Date.now(), text: state.connect.answer.slice(0, 1200) });
      if (p.connectionNotes.length > 8) p.connectionNotes = p.connectionNotes.slice(-8);
      saveState();
      toast('Connection note saved locally.');
      return;
    }
    if (action === 'copy-prompt') {
      copyText(buildPrompt());
      return;
    }
    if (action === 'refresh-promptlab') {
      saveState();
      render();
      return;
    }
    if (action === 'clear-promptlab') {
      state.promptLab = { goal: '', context: '', constraints: '', examples: '', output: '', quality: '' };
      saveState();
      render();
      return;
    }
    if (action === 'use-template') {
      const template = DATA.promptTemplates[Number(btn.dataset.index)];
      state.promptLab.goal = template.use;
      state.promptLab.context = template.template;
      state.promptLab.constraints = 'Keep the output actionable, accurate, and explicit about uncertainty.';
      state.promptLab.output = 'Return the final answer in clear sections with any schemas or tables requested.';
      state.promptLab.quality = 'The result follows the task, includes relevant context, obeys constraints, and is easy to evaluate.';
      saveState();
      render();
      toast('Template loaded into Prompt Lab.');
      return;
    }
    if (action === 'start-timer') return startTimer();
    if (action === 'pause-timer') return pauseTimer();
    if (action === 'reset-timer') return resetTimer();
    if (action === 'switch-timer') return switchTimerMode();
    if (action === 'export-progress') {
      download(`ai-mastery-progress-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), dataVersion: DATA.version, state }, null, 2));
      return;
    }
    if (action === 'import-progress') {
      document.getElementById('importFile')?.click();
      return;
    }
    if (action === 'reset-progress') {
      if (confirm('Reset all local progress? This cannot be undone unless you exported a backup.')) {
        localStorage.removeItem(STORAGE_KEY);
        state = defaultState();
        render();
        toast('Progress reset.');
      }
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.matches('[data-field="currentAnswer"]')) {
      state.currentAnswer = target.value;
      saveState();
    }
    if (target.matches('[data-field="rewordAnswer"]')) {
      state.reword.answer = target.value;
      saveState();
    }
    if (target.matches('[data-field="connectAnswer"]')) {
      state.connect.answer = target.value;
      saveState();
    }
    if (target.matches('[data-prompt-field]')) {
      state.promptLab[target.dataset.promptField] = target.value;
      saveState();
    }
    if (target.matches('[data-filter="q"]')) {
      state.filters.q = target.value;
      if (state.tab === 'review') {
        state.queue = [];
        state.queueIndex = 0;
      }
      saveState();
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('[data-filter]')) {
      state.filters[target.dataset.filter] = target.value;
      if (state.tab === 'review') {
        state.queue = [];
        state.queueIndex = 0;
      }
      saveState();
      render();
      return;
    }
    if (target.matches('[data-setting]')) {
      const n = Math.max(1, Number(target.value));
      if (target.dataset.setting === 'dailyNew') state.dailyNew = Math.min(60, n);
      if (target.dataset.setting === 'focusMinutes') {
        state.timer.focusMinutes = Math.min(120, Math.max(5, n));
        if (state.timer.mode === 'focus' && !state.timer.running) state.timer.secondsLeft = state.timer.focusMinutes * 60;
      }
      if (target.dataset.setting === 'breakMinutes') {
        state.timer.breakMinutes = Math.min(45, Math.max(1, n));
        if (state.timer.mode === 'break' && !state.timer.running) state.timer.secondsLeft = state.timer.breakMinutes * 60;
      }
      saveState();
      render();
      return;
    }
    if (target.matches('[data-field="selectedSprint"]')) {
      state.selectedSprint = target.value;
      saveState();
      render();
      return;
    }
    if (target.id === 'importFile' && target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);
          if (!imported.state) throw new Error('Missing state object');
          state = deepMerge(defaultState(), imported.state);
          saveState();
          render();
          toast('Progress imported.');
        } catch (err) {
          alert(`Could not import progress: ${err.message}`);
        }
      };
      reader.readAsText(target.files[0]);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.target && event.target.matches && event.target.matches('[data-filter="q"]') && event.key === 'Enter') {
      state.filters.q = event.target.value;
      if (state.tab === 'review') {
        state.queue = [];
        state.queueIndex = 0;
      }
      saveState();
      render();
      return;
    }
    const active = document.activeElement;
    const typing = active && ['TEXTAREA', 'INPUT', 'SELECT'].includes(active.tagName);
    if (state.tab !== 'review' || typing) return;
    if (event.code === 'Space' && !state.showAnswer) {
      event.preventDefault();
      state.showAnswer = true;
      saveState();
      render();
    }
    if (state.showAnswer && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(event.code)) {
      event.preventDefault();
      const map = { Digit1: 1, Digit2: 3, Digit3: 4, Digit4: 5 };
      gradeCurrent(map[event.code]);
    }
  });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => undefined);
  }

  ensureTimerInterval();
  render();
})();
