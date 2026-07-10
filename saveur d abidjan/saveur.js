/* ============================================================
   SAVEURS D'ABIDJAN — Script principal
   - Navigation mobile (burger)
   - Filtrage du menu par catégorie
   - Bouton retour en haut
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initMenuFilters();
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

  // Ferme le menu quand on clique sur un lien
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Ferme le menu si on clique en dehors
  document.addEventListener('click', (event) => {
    const clickedOutside = !nav.contains(event.target) && !toggle.contains(event.target);
    if (clickedOutside && toggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
    }
  });

  // Ferme le menu avec la touche Échap
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeNav();
      toggle.focus();
    }
  });

  // Repasse en état fermé si on repasse en affichage desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });
}

/* ---------- Filtrage du menu ---------- */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterButtons.length || !menuCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      // Met à jour l'état visuel et aria des boutons
      filterButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-selected', 'true');

      // Affiche/masque les plats correspondants
      menuCards.forEach((card) => {
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
    if (window.scrollY > SHOW_AFTER_PX) {
      backToTop.hidden = false;
    } else {
      backToTop.hidden = true;
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}