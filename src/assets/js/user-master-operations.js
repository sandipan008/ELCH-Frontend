/**
 * User Master Operations
 */

'use strict';

(function () {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchBtn');
  
  searchInput.addEventListener('input', function() {
    if (searchInput.value.trim().length > 0) {
      searchButton.disabled = false;
    } else {
      searchButton.disabled = true;
    }
  });
})();
