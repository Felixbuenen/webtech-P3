window.addEventListener("load", setupFilterWindowEvent, false);

function setupFilterWindowEvent() {
  // if logged in, show name
  let openBtn = document.getElementById("filter-btn");
  let closeBtn = document.getElementById("close-btn-filter-menu");
  openBtn.addEventListener("click", openFilterMenu, false);
  closeBtn.addEventListener("click", closeFilterMenu, false);
}

function openFilterMenu() {
  let panel = document.getElementById("search-filter-menu");
  panel.style.width = "70%";
}

function closeFilterMenu() {
  let panel = document.getElementById("search-filter-menu");
  panel.style.width = "0%";
}
