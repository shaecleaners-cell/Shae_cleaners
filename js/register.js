/* =========================================================
   SHAE CLEANERS
   js/register.js

   FITUR:
   - Register customer
   - Nama
   - Nomor WhatsApp
   - Email
   - Alamat
   - Password
   - Konfirmasi password
   - Cek akun duplikat
   - Simpan ke localStorage
   - Auto login setelah register
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initRegister
);


/* =========================================================
   CONFIG
========================================================= */

const USERS_KEY =
  "shae_users";

const LOGIN_KEY =
  "shae_logged_in";

const CURRENT_USER_KEY =
  "shae_current_user";

const CUSTOMER_KEY =
  "shae_customer";


/* =========================================================
   INIT
========================================================= */

function initRegister() {

  /*
   * Jika sudah login,
   * jangan tampilkan halaman register
   */

  if (
    localStorage.getItem(
      LOGIN_KEY
    ) === "true"
  ) {

    window.location.replace(
      "index.html"
    );

    return;

  }


  setupRegisterForm();

  setupPasswordToggle();

  setupLoginButton();

}


/* =========================================================
   REGISTER FORM
========================================================= */

function setupRegisterForm() {

  const form =
    document.getElementById(
      "registerForm"
    );


  if (!form) {

    console.warn(
      "registerForm tidak ditemukan."
    );

    return;

  }


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      registerUser();

    }
  );

}


/* =========================================================
   REGISTER USER
========================================================= */

function registerUser() {

  const name =
    getValue(
      "registerName"
    );


  const phone =
    getValue(
      "registerPhone"
    );


  const email =
    getValue(
      "registerEmail"
    );


  const address =
    getValue(
      "registerAddress"
    );


  const password =
    getValue(
      "registerPassword"
    );


  const confirmPassword =
    getValue(
      "registerConfirmPassword"
    );


  /* =====================================================
     VALIDASI NAMA
  ====================================================== */

  if (
    name.length < 2
  ) {

    showMessage(
      "Nama minimal 2 karakter.",
      "error"
    );

    focusInput(
      "registerName"
    );

    return;

  }


  /* =====================================================
     VALIDASI NOMOR
  ====================================================== */

  const normalizedPhone =
    normalizePhone(
      phone
    );


  if (
    normalizedPhone.length < 10
  ) {

    showMessage(
      "Nomor WhatsApp tidak valid.",
      "error"
    );

    focusInput(
      "registerPhone"
    );

    return;

  }


  /* =====================================================
     VALIDASI EMAIL
  ====================================================== */

  if (
    !validateEmail(
      email
    )
  ) {

    showMessage(
      "Format email tidak valid.",
      "error"
    );

    focusInput(
      "registerEmail"
    );

    return;

  }


  /* =====================================================
     VALIDASI ALAMAT
  ====================================================== */

  if (
    address.length < 5
  ) {

    showMessage(
      "Alamat terlalu pendek.",
      "error"
    );

    focusInput(
      "registerAddress"
    );

    return;

  }


  /* =====================================================
     VALIDASI PASSWORD
  ====================================================== */

  if (
    password.length < 6
  ) {

    showMessage(
      "Password minimal 6 karakter.",
      "error"
    );

    focusInput(
      "registerPassword"
    );

    return;

  }


  if (
    password !==
    confirmPassword
  ) {

    showMessage(
      "Konfirmasi password tidak sama.",
      "error"
    );

    focusInput(
      "registerConfirmPassword"
    );

    return;

  }


  /* =====================================================
     LOAD USERS
  ====================================================== */

  const users =
    getUsers();


  /* =====================================================
     CEK EMAIL
  ====================================================== */

  const emailExists =
    users.some(
      user =>
        String(
          user.email || ""
        )
          .toLowerCase()
          ===
        email.toLowerCase()
    );


  if (emailExists) {

    showMessage(
      "Email sudah terdaftar. Silakan Login.",
      "error"
    );

    return;

  }


  /* =====================================================
     CEK NOMOR
  ====================================================== */

  const phoneExists =
    users.some(
      user =>
        normalizePhone(
          user.phone
        ) ===
        normalizedPhone
    );


  if (phoneExists) {

    showMessage(
      "Nomor WhatsApp sudah terdaftar. Silakan Login.",
      "error"
    );

    return;

  }


  /* =====================================================
     BUAT USER ID
  ====================================================== */

  const user = {

    id:
      generateUserId(),

    name:
      name,

    phone:
      normalizedPhone,

    email:
      email.toLowerCase(),

    address:
      address,

    password:
      password,

    createdAt:
      new Date().toISOString()

  };


  /* =====================================================
     SIMPAN USER
  ====================================================== */

  users.unshift(
    user
  );


  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(
      users
    )
  );


  /* =====================================================
     AUTO LOGIN
  ====================================================== */

  localStorage.setItem(
    LOGIN_KEY,
    "true"
  );


  const currentUser = {

    id:
      user.id,

    name:
      user.name,

    phone:
      user.phone,

    email:
      user.email,

    address:
      user.address,

    loggedInAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(
      currentUser
    )
  );


  /* =====================================================
     SINKRONISASI CUSTOMER
  ====================================================== */

  localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify({

      name:
        user.name,

      phone:
        user.phone,

      address:
        user.address,

      note:
        ""

    })
  );


  /* =====================================================
     SUCCESS
  ====================================================== */

  showMessage(
    "Registrasi berhasil! Selamat datang di Shae Cleaners.",
    "success"
  );


  setTimeout(
    function () {

      window.location.replace(
        "index.html"
      );

    },
    700
  );

}


/* =========================================================
   GET USERS
========================================================= */

function getUsers() {

  try {

    const saved =
      localStorage.getItem(
        USERS_KEY
      );


    if (!saved) {

      return [];

    }


    const users =
      JSON.parse(
        saved
      );


    return Array.isArray(users)
      ? users
      : [];


  } catch (error) {

    console.error(
      "Gagal membaca user:",
      error
    );

    return [];

  }

}


/* =========================================================
   GENERATE USER ID
========================================================= */

function generateUserId() {

  return (

    "USR-" +

    Date.now().toString(36) +

    "-" +

    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()

  );

}


/* =========================================================
   NORMALIZE PHONE
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
   VALIDATE EMAIL
========================================================= */

function validateEmail(
  email
) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(
      email
    );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle() {

  const buttons =
    document.querySelectorAll(
      "[data-toggle-password]"
    );


  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        function () {

          const targetId =
            this.dataset
              .togglePassword;


          const input =
            document.getElementById(
              targetId
            );


          if (!input) {

            return;

          }


          const isPassword =
            input.type ===
            "password";


          input.type =
            isPassword
              ? "text"
              : "password";


          const icon =
            this.querySelector(
              "i"
            );


          if (icon) {

            icon.className =
              isPassword
                ? "fa-solid fa-eye-slash"
                : "fa-solid fa-eye";

          }

        }
      );

    }
  );

}


/* =========================================================
   LOGIN BUTTON
========================================================= */

function setupLoginButton() {

  const button =
    document.getElementById(
      "loginButton"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      window.location.href =
        "login.html";

    }
  );

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
  message,
  type
) {

  const element =
    document.getElementById(
      "registerMessage"
    );


  if (!element) {

    alert(
      message
    );

    return;

  }


  element.textContent =
    message;


  element.className =
    `register-message ${type}`;


  element.style.display =
    "block";

}


/* =========================================================
   DOM HELPERS
========================================================= */

function getValue(
  id
) {

  const element =
    document.getElementById(
      id
    );


  return element
    ? element.value.trim()
    : "";

}


function focusInput(
  id
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.focus();

  }

}