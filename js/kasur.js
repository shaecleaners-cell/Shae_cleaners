/* =========================================================
   SHAE CLEANERS
   js/kasur.js

   FITUR:
   - Tambah layanan kasur ke shae_cart
   - Jika layanan sama, qty bertambah
   - Hitung jumlah item
   - Hitung total keranjang
   - Simpan ke localStorage
   - Toast notifikasi
   - Terhubung dengan checkout.js
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initKasur
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

function initKasur() {

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

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(
      cart
    )
  );

}


/* =========================================================
   SETUP BUTTON
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

            return;

          }


          addToCart(
            name,
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
  price
) {

  const existing =
    cart.find(
      item =>
        item.name === name &&
        Number(item.price) ===
        Number(price)
    );


  if (existing) {

    existing.qty =
      Number(
        existing.qty || 0
      ) + 1;

  } else {

    cart.push({

      id:
        createItemId(),

      name:
        name,

      service:
        "Cuci Kasur",

      price:
        Number(price),

      qty:
        1

    });

  }


  saveCart();

  updateCartDisplay();

  showToast(
    `${name} ditambahkan ke keranjang`
  );


  /*
   * Animasi tombol
   */

  animateAddButton(
    name
  );

}


/* =========================================================
   CREATE ITEM ID
========================================================= */

function createItemId() {

  return (
    "KASUR-" +
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

        return (
          total +
          (
            Number(
              item.price || 0
            ) *
            Number(
              item.qty || 0
            )
          )
        );

      },
      0
    );


  updateText(
    "cartCount",
    totalQty
  );


  updateText(
    "cartTotal",
    formatRupiah(
      totalPrice
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
   ANIMATE BUTTON
========================================================= */

function animateAddButton(
  name
) {

  const buttons =
    document.querySelectorAll(
      ".add-service"
    );


  buttons.forEach(
    button => {

      if (
        button.dataset.name !==
        name
      ) {

        return;

      }


      const original =
        button.innerHTML;


      button.innerHTML =
        `<i class="fa-solid fa-check"></i>`;


      button.style.background =
        "#15803d";


      setTimeout(
        () => {

          button.innerHTML =
            original;

          button.style.background =
            "";

        },
        700
      );

    }
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
      ".kasur-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "kasur-toast";


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
   UPDATE TEXT
========================================================= */

function updateText(
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
   AUTO HIDE EMPTY CART
========================================================= */

const style =
  document.createElement(
    "style"
  );

style.textContent = `

  #cartPreview {
    display: none;
  }

`;

document.head.appendChild(
  style
);