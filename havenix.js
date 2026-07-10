/* ============================================================
   HAVENIXCI — Script principal
   ------------------------------------------------------------
   Sommaire :
   1. Utilitaires
   2. Navigation (menu burger + en-tête collant)
   3. Bouton « Retour en haut »
   4. Portfolio — onglets de catégorie (initCategoryTabs)
   5. Parcours de projet intelligent (assistant multi-étapes)
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initStickyHeader();
    initBackToTop();
    initCategoryTabs();
    initProjectWizard();
  });

  /* ============================================================
     2. NAVIGATION
     ============================================================ */
  function initNavToggle() {
    const toggle = document.querySelector('.nav__toggle');
    const nav = document.getElementById('primary-navigation');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });

    // Referme le menu mobile dès qu'un lien de navigation est activé.
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Referme le menu si un clic a lieu en dehors de la navigation.
    document.addEventListener('click', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header || header.dataset.sticky !== 'true') return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     3. RETOUR EN HAUT
     ============================================================ */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggleVisibility = () => {
      btn.hidden = window.scrollY < 480;
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     4. PORTFOLIO — ONGLETS DE CATÉGORIE
     ------------------------------------------------------------
     Les boutons de catégorie sont générés automatiquement à
     partir de l'attribut [data-category] de chaque carte présente
     dans #portfolio-grid. Le bouton « Toutes » reste fixe dans le
     HTML et sélectionné par défaut : toutes les cartes sont donc
     visibles au chargement de la page.
     ============================================================ */
  function initCategoryTabs() {
    const grid = document.getElementById('portfolio-grid');
    const filtersContainer = document.getElementById('portfolio-filters');
    if (!grid || !filtersContainer) return;

    const cards = Array.from(grid.querySelectorAll('.portfolio-card'));
    const seen = [];

    cards.forEach((card) => {
      const category = card.dataset.category;
      if (category && !seen.includes(category)) {
        seen.push(category);
      }
    });

    seen.forEach((category) => {
      const referenceCard = cards.find((c) => c.dataset.category === category);
      const label =
        referenceCard?.querySelector('[data-category-label]')?.textContent?.trim() ||
        category;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn font-body';
      btn.dataset.filter = category;
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = label;
      filtersContainer.appendChild(btn);
    });

    filtersContainer.addEventListener('click', (event) => {
      const btn = event.target.closest('.filter-btn');
      if (!btn || !filtersContainer.contains(btn)) return;

      filtersContainer.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
        card.classList.toggle('portfolio-card--fade-in', match);
      });
    });
  }

  /* ============================================================
     5. PARCOURS DE PROJET INTELLIGENT
     ============================================================ */
  function initProjectWizard() {
    const wizard = document.getElementById('project-wizard');
    const form = document.getElementById('project-wizard-form');
    if (!wizard || !form) return;

    const container = wizard.querySelector('.project-wizard__container');
    const progressFill = wizard.querySelector('[data-progress-fill]');
    const stepIndicator = wizard.querySelector('[data-step-indicator]');

    /* --- Séquence des étapes propres à chaque branche de service --- */
    const branchSteps = {
      'whatsapp-link': [
        'whatsapp-link-secteur',
        'whatsapp-link-tarif',
        'whatsapp-link-tunnel-commande',
        'whatsapp-link-logistique',
        'whatsapp-link-visuels',
      ],
      website: [
        'website-objectif',
        'website-envergure',
        'website-domaine',
        'website-contenus',
        'website-cadrage',
      ],
      'local-visibility': [
        'local-formule',
        'local-adresse',
        'local-numero-public',
        'local-accessibilite',
        'local-audit-horaires',
        'local-visuels',
      ],
      other: ['other-nature-projet', 'other-attentes'],
      // La branche Sécurité numérique commence toujours par le choix du
      // type de protection ; les étapes suivantes dépendent du sous-parcours
      // choisi (voir securitySubbranchSteps) et sont ajoutées dynamiquement.
      'securite-numerique': ['securite-type'],
    };

    /* --- Séquence des étapes propres à chaque sous-parcours de la
       branche Sécurité numérique (dépend du choix fait à l'étape
       "securite-type") --- */
    const securitySubbranchSteps = {
      localisation: [
        'securite-localisation-compte',
        'securite-localisation-confirmation',
        'securite-localisation-tarif',
      ],
      sauvegarde: ['securite-sauvegarde-compte', 'securite-sauvegarde-tarif'],
      'localisation-sauvegarde': [
        'securite-combo-compte',
        'securite-combo-confirmation',
        'securite-combo-tarif',
      ],
      dossiers: [
        'securite-dossiers-elements',
        'securite-dossiers-appareil',
        'securite-dossiers-tarif',
      ],
    };

    /* --- Libellés lisibles pour le résumé et le message WhatsApp --- */
    const serviceLabels = {
      'whatsapp-link': 'Lien personnalisé WhatsApp',
      website: 'Site internet professionnel',
      'local-visibility': 'Visibilité locale (Google Maps / Pack Google + Yango)',
      other: 'Autre demande',
      'securite-numerique': 'Sécurité numérique',
    };

    const secteurLabels = {
      'restaurant-maquis': 'Restaurant / Maquis',
      'boutique-mode': 'Boutique / Mode',
      'patisserie-fastfood': 'Pâtisserie / Fast-food',
      'beaute-spa': 'Salon de beauté / Spa',
      'hotel-residence': 'Hôtel / Résidence',
      immobilier: 'Immobilier',
      autre: 'Autre secteur',
    };

    const tunnelLabels = {
      'oui-prix': 'Oui, avec affichage des prix',
      'non-vitrine': 'Non, vitrine simple sans les prix',
    };

    const objectifLabels = {
      'presenter-entreprise': "Présenter l'entreprise et rassurer les partenaires",
      'presenter-services': 'Présenter les services',
      'presenter-produits': 'Présenter et vendre les produits',
      'recevoir-devis': 'Recevoir des demandes de devis',
      'recevoir-commandes': 'Recevoir des commandes directes',
      autre: 'Autre objectif',
    };

    const envergureLabels = {
      'une-page': 'Une seule page (landing page)',
      'jusqu-a-cinq': "Jusqu'à 5 pages",
      'plus-de-cinq': 'Plus de 5 pages',
    };

    const domaineLabels = {
      ci: 'Extension nationale (.ci)',
      com: 'Extension internationale (.com)',
      'deja-possede': 'Nom de domaine déjà possédé',
    };

    const contenusLabels = {
      logo: 'Logo officiel',
      textes: 'Textes rédigés',
      photos: 'Photos professionnelles',
    };

    const cadrageLabels = {
      'cdc-fourni': 'Cahier des charges déjà rédigé',
      'cdc-a-rediger': 'Rédaction du cahier des charges à prévoir',
    };

    const formuleLabels = {
      'maps-only': 'Installation Google Maps seule',
      'maps-yango': 'Pack Visibilité : Google Maps + Yango',
    };

    const attentesLabels = {
      'proposition-technique': 'Une proposition technique',
      'appel-telephonique': 'Un appel téléphonique',
      'rendez-vous-physique': 'Un rendez-vous physique',
    };

    const securityTypeLabels = {
      localisation: 'Localisation de téléphone',
      sauvegarde: 'Sauvegarde automatique des photos et vidéos',
      'localisation-sauvegarde':
        'Localisation de téléphone + Sauvegarde automatique des photos et vidéos',
      dossiers: 'Sécurisation des dossiers importants (PC / Mac)',
    };

    const appareilLabels = {
      'pc-windows': 'PC Windows',
      mac: 'Mac',
      'les-deux': 'Les deux (PC et Mac)',
    };

    const elementsDossiersLabels = {
      'documents-professionnels': 'Documents professionnels',
      'documents-administratifs': 'Documents administratifs',
      photos: 'Photos',
      videos: 'Vidéos',
      'projets-etudes': "Projets d'études",
      tous: 'Tous mes dossiers importants',
    };

    let currentFlow = ['identite', 'service'];
    let currentIndex = 0;

    /* ---------- Ouverture / fermeture de la modale ---------- */
    document.querySelectorAll('[data-open-project-wizard]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        openWizard(btn.dataset.startBranch || '');
      });
    });

    wizard.querySelectorAll('[data-close-project-wizard]').forEach((el) => {
      el.addEventListener('click', (event) => {
        event.preventDefault();
        closeWizard();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !wizard.hidden) {
        closeWizard();
      }
    });

    function openWizard(startBranch) {
      wizard.hidden = false;
      document.body.style.overflow = 'hidden';
      currentFlow = ['identite', 'service'];
      currentIndex = 0;

      // Si le bouton cliqué porte un [data-start-branch] (ex. « Me protéger »
      // dans la section Sécurité numérique), on présélectionne le service
      // correspondant à l'étape 2 pour accélérer le parcours du visiteur.
      if (startBranch) {
        const radio = form.querySelector(`input[name="service"][value="${startBranch}"]`);
        if (radio) radio.checked = true;
      }

      showStep('identite');
    }

    function closeWizard() {
      wizard.hidden = true;
      document.body.style.overflow = '';
    }

    /* ---------- Navigation entre étapes ---------- */
    form.addEventListener('click', (event) => {
      const nextBtn = event.target.closest('[data-next-step]');
      const prevBtn = event.target.closest('[data-prev-step]');
      if (nextBtn) {
        event.preventDefault();
        handleNext(nextBtn);
      } else if (prevBtn) {
        event.preventDefault();
        handlePrev();
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      sendProjectToWhatsApp();
    });

    function handleNext(btn) {
      const stepName = currentFlow[currentIndex];
      const stepEl = getStepEl(stepName);
      if (!validateStep(stepEl)) return;

      if (stepName === 'service') {
        const service = form.querySelector('input[name="service"]:checked')?.value;
        currentFlow = ['identite', 'service', ...(branchSteps[service] || []), 'summary'];
      }

      // Branche Sécurité numérique : une fois le type de protection choisi,
      // on insère les étapes du sous-parcours correspondant juste après
      // "securite-type" et avant le résumé final.
      if (stepName === 'securite-type') {
        const type = form.querySelector('input[name="type-securite"]:checked')?.value;
        const insertAt = currentFlow.indexOf('securite-type') + 1;
        currentFlow = [
          ...currentFlow.slice(0, insertAt),
          ...(securitySubbranchSteps[type] || []),
          'summary',
        ];
      }

      if (btn.hasAttribute('data-goto-summary')) {
        currentIndex = currentFlow.indexOf('summary');
      } else {
        currentIndex = Math.min(currentIndex + 1, currentFlow.length - 1);
      }
      showStep(currentFlow[currentIndex]);
    }

    function handlePrev() {
      if (currentIndex > 0) {
        currentIndex -= 1;
        showStep(currentFlow[currentIndex]);
      }
    }

    function getStepEl(name) {
      return form.querySelector(`[data-step="${name}"]`);
    }

    function showStep(name) {
      form.querySelectorAll('.project-wizard__step').forEach((el) => {
        el.hidden = true;
      });
      form.querySelectorAll('.project-wizard__branch').forEach((el) => {
        el.hidden = true;
      });
      // Les sous-parcours (branche Sécurité numérique) doivent eux aussi être
      // masqués à chaque changement d'étape, sinon plusieurs sous-parcours
      // en display:contents peuvent rester visibles simultanément.
      form.querySelectorAll('.project-wizard__subbranch').forEach((el) => {
        el.hidden = true;
      });

      const stepEl = getStepEl(name);
      if (!stepEl) return;

      const branch = stepEl.closest('.project-wizard__branch');
      const subbranch = stepEl.closest('.project-wizard__subbranch');
      if (branch) branch.hidden = false;
      if (subbranch) subbranch.hidden = false;
      stepEl.hidden = false;

      if (name === 'whatsapp-link-tarif') updatePriceTier();
      if (name === 'summary') populateSummary();

      if (container) container.scrollTop = 0;
      updateProgress();

      const firstField = stepEl.querySelector('input, textarea');
      if (firstField) firstField.focus({ preventScroll: true });
    }

    function updateProgress() {
      const total = currentFlow.length;
      const pct = Math.round(((currentIndex + 1) / total) * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (stepIndicator) {
        stepIndicator.textContent = `Étape ${currentIndex + 1} sur ${total}`;
      }
    }

    /* ---------- Validation d'étape (native + indicateurs ✅) ---------- */
    function validateStep(stepEl) {
      if (!stepEl) return true;
      const requiredInputs = Array.from(stepEl.querySelectorAll('[data-required="true"]'));
      for (const input of requiredInputs) {
        if (!input.reportValidity()) {
          return false;
        }
      }
      return true;
    }

    form.querySelectorAll('.form__group input, .form__group textarea').forEach((input) => {
      const group = input.closest('.form__group');
      const check = group ? group.querySelector('[data-field-check]') : null;
      if (!check) return;

      const update = () => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          // Pour une case à cocher, la présence de `value` ne dépend pas de
          // l'état coché : il faut se baser sur `checked`, sinon le ✅
          // s'affiche même quand la case n'est pas cochée.
          check.hidden = !input.checked;
        } else {
          check.hidden = !(input.value.trim() !== '' && input.checkValidity());
        }
      };
      input.addEventListener('input', update);
      input.addEventListener('change', update);
    });

    /* ---------- Branche A : tarif selon le secteur d'activité ---------- */
    function updatePriceTier() {
      const tarifStep = getStepEl('whatsapp-link-tarif');
      if (!tarifStep) return;
      tarifStep.querySelectorAll('[data-price-tier-info]').forEach((el) => {
        el.hidden = true;
      });
      const selected = form.querySelector('input[name="secteur"]:checked');
      if (!selected) return;
      const target = tarifStep.querySelector(`[data-price-tier-info="${selected.dataset.priceTier}"]`);
      if (target) target.hidden = false;
    }

    /* ---------- Branche C : tarif selon la formule choisie ---------- */
    form.querySelectorAll('[data-price-trigger]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const step = radio.closest('.project-wizard__step');
        if (!step) return;
        step.querySelectorAll('[data-price-info]').forEach((el) => {
          el.hidden = true;
        });
        const target = step.querySelector(`[data-price-info="${radio.value}"]`);
        if (target) target.hidden = false;
      });
    });

    /* ---------- Notice photos (branches A et C) ---------- */
    form.querySelectorAll('[data-photo-trigger]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const step = radio.closest('.project-wizard__step');
        const notice = step ? step.querySelector('[data-photo-notice]') : null;
        if (!notice) return;
        notice.hidden = !(radio.checked && radio.value === 'non');
      });
    });

    /* ---------- Notice compte Gmail / Apple (branche Sécurité numérique) ----------
       Même principe que les notices photos : affichée uniquement quand le
       visiteur répond "non" (pas de compte existant), pour rassurer sur le
       fait qu'Havenixci peut créer le compte pour lui. */
    form.querySelectorAll('[data-account-trigger]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const step = radio.closest('.project-wizard__step');
        const notice = step ? step.querySelector('[data-account-notice]') : null;
        if (!notice) return;
        notice.hidden = !(radio.checked && radio.value === 'non');
      });
    });

    /* ---------- Branche B : champ « Autre objectif » ---------- */
    form.querySelectorAll('[data-objectif-trigger]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const step = radio.closest('.project-wizard__step');
        const autreGroup = step ? step.querySelector('[data-objectif-autre]') : null;
        if (!autreGroup) return;
        autreGroup.hidden = !(radio.checked && radio.value === 'autre');
      });
    });

    /* ---------- Construction du détail et du tarif par branche ---------- */
    function buildDetails(service) {
      const lines = [];

      if (service === 'whatsapp-link') {
        const secteur = form.querySelector('input[name="secteur"]:checked');
        if (secteur) lines.push(`Secteur : ${secteurLabels[secteur.value] || secteur.value}`);

        const tunnel = form.querySelector('input[name="tunnel-commande"]:checked');
        if (tunnel) lines.push(`Tunnel de commande : ${tunnelLabels[tunnel.value]}`);

        const logistique = form.querySelector('input[name="logistique"]:checked');
        if (logistique) lines.push(`Localisation / zones de livraison affichées : ${logistique.value === 'oui' ? 'Oui' : 'Non'}`);

        const visuels = form.querySelector('input[name="visuels"]:checked');
        if (visuels) {
          lines.push(`Photos disponibles : ${visuels.value === 'oui' ? 'Oui' : 'Non, à fournir après validation'}`);
        }
      } else if (service === 'website') {
        const objectif = form.querySelector('input[name="objectif-site"]:checked');
        if (objectif) {
          let label = objectifLabels[objectif.value] || objectif.value;
          if (objectif.value === 'autre') {
            const autre = form.querySelector('[name="objectif-site-autre"]')?.value.trim();
            if (autre) label += ` (${autre})`;
          }
          lines.push(`Objectif principal : ${label}`);
        }

        const envergure = form.querySelector('input[name="envergure-site"]:checked');
        if (envergure) lines.push(`Structure : ${envergureLabels[envergure.value]}`);

        const domaine = form.querySelector('input[name="nom-domaine"]:checked');
        if (domaine) lines.push(`Nom de domaine : ${domaineLabels[domaine.value]}`);

        const contenus = Array.from(form.querySelectorAll('input[name="contenus"]:checked')).map(
          (c) => contenusLabels[c.value] || c.value
        );
        lines.push(`Éléments déjà disponibles : ${contenus.length ? contenus.join(', ') : 'Aucun élément fourni pour le moment'}`);

        const cadrage = form.querySelector('input[name="cadrage"]:checked');
        if (cadrage) lines.push(`Cahier des charges : ${cadrageLabels[cadrage.value]}`);
      } else if (service === 'local-visibility') {
        const formule = form.querySelector('input[name="formule-locale"]:checked');
        if (formule) lines.push(`Formule : ${formuleLabels[formule.value]}`);

        const adresse = form.querySelector('[name="adresse-locale"]')?.value.trim();
        if (adresse) lines.push(`Adresse : ${adresse}`);

        const numeroPublic = form.querySelector('[name="numero-public"]')?.value.trim();
        if (numeroPublic) lines.push(`Numéro public affiché : ${numeroPublic}`);

        const accessibilite = form.querySelector('input[name="accessibilite"]:checked');
        if (accessibilite) lines.push(`Accueil de clients sur place : ${accessibilite.value === 'oui' ? 'Oui' : 'Non'}`);

        const ficheGoogle = form.querySelector('input[name="fiche-google-business"]:checked');
        if (ficheGoogle) lines.push(`Fiche Google Business existante : ${ficheGoogle.value === 'oui' ? 'Oui' : 'Non'}`);

        const horaires = form.querySelector('[name="horaires-locale"]')?.value.trim();
        if (horaires) lines.push(`Horaires d'ouverture : ${horaires}`);

        const visuelsLocale = form.querySelector('input[name="visuels-locale"]:checked');
        if (visuelsLocale) {
          lines.push(`Photos devanture / intérieur disponibles : ${visuelsLocale.value === 'oui' ? 'Oui' : 'Non, à fournir'}`);
        }
      } else if (service === 'other') {
        const besoin = form.querySelector('[name="besoin"]')?.value.trim();
        if (besoin) lines.push(`Description du besoin : ${besoin}`);

        const attentes = form.querySelector('input[name="attentes"]:checked');
        if (attentes) lines.push(`Attente principale : ${attentesLabels[attentes.value]}`);
      } else if (service === 'securite-numerique') {
        const type = form.querySelector('input[name="type-securite"]:checked')?.value;
        if (type) lines.push(`Type de protection : ${securityTypeLabels[type] || type}`);

        if (type === 'localisation') {
          const compte = form.querySelector('input[name="compte-localisation"]:checked');
          if (compte) lines.push(`Compte Gmail / Apple existant : ${compte.value === 'oui' ? 'Oui' : 'Non, à créer'}`);

          const confirmation = form.querySelector('#wizard-confirm-localisation');
          if (confirmation) lines.push(`Confirmation d'autorisation sur l'appareil : ${confirmation.checked ? 'Oui' : 'Non renseignée'}`);
        } else if (type === 'sauvegarde') {
          const compte = form.querySelector('input[name="compte-sauvegarde"]:checked');
          if (compte) lines.push(`Compte Gmail / Apple existant : ${compte.value === 'oui' ? 'Oui' : 'Non, à créer'}`);
        } else if (type === 'localisation-sauvegarde') {
          const compte = form.querySelector('input[name="compte-combo"]:checked');
          if (compte) lines.push(`Compte Gmail / Apple existant : ${compte.value === 'oui' ? 'Oui' : 'Non, à créer'}`);

          const confirmation = form.querySelector('#wizard-confirm-combo');
          if (confirmation) lines.push(`Confirmation d'autorisation sur l'appareil : ${confirmation.checked ? 'Oui' : 'Non renseignée'}`);
        } else if (type === 'dossiers') {
          const elements = Array.from(form.querySelectorAll('input[name="elements-dossiers"]:checked')).map(
            (e) => elementsDossiersLabels[e.value] || e.value
          );
          if (elements.length) lines.push(`Éléments à protéger : ${elements.join(', ')}`);

          const appareil = form.querySelector('input[name="appareil-dossiers"]:checked');
          if (appareil) lines.push(`Appareil à sécuriser : ${appareilLabels[appareil.value] || appareil.value}`);
        }
      }

      return lines;
    }

    function buildTarif(service) {
      if (service === 'whatsapp-link') {
        const secteur = form.querySelector('input[name="secteur"]:checked');
        const tier = secteur ? secteur.dataset.priceTier : 'standard';
        return tier === 'premium' ? 'À partir de 30 000 FCFA' : 'À partir de 15 000 FCFA';
      }
      if (service === 'website') {
        return 'À partir de 100 000 FCFA (tarif final selon le cahier des charges)';
      }
      if (service === 'local-visibility') {
        const formule = form.querySelector('input[name="formule-locale"]:checked');
        return formule && formule.value === 'maps-yango' ? '15 000 FCFA' : '10 000 FCFA';
      }
      if (service === 'securite-numerique') {
        const type = form.querySelector('input[name="type-securite"]:checked')?.value;
        if (type === 'localisation') return 'À partir de 15 000 FCFA';
        if (type === 'sauvegarde') return 'À partir de 15 000 FCFA';
        if (type === 'localisation-sauvegarde') return 'À partir de 20 000 FCFA';
        if (type === 'dossiers') return 'À partir de 20 000 FCFA';
        return 'Tarif selon la protection choisie';
      }
      return 'Devis personnalisé selon votre demande';
    }

    /* ---------- Résumé avant envoi ---------- */
    function populateSummary() {
      const service = form.querySelector('input[name="service"]:checked')?.value;
      const nom = form.querySelector('[name="nom"]')?.value.trim() || '—';
      const ville = form.querySelector('[name="ville"]')?.value.trim() || '—';
      const whatsapp = form.querySelector('[name="whatsapp"]')?.value.trim() || '—';
      const email = form.querySelector('[name="email"]')?.value.trim() || 'Non renseignée';
      const details = buildDetails(service);
      const tarif = buildTarif(service);

      setSummary('nom', nom);
      setSummary('ville', ville);
      setSummary('whatsapp', whatsapp);
      setSummary('service', serviceLabels[service] || '—');
      setSummary('details', details.length ? details.join(' • ') : '—');
      setSummary('email', email);
      setSummary('tarif', tarif);
    }

    function setSummary(key, value) {
      const el = form.querySelector(`[data-summary="${key}"]`);
      if (el) el.textContent = value;
    }

    /* ---------- Envoi final vers WhatsApp ---------- */
    function sendProjectToWhatsApp() {
      const service = form.querySelector('input[name="service"]:checked')?.value;
      const nom = form.querySelector('[name="nom"]')?.value.trim() || 'Non renseigné';
      const ville = form.querySelector('[name="ville"]')?.value.trim() || 'Non renseignée';
      const whatsapp = form.querySelector('[name="whatsapp"]')?.value.trim() || 'Non renseigné';
      const email = form.querySelector('[name="email"]')?.value.trim();
      const details = buildDetails(service);
      const tarif = buildTarif(service);

      const lines = [
        'Nouvelle demande de projet — Havenixci',
        '',
        `Nom : ${nom}`,
        `Ville / Localisation : ${ville}`,
        `Numéro WhatsApp : ${whatsapp}`,
      ];

      if (email) lines.push(`E-mail : ${email}`);
      lines.push(`Service souhaité : ${serviceLabels[service] || service || 'Non renseigné'}`);

      if (details.length) {
        lines.push('');
        lines.push('Détails :');
        details.forEach((detail) => lines.push(`- ${detail}`));
      }

      lines.push('');
      lines.push(`Tarif estimatif : ${tarif}`);

      const message = lines.join('\n');
      const floatBtn = document.getElementById('whatsapp-float');
      const number = floatBtn ? floatBtn.dataset.whatsappNumber : '';

      if (!number) {
        // Sécurité : évite d'ouvrir un lien wa.me sans destinataire.
        // eslint-disable-next-line no-console
        console.warn('Numéro WhatsApp manquant : renseignez data-whatsapp-number sur #whatsapp-float.');
        return;
      }

      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener');
      closeWizard();
    }
  }
})();