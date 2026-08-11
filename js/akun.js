/* =========================================================
   SHAE CLEANERS
   js/Akun.js
   ACCOUNT SYSTEM
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initAccount
);


/* =========================================================
   INIT
========================================================= */

function initAccount() {

  loadProfile();

  loadLatestOrders();

  setupLogout();

}


/* =========================================================
   LOAD PROFILE
========================================================= */

function loadProfile() {

  const nameElement =
    document.getElementById(
      "accountName"
    );

  const phoneElement =
    document.getElementById(
      "accountPhone"
    );

  const initialElement =
    document.getElementById(
      "accountInitial"
    );

  const statusElement =
    document.getElementById(
      "accountStatus"
    );


  let session = null;


  try {

    const saved =
      localStorage.getItem(
        "shae_session"
      );


    if (saved) {

      session =
        JSON.parse(saved);

    }

  } catch (error) {

    console.error(
      "Session tidak valid:",
      error
    );

  }


  /* =====================================================
     BELUM LOGIN
  ===================================================== */

  if (!session) {

    if (nameElement) {

      nameElement.textContent =
        "Belum Login";

    }


    if (phoneElement) {

      phoneElement.textContent =
        "Silakan login terlebih dahulu";

    }


    if (initialElement) {

      initialElement.textContent =
        "?";

    }


    if (statusElement) {

      statusElement.textContent =
        "Guest";

    }


    return;

  }


  /* =====================================================
     DATA CUSTOMER
  ===================================================== */

  const name =
    session.name ||
    "Customer";


  const phone =
    session.phone ||
    "";


  if (nameElement) {

    nameElement.textContent =
      name;

  }


  if (phoneElement) {

    phoneElement.textContent =
      formatPhone(phone);

  }


  if (statusElement) {

    statusElement.textContent =
      "Member Shae Cleaners";

  }


  if (initialElement) {

    initialElement.textContent =
      getInitial(name);

  }

}


/* =========================================================
   INITIAL
========================================================= */

function getInitial(
  name
) {

  if (!name) {

    return "S";

  }


  const words =
    name
      .trim()
      .split(/\s+/);


  if (words.length === 1) {

    return words[0]
      .charAt(0)
      .toUpperCase();

  }


  return (

    words[0]
      .charAt(0)
      .toUpperCase() +

    words[1]
      .charAt(0)
      .toUpperCase()

  );

}


/* =========================================================
   PHONE FORMAT
========================================================= */

function formatPhone(
  phone
) {

  if (!phone) {

    return "-";

  }


  let value =
    String(phone)
      .replace(
        /\D/g,
        ""
      );


  if (
    value.startsWith("62")
  ) {

    value =
      "0" +
      value.substring(2);

  }


  if (
    value.length > 7
  ) {

    return (
      value.substring(0, 4) +
      "-" +
      value.substring(4, 8) +
      "-" +
      value.substring(8)
    );

  }


  return value;

}


/* =========================================================
   LOAD LATEST ORDERS
========================================================= */

function loadLatestOrders() {

  const container =
    document.getElementById(
      "latestOrders"
    );


  if (!container) {

    return;

  }


  const orders =
    getOrders();


  /* =====================================================
     BELUM ADA ORDER
  ===================================================== */

  if (
    orders.length === 0
  ) {

    container.innerHTML = `

      <div class="latest-order-empty">

        <i class="fa-solid fa-box-open"></i>

        <strong>
          Belum ada pesanan
        </strong>

        <span>
          Yuk pesan layanan cleaning sekarang
        </span>

      </div>

    `;


    return;

  }


  /* =====================================================
     SORT TERBARU
  ===================================================== */

  orders.sort(
    (a, b) => {

      const dateA =
        new Date(
          a.createdAt ||
          a.tanggal ||
          0
        );

      const dateB =
        new Date(
          b.createdAt ||
          b.tanggal ||
          0
        );


      return dateB - dateA;

    }
  );


  /* =====================================================
     MAKSIMAL 3 ORDER
  ===================================================== */

  const latest =
    orders.slice(
      0,
      3
    );


  container.innerHTML =
    latest
      .map(
        order =>
          createOrderCard(
            order
          )
      )
      .join("");


  bindOrderCards();

}


/* =========================================================
   ORDER CARD
========================================================= */

function createOrderCard(
  order
) {

  const service =
    order.layanan ||
    order.service ||
    "Layanan Cleaning";


  const invoice =
    order.invoice ||
    order.orderId ||
    "-";


  const total =
    Number(
      order.total ||
      order.totalHarga ||
      order.amount ||
      0
    );


  const status =
    order.status ||
    "Menunggu";


  const date =
    formatDate(
      order.createdAt ||
      order.tanggal
    );


  return `

    <div
      class="latest-order-card"
      data-order-id="${escapeHTML(invoice)}"
    >

      <div class="latest-order-icon">

        <i class="fa-solid fa-spray-can-sparkles"></i>

      </div>


      <div class="latest-order-content">

        <strong>
          ${escapeHTML(service)}
        </strong>

        <span>
          ${escapeHTML(invoice)} • ${date}
        </span>

      </div>


      <div class="latest-order-price">

        <strong>
          ${formatRupiah(total)}
        </strong>

        <span>
          ${escapeHTML(status)}
        </span>

      </div>

    </div>

  `;

}


/* =========================================================
   ORDER CLICK
========================================================= */

function bindOrderCards() {

  document
    .querySelectorAll(
      ".latest-order-card"
    )
    .forEach(
      card => {

        card.addEventListener(
          "click",
          () => {

            const orderId =
              card.dataset.orderId;


            if (!orderId) {

              return;

            }


            localStorage.setItem(
              "selectedOrderId",
              orderId
            );


            location.href =
              "order-detail.html";

          }
        );

      }
    );

}


/* =========================================================
   GET ORDERS
========================================================= */

function getOrders() {

  const possibleKeys = [

    "shae_orders",

    "orders",

    "orderHistory",

    "shae_order_history"

  ];


  for (
    const key of possibleKeys
  ) {

    try {

      const saved =
        localStorage.getItem(
          key
        );


      if (!saved) {

        continue;

      }


      const data =
        JSON.parse(saved);


      if (
        Array.isArray(data)
      ) {

        return data;

      }


      if (
        data &&
        Array.isArray(
          data.orders
        )
      ) {

        return data.orders;

      }

    } catch (error) {

      console.warn(
        "Gagal membaca:",
        key
      );

    }

  }


  return [];

}


/* =========================================================
   LOGOUT
========================================================= */

function setupLogout() {

  const button =
    document.getElementById(
      "logoutButton"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    () => {

      const confirmLogout =
        confirm(
          "Yakin ingin keluar dari akun?"
        );


      if (!confirmLogout) {

        return;

      }


      localStorage.removeItem(
        "shae_session"
      );


      localStorage.removeItem(
        "shae_guest"
      );


      location.href =
        "login.html";

    }
  );

}


/* =========================================================
   RUPIAH
========================================================= */

function formatRupiah(
  number
) {

  const value =
    Number(number) || 0;


  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }
  ).format(value);

}


/* =========================================================
   DATE
========================================================= */

function formatDate(
  value
) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(value);

  }


  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);

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