/* =================================================================
   AYOH LUXURY BOUAKÉ — app.js
   Comportement du site : menu, carrousel, filtrage, panier, WhatsApp
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initCarousel();
  initServicesCarousel();
  initFeaturedProducts();
  initCart();
  if (document.querySelector(".product-list")) {
    initCataloguePage();
  }
});

/* -----------------------------------------------------------------
   1. MENU HAMBURGER
   ----------------------------------------------------------------- */
function initMenu() {
  const btn = document.querySelector(".hamburger-btn");
  const nav = document.getElementById("main-menu");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
    nav.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Sous-menus en accordéon
  nav.querySelectorAll(".submenu-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      // referme les autres sous-menus ouverts
      nav.querySelectorAll(".submenu-toggle").forEach((other) => {
        if (other !== toggle) other.setAttribute("aria-expanded", "false");
      });

      toggle.setAttribute("aria-expanded", String(!isExpanded));
    });
  });

  // Ferme le menu si on clique sur un lien
  nav.querySelectorAll(".menu-item > a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      nav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  });
}

/* -----------------------------------------------------------------
   2. CARROUSEL (page d'accueil, affiches promotionnelles)
   ----------------------------------------------------------------- */
function initCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
  const prevBtn = carousel.querySelector(".carousel-arrow--prev");
  const nextBtn = carousel.querySelector(".carousel-arrow--next");

  let current = slides.findIndex((s) => s.classList.contains("is-active"));
  if (current < 0) current = 0;

  let autoTimer = null;
  let resumeTimer = null;
  const AUTO_DELAY = 5000;
  const RESUME_DELAY = 8000;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current] && dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current] && dots[current].classList.add("is-active");
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_DELAY);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  // Dès qu'on touche/clique une image : on arrête le défilement auto
  function pauseOnInteraction() {
    stopAuto();
    if (resumeTimer) clearTimeout(resumeTimer);
    // reprend après un temps d'inactivité
    resumeTimer = setTimeout(startAuto, RESUME_DELAY);
  }

  slides.forEach((slide) => slide.addEventListener("click", pauseOnInteraction));
  nextBtn && nextBtn.addEventListener("click", () => { next(); pauseOnInteraction(); });
  prevBtn && prevBtn.addEventListener("click", () => { prev(); pauseOnInteraction(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); pauseOnInteraction(); }));

  // Reprend le défilement quand on quitte la zone du carrousel en scrollant
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(carousel);

  startAuto();
}

/* -----------------------------------------------------------------
   2bis. CARROUSEL DES SERVICES / PRESTATIONS (page d'accueil)
   Placé au-dessus de la section "Où nous trouver". 3 images que la
   personne peut faire défiler au doigt (glissement horizontal),
   chaque image affiche son texte (prestation + tarif) juste en
   dessous. Avance automatiquement toutes les 5 secondes, se met en
   pause dès que la personne touche/glisse, et reprend après un temps
   d'inactivité — même logique que le bandeau des produits vedettes.
   ----------------------------------------------------------------- */
function initServicesCarousel() {
  const track = document.querySelector(".services-carousel-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".services-slide"));
  const dots = Array.from(document.querySelectorAll(".services-dot"));
  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;
  let resumeTimer = null;
  const AUTO_DELAY = 5000;
  const RESUME_DELAY = 8000;

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
  }

  function scrollToSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
    updateDots();
  }

  function next() { scrollToSlide(current + 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_DELAY);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  // La personne pose le doigt / glisse manuellement : on arrête l'auto-défilement
  function pauseOnInteraction() {
    stopAuto();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, RESUME_DELAY);
  }
  ["touchstart", "pointerdown", "wheel"].forEach((evt) => {
    track.addEventListener(evt, pauseOnInteraction, { passive: true });
  });

  // Garde en mémoire l'image la plus visible après un glissement manuel
  let scrollEndTimer = null;
  track.addEventListener(
    "scroll",
    () => {
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        let closestIndex = 0;
        let closestDistance = Infinity;
        slides.forEach((slide, i) => {
          const distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });
        current = closestIndex;
        updateDots();
      }, 120);
    },
    { passive: true }
  );

  dots.forEach((dot, i) => dot.addEventListener("click", () => { scrollToSlide(i); pauseOnInteraction(); }));

  // Ne défile automatiquement que lorsque le bandeau est visible à l'écran
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(track);

  startAuto();
}

/* -----------------------------------------------------------------
   2ter. PRODUITS VEDETTES (page d'accueil, bandeau des 5 gammes)
   Défilement horizontal (la personne peut scroller/glisser),
   avance automatiquement toutes les 5 secondes, se met en pause
   dès que la personne touche/scrolle, et reprend après un temps
   d'inactivité — même logique que le carrousel d'affiches.
   ----------------------------------------------------------------- */
function initFeaturedProducts() {
  const track = document.querySelector(".featured-products-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".featured-product-slide"));
  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;
  let resumeTimer = null;
  const AUTO_DELAY = 5000;
  const RESUME_DELAY = 8000;

  function scrollToSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
  }

  function next() { scrollToSlide(current + 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_DELAY);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  // La personne pose le doigt / scrolle manuellement : on arrête l'auto-défilement
  function pauseOnInteraction() {
    stopAuto();
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, RESUME_DELAY);
  }
  ["touchstart", "pointerdown", "wheel"].forEach((evt) => {
    track.addEventListener(evt, pauseOnInteraction, { passive: true });
  });

  // Garde en mémoire la diapositive la plus visible après un scroll manuel
  let scrollEndTimer = null;
  track.addEventListener(
    "scroll",
    () => {
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        let closestIndex = 0;
        let closestDistance = Infinity;
        slides.forEach((slide, i) => {
          const distance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });
        current = closestIndex;
      }, 120);
    },
    { passive: true }
  );

  // Ne défile automatiquement que lorsque le bandeau est visible à l'écran
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAuto();
        else stopAuto();
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(track);

  startAuto();
}

/* -----------------------------------------------------------------
   3. PANIER (partagé entre toutes les pages via localStorage)
   ----------------------------------------------------------------- */
const CART_KEY = "ayoh_cart";
const WHATSAPP_NUMBER = "2250767647409"; // 07 67 64 74 09, indicatif Côte d'Ivoire +225

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBar();
}

function setQty(productId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  saveCart(cart);
  syncQtyDisplays(productId, qty);
}

function getQty(productId) {
  return getCart()[productId] || 0;
}

function syncQtyDisplays(productId, qty) {
  // Met à jour tous les compteurs affichés pour ce produit (carte + fiche détail)
  document
    .querySelectorAll(`[data-product-id="${productId}"] .qty-value`)
    .forEach((el) => (el.textContent = qty));

  const overlay = document.querySelector(".product-detail-overlay");
  if (overlay && overlay.dataset.currentProduct === productId) {
    const val = overlay.querySelector(".qty-value");
    if (val) val.textContent = qty;
  }
}

function formatPrice(amount) {
  return amount.toLocaleString("fr-FR").replace(/\u202F|,/g, " ") + " FCFA";
}

function updateCartBar() {
  const cart = getCart();
  const items = Object.entries(cart);
  const totalCount = items.reduce((sum, [, qty]) => sum + qty, 0);
  const totalAmount = items.reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);

  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = totalCount <= 1 ? `${totalCount} article` : `${totalCount} articles`;
  });
  document.querySelectorAll(".cart-total").forEach((el) => {
    el.textContent = formatPrice(totalAmount);
  });
  document.querySelectorAll(".cart-subtotal-amount").forEach((el) => {
    el.textContent = formatPrice(totalAmount);
  });

  renderCartItems();
}

function renderCartItems() {
  const list = document.querySelector(".cart-items");
  if (!list) return;

  const cart = getCart();
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    list.innerHTML = `<li class="cart-item-empty">Votre panier est vide.</li>`;
    return;
  }

  list.innerHTML = entries
    .map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return "";
      const imgSrc = product.image ? `produits/${product.image}` : "";
      const imageHTML = imgSrc
        ? `<img class="cart-item-image" src="${imgSrc}" alt="${product.name}" onerror="this.outerHTML='&lt;span class=&quot;cart-item-image cart-item-image--placeholder&quot; aria-hidden=&quot;true&quot;&gt;&lt;/span&gt;'">`
        : `<span class="cart-item-image cart-item-image--placeholder" aria-hidden="true"></span>`;
      return `
        <li class="cart-item" data-product-id="${product.id}">
          ${imageHTML}
          <div class="cart-item-main">
            <span class="cart-item-name">${product.name}</span>
            <span class="cart-item-qty">
              <button class="qty-btn qty-btn--minus" type="button" aria-label="Retirer un exemplaire">−</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-btn qty-btn--plus" type="button" aria-label="Ajouter un exemplaire">+</button>
            </span>
          </div>
          <span class="cart-item-price">${formatPrice(product.price * qty)}</span>
        </li>`;
    })
    .join("");

  // Boutons +/- à l'intérieur du panneau panier
  list.querySelectorAll(".cart-item").forEach((item) => {
    const id = item.dataset.productId;
    item.querySelector(".qty-btn--plus").addEventListener("click", () => setQty(id, getQty(id) + 1));
    item.querySelector(".qty-btn--minus").addEventListener("click", () => setQty(id, getQty(id) - 1));
  });
}

/* Construit le message de commande envoyé sur WhatsApp.
   Pour chaque produit, on ajoute un lien direct vers sa photo :
   WhatsApp n'accepte pas d'image intégrée dans un lien wa.me (texte
   uniquement), donc on donne un lien cliquable vers la photo du produit.
   Ainsi, même si le vendeur connaît mal le nom exact du produit,
   il peut ouvrir la photo et reconnaître l'article commandé. */
function buildWhatsAppMessage() {
  const cart = getCart();
  const entries = Object.entries(cart);
  if (entries.length === 0) return "Bonjour, je souhaite passer une commande sur Ayoh Luxury Bouaké.";

  let total = 0;
  const lines = entries.map(([id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return "";
    const lineTotal = product.price * qty;
    total += lineTotal;
    const photoLine = product.image
      ? `\n  Photo : ${new URL(`produits/${product.image}`, window.location.href).href}`
      : "";
    return `• ${product.name} x${qty} — ${formatPrice(lineTotal)}${photoLine}`;
  });

  return (
    "Bonjour, je souhaite commander :\n\n" +
    lines.join("\n\n") +
    `\n\nTotal : ${formatPrice(total)}`
  );
}

function initCart() {
  const cartBar = document.querySelector(".cart-bar");
  const cartPanel = document.querySelector(".cart-panel");
  const closeBtn = document.querySelector(".cart-panel-close");
  const checkoutBtn = document.querySelector(".cart-checkout-whatsapp");

  updateCartBar();

  if (cartBar && cartPanel) {
    const openPanel = () => {
      cartPanel.classList.add("is-open");
      cartPanel.setAttribute("aria-hidden", "false");
    };
    cartBar.addEventListener("click", openPanel);
    cartBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") openPanel();
    });
  }

  if (closeBtn && cartPanel) {
    closeBtn.addEventListener("click", () => {
      cartPanel.classList.remove("is-open");
      cartPanel.setAttribute("aria-hidden", "true");
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const message = encodeURIComponent(buildWhatsAppMessage());
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    });
  }
}

/* -----------------------------------------------------------------
   4. PAGE CATALOGUE : filtrage + rendu des cartes + fiche détail
   ----------------------------------------------------------------- */
function initCataloguePage() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");     // "gamme" ou "categorie"
  const valeur = params.get("valeur"); // ex. "hoyibo-cacao"

  const titleEl = document.querySelector(".catalogue-title");
  const descEl = document.querySelector(".catalogue-description");
  const listEl = document.querySelector(".product-list");

  let filtered = [];
  let omittedNames = [];

  if (type === "gamme" && valeur) {
    filtered = PRODUCTS.filter((p) => p.gammeSlug === valeur && p.hasCard);
    omittedNames = PRODUCTS.filter((p) => p.gammeSlug === valeur && !p.hasCard).map((p) => p.name);
    const info = GAMME_INFO[valeur];
    if (titleEl) titleEl.textContent = info ? info.title : "Gamme";
    if (descEl) {
      let text = info ? info.intro : "";
      if (omittedNames.length) {
        text += ` Cette gamme comprend également : ${omittedNames.join(", ")} (bientôt disponible en fiche produit).`;
      }
      descEl.textContent = text;
    }
  } else if (type === "categorie" && valeur) {
    filtered = PRODUCTS.filter((p) => p.categorieSlug === valeur && p.hasCard);
    if (titleEl) titleEl.textContent = CATEGORIE_TITLES[valeur] || "Catégorie";
    if (descEl) descEl.textContent = `Tous nos produits ${(CATEGORIE_TITLES[valeur] || "").toLowerCase()}, toutes gammes confondues.`;
  } else {
    filtered = PRODUCTS.filter((p) => p.hasCard);
    if (titleEl) titleEl.textContent = "Tous nos produits";
    if (descEl) descEl.textContent = "";
  }

  if (listEl) renderProductList(listEl, filtered);
  initProductDetailOverlay();
}

function renderProductList(container, products) {
  container.innerHTML = products.map(productCardHTML).join("");

  // Boutons +/- sur les cartes
  container.querySelectorAll(".product-card").forEach((card) => {
    const id = card.dataset.productId;
    const qty = getQty(id);
    const qtyVal = card.querySelector(".qty-value");
    if (qtyVal) qtyVal.textContent = qty;

    card.querySelector(".qty-btn--plus").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setQty(id, getQty(id) + 1);
    });
    card.querySelector(".qty-btn--minus").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setQty(id, getQty(id) - 1);
    });

    // Bloc rétractable "Voir la description"
    const expandToggle = card.querySelector(".expand-toggle");
    const expandContent = card.querySelector(".expand-content");
    expandToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = expandToggle.getAttribute("aria-expanded") === "true";
      expandToggle.setAttribute("aria-expanded", String(!isOpen));
      expandContent.hidden = isOpen;
    });

    // Clic sur la carte (hors boutons et bloc rétractable) → fiche détail
    const link = card.querySelector(".product-card-link");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openProductDetail(id);
    });
  });
}

function productCardHTML(product) {
  const ingredientsHTML = product.ingredients
    ? `<p class="product-ingredients"><strong>Ingrédients :</strong> ${product.ingredients}</p>`
    : "";
  const imgSrc = product.image ? `produits/${product.image}` : "";

  return `
    <li class="product-card" data-product-id="${product.id}">
      <a class="product-card-link" href="#" aria-label="Voir le détail de ${product.name}">
        <figure class="product-card-photo">
          <img src="${imgSrc}" alt="${product.name}" onerror="this.closest('.product-card-photo').classList.add('img-missing'); this.remove();">
        </figure>
        <p class="product-card-name">${product.name}</p>
        <p class="product-card-price">${formatPrice(product.price)}</p>
      </a>

      <div class="product-card-qty">
        <button class="qty-btn qty-btn--minus" type="button" aria-label="Retirer un exemplaire du panier">−</button>
        <span class="qty-value">0</span>
        <button class="qty-btn qty-btn--plus" type="button" aria-label="Ajouter un exemplaire du panier">+</button>
      </div>

      <div class="product-card-expand">
        <button class="expand-toggle" type="button" aria-expanded="false" aria-controls="desc-${product.id}">
          Voir la description <span class="expand-icon" aria-hidden="true">▾</span>
        </button>
        <div class="expand-content" id="desc-${product.id}" hidden>
          <p class="product-description">${product.description}</p>
          ${ingredientsHTML}
        </div>
      </div>
    </li>`;
}

/* -----------------------------------------------------------------
   5. FICHE DÉTAIL PRODUIT (overlay)
   ----------------------------------------------------------------- */
function initProductDetailOverlay() {
  const overlay = document.querySelector(".product-detail-overlay");
  if (!overlay) return;

  const closeBtn = overlay.querySelector(".product-detail-close");
  closeBtn.addEventListener("click", closeProductDetail);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeProductDetail();
  });
}

function openProductDetail(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const overlay = document.querySelector(".product-detail-overlay");
  if (!product || !overlay) return;

  overlay.dataset.currentProduct = productId;
  overlay.querySelector(".product-detail-name").textContent = product.name;
  overlay.querySelector(".product-detail-description").textContent = product.description;
  overlay.querySelector(".product-detail-price").textContent = formatPrice(product.price);

  const img = overlay.querySelector(".product-detail-photo img");
  img.src = product.image ? `produits/${product.image}` : "";
  img.alt = product.name;

  const ingredientsEl = overlay.querySelector(".product-detail-ingredients");
  if (product.ingredients) {
    ingredientsEl.hidden = false;
    ingredientsEl.innerHTML = `<strong>Ingrédients :</strong> ${product.ingredients}`;
  } else {
    ingredientsEl.hidden = true;
    ingredientsEl.innerHTML = "";
  }

  const qty = getQty(productId);
  overlay.querySelector(".qty-value").textContent = qty;

  const plusBtn = overlay.querySelector(".product-detail-qty .qty-btn--plus");
  const minusBtn = overlay.querySelector(".product-detail-qty .qty-btn--minus");
  // on retire d'anciens écouteurs en clonant les boutons
  const newPlus = plusBtn.cloneNode(true);
  const newMinus = minusBtn.cloneNode(true);
  plusBtn.replaceWith(newPlus);
  minusBtn.replaceWith(newMinus);
  newPlus.addEventListener("click", () => setQty(productId, getQty(productId) + 1));
  newMinus.addEventListener("click", () => setQty(productId, getQty(productId) - 1));

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProductDetail() {
  const overlay = document.querySelector(".product-detail-overlay");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}