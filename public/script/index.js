window.addEventListener("load", setupIndex, false);

function setupIndex() {
    let accountBtn = document.getElementById("account-btn");
    accountBtn.addEventListener("click", openAccountMenu, false);

    let closeBtn = document.getElementById("close-btn");
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