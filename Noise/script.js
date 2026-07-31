(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú');
    });
  });

  /* ---------- Slow scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Subtle cursor-driven drift for hero lights ---------- */
  const heroField = document.querySelector('.hero .field');
  if (heroField && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    const orbs = heroField.querySelectorAll('.orb');
    let raf = null;
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX / w - 0.5);
      const y = (e.clientY / h - 0.5);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        orbs.forEach((orb, i) => {
          const strength = (i + 1) * 6;
          orb.style.translate = `${x * strength}px ${y * strength}px`;
        });
        raf = null;
      });
    });
  }
})();
