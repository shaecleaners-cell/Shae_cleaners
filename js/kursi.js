/* =========================================================
   SHAE CLEANERS
   js/kursi.js

   FITUR:
   - Tambah kursi ke keranjang
   - Qty otomatis bertambah
   - Harga sesuai jenis kursi
   - Simpan ke localStorage shae_cart
   - Update jumlah item
   - Update total keranjang
   - Toast notifikasi
   - Terhubung ke checkout.html
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initKursi
);


/* =========================================================
   CONFIG
========================================================= */

const CART_KEY =
  "shae_cart";


/* =========================================================
   STATE
========================================================= */

let cart = [];


/* =========================================================
   INIT
========================================================= */

function initKursi() {

  loadCart();

  setupButtons();

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
   SAVE CART
========================================================= */

function saveCart() {

  try {

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

  } catch (error) {

    console.error(
      "Gagal menyimpan keranjang:",
      error
    );

  }

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

function setupButtons() {

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
            "Kursi";


          const service =
            this.dataset.service ||
            "Cuci Kursi";


          const price =
            Number(
              this.dataset.price || 0
            );


          addToCart(
            name,
            service,
            price
          );

        }
      );

    }
  );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
  name,
  service,
  price
) {

  if (
    !name ||
    price <= 0
  ) {

    showToast(
      "Data layanan tidak valid."
    );

    return;

  }


  /*
   * Cari item yang sama.
   * Jika sudah ada,
   * qty ditambah 1.
   */

  const existing =
    cart.find(
      item =>

        item.name === name &&

        Number(
          item.price
        ) === price

    );


  if (existing) {

    existing.qty =
      Number(
        existing.qty || 0
      ) + 1;

  }

  else {

    cart.push({

      id:
        createItemId(),

      name:
        name,

      service:
        service,

      price:
        price,

      qty:
        1

    });

  }


  saveCart();

  updateCartDisplay();

  showToast(
    `${name} ditambahkan ke keranjang`
  );

}


/* =========================================================
   CREATE ID
========================================================= */

function createItemId() {

  return (

    "KURSI-" +

    Date.now() +

    "-" +

    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

  );

}


/* =========================================================
   UPDATE CART DISPLAY
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
   TOAST
========================================================= */

function showToast(
  message
) {

  let toast =
    document.querySelector(
      ".kursi-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "kursi-toast";


    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toast._timer
  );


  toast._timer =
    setTimeout(
      function () {

        toast.classList.remove(
          "show"
        );

      },
      2000
    );

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


/* =========================================================
   UPDATE WHEN STORAGE BERUBAH
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