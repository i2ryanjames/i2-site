/* =========================================================================
   i2 Ministries — Phase 5 Motion Layer
   Loads AFTER gsap.min.js + ScrollTrigger.min.js from CDN.
   Adds scroll-triggered counter count-up + progress-bar fill + hero line
   cascade. Coexists with existing .reveal IntersectionObserver system —
   this layer ENHANCES, doesn't replace.

   Activate via data attributes in HTML:
     <span data-counter="1900000000" data-counter-format="abbrev">0</span>
     <div class="progress-bar" data-progress="38"></div>
     <h1 data-hero-lines>...</h1>
   ========================================================================= */
(function () {
  'use strict';

  // ─── Reduced motion bail ────────────────────────────────────────────────
  const prefersReduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Number formatting helpers (hoisted so reduced-motion uses them) ─────
  function formatNum(n, format) {
    n = Math.floor(n);
    if (format === 'abbrev') {
      if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'K';
      return String(n);
    }
    if (format === 'comma') return n.toLocaleString();
    return String(n);
  }

  if (prefersReduce) {
    // Instantly reveal any data-driven targets to their final formatted state.
    document.querySelectorAll('[data-counter]').forEach(function (el) {
      const target = Number(el.getAttribute('data-counter')) || 0;
      const format = el.getAttribute('data-counter-format') || 'comma';
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      el.textContent = prefix + formatNum(target, format) + suffix;
    });
    document.querySelectorAll('[data-progress]').forEach(function (el) {
      el.style.width = el.getAttribute('data-progress') + '%';
    });
    return;
  }

  // ─── GSAP guard ──────────────────────────────────────────────────────────
  if (typeof window.gsap === 'undefined') {
    console.warn('[i2] GSAP not loaded, skipping motion layer.');
    return;
  }
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger || null;
  if (ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); }

  // ─── Counter count-up ────────────────────────────────────────────────────
  // <span data-counter="1900000000" data-counter-format="abbrev"
  //       data-counter-suffix="+">0</span>
  function animateCounters() {
    const els = document.querySelectorAll('[data-counter]');
    els.forEach(function (el) {
      const target = Number(el.getAttribute('data-counter')) || 0;
      const format = el.getAttribute('data-counter-format') || 'comma';
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = Number(el.getAttribute('data-counter-duration')) || 1.8;

      const state = { n: 0 };
      const run = function () {
        gsap.to(state, {
          n: target,
          duration: duration,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = prefix + formatNum(state.n, format) + suffix;
          },
        });
      };

      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: run,
        });
      } else {
        // Fallback: IntersectionObserver
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              run();
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        io.observe(el);
      }
    });
  }

  // ─── Progress bar fill ───────────────────────────────────────────────────
  // <div class="funding-card-bar-fill" data-progress="38"></div>
  function animateProgress() {
    const bars = document.querySelectorAll('[data-progress]');
    bars.forEach(function (el) {
      const pct = Number(el.getAttribute('data-progress')) || 0;
      el.style.width = '0%';
      const fill = function () {
        gsap.to(el, {
          width: pct + '%',
          duration: 1.6,
          ease: 'power3.out',
        });
      };
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: fill,
        });
      } else {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { fill(); io.unobserve(entry.target); }
          });
        }, { threshold: 0.3 });
        io.observe(el);
      }
    });
  }

  // ─── Hero line cascade ───────────────────────────────────────────────────
  // <h1 data-hero-lines>Finishing the Great Commission Among Muslims</h1>
  // Splits the h1 into word-wrapped lines and staggers them in on load.
  function animateHeroLines() {
    const targets = document.querySelectorAll('[data-hero-lines]');
    targets.forEach(function (el) {
      // Skip if already processed
      if (el.__i2Split) return;
      el.__i2Split = true;

      // Naive line splitter: wrap each child text node in <span class="__line">
      // This works for simple headings with inline <em>.
      const originalHTML = el.innerHTML;
      const textWithMarkers = originalHTML.replace(
        /(\S+|\s+)/g,
        function (match) {
          return /\s+/.test(match) ? match : '<span class="__hl-word">' + match + '</span>';
        }
      );
      el.innerHTML = textWithMarkers;

      const words = el.querySelectorAll('.__hl-word');
      gsap.set(words, { yPercent: 100, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.05,
        delay: 0.15,
      });
    });
  }

  // ─── Stat card stagger reveal (opt-in) ───────────────────────────────────
  // <div data-stat-stagger> contains children that fade up in sequence.
  function animateStatStagger() {
    const containers = document.querySelectorAll('[data-stat-stagger]');
    containers.forEach(function (parent) {
      const items = parent.children;
      if (!items.length) return;
      gsap.set(items, { y: 30, opacity: 0 });
      const reveal = function () {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
        });
      };
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: parent,
          start: 'top 82%',
          once: true,
          onEnter: reveal,
        });
      } else {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { reveal(); io.unobserve(entry.target); }
          });
        }, { threshold: 0.25 });
        io.observe(parent);
      }
    });
  }

  // ─── Section fade-up (opt-in) ────────────────────────────────────────────
  // Any element with data-scroll-reveal gets a simple fade + y-translate on
  // enter. Lighter-touch alternative to the existing .reveal class for pages
  // that want cleaner coverage.
  function animateScrollReveal() {
    const els = document.querySelectorAll('[data-scroll-reveal]');
    els.forEach(function (el) {
      gsap.set(el, { y: 24, opacity: 0 });
      const show = function () {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
      };
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: show,
        });
      } else {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) { show(); io.unobserve(entry.target); }
          });
        }, { threshold: 0.2 });
        io.observe(el);
      }
    });
  }

  // ─── Story scroll (pin + rotate panels) ──────────────────────────────────
  // <div data-story-scroll>
  //   <section data-flow-section>...</section>
  //   <section data-flow-section>...</section>
  // </div>
  // Each panel after the first rotates from 30° → 0° as it enters the viewport
  // (transform-origin: bottom-left). Every panel except the last is pinned
  // (pinSpacing:false) so the next panel slides up over it.
  function animateStoryScroll() {
    if (!ScrollTrigger) return;
    // Mobile bail: pinned scroll-rotation breaks with iOS dynamic viewport
    // (URL bar collapse). Let panels flow naturally below this breakpoint.
    if (window.innerWidth < 768) return;
    const roots = document.querySelectorAll('[data-story-scroll]');
    roots.forEach(function (root) {
      const sections = root.querySelectorAll('[data-flow-section]');
      if (!sections.length) return;

      sections.forEach(function (section, i) {
        section.style.zIndex = String(i + 1);
        const inner = section.querySelector('[data-flow-inner]');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
        }

        if (i < sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          });
        }
      });

      ScrollTrigger.refresh();
    });
  }

  // ─── Boot ────────────────────────────────────────────────────────────────
  function boot() {
    animateHeroLines();
    animateCounters();
    animateProgress();
    animateStatStagger();
    animateScrollReveal();
    animateStoryScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
