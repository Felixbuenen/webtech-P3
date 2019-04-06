window.addEventListener("load", setup, false);

function setup() {
    let loginform = document.getElementById("login-form");

    loginform.addEventListener("submit", (event) => { event.preventDefault(); processSubmit(event); }, false);
}

function processSubmit(event) {

    let loginform = document.getElementById("login-form");
    let email = loginform.elements[0];
    let password = loginform.elements[1];

    makeAjaxRequest(event, email, password);
}

function makeAjaxRequest(event, email, password) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let error = JSON.parse(this.responseText);
        if(!error.errorMsg) {
          window.location.href = location.protocol + '//' + location.host;
          return;
        }
        else {
            printResponseMessage(error.errorMsg);
            return;
        }
      }
  
    };

    xhttp.open("POST", "ajax/login", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("email=" + email.value + "&password=" + password.value);
}

function printResponseMessage(message) {
    let msgText = document.getElementById("response-message");
    msgText.innerHTML = message;
}