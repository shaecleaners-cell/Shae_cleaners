/* =========================================================
   SHAE CLEANERS
   js/Auth.js
   SIMPLE AUTH SYSTEM
========================================================= */

const USERS_KEY = "shae_users";

const SESSION_KEY = "shae_session";


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initAuth
);


function initAuth() {

  setupRegister();

  setupLogin();

  setupPasswordToggle();

}


/* =========================================================
   REGISTER
========================================================= */

function setupRegister() {

  const form =
    document.getElementById(
      "registerForm"
    );


  if (!form) {

    return;

  }


  form.addEventListener(
    "submit",
    event => {

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
    document
      .getElementById(
        "registerName"
      )
      .value
      .trim();


  const phone =
    normalizePhone(
      document
        .getElementById(
          "registerPhone"
        )
        .value
    );


  const password =
    document
      .getElementById(
        "registerPassword"
      )
      .value;


  const confirmPassword =
    document
      .getElementById(
        "registerConfirmPassword"
      )
      .value;


  const terms =
    document
      .getElementById(
        "registerTerms"
      )
      .checked;


  if (
    name.length < 2
  ) {

    showAuthMessage(
      "Nama belum lengkap.",
      "error"
    );

    return;

  }


  if (
    phone.length < 10
  ) {

    showAuthMessage(
      "Nomor WhatsApp tidak valid.",
      "error"
    );

    return;

  }


  if (
    password.length < 6
  ) {

    showAuthMessage(
      "Password minimal 6 karakter.",
      "error"
    );

    return;

  }


  if (
    password !==
    confirmPassword
  ) {

    showAuthMessage(
      "Konfirmasi password tidak sama.",
      "error"
    );

    return;

  }


  if (!terms) {

    showAuthMessage(
      "Silakan setujui ketentuan terlebih dahulu.",
      "error"
    );

    return;

  }


  const users =
    getUsers();


  const exists =
    users.some(
      user =>
        user.phone === phone
    );


  if (exists) {

    showAuthMessage(
      "Nomor WhatsApp sudah terdaftar. Silakan login.",
      "error"
    );

    return;

  }


  /*
    CATATAN:
    Ini adalah sistem demo/localStorage.
    Jangan digunakan untuk menyimpan
    password asli pada aplikasi produksi.
  */

  const user = {

    id:
      createUserId(),

    name,

    phone,

    password,

    createdAt:
      new Date().toISOString()

  };


  users.push(user);


  saveUsers(users);


  /*
    Login otomatis setelah daftar.
  */

  createSession(user);


  saveCustomerData(user);


  showAuthMessage(
    "Pendaftaran berhasil. Membuka aplikasi...",
    "success"
  );


  setTimeout(
    () => {

      location.href =
        "index.html";

    },
    700
  );

}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {

  const form =
    document.getElementById(
      "loginForm"
    );


  if (!form) {

    return;

  }


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      loginUser();

    }
  );

}


/* =========================================================
   LOGIN USER
========================================================= */

function loginUser() {

  const phone =
    normalizePhone(
      document
        .getElementById(
          "loginPhone"
        )
        .value
    );


  const password =
    document
      .getElementById(
        "loginPassword"
      )
      .value;


  if (
    !phone ||
    !password
  ) {

    showAuthMessage(
      "Nomor WhatsApp dan password wajib diisi.",
      "error"
    );

    return;

  }


  const users =
    getUsers();


  const user =
    users.find(
      item =>
        item.phone === phone &&
        item.password === password
    );


  if (!user) {

    showAuthMessage(
      "Nomor WhatsApp atau password salah.",
      "error"
    );

    return;

  }


  createSession(user);

  saveCustomerData(user);


  showAuthMessage(
    "Login berhasil. Membuka aplikasi...",
    "success"
  );


  setTimeout(
    () => {

      location.href =
        "index.html";

    },
    600
  );

}


/* =========================================================
   GUEST
========================================================= */

function loginAsGuest() {

  localStorage.setItem(
    "shae_guest",
    "true"
  );


  location.href =
    "index.html";

}


window.loginAsGuest =
  loginAsGuest;


/* =========================================================
   SESSION
========================================================= */

function createSession(
  user
) {

  const session = {

    userId:
      user.id,

    name:
      user.name,

    phone:
      user.phone,

    loginAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

}


/* =========================================================
   CUSTOMER DATA
========================================================= */

function saveCustomerData(
  user
) {

  const customer = {

    name:
      user.name,

    phone:
      user.phone,

    address:
      getSavedAddress(user.phone)

  };


  localStorage.setItem(

    "customerData",

    JSON.stringify(
      customer
    )

  );


  localStorage.setItem(

    "shae_customer",

    JSON.stringify({

      name:
        user.name,

      phone:
        user.phone,

      address:
        customer.address || ""

    })

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
      JSON.parse(saved);


    return Array.isArray(users)
      ? users
      : [];

  } catch {

    return [];

  }

}


/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(
  users
) {

  localStorage.setItem(

    USERS_KEY,

    JSON.stringify(
      users
    )

  );

}


/* =========================================================
   SAVED ADDRESS
========================================================= */

function getSavedAddress(
  phone
) {

  try {

    const saved =
      localStorage.getItem(
        "shae_addresses"
      );


    if (!saved) {

      return "";

    }


    const addresses =
      JSON.parse(saved);


    if (
      !Array.isArray(addresses)
    ) {

      return "";

    }


    const primary =
      addresses.find(
        address =>
          address.primary === true &&
          normalizePhone(
            address.phone
          ) === phone
      );


    return primary
      ? primary.address
      : "";

  } catch {

    return "";

  }

}


/* =========================================================
   PHONE
========================================================= */

function normalizePhone(
  value
) {

  let phone =
    String(
      value || ""
    )
      .replace(
        /\D/g,
        ""
      );


  if (
    phone.startsWith("62")
  ) {

    phone =
      "0" +
      phone.substring(2);

  }


  return phone;

}


/* =========================================================
   ID
========================================================= */

function createUserId() {

  return (

    "USR-" +

    Date.now().toString(36) +

    "-" +

    Math.random()
      .toString(36)
      .substring(2, 7)

  );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle() {

  document
    .querySelectorAll(
      ".password-toggle"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const targetId =
              button.dataset.target;


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
              button.querySelector(
                "i"
              );


            if (icon) {

              icon.className =
                isPassword
                  ? "fa-regular fa-eye-slash"
                  : "fa-regular fa-eye";

            }

          }
        );

      }
    );

}


/* =========================================================
   MESSAGE
========================================================= */

function showAuthMessage(
  message,
  type
) {

  const box =
    document.getElementById(
      "authMessage"
    );


  if (!box) {

    return;

  }


  box.textContent =
    message;


  box.className =
    `auth-message show ${type}`;

}


/* =========================================================
   SESSION HELPERS
========================================================= */

window.getCurrentUser =
  function () {

    try {

      const session =
        localStorage.getItem(
          SESSION_KEY
        );


      return session
        ? JSON.parse(session)
        : null;

    } catch {

      return null;

    }

  };


window.isLoggedIn =
  function () {

    return Boolean(
      localStorage.getItem(
        SESSION_KEY
      )
    );

  };


window.logout =
  function () {

    localStorage.removeItem(
      SESSION_KEY
    );

    location.href =
      "login.html";

  };