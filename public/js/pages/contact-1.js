// Nav
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });
  document.getElementById('mobileToggle').addEventListener('click', () => { document.getElementById('navLinks').classList.toggle('open'); });
  // Close mobile menu on scroll
  window.addEventListener('scroll', () => { document.getElementById('navLinks').classList.remove('open'); }, { passive: true });
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


  // Reveal
  const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
