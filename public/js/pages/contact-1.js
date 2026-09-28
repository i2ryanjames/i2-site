// Nav
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });
  document.getElementById('mobileToggle').addEventListener('click', () => { const navLinksEl = document.getElementById('navLinks');
    const menuOpen = navLinksEl.classList.toggle('open');
    const menuToggle = document.getElementById('mobileToggle');
    menuToggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Menu'); });
  // Close mobile menu on scroll
  window.addEventListener('scroll', () => { document.getElementById('navLinks').classList.remove('open');
    const menuToggleClosed = document.getElementById('mobileToggle');
    if (menuToggleClosed) { menuToggleClosed.setAttribute('aria-expanded', 'false'); menuToggleClosed.setAttribute('aria-label', 'Menu'); } }, { passive: true });
  // ─── Mobile Dropdown Toggle ───
  const dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
  const navDropdown = document.getElementById('navDropdown');
  if (dropdownTrigger && navDropdown) {
    dropdownTrigger.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        navDropdown.classList.toggle('open');
        dropdownTrigger.setAttribute('aria-expanded', navDropdown.classList.contains('open') ? 'true' : 'false');
      }
    });
  }


  // Reveal
  const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
