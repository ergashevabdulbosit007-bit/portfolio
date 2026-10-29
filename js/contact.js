import { $, el, safeEmail } from './util.js';

const RULES = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Ismingizni kiriting (kamida 2 belgi).'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'To‘g‘ri email manzil kiriting.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'Xabar kamida 10 belgidan iborat bo‘lsin.'),
};

export function initContact(config) {
  const form = $('#contact-form');
  const submit = $('#cf-submit');
  const status = $('#cf-status');
  if (!form || !submit || !status) {
    console.warn('[portfolio] Aloqa formasi o‘chirildi: #contact-form, #cf-submit yoki #cf-status topilmadi');
    return;
  }
  const mail = safeEmail(config.links?.email);
  const fields = Object.keys(RULES).map((name) => ({ name, input: form.elements[name], err: $(`#cf-${name}-err`) })).filter((f) => f.input && f.err);

  const setStatus = (msg, kind = '') => {
    status.className = `form__status${kind ? ` is-${kind}` : ''}`;
    status.textContent = msg;
  };
  const validate = () => {
    let first = null;
    fields.forEach((f) => {
      const msg = RULES[f.name](f.input.value);
      f.err.textContent = msg;
      f.input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !first) first = f.input;
    });
    first?.focus();
    return !first;
  };
  fields.forEach((f) => f.input.addEventListener('input', () => { if (f.input.getAttribute('aria-invalid') === 'true') { const m = RULES[f.name](f.input.value); f.err.textContent = m; f.input.setAttribute('aria-invalid', m ? 'true' : 'false'); } }));

  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !validate()) return;
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Yuborilmoqda…';
    form.setAttribute('aria-busy', 'true');
    setStatus('Yuborilmoqda…');
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('Xabaringiz qabul qilindi. Rahmat!', 'ok');
        form.reset();
      } else if (res.status === 400 && data.errors) {
        fields.forEach((f) => { if (data.errors[f.name]) { f.err.textContent = data.errors[f.name]; f.input.setAttribute('aria-invalid', 'true'); } });
        setStatus('Iltimos, xatolarni tuzating.', 'err');
      } else {
        setStatus(data.error || 'Xabarni yuborib bo‘lmadi.', 'err');
        if (data.fallback === 'mailto' && mail) {
          const href = `mailto:${mail}?subject=${encodeURIComponent(`Portfolio: ${payload.name || ''}`)}&body=${encodeURIComponent(payload.message || '')}`;
          status.append(' ', el('a', { href, text: 'Email dasturida ochish' }));
        }
      }
    } catch (err) {
      console.error('[portfolio] Aloqa so‘rovi xatosi:', err);
      setStatus('Serverga ulanib bo‘lmadi. Keyinroq qayta urinib ko‘ring.', 'err');
    } finally {
      sending = false;
      submit.disabled = false;
      submit.textContent = 'Yuborish';
      form.removeAttribute('aria-busy');
    }
  });
}
