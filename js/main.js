import { config } from './config.js';
import { $ } from './util.js';
import { renderHero, renderAbout, renderSkills, renderJourney, renderGoals, renderSocial } from './render.js';
import { initAchievements } from './achievements.js';
import { initProjects } from './projects.js';
import { initContact } from './contact.js';
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initIntro } from './intro.js';
import { initReveal, initTerminal } from './animations.js';
import { initTyping } from './typing.js';
import './challenges.js';

let started = false;

function step(name, fn) {
  try {
    fn(config);
  } catch (error) {
    console.error(`[portfolio] "${name}" ishga tushmadi:`, error);
  }
}

function start() {
  if (started) return;
  started = true;
  step('theme', initTheme);
  step('hero', renderHero);
  step('about', renderAbout);
  step('achievements', initAchievements);
  step('skills', renderSkills);
  step('projects', initProjects);
  step('journey', renderJourney);
  step('goals', renderGoals);
  step('social', renderSocial);
  step('contact', initContact);
  step('navigation', initNavigation);
  step('terminal', initTerminal);
  step('typing', initTyping);
  step('year', () => { const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear()); });
  step('reveal', initReveal);
  step('intro', initIntro);
  document.documentElement.dataset.ready = 'true';
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

window.addEventListener('unhandledrejection', (e) => console.error('[portfolio] unhandled rejection:', e.reason));
