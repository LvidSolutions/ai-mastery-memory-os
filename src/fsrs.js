/* FSRS-6 scheduler — Free Spaced Repetition Scheduler, version 6.
   Faithful JavaScript port of the open-spaced-repetition reference implementation
   (py-fsrs). Default parameters are the official FSRS-6 defaults trained on
   ~700M reviews. Grades: 1=Again, 2=Hard, 3=Good, 4=Easy.

   Memory model (per card): { stability, difficulty, due, lastReview, state }
   - stability S: days until recall probability drops to 90%
   - difficulty D: 1..10
   - retrievability R(t,S) = (1 + FACTOR * t/S) ^ DECAY   (power forgetting curve)
   - next interval I(r,S) = (S/FACTOR) * (r^(1/DECAY) - 1) for desired retention r */
(() => {
  'use strict';

  // Official FSRS-6 default parameters (w0..w20); w20 is the trained decay.
  const W = [0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001,
    1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014,
    1.8729, 0.5425, 0.0912, 0.0658, 0.1542];

  const DECAY = -W[20];
  const FACTOR = Math.pow(0.9, 1 / DECAY) - 1;
  const S_MIN = 0.001;
  const S_MAX = 36500;
  const MINUTE = 60 * 1000;
  const DAY = 24 * 60 * MINUTE;
  const AGAIN_STEP_MS = 10 * MINUTE; // relearning step before the next day-level interval

  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  function retrievability(elapsedDays, stability) {
    if (!stability || stability <= 0) return 0;
    return Math.pow(1 + FACTOR * Math.max(0, elapsedDays) / stability, DECAY);
  }

  function intervalDays(stability, desiredRetention) {
    const r = clamp(desiredRetention || 0.9, 0.7, 0.99);
    const ivl = (stability / FACTOR) * (Math.pow(r, 1 / DECAY) - 1);
    return clamp(Math.round(ivl), 1, S_MAX);
  }

  function initStability(grade) {
    return clamp(W[grade - 1], S_MIN, S_MAX);
  }

  function initDifficulty(grade) {
    return clamp(W[4] - Math.exp(W[5] * (grade - 1)) + 1, 1, 10);
  }

  function nextDifficulty(d, grade) {
    const deltaD = -W[6] * (grade - 3);
    const damped = d + deltaD * ((10 - d) / 9); // linear damping
    const meanReverted = W[7] * initDifficulty(4) + (1 - W[7]) * damped;
    return clamp(meanReverted, 1, 10);
  }

  function recallStability(d, s, r, grade) {
    const hardPenalty = grade === 2 ? W[15] : 1;
    const easyBonus = grade === 4 ? W[16] : 1;
    const sInc = 1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) *
      (Math.exp(W[10] * (1 - r)) - 1) * hardPenalty * easyBonus;
    return clamp(s * sInc, S_MIN, S_MAX);
  }

  function forgetStability(d, s, r) {
    const sf = W[11] * Math.pow(d, -W[12]) *
      (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r));
    return clamp(Math.min(sf, s), S_MIN, S_MAX);
  }

  // Same-day review (elapsed < 1 day): short-term stability update.
  function shortTermStability(s, grade) {
    let sNext = s * Math.exp(W[17] * (grade - 3 + W[18])) * Math.pow(s, -W[19]);
    if (grade >= 3) sNext = Math.max(sNext, s); // a same-day success never lowers stability
    return clamp(sNext, S_MIN, S_MAX);
  }

  /* Review a card. mem may be empty/new ({} or nulls). Returns the new memory
     state plus scheduling: { stability, difficulty, due, lastReview, state, interval } */
  function review(mem, grade, now, desiredRetention) {
    now = now || Date.now();
    const g = clamp(Math.round(grade), 1, 4);
    const isNew = !mem || !mem.stability || mem.stability <= 0 || !mem.lastReview;
    let s, d;

    if (isNew) {
      s = initStability(g);
      d = initDifficulty(g);
    } else {
      const elapsed = (now - mem.lastReview) / DAY;
      const r = retrievability(elapsed, mem.stability);
      d = nextDifficulty(mem.difficulty || initDifficulty(3), g);
      if (elapsed < 1) {
        s = shortTermStability(mem.stability, g);
        if (g === 1) s = Math.min(s, mem.stability);
      } else if (g === 1) {
        s = forgetStability(mem.difficulty || d, mem.stability, r);
      } else {
        s = recallStability(mem.difficulty || d, mem.stability, r, g);
      }
    }

    let due, interval, cardState;
    if (g === 1) {
      due = now + AGAIN_STEP_MS;
      interval = 0;
      cardState = 'relearning';
    } else {
      interval = intervalDays(s, desiredRetention);
      if (g === 2 && isNew) interval = 1; // first Hard: see it again tomorrow
      due = now + interval * DAY;
      cardState = 'review';
    }

    return { stability: s, difficulty: d, due, lastReview: now, state: cardState, interval };
  }

  /* Predict button labels for the four grades without mutating anything. */
  function preview(mem, now, desiredRetention) {
    now = now || Date.now();
    const out = {};
    for (let g = 1; g <= 4; g++) {
      const r = review(mem, g, now, desiredRetention);
      out[g] = g === 1 ? '10m' : r.interval >= 30
        ? `${Math.round(r.interval / 30.44 * 10) / 10}mo`
        : `${r.interval}d`;
    }
    return out;
  }

  /* Migrate legacy SM-2 style progress ({interval, ease, reviews, lapses}) in place. */
  function migrate(p) {
    if (!p || p.stability != null) return p;
    if (p.reviews > 0) {
      p.stability = clamp(p.interval || 0.5, 0.5, S_MAX);
      p.difficulty = clamp(5 + (2.5 - (p.ease || 2.5)) * 4, 1, 10);
      p.state = (p.interval === 0 || (p.lastRating != null && p.lastRating < 3)) ? 'relearning' : 'review';
    } else {
      p.stability = 0;
      p.difficulty = 0;
      p.state = 'new';
    }
    return p;
  }

  window.FSRS = {
    version: 'FSRS-6',
    parameters: W.slice(),
    DECAY, FACTOR,
    retrievability, intervalDays, review, preview, migrate,
    initStability, initDifficulty
  };
})();
