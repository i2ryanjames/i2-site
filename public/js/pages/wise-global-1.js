/* Nav scroll effect */
var nav = document.getElementById('mainNav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* Mobile menu toggle */
document.getElementById('mobileToggle').addEventListener('click', function() {
  const navLinksEl = document.getElementById('navLinks');
    const menuOpen = navLinksEl.classList.toggle('open');
    const menuToggle = document.getElementById('mobileToggle');
    menuToggle.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Menu');
});
/* Close mobile menu on scroll */
window.addEventListener('scroll', function() {
  document.getElementById('navLinks').classList.remove('open');
    const menuToggleClosed = document.getElementById('mobileToggle');
    if (menuToggleClosed) { menuToggleClosed.setAttribute('aria-expanded', 'false'); menuToggleClosed.setAttribute('aria-label', 'Menu'); }
}, { passive: true });

/* Mobile dropdown toggle */
var dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
var navDropdown = document.getElementById('navDropdown');
if (dropdownTrigger && navDropdown) {
  dropdownTrigger.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      navDropdown.classList.toggle('open');
        dropdownTrigger.setAttribute('aria-expanded', navDropdown.classList.contains('open') ? 'true' : 'false');
    }
  });
}

/* Scroll reveal */
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });

/* Accordion */
function toggleAccordion(btn) {
  var item = btn.parentElement;
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.accordion-item').forEach(function(i) { i.classList.remove('open'); });
  if (!wasOpen) item.classList.add('open');
  btn.setAttribute('aria-expanded', !wasOpen);
}

/* Funding bar animation */
var fundingBarObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      document.getElementById('fundingBarFunded').classList.add('animated');
      fundingBarObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
var fundingBarSection = document.getElementById('fundingBarSection');
if (fundingBarSection) fundingBarObserver.observe(fundingBarSection);
