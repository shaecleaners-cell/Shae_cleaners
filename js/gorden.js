/* =========================================================
   SHAE CLEANERS
   js/gorden.js

   FITUR:
   - Tombol konsultasi WhatsApp
   - Pesan otomatis
   - Membaca shae_cart
   - Menampilkan jumlah item
   - Menampilkan total keranjang
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initGorden
);


/* =========================================================
   CONFIG
========================================================= */

const CART_KEY =
  "shae_cart";


const ADMIN_WA =
  "6283813138221";


/* =========================================================
   STATE
========================================================= */

let cart = [];


/* =========================================================
   INIT
========================================================= */

function initGorden() {

  loadCart();

  updateCartDisplay();

  setupConsultation();

}


/* =========================================================
   LOAD CART
========================================================= */

function loadCart() {

  try {

    const saved =
      localStorage.getItem(
        CART_KEY
      );


    if (!saved) {

      cart = [];

      return;

    }


    const data =
      JSON.parse(
        saved
      );


    cart =
      Array.isArray(data)
        ? data
        : [];


  } catch (error) {

    console.error(
      "Gagal membaca keranjang:",
      error
    );

    cart = [];

  }

}


/* =========================================================
   CONSULTATION
========================================================= */

function setupConsultation() {

  const buttons =
    document.querySelectorAll(
      ".add-service"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        function () {

          const service =
            this.dataset.name ||
            "Cuci Gorden";


          openWhatsApp(
            service
          );

        }
      );

    }
  );

}


/* =========================================================
   OPEN WHATSAPP
========================================================= */

function openWhatsApp(
  service
) {

  const message =

`*KONSULTASI CUCI GORDEN*

Halo Shae Cleaners 👋

Saya ingin konsultasi mengenai:

🪟 Layanan:
${service}

Saya ingin mengetahui:
• Harga
• Estimasi pengerjaan
• Cara booking
• Jadwal tersedia

Mohon informasinya.

Terima kasih.
`;


  const url =
    `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
      message
    )}`;


  window.location.href =
    url;

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCartDisplay() {

  const totalQty =
    cart.reduce(

      (
        total,
        item
      ) =>

        total +
        Number(
          item.qty || 0
        ),

      0

    );


  const totalPrice =
    cart.reduce(

      (
        total,
        item
      ) =>

        total +

        (
          Number(
            item.price || 0
          ) *

          Number(
            item.qty || 0
          )
        ),

      0

    );


  setText(
    "cartCount",
    totalQty
  );


  setText(
    "cartTotal",
    formatRupiah(
      totalPrice
    )
  );


  const preview =
    document.getElementById(
      "cartPreview"
    );


  if (preview) {

    preview.style.display =
      totalQty > 0
        ? "flex"
        : "none";

  }

}


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(
  value
) {

  return new Intl.NumberFormat(

    "id-ID",

    {

      style:
        "currency",

      currency:
        "IDR",

      maximumFractionDigits:
        0

    }

  ).format(

    Number(value) || 0

  );

}


/* =========================================================
   DOM HELPER
========================================================= */

function setText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   UPDATE WHEN PAGE RETURNS
========================================================= */

window.addEventListener(
  "pageshow",
  function () {

    loadCart();

    updateCartDisplay();

  }
);