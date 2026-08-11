/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/cart.js
   SHOPPING CART SYSTEM
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CART_STORAGE_KEY = "shae_cart";

const CART_PROMO_KEY = "shae_promo";


/* =========================================================
   ELEMENTS
========================================================= */

const cartEmpty =
  document.getElementById("cartEmpty");

const cartContent =
  document.getElementById("cartContent");

const cartItems =
  document.getElementById("cartItems");

const selectAllCart =
  document.getElementById("selectAllCart");

const deleteSelected =
  document.getElementById("deleteSelected");

const cartSubtotal =
  document.getElementById("cartSubtotal");

const cartDiscountRow =
  document.getElementById("cartDiscountRow");

const cartDiscount =
  document.getElementById("cartDiscount");

const cartTotal =
  document.getElementById("cartTotal");

const bottomTotal =
  document.getElementById("bottomTotal");

const checkoutButton =
  document.getElementById("checkoutButton");

const promoCode =
  document.getElementById("promoCode");

const applyPromo =
  document.getElementById("applyPromo");

const promoMessage =
  document.getElementById("promoMessage");

const cartToast =
  document.getElementById("cartToast");

const cartToastText =
  document.getElementById("cartToastText");


/* =========================================================
   STATE
========================================================= */

let cart = [];

let activePromo = null;


/* =========================================================
   PROMO DATABASE
========================================================= */

const PROMO_LIST = {

  "SHAE10": {

    code: "SHAE10",

    type: "percent",

    value: 10,

    minOrder: 0,

    description:
      "Diskon 10%"

  },


  "SHAE17": {

    code: "SHAE17",

    type: "percent",

    value: 17,

    minOrder: 350000,

    description:
      "Diskon 17% minimal Rp350.000"

  },


  "SHAE25": {

    code: "SHAE25",

    type: "percent",

    value: 25,

    minOrder: 500000,

    description:
      "Diskon 25% minimal Rp500.000"

  }

};


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initCart
);


function initCart() {

  loadCart();

  loadPromo();

  renderCart();

  setupCartEvents();

}


/* =========================================================
   LOAD CART
========================================================= */

function loadCart() {

  try {

    const saved =
      localStorage.getItem(
        CART_STORAGE_KEY
      );


    cart =
      saved
        ? JSON.parse(saved)
        : [];


    if (
      !Array.isArray(cart)
    ) {

      cart = [];

    }

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
    CART_STORAGE_KEY,
    JSON.stringify(cart)
  );

}


/* =========================================================
   LOAD PROMO
========================================================= */

function loadPromo() {

  try {

    const saved =
      localStorage.getItem(
        CART_PROMO_KEY
      );


    if (saved) {

      activePromo =
        JSON.parse(
          saved
        );


      if (
        promoCode &&
        activePromo.code
      ) {

        promoCode.value =
          activePromo.code;

      }

    }

  } catch {

    activePromo = null;

  }

}


/* =========================================================
   SAVE PROMO
========================================================= */

function savePromo() {

  if (activePromo) {

    localStorage.setItem(
      CART_PROMO_KEY,
      JSON.stringify(
        activePromo
      )
    );

  } else {

    localStorage.removeItem(
      CART_PROMO_KEY
    );

  }

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  if (!cart.length) {

    showEmptyCart();

    return;

  }


  showCartContent();


  if (!cartItems) {

    return;

  }


  cartItems.innerHTML = "";


  cart.forEach(
    (item, index) => {

      cartItems.appendChild(
        createCartItem(
          item,
          index
        )
      );

    }
  );


  updateSelectAll();

  updateSummary();

}


/* =========================================================
   EMPTY
========================================================= */

function showEmptyCart() {

  if (cartEmpty) {

    cartEmpty.style.display =
      "flex";

  }


  if (cartContent) {

    cartContent.style.display =
      "none";

  }

}


/* =========================================================
   SHOW CONTENT
========================================================= */

function showCartContent() {

  if (cartEmpty) {

    cartEmpty.style.display =
      "none";

  }


  if (cartContent) {

    cartContent.style.display =
      "block";

  }

}


/* =========================================================
   CREATE CART ITEM
========================================================= */

function createCartItem(
  item,
  index
) {

  const wrapper =
    document.createElement(
      "article"
    );


  wrapper.className =
    "cart-item";


  const imageHTML =
    item.image

      ? `

        <img
          src="${escapeHTML(
            item.image
          )}"
          alt="${escapeHTML(
            item.name
          )}"
          onerror="
            this.style.display='none';
            this.parentElement.innerHTML='<i class=&quot;fa-solid fa-spray-can-sparkles&quot;></i>';
          "
        >

      `

      : `

        <i class="fa-solid fa-spray-can-sparkles"></i>

      `;


  const dateText =
    item.date
      ? formatDate(
          item.date
        )
      : "Belum pilih tanggal";


  const timeText =
    item.time
      ? item.time
      : "Belum pilih jam";


  wrapper.innerHTML = `

    <div class="cart-item-check">

      <input
        type="checkbox"
        class="item-checkbox"
        data-index="${index}"
        ${item.selected !== false ? "checked" : ""}
      >

    </div>


    <div class="cart-item-image">

      ${imageHTML}

    </div>


    <div class="cart-item-info">

      <div class="cart-item-name">

        ${escapeHTML(
          item.name || "Layanan"
        )}

      </div>


      <div class="cart-item-variant">

        ${escapeHTML(
          item.variant || "-"
        )}

      </div>


      <div class="cart-item-schedule">

        <i class="fa-regular fa-calendar"></i>

        ${escapeHTML(
          dateText
        )}

        &nbsp; • &nbsp;

        <i class="fa-regular fa-clock"></i>

        ${escapeHTML(
          timeText
        )}

      </div>


      <div class="cart-item-price">

        ${formatRupiah(
          Number(item.price || 0)
        )}

      </div>

    </div>


    <div class="cart-item-footer">


      <button
        type="button"
        class="cart-item-delete"
        data-delete="${index}"
        aria-label="Hapus"
      >

        <i class="fa-regular fa-trash-can"></i>

      </button>


      <div class="cart-quantity">


        <button
          type="button"
          class="cart-qty-button"
          data-minus="${index}"
        >

          <i class="fa-solid fa-minus"></i>

        </button>


        <span class="cart-qty-value">

          ${Number(
            item.qty || 1
          )}

        </span>


        <button
          type="button"
          class="cart-qty-button"
          data-plus="${index}"
        >

          <i class="fa-solid fa-plus"></i>

        </button>


      </div>


      <strong>

        ${formatRupiah(
          Number(item.price || 0) *
          Number(item.qty || 1)
        )}

      </strong>


    </div>

  `;


  return wrapper;

}


/* =========================================================
   EVENTS
========================================================= */

function setupCartEvents() {


  /* -----------------------------------------
     SELECT ALL
  ----------------------------------------- */

  if (selectAllCart) {

    selectAllCart.addEventListener(
      "change",
      () => {

        const checked =
          selectAllCart.checked;


        cart.forEach(
          item => {

            item.selected =
              checked;

          }
        );


        saveCart();

        renderCart();

      }
    );

  }


  /* -----------------------------------------
     DELETE SELECTED
  ----------------------------------------- */

  if (deleteSelected) {

    deleteSelected.addEventListener(
      "click",
      deleteSelectedItems
    );

  }


  /* -----------------------------------------
     CART ITEM ACTION
  ----------------------------------------- */

  if (cartItems) {

    cartItems.addEventListener(
      "click",
      handleCartItemClick
    );


    cartItems.addEventListener(
      "change",
      handleCartCheckbox
    );

  }


  /* -----------------------------------------
     PROMO
  ----------------------------------------- */

  if (applyPromo) {

    applyPromo.addEventListener(
      "click",
      applyPromoCode
    );

  }


  /* -----------------------------------------
     CHECKOUT
  ----------------------------------------- */

  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      goToCheckout
    );

  }

}


/* =========================================================
   ITEM CLICK
========================================================= */

function handleCartItemClick(
  event
) {

  const minus =
    event.target.closest(
      "[data-minus]"
    );


  const plus =
    event.target.closest(
      "[data-plus]"
    );


  const deleteButton =
    event.target.closest(
      "[data-delete]"
    );


  if (minus) {

    changeQuantity(
      Number(
        minus.dataset.minus
      ),
      -1
    );

    return;

  }


  if (plus) {

    changeQuantity(
      Number(
        plus.dataset.plus
      ),
      1
    );

    return;

  }


  if (deleteButton) {

    deleteItem(
      Number(
        deleteButton.dataset.delete
      )
    );

  }

}


/* =========================================================
   CHECKBOX
========================================================= */

function handleCartCheckbox(
  event
) {

  if (
    !event.target.classList.contains(
      "item-checkbox"
    )
  ) {

    return;

  }


  const index =
    Number(
      event.target.dataset.index
    );


  if (
    !cart[index]
  ) {

    return;

  }


  cart[index].selected =
    event.target.checked;


  saveCart();

  updateSelectAll();

  updateSummary();

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
  index,
  amount
) {

  if (
    !cart[index]
  ) {

    return;

  }


  let qty =
    Number(
      cart[index].qty || 1
    );


  qty += amount;


  if (
    qty < 1
  ) {

    qty = 1;

  }


  if (
    qty > 99
  ) {

    qty = 99;

  }


  cart[index].qty =
    qty;


  cart[index].total =
    Number(
      cart[index].price || 0
    ) * qty;


  saveCart();

  renderCart();

}


/* =========================================================
   DELETE ITEM
========================================================= */

function deleteItem(
  index
) {

  if (
    !cart[index]
  ) {

    return;

  }


  const name =
    cart[index].name ||
    "Pesanan";


  cart.splice(
    index,
    1
  );


  saveCart();


  showToast(
    `${name} dihapus dari keranjang.`
  );


  renderCart();

}


/* =========================================================
   DELETE SELECTED
========================================================= */

function deleteSelectedItems() {

  const selected =
    cart.filter(
      item =>
        item.selected !== false
    );


  if (!selected.length) {

    showToast(
      "Belum ada pesanan yang dipilih."
    );

    return;

  }


  cart =
    cart.filter(
      item =>
        item.selected === false
    );


  saveCart();

  showToast(
    "Pesanan yang dipilih berhasil dihapus."
  );


  renderCart();

}


/* =========================================================
   SELECT ALL STATE
========================================================= */

function updateSelectAll() {

  if (
    !selectAllCart ||
    !cart.length
  ) {

    return;

  }


  const selectedCount =
    cart.filter(
      item =>
        item.selected !== false
    ).length;


  selectAllCart.checked =
    selectedCount === cart.length;


  selectAllCart.indeterminate =
    selectedCount > 0 &&
    selectedCount < cart.length;

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

  const selectedItems =
    cart.filter(
      item =>
        item.selected !== false
    );


  const subtotal =
    selectedItems.reduce(
      (
        total,
        item
      ) => {

        return total +
          (
            Number(
              item.price || 0
            ) *
            Number(
              item.qty || 1
            )
          );

      },
      0
    );


  const discount =
    calculateDiscount(
      subtotal
    );


  const total =
    Math.max(
      0,
      subtotal - discount
    );


  if (cartSubtotal) {

    cartSubtotal.textContent =
      formatRupiah(
        subtotal
      );

  }


  if (cartDiscount) {

    cartDiscount.textContent =
      `-${formatRupiah(
        discount
      )}`;

  }


  if (cartTotal) {

    cartTotal.textContent =
      formatRupiah(
        total
      );

  }


  if (bottomTotal) {

    bottomTotal.textContent =
      formatRupiah(
        total
      );

  }


  if (
    cartDiscountRow
  ) {

    cartDiscountRow.style.display =
      discount > 0
        ? "flex"
        : "none";

  }

}


/* =========================================================
   CALCULATE DISCOUNT
========================================================= */

function calculateDiscount(
  subtotal
) {

  if (
    !activePromo
  ) {

    return 0;

  }


  if (
    subtotal <
    Number(
      activePromo.minOrder || 0
    )
  ) {

    return 0;

  }


  if (
    activePromo.type ===
    "percent"
  ) {

    return Math.round(
      subtotal *
      (
        Number(
          activePromo.value
        ) / 100
      )
    );

  }


  if (
    activePromo.type ===
    "fixed"
  ) {

    return Math.min(
      subtotal,
      Number(
        activePromo.value
      )
    );

  }


  return 0;

}


/* =========================================================
   APPLY PROMO
========================================================= */

function applyPromoCode() {

  if (!promoCode) {

    return;

  }


  const code =
    promoCode.value
      .trim()
      .toUpperCase();


  if (!code) {

    activePromo = null;

    savePromo();

    showPromoMessage(
      "Masukkan kode promo terlebih dahulu.",
      "error"
    );

    updateSummary();

    return;

  }


  const promo =
    PROMO_LIST[code];


  if (!promo) {

    activePromo = null;

    savePromo();

    showPromoMessage(
      "Kode promo tidak ditemukan.",
      "error"
    );

    updateSummary();

    return;

  }


  const subtotal =
    calculateSelectedSubtotal();


  if (
    subtotal <
    promo.minOrder
  ) {

    activePromo = null;

    savePromo();

    showPromoMessage(
      `${promo.description}. Subtotal saat ini ${formatRupiah(subtotal)}.`,
      "error"
    );

    updateSummary();

    return;

  }


  activePromo =
    promo;


  savePromo();


  showPromoMessage(
    `${promo.description} berhasil digunakan.`,
    "success"
  );


  updateSummary();

}


/* =========================================================
   SUBTOTAL
========================================================= */

function calculateSelectedSubtotal() {

  return cart
    .filter(
      item =>
        item.selected !== false
    )
    .reduce(
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

}


/* =========================================================
   PROMO MESSAGE
========================================================= */

function showPromoMessage(
  message,
  type
) {

  if (!promoMessage) {

    return;

  }


  promoMessage.textContent =
    message;


  promoMessage.className =
    `promo-message ${type}`;

}


/* =========================================================
   CHECKOUT
========================================================= */

function goToCheckout() {

  const selectedItems =
    cart.filter(
      item =>
        item.selected !== false
    );


  if (!selectedItems.length) {

    showToast(
      "Pilih minimal satu pesanan."
    );

    return;

  }


  /*
    Simpan hanya item yang
    dipilih customer untuk checkout.
  */

  localStorage.setItem(
    "shae_checkout_cart",
    JSON.stringify(
      selectedItems
    )
  );


  /*
    Simpan promo yang aktif.
  */

  if (activePromo) {

    localStorage.setItem(
      "shae_checkout_promo",
      JSON.stringify(
        activePromo
      )
    );

  } else {

    localStorage.removeItem(
      "shae_checkout_promo"
    );

  }


  window.location.href =
    "checkout.html";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  dateString
) {

  if (!dateString) {

    return "-";

  }


  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return dateString;

  }


  return new Intl.DateTimeFormat(
    "id-ID",
    {

      day: "2-digit",

      month: "short",

      year: "numeric"

    }
  ).format(
    date
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

      minimumFractionDigits:
        0

    }
  ).format(
    Number(value) || 0
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
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
   TOAST
========================================================= */

function showToast(
  message
) {

  if (
    !cartToast ||
    !cartToastText
  ) {

    alert(message);

    return;

  }


  cartToastText.textContent =
    message;


  cartToast.classList.add(
    "show"
  );


  clearTimeout(
    window.cartToastTimer
  );


  window.cartToastTimer =
    setTimeout(
      () => {

        cartToast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   STORAGE SYNC
========================================================= */

window.addEventListener(
  "storage",
  event => {

    if (
      event.key ===
      CART_STORAGE_KEY
    ) {

      loadCart();

      renderCart();

    }

  }
);