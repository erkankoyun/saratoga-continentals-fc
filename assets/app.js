const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');

function closeMenu() {
  if (!toggle || !nav) return;
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.style.boxShadow = window.scrollY > 18 ? '0 10px 28px rgba(0,0,0,.16)' : 'none';
}, { passive: true });
