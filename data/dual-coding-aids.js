(() => {
  'use strict';
  const DATA = window.AI_MASTERY_DATA;
  if (!DATA || DATA.__dualCodingAidsLoaded) return;
  DATA.__dualCodingAidsLoaded = true;

  const categoryMap = {
    'AI Foundations': { icon: 'blocks', scene: 'Building blocks', hook: 'See this as a foundation block that other AI parts stack on top of.' },
    'LLM Mechanics': { icon: 'tokens', scene: 'Word machine', hook: 'Picture small word pieces traveling through a machine and coming out as an answer.' },
    'Prompting': { icon: 'prompt', scene: 'Instruction card', hook: 'Think of writing a clear order for a smart helper.' },
    'RAG & Knowledge': { icon: 'library', scene: 'Library', hook: 'The AI walks to the right shelf, fetches the facts, and answers with support.' },
    'Agents & Automation': { icon: 'robot', scene: 'Robot with tools', hook: 'A helper robot takes a step, uses a tool, checks the result, and continues.' },
    'Evaluation': { icon: 'checklist', scene: 'Grading rubric', hook: 'Like grading homework: the answer must be compared against criteria.' },
    'Production & System Design': { icon: 'pipeline', scene: 'Factory line', hook: 'The AI system is a chain of steps that has to work every day.' },
    'Safety & Governance': { icon: 'shield', scene: 'Shield and rules', hook: 'Rules and guards keep the AI from doing the wrong things.' },
    'Tools & Ecosystem': { icon: 'toolbox', scene: 'Toolbox', hook: 'Every tool has one job, just like a hammer, a saw, and a screwdriver.' },
    'Data Engineering': { icon: 'database', scene: 'Data pantry', hook: 'Data is the ingredients; tidy ingredients make the AI better.' },
    'Math & ML Essentials': { icon: 'gauge', scene: 'Score gauge', hook: 'The gauge shows whether the model is guessing better or worse.' },
    'Multimodal AI': { icon: 'eye', scene: 'Eyes and ears', hook: 'The AI gets more senses than text: images, audio, video, or documents.' },
    'AI Expert Meta-Skills': { icon: 'map', scene: 'Strategy map', hook: 'You choose the right path, the right tool, and the right check for the problem.' }
  };

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function slug(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function cardByTitle(title) {
    return DATA.cards.find((card) => card.title === title);
  }

  function visualFor(type, card) {
    const label = escapeHTML(card.title);
    const cat = escapeHTML(card.category);
    const connections = (card.connections || []).slice(0, 3).map(escapeHTML);
    const accent = '#38bdf8';
    const purple = '#a78bfa';
    const mint = '#86efac';
    const ink = '#0f172a';

    if (type === 'library') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="RAG library visual">
        <rect x="20" y="25" width="380" height="170" rx="24" fill="#0f172a" stroke="#334155"/>
        <rect x="55" y="65" width="55" height="100" rx="8" fill="${accent}"/><rect x="125" y="50" width="55" height="115" rx="8" fill="${purple}"/><rect x="195" y="78" width="55" height="87" rx="8" fill="${mint}"/>
        <circle cx="320" cy="92" r="36" fill="none" stroke="#e0f2fe" stroke-width="10"/><line x1="345" y1="118" x2="375" y2="148" stroke="#e0f2fe" stroke-width="10" stroke-linecap="round"/>
        <text x="210" y="198" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">${label} → hitta fakta innan svar</text>
      </svg>`;
    if (type === 'robot') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Agent robot visual">
        <rect x="120" y="58" width="180" height="112" rx="28" fill="#111c31" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="175" cy="105" r="16" fill="${mint}"/><circle cx="245" cy="105" r="16" fill="${mint}"/>
        <path d="M170 142 Q210 165 250 142" fill="none" stroke="#e0f2fe" stroke-width="7" stroke-linecap="round"/>
        <path d="M120 112 H70 M300 112 H350" stroke="${purple}" stroke-width="10" stroke-linecap="round"/>
        <rect x="48" y="91" width="44" height="44" rx="12" fill="${accent}"/><rect x="328" y="91" width="44" height="44" rx="12" fill="${purple}"/>
        <text x="210" y="200" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">plan → tool → observe → next step</text>
      </svg>`;
    if (type === 'checklist') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Evaluation checklist visual">
        <rect x="86" y="28" width="250" height="164" rx="22" fill="#f8fafc" stroke="#bae6fd" stroke-width="4"/>
        <text x="210" y="62" text-anchor="middle" fill="${ink}" font-size="18" font-weight="900">EVAL</text>
        ${[0,1,2].map((i) => `<circle cx="125" cy="${92 + i*36}" r="10" fill="${mint}"/><path d="M119 ${92+i*36} l5 5 l11 -13" fill="none" stroke="${ink}" stroke-width="4"/><rect x="150" y="${82+i*36}" width="135" height="18" rx="9" fill="#dbeafe"/>`).join('')}
        <text x="210" y="208" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">criteria → test → improve</text>
      </svg>`;
    if (type === 'shield') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Safety shield visual">
        <path d="M210 30 L315 68 V126 C315 164 266 191 210 202 C154 191 105 164 105 126 V68 Z" fill="#111c31" stroke="${mint}" stroke-width="5"/>
        <path d="M165 115 l30 30 l65 -72" fill="none" stroke="#e0f2fe" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="210" y="205" text-anchor="middle" fill="#e5edf7" font-size="15" font-weight="800">permissions + validation + approval</text>
      </svg>`;
    if (type === 'pipeline') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Production pipeline visual">
        ${[40,145,250].map((x,i) => `<rect x="${x}" y="74" width="80" height="70" rx="18" fill="${i===0?accent:i===1?purple:mint}"/><text x="${x+40}" y="114" text-anchor="middle" fill="${ink}" font-size="13" font-weight="900">${['input','AI','check'][i]}</text>`).join('')}
        <path d="M122 109 H142 M227 109 H247 M332 109 H380" stroke="#e0f2fe" stroke-width="7" stroke-linecap="round"/>
        <path d="M372 100 l12 9 l-12 9" fill="none" stroke="#e0f2fe" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="210" y="195" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">build for production: logs, fallbacks, latency</text>
      </svg>`;
    if (type === 'toolbox') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Toolbox visual">
        <rect x="70" y="78" width="280" height="105" rx="22" fill="#111c31" stroke="#38bdf8" stroke-width="4"/>
        <rect x="155" y="45" width="110" height="48" rx="16" fill="none" stroke="#a78bfa" stroke-width="7"/>
        <circle cx="140" cy="130" r="24" fill="${accent}"/><rect x="190" y="106" width="48" height="48" rx="12" fill="${purple}"/><path d="M280 108 l35 35" stroke="${mint}" stroke-width="13" stroke-linecap="round"/>
        <text x="210" y="205" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">pick the right tool for the job</text>
      </svg>`;
    if (type === 'tokens') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Token flow visual">
        ${[45,105,165,225].map((x,i) => `<rect x="${x}" y="76" width="48" height="48" rx="13" fill="${[accent,purple,mint,'#facc15'][i]}"/><text x="${x+24}" y="106" text-anchor="middle" fill="${ink}" font-size="14" font-weight="900">${['to','ken','→','out'][i]}</text>`).join('')}
        <rect x="302" y="60" width="74" height="80" rx="22" fill="#111c31" stroke="#e0f2fe" stroke-width="4"/>
        <path d="M282 100 H300" stroke="#e0f2fe" stroke-width="7" stroke-linecap="round"/>
        <text x="210" y="195" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">text becomes tokens, tokens become the next token</text>
      </svg>`;
    if (type === 'prompt') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Prompt instruction visual">
        <rect x="70" y="36" width="280" height="148" rx="22" fill="#f8fafc" stroke="#bae6fd" stroke-width="4"/>
        <rect x="100" y="65" width="220" height="18" rx="9" fill="#dbeafe"/><rect x="100" y="98" width="170" height="18" rx="9" fill="#e9d5ff"/><rect x="100" y="131" width="205" height="18" rx="9" fill="#bbf7d0"/>
        <text x="210" y="204" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">goal + context + format + quality</text>
      </svg>`;
    if (type === 'database') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Database visual">
        <ellipse cx="210" cy="58" rx="105" ry="32" fill="${accent}"/><path d="M105 58 V150 C105 168 152 188 210 188 C268 188 315 168 315 150 V58" fill="#111c31" stroke="${accent}" stroke-width="4"/><ellipse cx="210" cy="150" rx="105" ry="32" fill="none" stroke="${purple}" stroke-width="4"/>
        <text x="210" y="203" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">clean data → better AI decisions</text>
      </svg>`;
    if (type === 'eye') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Multimodal visual">
        <path d="M60 110 Q210 20 360 110 Q210 200 60 110 Z" fill="#111c31" stroke="${accent}" stroke-width="5"/><circle cx="210" cy="110" r="42" fill="${purple}"/><circle cx="210" cy="110" r="18" fill="#e0f2fe"/>
        <path d="M80 172 C140 145 280 145 340 172" stroke="${mint}" stroke-width="8" fill="none" stroke-linecap="round"/>
        <text x="210" y="205" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">see, read, listen, verify</text>
      </svg>`;
    if (type === 'gauge') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Gauge visual">
        <path d="M100 150 A110 110 0 0 1 320 150" fill="none" stroke="#334155" stroke-width="24" stroke-linecap="round"/><path d="M100 150 A110 110 0 0 1 245 55" fill="none" stroke="${mint}" stroke-width="24" stroke-linecap="round"/><line x1="210" y1="150" x2="275" y2="92" stroke="#e0f2fe" stroke-width="9" stroke-linecap="round"/>
        <text x="210" y="190" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">measure errors, improve the model</text>
      </svg>`;
    if (type === 'map') return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Strategy map visual">
        <circle cx="90" cy="110" r="35" fill="${accent}"/><circle cx="210" cy="60" r="35" fill="${purple}"/><circle cx="330" cy="120" r="35" fill="${mint}"/><circle cx="210" cy="165" r="28" fill="#facc15"/>
        <path d="M122 98 L178 73 M238 74 L300 108 M305 137 L236 158 M184 155 L119 125" stroke="#e0f2fe" stroke-width="6" fill="none" stroke-linecap="round"/>
        <text x="210" y="207" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">problem → choice → risk → outcome</text>
      </svg>`;
    return `
      <svg viewBox="0 0 420 220" role="img" aria-label="Concept blocks visual">
        <rect x="70" y="60" width="85" height="85" rx="18" fill="${accent}"/><rect x="168" y="60" width="85" height="85" rx="18" fill="${purple}"/><rect x="266" y="60" width="85" height="85" rx="18" fill="${mint}"/>
        <text x="112" y="109" text-anchor="middle" fill="${ink}" font-size="13" font-weight="900">term</text><text x="210" y="109" text-anchor="middle" fill="${ink}" font-size="13" font-weight="900">use</text><text x="308" y="109" text-anchor="middle" fill="${ink}" font-size="13" font-weight="900">risk</text>
        <text x="210" y="195" text-anchor="middle" fill="#e5edf7" font-size="16" font-weight="800">${label} connects to ${cat}</text>
      </svg>`;
  }

  function makeVisualPrompt(card, meta) {
    const connections = (card.connections || []).slice(0, 3).join(' → ') || card.category;
    return `Draw ${card.title} as: ${meta.scene}. Add three labels: ${connections}. Say out loud why the image fits the concept.`;
  }

  function makeAudioText(card, meta) {
    const simple = `${card.title}. Picture this: ${meta.scene}. ${meta.hook}`;
    const full = `${card.title}. ${card.back}. ${card.example ? 'Example: ' + card.example : ''}`;
    return { simple, full };
  }

  function addDualCodingPanels() {
    document.querySelectorAll('.answer-reveal:not([data-dual-coded])').forEach((box) => {
      const flashcard = box.closest('.flashcard');
      const title = flashcard?.querySelector('h2')?.textContent?.trim();
      const card = cardByTitle(title);
      if (!card) return;
      const meta = categoryMap[card.category] || categoryMap['AI Foundations'];
      const audio = makeAudioText(card, meta);
      box.setAttribute('data-dual-coded', 'true');
      box.insertAdjacentHTML('beforeend', `
        <div class="dual-code-panel" data-card-title="${escapeHTML(card.title)}">
          <h3>Visual memory image</h3>
          <div class="dual-code-grid">
            <div class="dual-code-svg">${visualFor(meta.icon, card)}</div>
            <div class="dual-code-copy">
              <p><strong>Memory hook:</strong> ${escapeHTML(meta.hook)}</p>
              <p><strong>Draw it yourself:</strong> ${escapeHTML(makeVisualPrompt(card, meta))}</p>
              <p><strong>Quick link:</strong> ${escapeHTML(card.title)} → ${escapeHTML((card.connections || []).slice(0, 3).join(' → ') || card.category)}</p>
              <div class="dual-code-actions">
                <button class="btn ghost" data-audio="simple" data-title="${escapeHTML(card.title)}" data-text="${escapeHTML(audio.simple)}">Play simple audio explanation</button>
                <button class="btn ghost" data-audio="full" data-title="${escapeHTML(card.title)}" data-text="${escapeHTML(audio.full)}">Play full audio explanation</button>
                <button class="btn ghost" data-audio="cue" data-category="${escapeHTML(card.category)}">Audio cue</button>
                <button class="btn ghost" data-audio="stop">Stop audio</button>
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }

  function injectStyles() {
    if (document.getElementById('dual-coding-aids-style')) return;
    const style = document.createElement('style');
    style.id = 'dual-coding-aids-style';
    style.textContent = `
      .dual-code-panel{margin-top:16px;border-top:1px solid rgba(148,163,184,.25);padding-top:14px}
      .dual-code-panel h3{margin:0 0 10px;color:inherit}.dual-code-grid{display:grid;grid-template-columns:minmax(220px,.9fr) minmax(240px,1.1fr);gap:14px;align-items:center}
      .dual-code-svg{border-radius:18px;background:#0f172a;padding:10px;border:1px solid rgba(148,163,184,.25)}.dual-code-svg svg{width:100%;height:auto;display:block}.dual-code-copy p{margin:7px 0}.dual-code-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
      .panel.light .dual-code-svg{background:#111c31}.panel.light .dual-code-panel{border-top-color:rgba(15,23,42,.12)}
      @media(max-width:760px){.dual-code-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function speak(text, mode = 'full') {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support text-to-speech here.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
    utterance.voice = en || null;
    utterance.lang = 'en-US';
    utterance.rate = mode === 'simple' ? 0.9 : 0.98;
    utterance.pitch = mode === 'simple' ? 1.05 : 1;
    window.speechSynthesis.speak(utterance);
  }

  function playCue(category) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const base = {
      'AI Foundations': 220, 'LLM Mechanics': 260, 'Prompting': 330, 'RAG & Knowledge': 392,
      'Agents & Automation': 440, 'Evaluation': 494, 'Production & System Design': 523,
      'Safety & Governance': 587, 'Tools & Ecosystem': 659, 'Data Engineering': 294,
      'Math & ML Essentials': 349, 'Multimodal AI': 698, 'AI Expert Meta-Skills': 784
    }[category] || 330;
    [0, 0.12, 0.24].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = base * [1, 1.25, 1.5][i];
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.18);
    });
    setTimeout(() => ctx.close(), 900);
  }

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-audio]');
    if (!btn) return;
    const action = btn.dataset.audio;
    if (action === 'stop') {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }
    if (action === 'cue') {
      playCue(btn.dataset.category);
      return;
    }
    speak(btn.dataset.text || '', action);
  });

  const observer = new MutationObserver(addDualCodingPanels);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', () => { injectStyles(); addDualCodingPanels(); });
  setTimeout(() => { injectStyles(); addDualCodingPanels(); }, 250);
})();
