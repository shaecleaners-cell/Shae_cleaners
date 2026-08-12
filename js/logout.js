/* =========================================================
   SHAE CLEANERS
   js/logout.js
========================================================= */

function logoutCustomer() {

  const confirmLogout =
    confirm(
      "Apakah Anda yakin ingin keluar dari akun?"
    );


  if (!confirmLogout) {

    return;

  }


  /*
   * Hapus status login
   */

  localStorage.removeItem(
    "shae_logged_in"
  );


  /*
   * Hapus user aktif
   */

  localStorage.removeItem(
    "shae_current_user"
  );


  /*
   * Hapus customer aktif
   */

  localStorage.removeItem(
    "shae_customer"
  );


  /*
   * Kembali ke Login
   */

  window.location.replace(
    "login.html"
  );

}