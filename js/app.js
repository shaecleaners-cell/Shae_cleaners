/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/app.js
   HOME CONTROLLER
========================================================= */


/* =========================================================
   KONFIGURASI
========================================================= */

const WA_NUMBER = "6283813138221";

const STORAGE_CART = "shae_cart";

const STORAGE_CUSTOMER = "shae_customer";

const STORAGE_INVOICE = "shae_invoice";


/* =========================================================
   DATA LAYANAN
========================================================= */

const services = {

  sofa: {
    id: "sofa",
    name: "Cuci Sofa",
    category: "Sofa",
    price: 60000,
    image: "assets/sofa.jpg",
    description:
      "Cleaning sofa untuk menghilangkan debu, noda dan kotoran."
  },

  kasur: {
    id: "kasur",
    name: "Cuci Springbed",
    category: "Springbed",
    price: 150000,
    image: "assets/kasur.jpg",
    description:
      "Membersihkan springbed dari debu, noda dan kotoran."
  },

  jokmobil: {
    id: "jokmobil",
    name: "Cuci Jok Mobil",
    category: "Jok Mobil",
    price: 250000,
    image: "assets/jokmobil.jpg",
    description:
      "Cleaning jok dan interior mobil agar lebih bersih dan nyaman."
  },

  karpet: {
    id: "karpet",
    name: "Cuci Karpet",
    category: "Karpet",
    price: 13000,
    image: "assets/karpet.jpg",
    description:
      "Cuci karpet berdasarkan ukuran meter persegi."
  },

  kursi: {
    id: "kursi",
    name: "Cuci Kursi",
    category: "Kursi",
    price: 30000,
    image: "assets/kursi.jpg",
    description:
      "Cleaning kursi makan, kursi kantor dan berbagai jenis kursi."
  },

  gorden: {
    id: "gorden",
    name: "Cuci Gorden",
    category: "Gorden",
    price: 15000,
    image: "assets/gorden.jpg",
    description:
      "Cleaning gorden agar kembali bersih dan segar."
  },

  ac: {
    id: "ac",
    name: "Cuci AC",
    category: "AC",
    price: 75000,
    image: "assets/ac.jpg",
    description:
      "Cleaning AC untuk membantu menjaga kebersihan dan performanya."
  },

  "home-cleaning": {
    id: "home-cleaning",
    name: "Home Cleaning",
    category: "Home Cleaning",
    price: 150000,
    image: "assets/home-cleaning.jpg",
    description:
      "Layanan cleaning rumah untuk membantu menjaga rumah tetap bersih."
  }

};


/* =========================================================
   FORMAT RUPIAH
========================================================= */

function formatRupiah(number) {

  return new Intl.NumberFormat("id-ID", {

    style: "currency",

    currency: "IDR",

    minimumFractionDigits: 0

  }).format(number);

}


/* =========================================================
   GET CART
========================================================= */

function getCart() {

  try {

    const cart =
      JSON.parse(
        localStorage.getItem(STORAGE_CART)
      );

    return Array.isArray(cart) ? cart : [];

  } catch (error) {

    console.error(
      "Gagal membaca cart:",
      error
    );

    return [];

  }

}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart(cart) {

  localStorage.setItem(

    STORAGE_CART,

    JSON.stringify(cart)

  );

  updateCartCount();

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(serviceId, qty = 1) {

  const service = services[serviceId];

  if (!service) {

    console.warn(
      "Layanan tidak ditemukan:",
      serviceId
    );

    return;

  }


  const cart = getCart();

  const existing =
    cart.find(
      item => item.id === serviceId
    );


  if (existing) {

    existing.qty += qty;

  } else {

    cart.push({

      id: service.id,

      name: service.name,

      category: service.category,

      price: service.price,

      image: service.image,

      qty: qty

    });

  }


  saveCart(cart);


  showToast(
    `${service.name} ditambahkan ke pesanan`
  );

}


/* =========================================================
   REMOVE CART ITEM
========================================================= */

function removeFromCart(serviceId) {

  const cart = getCart()
    .filter(
      item => item.id !== serviceId
    );

  saveCart(cart);

}


/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {

  localStorage.removeItem(
    STORAGE_CART
  );

  updateCartCount();

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

  const countElement =
    document.getElementById("cartCount");

  if (!countElement) return;


  const cart = getCart();


  const totalQty =
    cart.reduce(
      (total, item) =>
        total + Number(item.qty || 0),
      0
    );


  countElement.textContent =
    totalQty;


  if (totalQty > 0) {

    countElement.style.display =
      "flex";

  } else {

    countElement.style.display =
      "none";

  }

}


/* =========================================================
   OPEN SERVICE
========================================================= */

function openService(serviceId) {

  if (!services[serviceId]) {

    console.warn(
      "Service tidak ditemukan:",
      serviceId
    );

    return;

  }


  /*
    Nanti detail.html akan membaca
    parameter ?service=sofa
  */

  window.location.href =
    `detail.html?service=${encodeURIComponent(serviceId)}`;

}


/* =========================================================
   GO TO SERVICES
========================================================= */

function goToServices() {

  window.location.href =
    "layanan.html";

}


/* =========================================================
   NOTIFICATION
========================================================= */

function openNotifications() {

  showToast(
    "Belum ada notifikasi baru"
  );

}


/* =========================================================
   SEARCH
========================================================= */

const searchInput =
  document.getElementById(
    "searchInput"
  );


if (searchInput) {

  searchInput.addEventListener(
    "input",
    function () {

      const keyword =
        this.value
          .toLowerCase()
          .trim();


      if (!keyword) return;


      const result =
        Object.values(services)
          .find(service =>

            service.name
              .toLowerCase()
              .includes(keyword)

            ||

            service.category
              .toLowerCase()
              .includes(keyword)

          );


      if (result) {

        window.location.href =
          `detail.html?service=${result.id}`;

      }

    }
  );

}


/* =========================================================
   PROMO SLIDER
========================================================= */

const promoSlider =
  document.getElementById(
    "promoSlider"
  );


const promoDots =
  document.querySelectorAll(
    ".slider-dots .dot"
  );


if (promoSlider) {

  let currentSlide = 0;


  promoSlider.addEventListener(
    "scroll",
    function () {

      const width =
        promoSlider.offsetWidth;


      if (!width) return;


      currentSlide =
        Math.round(
          promoSlider.scrollLeft / width
        );


      promoDots.forEach(
        (dot, index) => {

          dot.classList.toggle(
            "active",
            index === currentSlide
          );

        }
      );

    }
  );


  setInterval(() => {

    if (!promoSlider) return;


    const width =
      promoSlider.offsetWidth;


    if (!width) return;


    currentSlide++;


    if (
      currentSlide >=
      promoSlider.children.length
    ) {

      currentSlide = 0;

    }


    promoSlider.scrollTo({

      left:
        currentSlide * width,

      behavior:
        "smooth"

    });

  }, 5000);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  let toast =
    document.getElementById(
      "shaeToast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "shaeToast";


    toast.innerHTML = `

      <i class="fa-solid fa-circle-check"></i>

      <span></span>

    `;


    Object.assign(
      toast.style,
      {

        position: "fixed",

        left: "50%",

        bottom: "82px",

        transform:
          "translateX(-50%) translateY(20px)",

        zIndex: "9999",

        display: "flex",

        alignItems: "center",

        gap: "8px",

        padding: "11px 15px",

        borderRadius: "12px",

        background: "#17202a",

        color: "#fff",

        fontSize: "11px",

        fontWeight: "600",

        boxShadow:
          "0 8px 25px rgba(0,0,0,.18)",

        opacity: "0",

        transition:
          "all .25s ease",

        whiteSpace: "nowrap"

      }

    );


    document.body.appendChild(
      toast
    );

  }


  const text =
    toast.querySelector(
      "span"
    );


  text.textContent =
    message;


  requestAnimationFrame(() => {

    toast.style.opacity =
      "1";

    toast.style.transform =
      "translateX(-50%) translateY(0)";

  });


  clearTimeout(
    window.shaeToastTimer
  );


  window.shaeToastTimer =
    setTimeout(() => {

      toast.style.opacity =
        "0";

      toast.style.transform =
        "translateX(-50%) translateY(20px)";

    }, 2500);

}


/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(message) {

  const encoded =
    encodeURIComponent(
      message
    );


  window.open(

    `https://wa.me/${WA_NUMBER}?text=${encoded}`,

    "_blank"

  );

}


/* =========================================================
   CREATE BASIC WHATSAPP ORDER
========================================================= */

function sendCartToWhatsApp() {

  const cart = getCart();


  if (!cart.length) {

    showToast(
      "Pesanan masih kosong"
    );

    return;

  }


  let total = 0;


  let message =
    `Halo Shae Cleaners 👋\n\n`;


  message +=
    `Saya ingin melakukan pemesanan:\n\n`;


  cart.forEach(
    (item, index) => {

      const subtotal =
        Number(item.price) *
        Number(item.qty);


      total += subtotal;


      message +=
        `${index + 1}. ${item.name}\n`;

      message +=
        `   Qty: ${item.qty}\n`;

      message +=
        `   Harga: ${formatRupiah(item.price)}\n`;

      message +=
        `   Subtotal: ${formatRupiah(subtotal)}\n\n`;

    }
  );


  message +=
    `TOTAL: ${formatRupiah(total)}\n\n`;

  message +=
    `Mohon dibantu konfirmasi pesanan saya.\n`;

  message +=
    `Terima kasih 🙏`;


  openWhatsApp(
    message
  );

}


/* =========================================================
   GENERATE INVOICE NUMBER
========================================================= */

function generateInvoiceNumber() {

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


  const random =
    Math.floor(
      100 + Math.random() * 900
    );


  return `INV-${year}${month}${day}-${random}`;

}


/* =========================================================
   CREATE INVOICE
========================================================= */

function createInvoice(data = {}) {

  const invoice = {

    invoiceNumber:
      generateInvoiceNumber(),

    customer:
      data.customer || {},

    items:
      data.items || getCart(),

    total:
      data.total || 0,

    date:
      new Date().toISOString(),

    status:
      "Menunggu Konfirmasi"

  };


  localStorage.setItem(

    STORAGE_INVOICE,

    JSON.stringify(invoice)

  );


  return invoice;

}


/* =========================================================
   GET LAST INVOICE
========================================================= */

function getLastInvoice() {

  try {

    return JSON.parse(

      localStorage.getItem(
        STORAGE_INVOICE
      )

    );

  } catch {

    return null;

  }

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateCartCount();


    /*
      Tambahkan class page-ready
      untuk animasi halaman.
    */

    document.body.classList.add(
      "page-ready"
    );


    /*
      Tombol kategori dan layanan
      sudah menggunakan openService()
    */

  }
);


/* =========================================================
   EXPOSE GLOBAL FUNCTIONS
========================================================= */

window.openService =
  openService;

window.goToServices =
  goToServices;

window.addToCart =
  addToCart;

window.removeFromCart =
  removeFromCart;

window.clearCart =
  clearCart;

window.getCart =
  getCart;

window.saveCart =
  saveCart;

window.updateCartCount =
  updateCartCount;

window.formatRupiah =
  formatRupiah;

window.showToast =
  showToast;

window.openWhatsApp =
  openWhatsApp;

window.sendCartToWhatsApp =
  sendCartToWhatsApp;

window.generateInvoiceNumber =
  generateInvoiceNumber;

window.createInvoice =
  createInvoice;

window.getLastInvoice =
  getLastInvoice;