// ─── Scroll Nav ───
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── Mobile Menu ───
document.getElementById('mobileToggle').addEventListener('click', () => {
  const navLinksEl = document.getElementById('navLinks');
    const menuOpen = navLinksEl.classList.toggle('open');
    const menuToggle = document.getElementById('mobileToggle');
    menuToggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Menu');
});
// ─── Close Mobile Menu on Scroll ───
window.addEventListener('scroll', () => {
  document.getElementById('navLinks').classList.remove('open');
    const menuToggleClosed = document.getElementById('mobileToggle');
    if (menuToggleClosed) { menuToggleClosed.setAttribute('aria-expanded', 'false'); menuToggleClosed.setAttribute('aria-label', 'Menu'); }
}, { passive: true });
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


// ─── Reveal on Scroll ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── Bar Graph Animation ───
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.getElementById('barFunded').classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const barSection = document.getElementById('barGraphSection');
if (barSection) barObserver.observe(barSection);

// ─── Accordion ───
function toggleAccordion(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}
