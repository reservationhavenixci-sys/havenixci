/* =========================================================
   BLACK AND WHITE — BOUAKÉ
   script.js — configuration, données, logique du site
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURATION — à adapter par le restaurant
  --------------------------------------------------------- */
  const CONFIG = {
    // Numéro WhatsApp au format international, sans "+" ni espaces.
    whatsappNumber: "2250700000000",
    restaurantName: "Black and White",
    currency: "FCFA",
  };

  /* ---------------------------------------------------------
     ICÔNES DE CATÉGORIE (SVG inline, utilisées en filigrane
     sur les vignettes plats + dans la navigation)
  --------------------------------------------------------- */
  const ICONS = {
    entrees: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M11 2v8.5a2.5 2.5 0 01-5 0V2H4v8.5a4.5 4.5 0 004 4.47V22h2v-9.03a4.5 4.5 0 004-4.47V2h-2v8.5a2.5 2.5 0 01-1 0V2h-2zm9 0c-1.7 0-3 2-3 5s1.3 5 3 5v10h2V2h-2z"/></svg>',
    viandes: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M14.5 2c-3 0-6.5 2.4-7.8 6.6-.4 1.3-1.2 1.9-2.3 2.7C3.2 12.2 2 13.6 2 15.8 2 19 4.8 22 8.6 22c2.4 0 4-1.1 5-2.3.6.2 1.3.3 1.9.3 3.3 0 6.5-3 6.5-8.3C22 6 18.8 2 14.5 2zm-6 17c-2.5 0-4.5-1.7-4.5-3.2 0-1.1.5-1.7 1.3-2.3.8-.6 1.9-1.4 2.5-3.1.9-2.8 3-4.4 5.2-4.4-1.7 1.7-2.6 4.3-2 7 .3 1.5 1 2.6 1.8 3.4-.9.9-2.2 1.6-4.3 1.6z"/></svg>',
    africaines: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12 2a5 5 0 00-5 5c0 2 1.1 3.7 2.8 4.5C7.7 12.5 6 14.9 6 18v2h2v-2c0-3.3 1.8-5.5 4-5.9 2.2.4 4 2.6 4 5.9v2h2v-2c0-3.1-1.7-5.5-3.8-6.5C15.9 10.7 17 9 17 7a5 5 0 00-5-5zm0 2a3 3 0 013 3 3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z"/></svg>',
    pizzas: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M2 3l20 7-9 4-4 9-7-20zm9.3 8.4a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8zM8 8a1.2 1.2 0 100 2.4A1.2 1.2 0 008 8z"/></svg>',
    poisson: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M2 12s4-6 11-6c4 0 7 2.3 8.5 4.1.5.6.5 1.2 0 1.8C20 13.7 17 16 13 16c-7 0-11-4-11-4zm16.5-3.6c.6-.9 1-1.9 1-2.9 0 1.4-.6 2.7-1.6 3.7.2-.3.4-.5.6-.8zM6.5 12a1.3 1.3 0 102.6 0 1.3 1.3 0 00-2.6 0zM19 15.5c1-1 1.6-2.3 1.6-3.7 0 1-.4 2-1 2.9-.2-.3-.4-.5-.6-.8v1.6z"/></svg>',
    desserts: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12 2c-1 0-1.8.8-1.8 1.8 0 .5.2.9.5 1.2C9.2 5.5 8 6.9 8 8.5V9H6a4 4 0 00-4 4v1h20v-1a4 4 0 00-4-4h-2v-.5c0-1.6-1.2-3-2.7-3.5.3-.3.5-.7.5-1.2C13.8 2.8 13 2 12 2zM3 16v2a4 4 0 004 4h10a4 4 0 004-4v-2H3z"/></svg>',
    boissons: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M7 2l1 4h8l1-4h2l-1.4 5.6c-.3 1.1-1 1.9-2 2.3L15 22H9L8.4 9.9c-1-.4-1.7-1.2-2-2.3L5 2h2zm2.1 6h5.8l.2-.8H8.9l.2.8z"/></svg>',
    bieres: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M17 5h-1V4a2 2 0 00-2-2H8a2 2 0 00-2 2v1H5a2 2 0 00-2 2v3c0 1.9 1.3 3.4 3 3.9V21a1 1 0 001 1h8a1 1 0 001-1v-7.1c1.7-.5 3-2 3-3.9V7a2 2 0 00-2-2zM8 4h6v1H8V4zm9 6c0 1.1-.9 2-2 2v-4h2v2zM6 12c-1.1 0-2-.9-2-2V7h2v5z"/></svg>',
    vins: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M7 2v6a5 5 0 004 4.9V19H8v2h8v-2h-3v-6.1A5 5 0 0017 8V2h-2v6a3 3 0 01-6 0V2H7zm1 2h8v2H8V4z"/></svg>',
    glaces: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M12 2a5 5 0 00-5 5c0 1.6.8 3 2 3.9L12 22l3-11.1c1.2-.9 2-2.3 2-3.9a5 5 0 00-5-5zm0 2a3 3 0 013 3H9a3 3 0 013-3z"/></svg>',
    formules: '<svg viewBox="0 0 24 24" width="30" height="30"><path fill="currentColor" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/></svg>',
  };

  /* ---------------------------------------------------------
     Groupes d'options réutilisés (sauces, portions, tailles)
  --------------------------------------------------------- */
  const SAUCE_CHOICES = {
    name: "Sauce au choix", type: "single", required: true,
    choices: [
      { label: "Sauce Poivre", delta: 0 },
      { label: "Sauce Champignons", delta: 0 },
      { label: "Sauce Roquefort", delta: 0 },
      { label: "Sauce Béarnaise", delta: 0 },
    ],
  };

  function portionGroup(halfLabel, wholeLabel, wholePriceDelta) {
    return {
      name: "Portion", type: "single", required: true,
      choices: [
        { label: halfLabel, delta: 0 },
        { label: wholeLabel, delta: wholePriceDelta },
      ],
    };
  }

  /* ---------------------------------------------------------
     DONNÉES DE LA CARTE
     Carte reconstituée à partir de la carte réelle du
     restaurant (photos transmises). Certains prix illisibles
     ou variables selon arrivage sont signalés dans la
     description du plat.
     NOTE : photographies des plats à intégrer par le
     restaurant — les vignettes affichent pour l'instant une
     icône de catégorie.
  --------------------------------------------------------- */
  const MENU = [
    {
      id: "soupes", label: "Soupes", icon: "entrees",
      items: [
        { id: "sp1", name: "Soupe Parisienne (aux oignons)", desc: "", price: 4500 },
        { id: "sp2", name: "Soupe de Poisson aux Croûtons", desc: "", price: 4500 },
        { id: "sp3", name: "Soupe au Pistou", desc: "", price: 3500 },
      ],
    },
    {
      id: "salades", label: "Les Salades", icon: "entrees",
      items: [
        { id: "sal1", name: "Salade Verte ou Salade de Tomates", desc: "", price: 2500 },
        { id: "sal2", name: "Salade Mixte", desc: "", price: 3000 },
        { id: "sal3", name: "Salade Niçoise", desc: "", price: 4500 },
        { id: "sal4", name: "Salade de Gésiers Confits", desc: "", price: 3500 },
        { id: "sal5", name: "Petit Chèvre Chaud sur Salade Verte", desc: "", price: 6000 },
      ],
    },
    {
      id: "avocats", label: "Avocats & Papaye", icon: "entrees",
      items: [
        { id: "avp1", name: "Avocat Vinaigrette ou Mayonnaise", desc: "", price: 1500 },
        { id: "avp2", name: "Avocat Crevettes", desc: "", price: 3500 },
        { id: "avp3", name: "Papaye Solo au Citron Vert ou au Porto", desc: "", price: 4000 },
      ],
    },
    {
      id: "crevettes", label: "Les Crevettes", icon: "poisson",
      items: [
        { id: "cre1", name: "Cocktail de Crevettes", desc: "", price: 3500 },
        { id: "cre2", name: "Crevettes à la Provençale", desc: "", price: 3500 },
        { id: "cre3", name: "Beignets de Crevettes", desc: "", price: 3500 },
      ],
    },
    {
      id: "entreeschaudes", label: "Les Entrées Chaudes", icon: "entrees",
      items: [
        { id: "ech1", name: "Coquille de Mérou", desc: "", price: 3500 },
        { id: "ech2", name: "Nems (5 pièces)", desc: "", price: 2000 },
        { id: "ech3", name: "Boudin Antillais", desc: "", price: 4000 },
        { id: "ech4", name: "Omelette Antillaise", desc: "", price: 3000 },
        { id: "ech5", name: "Omelette au Jambon ou aux Champignons", desc: "", price: 3000 },
        { id: "ech6", name: "Crêpes Forestière", desc: "", price: 3500 },
        { id: "ech7", name: "Cuisses de Grenouille", desc: "", price: 4500 },
        { id: "ech8", name: "Escargots de Bourgogne (6 pièces)", desc: "", price: 4000 },
        { id: "ech9", name: "Escargots de Bourgogne (12 pièces)", desc: "", price: 8000 },
      ],
    },
    {
      id: "capitaine", label: "Le Capitaine", icon: "poisson",
      items: [
        { id: "cap1", name: "Brochette de Capitaine du Lac", desc: "", price: 6000 },
        { id: "cap2", name: "Filet de Capitaine du Lac Meunière", desc: "", price: 7500 },
        { id: "cap3", name: "Filet de Capitaine au Poivre Vert", desc: "", price: 7500 },
        { id: "cap4", name: "Filet de Capitaine en Papillote", desc: "", price: 7500 },
        { id: "cap5", name: "Filet de Capitaine au Vin Blanc", desc: "", price: 7500 },
      ],
    },
    {
      id: "ecrevisses", label: "Les Écrevisses", icon: "poisson",
      items: [
        { id: "ecr1", name: "Écrevisses Pomodoro, Gingembre ou à la Provençale", desc: "", price: 9500,
          options: [
            { name: "Préparation", type: "single", required: true, choices: [
              { label: "Pomodoro", delta: 0 }, { label: "Gingembre", delta: 0 }, { label: "À la Provençale", delta: 0 },
            ]},
          ],
        },
        { id: "ecr2", name: "Écrevisses en Brochette Flambées au Pastis", desc: "", price: 9500 },
      ],
    },
    {
      id: "sole", label: "La Sole", icon: "poisson",
      items: [
        { id: "sol1", name: "Sole Meunière", desc: "", price: 9500 },
        { id: "sol2", name: "Sole Dieppoise", desc: "", price: 9500 },
        { id: "sol3", name: "Sole Fourrée aux Épinards", desc: "", price: 9500 },
      ],
    },
    {
      id: "lebar", label: "Le Bar", icon: "poisson",
      items: [
        { id: "leb1", name: "Filet de Bar Meunière", desc: "", price: 7500 },
        { id: "leb2", name: "Filet de Bar Princesse", desc: "", price: 7500 },
      ],
    },
    {
      id: "calamarlangouste", label: "Calamars & Langouste", icon: "poisson",
      items: [
        { id: "cal1", name: "Calamars à l'Armoricaine", desc: "", price: 6500 },
        { id: "cal2", name: "Calamars Sautés à la Provençale", desc: "", price: 6500 },
        { id: "cal3", name: "Langouste Grillée", desc: "Prix selon taille et arrivage.", price: 15000,
          options: [
            { name: "Taille", type: "single", required: true, choices: [
              { label: "Taille standard (≈15 000 F)", delta: 0 }, { label: "Grande taille (≈20 000 F)", delta: 5000 },
            ]},
          ],
        },
        { id: "cal4", name: "Tagliatelles à la Langouste", desc: "", price: 15000 },
      ],
    },
    {
      id: "viandes", label: "Les Viandes – Filet", icon: "viandes",
      items: [
        { id: "vf1", name: "Brochette de Filet", desc: "", price: 6000 },
        { id: "vf2", name: "Filet de Bœuf Grillé", desc: "", price: 7000 },
        { id: "vf3", name: "Filet de Bœuf Sauce au Choix", desc: "", price: 8500, options: [SAUCE_CHOICES] },
      ],
    },
    {
      id: "tournedos", label: "Tournedos", icon: "viandes",
      items: [
        { id: "tou1", name: "Steak Tartare", desc: "", price: 7500 },
        { id: "tou2", name: "Tournedos aux Cèpes", desc: "", price: 9500 },
        { id: "tou3", name: "Tournedos Sauce au Choix", desc: "", price: 8500, options: [SAUCE_CHOICES] },
      ],
    },
    {
      id: "entrecote", label: "Entrecôte", icon: "viandes",
      items: [
        { id: "ent1", name: "Entrecôte Grillée", desc: "", price: 7500 },
        { id: "ent2", name: "Entrecôte Sauce au Choix", desc: "", price: 9500, options: [SAUCE_CHOICES] },
      ],
    },
    {
      id: "tbone", label: "T-Bone", icon: "viandes",
      items: [
        { id: "tb1", name: "T-Bone Grillé", desc: "", price: 9500 },
        { id: "tb2", name: "T-Bone Sauce au Choix", desc: "", price: 9500, options: [SAUCE_CHOICES] },
      ],
    },
    {
      id: "cotedeboeuf", label: "Côte de Bœuf", icon: "viandes",
      items: [
        { id: "cb1", name: "Côte de Bœuf Grillée", desc: "", price: 8500 },
        { id: "cb2", name: "Côte de Bœuf Sauce au Choix", desc: "", price: 9500, options: [SAUCE_CHOICES] },
        { id: "cb3", name: "Côte de Bœuf Parfumée au Fenouil", desc: "Flambée au Cognac.", price: 9500 },
      ],
    },
    {
      id: "agneau", label: "Agneau", icon: "viandes",
      items: [
        { id: "agn1", name: "Côtelette d'Agneau Poêlée au Riz Parfumé", desc: "", price: 7500 },
        { id: "agn2", name: "Gigot d'Agneau Braisé", desc: "", price: 15000 },
        { id: "agn3", name: "Gigot d'Agneau Crème Champignons", desc: "", price: 16000 },
      ],
    },
    {
      id: "porc", label: "Porc", icon: "viandes",
      items: [
        { id: "por1", name: "Côte de Porc à l'Ananas", desc: "", price: 7500 },
      ],
    },
    {
      id: "abats", label: "Abats", icon: "viandes",
      items: [
        { id: "aba1", name: "Langue de Bœuf Sauce aux Câpres", desc: "", price: 6500 },
        { id: "aba2", name: "Cervelle Meunière, Pommes Persillées", desc: "", price: 6000 },
        { id: "aba3", name: "Rognons à la Crème Flambés au Whisky", desc: "", price: 7500 },
        { id: "aba4", name: "Rognons Marchand de Vin", desc: "", price: 7500 },
        { id: "aba5", name: "Rognons Parfumés au Genièvre", desc: "Flambés au Cognac.", price: 7500 },
      ],
    },
    {
      id: "volaille", label: "Volaille & Gibier", icon: "africaines",
      items: [
        { id: "vol1", name: "Magret de Canard Grillé (Import)", desc: "", price: 11500 },
        { id: "vol2", name: "Poulet aux Écrevisses", desc: "", price: 9500 },
        { id: "vol3", name: "Confit d'Agouti", desc: "", price: 15000 },
        { id: "vol4", name: "Supplément Garniture", desc: "", price: 1500 },
      ],
    },
    {
      id: "africaines", label: "Les Spécialités Africaines", icon: "africaines",
      items: [
        { id: "afr1", name: "Poulet Braisé Attiéké", desc: "Demi-portion 5 000 F / portion entière 10 000 F.", price: 5000,
          options: [portionGroup("Demi-portion", "Portion entière", 5000)] },
        { id: "afr2", name: "Poulet Yassa", desc: "Demi-portion 8 500 F / portion entière 16 000 F.", price: 8500,
          options: [portionGroup("Demi-portion", "Portion entière", 7500)] },
        { id: "afr3", name: "Kedjenou de Poulet", desc: "Demi-portion 5 000 F / portion entière 10 000 F.", price: 5000,
          options: [portionGroup("Demi-portion", "Portion entière", 5000)] },
        { id: "afr4", name: "Poulet Africain Kedjenou", desc: "Portion généreuse.", price: 12000 },
        { id: "afr5", name: "Kedjenou de Pintade", desc: "", price: 8500 },
        { id: "afr6", name: "Carpe Braisée", desc: "Prix selon la taille.", price: 8000,
          options: [
            { name: "Taille", type: "single", required: true, choices: [
              { label: "Petite (8 000 F)", delta: 0 }, { label: "Moyenne (10 000 F)", delta: 2000 }, { label: "Grande (15 000 F)", delta: 7000 },
            ]},
          ],
        },
        { id: "afr7", name: "Soupe de Machoiron", desc: "", price: 6000 },
        { id: "afr8", name: "Foutou Sauce Gouagouassou (Pintade)", desc: "", price: 15000 },
        { id: "afr9", name: "Foutou Sauce Gouagouassou (Bœuf)", desc: "", price: 8500 },
      ],
    },
    {
      id: "pizzas", label: "Pizzas & Plats Italiens", icon: "pizzas",
      items: [
        { id: "piz1", name: "Margherita", desc: "", price: 6000 },
        { id: "piz2", name: "Sicilienne", desc: "", price: 6500 },
        { id: "piz3", name: "Marine", desc: "", price: 6500 },
        { id: "piz4", name: "Pepperone", desc: "", price: 7000 },
        { id: "piz5", name: "Royale", desc: "", price: 6500 },
        { id: "piz6", name: "St-Étienne", desc: "", price: 6500 },
        { id: "piz7", name: "Quatre Saisons", desc: "", price: 6500 },
        { id: "piz8", name: "Méditerranéenne", desc: "", price: 6500 },
        { id: "piz9", name: "Pêcheur", desc: "", price: 7500 },
        { id: "piz10", name: "Calzone", desc: "", price: 7000 },
        { id: "piz11", name: "Calzone à la Crème", desc: "", price: 7500 },
        { id: "piz12", name: "Pizza Blanche de Poulet (Crème)", desc: "", price: 8500 },
        { id: "piz13", name: "Pizza 4 Fromages", desc: "", price: 7000 },
        { id: "piz14", name: "Supplément Mozzarella", desc: "", price: 8000 },
        { id: "piz15", name: "Tout Supplément (pizza)", desc: "", price: 1500 },
        { id: "piz16", name: "Tagliatelles ou Spaghetti Carbonara", desc: "", price: 6500 },
        { id: "piz17", name: "Tagliatelles ou Spaghetti Bolognaise", desc: "", price: 6500 },
        { id: "piz18", name: "Tagliatelles aux Fruits de Mer", desc: "", price: 6500 },
        { id: "piz19", name: "Tagliatelles au Langouste (sauce)", desc: "", price: 7500 },
        { id: "piz20", name: "Escalope Milanaise", desc: "", price: 15000 },
        { id: "piz21", name: "Escalope Cordon Bleu", desc: "", price: 9000 },
      ],
    },
    {
      id: "desserts", label: "Desserts Maison", icon: "desserts",
      items: [
        { id: "des1", name: "Fruits de Saison", desc: "", price: 1500 },
        { id: "des2", name: "Ananas Flambé", desc: "", price: 3000 },
        { id: "des3", name: "Banane Flambée", desc: "", price: 3000 },
        { id: "des4", name: "Ananas Meringué", desc: "", price: 3500 },
        { id: "des5", name: "Irish Coffee", desc: "", price: 5500 },
        { id: "des6", name: "Tartelette aux Pommes", desc: "", price: 2500 },
        { id: "des7", name: "Tartelette aux Pommes Flambée au Calvados", desc: "", price: 4500 },
        { id: "des8", name: "Profiteroles", desc: "", price: 4000 },
        { id: "des9", name: "Banane Flambée Brésilienne", desc: "", price: 4500 },
        { id: "des10", name: "Tartelette aux Pommes + Glace Vanille + Chantilly", desc: "", price: 4500 },
        { id: "des11", name: "Mousse au Chocolat", desc: "", price: 4500 },
      ],
    },
    {
      id: "crepes", label: "Les Crêpes", icon: "desserts",
      items: [
        { id: "crp1", name: "Crêpe au Sucre", desc: "", price: 1500 },
        { id: "crp2", name: "Crêpe à la Confiture", desc: "", price: 2000 },
        { id: "crp3", name: "Crêpe au Miel", desc: "", price: 2000 },
        { id: "crp4", name: "Crêpe Fourrée au Chocolat", desc: "", price: 2000 },
        { id: "crp5", name: "Crêpe Flambée au Rhum", desc: "", price: 3500 },
        { id: "crp6", name: "Crêpe Flambée au Grand Marnier", desc: "", price: 4500 },
        { id: "crp7", name: "Crêpe « Black and White »", desc: "", price: 4500 },
      ],
    },
    {
      id: "glaces", label: "Glaces", icon: "glaces",
      items: [
        { id: "gla1", name: "Coupe de Glace (2 boules)", desc: "", price: 3500 },
        { id: "gla2", name: "Coupe Colonel", desc: "", price: 4000 },
        { id: "gla3", name: "Coupe Général", desc: "", price: 4000 },
        { id: "gla4", name: "Coupe Mousquetaire", desc: "", price: 4000 },
        { id: "gla5", name: "Coupe Pirate", desc: "", price: 4000 },
        { id: "gla6", name: "Coupe Bourguignonne", desc: "", price: 4000 },
        { id: "gla7", name: "Coupe « Jean Jacques »", desc: "", price: 4500 },
        { id: "gla8", name: "Café Liégeois", desc: "", price: 4500 },
        { id: "gla9", name: "Chocolat Liégeois", desc: "", price: 4500 },
      ],
    },
    {
      id: "vins", label: "Vins de France", icon: "vins",
      items: [
        { id: "vin1", name: "Côte du Rhône Georges Dubœuf", desc: "", price: 15000 },
        { id: "vin2", name: "Côte du Rhône Guigal", desc: "", price: 20000 },
        { id: "vin3", name: "Beaujolais Village", desc: "", price: 28000 },
        { id: "vin4", name: "Château Puyfromage", desc: "", price: 20000 },
        { id: "vin5", name: "Château Le Virou", desc: "", price: 20000 },
        { id: "vin6", name: "Château Pipeau", desc: "", price: 75000 },
        { id: "vin7", name: "Château Ferrand", desc: "", price: 30000 },
        { id: "vin8", name: "Mouton Cadet", desc: "", price: 25000 },
        { id: "vin9", name: "Château Larose Trintaudon", desc: "", price: 35000 },
        { id: "vin10", name: "Muscadet", desc: "", price: 15000 },
        { id: "vin11", name: "Bourgogne Rouge", desc: "", price: 20000 },
        { id: "vin12", name: "Bourgogne Aligoté", desc: "", price: 20000 },
        { id: "vin13", name: "Brouilly", desc: "", price: 25500 },
        { id: "vin14", name: "Saint-Nicolas-de-Bourgueil", desc: "", price: 25000 },
        { id: "vin15", name: "Bourgueil", desc: "", price: 20000 },
        { id: "vin16", name: "Rosé d'Anjou", desc: "", price: 20000 },
        { id: "vin17", name: "Cabernet d'Anjou", desc: "", price: 12000 },
        { id: "vin18", name: "Chardonnay", desc: "", price: 12000 },
        { id: "vin19", name: "Rosé Roquesante", desc: "", price: 15000 },
        { id: "vin20", name: "Champagne Moët", desc: "", price: 15000 },
        { id: "vin21", name: "Champagne Veuve Clicquot", desc: "", price: 70000 },
        { id: "vin22", name: "Champagne Nicolas Feuillatte", desc: "", price: 75000 },
        { id: "vin23", name: "Champagne Veuve Émile", desc: "", price: 45000 },
        { id: "vin24", name: "Champagne Charles Mignon", desc: "", price: 40000 },
        { id: "vin25", name: "Champagne Laurent Perrier", desc: "", price: 60000 },
      ],
    },
    {
      id: "bieres", label: "Bières", icon: "bieres",
      items: [
        { id: "bie1", name: "Guinness 33cl", desc: "", price: 1500 },
        { id: "bie2", name: "Heineken 25cl", desc: "", price: 1000 },
        { id: "bie3", name: "Desperados 33cl", desc: "", price: 1500 },
        { id: "bie4", name: "Budweiser", desc: "", price: 1500 },
      ],
    },
    {
      id: "eaux", label: "Eaux Minérales & Sucreries", icon: "boissons",
      items: [
        { id: "eau1", name: "Awa 50cl", desc: "", price: 1000 },
        { id: "eau2", name: "Awa 150cl", desc: "", price: 1500 },
        { id: "eau3", name: "Perrier 25cl", desc: "", price: 2000 },
        { id: "eau4", name: "Perrier 75cl", desc: "", price: 3000 },
        { id: "eau5", name: "San Pellegrino 100cl", desc: "", price: 3000 },
        { id: "eau6", name: "Coca, Fanta, Sprite ou Tonic", desc: "", price: 1000 },
        { id: "eau7", name: "Jus de Fruits Naturels", desc: "Orange ou ananas.", price: 2000 },
        { id: "eau8", name: "Café Capsule Nespresso", desc: "", price: 1500 },
        { id: "eau9", name: "San Bitter", desc: "", price: 2000 },
      ],
    },
    {
      id: "formules", label: "Formules", icon: "formules",
      items: [
        {
          id: "for1", name: "Formule Déjeuner", price: 9500,
          desc: "Salade verte ou de tomates, Filet de bœuf grillé, Fruits de saison.",
        },
        {
          id: "for2", name: "Formule Duo", price: 22000,
          desc: "2 x Poulet Braisé Attiéké (demi-portion) + 2 boissons (Coca, Fanta, Sprite ou Tonic).",
        },
        {
          id: "for3", name: "Formule Famille", price: 39000,
          desc: "Poulet Yassa entier, Filet de Capitaine du Lac Meunière, Kedjenou de Pintade, Côte de Bœuf Grillée + 4 boissons.",
        },
      ],
    },
  ];

  /* ---------------------------------------------------------
     ÉTAT
  --------------------------------------------------------- */
  let cart = [];
  let currentDish = null;
  let currentSelection = {};
  let currentQty = 1;

  const STORAGE_KEY = "bw_cart_v1";

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cart = raw ? JSON.parse(raw) : [];
    } catch (e) {
      cart = [];
    }
  }
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  function formatPrice(n) {
    return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " " + CONFIG.currency;
  }

  /* ---------------------------------------------------------
     RENDU — NAVIGATION DES CATÉGORIES
  --------------------------------------------------------- */
  function renderCategoryNav() {
    const scroller = document.getElementById("cat-nav-scroller");
    scroller.innerHTML = MENU.map(cat =>
      `<a href="#cat-${cat.id}" class="cat-nav__link" data-cat="${cat.id}">${cat.label}</a>`
    ).join("");
  }

  /* ---------------------------------------------------------
     RENDU — SECTIONS DE LA CARTE
  --------------------------------------------------------- */
  function renderMenu() {
    const container = document.getElementById("menu-sections");
    container.innerHTML = MENU.map(cat => `
      <section class="menu-category" id="cat-${cat.id}" aria-labelledby="cat-${cat.id}-title">
        <div class="menu-category__head">
          <h2 class="menu-category__title" id="cat-${cat.id}-title">${cat.label}</h2>
          <span class="menu-category__count">${cat.items.length} ${cat.items.length > 1 ? "plats" : "plat"}</span>
        </div>
        <div class="dish-grid">
          ${cat.items.map(item => renderDishCard(item, cat.icon)).join("")}
        </div>
      </section>
    `).join("");
  }

  function renderDishCard(item, iconKey) {
    const hasOptions = Array.isArray(item.options) && item.options.length > 0;
    return `
      <article class="dish-card" data-dish-id="${item.id}">
        <div class="dish-card__thumb" aria-hidden="true">${ICONS[iconKey] || ""}</div>
        <div class="dish-card__body">
          <div class="dish-card__top">
            <h3 class="dish-card__name">${item.name}</h3>
            <span class="dish-card__price">${formatPrice(item.price)}</span>
          </div>
          ${item.desc ? `<p class="dish-card__desc">${item.desc}</p>` : ""}
          <div class="dish-card__footer">
            <button class="add-btn" type="button" data-add="${item.id}" data-has-options="${hasOptions}">
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"/></svg>
              <span>${hasOptions ? "Choisir" : "Ajouter"}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function findItemById(id) {
    for (const cat of MENU) {
      const found = cat.items.find(i => i.id === id);
      if (found) return found;
    }
    return null;
  }

  /* ---------------------------------------------------------
     AJOUT RAPIDE (sans options)
  --------------------------------------------------------- */
  function quickAdd(item) {
    const existing = cart.find(l => l.itemId === item.id && !l.optionsKey);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        lineId: "l" + Date.now() + Math.random().toString(16).slice(2),
        itemId: item.id,
        name: item.name,
        unitPrice: item.price,
        qty: 1,
        optionsSummary: "",
        optionsKey: "",
      });
    }
    saveCart();
    updateCartUI();
    showToast(`${item.name} ajouté au panier`);
  }

  /* ---------------------------------------------------------
     MODALE D'OPTIONS
  --------------------------------------------------------- */
  const modal = document.getElementById("dish-modal");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("dish-modal-content");

  function openDishModal(item) {
    currentDish = item;
    currentSelection = {};
    currentQty = 1;
    item.options.forEach((group, gi) => {
      if (group.type === "single") {
        currentSelection[gi] = group.choices[0].label; // pré-sélection premier choix
      } else {
        currentSelection[gi] = [];
      }
    });
    renderDishModal();
    modal.classList.add("is-open");
    modalOverlay.classList.add("is-open");
    modal.focus();
    document.body.style.overflow = "hidden";
  }

  function closeDishModal() {
    modal.classList.remove("is-open");
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    currentDish = null;
  }

  function computeOptionsDelta() {
    let delta = 0;
    let parts = [];
    currentDish.options.forEach((group, gi) => {
      if (group.type === "single") {
        const label = currentSelection[gi];
        const choice = group.choices.find(c => c.label === label);
        if (choice) { delta += choice.delta; parts.push(choice.label); }
      } else {
        (currentSelection[gi] || []).forEach(label => {
          const choice = group.choices.find(c => c.label === label);
          if (choice) { delta += choice.delta; parts.push(choice.label); }
        });
      }
    });
    return { delta, summary: parts.join(", ") };
  }

  function renderDishModal() {
    const item = currentDish;
    const { delta } = computeOptionsDelta();
    const unit = item.price + delta;

    modalContent.innerHTML = `
      <h2 class="dish-modal__title" id="dish-modal-title">${item.name}</h2>
      ${item.desc ? `<p class="dish-modal__desc">${item.desc}</p>` : ""}
      ${item.options.map((group, gi) => `
        <div class="opt-group">
          <span class="opt-group__label">${group.name}${group.required ? "" : " (facultatif)"}</span>
          <div class="opt-choices" data-group="${gi}">
            ${group.choices.map(choice => {
              const isMulti = group.type === "multi";
              const selected = isMulti
                ? (currentSelection[gi] || []).includes(choice.label)
                : currentSelection[gi] === choice.label;
              return `
                <label class="opt-choice ${selected ? "is-selected" : ""}">
                  <input type="${isMulti ? "checkbox" : "radio"}" name="group-${gi}" value="${choice.label}" ${selected ? "checked" : ""}>
                  <span>${choice.label}${choice.delta ? ` (+${formatPrice(choice.delta)})` : ""}</span>
                </label>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}
      <div class="dish-modal__qty-row">
        <div class="qty-stepper" id="modal-qty-stepper">
          <button type="button" data-step="-1" aria-label="Diminuer la quantité">–</button>
          <span class="qty-stepper__value" id="modal-qty-value">${currentQty}</span>
          <button type="button" data-step="1" aria-label="Augmenter la quantité">+</button>
        </div>
        <span class="dish-modal__total" id="modal-total">${formatPrice(unit * currentQty)}</span>
      </div>
      <button class="btn btn--primary" style="width:100%" id="modal-add-btn">Ajouter au panier</button>
    `;

    // Option selection handlers
    modalContent.querySelectorAll(".opt-choices").forEach(el => {
      const gi = Number(el.dataset.group);
      const group = item.options[gi];
      el.addEventListener("change", (e) => {
        if (group.type === "single") {
          currentSelection[gi] = e.target.value;
        } else {
          const set = new Set(currentSelection[gi] || []);
          if (e.target.checked) set.add(e.target.value); else set.delete(e.target.value);
          currentSelection[gi] = Array.from(set);
        }
        renderDishModal();
      });
    });

    // Qty stepper
    modalContent.querySelector("#modal-qty-stepper").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-step]");
      if (!btn) return;
      const step = Number(btn.dataset.step);
      currentQty = Math.max(1, currentQty + step);
      renderDishModal();
    });

    // Add to cart
    modalContent.querySelector("#modal-add-btn").addEventListener("click", () => {
      const { delta: d2, summary } = computeOptionsDelta();
      const unitPrice = item.price + d2;
      const optionsKey = summary;
      const existing = cart.find(l => l.itemId === item.id && l.optionsKey === optionsKey);
      if (existing) {
        existing.qty += currentQty;
      } else {
        cart.push({
          lineId: "l" + Date.now() + Math.random().toString(16).slice(2),
          itemId: item.id,
          name: item.name,
          unitPrice,
          qty: currentQty,
          optionsSummary: summary,
          optionsKey,
        });
      }
      saveCart();
      updateCartUI();
      showToast(`${item.name} ajouté au panier`);
      closeDishModal();
    });
  }

  /* ---------------------------------------------------------
     PANIER — RENDU
  --------------------------------------------------------- */
  const cartDrawer = document.getElementById("cart-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountEl = document.getElementById("cart-count");
  const fabCartCountEl = document.getElementById("fab-cart-count");
  const sendBtn = document.getElementById("send-whatsapp");
  const emptyHint = document.getElementById("cart-empty-hint");

  function cartTotals() {
    const totalQty = cart.reduce((s, l) => s + l.qty, 0);
    const totalPrice = cart.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    return { totalQty, totalPrice };
  }

  function updateCartUI() {
    const { totalQty, totalPrice } = cartTotals();
    cartCountEl.textContent = String(totalQty);
    fabCartCountEl.textContent = String(totalQty);
    cartTotalEl.textContent = formatPrice(totalPrice);
    sendBtn.disabled = cart.length === 0;
    emptyHint.style.display = cart.length === 0 ? "block" : "none";

    cartItemsEl.innerHTML = cart.map(line => `
      <div class="cart-line" data-line="${line.lineId}">
        <div class="cart-line__info">
          <div class="cart-line__name">${line.name}</div>
          ${line.optionsSummary ? `<div class="cart-line__opts">${line.optionsSummary}</div>` : ""}
          <div class="cart-line__row">
            <div class="qty-stepper">
              <button type="button" data-line-step="-1" aria-label="Diminuer la quantité">–</button>
              <span class="qty-stepper__value">${line.qty}</span>
              <button type="button" data-line-step="1" aria-label="Augmenter la quantité">+</button>
            </div>
            <span class="cart-line__price">${formatPrice(line.qty * line.unitPrice)}</span>
          </div>
        </div>
        <button class="cart-line__remove" type="button" data-remove="${line.lineId}">Retirer</button>
      </div>
    `).join("");
  }

  cartItemsEl.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("button[data-line-step]");
    if (stepBtn) {
      const lineId = stepBtn.closest(".cart-line").dataset.line;
      const line = cart.find(l => l.lineId === lineId);
      if (!line) return;
      line.qty += Number(stepBtn.dataset.lineStep);
      if (line.qty <= 0) cart = cart.filter(l => l.lineId !== lineId);
      saveCart();
      updateCartUI();
      return;
    }
    const removeBtn = e.target.closest("button[data-remove]");
    if (removeBtn) {
      cart = cart.filter(l => l.lineId !== removeBtn.dataset.remove);
      saveCart();
      updateCartUI();
    }
  });

  /* ---------------------------------------------------------
     OUVERTURE / FERMETURE DU PANIER
  --------------------------------------------------------- */
  function openCart() {
    cartDrawer.classList.add("is-open");
    drawerOverlay.classList.add("is-open");
    document.getElementById("cart-toggle").setAttribute("aria-expanded", "true");
    document.getElementById("fab-cart").setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    cartDrawer.focus();
  }
  function closeCart() {
    cartDrawer.classList.remove("is-open");
    drawerOverlay.classList.remove("is-open");
    document.getElementById("cart-toggle").setAttribute("aria-expanded", "false");
    document.getElementById("fab-cart").setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  /* ---------------------------------------------------------
     ENVOI VIA WHATSAPP
  --------------------------------------------------------- */
  function buildWhatsAppMessage() {
    const { totalPrice } = cartTotals();
    const tableNumber = document.getElementById("table-number").value.trim();
    let lines = [];
    lines.push(`Bonjour ${CONFIG.restaurantName}, je souhaite passer la commande suivante :`);
    lines.push("");
    cart.forEach(l => {
      let row = `• ${l.qty} x ${l.name}`;
      if (l.optionsSummary) row += ` (${l.optionsSummary})`;
      row += ` — ${formatPrice(l.qty * l.unitPrice)}`;
      lines.push(row);
    });
    lines.push("");
    lines.push(`Total : ${formatPrice(totalPrice)}`);
    if (tableNumber) lines.push(`Table : ${tableNumber}`);
    lines.push("");
    lines.push("Merci !");
    return lines.join("\n");
  }

  function sendWhatsApp() {
    if (cart.length === 0) return;
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  }

  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  /* ---------------------------------------------------------
     SCROLL SPY — NAVIGATION DES CATÉGORIES
  --------------------------------------------------------- */
  function initScrollSpy() {
    const sections = Array.from(document.querySelectorAll(".menu-category"));
    const links = Array.from(document.querySelectorAll(".cat-nav__link"));
    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace("cat-", "");
          links.forEach(l => l.classList.toggle("is-active", l.dataset.cat === id));
          const activeLink = links.find(l => l.dataset.cat === id);
          if (activeLink) {
            activeLink.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  /* ---------------------------------------------------------
     ÉVÉNEMENTS GLOBAUX
  --------------------------------------------------------- */
  function initEvents() {
    document.getElementById("menu-sections").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-add]");
      if (!btn) return;
      const item = findItemById(btn.dataset.add);
      if (!item) return;
      const hasOptions = btn.dataset.hasOptions === "true";
      if (hasOptions) {
        openDishModal(item);
      } else {
        quickAdd(item);
        btn.classList.add("added");
        setTimeout(() => btn.classList.remove("added"), 900);
      }
    });

    document.getElementById("cart-toggle").addEventListener("click", openCart);
    document.getElementById("fab-cart").addEventListener("click", openCart);
    document.getElementById("cart-close").addEventListener("click", closeCart);
    drawerOverlay.addEventListener("click", closeCart);

    document.getElementById("dish-modal-close").addEventListener("click", closeDishModal);
    modalOverlay.addEventListener("click", closeDishModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDishModal();
        closeCart();
      }
    });

    document.getElementById("send-whatsapp").addEventListener("click", sendWhatsApp);

    document.getElementById("year").textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     INITIALISATION
  --------------------------------------------------------- */
  function init() {
    loadCart();
    renderCategoryNav();
    renderMenu();
    initEvents();
    initScrollSpy();
    updateCartUI();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
