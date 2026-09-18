/* Nav scroll effect */
var nav = document.getElementById('mainNav');
window.addEventListener('scroll', function() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* Mobile menu toggle */
document.getElementById('mobileToggle').addEventListener('click', function() {
  document.getElementById('navLinks').classList.toggle('open');
});
/* Close mobile menu on scroll */
window.addEventListener('scroll', function() {
  document.getElementById('navLinks').classList.remove('open');
}, { passive: true });

/* Mobile dropdown toggle */
var dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
var navDropdown = document.getElementById('navDropdown');
if (dropdownTrigger && navDropdown) {
  dropdownTrigger.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      navDropdown.classList.toggle('open');
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
