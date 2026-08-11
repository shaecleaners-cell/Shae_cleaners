/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/checkout.js
   CART + CUSTOMER + TOTAL + INVOICE
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CART_KEY =
  "shae_cart";

const ORDER_KEY =
  "shae_order";

const INVOICE_KEY =
  "shae_invoice";


/* =========================================================
   ELEMENT
========================================================= */

const checkoutItems =
  document.getElementById(
    "checkoutItems"
  );

const checkoutItemCount =
  document.getElementById(
    "checkoutItemCount"
  );

const emptyCart =
  document.getElementById(
    "emptyCart"
  );

const subtotalElement =
  document.getElementById(
    "subtotal"
  );

const serviceFeeElement =
  document.getElementById(
    "serviceFee"
  );

const discountElement =
  document.getElementById(
    "discount"
  );

const checkoutTotalElement =
  document.getElementById(
    "checkoutTotal"
  );

const bottomCheckoutTotal =
  document.getElementById(
    "bottomCheckoutTotal"
  );

const createOrderButton =
  document.getElementById(
    "createOrderButton"
  );

const customerForm =
  document.getElementById(
    "customerForm"
  );

const customerName =
  document.getElementById(
    "customerName"
  );

const customerPhone =
  document.getElementById(
    "customerPhone"
  );

const customerAddress =
  document.getElementById(
    "customerAddress"
  );

const customerNote =
  document.getElementById(
    "customerNote"
  );

const checkoutToast =
  document.getElementById(
    "checkoutToast"
  );

const checkoutToastText =
  document.getElementById(
    "checkoutToastText"
  );


/* =========================================================
   STATE
========================================================= */

let cart = [];

let subtotal = 0;

let serviceFee = 0;

let discount = 0;

let grandTotal = 0;


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function checkoutFormatRupiah(
  value
) {

  return new Intl.NumberFormat(
    "id-ID",
    {

      style: "currency",

      currency: "IDR",

      minimumFractionDigits: 0

    }
  ).format(
    Number(value) || 0
  );

}


/* =========================================================
   LOAD CART
========================================================= */

function loadCheckoutCart() {

  try {

    cart =
      JSON.parse(
        localStorage.getItem(
          CART_KEY
        )
      ) || [];

  } catch {

    cart = [];

  }


  if (!Array.isArray(cart)) {

    cart = [];

  }


  renderCheckoutItems();

  calculateCheckout();

}


/* =========================================================
   RENDER ITEMS
========================================================= */

function renderCheckoutItems() {

  if (!checkoutItems) return;


  checkoutItems.innerHTML = "";


  const itemCount =
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


  if (checkoutItemCount) {

    checkoutItemCount.textContent =
      `${itemCount} item`;

  }


  if (!cart.length) {

    checkoutItems.style.display =
      "none";


    if (emptyCart) {

      emptyCart.style.display =
        "block";

    }


    if (createOrderButton) {

      createOrderButton.disabled =
        true;

    }


    return;

  }


  checkoutItems.style.display =
    "flex";


  if (emptyCart) {

    emptyCart.style.display =
      "none";

  }


  if (createOrderButton) {

    createOrderButton.disabled =
      false;

  }


  cart.forEach(
    (
      item,
      index
    ) => {

      const element =
        document.createElement(
          "div"
        );


      element.className =
        "checkout-item";


      const image =
        item.image ||
        "assets/logo.png";


      const price =
        Number(
          item.price || 0
        );


      const qty =
        Number(
          item.qty || 1
        );


      const total =
        price * qty;


      element.innerHTML = `

        <div class="checkout-item-image">

          <img
            src="${image}"
            alt="${escapeHTML(
              item.name || "Layanan"
            )}"
            onerror="
              this.style.display='none';
            "
          >

        </div>


        <div class="checkout-item-info">

          <span class="checkout-item-category">

            ${escapeHTML(
              item.category || "Layanan"
            )}

          </span>


          <div class="checkout-item-name">

            ${escapeHTML(
              item.name || "Layanan"
            )}

          </div>


          <div class="checkout-item-variant">

            ${escapeHTML(
              item.variant || ""
            )}

          </div>


          <div class="checkout-item-price">

            ${checkoutFormatRupiah(
              total
            )}

          </div>

        </div>


        <div class="checkout-item-side">

          <button
            type="button"
            class="remove-item"
            data-index="${index}"
            aria-label="Hapus"
          >

            <i class="fa-solid fa-trash"></i>

          </button>


          <span class="item-qty">

            ${qty}x

          </span>

        </div>

      `;


      checkoutItems.appendChild(
        element
      );

    }
  );


  bindRemoveButtons();

}


/* =========================================================
   REMOVE BUTTON
========================================================= */

function bindRemoveButtons() {

  document
    .querySelectorAll(
      ".remove-item"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.index
              );


            removeCartItem(
              index
            );

          }
        );

      }
    );

}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeCartItem(
  index
) {

  if (
    index < 0 ||
    index >= cart.length
  ) {

    return;

  }


  const removed =
    cart[index];


  cart.splice(
    index,
    1
  );


  saveCart();


  renderCheckoutItems();

  calculateCheckout();


  showCheckoutToast(
    `${removed.name || "Layanan"} dihapus`
  );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

  localStorage.setItem(

    CART_KEY,

    JSON.stringify(cart)

  );


  if (
    typeof updateCartCount ===
    "function"
  ) {

    updateCartCount();

  }

}


/* =========================================================
   CALCULATE
========================================================= */

function calculateCheckout() {

  subtotal =
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
            item.qty || 1
          )
        ),
      0
    );


  /*
    Untuk versi sederhana,
    biaya layanan dibuat Rp0.

    Bisa diubah nanti menjadi
    biaya berdasarkan jarak.
  */

  serviceFee = 0;


  /*
    Promo otomatis.

    Contoh:
    Rp350.000 ke atas
    mendapatkan diskon 17%.

    Rp500.000 ke atas
    tambahan diskon 8%.

    Total maksimal diskon:
    25%.
  */

  discount = 0;


  if (subtotal >= 350000) {

    discount +=
      Math.round(
        subtotal * 0.17
      );

  }


  if (subtotal >= 500000) {

    discount +=
      Math.round(
        subtotal * 0.08
      );

  }


  grandTotal =
    subtotal +
    serviceFee -
    discount;


  if (grandTotal < 0) {

    grandTotal = 0;

  }


  updateCheckoutPrice();

}


/* =========================================================
   UPDATE PRICE
========================================================= */

function updateCheckoutPrice() {

  if (subtotalElement) {

    subtotalElement.textContent =
      checkoutFormatRupiah(
        subtotal
      );

  }


  if (serviceFeeElement) {

    serviceFeeElement.textContent =
      checkoutFormatRupiah(
        serviceFee
      );

  }


  if (discountElement) {

    discountElement.textContent =
      `- ${checkoutFormatRupiah(
        discount
      )}`;

  }


  if (checkoutTotalElement) {

    checkoutTotalElement.textContent =
      checkoutFormatRupiah(
        grandTotal
      );

  }


  if (bottomCheckoutTotal) {

    bottomCheckoutTotal.textContent =
      checkoutFormatRupiah(
        grandTotal
      );

  }

}


/* =========================================================
   PHONE NORMALIZE
========================================================= */

function normalizePhone(
  phone
) {

  let value =
    String(phone || "")
      .replace(
        /\D/g,
        ""
      );


  if (
    value.startsWith(
      "0"
    )
  ) {

    value =
      "62" +
      value.substring(
        1
      );

  }


  if (
    !value.startsWith(
      "62"
    )
  ) {

    value =
      "62" +
      value;

  }


  return value;

}


/* =========================================================
   VALIDATE PHONE
========================================================= */

function validPhone(
  phone
) {

  const normalized =
    normalizePhone(
      phone
    );


  return (
    normalized.length >= 10 &&
    normalized.length <= 15
  );

}


/* =========================================================
   CREATE INVOICE NUMBER
========================================================= */

function generateInvoiceNumber() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );


  let sequence =
    Number(
      localStorage.getItem(
        "shae_invoice_sequence"
      )
    ) || 0;


  sequence++;


  localStorage.setItem(

    "shae_invoice_sequence",

    String(sequence)

  );


  return (

    `INV-${year}${month}${day}-` +

    String(sequence)
      .padStart(
        3,
        "0"
      )

  );

}


/* =========================================================
   CREATE ORDER
========================================================= */

if (createOrderButton) {

  createOrderButton.addEventListener(
    "click",
    createOrder
  );

}


function createOrder() {

  if (!cart.length) {

    showCheckoutToast(
      "Pesanan masih kosong."
    );

    return;

  }


  /*
    Validasi form
  */

  if (
    customerForm &&
    !customerForm.checkValidity()
  ) {

    customerForm.reportValidity();

    return;

  }


  const name =
    customerName
      ? customerName.value.trim()
      : "";


  const phone =
    customerPhone
      ? customerPhone.value.trim()
      : "";


  const address =
    customerAddress
      ? customerAddress.value.trim()
      : "";


  const note =
    customerNote
      ? customerNote.value.trim()
      : "";


  if (
    !name ||
    !phone ||
    !address
  ) {

    showCheckoutToast(
      "Lengkapi data pelanggan."
    );

    return;

  }


  if (!validPhone(phone)) {

    showCheckoutToast(
      "Nomor WhatsApp tidak valid."
    );

    return;

  }


  const invoiceNumber =
    generateInvoiceNumber();


  const orderDate =
    new Date()
      .toISOString();


  /*
    Salin cart supaya data
    tidak berubah jika cart
    nanti dihapus.
  */

  const orderItems =
    cart.map(
      item => ({
        ...item
      })
    );


  const order = {

    invoice:
      invoiceNumber,

    orderDate:
      orderDate,

    status:
      "Menunggu Konfirmasi",

    customer: {

      name:
        name,

      phone:
        normalizePhone(
          phone
        ),

      phoneOriginal:
        phone,

      address:
        address,

      note:
        note

    },

    items:
      orderItems,

    subtotal:
      subtotal,

    serviceFee:
      serviceFee,

    discount:
      discount,

    total:
      grandTotal

  };


  /*
    Simpan order
  */

  localStorage.setItem(

    ORDER_KEY,

    JSON.stringify(
      order
    )

  );


  localStorage.setItem(

    INVOICE_KEY,

    JSON.stringify(
      order
    )

  );


  /*
    Jangan langsung hapus cart.
    Invoice akan membacanya jika
    diperlukan.

    Tandai bahwa order berhasil.
  */

  localStorage.setItem(

    "shae_order_created",

    "true"

  );


  /*
    Pindah ke invoice.
  */

  window.location.href =
    `invoice.html?invoice=${encodeURIComponent(
      invoiceNumber
    )}`;

}


/* =========================================================
   TOAST
========================================================= */

function showCheckoutToast(
  message
) {

  if (
    !checkoutToast ||
    !checkoutToastText
  ) {

    alert(message);

    return;

  }


  checkoutToastText.textContent =
    message;


  checkoutToast.classList.add(
    "show"
  );


  clearTimeout(
    window.checkoutToastTimer
  );


  window.checkoutToastTimer =
    setTimeout(
      () => {

        checkoutToast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   RESTORE CUSTOMER DATA
========================================================= */

function restoreCustomerData() {

  const saved =
    localStorage.getItem(
      "shae_customer"
    );


  if (!saved) return;


  try {

    const data =
      JSON.parse(
        saved
      );


    if (
      customerName &&
      data.name
    ) {

      customerName.value =
        data.name;

    }


    if (
      customerPhone &&
      data.phone
    ) {

      customerPhone.value =
        data.phone;

    }


    if (
      customerAddress &&
      data.address
    ) {

      customerAddress.value =
        data.address;

    }

  } catch {

    return;

  }

}


/* =========================================================
   SAVE CUSTOMER DATA
========================================================= */

function saveCustomerData() {

  const data = {

    name:
      customerName
        ? customerName.value.trim()
        : "",

    phone:
      customerPhone
        ? customerPhone.value.trim()
        : "",

    address:
      customerAddress
        ? customerAddress.value.trim()
        : ""

  };


  localStorage.setItem(

    "shae_customer",

    JSON.stringify(
      data
    )

  );

}


/* =========================================================
   AUTO SAVE CUSTOMER
========================================================= */

[
  customerName,
  customerPhone,
  customerAddress
].forEach(
  input => {

    if (!input) return;


    input.addEventListener(
      "input",
      saveCustomerData
    );

  }
);


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    restoreCustomerData();

    loadCheckoutCart();

  }
);