const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const main = document.querySelector('main');
const navLinks = [...document.querySelectorAll('[data-nav-link]')];
const sections = [...document.querySelectorAll('[data-section]')];
const revealItems = [...document.querySelectorAll('[data-reveal]')];
const progressBar = document.querySelector('[data-progress]');
const progressText = document.querySelector('[data-rail-percent]');
const railSection = document.querySelector('[data-rail-section]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = '메뉴 열기';
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  main.removeAttribute('inert');
};

window.mwcToggleMenu = () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  menuToggle.querySelector('.sr-only').textContent = willOpen ? '메뉴 닫기' : '메뉴 열기';
  nav.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  if (willOpen) main.setAttribute('inert', '');
  else main.removeAttribute('inert');
};

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});

const setActiveSection = (section) => {
  const id = section.id;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  railSection.textContent = section.dataset.sectionName;
};

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

let ticking = false;
const updateScrollData = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  const percent = Math.round(ratio * 100);
  progressBar.style.height = `${percent}%`;
  progressText.textContent = `${String(percent).padStart(3, '0')}%`;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
  const marker = window.innerHeight * .35;
  let currentSection = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) currentSection = section;
  });
  setActiveSection(currentSection);
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollData);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && nav.classList.contains('is-open')) closeMenu();
  updateScrollData();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
setActiveSection(sections[0]);
updateScrollData();
