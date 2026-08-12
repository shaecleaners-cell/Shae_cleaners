/* =========================================================
   SHAE CLEANERS
   js/karpet.js

   FITUR:
   - Harga Rp13.000 / m²
   - Hitung panjang × lebar
   - Pembulatan luas 2 angka desimal
   - Tambah karpet ke shae_cart
   - Jika ukuran sama, qty bertambah
   - Update cart count
   - Update total keranjang
   - Toast notifikasi
   - Terhubung dengan checkout.js
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initKarpet
);


/* =========================================================
   CONFIG
========================================================= */

const CARPET_PRICE =
  13000;

const CART_KEY =
  "shae_cart";


/* =========================================================
   STATE
========================================================= */

let cart = [];


/* =========================================================
   INIT
========================================================= */

function initKarpet() {

  loadCart();

  setupCalculator();

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
   CALCULATOR
========================================================= */

function setupCalculator() {

  const lengthInput =
    document.getElementById(
      "length"
    );


  const widthInput =
    document.getElementById(
      "width"
    );


  const addButton =
    document.getElementById(
      "addCarpet"
    );


  if (
    !lengthInput ||
    !widthInput ||
    !addButton
  ) {

    return;

  }


  lengthInput.addEventListener(
    "input",
    calculateCarpet
  );


  widthInput.addEventListener(
    "input",
    calculateCarpet
  );


  addButton.addEventListener(
    "click",
    addCarpetToCart
  );


  calculateCarpet();

}


/* =========================================================
   CALCULATE CARPET
========================================================= */

function calculateCarpet() {

  const length =
    getNumber(
      "length"
    );


  const width =
    getNumber(
      "width"
    );


  const area =
    length * width;


  const roundedArea =
    Math.round(
      area * 100
    ) / 100;


  const totalPrice =
    Math.round(
      roundedArea *
      CARPET_PRICE
    );


  setText(
    "areaResult",
    `${formatNumber(
      roundedArea
    )} m²`
  );


  setText(
    "priceResult",
    formatRupiah(
      totalPrice
    )
  );


  const button =
    document.getElementById(
      "addCarpet"
    );


  if (button) {

    button.disabled =
      !(
        length > 0 &&
        width > 0 &&
        roundedArea > 0
      );

  }


  return {

    length,

    width,

    area:
      roundedArea,

    price:
      totalPrice

  };

}


/* =========================================================
   ADD CARPET
========================================================= */

function addCarpetToCart() {

  const result =
    calculateCarpet();


  if (
    result.length <= 0 ||
    result.width <= 0 ||
    result.area <= 0
  ) {

    showToast(
      "Masukkan ukuran karpet terlebih dahulu."
    );

    return;

  }


  const name =
    `Cuci Karpet ${formatNumber(
      result.length
    )} × ${formatNumber(
      result.width
    )} m`;


  /*
   * Karpet dengan ukuran dan harga
   * yang sama dianggap item yang sama.
   */

  const existing =
    cart.find(
      item =>

        item.name === name &&

        Number(
          item.price
        ) === Number(
          result.price
        )

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
        "Cuci Karpet",

      price:
        result.price,

      qty:
        1,

      length:
        result.length,

      width:
        result.width,

      area:
        result.area

    });

  }


  saveCart();

  updateCartDisplay();

  showToast(
    `${name} ditambahkan ke keranjang`
  );


  /*
   * Reset ukuran setelah berhasil
   */

  resetCalculator();

}


/* =========================================================
   RESET CALCULATOR
========================================================= */

function resetCalculator() {

  const lengthInput =
    document.getElementById(
      "length"
    );


  const widthInput =
    document.getElementById(
      "width"
    );


  if (lengthInput) {

    lengthInput.value =
      "";

  }


  if (widthInput) {

    widthInput.value =
      "";

  }


  setText(
    "areaResult",
    "0 m²"
  );


  setText(
    "priceResult",
    "Rp0"
  );


  const button =
    document.getElementById(
      "addCarpet"
    );


  if (button) {

    button.disabled =
      true;

  }

}


/* =========================================================
   CREATE ITEM ID
========================================================= */

function createItemId() {

  return (

    "KARPET-" +

    Date.now() +

    "-" +

    Math.random()
      .toString(36)
      .substring(2,8)
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
      ".karpet-toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );


    toast.className =
      "karpet-toast";


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
   FORMAT NUMBER
========================================================= */

function formatNumber(
  value
) {

  return new Intl.NumberFormat(

    "id-ID",

    {

      minimumFractionDigits:
        0,

      maximumFractionDigits:
        2

    }

  ).format(

    Number(value) || 0

  );

}


/* =========================================================
   GET NUMBER
========================================================= */

function getNumber(
  id
) {

  const element =
    document.getElementById(
      id
    );


  if (!element) {

    return 0;

  }


  const value =
    parseFloat(
      element.value
    );


  return Number.isFinite(
    value
  )
    ? value
    : 0;

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