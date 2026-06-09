# Pro Codex prompt

Use this prompt in Codex, Cursor, GitHub Copilot Workspace, or another coding agent to rebuild or extend this project.

```text
You are a senior full-stack product engineer and learning-science-informed curriculum designer.

Build a GitHub Pages-ready and local-first web app called “AI Mastery Memory OS Pro”. It must run by opening index.html directly and also work when served from GitHub Pages. Avoid required backend services. Use plain HTML/CSS/JavaScript unless there is a strong reason to add dependencies.

Goal:
Create an optimal memorisation and active learning tool for learning foundational AI knowledge in the smallest safe time frame. The curriculum must cover AI system concepts, terminology, tool names, prompting, RAG, agents, evaluation, safety, and production workflow skills. Organize material into Beginner, Intermediate, Advanced, and Expert levels.

Core features:
1. Spaced repetition scheduler inspired by SM-2 with Again/Hard/Good/Easy ratings.
2. Active recall mode where the user writes their own answer before revealing the answer.
3. Flashcards with front, answer, why it matters, concrete example, tags, level, category, chunk, and connections.
4. Reword/Feynman mode where the user explains a card simply and receives a rough keyword coverage signal.
5. Connecting/chunking mode that shows related concepts and asks the user to explain relationships.
6. Prompt Lab that helps the user build prompts with goal, context, constraints, examples, output format, and quality/evaluation criteria.
7. Searchable glossary.
8. 7-day, 14-day, and 30-day study sprint plans.
9. Local progress persistence with localStorage plus JSON export/import.
10. Focus timer for recall sprints.
11. Clear safety treatment: if “AI worm” appears, treat it as likely “AI work/workflow”; include AI worm only as a defensive security concept with no malware-building steps.

Learning science constraints:
- Prioritize retrieval practice, spacing, interleaving, elaboration, concrete examples, and metacognitive calibration.
- Avoid passive “read-only course” design.
- Every concept should have a practice action.
- The user should be forced to make a recall attempt before seeing the answer.

Curriculum scope:
Beginner:
- AI vs ML vs deep learning vs generative AI
- data, model, training, inference
- supervised/unsupervised/reinforcement learning
- tokens, context window, temperature, hallucination
- embeddings, semantic search, vector database
- prompt anatomy, zero-shot, few-shot, output format
- responsible AI basics

Intermediate:
- transformers, attention, pretraining, instruction tuning, RLHF/DPO
- RAG pipeline, chunking, overlap, hybrid search, reranking, citations
- tool/function calling, structured outputs, agents, memory, workflows
- OpenAI API, Anthropic API, Gemini, Hugging Face, LangChain, LangGraph, LlamaIndex, vector DB tools, Cursor, GitHub Copilot/Codex, Colab/Jupyter
- precision, recall, F1, confusion matrix, golden datasets, LLM-as-judge, rubrics

Advanced:
- fine-tuning, LoRA, quantization, multimodal models, model routing
- production latency/cost/caching/fallbacks/rate limits/retries/idempotency
- observability, prompt versioning, regression tests, red teaming
- data privacy, prompt injection, least privilege, human-in-the-loop
- Docker, FastAPI, Streamlit, PyTorch, scikit-learn

Expert:
- foundation models, scaling laws, MoE, distillation, synthetic data
- eval-first AI development, model cards, open vs closed model tradeoffs
- governance, alignment, AI product wedges, human-AI interface design

Deliverables:
- index.html
- src/app.js
- src/styles.css
- data/cards.json
- data/content.js for direct file usage
- scripts/build_data.py to regenerate card data
- scripts/validate.py to validate data shape and uniqueness
- README.md with local and GitHub Pages instructions
- docs/LEARNING_SCIENCE.md with references
- docs/CURRICULUM_MAP.md
- docs/ARCHITECTURE.md
- .github/workflows/deploy-pages.yml

Acceptance criteria:
- App loads with no network connection.
- Reviews work after opening index.html locally.
- Progress persists after page refresh.
- Export/import works.
- Filters work by level/category/status/search.
- No unsafe AI-worm instructions are included.
- JavaScript passes syntax check.
- JSON validates.
- README explains local, GitHub Pages, and customization paths.
```
