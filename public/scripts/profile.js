window.addEventListener("load", setup, false);

function setup() {

    let purchaseContainer = document.getElementById("user-purchase-container");
    let userPurchaseElement = document.getElementsByClassName("user-profile-container__purchase")[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          //alert(JSON.parse(this.responseText).data);
          let bookData = JSON.parse(this.responseText);
          let newElement = userPurchaseElement.cloneNode(true);
          createPurchaseElement(newElement, purchaseContainer, bookData);   
      }
    };
    xhttp.open("POST", "ajax/profileData", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('data=dit is wat je moet zien');
}

function createPurchaseElement(element, parent, data) {
    // find HTML elements and set data
    let titleElement = element.getElementsByTagName("H3")[0];
    titleElement.innerHTML = data.title;

    let dateElement = element.getElementsByTagName("H4")[0];
    dateElement.innerHTML = data.date;

    parent.appendChild(element);
}