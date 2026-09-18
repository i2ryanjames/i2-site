/* =========================================================================
   GSAP Registration — boot module
   Loads after gsap.min.js and ScrollTrigger.min.js CDN scripts.
   Registers plugins, sets sensible defaults, bridges Lenis↔ScrollTrigger.
   ========================================================================= */
(function () {
  'use strict';

  if (typeof window.gsap !== 'object') return;

  // Add `.js` class to <html> so CSS can gate animation initial states.
  // (see components.css — html.js [data-animate] { opacity: 0 })
  document.documentElement.classList.add('js');

  if (typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);

    // Project-wide ScrollTrigger defaults.
    window.ScrollTrigger.defaults({
      toggleActions: 'play none none none',
      start: 'top 82%',
    });
  }

  // Project-wide tween defaults.
  window.gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
  });

  // Bridge Lenis and ScrollTrigger if both are present.
  if (window.__lenis && typeof window.ScrollTrigger !== 'undefined') {
    window.__lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => window.__lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  }

  // Honor reduced-motion: kill any ScrollTrigger created after this,
  // via matchMedia integration in animations.js. Nothing to do here.
})();
