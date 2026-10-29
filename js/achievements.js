import { el, need, svgEl, icon, reducedMotion } from './util.js';

const CIRC = 628;

function formatValue(v, decimals) {
  return Number(v).toFixed(Number.isInteger(decimals) ? decimals : 0);
}

function countUp(node, to, decimals, onDone) {
  if (reducedMotion()) { node.textContent = formatValue(to, decimals); return onDone?.(); }
  const start = performance.now();
  const dur = 1800;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / dur);
    node.textContent = formatValue(to * (1 - Math.pow(1 - p, 3)), decimals);
    if (p < 1) requestAnimationFrame(tick);
    else onDone?.();
  };
  requestAnimationFrame(tick);
}

function burst(host) {
  if (reducedMotion() || typeof host.animate !== 'function') return;
  const colors = ['#8b5cf6', '#38bdf8', '#34d399'];
  for (let i = 0; i < 16; i++) {
    const dot = el('span', { 'aria-hidden': 'true' });
    Object.assign(dot.style, { position: 'absolute', left: '50%', top: '50%', width: '6px', height: '6px', borderRadius: '50%', background: colors[i % 3], pointerEvents: 'none' });
    host.append(dot);
    const angle = (i / 16) * Math.PI * 2;
    const dist = 90 + Math.random() * 60;
    const anim = dot.animate(
      [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0.3)`, opacity: 0 }],
      { duration: 900, easing: 'cubic-bezier(0.22,1,0.36,1)' }
    );
    anim.onfinish = () => dot.remove();
  }
}

function toast(name) {
  const host = document.getElementById('toast-host');
  if (!host) return;
  const t = el('div', { class: 'toast' }, [
    el('span', { class: 'toast__ico' }, icon('trophy')),
    el('div', {}, [el('p', { class: 'toast__t', text: 'Achievement unlocked' }), el('p', { class: 'toast__n', text: name })]),
  ]);
  host.append(t);
  setTimeout(() => { t.classList.add('is-out'); setTimeout(() => t.remove(), 450); }, 3800);
}

function sharedGradient() {
  const svg = svgEl('svg', { width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' });
  svg.style.position = 'absolute';
  const grad = svgEl('linearGradient', { id: 'gauge-grad', x1: '0', y1: '0', x2: '1', y2: '1' }, [
    svgEl('stop', { offset: '0%', 'stop-color': '#8b5cf6' }),
    svgEl('stop', { offset: '100%', 'stop-color': '#38bdf8' }),
  ]);
  svg.append(svgEl('defs', {}, [grad]));
  return svg;
}

function buildCard(a) {
  const decimals = a.decimals ?? (Number.isInteger(a.value) ? 0 : 1);
  const num = el('span', { class: a.featured ? 'gauge__num' : 'ach__value', 'aria-hidden': 'true', text: formatValue(0, decimals) });
  const finalText = `${formatValue(a.value, decimals)}${a.max ? ` / ${a.max}` : ''}`;
  const sr = el('span', { class: 'sr-only', text: `${a.label || 'Natija'}: ${finalText}` });

  const info = el('div', {}, [
    el('p', { class: 'ach__tag', text: '● Unlocked' }),
    el('h3', { class: 'ach__title', text: a.title }),
    a.description ? el('p', { class: 'ach__desc', text: a.description }) : null,
    el('div', { class: 'ach__meta' }, [a.category ? el('span', { text: a.category }) : null, a.year ? el('span', { text: String(a.year) }) : null, a.max ? el('span', { text: `max ${a.max}` }) : null]),
  ]);

  let visual = null;
  let fill = null;
  if (a.featured && a.max) {
    fill = svgEl('circle', { class: 'gauge__fill', cx: 120, cy: 120, r: 100 });
    visual = el('div', { class: 'gauge' }, [
      svgEl('svg', { viewBox: '0 0 240 240', 'aria-hidden': 'true', focusable: 'false' }, [svgEl('circle', { class: 'gauge__track', cx: 120, cy: 120, r: 100 }), fill]),
      el('div', { class: 'gauge__center' }, [num, el('span', { class: 'gauge__lbl', 'aria-hidden': 'true', text: a.label || '' })]),
      sr,
    ]);
  } else {
    visual = el('div', {}, [num, el('p', { class: 'ach__desc', 'aria-hidden': 'true', text: a.label || '' }), sr]);
  }

  const card = el('article', { class: `ach reveal${a.featured ? ' ach--featured' : ''}` }, a.featured ? [visual, info] : [info, visual]);
  return { card, num, fill, decimals };
}

export function initAchievements(config) {
  const grid = need('#ach-grid', 'Achievements');
  if (!grid) return;
  const shown = (config.achievements || []).filter((a) => a && a.show && typeof a.title === 'string' && Number.isFinite(a.value));
  if (!shown.length) {
    grid.replaceChildren(el('p', { class: 'section__lead', text: 'Yutuqlar tez orada qo‘shiladi.' }));
    return;
  }
  const cards = shown.map(buildCard);
  grid.replaceChildren(sharedGradient(), ...cards.map((c) => c.card));

  const unlock = ({ card, num, fill, decimals }, a) => {
    card.classList.add('is-unlocked');
    if (fill && a.max) fill.style.strokeDashoffset = String(CIRC * (1 - Math.min(1, a.value / a.max)));
    countUp(num, a.value, decimals, () => { burst(card); toast(`${a.title} — ${formatValue(a.value, decimals)}${a.max ? `/${a.max}` : ''}`); });
  };

  if (!('IntersectionObserver' in window)) {
    cards.forEach((c, i) => unlock(c, shown[i]));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = cards.findIndex((c) => c.card === entry.target);
      observer.unobserve(entry.target);
      if (i >= 0) unlock(cards[i], shown[i]);
    });
  }, { threshold: 0.4 });
  cards.forEach((c) => observer.observe(c.card));
}
