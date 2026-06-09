# Learning science behind the app

This tool is intentionally designed around effortful learning rather than passive reading.

## Design choices

### Active recall

The app asks learners to write an answer before revealing the reference answer. This implements retrieval practice: the learner must reconstruct knowledge rather than recognize it.

### Spaced repetition

The scheduler uses an SM-2-inspired interval system. Cards answered well are scheduled farther into the future. Cards marked Again return quickly. This is not a medical or cognitive diagnosis; it is a practical memory scheduler.

### Chunking and connecting

The curriculum groups concepts into system chunks: model, data, prompt, retrieval, tools, evaluation, production, and safety. The Connect mode forces the learner to explain relationships, not just memorize definitions.

### Interleaving

Review queues mix due, weak, and new cards across categories. This helps train selection and transfer: which concept applies in which situation?

### Feynman rewording

Reword mode asks the learner to explain concepts simply. This reveals vague understanding and builds usable explanations.

### Metacognition

Progress status, ease, lapses, weak cards, and answer history help learners calibrate what they truly know.

## References

- Pan, S. C., & Sana, F. (2022). The science of effective learning with spacing and retrieval practice. Nature Reviews Psychology. https://www.nature.com/articles/s44159-022-00089-1
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving Students’ Learning With Effective Learning Techniques. Psychological Science in the Public Interest. https://doi.org/10.1177/1529100612453266
- Weinstein, Y., Madan, C. R., & Sumeracki, M. A. (2018). Teaching the science of learning. Cognitive Research: Principles and Implications. https://doi.org/10.1186/s41235-017-0087-y

## Practical rule

The fastest safe path is not “read more”. It is:

1. Recall first.
2. Reveal and correct.
3. Reword simply.
4. Connect to a system.
5. Apply in a prompt/workflow.
6. Review again at the right interval.
