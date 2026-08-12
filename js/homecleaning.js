/* =========================================================
   SHAE CLEANERS
   js/homecleaning.js

   FITUR:
   - Konsultasi Home Cleaning
   - WhatsApp otomatis
   - Nama paket otomatis
   - Membaca jumlah keranjang
   - Menampilkan total keranjang
   - Sinkronisasi localStorage
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initHomeCleaning
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

function initHomeCleaning() {

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
      "Gagal membaca keranjang:",
      error
    );

    cart = [];

  }

}


/* =========================================================
   CONSULTATION BUTTONS
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

          const name =
            this.dataset.name ||
            "Home Cleaning";


          const service =
            this.dataset.service ||
            "Home Cleaning";


          openWhatsApp(
            name,
            service
          );

        }
      );

    }
  );

}


/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(
  packageName,
  service
) {

  const message =

`*KONSULTASI HOME CLEANING*
*SHAE CLEANERS*

Halo Shae Cleaners 👋

Saya ingin konsultasi layanan Home Cleaning.

🏠 Paket:
${packageName}

🧹 Layanan:
${service}

Mohon informasi:

• Harga paket
• Luas/area yang dapat dibersihkan
• Estimasi waktu pengerjaan
• Jadwal yang tersedia
• Area layanan

Detail tambahan:
- Jumlah ruangan: 
- Perkiraan luas rumah:
- Kondisi rumah:

Jika diperlukan saya dapat mengirimkan
foto/video area yang akan dibersihkan.

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
      ) => {

        return (
          total +
          Number(
            item.qty || 0
          )
        );

      },

      0

    );


  const totalPrice =
    cart.reduce(

      (
        total,
        item
      ) => {

        const price =
          Number(
            item.price || 0
          );


        const qty =
          Number(
            item.qty || 0
          );


        return (
          total +
          (
            price *
            qty
          )
        );

      },

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
   RUPIAH
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
   REFRESH WHEN PAGE RETURNS
========================================================= */

window.addEventListener(
  "pageshow",
  function () {

    loadCart();

    updateCartDisplay();

  }
);


/* =========================================================
   STORAGE SYNC
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