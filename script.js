/* =====================================================
   Aarvi Solutions – Contact Page Script
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky header shadow ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 18px rgba(0,0,0,.15)'
      : '0 2px 12px rgba(0,0,0,.08)';
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });

  /* ── Back to Top ── */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Contact Form Validation & Submission ── */
  const form        = document.getElementById('contactForm');
  const successBox  = document.getElementById('formSuccess');

  const rules = {
    firstName : { required: true, minLen: 2,  label: 'First name' },
    lastName  : { required: true, minLen: 2,  label: 'Last name'  },
    email     : { required: true, isEmail: true, label: 'Email'   },
    phone     : { required: true, isPhone: true, label: 'Phone'   },
    subject   : { required: true, minLen: 4,  label: 'Subject'    },
    message   : { required: true, minLen: 10, label: 'Message'    },
  };

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function validatePhone(v) {
    return /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim());
  }

  function validateField(id) {
    const rule  = rules[id];
    if (!rule) return true;
    const field = document.getElementById(id);
    const errEl = document.getElementById(id + 'Error');
    const val   = field.value.trim();
    let   msg   = '';

    if (rule.required && !val)              msg = `${rule.label} is required.`;
    else if (rule.minLen && val.length < rule.minLen) msg = `${rule.label} must be at least ${rule.minLen} characters.`;
    else if (rule.isEmail && !validateEmail(val))     msg = 'Please enter a valid email address.';
    else if (rule.isPhone && !validatePhone(val))     msg = 'Please enter a valid phone number.';

    if (errEl) errEl.textContent = msg;
    field.classList.toggle('invalid', !!msg);
    field.classList.toggle('valid',   !msg && !!val);
    return !msg;
  }

  // Live validation on blur
  Object.keys(rules).forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', () => validateField(id));
      field.addEventListener('input', () => {
        if (field.classList.contains('invalid')) validateField(id);
      });
    }
  });

  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map(id => validateField(id)).every(Boolean);

    if (!allValid) {
      // Scroll to first error
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission (replace with real fetch/AJAX in production)
    const btn = form.querySelector('.btn-submit');
    const txt = btn.querySelector('.btn-text');
    const ico = btn.querySelector('i');

    btn.disabled = true;
    txt.textContent = 'Sending…';
    ico.className = 'fas fa-circle-notch fa-spin';

    setTimeout(() => {
      btn.disabled = false;
      txt.textContent = 'Send Message';
      ico.className = 'fas fa-paper-plane';
      form.reset();
      // Remove valid/invalid classes
      form.querySelectorAll('input, textarea, select').forEach(el => {
        el.classList.remove('valid', 'invalid');
      });
      successBox.classList.add('show');
      setTimeout(() => successBox.classList.remove('show'), 6000);
    }, 1800);
  });

  /* ── Animate info cards on scroll ── */
  const cards = document.querySelectorAll('.info-card, .gov-grid a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      observer.observe(card);
    });
  }

});
