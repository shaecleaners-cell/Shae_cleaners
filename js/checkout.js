/* =========================================================
   SHAE CLEANERS
   js/checkout.js

   FITUR:
   - Membaca shae_cart
   - Menampilkan pesanan
   - Hitung subtotal
   - Promo otomatis
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

const CART_KEY = "shae_cart";

const CUSTOMER_KEY =
  "shae_customer";

const ORDER_KEY =
  "shae_orders";


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


/* =========================================================
   INIT
========================================================= */

function initCheckout() {

  loadCart();

  loadCustomer();

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


  } catch (error) {

    console.error(
      "Customer error:",
      error
    );

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
    ).padStart(2,"0");


  const day =
    String(
      today.getDate()
    ).padStart(2,"0");


  const date =
    `${year}-${month}-${day}`;


  dateInput.min =
    date;


  /*
   * Default jadwal:
   * hari ini
   */

  if (!dateInput.value) {

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
      ) =>
        total +
        Number(item.qty || 0),
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
            qty * price;


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
                  ${formatRupiah(price)}
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
                    item.service || "Layanan"
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
   CALCULATE
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
   * Promo:
   *
   * >= Rp500.000
   * diskon 8%
   *
   * >= Rp350.000
   * diskon 17%
   *
   * Catatan:
   * Untuk order >= 500rb,
   * sistem menggunakan diskon
   * 8% tambahan setelah diskon
   * 17%.
   */

  discount = 0;


  if (
    subtotal >= 500000
  ) {

    discount =
      Math.round(
        subtotal * 0.17
      );


    discount +=
      Math.round(
        (
          subtotal -
          discount
        ) * 0.08
      );

  }

  else if (
    subtotal >= 350000
  ) {

    discount =
      Math.round(
        subtotal * 0.17
      );

  }


  const grandTotal =
    Math.max(
      0,
      subtotal - discount
    );


  setText(
    "subtotal",
    formatRupiah(
      subtotal
    )
  );


  setText(
    "discount",
    `- ${formatRupiah(
      discount
    )}`
  );


  setText(
    "grandTotal",
    formatRupiah(
      grandTotal
    )
  );


  setText(
    "buttonTotal",
    formatRupiah(
      grandTotal
    )
  );


  return {

    subtotal,

    discount,

    grandTotal

  };

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


        alert(
          "Promo otomatis akan diterapkan sesuai total pesanan."
        );

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
   DISABLE
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


  const totals =
    calculateTotal();


  const invoice =
    generateInvoice();


  const order = {

    invoice,

    createdAt:
      new Date().toISOString(),

    customer: data,

    items: cart,

    subtotal:
      totals.subtotal,

    discount:
      totals.discount,

    total:
      totals.grandTotal,

    status:
      "Menunggu Konfirmasi"

  };


  saveOrder(
    order
  );


  /*
   * Simpan order aktif
   */

  localStorage.setItem(
    "shae_active_order",
    JSON.stringify(
      order
    )
  );


  /*
   * Buat pesan WhatsApp
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
   * Buka WhatsApp
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
    ).padStart(2,"0");


  const day =
    String(
      today.getDate()
    ).padStart(2,"0");


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
      .padStart(3,"0")
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
        ? JSON.parse(saved)
        : [];


    if (
      !Array.isArray(orders)
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
  ${item.qty} × ${formatRupiah(item.price)}
  = ${formatRupiah(subtotal)}
`;

    }
  );


  message +=

`
━━━━━━━━━━━━━━
Subtotal:
${formatRupiah(
  order.subtotal
)}

Diskon:
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
    value.startsWith("0")
  ) {

    value =
      "62" +
      value.substring(1);

  }


  if (
    value.startsWith("8")
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

      style: "currency",

      currency: "IDR",

      maximumFractionDigits: 0

    }
  ).format(
    Number(value) || 0
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