/* =========================================================
   SHAE CLEANERS
   js/firebase.js

   FIREBASE CORE
   - Authentication
   - Firestore
   - Storage
========================================================= */


/* =========================================================
   FIREBASE IMPORT
========================================================= */

import {
  initializeApp
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
  getAuth
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


import {
  getFirestore
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


import {
  getStorage
} from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

/*
 * GANTI DENGAN CONFIG DARI
 * FIREBASE CONSOLE
 */

const firebaseConfig = {

  apiKey:
    "GANTI_API_KEY",

  authDomain:
    "GANTI_PROJECT_ID.firebaseapp.com",

  projectId:
    "GANTI_PROJECT_ID",

  storageBucket:
    "GANTI_PROJECT_ID.firebasestorage.app",

  messagingSenderId:
    "GANTI_MESSAGING_SENDER_ID",

  appId:
    "GANTI_APP_ID"

};


/* =========================================================
   INITIALIZE
========================================================= */

const app =
  initializeApp(
    firebaseConfig
  );


/* =========================================================
   SERVICES
========================================================= */

const auth =
  getAuth(
    app
  );


const db =
  getFirestore(
    app
  );


const storage =
  getStorage(
    app
  );


/* =========================================================
   EXPORT
========================================================= */

export {

  app,

  auth,

  db,

  storage

};