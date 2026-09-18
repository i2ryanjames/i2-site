  // Nav scroll
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile menu
  document.getElementById('mobileToggle').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });
  // Close mobile menu on scroll
  window.addEventListener('scroll', () => {
    document.getElementById('navLinks').classList.remove('open');
  }, { passive: true });
  // ─── Mobile Dropdown Toggle ───
  const dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
  const navDropdown = document.getElementById('navDropdown');
  if (dropdownTrigger && navDropdown) {
    dropdownTrigger.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        navDropdown.classList.toggle('open');
      }
    });
  }


  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Accordion
  function toggleAccordion(btn) {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }

  // ─── Lightbox ───
  (function() {
    const overlay = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    const scrollContainer = document.querySelector('.gallery-scroll');
    const images = Array.from(scrollContainer.querySelectorAll('img'));
    let current = 0;

    function show(i) {
      current = (i + images.length) % images.length;
      lbImg.src = images[current].src;
      lbImg.alt = images[current].alt;
      counter.textContent = (current + 1) + ' / ' + images.length;
    }

    function open(i) { show(i); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function close() { overlay.classList.remove('active'); document.body.style.overflow = ''; }

    images.forEach(function(img, i) {
      img.addEventListener('click', function() { open(i); });
    });
    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-prev').addEventListener('click', function() { show(current - 1); });
    overlay.querySelector('.lightbox-next').addEventListener('click', function() { show(current + 1); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function(e) {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    // Touch swipe support
    var touchStartX = 0, touchEndX = 0;
    overlay.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    overlay.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) show(current + 1); else show(current - 1);
      }
    });
  })();
