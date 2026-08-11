/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/tracking.js
   ORDER TRACKING
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const TRACKING_ORDER_KEY =
  "shae_order";

const TRACKING_STATUS_KEY =
  "shae_order_status";

const TRACKING_WHATSAPP =
  "6283813138221";


/* =========================================================
   ELEMENTS
========================================================= */

const trackingEmpty =
  document.getElementById(
    "trackingEmpty"
  );

const trackingContent =
  document.getElementById(
    "trackingContent"
  );

const trackingStatus =
  document.getElementById(
    "trackingStatus"
  );

const trackingStatusIcon =
  document.getElementById(
    "trackingStatusIcon"
  );

const trackingInvoice =
  document.getElementById(
    "trackingInvoice"
  );

const trackingCustomerName =
  document.getElementById(
    "trackingCustomerName"
  );

const trackingCustomerPhone =
  document.getElementById(
    "trackingCustomerPhone"
  );

const trackingCustomerAddress =
  document.getElementById(
    "trackingCustomerAddress"
  );

const trackingItems =
  document.getElementById(
    "trackingItems"
  );

const trackingTotal =
  document.getElementById(
    "trackingTotal"
  );

const trackingInvoiceButton =
  document.getElementById(
    "trackingInvoiceButton"
  );

const trackingWhatsAppButton =
  document.getElementById(
    "trackingWhatsAppButton"
  );

const trackingRefreshButton =
  document.getElementById(
    "trackingRefreshButton"
  );

const trackingToast =
  document.getElementById(
    "trackingToast"
  );

const trackingToastText =
  document.getElementById(
    "trackingToastText"
  );


/* =========================================================
   STATUS CONFIG
========================================================= */

const TRACKING_STATUS_LIST = [

  {
    key: "created",

    title: "Pesanan Dibuat",

    icon: "fa-receipt"

  },

  {
    key: "confirmed",

    title: "Dikonfirmasi",

    icon: "fa-circle-check"

  },

  {
    key: "processing",

    title: "Sedang Diproses",

    icon: "fa-broom"

  },

  {
    key: "onway",

    title: "Teknisi Berangkat",

    icon: "fa-truck-fast"

  },

  {
    key: "completed",

    title: "Selesai",

    icon: "fa-star"

  }

];


/* =========================================================
   CURRENT ORDER
========================================================= */

let trackingOrder =
  null;


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadTrackingOrder();

  }
);


/* =========================================================
   LOAD ORDER
========================================================= */

function loadTrackingOrder() {

  let order =
    null;


  try {

    order =
      JSON.parse(
        localStorage.getItem(
          TRACKING_ORDER_KEY
        )
      );

  } catch {

    order =
      null;

  }


  if (
    !order ||
    !order.customer ||
    !Array.isArray(
      order.items
    )
  ) {

    showEmptyTracking();

    return;

  }


  trackingOrder =
    order;


  showTrackingContent();

  renderTracking();


}


/* =========================================================
   SHOW CONTENT
========================================================= */

function showTrackingContent() {

  if (trackingEmpty) {

    trackingEmpty.style.display =
      "none";

  }


  if (trackingContent) {

    trackingContent.style.display =
      "block";

  }

}


/* =========================================================
   SHOW EMPTY
========================================================= */

function showEmptyTracking() {

  if (trackingEmpty) {

    trackingEmpty.style.display =
      "flex";

  }


  if (trackingContent) {

    trackingContent.style.display =
      "none";

  }

}


/* =========================================================
   RENDER TRACKING
========================================================= */

function renderTracking() {

  if (!trackingOrder) {

    return;

  }


  const order =
    trackingOrder;


  const customer =
    order.customer ||
    {};


  /* -----------------------------------------
     INVOICE
  ----------------------------------------- */

  if (trackingInvoice) {

    trackingInvoice.textContent =
      order.invoice ||
      "-";

  }


  /* -----------------------------------------
     CUSTOMER
  ----------------------------------------- */

  if (trackingCustomerName) {

    trackingCustomerName.textContent =
      customer.name ||
      "-";

  }


  if (trackingCustomerPhone) {

    trackingCustomerPhone.textContent =
      customer.phoneOriginal ||
      formatTrackingPhone(
        customer.phone
      ) ||
      "-";

  }


  if (trackingCustomerAddress) {

    trackingCustomerAddress.textContent =
      customer.address ||
      "-";

  }


  /* -----------------------------------------
     ITEMS
  ----------------------------------------- */

  renderTrackingItems(
    order.items
  );


  /* -----------------------------------------
     TOTAL
  ----------------------------------------- */

  if (trackingTotal) {

    trackingTotal.textContent =
      formatTrackingRupiah(
        order.total
      );

  }


  /* -----------------------------------------
     STATUS
  ----------------------------------------- */

  const currentStatus =
    getCurrentStatus(
      order
    );


  updateTrackingStatus(
    currentStatus
  );

}


/* =========================================================
   GET CURRENT STATUS
========================================================= */

function getCurrentStatus(
  order
) {

  /*
    Status disimpan terpisah
    supaya admin nantinya dapat
    mengubah status tanpa
    mengubah data order.
  */

  let savedStatus =
    null;


  try {

    savedStatus =
      localStorage.getItem(
        `${TRACKING_STATUS_KEY}_${order.invoice}`
      );

  } catch {

    savedStatus =
      null;

  }


  if (
    savedStatus &&
    TRACKING_STATUS_LIST.some(
      status =>
        status.key ===
        savedStatus
    )
  ) {

    return savedStatus;

  }


  /*
    Default status.
  */

  return (
    order.status ||
    "created"
  );

}


/* =========================================================
   UPDATE STATUS
========================================================= */

function updateTrackingStatus(
  statusKey
) {

  const statusIndex =
    TRACKING_STATUS_LIST.findIndex(
      status =>
        status.key ===
        statusKey
    );


  const current =
    TRACKING_STATUS_LIST[
      statusIndex >= 0
        ? statusIndex
        : 0
    ];


  /* -----------------------------------------
     STATUS TITLE
  ----------------------------------------- */

  if (trackingStatus) {

    trackingStatus.textContent =
      current.title;

  }


  /* -----------------------------------------
     STATUS ICON
  ----------------------------------------- */

  if (trackingStatusIcon) {

    trackingStatusIcon.innerHTML = `

      <i class="fa-solid ${current.icon}"></i>

    `;

  }


  /* -----------------------------------------
     TIMELINE
  ----------------------------------------- */

  const steps =
    document.querySelectorAll(
      ".tracking-step"
    );


  steps.forEach(
    (
      step,
      index
    ) => {

      step.classList.remove(
        "active"
      );

      step.classList.remove(
        "completed"
      );


      if (
        index <
        statusIndex
      ) {

        step.classList.add(
          "completed"
        );

      }


      if (
        index ===
        statusIndex
      ) {

        step.classList.add(
          "active"
        );

      }

    }
  );

}


/* =========================================================
   RENDER ITEMS
========================================================= */

function renderTrackingItems(
  items
) {

  if (!trackingItems) {

    return;

  }


  trackingItems.innerHTML =
    "";


  if (
    !Array.isArray(items) ||
    !items.length
  ) {

    trackingItems.innerHTML = `

      <div class="tracking-item">

        <div class="tracking-item-info">

          <div class="tracking-item-name">

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
        "tracking-item";


      element.innerHTML = `

        <div class="tracking-item-info">

          <div class="tracking-item-name">

            ${escapeTrackingHTML(
              item.name ||
              "Layanan"
            )}

          </div>


          <div class="tracking-item-detail">

            ${escapeTrackingHTML(
              item.variant ||
              ""
            )}

            ${item.variant ? " • " : ""}

            ${qty} x
            ${formatTrackingRupiah(
              price
            )}

          </div>

        </div>


        <div class="tracking-item-price">

          ${formatTrackingRupiah(
            total
          )}

        </div>

      `;


      trackingItems.appendChild(
        element
      );

    }
  );

}


/* =========================================================
   INVOICE BUTTON
========================================================= */

if (trackingInvoiceButton) {

  trackingInvoiceButton.addEventListener(
    "click",
    () => {

      if (
        !trackingOrder ||
        !trackingOrder.invoice
      ) {

        showTrackingToast(
          "Invoice tidak ditemukan."
        );

        return;

      }


      const invoice =
        encodeURIComponent(
          trackingOrder.invoice
        );


      window.location.href =
        `invoice.html?invoice=${invoice}`;

    }
  );

}


/* =========================================================
   WHATSAPP BUTTON
========================================================= */

if (trackingWhatsAppButton) {

  trackingWhatsAppButton.addEventListener(
    "click",
    openTrackingWhatsApp
  );

}


function openTrackingWhatsApp() {

  if (!trackingOrder) {

    return;

  }


  const customer =
    trackingOrder.customer ||
    {};


  const message =
`Halo Shae Cleaners 👋

Saya ingin menanyakan pesanan saya.

🧾 Invoice:
${trackingOrder.invoice || "-"}

👤 Nama:
${customer.name || "-"}

Mohon informasi mengenai status pesanan saya.

Terima kasih 🙏`;


  const url =
    `https://wa.me/${TRACKING_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`;


  window.open(
    url,
    "_blank"
  );

}


/* =========================================================
   REFRESH
========================================================= */

if (trackingRefreshButton) {

  trackingRefreshButton.addEventListener(
    "click",
    () => {

      trackingRefreshButton.classList.add(
        "loading"
      );


      setTimeout(
        () => {

          loadTrackingOrder();


          trackingRefreshButton.classList.remove(
            "loading"
          );


          showTrackingToast(
            "Status pesanan diperbarui."
          );

        },
        500
      );

    }
  );

}


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatTrackingRupiah(
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
   FORMAT PHONE
========================================================= */

function formatTrackingPhone(
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
   ESCAPE HTML
========================================================= */

function escapeTrackingHTML(
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

function showTrackingToast(
  message
) {

  if (
    !trackingToast ||
    !trackingToastText
  ) {

    alert(message);

    return;

  }


  trackingToastText.textContent =
    message;


  trackingToast.classList.add(
    "show"
  );


  clearTimeout(
    window.trackingToastTimer
  );


  window.trackingToastTimer =
    setTimeout(
      () => {

        trackingToast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   AUTO REFRESH
========================================================= */

/*
   Refresh otomatis setiap 30 detik.
   Berguna nanti ketika status
   sudah dikontrol oleh admin/Firebase.
*/

let trackingAutoRefresh =
  setInterval(
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        loadTrackingOrder();

      }

    },
    30000
  );


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    clearInterval(
      trackingAutoRefresh
    );

  }
);