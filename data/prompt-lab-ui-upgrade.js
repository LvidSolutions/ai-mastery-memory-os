(() => {
  'use strict';
  const DATA = window.AI_MASTERY_DATA;
  if (!DATA || !Array.isArray(DATA.promptMethods)) return;

  const state = { q: '', category: 'All' };
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const categories = () => ['All', ...Array.from(new Set(DATA.promptMethods.map((m) => m.category))).sort()];
  const filteredMethods = () => {
    const q = state.q.trim().toLowerCase();
    return DATA.promptMethods.filter((m) => {
      if (state.category !== 'All' && m.category !== state.category) return false;
      if (!q) return true;
      return [m.name, m.category, m.tools, m.use, m.why, m.formula, m.template, m.eval].join(' ').toLowerCase().includes(q);
    });
  };

  function injectStyle() {
    if (document.getElementById('prompt-lab-upgrade-styles')) return;
    const style = document.createElement('style');
    style.id = 'prompt-lab-upgrade-styles';
    style.textContent = `
      .prompt-method-header{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin:14px 0 18px}
      .prompt-method-header label{display:grid;gap:6px;font-size:.85rem;color:var(--muted)}
      .prompt-method-header input,.prompt-method-header select{min-width:220px}
      .method-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px}
      .method-card{border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.045);padding:15px;display:grid;gap:9px}
      .method-card h4{margin:0;font-size:1.05rem}.method-card p{margin:0;color:var(--muted)}
      .method-card pre{white-space:pre-wrap;max-height:260px;overflow:auto;border-radius:14px;padding:12px;background:rgba(2,6,23,.5);border:1px solid var(--line);font-size:.82rem;line-height:1.45}
      .method-meta{display:flex;flex-wrap:wrap;gap:6px}.method-pill{display:inline-flex;border-radius:999px;border:1px solid var(--line);background:rgba(148,163,184,.12);padding:3px 8px;font-size:.74rem;color:#cbd5e1;font-weight:700}
      .method-card details{display:grid;gap:8px}.method-card summary{cursor:pointer;font-weight:800;color:#bae6fd}
      .method-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}
    `;
    document.head.appendChild(style);
  }

  function methodLibraryHTML() {
    const methods = filteredMethods();
    return `
      <section id="prompt-method-library" class="panel" style="margin-top:18px">
        <span class="eyebrow">Optimal prompting methods</span>
        <h2>Purpose-specific Prompt Lab library</h2>
        <p>Use the right prompt architecture for the job: ChatGPT, Claude/Fable, Codex, RAG, agents, structured outputs, evaluation, research, business, automation, multimodal work, and deployment.</p>
        <div class="prompt-method-header">
          <label><strong>Search methods</strong><input id="promptMethodSearch" class="input" placeholder="Codex, RAG, Claude, eval, JSON..." value="${escapeHTML(state.q)}"></label>
          <label><strong>Category</strong><select id="promptMethodCategory">${categories().map((c) => `<option ${state.category === c ? 'selected' : ''}>${escapeHTML(c)}</option>`).join('')}</select></label>
          <span class="small muted">Showing ${methods.length} of ${DATA.promptMethods.length} methods.</span>
        </div>
        <div class="method-grid">
          ${methods.map((m) => `
            <article class="method-card" data-method-id="${escapeHTML(m.id)}">
              <div class="method-meta"><span class="method-pill">${escapeHTML(m.category)}</span><span class="method-pill">${escapeHTML(m.tools)}</span></div>
              <h4>${escapeHTML(m.name)}</h4>
              <p><strong>Use:</strong> ${escapeHTML(m.use)}</p>
              <p><strong>Why:</strong> ${escapeHTML(m.why)}</p>
              <details>
                <summary>Formula + template</summary>
                <p><strong>Formula:</strong> ${escapeHTML(m.formula)}</p>
                <p><strong>Eval:</strong> ${escapeHTML(m.eval)}</p>
                <pre>${escapeHTML(m.template)}</pre>
              </details>
              <div class="method-actions">
                <button class="btn primary" data-pl-action="use-method" data-method-id="${escapeHTML(m.id)}">Load into builder</button>
                <button class="btn ghost" data-pl-action="copy-method" data-method-id="${escapeHTML(m.id)}">Copy template</button>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `;
  }

  function enhancePromptLab() {
    injectStyle();
    const app = document.getElementById('app');
    if (!app || !app.textContent.includes('Prompt Lab')) return;
    if (document.getElementById('prompt-method-library')) return;
    app.insertAdjacentHTML('beforeend', methodLibraryHTML());
    const search = document.getElementById('promptMethodSearch');
    const category = document.getElementById('promptMethodCategory');
    if (search) search.addEventListener('input', (event) => { state.q = event.target.value; rerenderLibrary(); });
    if (category) category.addEventListener('change', (event) => { state.category = event.target.value; rerenderLibrary(); });
  }

  function rerenderLibrary() {
    const old = document.getElementById('prompt-method-library');
    if (!old) return;
    old.outerHTML = methodLibraryHTML();
    const search = document.getElementById('promptMethodSearch');
    const category = document.getElementById('promptMethodCategory');
    if (search) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
      search.addEventListener('input', (event) => { state.q = event.target.value; rerenderLibrary(); });
    }
    if (category) category.addEventListener('change', (event) => { state.category = event.target.value; rerenderLibrary(); });
  }

  function methodById(id) {
    return DATA.promptMethods.find((m) => m.id === id);
  }

  function setPromptField(id, value) {
    const el = document.getElementById(`pl-${id}`);
    if (!el) return;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function loadMethod(method) {
    setPromptField('goal', method.use);
    setPromptField('context', method.template);
    setPromptField('constraints', `Use the ${method.name} method. Tools/purpose: ${method.tools}. Formula: ${method.formula}. Keep the answer evidence-aware, specific, and honest about uncertainty.`);
    setPromptField('examples', 'Add examples, edge cases, or counterexamples when they would reduce ambiguity.');
    setPromptField('output', 'Return the answer in the exact structure requested by the template. Use tables, JSON, or sections when specified.');
    setPromptField('quality', method.eval);
    const refresh = document.querySelector('[data-action="refresh-promptlab"]');
    if (refresh) refresh.click();
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
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
  }

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-pl-action]');
    if (!btn) return;
    const method = methodById(btn.dataset.methodId);
    if (!method) return;
    if (btn.dataset.plAction === 'use-method') loadMethod(method);
    if (btn.dataset.plAction === 'copy-method') copy(method.template);
  });

  const observer = new MutationObserver(() => enhancePromptLab());
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhancePromptLab);
  setTimeout(enhancePromptLab, 250);
})();
