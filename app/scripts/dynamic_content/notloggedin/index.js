window.addEventListener("load", setupIndex, false);

function setupIndex() {
  // if logged in, show name
  let accountBtn = document.getElementById("account-btn");
  let closeBtn = document.getElementById("close-btn-login");
  accountBtn.addEventListener("click", openLoginModal, false);
  closeBtn.addEventListener("click", closeLoginModal, false);
}

function openLoginModal() {
  let modal = document.getElementById("login-screen-overlay-background");
  modal.style.visibility = "visible";
}

function closeLoginModal() {
  let modal = document.getElementById("login-screen-overlay-background");
  modal.style.visibility = "hidden";
}
