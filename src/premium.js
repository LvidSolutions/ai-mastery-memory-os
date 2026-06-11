/* Premium interaction layer: ambient parallax, scroll reveals, graph pan/zoom.
   Pure enhancement — the app is fully functional without it. */
(() => {
  'use strict';
  if (window.PREMIUM) return;
  window.PREMIUM = { version: 1 };
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- ambient depth layers + scroll parallax --- */
  function mountAmbient() {
    if (document.querySelector('.amb-a')) return;
    const a = document.createElement('div');
    a.className = 'amb amb-a';
    const b = document.createElement('div');
    b.className = 'amb amb-b';
    document.body.prepend(b);
    document.body.prepend(a);
    if (reduced) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        a.style.transform = `translate3d(0, ${y * -0.045}px, 0)`;
        b.style.transform = `translate3d(0, ${y * -0.09}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* --- scroll-triggered reveals --- */
  let io = null;
  function observeReveals(root) {
    if (reduced || !('IntersectionObserver' in window)) return;
    if (!io) {
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    }
    root.querySelectorAll('.panel .list-item, .panel .stat, .aw-item, .prompt-method-card').forEach((el, i) => {
      if (el.classList.contains('rv')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) return; // already visible: no hidden state
      el.classList.add('rv');
      io.observe(el);
    });
  }

  /* --- knowledge-graph pan & zoom --- */
  function attachPanZoom(stage) {
    if (stage.dataset.panReady) return;
    stage.dataset.panReady = '1';
    const svg = stage.querySelector('svg');
    if (!svg) return;
    const base = (svg.getAttribute('viewBox') || '0 0 1000 700').split(/\s+/).map(Number);
    let vb = base.slice();
    const apply = () => svg.setAttribute('viewBox', vb.map((n) => Math.round(n * 100) / 100).join(' '));

    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const mx = vb[0] + ((e.clientX - rect.left) / rect.width) * vb[2];
      const my = vb[1] + ((e.clientY - rect.top) / rect.height) * vb[3];
      const k = e.deltaY > 0 ? 1.12 : 0.89;
      const w = Math.max(base[2] * 0.35, Math.min(base[2] * 2.2, vb[2] * k));
      const h = w * (base[3] / base[2]);
      vb = [mx - (mx - vb[0]) * (w / vb[2]), my - (my - vb[1]) * (h / vb[3]), w, h];
      apply();
    }, { passive: false });

    let drag = null;
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.gnode')) return; // node clicks select, not drag
      drag = { x: e.clientX, y: e.clientY, vb: vb.slice() };
      stage.classList.add('dragging');
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const rect = stage.getBoundingClientRect();
      vb[0] = drag.vb[0] - (e.clientX - drag.x) * (vb[2] / rect.width);
      vb[1] = drag.vb[1] - (e.clientY - drag.y) * (vb[3] / rect.height);
      apply();
    });
    const end = () => { drag = null; stage.classList.remove('dragging'); };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('dblclick', () => { vb = base.slice(); apply(); });
  }

  /* --- enhance after every app render --- */
  function enhance() {
    const app = document.getElementById('app');
    if (!app) return;
    observeReveals(app);
    const stage = app.querySelector('.graph-stage');
    if (stage) attachPanZoom(stage);
  }

  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    mountAmbient();
    const app = document.getElementById('app');
    if (app) {
      new MutationObserver(() => enhance()).observe(app, { childList: true });
      enhance();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
