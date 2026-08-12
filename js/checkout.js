/* =========================================================
   SHAE CLEANERS
   js/checkout.js

   FITUR:
   - Membaca shae_cart
   - Menampilkan pesanan
   - Hitung subtotal
   - Promo otomatis
   - Membaca promo dari promo.html
   - Data customer
   - Jadwal
   - Invoice otomatis
   - Simpan order
   - Kirim ke WhatsApp
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initCheckout
);


/* =========================================================
   CONFIG
========================================================= */

const CART_KEY =
  "shae_cart";

const CUSTOMER_KEY =
  "shae_customer";

const ORDER_KEY =
  "shae_orders";

const PROMO_KEY =
  "shae_selected_promo";

const ACTIVE_ORDER_KEY =
  "shae_active_order";


/*
 * Nomor WhatsApp Shae Cleaners.
 * Format internasional tanpa +
 */

const ADMIN_WA =
  "6283813138221";


/* =========================================================
   STATE
========================================================= */

let cart = [];

let customer = null;

let discount = 0;

let selectedPromo = null;


/* =========================================================
   INIT
========================================================= */

function initCheckout() {

  loadCart();

  loadCustomer();

  loadSelectedPromo();

  setMinimumDate();

  renderCart();

  calculateTotal();

  setupEvents();

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
      JSON.parse(saved);


    cart =
      Array.isArray(data)
        ? data
        : [];


  } catch (error) {

    console.error(
      "Cart error:",
      error
    );

    cart = [];

  }

}


/* =========================================================
   LOAD CUSTOMER
========================================================= */

function loadCustomer() {

  try {

    const saved =
      localStorage.getItem(
        CUSTOMER_KEY
      );


    if (!saved) {

      return;

    }


    customer =
      JSON.parse(saved);


    if (!customer) {

      return;

    }


    setValue(
      "customerName",
      customer.name
    );


    setValue(
      "customerPhone",
      customer.phone
    );


    setValue(
      "customerAddress",
      customer.address
    );


    setValue(
      "customerNote",
      customer.note
    );


    setValue(
      "serviceDate",
      customer.date
    );


    setValue(
      "serviceTime",
      customer.time
    );


  } catch (error) {

    console.error(
      "Customer error:",
      error
    );

  }

}


/* =========================================================
   LOAD SELECTED PROMO
========================================================= */

function loadSelectedPromo() {

  try {

    const saved =
      localStorage.getItem(
        PROMO_KEY
      );


    if (!saved) {

      selectedPromo = null;

      return;

    }


    const data =
      JSON.parse(
        saved
      );


    if (
      data &&
      typeof data === "object"
    ) {

      selectedPromo =
        data;

    } else {

      selectedPromo =
        null;

    }


  } catch (error) {

    console.error(
      "Promo error:",
      error
    );

    selectedPromo =
      null;

  }

}


/* =========================================================
   MINIMUM DATE
========================================================= */

function setMinimumDate() {

  const dateInput =
    document.getElementById(
      "serviceDate"
    );


  if (!dateInput) {

    return;

  }


  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );


  const date =
    `${year}-${month}-${day}`;


  dateInput.min =
    date;


  if (
    !dateInput.value
  ) {

    dateInput.value =
      date;

  }

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

  const container =
    document.getElementById(
      "checkoutItems"
    );


  const count =
    document.getElementById(
      "checkoutItemCount"
    );


  if (!container) {

    return;

  }


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


  if (count) {

    count.textContent =
      `${totalQty} item`;

  }


  if (
    cart.length === 0
  ) {

    container.innerHTML = `

      <div class="checkout-empty">

        <i
          class="fa-solid fa-cart-shopping"
        ></i>

        <span>
          Keranjang masih kosong
        </span>

      </div>

    `;


    disableCheckout();

    return;

  }


  container.innerHTML =
    cart
      .map(
        item => {

          const qty =
            Number(
              item.qty || 0
            );


          const price =
            Number(
              item.price || 0
            );


          const subtotal =
            qty *
            price;


          return `

            <div class="checkout-item">

              <div class="checkout-item-icon">

                <i
                  class="fa-solid fa-couch"
                ></i>

              </div>


              <div class="checkout-item-info">

                <strong>
                  ${escapeHTML(
                    item.name
                  )}
                </strong>

                <small>
                  ${qty} ×
                  ${formatRupiah(
                    price
                  )}
                </small>

              </div>


              <div class="checkout-item-price">

                <strong>
                  ${formatRupiah(
                    subtotal
                  )}
                </strong>

                <small>
                  ${escapeHTML(
                    item.service ||
                    "Layanan"
                  )}
                </small>

              </div>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   CALCULATE TOTAL
========================================================= */

function calculateTotal() {

  const subtotal =
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
          price * qty
        );

      },
      0
    );


  /*
   * ===============================================
   * ATURAN PROMO SHAE CLEANERS
   * ===============================================
   *
   * Rp350.000 - Rp499.999
   *     → diskon 17%
   *
   * Rp500.000 ke atas
   *     → diskon 17%
   *     → tambahan 8% dari harga setelah diskon 17%
   *
   * Contoh:
   *
   * Rp500.000
   *
   * Diskon 17%:
   * Rp85.000
   *
   * Sisa:
   * Rp415.000
   *
   * Tambahan 8%:
   * Rp33.200
   *
   * Total diskon:
   * Rp118.200
   *
   * Grand total:
   * Rp381.800
   *
   * ===============================================
   */

  discount = 0;


  let discount17 = 0;

  let discount8 = 0;


  /*
   * PROMO 17%
   */

  if (
    subtotal >= 350000
  ) {

    discount17 =
      Math.round(
        subtotal * 0.17
      );

  }


  /*
   * TAMBAHAN 8%
   */

  if (
    subtotal >= 500000
  ) {

    const after17 =
      subtotal -
      discount17;


    discount8 =
      Math.round(
        after17 * 0.08
      );

  }


  discount =
    discount17 +
    discount8;


  const grandTotal =
    Math.max(
      0,
      subtotal -
      discount
    );


  /*
   * ===============================================
   * TAMPILKAN SUBTOTAL
   * ===============================================
   */

  setText(
    "subtotal",
    formatRupiah(
      subtotal
    )
  );


  /*
   * ===============================================
   * TAMPILKAN DISKON
   * ===============================================
   */

  setText(
    "discount",
    discount > 0
      ? `- ${formatRupiah(
          discount
        )}`
      : "Rp0"
  );


  /*
   * ===============================================
   * GRAND TOTAL
   * ===============================================
   */

  setText(
    "grandTotal",
    formatRupiah(
      grandTotal
    )
  );


  /*
   * ===============================================
   * TOTAL DI BUTTON
   * ===============================================
   */

  setText(
    "buttonTotal",
    formatRupiah(
      grandTotal
    )
  );


  /*
   * ===============================================
   * DETAIL PROMO
   * ===============================================
   */

  renderPromoStatus(
    subtotal,
    discount17,
    discount8,
    discount
  );


  return {

    subtotal,

    discount,

    discount17,

    discount8,

    grandTotal

  };

}


/* =========================================================
   PROMO STATUS
========================================================= */

function renderPromoStatus(
  subtotal,
  discount17,
  discount8,
  totalDiscount
) {

  const element =
    document.getElementById(
      "promoStatus"
    );


  if (!element) {

    return;

  }


  if (
    subtotal < 350000
  ) {

    const remaining =
      350000 -
      subtotal;


    element.innerHTML = `

      <i
        class="fa-solid fa-tag"
      ></i>

      Tambah
      <strong>
        ${formatRupiah(
          remaining
        )}
      </strong>
      untuk mendapatkan diskon 17%.

    `;


    element.className =
      "promo-status warning";


    return;

  }


  if (
    subtotal < 500000
  ) {

    const remaining =
      500000 -
      subtotal;


    element.innerHTML = `

      <i
        class="fa-solid fa-circle-check"
      ></i>

      Diskon 17% aktif.

      Tambah
      <strong>
        ${formatRupiah(
          remaining
        )}
      </strong>
      untuk mendapatkan tambahan diskon 8%.

    `;


    element.className =
      "promo-status success";


    return;

  }


  element.innerHTML = `

    <i
      class="fa-solid fa-gift"
    ></i>

    Promo aktif:

    <strong>
      Diskon 17% + tambahan 8%
    </strong>

    <small>
      Total hemat
      ${formatRupiah(
        totalDiscount
      )}
    </small>

  `;


  element.className =
    "promo-status success";

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  const fields = [

    "customerName",

    "customerPhone",

    "customerAddress",

    "customerNote",

    "serviceDate",

    "serviceTime"

  ];


  fields.forEach(
    id => {

      const element =
        document.getElementById(
          id
        );


      if (!element) {

        return;

      }


      element.addEventListener(
        "input",
        saveCustomerDraft
      );


      element.addEventListener(
        "change",
        saveCustomerDraft
      );

    }
  );


  const agreement =
    document.getElementById(
      "agreement"
    );


  if (agreement) {

    agreement.addEventListener(
      "change",
      validateCheckout
    );

  }


  const button =
    document.getElementById(
      "checkoutButton"
    );


  if (button) {

    button.addEventListener(
      "click",
      createOrder
    );

  }


  const promo =
    document.getElementById(
      "promoButton"
    );


  if (promo) {

    promo.addEventListener(
      "click",
      function () {

        calculateTotal();


        if (
          selectedPromo
        ) {

          alert(
            `${selectedPromo.name} dipilih.\n\nDiskon akan dihitung otomatis berdasarkan total pesanan.`
          );

        } else {

          alert(
            "Promo otomatis akan diterapkan sesuai total pesanan."
          );

        }

      }
    );

  }


  validateCheckout();

}


/* =========================================================
   SAVE CUSTOMER DRAFT
========================================================= */

function saveCustomerDraft() {

  const data =
    getCustomerData();


  localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify(
      data
    )
  );


  validateCheckout();

}


/* =========================================================
   GET CUSTOMER
========================================================= */

function getCustomerData() {

  return {

    name:
      getValue(
        "customerName"
      ),

    phone:
      getValue(
        "customerPhone"
      ),

    address:
      getValue(
        "customerAddress"
      ),

    note:
      getValue(
        "customerNote"
      ),

    date:
      getValue(
        "serviceDate"
      ),

    time:
      getValue(
        "serviceTime"
      )

  };

}


/* =========================================================
   VALIDATE
========================================================= */

function validateCheckout() {

  const button =
    document.getElementById(
      "checkoutButton"
    );


  const agreement =
    document.getElementById(
      "agreement"
    );


  if (!button) {

    return;

  }


  const data =
    getCustomerData();


  const validName =
    data.name.length >= 2;


  const validPhone =
    normalizePhone(
      data.phone
    ).length >= 10;


  const validAddress =
    data.address.length >= 5;


  const validDate =
    data.date !== "";


  const validTime =
    data.time !== "";


  const agreed =
    agreement
      ? agreement.checked
      : false;


  const validCart =
    cart.length > 0;


  button.disabled =
    !(
      validName &&
      validPhone &&
      validAddress &&
      validDate &&
      validTime &&
      agreed &&
      validCart
    );

}


/* =========================================================
   DISABLE CHECKOUT
========================================================= */

function disableCheckout() {

  const button =
    document.getElementById(
      "checkoutButton"
    );


  if (button) {

    button.disabled =
      true;

  }

}


/* =========================================================
   CREATE ORDER
========================================================= */

function createOrder() {

  const data =
    getCustomerData();


  const agreement =
    document.getElementById(
      "agreement"
    );


  if (
    !validateCustomer(
      data
    )
  ) {

    alert(
      "Mohon lengkapi data customer."
    );

    return;

  }


  if (
    agreement &&
    !agreement.checked
  ) {

    alert(
      "Silakan centang konfirmasi data terlebih dahulu."
    );

    return;

  }


  if (
    cart.length === 0
  ) {

    alert(
      "Keranjang masih kosong."
    );

    return;

  }


  /*
   * Hitung ulang tepat sebelum
   * membuat order.
   */

  const totals =
    calculateTotal();


  const invoice =
    generateInvoice();


  const order = {

    invoice,

    createdAt:
      new Date().toISOString(),

    customer:
      data,

    items:
      cart,

    subtotal:
      totals.subtotal,

    discount:
      totals.discount,

    discount17:
      totals.discount17,

    discount8:
      totals.discount8,

    total:
      totals.grandTotal,

    promo:
      selectedPromo
        ? {

            code:
              selectedPromo.code,

            name:
              selectedPromo.name

          }
        : null,

    status:
      "Menunggu Konfirmasi"

  };


  /*
   * Simpan order.
   */

  saveOrder(
    order
  );


  /*
   * Simpan order aktif
   * untuk invoice/detail.
   */

  localStorage.setItem(
    ACTIVE_ORDER_KEY,
    JSON.stringify(
      order
    )
  );


  /*
   * Buat pesan WhatsApp.
   */

  const message =
    createWhatsAppMessage(
      order
    );


  const waURL =
    `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
      message
    )}`;


  /*
   * Bersihkan promo terpilih
   * agar tidak terbawa ke order berikutnya.
   */

  localStorage.removeItem(
    PROMO_KEY
  );


  /*
   * Bersihkan cart setelah
   * order berhasil dibuat.
   */

  localStorage.removeItem(
    CART_KEY
  );


  /*
   * Buka WhatsApp.
   */

  window.location.href =
    waURL;

}


/* =========================================================
   VALIDATE CUSTOMER
========================================================= */

function validateCustomer(
  data
) {

  if (
    data.name.length < 2
  ) {

    return false;

  }


  if (
    normalizePhone(
      data.phone
    ).length < 10
  ) {

    return false;

  }


  if (
    data.address.length < 5
  ) {

    return false;

  }


  if (!data.date) {

    return false;

  }


  if (!data.time) {

    return false;

  }


  return true;

}


/* =========================================================
   GENERATE INVOICE
========================================================= */

function generateInvoice() {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );


  const dateKey =
    `${year}${month}${day}`;


  const storageKey =
    `shae_invoice_${dateKey}`;


  let number =
    Number(
      localStorage.getItem(
        storageKey
      ) || 0
    );


  number++;


  localStorage.setItem(
    storageKey,
    String(number)
  );


  return (
    `INV-${dateKey}-` +
    String(number)
      .padStart(
        3,
        "0"
      )
  );

}


/* =========================================================
   SAVE ORDER
========================================================= */

function saveOrder(
  order
) {

  try {

    const saved =
      localStorage.getItem(
        ORDER_KEY
      );


    let orders =
      saved
        ? JSON.parse(
            saved
          )
        : [];


    if (
      !Array.isArray(
        orders
      )
    ) {

      orders = [];

    }


    orders.unshift(
      order
    );


    /*
     * Simpan maksimal
     * 50 order terakhir.
     */

    orders =
      orders.slice(
        0,
        50
      );


    localStorage.setItem(
      ORDER_KEY,
      JSON.stringify(
        orders
      )
    );


  } catch (error) {

    console.error(
      "Gagal menyimpan order:",
      error
    );

  }

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage(
  order
) {

  let message =

`*ORDER BARU - SHAE CLEANERS*

🧾 Invoice:
${order.invoice}

👤 Nama:
${order.customer.name}

📱 WhatsApp:
${order.customer.phone}

📍 Alamat:
${order.customer.address}

📅 Jadwal:
${formatDate(
  order.customer.date
)}

⏰ Jam:
${order.customer.time}

━━━━━━━━━━━━━━
*DETAIL PESANAN*
━━━━━━━━━━━━━━
`;


  order.items.forEach(
    item => {

      const subtotal =
        Number(
          item.price
        ) *
        Number(
          item.qty
        );


      message +=

`\n• ${item.name}
  ${item.qty} × ${formatRupiah(
    item.price
  )}
  = ${formatRupiah(
    subtotal
  )}
`;

    }
  );


  /*
   * PROMO
   */

  if (
    order.discount17 > 0 ||
    order.discount8 > 0
  ) {

    message +=

`
━━━━━━━━━━━━━━
*PROMO*
━━━━━━━━━━━━━━
`;

    if (
      order.discount17 > 0
    ) {

      message +=

`Diskon 17%:
- ${formatRupiah(
  order.discount17
)}
`;

    }


    if (
      order.discount8 > 0
    ) {

      message +=

`Tambahan 8%:
- ${formatRupiah(
  order.discount8
)}
`;

    }

  }


  if (
    order.promo
  ) {

    message +=

`
Kode Promo:
${order.promo.code}
${order.promo.name}
`;

  }


  message +=

`
━━━━━━━━━━━━━━
Subtotal:
${formatRupiah(
  order.subtotal
)}

Total Diskon:
- ${formatRupiah(
  order.discount
)}

*TOTAL:
${formatRupiah(
  order.total
)}*
━━━━━━━━━━━━━━

Catatan:
${order.customer.note || "-"}

Mohon konfirmasi pesanan saya.

Terima kasih.
`;


  return message;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  value
) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(
      `${value}T00:00:00`
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return new Intl.DateTimeFormat(
    "id-ID",
    {

      day: "2-digit",

      month: "long",

      year: "numeric"

    }
  ).format(
    date
  );

}


/* =========================================================
   PHONE
========================================================= */

function normalizePhone(
  phone
) {

  let value =
    String(
      phone || ""
    )
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
    value.startsWith(
      "8"
    )
  ) {

    value =
      "62" +
      value;

  }


  return value;

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
    Number(
      value
    ) || 0
  );

}


/* =========================================================
   DOM HELPERS
========================================================= */

function getValue(
  id
) {

  const element =
    document.getElementById(
      id
    );


  return element
    ? element.value.trim()
    : "";

}


function setValue(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.value =
      value || "";

  }

}


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