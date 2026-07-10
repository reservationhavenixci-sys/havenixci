/* ============================================================
   HAVENIXCI — SCRIPT DU SITE
   ------------------------------------------------------------
   Portée : navigation, formulaire intelligent, FAQ, sélection
   de produits, animations d'apparition, optimisations.
   Aucune dépendance externe. Amélioration progressive :
   le HTML et le CSS restent pleinement valides sans ce fichier.
   ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
     0. CONFIGURATION
     À adapter avant mise en ligne : numéro WhatsApp de la boutique
     au format international, sans "+", espaces ni tirets.
     ------------------------------------------------------------ */
  const WHATSAPP_NUMBER = '2250700000000'; // TODO : remplacer par le vrai numéro

  /* ------------------------------------------------------------
     1. UTILITAIRES
     ------------------------------------------------------------ */
  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const reduitMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     2. NAVIGATION MOBILE
     Un bouton "menu" est injecté (le HTML reste simple et valide
     sans JS) puis contrôle l'ouverture/fermeture du menu.
     ------------------------------------------------------------ */
  function initNavigationMobile() {
    const header = qs('header');
    const nav = qs('header > nav');
    const liste = qs('header > nav > ul');
    if (!header || !nav || !liste) return;

    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'menu-toggle';
    bouton.setAttribute('aria-expanded', 'false');
    bouton.setAttribute('aria-controls', 'menu-principal');
    bouton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    bouton.innerHTML = '<span></span><span></span><span></span>';
    liste.id = liste.id || 'menu-principal';

    nav.insertBefore(bouton, liste);

    function fermerMenu() {
      nav.removeAttribute('data-menu');
      bouton.setAttribute('aria-expanded', 'false');
      bouton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }

    function ouvrirMenu() {
      nav.setAttribute('data-menu', 'open');
      bouton.setAttribute('aria-expanded', 'true');
      bouton.setAttribute('aria-label', 'Fermer le menu de navigation');
    }

    bouton.addEventListener('click', () => {
      const estOuvert = bouton.getAttribute('aria-expanded') === 'true';
      estOuvert ? fermerMenu() : ouvrirMenu();
    });

    // Ferme le menu après le choix d'un lien (comportement attendu sur mobile)
    liste.addEventListener('click', (evenement) => {
      if (evenement.target.closest('a')) fermerMenu();
    });

    document.addEventListener('keydown', (evenement) => {
      if (evenement.key === 'Escape') fermerMenu();
    });

    // Repasse en navigation desktop proprement au redimensionnement
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 860) fermerMenu();
    }, 150));
  }

  /* ------------------------------------------------------------
     3. ACCORDÉON FAQ
     Transforme les paires <dt>/<dd> en accordéon accessible,
     sans modifier le texte ni la structure sémantique existante.
     ------------------------------------------------------------ */
  function initFAQ() {
    const dl = qs('#faq > dl');
    if (!dl) return;

    qsa('#faq > dl > div').forEach((bloc, index) => {
      const dt = qs('dt', bloc);
      const dd = qs('dd', bloc);
      if (!dt || !dd) return;

      const idBouton = `faq-question-${index}`;
      const idReponse = `faq-reponse-${index}`;

      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.id = idBouton;
      bouton.setAttribute('aria-expanded', 'false');
      bouton.setAttribute('aria-controls', idReponse);
      bouton.textContent = dt.textContent.trim();
      dt.textContent = '';
      dt.appendChild(bouton);

      const contenu = document.createElement('span');
      contenu.innerHTML = dd.innerHTML;
      dd.innerHTML = '';
      dd.appendChild(contenu);
      dd.id = idReponse;
      dd.setAttribute('role', 'region');
      dd.setAttribute('aria-labelledby', idBouton);
      dd.dataset.open = 'false';

      bouton.addEventListener('click', () => {
        const estOuvert = bouton.getAttribute('aria-expanded') === 'true';
        bouton.setAttribute('aria-expanded', String(!estOuvert));
        dd.dataset.open = String(!estOuvert);
      });
    });
  }

  /* ------------------------------------------------------------
     4. SÉLECTION DE PRODUITS
     Gère l'ajout/retrait des produits, met à jour la puce
     récapitulative affichée dans le formulaire, et alimente
     le message final envoyé sur WhatsApp.
     ------------------------------------------------------------ */
  const produitsSelectionnes = new Map();

  function lireProduitsDuDOM() {
    return qsa('#produits > ul > li > article').map((article) => {
      const titre = qs('h3', article);
      const prixEl = qs('p > data', article);
      const bouton = qs('button', article);
      const id = titre ? titre.id.replace('-titre', '') : null;
      const nom = titre ? titre.textContent.replace(/^[^\p{L}\d]+\s*/u, '').trim() : '';
      const prix = prixEl ? prixEl.textContent.trim() : '';
      if (bouton && id) bouton.dataset.produitId = id;
      return { id, nom, prix, bouton };
    }).filter((p) => p.id);
  }

  function mettreAJourBouton(bouton, estSelectionne) {
    if (!bouton) return;
    bouton.setAttribute('aria-pressed', String(estSelectionne));
    bouton.textContent = estSelectionne ? 'Ajouté ✓' : 'Ajouter';
  }

  function rendreListeSelection() {
    const conteneur = qs('#liste-produits-selectionnes');
    if (!conteneur) return;
    conteneur.innerHTML = '';

    if (produitsSelectionnes.size === 0) {
      const message = document.createElement('li');
      message.className = 'liste-vide-message';
      message.textContent = 'Aucun produit ajouté pour le moment.';
      conteneur.appendChild(message);
      return;
    }

    produitsSelectionnes.forEach((produit, id) => {
      const item = document.createElement('li');
      const puce = document.createElement('span');
      puce.className = 'chip-produit';

      const texte = document.createElement('span');
      texte.textContent = produit.nom;

      const retirer = document.createElement('button');
      retirer.type = 'button';
      retirer.setAttribute('aria-label', `Retirer ${produit.nom} de la sélection`);
      retirer.textContent = '×';
      retirer.addEventListener('click', () => basculerProduit(id));

      puce.appendChild(texte);
      puce.appendChild(retirer);
      item.appendChild(puce);
      conteneur.appendChild(item);
    });
  }

  function basculerProduit(id) {
    const produits = lireProduitsDuDOM();
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;

    if (produitsSelectionnes.has(id)) {
      produitsSelectionnes.delete(id);
      mettreAJourBouton(produit.bouton, false);
    } else {
      produitsSelectionnes.set(id, { nom: produit.nom, prix: produit.prix });
      mettreAJourBouton(produit.bouton, true);
    }
    rendreListeSelection();
    effacerErreur('produits');
  }

  function initSelectionProduits() {
    const section = qs('#produits');
    if (!section) return;

    lireProduitsDuDOM().forEach((produit) => {
      if (produit.bouton) produit.bouton.setAttribute('aria-pressed', 'false');
    });

    // Délégation d'évènement : un seul écouteur pour tous les boutons "Ajouter"
    section.addEventListener('click', (evenement) => {
      const bouton = evenement.target.closest('button[data-produit-id]');
      if (!bouton) return;
      basculerProduit(bouton.dataset.produitId);
    });

    rendreListeSelection();
  }

  /* ------------------------------------------------------------
     5. FORMULAIRE — VALIDATION ET ENVOI SUR WHATSAPP
     ------------------------------------------------------------ */
  function afficherErreur(nomChamp, message) {
    effacerErreur(nomChamp);
    const champ = qs(`[name="${nomChamp}"]`) || qs(`#${nomChamp}`);
    const conteneur = champ ? champ.closest('p, fieldset') : null;
    if (!conteneur) return;

    const erreur = document.createElement('p');
    erreur.className = 'message-erreur';
    erreur.dataset.erreurPour = nomChamp;
    erreur.textContent = message;
    conteneur.appendChild(erreur);

    if (champ) {
      champ.classList.add('champ-erreur');
      champ.setAttribute('aria-invalid', 'true');
    }
  }

  function effacerErreur(nomChamp) {
    const existante = qs(`[data-erreur-pour="${nomChamp}"]`);
    if (existante) existante.remove();
    const champ = qs(`[name="${nomChamp}"]`) || qs(`#${nomChamp}`);
    if (champ) {
      champ.classList.remove('champ-erreur');
      champ.removeAttribute('aria-invalid');
    }
  }

  function effacerToutesLesErreurs(formulaire) {
    qsa('.message-erreur', formulaire).forEach((el) => el.remove());
    qsa('.champ-erreur', formulaire).forEach((el) => el.classList.remove('champ-erreur'));
    qsa('[aria-invalid]', formulaire).forEach((el) => el.removeAttribute('aria-invalid'));
  }

  function valeurRadioChoisie(nomGroupe) {
    const coche = qs(`input[name="${nomGroupe}"]:checked`);
    return coche ? coche.value : null;
  }

  function telephoneValide(valeur) {
    const nettoye = valeur.replace(/[\s.-]/g, '');
    return /^\+?\d{8,15}$/.test(nettoye);
  }

  function validerFormulaire(formulaire) {
    effacerToutesLesErreurs(formulaire);
    let premierChampInvalide = null;
    let estValide = true;

    function signaler(nomChamp, message, champFocus) {
      afficherErreur(nomChamp, message);
      estValide = false;
      if (!premierChampInvalide) premierChampInvalide = champFocus;
    }

    if (produitsSelectionnes.size === 0) {
      signaler('produits', 'Veuillez ajouter au moins un produit avant d’envoyer votre demande.', qs('#produits'));
    }
    if (!valeurRadioChoisie('type-peau')) {
      signaler('type-peau', 'Veuillez indiquer votre type de peau.', qs('#peau-normale'));
    }
    if (!valeurRadioChoisie('besoin-principal')) {
      signaler('besoin-principal', 'Veuillez indiquer votre besoin principal.', qs('#besoin-hydrater'));
    }
    if (!valeurRadioChoisie('duree-besoin')) {
      signaler('duree-besoin', 'Veuillez préciser depuis quand vous avez ce besoin.', qs('#duree-jours'));
    }

    const ville = qs('#ville');
    if (!ville.value.trim()) {
      signaler('ville', 'Merci d’indiquer votre ville.', ville);
    }

    const nom = qs('#nom');
    if (!nom.value.trim()) {
      signaler('nom', 'Merci d’indiquer votre nom.', nom);
    }

    const telephone = qs('#telephone');
    if (!telephone.value.trim()) {
      signaler('telephone', 'Merci d’indiquer votre numéro de téléphone.', telephone);
    } else if (!telephoneValide(telephone.value)) {
      signaler('telephone', 'Ce numéro ne semble pas valide (8 à 15 chiffres).', telephone);
    }

    const email = qs('#email');
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      signaler('email', 'Cette adresse e-mail ne semble pas valide.', email);
    }

    if (premierChampInvalide) {
      premierChampInvalide.scrollIntoView({ behavior: reduitMouvement ? 'auto' : 'smooth', block: 'center' });
      if (typeof premierChampInvalide.focus === 'function') premierChampInvalide.focus();
    }

    return estValide;
  }

  function construireMessageWhatsApp(formulaire) {
    const lignes = [];
    lignes.push('Bonjour Havenixci, je souhaite passer une commande :');
    lignes.push('');

    lignes.push('Produits souhaités :');
    produitsSelectionnes.forEach((produit) => {
      lignes.push(`- ${produit.nom}${produit.prix && produit.prix !== '—' ? ` (${produit.prix})` : ''}`);
    });
    lignes.push('');

    lignes.push(`Type de peau : ${valeurRadioChoisie('type-peau') || '—'}`);
    lignes.push(`Besoin principal : ${valeurRadioChoisie('besoin-principal') || '—'}`);
    lignes.push(`Depuis quand : ${valeurRadioChoisie('duree-besoin') || '—'}`);
    lignes.push(`Ville : ${qs('#ville').value.trim()}`);
    lignes.push(`Nom : ${qs('#nom').value.trim()}`);
    lignes.push(`Téléphone : ${qs('#telephone').value.trim()}`);

    const email = qs('#email').value.trim();
    if (email) lignes.push(`E-mail : ${email}`);

    const infos = qs('#informations-complementaires').value.trim();
    if (infos) {
      lignes.push('');
      lignes.push(`Informations complémentaires : ${infos}`);
    }

    return lignes.join('\n');
  }

  function afficherMessageEtat(formulaire, type, texte) {
    const existant = qs('.message-etat-envoi', formulaire);
    if (existant) existant.remove();

    const message = document.createElement('p');
    message.className = 'message-etat-envoi';
    message.dataset.type = type;
    message.setAttribute('role', 'status');
    message.textContent = texte;
    formulaire.appendChild(message);
  }

  function initFormulaire() {
    const formulaire = qs('#formulaire > form');
    if (!formulaire) return;

    // Retire l'erreur d'un champ dès que l'utilisateur le corrige
    formulaire.addEventListener('input', (evenement) => {
      const champ = evenement.target;
      if (champ.name) effacerErreur(champ.name);
      if (champ.id) effacerErreur(champ.id);
    });

    formulaire.addEventListener('submit', (evenement) => {
      evenement.preventDefault();

      if (!validerFormulaire(formulaire)) {
        afficherMessageEtat(formulaire, 'erreur', 'Merci de corriger les champs indiqués avant d’envoyer votre demande.');
        return;
      }

      const message = construireMessageWhatsApp(formulaire);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      afficherMessageEtat(formulaire, 'succes', 'Votre demande est prête : ouverture de WhatsApp…');
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ------------------------------------------------------------
     6. APPARITIONS AU DÉFILEMENT
     Un seul IntersectionObserver pour toute la page : léger et
     performant, plutôt qu'un écouteur de scroll classique.
     ------------------------------------------------------------ */
  function initApparitions() {
    if (reduitMouvement) return;

    const cibles = [
      { selecteur: '#qui-sommes-nous > p', groupe: false },
      { selecteur: '#categories > ul', groupe: true },
      { selecteur: '#pourquoi-nous > ul > li', groupe: false },
      { selecteur: '#comment-commander > ol > li', groupe: false },
      { selecteur: '#produits > ul', groupe: true },
      { selecteur: '#faq > dl > div', groupe: false },
      { selecteur: '#formulaire > form', groupe: false },
    ];

    const elements = [];
    cibles.forEach(({ selecteur, groupe }) => {
      qsa(selecteur).forEach((el) => {
        el.setAttribute('data-reveal', '');
        if (groupe) el.setAttribute('data-reveal-group', '');
        elements.push(el);
      });
    });

    if (!('IntersectionObserver' in window) || elements.length === 0) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observateur = new IntersectionObserver((entrees, obs) => {
      entrees.forEach((entree) => {
        if (entree.isIntersecting) {
          entree.target.classList.add('is-visible');
          obs.unobserve(entree.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((el) => observateur.observe(el));
  }

  /* ------------------------------------------------------------
     7. INITIALISATION
     ------------------------------------------------------------ */
  function initialiser() {
    initNavigationMobile();
    initFAQ();
    initSelectionProduits();
    initFormulaire();
    initApparitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiser);
  } else {
    initialiser();
  }
})();