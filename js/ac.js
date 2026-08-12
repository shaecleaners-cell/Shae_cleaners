/* =========================================================
   SHAE CLEANERS
   js/ac.js

   FITUR:
   - Konsultasi AC melalui WhatsApp
   - Nomor WhatsApp otomatis
   - Pesan layanan otomatis
   - Membaca shae_cart
   - Menampilkan jumlah keranjang
   - Menampilkan total keranjang
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initAC
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

function initAC() {

  loadCart();

  setupConsultationButtons();

  updateCartDisplay();

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
      "Gagal membaca shae_cart:",
      error
    );

    cart = [];

  }

}


/* =========================================================
   CONSULTATION BUTTON
========================================================= */

function setupConsultationButtons() {

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
            "Cuci AC";


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

`*KONSULTASI LAYANAN AC*
*SHAE CLEANERS*

Halo Shae Cleaners 👋

Saya ingin konsultasi layanan:

❄️ Layanan:
${service}

Mohon informasi:

• Harga layanan
• Estimasi pengerjaan
• Jadwal tersedia
• Area layanan

Jika diperlukan saya bisa mengirimkan
foto AC untuk pengecekan awal.

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
   CART DISPLAY
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
   PAGE RETURN
========================================================= */

window.addEventListener(
  "pageshow",
  function () {

    loadCart();

    updateCartDisplay();

  }
);


/* =========================================================
   STORAGE CHANGE
========================================================= */

window.addEventListener(
  "storage",
  function (event) {

    if (
      event.key === CART_KEY
    ) {

      loadCart();

      updateCartDisplay();

    }

  }
);