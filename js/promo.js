/* =========================================================
   SHAE CLEANERS
   js/promo.js
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initPromo
);


/* =========================================================
   CONFIG
========================================================= */

const PROMO_KEY =
  "shae_selected_promo";


/*
 * Daftar promo
 */

const PROMOS = {

  PROMO17: {

    code: "PROMO17",

    name: "Diskon 17%",

    discount: 17,

    minOrder: 350000,

    services: [
      "sofa",
      "springbed",
      "jokmobil"
    ]

  },


  PROMO8: {

    code: "PROMO8",

    name: "Tambahan Diskon 8%",

    discount: 8,

    minOrder: 500000,

    services: [
      "sofa",
      "springbed",
      "jokmobil"
    ]

  },


  PAKET: {

    code: "PAKET",

    name: "Paket Cleaning Hemat",

    discount: 0,

    minOrder: 0,

    services: [
      "sofa",
      "springbed",
      "jokmobil",
      "karpet",
      "gorden",
      "kursi"
    ]

  }

};


/* =========================================================
   INIT
========================================================= */

function initPromo() {

  setupPromoButtons();

  setupInfoButton();

  animatePromoCards();

}


/* =========================================================
   PROMO BUTTONS
========================================================= */

function setupPromoButtons() {

  const buttons =
    document.querySelectorAll(
      "[data-promo], .promo-use, .hero-button"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        handlePromoClick
      );

    }
  );

}


/* =========================================================
   HANDLE CLICK
========================================================= */

function handlePromoClick(
  event
) {

  const button =
    event.currentTarget;


  /*
   * Cari kode promo dari
   * article terdekat.
   */

  let code =
    button.dataset.promo;


  if (!code) {

    const card =
      button.closest(
        "[data-promo]"
      );


    if (card) {

      code =
        card.dataset.promo;

    }

  }


  /*
   * Hero banner
   */

  if (!code) {

    code =
      "PROMO17";

  }


  const promo =
    PROMOS[code];


  if (!promo) {

    alert(
      "Promo tidak ditemukan."
    );

    return;

  }


  savePromo(
    promo
  );


  /*
   * Simpan layanan tujuan
   */

  const service =
    button.dataset.service ||
    "sofa";


  localStorage.setItem(
    "shae_selected_service",
    service
  );


  /*
   * Masuk ke halaman order
   */

  window.location.href =
    "order.html";

}


/* =========================================================
   SAVE PROMO
========================================================= */

function savePromo(
  promo
) {

  const data = {

    code:
      promo.code,

    name:
      promo.name,

    discount:
      promo.discount,

    minOrder:
      promo.minOrder,

    services:
      promo.services,

    selectedAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    PROMO_KEY,
    JSON.stringify(
      data
    )
  );

}


/* =========================================================
   INFO
========================================================= */

function setupInfoButton() {

  const button =
    document.getElementById(
      "promoInfo"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      alert(
`PROMO SHAE CLEANERS

Diskon 17%
Minimal order Rp350.000

Tambahan diskon 8%
Minimal order Rp500.000

Promo akan disesuaikan
dengan ketentuan checkout.`
      );

    }
  );

}


/* =========================================================
   ANIMATION
========================================================= */

function animatePromoCards() {

  const cards =
    document.querySelectorAll(
      ".promo-card"
    );


  cards.forEach(
    (
      card,
      index
    ) => {

      card.style.opacity =
        "0";

      card.style.transform =
        "translateY(8px)";


      setTimeout(
        () => {

          card.style.transition =
            "opacity .35s ease, transform .35s ease";

          card.style.opacity =
            "1";

          card.style.transform =
            "translateY(0)";

        },
        80 * index
      );

    }
  );

}


/* =========================================================
   EXPORT HELPER
========================================================= */

function getSelectedPromo() {

  try {

    const saved =
      localStorage.getItem(
        PROMO_KEY
      );


    if (!saved) {

      return null;

    }


    return JSON.parse(
      saved
    );

  } catch {

    return null;

  }

}