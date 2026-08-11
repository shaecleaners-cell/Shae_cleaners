/* =========================================================
   SHAE CLEANERS MARKETPLACE
   js/layanan.js
   FILTER + SEARCH LAYANAN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


  /* =======================================================
     ELEMENT
  ======================================================= */

  const searchInput =
    document.getElementById("serviceSearch");

  const categoryFilter =
    document.getElementById("categoryFilter");

  const serviceGrid =
    document.getElementById("serviceGrid");

  const resultTitle =
    document.getElementById("resultTitle");

  const resultCount =
    document.getElementById("resultCount");

  const emptyResult =
    document.getElementById("emptyResult");


  if (!serviceGrid) return;


  const cards =
    Array.from(
      serviceGrid.querySelectorAll(
        ".market-service-card"
      )
    );


  const filterButtons =
    categoryFilter
      ? Array.from(
          categoryFilter.querySelectorAll(
            ".filter-btn"
          )
        )
      : [];


  /* =======================================================
     STATE
  ======================================================= */

  let activeCategory = "all";

  let searchKeyword = "";


  /* =======================================================
     CATEGORY TITLE
  ======================================================= */

  const categoryNames = {

    all: "Semua Layanan",

    "Sofa": "Layanan Sofa",

    "Springbed": "Layanan Springbed",

    "Jok Mobil": "Layanan Jok Mobil",

    "Karpet": "Layanan Karpet",

    "Kursi": "Layanan Kursi",

    "Gorden": "Layanan Gorden",

    "AC": "Layanan AC",

    "Home Cleaning": "Home Cleaning"

  };


  /* =======================================================
     NORMALIZE TEXT
  ======================================================= */

  function normalize(text) {

    return String(text || "")
      .toLowerCase()
      .trim();

  }


  /* =======================================================
     FILTER SERVICE
  ======================================================= */

  function filterServices() {

    let visibleCount = 0;


    cards.forEach((card, index) => {

      const category =
        card.dataset.category || "";

      const name =
        card.dataset.name || "";

      const cardText =
        normalize(
          `${category} ${name} ${card.innerText}`
        );


      const categoryMatch =
        activeCategory === "all" ||
        category === activeCategory;


      const searchMatch =
        !searchKeyword ||
        cardText.includes(
          searchKeyword
        );


      const shouldShow =
        categoryMatch &&
        searchMatch;


      if (shouldShow) {

        card.classList.remove(
          "hidden"
        );

        card.style.animationDelay =
          `${Math.min(index * 0.04, 0.25)}s`;

        visibleCount++;

      } else {

        card.classList.add(
          "hidden"
        );

      }

    });


    /* =====================================================
       RESULT TITLE
    ===================================================== */

    if (searchKeyword) {

      resultTitle.textContent =
        `Hasil: "${searchKeyword}"`;

    } else {

      resultTitle.textContent =
        categoryNames[activeCategory] ||
        "Semua Layanan";

    }


    /* =====================================================
       RESULT COUNT
    ===================================================== */

    resultCount.textContent =
      `${visibleCount} layanan tersedia`;


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (emptyResult) {

      emptyResult.style.display =
        visibleCount === 0
          ? "block"
          : "none";

    }

  }


  /* =======================================================
     CATEGORY BUTTON
  ======================================================= */

  filterButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        activeCategory =
          button.dataset.category ||
          "all";


        filterButtons.forEach(
          item => {

            item.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        /*
          Jika pindah kategori,
          pencarian dikosongkan.
        */

        if (searchInput) {

          searchInput.value = "";

        }


        searchKeyword = "";


        filterServices();


        /*
          Scroll tombol aktif
          ke tengah layar.
        */

        button.scrollIntoView({

          behavior: "smooth",

          block: "nearest",

          inline: "center"

        });

      }
    );

  });


  /* =======================================================
     SEARCH
  ======================================================= */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      event => {

        searchKeyword =
          normalize(
            event.target.value
          );


        filterServices();

      }
    );

  }


  /* =======================================================
     SEARCH ENTER
  ======================================================= */

  if (searchInput) {

    searchInput.addEventListener(
      "keydown",
      event => {

        if (
          event.key !== "Enter"
        ) {

          return;

        }


        const visibleCards =
          cards.filter(
            card =>
              !card.classList.contains(
                "hidden"
              )
          );


        if (
          visibleCards.length === 1
        ) {

          const button =
            visibleCards[0]
              .querySelector(
                ".market-bottom button"
              );


          if (button) {

            button.click();

          }

        }

      }
    );

  }


  /* =======================================================
     CARD CLICK
  ======================================================= */

  cards.forEach(card => {

    card.addEventListener(
      "click",
      event => {

        /*
          Jangan jalankan dua kali
          jika tombol di dalam kartu
          yang ditekan.
        */

        if (
          event.target.closest("button")
        ) {

          return;

        }


        const button =
          card.querySelector(
            ".market-bottom button"
          );


        if (button) {

          button.click();

        }

      }
    );

  });


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  filterServices();


});