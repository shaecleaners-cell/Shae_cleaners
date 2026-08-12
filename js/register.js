/* =========================================================
   SHAE CLEANERS
   js/register.js

   FITUR:
   - Registrasi customer
   - Validasi data
   - Cek WhatsApp/email duplikat
   - Simpan akun
   - Auto login
   - Redirect ke halaman tujuan
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initRegister
);


const USERS_KEY =
  "shae_users";

const LOGIN_KEY =
  "shae_logged_in";

const USER_KEY =
  "shae_current_user";

const CUSTOMER_KEY =
  "shae_customer";


/* =========================================================
   INIT
========================================================= */

function initRegister() {

  const form =
    document.getElementById(
      "registerForm"
    );


  const loginButton =
    document.getElementById(
      "loginButton"
    );


  /*
   * Tombol Login
   */

  if (loginButton) {

    loginButton.addEventListener(
      "click",
      function () {

        window.location.href =
          "login.html";

      }
    );

  }


  /*
   * Password toggle
   */

  document
    .querySelectorAll(
      "[data-toggle-password]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          function () {

            togglePassword(
              button
            );

          }
        );

      }
    );


  /*
   * Form
   */

  if (form) {

    form.addEventListener(
      "submit",
      handleRegister
    );

  }

}


/* =========================================================
   REGISTER
========================================================= */

function handleRegister(
  event
) {

  event.preventDefault();


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


  const agreement =
    document.getElementById(
      "registerAgreement"
    );


  /* =======================================================
     VALIDASI
  ======================================================== */

  if (
    name.length < 2
  ) {

    showMessage(
      "Nama minimal 2 karakter.",
      "error"
    );

    return;

  }


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

    return;

  }


  if (
    !validateEmail(
      email
    )
  ) {

    showMessage(
      "Format email tidak valid.",
      "error"
    );

    return;

  }


  if (
    address.length < 5
  ) {

    showMessage(
      "Mohon masukkan alamat lengkap.",
      "error"
    );

    return;

  }


  if (
    password.length < 6
  ) {

    showMessage(
      "Password minimal 6 karakter.",
      "error"
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

    return;

  }


  if (
    agreement &&
    !agreement.checked
  ) {

    showMessage(
      "Silakan setujui penggunaan data terlebih dahulu.",
      "error"
    );

    return;

  }


  /* =======================================================
     LOAD USERS
  ======================================================== */

  let users = [];


  try {

    users =
      JSON.parse(
        localStorage.getItem(
          USERS_KEY
        ) || "[]"
      );


    if (
      !Array.isArray(users)
    ) {

      users = [];

    }

  } catch {

    users = [];

  }


  /* =======================================================
     CEK EMAIL
  ======================================================== */

  const emailExists =
    users.some(
      user =>
        String(
          user.email || ""
        )
          .toLowerCase()
          .trim()
          ===
        email
          .toLowerCase()
          .trim()
    );


  if (emailExists) {

    showMessage(
      "Email sudah terdaftar. Silakan login.",
      "error"
    );

    return;

  }


  /* =======================================================
     CEK WHATSAPP
  ======================================================== */

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
      "Nomor WhatsApp sudah terdaftar. Silakan login.",
      "error"
    );

    return;

  }


  /* =======================================================
     BUAT USER
  ======================================================== */

  const user = {

    id:
      generateUserId(),

    name:
      name,

    phone:
      normalizedPhone,

    email:
      email
        .toLowerCase()
        .trim(),

    address:
      address,

    note:
      "",

    password:
      password,

    createdAt:
      new Date().toISOString()

  };


  /* =======================================================
     SIMPAN
  ======================================================== */

  users.push(
    user
  );


  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(
      users
    )
  );


  /* =======================================================
     AUTO LOGIN
  ======================================================== */

  localStorage.setItem(
    LOGIN_KEY,
    "true"
  );


  localStorage.setItem(
    USER_KEY,
    JSON.stringify(
      user
    )
  );


  localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify({

      name:
        user.name,

      phone:
        user.phone,

      email:
        user.email,

      address:
        user.address,

      note:
        ""

    })
  );


  /* =======================================================
     MESSAGE
  ======================================================== */

  showMessage(
    "Pendaftaran berhasil! Mengalihkan...",
    "success"
  );


  /* =======================================================
     REDIRECT
  ======================================================== */

  const redirect =
    sessionStorage.getItem(
      "shae_login_redirect"
    );


  sessionStorage.removeItem(
    "shae_login_redirect"
  );


  const destination =
    redirect ||
    "index.html";


  setTimeout(
    function () {

      window.location.replace(
        destination
      );

    },
    700
  );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function togglePassword(
  button
) {

  const targetId =
    button.dataset
      .togglePassword;


  const input =
    document.getElementById(
      targetId
    );


  if (!input) {

    return;

  }


  const icon =
    button.querySelector(
      "i"
    );


  if (
    input.type ===
    "password"
  ) {

    input.type =
      "text";


    if (icon) {

      icon.className =
        "fa-solid fa-eye-slash";

    }

  } else {

    input.type =
      "password";


    if (icon) {

      icon.className =
        "fa-solid fa-eye";

    }

  }

}


/* =========================================================
   EMAIL
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
   USER ID
========================================================= */

function generateUserId() {

  return (
    "SC-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()
  );

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
  message,
  type = "error"
) {

  const element =
    document.getElementById(
      "registerMessage"
    );


  if (!element) {

    alert(message);

    return;

  }


  element.textContent =
    message;


  element.className =
    `login-message ${type}`;


  element.style.display =
    "block";


  element.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}


/* =========================================================
   GET VALUE
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