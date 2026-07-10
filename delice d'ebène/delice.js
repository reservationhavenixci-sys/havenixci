/* ============================================================
   DÉLICES D'ÉBÈNE — Script principal
   - Navigation mobile (burger)
   - En-tête transparent → blanc au défilement
   - Apparition progressive des sections (fade-up)
   - Filtrage des créations par catégorie
   - Bouton retour en haut
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initHeaderScroll();
  initFadeUp();
  initCreationFilters();
  initBackToTop();
});

/* ---------- Navigation mobile ---------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav__toggle');
  const nav = document.getElementById('primary-navigation');

  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  const openNav = () => {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (event) => {
    const clickedOutside = !nav.contains(event.target) && !toggle.contains(event.target);
    if (clickedOutside && toggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });
}

/* ---------- En-tête : transparent puis blanc au scroll ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 10;

  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
}

/* ---------- Apparition progressive des sections (fade-up) ---------- */
function initFadeUp() {
  const targets = document.querySelectorAll(
    '.section__intro, .specialty-card, .why-us__item, .creation-card, .step-card, .gallery__item, .testimonial-card, .faq__item, .order__form, .about__media, .about__text'
  );

  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('fade-up'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Filtrage des créations ---------- */
function initCreationFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const creationCards = document.querySelectorAll('.creation-card');

  if (!filterButtons.length || !creationCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      creationCards.forEach((card) => {
        const matches = card.dataset.category === category;
        card.hidden = !matches;
      });
    });
  });
}

/* ---------- Bouton retour en haut ---------- */
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');
  if (!backToTop) return;

  const SHOW_AFTER_PX = 480;

  const toggleVisibility = () => {
    backToTop.hidden = window.scrollY <= SHOW_AFTER_PX;
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}