/* ============================================================
   HAVENIXCI — PORTFOLIO
   Script complet (étape 3 du cahier des charges)
   - Filtres par catégorie (génération dynamique des onglets)
   - Révélation au défilement
   - Cascade sur la grille de projets
   - Compteurs animés
   - Sélecteur de langue FR / EN
   - Respect de prefers-reduced-motion
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Utilitaire : préférence de réduction des animations ---------- */
  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /* ---------- 1. Année du copyright ---------- */
  function initFooterYear() {
    const el = document.getElementById('current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- 1bis. Barre de progression du défilement ----------
     Reflète la position de lecture dans la page. N'est pas une animation
     décorative (pas de mouvement automatique), elle reste donc active
     même avec prefers-reduced-motion, mais sans transition adoucie.
  ------------------------------------------------------------------ */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = 'scaleX(' + Math.min(Math.max(progress, 0), 1) + ')';
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ---------- 2. Transition douce de la navigation au défilement ---------- */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const updateHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  /* ---------- 3. Onglets de catégories + filtrage ----------
     Les boutons sont générés automatiquement à partir des cartes présentes
     dans #portfolio-grid ([data-category]). Le libellé affiché sur chaque
     bouton est lu directement sur la carte ([data-category-label]), afin de
     rester cohérent même si la valeur technique de data-category diffère
     légèrement du libellé humain (ex. accents, orthographe). Ce libellé est
     ensuite resynchronisé à chaque changement de langue par
     syncFilterButtonLabels() (voir section 6bis).

     Aucune autre logique de filtrage ne doit exister ailleurs dans le
     projet : le masquage se fait uniquement via la classe .is-hidden
     (jamais via card.style.display), pour rester compatible avec
     l'animation .portfolio-card--fade-in définie dans havenixfolio.css.
  ------------------------------------------------------------- */
  function initCategoryTabs() {
    const grid = document.getElementById('portfolio-grid');
    const filtersContainer = document.getElementById('portfolio-filters');
    const emptyState = document.getElementById('portfolio-empty');
    if (!grid || !filtersContainer) return;

    const cards = Array.from(grid.querySelectorAll('.portfolio-card[data-category]'));
    if (!cards.length) return;

    /* Construire la liste des catégories uniques (valeur -> libellé) */
    const categories = new Map();
    cards.forEach((card) => {
      const value = card.dataset.category;
      if (!value || categories.has(value)) return;
      const labelEl = card.querySelector('[data-category-label]');
      const label = labelEl ? labelEl.textContent.trim() : value;
      categories.set(value, label);
    });

    /* Générer un bouton par catégorie (le bouton "Toutes" est déjà en HTML) */
    categories.forEach((label, value) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-btn font-body';
      button.dataset.filter = value;
      button.setAttribute('role', 'listitem');
      button.setAttribute('aria-pressed', 'false');
      button.textContent = label;
      filtersContainer.appendChild(button);
    });

    const buttons = Array.from(filtersContainer.querySelectorAll('.filter-btn'));
    const reduceMotion = prefersReducedMotion();
    const STAGGER_MS = 70;

    function applyFilter(filterValue) {
      let visibleIndex = 0;

      cards.forEach((card) => {
        const matches = filterValue === 'all' || card.dataset.category === filterValue;

        if (!matches) {
          card.classList.add('is-hidden');
          card.classList.remove('portfolio-card--fade-in');
          card.style.removeProperty('--fade-delay');
          return;
        }

        card.classList.remove('is-hidden');

        if (!reduceMotion) {
          /* Relancer l'animation même si la carte était déjà visible */
          card.classList.remove('portfolio-card--fade-in');
          card.style.setProperty('--fade-delay', (visibleIndex * STAGGER_MS) + 'ms');
          // Force le navigateur à "voir" le retrait de la classe avant de la remettre
          void card.offsetWidth;
          card.classList.add('portfolio-card--fade-in');
        }

        visibleIndex += 1;
      });

      if (emptyState) {
        emptyState.hidden = visibleIndex !== 0;
      }
    }

    filtersContainer.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-btn');
      if (!button || !filtersContainer.contains(button)) return;

      buttons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');

      applyFilter(button.dataset.filter);
    });
  }

  /* ---------- 4. Révélation au défilement ----------
     S'applique à tout élément portant à la fois la classe .reveal et un
     attribut [data-animate] (la section réalisations et chaque carte).
     La classe .in-view, ajoutée ici, déclenche la transition définie
     dans havenixfolio.css.
  --------------------------------------------------- */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal[data-animate]');
    if (!revealEls.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- 5. Compteurs animés (statistiques du Hero) ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(eased * target);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        const target = parseInt(el.dataset.target, 10) || 0;
        el.textContent = target + (el.dataset.suffix || '');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ---------- 6. Ajout d'un projet via le <template> (utilitaire optionnel) ----------
     Permet d'ajouter une réalisation sans toucher au HTML : les onglets de
     catégorie se régénèrent automatiquement si une nouvelle catégorie
     apparaît. Exposé sur window.Havenix pour un usage futur, non appelé
     automatiquement. Note : les cartes ajoutées ainsi ne sont pas
     traduites automatiquement, contrairement aux 8 cartes déjà en place.

     Exemple d'utilisation dans la console ou un autre script :
       Havenix.addProject({
         image: 'mon-projet/image.jpg',
         category: 'boutique',
         categoryLabel: 'Boutique',
         name: 'Mon Nouveau Projet',
         description: 'Une courte description du projet.',
         link: 'mon-projet/index.html'
       });
  --------------------------------------------------------------------- */
  function addProject(data) {
    const template = document.getElementById('portfolio-card-template');
    const grid = document.getElementById('portfolio-grid');
    if (!template || !grid || !data) return;

    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.portfolio-card');
    const img = fragment.querySelector('.portfolio-card__image');
    const categoryLabel = fragment.querySelector('[data-category-label]');
    const name = fragment.querySelector('[data-project-name]');
    const description = fragment.querySelector('[data-project-description]');
    const link = fragment.querySelector('[data-project-link]');

    card.dataset.category = data.category || '';
    if (img) {
      img.src = data.image || '';
      img.alt = data.imageAlt || '';
    }
    if (categoryLabel) categoryLabel.textContent = data.categoryLabel || data.category || '';
    if (name) name.textContent = data.name || '';
    if (description) description.textContent = data.description || '';
    if (link) link.href = data.link || '#';

    grid.appendChild(fragment);

    /* Régénérer les onglets et l'observation du défilement pour la nouvelle carte */
    document.querySelectorAll('#portfolio-filters .filter-btn:not([data-filter="all"])').forEach((btn) => btn.remove());
    initCategoryTabs();
    initScrollReveal();
    syncFilterButtonLabels();
  }

  /* ---------- 6bis. Sélecteur de langue FR / EN ----------
     Dictionnaire clé -> texte, appliqué à tous les éléments portant un
     attribut [data-i18n="cle"] (innerHTML, pour pouvoir garder par exemple
     le <span class="hero-title-accent"> imbriqué dans le titre du Hero).
     La langue choisie est mémorisée dans localStorage pour être conservée
     d'une visite à l'autre. Ceci est un site livré (pas un aperçu Claude.ai) :
     localStorage fonctionne normalement une fois hébergé.

     Limite à connaître : les balises Open Graph / Twitter Card du <head>
     (utilisées pour l'aperçu WhatsApp/LinkedIn) restent en français, car
     les robots qui génèrent ces aperçus n'exécutent pas toujours le
     JavaScript de la page. Pour un vrai site bilingue référencé dans les
     deux langues, il faudrait à terme deux URLs distinctes (ex. /en/).
  ------------------------------------------------------------------ */
  const translations = {
    fr: {
      'meta.title': 'Portfolio — HavenixCI',
      'meta.description': "Découvrez les réalisations de HavenixCI : hôtels, restaurants, boutiques, agences immobilières et bien plus.",
      'nav.contact': 'Nous contacter',
      'hero.eyebrow': 'Portfolio Havenix',
      'hero.title': 'Des sites qui donnent envie de rester, <span class="hero-title-accent">pas seulement de passer.</span>',
      'hero.text': "Chaque projet ci-dessous a été conçu, codé et livré par notre équipe : hôtels, restaurants, boutiques, agences immobilières. Regardez, cliquez, comparez — puis parlons du vôtre.",
      'hero.cta.primary': 'Voir nos réalisations',
      'hero.cta.secondary': 'Démarrer un projet',
      'hero.mock.pill1': 'Réservation',
      'hero.mock.pill2': 'Catalogue',
      'hero.mock.pill3': 'Contact rapide',
      'hero.badge': 'Conçu par Havenix',
      'hero.stat1.label': 'Sites livrés',
      'hero.stat2.label': 'Secteurs différents',
      'hero.stat3.label': 'Adaptés mobile',
      'portfolio.title': 'Chaque projet reflète notre engagement envers la qualité.',
      'portfolio.text': 'Nos réalisations illustrent notre volonté de concevoir des solutions digitales élégantes, fonctionnelles et adaptées aux objectifs de chaque entreprise.',
      'filter.all': 'Toutes',
      'card.miawa.category': 'Hôtel',
      'card.miawa.description': 'Hôtel confortable à Yamoussoukro — présentation des chambres et réservation en ligne.',
      'card.delices.category': 'Pâtisserie',
      'card.delices.description': 'Des créations gourmandes pour célébrer vos plus beaux moments.',
      'card.peinture.category': 'Peinture',
      'card.peinture.description': 'Donnez une nouvelle vie à vos espaces grâce à une peinture professionnelle.',
      'card.blackwhite.category': 'Restaurant',
      'card.blackwhite.description': 'Cuisine africaine et européenne, dans un cadre chaleureux.',
      'card.immobilier.category': 'Immobilier',
      'card.immobilier.title': "Agence immobilière — Côte d'Ivoire",
      'card.immobilier.description': "Votre partenaire pour vos projets immobiliers en Côte d'Ivoire.",
      'card.cosmetique.category': 'Cosmétique',
      'card.cosmetique.description': 'Prenez soin de votre peau avec des produits adaptés à vos besoins.',
      'card.saveurs.category': 'Restaurant',
      'card.saveurs.description': 'Les saveurs ivoiriennes dans un cadre moderne.',
      'card.carte.category': 'Carte Numérique',
      'card.carte.title': 'Carte de visite numérique',
      'card.carte.description': 'Offrez une expérience moderne à vos clients grâce à une carte de visite numérique facile à partager par QR Code, WhatsApp ou lien.',
      'link.project': 'Voir le projet',
      'cta.title': 'Votre projet peut ressembler à ceux-ci.',
      'cta.text': 'Décrivez-nous votre activité, on vous propose une maquette et un délai clair — sans engagement.',
      'cta.whatsapp': 'Écrire sur WhatsApp',
      'footer.contact': 'Contact',
      'footer.rights': 'Tous droits réservés.'
    },
    en: {
      'meta.title': 'Portfolio — HavenixCI',
      'meta.description': 'Discover HavenixCI\'s work: hotels, restaurants, shops, real estate agencies and more.',
      'nav.contact': 'Contact us',
      'hero.eyebrow': 'Havenix Portfolio',
      'hero.title': 'Websites that make people want to stay, <span class="hero-title-accent">not just pass through.</span>',
      'hero.text': "Every project below was designed, built and delivered by our team: hotels, restaurants, shops, real estate agencies. Look, click, compare — then let's talk about yours.",
      'hero.cta.primary': 'See our work',
      'hero.cta.secondary': 'Start a project',
      'hero.mock.pill1': 'Booking',
      'hero.mock.pill2': 'Catalogue',
      'hero.mock.pill3': 'Quick contact',
      'hero.badge': 'Designed by Havenix',
      'hero.stat1.label': 'Sites delivered',
      'hero.stat2.label': 'Different industries',
      'hero.stat3.label': 'Mobile-ready',
      'portfolio.title': 'Every project reflects our commitment to quality.',
      'portfolio.text': 'Our work shows our commitment to designing elegant, functional digital solutions tailored to each business.',
      'filter.all': 'All',
      'card.miawa.category': 'Hotel',
      'card.miawa.description': 'A comfortable hotel in Yamoussoukro — room showcase and online booking.',
      'card.delices.category': 'Bakery',
      'card.delices.description': 'Gourmet creations to celebrate your most beautiful moments.',
      'card.peinture.category': 'Painting',
      'card.peinture.description': 'Give your spaces new life with professional painting.',
      'card.blackwhite.category': 'Restaurant',
      'card.blackwhite.description': 'African and European cuisine in a warm setting.',
      'card.immobilier.category': 'Real Estate',
      'card.immobilier.title': "Real Estate Agency — Côte d'Ivoire",
      'card.immobilier.description': "Your partner for real estate projects in Côte d'Ivoire.",
      'card.cosmetique.category': 'Cosmetics',
      'card.cosmetique.description': 'Take care of your skin with products suited to your needs.',
      'card.saveurs.category': 'Restaurant',
      'card.saveurs.description': 'Ivorian flavours in a modern setting.',
      'card.carte.category': 'Digital Card',
      'card.carte.title': 'Digital business card',
      'card.carte.description': 'Give your clients a modern experience with a digital business card, easy to share by QR code, WhatsApp or link.',
      'link.project': 'View project',
      'cta.title': 'Your project could look like these.',
      'cta.text': "Tell us about your business — we'll suggest a mockup and a clear timeline, no commitment.",
      'cta.whatsapp': 'Message on WhatsApp',
      'footer.contact': 'Contact',
      'footer.rights': 'All rights reserved.'
    }
  };

  const LANG_STORAGE_KEY = 'havenix-lang';

  /* Resynchronise le texte des boutons de filtre (générés en section 3)
     avec le libellé de catégorie actuellement affiché sur les cartes,
     pour qu'ils suivent la langue active. */
  function syncFilterButtonLabels() {
    const grid = document.getElementById('portfolio-grid');
    const filtersContainer = document.getElementById('portfolio-filters');
    if (!grid || !filtersContainer) return;

    const seen = new Set();
    grid.querySelectorAll('.portfolio-card[data-category]').forEach((card) => {
      const value = card.dataset.category;
      if (!value || seen.has(value)) return;
      seen.add(value);

      const labelEl = card.querySelector('[data-category-label]');
      const button = filtersContainer.querySelector('.filter-btn[data-filter="' + value + '"]');
      if (labelEl && button) {
        button.textContent = labelEl.textContent.trim();
      }
    });
  }

  function applyLanguage(lang, buttons) {
    const dict = translations[lang] || translations.fr;
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    if (dict['meta.title']) document.title = dict['meta.title'];
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && dict['meta.description']) {
      metaDescription.setAttribute('content', dict['meta.description']);
    }

    buttons.forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    syncFilterButtonLabels();

    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage indisponible (navigation privée, etc.) : sans conséquence,
         la langue reste juste non mémorisée d'une visite à l'autre. */
    }
  }

  function initLanguageSwitch() {
    const buttons = Array.from(document.querySelectorAll('.lang-switch__btn'));
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => applyLanguage(btn.dataset.lang, buttons));
    });

    let initialLang = 'fr';
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') initialLang = saved;
    } catch (e) {
      /* pas grave, on reste en français par défaut */
    }

    applyLanguage(initialLang, buttons);
  }

  /* ---------- Initialisation ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initScrollProgress();
    initHeaderScroll();
    initCategoryTabs();
    initLanguageSwitch();
    initScrollReveal();
    initCounters();
  });

  window.Havenix = window.Havenix || {};
  window.Havenix.addProject = addProject;
})();