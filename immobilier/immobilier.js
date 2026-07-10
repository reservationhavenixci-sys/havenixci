/* =========================================================
   HAVENIXCI — script.js
   Améliore progressivement le HTML/CSS déjà fonctionnels :
   - Rien ici n'est indispensable à la lecture du contenu.
   - Si le script échoue ou est bloqué, le site reste utilisable
     (menu visible, FAQ lisible, formulaire complet et envoyable).
   ========================================================= */

(function () {
  "use strict";

  // Numéro WhatsApp de l'agence (à remplacer par le numéro réel, format international sans "+" ni espaces)
  const NUMERO_WHATSAPP = "2250000000000";

  const prefereMouvementReduit = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.addEventListener("DOMContentLoaded", () => {
    initNavigationMobile();
    initDefilementActif();
    initApparitionAuDefilement();
    initFaqAccordeon();
    initAssistantFormulaire();
  });

  /* -----------------------------------------------------
     1. NAVIGATION — menu mobile (complète le CSS existant)
     ----------------------------------------------------- */
  function initNavigationMobile() {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.querySelector("header nav");
    if (!toggle || !nav) return;

    const liens = nav.querySelectorAll("ul a");

    // Ferme le menu après un clic sur un lien (navigation vers une ancre)
    liens.forEach((lien) => {
      lien.addEventListener("click", () => {
        toggle.checked = false;
      });
    });

    // Ferme le menu avec la touche Échap et rend le focus au bouton
    document.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape" && toggle.checked) {
        toggle.checked = false;
        const label = document.querySelector(".menu-toggle-label");
        if (label) label.focus();
      }
    });

    // Ferme le menu si on clique en dehors de la navigation
    document.addEventListener("click", (evt) => {
      if (toggle.checked && !nav.contains(evt.target)) {
        toggle.checked = false;
      }
    });
  }

  /* -----------------------------------------------------
     2. INTERACTIONS — lien de menu actif pendant le défilement
     ----------------------------------------------------- */
  function initDefilementActif() {
    const liens = document.querySelectorAll('nav ul li a[href^="#"]');
    if (!liens.length || !("IntersectionObserver" in window)) return;

    const correspondance = new Map();
    liens.forEach((lien) => {
      const cible = document.querySelector(lien.getAttribute("href"));
      if (cible) correspondance.set(cible, lien);
    });

    const observateur = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree) => {
          const lien = correspondance.get(entree.target);
          if (!lien) return;
          if (entree.isIntersecting) {
            liens.forEach((l) => l.classList.remove("actif"));
            lien.classList.add("actif");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    correspondance.forEach((_, section) => observateur.observe(section));
  }

  /* -----------------------------------------------------
     3. ANIMATIONS — apparition discrète des sections au défilement
     ----------------------------------------------------- */
  function initApparitionAuDefilement() {
    const cibles = document.querySelectorAll(
      "section:not(#hero) .container > *, .carte, .faq-item, .etape"
    );
    if (!cibles.length) return;

    if (prefereMouvementReduit || !("IntersectionObserver" in window)) {
      cibles.forEach((el) => el.classList.add("visible"));
      return;
    }

    cibles.forEach((el) => el.classList.add("reveal"));

    const observateur = new IntersectionObserver(
      (entrees, obs) => {
        entrees.forEach((entree) => {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            obs.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    cibles.forEach((el) => observateur.observe(el));
  }

  /* -----------------------------------------------------
     4. FAQ — transformation en accordéon accessible
     ----------------------------------------------------- */
  function initFaqAccordeon() {
    const items = document.querySelectorAll("#faq .faq-item");
    if (!items.length) return;

    items.forEach((item, index) => {
      const question = item.querySelector("dt");
      const reponse = item.querySelector("dd");
      if (!question || !reponse) return;

      const idReponse = `faq-reponse-${index}`;
      const idQuestion = `faq-question-${index}`;

      const bouton = document.createElement("button");
      bouton.type = "button";
      bouton.className = "faq-toggle";
      bouton.id = idQuestion;
      bouton.setAttribute("aria-expanded", "false");
      bouton.setAttribute("aria-controls", idReponse);
      bouton.innerHTML =
        `<span>${question.textContent.trim()}</span>` +
        `<span class="faq-icone" aria-hidden="true">+</span>`;

      question.textContent = "";
      question.appendChild(bouton);

      reponse.id = idReponse;
      reponse.setAttribute("role", "region");
      reponse.setAttribute("aria-labelledby", idQuestion);
      reponse.hidden = true;

      bouton.addEventListener("click", () => {
        const estOuvert = bouton.getAttribute("aria-expanded") === "true";

        // Ferme les autres questions (un seul panneau ouvert à la fois)
        items.forEach((autre) => {
          if (autre === item) return;
          const autreBouton = autre.querySelector(".faq-toggle");
          const autreReponse = autre.querySelector("dd");
          if (autreBouton && autreReponse) {
            autreBouton.setAttribute("aria-expanded", "false");
            autreReponse.hidden = true;
          }
        });

        bouton.setAttribute("aria-expanded", String(!estOuvert));
        reponse.hidden = estOuvert;
      });
    });
  }

  /* -----------------------------------------------------
     5. FORMULAIRE INTELLIGENT — assistant multi-étapes + validation + WhatsApp
     ----------------------------------------------------- */
  function initAssistantFormulaire() {
    const form = document.getElementById("formulaire-intelligent");
    if (!form) return;

    // Regroupement des champs existants en étapes logiques,
    // sans rien retirer du HTML : si le JS est bloqué, tout reste visible.
    const fieldsets = form.querySelectorAll("fieldset");
    const champVille = form.querySelector("#ville")?.closest(".champ");
    const champNom = form.querySelector('[for="nom"]')?.closest(".champ");
    const champTelephone = form.querySelector('[for="telephone"]')?.closest(".champ");
    const champEmail = form.querySelector('[for="email"]')?.closest(".champ");
    const champBesoin = form.querySelector('[for="besoin"]')?.closest(".champ");
    const champEnvoi = form.querySelector(".champ-envoi");

    const etapes = [
      { titre: "Votre projet", elements: [fieldsets[0]].filter(Boolean) },
      { titre: "La ville recherchée", elements: [champVille].filter(Boolean) },
      { titre: "Votre budget", elements: [fieldsets[1]].filter(Boolean) },
      { titre: "Votre échéance", elements: [fieldsets[2]].filter(Boolean) },
      { titre: "Vos coordonnées", elements: [champNom, champTelephone, champEmail].filter(Boolean) },
      { titre: "Votre besoin", elements: [champBesoin].filter(Boolean) },
      { titre: "Envoyer la demande", elements: [champEnvoi].filter(Boolean) },
    ].filter((etape) => etape.elements.length > 0);

    // Si la structure attendue n'est pas trouvée, on abandonne l'amélioration
    // et on laisse le formulaire fonctionner tel quel (dégradation silencieuse).
    const totalElementsAttendus = etapes.reduce((n, e) => n + e.elements.length, 0);
    if (totalElementsAttendus < 5) return;

    // Enveloppe chaque étape dans un conteneur dédié pour pouvoir l'afficher/masquer
    const conteneurs = etapes.map((etape, index) => {
      const conteneur = document.createElement("div");
      conteneur.className = "etape-form";
      conteneur.dataset.etapeIndex = String(index);
      etape.elements[0].parentNode.insertBefore(conteneur, etape.elements[0]);
      etape.elements.forEach((el) => conteneur.appendChild(el));
      return conteneur;
    });

    form.dataset.mode = "assistant";
    form.setAttribute("novalidate", "novalidate");

    // Barre de progression + zone d'annonce pour lecteurs d'écran
    const progression = document.createElement("div");
    progression.className = "assistant-progression";
    progression.innerHTML =
      '<div class="assistant-barre"><div class="assistant-barre-remplissage"></div></div>' +
      '<span class="assistant-etape-texte"></span>';
    form.insertBefore(progression, conteneurs[0]);

    const annonce = document.createElement("p");
    annonce.className = "sr-only";
    annonce.setAttribute("role", "status");
    annonce.setAttribute("aria-live", "polite");
    form.appendChild(annonce);

    // Boutons Précédent / Suivant sur chaque étape (sauf la dernière : bouton d'envoi déjà présent)
    conteneurs.forEach((conteneur, index) => {
      if (index === conteneurs.length - 1) return; // dernière étape = bouton d'envoi natif

      const nav = document.createElement("div");
      nav.className = "etape-navigation";

      const boutonPrecedent = document.createElement("button");
      boutonPrecedent.type = "button";
      boutonPrecedent.className = "bouton-navigation";
      boutonPrecedent.textContent = "Précédent";
      boutonPrecedent.disabled = index === 0;
      boutonPrecedent.addEventListener("click", () => allerA(index - 1));

      const boutonSuivant = document.createElement("button");
      boutonSuivant.type = "button";
      boutonSuivant.className = "bouton-navigation bouton-navigation-suivant";
      boutonSuivant.textContent = "Suivant";
      boutonSuivant.addEventListener("click", () => {
        if (validerEtape(conteneur)) allerA(index + 1);
      });

      nav.appendChild(boutonPrecedent);
      nav.appendChild(boutonSuivant);
      conteneur.appendChild(nav);
    });

    // Ajoute un bouton "Précédent" avant l'envoi final
    const derniereNav = document.createElement("div");
    derniereNav.className = "etape-navigation";
    const boutonPrecedentFinal = document.createElement("button");
    boutonPrecedentFinal.type = "button";
    boutonPrecedentFinal.className = "bouton-navigation";
    boutonPrecedentFinal.textContent = "Précédent";
    boutonPrecedentFinal.addEventListener("click", () => allerA(conteneurs.length - 2));
    derniereNav.appendChild(boutonPrecedentFinal);
    conteneurs[conteneurs.length - 1].insertBefore(
      derniereNav,
      conteneurs[conteneurs.length - 1].firstChild
    );

    let etapeActuelle = 0;
    afficherEtape(0);

    function afficherEtape(index) {
      conteneurs.forEach((conteneur, i) => {
        conteneur.hidden = i !== index;
      });
      etapeActuelle = index;

      const pourcentage = ((index + 1) / conteneurs.length) * 100;
      progression.querySelector(".assistant-barre-remplissage").style.width = pourcentage + "%";
      progression.querySelector(".assistant-etape-texte").textContent =
        `Étape ${index + 1} / ${conteneurs.length}`;
      annonce.textContent = `Étape ${index + 1} sur ${conteneurs.length} : ${etapes[index].titre}`;

      // Replace le focus sur le premier champ interactif de l'étape, pour les utilisateurs de clavier
      const premierChamp = conteneurs[index].querySelector(
        "input, textarea, button.bouton-navigation-suivant"
      );
      if (premierChamp && !prefereMouvementReduit) {
        premierChamp.focus({ preventScroll: true });
      }

      conteneurs[index].scrollIntoView({
        behavior: prefereMouvementReduit ? "auto" : "smooth",
        block: "center",
      });
    }

    function allerA(index) {
      if (index < 0 || index >= conteneurs.length) return;
      afficherEtape(index);
    }

    function validerEtape(conteneur) {
      const champsRequis = conteneur.querySelectorAll("input[required], textarea[required]");
      let valide = true;

      // Cas des groupes de boutons radio : un seul message d'erreur pour le groupe
      const groupesRadio = new Set();
      champsRequis.forEach((champ) => {
        if (champ.type === "radio") groupesRadio.add(champ.name);
      });

      groupesRadio.forEach((nom) => {
        const options = conteneur.querySelectorAll(`input[name="${nom}"]`);
        const coche = Array.from(options).some((o) => o.checked);
        const fieldset = options[0]?.closest("fieldset");
        afficherErreurGroupe(fieldset, coche ? null : "Merci de sélectionner une option.");
        if (!coche) valide = false;
      });

      champsRequis.forEach((champ) => {
        if (champ.type === "radio") return;
        const champParent = champ.closest(".champ");
        if (!champ.checkValidity()) {
          valide = false;
          afficherErreurChamp(champParent, messageErreur(champ));
        } else {
          afficherErreurChamp(champParent, null);
        }
      });

      return valide;
    }

    function messageErreur(champ) {
      if (champ.validity.valueMissing) return "Ce champ est requis.";
      if (champ.validity.typeMismatch && champ.type === "email") return "Adresse e-mail non valide.";
      return "Merci de vérifier cette information.";
    }

    function afficherErreurChamp(champParent, message) {
      if (!champParent) return;
      let erreur = champParent.querySelector(".champ-erreur");
      if (message) {
        champParent.classList.add("invalide");
        if (!erreur) {
          erreur = document.createElement("p");
          erreur.className = "champ-erreur";
          champParent.appendChild(erreur);
        }
        erreur.textContent = message;
      } else {
        champParent.classList.remove("invalide");
        if (erreur) erreur.remove();
      }
    }

    function afficherErreurGroupe(fieldset, message) {
      if (!fieldset) return;
      let erreur = fieldset.querySelector(".champ-erreur");
      if (message) {
        if (!erreur) {
          erreur = document.createElement("p");
          erreur.className = "champ-erreur";
          fieldset.appendChild(erreur);
        }
        erreur.textContent = message;
      } else if (erreur) {
        erreur.remove();
      }
    }

    // Validation + construction du message WhatsApp à l'envoi final
    form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      const derniereEtape = conteneurs[conteneurs.length - 1];
      // On revalide toutes les étapes avant envoi (au cas où l'utilisateur aurait navigué librement)
      let toutValide = true;
      let premiereEtapeInvalide = null;
      conteneurs.slice(0, -1).forEach((conteneur, index) => {
        if (!validerEtape(conteneur)) {
          toutValide = false;
          if (premiereEtapeInvalide === null) premiereEtapeInvalide = index;
        }
      });

      if (!toutValide) {
        allerA(premiereEtapeInvalide);
        return;
      }

      const donnees = new FormData(form);
      const lire = (cle) => (donnees.get(cle) || "").toString().trim();

      const libellesProjet = {
        "acheter-terrain": "Acheter un terrain",
        "acheter-maison": "Acheter une maison",
        "louer-maison": "Louer une maison",
        "louer-appartement": "Louer un appartement",
        "vendre-bien": "Vendre un bien",
        lotissement: "Lotissement",
        "conseil-immobilier": "Conseil immobilier",
        autre: "Autre",
      };
      const libellesBudget = {
        "a-definir": "À définir",
        "moins-10m": "Moins de 10 millions",
        "10-30m": "10 à 30 millions",
        "30-60m": "30 à 60 millions",
        "plus-60m": "Plus de 60 millions",
        autre: "Autre",
      };
      const libellesDelai = {
        "des-que-possible": "Dès que possible",
        "3-mois": "Dans les 3 prochains mois",
        "6-mois": "Dans les 6 prochains mois",
        "me-renseigner": "Je souhaite simplement me renseigner",
      };

      const lignes = [
        "Nouvelle demande — Havenixci",
        "",
        `Projet : ${libellesProjet[lire("projet")] || "Non précisé"}`,
        `Ville recherchée : ${lire("ville") || "Non précisée"}`,
        `Budget : ${libellesBudget[lire("budget")] || "Non précisé"}`,
        `Échéance : ${libellesDelai[lire("delai")] || "Non précisée"}`,
        "",
        `Nom : ${lire("nom")}`,
        `Téléphone : ${lire("telephone")}`,
      ];

      if (lire("email")) lignes.push(`E-mail : ${lire("email")}`);
      if (lire("besoin")) lignes.push("", `Besoin exprimé : ${lire("besoin")}`);

      const message = encodeURIComponent(lignes.join("\n"));
      const lienWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${message}`;

      window.location.href = lienWhatsApp;
    });
  }
})();