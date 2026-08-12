/* =========================================================
   SHAE CLEANERS
   js/order-detail.js

   FITUR:
   - Membaca shae_active_order
   - Menampilkan detail order
   - Status pesanan
   - Invoice
   - Customer
   - Jadwal
   - Detail layanan
   - Subtotal
   - Diskon
   - Total
   - WhatsApp
   - Share order
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initOrderDetail
);


/* =========================================================
   CONFIG
========================================================= */

const ACTIVE_ORDER_KEY =
  "shae_active_order";

const ADMIN_WA =
  "6283813138221";


/* =========================================================
   STATE
========================================================= */

let order = null;


/* =========================================================
   INIT
========================================================= */

function initOrderDetail() {

  loadOrder();

  if (!order) {

    showOrderError();

    return;

  }


  renderStatus();

  renderInvoice();

  renderCustomer();

  renderSchedule();

  renderItems();

  renderPayment();

  setupWhatsApp();

  setupShare();

  setupBackButton();

}


/* =========================================================
   LOAD ORDER
========================================================= */

function loadOrder() {

  try {

    const saved =
      localStorage.getItem(
        ACTIVE_ORDER_KEY
      );


    if (!saved) {

      order = null;

      return;

    }


    const data =
      JSON.parse(
        saved
      );


    if (
      !data ||
      typeof data !== "object"
    ) {

      order = null;

      return;

    }


    order = data;


  } catch (error) {

    console.error(
      "Order detail error:",
      error
    );

    order = null;

  }

}


/* =========================================================
   STATUS
========================================================= */

function renderStatus() {

  const status =
    normalizeStatus(
      order.status
    );


  const statusText =
    getStatusText(
      status
    );


  const statusIcon =
    document.getElementById(
      "statusIcon"
    );


  const statusElement =
    document.getElementById(
      "orderStatus"
    );


  const description =
    document.getElementById(
      "statusDescription"
    );


  if (statusElement) {

    statusElement.textContent =
      statusText;

  }


  if (description) {

    description.textContent =
      getStatusDescription(
        status
      );

  }


  if (statusIcon) {

    statusIcon.innerHTML =
      `<i class="${getStatusIcon(
        status
      )}"></i>`;

  }


  /*
   * Ubah warna kartu sesuai status.
   */

  const card =
    document.querySelector(
      ".detail-status-card"
    );


  if (!card) {

    return;

  }


  card.classList.remove(
    "status-pending",
    "status-process",
    "status-completed",
    "status-cancelled"
  );


  card.classList.add(
    `status-${status}`
  );

}


/* =========================================================
   INVOICE
========================================================= */

function renderInvoice() {

  setText(
    "invoiceNumber",
    order.invoice ||
      "-"
  );


  const created =
    order.createdAt
      ? formatDateTime(
          order.createdAt
        )
      : "-";


  setText(
    "createdDate",
    created
  );

}


/* =========================================================
   CUSTOMER
========================================================= */

function renderCustomer() {

  const customer =
    order.customer || {};


  setText(
    "customerName",
    customer.name ||
      "-"
  );


  setText(
    "customerPhone",
    customer.phone ||
      "-"
  );


  setText(
    "customerAddress",
    customer.address ||
      "-"
  );


  setText(
    "customerNote",
    customer.note ||
      "-"
  );

}


/* =========================================================
   SCHEDULE
========================================================= */

function renderSchedule() {

  const customer =
    order.customer || {};


  setText(
    "serviceDate",
    formatDate(
      customer.date
    )
  );


  setText(
    "serviceTime",
    customer.time ||
      "-"
  );

}


/* =========================================================
   ITEMS
========================================================= */

function renderItems() {

  const container =
    document.getElementById(
      "orderItems"
    );


  if (!container) {

    return;

  }


  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];


  if (
    items.length === 0
  ) {

    container.innerHTML = `

      <div class="detail-item">

        <div class="detail-item-icon">

          <i
            class="fa-solid fa-box-open"
          ></i>

        </div>


        <div class="detail-item-info">

          <strong>
            Tidak ada detail layanan
          </strong>

        </div>

      </div>

    `;

    return;

  }


  container.innerHTML =
    items
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

            <div
              class="detail-item"
            >


              <div
                class="detail-item-icon"
              >

                <i
                  class="${getItemIcon(
                    item
                  )}"
                ></i>

              </div>



              <div
                class="detail-item-info"
              >

                <strong>
                  ${escapeHTML(
                    item.name ||
                    "Layanan Cleaning"
                  )}
                </strong>


                <small>
                  ${qty} ×
                  ${formatRupiah(
                    price
                  )}
                </small>

              </div>



              <div
                class="detail-item-price"
              >

                <strong>
                  ${formatRupiah(
                    subtotal
                  )}
                </strong>


                <small>
                  ${escapeHTML(
                    item.service ||
                    "Cleaning"
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
   PAYMENT
========================================================= */

function renderPayment() {

  const subtotal =
    Number(
      order.subtotal || 0
    );


  const discount =
    Number(
      order.discount || 0
    );


  const total =
    Number(
      order.total ||
      Math.max(
        0,
        subtotal - discount
      )
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
      total
    )
  );

}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp() {

  const button =
    document.getElementById(
      "whatsappOrder"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      const message =
        createWhatsAppMessage(
          order
        );


      const phone =
        normalizePhone(
          ADMIN_WA
        );


      const url =
        `https://wa.me/${phone}?text=${encodeURIComponent(
          message
        )}`;


      window.location.href =
        url;

    }
  );

}


/* =========================================================
   SHARE
========================================================= */

function setupShare() {

  const button =
    document.getElementById(
      "shareOrder"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    async function () {

      const shareData = {

        title:
          "Detail Pesanan Shae Cleaners",

        text:
          `Invoice ${order.invoice || ""} - ${formatRupiah(order.total)}`,

        url:
          window.location.href

      };


      try {

        if (
          navigator.share
        ) {

          await navigator.share(
            shareData
          );

        } else {

          await navigator.clipboard.writeText(
            window.location.href
          );


          alert(
            "Link detail pesanan berhasil disalin."
          );

        }

      } catch (error) {

        /*
         * User membatalkan share.
         * Tidak perlu menampilkan error.
         */

        console.log(
          "Share dibatalkan."
        );

      }

    }
  );

}


/* =========================================================
   BACK BUTTON
========================================================= */

function setupBackButton() {

  const button =
    document.getElementById(
      "backOrders"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      window.location.href =
        "pesanan.html";

    }
  );

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage(
  order
) {

  const customer =
    order.customer || {};


  let message =

`*DETAIL PESANAN - SHAE CLEANERS*

🧾 Invoice:
${order.invoice || "-"}

👤 Nama:
${customer.name || "-"}

📱 WhatsApp:
${customer.phone || "-"}

📍 Alamat:
${customer.address || "-"}

📅 Jadwal:
${formatDate(customer.date)}

⏰ Jam:
${customer.time || "-"}

━━━━━━━━━━━━━━
*DETAIL LAYANAN*
━━━━━━━━━━━━━━
`;


  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];


  items.forEach(
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


      message +=

`\n• ${item.name || "Layanan"}
  ${qty} × ${formatRupiah(price)}
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
${customer.note || "-"}

Mohon bantuan untuk konfirmasi pesanan saya.

Terima kasih.
`;


  return message;

}


/* =========================================================
   STATUS HELPERS
========================================================= */

function normalizeStatus(
  status
) {

  const value =
    String(
      status || ""
    )
      .toLowerCase()
      .trim();


  if (
    value.includes("selesai") ||
    value.includes("completed") ||
    value.includes("done")
  ) {

    return "completed";

  }


  if (
    value.includes("batal") ||
    value.includes("cancel")
  ) {

    return "cancelled";

  }


  if (
    value.includes("proses") ||
    value.includes("process") ||
    value.includes("dikerjakan")
  ) {

    return "process";

  }


  return "pending";

}


function getStatusText(
  status
) {

  const map = {

    pending:
      "Menunggu Konfirmasi",

    process:
      "Sedang Diproses",

    completed:
      "Pesanan Selesai",

    cancelled:
      "Pesanan Dibatalkan"

  };


  return (
    map[status] ||
    "Menunggu Konfirmasi"
  );

}


function getStatusDescription(
  status
) {

  const map = {

    pending:
      "Pesanan sedang menunggu konfirmasi dari Shae Cleaners.",

    process:
      "Pesanan kamu sedang diproses oleh tim Shae Cleaners.",

    completed:
      "Pesanan sudah selesai. Terima kasih telah menggunakan Shae Cleaners.",

    cancelled:
      "Pesanan ini telah dibatalkan."

  };


  return (
    map[status] ||
    map.pending
  );

}


function getStatusIcon(
  status
) {

  const map = {

    pending:
      "fa-solid fa-clock",

    process:
      "fa-solid fa-spinner",

    completed:
      "fa-solid fa-circle-check",

    cancelled:
      "fa-solid fa-circle-xmark"

  };


  return (
    map[status] ||
    map.pending
  );

}


/* =========================================================
   ITEM ICON
========================================================= */

function getItemIcon(
  item
) {

  const value =
    (
      `${item.name || ""} ${item.service || ""}`
    )
      .toLowerCase();


  if (
    value.includes("sofa")
  ) {

    return "fa-solid fa-couch";

  }


  if (
    value.includes("kasur") ||
    value.includes("spring")
  ) {

    return "fa-solid fa-bed";

  }


  if (
    value.includes("jok") ||
    value.includes("mobil")
  ) {

    return "fa-solid fa-car";

  }


  if (
    value.includes("karpet")
  ) {

    return "fa-solid fa-rug";

  }


  if (
    value.includes("gorden")
  ) {

    return "fa-solid fa-scroll";

  }


  if (
    value.includes("kursi")
  ) {

    return "fa-solid fa-chair";

  }


  if (
    value.includes("ac")
  ) {

    return "fa-solid fa-snowflake";

  }


  return "fa-solid fa-spray-can-sparkles";

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

      day:
        "2-digit",

      month:
        "long",

      year:
        "numeric"

    }
  ).format(
    date
  );

}


/* =========================================================
   FORMAT DATETIME
========================================================= */

function formatDateTime(
  value
) {

  const date =
    new Date(
      value
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

      day:
        "2-digit",

      month:
        "long",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit"

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
   SET TEXT
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
   ERROR
========================================================= */

function showOrderError() {

  const page =
    document.querySelector(
      ".detail-page"
    );


  if (!page) {

    return;

  }


  page.innerHTML = `

    <section
      class="detail-error"
    >

      <i
        class="fa-solid fa-receipt"
      ></i>


      <h3>
        Pesanan tidak ditemukan
      </h3>


      <p>
        Detail pesanan tidak tersedia
        atau sudah tidak tersimpan.
      </p>


    </section>

  `;

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