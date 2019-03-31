window.addEventListener("load", setupIndex, false);

function setupIndex() {
  // if logged in, show name
  let accountBtn = document.getElementById("account-btn");
  let closeBtn = document.getElementById("close-btn-account-menu");
  accountBtn.addEventListener("click", openAccountMenu, false);
  closeBtn.addEventListener("click", closeAccountMenu, false);
}

function openAccountMenu() {
  let panel = document.getElementById("menu-overlay");
  panel.style.width = "70%";
}

function closeAccountMenu() {
  let panel = document.getElementById("menu-overlay");
  panel.style.width = "0%";
}
