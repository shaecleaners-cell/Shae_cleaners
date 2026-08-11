/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/detail.js
   DETAIL + VARIANT + QTY + TOTAL
========================================================= */


/* =========================================================
   SERVICE VARIANTS
========================================================= */

const serviceVariants = {

  sofa: [

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
      id: "sofa-stoll",
      name: "Sofa Stoll",
      price: 50000
    },

    {
      id: "sofa-l-standard",
      name: "Sofa L Standard / Set",
      price: 250000
    },

    {
      id: "sofa-l-big",
      name: "Sofa L BIG / Set",
      price: 300000
    },

    {
      id: "sofa-u",
      name: "Sofa U / Set",
      price: 350000
    }

  ],


  kasur: [

    {
      id: "kasur-mini",
      name: "Springbed Mini Single",
      price: 150000
    },

    {
      id: "kasur-single",
      name: "Springbed Single",
      price: 180000
    },

    {
      id: "kasur-queen",
      name: "Springbed Queen",
      price: 270000
    },

    {
      id: "kasur-king",
      name: "Springbed King",
      price: 290000
    },

    {
      id: "kasur-super-king",
      name: "Springbed Super King",
      price: 310000
    }

  ],


  jokmobil: [

    {
      id: "jok-2baris",
      name: "Jok Mobil Saja — 2 Baris",
      price: 250000
    },

    {
      id: "interior-2baris",
      name: "Jok + Interior — 2 Baris",
      price: 400000
    },

    {
      id: "jok-3baris",
      name: "Jok Mobil Saja — 3 Baris",
      price: 350000
    }

  ],


  karpet: [

    {
      id: "karpet-meter",
      name: "Karpet / m²",
      price: 13000,
      unit: "m²"
    }

  ],


  kursi: [

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

  ],


  gorden: [

    {
      id: "gorden-standard",
      name: "Gorden Standard",
      price: 15000
    }

  ],


  ac: [

    {
      id: "ac-standard",
      name: "Cuci AC Standard",
      price: 75000
    }

  ],


  "home-cleaning": [

    {
      id: "home-cleaning-standard",
      name: "Home Cleaning",
      price: 150000
    }

  ]

};


/* =========================================================
   SERVICE INFORMATION
========================================================= */

const detailServices = {

  sofa: {

    name: "Cuci Sofa",

    category: "Sofa",

    description:
      "Cleaning sofa untuk membantu menghilangkan debu, noda dan kotoran.",

    image:
      "assets/sofa.jpg"

  },


  kasur: {

    name: "Cuci Springbed",

    category: "Springbed",

    description:
      "Membersihkan springbed dari debu, noda dan kotoran.",

    image:
      "assets/kasur.jpg"

  },


  jokmobil: {

    name: "Cuci Jok Mobil",

    category: "Jok Mobil",

    description:
      "Cleaning jok dan interior mobil agar lebih bersih dan nyaman.",

    image:
      "assets/jokmobil.jpg"

  },


  karpet: {

    name: "Cuci Karpet",

    category: "Karpet",

    description:
      "Pembersihan karpet berdasarkan luas meter persegi.",

    image:
      "assets/karpet.jpg"

  },


  kursi: {

    name: "Cuci Kursi",

    category: "Kursi",

    description:
      "Cleaning kursi makan dan kursi kantor.",

    image:
      "assets/kursi.jpg"

  },


  gorden: {

    name: "Cuci Gorden",

    category: "Gorden",

    description:
      "Cleaning gorden agar lebih bersih dan segar.",

    image:
      "assets/gorden.jpg"

  },


  ac: {

    name: "Cuci AC",

    category: "AC",

    description:
      "Cleaning AC untuk membantu menjaga kebersihan dan performanya.",

    image:
      "assets/ac.jpg"

  },


  "home-cleaning": {

    name: "Home Cleaning",

    category: "Home Cleaning",

    description:
      "Layanan cleaning rumah untuk membantu menjaga rumah tetap bersih.",

    image:
      "assets/home-cleaning.jpg"

  }

};


/* =========================================================
   STATE
========================================================= */

let currentService = null;

let selectedVariant = null;

let quantity = 1;


/* =========================================================
   GET SERVICE FROM URL
========================================================= */

function getServiceIdFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("service");

}


/* =========================================================
   FORMAT
========================================================= */

function detailFormatRupiah(value) {

  return new Intl.NumberFormat(
    "id-ID",
    {

      style: "currency",

      currency: "IDR",

      minimumFractionDigits: 0

    }
  ).format(value);

}


/* =========================================================
   ELEMENTS
========================================================= */

const imageElement =
  document.getElementById(
    "serviceImage"
  );

const badgeElement =
  document.getElementById(
    "serviceBadge"
  );

const categoryElement =
  document.getElementById(
    "serviceCategory"
  );

const nameElement =
  document.getElementById(
    "serviceName"
  );

const descriptionElement =
  document.getElementById(
    "serviceDescription"
  );

const priceElement =
  document.getElementById(
    "servicePrice"
  );

const variantList =
  document.getElementById(
    "variantList"
  );

const qtyValue =
  document.getElementById(
    "qtyValue"
  );

const bookingDate =
  document.getElementById(
    "bookingDate"
  );

const bookingTime =
  document.getElementById(
    "bookingTime"
  );

const orderNote =
  document.getElementById(
    "orderNote"
  );

const detailTotal =
  document.getElementById(
    "detailTotal"
  );

const bottomTotal =
  document.getElementById(
    "bottomTotal"
  );

const addOrderButton =
  document.getElementById(
    "addOrderButton"
  );

const detailCartCount =
  document.getElementById(
    "detailCartCount"
  );


/* =========================================================
   LOAD SERVICE
========================================================= */

function loadService() {

  const serviceId =
    getServiceIdFromURL();


  if (
    !serviceId ||
    !detailServices[serviceId]
  ) {

    showInvalidService();

    return;

  }


  currentService =
    detailServices[serviceId];


  const variants =
    serviceVariants[serviceId] || [];


  /* =======================================================
     BASIC INFO
  ======================================================= */

  if (imageElement) {

    imageElement.src =
      currentService.image;

    imageElement.alt =
      currentService.name;

  }


  if (categoryElement) {

    categoryElement.textContent =
      currentService.category;

  }


  if (nameElement) {

    nameElement.textContent =
      currentService.name;

  }


  if (descriptionElement) {

    descriptionElement.textContent =
      currentService.description;

  }


  /* =======================================================
     DEFAULT VARIANT
  ======================================================= */

  selectedVariant =
    variants[0] || null;


  renderVariants(
    variants
  );


  updatePrice();


  setMinimumDate();


  updateDetailCartCount();

}


/* =========================================================
   RENDER VARIANTS
========================================================= */

function renderVariants(variants) {

  if (!variantList) return;


  variantList.innerHTML = "";


  if (!variants.length) {

    variantList.innerHTML = `
      <div class="variant-item active">
        <strong>
          Layanan Standard
        </strong>
        <span>
          Rp0
        </span>
      </div>
    `;

    return;

  }


  variants.forEach(
    (variant, index) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "variant-item";


      if (index === 0) {

        item.classList.add(
          "active"
        );

      }


      item.innerHTML = `

        <strong>
          ${variant.name}
        </strong>

        <span>
          ${detailFormatRupiah(
            variant.price
          )}
          ${variant.unit
            ? " / " + variant.unit
            : ""}
        </span>

        <div class="variant-check">

          <i class="fa-solid fa-check"></i>

        </div>

      `;


      item.addEventListener(
        "click",
        () => {

          selectedVariant =
            variant;


          document
            .querySelectorAll(
              ".variant-item"
            )
            .forEach(
              element =>
                element.classList.remove(
                  "active"
                )
            );


          item.classList.add(
            "active"
          );


          updatePrice();

        }
      );


      variantList.appendChild(
        item
      );

    }
  );

}


/* =========================================================
   UPDATE PRICE
========================================================= */

function updatePrice() {

  if (!selectedVariant) return;


  const total =
    Number(
      selectedVariant.price
    ) *
    Number(quantity);


  if (priceElement) {

    priceElement.textContent =
      detailFormatRupiah(
        selectedVariant.price
      );

  }


  if (detailTotal) {

    detailTotal.textContent =
      detailFormatRupiah(
        total
      );

  }


  if (bottomTotal) {

    bottomTotal.textContent =
      detailFormatRupiah(
        total
      );

  }

}


/* =========================================================
   QUANTITY
========================================================= */

const minusQty =
  document.getElementById(
    "minusQty"
  );

const plusQty =
  document.getElementById(
    "plusQty"
  );


if (minusQty) {

  minusQty.addEventListener(
    "click",
    () => {

      if (quantity <= 1) return;


      quantity--;


      updateQuantity();

    }
  );

}


if (plusQty) {

  plusQty.addEventListener(
    "click",
    () => {

      if (quantity >= 99) return;


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
   MINIMUM DATE
========================================================= */

function setMinimumDate() {

  if (!bookingDate) return;


  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      now.getDate()
    ).padStart(2, "0");


  bookingDate.min =
    `${year}-${month}-${day}`;


  bookingDate.value =
    `${year}-${month}-${day}`;

}


/* =========================================================
   ADD TO ORDER
========================================================= */

if (addOrderButton) {

  addOrderButton.addEventListener(
    "click",
    addCurrentServiceToCart
  );

}


function addCurrentServiceToCart() {

  if (
    !currentService ||
    !selectedVariant
  ) {

    showToast(
      "Silakan pilih layanan terlebih dahulu."
    );

    return;

  }


  const cart =
    typeof getCart === "function"
      ? getCart()
      : [];


  const itemId =
    `${currentService.category}-${selectedVariant.id}`;


  /*
    Setiap varian dianggap item
    berbeda di pesanan.
  */

  const existing =
    cart.find(
      item =>
        item.itemId === itemId
    );


  if (existing) {

    existing.qty += quantity;

    existing.total =
      existing.price *
      existing.qty;

  } else {

    cart.push({

      itemId:

        itemId,

      serviceId:

        getServiceIdFromURL(),

      variantId:

        selectedVariant.id,

      name:

        currentService.name,

      variant:

        selectedVariant.name,

      category:

        currentService.category,

      price:

        selectedVariant.price,

      qty:

        quantity,

      total:

        selectedVariant.price *
        quantity,

      unit:

        selectedVariant.unit || "",

      bookingDate:

        bookingDate
          ? bookingDate.value
          : "",

      bookingTime:

        bookingTime
          ? bookingTime.value
          : "",

      note:

        orderNote
          ? orderNote.value.trim()
          : "",

      image:

        currentService.image

    });

  }


  localStorage.setItem(

    "shae_cart",

    JSON.stringify(cart)

  );


  updateDetailCartCount();


  if (
    typeof updateCartCount ===
    "function"
  ) {

    updateCartCount();

  }


  showToast(
    `${currentService.name} ditambahkan ke pesanan`
  );


  /*
    Beri sedikit waktu agar toast
    terlihat sebelum pindah halaman.
  */

  setTimeout(
    () => {

      window.location.href =
        "checkout.html";

    },
    650
  );

}


/* =========================================================
   CART COUNT
========================================================= */

function updateDetailCartCount() {

  if (!detailCartCount) return;


  let cart = [];


  try {

    cart =
      JSON.parse(
        localStorage.getItem(
          "shae_cart"
        )
      ) || [];

  } catch {

    cart = [];

  }


  const count =
    cart.reduce(
      (total, item) =>
        total +
        Number(
          item.qty || 0
        ),
      0
    );


  detailCartCount.textContent =
    count;


  detailCartCount.style.display =
    count > 0
      ? "flex"
      : "none";

}


/* =========================================================
   INVALID SERVICE
========================================================= */

function showInvalidService() {

  if (nameElement) {

    nameElement.textContent =
      "Layanan tidak ditemukan";

  }


  if (descriptionElement) {

    descriptionElement.textContent =
      "Layanan yang Anda pilih tidak tersedia.";

  }


  if (variantList) {

    variantList.innerHTML = `

      <div
        class="variant-item active"
        style="grid-column:1/-1;"
      >

        <strong>
          Layanan tidak tersedia
        </strong>

        <span>
          Silakan kembali ke halaman layanan.
        </span>

      </div>

    `;

  }


  if (addOrderButton) {

    addOrderButton.disabled =
      true;

  }

}


/* =========================================================
   IMAGE ERROR
========================================================= */

if (imageElement) {

  imageElement.addEventListener(
    "error",
    () => {

      imageElement.style.display =
        "none";

      const parent =
        imageElement.parentElement;


      if (parent) {

        parent.style.background =
          "#eef1f2";


        parent.innerHTML += `

          <div
            style="
              position:absolute;
              inset:0;
              display:flex;
              align-items:center;
              justify-content:center;
              color:#98a2b3;
              font-size:12px;
              font-weight:700;
            "
          >
            Shae Cleaners
          </div>

        `;

      }

    }
  );

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadService();

  }
);