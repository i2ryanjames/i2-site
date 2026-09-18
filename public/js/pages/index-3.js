(function () {
  'use strict';
  var prefersReduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var hero = document.getElementById('hero');
  if (!hero) return;

  var bgPattern = document.getElementById('hero-grid-bg-pattern');
  var revealPattern = document.getElementById('hero-grid-reveal-pattern');
  var revealLayer = hero.querySelector('.hero-grid-reveal');

  // Mouse-driven reveal mask center (skipped when reduced motion)
  if (!prefersReduce && revealLayer) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      revealLayer.style.setProperty('--hero-mx', x + 'px');
      revealLayer.style.setProperty('--hero-my', y + 'px');
    });
    hero.addEventListener('mouseleave', function () {
      revealLayer.style.removeProperty('--hero-mx');
      revealLayer.style.removeProperty('--hero-my');
    });
  }

  // Infinite scrolling grid pattern (paused when reduced motion)
  if (!prefersReduce && bgPattern && revealPattern) {
    var offsetX = 0;
    var offsetY = 0;
    var speedX = 0.5;
    var speedY = 0.5;
    function tick() {
      offsetX = (offsetX + speedX) % 40;
      offsetY = (offsetY + speedY) % 40;
      bgPattern.setAttribute('x', offsetX);
      bgPattern.setAttribute('y', offsetY);
      revealPattern.setAttribute('x', offsetX);
      revealPattern.setAttribute('y', offsetY);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
