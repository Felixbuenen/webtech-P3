window.addEventListener("load", setup, false);

function setup() {
    let searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", (event) => redirectToBooks(event));
}

function redirectToBooks() {
    event.preventDefault();
    
    let inputValue = document.getElementById("search-form__input").value;
    let query = encodeURIComponent(inputValue);

    window.location.href = "./books.html?search=" + query;
}