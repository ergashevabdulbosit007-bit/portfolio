import { $, $$, el, reducedMotion } from './util.js';

export function initReveal() {
  const targets = $$('.reveal');
  if (!targets.length || reducedMotion() || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  targets.forEach((t) => observer.observe(t));
}

export function initTerminal(config) {
  const body = $('#terminal-body');
  if (!body) return;
  const used = [];
  (config.skills || []).forEach((g) => (g.items || []).forEach((i) => i?.level === 'used' && used.push(i.name)));
  const ielts = (config.achievements || []).find((a) => a.id === 'ielts' && a.show);

  const lines = [
    [['const ', 'k'], ['developer', ''], [' = {', 'd']],
    [['  name: ', 'k'], [`'${config.name || ''}'`, 's'], [',', 'd']],
    [['  status: ', 'k'], [`'${config.status || ''}'`, 's'], [',', 'd']],
    [['  stack: ', 'k'], [`[${used.map((n) => `'${n}'`).join(', ')}]`, 's'], [',', 'd']],
    ...(ielts ? [[['  ielts: ', 'k'], [String(ielts.value), 's'], [',', 'd']]] : []),
    [['  learning: ', 'k'], ["'every day'", 's'], [',', 'd']],
    [['};', 'd']],
  ];
  const cls = { k: 't-key', s: 't-str', d: 't-dim' };
  const caret = el('span', { class: 'caret', 'aria-hidden': 'true' });

  const flat = lines.map((segs) => segs.map(([t, c]) => ({ t, c })));
  const render = (chars) => {
    let left = chars;
    const frag = document.createDocumentFragment();
    flat.forEach((segs, li) => {
      segs.forEach(({ t, c }) => {
        if (left <= 0) return;
        const part = t.slice(0, left);
        left -= part.length;
        frag.append(c ? el('span', { class: cls[c], text: part }) : document.createTextNode(part));
      });
      if (left > 0 && li < flat.length - 1) { frag.append('\n'); left -= 1; }
    });
    frag.append(caret);
    body.replaceChildren(frag);
  };
  const total = flat.flat().reduce((n, s) => n + s.t.length, 0) + flat.length - 1;
  if (reducedMotion()) return render(total);

  let n = 0;
  const timer = setInterval(() => {
    n = Math.min(total, n + 2);
    render(n);
    if (n >= total) clearInterval(timer);
  }, 28);
}
