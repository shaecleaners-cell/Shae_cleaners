/* =========================================================
   SHAE CLEANERS
   js/aktivitas.js

   FITUR:
   - Membaca riwayat order
   - Statistik pesanan
   - Filter status
   - Lihat detail
   - Kirim WhatsApp
   - Hapus seluruh aktivitas
   - Responsive
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initAktivitas
);


/* =========================================================
   CONFIG
========================================================= */

const ORDER_KEY =
  "shae_orders";

const ACTIVE_ORDER_KEY =
  "shae_active_order";

const ADMIN_WA =
  "6283813138221";


/* =========================================================
   STATE
========================================================= */

let orders = [];

let currentFilter =
  "all";


/* =========================================================
   INIT
========================================================= */

function initAktivitas() {

  loadOrders();

  updateStatistics();

  setupFilters();

  setupClearButton();

  renderOrders();

}


/* =========================================================
   LOAD ORDERS
========================================================= */

function loadOrders() {

  try {

    const saved =
      localStorage.getItem(
        ORDER_KEY
      );


    if (!saved) {

      orders = [];

      return;

    }


    const data =
      JSON.parse(
        saved
      );


    orders =
      Array.isArray(data)
        ? data
        : [];


    /*
     * Urutkan order terbaru
     * di bagian paling atas.
     */

    orders.sort(
      (
        a,
        b
      ) => {

        return (
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
        );

      }
    );


  } catch (error) {

    console.error(
      "Gagal membaca aktivitas:",
      error
    );

    orders = [];

  }

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

  const total =
    orders.length;


  const waiting =
    orders.filter(
      order =>
        normalizeStatus(
          order.status
        ) ===
        "waiting"
    ).length;


  const completed =
    orders.filter(
      order =>
        normalizeStatus(
          order.status
        ) ===
        "completed"
    ).length;


  setText(
    "totalOrders",
    total
  );


  setText(
    "waitingOrders",
    waiting
  );


  setText(
    "completedOrders",
    completed
  );

}


/* =========================================================
   FILTER
========================================================= */

function setupFilters() {

  const buttons =
    document.querySelectorAll(
      ".filter-btn"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        function () {

          buttons.forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          this.classList.add(
            "active"
          );


          currentFilter =
            this.dataset.filter ||
            "all";


          renderOrders();

        }
      );

    }
  );

}


/* =========================================================
   FILTER ORDERS
========================================================= */

function getFilteredOrders() {

  if (
    currentFilter ===
    "all"
  ) {

    return orders;

  }


  return orders.filter(
    order => {

      const status =
        String(
          order.status || ""
        );


      return status
        .toLowerCase()
        .trim() ===
        currentFilter
          .toLowerCase()
          .trim();

    }
  );

}


/* =========================================================
   RENDER
========================================================= */

function renderOrders() {

  const container =
    document.getElementById(
      "activityList"
    );


  if (!container) {

    return;

  }


  const filtered =
    getFilteredOrders();


  if (
    filtered.length === 0
  ) {

    container.innerHTML =
      getEmptyHTML();


    return;

  }


  container.innerHTML =
    filtered
      .map(
        order =>
          createOrderCard(
            order
          )
      )
      .join("");


  bindOrderButtons();

}


/* =========================================================
   ORDER CARD
========================================================= */

function createOrderCard(
  order
) {

  const invoice =
    order.invoice ||
    "INV-UNKNOWN";


  const customer =
    order.customer ||
    {};


  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];


  const total =
    Number(
      order.total || 0
    );


  const status =
    getStatusData(
      order.status
    );


  const date =
    customer.date
      ? formatDate(
          customer.date
        )
      : formatCreatedDate(
          order.createdAt
        );


  const time =
    customer.time ||
    "-";


  const services =
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


          return `

            <div class="service-line">

              <span
                class="service-name"
                title="${escapeHTML(
                  item.name
                )}"
              >
                ${escapeHTML(
                  item.name
                )}
                ×${qty}
              </span>


              <span class="service-price">
                ${formatRupiah(
                  qty * price
                )}
              </span>

            </div>

          `;

        }
      )
      .join("");


  return `

    <article
      class="activity-card"
      data-invoice="${escapeHTML(
        invoice
      )}"
    >

      <div class="activity-card-top">

        <div class="invoice-info">

          <strong>
            ${escapeHTML(
              invoice
            )}
          </strong>

          <small>
            ${formatCreatedDate(
              order.createdAt
            )}
          </small>

        </div>


        <span
          class="status ${status.className}"
        >
          ${status.label}
        </span>

      </div>



      <div class="activity-info">


        <div class="info-item">

          <div class="info-icon">

            <i
              class="fa-solid fa-calendar"
            ></i>

          </div>

          <div>

            <strong>Jadwal</strong>

            <span>
              ${escapeHTML(
                date
              )}
            </span>

          </div>

        </div>



        <div class="info-item">

          <div class="info-icon">

            <i
              class="fa-solid fa-clock"
            ></i>

          </div>

          <div>

            <strong>Jam</strong>

            <span>
              ${escapeHTML(
                time
              )}
            </span>

          </div>

        </div>


      </div>



      <div class="activity-services">

        ${services || `

          <div class="service-line">

            <span class="service-name">
              Tidak ada detail layanan
            </span>

          </div>

        `}

      </div>



      <div class="activity-total">

        <span>
          Total Pesanan
        </span>

        <strong>
          ${formatRupiah(
            total
          )}
        </strong>

      </div>



      <div class="activity-actions">

        <button
          class="activity-action primary"
          data-action="detail"
          data-invoice="${escapeHTML(
            invoice
          )}"
        >

          <i
            class="fa-solid fa-file-invoice"
          ></i>

          Lihat Detail

        </button>


        <button
          class="activity-action whatsapp"
          data-action="whatsapp"
          data-invoice="${escapeHTML(
            invoice
          )}"
        >

          <i
            class="fa-brands fa-whatsapp"
          ></i>

          WhatsApp

        </button>

      </div>


    </article>

  `;

}


/* =========================================================
   BUTTONS
========================================================= */

function bindOrderButtons() {

  const buttons =
    document.querySelectorAll(
      "[data-action]"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        function () {

          const action =
            this.dataset.action;


          const invoice =
            this.dataset.invoice;


          const order =
            orders.find(
              item =>
                item.invoice ===
                invoice
            );


          if (!order) {

            alert(
              "Data pesanan tidak ditemukan."
            );

            return;

          }


          if (
            action ===
            "detail"
          ) {

            openOrderDetail(
              order
            );

          }


          if (
            action ===
            "whatsapp"
          ) {

            sendWhatsApp(
              order
            );

          }

        }
      );

    }
  );

}


/* =========================================================
   OPEN DETAIL
========================================================= */

function openOrderDetail(
  order
) {

  /*
   * Simpan order yang dipilih
   * agar order-detail.js dapat
   * membacanya.
   */

  localStorage.setItem(
    ACTIVE_ORDER_KEY,
    JSON.stringify(
      order
    )
  );


  /*
   * Jika halaman detail
   * tersedia.
   */

  window.location.href =
    "order-detail.html";

}


/* =========================================================
   WHATSAPP
========================================================= */

function sendWhatsApp(
  order
) {

  const message =
    createWhatsAppMessage(
      order
    );


  const url =
    `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(
      message
    )}`;


  window.location.href =
    url;

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage(
  order
) {

  const customer =
    order.customer ||
    {};


  let message =

`*SHAE CLEANERS*

🧾 Invoice:
${order.invoice || "-"}

👤 Nama:
${customer.name || "-"}

📱 WhatsApp:
${customer.phone || "-"}

📍 Alamat:
${customer.address || "-"}

📅 Jadwal:
${customer.date
  ? formatDate(
      customer.date
    )
  : "-"}

⏰ Jam:
${customer.time || "-"}

━━━━━━━━━━━━━━
*DETAIL PESANAN*
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


      message +=

`\n• ${item.name || "Layanan"}
  ${qty} × ${formatRupiah(price)}
  = ${formatRupiah(
    qty * price
  )}
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

Status:
${order.status || "-"}
━━━━━━━━━━━━━━
`;

  return message;

}


/* =========================================================
   CLEAR ACTIVITY
========================================================= */

function setupClearButton() {

  const button =
    document.getElementById(
      "clearActivity"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      if (
        orders.length === 0
      ) {

        alert(
          "Belum ada aktivitas."
        );

        return;

      }


      const confirmed =
        confirm(
          "Hapus semua riwayat pesanan?"
        );


      if (!confirmed) {

        return;

      }


      localStorage.removeItem(
        ORDER_KEY
      );


      localStorage.removeItem(
        ACTIVE_ORDER_KEY
      );


      orders = [];


      updateStatistics();

      renderOrders();


      alert(
        "Riwayat pesanan berhasil dihapus."
      );

    }
  );

}


/* =========================================================
   EMPTY
========================================================= */

function getEmptyHTML() {

  let message =
    "Belum ada pesanan pada kategori ini.";


  if (
    orders.length === 0
  ) {

    message =
      "Pesanan yang kamu buat akan muncul di sini.";

  }


  return `

    <div class="activity-empty">

      <div class="activity-empty-icon">

        <i
          class="fa-solid fa-receipt"
        ></i>

      </div>


      <strong>
        Belum Ada Aktivitas
      </strong>


      <p>
        ${message}
      </p>


      <a
        href="order.html"
        class="empty-button"
      >

        <i
          class="fa-solid fa-plus"
        ></i>

        Buat Pesanan

      </a>

    </div>

  `;

}


/* =========================================================
   STATUS
========================================================= */

function getStatusData(
  status
) {

  const normalized =
    normalizeStatus(
      status
    );


  if (
    normalized ===
    "completed"
  ) {

    return {

      label: "Selesai",

      className:
        "completed"

    };

  }


  if (
    normalized ===
    "process"
  ) {

    return {

      label: "Diproses",

      className:
        "process"

    };

  }


  if (
    normalized ===
    "cancelled"
  ) {

    return {

      label: "Dibatalkan",

      className:
        "cancelled"

    };

  }


  return {

    label:
      status ||
      "Menunggu Konfirmasi",

    className:
      "waiting"

  };

}


/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(
  status
) {

  const value =
    String(
      status ||
      ""
    )
      .toLowerCase()
      .trim();


  if (
    value.includes(
      "selesai"
    ) ||
    value.includes(
      "complete"
    )
  ) {

    return "completed";

  }


  if (
    value.includes(
      "proses"
    ) ||
    value.includes(
      "process"
    )
  ) {

    return "process";

  }


  if (
    value.includes(
      "batal"
    ) ||
    value.includes(
      "cancel"
    )
  ) {

    return "cancelled";

  }


  if (
    value.includes(
      "tunggu"
    ) ||
    value.includes(
      "konfirmasi"
    )
  ) {

    return "waiting";

  }


  return "waiting";

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


  try {

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

        month: "short",

        year: "numeric"

      }
    ).format(
      date
    );

  } catch {

    return value;

  }

}


/* =========================================================
   CREATED DATE
========================================================= */

function formatCreatedDate(
  value
) {

  if (!value) {

    return "-";

  }


  try {

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

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit"

      }
    ).format(
      date
    );

  } catch {

    return "-";

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
    Number(
      value || 0
    )
  );

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