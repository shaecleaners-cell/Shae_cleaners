/* =========================================================
   SHAE CLEANERS
   js/login.js

   FITUR:
   - Login customer
   - Membaca akun dari localStorage
   - Validasi email / nomor HP
   - Menyimpan sesi login
   - Menyimpan customer aktif
   - Redirect ke Home
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initLogin
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

function initLogin() {

  /*
   * Jika sudah login,
   * langsung ke Home
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


  setupLoginForm();

  setupPasswordToggle();

  setupRegisterButton();

}


/* =========================================================
   LOGIN FORM
========================================================= */

function setupLoginForm() {

  const form =
    document.getElementById(
      "loginForm"
    );


  if (!form) {

    console.warn(
      "loginForm tidak ditemukan."
    );

    return;

  }


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      loginUser();

    }
  );

}


/* =========================================================
   LOGIN
========================================================= */

function loginUser() {

  const identity =
    getValue(
      "loginIdentity"
    );

  const password =
    getValue(
      "loginPassword"
    );


  /*
   * Validasi
   */

  if (!identity) {

    showMessage(
      "Masukkan email atau nomor WhatsApp.",
      "error"
    );

    focusInput(
      "loginIdentity"
    );

    return;

  }


  if (!password) {

    showMessage(
      "Masukkan password.",
      "error"
    );

    focusInput(
      "loginPassword"
    );

    return;

  }


  /*
   * Ambil semua user
   */

  const users =
    getUsers();


  /*
   * Cari user
   */

  const normalizedIdentity =
    normalizeIdentity(
      identity
    );


  const user =
    users.find(
      account => {

        const email =
          normalizeIdentity(
            account.email
          );


        const phone =
          normalizeIdentity(
            account.phone
          );


        return (

          email ===
          normalizedIdentity

          ||

          phone ===
          normalizedIdentity

        );

      }
    );


  /*
   * Akun tidak ditemukan
   */

  if (!user) {

    showMessage(
      "Akun tidak ditemukan. Silakan Register terlebih dahulu.",
      "error"
    );

    return;

  }


  /*
   * Password salah
   */

  if (
    user.password !==
    password
  ) {

    showMessage(
      "Email/nomor WhatsApp atau password salah.",
      "error"
    );

    return;

  }


  /*
   * LOGIN BERHASIL
   */

  localStorage.setItem(
    LOGIN_KEY,
    "true"
  );


  /*
   * Simpan user aktif
   */

  const currentUser = {

    id:
      user.id,

    name:
      user.name,

    email:
      user.email,

    phone:
      user.phone,

    address:
      user.address || "",

    loggedInAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(
      currentUser
    )
  );


  /*
   * Sinkronisasi dengan
   * checkout.js
   */

  localStorage.setItem(
    CUSTOMER_KEY,
    JSON.stringify({

      name:
        user.name,

      phone:
        user.phone,

      address:
        user.address || "",

      note:
        ""

    })
  );


  showMessage(
    `Selamat datang, ${user.name}!`,
    "success"
  );


  /*
   * Beri sedikit waktu agar
   * pesan sukses terlihat
   */

  setTimeout(
    function () {

      window.location.replace(
        "index.html"
      );

    },
    500
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
      "Gagal membaca akun:",
      error
    );

    return [];

  }

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle() {

  const button =
    document.getElementById(
      "togglePassword"
    );


  const input =
    document.getElementById(
      "loginPassword"
    );


  if (
    !button ||
    !input
  ) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      const isPassword =
        input.type ===
        "password";


      input.type =
        isPassword
          ? "text"
          : "password";


      const icon =
        button.querySelector(
         ("i")
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


/* =========================================================
   REGISTER BUTTON
========================================================= */

function setupRegisterButton() {

  const button =
    document.getElementById(
      "registerButton"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    function () {

      window.location.href =
        "register.html";

    }
  );

}


/* =========================================================
   NORMALIZE IDENTITY
========================================================= */

function normalizeIdentity(
  value
) {

  let text =
    String(
      value || ""
    )
      .trim()
      .toLowerCase();


  /*
   * Jika nomor HP,
   * normalisasi ke 62
   */

  if (
    /^[0-9+\-\s()]+$/.test(
      text
    )
  ) {

    text =
      text.replace(
        /\D/g,
        ""
      );


    if (
      text.startsWith("0")
    ) {

      text =
        "62" +
        text.substring(1);

    }


    if (
      text.startsWith("8")
    ) {

      text =
        "62" +
        text;

    }

  }


  return text;

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
      "loginMessage"
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
    `login-message ${type}`;


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