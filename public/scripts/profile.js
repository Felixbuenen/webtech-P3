window.addEventListener("load", setup, false);

function setup() {
  let purchaseContainer = document.getElementById("user-purchase-container");
  let userPurchaseElement = document.getElementsByClassName(
    "user-profile-container__purchase"
  )[0];

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let bookData = JSON.parse(this.responseText);
      if(!bookData.nrItems) {
        createNoPurchasesHTML();

        return;
      }
      else {
        alert(bookData.nrItems);
        // set purchase HTML data
        let title = document.getElementById("user-purchases-title");
        title.innerHTML = "Your purchases (" + bookData.nrItems + ")";

        createPurchaseElement(userPurchaseElement, purchaseContainer, bookData.books[0])

        // create copies for remaining purchases info
        for (let i = 1; i < bookData.nrItems; i++) {
        let newElement = userPurchaseElement.cloneNode(true);
        createPurchaseElement(newElement, purchaseContainer, bookData.books[i]);
        }
    }
    }

  };
  xhttp.open("POST", "ajax/profileData", false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("data=dit is wat je moet zien");
}

function createPurchaseElement(element, parent, book) {
  // find HTML elements and set data
  let titleElement = element.getElementsByTagName("H3")[0];
  titleElement.innerHTML = book.title;

  let dateElement = element.getElementsByTagName("H4")[0];
  dateElement.innerHTML = "Purchased on: " + book.date;

  let imgElement = element.getElementsByTagName("img")[0];
  imgElement.src = book.image;
  //alert(imgElement.href);

  parent.appendChild(element);
}

function createNoPurchasesHTML() {
    let title = document.getElementById("user-purchases-title");
    title.innerHTML = "Your purchases (0)";
    let subtext = document.createElement("p");
    let subtextText = document.createTextNode("You currently have no purchases.");
    subtext.appendChild(subtextText);
    title.appendChild(subtext);

    // hide purchases section
    let purchasesSection = document.getElementById("user-purchase-container");
    purchasesSection.style.display = "none";
}