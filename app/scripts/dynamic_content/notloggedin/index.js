window.addEventListener("load", setupIndex, false);

function setupIndex() {
    // if logged in, show name
    let accountBtn = document.getElementById("account-btn");
    accountBtn.addEventListener("click", openLoginModal, false);
}

function openLoginModal() {
    let modal = document.getElementById("login-screen-overlay-background");
    modal.style.visibility = "visible";
}