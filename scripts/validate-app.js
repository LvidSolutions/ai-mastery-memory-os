#!/usr/bin/env node
/* Data + integration validation gate. Run before deploy: node scripts/validate-app.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let failures = 0;
const check = (label, ok, extra = '') => {
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + label + (extra ? ' — ' + extra : ''));
  if (!ok) failures++;
};

// minimal DOM stubs so data layers evaluate headlessly
global.MutationObserver = class { observe() {} disconnect() {} };
const doc = { getElementById: () => null, addEventListener: () => {}, querySelectorAll: () => [], querySelector: () => null,
  body: { appendChild: () => {} }, createElement: () => ({ style: {}, classList: { add() {} }, setAttribute() {}, appendChild() {} }), readyState: 'loading', head: { appendChild: () => {} } };
global.window = { document: doc }; global.document = doc;

const load = (f) => eval.call(global, fs.readFileSync(path.join(ROOT, f), 'utf8'));
['data/content.js', 'data/memory-ai-expert-pack.js', 'data/prompt-methods-v2.js', 'data/no-memory-review-format.js', 'data/webdev.js', 'src/fsrs.js'].forEach(load);

const D = global.window.AI_MASTERY_DATA;
const AW = global.window.ARCH_WEB;
const F = global.window.FSRS;

check('deck loaded with 300+ cards', D && D.cards.length >= 300, D && D.cards.length + ' cards');
check('no duplicate card ids', new Set(D.cards.map((c) => c.id)).size === D.cards.length);
const required = ['id', 'level', 'category', 'title', 'front', 'back'];
const incomplete = D.cards.filter((c) => required.some((k) => !c[k]));
check('all cards have required fields', incomplete.length === 0, incomplete.slice(0, 3).map((c) => c.id).join(','));
check('arch web: 36 terms', AW && AW.terms.length === 36);
let brokenRel = 0;
AW.terms.forEach((t) => t.related.forEach((r) => { if (!AW.byId[r]) brokenRel++; }));
check('arch web: 0 broken related links', brokenRel === 0, brokenRel + ' broken');
check('prompt methods: 23+', D.promptMethods && D.promptMethods.length >= 23, D.promptMethods.length + '');
const pmFields = ['id', 'category', 'name', 'use', 'why', 'formula', 'template', 'eval'];
check('prompt methods complete', D.promptMethods.every((m) => pmFields.every((k) => m[k])));
check('FSRS-6 loaded (21 params)', F && F.parameters.length === 21 && F.version === 'FSRS-6');
const g = F.review(null, 3, Date.now(), 0.9);
check('FSRS sanity: new Good = S 2.3065, 2d', Math.abs(g.stability - 2.3065) < 1e-9 && g.interval === 2);
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
['data/content.js', 'data/webdev.js', 'src/fsrs.js', 'data/prompt-methods-v2.js', 'src/app.js', 'src/mobile.css'].forEach((f) => {
  check(`index.html loads ${f}`, idx.includes(f));
  check(`sw.js caches ${f}`, sw.includes(f.replace(/^/, './')) || sw.includes(f));
});
console.log(failures ? `\n${failures} FAILURES` : '\nALL VALIDATION PASSED');
process.exit(failures ? 1 : 0);
