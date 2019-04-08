window.addEventListener("load", setup, false);

function setup() {
    let buyBtn = document.getElementById("buy-btn");
    let reviewForm = document.getElementById("write-review-form");

    reviewForm.addEventListener("submit", event => handleSendReview(event, reviewForm), false);
    buyBtn.addEventListener("click", handleBuy, false);
    
    let reviewStarsArray = document.getElementById("write-review-stars").getElementsByTagName("span");
    for(let i = 0; i < reviewStarsArray.length; i++) {
        reviewStarsArray[i].onclick = function() { selectReviewStars(i) };
    }
}

function handleBuy() {
    let bookTitle = document.getElementById("book-header-info").getElementsByTagName("span")[0].innerHTML;
    let confirmed = confirm("Are you sure you want to buy " + bookTitle + "?");

    if(confirmed) {
        // get book id and send ajax request
        let ID = window.location.search.replace(/^.*?\=/, '');
        sendPurchaseRequest(bookTitle, ID);
    }
}

function handleSendReview(event, form) {
  event.preventDefault();
  let ID = window.location.search.replace(/^.*?\=/, '');

  let inputs = form.elements;
  let title = inputs['title'];
  let content = inputs['content'];
  let anonymous = inputs['anon'];

  sendReview(ID, title, content, anonymous);
}

function sendPurchaseRequest(bookTitle, bookID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let buyButton = document.getElementById("buy-btn");
        buyButton.innerHTML = "Purchased";
        
        let responseMsg = document.getElementById("buy-response-msg");
        responseMsg.innerHTML = "You just bought " + bookTitle + ". Have fun reading!";
      }
    };

    xhttp.open("POST", "ajax/purchase", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("bookID=" + bookID);
}

function sendReview(bookID, reviewTitle, content, anonymous) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let msg = document.getElementById("successful-review-submit");
      msg.innerHTML = "Your review was processed! You may have to refresh your browser to see your review on the webpage.";
      msg.style.color = "green";
    }
  };

  xhttp.open("POST", "ajax/review", false);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("bookID=" + bookID + "&title=" + reviewTitle + "&content=" + content + "&anonymous=" + anonymous);

}
function selectReviewStars(rating) {
    let reviewStarsArray = document.getElementById("write-review-stars").getElementsByTagName("span");
    for(let i = 0; i <= rating; i++) {
        reviewStarsArray[i].className = "fa fa-star checked";
    }
    for(let i = rating + 1; i < 5; i++) {
        reviewStarsArray[i].className = "fa fa-star";
    }
}