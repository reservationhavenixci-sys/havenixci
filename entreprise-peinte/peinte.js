/* ===================================================================
   PEINTURE PRO — script.js
   Navigation · FAQ · Révélations au scroll · Formulaire → WhatsApp
   =================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     ⚠️ À CONFIGURER : numéro WhatsApp de l'entreprise
     Format international sans "+" ni espaces (ex : 2250700000000)
  --------------------------------------------------------------- */
  var WHATSAPP_NUMBER = "2250700000000";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.addEventListener("DOMContentLoaded", function () {
    initHeaderScroll();
    initMobileNav();
    initActiveNavLink();
    initFaqAccordion();
    initScrollReveal();
    initQuoteForm();
  });

  /* ----------------------- Header au défilement ----------------------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateHeader();
  }

  /* --------------------------- Menu mobile ----------------------------- */
  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function closeNav() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      nav.classList.remove("is-open");
    }

    function openNav() {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
      nav.classList.add("is-open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    // Ferme le menu après un clic sur un lien (ancre)
    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") closeNav();
    });

    // Ferme le menu si on repasse en version bureau
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960) closeNav();
    });

    // Ferme le menu avec la touche Échap
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  /* --------------------- Lien de nav actif au scroll -------------------- */
  function initActiveNavLink() {
    var links = document.querySelectorAll(".nav-list a[href^='#']");
    if (!links.length || !("IntersectionObserver" in window)) return;

    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (item) {
            return item.section === entry.target;
          });
          if (!match) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-active"); });
            match.link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (item) { observer.observe(item.section); });
  }

  /* ------------------------------ FAQ ----------------------------------- */
  function initFaqAccordion() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector(".faq-toggle");
      if (!trigger) return;

      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        // Un seul volet ouvert à la fois
        items.forEach(function (other) {
          other.classList.remove("is-open");
          var otherTrigger = other.querySelector(".faq-toggle");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* -------------------------- Révélation au scroll ------------------------ */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      ".card, .timeline-step, .faq-item, .pill, .section-lead"
    );
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    targets.forEach(function (el) { el.classList.add("reveal"); });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            var delay = (index % 4) * 60;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------- Formulaire → WhatsApp -------------------------- */
  function initQuoteForm() {
    var form = document.querySelector(".quote-form");
    if (!form) return;

    var status = document.getElementById("formStatus");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(form);

      var errors = [];

      var ville = form.querySelector("#ville");
      var nom = form.querySelector("#nom");
      var telephone = form.querySelector("#telephone");
      var email = form.querySelector("#email");

      if (!ville.value.trim()) {
        errors.push({ field: ville, message: "Merci d'indiquer la ville du projet." });
      }
      if (!nom.value.trim()) {
        errors.push({ field: nom, message: "Merci d'indiquer votre nom." });
      }
      if (!telephone.value.trim()) {
        errors.push({ field: telephone, message: "Merci d'indiquer votre numéro de téléphone." });
      } else if (!isValidPhone(telephone.value)) {
        errors.push({ field: telephone, message: "Ce numéro ne semble pas valide (8 à 13 chiffres)." });
      }
      if (email.value.trim() && !isValidEmail(email.value)) {
        errors.push({ field: email, message: "Cette adresse e-mail ne semble pas valide." });
      }

      if (errors.length) {
        errors.forEach(function (error) { showFieldError(error.field, error.message); });
        setStatus(status, "Merci de corriger les champs signalés en rouge.", "is-error");
        errors[0].field.focus();
        return;
      }

      var message = buildWhatsAppMessage(form);
      var url =
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

      setStatus(status, "Votre demande est prête, ouverture de WhatsApp…", "is-success");
      window.open(url, "_blank", "noopener");
    });

    // Efface l'erreur d'un champ dès que la personne le corrige
    form.addEventListener("input", function (event) {
      var field = event.target.closest(".form-field");
      if (field) field.classList.remove("has-error");
    });
  }

  function buildWhatsAppMessage(form) {
    var getRadioValue = function (name) {
      var checked = form.querySelector("input[name='" + name + "']:checked");
      return checked ? checked.value : "Non précisé";
    };

    var lines = [
      "Nouvelle demande de devis — Peinture Pro",
      "",
      "Projet : " + getRadioValue("projet"),
      "Type de bâtiment : " + getRadioValue("batiment"),
      "Ville : " + form.querySelector("#ville").value.trim(),
      "Ampleur des travaux : " + getRadioValue("ampleur"),
      "Délai souhaité : " + getRadioValue("delai"),
      "",
      "Nom : " + form.querySelector("#nom").value.trim(),
      "Téléphone : " + form.querySelector("#telephone").value.trim(),
    ];

    var email = form.querySelector("#email").value.trim();
    if (email) lines.push("E-mail : " + email);

    var description = form.querySelector("#description").value.trim();
    if (description) lines.push("", "Description du projet :", description);

    return lines.join("\n");
  }

  function isValidPhone(value) {
    var digits = value.replace(/[\s.\-()]/g, "");
    return /^\+?\d{8,13}$/.test(digits);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function showFieldError(field, message) {
    var wrapper = field.closest(".form-field") || field.parentElement;
    wrapper.classList.add("has-error");

    var errorEl = document.createElement("span");
    errorEl.className = "field-error";
    errorEl.textContent = message;
    wrapper.appendChild(errorEl);
  }

  function clearErrors(form) {
    form.querySelectorAll(".has-error").forEach(function (el) {
      el.classList.remove("has-error");
    });
    form.querySelectorAll(".field-error").forEach(function (el) { el.remove(); });
  }

  function setStatus(statusEl, message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("is-error", "is-success");
    if (type) statusEl.classList.add(type);
  }
})();