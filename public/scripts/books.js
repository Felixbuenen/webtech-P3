window.addEventListener("load", setupPage, false);

function setupPage() {
  setupFilterWindowEvent();

  // get search query
  let linkQuery = new URLSearchParams(window.location.search);
  let bookQuery = linkQuery.get("search");

  // get all books (no filters by default)
  getBooks(bookQuery, {});
}

function setupFilterWindowEvent() {
  let openBtn = document.getElementById("filter-btn");
  let closeBtn = document.getElementById("close-btn-filter-menu");
  openBtn.addEventListener("click", openFilterMenu, false);
  closeBtn.addEventListener("click", closeFilterMenu, false);
}

function openFilterMenu() {
  let panel = document.getElementById("search-filter-menu");
  panel.style.display = "inline-block";
}

function closeFilterMenu() {
  let panel = document.getElementById("search-filter-menu");
  panel.style.display = "none";
}

// sends AJAX query and lists all books on the page, given a search query and filter object
function getBooks(search, filter) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      // DEBUG COMMENT: dit is het stuk waar de AJAX request succesvol beantwoord is. Voor nu heb
      //  ik debug code neergezet zodat je kan zien wat het antwoord is van de server op het request.
      let ajaxData = JSON.parse(this.responseText);

      alert("Nr of books: " + ajaxData.nrBooks);
      alert("First book to show: " + ajaxData.books[0]);

      showBooks(ajaxData.books);
    }
  };
  xhttp.open("POST", "ajax/books", false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("search=" + search + "&filter=" + JSON.stringify(filter) + "&index=1");
}

function showBooks(books) {
  // DEBUG COMMENT: functie die een lijst boeken krijgt en deze in een loop parset naar HTML code
  // In de book data staat ook de rowID. Deze hoef je niet te gebruiken voor visualisatie, maar kan gebruikt worden in de router.
  // Bijv. Harry Potter heeft rowid=1. Als we hier op klikken, stuurt de client dus een request voor info.html/bookID=1 .
  // De router kan dan uitzoeken dat de client Harry Potter wil zien en dit doorsturen.
}