let filters = {
  maxPrice: 0,
  genre: [],
  publisher: []
}
window.addEventListener("load", setupPage, false);

// NOTE: tightly coupled with CSS
window.matchMedia("(min-width: 992px)").addListener(setFilterMenu)

// correctly displays filter menu based on screen size
function setFilterMenu(mediaQuery) {
  if(mediaQuery.matches) {
    let panel = document.getElementById("search-filter-menu");
    panel.style.display = "block";
    alert("big screen");
  }
  
  else {
    alert("small screen");
    closeFilterMenu();
  }
}

// sets up all events and displays the correct books
function setupPage() {
  setupFilterWindowEvent();

  // filter change events
  setupFilterChangeEvent();
  
  // get all books (no filters by default)
  getBooks({ /* "filters":["authors", "books"] */ });
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

function setupFilterChangeEvent() {
  let filterElements = document.getElementsByClassName("search-filter-menu__content__filter");
  let priceFilterSection = filterElements[0];
  let genreFilterSection = filterElements[1];
  let publisherFilterSection = filterElements[2];

  priceFilterSection.addEventListener("change", (event) => {
    filters.maxPrice = event.target.value;
    getBooks({});
  })
  genreFilterSection.addEventListener("change", (event) => {
    applyFilterListChange(filters.genre, event.target);
    getBooks({});
  })
  publisherFilterSection.addEventListener("change", (event) => {
    applyFilterListChange(filters.publisher, event.target);
    getBooks({});
  })
}

// checks if filter is already in list and acts accordingly
function applyFilterListChange(list, radioButton) {
  if(radioButton.checked) {
    // filter already in list, remove it
    list.push(radioButton.value);
  }
  else {
    // filter not in list, add it
    list.splice(list.indexOf(radioButton.value), 1);    
  }
}

// sends AJAX query and lists all books on the page, given a search query and filter object
function getBooks(searchMethod) {
  deleteAllBooks();

  // get search query
  let linkQuery = new URLSearchParams(window.location.search);
  let search = linkQuery.get("search");

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let ajaxData = JSON.parse(this.responseText);
      alert(ajaxData.showBooks);
      // no results
      if(ajaxData.showBooks.length == 0) {
        showNoResults(search);
        return;
      }

      showBooks(ajaxData.showBooks, ajaxData.showAuthors);
    }
  };

  xhttp.open("POST", "ajax/books", false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("search=" + search + "&searchMethod=" + JSON.stringify(searchMethod) + "&filters=" + JSON.stringify(filters) + "&index=1");
}

function showBooks(books, authors) {
  let bookItem = document.getElementsByClassName("book-item")[0];
  let bookResults = document.getElementById("book-results-main");

  // first book HTML elements doesn't have to be cloned
  createBookItem(bookItem, bookResults, books[0], authors[0]);
  
  for(let i = 1; i < books.length; i++) {
      let newBookItem = bookItem.cloneNode(true);
      createBookItem(newBookItem, bookResults, books[i], authors[i]);
  }
}

// create HTML for book item
function createBookItem(element, parent, book, author) {
    
    let imgElement = element.getElementsByTagName("img")[0];
    let authorName = element.getElementsByTagName("h1")[0];
    let titleElement = element.getElementsByTagName("h2")[0];
    let ratingElement = element.getElementsByClassName("star-rating")[0];
    let priceElement = element.getElementsByClassName("book-item__price")[0];
    
    imgElement.src = book.image;
    authorName.innerHTML = author.firstName + " " + author.lastName;
    titleElement.innerHTML = book.title;
    priceElement.innerHTML = "€" + book.price;

    let star = ratingElement.getElementsByClassName("fa fa-star checked")[0];
    let emElement = ratingElement.getElementsByTagName("em")[0];
    
    // correctly display the ratings of books
    if(book.nrRatings > 0) {
      emElement.innerHTML = book.rating + " (" + book.nrRatings + " ratings)";
    }
    else {
      ratingElement.appendChild(emElement);
      emElement.innerHTML = "No ratings";
      star.style.display = "none";
    }

    element.addEventListener("click", () => {window.location = "./info.html?bookID=" + book.rowid});

    parent.appendChild(element);
}

// refreshes the screen
function deleteAllBooks() {
  let bookItems = document.getElementsByClassName("book-item");
  
  // delete all books except the first (keep as a template)
  for(let i = bookItems.length - 1; i >= 1; i--) {
    bookItems[i].remove();
  }

  alert(document.getElementsByClassName("book-item").length);
}

function showNoResults(query) {
  let bookSection = document.getElementById("book-results-main");
  let header = bookSection.getElementsByTagName("h1")[0];
  let subheader = bookSection.getElementsByTagName("h2")[0];

  header.innerHTML = "No results found for:";
  subheader.innerHTML = query;

  // hide template book
  let bookTemplate = bookSection.getElementsByClassName("book-item")[0];
  bookTemplate.style.display = "none";

  // hide filter button
  let filterButton = document.getElementById("filter-btn");
  filterButton.style.display = "none";
}
