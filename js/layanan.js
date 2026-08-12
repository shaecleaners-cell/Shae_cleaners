/* =========================================================
   SHAE CLEANERS
   js/Layanan.js
   UNIVERSAL SERVICE PAGE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initLayanan
);


/* =========================================================
   DATA LAYANAN
========================================================= */

const layananData = {

  sofa: {

    name: "Cuci Sofa",

    icon: "assets/icons/sofa.png",

    description:
      "Bersihkan sofa dari debu, noda, kotoran dan tungau agar kembali bersih dan nyaman.",

    promo:
      "Promo khusus Cuci Sofa tersedia",

    products: [

      {
        id: "sofa-standard",
        name: "Sofa Standard",
        detail: "Harga per seater",
        price: 60000
      },

      {
        id: "sofa-lepasan",
        name: "Sofa Lepasan",
        detail: "Harga per seater",
        price: 75000
      },

      {
        id: "sofa-besar",
        name: "Sofa Besar",
        detail: "Harga per seater",
        price: 75000
      },

      {
        id: "sofa-stoll",
        name: "Sofa Stoll",
        detail: "Harga per seat",
        price: 50000
      },

      {
        id: "sofa-l-standard",
        name: "Sofa L Standard",
        detail: "Harga per set",
        price: 250000
      },

      {
        id: "sofa-l-big",
        name: "Sofa L BIG",
        detail: "Harga per set",
        price: 300000
      },

      {
        id: "sofa-u",
        name: "Sofa U",
        detail: "Harga per set",
        price: 350000
      }

    ]

  },


  /* =====================================================
     KASUR
  ===================================================== */

  kasur: {

    name: "Cuci Kasur",

    icon: "assets/icons/kasur.png",

    description:
      "Deep cleaning springbed untuk membantu membersihkan debu, noda dan kotoran.",

    promo:
      "Springbed bersih, tidur lebih nyaman",

    products: [

      {
        id: "kasur-mini",
        name: "Springbed Mini Single",
        detail: "1 kasur",
        price: 150000
      },

      {
        id: "kasur-single",
        name: "Springbed Single",
        detail: "1 kasur",
        price: 180000
      },

      {
        id: "kasur-queen",
        name: "Springbed Queen",
        detail: "1 kasur",
        price: 270000
      },

      {
        id: "kasur-king",
        name: "Springbed King",
        detail: "1 kasur",
        price: 290000
      },

      {
        id: "kasur-super-king",
        name: "Springbed Super King",
        detail: "1 kasur",
        price: 310000
      }

    ]

  },


  /* =====================================================
     JOK MOBIL
  ===================================================== */

  jokmobil: {

    name: "Cuci Jok Mobil",

    icon: "assets/icons/jokmobil.png",

    description:
      "Cleaning jok dan interior mobil agar lebih bersih, segar dan nyaman.",

    promo:
      "Jok mobil bersih, perjalanan lebih nyaman",

    products: [

      {
        id: "jok-2baris",
        name: "Paket Jok Mobil 2 Baris",
        detail: "Jok saja",
        price: 250000
      },

      {
        id: "interior-2baris",
        name: "Paket Interior Mobil 2 Baris",
        detail: "Jok + interior",
        price: 400000
      },

      {
        id: "jok-3baris",
        name: "Paket Jok Mobil 3 Baris",
        detail: "Jok saja",
        price: 350000
      }

    ]

  },


  /* =====================================================
     KARPET
  ===================================================== */

  karpet: {

    name: "Cuci Karpet",

    icon: "assets/icons/karpet.png",

    description:
      "Cuci karpet untuk membantu menghilangkan debu, kotoran dan bau.",

    promo:
      "Harga mulai Rp13.000 / m²",

    products: [

      {
        id: "karpet-meter",
        name: "Cuci Karpet",
        detail: "Harga per m²",
        price: 13000
      }

    ]

  },


  /* =====================================================
     KURSI
  ===================================================== */

  kursi: {

    name: "Cuci Kursi",

    icon: "assets/icons/kursi.png",

    description:
      "Bersihkan kursi makan, kursi kantor dan berbagai jenis upholstery.",

    promo:
      "Kursi bersih dan lebih nyaman",

    products: [

      {
        id: "kursi-makan-small",
        name: "Kursi Makan Small",
        detail: "1 kursi",
        price: 30000
      },

      {
        id: "kursi-makan-standard",
        name: "Kursi Makan Standard",
        detail: "1 kursi",
        price: 35000
      },

      {
        id: "kursi-kantor-small",
        name: "Kursi Kantor Small",
        detail: "1 kursi",
        price: 30000
      },

      {
        id: "kursi-kantor-big",
        name: "Kursi Kantor BIG",
        detail: "1 kursi",
        price: 40000
      }

    ]

  },


  /* =====================================================
     GORDEN
  ===================================================== */

  gorden: {

    name: "Cuci Gorden",

    icon: "assets/icons/gorden.png",

    description:
      "Membersihkan gorden dari debu dan kotoran agar kembali segar.",

    promo:
      "Gorden bersih, ruangan lebih nyaman",

    products: [

      {
        id: "gorden",
        name: "Cuci Gorden",
        detail: "Harga menyesuaikan ukuran",
        price: 0
      }

    ]

  },


  /* =====================================================
     AC
  ===================================================== */

  ac: {

    name: "Cuci AC",

    icon: "assets/icons/ac.png",

    description:
      "Perawatan dan pembersihan AC untuk membantu menjaga kebersihan unit.",

    promo:
      "AC lebih bersih dan nyaman",

    products: [

      {
        id: "ac-standard",
        name: "Cuci AC Standard",
        detail: "1 unit",
        price: 0
      }

    ]

  },


  /* =====================================================
     HOME CLEANING
  ===================================================== */

  "home-cleaning": {

    name: "Home Cleaning",

    icon: "assets/icons/home-cleaning.png",

    description:
      "Layanan cleaning untuk membantu menjaga kebersihan rumah.",

    promo:
      "Rumah bersih, aktivitas lebih nyaman",

    products: [

      {
        id: "home-cleaning",
        name: "Home Cleaning",
        detail: "Harga berdasarkan kebutuhan",
        price: 0
      }

    ]

  }

};


/* =========================================================
   STATE
========================================================= */

let currentService = null;

let cart = [];


/* =========================================================
   INIT
========================================================= */

function initLayanan() {

  currentService =
    getServiceFromURL();


  if (
    !currentService ||
    !layananData[currentService]
  ) {

    showInvalidService();

    return;

  }


  renderService();

  loadCart();

  updateCartBadge();

  updateSummary();

  setupOrderButton();

}


/* =========================================================
   GET SERVICE
========================================================= */

function getServiceFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return (
    params.get("service") || ""
  )
    .toLowerCase()
    .trim();

}


/* =========================================================
   RENDER SERVICE
========================================================= */

function renderService() {

  const data =
    layananData[currentService];


  const headerName =
    document.getElementById(
      "headerServiceName"
    );


  const name =
    document.getElementById(
      "serviceName"
    );


  const icon =
    document.getElementById(
      "serviceIcon"
    );


  const description =
    document.getElementById(
      "serviceDescription"
    );


  const promo =
    document.getElementById(
      "servicePromo"
    );


  if (headerName) {

    headerName.textContent =
      data.name;

  }


  if (name) {

    name.textContent =
      data.name;

  }


  if (icon) {

    icon.src =
      data.icon;

    icon.alt =
      data.name;

  }


  if (description) {

    description.textContent =
      data.description;

  }


  if (promo) {

    promo.textContent =
      data.promo;

  }


  renderProducts(
    data.products
  );

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(
  products
) {

  const container =
    document.getElementById(
      "serviceProducts"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    products
      .map(
        product =>
          createProductHTML(
            product
          )
      )
      .join("");


  products.forEach(
    product => {

      const plus =
        document.querySelector(
          `[data-plus="${product.id}"]`
        );


      const minus =
        document.querySelector(
          `[data-minus="${product.id}"]`
        );


      if (plus) {

        plus.addEventListener(
          "click",
          () => {

            changeQuantity(
              product.id,
              1
            );

          }
        );

      }


      if (minus) {

        minus.addEventListener(
          "click",
          () => {

            changeQuantity(
              product.id,
              -1
            );

          }
        );

      }

    }
  );

}


/* =========================================================
   PRODUCT HTML
========================================================= */

function createProductHTML(
  product
) {

  const item =
    cart.find(
      item =>
        item.id === product.id
    );


  const quantity =
    item
      ? item.qty
      : 0;


  return `

    <div
      class="service-product ${
        quantity > 0
          ? "selected"
          : ""
      }"
      id="product-${product.id}"
    >

      <div class="product-icon">

        <i class="fa-solid fa-spray-can-sparkles"></i>

      </div>


      <div class="product-info">

        <strong>
          ${escapeHTML(product.name)}
        </strong>

        <small>
          ${escapeHTML(product.detail)}
        </small>

        <div class="product-price">

          ${
            product.price > 0
              ? formatRupiah(product.price)
              : "Hubungi Admin"
          }

        </div>

      </div>


      <div class="product-controls">

        <button
          type="button"
          class="qty-button"
          data-minus="${product.id}"
          aria-label="Kurangi"
        >

          <i class="fa-solid fa-minus"></i>

        </button>


        <span
          class="qty-value"
          id="qty-${product.id}"
        >
          ${quantity}
        </span>


        <button
          type="button"
          class="qty-button"
          data-plus="${product.id}"
          aria-label="Tambah"
        >

          <i class="fa-solid fa-plus"></i>

        </button>

      </div>

    </div>

  `;

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
  productId,
  amount
) {

  const product =
    layananData[currentService]
      .products
      .find(
        item =>
          item.id === productId
      );


  if (!product) {

    return;

  }


  let item =
    cart.find(
      item =>
        item.id === productId
    );


  if (!item) {

    if (amount <= 0) {

      return;

    }


    item = {

      id: product.id,

      name: product.name,

      detail: product.detail,

      price: product.price,

      qty: 0,

      service:
        layananData[
          currentService
        ].name,

      serviceKey:
        currentService

    };


    cart.push(item);

  }


  item.qty += amount;


  if (item.qty <= 0) {

    cart =
      cart.filter(
        cartItem =>
          cartItem.id !==
          productId
      );

  }


  saveCart();

  updateProductUI(
    productId
  );

  updateSummary();

  updateCartBadge();

}


/* =========================================================
   UPDATE PRODUCT UI
========================================================= */

function updateProductUI(
  productId
) {

  const item =
    cart.find(
      item =>
        item.id === productId
    );


  const quantity =
    item
      ? item.qty
      : 0;


  const qtyElement =
    document.getElementById(
      `qty-${productId}`
    );


  const productElement =
    document.getElementById(
      `product-${productId}`
    );


  if (qtyElement) {

    qtyElement.textContent =
      quantity;

  }


  if (productElement) {

    productElement.classList.toggle(
      "selected",
      quantity > 0
    );

  }

}


/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {

  const summaryItems =
    document.getElementById(
      "summaryItems"
    );


  const summaryCount =
    document.getElementById(
      "summaryCount"
    );


  const summaryTotal =
    document.getElementById(
      "summaryTotal"
    );


  const orderButton =
    document.getElementById(
      "orderButton"
    );


  const totalQty =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        item.qty,
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
          item.price *
          item.qty
        ),
      0
    );


  if (summaryCount) {

    summaryCount.textContent =
      `${totalQty} item`;

  }


  if (summaryTotal) {

    summaryTotal.textContent =
      formatRupiah(
        totalPrice
      );

  }


  if (orderButton) {

    orderButton.disabled =
      cart.length === 0;

  }


  if (!summaryItems) {

    return;

  }


  if (
    cart.length === 0
  ) {

    summaryItems.innerHTML = `

      <div class="summary-empty">

        <i class="fa-solid fa-cart-shopping"></i>

        <span>
          Belum ada layanan dipilih
        </span>

      </div>

    `;


    return;

  }


  summaryItems.innerHTML =
    cart
      .map(
        item => {

          const subtotal =
            item.price *
            item.qty;


          return `

            <div class="summary-item">

              <span class="summary-item-name">

                ${escapeHTML(item.name)}

                × ${item.qty}

              </span>

              <span class="summary-item-price">

                ${
                  item.price > 0
                    ? formatRupiah(subtotal)
                    : "Konfirmasi"
                }

              </span>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   CART BADGE
========================================================= */

function updateCartBadge() {

  const badge =
    document.getElementById(
      "cartBadge"
    );


  if (!badge) {

    return;

  }


  const count =
    cart.reduce(
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
    () => {

      if (
        cart.length === 0
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

  localStorage.setItem(
    "shae_cart",
    JSON.stringify(
      cart
    )
  );

}


/* =========================================================
   LOAD CART
========================================================= */

function loadCart() {

  try {

    const saved =
      localStorage.getItem(
        "shae_cart"
      );


    if (!saved) {

      cart = [];

      return;

    }


    const data =
      JSON.parse(
        saved
      );


    if (
      Array.isArray(data)
    ) {

      /*
       * Halaman layanan hanya
       * menampilkan item dari
       * layanan yang sedang dibuka.
       */

      cart =
        data.filter(
          item =>
            item.serviceKey ===
            currentService
        );

    } else {

      cart = [];

    }

  } catch (error) {

    console.error(
      "Gagal membaca cart:",
      error
    );


    cart = [];

  }

}


/* =========================================================
   INVALID SERVICE
========================================================= */

function showInvalidService() {

  const page =
    document.querySelector(
      ".service-page"
    );


  if (!page) {

    return;

  }


  page.innerHTML = `

    <section
      class="service-summary"
      style="margin-top:20px;text-align:center;"
    >

      <i
        class="fa-solid fa-circle-exclamation"
        style="
          font-size:28px;
          color:#f59e0b;
          margin-bottom:10px;
        "
      ></i>


      <strong
        style="
          display:block;
          font-size:12px;
        "
      >
        Layanan tidak ditemukan
      </strong>


      <p
        style="
          color:#98a2b3;
          font-size:8px;
        "
      >
        Silakan kembali ke halaman utama.
      </p>


      <button
        type="button"
        class="order-button"
        onclick="location.href='index.html'"
      >

        Kembali ke Home

      </button>

    </section>

  `;

}


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(
  number
) {

  return new Intl.NumberFormat(
    "id-ID",
    {

      style: "currency",

      currency: "IDR",

      maximumFractionDigits: 0

    }
  ).format(
    Number(number) || 0
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