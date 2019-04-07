window.addEventListener("load", setupPage, false);

function setupPage() {
  setupFilterWindowEvent();

  // get search query
  let linkQuery = new URLSearchParams(window.location.search);
  let bookQuery = linkQuery.get("search");

  let searchQueryDisplay = document.getElementById("search-query");
  if(linkQuery == "") {
      searchQueryDisplay.innerHTML = "Everything";
  } else {
      searchQueryDisplay.innerHTML = "'" + linkQuery + "'";
  }
  
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

      //alert("ajaxData: " + ajaxData);
      alert("Nr of books: " + ajaxData.nrBooks);
      alert("First book to show: " + ajaxData.showBooks[0].title); // dit werkt
      alert("Array length: " + ajaxData.showBooks.length);
      
      showBooks(ajaxData.showBooks);
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
  
  let bookItem = document.getElementsByClassName("book-item")[0];
  let bookResults = document.getElementById("book-results-main");

  // first one doesn't have to be cloned
  createBookItem(bookItem, bookResults, books[0]);
  
  for(let i = 1; i < books.length; i++) {
      let newBookItem = bookItem.cloneNode(true);
      createBookItem(newBookItem, bookResults, books[i]);
  }
}

function createBookItem(element, parent, book) {
    
    let imgElement = element.getElementsByTagName("img")[0];
    let authorName = element.getElementsByTagName("h1")[0];
    let titleElement = element.getElementsByTagName("h2")[0];
    let ratingElement = element.getElementsByClassName("book-item__rating")[0];
    let priceElement = element.getElementsByClassName("book-item__price")[0];
    
    imgElement.src = book.image;
    authorName.innerHTML = book.authorID;
    titleElement.innerHTML = book.title;
    priceElement.innerHTML = "€" + book.price;
    
    //Declare rating display
    if(book.nrRatings <= 0) {
        ratingElement.innerHTML = "This book has not yet been rated."
    } else {
        ratingElement.innerHTML = book.rating + " out of 5 stars (from " + book.nrRatings + " ratings)"
    }
    
    parent.appendChild(element);
}
