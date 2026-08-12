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
    "AIzaSyAQRKEMFceCbJRGgPfr3Vtt-AdbE38pwVg",

  authDomain:
    "shaecleaners-f6ed8.firebaseapp.com",

  projectId:
    "shaecleaners-f6ed8",

  storageBucket:
    "shaecleaners-f6ed8.firebasestorage.app",

  messagingSenderId:
    "839960858623",

  appId:
    "1:839960858623:web:1aa97b91f54924cd10e1ca"

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