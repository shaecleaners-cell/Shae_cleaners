/* =========================================================
   SHAE CLEANERS
   js/jokmobil.js

   FITUR:
   - Membaca shae_cart
   - Tambah paket jok mobil
   - Qty otomatis bertambah jika paket sama
   - Update jumlah item
   - Update total harga
   - Toast notifikasi
   - Animasi tombol
   - Terhubung dengan checkout.js
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initJokMobil
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

function initJokMobil() {

  loadCart();

  updateCartDisplay();

  setupServiceButtons();

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
   SERVICE BUTTONS
========================================================= */

function setupServiceButtons() {

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
            this.dataset.name;


          const price =
            Number(
              this.dataset.price
            );


          if (
            !name ||
            !price
          ) {

            showToast(
              "Paket tidak tersedia."
            );

            return;

          }


          addToCart(
            name,
            price,
            this
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
  price,
  button
) {

  const existing =
    cart.find(
      item =>

        item.name === name &&

        Number(
          item.price
        ) === Number(price)

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
        "Cuci Jok Mobil",

      price:
        Number(price),

      qty:
        1

    });

  }


  saveCart();

  updateCartDisplay();

  animateButton(
    button
  );

  showToast(
    `${name} ditambahkan`
  );

}


/* =========================================================
   CREATE ITEM ID
========================================================= */

function createItemId() {

  return (

    "JOK-" +

    Date.now() +

    "-" +

    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()

  );

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
   BUTTON ANIMATION
========================================================= */

function animateButton(
  button
) {

  if (!button) {

    return;

  }


  const original =
    button.innerHTML;


  button.innerHTML =
    `<i class="fa-solid fa-check"></i>`;


  button.style.background =
    "#15803d";


  button.style.transform =
    "scale(.90)";


  setTimeout(
    () => {

      button.innerHTML =
        original;

      button.style.background =
        "";

      button.style.transform =
        "";

    },
    650
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  let toast =
    document.querySelector(
      ".jokmobil-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "jokmobil-toast";


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
      () => {

        toast.classList.remove(
          "show"
        );

      },
      1800
    );

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
   UPDATE CART WHEN PAGE RETURNS
========================================================= */

window.addEventListener(
  "pageshow",
  function () {

    loadCart();

    updateCartDisplay();

  }
);