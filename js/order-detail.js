/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/order-detail.js
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const DETAIL_CART_KEY = "shae_cart";


/* =========================================================
   WHATSAPP
========================================================= */

const DETAIL_WHATSAPP = "6283813138221";


/* =========================================================
   ELEMENTS
========================================================= */

const detailImage =
  document.getElementById("detailImage");

const detailName =
  document.getElementById("detailName");

const detailPrice =
  document.getElementById("detailPrice");

const detailVariants =
  document.getElementById("detailVariants");

const detailTotal =
  document.getElementById("detailTotal");

const qtyValue =
  document.getElementById("qtyValue");

const qtyMinus =
  document.getElementById("qtyMinus");

const qtyPlus =
  document.getElementById("qtyPlus");

const bookingDate =
  document.getElementById("bookingDate");

const bookingTime =
  document.getElementById("bookingTime");

const detailNote =
  document.getElementById("detailNote");

const noteCounter =
  document.getElementById("noteCounter");

const addToCart =
  document.getElementById("addToCart");

const buyNow =
  document.getElementById("buyNow");

const detailCartButton =
  document.getElementById("detailCartButton");

const detailCartBadge =
  document.getElementById("detailCartBadge");

const detailToast =
  document.getElementById("detailToast");

const detailToastText =
  document.getElementById("detailToastText");


/* =========================================================
   CURRENT DATA
========================================================= */

let currentService = null;

let selectedVariant = null;

let quantity = 1;


/* =========================================================
   SERVICE DATABASE
========================================================= */

const SERVICE_DATA = {

  sofa: {

    name: "Cuci Sofa",

    icon: "fa-couch",

    image: "assets/services/sofa.jpg",

    description:
      "Cleaning sofa profesional untuk mengangkat debu, noda, bau dan kotoran.",

    variants: [

      {
        id: "sofa-standard",
        name: "Sofa Standard",
        price: 60000
      },

      {
        id: "sofa-lepasan",
        name: "Sofa Lepasan",
        price: 75000
      },

      {
        id: "sofa-besar",
        name: "Sofa Besar",
        price: 75000
      },

      {
        id: "sofa-stool",
        name: "Sofa Stool",
        price: 50000
      },

      {
        id: "sofa-l-standard",
        name: "Sofa L Standard",
        price: 250000
      },

      {
        id: "sofa-l-big",
        name: "Sofa L BIG",
        price: 300000
      },

      {
        id: "sofa-u",
        name: "Sofa U",
        price: 350000
      }

    ]

  },


  kasur: {

    name: "Cuci Springbed",

    icon: "fa-bed",

    image: "assets/services/kasur.jpg",

    description:
      "Membersihkan springbed dari debu, noda, bau dan kotoran.",

    variants: [

      {
        id: "kasur-mini",
        name: "Mini Single",
        price: 150000
      },

      {
        id: "kasur-single",
        name: "Single",
        price: 180000
      },

      {
        id: "kasur-queen",
        name: "Queen",
        price: 270000
      },

      {
        id: "kasur-king",
        name: "King",
        price: 290000
      },

      {
        id: "kasur-superking",
        name: "Super King",
        price: 310000
      }

    ]

  },


  jokmobil: {

    name: "Cuci Jok Mobil",

    icon: "fa-car",

    image: "assets/services/jokmobil.jpg",

    description:
      "Cleaning jok dan interior mobil dengan peralatan profesional.",

    variants: [

      {
        id: "jok-2",
        name: "Jok 2 Baris",
        price: 250000
      },

      {
        id: "jok-interior-2",
        name: "Interior 2 Baris",
        price: 400000
      },

      {
        id: "jok-3",
        name: "Jok 3 Baris",
        price: 350000
      }

    ]

  },


  karpet: {

    name: "Cuci Karpet",

    icon: "fa-rug",

    image: "assets/services/karpet.jpg",

    description:
      "Cuci karpet untuk membantu menghilangkan debu, noda dan bau.",

    variants: [

      {
        id: "karpet-meter",
        name: "Per m²",
        price: 13000
      }

    ]

  },


  kursi: {

    name: "Cuci Kursi",

    icon: "fa-chair",

    image: "assets/services/kursi.jpg",

    description:
      "Cleaning kursi makan dan kursi kantor.",

    variants: [

      {
        id: "kursi-makan-small",
        name: "Kursi Makan Small",
        price: 30000
      },

      {
        id: "kursi-makan-standard",
        name: "Kursi Makan Standard",
        price: 35000
      },

      {
        id: "kursi-kantor-small",
        name: "Kursi Kantor Small",
        price: 30000
      },

      {
        id: "kursi-kantor-big",
        name: "Kursi Kantor BIG",
        price: 40000
      }

    ]

  }

};


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initDetailPage
);


function initDetailPage() {

  setMinimumDate();

  loadService();

  updateCartBadge();

  setupEvents();

}


/* =========================================================
   GET SERVICE
========================================================= */

function loadService() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const serviceId =
    (
      params.get("service") ||
      params.get("id") ||
      "sofa"
    ).toLowerCase();


  currentService =
    SERVICE_DATA[serviceId];


  if (!currentService) {

    currentService =
      SERVICE_DATA.sofa;

  }


  selectedVariant =
    currentService.variants[0];


  renderService();

}


/* =========================================================
   RENDER SERVICE
========================================================= */

function renderService() {

  if (!currentService) {

    return;

  }


  /* -----------------------------------------
     NAME
  ----------------------------------------- */

  if (detailName) {

    detailName.textContent =
      currentService.name;

  }


  /* -----------------------------------------
     IMAGE
  ----------------------------------------- */

  if (detailImage) {

    if (
      currentService.image
    ) {

      detailImage.innerHTML = `

        <img
          src="${currentService.image}"
          alt="${escapeHTML(
            currentService.name
          )}"
          onerror="this.style.display='none';this.parentElement.innerHTML='<i class=&quot;fa-solid ${currentService.icon}&quot;></i>';"
        >

      `;

    } else {

      detailImage.innerHTML = `

        <i class="fa-solid ${currentService.icon}"></i>

      `;

    }

  }


  /* -----------------------------------------
     VARIANTS
  ----------------------------------------- */

  renderVariants();


  updatePrice();

}


/* =========================================================
   RENDER VARIANTS
========================================================= */

function renderVariants() {

  if (!detailVariants) {

    return;

  }


  detailVariants.innerHTML =
    "";


  currentService.variants.forEach(
    (variant, index) => {

      const element =
        document.createElement(
          "button"
        );


      element.type =
        "button";


      element.className =
        "detail-variant";


      if (
        index === 0
      ) {

        element.classList.add(
          "active"
        );

      }


      element.innerHTML = `

        <span class="detail-variant-name">

          ${escapeHTML(
            variant.name
          )}

        </span>


        <span class="detail-variant-price">

          ${formatRupiah(
            variant.price
          )}

        </span>


        <span class="detail-variant-check">

          <i class="fa-solid fa-check"></i>

        </span>

      `;


      element.addEventListener(
        "click",
        () => {

          selectedVariant =
            variant;


          document
            .querySelectorAll(
              ".detail-variant"
            )
            .forEach(
              button =>
                button.classList.remove(
                  "active"
                )
            );


          element.classList.add(
            "active"
          );


          updatePrice();

        }
      );


      detailVariants.appendChild(
        element
      );

    }
  );

}


/* =========================================================
   QUANTITY
========================================================= */

if (qtyMinus) {

  qtyMinus.addEventListener(
    "click",
    () => {

      if (
        quantity <= 1
      ) {

        return;

      }


      quantity--;

      updateQuantity();

    }
  );

}


if (qtyPlus) {

  qtyPlus.addEventListener(
    "click",
    () => {

      if (
        quantity >= 99
      ) {

        return;

      }


      quantity++;

      updateQuantity();

    }
  );

}


function updateQuantity() {

  if (qtyValue) {

    qtyValue.textContent =
      quantity;

  }


  updatePrice();

}


/* =========================================================
   PRICE
========================================================= */

function updatePrice() {

  if (
    !selectedVariant
  ) {

    return;

  }


  const total =
    Number(
      selectedVariant.price
    ) *
    quantity;


  if (detailPrice) {

    detailPrice.textContent =
      formatRupiah(
        selectedVariant.price
      );

  }


  if (detailTotal) {

    detailTotal.textContent =
      formatRupiah(
        total
      );

  }

}


/* =========================================================
   NOTE COUNTER
========================================================= */

if (detailNote) {

  detailNote.addEventListener(
    "input",
    () => {

      const length =
        detailNote.value.length;


      if (noteCounter) {

        noteCounter.textContent =
          `${length}/250`;

      }

    }
  );

}


/* =========================================================
   ADD TO CART
========================================================= */

if (addToCart) {

  addToCart.addEventListener(
    "click",
    () => {

      const item =
        createCartItem();


      addCartItem(
        item
      );


      showToast(
        "Layanan berhasil ditambahkan ke keranjang."
      );


      updateCartBadge();

    }
  );

}


/* =========================================================
   BUY NOW
========================================================= */

if (buyNow) {

  buyNow.addEventListener(
    "click",
    () => {

      const item =
        createCartItem();


      /*
        Keranjang dikosongkan agar
        customer langsung checkout
        item yang dipilih.
      */

      saveCart([
        item
      ]);


      window.location.href =
        "checkout.html";

    }
  );

}


/* =========================================================
   CREATE CART ITEM
========================================================= */

function createCartItem() {

  const date =
    bookingDate
      ? bookingDate.value
      : "";


  const time =
    bookingTime
      ? bookingTime.value
      : "";


  const note =
    detailNote
      ? detailNote.value.trim()
      : "";


  return {

    id:
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2,8)}`,

    service:
      getServiceId(),

    name:
      currentService.name,

    variant:
      selectedVariant.name,

    price:
      Number(
        selectedVariant.price
      ),

    qty:
      quantity,

    total:
      Number(
        selectedVariant.price
      ) * quantity,

    date:
      date,

    time:
      time,

    note:
      note,

    image:
      currentService.image || "",

    createdAt:
      new Date().toISOString()

  };

}


/* =========================================================
   GET SERVICE ID
========================================================= */

function getServiceId() {

  const params =
    new URLSearchParams(
      window.location.search
    );


  return (
    params.get("service") ||
    params.get("id") ||
    "sofa"
  ).toLowerCase();

}


/* =========================================================
   ADD CART ITEM
========================================================= */

function addCartItem(
  item
) {

  let cart =
    getCart();


  cart.push(
    item
  );


  saveCart(
    cart
  );

}


/* =========================================================
   GET CART
========================================================= */

function getCart() {

  try {

    const cart =
      JSON.parse(
        localStorage.getItem(
          DETAIL_CART_KEY
        )
      );


    if (
      Array.isArray(cart)
    ) {

      return cart;

    }

  } catch {

    // ignore

  }


  return [];

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart(
  cart
) {

  localStorage.setItem(
    DETAIL_CART_KEY,
    JSON.stringify(
      cart
    )
  );

}


/* =========================================================
   CART BADGE
========================================================= */

function updateCartBadge() {

  if (!detailCartBadge) {

    return;

  }


  const cart =
    getCart();


  const count =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.qty || 1
        ),
      0
    );


  detailCartBadge.textContent =
    count > 99
      ? "99+"
      : count;

}


/* =========================================================
   CART BUTTON
========================================================= */

if (detailCartButton) {

  detailCartButton.addEventListener(
    "click",
    () => {

      window.location.href =
        "cart.html";

    }
  );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  /*
    Klik tombol tambah keranjang
    sudah ditangani di atas.
  */

}


/* =========================================================
   MINIMUM DATE
========================================================= */

function setMinimumDate() {

  if (!bookingDate) {

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


  bookingDate.min =
    `${year}-${month}-${day}`;

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

      minimumFractionDigits:
        0

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


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  if (
    !detailToast ||
    !detailToastText
  ) {

    alert(message);

    return;

  }


  detailToastText.textContent =
    message;


  detailToast.classList.add(
    "show"
  );


  clearTimeout(
    window.detailToastTimer
  );


  window.detailToastTimer =
    setTimeout(
      () => {

        detailToast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   WHATSAPP QUICK ORDER
========================================================= */

function openQuickWhatsApp() {

  if (
    !currentService ||
    !selectedVariant
  ) {

    return;

  }


  const message =
`Halo Shae Cleaners 👋

Saya ingin memesan:

🧹 Layanan:
${currentService.name}

📦 Paket:
${selectedVariant.name}

🔢 Jumlah:
${quantity}

💰 Total:
${formatRupiah(
  selectedVariant.price *
  quantity
)}

📅 Tanggal:
${bookingDate?.value || "-"}

⏰ Jam:
${bookingTime?.value || "-"}

📝 Catatan:
${detailNote?.value || "-"}

Mohon dibantu untuk konfirmasi pesanan. Terima kasih 🙏`;


  window.open(
    `https://wa.me/${DETAIL_WHATSAPP}?text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );

}