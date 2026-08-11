/* =========================================================
   SHAE CLEANERS
   js/Alamat.js
   ADDRESS MANAGEMENT
========================================================= */

const ADDRESS_KEY = "shae_addresses";

let addresses = [];

let editingId = null;


/* =========================================================
   ELEMENTS
========================================================= */

const addressList =
  document.getElementById("addressList");

const addressEmpty =
  document.getElementById("addressEmpty");

const addressCount =
  document.getElementById("addressCount");

const addressModal =
  document.getElementById("addressModal");

const addressForm =
  document.getElementById("addressForm");

const addressModalTitle =
  document.getElementById("addressModalTitle");

const btnAddAddress =
  document.getElementById("btnAddAddress");

const btnCloseAddress =
  document.getElementById("btnCloseAddress");

const btnCancelAddress =
  document.getElementById("btnCancelAddress");

const addressOverlay =
  document.getElementById("addressOverlay");

const addressName =
  document.getElementById("addressName");

const addressPhone =
  document.getElementById("addressPhone");

const addressLabel =
  document.getElementById("addressLabel");

const addressDetail =
  document.getElementById("addressDetail");

const addressNote =
  document.getElementById("addressNote");

const addressPrimary =
  document.getElementById("addressPrimary");

const addressToast =
  document.getElementById("addressToast");


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initAddresses
);


function initAddresses() {

  loadAddresses();

  renderAddresses();

  setupEvents();

}


/* =========================================================
   LOAD
========================================================= */

function loadAddresses() {

  try {

    const saved =
      localStorage.getItem(
        ADDRESS_KEY
      );

    if (!saved) {

      addresses = [];

      return;

    }

    const parsed =
      JSON.parse(saved);

    addresses =
      Array.isArray(parsed)
        ? parsed
        : [];

  } catch (error) {

    console.error(
      "Gagal membaca alamat:",
      error
    );

    addresses = [];

  }

}


/* =========================================================
   SAVE
========================================================= */

function saveAddresses() {

  localStorage.setItem(
    ADDRESS_KEY,
    JSON.stringify(addresses)
  );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  btnAddAddress?.addEventListener(
    "click",
    openAddAddress
  );


  btnCloseAddress?.addEventListener(
    "click",
    closeAddressModal
  );


  btnCancelAddress?.addEventListener(
    "click",
    closeAddressModal
  );


  addressOverlay?.addEventListener(
    "click",
    closeAddressModal
  );


  addressForm?.addEventListener(
    "submit",
    saveAddress
  );


  addressPhone?.addEventListener(
    "input",
    sanitizePhone
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        addressModal?.classList.contains(
          "show"
        )
      ) {

        closeAddressModal();

      }

    }
  );

}


/* =========================================================
   RENDER
========================================================= */

function renderAddresses() {

  if (!addressList) {

    return;

  }


  addressList.innerHTML = "";


  updateAddressCount();


  if (
    addresses.length === 0
  ) {

    addressEmpty.style.display =
      "flex";

    return;

  }


  addressEmpty.style.display =
    "none";


  addresses.forEach(
    address => {

      addressList.appendChild(
        createAddressCard(
          address
        )
      );

    }
  );

}


/* =========================================================
   CREATE CARD
========================================================= */

function createAddressCard(
  address
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "address-card";


  if (
    address.primary
  ) {

    card.classList.add(
      "primary"
    );

  }


  const safeName =
    escapeHTML(
      address.name
    );


  const safePhone =
    escapeHTML(
      address.phone
    );


  const safeLabel =
    escapeHTML(
      address.label
    );


  const safeAddress =
    escapeHTML(
      address.address
    );


  const safeNote =
    escapeHTML(
      address.note || ""
    );


  card.innerHTML = `

    <div class="address-card-top">

      <div class="address-card-user">

        <div class="address-card-name">

          <strong>
            ${safeName}
          </strong>

          <span class="address-label">
            ${safeLabel}
          </span>

        </div>

        <div class="address-card-phone">
          ${safePhone}
        </div>

      </div>


      <span class="address-primary-badge">

        <i class="fa-solid fa-check"></i>

        Utama

      </span>

    </div>


    <div class="address-card-body">

      <div class="address-card-address">

        <i class="fa-solid fa-location-dot"></i>

        <span>
          ${safeAddress}
        </span>

      </div>


      ${
        safeNote
          ? `
            <div class="address-card-note">

              <i class="fa-regular fa-note-sticky"></i>

              ${safeNote}

            </div>
          `
          : ""
      }


      <div class="address-card-actions">

        <button
          type="button"
          class="address-edit"
          data-action="edit"
          data-id="${address.id}"
        >

          <i class="fa-solid fa-pen"></i>

          Edit

        </button>


        ${
          address.primary
            ? ""
            : `
              <button
                type="button"
                class="address-primary"
                data-action="primary"
                data-id="${address.id}"
              >

                <i class="fa-solid fa-star"></i>

                Jadikan Utama

              </button>
            `
        }


        <button
          type="button"
          class="address-delete"
          data-action="delete"
          data-id="${address.id}"
        >

          <i class="fa-solid fa-trash"></i>

          Hapus

        </button>

      </div>

    </div>

  `;


  card
    .querySelectorAll(
      "[data-action]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            handleAddressAction(
              button.dataset.action,
              button.dataset.id
            );

          }
        );

      }
    );


  return card;

}


/* =========================================================
   OPEN ADD
========================================================= */

function openAddAddress() {

  editingId = null;


  addressForm?.reset();


  addressModalTitle.textContent =
    "Tambah Alamat";


  addressPrimary.checked =
    addresses.length === 0;


  addressModal.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";


  setTimeout(
    () => addressName?.focus(),
    150
  );

}


/* =========================================================
   OPEN EDIT
========================================================= */

function openEditAddress(
  id
) {

  const address =
    addresses.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!address) {

    return;

  }


  editingId =
    String(id);


  addressModalTitle.textContent =
    "Edit Alamat";


  addressName.value =
    address.name || "";


  addressPhone.value =
    address.phone || "";


  addressLabel.value =
    address.label || "Rumah";


  addressDetail.value =
    address.address || "";


  addressNote.value =
    address.note || "";


  addressPrimary.checked =
    Boolean(
      address.primary
    );


  addressModal.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";


  setTimeout(
    () => addressName?.focus(),
    150
  );

}


/* =========================================================
   CLOSE
========================================================= */

function closeAddressModal() {

  addressModal?.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";


  editingId = null;

}


/* =========================================================
   SAVE ADDRESS
========================================================= */

function saveAddress(
  event
) {

  event.preventDefault();


  const name =
    addressName.value.trim();


  const phone =
    normalizePhone(
      addressPhone.value
    );


  const label =
    addressLabel.value;


  const address =
    addressDetail.value.trim();


  const note =
    addressNote.value.trim();


  const primary =
    addressPrimary.checked;


  if (
    name.length < 2
  ) {

    showToast(
      "Nama belum lengkap"
    );

    addressName.focus();

    return;

  }


  if (
    phone.length < 10
  ) {

    showToast(
      "Nomor WhatsApp tidak valid"
    );

    addressPhone.focus();

    return;

  }


  if (
    address.length < 8
  ) {

    showToast(
      "Alamat terlalu pendek"
    );

    addressDetail.focus();

    return;

  }


  if (
    primary ||
    addresses.length === 0
  ) {

    addresses.forEach(
      item => {
        item.primary = false;
      }
    );

  }


  if (editingId) {

    const index =
      addresses.findIndex(
        item =>
          String(item.id) ===
          String(editingId)
      );


    if (index !== -1) {

      addresses[index] = {

        ...addresses[index],

        name,

        phone,

        label,

        address,

        note,

        primary:
          primary ||
          addresses[index].primary,

        updatedAt:
          new Date().toISOString()

      };

    }

    showToast(
      "Alamat berhasil diperbarui ✓"
    );

  } else {

    const newAddress = {

      id:
        createAddressId(),

      name,

      phone,

      label,

      address,

      note,

      primary:
        primary ||
        addresses.length === 0,

      createdAt:
        new Date().toISOString()

    };


    addresses.unshift(
      newAddress
    );


    showToast(
      "Alamat berhasil disimpan ✓"
    );

  }


  /*
    Pastikan hanya satu alamat
    yang menjadi alamat utama.
  */

  normalizePrimary();


  saveAddresses();

  syncCustomerData();

  renderAddresses();

  closeAddressModal();

}


/* =========================================================
   ACTION
========================================================= */

function handleAddressAction(
  action,
  id
) {

  switch (action) {

    case "edit":

      openEditAddress(id);

      break;


    case "primary":

      setPrimaryAddress(id);

      break;


    case "delete":

      deleteAddress(id);

      break;

  }

}


/* =========================================================
   SET PRIMARY
========================================================= */

function setPrimaryAddress(
  id
) {

  let found = false;


  addresses.forEach(
    address => {

      if (
        String(address.id) ===
        String(id)
      ) {

        address.primary = true;

        found = true;

      } else {

        address.primary = false;

      }

    }
  );


  if (!found) {

    return;

  }


  saveAddresses();

  syncCustomerData();

  renderAddresses();


  showToast(
    "Alamat utama diperbarui ✓"
  );

}


/* =========================================================
   DELETE
========================================================= */

function deleteAddress(
  id
) {

  const address =
    addresses.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!address) {

    return;

  }


  const confirmed =
    confirm(
      `Hapus alamat "${address.label}"?`
    );


  if (!confirmed) {

    return;

  }


  const wasPrimary =
    Boolean(
      address.primary
    );


  addresses =
    addresses.filter(
      item =>
        String(item.id) !==
        String(id)
    );


  if (
    wasPrimary &&
    addresses.length > 0
  ) {

    addresses[0].primary =
      true;

  }


  saveAddresses();

  syncCustomerData();

  renderAddresses();


  showToast(
    "Alamat berhasil dihapus"
  );

}


/* =========================================================
   NORMALIZE PRIMARY
========================================================= */

function normalizePrimary() {

  if (
    addresses.length === 0
  ) {

    return;

  }


  const primaryIndex =
    addresses.findIndex(
      address =>
        address.primary
    );


  if (
    primaryIndex === -1
  ) {

    addresses[0].primary =
      true;

    return;

  }


  addresses.forEach(
    (address, index) => {

      address.primary =
        index === primaryIndex;

    }
  );

}


/* =========================================================
   SYNC CUSTOMER DATA
========================================================= */

function syncCustomerData() {

  const primary =
    addresses.find(
      address =>
        address.primary
    );


  if (!primary) {

    return;

  }


  const customer = {

    name:
      primary.name,

    phone:
      primary.phone,

    address:
      primary.address,

    note:
      primary.note || ""

  };


  localStorage.setItem(

    "customerData",

    JSON.stringify(
      customer
    )

  );


  /*
    Sinkronkan juga dengan akun
    agar halaman Akun menampilkan
    data terbaru.
  */

  let account = {};


  try {

    const saved =
      localStorage.getItem(
        "shae_customer"
      );


    if (saved) {

      account =
        JSON.parse(saved) || {};

    }

  } catch {

    account = {};

  }


  localStorage.setItem(

    "shae_customer",

    JSON.stringify({

      ...account,

      name:
        primary.name,

      phone:
        primary.phone,

      address:
        primary.address

    })

  );

}


/* =========================================================
   COUNT
========================================================= */

function updateAddressCount() {

  if (!addressCount) {

    return;

  }


  const total =
    addresses.length;


  addressCount.textContent =
    `${total} alamat`;

}


/* =========================================================
   PHONE
========================================================= */

function sanitizePhone(
  event
) {

  event.target.value =
    event.target.value
      .replace(
        /[^0-9+]/g,
        ""
      );

}


function normalizePhone(
  phone
) {

  let value =
    String(phone || "")
      .replace(
        /\D/g,
        ""
      );


  if (
    value.startsWith("62")
  ) {

    return "0" +
      value.substring(2);

  }


  return value;

}


/* =========================================================
   ID
========================================================= */

function createAddressId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 8)
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

let toastTimer = null;


function showToast(
  message
) {

  if (!addressToast) {

    return;

  }


  addressToast.textContent =
    message;


  addressToast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        addressToast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   PUBLIC
========================================================= */

window.getPrimaryAddress =
  function () {

    return (
      addresses.find(
        address =>
          address.primary
      ) || null
    );

  };