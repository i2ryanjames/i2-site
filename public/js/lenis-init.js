/* =========================================================================
   Lenis Smooth Scroll — boot module
   Loaded after the Lenis CDN <script>. Disables itself for reduced-motion
   users. Exposes window.__lenis for other modules (GSAP integration).
   ========================================================================= */
(function () {
  'use strict';

  // Respect user preference — no smooth scroll if they asked for reduced motion.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { return; }

  if (typeof window.Lenis !== 'function') {
    // CDN hasn't loaded yet or failed — fail silently, native scroll is the fallback.
    return;
  }

  const lenis = new window.Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,   // never smooth-scroll on mobile touch — it fights native scroll
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Expose for other modules (animations.js registers it with GSAP ticker).
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Stop Lenis on anchor links inside modals / dialogs where it conflicts.
  // Nothing to do today — placeholder for future expansion.
})();
