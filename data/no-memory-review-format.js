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

  function detailedExplanation(card) {
    const parts = [
      `${card.title}: ${card.back}`,
      card.whyItMatters ? `I praktisk AI betyder det att begreppet påverkar hur du bygger, väljer, styr eller kontrollerar ett system: ${card.whyItMatters}` : '',
      card.example ? `Ett konkret exempel är: ${card.example}` : '',
      'För att förstå det korrekt ska du kunna säga vad inputen är, vad outputen är, när begreppet används, vilka risker som finns, och hur det kopplas till kvalitet, kostnad, säkerhet eller utvärdering.'
    ].filter(Boolean);
    return parts.join(' ');
  }

  function childExplanation(card) {
    const simpleAction = {
      'Prompting': 'berätta väldigt tydligt för AI:n vad den ska göra',
      'RAG & Knowledge': 'låta AI:n titta i rätt bok innan den svarar',
      'Agents & Automation': 'låta en liten robot-hjälpare göra flera steg med regler',
      'Evaluation': 'kolla om AI:ns svar är rätt, ungefär som att rätta en läxa',
      'Tools & Ecosystem': 'använda ett verktyg i en verktygslåda',
      'LLM Mechanics': 'förstå hur AI-hjärnan läser och skriver ord',
      'Production & System Design': 'göra så att AI-saken fungerar tryggt varje dag',
      'Safety & Governance': 'ha regler så att AI:n inte gör något dumt eller farligt',
      'Data Engineering': 'hålla ordning på AI:ns byggklossar och ingredienser',
      'Math & ML Essentials': 'ha ett poängsystem som visar om AI:n blir bättre',
      'Multimodal AI': 'låta AI:n använda ögon eller öron, inte bara text',
      'AI Foundations': 'förstå en av de första byggklossarna i AI',
      'AI Expert Meta-Skills': 'tänka smart om vilket AI-verktyg som ska användas och varför'
    }[card.category] || 'förstå en viktig AI-byggkloss';
    return `${card.title} är som en liten del i en stor AI-maskin. Enkelt sagt hjälper det oss att ${simpleAction}. Tänk att AI är en hjälpare: det här är antingen en regel, ett verktyg, en kontroll eller en byggkloss som gör hjälparen bättre och säkrare.`;
  }

  function upgradeAnswerReveals() {
    document.querySelectorAll('.answer-reveal:not([data-two-explanations])').forEach((box) => {
      const flashcard = box.closest('.flashcard');
      const title = flashcard?.querySelector('h2')?.textContent?.trim();
      const card = DATA.cards.find((candidate) => candidate.title === title);
      if (!card) return;
      box.setAttribute('data-two-explanations', 'true');
      box.innerHTML = `
        <h3>Längre korrekt förklaring</h3>
        <p>${escapeHTML(detailedExplanation(card))}</p>
        <h3>Förklaring som en 5-åring förstår</h3>
        <p>${escapeHTML(childExplanation(card))}</p>
      `;
    });
  }

  const observer = new MutationObserver(upgradeAnswerReveals);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', upgradeAnswerReveals);
  setTimeout(upgradeAnswerReveals, 250);
})();
