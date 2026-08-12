/* =========================================================
   SHAE CLEANERS
   js/pesanan.js

   FITUR:
   - Membaca shae_orders
   - Menampilkan daftar pesanan
   - Filter status
   - Statistik pesanan
   - Detail pesanan
   - Refresh
   - Order terbaru di atas
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initPesanan
);


/* =========================================================
   CONFIG
========================================================= */

const ORDER_KEY =
  "shae_orders";

const ACTIVE_ORDER_KEY =
  "shae_active_order";


/* =========================================================
   STATE
========================================================= */

let orders = [];

let currentFilter =
  "all";


/* =========================================================
   INIT
========================================================= */

function initPesanan() {

  loadOrders();

  renderStatistics();

  renderOrders();

  setupFilters();

  setupRefresh();

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
     * Pastikan order terbaru
     * berada paling atas.
     */

    orders.sort(
      (
        a,
        b
      ) => {

        const dateA =
          new Date(
            a.createdAt || 0
          ).getTime();


        const dateB =
          new Date(
            b.createdAt || 0
          ).getTime();


        return dateB - dateA;

      }
    );


  } catch (error) {

    console.error(
      "Gagal membaca pesanan:",
      error
    );

    orders = [];

  }

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics() {

  const total =
    orders.length;


  const pending =
    orders.filter(
      order =>
        normalizeStatus(
          order.status
        ) === "pending"
    ).length;


  const completed =
    orders.filter(
      order =>
        normalizeStatus(
          order.status
        ) === "completed"
    ).length;


  setText(
    "totalOrders",
    total
  );


  setText(
    "pendingOrders",
    pending
  );


  setText(
    "completedOrders",
    completed
  );

}


/* =========================================================
   RENDER ORDERS
========================================================= */

function renderOrders() {

  const container =
    document.getElementById(
      "orderList"
    );


  const empty =
    document.getElementById(
      "emptyOrders"
    );


  if (!container) {

    return;

  }


  let filtered =
    [...orders];


  /*
   * FILTER
   */

  if (
    currentFilter !== "all"
  ) {

    filtered =
      filtered.filter(
        order =>
          normalizeStatus(
            order.status
          ) === currentFilter
      );

  }


  /*
   * EMPTY
   */

  if (
    filtered.length === 0
  ) {

    container.innerHTML =
      "";


    if (empty) {

      empty.hidden =
        false;

    }


    return;

  }


  if (empty) {

    empty.hidden =
      true;

  }


  container.innerHTML =
    filtered
      .map(
        (
          order,
          index
        ) =>
          createOrderCard(
            order,
            index
          )
      )
      .join("");


  /*
   * DETAIL BUTTONS
   */

  container
    .querySelectorAll(
      "[data-order-index]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          function () {

            const index =
              Number(
                this.dataset.orderIndex
              );


            openOrderDetail(
              filtered[index]
            );

          }
        );

      }
    );

}


/* =========================================================
   CREATE ORDER CARD
========================================================= */

function createOrderCard(
  order,
  index
) {

  const status =
    normalizeStatus(
      order.status
    );


  const statusText =
    getStatusText(
      status
    );


  const statusClass =
    getStatusClass(
      status
    );


  const invoice =
    order.invoice ||
    "INV-UNKNOWN";


  const total =
    Number(
      order.total || 0
    );


  const itemCount =
    Array.isArray(
      order.items
    )
      ? order.items.reduce(
          (
            sum,
            item
          ) =>
            sum +
            Number(
              item.qty || 0
            ),
          0
        )
      : 0;


  const customerName =
    order.customer?.name ||
    "Customer";


  const date =
    order.customer?.date ||
    "";


  const time =
    order.customer?.time ||
    "";


  const service =
    getServiceName(
      order
    );


  return `

    <article
      class="order-card"
    >


      <div
        class="order-card-top"
      >


        <div
          class="order-invoice"
        >

          <span>
            Nomor Invoice
          </span>

          <strong>
            ${escapeHTML(
              invoice
            )}
          </strong>

        </div>


        <span
          class="order-status ${statusClass}"
        >

          ${statusText}

        </span>


      </div>



      <div
        class="order-divider"
      ></div>



      <div
        class="order-info"
      >


        <div
          class="order-info-item"
        >

          <i
            class="fa-solid fa-user"
          ></i>


          <div>

            <small>
              Customer
            </small>

            <strong>
              ${escapeHTML(
                customerName
              )}
            </strong>

          </div>

        </div>



        <div
          class="order-info-item"
        >

          <i
            class="fa-solid fa-couch"
          ></i>


          <div>

            <small>
              Layanan
            </small>

            <strong>
              ${escapeHTML(
                service
              )}
            </strong>

          </div>

        </div>



        <div
          class="order-info-item"
        >

          <i
            class="fa-solid fa-calendar"
          ></i>


          <div>

            <small>
              Jadwal
            </small>

            <strong>
              ${formatDate(
                date
              )}
            </strong>

          </div>

        </div>



        <div
          class="order-info-item"
        >

          <i
            class="fa-solid fa-clock"
          ></i>


          <div>

            <small>
              Jam
            </small>

            <strong>
              ${escapeHTML(
                time || "-"
              )}
            </strong>

          </div>

        </div>


      </div>



      <div
        class="order-card-bottom"
      >


        <div
          class="order-total"
        >

          <small>
            ${itemCount} item · Total
          </small>


          <strong>
            ${formatRupiah(
              total
            )}
          </strong>

        </div>


        <button
          type="button"
          class="order-detail-btn"
          data-order-index="${index}"
        >

          Detail

          <i
            class="fa-solid fa-chevron-right"
          ></i>

        </button>


      </div>


    </article>

  `;

}


/* =========================================================
   GET SERVICE NAME
========================================================= */

function getServiceName(
  order
) {

  if (
    !order ||
    !Array.isArray(
      order.items
    ) ||
    order.items.length === 0
  ) {

    return "Layanan Cleaning";

  }


  const names =
    order.items
      .map(
        item =>
          item.name ||
          item.service ||
          "Layanan"
      );


  /*
   * Hilangkan nama yang sama.
   */

  const unique =
    [...new Set(
      names
    )];


  if (
    unique.length <= 2
  ) {

    return unique.join(
      ", "
    );

  }


  return (
    unique
      .slice(0, 2)
      .join(", ") +
    ` +${unique.length - 2}`
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
   REFRESH
========================================================= */

function setupRefresh() {

  const button =
    document.getElementById(
      "refreshOrders"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      this.classList.add(
        "rotating"
      );


      loadOrders();

      renderStatistics();

      renderOrders();


      setTimeout(
        () => {

          this.classList.remove(
            "rotating"
          );

        },
        500
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

  if (!order) {

    return;

  }


  /*
   * Simpan order yang dipilih.
   */

  localStorage.setItem(
    ACTIVE_ORDER_KEY,
    JSON.stringify(
      order
    )
  );


  /*
   * Jika halaman order-detail
   * sudah tersedia, buka halaman
   * tersebut.
   */

  window.location.href =
    "order-detail.html";

}


/* =========================================================
   STATUS NORMALIZER
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
    value.includes(
      "selesai"
    ) ||
    value.includes(
      "completed"
    ) ||
    value.includes(
      "done"
    )
  ) {

    return "completed";

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
      "proses"
    ) ||
    value.includes(
      "process"
    ) ||
    value.includes(
      "dikerjakan"
    )
  ) {

    return "process";

  }


  return "pending";

}


/* =========================================================
   STATUS TEXT
========================================================= */

function getStatusText(
  status
) {

  const map = {

    pending:
      "Menunggu",

    process:
      "Diproses",

    completed:
      "Selesai",

    cancelled:
      "Dibatalkan"

  };


  return (
    map[status] ||
    "Menunggu"
  );

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(
  status
) {

  const map = {

    pending:
      "status-pending",

    process:
      "status-process",

    completed:
      "status-completed",

    cancelled:
      "status-cancelled"

  };


  return (
    map[status] ||
    "status-pending"
  );

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
        "short",

      year:
        "numeric"

    }
  ).format(
    date
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
    Number(
      value
    ) || 0
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