/* ============================================================
   Aarvi Solutions IT Services – Shared Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Header ── */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 2. Mobile Nav ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
    document.addEventListener('click', e => {
      if (header && !header.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── 3. Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── 4. Back to Top ── */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── 5. Scroll-reveal (IntersectionObserver) ── */
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.animate-up, .animate-fade').forEach(el => revealObs.observe(el));
  } else {
    // Fallback – show all
    document.querySelectorAll('.animate-up, .animate-fade').forEach(el => el.classList.add('in-view'));
  }

  /* ── 6. Animated Counters ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  /* ── 7. Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = (header ? header.offsetHeight : 0) + 16;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── 8. Contact / Application Form Validation ── */
  const forms = document.querySelectorAll('[data-validate]');
  forms.forEach(form => {
    const fields  = form.querySelectorAll('[data-required]');
    const success = form.querySelector('.alert-success');
    const btn     = form.querySelector('[type="submit"]');

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('input-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      fields.forEach(f => { if (!validateField(f)) valid = false; });
      if (!valid) {
        const first = form.querySelector('.input-invalid');
        if (first) first.focus();
        return;
      }
      // Simulate sending
      if (btn) {
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = origText;
          form.reset();
          fields.forEach(f => f.classList.remove('input-valid', 'input-invalid'));
          if (success) {
            success.classList.add('show');
            setTimeout(() => success.classList.remove('show'), 7000);
          }
        }, 1800);
      }
    });
  });

  function validateField(field) {
    const errEl = field.parentElement.querySelector('.err-msg');
    const val   = field.value.trim();
    let   msg   = '';

    if (!val) {
      msg = `This field is required.`;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && !/^[\d\s\+\-\(\)]{7,15}$/.test(val)) {
      msg = 'Please enter a valid phone number.';
    }

    if (errEl) errEl.textContent = msg;
    field.classList.toggle('input-invalid', !!msg);
    field.classList.toggle('input-valid',   !msg);
    return !msg;
  }

  /* ── 9. Testimonial Slider (simple auto-rotate on mobile) ── */
  const sliders = document.querySelectorAll('[data-slider]');
  sliders.forEach(slider => {
    const items = slider.querySelectorAll('.slide-item');
    if (items.length <= 1) return;
    let idx = 0;
    const show = (i) => {
      items.forEach((item, j) => item.style.display = (j === i ? 'block' : 'none'));
    };
    show(0);
    setInterval(() => { idx = (idx + 1) % items.length; show(idx); }, 5000);
  });

  /* ── 10. Stagger child animations ── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('animate-up');
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

});
