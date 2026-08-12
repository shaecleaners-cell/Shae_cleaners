/* =========================================================
   SHAE CLEANERS
   js/cucisofa.js
   SISTEM ORDER CUCI SOFA
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initCuciSofa
);


/* =========================================================
   CONFIG
========================================================= */

const CART_KEY = "shae_cart";


/* =========================================================
   STATE
========================================================= */

let sofaCart = [];


/* =========================================================
   INIT
========================================================= */

function initCuciSofa() {

  loadCart();

  setupProducts();

  updateAll();

  setupOrderButton();

}


/* =========================================================
   PRODUCT BUTTON
========================================================= */

function setupProducts() {

  const products =
    document.querySelectorAll(
      ".sofa-product"
    );


  products.forEach(
    product => {

      const plus =
        product.querySelector(
          ".qty-plus"
        );


      const minus =
        product.querySelector(
          ".qty-minus"
        );


      if (plus) {

        plus.addEventListener(
          "click",
          function () {

            changeQuantity(
              product,
              1
            );

          }
        );

      }


      if (minus) {

        minus.addEventListener(
          "click",
          function () {

            changeQuantity(
              product,
              -1
            );

          }
        );

      }

    }
  );

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
  product,
  amount
) {

  const id =
    product.dataset.id;


  const name =
    product.dataset.name;


  const price =
    Number(
      product.dataset.price
    );


  let item =
    sofaCart.find(
      item =>
        item.id === id
    );


  /*
   * Tambah item baru
   */

  if (
    !item &&
    amount > 0
  ) {

    item = {

      id,

      name,

      price,

      qty: 0,

      service:
        "Cuci Sofa",

      serviceKey:
        "sofa"

    };


    sofaCart.push(
      item
    );

  }


  /*
   * Ubah quantity
   */

  if (item) {

    item.qty += amount;

  }


  /*
   * Hapus jika quantity 0
   */

  if (
    item &&
    item.qty <= 0
  ) {

    sofaCart =
      sofaCart.filter(
        cartItem =>
          cartItem.id !== id
      );

  }


  saveCart();

  updateProduct(
    product
  );

  updateAll();

}


/* =========================================================
   UPDATE PRODUCT
========================================================= */

function updateProduct(
  product
) {

  const id =
    product.dataset.id;


  const item =
    sofaCart.find(
      item =>
        item.id === id
    );


  const quantity =
    item
      ? item.qty
      : 0;


  const qtyElement =
    product.querySelector(
      ".qty"
    );


  if (qtyElement) {

    qtyElement.textContent =
      quantity;

  }


  product.classList.toggle(
    "selected",
    quantity > 0
  );

}


/* =========================================================
   UPDATE ALL
========================================================= */

function updateAll() {

  updateProducts();

  updateSummary();

  updateBadge();

}


/* =========================================================
   UPDATE PRODUCTS
========================================================= */

function updateProducts() {

  const products =
    document.querySelectorAll(
      ".sofa-product"
    );


  products.forEach(
    product => {

      updateProduct(
        product
      );

    }
  );

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

  const list =
    document.getElementById(
      "summaryList"
    );


  const totalElement =
    document.getElementById(
      "totalPrice"
    );


  const countElement =
    document.getElementById(
      "itemCount"
    );


  const button =
    document.getElementById(
      "orderButton"
    );


  const totalQty =
    sofaCart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.qty,
      0
    );


  const totalPrice =
    sofaCart.reduce(
      (
        total,
        item
      ) =>
        total +
        (
          item.price *
          item.qty
        ),
      0
    );


  /*
   * JUMLAH ITEM
   */

  if (countElement) {

    countElement.textContent =
      `${totalQty} item`;

  }


  /*
   * TOTAL
   */

  if (totalElement) {

    totalElement.textContent =
      formatRupiah(
        totalPrice
      );

  }


  /*
   * BUTTON
   */

  if (button) {

    button.disabled =
      sofaCart.length === 0;

  }


  /*
   * EMPTY
   */

  if (!list) {

    return;

  }


  if (
    sofaCart.length === 0
  ) {

    list.innerHTML = `

      <div class="empty-summary">

        <i
          class="fa-solid fa-cart-shopping"
        ></i>

        <span>
          Belum ada sofa dipilih
        </span>

      </div>

    `;


    return;

  }


  /*
   * ITEMS
   */

  list.innerHTML =
    sofaCart
      .map(
        item => {

          const subtotal =
            item.price *
            item.qty;


          return `

            <div class="summary-item">

              <span class="summary-item-name">

                ${escapeHTML(
                  item.name
                )}

                × ${item.qty}

              </span>


              <span class="summary-item-price">

                ${formatRupiah(
                  subtotal
                )}

              </span>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   BADGE
========================================================= */

function updateBadge() {

  const badge =
    document.getElementById(
      "cartBadge"
    );


  if (!badge) {

    return;

  }


  const count =
    sofaCart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.qty,
      0
    );


  badge.textContent =
    count;


  badge.style.display =
    count > 0
      ? "flex"
      : "none";

}


/* =========================================================
   ORDER BUTTON
========================================================= */

function setupOrderButton() {

  const button =
    document.getElementById(
      "orderButton"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      if (
        sofaCart.length === 0
      ) {

        return;

      }


      saveCart();


      window.location.href =
        "checkout.html";

    }
  );

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

  try {

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(
        sofaCart
      )
    );

  } catch (error) {

    console.error(
      "Gagal menyimpan cart:",
      error
    );

  }

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

      sofaCart = [];

      return;

    }


    const data =
      JSON.parse(
        saved
      );


    if (
      !Array.isArray(data)
    ) {

      sofaCart = [];

      return;

    }


    /*
     * Ambil hanya produk Sofa.
     */

    sofaCart =
      data.filter(
        item =>
          item.serviceKey ===
          "sofa"
      );


  } catch (error) {

    console.error(
      "Gagal membaca cart:",
      error
    );


    sofaCart = [];

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

      style: "currency",

      currency: "IDR",

      maximumFractionDigits: 0

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