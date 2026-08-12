/* =========================================================
   SHAE CLEANERS
   js/auth-guard.js

   SISTEM:
   - Cek status login
   - Jika belum login -> login.html
   - Jika sudah login -> halaman tetap terbuka
========================================================= */

(function () {

  const LOGIN_KEY =
    "shae_logged_in";


  const currentPage =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();


  /*
   * Halaman yang boleh dibuka
   * tanpa login
   */

  const publicPages = [

    "login.html",

    "register.html",

    "index.html",

    ""

  ];


  /*
   * Cek status login
   */

  const isLoggedIn =
    localStorage.getItem(
      LOGIN_KEY
    ) === "true";


  /*
   * Jika halaman bukan
   * halaman publik dan
   * belum login
   */

  if (
    !isLoggedIn &&
    !publicPages.includes(
      currentPage
    )
  ) {

    window.location.replace(
      "login.html"
    );

  }

})();