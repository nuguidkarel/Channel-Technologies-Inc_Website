document.addEventListener('DOMContentLoaded', () => {

  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Channel rail — signal progress tracks scroll depth */
  const progress = document.querySelector('.channel-rail__progress');
  const setProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    if (progress) progress.style.height = pct + '%';
  };
  document.addEventListener('scroll', setProgress, { passive: true });
  setProgress();

  /* Reveal nodes + fade-in sections as they enter view */
  const revealTargets = document.querySelectorAll('section');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  }

  /* Animated stat counters */
  const statEls = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1100;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && statEls.length) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statEls.forEach(el => statIO.observe(el));
  } else {
    statEls.forEach(animateCount);
  }

  /* Tilt interaction — cards react to pointer position with a subtle 3D tilt */
  const tiltCards = document.querySelectorAll('.tilt-card');
  const maxTilt = 6; // degrees
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1
      const tiltY = (px - 0.5) * maxTilt * 2;
      const tiltX = (0.5 - py) * maxTilt * 2;
      card.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  /* Hero glow follows the pointer for a bit of playful depth */
  const hero = document.getElementById('hero');
  const glow = hero ? hero.querySelector('.hero__glow') : null;
  if (hero && glow) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty('--mx', mx + '%');
      glow.style.setProperty('--my', my + '%');
    });
  }

  /* Office map switcher — swaps the embedded map + highlights the active office */
  const officeAddresses = {
    muntinlupa: '55 Don Jesus Blvd, Alabang Hills, Muntinlupa City, Philippines',
    makati: 'Suite 218, The Atrium of Makati, Makati Ave, Makati City, Philippines',
    quezoncity: '1198 CASMAN Building, Quezon Avenue, Barangay Paligsahan, Quezon City, Philippines'
  };
  const officeMap = document.getElementById('officeMap');
  const mapTabs = document.querySelectorAll('.map-tab');
  const officeCards = document.querySelectorAll('.office-card');

  const setActiveOffice = (key) => {
    const address = officeAddresses[key];
    if (!address || !officeMap) return;
    officeMap.src = 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&output=embed';
    mapTabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.office === key));
    officeCards.forEach(card => card.classList.toggle('is-active', card.dataset.office === key));
  };

  mapTabs.forEach(tab => {
    tab.addEventListener('click', () => setActiveOffice(tab.dataset.office));
  });
  document.querySelectorAll('.office-card__pin').forEach(btn => {
    btn.addEventListener('click', () => setActiveOffice(btn.dataset.office));
  });

  /* Quote form — front-end only, no backend wired up */
  const form = document.getElementById('quoteForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (note) {
        note.textContent = 'Thanks — this demo form isn\u2019t connected to email yet. Wire it up to your CRM or mail service.';
      }
      form.reset();
    });
  }

});