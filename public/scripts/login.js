/**
 * This JS file is sent to the client if no session (login) exist. It contains the logic that is used
 * for when the user presses 'submit' in the login form. It checks - through an AJAX request - if the credentials are
 * correct, and if they are, redirect the user back to the login screen.
 */

window.addEventListener("load", setup, false);

function setup() {
    let loginform = document.getElementById("login-form");

    // add the submit event listener (prevent default submit action)
    loginform.addEventListener("submit", (event) => { event.preventDefault(); processSubmit(event); }, false);
}

function processSubmit(event) {

    // find HTML form elements
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
          window.location.reload();
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

// called when login went wrong and displays the error message
function printResponseMessage(message) {
    let msgText = document.getElementById("response-message");
    msgText.innerHTML = message;
}