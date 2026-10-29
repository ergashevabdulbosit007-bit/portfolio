import { $, $$ } from './util.js';

export function initNavigation() {
  const header = $('#site-header');
  const nav = $('#nav');
  const menuBtn = $('#menu-btn');
  const links = $$('.nav__list a');
  if (!nav || !menuBtn) {
    console.warn('[portfolio] Navigatsiya menyusi o‘chirildi: #nav yoki #menu-btn topilmadi');
  } else {
    const mq = window.matchMedia('(max-width: 860px)');
    const setOpen = (open, returnFocus = false) => {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Menyuni yopish' : 'Menyuni ochish');
      if (!open && returnFocus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    links.forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, true);
    });
    mq.addEventListener('change', (e) => { if (!e.matches) setOpen(false); });
  }

  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  if ('IntersectionObserver' in window && links.length) {
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        const active = byId.get(entry.target.id);
        if (active) { active.classList.add('is-active'); active.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => observer.observe(s));
  }
}
