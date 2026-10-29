const SVG_NS = 'http://www.w3.org/2000/svg';

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/** Required element: warns (with context) when missing and returns null. */
export function need(selector, feature) {
  const el = $(selector);
  if (!el) console.warn(`[portfolio] "${feature}" o'chirildi: ${selector} topilmadi`);
  return el;
}

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of [].concat(children)) {
    if (child) node.append(child);
  }
  return node;
}

export function svgEl(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  for (const child of children) node.append(child);
  return node;
}

/** Returns a normalized URL string only for safe protocols, otherwise ''. */
export function safeUrl(value, allowed = ['https:', 'http:']) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    return allowed.includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

export function safeEmail(value) {
  const v = typeof value === 'string' ? value.trim() : '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? v : '';
}

export function storage() {
  return {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ }
    },
    sessionGet(key) {
      try { return window.sessionStorage.getItem(key); } catch { return null; }
    },
    sessionSet(key, value) {
      try { window.sessionStorage.setItem(key, value); } catch { /* storage unavailable */ }
    },
  };
}

export const store = storage();

export function icon(name) {
  const paths = {
    trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
    external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    github: 'M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  };
  const svg = svgEl('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
  svg.append(svgEl('path', { d: paths[name] || '' }));
  return svg;
}
