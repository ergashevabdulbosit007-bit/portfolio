import { $, el, need, safeUrl, icon } from './util.js';

function linkButton(href, label, iconName) {
  return el('a', { class: 'btn btn--secondary btn--sm', href, target: '_blank', rel: 'noopener noreferrer' }, [icon(iconName), el('span', { text: label })]);
}

function actions(project) {
  const gh = safeUrl(project.github);
  const demo = safeUrl(project.demo);
  return [gh ? linkButton(gh, `${project.title} — GitHub`, 'github') : null, demo ? linkButton(demo, `${project.title} — Live demo`, 'external') : null];
}

export function initProjects(config) {
  const grid = need('#projects-grid', 'Projects');
  const dialog = $('#project-dialog');
  if (!grid) return;
  const title = $('#pd-title');
  const body = $('#pd-body');
  const close = $('#pd-close');
  const canDialog = Boolean(dialog && title && body && close);
  if (!canDialog) console.warn('[portfolio] Loyiha oynasi o‘chirildi: #project-dialog elementlari topilmadi');

  let opener = null;

  const open = (project, trigger) => {
    opener = trigger;
    title.textContent = project.title;
    body.replaceChildren(
      el('div', { class: 'tl__meta' }, [el('span', { class: 'badge', text: project.status || '' })]),
      el('p', { text: project.details || project.description || '' }),
      el('ul', { class: 'project__stack', 'aria-label': 'Texnologiyalar' }, (project.stack || []).map((s) => el('li', { text: s }))),
      el('div', { class: 'project__actions' }, actions(project))
    );
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    close.focus();
  };

  if (canDialog) {
    const dismiss = () => (typeof dialog.close === 'function' ? dialog.close() : dialog.removeAttribute('open'));
    close.addEventListener('click', dismiss);
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dismiss();
    });
    dialog.addEventListener('close', () => { if (opener && document.contains(opener)) opener.focus(); opener = null; });
  }

  const cards = (config.projects || []).filter((p) => p && p.title).map((p) => {
    const detailsBtn = canDialog
      ? el('button', { class: 'btn btn--ghost btn--sm', type: 'button', 'aria-label': `${p.title} haqida batafsil` }, el('span', { text: 'Batafsil' }))
      : null;
    if (detailsBtn) detailsBtn.addEventListener('click', () => open(p, detailsBtn));
    return el('article', { class: 'project reveal' }, [
      el('div', { class: 'project__visual', 'aria-hidden': 'true', text: p.title.split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase() }),
      el('div', { class: 'project__top' }, [el('h3', { text: p.title }), el('div', { class: 'tl__meta' }, [p.featured ? el('span', { class: 'badge badge--feat', text: 'Featured' }) : null, el('span', { class: 'badge', text: p.status || '' })])]),
      el('p', { text: p.description || '' }),
      el('ul', { class: 'project__stack', 'aria-label': 'Texnologiyalar' }, (p.stack || []).map((s) => el('li', { text: s }))),
      el('div', { class: 'project__actions' }, [detailsBtn, ...actions(p)]),
    ]);
  });
  grid.replaceChildren(...cards);
}
