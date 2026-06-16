(() => {
  'use strict';
  const DATA = window.AI_MASTERY_DATA;
  if (!DATA || DATA.__noMemoryReviewFormatLoaded) return;
  DATA.__noMemoryReviewFormatLoaded = true;
  DATA.version = '2.2.0-ai-expert-no-memory-concepts';
  DATA.generated = '2026-06-10';

  const removedTerms = new Set([
    'Active recall', 'Spaced repetition', 'Chunking', 'Elaboration', 'Interleaving',
    'Feynman rewording', 'Desirable difficulties', 'Calibration', 'Self-explanation',
    'Transfer practice', 'Generation effect', 'Cognitive load', 'Overlearning trap',
    'Metacognition', 'Testing effect', 'SM-2', 'Forgetting curve', 'Flashcards'
  ]);

  const isMemoryConcept = (item) => {
    const id = String(item.id || '').toLowerCase();
    const title = item.title || item.term || '';
    return item.category === 'Learning Science' || id.startsWith('learning-') || id.startsWith('ms-') || removedTerms.has(title);
  };

  DATA.cards = (DATA.cards || []).filter((card) => !isMemoryConcept(card));
  DATA.glossary = (DATA.glossary || []).filter((term) => !isMemoryConcept(term));
  DATA.categories = Array.from(new Set(DATA.cards.map((card) => card.category))).sort();

  DATA.principles = [
    'Tiered AI progression: Beginner -> Intermediate -> Advanced -> Expert',
    'Every term connects to an AI workflow, tool, risk, or evaluation decision',
    'Prompt Lab turns concepts into reusable prompt architectures',
    'System thinking: prompt, retrieval, tools, evals, deployment, and safety belong together',
    'Progressive overload: definitions -> application -> debugging -> architecture -> judgment'
  ];

  DATA.sprints = [
    {
      id: 'sprint-7',
      name: '7-day AI foundations sprint',
      dailyMinutes: 45,
      goal: 'Build a clean foundation across AI terms, prompting, RAG, agents, evaluation, and tools.',
      days: [
        { day: 1, focus: 'AI foundations', tasks: ['Map AI, ML, deep learning, generative AI, models, data, and inference.', 'Explain 10 beginner terms in plain language.', 'Use Review for AI foundation cards.'] },
        { day: 2, focus: 'Prompting', tasks: ['Open Prompt Lab.', 'Use Universal OS Prompt.', 'Create one prompt with context, constraints, and output format.'] },
        { day: 3, focus: 'LLM mechanics', tasks: ['Study tokens, context window, embeddings, transformer, and sampling.', 'Explain cost, latency, and quality tradeoffs.'] },
        { day: 4, focus: 'RAG', tasks: ['Map documents -> chunks -> embeddings -> retrieval -> answer -> evaluation.', 'Write RAG failure modes.'] },
        { day: 5, focus: 'Agents and tools', tasks: ['Map tool calling, permissions, state machine, and human approval.', 'Design one safe agent workflow.'] },
        { day: 6, focus: 'Evaluation and safety', tasks: ['Create five golden test cases.', 'Write a judge rubric.', 'Add prompt-injection defenses.'] },
        { day: 7, focus: 'Deployment and product thinking', tasks: ['Choose one AI workflow.', 'Define KPIs, risks, and deployment path.', 'Write a Codex task ticket.'] }
      ]
    },
    {
      id: 'sprint-14',
      name: '14-day AI operator sprint',
      dailyMinutes: 55,
      goal: 'Move from definitions to applied AI workflow design.',
      days: Array.from({ length: 14 }, (_, i) => ({
        day: i + 1,
        focus: ['Foundations','Prompting','RAG','Agents','Evaluation','Production','Safety'][i % 7],
        tasks: ['Work on the matching cards.', 'Apply one concept to a real workflow.', 'Write one Prompt Lab template or eval case.']
      }))
    },
    {
      id: 'sprint-30',
      name: '30-day AI builder sprint',
      dailyMinutes: 60,
      goal: 'Build practical judgment across prompt engineering, RAG, agents, evals, deployment, and governance.',
      days: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        focus: ['System map','Prompt architecture','RAG design','Agent workflow','Eval harness','Tool stack','Safety controls','Production reliability','Business workflow','Integration/deployment'][i % 10],
        tasks: ['Study the matching curriculum category.', 'Create one artifact: prompt, workflow, eval, diagram, or deployment checklist.', 'Identify one risk and mitigation.']
      }))
    }
  ];

  DATA.sourceNotes = [
    { name: 'AI expert tiering', note: 'Curriculum is organized from beginner vocabulary to intermediate workflows, advanced system design, and expert evaluation/product judgment.' },
    { name: 'Prompt Lab methods', note: 'Prompt Lab contains purpose-specific templates for ChatGPT, Claude/Fable, Codex, RAG, tool calling, agents, evaluation, research, safety, automation, and deployment.' }
  ];

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  const isSeoCard = (card) => card.category === 'SEO & CMS' || card.type === 'seo' || /^(seo|cms|backend)-/.test(String(card.id || ''));
  const isWebsiteCard = (card) => !isSeoCard(card) && (card.category === 'Architecture Web' || String(card.id || '').startsWith('aw-') || card.type === 'term');
  // SEO/CMS and website terms describe real web concepts, not AI systems.
  const isNonAiCard = (card) => isWebsiteCard(card) || isSeoCard(card);

  function detailedExplanation(card) {
    if (isNonAiCard(card)) {
      // Website / SEO / CMS terminology: explain the actual concept, not AI systems.
      const parts = [
        `${card.title}: ${card.back}`,
        card.whyItMatters ? `Why it matters: ${card.whyItMatters}` : '',
        card.example ? `Example: ${card.example}` : ''
      ].filter(Boolean);
      return parts.join(' ');
    }
    const parts = [
      `${card.title}: ${card.back}`,
      card.whyItMatters ? `In practical AI, this concept shapes how you build, choose, steer, or control a system: ${card.whyItMatters}` : '',
      card.example ? `A concrete example: ${card.example}` : '',
      'To understand it correctly, you should be able to say what the input is, what the output is, when the concept is used, which risks exist, and how it ties to quality, cost, safety, or evaluation.'
    ].filter(Boolean);
    return parts.join(' ');
  }

  function childExplanation(card) {
    // Prefer a term-specific plain-English explanation when the card provides one
    // (every website term does). This avoids the identical generic AI sentence.
    if (card.eli5) return card.eli5;
    if (isWebsiteCard(card)) {
      const first = String(card.back || '').split(/(?<=\.)\s/)[0];
      return `${card.title} is one part of a website. In simple words: ${first}`;
    }
    const simpleAction = {
      'Prompting': 'tell the AI very clearly what to do',
      'RAG & Knowledge': 'let the AI look in the right book before answering',
      'Agents & Automation': 'let a small robot helper do several steps with rules',
      'Evaluation': 'check whether the AI answer is right, a bit like grading homework',
      'Tools & Ecosystem': 'use one tool from a toolbox',
      'LLM Mechanics': 'understand how the AI brain reads and writes words',
      'Production & System Design': 'make the AI thing work safely every day',
      'Safety & Governance': 'have rules so the AI never does anything silly or dangerous',
      'Data Engineering': 'keep the AI building blocks and ingredients tidy',
      'Math & ML Essentials': 'have a scoring system that shows whether the AI is getting better',
      'Multimodal AI': 'let the AI use eyes or ears, not just text',
      'AI Foundations': 'understand one of the first building blocks of AI',
      'AI Expert Meta-Skills': 'think smartly about which AI tool to use and why'
    }[card.category] || 'understand an important AI building block';
    return `${card.title} is like a small part in a big AI machine. Simply put, it helps us ${simpleAction}. Think of AI as a helper: this is a rule, a tool, a check, or a building block that makes the helper better and safer.`;
  }

  function upgradeAnswerReveals() {
    document.querySelectorAll('.answer-reveal:not([data-two-explanations])').forEach((box) => {
      const flashcard = box.closest('.flashcard');
      const title = flashcard?.querySelector('h2')?.textContent?.trim();
      const card = DATA.cards.find((candidate) => candidate.title === title);
      if (!card) return;
      box.setAttribute('data-two-explanations', 'true');
      box.innerHTML = `
        <h3>Full professional explanation</h3>
        <p>${escapeHTML(detailedExplanation(card))}</p>
        <h3>Explanation a 5-year-old understands</h3>
        <p>${escapeHTML(childExplanation(card))}</p>
      `;
    });
  }

  const observer = new MutationObserver(upgradeAnswerReveals);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', upgradeAnswerReveals);
  setTimeout(upgradeAnswerReveals, 250);
})();
