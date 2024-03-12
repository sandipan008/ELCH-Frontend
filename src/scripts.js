function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("elch-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("elch-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML();

const pageLoader = document.querySelector(".page-loader");
if (pageLoader) {
  pageLoader.classList.add("active");

  setTimeout(() => {
    pageLoader.classList.remove("active");
  }, 1500);
}

// Helpers
import "./assets/vendor/js/helpers.js";

// Config:  Mandatory theme config file contain global vars & default theme options, Set your preferred theme option in this file.
import "./assets/js/config.js";

// Core JS
// build:js assets/vendor/js/core.js
import "./assets/vendor/libs/jquery/jquery.js";
import "./assets/vendor/libs/popper/popper.js";
import "./assets/vendor/js/bootstrap.js";
import "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js";

import "./assets/vendor/js/menu.js";
// endbuild

// Vendors JS
import "./assets/vendor/libs/apex-charts/apexcharts.js";

// Main JS
import "./assets/js/main.js";

// Page JS
// import "./assets/js/dashboards-analytics.js";
