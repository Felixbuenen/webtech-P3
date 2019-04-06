window.addEventListener("load", setup, false);

function setup() {
    let buyBtn = document.getElementById("buy-btn");

    buyBtn.addEventListener("click", handleBuy, false);
}

function handleBuy() {
    let confirmed = confirm("Are you sure you want to buy harry potter?");

    if(confirmed) {
        sendAjaxRequest();
    }
}

function sendAjaxRequest() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let responseMsg = document.getElementById("buy-response-msg");
        responseMsg.innerHTML = "You just bought Harry Potter. Have fun reading!";
      }
    };

    xhttp.open("POST", "ajax/purchase", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // DEBUG ID: THIS SHOULD COME FROM THE CURRENT BOOK DATA
    xhttp.send("bookID=" + 1);
}