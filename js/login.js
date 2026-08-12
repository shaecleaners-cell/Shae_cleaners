/* =========================================================
   SHAE CLEANERS
   js/login.js
========================================================= */

document.addEventListener("DOMContentLoaded", initLogin);

const LOGIN_KEY = "shae_logged_in";
const USER_KEY = "shae_current_user";

function initLogin() {

  const form =
    document.getElementById("loginForm");

  const registerButton =
    document.getElementById("registerButton");

  const togglePassword =
    document.getElementById("togglePassword");


  /* =========================
     REGISTER
  ========================== */

  if (registerButton) {

    registerButton.addEventListener(
      "click",
      function () {

        window.location.href =
          "register.html";

      }
    );

  }


  /* =========================
     PASSWORD
  ========================== */

  if (togglePassword) {

    togglePassword.addEventListener(
      "click",
      function () {

        const password =
          document.getElementById(
            "loginPassword"
          );

        if (!password) return;


        const icon =
          togglePassword.querySelector("i");


        if (
          password.type === "password"
        ) {

          password.type =
            "text";

          icon.className =
            "fa-solid fa-eye-slash";

        } else {

          password.type =
            "password";

          icon.className =
            "fa-solid fa-eye";

        }

      }
    );

  }


  /* =========================
     FORM LOGIN
  ========================== */

  if (form) {

    form.addEventListener(
      "submit",
      handleLogin
    );

  }

}


/* =========================================================
   LOGIN
========================================================= */

function handleLogin(event) {

  event.preventDefault();


  const identity =
    getValue("loginIdentity");

  const password =
    getValue("loginPassword");


  if (!identity || !password) {

    showMessage(
      "Mohon isi email/WhatsApp dan password.",
      "error"
    );

    return;

  }


  /*
   * Ambil daftar customer
   */

  let users = [];


  try {

    users =
      JSON.parse(
        localStorage.getItem(
          "shae_users"
        ) || "[]"
      );

  } catch {

    users = [];

  }


  /*
   * Cari user
   */

  const normalizedIdentity =
    identity
      .trim()
      .toLowerCase();


  const normalizedPhone =
    normalizePhone(
      identity
    );


  const user =
    users.find(
      item => {

        const email =
          String(
            item.email || ""
          )
            .trim()
            .toLowerCase();


        const phone =
          normalizePhone(
            item.phone
          );


        return (
          email ===
            normalizedIdentity
          ||
          phone ===
            normalizedPhone
        );

      }
    );


  /*
   * User tidak ditemukan
   */

  if (!user) {

    showMessage(
      "Akun tidak ditemukan. Silakan daftar terlebih dahulu.",
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
      "Password yang Anda masukkan salah.",
      "error"
    );

    return;

  }


  /* =========================
     LOGIN BERHASIL
  ========================== */

  localStorage.setItem(
    LOGIN_KEY,
    "true"
  );


  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );


  /*
   * Simpan data customer
   * untuk checkout
   */

  localStorage.setItem(
    "shae_customer",
    JSON.stringify({

      name:
        user.name || "",

      phone:
        user.phone || "",

      email:
        user.email || "",

      address:
        user.address || "",

      note:
        user.note || ""

    })
  );


  showMessage(
    "Login berhasil. Mengalihkan...",
    "success"
  );


  /*
   * Ambil halaman tujuan
   */

  const redirect =
    sessionStorage.getItem(
      "shae_login_redirect"
    );


  sessionStorage.removeItem(
    "shae_login_redirect"
  );


  /*
   * Default ke Home
   */

  const destination =
    redirect ||
    "index.html";


  setTimeout(
    function () {

      window.location.replace(
        destination
      );

    },
    500
  );

}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(phone) {

  let value =
    String(
      phone || ""
    )
      .replace(/\D/g, "");


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
   MESSAGE
========================================================= */

function showMessage(
  message,
  type = "error"
) {

  const element =
    document.getElementById(
      "loginMessage"
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

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(id) {

  const element =
    document.getElementById(id);


  return element
    ? element.value.trim()
    : "";

}