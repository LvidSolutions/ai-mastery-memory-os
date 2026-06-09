#!/usr/bin/env python3
"""Build browser-ready data for AI Mastery Memory OS Pro from curriculum.export.json."""
from __future__ import annotations
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "curriculum.export.json"


def slug(s: str) -> str:
    out = []
    for ch in s.lower():
        if ch.isalnum():
            out.append(ch)
        elif out and out[-1] != '-':
            out.append('-')
    return ''.join(out).strip('-')


def main() -> None:
    old = json.loads(SRC.read_text(encoding="utf-8"))
    chunk_for = {}
    for chunk in old.get("chunks", []):
        for cid in chunk.get("cards", []):
            chunk_for[cid] = chunk.get("title") or chunk.get("id") or "Curriculum chunk"

    cards = []

    def add(card: dict) -> None:
        connections = card.get("connections", []) or []
        keywords = card.get("keywords", []) or []
        tags = list(dict.fromkeys((card.get("tags", []) or []) + [str(k).lower() for k in keywords[:4]]))
        title = card.get("concept", card.get("title", "Untitled"))
        why = (
            f"{title} is part of {card.get('category', 'AI systems')} and connects to "
            f"{', '.join(connections[:3]) if connections else 'the surrounding AI workflow'}. "
            "Knowing it helps you select, prompt, evaluate, or safely operate AI systems instead of relying on vague familiarity."
        )
        example = card.get("example") or (
            f"Use {title} in a workflow by defining it, spotting it in a real AI product, and explaining how it affects output quality, cost, safety, or reliability."
        )
        cards.append({
            "id": card.get("id") or slug(title),
            "level": card.get("level", "Beginner"),
            "category": normalize_category(card.get("category", "AI Foundations")),
            "type": normalize_type(card.get("type", "concept")),
            "title": title,
            "front": card.get("prompt", f"Define {title} and explain why it matters."),
            "back": card.get("answer", ""),
            "whyItMatters": why,
            "example": example,
            "tags": tags or [slug(card.get("category", "ai"))],
            "chunk": chunk_for.get(card.get("id"), normalize_category(card.get("category", "AI Foundations"))),
            "connections": connections,
            "practice": f"Write {title} from memory, then connect it to {connections[0] if connections else 'one adjacent concept'} in a concrete AI workflow."
        })

    def add_learning_card(title, front, back, why, example, tags, connections, level="Beginner"):
        cards.append({
            "id": f"learning-{slug(title)}",
            "level": level,
            "category": "Learning Science",
            "type": "concept",
            "title": title,
            "front": front,
            "back": back,
            "whyItMatters": why,
            "example": example,
            "tags": tags,
            "chunk": "Learn faster",
            "connections": connections,
            "practice": f"Apply {title} to one AI concept you reviewed today."
        })

    learning = [
        ("Active recall", "What is active recall and why is it better than rereading?", "Active recall means trying to retrieve an answer from memory before seeing it. The effort strengthens retrieval and reveals gaps.", "AI vocabulary is dense; recall prevents confusing familiarity with mastery.", "Write the difference between AI, ML, deep learning, and generative AI before checking notes.", ["learning", "retrieval"], ["Spaced repetition", "Flashcards", "Metacognition"]),
        ("Spaced repetition", "What problem does spaced repetition solve?", "Spaced repetition schedules reviews across expanding intervals so knowledge is revisited before it disappears.", "It lets you retain many AI terms and patterns with less total time than cramming.", "Review embeddings today, in two days, next week, then later if recall stays strong.", ["learning", "SRS"], ["Active recall", "SM-2", "Forgetting curve"]),
        ("Chunking", "What is chunking in technical learning?", "Chunking groups small facts into meaningful units so working memory can handle larger systems.", "AI becomes easier when organized into chunks: data, model, prompt, tools, retrieval, evaluation, deployment.", "RAG chunk: documents → chunks → embeddings → retrieval → grounded answer.", ["learning", "working memory"], ["RAG", "Concept graph", "Context window"]),
        ("Elaboration", "How does elaboration improve memory?", "Elaboration links a new idea to why, how, when, and where it applies.", "It turns definitions into practical judgment for AI workflows.", "Explain why RAG reduces hallucination risk: it gives the model relevant external context.", ["learning", "connections"], ["Active recall", "Concrete examples", "RAG"]),
        ("Interleaving", "What is interleaving?", "Interleaving mixes related topics or problem types instead of drilling one topic in isolation.", "It trains you to choose the right AI technique, not just repeat the last technique practiced.", "Mix cards from prompting, RAG, agents, and evaluation in one review session.", ["learning", "practice"], ["Spaced repetition", "Evaluation", "Prompting"]),
        ("Metacognition", "What is metacognition in learning AI?", "Metacognition is monitoring what you know, what you only recognize, and what you can apply without notes.", "AI learners often overestimate skill after tutorials; calibration keeps progress honest.", "Mark a card Hard if you needed hints, even if the answer felt familiar after reveal.", ["learning", "calibration"], ["Active recall", "Evaluation"]),
        ("Feynman rewording", "What is Feynman-style rewording?", "It means explaining a concept in simple language, then fixing unclear parts.", "If you can explain an AI concept simply, you are more likely to use it correctly.", "A token is a small text unit the model reads, not exactly the same as a word.", ["learning", "rewording"], ["Chunking", "Concrete examples"]),
        ("Desirable difficulty", "Why should study feel slightly difficult?", "Effortful retrieval and varied practice can feel slower now but improve long-term retention and transfer.", "Becoming useful with AI requires transferable judgment, not just smooth reading.", "Writing your own answer before reveal is harder than reading, but much more diagnostic.", ["learning", "difficulty"], ["Active recall", "Interleaving"], "Intermediate"),
    ]
    for item in learning:
        add_learning_card(*item)

    for card in old["cards"]:
        add(card)

    def manual(title, level, category, card_type, front, back, tags, connections, example=None):
        cards.append({
            "id": f"manual-{slug(title)}",
            "level": level,
            "category": category,
            "type": card_type,
            "title": title,
            "front": front,
            "back": back,
            "whyItMatters": f"{title} is a high-leverage concept/tool for building or evaluating AI workflows safely and effectively.",
            "example": example or f"Use {title} in a real AI workflow and explain what quality, cost, safety, or reliability problem it solves.",
            "tags": tags,
            "chunk": category,
            "connections": connections,
            "practice": f"Write a one-sentence explanation of {title}, then give one concrete use case and one risk."
        })

    manual("AI worms defensive concept", "Advanced", "Safety & Governance", "security", "What is an AI worm, defensively?", "An AI worm is a self-propagating malicious artifact that uses AI systems, prompt injection, or AI-generated adaptation to spread. Learn it only to design defenses such as least privilege, provenance checks, sandboxing, monitoring, and human approval for risky actions.", ["security", "prompt injection", "defense"], ["Prompt injection", "Tool permissions", "Least privilege", "Monitoring"], "A malicious instruction hidden in an email tries to make an AI assistant forward itself to contacts; a safe agent treats the email as untrusted content.")
    manual("FastAPI", "Advanced", "Tools & Ecosystem", "tool", "What is FastAPI useful for in AI systems?", "FastAPI is a Python web framework often used to expose model calls, RAG pipelines, classifiers, or agent workflows as APIs.", ["tool", "python", "api"], ["Python", "Docker", "Structured outputs"], "Create a /classify-ticket endpoint that calls an LLM and returns validated JSON.")
    manual("Streamlit", "Intermediate", "Tools & Ecosystem", "tool", "What is Streamlit useful for in AI work?", "Streamlit makes it quick to build Python interfaces for data apps, AI demos, evaluation dashboards, and internal tools.", ["tool", "prototype", "python"], ["Evaluation", "Jupyter", "RAG"], "Build a small dashboard where humans rate RAG answers.")
    manual("PyTorch", "Advanced", "Tools & Ecosystem", "tool", "What is PyTorch?", "PyTorch is a deep learning framework used for model training, experimentation, fine-tuning, and research workflows.", ["tool", "deep learning", "training"], ["Deep learning", "Fine-tuning", "GPU"], "Fine-tune or inspect a small transformer model in a notebook.")
    manual("Scikit-learn", "Intermediate", "Tools & Ecosystem", "tool", "What is scikit-learn?", "Scikit-learn is a Python machine learning library for classical models, preprocessing, pipelines, and metrics.", ["tool", "machine learning", "python"], ["Classification", "Regression", "F1 score"], "Train a baseline classifier before reaching for a larger LLM system.")
    manual("Pandas", "Beginner", "Tools & Ecosystem", "tool", "Why is pandas important for AI practitioners?", "Pandas is a Python library for loading, cleaning, transforming, and analyzing tabular data.", ["tool", "data", "python"], ["Dataset", "Feature", "Evaluation"], "Inspect mislabeled training examples before model tuning.")
    manual("NumPy", "Beginner", "Tools & Ecosystem", "tool", "Why is NumPy important for AI foundations?", "NumPy provides fast numerical arrays and operations that underpin much of the Python scientific and ML ecosystem.", ["tool", "math", "python"], ["Vector", "Embedding", "PyTorch"], "Represent an embedding as a numeric vector and compute similarity.")
    manual("Anthropic API", "Intermediate", "Tools & Ecosystem", "tool", "What is the Anthropic API used for?", "The Anthropic API lets developers build applications with Claude models, including document analysis, long-context tasks, tool use, and agentic workflows.", ["tool", "api", "claude"], ["Claude", "Prompting", "Tool calling"], "Use a structured prompt with clear task, context, constraints, and output format.")
    manual("Gemini API", "Intermediate", "Tools & Ecosystem", "tool", "What is the Gemini API used for?", "The Gemini API lets developers build applications with Google's Gemini models, including multimodal and generative AI workflows.", ["tool", "api", "gemini"], ["Gemini", "Multimodal", "Google AI Studio"], "Prototype a prompt that analyzes text plus an image.")
    manual("OpenAI Agents SDK", "Advanced", "Tools & Ecosystem", "tool", "What is an agents SDK used for?", "An agents SDK helps developers orchestrate model calls, tools, handoffs, state, and guardrails in agentic applications.", ["tool", "agents", "sdk"], ["Tool calling", "State machine", "Human-in-the-loop"], "Build a support agent that retrieves policy, drafts a response, and routes risky cases to a human.")
    manual("Golden dataset", "Intermediate", "Evaluation", "concept", "What is a golden dataset?", "A golden dataset is a curated set of representative examples with trusted expected outputs, labels, or source references.", ["evals", "dataset", "testing"], ["Prompt evals", "Regression test", "RAG evals"], "Keep 100 real support questions with approved answers and run them before deploying a prompt change.")
    manual("Regression testing", "Advanced", "Evaluation", "concept", "What is regression testing for AI systems?", "Regression testing checks whether a new prompt, model, tool, or retrieval change breaks cases that previously worked.", ["evals", "testing", "production"], ["Golden dataset", "Prompt versioning", "Observability"], "Run the same test set before and after switching models.")
    manual("RAG failure modes", "Advanced", "RAG & Knowledge", "concept", "Name common RAG failure modes.", "Common RAG failures include missing documents, poor chunking, weak retrieval, stale sources, bad reranking, prompt injection in retrieved text, and the model ignoring evidence.", ["rag", "retrieval", "debugging"], ["Chunking for RAG", "Retrieval precision", "Prompt injection"], "If the answer exists in the docs but the retriever never returns it, fix retrieval before changing the model.")
    manual("Hybrid search", "Intermediate", "RAG & Knowledge", "concept", "What is hybrid search?", "Hybrid search combines keyword retrieval such as BM25 with embedding-based semantic retrieval.", ["rag", "search", "embeddings"], ["Embedding", "Vector database", "Reranking"], "Use keyword search to catch exact product names and embeddings to catch paraphrases.")
    manual("Reranking", "Intermediate", "RAG & Knowledge", "concept", "What is reranking in RAG?", "Reranking reorders retrieved candidate chunks with a stronger relevance model or scoring function before context is sent to the LLM.", ["rag", "retrieval", "quality"], ["Hybrid search", "Context window", "Grounding"], "Retrieve top 50 chunks, rerank, and pass the best 5 to the answer model.")
    manual("Loss function", "Intermediate", "Math & ML Essentials", "concept", "What is a loss function?", "A loss function measures how wrong a model prediction is so training can optimize parameters to reduce error.", ["math", "training", "optimization"], ["Training", "Gradient descent", "Evaluation"], "Cross-entropy loss is common in classification and language modeling.")
    manual("Gradient descent", "Intermediate", "Math & ML Essentials", "concept", "What is gradient descent?", "Gradient descent updates model parameters in a direction that reduces the loss function.", ["math", "optimization", "training"], ["Loss function", "Parameters", "Learning rate"], "A neural network adjusts weights slightly after a batch of examples.")
    manual("Cosine similarity", "Intermediate", "Math & ML Essentials", "concept", "Why is cosine similarity used with embeddings?", "Cosine similarity compares vector direction and is often used to estimate semantic closeness between embeddings.", ["math", "embeddings", "vectors"], ["Embedding", "Vector database", "Semantic search"], "Compare a query embedding with document chunk embeddings to retrieve similar meaning.")
    manual("Embedding dimensionality", "Intermediate", "Math & ML Essentials", "concept", "What does embedding dimensionality mean?", "Embedding dimensionality is the number of numeric components in a vector representation.", ["math", "embeddings", "vectors"], ["Embedding", "Vector database", "Cosine similarity"], "A 1536-dimensional embedding contains 1536 numbers for one text item.")
    manual("Probability calibration", "Advanced", "Math & ML Essentials", "concept", "What is probability calibration?", "Calibration means predicted probabilities match observed frequencies, so confidence scores can support thresholds and review decisions.", ["math", "evaluation", "probability"], ["Precision", "Recall", "Human-in-the-loop"], "Among cases predicted 80% likely urgent, about 80% should actually be urgent.")
    manual("Confusion matrix", "Intermediate", "Evaluation", "concept", "What does a confusion matrix show?", "A confusion matrix breaks predictions into true positives, false positives, true negatives, and false negatives.", ["evaluation", "classification", "metrics"], ["Precision", "Recall", "F1 score"], "A ticket classifier may confuse billing with refund requests; the matrix shows where.")
    manual("LLM-as-judge", "Advanced", "Evaluation", "concept", "What is LLM-as-judge?", "LLM-as-judge uses a model to score outputs against a rubric, usually with human spot checks and calibration.", ["evaluation", "llm", "rubric"], ["Golden dataset", "Rubric", "Human review"], "Score answers on factuality, completeness, source grounding, and format compliance.")
    manual("Observability", "Advanced", "Evaluation", "concept", "What should AI observability capture?", "AI observability tracks prompts, model versions, retrieved context, tool calls, latency, costs, errors, and user feedback while respecting privacy.", ["evaluation", "production", "monitoring"], ["Regression testing", "Prompt versioning", "RAG failure modes"], "Trace a bad support answer to an outdated document chunk and a prompt version.")

    # Deduplicate by id in case source and learning names overlap.
    unique_cards = []
    seen = set()
    for card in cards:
        cid = card["id"]
        if cid in seen:
            cid = f"{cid}-{len(seen)}"
            card["id"] = cid
        seen.add(cid)
        unique_cards.append(card)

    categories = sorted({c["category"] for c in unique_cards})
    glossary = [{
        "term": c["title"],
        "level": c["level"],
        "category": c["category"],
        "definition": c["back"],
        "tags": c["tags"]
    } for c in unique_cards]

    prompt_templates = [{
        "name": lab.get("title", f"Prompt Lab {i+1}"),
        "use": lab.get("mission", "Practice prompt design"),
        "template": lab.get("model") or "Goal:\nContext:\nConstraints:\nOutput format:\nQuality criteria:"
    } for i, lab in enumerate(old.get("promptLabs", []))]
    prompt_templates.extend([
        {
            "name": "AI workflow designer",
            "use": "Turn a process into an AI-assisted workflow",
            "template": "Process: [describe it]\nDesign an AI workflow with steps, model/tool choices, data inputs, prompt/context design, human approval points, evaluation metrics, privacy/security controls, and failure modes."
        },
        {
            "name": "Codex build task",
            "use": "Give a coding agent a precise repo task",
            "template": "Objective: [feature]\nStack/constraints: [files, dependencies, style]\nAcceptance tests: [observable behavior]\nSafety: avoid secrets and unsafe code.\nBefore final response, run validation or explain why it cannot run. Summarize changed files."
        },
        {
            "name": "Grounded answer prompt",
            "use": "Answer only from supplied sources",
            "template": "Answer using only the provided sources. Cite source IDs for factual claims. If the sources do not contain the answer, say what is missing and what evidence would be needed."
        }
    ])

    study = old.get("studyPlan", [])
    sprint14 = {
        "id": "sprint-14",
        "name": "14-day AI Operator Sprint",
        "goal": "Move from foundational vocabulary to practical AI workflow design.",
        "dailyMinutes": 60,
        "days": [{"day": d["day"], "focus": d["focus"], "tasks": d.get("sessions", [])} for d in study]
    }
    sprint7 = {
        "id": "sprint-7",
        "name": "7-day AI Foundation Sprint",
        "goal": "Build the fastest safe AI mental model using recall-first study.",
        "dailyMinutes": 45,
        "days": [
            {"day": 1, "focus": "Vocabulary spine", "tasks": ["AI/ML/DL/GenAI", "Model/data/training/inference", "10 active recall cards"]},
            {"day": 2, "focus": "LLM mechanics", "tasks": ["Tokens/context/temperature", "Embeddings/vector DB", "Explain hallucination controls"]},
            {"day": 3, "focus": "Prompting", "tasks": ["Prompt anatomy", "Few-shot and output formats", "Build 3 Prompt Lab templates"]},
            {"day": 4, "focus": "RAG", "tasks": ["Draw the RAG pipeline", "Chunking/retrieval/reranking", "Diagnose one RAG failure"]},
            {"day": 5, "focus": "Agents and tools", "tasks": ["Tool calling", "Workflow + human approval", "Least privilege drill"]},
            {"day": 6, "focus": "Evaluation", "tasks": ["Precision/recall/F1", "Golden dataset", "Prompt/RAG eval plan"]},
            {"day": 7, "focus": "Production and safety", "tasks": ["Latency/cost/routing", "Prompt injection", "Capstone workflow design"]}
        ]
    }
    themes = ["Foundations", "LLMs", "Prompting", "RAG", "Agents", "Evaluation", "Tools", "Production", "Safety", "Strategy"]
    sprint30 = {
        "id": "sprint-30",
        "name": "30-day AI Builder Sprint",
        "goal": "Build enough depth to specify, evaluate, and prototype AI systems.",
        "dailyMinutes": 75,
        "days": [{"day": i, "focus": themes[(i - 1) % len(themes)], "tasks": ["20 min due reviews", "25 min write/reword", "20 min workflow or code practice", "10 min summary"]} for i in range(1, 31)]
    }

    data = {
        "appName": "AI Mastery Memory OS Pro",
        "version": "2.0.0-pro",
        "generated": date.today().isoformat(),
        "principles": [
            "Active recall before reveal",
            "Spaced repetition with an SM-2-inspired scheduler",
            "Chunk concepts into systems",
            "Connect each term to workflows and tools",
            "Interleave categories for transfer",
            "Use evaluation and safety from day one"
        ],
        "levels": old.get("levels", ["Beginner", "Intermediate", "Advanced", "Expert"]),
        "categories": categories,
        "cards": unique_cards,
        "glossary": glossary,
        "promptTemplates": prompt_templates,
        "sprints": [sprint7, sprint14, sprint30],
        "sourceNotes": [
            {"name": "Pan & Sana, Nature Reviews Psychology, 2022", "note": "Review of spacing, retrieval practice, and metacognition as effective learning strategies.", "url": "https://www.nature.com/articles/s44159-022-00089-1"},
            {"name": "Dunlosky et al., Psychological Science in the Public Interest, 2013", "note": "Practice testing and distributed practice are high-utility learning techniques in the review.", "url": "https://doi.org/10.1177/1529100612453266"},
            {"name": "Weinstein, Madan & Sumeracki, Cognitive Research, 2018", "note": "Tutorial review of spaced practice, interleaving, retrieval practice, elaboration, concrete examples, and dual coding.", "url": "https://doi.org/10.1186/s41235-017-0087-y"},
            {"name": "OpenAI developer documentation", "note": "Prompting and tool/function-calling concepts used in the curriculum.", "url": "https://developers.openai.com/"},
            {"name": "Anthropic prompt engineering documentation", "note": "Prompt clarity, examples, structured prompt sections, and agentic prompting patterns.", "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"},
            {"name": "LangChain and LlamaIndex documentation", "note": "RAG, retrieval, agents, and tool-connected application concepts.", "url": "https://docs.langchain.com/"},
            {"name": "University of Toronto / Vector Institute AI worm research, 2026", "note": "Defensive awareness that AI-powered worms can adapt and spread; no offensive steps are included.", "url": "https://www.utoronto.ca/news/u-t-researchers-demonstrate-ai-worm-could-target-any-online-device"}
        ]
    }
    (ROOT / "data" / "cards.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "data" / "content.js").write_text("window.AI_MASTERY_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    print(f"Built {len(unique_cards)} cards in {len(categories)} categories.")


def normalize_category(category: str) -> str:
    mapping = {
        "Core AI Vocabulary": "AI Foundations",
        "LLMs and Applied AI": "LLM Mechanics",
        "Systems, Agents and Tooling": "Agents & Automation",
        "Frontier Concepts and Strategy": "Production & System Design",
        "Tool Names": "Tools & Ecosystem",
        "Prompting Skill": "Prompting",
    }
    return mapping.get(category, category or "AI Foundations")


def normalize_type(t: str) -> str:
    if t == "toolname":
        return "tool"
    if t in {"prompt", "practice"}:
        return "prompt"
    return t or "concept"


if __name__ == "__main__":
    main()
