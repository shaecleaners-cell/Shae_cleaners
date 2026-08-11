/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/invoice.js
   INVOICE + WHATSAPP
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const INVOICE_ORDER_KEY =
  "shae_order";

const INVOICE_STORAGE_KEY =
  "shae_invoice";


/*
   Nomor WhatsApp Shae Cleaners.
   Format internasional tanpa +.
*/
const SHAE_WHATSAPP =
  "6283813138221";


/* =========================================================
   ELEMENTS
========================================================= */

const invoiceNumberElement =
  document.getElementById(
    "invoiceNumber"
  );

const invoiceDateElement =
  document.getElementById(
    "invoiceDate"
  );

const customerNameElement =
  document.getElementById(
    "customerName"
  );

const customerPhoneElement =
  document.getElementById(
    "customerPhone"
  );

const customerAddressElement =
  document.getElementById(
    "customerAddress"
  );

const invoiceItemsElement =
  document.getElementById(
    "invoiceItems"
  );

const invoiceSubtotalElement =
  document.getElementById(
    "invoiceSubtotal"
  );

const invoiceServiceFeeElement =
  document.getElementById(
    "invoiceServiceFee"
  );

const invoiceDiscountElement =
  document.getElementById(
    "invoiceDiscount"
  );

const invoiceTotalElement =
  document.getElementById(
    "invoiceTotal"
  );

const bookingDateElement =
  document.getElementById(
    "bookingDate"
  );

const bookingTimeElement =
  document.getElementById(
    "bookingTime"
  );

const invoiceNoteBox =
  document.getElementById(
    "invoiceNoteBox"
  );

const invoiceNoteElement =
  document.getElementById(
    "invoiceNote"
  );

const sendWhatsAppButton =
  document.getElementById(
    "sendWhatsApp"
  );

const copyInvoiceButton =
  document.getElementById(
    "copyInvoice"
  );

const printInvoiceButton =
  document.getElementById(
    "printInvoice"
  );

const invoiceToast =
  document.getElementById(
    "invoiceToast"
  );

const invoiceToastText =
  document.getElementById(
    "invoiceToastText"
  );


/* =========================================================
   STATE
========================================================= */

let invoiceOrder = null;


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function invoiceFormatRupiah(
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
   ESCAPE HTML
========================================================= */

function invoiceEscapeHTML(
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
   GET INVOICE FROM URL
========================================================= */

function getInvoiceFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return params.get(
    "invoice"
  );

}


/* =========================================================
   LOAD ORDER
========================================================= */

function loadInvoiceOrder() {

  let order = null;


  /*
    Prioritas pertama:
    localStorage shae_order
  */

  try {

    order =
      JSON.parse(
        localStorage.getItem(
          INVOICE_ORDER_KEY
        )
      );

  } catch {

    order = null;

  }


  /*
    Jika tidak ada,
    coba shae_invoice.
  */

  if (!order) {

    try {

      order =
        JSON.parse(
          localStorage.getItem(
            INVOICE_STORAGE_KEY
          )
        );

    } catch {

      order = null;

    }

  }


  if (
    !order ||
    !order.customer ||
    !Array.isArray(
      order.items
    )
  ) {

    showInvalidInvoice();

    return;

  }


  invoiceOrder =
    order;


  renderInvoice();

}


/* =========================================================
   RENDER INVOICE
========================================================= */

function renderInvoice() {

  const order =
    invoiceOrder;


  /*
    Invoice number
  */

  if (invoiceNumberElement) {

    invoiceNumberElement.textContent =
      order.invoice ||
      getInvoiceFromURL() ||
      "-";

  }


  /*
    Date
  */

  if (invoiceDateElement) {

    invoiceDateElement.textContent =
      formatDate(
        order.orderDate
      );

  }


  /*
    Customer
  */

  const customer =
    order.customer || {};


  if (customerNameElement) {

    customerNameElement.textContent =
      customer.name ||
      "-";

  }


  if (customerPhoneElement) {

    customerPhoneElement.textContent =
      customer.phoneOriginal ||
      formatWhatsAppPhone(
        customer.phone
      ) ||
      "-";

  }


  if (customerAddressElement) {

    customerAddressElement.textContent =
      customer.address ||
      "-";

  }


  /*
    Items
  */

  renderInvoiceItems(
    order.items
  );


  /*
    Summary
  */

  if (invoiceSubtotalElement) {

    invoiceSubtotalElement.textContent =
      invoiceFormatRupiah(
        order.subtotal
      );

  }


  if (invoiceServiceFeeElement) {

    invoiceServiceFeeElement.textContent =
      invoiceFormatRupiah(
        order.serviceFee
      );

  }


  if (invoiceDiscountElement) {

    invoiceDiscountElement.textContent =
      `- ${invoiceFormatRupiah(
        order.discount
      )}`;

  }


  if (invoiceTotalElement) {

    invoiceTotalElement.textContent =
      invoiceFormatRupiah(
        order.total
      );

  }


  /*
    Booking
  */

  renderBooking(
    order.items
  );


  /*
    Customer note
  */

  renderNote(
    order
  );

}


/* =========================================================
   RENDER ITEMS
========================================================= */

function renderInvoiceItems(
  items
) {

  if (!invoiceItemsElement) {
    return;
  }


  invoiceItemsElement.innerHTML =
    "";


  if (
    !Array.isArray(items) ||
    !items.length
  ) {

    invoiceItemsElement.innerHTML = `

      <div class="invoice-item">

        <div class="invoice-item-main">

          <div class="invoice-item-name">

            Tidak ada item

          </div>

        </div>

      </div>

    `;

    return;

  }


  items.forEach(
    item => {

      const qty =
        Number(
          item.qty || 1
        );


      const price =
        Number(
          item.price || 0
        );


      const total =
        Number(
          item.total ||
          price * qty
        );


      const element =
        document.createElement(
          "div"
        );


      element.className =
        "invoice-item";


      element.innerHTML = `

        <div class="invoice-item-main">

          <div class="invoice-item-name">

            ${invoiceEscapeHTML(
              item.name ||
              "Layanan"
            )}

          </div>


          <div class="invoice-item-variant">

            ${invoiceEscapeHTML(
              item.variant ||
              ""
            )}

          </div>


          <div class="invoice-item-qty">

            ${qty} x
            ${invoiceFormatRupiah(
              price
            )}

          </div>

        </div>


        <div class="invoice-item-total">

          ${invoiceFormatRupiah(
            total
          )}

        </div>

      `;


      invoiceItemsElement.appendChild(
        element
      );

    }
  );

}


/* =========================================================
   BOOKING
========================================================= */

function renderBooking(
  items
) {

  let date = "";

  let time = "";


  /*
    Ambil jadwal dari item pertama
  */

  if (
    Array.isArray(items) &&
    items.length
  ) {

    date =
      items[0].bookingDate ||
      "";

    time =
      items[0].bookingTime ||
      "";

  }


  if (bookingDateElement) {

    bookingDateElement.textContent =
      date
        ? formatBookingDate(
            date
          )
        : "Sesuai konfirmasi";

  }


  if (bookingTimeElement) {

    bookingTimeElement.textContent =
      time ||
      "Sesuai konfirmasi";

  }

}


/* =========================================================
   NOTE
========================================================= */

function renderNote(
  order
) {

  let note =
    order.customer?.note ||
    "";


  /*
    Jika customer note kosong,
    cari note dari item.
  */

  if (!note) {

    const itemWithNote =
      order.items.find(
        item =>
          item.note &&
          String(
            item.note
          ).trim()
      );


    if (itemWithNote) {

      note =
        itemWithNote.note;

    }

  }


  if (
    invoiceNoteBox &&
    invoiceNoteElement
  ) {

    if (note) {

      invoiceNoteBox.style.display =
        "block";

      invoiceNoteElement.textContent =
        note;

    } else {

      invoiceNoteBox.style.display =
        "none";

    }

  }

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
  dateValue
) {

  if (!dateValue) {

    return "-";

  }


  const date =
    new Date(
      dateValue
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

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
   BOOKING DATE
========================================================= */

function formatBookingDate(
  dateValue
) {

  if (!dateValue) {

    return "-";

  }


  /*
    Tambahkan waktu lokal
    agar tidak bergeser satu hari
    karena timezone.
  */

  const parts =
    dateValue.split(
      "-"
    );


  if (
    parts.length !== 3
  ) {

    return dateValue;

  }


  const date =
    new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
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
   FORMAT PHONE
========================================================= */

function formatWhatsAppPhone(
  phone
) {

  const value =
    String(
      phone || ""
    );


  if (!value) {

    return "";

  }


  if (
    value.startsWith(
      "62"
    )
  ) {

    return `+${value}`;

  }


  return value;

}


/* =========================================================
   BUILD WHATSAPP MESSAGE
========================================================= */

function buildWhatsAppMessage() {

  if (!invoiceOrder) {

    return "";

  }


  const order =
    invoiceOrder;


  const customer =
    order.customer || {};


  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];


  let message =
`🧾 *INVOICE SHAE CLEANERS*

━━━━━━━━━━━━━━━━━━

*No. Invoice:* ${order.invoice || "-"}
*Tanggal:* ${formatDate(order.orderDate)}

👤 *DATA PELANGGAN*
Nama: ${customer.name || "-"}
WhatsApp: ${customer.phoneOriginal || formatWhatsAppPhone(customer.phone) || "-"}
Alamat: ${customer.address || "-"}

━━━━━━━━━━━━━━━━━━

🧹 *DETAIL PESANAN*
`;


  items.forEach(
    (
      item,
      index
    ) => {

      const qty =
        Number(
          item.qty || 1
        );


      const price =
        Number(
          item.price || 0
        );


      const total =
        Number(
          item.total ||
          price * qty
        );


      message +=
`
${index + 1}. *${item.name || "Layanan"}*
   ${item.variant || ""}
   ${qty} x ${invoiceFormatRupiah(price)}
   Total: ${invoiceFormatRupiah(total)}
`;

    }
  );


  message +=
`
━━━━━━━━━━━━━━━━━━

Subtotal: ${invoiceFormatRupiah(order.subtotal)}
Biaya layanan: ${invoiceFormatRupiah(order.serviceFee)}
Diskon: - ${invoiceFormatRupiah(order.discount)}

💰 *TOTAL: ${invoiceFormatRupiah(order.total)}*
`;


  /*
    Jadwal
  */

  let bookingDate = "";

  let bookingTime = "";


  if (items.length) {

    bookingDate =
      items[0].bookingDate ||
      "";

    bookingTime =
      items[0].bookingTime ||
      "";

  }


  if (
    bookingDate ||
    bookingTime
  ) {

    message +=
`
📅 *JADWAL*
Tanggal: ${
  bookingDate
    ? formatBookingDate(
        bookingDate
      )
    : "Konfirmasi"
}
Jam: ${
  bookingTime ||
  "Konfirmasi"
}
`;

  }


  if (
    customer.note
  ) {

    message +=
`
📝 *CATATAN*
${customer.note}
`;

  }


  message +=
`
━━━━━━━━━━━━━━━━━━

Terima kasih telah memilih *Shae Cleaners*.

Mohon konfirmasi pesanan dan jadwal melalui WhatsApp.

🙏 Terima kasih.
`;


  return message;

}


/* =========================================================
   SEND WHATSAPP
========================================================= */

if (sendWhatsAppButton) {

  sendWhatsAppButton.addEventListener(
    "click",
    sendInvoiceToWhatsApp
  );

}


function sendInvoiceToWhatsApp() {

  if (!invoiceOrder) {

    showInvoiceToast(
      "Invoice tidak ditemukan."
    );

    return;

  }


  const message =
    buildWhatsAppMessage();


  if (!message) {

    return;

  }


  const encoded =
    encodeURIComponent(
      message
    );


  /*
    Buka WhatsApp dengan
    pesan invoice otomatis.
  */

  const url =
    `https://wa.me/${SHAE_WHATSAPP}?text=${encoded}`;


  window.open(
    url,
    "_blank"
  );


  /*
    Tandai bahwa invoice
    sudah dikirim/dibuka.
  */

  localStorage.setItem(

    "shae_invoice_whatsapp_opened",

    new Date().toISOString()

  );

}


/* =========================================================
   COPY INVOICE NUMBER
========================================================= */

if (copyInvoiceButton) {

  copyInvoiceButton.addEventListener(
    "click",
    copyInvoiceNumber
  );

}


async function copyInvoiceNumber() {

  const number =
    invoiceOrder?.invoice ||
    getInvoiceFromURL() ||
    "";


  if (!number) {

    showInvoiceToast(
      "Nomor invoice tidak ditemukan."
    );

    return;

  }


  try {

    await navigator.clipboard.writeText(
      number
    );


    showInvoiceToast(
      "Nomor invoice berhasil disalin."
    );

  } catch {

    /*
      Fallback untuk browser
      yang tidak mendukung clipboard API.
    */

    const textarea =
      document.createElement(
        "textarea"
      );


    textarea.value =
      number;


    document.body.appendChild(
      textarea
    );


    textarea.select();


    document.execCommand(
      "copy"
    );


    textarea.remove();


    showInvoiceToast(
      "Nomor invoice berhasil disalin."
    );

  }

}


/* =========================================================
   PRINT
========================================================= */

if (printInvoiceButton) {

  printInvoiceButton.addEventListener(
    "click",
    () => {

      window.print();

    }
  );

}


/* =========================================================
   INVALID INVOICE
========================================================= */

function showInvalidInvoice() {

  if (invoiceNumberElement) {

    invoiceNumberElement.textContent =
      "-";

  }


  if (customerNameElement) {

    customerNameElement.textContent =
      "Invoice tidak ditemukan";

  }


  if (customerPhoneElement) {

    customerPhoneElement.textContent =
      "Silakan kembali ke halaman checkout.";

  }


  if (customerAddressElement) {

    customerAddressElement.textContent =
      "-";

  }


  if (invoiceItemsElement) {

    invoiceItemsElement.innerHTML = `

      <div class="invoice-item">

        <div class="invoice-item-main">

          <div class="invoice-item-name">

            Data invoice tidak tersedia.

          </div>


          <div class="invoice-item-variant">

            Silakan buat pesanan baru.

          </div>

        </div>

      </div>

    `;

  }


  if (sendWhatsAppButton) {

    sendWhatsAppButton.disabled =
      true;

    sendWhatsAppButton.style.opacity =
      "0.5";

  }

}


/* =========================================================
   TOAST
========================================================= */

function showInvoiceToast(
  message
) {

  if (
    !invoiceToast ||
    !invoiceToastText
  ) {

    alert(message);

    return;

  }


  invoiceToastText.textContent =
    message;


  invoiceToast.classList.add(
    "show"
  );


  clearTimeout(
    window.invoiceToastTimer
  );


  window.invoiceToastTimer =
    setTimeout(
      () => {

        invoiceToast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadInvoiceOrder();

  }
);
/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/Invoice.js
   INVOICE SYSTEM
========================================================= */


/* =========================================================
   STORAGE KEY
========================================================= */

const INVOICE_ORDER_KEY = "shae_order";

const CHECKOUT_CART_KEY =
  "shae_checkout_cart";

const CHECKOUT_PROMO_KEY =
  "shae_checkout_promo";


/* =========================================================
   WHATSAPP
========================================================= */

const INVOICE_WHATSAPP =
  "6283813138221";


/* =========================================================
   ELEMENTS
========================================================= */

const invoiceNumber =
  document.getElementById(
    "invoiceNumber"
  );

const invoiceDate =
  document.getElementById(
    "invoiceDate"
  );

const invoiceCustomer =
  document.getElementById(
    "invoiceCustomer"
  );

const invoicePhone =
  document.getElementById(
    "invoicePhone"
  );

const invoiceAddress =
  document.getElementById(
    "invoiceAddress"
  );

const invoiceItems =
  document.getElementById(
    "invoiceItems"
  );

const invoiceSubtotal =
  document.getElementById(
    "invoiceSubtotal"
  );

const invoiceDiscount =
  document.getElementById(
    "invoiceDiscount"
  );

const invoiceTotal =
  document.getElementById(
    "invoiceTotal"
  );

const invoiceSchedule =
  document.getElementById(
    "invoiceSchedule"
  );

const invoiceStatus =
  document.getElementById(
    "invoiceStatus"
  );

const btnInvoiceWA =
  document.getElementById(
    "btnInvoiceWA"
  );

const btnPrintInvoice =
  document.getElementById(
    "btnPrintInvoice"
  );


/* =========================================================
   DATA
========================================================= */

let orderData = null;

let checkoutItems = [];

let checkoutPromo = null;


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initInvoice
);


function initInvoice() {

  loadOrderData();

  loadCheckoutData();

  generateInvoiceNumber();

  renderInvoice();

  setupInvoiceEvents();

}


/* =========================================================
   LOAD ORDER
========================================================= */

function loadOrderData() {

  try {

    const saved =
      localStorage.getItem(
        INVOICE_ORDER_KEY
      );


    if (saved) {

      orderData =
        JSON.parse(
          saved
        );

    }

  } catch (error) {

    console.error(
      "Gagal membaca data order:",
      error
    );

    orderData = null;

  }

}


/* =========================================================
   LOAD CHECKOUT DATA
========================================================= */

function loadCheckoutData() {

  try {

    const cart =
      localStorage.getItem(
        CHECKOUT_CART_KEY
      );


    checkoutItems =
      cart
        ? JSON.parse(cart)
        : [];


    if (
      !Array.isArray(
        checkoutItems
      )
    ) {

      checkoutItems = [];

    }

  } catch {

    checkoutItems = [];

  }


  try {

    const promo =
      localStorage.getItem(
        CHECKOUT_PROMO_KEY
      );


    checkoutPromo =
      promo
        ? JSON.parse(promo)
        : null;

  } catch {

    checkoutPromo = null;

  }

}


/* =========================================================
   INVOICE NUMBER
========================================================= */

function generateInvoiceNumber() {

  /*
    Jika checkout sudah membuat
    nomor invoice, gunakan nomor tersebut.
  */

  if (
    orderData &&
    orderData.invoice
  ) {

    setText(
      invoiceNumber,
      orderData.invoice
    );

    return;

  }


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


  /*
    Counter sederhana.
  */

  let counter =
    Number(
      localStorage.getItem(
        "shae_invoice_counter"
      ) || 0
    );


  counter++;


  localStorage.setItem(
    "shae_invoice_counter",
    counter
  );


  const invoice =
    `INV-${year}${month}${day}-${String(
      counter
    ).padStart(
      3,
      "0"
    )}`;


  if (invoiceNumber) {

    invoiceNumber.textContent =
      invoice;

  }


  /*
    Simpan supaya tidak berubah
    ketika halaman invoice direfresh.
  */

  if (!orderData) {

    orderData = {};

  }


  orderData.invoice =
    invoice;


  localStorage.setItem(
    INVOICE_ORDER_KEY,
    JSON.stringify(
      orderData
    )
  );

}


/* =========================================================
   RENDER
========================================================= */

function renderInvoice() {

  const customer =
    getCustomerData();


  renderCustomer(
    customer
  );


  renderItems();


  renderSummary();


  renderSchedule();


  renderStatus();


  setText(
    invoiceDate,
    formatDateTime(
      new Date()
    )
  );

}


/* =========================================================
   CUSTOMER DATA
========================================================= */

function getCustomerData() {

  const data =
    orderData || {};


  return {

    name:
      data.name ||
      data.customerName ||
      data.nama ||
      "-",

    phone:
      data.phone ||
      data.whatsapp ||
      data.noWhatsapp ||
      data.nomor ||
      "-",

    address:
      data.address ||
      data.alamat ||
      "-"

  };

}


/* =========================================================
   RENDER CUSTOMER
========================================================= */

function renderCustomer(
  customer
) {

  setText(
    invoiceCustomer,
    customer.name
  );


  setText(
    invoicePhone,
    customer.phone
  );


  setText(
    invoiceAddress,
    customer.address
  );

}


/* =========================================================
   RENDER ITEMS
========================================================= */

function renderItems() {

  if (!invoiceItems) {

    return;

  }


  invoiceItems.innerHTML =
    "";


  if (
    !checkoutItems.length
  ) {

    invoiceItems.innerHTML = `

      <div class="invoice-empty">

        Tidak ada detail pesanan.

      </div>

    `;

    return;

  }


  checkoutItems.forEach(
    item => {

      const qty =
        Number(
          item.qty || 1
        );


      const price =
        Number(
          item.price || 0
        );


      const total =
        price * qty;


      const row =
        document.createElement(
          "div"
        );


      row.className =
        "invoice-item";


      row.innerHTML = `

        <div class="invoice-item-info">

          <strong>

            ${escapeHTML(
              item.name ||
              "Layanan"
            )}

          </strong>


          <span>

            ${escapeHTML(
              item.variant ||
              "-"
            )}

          </span>

        </div>


        <div class="invoice-item-qty">

          ${qty}x

        </div>


        <div class="invoice-item-price">

          ${formatRupiah(
            total
          )}

        </div>

      `;


      invoiceItems.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   SUMMARY
========================================================= */

function renderSummary() {

  const subtotal =
    checkoutItems.reduce(
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


  const discount =
    calculateDiscount(
      subtotal
    );


  const total =
    Math.max(
      0,
      subtotal - discount
    );


  setText(
    invoiceSubtotal,
    formatRupiah(
      subtotal
    )
  );


  setText(
    invoiceDiscount,
    `-${formatRupiah(
      discount
    )}`
  );


  setText(
    invoiceTotal,
    formatRupiah(
      total
    )
  );

}


/* =========================================================
   DISCOUNT
========================================================= */

function calculateDiscount(
  subtotal
) {

  if (
    !checkoutPromo
  ) {

    return 0;

  }


  if (
    subtotal <
    Number(
      checkoutPromo.minOrder || 0
    )
  ) {

    return 0;

  }


  if (
    checkoutPromo.type ===
    "percent"
  ) {

    return Math.round(
      subtotal *
      (
        Number(
          checkoutPromo.value
        ) / 100
      )
    );

  }


  if (
    checkoutPromo.type ===
    "fixed"
  ) {

    return Math.min(
      subtotal,
      Number(
        checkoutPromo.value
      )
    );

  }


  return 0;

}


/* =========================================================
   SCHEDULE
========================================================= */

function renderSchedule() {

  if (!invoiceSchedule) {

    return;

  }


  const firstItem =
    checkoutItems[0];


  if (!firstItem) {

    invoiceSchedule.textContent =
      "Jadwal belum ditentukan";

    return;

  }


  const date =
    firstItem.date
      ? formatDate(
          firstItem.date
        )
      : "-";


  const time =
    firstItem.time ||
    "-";


  invoiceSchedule.textContent =
    `${date} • ${time}`;

}


/* =========================================================
   STATUS
========================================================= */

function renderStatus() {

  if (!invoiceStatus) {

    return;

  }


  const status =
    orderData?.status ||
    "Menunggu Konfirmasi";


  invoiceStatus.textContent =
    status;

}


/* =========================================================
   WHATSAPP
========================================================= */

if (btnInvoiceWA) {

  btnInvoiceWA.addEventListener(
    "click",
    sendInvoiceWhatsApp
  );

}


function sendInvoiceWhatsApp() {

  const customer =
    getCustomerData();


  const invoice =
    invoiceNumber?.textContent ||
    orderData?.invoice ||
    "-";


  const subtotal =
    checkoutItems.reduce(
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


  const discount =
    calculateDiscount(
      subtotal
    );


  const total =
    Math.max(
      0,
      subtotal - discount
    );


  let message =

`Halo Shae Cleaners 👋

Saya ingin konfirmasi pesanan.

🧾 INVOICE
${invoice}

👤 Nama:
${customer.name}

📱 WhatsApp:
${customer.phone}

📍 Alamat:
${customer.address}

🧹 PESANAN:
`;


  checkoutItems.forEach(
    (item, index) => {

      message += `

${index + 1}. ${item.name}
   Paket: ${item.variant || "-"}
   Qty: ${item.qty || 1}
   Harga: ${formatRupiah(
     Number(item.price || 0)
   )}
   Total: ${formatRupiah(
     Number(item.price || 0) *
     Number(item.qty || 1)
   )}

`;

    }
  );


  message += `

📅 Jadwal:
${getScheduleText()}

💵 Subtotal:
${formatRupiah(subtotal)}

🎟 Diskon:
${formatRupiah(discount)}

💰 TOTAL:
${formatRupiah(total)}

Status:
Menunggu Konfirmasi

Mohon dikonfirmasi untuk jadwal cleaning saya.

Terima kasih 🙏`;


  const url =
    `https://wa.me/${INVOICE_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;


  window.open(
    url,
    "_blank"
  );


  /*
    Tandai bahwa invoice
    sudah dikirim ke WhatsApp.
  */

  if (!orderData) {

    orderData = {};

  }


  orderData.whatsappSent =
    true;


  orderData.whatsappSentAt =
    new Date().toISOString();


  localStorage.setItem(
    INVOICE_ORDER_KEY,
    JSON.stringify(
      orderData
    )
  );

}


/* =========================================================
   PRINT
========================================================= */

if (btnPrintInvoice) {

  btnPrintInvoice.addEventListener(
    "click",
    () => {

      window.print();

    }
  );

}


/* =========================================================
   SCHEDULE TEXT
========================================================= */

function getScheduleText() {

  const firstItem =
    checkoutItems[0];


  if (!firstItem) {

    return "-";

  }


  const date =
    firstItem.date
      ? formatDate(
          firstItem.date
        )
      : "-";


  const time =
    firstItem.time ||
    "-";


  return `${date} • ${time}`;

}


/* =========================================================
   DATE
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

      month: "long",

      year: "numeric"

    }
  ).format(
    date
  );

}


/* =========================================================
   DATE TIME
========================================================= */

function formatDateTime(
  date
) {

  return new Intl.DateTimeFormat(
    "id-ID",
    {

      day: "2-digit",

      month: "long",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit"

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
   SET TEXT
========================================================= */

function setText(
  element,
  value
) {

  if (element) {

    element.textContent =
      value ?? "-";

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


/* =========================================================
   SAVE FINAL ORDER
========================================================= */

function saveFinalOrder() {

  const customer =
    getCustomerData();


  const subtotal =
    checkoutItems.reduce(
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


  const discount =
    calculateDiscount(
      subtotal
    );


  const total =
    Math.max(
      0,
      subtotal - discount
    );


  const finalOrder = {

    invoice:
      invoiceNumber?.textContent ||
      "-",

    customer:
      customer,

    items:
      checkoutItems,

    subtotal:
      subtotal,

    discount:
      discount,

    total:
      total,

    promo:
      checkoutPromo,

    schedule:
      getScheduleText(),

    status:
      "Menunggu Konfirmasi",

    createdAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "shae_final_order",
    JSON.stringify(
      finalOrder
    )
  );


  return finalOrder;

}


/* =========================================================
   AUTO SAVE
========================================================= */

saveFinalOrder();