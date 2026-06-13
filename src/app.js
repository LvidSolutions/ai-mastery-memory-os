(() => {
  'use strict';

  const DATA = window.AI_MASTERY_DATA;
  DATA.appName = 'AI Mastery Memory OS';
  const STORAGE_KEY = 'ai-mastery-memory-os-pro:v2';
  const MINUTE = 60 * 1000;
  const DAY = 24 * 60 * MINUTE;
  const WEBSITE_CATEGORY = 'Architecture Web';

  const TABS = [
    ['dashboard', 'Dashboard'],
    ['review', 'Review'],
    ['aicurriculum', 'AI Curriculum'],
    ['websitecurriculum', 'Website Curriculum'],
    ['promptlab', 'Prompt Lab'],
    ['progress', 'Progress'],
    ['settings', 'Settings']
  ];
  const TAB_IDS = new Set(TABS.map(([id]) => id));
  const REVIEW_MODES = [
    ['flashcards', 'Flashcards'],
    ['match', 'Match Term to Explanation'],
    ['connect', 'Connect Related Terms'],
    ['write', 'Write in Own Words']
  ];
  const REVIEW_MODE_IDS = new Set(REVIEW_MODES.map(([id]) => id));
  const CARD_MODES = new Set(['flashcards', 'write']);
  const LEGACY_TABS = {
    reviews: 'review',
    reword: 'review',
    connections: 'review',
    archweb: 'websitecurriculum',
    graph: 'progress',
    analytics: 'progress',
    curriculum: 'aicurriculum',
    glossary: 'aicurriculum'
  };

  const defaultState = () => ({
    tab: 'dashboard',
    filters: { q: '', level: 'All', category: 'All', status: 'All' },
    progress: {},
    queue: [],
    queueIndex: 0,
    reviewDomain: null,
    reviewMode: null,
    match: { ids: [], order: [], selectedTerm: null, matched: {}, wrong: null },
    connect: { id: null, pool: [], chosen: [], checked: false },
    showAnswer: false,
    currentAnswer: '',
    website: { id: null, q: '', tier: 'All', group: 'All' },
    promptLab: { goal: '', context: '', constraints: '', examples: '', output: '', quality: '' },
    timer: {
      mode: 'focus',
      focusMinutes: 25,
      breakMinutes: 5,
      secondsLeft: 25 * 60,
      running: false,
      totalFocusSeconds: 0
    },
    desiredRetention: 0.9,
    interleave: true,
    confidence: null,
    log: [],
    selectedSprint: 'sprint-7',
    dailyNew: 18,
    lastOpened: Date.now()
  });

  let state = normalizeState(loadState());
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

  function normalizeState(nextState) {
    if (!TAB_IDS.has(nextState.tab)) nextState.tab = LEGACY_TABS[nextState.tab] || 'dashboard';
    if (!nextState.website && nextState.archweb) nextState.website = nextState.archweb;
    if (!['ai', 'website', null].includes(nextState.reviewDomain)) nextState.reviewDomain = null;
    if (nextState.reviewMode != null && !REVIEW_MODE_IDS.has(nextState.reviewMode)) nextState.reviewMode = null;
    return nextState;
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

  function isWebsiteCard(card) {
    return card.category === WEBSITE_CATEGORY || String(card.id || '').startsWith('aw-') || card.type === 'term';
  }

  function domainLabel(domain) {
    return domain === 'website' ? 'Website Terminology' : 'AI';
  }

  function domainForCard(card) {
    return isWebsiteCard(card) ? 'website' : 'ai';
  }

  function domainCards(domain = 'all') {
    if (domain === 'website') return DATA.cards.filter(isWebsiteCard);
    if (domain === 'ai') return DATA.cards.filter((card) => !isWebsiteCard(card));
    return DATA.cards.slice();
  }

  function domainCategories(domain = 'all') {
    return Array.from(new Set(domainCards(domain).map((card) => card.category))).sort();
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
    if (window.FSRS) window.FSRS.migrate(state.progress[id]);
    return state.progress[id];
  }

  function cardStatus(card) {
    const p = progressFor(card.id);
    const due = p.due <= Date.now();
    if (p.reviews === 0) return 'New';
    if (due) return 'Due';
    if (p.state === 'relearning' || (p.difficulty || 0) >= 7.5 || (p.lapses > 1 && (p.stability || 0) < 7)) return 'Weak';
    if ((p.stability || 0) >= 21) return 'Mastered';
    return 'Learning';
  }

  function filteredCards(limit = Infinity, domain = 'all') {
    const q = state.filters.q.trim().toLowerCase();
    const categories = domainCategories(domain);
    const levels = Array.from(new Set(domainCards(domain).map((card) => card.level)));
    const activeCategory = categories.includes(state.filters.category) ? state.filters.category : 'All';
    const activeLevel = levels.includes(state.filters.level) ? state.filters.level : 'All';
    const cards = domainCards(domain).filter((card) => {
      if (activeLevel !== 'All' && card.level !== activeLevel) return false;
      if (activeCategory !== 'All' && card.category !== activeCategory) return false;
      if (state.filters.status !== 'All' && cardStatus(card) !== state.filters.status) return false;
      if (!q) return true;
      const haystack = [card.title, card.front, card.back, card.whyItMatters, card.example, card.category, card.level, ...(card.tags || []), ...(card.connections || [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });
    return cards.slice(0, limit);
  }

  function allStats(domain = 'all') {
    const cards = domainCards(domain);
    const progress = cards.map((card) => progressFor(card.id));
    const seen = progress.filter((p) => p.reviews > 0);
    const due = cards.filter((card) => progressFor(card.id).reviews > 0 && progressFor(card.id).due <= Date.now());
    const mastered = cards.filter((card) => cardStatus(card) === 'Mastered');
    const weak = cards.filter((card) => cardStatus(card) === 'Weak');
    const reviews = progress.reduce((sum, p) => sum + p.reviews, 0);
    const good = progress.reduce((sum, p) => sum + (p.answers || []).filter((a) => a.rating >= 4).length, 0);
    const retention = reviews ? Math.round((good / reviews) * 100) : 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const reviewedToday = progress.filter((p) => p.lastReviewed >= todayStart.getTime()).length;
    return { total: cards.length, seen: seen.length, due: due.length, mastered: mastered.length, weak: weak.length, reviews, retention, reviewedToday };
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
      aicurriculum: renderAICurriculum,
      websitecurriculum: renderWebsiteCurriculum,
      promptlab: renderPromptLab,
      progress: renderProgress,
      settings: renderSettings
    };
    app.innerHTML = (renderers[state.tab] || renderDashboard)();
    app.classList.remove('view-enter');
    void app.offsetWidth;
    app.classList.add('view-enter');
    updateTimerFace();
  }

  function renderDashboard() {
    const s = allStats();
    const aiStats = allStats('ai');
    const webStats = allStats('website');
    const levelCards = DATA.levels.map((level) => {
      const cards = domainCards('ai').filter((card) => card.level === level);
      const done = cards.filter((card) => progressFor(card.id).reviews > 0).length;
      const pct = cards.length ? Math.round((done / cards.length) * 100) : 0;
      return { level, done, total: cards.length, pct };
    });
    const weakCards = domainCards('all')
      .filter((card) => ['Weak', 'Due'].includes(cardStatus(card)))
      .slice(0, 6);

    return `\n      ${renderNextAction()}
      <section class="grid two">
        <div class="panel hero command-hero"><span class="orbital o1" aria-hidden="true"></span><span class="orbital o2" aria-hidden="true"></span>
          <span class="eyebrow">AI + Website Terminology</span>
          <h2>Choose a track, review from memory, and keep progress visible.</h2>
          <p>The app now centers on two learning areas: AI and Website Terminology. Use Review for active recall, browse each curriculum separately, and keep Prompt Lab for applied AI work.</p>
          <div class="hero-actions">
            <button class="btn primary" data-action="set-tab" data-tab="review">Open Review</button>
            <button class="btn ghost" data-action="set-tab" data-tab="promptlab">Open Prompt Lab</button>
            <button class="btn ghost" data-action="set-tab" data-tab="aicurriculum">AI Curriculum</button>
            <button class="btn ghost" data-action="set-tab" data-tab="websitecurriculum">Website Curriculum</button>
          </div>
        </div>
        <div class="panel">${renderTimer()}</div>
      </section>

      <section class="stat-grid" style="margin-top:18px">
        ${statCard(s.due, 'Due cards')}
        ${statCard(aiStats.seen, `AI seen of ${aiStats.total}`)}
        ${statCard(webStats.seen, `Website seen of ${webStats.total}`)}
        ${statCard(`${s.retention}%`, 'Good/Easy ratings')}
      </section>

      <section class="grid two" style="margin-top:18px">
        <div class="panel">
          <h3>AI level progress</h3>
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
          <h3>Start here</h3>
          <div class="list">
            <div class="list-item"><strong>1. Review</strong><p>Choose AI Review or Website Terminology Review from the Review screen.</p></div>
            <div class="list-item"><strong>2. Browse</strong><p>Use the AI Curriculum and Website Curriculum as separate reference spaces.</p></div>
            <div class="list-item"><strong>3. Apply</strong><p>Use Prompt Lab to turn AI concepts into clear prompts, rubrics, and workflows.</p></div>
          </div>
        </div>
      </section>

      <section class="grid two" style="margin-top:18px">
        <div class="panel">
          <h3>Weak or due concepts</h3>
          ${weakCards.length ? `<div class="card-grid">${weakCards.map(miniCard).join('')}</div>` : `<div class="empty">No weak cards yet. Start reviews to calibrate your memory.</div>`}
        </div>
        <div class="panel">
          <h3>Navigation</h3>
          <div class="card-grid">
            ${trackCard('ai', aiStats, 'AI Curriculum', 'aicurriculum')}
            ${trackCard('website', webStats, 'Website Curriculum', 'websitecurriculum')}
          </div>
        </div>
      </section>
    `;
  }

  function trackCard(domain, stats, curriculumLabel, tab) {
    return `
      <div class="mini-card">
        <div class="meta"><span class="badge dark">${domainLabel(domain)}</span><span class="badge dark">${stats.due} due</span></div>
        <h4>${escapeHTML(domainLabel(domain))}</h4>
        <p>${stats.seen}/${stats.total} cards seen. ${stats.weak} weak cards.</p>
        <div class="row">
          <button class="btn primary" data-action="start-domain-review" data-domain="${domain}">Review</button>
          <button class="btn ghost" data-action="set-tab" data-tab="${tab}">${escapeHTML(curriculumLabel)}</button>
        </div>
      </div>
    `;
  }

  function statCard(value, label) {
    return `<div class="stat"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`;
  }

  function miniCard(card) {
    const p = progressFor(card.id);
    const domain = domainForCard(card);
    const topic = domain === 'website' ? (card.chunk || 'Website Terminology') : card.category;
    return `
      <div class="mini-card knowledge-node concept-card">
        <div class="meta"><span class="badge dark">${escapeHTML(domainLabel(domain))}</span><span class="badge dark">${escapeHTML(card.level)}</span><span class="badge dark">${escapeHTML(cardStatus(card))}</span></div>
        <h4>${escapeHTML(card.title)}</h4>
        <p>${escapeHTML(card.front)}</p>
        <p class="small muted">Topic: ${escapeHTML(topic)}</p>
        <p class="small muted">Due: ${fmtDate(p.due)} - Stability: ${(p.stability || 0).toFixed(1)}d - Difficulty: ${(p.difficulty || 0).toFixed(1)}</p>
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

  function renderFilters(domain = 'all') {
    const categories = domainCategories(domain);
    const levels = Array.from(new Set(domainCards(domain).map((card) => card.level))).sort((a, b) => DATA.levels.indexOf(a) - DATA.levels.indexOf(b));
    return `
      <div class="filters">
        <input class="input" data-filter="q" placeholder="Search term, concept, tool, or tag..." value="${escapeHTML(state.filters.q)}" />
        <select data-filter="level">
          ${['All', ...levels].map((l) => `<option ${state.filters.level === l ? 'selected' : ''}>${escapeHTML(l)}</option>`).join('')}
        </select>
        <select data-filter="category">
          ${['All', ...categories].map((c) => `<option ${state.filters.category === c ? 'selected' : ''}>${escapeHTML(c)}</option>`).join('')}
        </select>
        <select data-filter="status">
          ${['All', 'New', 'Due', 'Learning', 'Weak', 'Mastered'].map((st) => `<option ${state.filters.status === st ? 'selected' : ''}>${escapeHTML(st)}</option>`).join('')}
        </select>
      </div>
    `;
  }

  function buildQueue(mode, domain = state.reviewDomain || 'ai') {
    state.reviewDomain = domain;
    const cards = filteredCards(Infinity, domain);
    let ids;
    if (mode === 'weak') {
      ids = cards.filter((card) => cardStatus(card) === 'Weak' || progressFor(card.id).state === 'relearning').slice(0, 20).map((card) => card.id);
    } else {
      const due = cards.filter((card) => progressFor(card.id).reviews > 0 && progressFor(card.id).due <= Date.now());
      const fresh = cards.filter((card) => progressFor(card.id).reviews === 0).slice(0, state.dailyNew);
      const weak = cards.filter((card) => cardStatus(card) === 'Weak' && progressFor(card.id).due > Date.now()).slice(0, 8);
      ids = unique([...due, ...fresh, ...weak].map((card) => card.id));
    }
    state.queue = state.interleave === false
      ? ids.slice().sort((a, b) => cardById(a).category.localeCompare(cardById(b).category))
      : shuffle(ids);
    state.queueIndex = 0;
    state.showAnswer = false;
    state.currentAnswer = '';
    saveState();
  }

  function renderReview() {
    if (!state.reviewDomain) return renderReviewLanding();
    if (!state.reviewMode) return renderModeSelect();
    const body = state.reviewMode === 'match' ? renderMatchMode()
      : state.reviewMode === 'connect' ? renderConnectMode()
      : renderCardReview(state.reviewMode);
    return renderModeBar() + body;
  }

  function renderModeBar() {
    const domain = state.reviewDomain || 'ai';
    return `
      <div class="mode-bar-wrap">
        <div class="mode-bar" role="tablist" aria-label="Review mode">
          ${REVIEW_MODES.map(([id, label]) => `
            <button class="mode-pill ${state.reviewMode === id ? 'active' : ''}" role="tab" aria-selected="${state.reviewMode === id}" data-action="set-review-mode" data-mode="${id}">${escapeHTML(label)}</button>
          `).join('')}
        </div>
        <div class="mode-bar-meta">
          <span class="badge dark">${escapeHTML(domainLabel(domain))}</span>
          <button class="btn ghost btn-sm" data-action="review-landing">Change track</button>
        </div>
      </div>`;
  }

  function renderModeSelect() {
    const domain = state.reviewDomain;
    const stats = allStats(domain);
    const descriptions = {
      flashcards: 'Standard active recall: read the question, retrieve the answer from memory, reveal, then rate how hard it was.',
      match: 'See terms and explanations side by side, then pair each term with the explanation that fits it.',
      connect: 'Start from one term and pick the concepts that are genuinely related to build a connected chain.',
      write: 'Write your own explanation from memory and set your confidence before revealing the reference answer.'
    };
    return `
      ${renderModeBar()}
      <section class="panel review-stage">
        <span class="eyebrow">${escapeHTML(domainLabel(domain))} review</span>
        <h2>Choose a review mode</h2>
        <p>Pick how you want to study the ${escapeHTML(domainLabel(domain))} deck. Every mode uses only ${escapeHTML(domainLabel(domain))} cards (${stats.total} total, ${stats.due} due). You can switch modes anytime from the bar above.</p>
        <div class="card-grid mode-card-grid">
          ${REVIEW_MODES.map(([id, label]) => `
            <article class="mini-card mode-card">
              <h4>${escapeHTML(label)}</h4>
              <p>${escapeHTML(descriptions[id])}</p>
              <button class="btn primary" data-action="set-review-mode" data-mode="${id}">Start ${escapeHTML(label)}</button>
            </article>
          `).join('')}
        </div>
      </section>`;
  }

  function renderCardReview(mode) {
    if (!state.queue.length || state.queueIndex >= state.queue.length) {
      const completed = state.queue.length && state.queueIndex >= state.queue.length;
      state.queue = [];
      state.queueIndex = 0;
      const domain = state.reviewDomain || 'ai';
      return `
        <section class="panel review-stage">
          <span class="eyebrow">${escapeHTML(domainLabel(domain))} review</span>
          <h2>${completed ? 'Session complete' : 'No cards in the queue'}</h2>
          <p>${completed ? 'Nice work — retrieval beats rereading. Build a fresh queue to keep going.' : 'There are no due or new cards for this track right now. Build a queue to review anyway.'}</p>
          <div class="row">
            <button class="btn primary" data-action="build-queue">Build ${escapeHTML(domainLabel(domain))} queue</button>
            <button class="btn ghost" data-action="build-weak-queue">Review weak cards</button>
          </div>
        </section>`;
    }

    const isWrite = mode === 'write';
    const card = cardById(state.queue[state.queueIndex]);
    const p = progressFor(card.id);
    const domain = state.reviewDomain || domainForCard(card);
    const topic = domain === 'website' ? (card.chunk || 'Website Terminology') : card.category;
    const percent = Math.round(((state.queueIndex) / state.queue.length) * 100);
    let prompt;
    if (state.showAnswer) {
      prompt = renderAnswer(card);
    } else if (isWrite) {
      prompt = `<div class="confidence-block"><p class="small muted" style="margin:0 0 8px"><strong>Calibrate first:</strong> how confident are you in your answer?</p><div class="row"><button class="btn bad" data-action="confidence" data-level="1">No idea</button><button class="btn warn" data-action="confidence" data-level="2">Think so</button><button class="btn good" data-action="confidence" data-level="3">Certain</button><button class="btn ghost" data-action="reveal-answer">Just reveal</button></div><span class="small muted">Shortcut: <span class="kbd">Space</span> outside textarea</span></div>`;
    } else {
      prompt = `<div class="confidence-block"><p class="small muted" style="margin:0 0 8px">Retrieve the answer from memory, then reveal to check and grade yourself.</p><div class="row"><button class="btn primary" data-action="reveal-answer">Reveal answer</button></div><span class="small muted">Shortcut: <span class="kbd">Space</span> outside any text field</span></div>`;
    }
    return `
      <section class="card-review">
        <div class="toolbar">
          <button class="btn ghost" data-action="build-queue">Refresh ${escapeHTML(domainLabel(domain))} queue</button>
          <span class="badge dark">${state.queueIndex + 1}/${state.queue.length}</span>
          <span class="badge dark">${escapeHTML(domainLabel(domain))}</span>
          <span class="badge dark">${escapeHTML(card.level)}</span>
          <span class="badge dark">${escapeHTML(topic)}</span>
          <span class="spacer"></span>
          <span class="small muted">Due: ${fmtDate(p.due)} - Reviews: ${p.reviews} - Stability: ${(p.stability || 0).toFixed(1)}d - Difficulty: ${(p.difficulty || 0).toFixed(1)}</span>
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
          ${isWrite ? `<label for="answer"><strong>Your answer before reveal</strong></label>
          <textarea id="answer" data-field="currentAnswer" placeholder="Write from memory. Bullet points are fine.">${escapeHTML(state.currentAnswer)}</textarea>` : ''}
          ${prompt}
        </article>
      </section>
    `;
  }

  function buildMatch(domain = state.reviewDomain || 'ai') {
    const pool = domainCards(domain).filter((card) => card.back && card.title);
    const ids = shuffle(pool.map((c) => c.id)).slice(0, Math.min(5, pool.length));
    state.match = { ids, order: shuffle(ids.slice()), selectedTerm: null, matched: {}, wrong: null };
  }

  function renderMatchMode() {
    const m = state.match;
    if (!m.ids.length) buildMatch();
    const cards = state.match.ids.map(cardById);
    const explanations = state.match.order.map(cardById);
    const matchedCount = Object.keys(state.match.matched).length;
    const done = matchedCount === cards.length && cards.length > 0;
    const truncate = (text) => { const t = String(text || ''); return t.length > 160 ? t.slice(0, 157) + '...' : t; };
    return `
      <section class="panel review-stage">
        <span class="eyebrow">Match term to explanation</span>
        <h2>Pair each term with its explanation</h2>
        <p>${done ? 'All pairs matched. Load a new set to keep practicing.' : 'Select a term, then select the explanation that defines it. Correct pairs lock in green.'} <span class="muted">${matchedCount}/${cards.length} matched.</span></p>
        <div class="match-grid">
          <div class="match-col">
            <h3>Terms</h3>
            ${cards.map((c) => {
              const matched = state.match.matched[c.id];
              const selected = state.match.selectedTerm === c.id;
              return `<button class="match-item ${matched ? 'matched' : ''} ${selected ? 'selected' : ''}" ${matched ? 'disabled' : ''} data-action="match-term" data-id="${c.id}">${escapeHTML(c.title)}</button>`;
            }).join('')}
          </div>
          <div class="match-col">
            <h3>Explanations</h3>
            ${explanations.map((c) => {
              const matched = state.match.matched[c.id];
              const wrong = state.match.wrong && state.match.wrong.expl === c.id;
              return `<button class="match-item ${matched ? 'matched' : ''} ${wrong ? 'wrong' : ''}" ${matched ? 'disabled' : ''} data-action="match-expl" data-id="${c.id}">${escapeHTML(truncate(c.back))}</button>`;
            }).join('')}
          </div>
        </div>
        <div class="row" style="margin-top:14px">
          <button class="btn primary" data-action="match-new">New set</button>
          ${done ? '<span class="small muted">Great recall — every term matched.</span>' : ''}
        </div>
      </section>`;
  }

  function buildConnect(domain = state.reviewDomain || 'ai') {
    const cards = domainCards(domain).filter((card) => (card.connections || []).length >= 2);
    const pickFrom = cards.length ? cards : domainCards(domain);
    const card = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    const real = (card.connections || []).slice(0, 6);
    const realSet = new Set(real.map((t) => t.toLowerCase()));
    const distractors = shuffle(domainCards(domain)
      .map((c) => c.title)
      .filter((t) => t !== card.title && !realSet.has(t.toLowerCase())))
      .slice(0, Math.max(2, Math.min(4, real.length)));
    state.connect = { id: card.id, pool: shuffle([...real, ...distractors]), chosen: [], checked: false };
  }

  function renderConnectMode() {
    if (!state.connect.id) buildConnect();
    const card = cardById(state.connect.id);
    const real = (card.connections || []);
    const realSet = new Set(real.map((t) => t.toLowerCase()));
    const c = state.connect;
    const chosenSet = new Set(c.chosen.map((t) => t.toLowerCase()));
    return `
      <section class="panel review-stage">
        <span class="eyebrow">Connect related terms</span>
        <h2>Build the connections</h2>
        <p>Which concepts are directly related to the term below? ${c.checked ? 'Review your result, then load a new term.' : 'Tap every related concept, then check your connections.'}</p>
        <div class="connect-term-block">
          <span class="badge dark">${escapeHTML(domainLabel(domainForCard(card)))}</span>
          <div class="connect-term">${escapeHTML(card.title)}</div>
          <p class="small muted">${escapeHTML(card.front)}</p>
        </div>
        <div class="connect-pool">
          ${c.pool.map((title) => {
            const isReal = realSet.has(title.toLowerCase());
            const isChosen = chosenSet.has(title.toLowerCase());
            let cls = isChosen ? 'chosen' : '';
            if (c.checked) {
              if (isReal && isChosen) cls = 'correct';
              else if (!isReal && isChosen) cls = 'wrong';
              else if (isReal && !isChosen) cls = 'missed';
              else cls = '';
            }
            return `<button class="connect-chip ${cls}" ${c.checked ? 'disabled' : ''} data-action="connect-toggle" data-title="${escapeHTML(title)}">${escapeHTML(title)}</button>`;
          }).join('')}
        </div>
        ${c.checked ? `
          <div class="answer-reveal">
            <h3>Connected chain</h3>
            <div class="connect-chain">
              <span class="node knowledge-node">${escapeHTML(card.title)}</span>
              ${real.map((t) => `<span class="connect-arrow">→</span><span class="node knowledge-node">${escapeHTML(t)}</span>`).join('')}
            </div>
            <p class="small muted" style="margin-top:10px">Green = correct, red = not related, amber = a connection you missed.</p>
          </div>` : ''}
        <div class="row" style="margin-top:14px">
          ${c.checked
            ? '<button class="btn primary" data-action="connect-next">Next term</button>'
            : '<button class="btn primary" data-action="connect-check">Check connections</button>'}
        </div>
      </section>`;
  }

  function renderReviewLanding() {
    const aiStats = allStats('ai');
    const webStats = allStats('website');
    return `
      <section class="panel review-stage"><span class="orbital o2" aria-hidden="true"></span>
        <span class="eyebrow">Active recall + spaced repetition</span>
        <h2>Choose a review track</h2>
        <p>Pick the deck you want to review. Next you'll choose a review mode — flashcards, match, connect, or write in your own words — using only that track's cards.</p>
        <div class="review-choice-grid">
          ${reviewChoice('ai', 'AI Review', 'Review AI concepts, prompting, RAG, agents, evaluation, safety, tools, and production terms.', aiStats)}
          ${reviewChoice('website', 'Website Terminology Review', 'Review website terminology with wireframes, plain-English explanations, and practical examples.', webStats)}
        </div>
      </section>
    `;
  }

  function reviewChoice(domain, title, description, stats) {
    return `
      <article class="review-choice">
        <div class="meta"><span class="badge dark">${escapeHTML(domainLabel(domain))}</span><span class="badge dark">${stats.total} cards</span></div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
        <div class="stat-grid mini-stats">
          ${statCard(stats.due, 'Due')}
          ${statCard(stats.weak, 'Weak')}
          ${statCard(stats.seen, 'Seen')}
        </div>
        <div class="row">
          <button class="btn primary" data-action="start-domain-review" data-domain="${domain}">Start ${escapeHTML(title)}</button>
          <button class="btn ghost" data-action="set-tab" data-tab="${domain === 'website' ? 'websitecurriculum' : 'aicurriculum'}">Open curriculum</button>
        </div>
      </article>
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
        <p><strong>Connections:</strong> ${card.connections.map(escapeHTML).join(' - ')}</p>
      </div>
      ${(() => { const pv = window.FSRS.preview(progressFor(card.id), Date.now(), state.desiredRetention || 0.9); return `
      <div class="row grade-row" style="margin-top:14px">
        <button class="btn bad" data-action="grade" data-rating="1">Again - ${pv[1]}</button>
        <button class="btn warn" data-action="grade" data-rating="2">Hard - ${pv[2]}</button>
        <button class="btn good" data-action="grade" data-rating="3">Good - ${pv[3]}</button>
        <button class="btn purple" data-action="grade" data-rating="4">Easy - ${pv[4]}</button>
      </div>`; })()}
    `;
  }

  function tierMastery() {
    return DATA.levels.map((level) => {
      const cs = domainCards('ai').filter((c) => c.level === level);
      const solid = cs.filter((c) => (progressFor(c.id).stability || 0) >= 7).length;
      return { level, total: cs.length, solid, pct: cs.length ? Math.round((solid / cs.length) * 100) : 0 };
    });
  }

  function renderNextAction() {
    const ai = allStats('ai');
    const web = allStats('website');
    const preferred = ai.due || ai.weak || !web.due ? 'ai' : 'website';
    return `
      <section class="panel" style="margin-bottom:18px">
        <span class="eyebrow">Recommended next action</span>
        <div class="row" style="margin-top:10px">
          <button class="btn primary" data-action="start-domain-review" data-domain="${preferred}">Start ${escapeHTML(domainLabel(preferred))} Review</button>
          <button class="btn ghost" data-action="set-tab" data-tab="review">Choose review track</button>
          <span class="spacer"></span>
          <span class="small muted">AI due: <strong>${ai.due}</strong> - Website due: <strong>${web.due}</strong></span>
        </div>
      </section>`;
  }

  function svgBars(values, labels) {
    const max = Math.max(1, ...values);
    const n = values.length;
    const bw = 200 / n;
    const bars = values.map((v, i) => {
      const h = Math.round((v / max) * 64);
      return `<rect class="bar" x="${(i * bw + bw * 0.18).toFixed(1)}" y="${72 - h}" width="${(bw * 0.64).toFixed(1)}" height="${Math.max(h, 1)}" rx="1.6"/>` +
        (v ? `<text class="bar-v" x="${(i * bw + bw * 0.5).toFixed(1)}" y="${68 - h}" text-anchor="middle">${v}</text>` : '');
    }).join('');
    const labs = labels.map((l, i) => `<text class="bar-l" x="${(i * bw + bw * 0.5).toFixed(1)}" y="84" text-anchor="middle">${l}</text>`).join('');
    return `<svg class="bars" viewBox="0 0 200 88" role="img">${bars}${labs}</svg>`;
  }

  function renderProgress() {
    const now = Date.now();
    const log = state.log || [];
    const dayKey = (t) => new Date(t).toISOString().slice(0, 10);
    const dayCounts = [];
    const dayLabels = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * DAY);
      dayCounts.push(log.filter((e) => dayKey(e.t) === d.toISOString().slice(0, 10)).length);
      dayLabels.push(i % 2 ? '' : String(d.getDate()));
    }
    const recent = log.slice(-100);
    const retention = recent.length ? Math.round((recent.filter((e) => e.g >= 2).length / recent.length) * 100) : null;
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const k = dayKey(now - i * DAY);
      if (log.some((e) => dayKey(e.t) === k)) streak++;
      else if (i > 0) break;
    }
    const forecast = [];
    const fLabels = [];
    for (let d = 0; d < 7; d++) {
      const start = now + (d === 0 ? -1e15 : d * DAY);
      const end = now + (d + 1) * DAY;
      forecast.push(DATA.cards.filter((c) => { const p = state.progress[c.id]; return p && p.reviews > 0 && p.due > (d === 0 ? 0 : start) && p.due <= end; }).length);
      fLabels.push(d === 0 ? 'now' : '+' + d + 'd');
    }
    const conf = [1, 2, 3].map((level) => {
      const es = log.filter((e) => e.c === level);
      return { level, n: es.length, acc: es.length ? Math.round((es.filter((e) => e.g >= 2).length / es.length) * 100) : null };
    });
    const confName = { 1: 'No idea', 2: 'Think so', 3: 'Certain' };
    const statuses = { New: 0, Due: 0, Learning: 0, Weak: 0, Mastered: 0 };
    let sSum = 0, dSum = 0, reviewed = 0;
    DATA.cards.forEach((c) => {
      statuses[cardStatus(c)] = (statuses[cardStatus(c)] || 0) + 1;
      const p = state.progress[c.id];
      if (p && p.reviews > 0) { reviewed++; sSum += p.stability || 0; dSum += p.difficulty || 0; }
    });
    const mastery = tierMastery();
    const aiStats = allStats('ai');
    const webStats = allStats('website');
    return `
      <section class="grid two">
        <div class="panel">
          <span class="eyebrow">Progress</span>
          <h2>Review progress</h2>
          <div class="stat-grid mini-stats">
            ${statCard(aiStats.seen, `AI seen of ${aiStats.total}`)}
            ${statCard(aiStats.due, 'AI due')}
            ${statCard(webStats.seen, `Website seen of ${webStats.total}`)}
            ${statCard(webStats.due, 'Website due')}
          </div>
          <h3 style="margin-top:18px">Memory health</h3>
          <div class="stat-grid">
            <div class="stat"><strong>${retention == null ? '-' : retention + '%'}</strong><span>Recall rate from the last ${recent.length || 0} reviews</span></div>
            <div class="stat"><strong>${streak}</strong><span>Day streak</span></div>
            <div class="stat"><strong>${reviewed ? (sSum / reviewed).toFixed(1) + 'd' : '-'}</strong><span>Avg stability</span></div>
            <div class="stat"><strong>${reviewed ? (dSum / reviewed).toFixed(1) : '-'}</strong><span>Avg difficulty (1-10)</span></div>
          </div>
          <h3 style="margin-top:18px">Reviews per day (last 14 days)</h3>
          ${svgBars(dayCounts, dayLabels)}
          <h3>Due forecast (next 7 days)</h3>
          ${svgBars(forecast, fLabels)}
        </div>
        <div class="panel">
          <h3>Calibration</h3>
          <p class="small muted">Use this to compare confidence with recall quality after review sessions.</p>
          <div class="table-wrap"><table>
            <tr><th>You said</th><th>Reviews</th><th>Actually recalled</th></tr>
            ${conf.map((c) => `<tr><td>${confName[c.level]}</td><td>${c.n}</td><td>${c.acc == null ? '-' : c.acc + '%'}</td></tr>`).join('')}
          </table></div>
          <h3 style="margin-top:18px">Card states</h3>
          <div class="graph">${Object.entries(statuses).map(([k, v]) => `<span class="node knowledge-node">${k}: ${v}</span>`).join('')}</div>
          <h3 style="margin-top:18px">AI tier progress</h3>
          <div class="list">
            ${mastery.map((m) => `<div class="list-item"><strong>${escapeHTML(m.level)}</strong> - ${m.solid}/${m.total} solid (stability >= 7 days)<div class="progress-bar" style="--w:${m.pct}%;margin-top:8px"><span></span></div></div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function awTerm(id) {
    const AW = window.ARCH_WEB;
    return (AW && (AW.byId[id] || AW.terms[0])) || null;
  }

  function renderWebsiteCurriculum() {
    const AW = window.ARCH_WEB;
    if (!AW) return '<section class="panel"><h2>Website Curriculum</h2><p class="muted">Website terminology failed to load.</p></section>';
    const st = state.website;
    if (!st.id || !AW.byId[st.id]) st.id = AW.terms[0].id;
    const q = (st.q || '').trim().toLowerCase();
    const tiers = ['All', 'Beginner', 'Intermediate', 'Advanced'];
    const groups = ['All', ...AW.groups];
    const list = AW.terms.filter((t) => {
      if (st.tier !== 'All' && t.tier !== st.tier) return false;
      if (st.group !== 'All' && t.group !== st.group) return false;
      if (!q) return true;
      return (t.title + ' ' + t.pro + ' ' + t.eli5 + ' ' + t.why + ' ' + t.group).toLowerCase().includes(q);
    });
    const term = awTerm(st.id);
    const p = progressFor(term.id);
    const related = term.related.map((id) => AW.byId[id]).filter(Boolean);
    return `
      <section class="grid two">
        <div class="panel">
          <span class="eyebrow">Website Terminology</span>
          <h2>Website Curriculum</h2>
          <p>${AW.terms.length} website terms with wireframes, professional explanations, plain-English explanations, examples, and review questions.</p>
          <div class="toolbar">
            <input class="input" style="flex:2;min-width:150px" data-aw-field="q" placeholder="Search website terms..." value="${escapeHTML(st.q)}" />
            <select data-aw-field="tier">${tiers.map((t) => `<option ${t === st.tier ? 'selected' : ''}>${t}</option>`).join('')}</select>
            <select data-aw-field="group">${groups.map((g) => `<option ${g === st.group ? 'selected' : ''}>${g}</option>`).join('')}</select>
          </div>
          <div class="aw-list">
            ${list.map((t) => `
              <button class="aw-item ${t.id === term.id ? 'active' : ''}" data-action="aw-select" data-id="${t.id}">
                <span class="aw-item-wf">${AW.wire(t.v)}</span>
                <span><strong>${escapeHTML(t.title)}</strong><em>${escapeHTML(t.tier)} - ${escapeHTML(t.group)}</em></span>
              </button>`).join('') || '<div class="empty">No terms match this filter.</div>'}
          </div>
        </div>
        <div class="panel light aw-detail">
          <div class="meta"><span class="badge">Website Terminology</span><span class="badge">${escapeHTML(term.tier)}</span><span class="badge">${escapeHTML(term.group)}</span><span class="badge">${cardStatus(cardById(term.id))}</span></div>
          <h2>${escapeHTML(term.title)}</h2>
          <figure class="aw-figure">${AW.wire(term.v)}</figure>
          <h3>Professional explanation</h3>
          <p>${escapeHTML(term.pro)}</p>
          <h3>Plain-English explanation</h3>
          <p class="aw-eli5">${escapeHTML(term.eli5)}</p>
          <h3>Why it matters</h3>
          <p>${escapeHTML(term.why)}</p>
          <h3>Example</h3>
          <p>${escapeHTML(term.example)}</p>
          <h3>Review question</h3>
          <p><strong>${escapeHTML(term.question)}</strong></p>
          <div class="row" style="margin:10px 0 14px">
            <button class="btn primary" data-action="review-card" data-id="${term.id}">Review this term</button>
            <button class="btn ghost" data-action="start-domain-review" data-domain="website">Start Website Terminology Review</button>
            <span class="small muted">Due: ${fmtDate(p.due)} - Reviews: ${p.reviews}</span>
          </div>
          <h3>Related concepts</h3>
          <div class="graph">${related.map((r) => `<button class="node knowledge-node" data-action="aw-select" data-id="${r.id}">${escapeHTML(r.title)}</button>`).join('')}</div>
          <p class="small muted" style="margin-top:12px">Practice: ${escapeHTML(term.practice)}</p>
        </div>
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

  function renderAICurriculum() {
    const cards = filteredCards(120, 'ai');
    const total = filteredCards(Infinity, 'ai').length;
    return `
      <section class="panel">
        <span class="eyebrow">AI</span>
        <h2>AI Curriculum</h2>
        <p>${domainCards('ai').length} cards cover AI terminology, prompting, RAG, agents, evaluation, safety, tools, and production patterns. Use filters to target weak areas.</p>
        ${renderFilters('ai')}
        <div class="toolbar">
          <button class="btn primary" data-action="start-domain-review" data-domain="ai">Review AI cards</button>
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
          <h3>AI track focus</h3>
          <div class="list">
            <div class="list-item"><strong>Learn the terms</strong><p>Use the curriculum as a reference when a review answer feels unclear.</p></div>
            <div class="list-item"><strong>Practice retrieval</strong><p>Start AI Review when you are ready to test recall instead of reading.</p></div>
            <div class="list-item"><strong>Apply in Prompt Lab</strong><p>Turn concepts into prompts, output formats, and evaluation criteria.</p></div>
          </div>
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

  function renderSettings() {
    const s = allStats();
    return `
      <section class="grid two">
        <div class="panel">
          <span class="eyebrow">Local-first settings</span>
          <h2>Settings and backup</h2>
          <p>Your progress is saved in this browser's localStorage. Export regularly if you move devices or clear browser data.</p>
          <div class="list map-list">
            <label class="list-item"><strong>New cards per queue</strong><input class="input" type="number" min="1" max="60" data-setting="dailyNew" value="${state.dailyNew}" /></label>
            <label class="list-item"><strong>Focus minutes</strong><input class="input" type="number" min="5" max="120" data-setting="focusMinutes" value="${state.timer.focusMinutes}" /></label>
            <label class="list-item"><strong>Break minutes</strong><input class="input" type="number" min="1" max="45" data-setting="breakMinutes" value="${state.timer.breakMinutes}" /></label>
            <label class="list-item"><strong>Desired retention: ${Math.round((state.desiredRetention || 0.9) * 100)}%</strong><input class="input" type="range" min="80" max="95" step="1" data-setting="desiredRetention" value="${Math.round((state.desiredRetention || 0.9) * 100)}" /><span class="small muted">FSRS-6 scheduler. Higher = shorter intervals, more reviews, stronger memory. 90% is the evidence-based default.</span></label>
            <label class="list-item"><strong>Interleaving</strong><select data-setting="interleave"><option value="on" ${state.interleave !== false ? 'selected' : ''}>On - mix topics (recommended)</option><option value="off" ${state.interleave === false ? 'selected' : ''}>Off - block by topic</option></select><span class="small muted">Mixed practice feels harder but builds far stronger discrimination between concepts.</span></label>
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
            <div class="list-item"><span class="kbd">1</span> Again - <span class="kbd">2</span> Hard - <span class="kbd">3</span> Good - <span class="kbd">4</span> Easy after reveal.</div>
          </div>
          <h3 style="margin-top:18px">Version</h3>
          <p>${escapeHTML(DATA.appName)} ${escapeHTML(DATA.version)} - generated ${escapeHTML(DATA.generated)}</p>
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

    const g = Math.min(4, Math.max(1, q));
    const next = window.FSRS.review(p, g, now, state.desiredRetention || 0.9);
    if (g === 1) { p.lapses += 1; } else { p.reps += 1; }
    p.stability = next.stability;
    p.difficulty = next.difficulty;
    p.due = next.due;
    p.lastReview = now;
    p.state = next.state;
    p.interval = next.interval;
    state.log = state.log || [];
    state.log.push({ t: now, id: card.id, g, c: state.confidence });
    if (state.log.length > 2500) state.log = state.log.slice(-2000);
    state.confidence = null;

    state.queueIndex += 1;
    state.showAnswer = false;
    state.currentAnswer = '';
    if (state.queueIndex >= state.queue.length) {
      toast('Session complete. Nice work: retrieval beats rereading.');
    }
    saveState();
    render();
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
      state.tab = TAB_IDS.has(btn.dataset.tab) ? btn.dataset.tab : (LEGACY_TABS[btn.dataset.tab] || 'dashboard');
      saveState();
      render();
      return;
    }
    if (action === 'start-review') {
      state.tab = 'review';
      state.queue = [];
      state.queueIndex = 0;
      saveState();
      render();
      return;
    }
    if (action === 'review-landing') {
      state.tab = 'review';
      state.reviewDomain = null;
      state.reviewMode = null;
      state.queue = [];
      state.queueIndex = 0;
      state.showAnswer = false;
      state.currentAnswer = '';
      saveState();
      render();
      return;
    }
    if (action === 'start-domain-review') {
      state.tab = 'review';
      state.reviewDomain = btn.dataset.domain === 'website' ? 'website' : 'ai';
      state.reviewMode = null;
      state.queue = [];
      state.queueIndex = 0;
      state.match = { ids: [], order: [], selectedTerm: null, matched: {}, wrong: null };
      state.connect = { id: null, pool: [], chosen: [], checked: false };
      saveState();
      render();
      return;
    }
    if (action === 'set-review-mode') {
      const mode = REVIEW_MODE_IDS.has(btn.dataset.mode) ? btn.dataset.mode : 'flashcards';
      state.reviewMode = mode;
      state.tab = 'review';
      state.showAnswer = false;
      state.currentAnswer = '';
      const domain = state.reviewDomain || 'ai';
      if (CARD_MODES.has(mode)) {
        if (!state.queue.length) buildQueue(null, domain);
      } else if (mode === 'match') {
        buildMatch(domain);
      } else if (mode === 'connect') {
        buildConnect(domain);
      }
      saveState();
      render();
      return;
    }
    if (action === 'match-term') {
      state.match.selectedTerm = btn.dataset.id;
      state.match.wrong = null;
      saveState();
      render();
      return;
    }
    if (action === 'match-expl') {
      const m = state.match;
      if (m.matched[btn.dataset.id]) return;
      if (!m.selectedTerm) { toast('Pick a term first, then its explanation.'); return; }
      if (btn.dataset.id === m.selectedTerm) {
        m.matched[m.selectedTerm] = true;
        m.selectedTerm = null;
        m.wrong = null;
        if (Object.keys(m.matched).length === m.ids.length) toast('All pairs matched. Nice recall.');
      } else {
        m.wrong = { term: m.selectedTerm, expl: btn.dataset.id };
      }
      saveState();
      render();
      return;
    }
    if (action === 'match-new') {
      buildMatch(state.reviewDomain || 'ai');
      saveState();
      render();
      return;
    }
    if (action === 'connect-toggle') {
      if (state.connect.checked) return;
      const title = btn.dataset.title;
      const lower = title.toLowerCase();
      const idx = state.connect.chosen.findIndex((t) => t.toLowerCase() === lower);
      if (idx >= 0) state.connect.chosen.splice(idx, 1);
      else state.connect.chosen.push(title);
      saveState();
      render();
      return;
    }
    if (action === 'connect-check') {
      state.connect.checked = true;
      saveState();
      render();
      return;
    }
    if (action === 'connect-next') {
      buildConnect(state.reviewDomain || 'ai');
      saveState();
      render();
      return;
    }
    if (action === 'build-queue') {
      buildQueue(null, state.reviewDomain || 'ai');
      state.tab = 'review';
      render();
      toast(`${state.queue.length} cards added to review queue.`);
      return;
    }
    if (action === 'review-card') {
      const card = cardById(btn.dataset.id);
      state.queue = [btn.dataset.id];
      state.queueIndex = 0;
      state.reviewDomain = domainForCard(card);
      state.reviewMode = 'flashcards';
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
    if (action === 'confidence') {
      state.confidence = Number(btn.dataset.level);
      state.showAnswer = true;
      saveState();
      render();
      return;
    }
    if (action === 'build-weak-queue') {
      state.tab = 'review';
      buildQueue('weak', state.reviewDomain || 'ai');
      if (!state.queue.length) toast('No weak cards right now. Keep reviewing to surface them.');
      saveState();
      render();
      return;
    }
    if (action === 'focus-tier') {
      state.filters.level = btn.dataset.level;
      state.reviewDomain = 'ai';
      state.tab = 'aicurriculum';
      saveState();
      render();
      return;
    }
    if (action === 'aw-select') {
      state.website.id = btn.dataset.id;
      saveState();
      render();
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

  document.addEventListener('change', (event) => {
    const el = event.target.closest('[data-aw-field]');
    if (!el) return;
    state.website[el.dataset.awField] = el.value;
    saveState();
    render();
  });

  document.addEventListener('input', (event) => {
    const aw = event.target.closest('input[data-aw-field="q"]');
    if (aw) { state.website.q = aw.value; saveState(); const v = aw.value; render(); const el2 = document.querySelector('input[data-aw-field="q"]'); if (el2) { el2.focus(); el2.setSelectionRange(v.length, v.length); } return; }
    const target = event.target;
    if (target.matches('[data-field="currentAnswer"]')) {
      state.currentAnswer = target.value;
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
      if (target.dataset.setting === 'desiredRetention') state.desiredRetention = Math.min(0.95, Math.max(0.8, Number(target.value) / 100));
      if (target.dataset.setting === 'interleave') state.interleave = target.value !== 'off';
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
          state = normalizeState(deepMerge(defaultState(), imported.state));
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
    if (state.tab !== 'review' || typing || !CARD_MODES.has(state.reviewMode)) return;
    if (event.code === 'Space' && !state.showAnswer) {
      event.preventDefault();
      state.showAnswer = true;
      saveState();
      render();
    }
    if (state.showAnswer && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(event.code)) {
      event.preventDefault();
      const map = { Digit1: 1, Digit2: 2, Digit3: 3, Digit4: 4 };
      gradeCurrent(map[event.code]);
    }
  });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => undefined);
  }

  ensureTimerInterval();
  render();
})();
