import { $, el, need, safeUrl, safeEmail } from './util.js';

const text = (v, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback);

export function renderHero(config) {
  const status = $('#status-text');
  if (status) status.textContent = text(config.status, 'DEVELOPER IN PROGRESS');
  const tagline = $('#hero-tagline');
  if (tagline) tagline.textContent = text(config.tagline, tagline.textContent);

  const tech = $('#hero-tech');
  if (tech) {
    const names = new Set();
    (config.skills || []).forEach((g) => (g.items || []).forEach((i) => i?.level === 'used' && names.add(i.name)));
    tech.replaceChildren(...[...names].map((n) => el('li', { text: n })));
  }

  const avail = $('#availability');
  const availText = $('#availability-text');
  if (avail && availText && config.available?.show && text(config.available.text)) {
    availText.textContent = config.available.text;
    avail.hidden = false;
  }
}

export function renderAbout(config) {
  const list = need('#about-list', 'About');
  if (!list) return;
  const labels = {
    who: 'Kim',
    learning: "Nimani o'rganyapman",
    why: 'Nega quraman',
    problems: 'Qiziq muammolar',
    direction: "Hozirgi yo'nalish",
    next: 'Keyingi maqsad',
  };
  const items = Object.entries(labels)
    .filter(([key]) => text(config.about?.[key]))
    .map(([key, label]) => el('div', { class: 'about-item reveal' }, [el('dt', { text: label }), el('dd', { text: config.about[key] })]));
  list.replaceChildren(...items);
}

export function renderSkills(config) {
  const grid = need('#skills-grid', 'Skills');
  if (!grid) return;
  const levels = config.skillLevels || {};
  const groups = (config.skills || [])
    .filter((g) => Array.isArray(g.items) && g.items.length)
    .map((g) =>
      el('div', { class: 'skill-group reveal' }, [
        el('h3', { text: text(g.group) }),
        el('ul', {}, g.items.map((i) => el('li', { class: 'skill' }, [
          el('i', { class: `lvl lvl--${['used', 'comfortable', 'learning'].includes(i.level) ? i.level : 'learning'}`, 'aria-hidden': 'true' }),
          el('span', { text: text(i.name) }),
          el('small', { text: levels[i.level] || '' }),
        ]))),
      ])
    );
  grid.replaceChildren(...groups);
}

export function renderJourney(config) {
  const list = need('#journey-list', 'Journey');
  if (!list) return;
  const items = (config.journey || []).map((j) =>
    el('li', { class: `tl reveal${j.status === 'Completed' ? ' tl--done' : ''}` }, [
      el('div', { class: 'tl__meta' }, [
        j.period ? el('span', { class: 'badge', text: j.period }) : null,
        el('span', { class: 'badge', text: text(j.status) }),
        j.category ? el('span', { class: 'badge', text: j.category }) : null,
      ]),
      el('h3', { text: text(j.title) }),
      el('p', { text: text(j.description) }),
    ])
  );
  list.replaceChildren(...items);
}

export function renderGoals(config) {
  const list = need('#goals-list', 'Goals');
  if (!list) return;
  list.replaceChildren(...(config.goals || []).filter((g) => text(g)).map((g) => el('li', { class: 'reveal', text: g })));
}

export function renderSocial(config) {
  const list = need('#social-list', 'Social links');
  if (!list) return;
  const links = config.links || {};
  const email = safeEmail(links.email);
  const defs = [
    { label: 'Email', href: email ? `mailto:${email}` : '' },
    { label: 'GitHub', href: safeUrl(links.github) },
    { label: 'Telegram', href: safeUrl(links.telegram) },
    { label: 'LinkedIn', href: safeUrl(links.linkedin) },
  ];
  const items = defs.map((d) => {
    if (!d.href) {
      return el('li', {}, el('span', { class: 'is-disabled', 'aria-disabled': 'true' }, [el('span', { text: d.label }), el('span', { text: 'Hali qo‘shilmagan' })]));
    }
    const isMail = d.label === 'Email';
    const a = el('a', { href: d.href, rel: isMail ? null : 'noopener noreferrer', target: isMail ? null : '_blank' }, [
      el('span', { text: d.label }),
      el('span', { text: isMail ? email : 'Ochish ↗' }),
    ]);
    return el('li', {}, a);
  });
  list.replaceChildren(...items);
}
