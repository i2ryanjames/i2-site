(function(){
  if(!('IntersectionObserver' in window)) return;
  var chapters = document.querySelectorAll('.comp-chapter');
  if(!chapters.length) return;
  var links = document.querySelectorAll('.comp-subnav-link');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(id){
    links.forEach(function(link){
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);
      if(isActive){
        link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  chapters.forEach(function(chapter){ observer.observe(chapter); });
})();
