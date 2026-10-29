import { $, reducedMotion, store } from './util.js';

const SEEN_KEY = 'abdulbosit-intro-seen';
const BOOT_LINES = [
  '> abdulbosit.exe --portfolio',
  '> sahifa yuklanmoqda...',
  '> bo‘limlar: about, achievements, skills, projects',
  '> tayyor.',
];

export function initIntro(config) {
  const root = $('#intro');
  const enter = $('#enter-btn');
  const skip = $('#skip-btn');
  if (!root || !enter || !skip) {
    console.warn('[portfolio] Intro o‘chirildi: #intro, #enter-btn yoki #skip-btn topilmadi');
    return;
  }
  if (config.preferences?.intro === false || store.sessionGet(SEEN_KEY) === '1') return;

  let closing = false;
  const log = $('#boot-log');

  const onKeydown = (event) => {
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const focusables = [enter, skip];
      const idx = focusables.indexOf(document.activeElement);
      const next = event.shiftKey ? (idx <= 0 ? focusables.length - 1 : idx - 1) : (idx + 1) % focusables.length;
      event.preventDefault();
      focusables[next].focus();
    }
  };

  function close() {
    if (closing) return;
    closing = true;
    store.sessionSet(SEEN_KEY, '1');
    document.removeEventListener('keydown', onKeydown);
    root.classList.add('is-leaving');
    document.body.classList.remove('is-locked');
    const finish = () => {
      root.hidden = true;
      const main = $('#main');
      if (main) main.focus({ preventScroll: true });
    };
    if (reducedMotion()) finish();
    else {
      root.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 600);
    }
  }

  enter.addEventListener('click', close);
  skip.addEventListener('click', close);
  document.addEventListener('keydown', onKeydown);

  root.hidden = false;
  document.body.classList.add('is-locked');
  enter.focus();

  if (log) {
    if (reducedMotion()) log.textContent = BOOT_LINES.join('\n');
    else {
      let i = 0;
      const timer = setInterval(() => {
        if (closing || i >= BOOT_LINES.length) return clearInterval(timer);
        log.textContent += (i ? '\n' : '') + BOOT_LINES[i++];
      }, 380);
    }
  }
}
